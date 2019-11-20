const User = require("../models/userModel");
const Child = require("../models/childAccountModel");
const AppError = require("../utils/AppError");

const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users
    }
  });
});

exports.getAllChildren = catchAsync(async (req, res, next) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  const children = user.children;
  res.status(200).json({
    status: "success",
    data: {
      children
    }
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  // check for empty submission
  if (!req.body.name && !req.body.photo && !req.body.email) {
    return next(new AppError("No input recieved", 400));
  }
  // 1) get the user if exists
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return next(
      new AppError("Unable to find your account. Please log in again", 404)
    );
  }

  // 2) Update info
  if (req.body.email) {
    // validate email without validating the rest of the user
    if (!validateEmail(req.body.email)) {
      return next(new AppError("Must enter a valid email", 400));
    }

    user.email = req.body.email;
  }
  if (req.body.name) {
    if (req.body.name.trim() === "") {
      return next(new AppError("Name cannot be blank", 400));
    }
    user.name = req.body.name;
  }

  if (req.body.photo) {
    if (req.body.photo.trim() === "") {
      return next(new AppError("Photo cannot be blank", 400));
    }
    user.photo = req.body.photo;
  }

  // 3) Save user and respond
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: {
      user
    }
  });
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  // 1) get the user if exists
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return next(
      new AppError("Unable to find your account. Please log in again", 404)
    );
  }

  // 2) delete all children for user
  if (user.children.length !== 0) {
    const res = await Child.deleteMany({ parent: user._id });
  }

  // 3) delete account
  await User.deleteOne({ email: req.user.email });

  res.status(200).json({
    status: "success",
    message: "User successfull deleted"
  });
});

exports.getChild = catchAsync(async (req, res, next) => {
  const child = await Child.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      child
    }
  });
});
exports.updateChild = catchAsync(async (req, res, next) => {
  // checks for empty inputs
  if (!req.body.name && !req.body.photo) {
    return next(new AppError("No update information given", 400));
  }

  // make sure user is logged in
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return next(
      new AppError("Could not find account. Please log in again", 400)
    );
  }

  // update child account
  const child = await Child.findById(req.params.id);
  if (req.body.name) {
    child.name = req.body.name;
  }
  if (req.body.photo) {
    child.photo = req.body.photo;
  }
  const updatedChild = await child.save({ validateBeforeSave: false });

  // update parents children array
  foundChild = {
    id: updatedChild._id,
    name: updatedChild.name,
    photo: updatedChild.photo
  };

  const newChildren = user.children.map(el => {
    if (el.id.toString() === req.params.id) {
      el = foundChild;
    }
    return el;
  });

  user.children = newChildren;
  await user.save({ validateBeforeSave: false });

  // respond with new child account
  res.status(200).json({
    status: "success",
    data: {
      parent: user,
      child: updatedChild
    }
  });
});
exports.deleteChild = catchAsync(async (req, res, next) => {
  // make sure user is logged in
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return next(
      new AppError("Could not find account. Please log in again", 400)
    );
  }

  // finds child and deletes account
  const child = await Child.findByIdAndDelete(req.params.id);
  if (!child) {
    return next(new AppError("Coudn't find child", 404));
  }

  // removes child from parents children array
  const newChildren = user.children.filter(el => {
    return el.id.toString() !== req.params.id;
  });
  user.children = newChildren;
  const updatedUser = await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Child was deleted",
    user: updatedUser
  });
});

exports.updateBalance = catchAsync(async (req, res, next) => {
  if (!req.body.balance && req.body.balance !== 0) {
    return next(new AppError("Must enter a balance", 400));
  }
  if (typeof req.body.balance !== "number") {
    return next(new AppError("Must enter a number", 400));
  }
  const child = await Child.findById(req.params.id);
  if (!child) {
    return next(new AppError("Couldn't find child accont", 404));
  }
  child.balance = req.body.balance;
  await child.save();
  res.status(200).json({
    status: "success",
    data: {
      child
    }
  });
});

const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

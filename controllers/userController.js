const User = require("../models/userModel");
const Child = require("../models/childAccountModel");
const AppError = require("../utils/AppError");

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users
    }
  });
};

exports.getAllChildren = async (req, res, next) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email });
    const children = user.children;
    res.status(200).json({
      status: "success",
      data: {
        children
      }
    });
  } catch (err) {
    next(new AppError("Couldn't get all children", 404));
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    // 1) get the user if exists
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return next(
        new AppError("Unable to find your account. Please log in again", 404)
      );
    }

    // 2) Update info
    user.email = req.body.eamil;
    user.name = req.body.name;
    user.photo = req.body.photo;

    // 3) Save user and respond
    await user.save();
    res.status(200).json({
      status: "success",
      data: {
        user
      }
    });
  } catch (err) {
    next(new AppError(`Unable to update account. Message: ${err}`, 400));
  }
};

exports.getChild = async (req, res, next) => {
  try {
    const child = await Child.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        child
      }
    });
  } catch (err) {
    next(new AppError("Coudn't find child", 404));
  }
};
exports.updateChild = async (req, res, next) => {
  try {
    const child = await Child.findById(req.params.id);
    if (req.body.name) {
      child.name = req.body.name;
    }
    if (req.body.photo) {
      child.photo = req.body.photo;
    }
    const updatedChild = await child.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      data: {
        child: updatedChild
      }
    });
  } catch (err) {
    next(new AppError("Coudn't find child", 404));
  }
};
exports.deleteChild = async (req, res, next) => {
  try {
    const child = await Child.findByIdAndDelete(req.params.id);
    if (!child) {
      return next(new AppError("Coudn't find child", 404));
    }
    const { email } = req.user;
    const user = await User.findOne({ email });
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
  } catch (err) {
    next(new AppError("Coudn't find child", 404));
  }
};

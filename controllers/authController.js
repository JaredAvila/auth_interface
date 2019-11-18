const User = require("../models/userModel");
const Child = require("../models/childAccountModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { promisify } = require("util");

exports.protect = async (req, res, next) => {
  // 1) get token and check that it exists
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in. Please login to continue.", 401)
    );
  }

  // 2) validate token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3) check if user still exists
  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    return next(new AppError("This user no longer exists", 401));
  }

  // 4) check if user changed passwords since token was issued
  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new AppError("User recently changed password. Please log in again", 401)
    );
  }
  req.user = currentUser;
  next();
};

exports.register = async (req, res, next) => {
  try {
    // 1) create new user from form data
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role,
      photo: req.body.photo
    });

    // 2.) create and sign token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    // 3.) send back token
    res.status(200).json({
      status: "success",
      token
    });

    // catch errors and send 400 error
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.passwordCheck(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    res.status(200).json({
      status: "success",
      token
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "something went wrong",
      error: err
    });
  }
};

exports.registerChild = async (req, res, next) => {
  try {
    // create new child account from form data
    const childAccount = await Child.create({
      name: req.body.name,
      photo: req.body.photo,
      parent: req.user.email
    });

    const updatedParent = req.user;
    updatedParent.children.push(childAccount._id);
    await updatedParent.save({ validateBeforeSave: false });

    // send back token and user data
    res.status(200).json({
      status: "success",
      token,
      data: {
        parent: updatedParent,
        child: childAccount
      }
    });

    // catch errors and send 400 error
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err
    });
  }
};

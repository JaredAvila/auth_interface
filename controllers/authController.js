const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { promisify } = require("util");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const catchAsync = require("../utils/catchAsync");

exports.protect = catchAsync(async (req, res, next) => {
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
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.register = catchAsync(async (req, res, next) => {
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
  res.status(201).json({
    status: "success",
    token
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.passwordCheck(password, user.password))) {
    return next(new AppError("Incorrect email or password", 400));
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  res.status(200).json({
    status: "success",
    token
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email", 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Someone, hopefully you, requested to reset your password. Go to this URL to update your password: \n ${resetURL} \nIf you didn't request this, then just ignore this email. URL will expire in ten minues`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset request",
      message
    });
    res.status(200).json({
      status: "success",
      message: "Email has been sent to reset password"
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Please try again later",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError("Token is invalid", 400));
  }
  user.password = req.body.password;
  user.password2 = req.body.password2;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(200).json({
    status: "success",
    token
  });
});

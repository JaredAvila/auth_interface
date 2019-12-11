const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { promisify } = require("util");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const catchAsync = require("../utils/catchAsync");

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
  });
};

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
    passwordChangedAt: req.body.passwordChangedAt
  });

  // 2.) create and sign token the respond
  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) make sure email and pass exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 2) make sure user exists and pass is correct
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.passwordCheck(password, user.password))) {
    return next(new AppError("Incorrect email or password", 400));
  }

  // 3) create token and respond
  createAndSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email", 404));
  }

  // 2) generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send as an email
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
  // 1) get user
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) if token has not exp and there is a user set the new pass
  if (!user) {
    return next(new AppError("Token is invalid", 400));
  }
  user.password = req.body.password;
  user.password2 = req.body.password2;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) create token and send response
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) get user with password
  const user = await User.findById(req.user.id).select("+password");

  // 2) check if posted pass is correct
  if (!user || !(await user.passwordCheck(req.body.password, user.password))) {
    return next(new AppError("Please enter correct password", 401));
  }

  // 3) update pass
  user.password = req.body.password;
  user.password2 = req.body.password2;
  await user.save();

  // 4) login user
  createAndSendToken(user, 200, res);
});

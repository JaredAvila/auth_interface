const User = require("../models/userModel");
const Child = require("../models/childAccountModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { promisify } = require("util");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

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
      parent: req.user._id
    });

    const updatedParent = await User.findOne({ email: req.user.email });
    updatedParent.children.push({
      id: childAccount._id,
      name: childAccount.name,
      photo: childAccount.photo
    });
    await updatedParent.save({ validateBeforeSave: false });

    // send back token and user data
    res.status(200).json({
      status: "success",
      data: {
        parent: updatedParent,
        child: childAccount
      }
    });

    // catch errors and send 400 error
  } catch (err) {
    next(new AppError(err, 400));
  }
};

exports.forgotPassword = async (req, res, next) => {
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
};

exports.resetPassword = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(new AppError(err, 400));
  }
};

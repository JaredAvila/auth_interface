const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const AppError = require("../utils/AppError");

const router = express.Router();

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err
    });
  }
};

const register = async (req, res, next) => {
  try {
    // create new user from form data
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role,
      photo: req.body.photo
    });

    // create and sign token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    // send back token and user data
    res.status(200).json({
      status: "success",
      token,
      data: {
        newUser
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

const registerChild = async (req, res, next) => {
  try {
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
    if(!currentUser){
        return next(new AppError('This user no longer exists', 401));
    }

    // 4) check if user changed passwords since token was issued
    

    // create new child account from form data
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role,
      photo: req.body.photo
    });

    // create and sign token
    // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    //   expiresIn: process.env.JWT_EXPIRES_IN
    // });

    // send back token and user data
    res.status(200).json({
      status: "success",
      token,
      data: {
        newUser
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

// router.route("/login").post(juvicountController.login);
router.route("/register").post(register);

router.route("/").get(getAllUsers);

module.exports = router;

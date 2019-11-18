const express = require("express");
const User = require("../models/userModel");

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
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role,
      photo: req.body.photo
    });

    const token = null;
    res.status(200).json({
      status: "success",
      token,
      data: {
        newUser
      }
    });
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

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

router.route("/login").post(juvicountController.login);
router.route("/register").post(juvicountController.register);

router.route("/").get(getAllUsers);

module.exports = router;

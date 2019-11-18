const express = require("express");

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/login").post(authController.login);
router.route("/register").post(authController.register);
router
  .route("/registerChild")
  .post(authController.protect, authController.registerChild);

router.route("/").get(userController.getAllUsers);

module.exports = router;

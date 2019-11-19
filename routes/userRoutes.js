const express = require("express");

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/login").post(authController.login);
router.route("/register").post(authController.register);
router.route("/forgotPassword").post(authController.forgotPassword);

router.route("/").get(userController.getAllUsers);

router
  .route("/children")
  .get(authController.protect, userController.getAllChildren)
  .post(authController.protect, authController.registerChild);

router
  .route("/child/:id")
  .get(authController.protect, userController.getChild)
  .patch(authController.protect, userController.updateChild)
  .delete(authController.protect, userController.deleteChild);

module.exports = router;

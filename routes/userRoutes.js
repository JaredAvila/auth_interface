const express = require("express");

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/login").post(authController.login);
router.route("/register").post(authController.register);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);

router.route("/").get(userController.getAllUsers);

router
  .route("/user")
  .patch(authController.protect, userController.updateProfile)
  .delete(authController.protect, userController.deleteAccount);

router
  .route("/children")
  .get(authController.protect, userController.getAllChildren)
  .post(authController.protect, authController.registerChild);

router
  .route("/child/:id")
  .get(
    authController.protect,
    authController.confirmParent,
    userController.getChild
  )
  .patch(
    authController.protect,
    authController.confirmParent,
    userController.updateChild
  )
  .delete(
    authController.protect,
    authController.confirmParent,
    userController.deleteChild
  );

module.exports = router;

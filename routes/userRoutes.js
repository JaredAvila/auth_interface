const express = require("express");

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const childController = require("../controllers/childController");

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
  .route("/child")
  .post(
    authController.protect,
    childController.setParent,
    childController.createChild
  );

router
  .route("/child/:id")
  .get(
    authController.protect,
    childController.verifyParent,
    childController.getChild
  )
  .patch(
    authController.protect,
    childController.verifyParent,
    userController.updateChild
  )
  .delete(
    authController.protect,
    childController.verifyParent,
    userController.deleteChild
  );

router
  .route("/child/balance/:id")
  .patch(
    authController.protect,
    childController.verifyParent,
    userController.updateBalance
  );

module.exports = router;

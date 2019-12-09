const express = require("express");

const authController = require("../controllers/authController");
const childController = require("../controllers/childController");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    childController.setParent,
    childController.createChild
  );

router
  .route("/:id")
  .get(
    authController.protect,
    childController.verifyParent,
    childController.getChild
  )
  .patch(
    authController.protect,
    childController.verifyParent,
    childController.updatedChild
  )
  .delete(
    authController.protect,
    childController.verifyParent,
    childController.deleteChild
  );

module.exports = router;

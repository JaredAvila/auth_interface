const express = require("express");

const authController = require("../controllers/authController");
const itemController = require("../controllers/itemController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, itemController.getAllItems)
  .post(authController.protect, itemController.createItem);

router
  .route("/:id")
  .get(
    authController.protect,
    itemController.verifyUserItem,
    itemController.getItem
  )
  .patch(
    authController.protect,
    itemController.verifyUserItem,
    itemController.updateItem
  )
  .delete(
    authController.protect,
    itemController.verifyUserItem,
    itemController.deleteItem
  );

module.exports = router;

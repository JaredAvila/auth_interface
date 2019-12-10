const express = require("express");

const authController = require("../controllers/authController");
const itemController = require("../controllers/itemController");

const router = express.Router({ mergeParams: true });

router.use(
  authController.protect,
  authController.restrictTo("admin", "parent")
);
router
  .route("/")
  .get(authController.restrictTo("admin"), itemController.getAllItems)
  .post(itemController.setChildUserIds, itemController.createItem);

router
  .route("/:id")
  .get(itemController.verifyUser, itemController.getItem)
  .patch(itemController.verifyUser, itemController.updateItem)
  .delete(itemController.verifyUser, itemController.deleteItem);

module.exports = router;

const express = require("express");

const authController = require("../controllers/authController");
const itemController = require("../controllers/itemController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, itemController.getAllItems)
  .post(authController.protect, itemController.createItem);

router.route("/:id").get(authController.protect, itemController.getItem);

module.exports = router;

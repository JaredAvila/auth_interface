const express = require("express");

const authController = require("../controllers/authController");
const itemController = require("../controllers/itemController");

const router = express.Router();

router
  .route("/")
  .get(itemController.getAllItems)
  .post(authController.protect, itemController.createItem);

module.exports = router;

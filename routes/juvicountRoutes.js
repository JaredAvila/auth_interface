const express = require("express");
const juvicountController = require("./../controllers/juvicountController");

const router = express.Router();

router.route("/").post(juvicountController.login);

module.exports = router;

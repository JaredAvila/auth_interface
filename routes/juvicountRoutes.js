const express = require("express");
const juvicountController = require("./../controllers/juvicountController");

const router = express.Router();

router.route("/login").post(juvicountController.login);
router.route("/register").post(juvicountController.register);

module.exports = router;

const express = require("express");

const router = express.Router();

router.route("/login").post(juvicountController.login);
router.route("/register").post(juvicountController.register);

module.exports = router;

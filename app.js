const express = require("express");

const juvicountRouter = require("./routes/juvicountRoutes");

const app = express();

app.use(express.json());

app.use("/api/v1/juvicount", juvicountRouter);

module.exports = app;

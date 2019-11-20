const express = require("express");

const errorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const itemRouter = require("./routes/itemRoutes");

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/items", itemRouter);

app.use(errorHandler);

module.exports = app;

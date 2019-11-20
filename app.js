const express = require("express");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/AppError");

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

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

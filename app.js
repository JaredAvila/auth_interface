const express = require("express");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/AppError");

const userRouter = require("./routes/userRoutes");
const itemRouter = require("./routes/itemRoutes");
const childRouter = require("./routes/childRoutes");

const app = express();

// GLOBAL MIDDLEWARE

// Set security HTTP headers
app.use(helmet());

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in one hour"
});
app.use("/api", limiter);

// Body parser, reading data into body
app.use(express.json({ limit: "10kb" }));

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use("/api/v1/user", userRouter);
app.use("/api/v1/item", itemRouter);
app.use("/api/v1/child", childRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

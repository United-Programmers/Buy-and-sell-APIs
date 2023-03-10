const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");

/**
 * routers
 */
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const messageRouter = require("./routes/messageRoutes");
const chatRouter = require("./routes/chatRoute");
const reviewRouter = require("./routes/reviewRoutes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/adminRoutes");
const driverRouter = require("./routes/driverRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const { adminRoleGuard } = require("./middlewares/guards/adminRoleGuard");
const { driverRoleGuard } = require("./middlewares/guards/driverRoleGuard");
const { protect } = require("./controllers/authController");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(helmet({ contentSecurityPolicy: false }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use(mongoSanitize());
app.use(xss());
app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(cors());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRoleGuard, adminRouter);
app.use("/api/v1/driver", protect, driverRoleGuard, driverRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

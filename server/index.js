import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import morgan from "morgan"; // show the API endpoints
import cors from "cors"; // allow cross origin requests
import cookieSession from "cookie-session"; // for implementing cookie sessions for passport
import path from "path";
import helmet from "helmet";
import { CronJob } from "cron";
// import getParentWithCountPay from "./utils/getParentWithCountPay.js";

// middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import { checkUnpayUser, deleteUserNotKYC } from "./cronJob/index.js";

const app = express();

// use morgan in development mode
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// connect to the mongoDB database
connectDB();

app.use(express.json()); // middleware to use req.body
app.use(cors()); // to avoid CORS errors
app.use(helmet());

// use cookie sessions
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    keys: [process.env.COOKIE_SESSION_KEY],
  })
);

// configure all the routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

app.use(notFound);

// configure a custome error handler middleware
app.use(errorHandler);

const cron1 = new CronJob("00 18 * * *", () => {
  console.log("Check unpay user");
  checkUnpayUser();
});

const cron2 = new CronJob("00 19 * * *", () => {
  console.log("Delete un KYC user");
  deleteUserNotKYC();
});

cron1.start();
cron2.start();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

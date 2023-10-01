import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import morgan from "morgan"; // show the API endpoints
import cors from "cors"; // allow cross origin requests
import cookieSession from "cookie-session"; // for implementing cookie sessions for passport
import helmet from "helmet";
import { CronJob } from "cron";

// middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";

import {
  checkUnpayUser,
  deleteUserNotKYC,
  countChildToData,
  deleteUserNotPay,
  countLayerToData,
} from "./cronJob/index.js";
import {
  transferUserToTree,
  transferLayerToArray,
  getUnknowChild,
  addBuyPackage,
  changeDefaultContinue,
  transferCountChildToArray,
} from "./common.js";
import { findNextUser } from "./utils/methods.js";

const app = express();

// use morgan in development mode
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// connect to the mongoDB database
connectDB();

// await transferCountChildToArray();

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
app.use("/api/package", packageRoutes);

app.use(notFound);

// configure a custome error handler middleware
app.use(errorHandler);

const cron1 = new CronJob("00 18 * * *", () => {
  // 1h
  console.log("Check unpay user");
  checkUnpayUser();
});

const cron2 = new CronJob("30 18 * * *", () => {
  // 1h30
  console.log("Delete un KYC user");
  deleteUserNotKYC();
});

const cron3 = new CronJob("00 19 * * *", () => {
  // 2h
  console.log("Delete user not pay");
  deleteUserNotPay();
});

const cron4 = new CronJob("30 19 * * *", () => {
  // 2h30
  console.log("Count child");
  countChildToData();
});

const cron5 = new CronJob("00 21 * * *", () => {
  // 4h
  console.log("Refresh layer");
  countLayerToData();
});

// cron1.start();
// cron2.start();
// cron3.start();
// cron4.start();
// cron5.start();
// cron6.start();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

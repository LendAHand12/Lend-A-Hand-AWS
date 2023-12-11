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
import walletRoutes from "./routes/walletRoutes.js";
import changeUserRoutes from "./routes/changeUserRoutes.js";

import {
  countChildToData,
  countLayerToData,
  checkBPackage,
  checkCPackage,
  checkAPackage,
  deleteUser24hUnPay,
  resetTransTierUnPay,
  checkBlockChildren,
} from "./cronJob/index.js";
import {
  transferUserToTree,
  transferLayerToArray,
  getUnknowChild,
  addBuyPackage,
  changeDefaultContinue,
  transferCountChildToArray,
  addBuyPackageToTree,
  listTier,
  nextUserWithTier,
  addLockTime,
  addTierTime,
} from "./common.js";

const app = express();

// use morgan in development mode
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// connect to the mongoDB database
connectDB();

// await listTier(2);
// await nextUserWithTier(2);
// await checkUnPayUserOnTierUser(2);
// await addLockTime();
// await addTierTime();

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
app.use("/api/wallet", walletRoutes);
app.use("/api/changeUser", changeUserRoutes);

app.use(notFound);

// configure a custome error handler middleware
app.use(errorHandler);

const cron1 = new CronJob("00 18 * * *", async () => {
  // 1h
  console.log("Delete user start");
  await deleteUser24hUnPay();
  console.log("Delete user done");
});

const cron2 = new CronJob("30 19 * * *", async () => {
  // 1h30
  console.log("Check A Package start");
  await checkAPackage();
  console.log("Check A Package done");
});

const cron3 = new CronJob("00 19 * * *", async () => {
  // 2h
  console.log("Check B Package start");
  await checkBPackage();
  console.log("Check B Package done");
});

const cron4 = new CronJob("00 20 * * *", async () => {
  // 3h
  console.log("Check C Package start");
  await checkCPackage();
  console.log("Check C Package done");
});

const cron5 = new CronJob("00 21 * * *", async () => {
  // 4h
  console.log("Count child start");
  await countChildToData();
  console.log("Count child done");
});

const cron6 = new CronJob("00 22 * * *", async () => {
  // 5h
  console.log("Refresh layer start");
  await countLayerToData();
  console.log("Refresh layer done");
});

const cron7 = new CronJob("00 23 * * *", async () => {
  // 6h
  console.log("Reset trans unpay tier start");
  await resetTransTierUnPay();
  console.log("Reset trans unpay tier done");
});

const cron8 = new CronJob("30 23 * * *", async () => {
  // 6h
  console.log("Check block children start");
  await checkBlockChildren();
  console.log("Check block children done");
});

cron1.start();
cron2.start();
cron3.start();
cron4.start();
cron5.start();
cron6.start();
cron7.start();
cron8.start();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

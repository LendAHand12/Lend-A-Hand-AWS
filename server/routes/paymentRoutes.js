import express from "express";
import {
  getPaymentInfo,
  addPayment,
  onDonePayment,
  getAllPayments,
  getPaymentsOfUser,
} from "../controllers/paymentControllers.js";
import { protectRoute, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/info").get(protectRoute, getPaymentInfo);
router.route("/user").get(protectRoute, isAdmin, getAllPayments);
router
  .route("/")
  .get(protectRoute, getPaymentsOfUser)
  .post(protectRoute, addPayment);
router.route("/done").post(protectRoute, onDonePayment);

export default router;

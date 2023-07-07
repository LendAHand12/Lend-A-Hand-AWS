import express from "express";
import {
  getPaymentInfo,
  addPayment,
  onDonePayment,
  getAllPayments,
  getPaymentsOfUser,
  getPaymentDetail,
  checkCanRefundPayment,
  changeToRefunded,
  onAdminDoneRefund,
  updateHoldPayment,
  updateDirectPayment,
  findUserOtherParentId,
  getParentWithCount,
} from "../controllers/paymentControllers.js";
import { protectRoute, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/getParentWithCount").post(getParentWithCount);
// router.route("/updateHoldPayment").get(updateHoldPayment);
// router.route("/updateDirectPayment").get(updateDirectPayment);
// router.route("/findUserOtherParentId").get(findUserOtherParentId);

router.route("/info").get(protectRoute, getPaymentInfo);
router.route("/user").get(protectRoute, isAdmin, getAllPayments);
router
  .route("/")
  .get(protectRoute, getPaymentsOfUser)
  .post(protectRoute, addPayment);
router.route("/done").post(protectRoute, onDonePayment);

router.route("/:id").get(protectRoute, isAdmin, getPaymentDetail);
router
  .route("/checkCanRefund")
  .post(protectRoute, isAdmin, checkCanRefundPayment);

router.route("/changeToRefunded").post(protectRoute, isAdmin, changeToRefunded);
router
  .route("/onAdminDoneRefund")
  .post(protectRoute, isAdmin, onAdminDoneRefund);

export default router;

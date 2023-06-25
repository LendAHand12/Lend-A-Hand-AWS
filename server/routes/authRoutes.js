import express from "express";
import {
  checkLinkRef,
  authUser,
  getAccessToken,
  registerUser,
  confirmUser,
  mailForEmailVerification,
  mailForPasswordReset,
  resetUserPassword,
  checkSendMail,
  getLinkVerify,
  updateData,
  getNewPass,
} from "../controllers/authControllers.js";

const router = express.Router();

router.route("/ref").post(checkLinkRef);
router.route("/checkSendMail").get(checkSendMail);
router.route("/updateData").get(updateData);
router.route("/getNewPass").get(getNewPass);
router.route("/register").post(registerUser);
router.route("/login").post(authUser);
router.route("/confirm/:token").get(confirmUser);
router.route("/confirm").post(mailForEmailVerification);
router.route("/forgotPassword").post(mailForPasswordReset);
router.route("/resetPassword").put(resetUserPassword);
router.route("/refresh").post(getAccessToken);
router.route("/getLinkVerify").post(getLinkVerify);

export default router;

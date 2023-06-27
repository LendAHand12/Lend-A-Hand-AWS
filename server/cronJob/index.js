import asyncHandler from "express-async-handler";
import moment from "moment";

import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import sendMail from "../utils/sendMail.js";

export const checkUnpayUser = asyncHandler(async () => {
  const listUser = await User.find({
    $and: [{ isAdmin: false }, { status: "APPROVED" }],
  }).select("createdAt countPay fine status email");
  for (let u of listUser) {
    const currentDay = moment(new Date());
    const userCreatedDay = moment(u.createdAt);
    const diffDays = currentDay.diff(userCreatedDay, "days") + 1; // ngày đăng ký đến hôm nay
    const { countPay } = u;
    const countPayWithDays = 7 * (countPay + 1); // số ngày thanh toán theo lần thanh toán
    console.log({ days: countPayWithDays - diffDays });
    if (countPayWithDays - diffDays < -7) {
      u.fine = u.fine + 2;
      u.status = "LOCKED";
      await u.save();
    } else if (countPayWithDays - diffDays < 0) {
      u.fine = u.fine + 2;
      await u.save();
    } else if (countPayWithDays - diffDays === 0) {
      // send mail payment
      sendMail(u._id, u.email, "Payment to not fine");
    }
  }
  //   console.log(listUser.length);
});

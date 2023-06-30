import asyncHandler from "express-async-handler";
import moment from "moment";
import mongoose from "mongoose";

import User from "../models/userModel.js";
import DeleteUser from "../models/deleteUserModel.js";
import sendMail from "../utils/sendMail.js";

const ObjectId = mongoose.Types.ObjectId;

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
});

export const deleteUserNotKYC = asyncHandler(async () => {
  const listUser = await User.find({ status: "UNVERIFY" });

  for (let u of listUser) {
    let parent = await User.findById(u.parentId);
    if (parent) {
      let childs = parent.children;
      let newChilds = childs.filter((item) => {
        if (item.toString() !== u._id.toString()) return item;
      });
      parent.children = [...newChilds];
      await parent.save();

      const userDelete = await DeleteUser.create({
        oldId: u._id,
        email: u.email,
        password: u.password,
        walletAddress: u.walletAddress,
        parentId: u.parentId,
        refId: u.refId,
      });

      await User.deleteOne({ _id: u._id });
    }
  }

  console.log("Remove unveify done");
});

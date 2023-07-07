import asyncHandler from "express-async-handler";
import moment from "moment";

import DeleteUser from "../models/deleteUserModel.js";
import User from "../models/userModel.js";
import sendMail from "../utils/sendMail.js";
import { getCountAllChildren } from "../controllers/userControllers.js";

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
      if (u.fine === 2) {
        u.fine = 4;
      } else if (u.fine === 4) {
        u.fine = 6;
        u.status = "LOCKED";
      }
      await u.save();
    } else if (countPayWithDays - diffDays < 0) {
      if (u.fine === 0) {
        u.fine = 2;
      }
      await u.save();
    } else if (countPayWithDays - diffDays === 0) {
      // send mail payment
      sendMail(u._id, u.email, "Payment to not fine");
    }
  }
});

export const checkIncreaseTier = asyncHandler(async () => {
  const listUser = await User.find({
    $and: [{ isAdmin: false }, { status: "APPROVED" }],
  }).select("createdAt countPay fine status email");
  for (let u of listUser) {
    let nextTier = Math.floor(u.countPay / 12);

    if (nextTier > 0 && u.tier !== nextTier) {
      const currentDay = moment(new Date());
      const userCreatedDay = moment(u.createdAt);
      const diffDays = currentDay.diff(userCreatedDay, "days") + 1;
      if (diffDays > nextTier * 84) {
        const countTotalChild = await getCountAllChildren(u._id);
        if (countTotalChild > 30000 * nextTier) {
          u.tier = nextTier;
          // await u.save();
          console.log({ u });
        }
      } else {
        const countTotalChild = await getCountAllChildren(u._id);
        if (countTotalChild > 797161 * nextTier) {
          u.tier = nextTier;
          console.log({ u });
          // await u.save();
        }
      }
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

export const countChildToData = asyncHandler(async () => {
  const listUser = await User.find({
    $and: [{ isAdmin: false }, { status: "APPROVED" }],
  }).select("children");

  for (let u of listUser) {
    const countChild = await getCountAllChildren(u._id);
    u.countChild = countChild;
    await u.save();
  }

  console.log("updated count Child");
});

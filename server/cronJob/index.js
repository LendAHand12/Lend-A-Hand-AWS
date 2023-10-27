import asyncHandler from "express-async-handler";
import moment from "moment";

import DeleteUser from "../models/deleteUserModel.js";
import User from "../models/userModel.js";
import sendMail from "../utils/sendMail.js";
import { sendMailUpdateLayerForAdmin } from "../utils/sendMailCustom.js";
import { getCountAllChildren } from "../controllers/userControllers.js";
import { findRootLayer } from "../utils/methods.js";
import Tree from "../models/treeModel.js";

export const deleteUser24hUnPay = asyncHandler(async () => {
  const listUser = await User.find({
    $and: [{ tier: 1 }, { countPay: 0 }, { isAdmin: false }],
  });

  for (let u of listUser) {
    const listRefId = await Tree.find({ refId: u._id });
    const tree = await Tree.findOne({ userId: u._id });
    if (listRefId.length === 0) {
      let parent = await Tree.findOne({ userId: tree.parentId });
      if (parent && tree) {
        let childs = parent.children;
        let newChilds = childs.filter((item) => {
          if (item.toString() !== u._id.toString()) return item;
        });
        parent.children = [...newChilds];
        await parent.save();

        const userDelete = await DeleteUser.create({
          userId: u.userId,
          oldId: u._id,
          email: u.email,
          phone: u.phone,
          password: u.password,
          walletAddress: u.walletAddress,
          parentId: tree.parentId,
          refId: tree.refId,
        });

        await User.deleteOne({ _id: u._id });
        await Tree.deleteOne({ userId: u._id });
      }
    }
  }
});

export const checkAPackage = asyncHandler(async () => {
  const currentDay = moment();
  const listUser = await User.find({
    $and: [{ status: "APPROVED" }, { buyPackage: "A" }, { tier: 1 }],
  });

  for (let u of listUser) {
    const diffDays = currentDay.diff(u.createdAt, "days");
    if (diffDays > 30) {
      const weekFine = Math.floor((diffDays - 30) / 7) * 2;
      u.fine = weekFine;

      const listRefId = await Tree.find({ refId: u._id });
      if (listRefId.length < 3) {
        u.errLahCode = "OVER30";
      } else {
        u.errLahCode = "";
      }
    }

    if (u.errLahCode === "OVER30" && diffDays > 60) {
      const listRefId = await Tree.find({ refId: u._id });
      if (listRefId.length < 3) {
        u.errLahCode = "OVER60";
        u.status = "LOCKED";
      } else {
        u.errLahCode = "";
      }
    }
    await u.save();
  }
});

export const checkBPackage = asyncHandler(async () => {
  const currentDay = moment();
  const listUser = await User.find({
    $and: [{ status: "APPROVED" }, { buyPackage: "B" }],
  });

  for (let u of listUser) {
    const diffDays = currentDay.diff(u.createdAt, "days");
    if (diffDays > 30) {
      const weekFine = Math.floor((diffDays - 30) / 7) * 2;
      u.fine = weekFine;

      const listRefId = await Tree.find({ refId: u._id });
      if (listRefId.length < 3) {
        u.errLahCode = "OVER30";
      } else {
        u.errLahCode = "";
      }
    }

    if (u.errLahCode === "OVER30" && diffDays > 60) {
      const listRefId = await Tree.find({ refId: u._id });
      if (listRefId.length < 3) {
        u.errLahCode = "OVER60";
        u.status = "LOCKED";
      } else {
        u.errLahCode = "";
      }
    }
    await u.save();
  }
});

export const checkCPackage = asyncHandler(async () => {
  const listUser = await User.find({
    $and: [{ isAdmin: false }, { status: "APPROVED" }, { buyPackage: "C" }],
  }).select("createdAt countPay fine status email");
  for (let u of listUser) {
    const currentDay = moment(new Date());
    const userCreatedDay = moment(u.createdAt);
    const diffDays = currentDay.diff(userCreatedDay, "days") + 1; // ngày đăng ký đến hôm nay
    const { countPay } = u;
    const countPayWithDays = 7 * (countPay + 1); // số ngày thanh toán theo lần thanh toán
    if (countPayWithDays - diffDays < -7) {
      const listRefId = await Tree.find({ refId: u._id });
      if (u.fine === 2) {
        u.fine = 4;
      } else if (u.fine === 4) {
        // if (listRefId.length === 0) {
        //   let parent = await User.findById(u.parentId);
        //   if (parent) {
        //     let childs = parent.children;
        //     let newChilds = childs.filter((item) => {
        //       if (item.toString() !== u._id.toString()) return item;
        //     });
        //     parent.children = [...newChilds];
        //     await parent.save();

        //     const userDelete = await DeleteUser.create({
        //       userId: u.userId,
        //       oldId: u._id,
        //       email: u.email,
        //       phone: u.phone,
        //       password: u.password,
        //       walletAddress: u.walletAddress,
        //       parentId: u.parentId,
        //       refId: u.refId,
        //     });

        //     await User.deleteOne({ _id: u._id });
        //     await Tree.deleteOne({ userId: u._id });
        //   }
        // } else {
        u.status = "LOCKED";
        // }
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

export const countChildToData = asyncHandler(async () => {
  const listUser = await User.find({
    $and: [{ isAdmin: false }],
  }).select("tier countChild");

  for (let u of listUser) {
    const newCountChild = [...u.countChild];
    for (let i = 1; i <= u.tier; i++) {
      const countChild = await getCountAllChildren(u._id, i);
      newCountChild[i - 1] = countChild;
    }
    u.countChild = newCountChild;
    await u.save();
  }

  console.log("updated count Child");
});

export const countLayerToData = asyncHandler(async () => {
  const listUser = await User.find({
    isAdmin: false,
  });

  const result = [];

  for (let u of listUser) {
    let newLayer = [];
    for (let i = 1; i <= u.tier; i++) {
      const layer = await findRootLayer(u._id, i);
      newLayer.push(layer);
    }

    if (areArraysEqual(newLayer, u.currentLayer)) {
      u.oldLayer = u.currentLayer;
      await u.save();
    } else {
      let isChange = false;
      if (u.oldLayer.length === newLayer.length) {
        isChange = true;
      }
      u.oldLayer = u.currentLayer;
      u.currentLayer = newLayer;
      let updatedUser = await u.save();
      if (isChange) {
        result.push(updatedUser);
      }
    }
  }
  await sendMailUpdateLayerForAdmin(result);
  console.log("updated layer");
});

export const areArraysEqual = (arr1, arr2) => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
};

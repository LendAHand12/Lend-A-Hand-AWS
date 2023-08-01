import asyncHandler from "express-async-handler";
import moment from "moment";

import DeleteUser from "../models/deleteUserModel.js";
import User from "../models/userModel.js";
import sendMail from "../utils/sendMail.js";
import { sendMailUpdateLayerForAdmin } from "../utils/sendMailCustom.js";
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
      const canIncreaseTier = await checkCanIncreaseNextTier(u);
      if (canIncreaseTier) {
        u.tier = nextTier;
        await u.save();
      }
    }
  }
});

export const checkCanIncreaseNextTier = async (u) => {
  let nextTier = Math.floor(u.countPay / 12);

  if (nextTier > 0 && u.tier !== nextTier) {
    const currentDay = moment(new Date());
    const userCreatedDay = moment(u.createdAt);
    const diffDays = currentDay.diff(userCreatedDay, "days") + 1;
    if (diffDays > nextTier * 84) {
      const countTotalChild = await getCountAllChildren(u._id);
      if (countTotalChild > 30000 * nextTier) {
        return true;
      }
    } else {
      const countTotalChild = await getCountAllChildren(u._id);
      if (countTotalChild > 797161 * nextTier) {
        return true;
      }
    }
  }

  return false;
};

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
        userId: u.userId,
        oldId: u._id,
        email: u.email,
        phone: u.phone,
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

export const deleteUserNotPay = asyncHandler(async () => {
  const currentDay = new Date(Date.now() - 24 * 3600 * 1000);
  const listUser = await User.find({
    $and: [
      { status: "APPROVED" },
      { createdAt: { $lt: currentDay } },
      { countPay: 0 },
      { children: { $size: 0 } },
    ],
  });

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
        userId: u.userId,
        oldId: u._id,
        email: u.email,
        phone: u.phone,
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

async function countDescendants(userId, layer) {
  const user = await User.findById(userId);

  if (!user) {
    return 0;
  }

  if (layer === 0) {
    return 1; // Nếu đã đủ 3 cấp dưới thì tính là một node hoàn chỉnh
  }

  let count = 0;

  for (const childId of user.children) {
    const child = await User.findById(childId);
    if (child.countPay !== 0) {
      count += await countDescendants(childId, layer - 1);
    }
  }

  return count;
}

export const findRootLayer = asyncHandler(async (id) => {
  // Tìm người dùng root đầu tiên (có parentId null)
  const root = await User.findById(id);
  if (!root) {
    return 0; // Nếu không tìm thấy root, trả về 0
  }

  let layer = 1;
  let currentLayerCount = 1; // Số lượng node hoàn chỉnh ở tầng hiện tại (ban đầu là 1)

  while (true) {
    const nextLayerCount = currentLayerCount * 3; // Số lượng node hoàn chỉnh trong tầng tiếp theo
    const totalDescendants = await countDescendants(root._id, layer); // Tính tổng số con (bao gồm cả node hoàn chỉnh và node chưa đủ 3 cấp dưới)

    if (totalDescendants < nextLayerCount) {
      break;
    }

    layer++;
    currentLayerCount = nextLayerCount;
  }

  return layer - 1; // Trừ 1 vì layer hiện tại là layer chưa hoàn chỉnh
});

export const countLayerToData = asyncHandler(async () => {
  const listUser = await User.find({
    $and: [{ isAdmin: false }, { status: "APPROVED" }],
  }).select("children userId email oldLayer currentLayer");

  const result = [];

  for (let u of listUser) {
    const layer = await findRootLayer(u._id);
    if (layer !== u.currentLayer) {
      u.oldLayer = u.currentLayer;
      u.currentLayer = layer;
      let updatedUser = await u.save();
      result.push(updatedUser);
    } else {
      u.oldLayer = u.currentLayer;
      await u.save();
    }
  }
  await sendMailUpdateLayerForAdmin(result);
  console.log("updated layer");
});

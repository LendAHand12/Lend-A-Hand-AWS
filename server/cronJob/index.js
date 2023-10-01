import asyncHandler from "express-async-handler";
import moment from "moment";

import DeleteUser from "../models/deleteUserModel.js";
import User from "../models/userModel.js";
import sendMail from "../utils/sendMail.js";
import { sendMailUpdateLayerForAdmin } from "../utils/sendMailCustom.js";
import { getCountAllChildren } from "../controllers/userControllers.js";
import { findNextUser } from "../utils/methods.js";
import Tree from "../models/treeModel.js";

export const checkUnpayUser = asyncHandler(async () => {
  const listUser = await User.find({
    $and: [
      { isAdmin: false },
      { status: "APPROVED" },
      { countPay: { lt: 13 } },
    ],
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
    $and: [
      { isAdmin: false },
      { status: "APPROVED" },
      { fine: 0 },
      {
        $or: [
          { userId: { $ne: "Admin2" } },
          { userId: { $ne: "Admin3" } },
          { userId: { $ne: "Admin4" } },
        ],
      },
    ],
  }).sort({ createdAt: -1 });
  for (let u of listUser) {
    let nextTier = u.tier + 1;
    const canIncreaseTier = await checkCanIncreaseNextTier(u);
    if (canIncreaseTier) {
      const newParentId = await findNextUser(nextTier);
      const newParent = await Tree.findOne({
        userId: newParentId,
        tier: nextTier,
      });
      let childs = newParent.children;
      newParent.children = [...childs, u._id];
      await newParent.save();

      const tree = await Tree.create({
        userName: u.userId,
        userId: u._id,
        parentId: newParentId,
        refId: newParentId,
        tier: nextTier,
        children: [],
      });

      u.tier = nextTier;
      u.countPay = 0;
      // u.oldLayer = u.currentLayer;
      // u.currentLayer = [...u.currentLayer, 0];
      await u.save();
    }
  }
});

export const checkCanIncreaseNextTier = async (u) => {
  try {
    // Kiểm tra điều kiện cho việc nâng cấp tier
    if (u.fine > 0) {
      return false;
    }
    if (u.tier === 1) {
      if (u.buyPackage === "A" || u.buyPackage === "B") {
        if (u.countPay === 13) {
          if (u.currentLayer.slice(-1) >= 4) {
            return true;
          } else if (u.countChild >= 300) {
            const listChildId = await Tree.find({
              parentId: u._id,
              tier: u.tier,
            }).select("userId");

            let highestChildSales = 0;
            let lowestChildSales = Infinity;

            for (const childId of listChildId) {
              const child = await User.findById(childId.userId);

              if (child.countChild > highestChildSales) {
                highestChildSales = child.countChild;
              }

              if (child.countChild < lowestChildSales) {
                lowestChildSales = child.countChild;
              }
            }

            if (
              highestChildSales >= 0.4 * u.countChild &&
              lowestChildSales >= 0.2 * u.countChild
            ) {
              return true;
            }
          }
        }
      } else if (u.buyPackage === "C") {
        if (u.countPay === 13) {
          if (u.currentLayer.slice(-1) >= 5) {
            return true;
          } else if (u.countChild >= 680) {
            const listChildId = await Tree.find({
              parentId: u._id,
              tier: u.tier,
            }).select("userId");

            let highestChildSales = 0;
            let lowestChildSales = Infinity;

            for (const childId of listChildId) {
              const child = await User.findById(childId.userId);

              if (child.countChild > highestChildSales) {
                highestChildSales = child.countChild;
              }

              if (child.countChild < lowestChildSales) {
                lowestChildSales = child.countChild;
              }
            }

            if (
              highestChildSales >= 0.4 * u.countChild &&
              lowestChildSales >= 0.2 * u.countChild
            ) {
              return true;
            }
          }
        }
      }
    } else if (u.tier >= 2) {
      if (u.currentLayer.slice(-1) === 4) {
        return true;
      }
    }
    return false;
  } catch (error) {
    throw new Error("Internal server error");
  }
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
  }).select("tier");

  for (let u of listUser) {
    const countChild = await getCountAllChildren(u._id, u.tier);
    u.countChild = countChild;
    await u.save();
  }

  console.log("updated count Child");
});

async function countDescendants(userId, layer, tier) {
  const tree = await Tree.findOne({ userId, tier });

  if (!tree) {
    return 0;
  }

  if (layer === 0) {
    return 1; // Nếu đã đủ 3 cấp dưới thì tính là một node hoàn chỉnh
  }

  let count = 0;

  for (const childId of tree.children) {
    const child = await User.findById(childId);
    if (child.countPay !== 0) {
      count += await countDescendants(childId, layer - 1, tier);
    }
  }

  return count;
}

export const findRootLayer = asyncHandler(async (id, tier) => {
  // Tìm người dùng root đầu tiên (có parentId null)
  const root = await User.findById(id);
  if (!root) {
    return 0; // Nếu không tìm thấy root, trả về 0
  }

  let layer = 1;
  let currentLayerCount = 1; // Số lượng node hoàn chỉnh ở tầng hiện tại (ban đầu là 1)

  while (true) {
    const nextLayerCount = currentLayerCount * 3; // Số lượng node hoàn chỉnh trong tầng tiếp theo
    const totalDescendants = await countDescendants(root._id, layer, tier); // Tính tổng số con (bao gồm cả node hoàn chỉnh và node chưa đủ 3 cấp dưới)

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
  console.log({ result });
  await sendMailUpdateLayerForAdmin(result);
  console.log("updated layer");
});

const areArraysEqual = (arr1, arr2) => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
};

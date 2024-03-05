import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import Package from "../models/packageModel.js";
import DeleteUser from "../models/deleteUserModel.js";
import ChangeUser from "../models/changeUserModel.js";
import NextUserTier from "../models/nextUserTierModel.js";
import sendMail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Tree from "../models/treeModel.js";
import { getActivePackages } from "./packageControllers.js";
import {
  findNextUser,
  findNextUserNotIncludeNextUserTier,
  findRootLayer,
  findLevelById,
  findUsersAtLevel,
} from "../utils/methods.js";
import generateGravatar from "../utils/generateGravatar.js";
import { areArraysEqual } from "../cronJob/index.js";
import { sendMailUserCanInceaseTierToAdmin } from "../utils/sendMailCustom.js";
import Permission from "../models/permissionModel.js";

dotenv.config();

const getAllUsers = asyncHandler(async (req, res) => {
  const { pageNumber, keyword, status } = req.query;
  const page = Number(pageNumber) || 1;
  const searchStatus = status === "all" ? "" : status;

  const pageSize = 20;

  const count = await User.countDocuments({
    $and: [
      {
        $or: [
          { userId: { $regex: keyword, $options: "i" } }, // Tìm theo userId
          { email: { $regex: keyword, $options: "i" } }, // Tìm theo email
        ],
      },
      {
        role: "user",
      },
      {
        status: { $regex: searchStatus, $options: "i" },
      },
    ],
  });
  const allUsers = await User.find({
    $and: [
      {
        $or: [
          { userId: { $regex: keyword, $options: "i" } }, // Tìm theo userId
          { email: { $regex: keyword, $options: "i" } }, // Tìm theo email
        ],
      },
      {
        role: "user",
      },
      {
        status: { $regex: searchStatus, $options: "i" },
      },
    ],
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort("-createdAt")
    .select("-password");

  res.json({
    users: allUsers,
    pages: Math.ceil(count / pageSize),
  });
});

const getAllUsersWithKeyword = asyncHandler(async (req, res) => {
  const { keyword } = req.body;

  const allUsers = await User.find({
    $and: [
      {
        $or: [
          { userId: { $regex: keyword, $options: "i" } }, // Tìm theo userId
          { email: { $regex: keyword, $options: "i" } }, // Tìm theo email
        ],
      },
      {
        isAdmin: false,
      },
      {
        status: "APPROVED",
      },
    ],
  })
    .sort("-createdAt")
    .select("-password");

  res.json({
    users: allUsers,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    const listDirectUser = [];
    const listRefIdOfUser = await Tree.find({ refId: user._id, tier: 1 });
    if (listRefIdOfUser && listRefIdOfUser.length > 0) {
      for (let refId of listRefIdOfUser) {
        const refedUser = await User.findById(refId.userId).select(
          "userId email walletAddress status countPay tier errLahCode buyPackage"
        );
        listDirectUser.push({
          userId: refedUser.userId,
          isGray:
            refedUser.status === "LOCKED"
              ? req.user.isAdmin
                ? true
                : false
              : false,
          isRed:
            refedUser.tier === 1 && refedUser.countPay === 0
              ? true
              : refedUser.tier === 1 &&
                refedUser.buyPackage === "B" &&
                refedUser.countPay < 7
              ? true
              : refedUser.tier === 1 &&
                refedUser.buyPackage === "A" &&
                refedUser.countPay < 13
              ? true
              : false,
          isYellow: refedUser.errLahCode === "OVER30",
        });
      }
    }
    const listOldParent = [];
    if (user.oldParents && user.oldParents.length > 0) {
      for (let parentId of user.oldParents) {
        const oldParent = await User.findById(parentId).select(
          "userId email walletAddress"
        );
        listOldParent.push(oldParent);
      }
    }
    const changeUser = await ChangeUser.findOne({
      oldUserId: user._id,
      status: "APPROVED",
    }).select("oldUserName oldEmail updatedAt");

    const tree = await Tree.findOne({ userId: user._id, tier: 1 });

    let refUser;
    if (tree && tree.refId) {
      refUser = await User.findById(tree.refId);
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      userId: user.userId,
      isAdmin: user.isAdmin,
      isConfirmed: user.isConfirmed,
      avatar: user.avatar,
      walletAddress: user.walletAddress[0],
      tier: user.tier,
      createdAt: user.createdAt,
      fine: user.fine,
      status: user.status,
      imgFront: user.imgFront,
      imgBack: user.imgBack,
      countPay: user.countPay,
      phone: user.phone,
      idCode: user.idCode,
      buyPackage: user.buyPackage,
      continueWithBuyPackageB: user.continueWithBuyPackageB,
      oldLayer: user.oldLayer,
      currentLayer: user.currentLayer,
      listDirectUser: listDirectUser,
      openLah: user.openLah,
      closeLah: user.closeLah,
      tierDate: user.tierDate,
      note: user.note,
      lockedTime: user.lockedTime,
      deletedTime: user.deletedTime,
      tier1Time: user.tier1Time,
      tier2Time: user.tier2Time,
      tier3Time: user.tier3Time,
      tier4Time: user.tier4Time,
      tier5Time: user.tier5Time,
      hold: user.hold,
      holdLevel: user.holdLevel,
      changeUser,
      refUserName: refUser ? refUser.userId : "",
      refUserEmail: refUser ? refUser.email : "",
      role: user.role,
      listOldParent,
    });
  } else {
    res.status(404);
    throw new Error("User does not exist");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { phone, imgFront, imgBack, idCode, buyPackage } = req.body;
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  const userHavePhone = await User.find({
    $and: [{ phone }, { email: { $ne: user.email } }, { isAdmin: false }],
  });
  const userHaveIdCode = await User.find({
    $and: [{ idCode }, { email: { $ne: user.email } }, { isAdmin: false }],
  });

  if (userHavePhone.length >= 1 || userHaveIdCode.length >= 1) {
    res.status(400).json({ error: "duplicateInfo" });
  }
  if (user) {
    user.phone = phone || user.phone;
    user.idCode = idCode || user.idCode;
    if (buyPackage) {
      const newBuyPackage = await Package.findOne({ name: buyPackage });
      if (newBuyPackage.status === "active") {
        user.buyPackage = buyPackage || user.buyPackage;
        await Tree.findOneAndUpdate(
          { userName: user.userId },
          { buyPackage: buyPackage }
        );
      } else {
        res.status(400).json({ error: "Package has been disabled" });
      }
    }
    if (imgFront && imgBack && imgFront !== "" && imgBack !== "") {
      if (
        imgFront.includes("https://res.cloudinary.com/dhqggkmto") &&
        imgFront.includes("https://res.cloudinary.com/dhqggkmto")
      )
        user.status = "PENDING";
      user.imgFront = imgFront || user.imgFront;
      user.imgBack = imgBack || user.imgBack;
    }
    const updatedUser = await user.save();
    if (updatedUser) {
      const listDirectUser = await User.find({
        refId: user._id,
        tier: 1,
      }).select("userId email walletAddress");
      const packages = await getActivePackages();
      res.status(200).json({
        message: "Update successful",
        data: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          userId: updatedUser.userId,
          isAdmin: updatedUser.isAdmin,
          isConfirmed: updatedUser.isConfirmed,
          avatar: updatedUser.avatar,
          walletAddress: updatedUser.walletAddress[0],
          tier: updatedUser.tier,
          createdAt: updatedUser.createdAt,
          fine: updatedUser.fine,
          status: updatedUser.status,
          imgFront: updatedUser.imgFront,
          imgBack: updatedUser.imgBack,
          countPay: updatedUser.countPay,
          phone: updatedUser.phone,
          idCode: updatedUser.idCode,
          oldLayer: updatedUser.oldLayer,
          currentLayer: updatedUser.currentLayer,
          buyPackage: updatedUser.buyPackage,
          continueWithBuyPackageB: updatedUser.continueWithBuyPackageB,
          listDirectUser,
          packages,
        },
      });
    }
  } else {
    res.status(400).json({ error: "User not found" });
  }
});

const adminUpdateUser = asyncHandler(async (req, res) => {
  const {
    newStatus,
    newFine,
    isRegistered,
    buyPackage,
    openLah,
    closeLah,
    idCode,
    userId,
    phone,
    email,
    imgBack,
    imgFront,
    tier,
    walletAddress,
    note,
    hold,
    holdLevel,
  } = req.body;

  if (userId) {
    const userExistsUserId = await User.findOne({
      userId: { $regex: userId, $options: "i" },
    });
    if (userExistsUserId) {
      let message = "duplicateInfoUserId";
      res.status(400);
      throw new Error(message);
    }
  }

  if (email) {
    const userExistsEmail = await User.findOne({
      email: { $regex: email, $options: "i" },
    });
    if (userExistsEmail) {
      let message = "duplicateInfoEmail";
      res.status(400);
      throw new Error(message);
    }
  }

  if (phone) {
    const userExistsPhone = await User.findOne({
      $and: [{ phone: { $ne: "" } }, { phone }],
    });
    if (userExistsPhone) {
      let message = "Dupplicate phone";
      res.status(400);
      throw new Error(message);
    }
  }

  if (walletAddress) {
    const userExistsWalletAddress = await User.findOne({
      walletAddress: { $in: [walletAddress] },
    });
    if (userExistsWalletAddress) {
      let message = "Dupplicate wallet address";
      res.status(400);
      throw new Error(message);
    }
  }

  if (idCode) {
    const userExistsIdCode = await User.findOne({
      $and: [{ idCode: { $ne: "" } }, { idCode }],
    });
    if (userExistsIdCode) {
      let message = "duplicateInfoIdCode";
      res.status(400);
      throw new Error(message);
    }
  }

  const user = await User.findOne({ _id: req.params.id }).select("-password");

  if (user) {
    if (userId && user.userId !== userId) {
      user.userId = userId;
      await Tree.updateMany({ userId: user._id }, { userName: userId });
    }
    user.phone = phone || user.phone;
    user.email = email || user.email;
    user.idCode = idCode || user.idCode;
    user.hold = hold || user.hold;
    user.holdLevel = holdLevel || user.holdLevel;
    if (user.status === "LOCKED" && newStatus !== "LOCKED") {
      user.lockedTime = null;
    }
    user.status = newStatus || user.status;
    if (newStatus === "LOCKED") {
      user.lockedTime = new Date();
    }
    user.fine = newFine || user.fine;
    user.note = note || user.note;
    if (!openLah && openLah !== undefined) {
      user.openLah = false;
    }
    if (openLah) {
      user.openLah = true;
    }
    if (!closeLah && closeLah !== undefined) {
      user.closeLah = false;
    }
    if (closeLah) {
      user.closeLah = true;
    }
    user.imgFront = imgFront || user.imgFront;
    user.imgBack = imgBack || user.imgBack;
    const listTransSuccess = await Transaction.find({
      $and: [
        { userId: user._id },
        { status: "SUCCESS" },
        { type: { $ne: "REGISTER" } },
      ],
    });
    if (buyPackage && buyPackage !== user.buyPackage) {
      if (listTransSuccess.length === 0) {
        user.buyPackage = buyPackage || user.buyPackage;
        await Tree.updateMany(
          { $and: [{ userId: user._id }, { tier: 1 }] },
          { buyPackage }
        );
      } else {
        res.status(400).json({ error: "User has generated a transaction" });
      }
    }
    if (isRegistered && isRegistered === "on" && user.countPay === 0) {
      user.countPay = 1;
    }
    if (walletAddress && !user.walletAddress.includes(walletAddress)) {
      user.walletAddress = [walletAddress, ...user.walletAddress];
    }
    if (tier && user.tier !== tier && tier >= 2) {
      user.countPay = 0;
      user.tier = tier;
      user.countChild = [...user.countChild, 0];
      user.currentLayer = [...user.currentLayer, 0];
      user.tierDate = new Date();
      user.adminChangeTier = true;

      const newParentId = await findNextUser(tier);
      const newParent = await Tree.findOne({
        userId: newParentId,
        tier,
      });
      let childs = [...newParent.children];
      newParent.children = [...childs, user._id];
      await newParent.save();

      await Tree.create({
        userName: user.userId,
        userId: user._id,
        parentId: newParentId,
        refId: newParentId,
        tier,
        buyPackage: "A",
        children: [],
      });
    }

    const updatedUser = await user.save();
    if (updatedUser) {
      res.status(200).json({
        message: "Update successful",
      });
    }
  } else {
    res.status(400).json({ error: "User not found" });
  }
});

const changeStatusUser = asyncHandler(async (req, res) => {
  const { id, status } = req.body;
  const user = await User.findOne({ _id: id }).select("-password");
  if (user) {
    user.status = status || user.status;
    const updatedUser = await user.save();
    if (updatedUser) {
      res.status(200).json({
        message: "Approve successful",
      });
    }
  } else {
    res.status(400).json({ error: "User not found" });
  }
});

const getChildrenList = asyncHandler(async (req, res) => {
  const { id } = req.user;

  let result = await getAllChildren(id);

  res.status(200).json(result);
});

const getTree = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const user = await User.findOne({ _id: id }).select("userId children");

  const tree = { _id: user._id, name: user.userId, children: [] };

  for (const childId of user.children) {
    const childNode = await buildUserTree(childId);
    tree.children.push(childNode);
  }

  res.status(200).json(tree);
});

const getTreeOfUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select("userId children");
  if (user) {
    const tree = { _id: user._id, name: user.userId, children: [] };

    for (const childId of user.children) {
      const childNode = await buildUserTree(childId);
      tree.children.push(childNode);
    }

    res.status(200).json(tree);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getChildsOfUserForTree = asyncHandler(async (req, res) => {
  const { id, currentTier } = req.body;
  const userRequest = req.user;
  const user = await User.findOne({ _id: id }).select("userId countChild");
  const treeOfUser = await Tree.findOne({
    userId: id,
    tier: currentTier,
  }).select("userId children");

  if (user) {
    if (treeOfUser.children.length === 0) {
      res.status(404);
      throw new Error("User not have child");
    } else {
      const tree = { key: user._id, label: user.userId, nodes: [] };
      // let level, listUserOfLevel;
      // if (userRequest.isAdmin && currentTier >= 2) {
      //   level = await findLevelById(user._id, currentTier);
      //   listUserOfLevel = await findUsersAtLevel(
      //     "6494e9101e2f152a593b66f2",
      //     level + 1,
      //     currentTier
      //   );
      //   listUserOfLevel.sort((a, b) => {
      //     return new Date(a.createdAt) - new Date(b.createdAt);
      //   });
      // }
      for (const childId of treeOfUser.children) {
        const child = await User.findById(childId).select(
          "tier userId buyPackage countChild countPay fine status errLahCode"
        );
        const childTree = await Tree.findOne({
          userId: childId,
          tier: currentTier,
        });
        // const childTree = await Tree.findOneAndUpdate(
        //   { userId: childId, tier: currentTier },
        //   {
        //     $set: {
        //       indexOnLevel:
        //         userRequest.isAdmin && currentTier >= 2
        //           ? listUserOfLevel.findIndex((ele) => ele.userId === childId) +
        //             1
        //           : 0,
        //     },
        //   }
        // );

        tree.nodes.push({
          key: child._id,
          label: `${child.userId} (${child.countChild[currentTier - 1]} - ${
            child.tier > 1 && child.countPay === 0
              ? "Hoàn thành"
              : child.tier === 1 && child.countPay === 0
              ? "Chưa hoàn thành"
              : child.countPay === 1
              ? "Hoàn thành"
              : child.countPay - 1
            // child.countPay <= 1 ? 0 : child.countPay - 1
          })`,
          isGray:
            child.status === "LOCKED"
              ? currentTier === 1 || userRequest.isAdmin
                ? true
                : false
              : false,
          isRed:
            child.tier === 1 && child.countPay === 0
              ? true
              : child.tier === 1 &&
                child.buyPackage === "B" &&
                child.countPay < 7
              ? true
              : child.tier === 1 &&
                child.buyPackage === "A" &&
                child.countPay < 13
              ? true
              : false,
          isYellow: child.errLahCode === "OVER30",
          indexOnLevel: childTree.indexOnLevel,
        });
      }
      res.status(200).json(tree);
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const buildUserTree = async (userId) => {
  const user = await User.findOne({ _id: userId }).select("userId children");
  const tree = { _id: user._id, name: user.userId, children: [] };
  for (const childId of user.children) {
    const childTree = await buildUserTree(childId);
    if (childTree) {
      tree.children.push(childTree);
    }
  }

  return tree;
};

const getAllChildren = async (userId) => {
  const user = await User.findById(userId).select("userId children");

  if (!user) {
    return [];
  }

  let children = [];
  for (const childId of user.children) {
    const child = await getAllChildren(childId);
    children = children.concat(child);
  }

  return [user.userId, ...children];
};

const getCountAllChildren = async (userId, tier) => {
  const tree = await Tree.findOne({ userId, tier }).select("userId children");

  if (!tree) {
    return 0;
  }

  let result = tree.children.length;
  for (const childId of tree.children) {
    const count = await getCountAllChildren(childId, tier);
    result += count;
  }

  return result;
};

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (user) {
    const listDirectUser = [];
    const listRefIdOfUser = await Tree.find({ refId: user._id });
    if (listRefIdOfUser && listRefIdOfUser.length > 0) {
      for (let refId of listRefIdOfUser) {
        const refedUser = await User.findById(refId.userId).select(
          "userId email walletAddress status countPay tier errLahCode buyPackage"
        );
        listDirectUser.push({
          userId: refedUser.userId,
          isGray:
            refedUser.status === "LOCKED"
              ? req.user.isAdmin
                ? true
                : false
              : false,
          isRed:
            refedUser.tier === 1 && refedUser.countPay === 0
              ? true
              : refedUser.tier === 1 &&
                refedUser.buyPackage === "B" &&
                refedUser.countPay < 7
              ? true
              : refedUser.tier === 1 &&
                refedUser.buyPackage === "A" &&
                refedUser.countPay < 13
              ? true
              : false,
          isYellow: refedUser.errLahCode === "OVER30",
        });
      }
    }
    const packages = await getActivePackages();

    const permissions = await Permission.findOne({ role: user.role }).populate(
      "pagePermissions.page"
    );

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      userId: user.userId,
      isAdmin: user.isAdmin,
      isConfirmed: user.isConfirmed,
      avatar: user.avatar,
      walletAddress: user.walletAddress[0],
      tier: user.tier,
      createdAt: user.createdAt,
      fine: user.fine,
      status: user.status,
      imgFront: user.imgFront,
      imgBack: user.imgBack,
      countPay: user.countPay,
      phone: user.phone,
      idCode: user.idCode,
      buyPackage: user.buyPackage,
      continueWithBuyPackageB:
        packages.includes("B") && packages.includes("C")
          ? user.continueWithBuyPackageB
          : packages.includes("B")
          ? true
          : packages.includes("C")
          ? false
          : user.continueWithBuyPackageB,
      oldLayer: user.oldLayer,
      currentLayer: user.currentLayer,
      listDirectUser: listDirectUser,
      packages,
      openLah: user.openLah,
      closeLah: user.closeLah,
      tierDate: user.tierDate,
      tier1Time: user.tier1Time,
      tier2Time: user.tier2Time,
      tier3Time: user.tier3Time,
      tier4Time: user.tier4Time,
      tier5Time: user.tier5Time,
      hold: user.hold,
      role: user.role,
      permissions: permissions ? permissions.pagePermissions : null,
    });
  } else {
    res.status(400);
    throw new Error("User not authorised to view this page");
  }
});

const getListChildOfUser = asyncHandler(async (req, res) => {
  const result = await getAllDescendants(req.user.id);
  res.json(result);
});

async function getAllDescendants(targetUserId) {
  try {
    const descendants = await Tree.aggregate([
      {
        $match: { userId: targetUserId, tier: 1 },
      },
      {
        $graphLookup: {
          from: "trees",
          startWith: "$children",
          connectFromField: "children",
          connectToField: "userId",
          as: "descendants",
          maxDepth: 100,
        },
      },
    ]);

    const descendantsList = descendants[0].descendants.map((descendant) => ({
      id: descendant.userId,
      userId: descendant.userName,
    }));

    return descendantsList;
  } catch (error) {
    console.error("Lỗi khi lấy cấp dưới của người dùng:", error);
    return [];
  }
}

const changeSystem = asyncHandler(async (req, res) => {
  console.log({ req: req.body });
  const { moveId, receiveId, withChild } = req.body;

  const movePerson = await User.findById(moveId);
  const receivePerson = await User.findById(receiveId);

  // if (!movePerson || !receiveId) {
  //   res.status(400);
  //   throw new Error("User not found");
  // } else if (receivePerson.children.length === 3) {
  //   res.status(400);
  //   throw new Error("Receive user have full children");
  // } else {
  //   const newMovePerson = { ...movePerson };
  //   const newReceivePerson = { ...receivePerson };

  //   const parentOfMoveChild = await User.findById(newMovePerson.parentId);

  //   if (!withChild) {
  //     if (
  //       newMovePerson.children.length + parentOfMoveChild.children.length - 1 >
  //       3
  //     ) {
  //       res.status(400);
  //       throw new Error(
  //         `Parent of move user have ${parentOfMoveChild.children.length} child and move user have ${newMovePerson.children.length} child > 3`
  //       );
  //     } else {
  //       movePerson.parentId = newReceivePerson._id;
  //       movePerson.children = [];
  //       await movePerson.save();

  //       receivePerson.child.push(movePerson._id);
  //       await receivePerson.save();

  //       const newParentOfMoveChild = parentOfMoveChild.children.filter(
  //         (ele) => ele.toString() !== newMovePerson._id.toString()
  //       );
  //       for (let childId of newMovePerson.children) {
  //         const child = await User.findById(childId);
  //         child.parentId = parentOfMoveChild._id;
  //         parentOfMoveChild.children.push(childId);
  //       }
  //       parentOfMoveChild.children = newParentOfMoveChild;
  //       await parentOfMoveChild.save();
  //     }
  //   } else {
  //     movePerson.parentId = newReceivePerson._id;
  //     await movePerson.save();

  //     receivePerson.child.push(movePerson._id);
  //     await receivePerson.save();

  //     const newParentOfMoveChild = parentOfMoveChild.children.filter(
  //       (ele) => ele.toString() !== newMovePerson._id.toString()
  //     );

  //     parentOfMoveChild.children = newParentOfMoveChild;
  //     await parentOfMoveChild.save();
  //   }

  //   res.json({
  //     message: "Update successful",
  //   });
  // }
});

const getAllDeletedUsers = asyncHandler(async (req, res) => {
  const { pageNumber, keyword } = req.query;
  console.log({ pageNumber, keyword });
  const page = Number(pageNumber) || 1;

  const pageSize = 10;

  const count = await DeleteUser.countDocuments({
    $or: [
      { userId: { $regex: keyword, $options: "i" } }, // Tìm theo userId
      { email: { $regex: keyword, $options: "i" } }, // Tìm theo email
    ],
  });
  const allUsers = await DeleteUser.find({
    $or: [
      { userId: { $regex: keyword, $options: "i" } }, // Tìm theo userId
      { email: { $regex: keyword, $options: "i" } }, // Tìm theo email
    ],
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort("-createdAt")
    .select("-password");

  res.json({
    users: allUsers,
    pages: Math.ceil(count / pageSize),
  });
});

const getAllUsersForExport = asyncHandler(async (req, res) => {
  let fromDate, toDate;
  const { limit, page } = req.body;
  let match = { role: "user" };

  if (req.body.fromDate) {
    fromDate = req.body.fromDate.split("T")[0];
    match.createdAt = {
      $gte: new Date(new Date(fromDate).valueOf() + 1000 * 3600 * 24),
    };
  }
  if (req.body.toDate) {
    toDate = req.body.toDate.split("T")[0];
    let endDate = new Date(new Date(toDate).valueOf() + 1000 * 3600 * 24);
    endDate.setUTCHours(23, 59, 59, 999);
    match.createdAt = {
      ...match.createdAt,
      $lte: endDate,
    };
  }

  const offset = (page - 1) * limit;

  const users = await User.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "trees",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$userId", { $toString: "$$userId" }] },
                  { $eq: ["$tier", 1] },
                ],
              },
            },
          },
        ],
        as: "treeData",
      },
    },
    {
      $unwind: { path: "$treeData", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "trees",
        let: { parentId: "$treeData.refId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$userId", { $toString: "$$parentId" }] },
                  { $eq: ["$tier", 1] },
                ],
              },
            },
          },
        ],
        as: "parent",
      },
    },
    {
      $unwind: { path: "$parent", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "users",
        let: { parentUserId: { $toObjectId: "$parent.userId" } },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$parentUserId"],
              },
            },
          },
        ],
        as: "parentUser",
      },
    },
    {
      $unwind: { path: "$parentUser", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        walletAddress: 1,
        email: 1,
        fine: 1,
        countPay: 1,
        status: 1,
        countChild: 1,
        tier: 1,
        phone: 1,
        createdAt: 1,
        note: 1,
        treeData: "$treeData",
        parent: "$parent",
        parentUser: "$parentUser",
      },
    },
    { $skip: offset },
    { $limit: limit },
    { $sort: { createdAt: -1 } },
  ]);

  const totalCount = await User.countDocuments(match);

  const result = [];
  for (let u of users) {
    result.push({
      name: u.userId,
      email: u.email,
      phone: u.phone,
      walletAddress: u.walletAddress[0],
      memberSince: u.createdAt,
      tier: u.tier,
      "count pay": u.countPay,
      fine: u.fine,
      status: u.status,
      countChild: u.countChild[u.tier - 1],
      refUserName: u.parent ? u.parent.userName : "",
      refUserEmail: u.parentUser ? u.parentUser.email : "",
      note: u.note ? u.note : "",
    });
  }

  res.json({ totalCount, result });
});

const mailForChangeWallet = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (user && user.isConfirmed) {
      await sendMail(user._id, user.email, "change wallet");

      res.status(200).json({
        message: "Change wallet mail sended.Please check your mail",
      });
    } else {
      res.status(404);
      throw new Error("Not found user");
    }
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Could not send the mail. Please retry.");
  }
});

const changeWallet = asyncHandler(async (req, res) => {
  try {
    const { token, newWallet } = req.body;
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken.id);

    if (user && newWallet) {
      const newWalletAddress = [newWallet, ...user.walletAddress];
      user.walletAddress = [...newWalletAddress];
      const updatedUser = await user.save();

      if (updatedUser) {
        res.status(200).json({
          message: "Your wallet address updated",
        });
      } else {
        res.status(401);
        throw new Error("Unable to update wallet");
      }
    }
  } catch (error) {
    res.status(401);
    throw new Error("User not found");
  }
});

const adminDeleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  } else {
    for (let tierIndex = 1; tierIndex <= user.tier; tierIndex++) {
      const treeUser = await Tree.findOne({
        userId: user._id,
        tier: tierIndex,
      });
      if (treeUser.children.length > 1) {
        res.status(404);
        throw new Error("This account have child");
      }
    }
    let oldParents = [];
    for (let tierIndex = 1; tierIndex <= user.tier; tierIndex++) {
      const treeUser = await Tree.findOne({
        userId: user._id,
        tier: tierIndex,
      });
      const parentTree = await Tree.findOne({ userId: treeUser.parentId });
      oldParents.push(treeUser.parentId);
      if (treeUser.children.length === 0) {
        await removeIdFromChildrenOfParent(user, parentTree);
        await deleteTreeOfUserWithTier(user, tierIndex);
      } else if (treeUser.children.length === 1) {
        await removeIdFromChildrenOfParent(user, parentTree);
        await deleteTreeOfUserWithTier(user, tierIndex);
        await pushChildrent1ToUp(treeUser, parentTree, tierIndex);
      }
    }
    await replaceRefId(user._id);
    await addDeleteUserToData(user, oldParents);
    res.json({
      message: "Delete user successfull",
    });
  }
});

const addDeleteUserToData = async (user, parentIds) => {
  user.status = "DELETED";
  user.deletedTime = new Date();
  user.oldParents = [...parentIds, ...user.oldParents];
  await user.save();
  await Tree.deleteOne({ userId: user._id, tier: 1 });
};

const deleteTreeOfUserWithTier = async (user, tier) => {
  await Tree.deleteOne({ userId: user._id, tier });
};

const removeIdFromChildrenOfParent = async (user, parentTree) => {
  let childs = parentTree.children;
  let newChilds = childs.filter((item) => {
    if (item.toString() !== user._id.toString()) return item;
  });
  parentTree.children = [...newChilds];
  await parentTree.save();
};

const pushChildrent1ToUp = async (userTree, parentTree, tierIndex) => {
  const childTree = await Tree.findOne({
    userId: userTree.children[0],
    tier: tierIndex,
  });
  const userUp = await User.findById(childTree.userId);
  userUp.oldParents = [childTree.parentId, ...userUp.oldParents];
  await userUp.save();
  childTree.parentId = parentTree.userId;
  childTree.refId =
    childTree.refId === userTree.userId ? parentTree.userId : childTree.refId;
  await childTree.save();
  parentTree.children.push(childTree.userId);
  await parentTree.save();
};

const replaceRefId = async (deleteUserId) => {
  const listTreeHaveRefId = await Tree.find({ refId: deleteUserId });

  for (let treeUser of listTreeHaveRefId) {
    treeUser.refId = treeUser.parentId;
    await treeUser.save();
  }
};

const countChildOfUserById = async (user) => {
  if (user) {
    const newCountChild = [...user.countChild];
    for (let i = 1; i <= user.tier; i++) {
      const countChild = await getCountAllChildren(user._id, i);
      newCountChild[i - 1] = countChild;
    }
    user.countChild = newCountChild;
    const updatedUser = await user.save();
    return updatedUser;
  } else {
    throw new Error("User not found");
  }
};

const onAcceptIncreaseTier = asyncHandler(async (req, res) => {
  const u = req.user;
  const { type } = req.body;

  let nextTier = u.tier + 1;
  const canIncreaseTier = await checkCanIncreaseNextTier(u);
  if (canIncreaseTier) {
    if (type === "ACCEPT") {
      await NextUserTier.deleteMany({ tier: u.tier });
      await sendMailUserCanInceaseTierToAdmin(u);
      await checkUnPayUserOnTierUser(u.tier + 1);
      const newParentId = await findNextUser(nextTier);
      const newParent = await Tree.findOne({
        userId: newParentId,
        tier: nextTier,
      });
      let childs = [...newParent.children];
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
      u.countChild = [...u.countChild, 0];
      u.currentLayer = [...u.currentLayer, 0];
      u.tierDate = new Date();
      u[`tier${nextTier}Time`] = new Date();
      await u.save();
    }
    res.json({ canIncrease: true });
  } else {
    res.json({ canIncrease: false });
  }
});

const checkCanIncreaseNextTier = async (u) => {
  try {
    if (u.fine > 0) {
      return false;
    }
    if (u.buyPackage === "A" && u.countPay === 13) {
      let updatedUser = { ...u._doc };
      if (updatedUser.currentLayer.slice(-1) < 3) {
        updatedUser = await updateCurrentLayerOfUser(u.id);
      }
      if (updatedUser.currentLayer.slice(-1) >= 3) {
        const haveC = await doesAnyUserInHierarchyHaveBuyPackageC(u.id, 1);
        return !haveC;
      } else {
        const countedUser = await countChildOfUserById(u);
        if (countedUser.countChild.slice(-1) >= 300) {
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
            // const haveC = await doesAnyUserInHierarchyHaveBuyPackageC(u.id, 1);
            return true;
          }
        }
      }
    }
    return false;
  } catch (error) {
    throw new Error("Internal server error");
  }
};

const doesAnyUserInHierarchyHaveBuyPackageC = async (userId) => {
  const recursiveCheck = async (userId, count) => {
    let cnt = count | 0;

    const tree = await Tree.findOne({ userId });

    if (!tree) {
      return false;
    }

    if (tree.buyPackage === "C" && cnt <= 3) {
      return true;
    }

    // if (tree.buyPackage === "C") {
    //   console.log({ tree });
    //   return true;
    // }

    if (tree.children && tree.children.length > 0) {
      for (const childId of tree.children) {
        if (cnt === 3) continue;
        cnt += 1;
        const childHasBuyPackageC = await recursiveCheck(childId, cnt);
        if (childHasBuyPackageC) {
          return true;
        }
      }
    } else {
      cnt = 0;
    }

    return false;
  };

  const hasBuyPackageC = await recursiveCheck(userId);
  return hasBuyPackageC;
};

const adminCreateUser = asyncHandler(async (req, res) => {
  const {
    userId,
    walletAddress,
    email,
    password,
    phone,
    idCode,
    imgFront,
    imgBack,
    tier,
  } = req.body;

  const userExistsUserId = await User.findOne({
    userId: { $regex: userId, $options: "i" },
  });
  const userExistsEmail = await User.findOne({
    email: { $regex: email, $options: "i" },
  });
  const userExistsPhone = await User.findOne({
    $and: [{ phone: { $ne: "" } }, { phone }],
  });
  const userExistsWalletAddress = await User.findOne({
    walletAddress: { $in: [walletAddress] },
  });
  const userExistsIdCode = await User.findOne({
    $and: [{ idCode: { $ne: "" } }, { idCode }],
  });

  if (userExistsUserId) {
    let message = "duplicateInfoUserId";
    res.status(400);
    throw new Error(message);
  } else if (userExistsEmail) {
    let message = "duplicateInfoEmail";
    res.status(400);
    throw new Error(message);
  } else if (userExistsPhone) {
    let message = "Dupplicate phone";
    res.status(400);
    throw new Error(message);
  } else if (userExistsIdCode) {
    let message = "duplicateInfoIdCode";
    res.status(400);
    throw new Error(message);
  } else if (userExistsWalletAddress) {
    let message = "Dupplicate wallet address";
    res.status(400);
    throw new Error(message);
  } else {
    const avatar = generateGravatar(email);

    const user = await User.create({
      userId,
      email,
      phone,
      password,
      avatar,
      walletAddress: [walletAddress],
      idCode,
      imgBack,
      imgFront,
      tier,
      tierDate: new Date(),
      createBy: "ADMIN",
      countChild: Array.from({ length: tier }, () => 0),
      currentLayer: Array.from({ length: tier }, () => 0),
      status: "APPROVED",
      isConfirmed: true,
      buyPackage: "A",
      tier2Time: tier === 2 ? new Date() : null,
      tier3Time: tier === 3 ? new Date() : null,
      tier4Time: tier === 4 ? new Date() : null,
      tier5Time: tier === 5 ? new Date() : null,
      role: "user",
    });

    await checkUnPayUserOnTierUser(tier);
    const newParentId = await findNextUser(tier);
    const newParent = await Tree.findOne({
      userId: newParentId,
      tier,
    });
    let childs = [...newParent.children];
    newParent.children = [...childs, user._id];
    await newParent.save();

    await NextUserTier.deleteMany({ tier });

    await Tree.create({
      userName: user.userId,
      userId: user._id,
      parentId: newParentId,
      refId: newParentId,
      tier,
      children: [],
    });

    // await sendMail(user._id, email, "email verification");

    let message = "createUserSuccessful";

    res.status(201).json({
      message,
    });
  }
});

const updateCurrentLayerOfUser = async (id) => {
  const u = await User.findById(id);
  let newLayer = [];
  for (let i = 1; i <= u.tier; i++) {
    const layer = await findRootLayer(u._id, i);
    newLayer.push(layer);
  }

  if (areArraysEqual(newLayer, u.currentLayer)) {
    u.oldLayer = u.currentLayer;
    const updatedUser = await u.save();
    return updatedUser;
  } else {
    u.oldLayer = u.currentLayer;
    u.currentLayer = newLayer;
    const updatedUser = await u.save();
    return updatedUser;
  }
};

const getListNextUserWithTier = asyncHandler(async (req, res) => {
  const listTier = [2, 3, 4, 5];
  const listNextUserTier = [];
  for (let tier of listTier) {
    const nextUserIdTier = await findNextUser(tier);
    const nextUserTier = await User.findById(nextUserIdTier);
    const nextUserInDB = await findNextUserTierInDB(tier);
    if (nextUserInDB) {
      listNextUserTier.push({
        userId: nextUserInDB._id,
        userName: nextUserInDB.userId,
        tier,
      });
    } else {
      listNextUserTier.push({
        userId: nextUserTier._id,
        userName: nextUserTier.userId,
        tier,
      });
    }
  }
  res.json(listNextUserTier);
});

const findNextUserTierInDB = async (tier) => {
  const nextUserDBTier = await NextUserTier.findOne({ tier });
  if (nextUserDBTier) {
    const user = await User.findById(nextUserDBTier.userId);
    return user;
  } else {
    return null;
  }
};

const getUsersWithTier = asyncHandler(async (req, res) => {
  const { pageNumber, searchKey, tier } = req.body;
  const nextUserWithTier = await findNextUserNotIncludeNextUserTier(tier);
  const treeOfNextUserWithTier = await Tree.findOne({
    userId: nextUserWithTier,
    tier,
  });
  const page = Number(pageNumber) || 1;

  const pageSize = 10;

  const count = await Tree.countDocuments({
    $and: [
      { userName: { $regex: searchKey, $options: "i" } },
      {
        tier,
      },
      { children: { $not: { $size: 3 } } },
      { createdAt: { $gte: treeOfNextUserWithTier.createdAt } },
    ],
  });
  const allUsers = await Tree.find({
    $and: [
      { userName: { $regex: searchKey, $options: "i" } },
      {
        tier,
      },
      { children: { $not: { $size: 3 } } },
      { createdAt: { $gte: treeOfNextUserWithTier.createdAt } },
    ],
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: 1 })
    .select("-password");

  res.json({
    users: allUsers,
    pages: Math.ceil(count / pageSize),
  });
});

const changeNextUserTier = asyncHandler(async (req, res) => {
  const { userId, tier } = req.body;

  const tree = await Tree.findOne({ userId, tier });

  if (tree) {
    if (tree.children.length >= 3) {
      res.status(500);
      throw new Error("full3child");
    } else {
      await NextUserTier.deleteMany({ tier });

      await NextUserTier.create({ userId, tier });

      res.status(200).json({
        message: "Update successful",
      });
    }
  } else {
    res.status(500);
    throw new Error("Tree does not exist");
  }
});

const checkUnPayUserOnTierUser = async (tier) => {
  const lastUserInTier = await Tree.findOne({ tier }).sort({ createdAt: -1 });
  const listTrans = await Transaction.find({
    userId: lastUserInTier.userId,
    tier,
    status: "SUCCESS",
  });
  if (listTrans.length === 0) {
    let user = await User.findById(lastUserInTier.userId);
    if (!user.havePaid) {
      user.countPay = 13;
      user.tier = user.tier - 1;
      const newCountChild = user.countChild.slice(0, -1);
      user.countChild = [...newCountChild];
      const newCurrentLayer = user.currentLayer.slice(0, -1);
      user.currentLayer = [...newCurrentLayer];
      await user.save();

      let parent = await Tree.findOne({
        userId: lastUserInTier.parentId,
        tier,
      });
      if (parent) {
        let childs = parent.children;
        let newChilds = childs.filter((item) => {
          if (item !== lastUserInTier.userId) return item;
        });
        parent.children = [...newChilds];
        await parent.save();

        await Tree.deleteOne({
          userId: lastUserInTier.userId,
          tier,
        });
      }
    }
  }

  return;
};

const getLastUserInTier = asyncHandler(async (req, res) => {
  const { tier } = req.body;
  const lastUser = await Tree.findOne({ tier }).sort({ createdAt: -1 });
  if (lastUser) {
    const listTrans = await Transaction.find({
      userId: lastUser.userId,
      tier,
      status: "SUCCESS",
    });
    let user = await User.findById(lastUser.userId);
    if (user.havePaid) {
      res.json(null);
    }
    if (listTrans.length === 0) {
      res.json(lastUser);
    } else {
      res.json(null);
    }
  } else {
    res.json(null);
  }
});

const removeLastUserInTier = asyncHandler(async (req, res) => {
  const { userId, tier } = req.body;
  console.log({ userId, tier });
  const listTrans = await Transaction.find({
    userId,
    tier,
    status: "SUCCESS",
  });
  const lastUser = await Tree.findOne({ userId, tier });
  if (listTrans.length === 0) {
    let user = await User.findById(userId);
    if (!user.havePaid) {
      user.countPay = 13;
      user.tier = user.tier - 1;
      const newCountChild = user.countChild.slice(0, -1);
      user.countChild = [...newCountChild];
      const newCurrentLayer = user.currentLayer.slice(0, -1);
      user.currentLayer = [...newCurrentLayer];
      await user.save();

      let parent = await Tree.findOne({
        userId: lastUser.parentId,
        tier,
      });
      if (parent) {
        let childs = parent.children;
        let newChilds = childs.filter((item) => {
          if (item !== lastUser.userId) return item;
        });
        parent.children = [...newChilds];
        await parent.save();

        await Tree.deleteOne({
          userId: lastUser.userId,
          tier,
        });

        res.json({ message: "removeTreeSuccess" });
      }
    } else {
      res.json({ message: "accountHanvePaid" });
    }
  } else {
    res.json({ message: "accountHanvePaid" });
  }
});

const createAdmin = asyncHandler(async (req, res) => {
  const { userId, walletAddress, email, password, phone, role } = req.body;

  const userExistsUserId = await User.findOne({
    userId: { $regex: userId, $options: "i" },
  });
  const userExistsEmail = await User.findOne({
    email: { $regex: email, $options: "i" },
  });
  const userExistsPhone = await User.findOne({
    $and: [{ phone: { $ne: "" } }, { phone }],
  });
  const userExistsWalletAddress = await User.findOne({
    walletAddress: { $in: [walletAddress] },
  });

  if (userExistsUserId) {
    let message = "duplicateInfoUserId";
    res.status(400);
    throw new Error(message);
  } else if (userExistsEmail) {
    let message = "duplicateInfoEmail";
    res.status(400);
    throw new Error(message);
  } else if (userExistsPhone) {
    let message = "Dupplicate phone";
    res.status(400);
    throw new Error(message);
  } else if (userExistsWalletAddress) {
    let message = "Dupplicate wallet address";
    res.status(400);
    throw new Error(message);
  } else {
    const avatar = generateGravatar(email);

    await User.create({
      userId,
      email,
      phone,
      password,
      avatar,
      walletAddress: [walletAddress],
      imgBack: "",
      imgFront: "",
      tier: 5,
      countPay: 100,
      createBy: "ADMIN",
      status: "APPROVED",
      isConfirmed: true,
      role,
    });

    let message = "createUserSuccessful";

    res.status(201).json({
      message,
    });
  }
});

const getListAdmin = asyncHandler(async (req, res) => {
  const { pageNumber, keyword } = req.query;
  const page = Number(pageNumber) || 1;

  const pageSize = 20;

  const count = await User.countDocuments({
    $and: [
      {
        $or: [
          { userId: { $regex: keyword, $options: "i" } }, // Tìm theo userId
          { email: { $regex: keyword, $options: "i" } }, // Tìm theo email
        ],
      },
      {
        role: { $ne: "user" },
      },
    ],
  });
  const allUsers = await User.find({
    $and: [
      {
        $or: [
          { userId: { $regex: keyword, $options: "i" } }, // Tìm theo userId
          { email: { $regex: keyword, $options: "i" } }, // Tìm theo email
        ],
      },
      {
        role: { $ne: "user" },
      },
    ],
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort("-createdAt")
    .select("-password");

  res.json({
    admins: allUsers,
    pages: Math.ceil(count / pageSize),
  });
});

const updateAdmin = asyncHandler(async (req, res) => {
  console.log({ data: req.body });
  const { walletAddress, email, phone, role, password } = req.body;
  const user = await User.findOne({ _id: req.params.id }).select("-password");

  if (phone) {
    const userHavePhone = await User.find({
      $and: [{ phone }],
    });
    if (userHavePhone.length >= 1) {
      res.status(400).json({ error: "duplicateInfo" });
    }
  }

  if (walletAddress) {
    const userHaveWalletAddress = await User.find({
      $and: [{ walletAddress: { $in: [walletAddress] } }],
    });
    if (userHaveWalletAddress.length > 1) {
      res.status(400).json({ error: "duplicateInfo" });
    }
  }

  if (email) {
    const userHaveEmail = await User.find({
      $and: [{ email }],
    });
    if (userHaveEmail.length > 1) {
      res.status(400).json({ error: "duplicateInfo" });
    }
  }

  if (user) {
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (role) user.role = role;
    if (walletAddress)
      user.walletAddress = [walletAddress, ...user.walletAddress];
    if (password) user.password = password;
    await user.save();

    res.json({
      message: "Update successful",
    });
  } else {
    res.status(400).json({ error: "User not found" });
  }
});

const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await User.deleteOne({ _id: id });

  res.json({
    message: "delete successful",
  });
});

const getAdminById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const admin = await User.findById(id);

  if (admin) {
    const { userId, phone, email, _id, walletAddress, role } = admin;
    res.json({
      admin: {
        userId,
        phone,
        email,
        _id,
        walletAddress: walletAddress[0],
        role,
      },
    });
  } else {
    res.status(400).json({ error: "Admin not found" });
  }
});

export {
  getUserProfile,
  getAllUsers,
  getUserById,
  updateUser,
  changeStatusUser,
  getTree,
  getListChildOfUser,
  getTreeOfUser,
  getChildsOfUserForTree,
  getAllUsersWithKeyword,
  changeSystem,
  getChildrenList,
  getCountAllChildren,
  getAllDeletedUsers,
  getAllUsersForExport,
  mailForChangeWallet,
  changeWallet,
  adminUpdateUser,
  adminDeleteUser,
  countChildOfUserById,
  onAcceptIncreaseTier,
  checkCanIncreaseNextTier,
  adminCreateUser,
  getListNextUserWithTier,
  getUsersWithTier,
  changeNextUserTier,
  getLastUserInTier,
  removeLastUserInTier,
  createAdmin,
  getListAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminById,
};

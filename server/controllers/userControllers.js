import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import Package from "../models/packageModel.js";
import DeleteUser from "../models/deleteUserModel.js";
import mongoose from "mongoose";
import sendMail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Tree from "../models/treeModel.js";
import { getActivePackages } from "./packageControllers.js";
import { findNextUser, findRootLayer } from "../utils/methods.js";
import generateGravatar from "../utils/generateGravatar.js";
import { areArraysEqual } from "../cronJob/index.js";
import { sendMailUserCanInceaseTierToAdmin } from "../utils/sendMailCustom.js";

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
        isAdmin: false,
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
        isAdmin: false,
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

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.children.length > 0) {
      res.status(404);
      throw new Error("This account have child");
    }
    let parent = await User.findById(user.parentId);
    if (parent) {
      let childs = parent.children;
      let newChilds = childs.filter((item) => {
        if (item.toString() !== user._id.toString()) return item;
      });
      parent.children = [...newChilds];
      await parent.save();

      await DeleteUser.create({
        userId: user.userId,
        oldId: user._id,
        phone: user.phone,
        email: user.email,
        password: user.password,
        walletAddress: user.walletAddress,
        parentId: user.parentId,
        refId: user.refId,
      });

      await User.deleteOne({ _id: user._id });
      res.json({
        message: "Delete user successfull",
      });
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    const listDirectUser = [];
    const listRefIdOfUser = await Tree.find({ refId: user._id });
    if (listRefIdOfUser && listRefIdOfUser.length > 0) {
      for (let refId of listRefIdOfUser) {
        const refedUser = await User.findById(refId.userId).select(
          "userId email walletAddress"
        );
        listDirectUser.push(refedUser);
      }
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
      const listDirectUser = await User.find({ refId: user._id }).select(
        "userId email walletAddress"
      );
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
    user.status = newStatus || user.status;
    user.fine = newFine || user.fine;
    user.openLah = openLah || user.openLah;
    user.closeLah = closeLah || user.closeLah;
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
      for (const childId of treeOfUser.children) {
        const child = await User.findById(childId).select(
          "tier userId countChild countPay fine status errLahCode"
        );
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
          isRed:
            // (child.tier === 1 && child.countPay === 0) ||
            // child.fine > 0 ||
            child.status === "LOCKED"
              ? true
              : false,
          isYellow: child.errLahCode === "OVER30",
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
          "userId email walletAddress"
        );
        listDirectUser.push(refedUser);
      }
    }
    const packages = await getActivePackages();

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
  const users = await User.aggregate([
    {
      $lookup: {
        from: "trees",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$userId", { $toString: "$$userId" }], // Chuyển đổi userId từ ObjectId sang String
              },
            },
          },
        ],
        as: "treeData",
      },
    },
    {
      $unwind: "$treeData",
    },
    {
      $lookup: {
        from: "trees",
        localField: "treeData.refId",
        foreignField: "userId",
        as: "parent",
      },
    },
    {
      $unwind: "$parent",
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
        phone: 1,
        createdAt: 1,
        parent: "$parent",
      },
    },
  ]);

  const result = [];
  for (let u of users) {
    result.push({
      name: u.userId,
      email: u.email,
      phone: u.phone,
      walletAddress: u.walletAddress[0],
      memberSince: u.createdAt,
      countChild: u.countChild,
      refUserName: u.parent ? u.parent.userName : "",
      "count pay": u.countPay,
      fine: u.fine,
      status: u.status,
    });
  }

  res.json(result);
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
    for (let tierIndex = 1; tierIndex <= user.tier; tierIndex++) {
      const treeUser = await Tree.findOne({
        userId: user._id,
        tier: tierIndex,
      });
      const parentTree = await Tree.findOne({ userId: treeUser.parentId });
      if (treeUser.children.length === 0) {
        await removeIdFromChildrenOfParent(user, parentTree);
        await deleteTreeOfUserWithTier(user, tierIndex);
      } else if (treeUser.children.length === 1) {
        // User có 1 con, xoá user và cập nhật parent
        await removeIdFromChildrenOfParent(user, parentTree);
        await deleteTreeOfUserWithTier(user, tierIndex);
        await pushChildrent1ToUp(treeUser, parentTree, tierIndex);
      }
    }
    await replaceRefId(user._id);
    await deleteTransactions(user._id);
    await addDeleteUserToData(user);
    res.json({
      message: "Delete user successfull",
    });
    // else if (user.children.length > 1) {
    //   // User có nhiều hơn 1 con
    //   const child1 = await User.findById(user.children[0]);
    //   const child1Children = child1.children;

    //   if (child1Children.length < 3) {
    //     // Đào sâu vào con 1 của user để đưa con 2 và 3 vào nếu con 1 chưa đủ 3 con
    //     let currentChild = child1;
    //     let i = 1;

    //     while (
    //       currentChild.children.length >= 2 &&
    //       i <= user.children.length - 2
    //     ) {
    //       const nextChild = await User.findById(user.children[i]);

    //       if (currentChild.children.length + nextChild.children.length <= 3) {
    //         currentChild.children = currentChild.children.concat(
    //           nextChild.children
    //         );
    //         await currentChild.save();
    //         await DeleteUser.create({
    //           userId: nextChild.userId,
    //           oldId: nextChild._id,
    //           phone: nextChild.phone,
    //           email: nextChild.email,
    //           password: nextChild.password,
    //           walletAddress: nextChild.walletAddress,
    //           parentId: nextChild.parentId,
    //           refId: nextChild.refId,
    //         });
    //         await User.deleteOne({ _id: nextChild._id });
    //         i++;
    //       } else {
    //         currentChild = nextChild;
    //         i = 1;
    //       }
    //     }

    //     const remainingChildren = user.children.slice(i);
    //     parent.children = parent.children
    //       .filter((childId) => childId !== user._id)
    //       .concat(child1._id);
    //     child1.children = child1Children.concat(remainingChildren);
    //     await child1.save();
    //     await parent.save();
    //     await DeleteUser.create({
    //       userId: user.userId,
    //       oldId: user._id,
    //       phone: user.phone,
    //       email: user.email,
    //       password: user.password,
    //       walletAddress: user.walletAddress,
    //       parentId: user.parentId,
    //       refId: user.refId,
    //     });
    //     await User.deleteOne({ _id: user._id });
    //   } else {
    //     // Đào sâu vào con 1 của con 1 của user
    //     const grandchild1 = await User.findById(child1Children[0]);

    //     while (grandchild1.children.length >= 2) {
    //       const nextChild = await User.findById(grandchild1.children[1]);
    //       grandchild1.children = grandchild1.children.concat(
    //         nextChild.children
    //       );
    //       await grandchild1.save();
    //       await DeleteUser.create({
    //         userId: nextChild.userId,
    //         oldId: nextChild._id,
    //         phone: nextChild.phone,
    //         email: nextChild.email,
    //         password: nextChild.password,
    //         walletAddress: nextChild.walletAddress,
    //         parentId: nextChild.parentId,
    //         refId: nextChild.refId,
    //       });
    //       await User.deleteOne({ _id: nextChild._id });
    //     }

    //     // Cắm con 2 và 3 vào con 1 của con 1 của user
    //     const remainingChildren = user.children.slice(1);
    //     parent.children = parent.children
    //       .filter((childId) => childId !== user._id)
    //       .concat(grandchild1._id);
    //     grandchild1.children = grandchild1.children.concat(remainingChildren);
    //     await grandchild1.save();
    //     await parent.save();
    //     await DeleteUser.create({
    //       userId: user.userId,
    //       oldId: user._id,
    //       phone: user.phone,
    //       email: user.email,
    //       password: user.password,
    //       walletAddress: user.walletAddress,
    //       parentId: user.parentId,
    //       refId: user.refId,
    //     });
    //     await User.deleteOne({ _id: user._id });
    //   }
    // }
  }
});

const deleteTransactions = async (userId) => {
  await Transaction.deleteMany({ userId });
};

const addDeleteUserToData = async (user) => {
  await DeleteUser.create({
    userId: user.userId,
    oldId: user._id,
    phone: user.phone,
    email: user.email,
    password: user.password,
    walletAddress: user.walletAddress,
    parentId: user.parentId,
    refId: user.refId,
  });
  await User.deleteOne({ _id: user._id });
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
      await sendMailUserCanInceaseTierToAdmin(u);
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
      const updatedUser = await updateCurrentLayerOfUser(u.id);
      if (updatedUser.currentLayer.slice(-1) >= 3) {
        const haveC = await doesAnyUserInHierarchyHaveBuyPackageC(u.id);
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
            const haveC = await doesAnyUserInHierarchyHaveBuyPackageC(u.id);
            return !haveC;
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
      console.log({ tree });
      return true;
    }

    // if (tree.buyPackage === "C") {
    //   console.log({ tree });
    //   return true;
    // }

    if (tree.children && tree.children.length > 0) {
      for (const childId of tree.children) {
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
    });

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

export {
  getUserProfile,
  getAllUsers,
  deleteUser,
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
};

import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import DeleteUser from "../models/deleteUserModel.js";
import mongoose from "mongoose";
import sendMail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
    const listDirectUser = await User.find({ refId: user._id }).select(
      "userId email walletAddress"
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
      oldLayer: user.oldLayer,
      currentLayer: user.currentLayer,
      listDirectUser: listDirectUser,
    });
  } else {
    res.status(404);
    throw new Error("User does not exist");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { phone, imgFront, imgBack, idCode } = req.body;
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  const userHavePhone = await User.find({
    $and: [{ phone }, { email: { $ne: user.email } }],
  });
  const userHaveIdCode = await User.find({
    $and: [{ idCode }, { email: { $ne: user.email } }],
  });

  if (userHavePhone.length >= 1 || userHaveIdCode.length >= 1) {
    res.status(400).json({ error: "duplicateInfo" });
  }
  if (user) {
    user.phone = phone || user.phone;
    user.idCode = idCode || user.idCode;
    if (imgFront !== "" && imgBack !== "") {
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
          listDirectUser,
        },
      });
    }
  } else {
    res.status(400).json({ error: "User not found" });
  }
});

const adminUpdateUser = asyncHandler(async (req, res) => {
  const { newStatus, newFine, isRegistered } = req.body;
  const user = await User.findOne({ _id: req.params.id }).select("-password");

  if (user) {
    user.status = newStatus || user.status;
    user.fine = newFine || user.fine;
    if (isRegistered && isRegistered === "on" && user.countPay === 0) {
      user.countPay = 1;
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
  const { id } = req.body;
  const user = await User.findOne({ _id: id }).select(
    "userId children countChild"
  );
  if (user) {
    if (user.children.length === 0) {
      res.status(404);
      throw new Error("User not have child");
    } else {
      const tree = { key: user._id, label: user.userId, nodes: [] };
      for (const childId of user.children) {
        const child = await User.findById(childId).select(
          "userId children countChild countPay"
        );
        tree.nodes.push({
          key: child._id,
          label: `${child.userId} (${child.countChild} - ${
            child.countPay === 0
              ? "Chưa hoàn thành"
              : child.countPay === 1
              ? "Hoàn thành"
              : child.countPay - 1
          })`,
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

const getCountAllChildren = async (userId) => {
  const user = await User.findById(userId).select("userId children");

  if (!user) {
    return 0;
  }

  let result = user.children.length;
  for (const childId of user.children) {
    const count = await getCountAllChildren(childId);
    result += count;
  }

  return result;
};

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (user) {
    const listDirectUser = await User.find({ refId: user._id }).select(
      "userId email walletAddress"
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
      oldLayer: user.oldLayer,
      currentLayer: user.currentLayer,
      listDirectUser: listDirectUser,
    });
  } else {
    res.status(400);
    throw new Error("User not authorised to view this page");
  }
});

const getListChildOfUser = asyncHandler(async (req, res) => {
  const result = await getAllDescendants(req.user.id);
  console.log({ result: result.length });
  res.json(result);
});

async function getAllDescendants(targetUserId) {
  try {
    const descendants = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(targetUserId) },
      },
      {
        $graphLookup: {
          from: "users", // Collection name
          startWith: "$children", // Trường con trong mảng children
          connectFromField: "children",
          connectToField: "_id",
          as: "descendants",
          maxDepth: 100, // Số tầng cấp dưới tối đa (có thể điều chỉnh tùy ý)
        },
      },
    ]);

    // Lấy danh sách các node con
    const descendantsList = descendants[0].descendants.map((descendant) => ({
      id: descendant._id,
      userId: descendant.userId,
      // Các trường khác của người dùng...
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
      $match: {
        $and: [{ isAdmin: false }, { refId: { $ne: "" } }],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "refId",
        foreignField: "_id",
        as: "parent",
      },
    },
    { $unwind: "$parent" },
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
      refUserName: u.parent ? u.parent.userId : "",
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
  const parent = await User.findById(user.parentId);
  if (!user || !parent) {
    res.status(404);
    throw new Error("User not found");
  } else {
    if (user.children.length === 0) {
      await removeIdFromChildrenOfParent(user, parent);
      await deleteTransactions(user._id);
      await addDeleteUserToData(user);
      res.json({
        message: "Delete user successfull",
      });
    } else {
      res.status(404);
      throw new Error("This account have child");
    }
    // } else if (user.children.length === 1) {
    //   // User có 1 con, xoá user và cập nhật parent
    //   const child = await User.findById(user.children[0]);
    //   child.parentId = user.parentId;
    //   child.refId = child.refId === user._id ? user.parentId : child.refId;
    //   parent.children = parent.children
    //     .filter((childId) => childId !== user._id)
    //     .concat(child._id);
    //   await child.save();
    //   await parent.save();
    //   await DeleteUser.create({
    //     userId: user.userId,
    //     oldId: user._id,
    //     phone: user.phone,
    //     email: user.email,
    //     password: user.password,
    //     walletAddress: user.walletAddress,
    //     parentId: user.parentId,
    //     refId: user.refId,
    //   });
    //   await User.deleteOne({ _id: user._id });
    // } else if (user.children.length > 1) {
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
};

const removeIdFromChildrenOfParent = async (user, parent) => {
  let childs = parent.children;
  let newChilds = childs.filter((item) => {
    if (item.toString() !== user._id.toString()) return item;
  });
  parent.children = [...newChilds];
  await parent.save();
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
};

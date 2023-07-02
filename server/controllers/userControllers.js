import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

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
    await user.remove();
    res.json({
      message: "User removed from DB",
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) res.json(user);
  else {
    res.status(404);
    throw new Error("User does not exist");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  const { walletAddress, imgFront, imgBack } = req.body;
  if (user) {
    user.walletAddress = walletAddress || user.walletAddress;
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
      res.status(200).json({
        message: "Update successful",
        data: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          userId: updatedUser.updatedUserId,
          isAdmin: updatedUser.isAdmin,
          isConfirmed: updatedUser.isConfirmed,
          avatar: updatedUser.avatar,
          walletAddress: updatedUser.walletAddress,
          tier: updatedUser.tier,
          createdAt: updatedUser.createdAt,
          fine: updatedUser.fine,
          status: updatedUser.status,
          imgFront: updatedUser.imgFront,
          imgBack: updatedUser.imgBack,
          countPay: updatedUser.countPay,
        },
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
  const user = await User.findOne({ _id: id }).select("userId children");
  if (user) {
    if (user.children.length === 0) {
      res.status(404);
      throw new Error("User not have child");
    } else {
      const tree = { _id: user._id, name: user.userId, children: [] };
      for (const childId of user.children) {
        const child = await User.findById(childId).select("userId children");
        tree.children.push({ _id: child._id, name: child.userId });
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
      walletAddress: user.walletAddress,
      tier: user.tier,
      createdAt: user.createdAt,
      fine: user.fine,
      status: user.status,
      imgFront: user.imgFront,
      imgBack: user.imgBack,
      countPay: user.countPay,
      listDirectUser: listDirectUser,
    });
  } else {
    res.status(400);
    throw new Error("User not authorised to view this page");
  }
});

const getListChildOfUser = asyncHandler(async (req, res) => {
  const result = await getDescendants(req.user.id);
  result.shift();
  res.json(result);
});

const getDescendants = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    return [];
  }

  let descendants = [];

  for (const childId of user.children) {
    const childDescendants = await getDescendants(childId);
    descendants = descendants.concat(childDescendants);
  }

  return [{ userId: user.userId, id: user._id }, ...descendants];
};

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
};

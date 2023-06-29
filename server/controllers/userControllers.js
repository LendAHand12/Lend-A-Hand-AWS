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
};

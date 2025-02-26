import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";
import generateToken from "../utils/generateToken.js";
import sendMail from "../utils/sendMail.js";
import generateGravatar from "../utils/generateGravatar.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Tree from "../models/treeModel.js";
import { getActivePackages } from "./packageControllers.js";
import Permission from "../models/permissionModel.js";

const checkLinkRef = asyncHandler(async (req, res) => {
  const { ref, receiveId } = req.body;
  let message = "invalidUrl";
  try {
    const userReceive = await User.findOne({
      _id: receiveId,
      status: { $in: ["APPROVED", "LOCKED"] },
    });

    const userRef = await User.findOne({
      _id: ref,
      status: { $in: ["APPROVED", "LOCKED"] },
    });

    if (userReceive && userRef) {
      const treeUserReceive = await Tree.findOne({
        userId: userReceive._id,
        tier: 1,
      });
      if (treeUserReceive && treeUserReceive.children.length < 5) {
        message = "validUrl";
        res.status(200).json({
          message,
        });
      } else {
        res.status(400).json({
          error: "full3child",
        });
      }
    } else {
      res.status(400).json({
        error: message,
      });
    }
  } catch (err) {
    res.status(400).json({
      error: message,
    });
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { userId, walletAddress, email, password, ref, receiveId, phone, idCode } = req.body;

  const userExistsUserId = await User.findOne({
    userId: { $regex: userId, $options: "i" },
    status: { $ne: "DELETED" },
  });
  const userExistsEmail = await User.findOne({
    email: email.toLowerCase(),
    status: { $ne: "DELETED" },
  });
  const userExistsPhone = await User.findOne({
    $and: [{ phone: { $ne: "" } }, { phone }],
    status: { $ne: "DELETED" },
  });
  const userExistsWalletAddress = await User.findOne({
    walletAddress1: walletAddress,
  });
  const userExistsIdCode = await User.findOne({
    $and: [{ idCode: { $ne: "" } }, { idCode }],
    status: { $ne: "DELETED" },
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
    const treeReceiveUser = await Tree.findOne({ userId: receiveId, tier: 1 });

    if (treeReceiveUser.children.length < 5) {
      const avatar = generateGravatar(email);

      const user = await User.create({
        userId,
        email: email.toLowerCase(),
        phone,
        password,
        avatar,
        walletAddress: [walletAddress],
        walletAddress1: walletAddress,
        walletAddress2: walletAddress,
        walletAddress3: walletAddress,
        walletAddress4: walletAddress,
        walletAddress5: walletAddress,
        idCode,
        role: "user",
      });

      const tree = await Tree.create({
        userName: user.userId,
        userId: user._id,
        parentId: receiveId,
        refId: ref,
        children: [],
      });

      await sendMail(user._id, email, "email verification");

      treeReceiveUser.children.push(user._id);
      await treeReceiveUser.save();

      let message = "registerSuccessful";

      res.status(201).json({
        message,
      });
    } else {
      res.status(400);
      throw new Error("Internal error");
    }
  }
});

const mailForEmailVerification = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      // send a verification email, if this user is not a confirmed email
      if (!user.isConfirmed) {
        // send the mail
        await sendMail(user._id, email, "email verification");
        res.status(201).json({
          id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          avatar: user.avatar,
          isConfirmed: user.isConfirmed,
        });
      } else {
        res.status(400).json({ message: "userAlreadyConfirmed" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Could not send the mail. Please retry." });
  }
});

const mailForPasswordReset = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user && user.isConfirmed) {
      await sendMail(user._id, email, "forgot password");

      res.status(200).json({
        message: "Recovery mail sended.Please check your mail",
      });
    } else {
      res.status(404).json({ error: "Not found user" });
    }
  } catch (error) {
    res.status(401).json({ error: "Could not send the mail. Please retry." });
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { code, password } = req.body;

  let user = await User.findOne({
    $and: [
      { $or: [{ email: code }, { userId: code }] },
      { isConfirmed: true },
      { status: { $ne: "LOCKED" } },
      { status: { $ne: "DELETED" } },
    ],
  });

  if (user && (await user.matchPassword(password))) {
    const accessToken = generateToken(user._id, "access");
    const refreshToken = generateToken(user._id, "refresh");

    const existingToken = await Token.findOne({ email: user.email });
    if (!existingToken) {
      await Token.create({
        email: user.email,
        token: refreshToken,
      });
    } else {
      existingToken.token = refreshToken;
      existingToken.save();
    }

    const listDirectUser = [];
    const listRefIdOfUser = await Tree.find({ refId: user._id, tier: 1 });
    if (listRefIdOfUser && listRefIdOfUser.length > 0) {
      for (let refId of listRefIdOfUser) {
        const refedUser = await User.findById(refId.userId).select("userId email");
        listDirectUser.push(refedUser);
      }
    }

    const packages = await getActivePackages();

    const permissions = await Permission.findOne({ role: user.role }).populate(
      "pagePermissions.page"
    );

    res.status(200).json({
      userInfo: {
        id: user._id,
        email: user.email,
        name: user.name,
        userId: user.userId,
        isAdmin: user.isAdmin,
        isConfirmed: user.isConfirmed,
        avatar: user.avatar,
        walletAddress1: user.walletAddress1,
        walletAddress2: user.walletAddress2,
        walletAddress3: user.walletAddress3,
        walletAddress4: user.walletAddress4,
        walletAddress5: user.walletAddress5,
        tier: user.tier,
        createdAt: user.createdAt,
        fine: user.fine,
        status: user.status,
        imgFront: user.imgFront,
        imgBack: user.imgBack,
        countPay: user.countPay,
        phone: user.phone,
        oldLayer: user.oldLayer,
        currentLayer: user.currentLayer,
        idCode: user.idCode,
        buyPackage: user.buyPackage,
        continueWithBuyPackageB: user.continueWithBuyPackageB,
        listDirectUser: listDirectUser,
        packages,
        openLah: user.openLah,
        closeLah: user.closeLah,
        tierDate: user.tierDate,
        role: user.role,
        permissions: permissions ? permissions.pagePermissions : [],
      },
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).json({ error: "Login information is incorrect" });
  }
});

const resetUserPassword = asyncHandler(async (req, res) => {
  try {
    // update the user password if the jwt is verified successfully
    const { token, password } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET);
    const user = await User.findById(decodedToken.id);

    if (user && password) {
      user.password = password;
      const updatedUser = await user.save();

      if (updatedUser) {
        res.status(200).json({
          message: "Password updated. Please login with new password",
        });
      } else {
        res.status(401).json({ error: "Unable to update password" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: "User not found" });
  }
});

const confirmUser = asyncHandler(async (req, res) => {
  try {
    // set the user to a confirmed status, once the corresponding JWT is verified correctly
    const emailToken = req.params.token;
    console.log({ emailToken });
    const decodedToken = jwt.verify(emailToken, process.env.JWT_EMAIL_TOKEN_SECRET);
    const user = await User.findById(decodedToken.id).select("-password");
    user.isConfirmed = true;
    await user.save();
    res.status(200).json({
      message: "",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Token expired",
    });
  }
});

const getAccessToken = asyncHandler(async (req, res) => {
  const { email, refreshToken } = req.body;

  // search if currently loggedin user has the refreshToken sent
  const currentAccessToken = await Token.findOne({ email });

  if (!refreshToken || refreshToken !== currentAccessToken.token) {
    res.status(400).json({ error: "Refresh token not found, login again" });
  }

  // If the refresh token is valid, create a new accessToken and return it.
  jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, user) => {
    if (!err) {
      const accessToken = generateToken(user.id, "access");
      return res.json({ accessToken });
    } else {
      return res.status(400).json({
        message: "Invalid refresh token",
      });
    }
  });
});

const checkSendMail = asyncHandler(async (req, res) => {
  const { mail } = req.body;
  const mailInfo = await sendMail("6480c10538aa7ded76b631c1", mail, "email verification");
  res.json({
    mailInfo,
  });
});

const getLinkVerify = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user.isConfirmed) {
    res.status(400);
    throw new Error("User confirmed");
  }
  if (user) {
    const emailToken = generateToken(user._id, "email");
    const url = `${process.env.FRONTEND_BASE_URL}/confirm?token=${emailToken}`;
    res.json({
      url,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const updateData = asyncHandler(async (req, res) => {
  const listUser = await User.find();
  for (let user of listUser) {
    await User.findOneAndUpdate({ _id: user._id }, { refId: user.parentId });
  }
  res.json("updated");
});

const getNewPass = asyncHandler(async (req, res) => {
  res.json(bcrypt.hashSync("abcd1234", 12));
});

export {
  checkSendMail,
  checkLinkRef,
  registerUser,
  authUser,
  confirmUser,
  getAccessToken,
  resetUserPassword,
  mailForEmailVerification,
  mailForPasswordReset,
  getLinkVerify,
  updateData,
  getNewPass,
};

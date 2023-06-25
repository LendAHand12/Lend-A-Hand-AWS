import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import getParentWithCountPay from "../utils/getParentWithCountPay.js";

const getPaymentInfo = asyncHandler(async (req, res) => {
  const { user } = req;

  await Transaction.deleteMany({
    $and: [
      {
        status: "PENDING",
      },
      { userId: user.id },
    ],
  });
  let haveParentNotPayEnough = false;
  let haveRefNotPayEnough = false;

  if (user) {
    const parentUser = await User.findOne({ _id: user.parentId }).select(
      "-password"
    );
    const refUser = await User.findOne({ _id: user.refId }).select("-password");

    if (!parentUser || !refUser) {
      res.status(404);
      throw new Error("Parent not found");
    }

    let registerFee = 0;
    let directCommissionWallet = "";
    let directCommissionFee = 0;
    let referralCommissionWallet = "";
    let referralCommissionFee = 0;

    if (user.countPay === 0) {
      registerFee = 7;
      if (refUser.countPay < user.countPay + 1) {
        directCommissionWallet = process.env.MAIN_WALLET_ADDRESS;
        haveRefNotPayEnough = true;
      } else {
        directCommissionWallet = refUser.walletAddress;
      }
      directCommissionFee = 5;
      if (parentUser.countPay < user.countPay + 1) {
        referralCommissionWallet = process.env.MAIN_WALLET_ADDRESS;
        haveParentNotPayEnough = true;
      } else {
        referralCommissionWallet = parentUser.walletAddress;
      }
      referralCommissionFee = 10;
    } else {
      if (refUser.countPay < user.countPay + 1) {
        directCommissionWallet = process.env.MAIN_WALLET_ADDRESS;
        haveRefNotPayEnough = true;
      } else {
        directCommissionWallet = refUser.walletAddress;
      }
      directCommissionFee = 5;
      const parentWithCountPay = await getParentWithCountPay(
        user.id,
        user.countPay
      );
      if (!parentWithCountPay) {
        referralCommissionWallet = process.env.MAIN_WALLET_ADDRESS;
      } else if (parentWithCountPay.countPay < user.countPay + 1) {
        referralCommissionWallet = process.env.MAIN_WALLET_ADDRESS;
        haveParentNotPayEnough = true;
      } else {
        referralCommissionWallet = parentWithCountPay.walletAddress;
      }
      referralCommissionFee = 10;
    }

    let transactionRegister = null;
    let transactionDirect = null;
    let transactionReferral = null;

    const transIds = {};

    const listTransSuccess = await Transaction.find({
      $and: [
        { userId: user.id },
        { userCountPay: user.countPay },
        { status: "SUCCESS" },
      ],
    });

    let step = 0;
    if (listTransSuccess.length === 0) {
      if (user.countPay === 0) {
        step = 1;
        transactionRegister = await Transaction.create({
          userId: user.id,
          amount: registerFee,
          userCountPay: user.countPay,
          address_ref: process.env.MAIN_WALLET_ADDRESS,
          address_from: user.walletAddress,
          address_to: process.env.MAIN_WALLET_ADDRESS,
          hash: "",
          type: "REGISTER",
          status: "PENDING",
        });
        transIds.register = transactionRegister._id;
      } else {
        step = 2;
      }

      transactionDirect = await Transaction.create({
        userId: user.id,
        amount: directCommissionFee,
        userCountPay: user.countPay,
        address_ref: refUser.walletAddress,
        address_from: user.walletAddress,
        address_to: directCommissionWallet,
        hash: "",
        type: haveRefNotPayEnough ? "DIRECTHOLD" : "DIRECT",
        status: "PENDING",
      });
      transIds.direct = transactionDirect._id;

      transactionReferral = await Transaction.create({
        userId: user.id,
        amount: referralCommissionFee,
        userCountPay: user.countPay,
        address_ref: haveParentNotPayEnough
          ? parentUser.walletAddress
          : referralCommissionWallet,
        address_from: user.walletAddress,
        address_to: referralCommissionWallet,
        hash: "",
        type: haveParentNotPayEnough ? "REFERRALHOLD" : "REFERRAL",
        status: "PENDING",
      });
      transIds.referral = transactionReferral._id;
    }
    if (listTransSuccess.length === 1) {
      step = 2;
      transIds.register = listTransSuccess[0]._id;
      transactionDirect = await Transaction.create({
        userId: user.id,
        amount: directCommissionFee,
        userCountPay: user.countPay,
        address_ref: refUser.walletAddress,
        address_from: user.walletAddress,
        address_to: directCommissionWallet,
        hash: "",
        type: haveRefNotPayEnough ? "DIRECTHOLD" : "DIRECT",
        status: "PENDING",
      });
      transIds.direct = transactionDirect._id;

      transactionReferral = await Transaction.create({
        userId: user.id,
        amount: referralCommissionFee,
        userCountPay: user.countPay,
        address_ref: haveParentNotPayEnough
          ? parentUser.walletAddress
          : referralCommissionWallet,
        address_from: user.walletAddress,
        address_to: referralCommissionWallet,
        hash: "",
        type: haveParentNotPayEnough ? "REFERRALHOLD" : "REFERRAL",
        status: "PENDING",
      });
      transIds.referral = transactionReferral._id;
    }
    if (listTransSuccess.length === 2) {
      step = 3;

      const registerTrans = listTransSuccess.find(
        (ele) => ele.type === "REGISTER"
      );
      transIds.register = registerTrans._id;

      const directTrans = listTransSuccess.find(
        (ele) => ele.type === "DIRECT" || ele.type === "DIRECTHOLD"
      );
      transIds.direct = directTrans._id;

      transactionReferral = await Transaction.create({
        userId: user.id,
        amount: referralCommissionFee,
        userCountPay: user.countPay,
        address_ref: haveParentNotPayEnough
          ? parentUser.walletAddress
          : referralCommissionWallet,
        address_from: user.walletAddress,
        address_to: referralCommissionWallet,
        hash: "",
        type: haveParentNotPayEnough ? "REFERRALHOLD" : "REFERRAL",
        status: "PENDING",
      });
      transIds.referral = transactionReferral._id;
    }
    if (listTransSuccess.length === 3) {
      step = 4;
      const registerTrans = listTransSuccess.find(
        (ele) => ele.type === "REGISTER"
      );
      transIds.register = registerTrans._id;

      const directTrans = listTransSuccess.find(
        (ele) => ele.type === "DIRECT" || ele.type === "DIRECTHOLD"
      );
      transIds.direct = directTrans._id;

      const referral = listTransSuccess.find(
        (ele) => ele.type === "REFERRAL" || ele.type === "REFERRALHOLD"
      );
      transIds.register = referral._id;
    }

    res.json({
      step,
      registerFee,
      directCommissionWallet,
      directCommissionFee,
      referralCommissionWallet,
      referralCommissionFee,
      transIds,
    });
  } else {
    res.status(404);
    throw new Error("User does not exist");
  }
});

const addPayment = asyncHandler(async (req, res) => {
  const { id, hash } = req.body;
  const transaction = await Transaction.findById(id);
  transaction.hash = hash || transaction.hash;
  transaction.status = "SUCCESS";
  const transactionUpdate = await transaction.save();

  if (transactionUpdate) {
    res.status(201).json({
      message: "Payment successful",
    });
  }
});

const onDonePayment = asyncHandler(async (req, res) => {
  const { transIds } = req.body;

  const transIdsList = Object.values(transIds);
  console.log({ transIdsList });
  for (let transId of transIdsList) {
    try {
      await Transaction.findOne({
        $and: [{ _id: transId }, { status: "SUCCESS" }],
      });
    } catch (err) {
      res.status(400);
      throw new Error("No transaction found");
    }
  }

  const user = await User.findOne({ _id: req.user.id }).select("-password");
  user.countPay = user.countPay + 1;
  if (user.countPay > 12) {
    user.tier = user.tier + 1;
  }

  const updatedUser = await user.save();

  if (updatedUser) {
    res.status(201).json({
      message: "Payment successful",
    });
  }
});

const getAllPayments = asyncHandler(async (req, res) => {
  const { pageNumber, keyword, status } = req.query;
  const page = Number(pageNumber) || 1;
  const searchStatus = status === "all" ? "" : status;

  const pageSize = 20;

  const count = await Transaction.countDocuments({
    $and: [
      {
        $or: [
          { userId: { $regex: keyword, $options: "i" } }, // Tìm theo userIds
          { address_from: { $regex: keyword, $options: "i" } }, // Tìm theo địa chỉ ví
          { address_to: { $regex: keyword, $options: "i" } }, // Tìm theo địa chỉ ví
        ],
      },
      {
        status: "SUCCESS",
      },
    ],
  });

  const allPayments = await Transaction.find({
    $and: [
      {
        $or: [
          { userId: { $regex: keyword, $options: "i" } }, // Tìm theo userId
          { address_from: { $regex: keyword, $options: "i" } }, // Tìm theo địa chỉ ví
          { address_to: { $regex: keyword, $options: "i" } }, // Tìm theo địa chỉ ví
        ],
      },
      {
        status: "SUCCESS",
      },
    ],
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort("-createdAt")
    .select("-password");

  const result = [];
  for (let pay of allPayments) {
    const user = await User.findById(pay.userId);
    result.push({
      _id: pay._id,
      address_from: pay.address_from,
      address_to: pay.address_to,
      hash: pay.hash,
      amount: pay.amount,
      userId: user.userId,
      email: user.email,
      type: pay.type,
      createdAt: pay.createdAt,
    });
  }

  res.json({
    payments: result,
    pages: Math.ceil(count / pageSize),
  });
});

const getPaymentsOfUser = asyncHandler(async (req, res) => {
  const { user } = req;
  const { pageNumber } = req.query;
  const page = Number(pageNumber) || 1;

  const pageSize = 20;

  const count = await Transaction.countDocuments({
    $and: [{ userId: user.id }, { status: "SUCCESS" }],
  });

  const allPayments = await Transaction.find({
    $and: [{ userId: user.id }, { status: "SUCCESS" }],
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort("-createdAt")
    .select("-password");

  res.json({
    payments: allPayments,
    pages: Math.ceil(count / pageSize),
  });
});

export {
  getPaymentInfo,
  addPayment,
  onDonePayment,
  getAllPayments,
  getPaymentsOfUser,
};

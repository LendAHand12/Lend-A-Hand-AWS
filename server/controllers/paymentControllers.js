import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import getParentWithCountPay from "../utils/getParentWithCountPay.js";
import Refund from "../models/refundModel.js";
import { checkCanIncreaseNextTier } from "../cronJob/index.js";
import { getActiveLink } from "../utils/getLinksActive.js";
import { sendActiveLink } from "../utils/sendMailCustom.js";
import { getParentUser, getRefParentUser } from "../utils/methods.js";

const getPaymentInfo = asyncHandler(async (req, res) => {
  const { user } = req;
  const { continueWithBuyPackageB } = req.query;
  if (user.tier === 1) {
    if (
      continueWithBuyPackageB === "true" &&
      user.buyPackage === "B" &&
      user.countPay === 7
    ) {
      user.continueWithBuyPackageB = true;
      await user.save();
    } else if (
      continueWithBuyPackageB === "false" &&
      user.buyPackage === "B" &&
      user.countPay === 7
    ) {
      user.continueWithBuyPackageB = false;
      await user.save();
    }
  }

  let haveParentNotPayEnough = false;
  let haveRefNotPayEnough = false;
  let parentWithCountPay;

  if (user) {
    if (user.countPay === 13) {
      const canIncreaseTier = await checkCanIncreaseNextTier(user);
      if (!canIncreaseTier) {
        res.status(404);
        throw new Error("You are not eligible for next step payment");
      }
    }
    const parentUser = await getParentUser(user._id, user.tier);
    const refUser = await getRefParentUser(user._id, user.tier);

    if (!parentUser || !refUser) {
      res.status(404);
      throw new Error("Parent not found");
    }

    let registerFee = user.countPay === 0 ? 7 * user.tier : 0;
    let directCommissionWallet = "";
    let directCommissionFee = 5 * user.tier;
    let referralCommissionWallet = "";
    let referralCommissionFee = 10 * user.tier;

    parentWithCountPay = await getParentWithCountPay(
      user.id,
      user.countPay,
      user.tier
    );

    if (user.tier >= 2 || user.buyPackage === "A") {
      if (user.countPay === 0) {
        directCommissionFee = 65 * user.tier;
        if (
          refUser.fine > 0 ||
          refUser.status === "LOCKED" ||
          refUser.tier < user.tier ||
          (refUser.tier === user.tier && refUser.countPay < 13)
        ) {
          directCommissionWallet = process.env.MAIN_WALLET_ADDRESS;
          haveRefNotPayEnough = true;
        } else {
          directCommissionWallet = refUser.walletAddress[0];
        }
      } else {
        const pendingTransPackage = await Transaction.findOne({
          tier: user.tier,
          type: "PACKAGE",
          userCountPay: user.countPay,
        });

        if (pendingTransPackage) {
          pendingTransPackage.status = "SUCCESS";
          await pendingTransPackage.save();
        }
      }
    } else if (user.tier === 1 && user.buyPackage === "B") {
      if (user.countPay === 0) {
        directCommissionFee = 35 * u.tier;
        if (
          refUser.fine > 0 ||
          refUser.status === "LOCKED" ||
          refUser.tier < user.tier ||
          (refUser.tier === user.tier && refUser.countPay < 7)
        ) {
          directCommissionWallet = process.env.MAIN_WALLET_ADDRESS;
          haveRefNotPayEnough = true;
        } else {
          directCommissionWallet = refUser.walletAddress[0];
        }
      } else if (user.countPay === 7 && user.continueWithBuyPackageB) {
        directCommissionFee = 30 * user.tier;
        if (
          refUser.fine > 0 ||
          refUser.status === "LOCKED" ||
          refUser.tier < user.tier ||
          (refUser.tier === user.tier && refUser.countPay < 13)
        ) {
          directCommissionWallet = process.env.MAIN_WALLET_ADDRESS;
          haveRefNotPayEnough = true;
        } else {
          directCommissionWallet = refUser.walletAddress[0];
        }
      }
      const pendingTransPackage = await Transaction.findOne({
        tier: user.tier,
        type: "PACKAGE",
        userCountPay: user.countPay,
      });

      if (pendingTransPackage) {
        pendingTransPackage.status = "SUCCESS";
        await pendingTransPackage.save();
      }
    } else if (user.tier === 1 && user.buyPackage === "C") {
      if (
        refUser.fine > 0 ||
        refUser.status === "LOCKED" ||
        refUser.tier < user.tier ||
        (refUser.tier === user.tier && refUser.countPay < user.countPay + 1)
      ) {
        directCommissionWallet = process.env.MAIN_WALLET_ADDRESS;
        haveRefNotPayEnough = true;
      } else {
        directCommissionWallet = refUser.walletAddress[0];
      }
    }

    // delete pending trans
    await Transaction.deleteMany({
      $and: [
        {
          status: "PENDING",
        },
        { userId: user.id },
      ],
    });

    if (user.countPay === 0) {
      if (user.tier >= 2) {
        if (
          refUser.fine > 0 ||
          refUser.status === "LOCKED" ||
          refUser.tier < user.tier ||
          (refUser.tier === user.tier && refUser.countPay < user.countPay + 1)
        ) {
          directCommissionWallet = process.env.MAIN_WALLET_ADDRESS;
          haveRefNotPayEnough = true;
        } else {
          directCommissionWallet = refUser.walletAddress[0];
        }
      }
      if (
        parentUser.fine > 0 ||
        parentUser.status === "LOCKED" ||
        parentUser.tier < user.tier ||
        (parentUser.tier === user.tier &&
          parentUser.countPay < user.countPay + 1)
      ) {
        referralCommissionWallet = process.env.MAIN_WALLET_ADDRESS;
        haveParentNotPayEnough = true;
      } else {
        referralCommissionWallet = parentUser.walletAddress[0];
      }
    } else {
      if (
        refUser.fine > 0 ||
        refUser.status === "LOCKED" ||
        refUser.tier < user.tier ||
        (refUser.tier === user.tier && refUser.countPay < user.countPay + 1)
      ) {
        directCommissionWallet = process.env.MAIN_WALLET_ADDRESS;
        haveRefNotPayEnough = true;
      } else {
        directCommissionWallet = refUser.walletAddress[0];
      }

      if (!parentWithCountPay) {
        referralCommissionWallet = process.env.MAIN_WALLET_ADDRESS;
      } else if (
        parentUser.fine > 0 ||
        parentUser.status === "LOCKED" ||
        parentWithCountPay.tier < user.tier ||
        (parentWithCountPay.tier === user.tier &&
          parentWithCountPay.countPay < user.countPay + 1)
      ) {
        referralCommissionWallet = process.env.MAIN_WALLET_ADDRESS;
        haveParentNotPayEnough = true;
      } else {
        referralCommissionWallet = parentWithCountPay.walletAddress[0];
      }
    }

    // if (user.userId === "THOALOCPHAT668") {
    haveParentNotPayEnough = true; // termp
    referralCommissionWallet = process.env.MAIN_WALLET_ADDRESS; // termp
    // }

    let transactionRegister = null;
    let transactionDirect = null;
    let transactionReferral = null;
    let transactionFine = null;

    const transIds = {};

    const listTransSuccess = await Transaction.find({
      $and: [
        { userId: user.id },
        { userCountPay: user.countPay },
        { status: "SUCCESS" },
        {
          type: { $ne: "FINE" },
        },
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
          address_from: user.walletAddress[0],
          address_to: process.env.MAIN_WALLET_ADDRESS,
          tier: user.tier,
          buyPackage: user.buyPackage,
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
        address_ref: refUser.walletAddress[0],
        address_from: user.walletAddress[0],
        address_to: directCommissionWallet,
        tier: user.tier,
        buyPackage: user.buyPackage,
        hash: "",
        type: haveRefNotPayEnough ? "DIRECTHOLD" : "DIRECT",
        status: "PENDING",
      });
      transIds.direct = transactionDirect._id;

      await generatePackageTrans(
        user,
        refUser,
        directCommissionWallet,
        user.continueWithBuyPackageB
      );

      transactionReferral = await Transaction.create({
        userId: user.id,
        amount: referralCommissionFee,
        userCountPay: user.countPay,
        address_ref: parentWithCountPay.walletAddress[0],
        address_from: user.walletAddress[0],
        address_to: referralCommissionWallet,
        tier: user.tier,
        buyPackage: user.buyPackage,
        hash: "",
        type: haveParentNotPayEnough ? "REFERRALHOLD" : "REFERRAL",
        status: "PENDING",
      });
      transIds.referral = transactionReferral._id;
    }
    if (listTransSuccess.length === 1) {
      if (user.countPay === 0) {
        step = 2;
        transIds.register = listTransSuccess[0]._id;
        transactionDirect = await Transaction.create({
          userId: user.id,
          amount: directCommissionFee,
          userCountPay: user.countPay,
          address_ref: refUser.walletAddress[0],
          address_from: user.walletAddress[0],
          address_to: directCommissionWallet,
          tier: user.tier,
          buyPackage: user.buyPackage,
          hash: "",
          type: haveRefNotPayEnough ? "DIRECTHOLD" : "DIRECT",
          status: "PENDING",
        });
        transIds.direct = transactionDirect._id;

        await generatePackageTrans(
          user,
          refUser,
          directCommissionWallet,
          user.continueWithBuyPackageB
        );

        transactionReferral = await Transaction.create({
          userId: user.id,
          amount: referralCommissionFee,
          userCountPay: user.countPay,
          address_ref: parentWithCountPay.walletAddress[0],
          address_from: user.walletAddress[0],
          address_to: referralCommissionWallet,
          tier: user.tier,
          buyPackage: user.buyPackage,
          hash: "",
          type: haveParentNotPayEnough ? "REFERRALHOLD" : "REFERRAL",
          status: "PENDING",
        });
        transIds.referral = transactionReferral._id;
      } else {
        step = 3;
        const directTrans = listTransSuccess.find(
          (ele) =>
            ele.type === "DIRECT" ||
            ele.type === "DIRECTHOLD" ||
            ele.type === "PACKAGE"
        );
        if (directTrans.type === "PACKAGE") {
          directCommissionFee = 0;
        }
        transIds.direct = directTrans._id;

        await generatePackageTrans(
          user,
          refUser,
          directCommissionWallet,
          user.continueWithBuyPackageB
        );

        transactionReferral = await Transaction.create({
          userId: user.id,
          amount: referralCommissionFee,
          userCountPay: user.countPay,
          address_ref: parentWithCountPay.walletAddress[0],
          address_from: user.walletAddress[0],
          address_to: referralCommissionWallet,
          tier: user.tier,
          buyPackage: user.buyPackage,
          hash: "",
          type: haveParentNotPayEnough ? "REFERRALHOLD" : "REFERRAL",
          status: "PENDING",
        });
        transIds.referral = transactionReferral._id;
      }
    }
    if (listTransSuccess.length === 2) {
      if (user.countPay === 0) {
        step = 3;
        const registerTrans = listTransSuccess.find(
          (ele) => ele.type === "REGISTER"
        );
        transIds.register = registerTrans._id;

        const directTrans = listTransSuccess.find(
          (ele) =>
            ele.type === "DIRECT" ||
            ele.type === "DIRECTHOLD" ||
            ele.type === "PACKAGE"
        );
        if (directTrans.type === "PACKAGE") {
          directCommissionFee = 0;
        }
        transIds.direct = directTrans._id;

        await generatePackageTrans(
          user,
          refUser,
          directCommissionWallet,
          user.continueWithBuyPackageB
        );

        transactionReferral = await Transaction.create({
          userId: user.id,
          amount: referralCommissionFee,
          userCountPay: user.countPay,
          address_ref: parentWithCountPay.walletAddress[0],
          address_from: user.walletAddress[0],
          address_to: referralCommissionWallet,
          tier: user.tier,
          buyPackage: user.buyPackage,
          hash: "",
          type: haveParentNotPayEnough ? "REFERRALHOLD" : "REFERRAL",
          status: "PENDING",
        });
        transIds.referral = transactionReferral._id;
      } else {
        step = 4;
        const directTrans = listTransSuccess.find(
          (ele) =>
            ele.type === "DIRECT" ||
            ele.type === "DIRECTHOLD" ||
            ele.buyPackage === "PACKAGE"
        );
        if (directTrans.type === "PACKAGE") {
          directCommissionFee = 0;
        }
        transIds.direct = directTrans._id;

        await generatePackageTrans(
          user,
          refUser,
          directCommissionWallet,
          user.continueWithBuyPackageB
        );

        const referral = listTransSuccess.find(
          (ele) => ele.type === "REFERRAL" || ele.type === "REFERRALHOLD"
        );
        transIds.register = referral._id;
      }
    }
    if (listTransSuccess.length === 3 && user.countPay === 0) {
      step = 4;
      const registerTrans = listTransSuccess.find(
        (ele) => ele.type === "REGISTER"
      );
      transIds.register = registerTrans._id;

      const directTrans = listTransSuccess.find(
        (ele) =>
          ele.type === "DIRECT" ||
          ele.type === "DIRECTHOLD" ||
          ele.type === "PACKAGE"
      );
      if (directTrans.type === "PACKAGE") {
        directCommissionFee = 0;
      }
      transIds.direct = directTrans._id;

      await generatePackageTrans(
        user,
        refUser,
        directCommissionWallet,
        user.continueWithBuyPackageB
      );

      const referral = listTransSuccess.find(
        (ele) => ele.type === "REFERRAL" || ele.type === "REFERRALHOLD"
      );
      transIds.register = referral._id;
    }

    if (user.fine > 0) {
      transactionFine = await Transaction.create({
        userId: user.id,
        amount: user.fine,
        userCountPay: user.countPay,
        address_ref: process.env.MAIN_WALLET_ADDRESS,
        address_from: user.walletAddress[0],
        address_to: process.env.MAIN_WALLET_ADDRESS,
        tier: user.tier,
        buyPackage: user.buyPackage,
        hash: "",
        type: "FINE",
        status: "PENDING",
      });
    }

    res.json({
      countPay: user.countPay,
      step,
      registerFee,
      directCommissionWallet,
      directCommissionFee,
      referralCommissionWallet,
      referralCommissionFee,
      transIds,
      transactionFine,
    });
  } else {
    res.status(404);
    throw new Error("User does not exist");
  }
});

const generatePackageTrans = async (
  user,
  refUser,
  directCommissionWallet,
  continueWithBuyPackageB
) => {
  const listPendingDirect = await Transaction.find({
    $and: [{ tier: user.tier, type: "PACKAGE", status: "SUCCESS" }],
  });

  const startIndexPackageTrans = listPendingDirect.length + 1;

  if (user.buyPackage === "A" || user.tier >= 2) {
    for (let i = startIndexPackageTrans; i <= 12; i++) {
      await Transaction.create({
        userId: user.id,
        amount: 0,
        userCountPay: i,
        address_ref: refUser.walletAddress[0],
        address_from: user.walletAddress[0],
        address_to: directCommissionWallet,
        tier: user.tier,
        buyPackage: user.buyPackage,
        hash: "",
        type: "PACKAGE",
        status: "PENDING",
      });
    }
  }
  if (user.tier === 1 && user.buyPackage === "B") {
    let count = 6;
    if (user.countPay >= 7 && continueWithBuyPackageB) {
      count = 12;
    }
    for (
      let i = count === 6 ? startIndexPackageTrans : startIndexPackageTrans + 1;
      i <= count;
      i++
    ) {
      await Transaction.create({
        userId: user.id,
        amount: 0,
        userCountPay: i,
        address_ref: refUser.walletAddress[0],
        address_from: user.walletAddress[0],
        address_to: directCommissionWallet,
        tier: user.tier,
        buyPackage: user.buyPackage,
        hash: "",
        type: "PACKAGE",
        status: "PENDING",
      });
    }
  }
};

const addPayment = asyncHandler(async (req, res) => {
  const { id, hash, type, transIds } = req.body;
  const transaction = await Transaction.findById(id);
  const user = await User.findById(transaction.userId);
  if (transaction.type === "FINE") {
    user.fine = 0;
    await user.save();
  }
  transaction.hash = hash || transaction.hash;
  transaction.status = "SUCCESS";
  const transactionUpdate = await transaction.save();

  if (type === "REFERRAL") {
    await onDonePayment(user, transIds);
  }

  if (transactionUpdate) {
    res.status(201).json({
      message: "Payment successful",
    });
  }
});

const onDonePayment = async (user, transIds) => {
  const transIdsList = Object.values(transIds);
  if (transIdsList.length > 0) {
    for (let transId of transIdsList) {
      try {
        await Transaction.findOne({
          $and: [
            { userId: user._id },
            { userCountPay: user.countPay },
            { _id: transId },
            { status: "SUCCESS" },
          ],
        });
      } catch (err) {
        throw new Error("No transaction found");
      }
    }

    if (user.countPay === 0) {
      const links = await getActiveLink(user.email, user.userId, user.phone);
      if (links.length === 1) {
        await sendActiveLink(user.email, links[0]);
      }
    }

    user.countPay = user.countPay + 1;

    const updatedUser = await user.save();

    if (updatedUser) {
      return;
    }
  } else {
    throw new Error("No transaction found");
  }
};

const getAllPayments = asyncHandler(async (req, res) => {
  const { pageNumber, keyword, status } = req.query;
  const page = Number(pageNumber) || 1;
  let searchType = {};
  if (
    status === "DIRECT" ||
    status === "REFERRAL" ||
    status === "REGISTER" ||
    status === "FINE"
  ) {
    searchType = { type: status };
  }
  if (status === "HOLD") {
    searchType = { type: { $regex: status, $options: "i" } };
  }

  const pageSize = 10;

  const count = await Transaction.countDocuments({
    $and: [
      {
        $or: [
          { userId: { $regex: keyword, $options: "i" } }, // Tìm theo userIds
          { address_from: { $regex: keyword, $options: "i" } }, // Tìm theo địa chỉ ví
          { address_to: { $regex: keyword, $options: "i" } }, // Tìm theo địa chỉ ví
        ],
      },
      { ...searchType },
      {
        status: "SUCCESS",
      },
      { type: { $ne: "PACKAGE" } },
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
      { ...searchType },
      {
        status: "SUCCESS",
      },
      { type: { $ne: "PACKAGE" } },
    ],
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort(status === "HOLD" ? "isHoldRefund -createdAt" : "-createdAt")
    .select("-password");

  const result = [];
  for (let pay of allPayments) {
    let user = await User.findById(pay.userId);
    if (status === "REGISTER" || status === "FINE") {
      result.push({
        _id: pay._id,
        address_from: pay.address_from,
        tier: pay.tier,
        // hash: pay.hash,
        amount: pay.amount,
        userId: user.userId,
        email: user.email,
        type: pay.type,
        createdAt: pay.createdAt,
      });
    } else if (status === "DIRECT" || status === "REFERRAL") {
      const userRef = await User.findOne({
        walletAddress: { $in: [pay.address_ref] },
      });
      result.push({
        _id: pay._id,
        address_from: pay.address_from,
        tier: pay.tier,
        // hash: pay.hash,
        amount: pay.amount,
        userId: user.userId,
        email: user.email,
        userReceiveId: userRef ? userRef.userId : "Unknow",
        userReceiveEmail: userRef ? userRef.email : "Unknow",
        userCountPay: pay.userCountPay,
        type: pay.type,
        createdAt: pay.createdAt,
      });
    } else if (status === "HOLD") {
      const userRef = await User.findOne({
        walletAddress: { $in: [pay.address_ref] },
      });
      result.push({
        _id: pay._id,
        address_from: pay.address_from,
        tier: pay.tier,
        // hash: pay.hash,
        amount: pay.amount,
        userId: user.userId,
        email: user.email,
        userReceiveId: userRef ? userRef.userId : "Unknow",
        userReceiveEmail: userRef ? userRef.email : "Unknow",
        type: pay.type,
        userCountPay: pay.userCountPay,
        createdAt: pay.createdAt,
        isHoldRefund: pay.isHoldRefund,
      });
    }
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
    $and: [
      { userId: user.id },
      { status: "SUCCESS" },
      { type: { $ne: "PACKAGE" } },
    ],
  });

  const allPayments = await Transaction.find({
    $and: [
      { userId: user.id },
      { status: "SUCCESS" },
      { type: { $ne: "PACKAGE" } },
    ],
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

const getPaymentDetail = asyncHandler(async (req, res) => {
  const trans = await Transaction.findById(req.params.id);
  if (trans) {
    let user = await User.findById(trans.userId);
    if (trans.type === "REGISTER") {
      res.json({
        _id: trans._id,
        address_from: trans.address_from,
        hash: trans.hash,
        amount: trans.amount,
        userId: user.userId,
        email: user.email,
        type: trans.type,
        status: trans.status,
        createdAt: trans.createdAt,
      });
    } else if (trans.type === "DIRECT" || trans.type === "REFERRAL") {
      const userRef = await User.findOne({
        walletAddress: { $in: [trans.address_ref] },
      });
      res.json({
        _id: trans._id,
        address_from: trans.address_from,
        address_to: trans.address_ref,
        hash: trans.hash,
        amount: trans.amount,
        userId: user.userId,
        email: user.email,
        userReceiveId: userRef.userId,
        userReceiveEmail: userRef.email,
        type: trans.type,
        status: trans.status,
        userCountPay: trans.userCountPay,
        createdAt: trans.createdAt,
      });
    } else if (trans.type === "DIRECTHOLD" || trans.type === "REFERRALHOLD") {
      const userRef = await User.findOne({
        walletAddress: { $in: [trans.address_ref] },
      });
      res.json({
        _id: trans._id,
        address_from: trans.address_from,
        address_to: trans.address_ref,
        hash: trans.hash,
        amount: trans.amount,
        userId: user.userId,
        email: user.email,
        userReceiveId: userRef ? userRef.userId : "Unknow",
        userReceiveEmail: userRef ? userRef.email : "Unknow",
        type: trans.type,
        status: trans.status,
        userCountPay: trans.userCountPay,
        createdAt: trans.createdAt,
        isHoldRefund: trans.isHoldRefund,
      });
    }
  } else {
    res.status(404);
    throw new Error("Transaction does not exist");
  }
});

const checkCanRefundPayment = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const trans = await Transaction.findById(id);
  if (trans) {
    const { userCountPay, address_ref } = trans;
    const userReceive = await User.findOne({
      walletAddress: { $in: [address_ref] },
    });
    if (userReceive) {
      if (userReceive.status === "LOCKED") {
        res.status(404);
        throw new Error(`User parent locked`);
      } else if (userReceive.countPay - 1 < userCountPay) {
        res.status(404);
        throw new Error(
          userReceive.countPay === 0
            ? `User parent NOT FINISHED REGISTER`
            : `User parent pay = ${
                userReceive.countPay - 1
              } time but user pay = ${userCountPay} time`
        );
      } else {
        res.json({
          message: "User is OK for a refund",
        });
      }
    } else {
      res.status(404);
      throw new Error("Cannot get user parent");
    }
  } else {
    res.status(404);
    throw new Error("Transaction does not exist");
  }
});

const changeToRefunded = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const trans = await Transaction.findById(id);
  if (trans) {
    trans.isHoldRefund = true;
    await trans.save();
    res.json({
      message: "Update successful",
    });
  } else {
    res.status(404);
    throw new Error("Transaction does not exist");
  }
});

const onAdminDoneRefund = asyncHandler(async (req, res) => {
  const { transId, transHash, transType, fromWallet, receiveWallet } = req.body;
  const trans = await Transaction.findById(transId);
  if (trans) {
    trans.isHoldRefund = true;
    await trans.save();

    const refund = await Refund.create({
      transId: transId,
      hash: transHash,
      address_from: fromWallet,
      address_to: receiveWallet,
      type: transType,
    });

    res.json({
      message: "Refund successful",
    });
  } else {
    res.status(404);
    throw new Error("Transaction does not exist");
  }
});

const findUserOtherParentId = asyncHandler(async (req, res) => {
  console.log("getting....");
  const listUsers = await User.find({ $and: [{ isAdmin: false }] });

  const result = [];
  for (let u of listUsers) {
    if (u.children.length > 0) {
      for (let childId of u.children) {
        const child = await User.findById(childId);
        if (child.parentId.toString() !== u.parentId.toString()) {
          result.push({ child: childId, parent: u._id });
        }
      }
    }
  }

  res.json(result);
});

const getParentWithCount = asyncHandler(async (req, res) => {
  const { id, countPay } = req.body;

  const parent = await getParentWithCountPay(id, countPay);

  res.json(parent);
});

const getAllTransForExport = asyncHandler(async (req, res) => {
  const trans = await Transaction.aggregate([
    {
      $match: {
        status: "SUCCESS",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "address_from",
        foreignField: "walletAddress",
        as: "sender",
      },
    },
    { $unwind: "$sender" },
    {
      $lookup: {
        from: "users",
        localField: "address_ref",
        foreignField: "walletAddress",
        as: "receiver",
      },
    },
    { $unwind: "$receiver" },
    {
      $project: {
        _id: 0,
        type: 1,
        amount: 1,
        isHoldRefund: 1,
        status: 1,
        createdAt: 1,
        address_from: 1,
        tier: 1,
        address_ref: 1,
        senderName: "$sender.userId",
        senderEmail: "$sender.email",
        receiverName: "$receiver.userId",
        receiverEmail: "$receiver.email",
      },
    },
  ]);

  res.json(trans);
});

export {
  getPaymentInfo,
  addPayment,
  getAllPayments,
  getPaymentsOfUser,
  getPaymentDetail,
  checkCanRefundPayment,
  changeToRefunded,
  onAdminDoneRefund,
  findUserOtherParentId,
  getParentWithCount,
  getAllTransForExport,
};

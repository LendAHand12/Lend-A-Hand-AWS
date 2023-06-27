import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userCountPay: {
      type: Number,
    },
    address_ref: {
      type: String,
    },
    address_from: {
      type: String,
      required: true,
    },
    address_to: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    type: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    isHoldRefund: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;

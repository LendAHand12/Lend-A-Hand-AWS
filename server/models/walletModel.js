import mongoose from "mongoose";

const walletSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["REGISTER", "ADMIN", "HOLD"],
      default: "ADMIN",
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    updateAgent: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;

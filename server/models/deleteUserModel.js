import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const deleteUserSchema = mongoose.Schema(
  {
    oldId: {
      type: String,
    },
    walletAddress: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    parentId: {
      type: String,
    },
    refId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const DeleteUser = mongoose.model("DeleteUser", deleteUserSchema);

export default DeleteUser;

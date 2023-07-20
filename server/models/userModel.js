import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    walletAddress: {
      type: Array,
      // unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
    tier: {
      type: Number,
      default: 0,
    },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "children" }],
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    avatar: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "UNVERIFY",
    },
    imgFront: {
      type: String,
      default: "",
    },
    imgBack: {
      type: String,
      default: "",
    },
    fine: {
      type: Number,
      default: 0,
    },
    countPay: {
      type: Number,
      default: 0,
    },
    countChild: {
      type: Number,
      default: 0,
    },
    phone: {
      type: String,
      default: "",
    },
    currentLayer: {
      type: Number,
      default: 0,
    },
    oldLayer: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// function to check of passwords are matching
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// encrypt password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  next();
});

const User = mongoose.model("User", userSchema);

export default User;

import mongoose from "mongoose";

const commonSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: true,
      default: {},
    },
  },
  { timestamps: true }
);

const Common = mongoose.model("Common", commonSchema);

export default Common;

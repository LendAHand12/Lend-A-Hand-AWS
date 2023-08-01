import mongoose from "mongoose";

// store the refresh tokens in the db
const treeSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

const Tree = mongoose.model("Tree", treeSchema);

export default Tree;

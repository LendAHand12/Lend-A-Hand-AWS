import mongoose from "mongoose";

// store the refresh tokens in the db
const pagePreviewSchema = mongoose.Schema(
  {
    pageName: {
      type: String,
      require: true,
      unique: true,
    },
    path: {
      type: String,
      require: true,
      unique: true,
    },
    content_vn: {
      type: String,
      require: false,
    },
    content_en: {
      type: String,
      require: false,
    },
    type: {
      type: String,
      require: true,
      enum: ["admin", "user", "cms"],
    },
    actions: [
      { type: String, enum: ["read", "update", "delete", "approve", "export"] },
    ],
    images: {
      type: Array,
    },
    haveImage: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const PagePreview = mongoose.model("PagePreview", pagePreviewSchema);

export default PagePreview;

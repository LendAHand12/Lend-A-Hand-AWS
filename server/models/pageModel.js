import mongoose from "mongoose";

// store the refresh tokens in the db
const pageSchema = mongoose.Schema(
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
    pathEdit: {
      type: String,
      require: false,
    },
    content: {
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
  },
  { timestamps: true }
);

const Page = mongoose.model("Page", pageSchema);

export default Page;

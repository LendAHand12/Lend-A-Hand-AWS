import mongoose from "mongoose";

// store the refresh tokens in the db
const permissionSchema = mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["USER", "ADMIN", "ADMIN1", "ADMIN2"],
      require: true,
      unique: true,
    },
    pagePermissions: [
      {
        pageName: { type: String },
        actions: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;

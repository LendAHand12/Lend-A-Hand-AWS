import express from "express";
import {
  getPermissions,
  createPermission,
  updatePermission,
} from "../controllers/permissionControllers.js";
import { isAdmin, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getPermissions)
  .post(createPermission)
  .put(updatePermission);

export default router;

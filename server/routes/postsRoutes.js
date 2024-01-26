import express from "express";
import {
  createPosts,
  getAllPosts,
  getPostById,
  updatePosts,
} from "../controllers/postControllers.js";
import { isAdmin, protectRoute } from "../middleware/authMiddleware.js";
import uploadLocal from "../middleware/uploadLocal.js";

const router = express.Router();

router
  .route("/")
  .get(protectRoute, getAllPosts)
  .post(
    uploadLocal.fields([
      { name: "file_vn", maxCount: 1 },
      ,
      { name: "file_en", maxCount: 1 },
    ]),
    protectRoute,
    isAdmin,
    createPosts
  );

router
  .route("/:id")
  .get(protectRoute, getPostById)
  .put(
    uploadLocal.fields([
      { name: "file_vn", maxCount: 1 },
      ,
      { name: "file_en", maxCount: 1 },
    ]),
    protectRoute,
    isAdmin,
    updatePosts
  );

export default router;

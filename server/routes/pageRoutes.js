import express from "express";
import { getAllPages, createPage } from "../controllers/pageControllers.js";
import { isAdmin, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllPages).post(createPage);

export default router;

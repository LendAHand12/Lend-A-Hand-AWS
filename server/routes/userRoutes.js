import express from "express";
import {
  getUserProfile,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
  changeStatusUser,
  getTree,
  getListChildOfUser,
  getTreeOfUser,
  getChildsOfUserForTree,
  getAllUsersWithKeyword,
  changeSystem,
  getChildrenList,
} from "../controllers/userControllers.js";
import { protectRoute, isAdmin } from "../middleware/authMiddleware.js";
import uploadCloud from "../middleware/uploadCloud.js";

const router = express.Router();

router.route("/").get(protectRoute, isAdmin, getAllUsers);
router.route("/profile").get(protectRoute, getUserProfile);
router.route("/status").put(protectRoute, isAdmin, changeStatusUser);
router.route("/tree").get(protectRoute, getTree);
router.route("/tree/:id").get(protectRoute, isAdmin, getTreeOfUser);
router.route("/treeNode").post(protectRoute, getChildsOfUserForTree);
router.route("/changeSystem").post(protectRoute, isAdmin, changeSystem);

router
  .route("/getAllUsersWithKeyword")
  .post(protectRoute, isAdmin, getAllUsersWithKeyword);
router.route("/listChild").get(protectRoute, getListChildOfUser);

router
  .route("/:id")
  .delete(protectRoute, isAdmin, deleteUser)
  .get(protectRoute, isAdmin, getUserById)
  .put(
    protectRoute,
    uploadCloud.fields([
      { name: "imgFront", maxCount: 1 },
      { name: "imgBack", maxCount: 1 },
    ]),
    updateUser
  );

export default router;

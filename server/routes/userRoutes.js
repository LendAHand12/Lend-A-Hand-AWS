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
  getAllDeletedUsers,
  getAllUsersForExport,
  mailForChangeWallet,
  changeWallet,
  adminUpdateUser,
  adminDeleteUser,
  onAcceptIncreaseTier,
} from "../controllers/userControllers.js";
import { protectRoute, isAdmin } from "../middleware/authMiddleware.js";
import uploadCloud from "../middleware/uploadCloud.js";

const router = express.Router();

router.route("/").get(protectRoute, isAdmin, getAllUsers);
router
  .route("/getAllDeletedUsers")
  .get(protectRoute, isAdmin, getAllDeletedUsers);
router.route("/profile").get(protectRoute, getUserProfile);
router
  .route("/changeWallet")
  .get(protectRoute, mailForChangeWallet)
  .post(protectRoute, changeWallet);
router.route("/status").put(protectRoute, isAdmin, changeStatusUser);
router.route("/tree").get(protectRoute, getTree);
router.route("/tree/:id").get(protectRoute, isAdmin, getTreeOfUser);
router.route("/treeNode").post(protectRoute, getChildsOfUserForTree);
router.route("/changeSystem").post(protectRoute, isAdmin, changeSystem);
router
  .route("/getAllUsersForExport")
  .get(protectRoute, isAdmin, getAllUsersForExport);

router
  .route("/getAllUsersWithKeyword")
  .post(protectRoute, isAdmin, getAllUsersWithKeyword);
router.route("/listChild").get(protectRoute, getListChildOfUser);

router
  .route("/:id")
  .delete(protectRoute, isAdmin, adminDeleteUser)
  .get(protectRoute, isAdmin, getUserById)
  .put(
    protectRoute,
    uploadCloud.fields([
      { name: "imgFront", maxCount: 1 },
      { name: "imgBack", maxCount: 1 },
    ]),
    updateUser
  );

router.route("/update/:id").post(protectRoute, isAdmin, adminUpdateUser);

router.route("/tier/increase").post(protectRoute, onAcceptIncreaseTier);

export default router;

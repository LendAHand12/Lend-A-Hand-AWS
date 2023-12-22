import asyncHandler from "express-async-handler";
import Permission from "../models/permissionModel.js";

const getPermissions = asyncHandler(async (req, res) => {
  const { role } = req.user;
  const permissions = await Permission.findOne({ role });

  res.json({
    permissions,
  });
});

const createPermission = asyncHandler(async (req, res) => {
  const { role, pagePermissions } = req.body;

  try {
    await Permission.create({ role, pagePermissions });
    res.status(200).json({
      message: "Created permissions",
    });
  } catch (error) {
    res.status(400);
    throw new Error("Internal error");
  }
});

const updatePermission = asyncHandler(async (req, res) => {
  const { role, pagePermissions } = req.body;

  try {
    const permission = await Permission.findOne({ role });
    permission.pagePermissions = pagePermissions;
    await permission.save();
    res.status(200).json({
      message: "Updated permissions",
    });
  } catch (error) {
    res.status(400);
    throw new Error("Internal error");
  }
});

export { getPermissions, createPermission, updatePermission };

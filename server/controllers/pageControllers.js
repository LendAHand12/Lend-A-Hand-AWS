import asyncHandler from "express-async-handler";
import Page from "../models/pageModel.js";

const getAllPages = asyncHandler(async (req, res) => {
  const pages = await Page.find();

  res.json({
    pages,
  });
});

const createPage = asyncHandler(async (req, res) => {
  const { pageName, actions, path } = req.body;

  try {
    await Page.create({ pageName, actions, path });
    res.status(200).json({
      message: "Created page",
    });
  } catch (error) {
    res.status(400);
    throw new Error("Internal error");
  }
});

const getPageDetailsPageName = asyncHandler(async (req, res) => {
  const pageName = req.params.pageName;
  const page = await Page.findOne({ pageName });

  res.json({
    page,
  });
});

export { getAllPages, createPage, getPageDetailsPageName };

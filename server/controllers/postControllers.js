import asyncHandler from "express-async-handler";
import Post from "../models/postModel.js";

const createPosts = async (req, res) => {
  const { title_vn, title_en, text_vn, text_en, type, category } = req.body;

  const files = req.files;

  try {
    var filename_vn = "";
    if (files.file_vn) {
      filename_vn = files.file_vn[0].filename;
    }

    var filename_en = "";
    if (files.file_en) {
      filename_en = files.file_en[0].filename;
    }

    await Post.create({
      title_vn,
      title_en,
      text_vn,
      text_en,
      cid: req.user.id,
      type,
      filename_vn,
      filename_en,
      category,
      status: "PUBLIC",
    });

    res.status(200).json({
      message: "saved successful",
    });
  } catch (err) {
    res.status(400);
    throw new Error("Internal error");
  }
};

const getAllPosts = asyncHandler(async (req, res) => {
  const { pageNumber, keyword, category } = req.query;
  const page = Number(pageNumber) || 1;
  const searchStatus = category === "all" ? "" : category;

  const pageSize = 20;

  const count = await Post.countDocuments({
    $and: [
      {
        $or: [
          { title_vn: { $regex: keyword, $options: "i" } },
          { title_en: { $regex: keyword, $options: "i" } },
        ],
      },
      {
        category: { $regex: searchStatus, $options: "i" },
      },
    ],
  });
  const allPosts = await Post.find({
    $and: [
      {
        $or: [
          { title_vn: { $regex: keyword, $options: "i" } },
          { title_en: { $regex: keyword, $options: "i" } },
        ],
      },
      {
        category: { $regex: searchStatus, $options: "i" },
      },
    ],
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort("-createdAt");

  res.json({
    list: allPosts,
    pages: Math.ceil(count / pageSize),
  });
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error("Posts does not exist");
  }
});

const updatePosts = asyncHandler(async (req, res) => {
  const { title_vn, title_en, text_vn, text_en, type, category } = req.body;
  const post = await Post.findOne({ _id: req.params.id });

  if (post) {
    post.title_vn = title_vn || post.title_vn;
    post.title_en = title_en || post.title_en;
    post.text_vn = text_vn || post.text_vn;
    post.text_en = text_en || post.text_en;
    post.type = type || post.type;
    post.category = category || post.category;

    const files = req.files;

    if (files) {
      let filename_vn = "";
      if (files.file_vn) {
        filename_vn = files.file_vn[0].filename;
        post.filename_vn = filename_vn || post.filename_vn;
      }

      let filename_en = "";
      if (files.file_en) {
        filename_en = files.file_en[0].filename;
        post.filename_en = filename_en || post.filename_en;
      }
    }

    const updatedPost = await post.save();
    if (updatedPost) {
      res.status(200).json({
        message: "Update successful",
        data: updatedPost,
      });
    }
  } else {
    res.status(400).json({ error: "User not found" });
  }
});

export { createPosts, getAllPosts, getPostById, updatePosts };

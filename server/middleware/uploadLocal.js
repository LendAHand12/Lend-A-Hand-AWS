import multer from "multer";
import crypto from "crypto";
import path from "path";

// UPLOAD IMAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/KYC");
  },
  filename: function (req, file, cb) {
    // Tạo chuỗi ngẫu nhiên
    const randomString = crypto.randomBytes(16).toString("hex");
    // Lấy phần mở rộng của file
    const fileExtension = path.extname(file.originalname);
    // Đặt tên mới cho file
    const fileName = `${randomString}${fileExtension}`;
    cb(null, fileName);
  },
});

const uploadLocal = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      return cb(new Error("File are'n allowed!"));
    }
  },
});

export default uploadLocal;

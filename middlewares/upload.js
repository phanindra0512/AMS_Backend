// middlewares/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads/receipts";

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const ext = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (ext) cb(null, true);
  else cb(new Error("Only images or PDF allowed"));
};

module.exports = multer({ storage, fileFilter });

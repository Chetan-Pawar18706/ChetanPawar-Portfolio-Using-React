const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const requireAdmin = require("../middleware/auth");

const router = express.Router();
const assetsDir = path.join(__dirname, "..", "assets");
fs.mkdirSync(assetsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, assetsDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${timestamp}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

router.post("/", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const fileUrl = `/assets/${req.file.filename}`;
  return res.status(201).json({
    url: fileUrl,
    name: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
  });
});

module.exports = router;

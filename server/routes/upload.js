const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const requireAdmin = require("../middleware/auth");

const router = express.Router();
const assetsDir = path.join(__dirname, "..", "assets");
fs.mkdirSync(assetsDir, { recursive: true });

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, assetsDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const title = slugify(req.body.title || req.body.name || "asset");
    const extension = path.extname(file.originalname) || ".bin";
    const fileName = `${timestamp}-${title || "asset"}${extension}`;
    cb(null, fileName);
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

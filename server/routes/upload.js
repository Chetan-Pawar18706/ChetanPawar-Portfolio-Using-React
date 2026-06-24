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
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${safeName}`);
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

  let finalFilename = req.file.filename;
  const title = String(req.body.title || "").trim();

  if (title) {
    const slugifiedTitle = slugify(title);
    if (slugifiedTitle) {
      const extension = path.extname(req.file.originalname);
      const timestamp = Date.now();
      const newFilename = `${timestamp}-${slugifiedTitle}${extension}`;
      const oldPath = req.file.path;
      const newPath = path.join(assetsDir, newFilename);

      try {
        fs.renameSync(oldPath, newPath);
        finalFilename = newFilename;
      } catch (err) {
        console.error("File rename failed:", err);
      }
    }
  }

  const fileUrl = `/assets/${finalFilename}`;
  return res.status(201).json({
    url: fileUrl,
    name: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
  });
});

module.exports = router;

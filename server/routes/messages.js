const express = require("express");
const ContactMessage = require("../models/ContactMessage");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function normalizeMessage(body) {
  return {
    name: String(body.name || "").trim(),
    contact: String(body.contact || "").trim(),
    subject: String(body.subject || "").trim(),
    message: String(body.message || "").trim(),
  };
}

router.post("/", asyncHandler(async (req, res) => {
  const payload = normalizeMessage(req.body);
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const phonePattern = /^[+\d][\d\s()-]{7,}$/;

  if (!payload.name || !payload.contact || !payload.subject || !payload.message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!emailPattern.test(payload.contact) && !phonePattern.test(payload.contact)) {
    return res.status(400).json({ message: "Enter a valid email or phone number" });
  }

  const saved = await ContactMessage.create(payload);
  res.status(201).json({ message: "Message saved", id: saved._id });
}));

router.get("/", requireAdmin, asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
  res.json(messages);
}));

router.patch("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const updates = {};
  if (typeof req.body.read === "boolean") updates.read = req.body.read;
  if (typeof req.body.replied === "boolean") updates.replied = req.body.replied;

  const message = await ContactMessage.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  res.json(message);
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  res.json({ message: "Message deleted" });
}));

module.exports = router;

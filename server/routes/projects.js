const express = require("express");
const Project = require("../models/Project");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function normalizeProject(body) {
  return {
    title: body.title,
    desc: body.desc,
    image: body.image,
    tech: Array.isArray(body.tech)
      ? body.tech
      : String(body.tech || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    live: body.live || "#",
    code: body.code || "#",
    published: body.published !== false,
  };
}

router.get("/", asyncHandler(async (req, res) => {
  const filter = req.query.all === "true" ? {} : { published: true };
  const projects = await Project.find(filter).sort({ createdAt: -1 });
  res.json(projects);
}));

router.post("/", requireAdmin, asyncHandler(async (req, res) => {
  const project = await Project.create(normalizeProject(req.body));
  res.status(201).json(project);
}));

router.put("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, normalizeProject(req.body), {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(project);
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json({ message: "Project deleted" });
}));

module.exports = router;

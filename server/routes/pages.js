const express = require("express");
const mongoose = require("mongoose");
const { allowedSlugs, getPageModel, pageModels } = require("../models/PageContent");
const requireAdmin = require("../middleware/auth");
const { getFallbackPage } = require("../fallbackPages");

const router = express.Router();
const allowedSlugSet = new Set(allowedSlugs);

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function hasMongoConnection() {
  return mongoose.connection.readyState === 1;
}

function normalizeItem(body, existing = {}) {
  return {
    category: String(body.category || "general").trim().toLowerCase(),
    title: body.title || "",
    text: body.text || "",
    image: body.image || "",
    url: body.url || "",
    items: Array.isArray(body.items)
      ? body.items
      : String(body.items || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
    published: body.published !== false,
    agree: body.agree !== undefined ? Number(body.agree) : existing.agree || 0,
    disagree: body.disagree !== undefined ? Number(body.disagree) : existing.disagree || 0,
  };
}

function validateSlug(req, res, next) {
  const slug = String(req.params.slug || "").toLowerCase();

  if (!allowedSlugSet.has(slug)) {
    return res.status(404).json({ message: "Page not found" });
  }

  req.pageSlug = slug;
  req.PageModel = getPageModel(slug);
  return next();
}

router.get(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const groups = await Promise.all(
      Object.entries(pageModels).map(async ([slug, Model]) => {
        const items = await Model.find({}).sort({ order: 1, createdAt: -1 });
        return items.map((item) => ({ ...item.toObject(), slug }));
      })
    );

    const items = groups.flat().sort((a, b) => a.slug.localeCompare(b.slug) || a.order - b.order);
    res.json(items);
  })
);

router.get(
  "/:slug",
  validateSlug,
  asyncHandler(async (req, res) => {
    const includeUnpublished = req.query.all === "true";
    const fallback = getFallbackPage(req.pageSlug, includeUnpublished);

    if (!hasMongoConnection()) {
      return res.json(fallback);
    }

    const filter = includeUnpublished ? {} : { published: true };
    const items = await req.PageModel.find(filter).sort({ order: 1, createdAt: -1 });
    return res.json(items.length ? items : fallback);
  })
);

router.post(
  "/:slug",
  requireAdmin,
  validateSlug,
  asyncHandler(async (req, res) => {
    const item = await req.PageModel.create(normalizeItem(req.body));
    res.status(201).json(item);
  })
);

router.post(
  "/:slug/:id/vote",
  validateSlug,
  asyncHandler(async (req, res) => {
    if (req.pageSlug !== "blog") {
      return res.status(404).json({ message: "Voting is only supported for blog items." });
    }

    const type = String(req.body.type || "").trim().toLowerCase();
    const previousVote = String(req.body.previousVote || "").trim().toLowerCase();

    if (!["agree", "disagree"].includes(type)) {
      return res.status(400).json({ message: "Invalid vote type." });
    }

    const update = {};
    if (previousVote === type) {
      update.$inc = { [type]: -1 };
    } else if (previousVote && ["agree", "disagree"].includes(previousVote)) {
      update.$inc = { [previousVote]: -1, [type]: 1 };
    } else {
      update.$inc = { [type]: 1 };
    }

    const item = await req.PageModel.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!item) {
      return res.status(404).json({ message: "Content item not found" });
    }

    return res.json({ agree: item.agree, disagree: item.disagree });
  })
);

router.put(
  "/:slug/:id",
  requireAdmin,
  validateSlug,
  asyncHandler(async (req, res) => {
    const existing = await req.PageModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Content item not found" });
    }

    const item = await req.PageModel.findByIdAndUpdate(req.params.id, normalizeItem(req.body, existing), {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ message: "Content item not found" });
    }

    return res.json(item);
  })
);

router.delete(
  "/:slug/:id",
  requireAdmin,
  validateSlug,
  asyncHandler(async (req, res) => {
    const item = await req.PageModel.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Content item not found" });
    }

    return res.json({ message: "Content item deleted" });
  })
);

module.exports = router;

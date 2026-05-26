const express = require("express");
const { allowedSlugs, getPageModel, pageModels } = require("../models/PageContent");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

const allowedSlugSet = new Set(allowedSlugs);

function normalizeItem(body, slug) {
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
  };
}

function validateSlug(req, res, next) {
  const slug = String(req.params.slug || "").toLowerCase();
  if (!allowedSlugSet.has(slug)) {
    return res.status(404).json({ message: "Page not found" });
  }
  req.pageSlug = slug;
  req.PageModel = getPageModel(slug);
  next();
}

router.get("/", requireAdmin, async (req, res) => {
  const groups = await Promise.all(
    Object.entries(pageModels).map(async ([slug, Model]) => {
      const items = await Model.find({}).sort({ order: 1, createdAt: -1 });
      return items.map((item) => ({ ...item.toObject(), slug }));
    })
  );
  const items = groups.flat().sort((a, b) => a.slug.localeCompare(b.slug) || a.order - b.order);
  res.json(items);
});

router.get("/:slug", validateSlug, async (req, res) => {
  const filter = req.query.all === "true" ? {} : { published: true };
  const items = await req.PageModel.find(filter).sort({ order: 1, createdAt: -1 });
  res.json(items);
});

router.post("/:slug", requireAdmin, validateSlug, async (req, res) => {
  const item = await req.PageModel.create(normalizeItem(req.body, req.pageSlug));
  res.status(201).json(item);
});

router.put("/:slug/:id", requireAdmin, validateSlug, async (req, res) => {
  const item = await req.PageModel.findByIdAndUpdate(
    req.params.id,
    normalizeItem(req.body, req.pageSlug),
    { new: true, runValidators: true }
  );

  if (!item) {
    return res.status(404).json({ message: "Content item not found" });
  }

  res.json(item);
});

router.delete("/:slug/:id", requireAdmin, validateSlug, async (req, res) => {
  const item = await req.PageModel.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Content item not found" });
  }

  res.json({ message: "Content item deleted" });
});

module.exports = router;

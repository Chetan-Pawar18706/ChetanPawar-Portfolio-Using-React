const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: "general",
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    text: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    url: {
      type: String,
      default: "",
      trim: true,
    },
    items: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
    agree: {
      type: Number,
      default: 0,
    },
    disagree: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

contentSchema.index({ category: 1, order: 1 });

const pageModels = {
  home: mongoose.model("HomeContent", contentSchema, "home_contents"),
  gallery: mongoose.model("GalleryItem", contentSchema, "gallery_items"),
  blog: mongoose.model("BlogPost", contentSchema, "blog_posts"),
  skills: mongoose.model("SkillContent", contentSchema, "skill_contents"),
  certificates: mongoose.model("Certificate", contentSchema, "certificates"),
  resume: mongoose.model("ResumeContent", contentSchema, "resume_contents"),
  about: mongoose.model("AboutContent", contentSchema, "about_contents"),
  contact: mongoose.model("ContactContent", contentSchema, "contact_contents"),
};

function getPageModel(slug) {
  return pageModels[slug] || null;
}

module.exports = {
  allowedSlugs: Object.keys(pageModels),
  getPageModel,
  pageModels,
};

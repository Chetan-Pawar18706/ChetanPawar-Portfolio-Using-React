require("dotenv").config();

const { connectDB } = require("./db");
const { pageModels } = require("./models/PageContent");

const ABSOLUTE_OR_SPECIAL_URL = /^(https?:|data:|mailto:|tel:|\/\/|#)/i;
const LOCAL_URL = /^(https?:)\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(?::\d+)?(\/.*)?$/i;

function normalizePublicUrl(source) {
  const trimmed = String(source || "").trim();
  if (!trimmed) return "";

  const localMatch = trimmed.match(LOCAL_URL);
  if (localMatch) {
    return localMatch[3] || "/";
  }

  if (ABSOLUTE_OR_SPECIAL_URL.test(trimmed) || trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/${trimmed.replace(/^\/+/, "")}`;
}

function normalizeDocValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizePublicUrl(item));
  }

  if (typeof value === "string") {
    return normalizePublicUrl(value);
  }

  return value;
}

async function migrateCollection(slug, Model) {
  const items = await Model.find().lean();
  let updatedCount = 0;

  for (const item of items) {
    const updates = {};
    const image = normalizeDocValue(item.image);
    const url = normalizeDocValue(item.url);
    const itemsArray = normalizeDocValue(item.items);

    if (image !== item.image) {
      updates.image = image;
    }

    if (url !== item.url) {
      updates.url = url;
    }

    if (Array.isArray(itemsArray) && JSON.stringify(itemsArray) !== JSON.stringify(item.items)) {
      updates.items = itemsArray;
    }

    if (Object.keys(updates).length > 0) {
      await Model.updateOne({ _id: item._id }, { $set: updates });
      updatedCount += 1;
      console.log(`Updated ${slug} document ${item._id}:`, updates);
    }
  }

  return updatedCount;
}

async function run() {
  const dbStatus = await connectDB();
  if (!dbStatus.connected) {
    console.error("Migration aborted: cannot connect to MongoDB.");
    process.exit(1);
  }

  let totalUpdated = 0;

  for (const [slug, Model] of Object.entries(pageModels)) {
    console.log(`Migrating page collection: ${slug}`);
    const updatedCount = await migrateCollection(slug, Model);
    console.log(`  ${updatedCount} documents normalized in ${slug}`);
    totalUpdated += updatedCount;
  }

  console.log(`Migration complete. Total documents updated: ${totalUpdated}`);
  process.exit(0);
}

run().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});

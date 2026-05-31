import { apiFetch } from "./api";
import { buildAssetUrl, buildPublicUrl } from "../config/api";

export async function loadPageItems(slug) {
  const data = await apiFetch(`/pages/${slug}`);
  return Array.isArray(data) ? data : [];
}

export function byCategory(items, category) {
  return items.filter((item) => item.category === category);
}

export function toContactLinks(items) {
  return byCategory(items, "link")
    .map((item) => ({
      id: item._id || `${item.title}-${item.url}`,
      img: buildAssetUrl(item.image),
      title: item.title,
      link: buildPublicUrl(item.url || "#"),
    }))
    .filter((item) => item.title && item.link);
}

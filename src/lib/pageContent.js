import { apiFetch } from "./api";

export async function loadPageItems(slug) {
  const data = await apiFetch(`/pages/${slug}`);
  return Array.isArray(data) ? data : [];
}

export function byCategory(items, category) {
  return items.filter((item) => item.category === category);
}

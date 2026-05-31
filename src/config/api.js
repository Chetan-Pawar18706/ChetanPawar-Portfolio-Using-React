const DEFAULT_PROD_API_URL = "/api";

function normalizeApiUrl(rawUrl) {
  const url = String(rawUrl || DEFAULT_PROD_API_URL).trim();

  if (/^https?:\/\//i.test(url)) {
    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname.replace(/\/+$/, "");

      parsedUrl.pathname = pathname.endsWith("/api")
        ? pathname
        : `${pathname}/api`;
      parsedUrl.search = "";
      parsedUrl.hash = "";

      return parsedUrl.toString().replace(/\/+$/, "");
    } catch {
      return url.replace(/\/+$/, "");
    }
  }

  return url.replace(/\/+$/, "");
}

function normalizeRelativePath(path) {
  const normalized = String(path || "").trim();
  if (!normalized) return "";
  return `/${normalized.replace(/^\/+/, "")}`;
}

export const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

export function buildApiUrl(path) {
  return `${API_URL}${normalizeRelativePath(path)}`;
}

export function buildAssetUrl(source) {
  const trimmed = String(source || "").trim();
  if (!trimmed) return "";

  if (/^(https?:|data:|mailto:|tel:|\/\/)/i.test(trimmed)) {
    return trimmed;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

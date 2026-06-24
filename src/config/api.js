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

function normalizePublicUrl(source) {
  const trimmed = String(source || "").trim();
  if (!trimmed) return "";
  const localUrlMatch = trimmed.match(/^(https?:)\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(?::\d+)?(\/.*)?$/i);
  if (localUrlMatch) {
    return localUrlMatch[3] || "/";
  }

  // preserve absolute/special protocols
  if (/^(https?:|data:|mailto:|tel:|\/\/|#)/i.test(trimmed)) {
    return trimmed;
  }

  // If a Vite-provided client base is set, prefix root-relative paths with it
  const clientBase = String(import.meta.env.VITE_CLIENT_URL || "").trim().replace(/\/+$/, "");
  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  if (clientBase) {
    return `${clientBase}${normalized}`;
  }

  return normalized;
}

export const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

export const ASSETS_BASE_URL = String(import.meta.env.VITE_PUBLIC_ASSETS_URL || "").trim().replace(/\/+$/, "");

export function buildApiUrl(path) {
  return `${API_URL}${normalizeRelativePath(path)}`;
}

export function buildAssetUrl(source) {
  const assetPath = normalizePublicUrl(source);
  
  // If asset path is relative (starts with /) and ASSETS_BASE_URL is set, prepend it
  if (ASSETS_BASE_URL && assetPath.startsWith("/")) {
    return `${ASSETS_BASE_URL}${assetPath}`;
  }
  
  return assetPath;
}

export function buildPublicUrl(source) {
  return normalizePublicUrl(source);
}

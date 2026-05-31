function normalizeApiUrl(url) {
  const fallbackUrl = import.meta.env.PROD
    ? "https://portfolio-backend.onrender.com/api"
    : "http://localhost:5000/api";
  const rawUrl = String(url || fallbackUrl).trim();

  try {
    const parsedUrl = new URL(rawUrl);
    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
    const apiIndex = pathParts.indexOf("api");

    if (apiIndex >= 0) {
      parsedUrl.pathname = `/${pathParts.slice(0, apiIndex + 1).join("/")}`;
    } else {
      parsedUrl.pathname = `${parsedUrl.pathname.replace(/\/+$/, "")}/api`;
    }

    parsedUrl.search = "";
    parsedUrl.hash = "";
    return parsedUrl.toString().replace(/\/+$/, "");
  } catch {
    return rawUrl
      .replace(/\/+$/, "")
      .replace(/\/projects$/, "")
      .replace(/\/pages\/[^/]+(?:\/pages\/[^/]+)*$/, "");
  }
}

const configuredApiUrl = import.meta.env.VITE_API_URL;
const API_URL = normalizeApiUrl(
  import.meta.env.PROD && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(configuredApiUrl || "")
    ? ""
    : configuredApiUrl
);
const TOKEN_KEY = "portfolio_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const normalizedPath = `/${String(path || "").replace(/^\/+/, "")}`;
  const response = await fetch(`${API_URL}${normalizedPath}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

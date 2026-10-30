import { supportedLanguages } from "./routeManifest.js";

function basePath(base = import.meta.env?.BASE_URL ?? "/") {
  const path = base.split("/").filter(Boolean).join("/");
  return path ? `/${path}/` : "/";
}

export function languageFromPath(pathname, base) {
  const prefix = basePath(base);
  if (!pathname.startsWith(prefix)) return null;
  const language = pathname.slice(prefix.length).split("/")[0];
  return supportedLanguages.includes(language) ? language : null;
}

// Hash page routes are read only for compatibility. Ordinary #anchors stay separate.
export function parseLocation(location, base) {
  const prefix = basePath(base);
  const language = languageFromPath(location.pathname, base);
  const relativePath = location.pathname.startsWith(prefix)
    ? location.pathname.slice(prefix.length)
    : "";
  let parts = relativePath.split("/").filter(Boolean);
  if (language) parts = parts.slice(1);
  let search = location.search || "";
  let hash = location.hash || "";
  const legacy = hash.startsWith("#/");

  if (legacy) {
    const oldRoute = new URL(hash.slice(1), "https://muuva.invalid");
    parts = oldRoute.pathname.split("/").filter(Boolean);
    const params = new URLSearchParams(search);
    for (const key of new Set(oldRoute.searchParams.keys())) params.delete(key);
    for (const [key, value] of oldRoute.searchParams) params.append(key, value);
    search = params.size ? `?${params}` : "";
    hash = oldRoute.hash;
  }

  const params = new URLSearchParams(search);
  let slug = "";
  if (parts[1]) {
    try { slug = decodeURIComponent(parts[1]); }
    catch { slug = parts[1]; }
  }
  const page = parts[0] === "guided-routines"
    ? (parts[1] ? "routine-detail" : "guided-routines")
    : ["privacy", "about-us", "newsletter-confirmed"].includes(parts[0]) && parts.length === 1 ? parts[0] : "home";

  return {
    language,
    page,
    slug: page === "routine-detail" ? slug : "",
    filter: params.get("filter") || "",
    returnFilter: params.get("filter") || "",
    search,
    hash,
    legacy,
  };
}

export function localizedUrl(language, { page = "home", slug = "", search = "", hash = "" } = {}, base) {
  if (!supportedLanguages.includes(language)) throw new Error("Unsupported route language");
  const path = page === "routine-detail"
    ? `guided-routines/${encodeURIComponent(slug)}/`
    : page === "guided-routines" ? "guided-routines/" : ["privacy", "about-us", "newsletter-confirmed"].includes(page) ? `${page}/` : "";
  return `${basePath(base)}${language}/${path}${search}${hash}`;
}

export function filterQuery(search, filter) {
  const params = new URLSearchParams(search);
  if (filter && filter !== "All") params.set("filter", filter);
  else params.delete("filter");
  return params.size ? `?${params}` : "";
}

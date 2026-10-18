// Cloudflare's documented host placeholders cover project and preview addresses:
// https://developers.cloudflare.com/pages/configuration/headers/
export function createHostingHeaders({ base, staging = false }) {
  if (staging) return "/*\n  X-Robots-Tag: noindex, nofollow\n";
  // Root-hosted builds protect temporary Cloudflare hosts without matching a custom domain.
  // The default GitHub Pages subpath build does not need a Cloudflare headers file.
  if (base !== "/") return "";
  return [
    "https://:project.pages.dev/*",
    "https://:version.:project.pages.dev/*",
  ].map((pattern) => `${pattern}\n  X-Robots-Tag: noindex, nofollow\n`).join("\n");
}

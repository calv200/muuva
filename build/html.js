export function escapeMarkup(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

export function documentWithMetadata(template, metadata) {
  const html = template
    .replace(/<html\b[^>]*>/i, `<html lang="${escapeMarkup(metadata.language)}">`)
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta\b[^>]*name=["']description["'][^>]*>/gi, "")
    .replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<link\b[^>]*hreflang=["'][^"']+["'][^>]*>/gi, "");
  const tags = [
    `<title>${escapeMarkup(metadata.title)}</title>`,
    `<meta name="description" content="${escapeMarkup(metadata.description)}">`,
    `<link rel="canonical" href="${escapeMarkup(metadata.canonical)}">`,
    ...metadata.alternates.map(({ language, href }) => `<link rel="alternate" hreflang="${escapeMarkup(language)}" href="${escapeMarkup(href)}">`),
  ].join("\n    ");
  return html.replace("</head>", `${tags}\n  </head>`);
}

export function prerenderDocument(template, page) {
  if (!template.includes('<div id="root"></div>')) throw new Error("Missing empty application root in Vite template");
  const routeJson = JSON.stringify(page.route).replaceAll("<", "\\u003c");
  return documentWithMetadata(template, page.metadata).replace(
    '<div id="root"></div>',
    () => `<div id="root">${page.html}</div>\n    <script type="application/json" id="muuva-prerender">${routeJson}</script>`
  );
}

export function createSitemap(pages) {
  const entries = pages.map(({ metadata }) => `  <url>\n    <loc>${escapeMarkup(metadata.canonical)}</loc>\n${metadata.alternates.map(({ language, href }) => `    <xhtml:link rel="alternate" hreflang="${escapeMarkup(language)}" href="${escapeMarkup(href)}"/>`).join("\n")}\n  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`;
}

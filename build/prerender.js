import { build, loadEnv } from "vite";
import { mkdir, mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createSitemap, documentWithMetadata, prerenderDocument } from "./html.js";

const staging = loadEnv("production", process.cwd(), "MUUVA_").MUUVA_STAGING === "true";

await build();
const output = path.resolve("dist");
const template = await readFile(path.join(output, "index.html"), "utf8");
const cache = path.resolve("node_modules/.cache");
await mkdir(cache, { recursive: true });
const serverOutput = await mkdtemp(path.join(cache, "muuva-prerender-"));

try {
  await build({
    build: {
      ssr: "src/entry-server.jsx",
      outDir: serverOutput,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: "render.mjs" } },
    },
    logLevel: "warn",
  });
  const { renderPage, getPublicPages, sitemapUrl } = await import(pathToFileURL(path.join(serverOutput, "render.mjs")).href);
  const pages = [];
  for (const { language, path: pagePath } of getPublicPages()) {
    const page = renderPage(language, pagePath);
    if (!page.html.includes("<main>")) throw new Error(`No rendered content for ${language}/${pagePath}`);
    const destination = path.join(output, language, pagePath, "index.html");
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, prerenderDocument(template, page));
    pages.push(page);
  }
  // The unlocalized entry remains a compatibility/detection entry, not another
  // indexable language variant. Its canonical points at the English homepage.
  await writeFile(path.join(output, "index.html"), documentWithMetadata(template, pages[0].metadata));
  await writeFile(path.join(output, "sitemap.xml"), createSitemap(pages));
  await writeFile(path.join(output, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`);
  // Cloudflare applies this wildcard to all static routes, including localized pages.
  // Vite clears dist on each client build, so normal builds retain no staging headers.
  if (staging) {
    await writeFile(path.join(output, "_headers"), "/*\n  X-Robots-Tag: noindex, nofollow\n");
  }
  console.log(`Prerendered ${pages.length} localized pages with metadata, sitemap.xml and robots.txt.`);
} finally {
  // Only remove the temporary directory created within our build cache.
  const relative = path.relative(cache, serverOutput);
  if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) {
    await rm(serverOutput, { recursive: true, force: true });
  }
}

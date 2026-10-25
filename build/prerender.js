import { build, loadEnv, resolveConfig } from "vite";
import { mkdir, mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createSitemap, documentWithMetadata, prerenderDocument } from "./html.js";
import { createHostingHeaders } from "./headers.js";
import { analyticsConfig, documentWithAnalytics } from "./analytics.js";

const config = await resolveConfig({ mode: "production" }, "build", "production", "production");
const staging = loadEnv(config.mode, config.envDir, "MUUVA_").MUUVA_STAGING === "true";
const analytics = analyticsConfig(config.env, { staging, base: config.base });

await build();
const output = path.resolve(config.root, config.build.outDir);
const template = documentWithAnalytics(await readFile(path.join(output, "index.html"), "utf8"), analytics);
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
  // Vite clears the client output first, preventing headers from a previous environment leaking.
  const headers = createHostingHeaders({ base: config.base, staging });
  if (headers) await writeFile(path.join(output, "_headers"), headers);
  console.log(`Prerendered ${pages.length} localized pages with metadata, sitemap.xml and robots.txt.`);
} finally {
  // Only remove the temporary directory created within our build cache.
  const relative = path.relative(cache, serverOutput);
  if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) {
    await rm(serverOutput, { recursive: true, force: true });
  }
}

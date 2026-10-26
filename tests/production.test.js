import assert from "node:assert/strict";
import test from "node:test";
import { mkdir, mkdtemp, readFile, writeFile, rm, unlink } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createInstance } from "i18next";
import { verifyProductionOutput } from "../build/verify-production.js";
import { createSitemap, escapeMarkup, prerenderDocument } from "../build/html.js";
import { createHostingHeaders } from "../build/headers.js";
import { pagePaths, supportedLanguages } from "../src/routing/routeManifest.js";
import { parseLocation } from "../src/routing/urls.js";
import { getMetadata } from "../src/seo/metadata.js";
import { publicSiteOrigin } from "../src/seo/site.js";
import { analyticsConfig, documentWithAnalytics } from "../build/analytics.js";

const locales = Object.fromEntries(supportedLanguages.map((language) => [language,
  JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url))),
]));

async function fixture(t, { base = "/muuva/", origin = publicSiteOrigin, staging = false, analytics = null } = {}) {
  const directory = await mkdtemp(path.join(tmpdir(), "muuva-production-test-"));
  t.after(async () => {
    const relative = path.relative(path.resolve(tmpdir()), path.resolve(directory));
    assert(relative.startsWith("muuva-production-test-") && !relative.includes(path.sep), "Unsafe fixture cleanup path");
    await rm(directory, { recursive: true, force: true });
  });
  await mkdir(path.join(directory, "assets"));
  await writeFile(path.join(directory, "assets/app.js"), "/* fixture */");
  await writeFile(path.join(directory, "assets/app.css"), ["Manrope", "Newsreader"].map((family) => `@font-face { font-family: "${family}"; src: url(./font.woff2); font-display: swap; }`).join("\n"));
  await writeFile(path.join(directory, "assets/font.woff2"), "wOF2fixture");
  const template = documentWithAnalytics(`<!doctype html><html lang="en"><head><title>Old</title><meta name="description" content="Old"><script type="module" src="${base}assets/app.js"></script><link rel="stylesheet" href="${base}assets/app.css"></head><body><div id="root"></div></body></html>`, analytics);
  const pages = [];
  for (const language of supportedLanguages) {
    const i18n = createInstance();
    i18n.init({ lng: language, resources: { [language]: { translation: locales[language] } }, initImmediate: false });
    for (const pagePath of pagePaths) {
      const route = parseLocation(new URL(`${base}${language}/${pagePath}`, origin), base);
      const heading = i18n.t(route.page === "privacy" ? "privacy.title" : route.page === "about-us" ? "about.inspired.title" : route.page === "home" ? "product.title" : route.page === "guided-routines" ? "routines.title" : `routines.categories.${route.slug}.title`);
      const page = {
        route,
        metadata: getMetadata(language, route, i18n.t.bind(i18n), { origin, base }),
        html: `<main><h1>${escapeMarkup(heading)}</h1><p>${escapeMarkup(i18n.t("footer.about"))}</p></main>`,
      };
      const file = path.join(directory, language, pagePath, "index.html");
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, prerenderDocument(template, page));
      pages.push(page);
    }
  }
  await writeFile(path.join(directory, "index.html"), template);
  await writeFile(path.join(directory, "sitemap.xml"), createSitemap(pages));
  await writeFile(path.join(directory, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${origin}${base}sitemap.xml\n`);
  const headers = createHostingHeaders({ base, staging });
  if (headers) await writeFile(path.join(directory, "_headers"), headers);
  return { directory, base, origin, staging, analytics };
}

test("enabled analytics verifies every localized page and compatibility root, rejecting duplicate or missing scripts", async (t) => {
  const analytics = analyticsConfig({ VITE_UMAMI_ENABLED: "true", VITE_UMAMI_WEBSITE_ID: "8963af84-1a22-4cad-a8ef-413afe485468", VITE_PUBLIC_SITE_ORIGIN: "https://muuva.nl" }, { base: "/" });
  const options = await fixture(t, { base: "/", origin: "https://muuva.nl", analytics });
  assert.equal((await verifyProductionOutput(options)).pages, 36);
  const file = path.join(options.directory, "index.html");
  const original = await readFile(file, "utf8");
  await writeFile(file, original.replace("</head>", '<script src="https://cloud.umami.is/script.js"></script></head>'));
  await assert.rejects(verifyProductionOutput(options), /Incorrect Umami script count/);
  await writeFile(file, original.replace(/<script defer[^>]*><\/script>/, ""));
  await assert.rejects(verifyProductionOutput(options), /Incorrect Umami script count/);
});

test("disabled output rejects an accidentally installed tracker on the compatibility root", async (t) => {
  const options = await fixture(t);
  const file = path.join(options.directory, "index.html");
  await writeFile(file, (await readFile(file, "utf8")).replace("</head>", '<script src="https://cloud.umami.is/script.js"></script></head>'));
  await assert.rejects(verifyProductionOutput(options), /Incorrect Umami script count/);
});

const pageFile = (options) => path.join(options.directory, supportedLanguages[1], pagePaths[0], "index.html");
async function edit(file, change) {
  await writeFile(file, change(await readFile(file, "utf8")));
}

test("production verifier accepts the manifest and ignores bootstrap JSON when checking visible translation keys", async (t) => {
  const options = await fixture(t);
  await edit(pageFile(options), (html) => html.replace("</body>", '<script type="application/json">{"example":"product.title"}</script></body>'));
  assert.deepEqual(await verifyProductionOutput(options), { pages: supportedLanguages.length * pagePaths.length, assets: 3 });
});

test("staging requires global noindex while preserving root-hosted localized SEO", async (t) => {
  const options = await fixture(t, { base: "/", origin: "https://muuva.pages.dev", staging: true });
  const file = path.join(options.directory, "_headers");
  assert.equal(await readFile(file, "utf8"), "/*\n  X-Robots-Tag: noindex, nofollow\n");
  assert.equal((await verifyProductionOutput(options)).pages, 36);
  await unlink(file);
  await assert.rejects(verifyProductionOutput(options), /Incorrect hosting headers/);
});

test("commercial headers protect project and preview hosts without a custom-domain or global rule", async (t) => {
  const options = await fixture(t, { base: "/", origin: "https://muuva.nl" });
  const file = path.join(options.directory, "_headers");
  const headers = await readFile(file, "utf8");
  assert.deepEqual(headers.trim().split("\n\n").map((block) => block.split("\n").map((line) => line.trim())), [
    ["https://:project.pages.dev/*", "X-Robots-Tag: noindex, nofollow"],
    ["https://:version.:project.pages.dev/*", "X-Robots-Tag: noindex, nofollow"],
  ]);
  assert.equal(createHostingHeaders({ base: "/", staging: false }), createHostingHeaders({ base: "/" }));
  assert.equal((await verifyProductionOutput(options)).pages, 36);

  for (const invalid of [
    "/*\n  X-Robots-Tag: noindex, nofollow\n",
    headers.split("\n\n")[0] + "\n", // Missing preview protection.
    headers + "\nhttps://muuva.nl/*\n  X-Robots-Tag: noindex\n",
    "", // Missing temporary-domain protection entirely.
  ]) {
    await writeFile(file, invalid);
    await assert.rejects(verifyProductionOutput(options), /Incorrect hosting headers/);
  }
});

const corruptions = {
  "an external Google font stylesheet": async (o) => edit(pageFile(o), (s) => s.replace("</head>", '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope"></head>')),
  "an external font URL in CSS": async (o) => edit(path.join(o.directory, "assets/app.css"), (s) => s.replaceAll("./font.woff2", "https://fonts.gstatic.com/font.woff2")),
  "a missing font file": async (o) => unlink(path.join(o.directory, "assets/font.woff2")),
  "an invalid font file": async (o) => writeFile(path.join(o.directory, "assets/font.woff2"), "<html>not a font</html>"),
  "a missing localized page": async (o) => unlink(pageFile(o)),
  "an extra unlisted HTML route": async (o) => writeFile(path.join(o.directory, "unexpected.html"), "extra"),
  "an empty React shell": async (o) => edit(pageFile(o), (s) => s.replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>')),
  "an empty main element": async (o) => edit(pageFile(o), (s) => s.replace(/<main>[\s\S]*?<\/main>/, "<main></main>")),
  "incorrect document language": async (o) => edit(pageFile(o), (s) => s.replace(/<html lang="[^"]+">/, '<html lang="en">')),
  "an empty title": async (o) => edit(pageFile(o), (s) => s.replace(/<title>[\s\S]*?<\/title>/, "<title></title>")),
  "English description on a translated page": async (o) => edit(pageFile(o), (s) => s.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeMarkup(locales.en.seo.home.description)}">`)),
  "duplicate canonical tags": async (o) => edit(pageFile(o), (s) => s.replace("</head>", `${s.match(/<link rel="canonical"[^>]*>/)[0]}</head>`)),
  "a filter in the canonical": async (o) => edit(pageFile(o), (s) => s.replace(/(<link rel="canonical" href=")[^"]+/, (tag) => `${tag}?filter=Ring`)),
  "missing hreflang": async (o) => edit(pageFile(o), (s) => s.replace(/<link rel="alternate"[^>]*>/, "")),
  "unresolved visible translation keys": async (o) => edit(pageFile(o), (s) => s.replace("</main>", "<p>product.missingTranslation</p></main>")),
  "unresolved accessible labels": async (o) => edit(pageFile(o), (s) => s.replace("</main>", '<button aria-label="routines.missingButton"></button></main>')),
  "missing JavaScript": async (o) => unlink(path.join(o.directory, "assets/app.js")),
  "missing CSS": async (o) => unlink(path.join(o.directory, "assets/app.css")),
  "development origin configuration": async (o) => { o.origin = "http://127.0.0.1:5173"; },
  "a noindex public page": async (o) => edit(pageFile(o), (s) => s.replace("</head>", '<meta name="robots" content="noindex"></head>')),
  "a missing sitemap URL": async (o) => edit(path.join(o.directory, "sitemap.xml"), (s) => s.replace(/<url>[\s\S]*?<\/url>/, "")),
  "duplicate sitemap URLs": async (o) => edit(path.join(o.directory, "sitemap.xml"), (s) => s.replace("</urlset>", `${s.match(/<url>[\s\S]*?<\/url>/)[0]}</urlset>`)),
  "incorrect sitemap alternates": async (o) => edit(path.join(o.directory, "sitemap.xml"), (s) => s.replace(/<xhtml:link[^>]*\/>/, "")),
  "malformed sitemap XML": async (o) => edit(path.join(o.directory, "sitemap.xml"), (s) => s.replace("</urlset>", "</broken>")),
  "the wrong robots sitemap": async (o) => edit(path.join(o.directory, "robots.txt"), (s) => s.replace("sitemap.xml", "wrong.xml")),
  "robots blocking public paths": async (o) => edit(path.join(o.directory, "robots.txt"), (s) => `${s}Disallow: /\n`),
  "staging headers leaking into GitHub Pages": async (o) => writeFile(path.join(o.directory, "_headers"), "/*\n  X-Robots-Tag: noindex, nofollow\n"),
};

for (const [name, corrupt] of Object.entries(corruptions)) {
  test(`production verifier rejects ${name}`, async (t) => {
    const options = await fixture(t);
    await corrupt(options);
    await assert.rejects(verifyProductionOutput(options));
  });
}

test("production verification command exits unsuccessfully for a development origin", () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const result = spawnSync(process.execPath, ["build/verify-production.js"], {
    cwd: root,
    env: { ...process.env, VITE_PUBLIC_SITE_ORIGIN: "http://localhost:5173" },
    encoding: "utf8",
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Production HTML verification failed: Development address/);
});

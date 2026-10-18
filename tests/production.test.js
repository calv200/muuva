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
import { pagePaths, supportedLanguages } from "../src/routing/routeManifest.js";
import { parseLocation } from "../src/routing/urls.js";
import { getMetadata } from "../src/seo/metadata.js";
import { publicSiteOrigin as origin } from "../src/seo/site.js";

const base = "/muuva/";
const locales = Object.fromEntries(supportedLanguages.map((language) => [language,
  JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url))),
]));

async function fixture(t) {
  const directory = await mkdtemp(path.join(tmpdir(), "muuva-production-test-"));
  t.after(async () => {
    const relative = path.relative(path.resolve(tmpdir()), path.resolve(directory));
    assert(relative.startsWith("muuva-production-test-") && !relative.includes(path.sep), "Unsafe fixture cleanup path");
    await rm(directory, { recursive: true, force: true });
  });
  await mkdir(path.join(directory, "assets"));
  await writeFile(path.join(directory, "assets/app.js"), "/* fixture */");
  await writeFile(path.join(directory, "assets/app.css"), "/* fixture */");
  const template = `<!doctype html><html lang="en"><head><title>Old</title><meta name="description" content="Old"><script type="module" src="${base}assets/app.js"></script><link rel="stylesheet" href="${base}assets/app.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope"></head><body><div id="root"></div></body></html>`;
  const pages = [];
  for (const language of supportedLanguages) {
    const i18n = createInstance();
    i18n.init({ lng: language, resources: { [language]: { translation: locales[language] } }, initImmediate: false });
    for (const pagePath of pagePaths) {
      const route = parseLocation(new URL(`${base}${language}/${pagePath}`, origin), base);
      const heading = i18n.t(route.page === "home" ? "product.title" : route.page === "guided-routines" ? "routines.title" : `routines.categories.${route.slug}.title`);
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
  return { directory, base, origin };
}

const pageFile = (options) => path.join(options.directory, supportedLanguages[1], pagePaths[0], "index.html");
async function edit(file, change) {
  await writeFile(file, change(await readFile(file, "utf8")));
}

test("production verifier accepts the manifest and ignores bootstrap JSON when checking visible translation keys", async (t) => {
  const options = await fixture(t);
  await edit(pageFile(options), (html) => html.replace("</body>", '<script type="application/json">{"example":"product.title"}</script></body>'));
  assert.deepEqual(await verifyProductionOutput(options), { pages: supportedLanguages.length * pagePaths.length, assets: 2 });
});

const corruptions = {
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

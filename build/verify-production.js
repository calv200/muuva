import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createInstance } from "i18next";
import { resolveConfig } from "vite";
import { pagePaths, supportedLanguages } from "../src/routing/routeManifest.js";
import { parseLocation } from "../src/routing/urls.js";
import { getMetadata } from "../src/seo/metadata.js";
import { publicSiteOrigin } from "../src/seo/site.js";

// Read the markup emitted by our generator; this is not a general HTML validator.
function decode(value) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (_, entity) => {
    if (entity.startsWith("#")) return String.fromCodePoint(parseInt(entity.slice(entity[1].toLowerCase() === "x" ? 2 : 1), entity[1].toLowerCase() === "x" ? 16 : 10));
    return named[entity.toLowerCase()];
  });
}

function tags(markup, name) {
  return [...markup.matchAll(new RegExp(`<${name}\\b([^<>]*)>`, "gi"))].map((match) => {
    const attributes = {};
    for (const [, rawName, double, single, unquoted] of match[1].matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
      const key = rawName.toLowerCase();
      assert(!Object.hasOwn(attributes, key), `Duplicate ${key} attribute on ${name}`);
      attributes[key] = decode(double ?? single ?? unquoted ?? "");
    }
    return attributes;
  });
}

function elements(markup, name) {
  return [...markup.matchAll(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`, "gi"))].map((match) => match[1]);
}

function text(markup) {
  return decode(markup.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function only(values, label) {
  assert.equal(values.length, 1, `Expected exactly one ${label}; found ${values.length}`);
  return values[0];
}

function developmentAddress(value) {
  return /\blocalhost\b|\b0\.0\.0\.0\b|\b127\.\d+\.\d+\.\d+\b|\[::1\]|\b(?:[\w-]+\.)+(?:test|local|invalid)\b/i.test(value);
}

function publicUrl(value) {
  const url = new URL(value);
  assert(["http:", "https:"].includes(url.protocol), `Not a public HTTP URL: ${value}`);
  assert(!developmentAddress(value), `Development address in SEO metadata: ${value}`);
  assert(!/^(?:10\.|192\.168\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(url.hostname), `Private address in SEO metadata: ${value}`);
}

async function htmlFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) return htmlFiles(path.join(directory, entry.name), `${relative}/`);
    return entry.isFile() && /\.html$/i.test(entry.name) ? [relative] : [];
  }));
  return files.flat();
}

function validateXml(xml) {
  assert(!/<!DOCTYPE/i.test(xml), "Unexpected sitemap doctype");
  assert(!/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-f]+;)/i.test(xml), "Invalid XML entity in sitemap");
  const stack = [];
  for (const [token] of xml.matchAll(/<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<[^>]*>/g)) {
    if (token.startsWith("<?") || token.startsWith("<!--")) continue;
    const name = token.match(/^<\/?([\w:.-]+)/)?.[1];
    assert(name, "Malformed sitemap XML tag");
    if (token.startsWith("</")) assert.equal(stack.pop(), name, "Unbalanced sitemap XML");
    else {
      const parent = { urlset: undefined, url: "urlset", loc: "url", "xhtml:link": "url" };
      assert(Object.hasOwn(parent, name), `Unexpected sitemap element: ${name}`);
      assert.equal(stack.at(-1), parent[name], `Unexpected sitemap nesting: ${name}`);
      if (!token.endsWith("/>")) stack.push(name);
    }
  }
  assert.equal(stack.length, 0, "Unclosed sitemap XML tag");
}

export async function verifyProductionOutput({ directory, base, origin = publicSiteOrigin }) {
  publicUrl(origin);
  const expected = new Map();
  const groups = new Set();
  for (const language of supportedLanguages) {
    const locale = JSON.parse(await readFile(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
    Object.keys(locale).forEach((group) => groups.add(group));
    const i18n = createInstance();
    i18n.init({ lng: language, resources: { [language]: { translation: locale } }, fallbackLng: false, initImmediate: false });
    for (const pagePath of pagePaths) {
      const route = parseLocation(new URL(`${base}${language}/${pagePath}`, origin), base);
      const metadata = getMetadata(language, route, i18n.t.bind(i18n), { origin, base });
      const heading = route.page === "home" ? i18n.t("product.title") : route.page === "guided-routines" ? i18n.t("routines.title") : i18n.t(`routines.categories.${route.slug}.title`);
      expected.set(`${language}/${pagePath}index.html`, { metadata, heading });
    }
  }

  // The compatibility root is deliberately not another localized public page.
  const actual = (await htmlFiles(directory)).filter((file) => file !== "index.html").sort();
  assert.deepEqual(actual, [...expected.keys()].sort(), "Localized HTML routes differ from the route manifest");
  const rawKey = new RegExp(`\\b(?:${[...groups].join("|")})\\.[\\w.-]+|\\{\\{|\\}\\}`, "i");
  const checkedAssets = new Set();
  const actualAlternates = new Map();

  async function assetExists(reference, canonical) {
    const url = new URL(reference, canonical);
    publicUrl(url.href);
    assert.equal(url.origin, new URL(origin).origin, `Vite asset has a different origin: ${reference}`);
    assert(url.pathname.startsWith(base), `Vite asset is outside the configured base: ${reference}`);
    const filename = path.resolve(directory, decodeURIComponent(url.pathname.slice(base.length)));
    const relative = path.relative(path.resolve(directory), filename);
    assert(relative && !relative.startsWith("..") && !path.isAbsolute(relative), `Asset escapes dist: ${reference}`);
    assert((await stat(filename)).isFile(), `Asset is not a file: ${reference}`);
    checkedAssets.add(filename);
  }

  for (const [filename, { metadata, heading }] of expected) {
    try {
      const html = await readFile(path.join(directory, filename), "utf8");
      const head = only(elements(html, "head"), "head");
      assert.equal(only(tags(html, "html"), "html").lang, metadata.language, "Incorrect HTML language");
      assert(/<div\b[^>]*\bid=["']root["']/i.test(html), "Missing React root");
      assert(!/<div\b[^>]*\bid=["']root["'][^>]*>\s*(?:<!--[\s\S]*?-->\s*)*<\/div>/i.test(html), "Empty React root");
      const main = only(elements(html, "main"), "server-rendered main");
      assert(text(main).length > 20, "Empty server-rendered main content");
      const headings = [...elements(main, "h1"), ...elements(main, "h2")].map(text);
      assert(headings.includes(heading), `Missing localized heading: ${heading}`);
      const title = text(only(elements(head, "title"), "title"));
      const meta = tags(head, "meta");
      const description = only(meta.filter((tag) => tag.name === "description"), "description").content;
      assert(title && description?.trim(), "Empty title or description");
      assert.equal(title, metadata.title, "Incorrect localized title");
      assert.equal(description, metadata.description, "Incorrect localized description");
      const links = tags(head, "link");
      const canonical = only(links.filter((tag) => tag.rel === "canonical"), "canonical").href;
      assert.equal(canonical, metadata.canonical, "Incorrect canonical URL");
      const alternates = links.filter((tag) => tag.rel === "alternate" && Object.hasOwn(tag, "hreflang"))
        .map((tag) => ({ language: tag.hreflang, href: tag.href }));
      assert.deepEqual([...alternates].sort((a, b) => a.language.localeCompare(b.language)), [...metadata.alternates].sort((a, b) => a.language.localeCompare(b.language)), "Incorrect hreflang alternates");
      actualAlternates.set(canonical, alternates);
      assert(!meta.some((tag) => /^(?:robots|googlebot)$/i.test(tag.name || "") && /\bnoindex\b/i.test(tag.content)), "Public page is noindex");
      assert(!developmentAddress(title + " " + description), "Development address in title/description");
      [canonical, ...alternates.map((tag) => tag.href)].forEach(publicUrl);
      const accessible = [...html.matchAll(/\b(?:alt|aria-label|title|placeholder)=["']([^"']*)["']/gi)].map((match) => decode(match[1])).join(" ");
      assert(!rawKey.test([text(html), accessible, title, description].join(" ")), "Unresolved translation key or interpolation in page content/metadata");
      const scripts = tags(head, "script").filter((tag) => tag.src && tag.type === "module");
      const styles = links.filter((tag) => tag.rel === "stylesheet" && tag.href && new URL(tag.href, canonical).origin === new URL(origin).origin);
      assert(scripts.length && styles.length, "Missing Vite JavaScript or CSS reference");
      for (const tag of scripts) await assetExists(tag.src, canonical);
      for (const tag of styles) await assetExists(tag.href, canonical);
    } catch (error) {
      throw new Error(`${filename}: ${error.message}`, { cause: error });
    }
  }

  for (const [canonical, alternates] of actualAlternates) {
    for (const { href } of alternates) assert(actualAlternates.get(href)?.some((tag) => tag.href === canonical), `Nonreciprocal hreflang: ${canonical} → ${href}`);
  }
  const sitemap = await readFile(path.join(directory, "sitemap.xml"), "utf8");
  validateXml(sitemap);
  const namespace = only(tags(sitemap, "urlset"), "sitemap urlset");
  assert.equal(namespace.xmlns, "http://www.sitemaps.org/schemas/sitemap/0.9");
  assert.equal(namespace["xmlns:xhtml"], "http://www.w3.org/1999/xhtml");
  const sitemapPages = elements(sitemap, "url");
  const locations = sitemapPages.map((entry) => decode(only(elements(entry, "loc"), "sitemap loc").trim()));
  assert.deepEqual([...locations].sort(), [...actualAlternates.keys()].sort(), "Sitemap URLs differ from public canonical routes");
  for (let index = 0; index < sitemapPages.length; index++) {
    const alternates = tags(sitemapPages[index], "xhtml:link").map((tag) => {
      assert.equal(tag.rel, "alternate");
      return { language: tag.hreflang, href: tag.href };
    });
    assert.deepEqual(alternates.sort((a, b) => a.language.localeCompare(b.language)), [...actualAlternates.get(locations[index])].sort((a, b) => a.language.localeCompare(b.language)), `Sitemap alternates differ for ${locations[index]}`);
  }
  const robots = await readFile(path.join(directory, "robots.txt"), "utf8");
  const sitemaps = [...robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gmi)].map((match) => match[1]);
  assert.deepEqual(sitemaps, [new URL(`${base}sitemap.xml`, origin).href], "Incorrect sitemap reference in robots.txt");
  assert(!/^Disallow:\s*\S+/mi.test(robots), "robots.txt blocks production paths");
  return { pages: expected.size, assets: checkedAssets.size };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const config = await resolveConfig({ mode: "production" }, "build");
    const result = await verifyProductionOutput({
      directory: path.resolve(config.root, config.build.outDir),
      base: config.base,
      origin: new URL(config.env.VITE_PUBLIC_SITE_ORIGIN || publicSiteOrigin).origin,
    });
    console.log(`Production HTML checks passed: ${result.pages} localized pages, ${result.assets} shared JS/CSS assets, reciprocal hreflang, sitemap.xml and robots.txt.`);
  } catch (error) {
    console.error(`Production HTML verification failed: ${error.message}`);
    process.exitCode = 1;
  }
}

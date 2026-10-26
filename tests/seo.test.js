import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createInstance } from "i18next";
import { getMetadata } from "../src/seo/metadata.js";
import { pagePaths, supportedLanguages } from "../src/routing/routeManifest.js";
import { parseLocation } from "../src/routing/urls.js";
import { createSitemap, prerenderDocument, documentWithMetadata } from "../build/html.js";

const base = "/muuva/";
const origin = "https://calv200.github.io";
const resources = Object.fromEntries(supportedLanguages.map((language) => [language, {
  translation: JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url))),
}]));

function metadataFor(language, path, query = "") {
  const instance = createInstance();
  instance.init({ lng: language, resources, initImmediate: false });
  const route = parseLocation(new URL(`${base}${language}/${path}${query}`, origin), base);
  return getMetadata(language, route, instance.t.bind(instance), { origin, base });
}

test("every canonical page has reciprocal equivalent hreflang links and a distinct localized title", () => {
  const titles = new Set();
  for (const language of supportedLanguages) {
    for (const path of pagePaths) {
      const metadata = metadataFor(language, path, "?filter=Ring#video");
      assert.equal(metadata.language, language);
      assert.equal(metadata.canonical, `${origin}${base}${language}/${path}`);
      assert.equal(metadata.alternates.length, 5);
      assert.equal(metadata.alternates.at(-1).language, "x-default");
      assert.equal(metadata.alternates.at(-1).href, `${origin}${base}en/${path}`);
      assert(!/seo\.|{{/.test(metadata.title + metadata.description));
      assert(metadata.description.length > 50);
      assert(!titles.has(metadata.title), metadata.title);
      titles.add(metadata.title);
      for (const alternate of metadata.alternates.slice(0, 4)) {
        const equivalent = metadataFor(alternate.language, path);
        assert.equal(equivalent.canonical, alternate.href);
        assert(equivalent.alternates.some((item) => item.href === metadata.canonical));
      }
    }
  }
});

test("metadata can move to a different public origin and Vite base", () => {
  const instance = createInstance();
  instance.init({ lng: "nl", resources, initImmediate: false });
  const metadata = getMetadata("nl", { page: "guided-routines" }, instance.t.bind(instance), { origin: "https://muuva.nl", base: "/" });
  assert.equal(metadata.canonical, "https://muuva.nl/nl/guided-routines/");
  assert(metadata.alternates.every((item) => item.href.startsWith("https://muuva.nl/")));
});

test("HTML generation escapes metadata, keeps assets and rendered content, and emits one head tag per role", () => {
  const template = '<!doctype html><html lang="en"><head><title>Old</title><meta name="description" content="Old"><link rel="canonical" href="old"><link rel="alternate" hreflang="en" href="old"><script type="module" src="/muuva/assets/app.js"></script></head><body><div id="root"></div></body></html>';
  const metadata = { ...metadataFor("de", ""), title: 'MUUVA & "Pilates" <Set>' };
  const page = { metadata, html: '<main><h1>Hol dir dein Pilates-Set</h1></main>', route: { language: "de", page: "home" } };
  const html = prerenderDocument(template, page);
  assert(html.includes('<html lang="de">'));
  assert(html.includes(page.html));
  assert(html.includes('/muuva/assets/app.js'));
  assert(html.includes('MUUVA &amp; &quot;Pilates&quot; &lt;Set&gt;'));
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal((html.match(/name="description"/g) || []).length, 1);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.equal((html.match(/hreflang=/g) || []).length, 5);
  assert.equal((documentWithMetadata(html, metadata).match(/rel="canonical"/g) || []).length, 1);
  assert(html.includes('id="muuva-prerender"'));
  assert.throws(() => prerenderDocument('<div></div>', page));
});

test("sitemap contains precisely the public manifest with valid language alternate markup", () => {
  const pages = supportedLanguages.flatMap((language) => pagePaths.map((path) => ({ metadata: metadataFor(language, path) })));
  const xml = createSitemap(pages);
  assert(xml.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'));
  assert.equal((xml.match(/<loc>/g) || []).length, 36);
  assert.equal((xml.match(/<xhtml:link /g) || []).length, 180);
  assert(!xml.includes('filter=') && !xml.includes('#/') && !xml.includes('localhost'));
});

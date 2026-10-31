import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import { supportedLanguages } from "../src/routing/routeManifest.js";
import { localizedUrl, parseLocation } from "../src/routing/urls.js";
import { escapeMarkup } from "../build/html.js";

test("About routes preserve language, canonical slash, queries and anchors on both deployment bases", () => {
  for (const base of ["/", "/muuva/"]) {
    const route = parseLocation(new URL(`https://muuva.nl${base}en/about-us?utm_source=instagram#about-us`), base);
    assert.equal(route.page, "about-us");
    for (const language of supportedLanguages) {
      assert.equal(localizedUrl(language, route, base), `${base}${language}/about-us/?utm_source=instagram#about-us`);
    }
  }
});

test("About server HTML contains the entire localized story, two original images and the correct footer link", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
  try {
    const { renderPage } = await server.ssrLoadModule("/src/entry-server.jsx");
    for (const language of supportedLanguages) {
      const locale = JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
      const { html, metadata } = renderPage(language, "about-us/");
      const main = html.match(/<main>([\s\S]*?)<\/main>/)[1];
      const normalizedMain = main.replaceAll("&#x27;", "&#39;");
      assert.equal((main.match(/<h1\b/g) || []).length, 1);
      assert.equal((main.match(/<h2\b/g) || []).length, 1);
      assert.equal((main.match(/<section\b/g) || []).length, 2);
      assert.equal((main.match(/<p\b/g) || []).length, 11);
      assert.equal((main.match(/<img\b/g) || []).length, 2);
      for (const section of ["inspired", "us"]) {
        for (const value of Object.values(locale.about[section])) assert(normalizedMain.includes(escapeMarkup(value)));
      }
      const paragraphs = [...normalizedMain.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((match) => match[1]);
      assert.deepEqual(paragraphs, [
        locale.about.inspired.intro,
        ...[1, 2, 3, 4, 5].map((n) => locale.about.inspired[`p${n}`]),
        ...[1, 2, 3, 4, 5].map((n) => locale.about.us[`p${n}`]),
      ].map(escapeMarkup), `${language}: paragraphs must appear once in the approved order`);
      assert(main.indexOf("<h1") < main.indexOf("<img"), "DOM reading order is text then image");
      assert(main.includes("inspired.png") && main.includes("aboutus.jpg"));
      assert(main.includes('loading="eager"') && main.includes('loading="lazy"'));
      assert(!/about\.(?:inspired|us)|\{\{/.test(main));
      assert.equal(metadata.title, locale.seo.about.title);
      assert.equal(metadata.description, locale.seo.about.description);
      const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)[0];
      assert(footer.includes(`href="${localizedUrl(language, { page: "about-us" }, server.config.base)}"`));
      assert(footer.includes(escapeMarkup(locale.footer.links.behind)));
      assert.equal((footer.match(/href="#"/g) || []).length, 9, "Only About, Privacy and the two Wholesale links have routes");
    }
  } finally {
    await server.close();
  }
});

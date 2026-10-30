import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import { privacyLinks, privacySections, privacyUpdatedOn } from "../src/data/privacy.js";
import { localizedUrl, parseLocation } from "../src/routing/urls.js";
import { supportedLanguages } from "../src/routing/routeManifest.js";
import { escapeMarkup } from "../build/html.js";

test("privacy URLs preserve page identity when switching languages, including root hosting and trailing slashes", () => {
  for (const base of ["/", "/muuva/"]) {
    for (const language of supportedLanguages) {
      const route = parseLocation(new URL(`https://example.com${base}${language}/privacy?source=saved#privacy-rights`), base);
      assert.equal(route.page, "privacy");
      for (const target of supportedLanguages) {
        assert.equal(localizedUrl(target, route, base), `${base}${target}/privacy/?source=saved#privacy-rights`);
      }
    }
  }
});

test("all 40 server-rendered pages preserve localized footer and Privacy content with newsletter off and on", async () => {
  const keys = ["VITE_BASE_PATH", "VITE_NEWSLETTER_ENABLED", "VITE_TURNSTILE_SITE_KEY", "VITE_PUBLIC_SITE_ORIGIN"];
  const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  try {
    for (const newsletterEnabled of [false, true]) {
      // Set the Vite build inputs before each server starts, regardless of the CI environment.
      process.env.VITE_BASE_PATH = "/";
      process.env.VITE_PUBLIC_SITE_ORIGIN = "https://staging.muuva.pages.dev";
      if (newsletterEnabled) {
        process.env.VITE_NEWSLETTER_ENABLED = "true";
        process.env.VITE_TURNSTILE_SITE_KEY = "public-test-site-key";
      } else {
        process.env.VITE_NEWSLETTER_ENABLED = "false";
        process.env.VITE_TURNSTILE_SITE_KEY = "";
      }
      const server = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
      try {
        const { renderPage, getPublicPages } = await server.ssrLoadModule("/src/entry-server.jsx");
        const pages = getPublicPages();
        assert.equal(pages.length, 40);
        const titles = new Set();
        for (const { language, path } of pages) {
          const locale = JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
          const { html, route, metadata } = renderPage(language, path);
          const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
          const privacyUrl = localizedUrl(language, { page: "privacy" }, server.config.base);
          assert(footer?.includes(`href="${privacyUrl}"`));
          assert(footer.includes(escapeMarkup(locale.footer.links.privacy)));
          assert(footer.includes(escapeMarkup(locale.footer.description)));
          if (newsletterEnabled) {
            assert(footer.includes(`<form`) && footer.includes(`aria-label="${escapeMarkup(locale.newsletter.formLabel)}"`));
            assert(footer.includes('type="email"') && footer.includes('type="checkbox"'));
            assert(!/<input\b[^>]*type="checkbox"[^>]*\bchecked\b/i.test(footer), "Marketing consent must start unchecked");
            assert(footer.includes(`href="${privacyUrl}"`));
            for (const key of ["emailLabel", "consent", "privacyIntro", "verificationLabel", "subscribe"]) {
              assert(footer.includes(escapeMarkup(locale.newsletter[key])), `${language}: missing newsletter.${key}`);
            }
            assert(!footer.includes(escapeMarkup(locale.footer.comingSoon)));
            assert(!/role="status"|aria-live=/i.test(footer), "Footer must not imply a completed signup");
          } else {
            assert(footer.includes(escapeMarkup(locale.footer.comingSoon)));
            assert(!/<(?:form|input|button)\b|role="(?:button|status)"|aria-live=/i.test(footer), "Footer teaser must not collect email or imply a subscription");
          }
          assert.equal(locale.footer.success, undefined);
          if (route.page !== "privacy") continue;
          assert(html.includes('href="mailto:contact@muuva.nl"'));
          assert(html.includes("KvK 99637588"));
          titles.add(metadata.title);
          assert.equal(metadata.title, locale.seo.privacy.title);
          assert.equal(metadata.description, locale.seo.privacy.description);
          assert(html.toLowerCase().includes(`datetime="${privacyUpdatedOn}"`));
          for (const key of ["title", "draft", "intro", "updated"]) assert(html.includes(escapeMarkup(locale.privacy[key])));
          for (const { id, paragraphs, links } of privacySections) {
            assert(html.includes(`aria-labelledby="privacy-${id}"`));
            assert(html.includes(escapeMarkup(locale.privacy.sections[id].title)));
            for (let n = 1; n <= paragraphs; n++) {
              const paragraph = locale.privacy.sections[id][`p${n}`];
              assert(paragraph?.length > 60, `${language}/${id}/p${n} missing substantive copy`);
              assert(html.includes(escapeMarkup(paragraph)), `${language}/${id}/p${n} missing from SSR`);
            }
            for (const link of links) {
              assert(html.includes(`href="${privacyLinks[link]}"`));
              assert(html.includes(escapeMarkup(locale.privacy.links[link])));
            }
          }
          assert(!/privacy\.(?:sections|links|title|draft)|\{\{/.test(html));
        }
        assert.equal(titles.size, 4);
      } finally {
        await server.close();
      }
    }
  } finally {
    for (const [key, value] of Object.entries(saved)) value === undefined ? delete process.env[key] : process.env[key] = value;
  }
});

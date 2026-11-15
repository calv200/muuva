import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "vite";
import { marketplaceHref, MARKETPLACE_STORAGE_KEY } from "../src/commerce/marketplace.js";
import { readFileSync } from "node:fs";
import { MARKETPLACES, defaultMarketplaceChoice, selectMarketplace } from "../src/commerce/marketplaceRules.js";

const locale = (language) => JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
import { supportedLanguages } from "../src/routing/routeManifest.js";

test("static and local fallback links use manual choice, language, then approved NL default", () => {
  assert.equal(marketplaceHref("en"), MARKETPLACES.NL);
  assert.equal(marketplaceHref("es"), MARKETPLACES.NL);
  assert.equal(marketplaceHref("nl"), MARKETPLACES.NL);
  assert.equal(marketplaceHref("de"), MARKETPLACES.DE);
  assert.equal(marketplaceHref("en", "DE"), MARKETPLACES.DE);
  assert.equal(marketplaceHref("de", "NL"), MARKETPLACES.NL);
  assert.equal(MARKETPLACE_STORAGE_KEY, "muuva.marketplace");
});

test("marketplace rule table covers language and country precedence without storing geolocation", () => {
  const language = { en: "NL", es: "NL", nl: "NL", de: "DE" };
  for (const [locale, expected] of Object.entries(language)) {
    assert.equal(selectMarketplace({ language: locale }), expected);
    assert.equal(selectMarketplace({ language: locale, country: "DE" }), locale === "en" || locale === "es" ? "DE" : expected);
    assert.equal(selectMarketplace({ language: locale, country: "NL" }), expected);
    assert.equal(selectMarketplace({ language: locale, country: "US" }), expected);
    assert.equal(selectMarketplace({ language: locale, country: null }), expected);
    assert.equal(selectMarketplace({ language: locale, override: "NL", country: "DE" }), "NL");
    assert.equal(selectMarketplace({ language: locale, override: "DE", country: "NL" }), "DE");
    assert.equal(selectMarketplace({ language: locale, override: "EU", country: "DE" }), "DE");
    assert.equal(selectMarketplace({ language: locale, override: "EU", country: "FR" }), "NL");
    assert.equal(selectMarketplace({ language: locale, override: "EU" }), expected);
  }
});

test("all rendered Amazon CTA locations use centralized safe marketplace links in four languages", async () => {
  const keys = ["VITE_BASE_PATH", "VITE_PUBLIC_SITE_ORIGIN"];
  const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  process.env.VITE_BASE_PATH = "/muuva/";
  process.env.VITE_PUBLIC_SITE_ORIGIN = "https://calv200.github.io";
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom", logLevel: "error" });
  try {
    const { renderPage } = await server.ssrLoadModule("/src/entry-server.jsx");
    const { routines } = await server.ssrLoadModule("/src/data/guidedRoutines.js");
    assert.deepEqual(routines.map(({ durationMinutes }) => durationMinutes), [15, 15, 10, 15, 20]);
    for (const language of supportedLanguages) {
      const home = renderPage(language, "").html;
      const expected = language === "de" ? MARKETPLACES.DE : MARKETPLACES.NL;
      assert(home.includes(`href="${expected}" target="_blank" rel="noopener noreferrer"`));
      for (const choice of ["NL", "DE", "EU"]) assert(new RegExp(`<option value="${choice}"[^>]*>${choice}</option>`).test(home), `${choice} store option`);
      assert(new RegExp(`<option value="${defaultMarketplaceChoice(language)}"[^>]*selected`).test(home), "Language default is preselected");
      assert(!locale(language).product.buy.includes("→"), "Purchase pill has no trailing arrow");
      const detail = renderPage(language, "guided-routines/ring/").html;
      assert(detail.includes(`href="${expected}" target="_blank" rel="noopener noreferrer"`));
      assert(!home.includes("/api/marketplace"), "GitHub Pages compatibility build must not expose the Pages Function endpoint");
    }
    const allRoutines = renderPage("en", "guided-routines/").html;
    assert(allRoutines.includes("10 min"), "Sliders duration is visible as 10 minutes in the routine listing");
  } finally {
    await server.close();
    for (const [key, value] of Object.entries(saved)) value === undefined ? delete process.env[key] : process.env[key] = value;
  }
});

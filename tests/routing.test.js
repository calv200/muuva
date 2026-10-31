import assert from "node:assert/strict";
import test from "node:test";
import { languageFromPath, localizedUrl, parseLocation, filterQuery } from "../src/routing/urls.js";
import { pagePaths, routineSlugs, supportedLanguages } from "../src/routing/routeManifest.js";

const base = "/muuva/";
const parse = (url) => parseLocation(new URL(url, "https://example.com"), base);

test("all generated language/page paths parse and round-trip", () => {
  assert.equal(pagePaths.length, 6 + Object.keys(routineSlugs).length);
  for (const language of supportedLanguages) {
    for (const path of pagePaths) {
      const url = `${base}${language}/${path}`;
      const route = parse(url);
      assert.equal(route.language, language);
      assert.equal(localizedUrl(language, route, base), url);
    }
  }
});

test("language prefixes must be supported and inside the configured base", () => {
  assert.equal(languageFromPath("/muuva/de/", base), "de");
  for (const path of ["/other/de/", "/muuva/de-DE/", "/muuva/fr/", "/muuva/"]) {
    assert.equal(languageFromPath(path, base), null);
  }
  assert.throws(() => localizedUrl("fr", {}, base));
});

test("URL helpers support a different project base and root hosting", () => {
  assert.equal(localizedUrl("nl", { page: "guided-routines" }, "/shop/"), "/shop/nl/guided-routines/");
  assert.equal(localizedUrl("es", {}, "/"), "/es/");
  assert.equal(languageFromPath("/de/", "/"), "de");
});

test("root-hosted manifest routes preserve language, filters, queries, and anchors", () => {
  for (const language of supportedLanguages) {
    for (const path of pagePaths) {
      const url = `/${language}/${path}?filter=Full%20body&tag=a&tag=b#video`;
      const route = parseLocation(new URL(url, "https://muuva.pages.dev"), "/");
      assert.equal(route.language, language);
      assert.equal(route.filter, "Full body");
      assert.equal(localizedUrl(language, route, "/"), url);
      const switched = parseLocation(new URL(localizedUrl("de", route, "/"), "https://muuva.pages.dev"), "/");
      assert.equal(switched.language, "de");
      assert.equal(switched.page, route.page);
      assert.equal(switched.slug, route.slug);
      assert.equal(switched.search, route.search);
      assert.equal(switched.hash, route.hash);
    }
  }
});

test("switching language preserves workout, all query values, and section anchor", () => {
  const route = parse("/muuva/en/guided-routines/full-body/?filter=Full%20body&tag=a&tag=b#video");
  const switched = localizedUrl("de", route, base);
  assert.equal(switched, "/muuva/de/guided-routines/full-body/?filter=Full%20body&tag=a&tag=b#video");
  assert.equal(parse(switched).returnFilter, "Full body");
});

test("legacy page routes migrate without confusing section anchors", () => {
  for (const suffix of ["", "#/", "#/guided-routines", "#/guided-routines/ring?filter=Ring"]) {
    const route = parse(`/muuva/${suffix}`);
    const migrated = parse(localizedUrl("nl", route, base));
    assert.equal(migrated.page, route.page);
    assert.equal(migrated.slug, route.slug);
    assert.equal(migrated.filter, route.filter);
    assert.equal(migrated.legacy, false);
  }
  const section = parse("/muuva/#product");
  assert.equal(section.page, "home");
  assert.equal(section.legacy, false);
  assert.equal(localizedUrl("es", section, base), "/muuva/es/#product");
});

test("legacy filters take precedence over outer query values, preserving repeated parameters", () => {
  const route = parse("/muuva/?source=saved&filter=Ball#/guided-routines?filter=Ring&tag=a&tag=b");
  const query = new URLSearchParams(route.search);
  assert.equal(query.get("source"), "saved");
  assert.equal(query.get("filter"), "Ring");
  assert.deepEqual(query.getAll("tag"), ["a", "b"]);
});

test("filters use stable IDs and reset only their own query parameter", () => {
  const query = filterQuery("?source=mail&filter=Ring&tag=a&tag=b", "Full body");
  assert.equal(new URLSearchParams(query).get("filter"), "Full body");
  const reset = new URLSearchParams(filterQuery(query, "All"));
  assert.equal(reset.has("filter"), false);
  assert.equal(reset.get("source"), "mail");
  assert.deepEqual(reset.getAll("tag"), ["a", "b"]);
  assert.equal(filterQuery("?filter=Ring", ""), "");
});

test("encoded or malformed slugs canonicalize once without repeated escaping", () => {
  for (const slug of ["unknown%20routine", "unknown%25", "unknown%zz"]) {
    const first = localizedUrl("en", parse(`/muuva/en/guided-routines/${slug}/`), base);
    assert.equal(localizedUrl("en", parse(first), base), first);
  }
});

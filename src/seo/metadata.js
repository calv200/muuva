import { routineSlugs, supportedLanguages } from "../routing/routeManifest.js";
import { localizedUrl } from "../routing/urls.js";
import { publicSiteOrigin } from "./site.js";

export function getMetadata(language, route, t, { origin = publicSiteOrigin, base } = {}) {
  const validDetail = route.page === "routine-detail" && Object.values(routineSlugs).includes(route.slug);
  const page = validDetail ? "routine-detail" : route.page === "home" ? "home" : "guided-routines";
  // Queries and anchors never participate in canonical or alternate URLs.
  const canonicalRoute = { page, slug: validDetail ? route.slug : "" };
  const absolute = (lang) => `${origin}${localizedUrl(lang, canonicalRoute, base)}`;
  const key = page === "home" ? "home" : "routines";
  return {
    language,
    title: validDetail
      ? t("seo.workout.title", { title: t(`routines.workouts.${route.slug}.title`) })
      : t(`seo.${key}.title`),
    description: validDetail ? t(`seo.workout.descriptions.${route.slug}`) : t(`seo.${key}.description`),
    canonical: absolute(language),
    alternates: [
      ...supportedLanguages.map((lang) => ({ language: lang, href: absolute(lang) })),
      { language: "x-default", href: absolute("en") },
    ],
  };
}

function singleTag(selector, tagName) {
  const existing = [...document.head.querySelectorAll(selector)];
  const element = existing.shift() || document.createElement(tagName);
  existing.forEach((duplicate) => duplicate.remove());
  if (!element.parentNode) document.head.append(element);
  return element;
}

export function updateDocumentMetadata(metadata) {
  document.documentElement.lang = metadata.language;
  document.title = metadata.title;
  const description = singleTag('meta[name="description"]', "meta");
  description.name = "description";
  description.content = metadata.description;
  const canonical = singleTag('link[rel="canonical"]', "link");
  canonical.rel = "canonical";
  canonical.href = metadata.canonical;
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => link.remove());
  for (const alternate of metadata.alternates) {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = alternate.language;
    link.href = alternate.href;
    document.head.append(link);
  }
}

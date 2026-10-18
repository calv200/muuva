import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { translationOptions } from "./resources.js";
import { supportedLanguages } from "../routing/routeManifest.js";
import { languageFromPath } from "../routing/urls.js";

export { supportedLanguages };
export const languageStorageKey = "muuva.language";

export function normalizeLanguage(value) {
  if (typeof value !== "string") return null;
  const base = value.trim().replaceAll("_", "-").split("-")[0].toLowerCase();
  return supportedLanguages.includes(base) ? base : null;
}

export function saveManualLanguage(language) {
  const supported = normalizeLanguage(language);
  if (!supported) return;
  try {
    window.localStorage.setItem(languageStorageKey, supported);
  } catch {
    // Language selection still works for this session when storage is blocked.
  }
}

const isBrowser = typeof window !== "undefined";
const detector = new LanguageDetector();

detector.addDetector({
  name: "muuvaUrl",
  lookup() {
    return languageFromPath(window.location.pathname);
  },
});

detector.addDetector({
  name: "muuvaManual",
  lookup() {
    try {
      return normalizeLanguage(window.localStorage.getItem(languageStorageKey));
    } catch {
      return null;
    }
  },
});

detector.addDetector({
  name: "muuvaBrowserPreferences",
  lookup() {
    const preferences = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];
    return preferences.map(normalizeLanguage).find(Boolean) ?? null;
  },
});

i18n.on("languageChanged", (language) => {
  if (isBrowser) document.documentElement.lang = normalizeLanguage(language) ?? "en";
});

if (isBrowser) i18n.use(detector).use(initReactI18next);

i18n.init({
  ...translationOptions,
  ...(isBrowser ? {} : { lng: "en" }),
  detection: {
    order: ["muuvaUrl", "muuvaManual", "muuvaBrowserPreferences"],
    caches: [],
  },
});

if (isBrowser) document.documentElement.lang = normalizeLanguage(i18n.language) ?? "en";

export default i18n;

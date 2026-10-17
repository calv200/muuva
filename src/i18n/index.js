import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import de from "./locales/de.json";
import nl from "./locales/nl.json";
import es from "./locales/es.json";

export const supportedLanguages = ["en", "de", "nl", "es"];
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

const detector = new LanguageDetector();

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
  document.documentElement.lang = normalizeLanguage(language) ?? "en";
  document.title = i18n.t("site.title");
});

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      nl: { translation: nl },
      es: { translation: es },
    },
    supportedLngs: supportedLanguages,
    fallbackLng: "en",
    load: "languageOnly",
    detection: {
      order: ["muuvaManual", "muuvaBrowserPreferences"],
      caches: [],
    },
    interpolation: { escapeValue: false },
    initImmediate: false,
  });

document.documentElement.lang = normalizeLanguage(i18n.language) ?? "en";
document.title = i18n.t("site.title");

export default i18n;

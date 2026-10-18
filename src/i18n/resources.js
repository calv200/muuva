import en from "./locales/en.json";
import de from "./locales/de.json";
import nl from "./locales/nl.json";
import es from "./locales/es.json";
import { supportedLanguages } from "../routing/routeManifest.js";

export const resources = {
  en: { translation: en },
  de: { translation: de },
  nl: { translation: nl },
  es: { translation: es },
};

export const translationOptions = {
  resources,
  supportedLngs: supportedLanguages,
  fallbackLng: "en",
  load: "languageOnly",
  interpolation: { escapeValue: false },
  initImmediate: false,
};

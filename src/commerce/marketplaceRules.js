import { AMAZON_MARKETPLACES } from "../data/product.js";

export const MARKETPLACES = AMAZON_MARKETPLACES;

export const MARKETPLACE_CHOICES = ["NL", "DE", "EU"];

// Choice shown before the visitor picks one: the language's store, otherwise automatic.
export function defaultMarketplaceChoice(language) {
  if (language === "nl") return "NL";
  if (language === "de") return "DE";
  return "EU";
}

export function selectMarketplace({ language, override = null, country = null }) {
  if (override === "NL" || override === "DE") return override;
  const germany = String(country || "").toUpperCase() === "DE";
  // EU is the explicit automatic choice: a known country decides (DE, otherwise NL).
  if (override === "EU" && country) return germany ? "DE" : "NL";
  if (language === "nl") return "NL";
  if (language === "de") return "DE";
  return germany ? "DE" : "NL";
}

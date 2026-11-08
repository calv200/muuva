import { AMAZON_MARKETPLACES } from "../data/product.js";

export const MARKETPLACES = AMAZON_MARKETPLACES;

export function selectMarketplace({ language, override = null, country = null }) {
  if (override === "NL" || override === "DE") return override;
  if (language === "nl") return "NL";
  if (language === "de") return "DE";
  if (String(country || "").toUpperCase() === "DE") return "DE";
  return "NL";
}

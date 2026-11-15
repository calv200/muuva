import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MARKETPLACE_STORAGE_KEY, marketplaceHref } from "./marketplace.js";
import { MARKETPLACE_CHOICES, defaultMarketplaceChoice } from "./marketplaceRules.js";

const MarketplaceContext = createContext(null);

export function MarketplaceProvider({ children }) {
  const [override, setOverride] = useState(null);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(MARKETPLACE_STORAGE_KEY);
      if (MARKETPLACE_CHOICES.includes(stored)) setOverride(stored);
    } catch { /* Functional preference storage is optional. */ }
  }, []);
  function choose(value) {
    const next = MARKETPLACE_CHOICES.includes(value) ? value : null;
    setOverride(next);
    try {
      if (next) window.localStorage.setItem(MARKETPLACE_STORAGE_KEY, next);
      else window.localStorage.removeItem(MARKETPLACE_STORAGE_KEY);
    } catch { /* The current-page choice still applies when storage is unavailable. */ }
  }
  return <MarketplaceContext.Provider value={{ override, choose }}>{children}</MarketplaceContext.Provider>;
}

function useMarketplace() {
  const value = useContext(MarketplaceContext);
  if (!value) throw new Error("MarketplaceProvider is missing");
  return value;
}

export function MarketplaceLink({ children, ...props }) {
  const { i18n } = useTranslation();
  const { override } = useMarketplace();
  return <a href={marketplaceHref(i18n.resolvedLanguage, override)} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
}

export function MarketplaceSelector() {
  const { t, i18n } = useTranslation();
  const { override, choose } = useMarketplace();
  return (
    <span className="product-purchase-region">
      <select
        aria-label={t("product.marketplace.label")}
        value={override || defaultMarketplaceChoice(i18n.resolvedLanguage)}
        onChange={(event) => choose(event.target.value)}
      >
        <option value="NL" title={t("product.marketplace.nl")}>NL</option>
        <option value="DE" title={t("product.marketplace.de")}>DE</option>
        <option value="EU" title={t("product.marketplace.automatic")}>EU</option>
      </select>
    </span>
  );
}

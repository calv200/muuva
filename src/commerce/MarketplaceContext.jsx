import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MARKETPLACE_STORAGE_KEY, marketplaceHref } from "./marketplace.js";

const MarketplaceContext = createContext(null);

export function MarketplaceProvider({ children }) {
  const [override, setOverride] = useState(null);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(MARKETPLACE_STORAGE_KEY);
      if (stored === "NL" || stored === "DE") setOverride(stored);
    } catch { /* Functional preference storage is optional. */ }
  }, []);
  function choose(value) {
    const next = value === "NL" || value === "DE" ? value : null;
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
  const { t } = useTranslation();
  const { override, choose } = useMarketplace();
  return (
    <label className="muuva-footer-link mt-4 flex flex-wrap items-center gap-2 text-muted">
      <span>{t("product.marketplace.label")}</span>
      <select value={override || ""} onChange={(event) => choose(event.target.value)} className="min-h-11 rounded-sm border border-softborder bg-cream px-3 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
        <option value="">{t("product.marketplace.automatic")}</option>
        <option value="NL">{t("product.marketplace.nl")}</option>
        <option value="DE">{t("product.marketplace.de")}</option>
      </select>
    </label>
  );
}

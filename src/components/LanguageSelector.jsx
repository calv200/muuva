import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { normalizeLanguage, saveManualLanguage, supportedLanguages } from "../i18n/index.js";
import { localizedUrl, parseLocation } from "../routing/urls.js";
import { navigate } from "../routing/navigation.js";

function GlobeIcon() {
  return (
    <svg aria-hidden="true" className="h-[20px] w-[20px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21M12 3c-2.2 2.5-3.3 5.5-3.3 9s1.1 6.5 3.3 9" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 4 4 4 4-4" />
    </svg>
  );
}

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const focusOnOpen = useRef(0);
  const activeLanguage = normalizeLanguage(i18n.resolvedLanguage || i18n.language) ?? "en";

  useEffect(() => {
    if (!isOpen) return;
    optionRefs.current[focusOnOpen.current]?.focus();

    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isOpen]);

  const openAt = (index) => {
    focusOnOpen.current = index;
    setIsOpen(true);
  };

  const closeAndFocusTrigger = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const selectLanguage = (language) => {
    saveManualLanguage(language);
    navigate(localizedUrl(language, parseLocation(window.location)));
    closeAndFocusTrigger();
  };

  const handleMenuKeyDown = (event) => {
    const currentIndex = optionRefs.current.indexOf(document.activeElement);
    let nextIndex;
    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % supportedLanguages.length;
    if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + supportedLanguages.length) % supportedLanguages.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = supportedLanguages.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      optionRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative text-ink"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          event.preventDefault();
          closeAndFocusTrigger();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 font-sans text-sm font-medium transition hover:bg-linen/40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand"
        aria-label={t("header.languageSelector", { language: t(`languages.${activeLanguage}`) })}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? "header-language-menu" : undefined}
        onClick={() => isOpen ? setIsOpen(false) : openAt(supportedLanguages.indexOf(activeLanguage))}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openAt(event.key === "ArrowUp" ? supportedLanguages.length - 1 : supportedLanguages.indexOf(activeLanguage));
          }
        }}
      >
        <GlobeIcon />
        <span>{activeLanguage.toUpperCase()}</span>
        <ChevronIcon />
      </button>

      {isOpen && (
        <div
          id="header-language-menu"
          role="menu"
          aria-label={t("header.languageSelector", { language: t(`languages.${activeLanguage}`) })}
          className="absolute right-0 top-full z-40 mt-2 w-52 rounded-xl border border-softborder bg-warm p-1.5 shadow-[0_12px_28px_rgb(36_33_31_/_12%)]"
          onKeyDown={handleMenuKeyDown}
        >
          {supportedLanguages.map((language, index) => (
            <button
              key={language}
              ref={(element) => { optionRefs.current[index] = element; }}
              type="button"
              role="menuitemradio"
              aria-checked={activeLanguage === language}
              tabIndex={-1}
              className={`flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left font-sans text-sm transition focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand ${activeLanguage === language ? "bg-beige/45 text-ink" : "text-muted hover:bg-cream hover:text-ink"}`}
              onClick={() => selectLanguage(language)}
            >
              <span>{t(`languages.${language}`)}</span>
              <span className="font-medium text-brand">{language.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

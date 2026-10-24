import muuvaLogo from "../assets/images/muuvaLogo.png";
import SiteContainer from "./SiteContainer.jsx";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector.jsx";
import { localizedUrl } from "../routing/urls.js";

export default function Header() {
  const { t, i18n } = useTranslation();
  return (
    <header className="sticky top-0 z-30 bg-warm backdrop-blur-sm">
      <SiteContainer className="flex h-16 items-center justify-between">
        <a href={localizedUrl(i18n.resolvedLanguage)} className="inline-flex items-center" aria-label={t("header.home")}>
          <img
            className="h-[18px] w-auto object-contain"
            src={muuvaLogo}
            alt="muuva"
          />
        </a>

        <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
          <nav className="hidden items-center gap-4 text-[15px] font-medium leading-none sm:flex lg:gap-8">
            <a
              className="underline decoration-ink/70 underline-offset-4 transition hover:decoration-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
              href={localizedUrl(i18n.resolvedLanguage, { hash: "#product" })}
            >
              {t("header.shop")}
            </a>
            <a
              className="underline decoration-ink/70 underline-offset-4 transition hover:decoration-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
              href={localizedUrl(i18n.resolvedLanguage, { page: "guided-routines" })}
            >
              {t("header.trainingSessions")}
            </a>
          </nav>

          <LanguageSelector />
        </div>
      </SiteContainer>
    </header>
  );
}

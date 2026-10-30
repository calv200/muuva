import { useTranslation } from "react-i18next";
import SiteContainer from "../components/SiteContainer.jsx";
import { localizedUrl } from "../routing/urls.js";

export default function NewsletterConfirmedPage() {
  const { t, i18n } = useTranslation();
  return (
    <main>
      <SiteContainer className="py-20 sm:py-28">
        <div className="mx-auto max-w-2xl bg-soft-sand px-7 py-12 text-center sm:px-12 sm:py-16">
          <h1 className="font-serif text-4xl font-medium leading-tight text-ink sm:text-5xl">{t("newsletterConfirmed.title")}</h1>
          <p className="muuva-support mx-auto mt-7 max-w-xl text-muted">{t("newsletterConfirmed.description")}</p>
          <a href={localizedUrl(i18n.resolvedLanguage)} className="muuva-ui mt-9 inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-7 py-3 font-medium text-white transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
            {t("newsletterConfirmed.cta")}
          </a>
        </div>
      </SiteContainer>
    </main>
  );
}

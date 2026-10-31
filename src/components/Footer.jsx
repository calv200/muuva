import { useTranslation } from "react-i18next";
import SiteContainer from "./SiteContainer.jsx";
import { localizedUrl } from "../routing/urls.js";
import NewsletterSignup from "./NewsletterSignup.jsx";

const newsletterEnabled = import.meta.env.VITE_NEWSLETTER_ENABLED === "true" && import.meta.env.BASE_URL === "/";

const navigationLinks = [
  "footer.links.behind",
  "footer.links.contact",
  "footer.links.wholesale",
  "footer.links.apply",
  "footer.links.care",
  "footer.links.sustainability",
];

const policyLinks = [
  "footer.links.faq",
  "footer.links.privacy",
  "footer.links.refund",
  "footer.links.shipping",
  "footer.links.service",
  "footer.links.use",
];

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <path strokeLinecap="round" d="M17.3 6.7h.01" />
    </svg>
  );
}

function FooterLinkList({ links, ariaLabel }) {
  const { t, i18n } = useTranslation();
  return (
    <nav aria-label={ariaLabel}>
      <ul className="space-y-3 text-muted sm:space-y-3.5">
        {links.map((link) => (
          <li key={link}>
            <a
              className="muuva-footer-link transition hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
              href={link === "footer.links.behind" ? localizedUrl(i18n.resolvedLanguage, { page: "about-us" }) : link === "footer.links.privacy" ? localizedUrl(i18n.resolvedLanguage, { page: "privacy" }) : ["footer.links.wholesale", "footer.links.apply"].includes(link) ? localizedUrl(i18n.resolvedLanguage, { page: "wholesale" }) : "#"}
            >
              {t(link)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-warm py-16 text-ink sm:py-20 lg:py-24">
      <SiteContainer>
        <div className="grid gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-14 lg:grid-cols-[1.45fr_0.8fr_0.8fr_1fr] lg:gap-16">
          <div className="min-w-0">
            <h2 className="font-serif text-4xl font-medium leading-tight sm:text-5xl">
              {t("footer.title")}
            </h2>
            <p className="muuva-support mt-7 max-w-md text-muted">
              {t("footer.description")}
            </p>

            {newsletterEnabled ? <NewsletterSignup /> : <p className="muuva-label mt-8 text-brand">{t("footer.comingSoon")}</p>}
          </div>

          <FooterLinkList links={navigationLinks} ariaLabel={t("footer.navigation")} />
          <FooterLinkList links={policyLinks} ariaLabel={t("footer.policies")} />

          <div className="max-w-sm lg:max-w-[18rem]">
            <h2 className="muuva-ui font-medium text-ink">{t("footer.aboutTitle")}</h2>
            <p className="muuva-support mt-7 text-muted">
              {t("footer.about")}
            </p>
          </div>
        </div>

        <div className="muuva-legal mt-16 flex flex-col gap-9 text-muted sm:mt-20 lg:mt-24">
          <a
            className="inline-flex h-10 w-10 items-center justify-center text-muted transition hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
            href="https://www.instagram.com/muuva.studio/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("footer.instagram")}
          >
            <InstagramIcon />
          </a>

          <p>
            {t("footer.copyrightPrefix", { year: 2026 })}{" "}
            <a
              className="transition hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
              href="#"
            >
              Calv200
            </a>
            .
          </p>
        </div>
      </SiteContainer>
    </footer>
  );
}

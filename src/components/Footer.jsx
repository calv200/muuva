import { useTranslation } from "react-i18next";
import SiteContainer from "./SiteContainer.jsx";
import { localizedUrl } from "../routing/urls.js";
import NewsletterSignup from "./NewsletterSignup.jsx";
import { useConsent } from "../consent/ConsentProvider.jsx";

const newsletterEnabled = import.meta.env.VITE_NEWSLETTER_ENABLED === "true" && import.meta.env.BASE_URL === "/";

const navigationLinks = [
  "footer.links.behind",
  "footer.links.contact",
  "footer.links.apply",
];

const policyLinks = [
  "footer.links.privacy",
];

function SocialIcon({ platform }) {
  const common = { "aria-hidden": true, className: "h-6 w-6", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  if (platform === "instagram") return <svg {...common}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.6" cy="6.6" r=".8" fill="currentColor" stroke="none" /></svg>;
  if (platform === "tiktok") return <svg {...common}><path d="M14 4v10.2a4.1 4.1 0 1 1-3.2-4" /><path d="M14 4c.6 2.5 2.2 4 5 4.3" /></svg>;
  return <svg {...common}><path d="M21 8.2a2.8 2.8 0 0 0-2-2C17.3 5.7 12 5.7 12 5.7s-5.3 0-7 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2.5 12a29 29 0 0 0 .5 3.8 2.8 2.8 0 0 0 2 2c1.7.5 7 .5 7 .5s5.3 0 7-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-3.8 29 29 0 0 0-.5-3.8Z" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></svg>;
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
              href={link === "footer.links.behind" ? localizedUrl(i18n.resolvedLanguage, { page: "about-us" }) : link === "footer.links.contact" ? localizedUrl(i18n.resolvedLanguage, { page: "contact" }) : link === "footer.links.privacy" ? localizedUrl(i18n.resolvedLanguage, { page: "privacy" }) : link === "footer.links.apply" ? localizedUrl(i18n.resolvedLanguage, { page: "wholesale" }) : "#"}
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
  const { openSettings } = useConsent();
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
          <button type="button" onClick={openSettings} className="min-h-11 self-start text-left underline underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand">{t("consent.settings")}</button>
          <nav aria-label={t("footer.socials")} className="flex gap-2">
            {[["instagram", "https://www.instagram.com/muuva.studio/"], ["tiktok", "https://www.tiktok.com/@muuva.studio"], ["youtube", "https://www.youtube.com/@Muuva.studio"]].map(([platform, href]) => (
              <a key={platform} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" href={href} target="_blank" rel="noopener noreferrer" aria-label={t(`footer.${platform}`)}>
                <SocialIcon platform={platform} />
              </a>
            ))}
          </nav>

          <p>
            {t("footer.copyrightPrefix", { year: 2026 })}{" "}
            <a
              className="transition hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
              href="https://www.instagram.com/calv200/"
              target="_blank"
              rel="noopener noreferrer"
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

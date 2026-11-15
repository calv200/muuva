import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import SiteContainer from "../components/SiteContainer.jsx";
import { privacyLinks, privacySections, privacyUpdatedOn } from "../data/privacy.js";

export default function PrivacyPage() {
  const { t, i18n } = useTranslation();
  const headingRef = useRef(null);
  const updated = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${privacyUpdatedOn}T00:00:00Z`));

  // Give keyboard users a clear starting point after following the footer link.
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, []);

  return (
    <main>
      <SiteContainer className="section-pad">
        <article lang={i18n.resolvedLanguage} className="mx-auto max-w-[44rem] break-words hyphens-auto" aria-labelledby="privacy-title">
          <header className="pb-10 sm:pb-12">
            <p className="muuva-label text-brand">{t("privacy.draft")}</p>
            <h1 ref={headingRef} id="privacy-title" tabIndex={-1} className="mt-5 font-serif text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.08] text-ink focus:outline-none">
              {t("privacy.title")}
            </h1>
            <p className="muuva-support mt-6 text-muted">{t("privacy.intro")}</p>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              {t("privacy.updated")} <time dateTime={privacyUpdatedOn}>{updated}</time>
            </p>
          </header>
          {privacySections.map(({ id, paragraphs, links }) => (
            <section key={id} aria-labelledby={`privacy-${id}`} className="border-t border-softborder py-8 sm:py-10">
              <h2 id={`privacy-${id}`} className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] font-medium leading-tight text-ink">
                {t(`privacy.sections.${id}.title`)}
              </h2>
              <div className="muuva-support mt-5 space-y-4 text-ink/85">
                {Array.from({ length: paragraphs }, (_, index) => (
                  <p key={index}>{t(`privacy.sections.${id}.p${index + 1}`)}</p>
                ))}
              </div>
              {links.map((link) => (
                <a key={link} href={privacyLinks[link]} className="mr-6 mt-5 inline-flex min-h-11 items-center text-sm font-medium leading-relaxed text-brand underline underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand">
                  {t(`privacy.links.${link}`)}
                </a>
              ))}
            </section>
          ))}
        </article>
      </SiteContainer>
    </main>
  );
}

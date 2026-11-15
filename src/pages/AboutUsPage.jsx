import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import SiteContainer from "../components/SiteContainer.jsx";
import inspired from "../assets/images/about us/inspired.png";
import aboutUs from "../assets/images/about us/aboutus.jpg";

export default function AboutUsPage() {
  const { t, i18n } = useTranslation();
  const headingRef = useRef(null);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, []);

  const headingClass = "font-serif text-[clamp(2.25rem,3.5vw,3rem)] font-medium leading-[1.08] text-ink";
  return (
    <main>
      <SiteContainer className="py-8 sm:py-12 lg:py-16">
        <div lang={i18n.resolvedLanguage} className="space-y-6 sm:space-y-8">
          <section aria-labelledby="about-inspired" className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            <div className="min-w-0 bg-soft-sand px-6 py-10 sm:p-10 lg:col-start-2 lg:row-start-1 xl:p-12">
              <h1 ref={headingRef} id="about-inspired" tabIndex={-1} className={`${headingClass} focus:outline-none`}>
                {t("about.inspired.title")}
              </h1>
              <p className="muuva-support mt-7 font-medium text-ink">{t("about.inspired.intro")}</p>
              <div className="muuva-support mt-6 space-y-5 text-ink/85">
                {[1, 2, 3, 4, 5].map((n) => <p key={n}>{t(`about.inspired.p${n}`)}</p>)}
              </div>
            </div>
            <div className="relative aspect-[3/2] min-w-0 overflow-hidden lg:col-start-1 lg:row-start-1 lg:aspect-auto">
              <img src={inspired} alt={t("about.inspired.alt")} width="890" height="593" loading="eager" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[44%_center]" />
            </div>
          </section>
          <section aria-labelledby="about-us" className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            <div className="min-w-0 bg-brand/10 px-6 py-10 sm:p-10 xl:p-12">
              <h2 id="about-us" className={headingClass}>{t("about.us.title")}</h2>
              <div className="muuva-support mt-7 space-y-5 text-ink/85">
                {[1, 2, 3, 4, 5].map((n) => <p key={n}>{t(`about.us.p${n}`)}</p>)}
              </div>
            </div>
            <div className="relative aspect-[3/4] min-w-0 overflow-hidden lg:aspect-auto">
              <img src={aboutUs} alt={t("about.us.alt")} width="4672" height="7008" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center" />
            </div>
          </section>
        </div>
      </SiteContainer>
    </main>
  );
}

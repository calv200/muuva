import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import SiteContainer from "../components/SiteContainer.jsx";
import WholesaleForm from "../components/WholesaleForm.jsx";
import studioImage from "../assets/images/studios and B2B/reformer_bench.jpg";

export default function WholesalePage() {
  const { t } = useTranslation();
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);

  return (
    <main>
      <SiteContainer className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-3xl">
          <p className="muuva-label text-brand">{t("wholesale.eyebrow")}</p>
          <h1 ref={heading} tabIndex={-1} className="mt-5 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.06] text-balance focus:outline-none">{t("wholesale.title")}</h1>
          <p className="muuva-support mt-6 max-w-2xl text-muted">{t("wholesale.intro")}</p>
        </div>
        <section aria-labelledby="wholesale-form-title" className="mt-10 grid gap-6 sm:mt-12 sm:gap-8 lg:mt-16 lg:grid-cols-2">
          <div className="relative aspect-[4/5] min-w-0 overflow-hidden sm:aspect-[4/3] lg:aspect-auto lg:min-h-[48rem]">
            <img src={studioImage} alt={t("wholesale.imageAlt")} width="1200" height="1600" loading="eager" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[55%_center]" />
          </div>
          <div className="min-w-0 border border-softborder bg-warm px-5 py-8 sm:p-10 lg:px-8 xl:p-12">
            <h2 id="wholesale-form-title" className="font-serif text-3xl font-medium leading-tight sm:text-4xl">{t("wholesale.formTitle")}</h2>
            <p className="muuva-support mt-4 text-muted">{t("wholesale.formIntro")}</p>
            <WholesaleForm />
          </div>
        </section>
      </SiteContainer>
    </main>
  );
}

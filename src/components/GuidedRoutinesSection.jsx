import { useTranslation } from "react-i18next";
import routineImage from "../assets/images/Model/ball_exercise1.png";
import CtaLink from "./CtaLink.jsx";
import { localizedUrl } from "../routing/urls.js";

export default function GuidedRoutinesSection() {
  const { t, i18n } = useTranslation();
  return (
    <section aria-label={t("promo.section")} className="bg-cream">
      <div className="grid lg:grid-cols-2">
        <div className="h-[360px] overflow-hidden bg-clay sm:h-[460px] lg:h-auto lg:min-h-[560px]">
          <img
            className="h-full w-full object-cover object-center"
            src={routineImage}
            alt={t("promo.imageAlt")}
          />
        </div>

        <div className="flex min-h-[420px] items-center justify-center bg-cream px-6 py-16 text-center sm:px-12 sm:py-20 lg:min-h-[560px] lg:px-20">
          <div className="max-w-xl">
            <p className="muuva-label text-brand">
              {t("promo.label")}
            </p>
            <h2 className="mt-5 font-serif text-[clamp(2rem,5vw,2.75rem)] font-medium leading-[1.1] text-balance">
              {t("promo.title")}
            </h2>
            <p className="muuva-support mx-auto mt-6 max-w-lg text-muted">
              {t("promo.description")}
            </p>

            <CtaLink className="mt-9 max-w-full text-center" href={localizedUrl(i18n.resolvedLanguage, { page: "guided-routines" })}>
              {t("promo.cta")}
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}

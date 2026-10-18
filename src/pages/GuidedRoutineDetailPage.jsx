import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import GuidedRoutineHero from "../components/guided-routines/GuidedRoutineHero.jsx";
import RoutineVideo from "../components/guided-routines/RoutineVideo.jsx";
import { routines } from "../data/guidedRoutines.js";
import { filterQuery, localizedUrl } from "../routing/urls.js";
import { useRoute } from "../routing/RouteContext.jsx";

export default function GuidedRoutineDetailPage({ slug, returnFilter = "" }) {
  const { t, i18n } = useTranslation();
  const { search } = useRoute();
  const videoSectionRef = useRef(null);
  const routine = routines.find(
    (item) => item.slug === slug && item.youtubeEmbedUrl
  );
  const backHref = localizedUrl(i18n.resolvedLanguage, {
    page: "guided-routines",
    search: filterQuery(search, returnFilter),
  });

  useEffect(() => {
    if (!routine) return;

    window.requestAnimationFrame(() => {
      videoSectionRef.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
      });
    });
  }, [routine]);

  if (!routine) {
    return (
      <main>
        <section className="section-pad bg-cream">
          <div className="site-container text-center">
            <h1 className="font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.08] text-ink">
              {t("routines.unavailable")}
            </h1>
            <p className="muuva-support mx-auto mt-5 max-w-xl text-muted">
              {t("routines.notReady")}
            </p>
            <a
              className="muuva-ui mt-8 inline-flex min-h-11 items-center rounded-full border border-softborder bg-warm px-5 text-ink transition hover:border-brand/40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
              href={backHref}
            >
              {t("routines.back")}
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <GuidedRoutineHero hero={routine.hero} />
      <section
        ref={videoSectionRef}
        className="flex min-h-[calc(100svh-4rem)] items-center bg-cream py-12 sm:py-16"
        aria-label={t(routine.titleKey)}
      >
        <div className="site-container w-full">
          <a
            className="muuva-ui mb-5 inline-flex min-h-11 items-center rounded-full border border-softborder bg-warm px-5 text-ink transition hover:border-brand/40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
            href={backHref}
          >
            {t("routines.back")}
          </a>
          <RoutineVideo routine={routine} />
        </div>
      </section>
    </main>
  );
}

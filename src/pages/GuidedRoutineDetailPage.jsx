import { useEffect, useRef } from "react";
import GuidedRoutineHero from "../components/guided-routines/GuidedRoutineHero.jsx";
import RoutineVideo from "../components/guided-routines/RoutineVideo.jsx";
import { routines } from "../data/guidedRoutines.js";

export default function GuidedRoutineDetailPage({ slug, returnFilter = "" }) {
  const videoSectionRef = useRef(null);
  const routine = routines.find(
    (item) => item.slug === slug && item.youtubeEmbedUrl
  );
  const backHref = returnFilter
    ? `#/guided-routines?filter=${encodeURIComponent(returnFilter)}`
    : "#/guided-routines";

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
              Routine not available
            </h1>
            <p className="muuva-support mx-auto mt-5 max-w-xl text-muted">
              This routine is not ready yet.
            </p>
            <a
              className="muuva-ui mt-8 inline-flex min-h-11 items-center rounded-full border border-softborder bg-warm px-5 text-ink transition hover:border-brand/40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
              href="#/guided-routines"
            >
              ← Back to Guided Routines
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
        aria-label={routine.title}
      >
        <div className="site-container w-full">
          <a
            className="muuva-ui mb-5 inline-flex min-h-11 items-center rounded-full border border-softborder bg-warm px-5 text-ink transition hover:border-brand/40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
            href={backHref}
          >
            ← Back to Guided Routines
          </a>
          <RoutineVideo routine={routine} />
        </div>
      </section>
    </main>
  );
}

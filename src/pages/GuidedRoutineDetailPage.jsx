import GuidedRoutineHero from "../components/guided-routines/GuidedRoutineHero.jsx";
import RoutineVideo from "../components/guided-routines/RoutineVideo.jsx";
import { routines } from "../data/guidedRoutines.js";

export default function GuidedRoutineDetailPage({ slug, returnFilter = "" }) {
  const routine = routines.find(
    (item) => item.slug === slug && item.youtubeEmbedUrl
  );
  const backHref = returnFilter
    ? `#/guided-routines?filter=${encodeURIComponent(returnFilter)}`
    : "#/guided-routines";

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
              className="muuva-ui mt-8 inline-flex text-ink underline decoration-ink/40 underline-offset-4 transition hover:decoration-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
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
      <section className="section-pad bg-cream" aria-label={routine.title}>
        <div className="site-container">
          <a
            className="muuva-ui mb-8 inline-flex text-muted underline decoration-ink/30 underline-offset-4 transition hover:text-ink hover:decoration-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
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

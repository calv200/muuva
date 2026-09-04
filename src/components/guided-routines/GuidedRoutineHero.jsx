import AssetPlaceholder from "./AssetPlaceholder.jsx";

export default function GuidedRoutineHero({ hero }) {
  if (!hero) {
    return (
      <section className="bg-warm py-16 sm:py-20 lg:py-24">
        <div className="site-container text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.05] text-balance text-ink">
              Guided routines
            </h1>
            <p className="muuva-support mx-auto mt-5 max-w-2xl text-muted">
              Move with your essentials. Follow simple Pilates sessions designed
              to make movement part of your everyday routine.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-warm py-14 sm:py-18 lg:py-24">
      <div className="site-container grid items-center gap-10 md:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <p className="muuva-label text-brand">Guided routines</p>
          <h1 className="mt-5 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.08] text-balance text-ink">
            {hero.title}
          </h1>
          <p className="muuva-support mt-5 max-w-xl text-muted">
            {hero.description}
          </p>

          {hero.kitCta && (
            <p className="muuva-ui mt-7 text-muted">
              Part of the Pilates Essential Kit ·{" "}
              <a
                className="text-ink underline decoration-ink/40 underline-offset-4 transition hover:decoration-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
                href="#"
              >
                Explore the kit →
              </a>
            </p>
          )}
        </div>

        <div className="mx-auto w-full max-w-xl overflow-hidden">
          {hero.image ? (
            <img
              className="h-full max-h-[420px] w-full object-contain"
              src={hero.image}
              alt={hero.imageAlt}
            />
          ) : (
            <AssetPlaceholder
              kind={hero.imageKind}
              label={`Add ${hero.filter} header image at src/assets/images/guided-routines/headers/${hero.filter
                .toLowerCase()
                .replace(/\s+/g, "-")}-header.png`}
            />
          )}
        </div>
      </div>
    </section>
  );
}

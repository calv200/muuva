import AssetPlaceholder from "./AssetPlaceholder.jsx";

export default function GuidedRoutineHero({ hero }) {
  const heroHeight =
    "flex h-[460px] items-center sm:h-[430px] lg:h-[440px]";

  if (!hero) {
    return (
      <section className={`${heroHeight} bg-warm`}>
        <div className="site-container">
          <div className="max-w-xl">
            <p className="muuva-label text-brand">Guided routines</p>
            <h1 className="mt-5 font-serif text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.05] text-balance text-ink">
              Guided routines
            </h1>
            <p className="muuva-support mt-5 max-w-xl text-muted">
              Move with your essentials. Follow simple Pilates sessions designed
              to make movement part of your everyday routine.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${heroHeight} relative overflow-hidden bg-warm bg-cover bg-[position:62%_center] sm:bg-[position:center_center]`}
      style={hero.image ? { backgroundImage: `url(${hero.image})` } : undefined}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-warm via-warm/90 to-warm/15" />
      <div className="site-container relative z-10">
        <div className="max-w-xl">
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
      </div>

      {!hero.image && (
        <div className="absolute inset-y-8 right-8 hidden w-[42%] lg:block">
          <AssetPlaceholder
            kind={hero.imageKind}
            label={`Add ${hero.filter} header image at src/assets/images/guided-routines/headers/${hero.filter
              .toLowerCase()
              .replace(/\s+/g, "-")}-header.webp`}
          />
        </div>
      )}
    </section>
  );
}

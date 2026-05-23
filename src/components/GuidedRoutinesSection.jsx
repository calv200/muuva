import routineImage from "../assets/images/Model/ball_exercise1.png";

export default function GuidedRoutinesSection() {
  return (
    <section aria-label="Guided Pilates routines" className="bg-linen">
      <div className="grid lg:grid-cols-2">
        <div className="h-[360px] overflow-hidden bg-clay sm:h-[460px] lg:h-auto lg:min-h-[560px]">
          <img
            className="h-full w-full object-cover object-center"
            src={routineImage}
            alt="Woman practicing Pilates with a soft exercise ball"
          />
        </div>

        <div className="flex min-h-[420px] items-center justify-center bg-[#ebe3d8] px-6 py-16 text-center sm:px-12 sm:py-20 lg:min-h-[560px] lg:px-20">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.28em] text-stonegreen">
              Included with your kit
            </p>
            <h2 className="mt-5 font-serif text-5xl font-medium leading-tight text-balance sm:text-6xl">
              Guided routines included
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-ink/70 sm:text-lg">
              Your kit includes complimentary access to guided Pilates routines
              designed to help you move with confidence, from your first session
              onwards.
            </p>

            <a
              className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full border border-ink/70 px-8 text-sm uppercase tracking-[0.18em] transition hover:bg-ink hover:text-linen"
              href="#"
            >
              {"Explore guided routines \u2192"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

import routineImage from "../assets/images/Model/ball_exercise1.png";
import CtaLink from "./CtaLink.jsx";

export default function GuidedRoutinesSection() {
  return (
    <section aria-label="Guided Pilates routines" className="bg-cream">
      <div className="grid lg:grid-cols-2">
        <div className="h-[360px] overflow-hidden bg-clay sm:h-[460px] lg:h-auto lg:min-h-[560px]">
          <img
            className="h-full w-full object-cover object-center"
            src={routineImage}
            alt="Woman practicing Pilates with a soft exercise ball"
          />
        </div>

        <div className="flex min-h-[420px] items-center justify-center bg-warm px-6 py-16 text-center sm:px-12 sm:py-20 lg:min-h-[560px] lg:px-20">
          <div className="max-w-xl">
            <p className="muuva-label text-brand">
              Included with your kit
            </p>
            <h2 className="mt-5 font-serif text-[clamp(2rem,5vw,2.75rem)] font-medium leading-[1.1] text-balance">
              Guided routines included
            </h2>
            <p className="muuva-support mx-auto mt-6 max-w-lg text-muted">
              Your kit includes complimentary access to guided Pilates routines
              designed to help you move with confidence, from your first session
              onwards.
            </p>

            <CtaLink className="mt-9" href="#">
              {"Explore guided routines \u2192"}
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}

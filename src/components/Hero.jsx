import heroVideo from "../assets/videos/hero-video.mp4";
import SiteContainer from "./SiteContainer.jsx";

export default function Hero() {
  return (
    <section aria-label="muuva hero">
      <div className="h-[62vh] min-h-[420px] w-full overflow-hidden bg-clay sm:h-[72vh]">
        <video
          className="h-full w-full object-cover"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-label="muuva Pilates essentials in motion"
        />
      </div>

      <SiteContainer className="py-12 text-center sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-[clamp(2.25rem,7vw,3.5rem)] font-medium leading-[1.05] text-balance">
            Pilates essentials,
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            Styled for everyday movement.
          </p>
        </div>
      </SiteContainer>
    </section>
  );
}

import heroVideo from "../assets/videos/hero-video.mp4";

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

      <div className="mx-auto max-w-3xl px-6 py-14 text-center sm:py-20">
        <h1 className="font-serif text-5xl font-medium leading-none text-balance sm:text-7xl">
          Pilates essentials,
        </h1>
        <p className="mt-4 text-lg text-ink/75 sm:text-2xl">
          Styled for everyday movement.
        </p>
      </div>
    </section>
  );
}

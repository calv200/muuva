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
    </section>
  );
}

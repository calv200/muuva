import { useTranslation } from "react-i18next";
import heroVideo from "../assets/videos/hero-video.mp4";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section aria-label={t("hero.section")}>
      <div className="w-full overflow-hidden bg-clay sm:h-[72vh]">
        <video
          className="w-full h-auto object-contain sm:h-full sm:w-full sm:object-cover"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-label={t("hero.video")}
        />
      </div>
    </section>
  );
}

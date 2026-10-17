import { useTranslation } from "react-i18next";
import heroVideo from "../assets/videos/hero-video.mp4";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section aria-label={t("hero.section")}>
      <div className="h-[62vh] min-h-[420px] w-full overflow-hidden bg-clay sm:h-[72vh]">
        <video
          className="h-full w-full object-cover"
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

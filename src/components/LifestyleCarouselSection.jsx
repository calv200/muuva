import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import SiteContainer from "./SiteContainer.jsx";

const lifestyleImageModules = import.meta.glob(
  "../assets/images/lifestyle/lifeStyle*.{png,PNG,jpg,JPG,jpeg,JPEG}",
  { eager: true, import: "default" }
);

const lifestyleImages = Object.entries(lifestyleImageModules)
  .map(([path, src]) => {
    const imageNumber = Number(path.match(/lifeStyle(\d+)/i)?.[1]);

    return {
      src,
      order: imageNumber,
      altKey: imageNumber >= 1 && imageNumber <= 8 ? `lifestyle.alt.${imageNumber}` : "lifestyle.alt.default",
    };
  })
  .filter((image) => Number.isFinite(image.order))
  .sort((firstImage, secondImage) => firstImage.order - secondImage.order);

export default function LifestyleCarouselSection() {
  const { t } = useTranslation();
  const carouselRef = useRef(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateScrollButtons = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    setCanScrollPrevious(carousel.scrollLeft > 8);
    setCanScrollNext(carousel.scrollLeft < maxScrollLeft - 8);
  };

  const scrollCarousel = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: carousel.clientWidth * 0.85 * direction,
      behavior: "smooth",
    });
  };

  const handleWheel = (event) => {
    const carousel = carouselRef.current;
    if (!carousel || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;

    carousel.scrollLeft += event.deltaY;
    updateScrollButtons();
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, []);

  return (
    <section className="section-pad bg-cream">
      <SiteContainer>
        <div className="mb-8 flex items-center justify-between gap-6 sm:mb-10">
          <h2 className="font-serif text-[clamp(2rem,5vw,2.75rem)] font-medium leading-[1.05] text-ink">
            {t("lifestyle.title")}
          </h2>

          <div className="flex shrink-0 items-center gap-2">
            <button
              className={`grid h-9 w-9 place-items-center rounded-full border border-softborder text-xl leading-none text-muted transition hover:border-ink/40 hover:text-ink ${
                canScrollPrevious ? "" : "cursor-default opacity-35"
              }`}
              type="button"
              onClick={() => scrollCarousel(-1)}
              disabled={!canScrollPrevious}
              aria-label={t("lifestyle.previous")}
            >
              &lsaquo;
            </button>
            <button
              className={`grid h-9 w-9 place-items-center rounded-full border border-softborder text-xl leading-none text-muted transition hover:border-ink/40 hover:text-ink ${
                canScrollNext ? "" : "cursor-default opacity-35"
              }`}
              type="button"
              onClick={() => scrollCarousel(1)}
              disabled={!canScrollNext}
              aria-label={t("lifestyle.next")}
            >
              &rsaquo;
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pr-[18%] sm:gap-4 sm:pr-[12%] lg:pr-[6%]"
          onScroll={updateScrollButtons}
          onWheel={handleWheel}
        >
          {lifestyleImages.map((image) => (
            <div
              className="shrink-0 basis-[82%] snap-start overflow-hidden bg-oat sm:basis-[43%] md:basis-[32%] lg:basis-[23.5%]"
              key={image.src}
            >
              <img
                className="h-[430px] w-full object-cover sm:h-[520px] lg:h-[560px]"
                src={image.src}
                alt={t(image.altKey)}
                draggable="false"
              />
            </div>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}

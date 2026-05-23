import { useEffect, useRef, useState } from "react";
import lifeStyle1 from "../assets/images/lifestyle/lifeStyle1.png";
import lifeStyle2 from "../assets/images/lifestyle/lifeStyle2.png";
import lifeStyle3 from "../assets/images/lifestyle/lifeStyle3.png";
import lifeStyle4 from "../assets/images/lifestyle/lifeStyle4.png";
import lifeStyle5 from "../assets/images/lifestyle/lifeStyle5.png";
import lifeStyle6 from "../assets/images/lifestyle/lifeStyle6.png";
import lifeStyle7 from "../assets/images/lifestyle/lifeStyle7.png";
import lifeStyle8 from "../assets/images/lifestyle/lifeStyle8.png";

const lifestyleImages = [
  {
    src: lifeStyle1,
    alt: "Woman with the Pilates Essential Kit on a neutral exercise mat",
  },
  {
    src: lifeStyle2,
    alt: "Pilates accessories styled on a soft neutral surface",
  },
  {
    src: lifeStyle3,
    alt: "Woman in Pilates wear standing by a bright beach window",
  },
  {
    src: lifeStyle4,
    alt: "Woman presenting the Pilates Essential Kit in a calm home setting",
  },
  {
    src: lifeStyle5,
    alt: "Neutral Pilates accessories and everyday essentials arranged together",
  },
  {
    src: lifeStyle6,
    alt: "Pilates kit details styled with soft warm tones",
  },
  {
    src: lifeStyle7,
    alt: "Lifestyle detail of Pilates products in a clean interior",
  },
  {
    src: lifeStyle8,
    alt: "Pilates kit and accessories arranged in an editorial lifestyle scene",
  },
];

export default function LifestyleCarouselSection() {
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
    <section className="bg-[#fbf8f2] px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-6 sm:mb-10">
          <h2 className="font-serif text-4xl font-medium leading-none text-ink sm:text-5xl">
            Styled by You.
          </h2>

          <div className="flex items-center gap-2">
            <button
              className={`grid h-9 w-9 place-items-center rounded-full border border-ink/20 text-xl leading-none text-ink/70 transition hover:border-ink/40 hover:text-ink ${
                canScrollPrevious ? "" : "cursor-default opacity-35"
              }`}
              type="button"
              onClick={() => scrollCarousel(-1)}
              disabled={!canScrollPrevious}
              aria-label="Previous lifestyle images"
            >
              &lsaquo;
            </button>
            <button
              className={`grid h-9 w-9 place-items-center rounded-full border border-ink/20 text-xl leading-none text-ink/70 transition hover:border-ink/40 hover:text-ink ${
                canScrollNext ? "" : "cursor-default opacity-35"
              }`}
              type="button"
              onClick={() => scrollCarousel(1)}
              disabled={!canScrollNext}
              aria-label="Next lifestyle images"
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
                alt={image.alt}
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import billboardImage from "../assets/images/Products/kit-billboard.webp";
import ringImage from "../assets/images/Products/ring1.png";
import ballImage from "../assets/images/Products/ball1.png";
import bandImage from "../assets/images/Products/band1.png";
import sliderImage from "../assets/images/Products/slider1.png";
import kitImage from "../assets/images/Products/kit1.png";
import CtaLink, { ctaClassName } from "./CtaLink.jsx";
import SiteContainer from "./SiteContainer.jsx";

const amazonUrl =
  "https://www.amazon.com/kure-fit-Pilates-Essentials-Equipment-Included/dp/B0FP551YZ2";

const productImages = [
  { src: ringImage, alt: "Pilates ring from the Pilates Essential Kit" },
  { src: ballImage, alt: "Soft Pilates ball from the Pilates Essential Kit" },
  { src: bandImage, alt: "Resistance band from the Pilates Essential Kit" },
  { src: sliderImage, alt: "Pilates sliders from the Pilates Essential Kit" },
  { src: kitImage, alt: "Pilates Essential Kit" },
];

export default function ProductPurchase() {
  const [activeImage, setActiveImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const showPreviousImage = () => {
    setActiveImage((current) =>
      current === 0 ? productImages.length - 1 : current - 1
    );
  };

  const showNextImage = () => {
    setActiveImage((current) =>
      current === productImages.length - 1 ? 0 : current + 1
    );
  };

  useEffect(() => {
    if (!isGalleryOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsGalleryOpen(false);
      if (event.key === "ArrowLeft") showPreviousImage();
      if (event.key === "ArrowRight") showNextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGalleryOpen]);

  return (
    <section id="product" className="section-pad bg-cream">
      <SiteContainer className="text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.05] text-balance text-ink">
            Pilates Essential Kit
          </h2>
          <p className="muuva-support mx-auto mt-4 max-w-2xl text-muted">
            Everything you need to make Pilates part of your everyday routine.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button
              className={ctaClassName}
              type="button"
              onClick={() => setIsGalleryOpen(true)}
            >
              More info
            </button>
            <CtaLink href={amazonUrl}>{"Buy on Amazon \u2192"}</CtaLink>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-site sm:mt-14 lg:mt-16">
          <img
            className="mx-auto w-full max-w-[1120px] object-contain"
            src={billboardImage}
            alt="Pilates Essential Kit arranged as a complete home workout set"
          />
        </div>
      </SiteContainer>

      {isGalleryOpen && (
        <GalleryModal
          activeImage={activeImage}
          images={productImages}
          onClose={() => setIsGalleryOpen(false)}
          onNext={showNextImage}
          onPrevious={showPreviousImage}
          onSelect={setActiveImage}
        />
      )}
    </section>
  );
}

function GalleryModal({
  activeImage,
  images,
  onClose,
  onNext,
  onPrevious,
  onSelect,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Product image gallery"
    >
      <button
        className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-linen/90 text-2xl leading-none text-ink transition hover:bg-white"
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
      >
        &times;
      </button>

      <button
        className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-linen/90 text-2xl text-ink transition hover:bg-white sm:left-8"
        type="button"
        onClick={onPrevious}
        aria-label="Previous image"
      >
        &lsaquo;
      </button>

      <img
        className="max-h-[76vh] max-w-[88vw] object-contain shadow-soft"
        src={images[activeImage].src}
        alt={images[activeImage].alt}
      />

      <button
        className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-linen/90 text-2xl text-ink transition hover:bg-white sm:right-8"
        type="button"
        onClick={onNext}
        aria-label="Next image"
      >
        &rsaquo;
      </button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-3 rounded-full bg-linen/90 p-2">
        {images.map((image, index) => (
          <button
            key={image.src}
            className={`h-12 w-12 overflow-hidden rounded-full border transition sm:h-14 sm:w-14 ${
              activeImage === index ? "border-ink" : "border-transparent"
            }`}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`Show image ${index + 1}`}
          >
            <img
              className="h-full w-full object-cover"
              src={image.src}
              alt=""
            />
          </button>
        ))}
      </div>
    </div>
  );
}

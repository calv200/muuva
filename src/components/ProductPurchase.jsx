import { useEffect, useState } from "react";
import kitImage from "../assets/images/Products/kit1.png";
import ringImage from "../assets/images/Products/ring1.png";
import ballImage from "../assets/images/Products/ball1.png";
import ballExerciseImage from "../assets/images/Products/ball_exercise.png";

const productImages = [
  { src: kitImage, alt: "Pilates Essential Kit" },
  { src: ringImage, alt: "Pilates ring from the Pilates Essential Kit" },
  { src: ballImage, alt: "Soft Pilates ball from the Pilates Essential Kit" },
  { src: ballExerciseImage, alt: "Pilates ball exercise" },
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
    <section id="product" className="bg-[#fbf8f2] px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
        <button
          type="button"
          className="group overflow-hidden bg-linen shadow-soft"
          onClick={() => setIsGalleryOpen(true)}
          aria-label="Open product image gallery"
        >
          <img
            className="aspect-[4/5] h-full w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:aspect-[5/4] lg:aspect-[4/5]"
            src={productImages[0].src}
            alt={productImages[0].alt}
          />
        </button>

        <div className="mx-auto max-w-xl lg:mx-0">
          <p className="text-xs uppercase tracking-[0.28em] text-stonegreen">
            muuva
          </p>
          <h2 className="mt-5 font-serif text-5xl font-medium leading-tight text-balance sm:text-6xl">
            Pilates Essential Kit
          </h2>
          <p className="mt-6 text-base leading-8 text-ink/70 sm:text-lg">
            Pilates Ring · Resistance Band · Soft Pilates Ball · Sliders · Pump
            · Carry Bag · Guide
          </p>

          <div className="mt-10 border-y border-ink/10 py-7">
            <p className="text-sm uppercase tracking-[0.22em] text-ink/55">
              Color
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span
                className="h-7 w-7 rounded-full border border-ink/15 bg-[#d8cbb0] shadow-inner"
                aria-hidden="true"
              />
              <span className="text-base">Beige</span>
            </div>
          </div>

          <a
            className="mt-9 inline-flex min-h-12 items-center justify-center border border-ink px-8 text-sm uppercase tracking-[0.22em] transition hover:bg-ink hover:text-linen"
            href="#"
          >
            Buy on Amazon →
          </a>
        </div>
      </div>

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
        ×
      </button>

      <button
        className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-linen/90 text-2xl text-ink transition hover:bg-white sm:left-8"
        type="button"
        onClick={onPrevious}
        aria-label="Previous image"
      >
        ‹
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
        ›
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

import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import ringImage from "../assets/images/Products/ring1.png";
import ballImage from "../assets/images/Products/ball1.png";
import bandImage from "../assets/images/Products/band1.png";
import sliderImage from "../assets/images/Products/slider1.png";
import kitImage from "../assets/images/Products/kit1.png";
import ProductComposition from "./ProductComposition.jsx";

import { AMAZON_PRODUCT_URL } from "../data/product.js";

const productImages = [
  { id: "ring", src: ringImage, altKey: "product.images.ring" },
  { id: "ball", src: ballImage, altKey: "product.images.ball" },
  { id: "band", src: bandImage, altKey: "product.images.band" },
  { id: "sliders", src: sliderImage, altKey: "product.images.sliders" },
  { id: "full-kit", src: kitImage, altKey: "product.images.full-kit" },
];

export default function ProductPurchase() {
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const openGalleryAt = (id = "full-kit") => {
    const index = productImages.findIndex((image) => image.id === id);
    if (index < 0) return;
    setActiveImage(index);
    setIsGalleryOpen(true);
  };

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
    <section id="product" className="section-pad product-feature-section bg-cream" aria-labelledby="product-discovery-heading">
      <div className="product-discovery-layout">
        <div className="product-discovery-content">
          <h2 id="product-discovery-heading" className="font-serif text-[clamp(2rem,4vw,2.75rem)] font-normal leading-[1.1] text-ink">{t("product.title")}</h2>
          <div className="product-purchase-action mt-6">
            <a className="product-purchase-cta" href={AMAZON_PRODUCT_URL} target="_blank" rel="noopener noreferrer">{t("product.buy")}</a>
          </div>
        </div>
        <ProductComposition onOpenGallery={openGalleryAt} />

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
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const [ctaBesideImage, setCtaBesideImage] = useState(false);

  useEffect(() => {
    const modal = modalRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.querySelector("button").focus();
    const trapFocus = (event) => {
      if (event.key !== "Tab") return;
      const controls = [...modal.querySelectorAll("button, a[href]")];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    modal.addEventListener("keydown", trapFocus);
    return () => {
      document.body.style.overflow = previousOverflow;
      modal.removeEventListener("keydown", trapFocus);
      previousFocus?.focus();
    };
  }, []);

  const updateCtaPosition = () => {
    const img = modalRef.current?.querySelector(".gallery-image");
    if (!img?.naturalWidth) return;
    // Measure the image at its original desktop height before choosing a layout.
    const imageWidth = Math.min(img.naturalWidth, window.innerHeight * 0.76 * img.naturalWidth / img.naturalHeight, window.innerWidth - 144);
    setCtaBesideImage(window.innerWidth >= 1024 && (window.innerWidth - imageWidth) / 2 >= 280);
  };

  useEffect(() => {
    updateCtaPosition();
    window.addEventListener("resize", updateCtaPosition);
    return () => window.removeEventListener("resize", updateCtaPosition);
  }, [activeImage]);

  return (
    <div
      ref={modalRef}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={t("product.gallery")}
    >
      <button
        className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-linen/90 text-2xl leading-none text-ink transition hover:bg-white"
        type="button"
        onClick={onClose}
        aria-label={t("product.close")}
      >
        &times;
      </button>

      <button
        className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-linen/90 text-2xl text-ink transition hover:bg-white sm:left-8"
        type="button"
        onClick={onPrevious}
        aria-label={t("product.previous")}
      >
        &lsaquo;
      </button>

      <div className="relative flex flex-col items-center gap-4">
      <img
        className={`gallery-image max-w-[calc(100vw-9rem)] object-contain shadow-soft ${ctaBesideImage ? "max-h-[min(76vh,calc(100svh-160px))]" : "max-h-[min(76vh,calc(100svh-240px))]"}`}
        src={images[activeImage].src}
        alt={t(images[activeImage].altKey)}
        onLoad={updateCtaPosition}
      />
      <a
        className={`inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-softborder bg-cream px-4 py-3 font-sans text-sm font-medium text-ink transition hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream ${ctaBesideImage ? "absolute left-full top-4 ml-6" : ""}`}
        href={AMAZON_PRODUCT_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("product.buy")}
      </a>
      </div>

      <button
        className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-linen/90 text-2xl text-ink transition hover:bg-white sm:right-8"
        type="button"
        onClick={onNext}
        aria-label={t("product.next")}
      >
        &rsaquo;
      </button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-linen/90 p-2 sm:gap-3">
        {images.map((image, index) => (
          <button
            key={image.src}
            className={`h-12 w-12 overflow-hidden rounded-full border transition sm:h-14 sm:w-14 ${
              activeImage === index ? "border-ink" : "border-transparent"
            }`}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={t("product.showImage", { number: index + 1 })}
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

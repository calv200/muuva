import { useTranslation } from "react-i18next";
import fullKit from "../assets/images/Products/full-kit-cutout.png";
import { productHotspots } from "../data/productComposition.js";
import ProductHotspot from "./ProductHotspot.jsx";
import "./ProductComposition.css";

export default function ProductComposition({ onOpenGallery }) {
  const { t } = useTranslation();
  return (
    <div className="product-composition" role="group" aria-label={t("product.discover")}>
      <button type="button" className="product-image-button" aria-label={t("product.viewKit")} aria-haspopup="dialog" onClick={() => onOpenGallery("full-kit")}>
        <img className="block h-auto w-full" src={fullKit} width="1672" height="941" alt={t("product.imageAlt")} draggable="false" />
      </button>
      {productHotspots.map(hotspot => <ProductHotspot key={hotspot.id} hotspot={hotspot} onOpenGallery={onOpenGallery} />)}
    </div>
  );
}

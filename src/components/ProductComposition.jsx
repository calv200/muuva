import fullKit from "../assets/images/Products/full-kit-cutout.png";
import { productHotspots } from "../data/productComposition.js";
import ProductHotspot from "./ProductHotspot.jsx";
import "./ProductComposition.css";

export default function ProductComposition({ onOpenGallery }) {
  return (
    <div className="product-composition" role="group" aria-label="Discover the complete MUUVA Pilates Essential Kit">
      <button type="button" className="product-image-button" aria-label="View complete Pilates Essential Kit photos" aria-haspopup="dialog" onClick={() => onOpenGallery("full-kit")}>
        <img className="block h-auto w-full" src={fullKit} width="1672" height="941" alt="MUUVA Pilates kit with ring, ball, band, sliders, packaging, carry bag, pump, and guide with phone" draggable="false" />
      </button>
      {productHotspots.map(hotspot => <ProductHotspot key={hotspot.id} id={hotspot.id} hotspot={hotspot} onOpenGallery={onOpenGallery} />)}
    </div>
  );
}

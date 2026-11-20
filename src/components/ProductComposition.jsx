import { useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import fullKit from "../assets/images/Products/full-kit-cutout.png";
import { productHotspots } from "../data/productComposition.js";
import { productReveals } from "../data/productReveal.js";
import { mountProductReveals } from "./productRevealController.js";
import ProductHotspot from "./ProductHotspot.jsx";
import "./ProductComposition.css";

const bold = { strong: <strong /> };

export default function ProductComposition({ onOpenGallery }) {
  const { t } = useTranslation();
  const stageRef = useRef(null);
  useEffect(() => mountProductReveals(stageRef.current, productReveals), []);

  return (
    <div className="product-stage" ref={stageRef}>
      <div className="product-composition" role="group" aria-label={t("product.discover")}>
        <button type="button" className="product-image-button" aria-label={t("product.viewKit")} aria-haspopup="dialog" onClick={() => onOpenGallery("full-kit")}>
          <img className="block h-auto w-full" src={fullKit} width="1672" height="941" alt={t("product.imageAlt")} draggable="false" />
        </button>
        {productReveals.map(({ id, photo, sprite, layer, cell }) => (
          <div
            key={id}
            id={`reveal-${id}-layer`}
            className="product-reveal-layer"
            style={{ left: `${layer.left}%`, top: `${layer.top}%`, width: `${layer.width}%`, aspectRatio: layer.aspect }}
            aria-hidden="true"
          >
            <img className="product-reveal-photo" src={photo} alt="" draggable="false" />
            <div className="product-reveal-sprite" style={{ left: `${cell.left}%`, top: `${cell.top}%`, width: `${cell.width}%`, backgroundImage: `url(${sprite})` }} />
          </div>
        ))}
        {productHotspots.map(hotspot => <ProductHotspot key={hotspot.id} hotspot={hotspot} />)}
      </div>
      {productReveals.map(({ id, lines }) => (
        <div key={id} id={`reveal-${id}-specs`} className="product-reveal-spec" role="region" aria-label={t(`product.reveal.${id}.label`)} hidden>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {lines.map(({ points, dot }, index) => (
              <g key={points}>
                <polyline className={`l${index + 1}`} pathLength="1" points={points} />
                <circle cx={dot[0]} cy={dot[1]} r=".9" />
              </g>
            ))}
          </svg>
          <p className="c1"><Trans i18nKey={`product.reveal.${id}.c1`} components={bold} /></p>
          <p className="c2"><Trans i18nKey={`product.reveal.${id}.c2`} components={bold} /></p>
          <p className="tag"><Trans i18nKey={`product.reveal.${id}.tag`} components={bold} /></p>
        </div>
      ))}
      {productReveals.map(({ id }) => (
        <button key={id} type="button" id={`reveal-${id}-close`} className="product-reveal-close" aria-label={t("product.reveal.close")}>&times;</button>
      ))}
    </div>
  );
}

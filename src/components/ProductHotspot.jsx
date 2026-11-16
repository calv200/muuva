import { useTranslation } from "react-i18next";

// Plays the product's reveal (see productRevealController.js); the controller attaches the click handler.
export default function ProductHotspot({ hotspot }) {
  const { t } = useTranslation();
  const style = {};
  for (const size of ["mobile", "tablet", "desktop"]) {
    const point = hotspot[size] ?? hotspot.desktop;
    style[`--hotspot-${size}-x`] = `${point.x}%`;
    style[`--hotspot-${size}-y`] = `${point.y}%`;
  }

  return (
    <button
      type="button"
      id={`reveal-${hotspot.revealId}-hotspot`}
      className="product-hotspot"
      style={style}
      aria-label={t(hotspot.labelKey)}
      aria-expanded="false"
      aria-controls={`reveal-${hotspot.revealId}-specs`}
    >
      <span className="product-hotspot-marker" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 3v10M3 8h10" />
        </svg>
      </span>
    </button>
  );
}

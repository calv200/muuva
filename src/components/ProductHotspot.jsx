export default function ProductHotspot({ hotspot, onOpenGallery }) {
  const style = {};
  for (const size of ["mobile", "tablet", "desktop"]) {
    const point = hotspot[size] ?? hotspot.desktop;
    style[`--hotspot-${size}-x`] = `${point.x}%`;
    style[`--hotspot-${size}-y`] = `${point.y}%`;
  }

  return (
    <button
      type="button"
      className="product-hotspot"
      style={style}
      aria-label={hotspot.label}
      aria-haspopup="dialog"
      onClick={(event) => { event.stopPropagation(); onOpenGallery(hotspot.galleryImageId); }}
    >
      <span className="product-hotspot-marker" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 3v10M3 8h10" />
        </svg>
      </span>
    </button>
  );
}

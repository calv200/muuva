export default function AssetPlaceholder({ label, kind = "product" }) {
  return (
    <div
      className={`flex h-full min-h-[240px] w-full items-center justify-center border border-softborder ${
        kind === "lifestyle" ? "bg-beige/40" : "bg-warm"
      }`}
    >
      <div className="px-6 text-center">
        <p className="muuva-label text-brand">Image placeholder</p>
        <p className="muuva-ui mt-3 max-w-xs text-muted">{label}</p>
      </div>
    </div>
  );
}

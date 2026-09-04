import AssetPlaceholder from "./AssetPlaceholder.jsx";

function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 translate-x-px"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M8 5.5v13l10-6.5-10-6.5Z" />
    </svg>
  );
}

export default function RoutineCard({ routine, activeFilter }) {
  const href = `#/guided-routines/${routine.slug}${
    activeFilter ? `?filter=${encodeURIComponent(activeFilter)}` : ""
  }`;

  return (
    <a
      className="group block focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
      href={href}
      aria-label={`Open ${routine.title}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-warm">
        {routine.thumbnail ? (
          <img
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            src={routine.thumbnail}
            alt={routine.thumbnailAlt}
          />
        ) : (
          <AssetPlaceholder
            label={`Add thumbnail at src/assets/images/guided-routines/thumbnails/${routine.slug}-routine-thumbnail.png`}
          />
        )}
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-cream/95 text-ink shadow-soft transition duration-200 group-hover:scale-105">
            <span className="sr-only">Play routine</span>
            <PlayIcon />
          </span>
        </span>
      </div>

      <div className="pt-5">
        <p className="muuva-label text-brand">{routine.meta}</p>
        <h2 className="mt-2 font-serif text-2xl font-medium leading-tight text-ink">
          {routine.title}
        </h2>
      </div>
    </a>
  );
}

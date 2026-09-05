export default function RoutineFilters({ filters, activeFilter, onFilterChange }) {
  return (
    <div className="border-b border-softborder bg-cream">
      <div className="site-container py-6">
        <div
          className="no-scrollbar flex gap-3 overflow-x-auto"
          aria-label="Routine filters"
          role="group"
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                className={`muuva-ui min-h-11 shrink-0 rounded-full border px-5 transition focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand ${
                  isActive
                    ? "border-brand bg-brand text-linen"
                    : "border-softborder bg-warm text-ink hover:border-brand/40"
                }`}
                type="button"
                aria-pressed={isActive}
                onClick={() => onFilterChange(filter)}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

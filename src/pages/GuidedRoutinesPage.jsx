import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import GuidedRoutineHero from "../components/guided-routines/GuidedRoutineHero.jsx";
import RoutineFilters from "../components/guided-routines/RoutineFilters.jsx";
import RoutineGrid from "../components/guided-routines/RoutineGrid.jsx";
import { filterQuery, localizedUrl } from "../routing/urls.js";
import { navigate } from "../routing/navigation.js";
import {
  allFilter,
  categoryHeroes,
  routineFilters,
  routines,
  slugForFilter,
} from "../data/guidedRoutines.js";

function getValidFilter(filter) {
  return routineFilters.includes(filter) ? filter : allFilter;
}

export default function GuidedRoutinesPage({ initialFilter = allFilter }) {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState(getValidFilter(initialFilter));
  const activeHero = activeFilter !== allFilter
    ? categoryHeroes[slugForFilter(activeFilter)]
    : null;

  const visibleRoutines = routines.filter((routine) => {
    if (!routine.youtubeEmbedUrl) return false;
    if (activeFilter === allFilter) return true;
    return routine.filters.includes(activeFilter);
  });

  useEffect(() => {
    setActiveFilter(getValidFilter(initialFilter));
  }, [initialFilter]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    navigate(localizedUrl(i18n.resolvedLanguage, {
      page: "guided-routines",
      search: filterQuery(window.location.search, filter),
    }));
  };

  return (
    <main>
      <GuidedRoutineHero hero={activeHero} />
      <RoutineFilters
        filters={routineFilters}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />
      <section className="section-pad bg-cream" aria-label={t("routines.workoutsLabel")}>
        <div className="site-container">
          <RoutineGrid routines={visibleRoutines} activeFilter={activeFilter} />
        </div>
      </section>
    </main>
  );
}

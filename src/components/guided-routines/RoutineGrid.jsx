import RoutineCard from "./RoutineCard.jsx";
import RoutineEmptyState from "./RoutineEmptyState.jsx";

export default function RoutineGrid({ routines, activeFilter }) {
  if (routines.length === 0) {
    return <RoutineEmptyState />;
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {routines.map((routine) => (
        <RoutineCard
          key={routine.id}
          routine={routine}
          activeFilter={activeFilter}
        />
      ))}
    </div>
  );
}

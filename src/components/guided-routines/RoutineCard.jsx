import { allFilter } from "../../data/guidedRoutines.js";
import { useTranslation } from "react-i18next";
import AssetPlaceholder from "./AssetPlaceholder.jsx";
import "./RoutineCard.css";

function MetadataPill({ kind, children }) {
  return <span className={`workout-pill workout-pill--${kind}`}>{children}</span>;
}

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
  const { t } = useTranslation();
  const href = `#/guided-routines/${routine.slug}${
    activeFilter && activeFilter !== allFilter
      ? `?filter=${encodeURIComponent(activeFilter)}`
      : ""
  }`;

  return (
    <a
      className="group block focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-brand"
      href={href}
      aria-label={t("routines.open", { title: t(routine.titleKey) })}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-warm">
        {routine.thumbnail ? (
          <img
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            src={routine.thumbnail}
            alt={t(routine.thumbnailAltKey)}
          />
        ) : (
          <AssetPlaceholder
            label={t("routines.missingImage")}
          />
        )}
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-cream/95 text-ink shadow-soft transition duration-200 group-hover:scale-105">
            <span className="sr-only">{t("routines.play")}</span>
            <PlayIcon />
          </span>
        </span>
      </div>

      <div className="pt-5">
        <h2 className="font-serif text-2xl font-medium leading-tight text-ink">
          {t(routine.titleKey)}
        </h2>
        {(routine.durationMinutes || routine.intensity) && <div className="mt-2 flex flex-wrap items-center gap-4 font-sans text-sm text-muted">
          {routine.durationMinutes && <span className="inline-flex items-center gap-2">
            <svg aria-hidden="true" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <span><span className="sr-only">{t("routines.durationLabel")}</span>{t("routines.duration", { count: routine.durationMinutes })}</span>
          </span>}
          {routine.intensity && <MetadataPill kind="intensity"><span className="sr-only">{t("routines.intensityLabel")}</span>{t(`routines.${routine.intensity}`)}</MetadataPill>}
        </div>}
        <div className={`mt-2 flex gap-2 ${routine.equipment?.length > 1 ? "flex-col items-start" : "flex-wrap items-center"}`}>
          <div className="flex flex-wrap gap-2">
            {routine.muscleGroups?.map(group => <MetadataPill key={group} kind="muscle"><span className="sr-only">{t("routines.muscleLabel")}</span>{t(`routines.${group}`)}</MetadataPill>)}
          </div>
          <div className="flex flex-wrap gap-2">
            {routine.equipment?.map(item => <MetadataPill key={item} kind="equipment"><span className="sr-only">{t("routines.equipmentLabel")}</span>{t(`routines.equipment.${item}`)}</MetadataPill>)}
          </div>
        </div>
      </div>
    </a>
  );
}

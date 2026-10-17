import { useTranslation } from "react-i18next";
export default function RoutineEmptyState() {
  const { t } = useTranslation();
  return (
    <div className="border border-softborder bg-warm px-6 py-12 text-center">
      <p className="muuva-support text-muted">{t("routines.empty")}</p>
    </div>
  );
}

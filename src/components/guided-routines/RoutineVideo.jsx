import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useConsent } from "../../consent/ConsentProvider.jsx";
export default function RoutineVideo({ routine }) {
  const { t } = useTranslation();
  const { state, save } = useConsent();
  const [playRoutine, setPlayRoutine] = useState(null);
  const [storageError, setStorageError] = useState(false);
  const embed = routine.youtubeEmbedUrl.replace("www.youtube.com", "www.youtube-nocookie.com");
  return (
    <div className="mx-auto max-w-6xl">
      {!state?.externalVideos && <p id={`video-consent-${routine.id}`} className="mb-4 max-w-3xl text-sm leading-relaxed text-muted">{t("videoConsent.explanation")}</p>}
      <div className="relative aspect-video overflow-hidden bg-warm">
        {state?.externalVideos ?
        <iframe
          className="h-full w-full"
          src={`${embed}${playRoutine === routine.id ? "?autoplay=1" : ""}`}
          title={t("routines.video", { title: t(routine.titleKey) })}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        /> : <>
          <img className="h-full w-full object-cover" src={routine.thumbnail} alt={t(routine.thumbnailAltKey)} />
          <div className="absolute inset-0 flex items-center justify-center bg-ink/25 p-3">
            <button className="min-h-11 max-w-full rounded border border-softborder bg-cream px-4 py-3 text-sm font-medium text-ink shadow-sm hover:bg-warm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream sm:px-6"
              aria-describedby={`video-consent-${routine.id}`}
              onClick={() => { if (save({ externalVideos: true })) { setPlayRoutine(routine.id); setStorageError(false); } else setStorageError(true); }}>
              {t("videoConsent.enable")}
            </button>
          </div>
        </>}
      </div>
      {!state?.externalVideos && <div className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
        <a className="mt-2 inline-flex min-h-11 items-center text-brand underline underline-offset-4 focus-visible:outline focus-visible:outline-2" href={routine.youtubeUrl} target="_blank" rel="noopener noreferrer">{t("videoConsent.external")}</a>
        <p>{t("videoConsent.leaving")}</p>
        {storageError && <p role="alert" className="mt-2">{t("consent.storageError")}</p>}
      </div>}
    </div>
  );
}

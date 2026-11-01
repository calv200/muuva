import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { localizedUrl } from "../routing/urls.js";

export default function ConsentPanel({ state, save, customize, onCustomize, onClose, storageError }) {
  const { t, i18n } = useTranslation();
  const [choices, setChoices] = useState({ analytics: state?.analytics ?? false, externalVideos: state?.externalVideos ?? false });
  const panel = useRef(null);
  useEffect(() => { setChoices({ analytics: state?.analytics ?? false, externalVideos: state?.externalVideos ?? false }); }, [state]);
  useEffect(() => {
    if (!customize) return;
    const previous = document.activeElement;
    panel.current?.focus();
    return () => { if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, [customize]);
  const button = "min-h-11 rounded border border-brand/60 px-4 py-2 text-sm font-medium text-ink hover:bg-soft-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
  return <section ref={panel} tabIndex={-1} role="region" aria-labelledby="consent-title"
    onKeyDown={(event) => { if (event.key === "Escape" && customize && state) onClose(); }}
    className="fixed inset-x-0 bottom-0 z-[100] max-h-[85svh] overflow-y-auto border-t border-softborder bg-warm p-5 text-ink shadow-[0_-4px_24px_rgba(36,33,31,0.08)] focus:outline-none sm:bottom-5 sm:left-auto sm:right-5 sm:w-[min(40rem,calc(100%-2.5rem))] sm:border sm:p-7">
    <h2 id="consent-title" className="font-serif text-2xl sm:text-3xl">{t("consent.title")}</h2>
    <p className="mt-3 text-sm leading-relaxed">{t("consent.intro")}</p>
    <a className="mt-2 inline-flex min-h-11 items-center text-sm text-brand underline underline-offset-4 focus-visible:outline focus-visible:outline-2" href={localizedUrl(i18n.resolvedLanguage, { page: "privacy" })}>{t("footer.links.privacy")}</a>
    {customize && <div className="my-4 space-y-4 text-sm leading-relaxed">
      <p><strong>{t("consent.essential")}</strong> {t("consent.essentialDescription")}</p>
      {["analytics", "externalVideos"].map((key) => <label key={key} className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-brand" checked={choices[key]}
          onChange={(event) => setChoices((current) => ({ ...current, [key]: event.target.checked }))} />
        <span><strong className="block">{t(`consent.${key}`)}</strong>{t(`consent.${key}Description`)}</span>
      </label>)}
    </div>}
    {storageError && <p role="alert" className="my-3 text-sm leading-relaxed">{t("consent.storageError")}</p>}
    <div className="mt-3 grid gap-3 sm:grid-cols-3">
      <button className={button} onClick={() => save({ analytics: false, externalVideos: false })}>{t("consent.reject")}</button>
      {customize ? <button className={button} onClick={() => save(choices)}>{t("consent.save")}</button>
        : <button className={button} onClick={onCustomize}>{t("consent.customize")}</button>}
      <button className={button} onClick={() => save({ analytics: true, externalVideos: true })}>{t("consent.accept")}</button>
    </div>
    {customize && state && <button className="mt-3 min-h-11 text-sm underline focus-visible:outline focus-visible:outline-2" onClick={onClose}>{t("consent.close")}</button>}
  </section>;
}

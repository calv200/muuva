import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { localizedUrl } from "../routing/urls.js";
import { loadTurnstile, useTurnstileSize } from "../forms/turnstile.js";
import { businessTypes, validateWholesale, wholesaleLimits } from "../forms/wholesale.js";

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const available = import.meta.env.VITE_WHOLESALE_ENABLED === "true" && Boolean(siteKey) && import.meta.env.BASE_URL === "/";
const inputClass = "muuva-ui mt-2 min-h-12 w-full rounded-sm border border-softborder bg-cream px-4 py-3 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export default function WholesaleForm() {
  const { t, i18n } = useTranslation();
  const [fields, setFields] = useState({ name: "", businessName: "", email: "", businessType: "", enquiry: "", consent: false });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(available ? "" : "notReady");
  const [state, setState] = useState("idle");
  const [token, setToken] = useState("");
  const container = useRef(null);
  const widget = useRef(null);
  const form = useRef(null);
  const successHeading = useRef(null);
  const pending = useRef(null);
  const received = state === "success";
  const widgetSize = useTurnstileSize(container, available && !received, "flexible");

  useEffect(() => {
    if (!available || received) return;
    let mounted = true;
    setToken("");
    loadTurnstile().then((turnstile) => {
      if (!mounted || !container.current) return;
      widget.current = turnstile.render(container.current, {
        sitekey: siteKey,
        action: "wholesale_enquiry",
        language: i18n.resolvedLanguage,
        theme: "light",
        size: widgetSize,
        callback: (value) => { setToken(value); setMessage((previous) => ["challengeRequired", "challengeError"].includes(previous) ? "" : previous); },
        "expired-callback": () => setToken(""),
        "error-callback": () => { setToken(""); setMessage("challengeError"); },
      });
    }).catch(() => { if (mounted) setMessage("challengeError"); });
    return () => {
      mounted = false;
      if (widget.current !== null) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [i18n.resolvedLanguage, received, widgetSize]);

  useEffect(() => () => pending.current?.abort(), []);
  useEffect(() => { if (received) successHeading.current?.focus({ preventScroll: true }); }, [received]);

  function update(event) {
    const { name, value, checked, type } = event.target;
    setFields((previous) => ({ ...previous, [name]: type === "checkbox" ? checked : value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }

  async function submit(event) {
    event.preventDefault();
    if (pending.current || received || !available) return;
    const { value, errors: invalid } = validateWholesale(fields);
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      setMessage("validationError");
      form.current.elements.namedItem(Object.keys(invalid)[0])?.focus();
      return;
    }
    if (!token) { setMessage("challengeRequired"); return; }
    const controller = new AbortController();
    pending.current = controller;
    const timeout = setTimeout(() => controller.abort(), 20000);
    setState("loading");
    setMessage("");
    try {
      const response = await fetch("/api/wholesale", {
        method: "POST", credentials: "same-origin", referrerPolicy: "no-referrer",
        headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ ...value, language: i18n.resolvedLanguage, turnstileToken: token }),
      });
      const result = await response.json();
      if (response.status === 202 && result.code === "enquiry_received") {
        setState("success");
        setFields({ name: "", businessName: "", email: "", businessType: "", enquiry: "", consent: false });
        return;
      }
      setMessage(({ challenge_required: "challengeRequired", challenge_failed: "challengeError", invalid_fields: "validationError" })[result.code] || "unavailable");
    } catch { setMessage("unavailable"); }
    finally { clearTimeout(timeout); pending.current = null; }
    setState("idle");
    setToken("");
    if (widget.current !== null) window.turnstile?.reset(widget.current);
  }

  function fieldError(name) {
    return errors[name] ? <p id={`wholesale-${name}-error`} className="muuva-footer-link mt-2 text-ink">{t(`wholesale.errors.${errors[name]}`, { max: wholesaleLimits[name] })}</p> : null;
  }

  if (received) return (
    <div role="status" className="py-12 sm:py-16">
      <h3 ref={successHeading} tabIndex={-1} className="font-serif text-3xl leading-tight focus:outline-none sm:text-4xl">{t("wholesale.successTitle")}</h3>
      <p className="muuva-support mt-5 text-muted">{t("wholesale.successText")}</p>
    </div>
  );

  return (
    <form ref={form} onSubmit={submit} noValidate aria-label={t("wholesale.formTitle")} aria-busy={state === "loading"} className="mt-8 space-y-5">
      {["name", "businessName", "email"].map((name) => (
        <div key={name}>
          <label htmlFor={`wholesale-${name}`} className="muuva-ui block font-medium">{t(`wholesale.fields.${name}`)} <span aria-hidden="true">*</span></label>
          <input id={`wholesale-${name}`} name={name} type={name === "email" ? "email" : "text"} autoComplete={({ name: "name", businessName: "organization", email: "email" })[name]} required maxLength={wholesaleLimits[name]} value={fields[name]} onChange={update} disabled={state === "loading"} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `wholesale-${name}-error` : undefined} className={inputClass} />
          {fieldError(name)}
        </div>
      ))}
      <div>
        <label htmlFor="wholesale-businessType" className="muuva-ui block font-medium">{t("wholesale.fields.businessType")}</label>
        <select id="wholesale-businessType" name="businessType" value={fields.businessType} onChange={update} disabled={state === "loading"} aria-invalid={Boolean(errors.businessType)} aria-describedby={errors.businessType ? "wholesale-businessType-error" : undefined} className={inputClass}>
          <option value="">{t("wholesale.businessTypes.placeholder")}</option>
          {businessTypes.map((type) => <option key={type} value={type}>{t(`wholesale.businessTypes.${type}`)}</option>)}
        </select>
        {fieldError("businessType")}
      </div>
      <div>
        <label htmlFor="wholesale-enquiry" className="muuva-ui block font-medium">{t("wholesale.fields.enquiry")} <span aria-hidden="true">*</span></label>
        <textarea id="wholesale-enquiry" name="enquiry" required rows={5} maxLength={wholesaleLimits.enquiry} value={fields.enquiry} onChange={update} disabled={state === "loading"} aria-invalid={Boolean(errors.enquiry)} aria-describedby={errors.enquiry ? "wholesale-enquiry-error" : undefined} className={`${inputClass} resize-y`} />
        {fieldError("enquiry")}
      </div>
      <div>
        <label className="muuva-footer-link flex items-start gap-3 text-muted">
          <input id="wholesale-consent" name="consent" type="checkbox" required checked={fields.consent} onChange={update} disabled={state === "loading"} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "wholesale-consent-error" : undefined} className="mt-1 h-5 w-5 shrink-0 accent-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" />
          <span>{t("wholesale.consent")} <span aria-hidden="true">*</span></span>
        </label>
        {fieldError("consent")}
        <p className="muuva-footer-link mt-3 text-muted">{t("wholesale.privacyText")} <a href={localizedUrl(i18n.resolvedLanguage, { page: "privacy" })} className="text-brand underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">{t("footer.links.privacy")}</a>.</p>
      </div>
      {available && <div><p className="muuva-footer-link mb-2 text-muted">{t("wholesale.verificationLabel")}</p><div ref={container} className="min-w-0" /></div>}
      <button type="submit" disabled={!available || state === "loading"} className="muuva-label min-h-12 w-full rounded-sm bg-brand px-7 py-4 text-white transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">{t(state === "loading" ? "wholesale.submitting" : "wholesale.submit")}</button>
      {message && <p role="alert" className="muuva-ui text-ink">{t(`wholesale.errors.${message}`)}</p>}
    </form>
  );
}

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { localizedUrl } from "../routing/urls.js";
import { loadTurnstile, useTurnstileSize } from "../forms/turnstile.js";
import { contactLimits, contactTypes, validateContact } from "../forms/contact.js";
import { useRetryAfter } from "../forms/retry.js";

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const available = import.meta.env.VITE_CONTACT_ENABLED === "true" && Boolean(siteKey) && import.meta.env.BASE_URL === "/";
const inputClass = "muuva-ui mt-2 min-h-12 w-full rounded-sm border border-softborder bg-cream px-4 py-3 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export default function ContactForm() {
  const { t, i18n } = useTranslation();
  const [fields, setFields] = useState({ name: "", email: "", subject: "", message: "", consent: false });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(available ? "" : "notReady");
  const [state, setState] = useState("idle");
  const [token, setToken] = useState("");
  const container = useRef(null);
  const widget = useRef(null);
  const form = useRef(null);
  const successHeading = useRef(null);
  const pending = useRef(null);
  const accepted = useRef(false);
  const retry = useRetryAfter(() => {
    setToken("");
    setMessage((previous) => previous === "rateLimited" ? "" : previous);
    if (widget.current !== null) window.turnstile?.reset(widget.current);
  });
  const received = state === "success";
  const widgetSize = useTurnstileSize(container, available && !received, "flexible");

  useEffect(() => {
    if (!available || received) return;
    let mounted = true;
    setToken("");
    loadTurnstile().then((turnstile) => {
      if (!mounted || !container.current) return;
      widget.current = turnstile.render(container.current, {
        sitekey: siteKey, action: "contact_enquiry", language: i18n.resolvedLanguage, theme: "light", size: widgetSize,
        callback: (value) => { setToken(value); setMessage((previous) => ["challengeRequired", "challengeError"].includes(previous) ? "" : previous); },
        "expired-callback": () => setToken(""),
        "error-callback": () => { setToken(""); setMessage((previous) => previous === "rateLimited" ? previous : "challengeError"); },
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
    const normalized = name === "message" && [...value].length > contactLimits.message
      ? [...value].slice(0, contactLimits.message).join("")
      : value;
    setFields((previous) => ({ ...previous, [name]: type === "checkbox" ? checked : normalized }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }

  async function submit(event) {
    event.preventDefault();
    if (pending.current || accepted.current || !available) return;
    if (retry.isBlocked()) { setMessage("rateLimited"); return; }
    const { value, errors: invalid } = validateContact(fields);
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
      const response = await fetch("/api/contact", {
        method: "POST", credentials: "same-origin", referrerPolicy: "no-referrer",
        headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ ...value, language: i18n.resolvedLanguage, turnstileToken: token }),
      });
      if (response.status === 429) {
        retry.respectRetryAfter(response.headers.get("Retry-After"));
        setMessage("rateLimited");
      } else {
        const result = await response.json();
        if (response.status === 202 && result.code === "enquiry_received") {
          accepted.current = true;
          setState("success");
          return;
        }
        setMessage(({ invalid_fields: "validationError", challenge_required: "challengeRequired", challenge_failed: "challengeError" })[result.code] || "unavailable");
      }
    } catch { setMessage("unavailable"); }
    finally { clearTimeout(timeout); pending.current = null; }
    setState("idle");
    setToken("");
    if (widget.current !== null) window.turnstile?.reset(widget.current);
  }

  function fieldError(name) {
    return errors[name] ? <p id={`contact-${name}-error`} className="muuva-footer-link mt-2 text-ink">{t(`contact.errors.${errors[name]}`, { max: contactLimits[name] })}</p> : null;
  }

  if (received) return <div role="status" className="py-12"><h2 ref={successHeading} tabIndex={-1} className="font-serif text-3xl leading-tight focus:outline-none sm:text-4xl">{t("contact.successTitle")}</h2><p className="muuva-support mt-5 text-muted">{t("contact.successText")}</p></div>;

  return (
    <form ref={form} onSubmit={submit} noValidate aria-label={t("contact.formTitle")} aria-busy={state === "loading"} className="space-y-5">
      <div>
        <label htmlFor="contact-name" className="muuva-ui block font-medium">{t("contact.fields.name")} <span aria-hidden="true">*</span></label>
        <input id="contact-name" name="name" autoComplete="name" required maxLength={contactLimits.name} value={fields.name} onChange={update} disabled={state === "loading"} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} className={inputClass} />{fieldError("name")}
      </div>
      <div>
        <label htmlFor="contact-email" className="muuva-ui block font-medium">{t("contact.fields.email")} <span aria-hidden="true">*</span></label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={contactLimits.email} value={fields.email} onChange={update} disabled={state === "loading"} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} className={inputClass} />{fieldError("email")}
      </div>
      <div>
        <label htmlFor="contact-subject" className="muuva-ui block font-medium">{t("contact.fields.subject")} <span aria-hidden="true">*</span></label>
        <select id="contact-subject" name="subject" required value={fields.subject} onChange={update} disabled={state === "loading"} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? "contact-subject-error" : undefined} className={inputClass}>
          <option value="">{t("contact.subjects.placeholder")}</option>{contactTypes.map((type) => <option key={type} value={type}>{t(`contact.subjects.${type}`)}</option>)}
        </select>{fieldError("subject")}
      </div>
      <div>
        <label htmlFor="contact-message" className="muuva-ui block font-medium">{t("contact.fields.message")} <span aria-hidden="true">*</span></label>
        <textarea id="contact-message" name="message" required rows={6} value={fields.message} onChange={update} disabled={state === "loading"} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} className={`${inputClass} resize-y`} />{fieldError("message")}
      </div>
      <div>
        <label className="muuva-footer-link flex items-start gap-3 text-muted">
          <input id="contact-consent" name="consent" type="checkbox" required checked={fields.consent} onChange={update} disabled={state === "loading"} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "contact-consent-error" : undefined} className="mt-1 h-5 w-5 shrink-0 accent-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" />
          <span>{t("contact.consent")} <span aria-hidden="true">*</span></span>
        </label>{fieldError("consent")}
        <p className="muuva-footer-link mt-3 text-muted">{t("contact.privacyText")} <a href={localizedUrl(i18n.resolvedLanguage, { page: "privacy" })} className="text-brand underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">{t("footer.links.privacy")}</a>.</p>
      </div>
      {available && <div><p className="muuva-footer-link mb-2 text-muted">{t("contact.verificationLabel")}</p><div ref={container} className="min-w-0" /></div>}
      <button type="submit" disabled={!available || state === "loading" || retry.blocked} className="muuva-label min-h-12 w-full rounded-sm bg-brand px-7 py-4 text-white transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">{t(state === "loading" ? "contact.submitting" : "contact.submit")}</button>
      {message && <p role="alert" className="muuva-ui text-ink">{t(`contact.errors.${message}`)}</p>}
    </form>
  );
}

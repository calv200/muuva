import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { localizedUrl } from "../routing/urls.js";
import { loadTurnstile, useTurnstileSize } from "../forms/turnstile.js";

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

export default function NewsletterSignup() {
  const { t, i18n } = useTranslation();
  const widgetContainer = useRef(null);
  const widgetId = useRef(null);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [token, setToken] = useState("");
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const received = state === "success";
  const widgetSize = useTurnstileSize(widgetContainer, Boolean(siteKey) && !received);

  useEffect(() => {
    if (received) return;
    let mounted = true;
    setToken("");
    if (!siteKey) { setMessage("unavailable"); return; }
    loadTurnstile().then((turnstile) => {
      if (!mounted || !widgetContainer.current) return;
      widgetId.current = turnstile.render(widgetContainer.current, {
        sitekey: siteKey,
        action: "newsletter_signup",
        theme: "light",
        size: widgetSize,
        callback: (value) => { setToken(value); setMessage(""); },
        "expired-callback": () => setToken(""),
        "error-callback": () => { setToken(""); setMessage("challengeError"); },
      });
    }).catch(() => { if (mounted) setMessage("challengeError"); });
    return () => {
      mounted = false;
      if (widgetId.current !== null && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [widgetSize, received]);

  async function submit(event) {
    event.preventDefault();
    if (state === "loading" || state === "success") return;
    const address = email.trim();
    if (!address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) { setMessage("invalidEmail"); return; }
    if (!consent) { setMessage("consentRequired"); return; }
    if (!token) { setMessage("challengeRequired"); return; }
    setState("loading");
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        credentials: "same-origin",
        referrerPolicy: "no-referrer",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: address, language: i18n.resolvedLanguage, consent: true, turnstileToken: token }),
      });
      const result = await response.json();
      if (!response.ok || result.code !== "request_received") {
        setMessage(({ invalid_email: "invalidEmail", consent_required: "consentRequired", challenge_required: "challengeRequired", challenge_failed: "challengeError" })[result.code] || "unavailable");
      } else {
        setState("success");
        setEmail("");
        setConsent(false);
        return;
      }
    } catch { setMessage("unavailable"); }
    setState("idle");
    setToken("");
    if (widgetId.current !== null) window.turnstile?.reset(widgetId.current);
  }

  if (state === "success") return <p role="status" className="muuva-ui mt-8 max-w-md text-brand">{t("newsletter.success")}</p>;

  return (
    <form onSubmit={submit} noValidate className="mt-8 max-w-md space-y-4" aria-label={t("newsletter.formLabel")}>
      <div>
        <label htmlFor="newsletter-email" className="muuva-ui block font-medium">{t("newsletter.emailLabel")}</label>
        <input id="newsletter-email" name="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={state === "loading"} placeholder={t("newsletter.emailPlaceholder")} aria-invalid={message === "invalidEmail"} className="muuva-ui mt-2 min-h-11 w-full rounded-sm border border-softborder bg-cream px-4 text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" />
      </div>
      <div>
        <label className="muuva-ui flex items-start gap-3 text-muted">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} disabled={state === "loading"} className="mt-1 h-5 w-5 shrink-0 accent-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" />
          <span>{t("newsletter.consent")}</span>
        </label>
        <p className="muuva-footer-link mt-2 text-muted">{t("newsletter.privacyIntro")} <a href={localizedUrl(i18n.resolvedLanguage, { page: "privacy" })} className="text-brand underline underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">{t("footer.links.privacy")}</a>.</p>
      </div>
      <div>
        <p className="muuva-footer-link mb-2 text-muted">{t("newsletter.verificationLabel")}</p>
        <div ref={widgetContainer} />
      </div>
      <button type="submit" disabled={state === "loading"} className="muuva-ui min-h-11 rounded-full bg-brand px-7 py-2.5 font-medium text-white transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-60">
        {state === "loading" ? t("newsletter.submitting") : t("newsletter.subscribe")}
      </button>
      {message && <p role="alert" className="muuva-ui text-brand">{t(`newsletter.${message}`)}</p>}
    </form>
  );
}

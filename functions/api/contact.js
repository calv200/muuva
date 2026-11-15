import { boundedJson, fetchWithTimeout, json, trustedOrigin } from "../_lib/forms.js";
import { emailIsValid } from "../../src/forms/wholesale.js";
import { contactTypes, validateContact } from "../../src/forms/contact.js";
import { checkFormRateLimit } from "../_lib/rate-limit.js";

const languages = ["en", "de", "nl", "es"];
const allowedFields = ["name", "email", "subject", "message", "consent", "language", "turnstileToken"];

function configFor(env) {
  const name = env.BREVO_CONTACT_SENDER_NAME;
  if (!env.BREVO_WHOLESALE_API_KEY || !env.TURNSTILE_SECRET) return null;
  if (!emailIsValid(env.BREVO_CONTACT_TO_EMAIL) || !emailIsValid(env.BREVO_CONTACT_SENDER_EMAIL)) return null;
  if (typeof name !== "string" || !name.trim() || name.length > 100 || /[\x00-\x1f\x7f]/.test(name)) return null;
  return { key: env.BREVO_WHOLESALE_API_KEY, sender: { email: env.BREVO_CONTACT_SENDER_EMAIL, name: name.trim() }, to: [{ email: env.BREVO_CONTACT_TO_EMAIL }] };
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

export function contactEmail(value, language) {
  const safeMessage = escapeHtml(value.message).replace(/\r\n?|\n/g, "<br>");
  const fields = [["Name", value.name], ["Email", value.email], ["Subject", value.subject], ["Language", language]];
  return {
    subject: "MUUVA contact enquiry",
    textContent: `${fields.map(([label, text]) => `${label}:\n${text}`).join("\n\n")}\n\nMessage:\n${value.message}\n\nPrivacy acknowledgement: used only to process and reply to this enquiry; no marketing subscription.`,
    htmlContent: `<html><body><h1>MUUVA contact enquiry</h1>${fields.map(([label, text]) => `<h2>${label}</h2><p>${escapeHtml(text)}</p>`).join("")}<h2>Message</h2><p>${safeMessage}</p><p>Privacy acknowledgement: used only to process and reply to this enquiry; no marketing subscription.</p></body></html>`,
  };
}

export async function handleContact({ request, env }, fetchImpl = fetch) {
  if (request.method !== "POST") return json(405, "method_not_allowed");
  if (env?.CONTACT_SUBMISSIONS_ENABLED !== "true") return json(503, "unavailable");
  if (!trustedOrigin(request, env.CONTACT_PUBLIC_ORIGIN, env.CONTACT_ALLOWED_HOSTNAME)) return json(403, "forbidden");
  const limited = await checkFormRateLimit({ request, env, endpoint: "contact" });
  if (limited) return limited;
  const input = await boundedJson(request, 24576);
  if (!input || Object.keys(input).some((key) => !allowedFields.includes(key))) return json(400, "invalid_request");
  if (!languages.includes(input.language)) return json(400, "invalid_language");
  const { value, errors } = validateContact(input);
  if (Object.keys(errors).length) return json(400, "invalid_fields");
  if (!contactTypes.includes(value.subject)) return json(400, "invalid_fields");
  if (typeof input.turnstileToken !== "string" || !input.turnstileToken || input.turnstileToken.length > 2048) return json(400, "challenge_required");
  const config = configFor(env);
  if (!config) return json(503, "unavailable");

  try {
    const verified = await fetchWithTimeout(fetchImpl, "https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: input.turnstileToken }),
    }, 6000, true);
    if (!verified.ok) return json(503, "unavailable");
    if (verified.body?.success !== true || verified.body.action !== "contact_enquiry" || verified.body.hostname !== env.CONTACT_ALLOWED_HOSTNAME) return json(400, "challenge_failed");

    const response = await fetchWithTimeout(fetchImpl, "https://api.brevo.com/v3/smtp/email", {
      method: "POST", headers: { "api-key": config.key, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ sender: config.sender, to: config.to, replyTo: { email: value.email, name: value.name }, ...contactEmail(value, input.language) }),
    }, 8000);
    return response.status === 201 ? json(202, "enquiry_received") : json(503, "unavailable");
  } catch { return json(503, "unavailable"); }
}

export function onRequest(context) { return handleContact(context); }

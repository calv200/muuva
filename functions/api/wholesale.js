import { boundedJson, fetchWithTimeout, json, trustedOrigin } from "../_lib/forms.js";
import { emailIsValid, validateWholesale } from "../../src/forms/wholesale.js";
import { checkFormRateLimit } from "../_lib/rate-limit.js";

const languages = ["en", "de", "nl", "es"];
const allowedFields = ["name", "businessName", "email", "businessType", "enquiry", "consent", "language", "turnstileToken"];

function configFor(env) {
  const senderName = env.BREVO_WHOLESALE_SENDER_NAME;
  if (!env.BREVO_WHOLESALE_API_KEY || !env.TURNSTILE_SECRET) return null;
  if (!emailIsValid(env.BREVO_WHOLESALE_TO_EMAIL) || !emailIsValid(env.BREVO_WHOLESALE_SENDER_EMAIL)) return null;
  if (typeof senderName !== "string" || !senderName.trim() || senderName.length > 100 || /[\x00-\x1f\x7f]/.test(senderName)) return null;
  return { sender: { email: env.BREVO_WHOLESALE_SENDER_EMAIL, name: senderName.trim() }, to: [{ email: env.BREVO_WHOLESALE_TO_EMAIL }] };
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function emailContent(value, language) {
  // Fixed subject/recipients; user content appears only as escaped body text and a validated Reply-To.
  const rows = [
    ["Name", value.name], ["Business", value.businessName], ["Email", value.email],
    ["Business type", value.businessType || "Not specified"], ["Language", language],
    ["Privacy acknowledgement", "Accepted for replying to this enquiry; no marketing subscription"],
    ["Enquiry", value.enquiry],
  ];
  return {
    subject: "MUUVA wholesale enquiry",
    textContent: rows.map(([label, text]) => `${label}:\n${text}`).join("\n\n"),
    htmlContent: `<html><body><h1>MUUVA wholesale enquiry</h1>${rows.map(([label, text]) => `<h2>${label}</h2><p>${escapeHtml(text).replace(/\r\n?|\n/g, "<br>")}</p>`).join("")}</body></html>`,
  };
}

// Automated tests supply mocked services; no submitted data or upstream responses are logged.
export async function handleWholesale({ request, env }, fetchImpl = fetch) {
  if (request.method !== "POST") return json(405, "method_not_allowed");
  if (env?.WHOLESALE_SUBMISSIONS_ENABLED !== "true") return json(503, "unavailable");
  if (!trustedOrigin(request, env.WHOLESALE_PUBLIC_ORIGIN, env.WHOLESALE_ALLOWED_HOSTNAME)) return json(403, "forbidden");
  const rateLimit = await checkFormRateLimit({ request, env, endpoint: "wholesale" });
  if (rateLimit) return rateLimit;
  const input = await boundedJson(request, 16384);
  if (!input || Object.keys(input).some((key) => !allowedFields.includes(key))) return json(400, "invalid_request");
  if (!languages.includes(input.language)) return json(400, "invalid_language");
  const { value, errors } = validateWholesale(input);
  if (Object.keys(errors).length) return json(400, "invalid_fields");
  if (typeof input.turnstileToken !== "string" || !input.turnstileToken || input.turnstileToken.length > 2048) return json(400, "challenge_required");
  const config = configFor(env);
  if (!config) return json(503, "unavailable");

  try {
    const verified = await fetchWithTimeout(fetchImpl, "https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: input.turnstileToken }),
    }, 6000, true);
    if (!verified.ok) return json(503, "unavailable");
    if (verified.body?.success !== true || verified.body.action !== "wholesale_enquiry" || verified.body.hostname !== env.WHOLESALE_ALLOWED_HOSTNAME) return json(400, "challenge_failed");

    const response = await fetchWithTimeout(fetchImpl, "https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": env.BREVO_WHOLESALE_API_KEY, "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ ...config, replyTo: { email: value.email, name: value.name }, ...emailContent(value, input.language) }),
    }, 8000);
    return response.status === 201 ? json(202, "enquiry_received") : json(503, "unavailable");
  } catch { return json(503, "unavailable"); }
}

export function onRequest(context) {
  return handleWholesale(context);
}

// Date of preparation of this staging draft, not a production effective date.
export const privacyUpdatedOn = "2026-11-01";

// Stable structure and destinations; all visitor-facing wording is in the catalogs.
export const privacySections = [
  { id: "operator", paragraphs: 2, links: ["contact"] },
  { id: "purposes", paragraphs: 1, links: [] },
  { id: "hosting", paragraphs: 2, links: ["cloudflare", "turnstile", "cloudflareDpa"] },
  { id: "storage", paragraphs: 2, links: [] },
  { id: "consent", paragraphs: 2, links: [] },
  { id: "analytics", paragraphs: 3, links: ["umami", "umamiDpa", "umamiSubprocessors"] },
  { id: "videos", paragraphs: 2, links: ["google"] },
  { id: "newsletter", paragraphs: 2, links: ["brevo"] },
  { id: "wholesale", paragraphs: 2, links: [] },
  { id: "providers", paragraphs: 3, links: ["microsoft", "godaddy"] },
  { id: "retention", paragraphs: 2, links: [] },
  { id: "transfers", paragraphs: 1, links: ["cloudflareTransfers", "cloudflareSubprocessors"] },
  { id: "rights", paragraphs: 2, links: ["contact", "authority"] },
  { id: "updates", paragraphs: 1, links: [] },
];

export const privacyLinks = {
  cloudflare: "https://www.cloudflare.com/privacypolicy/",
  turnstile: "https://www.cloudflare.com/turnstile-privacy-policy/",
  cloudflareDpa: "https://www.cloudflare.com/cloudflare-customer-dpa/",
  cloudflareTransfers: "https://www.cloudflare.com/cloudflare-customer-dpa/",
  cloudflareSubprocessors: "https://www.cloudflare.com/gdpr/subprocessors/cloudflare-services/",
  umami: "https://umami.is/privacy",
  umamiDpa: "https://umami.is/dpa",
  umamiSubprocessors: "https://umami.is/subprocessors",
  brevo: "https://www.brevo.com/legal/privacypolicy/",
  microsoft: "https://www.microsoft.com/en-us/privacy/privacystatement",
  godaddy: "https://www.godaddy.com/legal/agreements/privacy-policy",
  google: "https://policies.google.com/privacy",
  contact: "mailto:contact@muuva.nl",
  authority: "https://www.autoriteitpersoonsgegevens.nl/",
};

// Date of preparation of this staging draft, not a production effective date.
export const privacyUpdatedOn = "2026-10-25";

// Stable structure and destinations; all visitor-facing wording is in the catalogs.
export const privacySections = [
  { id: "operator", paragraphs: 1, links: ["contact"] },
  { id: "hosting", paragraphs: 2, links: ["cloudflare"] },
  { id: "storage", paragraphs: 2, links: [] },
  { id: "analytics", paragraphs: 3, links: ["umami"] },
  { id: "videos", paragraphs: 2, links: ["google"] },
  { id: "services", paragraphs: 2, links: [] },
  { id: "newsletter", paragraphs: 1, links: [] },
  { id: "retention", paragraphs: 2, links: [] },
  { id: "rights", paragraphs: 2, links: ["contact", "authority"] },
];

export const privacyLinks = {
  cloudflare: "https://www.cloudflare.com/privacypolicy/",
  umami: "https://umami.is/privacy",
  google: "https://policies.google.com/privacy",
  contact: "mailto:contact@muuva.nl",
  authority: "https://www.autoriteitpersoonsgegevens.nl/",
};

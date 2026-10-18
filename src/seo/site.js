// Change this origin (or VITE_PUBLIC_SITE_ORIGIN) and Vite's base when moving domains.
export const publicSiteOrigin = new URL(
  import.meta.env?.VITE_PUBLIC_SITE_ORIGIN || "https://calv200.github.io"
).origin;

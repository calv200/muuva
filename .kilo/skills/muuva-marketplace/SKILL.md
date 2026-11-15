---
name: muuva-marketplace
description: "Use when implementing or reviewing MUUVA Amazon Netherlands/Germany marketplace routing based on selected language, optional Cloudflare country signal and explicit user preference."
---
# Marketplace safety and UX
1. Product source `src/data/product.js` currently points only to Amazon Germany. Do not guess Amazon NL URL or ASIN; require a confirmed active listing URL.
2. Selection precedence: user override > Dutch language to NL / German language to DE > English or Spanish country DE/NL > NL fallback.
3. Cloudflare Pages Functions may expose `request.cf.country`; don't rely on it in static client JS, don't add a third-party IP-lookup service, don't store raw IP or precise geo, and keep a deterministic language-based fallback.
4. Route only when clicking Buy on Amazon; don't redirect MUUVA automatically. Visually indicate and allow manual marketplace switch when helpful.
5. Centralize buy links including gallery modal, preserve accessibility and safe new-tab attributes. Don't entangle this with analytics/consent settings or Amazon affiliate parameters without approval.
6. Test every language/country combination, VPN/unknown simulation, missing/invalid URL handling and manual override.

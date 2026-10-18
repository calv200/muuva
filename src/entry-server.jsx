import { renderToString } from "react-dom/server";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import App from "./App.jsx";
import { translationOptions } from "./i18n/resources.js";
import { pagePaths, supportedLanguages } from "./routing/routeManifest.js";
import { parseLocation, localizedUrl } from "./routing/urls.js";
import { getMetadata } from "./seo/metadata.js";
import { publicSiteOrigin } from "./seo/site.js";

export function renderPage(language, path) {
  // Never change a shared instance while generating another language's page.
  const i18n = createInstance();
  i18n.init({ ...translationOptions, lng: language });
  const url = new URL(`${import.meta.env.BASE_URL}${language}/${path}`, publicSiteOrigin);
  const route = parseLocation(url);
  return {
    route,
    metadata: getMetadata(language, route, i18n.t.bind(i18n)),
    html: renderToString(
      <I18nextProvider i18n={i18n}>
        <App initialRoute={route} />
      </I18nextProvider>
    ),
  };
}

export function getPublicPages() {
  return supportedLanguages.flatMap((language) => pagePaths.map((path) => ({ language, path })));
}

export const sitemapUrl = `${publicSiteOrigin}${localizedUrl("en").replace(/en\/$/, "")}sitemap.xml`;

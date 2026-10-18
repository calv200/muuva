import { pagePaths, supportedLanguages } from "../src/routing/routeManifest.js";

export default function localizedEntries() {
  return {
    name: "muuva-localized-entries",
    apply: (config, environment) => environment.command === "build" && !config.build?.ssr,
    enforce: "post",
    generateBundle(_options, bundle) {
      const html = bundle["index.html"];
      if (!html || html.type !== "asset") throw new Error("Missing Vite HTML entry");

      // Reuse Vite's final HTML with its base-aware, hashed asset URLs.
      // npm run build fills these entries with rendered content and metadata.
      for (const language of supportedLanguages) {
        for (const path of pagePaths) {
          this.emitFile({
            type: "asset",
            fileName: `${language}/${path}index.html`,
            source: html.source,
          });
        }
      }
    },
  };
}

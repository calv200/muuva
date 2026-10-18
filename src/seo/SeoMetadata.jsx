import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getMetadata, updateDocumentMetadata } from "./metadata.js";

export default function SeoMetadata({ route }) {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    updateDocumentMetadata(getMetadata(i18n.resolvedLanguage, route, t));
  }, [i18n.resolvedLanguage, route.page, route.slug, t]);
  return null;
}

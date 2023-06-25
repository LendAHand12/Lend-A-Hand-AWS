import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";

import translationEN from "@/assets/locales/en/translation.json";
import translationVI from "@/assets/locales/vi/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};

const options = {
  lookupQuerystring: "lng",
  lookupCookie: "i18next",
  lookupLocalStorage: "i18nextLng",
  lookupSessionStorage: "i18nextLng",
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,

  // cache user language on
  caches: ["localStorage", "cookie"],
  excludeCacheFor: ["cimode"], // languages to not persist (cookie, localStorage)
};

i18n
  .use(initReactI18next)
  .use(detector)
  .init({
    resources,
    detection: options,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    debug: false,
  });

export default i18n;

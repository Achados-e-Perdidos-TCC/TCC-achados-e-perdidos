import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import pt from "./locales/pt.json";
import en from "./locales/en.json";

const STORAGE_KEY = "language";

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "pt" || saved === "en") return saved;
  } catch {
    //
  }
  return navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

const initialLanguage = getInitialLanguage();

i18n.use(initReactI18next).init({
  resources: {
    pt: { translation: pt },
    en: { translation: en },
  },
  lng: initialLanguage,
  fallbackLng: "pt",
  interpolation: { escapeValue: false }, // React already escapes
});

function applyLanguage(lng) {
  document.documentElement.lang = lng === "pt" ? "pt-BR" : "en";
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // ignore
  }
}

applyLanguage(initialLanguage);
i18n.on("languageChanged", applyLanguage);

export default i18n;

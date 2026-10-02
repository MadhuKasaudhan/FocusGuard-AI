import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const STORAGE_KEY = "language";

const AVAILABLE_LANGUAGES = [
  "en",
  "hi",
  "te",
  "ta",
  "ml",
];

const localeImports = {
  en: () => import("./locales/en/translation.json"),
  hi: () => import("./locales/hi/translation.json"),
  te: () => import("./locales/te/translation.json"),
  ta: () => import("./locales/ta/translation.json"),
  ml: () => import("./locales/ml/translation.json"),
};

const languageLoader = async (language) => {
  const loader =
    localeImports[language] || localeImports.en;

  const module = await loader();

  return module.default || module;
};

const customBackend = {
  type: "backend",

  init() {},

  read(language, namespace, callback) {
    languageLoader(language)
      .then((resources) => {
        callback(null, resources);
      })
      .catch((error) => {
        console.error(
          `Failed to load language: ${language}`,
          error
        );

        callback(error, false);
      });
  },
};

const initialLanguage = (() => {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage =
    localStorage.getItem(STORAGE_KEY);

  return AVAILABLE_LANGUAGES.includes(storedLanguage)
    ? storedLanguage
    : "en";
})();

i18n
  .use(customBackend)
  .use(initReactI18next)
  .init({
    lng: initialLanguage,

    fallbackLng: "en",

    supportedLngs: AVAILABLE_LANGUAGES,

    ns: ["translation"],

    defaultNS: "translation",

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export function changeLanguage(language) {
  const nextLanguage =
    AVAILABLE_LANGUAGES.includes(language)
      ? language
      : "en";

  if (typeof window !== "undefined") {
    localStorage.setItem(
      STORAGE_KEY,
      nextLanguage
    );
  }

  return i18n.changeLanguage(nextLanguage);
}

export default i18n;
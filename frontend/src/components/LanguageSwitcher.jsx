import { useTranslation } from "react-i18next";
import { changeLanguage } from "../i18n";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "ml", label: "മലയാളം" },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const currentLanguage = (
    i18n.resolvedLanguage ||
    i18n.language ||
    "en"
  ).split("-")[0];

  const handleChange = async (event) => {
    const language = event.target.value;

    try {
      await changeLanguage(language);

      console.log(
        "Language changed to:",
        language
      );
    } catch (error) {
      console.error(
        "Language change failed:",
        error
      );
    }
  };

  return (
    <div style={{ padding: "6px 8px" }}>
      <select
        value={currentLanguage}
        onChange={handleChange}
        aria-label={t("language.select")}
        title={t("language.select")}
        style={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          background: "var(--bg-elevated)",
          color: "var(--text)",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        {LANGUAGES.map((language) => (
          <option
            key={language.code}
            value={language.code}
          >
            {language.label}
          </option>
        ))}
      </select>
    </div>
  );
}
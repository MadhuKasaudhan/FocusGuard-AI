import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={
        isDark
          ? t("theme.light")
          : t("theme.dark")
      }
      aria-label={
        isDark
          ? t("theme.light")
          : t("theme.dark")
      }
      className="btn-ghost"
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "9px 12px",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      {isDark ? (
        <Sun size={16} />
      ) : (
        <Moon size={16} />
      )}

      <span>
        {isDark
          ? t("theme.light")
          : t("theme.dark")}
      </span>
    </button>
  );
}
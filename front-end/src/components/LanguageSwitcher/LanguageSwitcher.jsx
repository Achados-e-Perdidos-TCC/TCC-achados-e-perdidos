import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

const LANGUAGES = ["pt", "en"];

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage;

  return (
    <div
      className="language-switcher"
      role="group"
      aria-label="Language"
      data-active={current}
    >
      {LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          className={`language-switcher__button ${
            current === lng ? "language-switcher__button--active" : ""
          }`}
          aria-pressed={current === lng}
          onClick={() => i18n.changeLanguage(lng)}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;

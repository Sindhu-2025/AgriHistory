import { Languages } from "lucide-react";
import { LANGUAGES } from "../i18n/translations";
import { useLang } from "../context/LanguageContext";

export default function LanguageSwitcher({ light = false }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`lang-switch${light ? " light" : ""}`} role="group" aria-label="Language">
      <Languages size={16} aria-hidden="true" />
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          className={l.code === lang ? "on" : ""}
          onClick={() => setLang(l.code)}
          aria-pressed={l.code === lang}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LANGUAGES, translations } from "../i18n/translations";

const LanguageContext = createContext(null);

function initialLang() {
  try {
    const saved = localStorage.getItem("agri_lang");
    if (saved && translations[saved]) return saved;
  } catch {
    /* storage unavailable */
  }
  return "en";
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);
  const [voiceCode, setVoiceCode] = useState(null); // null = follow the interface language

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => {
    const dict = translations[lang] || translations.en;
    return {
      lang,
      voiceCode: voiceCode || lang,
      setVoiceCode,
      speechLang: LANGUAGES.find((l) => l.code === (voiceCode || lang))?.speech || "en-IN",
      setLang: (code) => {
        setLangState(code);
        setVoiceCode(null);
        try {
          localStorage.setItem("agri_lang", code);
        } catch {
          /* ignore */
        }
      },
      // falls back to English, then to the key itself
      t: (key) => dict[key] ?? translations.en[key] ?? key,
    };
  }, [lang, voiceCode]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);

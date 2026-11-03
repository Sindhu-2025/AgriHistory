import { Mic } from "lucide-react";
import { LANGUAGES } from "../i18n/translations";
import { useLang } from "../context/LanguageContext";

// Choose which language the mic listens for — independent of the interface language.
export default function VoiceLangPicker({ labelKey = "voiceLangLabel" }) {
  const { t, voiceCode, setVoiceCode } = useLang();
  return (
    <div className="voice-lang" role="group" aria-label={t(labelKey)}>
      <span><Mic size={14} /> {t(labelKey)}</span>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          className={l.code === voiceCode ? "on" : ""}
          onClick={() => setVoiceCode(l.code)}
          aria-pressed={l.code === voiceCode}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

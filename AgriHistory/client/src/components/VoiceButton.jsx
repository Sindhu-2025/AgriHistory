import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { useLang } from "../context/LanguageContext";

const SpeechRecognition =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export const voiceSupported = Boolean(SpeechRecognition);

// Mic button: listens in the selected language and passes the spoken text to onText.
export default function VoiceButton({ onText }) {
  const { t, speechLang } = useLang();
  const [listening, setListening] = useState(false);
  const [msg, setMsg] = useState("");
  const recRef = useRef(null);

  useEffect(() => () => recRef.current?.abort(), []);

  if (!SpeechRecognition) return null;

  function toggle() {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    setMsg("");
    const rec = new SpeechRecognition();
    rec.lang = speechLang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const text = Array.from(e.results).map((r) => r[0].transcript).join(" ").trim();
      if (text) onText(text);
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setMsg(t("micDenied"));
      else if (e.error === "no-speech") setMsg(t("micNoSpeech"));
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`voice-btn${listening ? " live" : ""}`}
        onClick={toggle}
        title={listening ? t("micStop") : t("mic")}
        aria-label={listening ? t("micStop") : t("mic")}
      >
        {listening ? <MicOff size={16} /> : <Mic size={16} />}
      </button>
      {msg && <span className="voice-msg" role="status">{msg}</span>}
    </>
  );
}

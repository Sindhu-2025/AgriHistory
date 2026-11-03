import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import API from "../services/api";
import MapPicker from "../components/MapPicker";
import Topbar from "../components/Topbar";
import VoiceButton, { voiceSupported } from "../components/VoiceButton";
import VoiceLangPicker from "../components/VoiceLangPicker";
import { useLang } from "../context/LanguageContext";

const initial = {
  fieldName: "", crop: "", year: new Date().getFullYear(), season: "Kharif", village: "", district: "",
  state: "Andhra Pradesh", soilType: "", soilFertility: "", fertilizers: "", pesticides: "", irrigation: "",
  yieldAmount: "", yieldUnit: "quintals/acre", notes: "", visibility: "public",
};

// Text box / textarea with a mic button that appends what you say.
function Field({ label, name, value, onChange, placeholder, textarea = false, ...rest }) {
  const Tag = textarea ? "textarea" : "input";
  const append = (text) => onChange({ target: { name, value: value ? `${value} ${text}` : text } });
  return (
    <label>
      {label}
      <div className={`voice-field${textarea ? " tall" : ""}`}>
        <Tag name={name} value={value} onChange={onChange} placeholder={placeholder} {...rest} />
        <VoiceButton onText={append} />
      </div>
    </label>
  );
}

export default function RecordForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const { t } = useLang();
  const [form, setForm] = useState(initial);
  const [point, setPoint] = useState({ lat: 16.3067, lng: 80.4365 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    if (!editing) return;
    API.get(`/records/${id}`)
      .then(({ data }) => {
        const rec = data.record;
        setForm({ ...initial, ...rec });
        if (rec.location?.coordinates) setPoint({ lng: rec.location.coordinates[0], lat: rec.location.coordinates[1] });
      })
      .catch((e) => setError(e.response?.data?.message || t("loadFail")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, id]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = {
        ...form,
        year: Number(form.year),
        yieldAmount: form.yieldAmount ? Number(form.yieldAmount) : undefined,
        location: { type: "Point", coordinates: [point.lng, point.lat] },
      };
      const { data } = editing ? await API.put(`/records/${id}`, body) : await API.post("/records", body);
      nav(`/records/${data.record._id}`);
    } catch (err) {
      setError(err.response?.data?.message || t("saveFail"));
    } finally {
      setBusy(false);
    }
  }

  const F = (name, label, ph, extra = {}) => (
    <Field label={t(label)} name={name} value={form[name]} onChange={change} placeholder={ph ? t(ph) : undefined} {...extra} />
  );

  return (
    <div className="form-page">
      <Topbar active="new" />
      <main className="form-main">
        <span className="eyebrow">{t("contribute")}</span>
        <h1>{editing ? t("formUpdate") : t("formNew")}</h1>
        <p className="muted">{t("formIntro")}</p>
        {voiceSupported && (
          <div className="voice-hint">
            <p>🎤 {t("voiceHint")}</p>
            <VoiceLangPicker />
          </div>
        )}

        <form className="record-form" onSubmit={submit}>
          <section className="form-section">
            <h2>{t("s1")}</h2>
            <div className="form-grid">
              {F("fieldName", "fieldName", "fieldNamePh", { required: true })}
              {F("crop", "crop", "cropPh", { required: true })}
              <label>{t("year")}<input type="number" name="year" min="1900" max="2100" value={form.year} onChange={change} required /></label>
              <label>{t("season")}
                <select name="season" value={form.season} onChange={change}>
                  {["Kharif", "Rabi", "Zaid", "Perennial", "Other"].map((x) => <option key={x} value={x}>{t(x)}</option>)}
                </select>
              </label>
              {F("village", "village", null, { required: true })}
              {F("district", "district", null, { required: true })}
              {F("state", "state")}
            </div>
          </section>

          <section className="form-section">
            <h2>{t("s2")}</h2>
            <p className="muted">{t("s2note")}</p>
            <MapPicker value={point} onChange={setPoint} />
          </section>

          <section className="form-section">
            <h2>{t("s3")}</h2>
            <div className="form-grid">
              {F("soilType", "soilType", "soilTypePh")}
              {F("soilFertility", "soilFert", "soilFertPh")}
              {F("fertilizers", "fert", "fertPh")}
              {F("pesticides", "pest", "pestPh")}
              {F("irrigation", "irrig", "irrigPh")}
              <div className="yield-fields">
                <label>{t("yieldAmt")}<input type="number" min="0" step="any" name="yieldAmount" value={form.yieldAmount} onChange={change} placeholder={t("optional")} /></label>
                <label>{t("unit")}
                  <select name="yieldUnit" value={form.yieldUnit} onChange={change}>
                    <option>quintals/acre</option><option>tonnes/hectare</option><option>kg/acre</option><option>bags/acre</option>
                  </select>
                </label>
              </div>
            </div>
            {voiceSupported && <VoiceLangPicker labelKey="speakNotesIn" />}
            {F("notes", "notes", "notesPh", { textarea: true, rows: 4 })}
          </section>

          <section className="form-section">
            <h2>{t("s4")}</h2>
            <label>{t("visibility")}
              <select name="visibility" value={form.visibility} onChange={change}>
                <option value="public">{t("visPublic")}</option>
                <option value="private">{t("visPrivate")}</option>
              </select>
            </label>
          </section>

          {error && <div className="error-box">{error}</div>}
          <div className="form-actions">
            <Link className="btn secondary" to="/dashboard">{t("cancel")}</Link>
            <button className="btn primary" disabled={busy}>
              <Save size={17} />{busy ? t("saving") : editing ? t("update") : t("save")}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

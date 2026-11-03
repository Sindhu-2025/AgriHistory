import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, CalendarDays, Trash2, Edit3, Lock, Globe2 } from "lucide-react";
import API from "../services/api";
import Topbar from "../components/Topbar";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import { cropBg } from "../utils/cropImage";

export default function RecordDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, lang } = useLang();
  const [r, setR] = useState(null);
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    API.get(`/records/${id}`)
      .then((x) => setR(x.data.record))
      .catch((e) => setError(e.response?.data?.message || t("notFound")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function remove() {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await API.delete(`/records/${id}`);
      nav("/dashboard");
    } catch (e) {
      setError(e.response?.data?.message || t("deleteFailed"));
    }
  }

  if (error)
    return (
      <main className="detail-page">
        <Topbar />
        <div className="detail-main"><Link to="/dashboard" className="back-link"><ArrowLeft size={16} /> {t("back")}</Link><div className="error-box">{error}</div></div>
      </main>
    );
  if (!r) return <div className="loading">{t("loading")}</div>;

  const owner = r.farmer?._id === user?.id || r.farmer === user?.id;
  const items = [
    [t("soilType"), r.soilType],
    [t("soilFertility"), r.soilFertility],
    [t("fertilizers"), r.fertilizers],
    [t("pestMgmt"), r.pesticides],
    [t("irrigation"), r.irrigation],
    [t("yield"), r.yieldAmount ? `${r.yieldAmount} ${r.yieldUnit}` : null],
  ];

  return (
    <div className="detail-page">
      <Topbar />
      <div className="detail-cover" style={{ backgroundImage: cropBg(r.crop) }}>
        <div className="detail-cover-inner">
          <span className="eyebrow">{t("fieldHistoryEyebrow")} · {r.year}</span>
          <h1>{r.fieldName}</h1>
          <p className="record-location"><MapPin size={16} />{[r.village, r.district, r.state].filter(Boolean).join(", ")}</p>
        </div>
      </div>
      <main className="detail-main">
        <div className="detail-title">
          <Link to="/dashboard" className="back-link"><ArrowLeft size={16} /> {t("back")}</Link>
          {owner && (
            <div className="detail-actions">
              <Link className="btn secondary" to={`/records/${id}/edit`}><Edit3 size={16} /> {t("edit")}</Link>
              <button className="btn danger" onClick={remove}><Trash2 size={16} /> {t("delete")}</button>
            </div>
          )}
        </div>

        <div className="detail-hero">
          <div>
            <span className="eyebrow">{t("cropThisSeason")}</span>
            <h2>{r.crop}</h2>
            <p>{t(r.season)} {r.year}</p>
          </div>
          <div className="visibility">{r.visibility === "public" ? <Globe2 size={16} /> : <Lock size={16} />} {t(r.visibility)}</div>
        </div>

        <div className="detail-grid">
          {items.map(([k, v]) => (
            <div className="detail-item" key={k}><small>{k}</small><strong>{v || t("notRecorded")}</strong></div>
          ))}
        </div>

        <section className="notes-panel">
          <h2>{t("farmerNotes")}</h2>
          <p>{r.notes || t("noNotes")}</p>
        </section>
        <p className="detail-byline">
          {t("recordedBy")} {r.farmer?.name || t("farmer")} · <CalendarDays size={14} /> {new Date(r.createdAt).toLocaleDateString(`${lang}-IN`)}
        </p>
      </main>
    </div>
  );
}

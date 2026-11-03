import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, MapPin, Sprout, Globe2, Search, ArrowUpRight, CalendarDays } from "lucide-react";
import API from "../services/api";
import RecordMap from "../components/RecordMap";
import Topbar from "../components/Topbar";
import VoiceButton from "../components/VoiceButton";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import { cropBg } from "../utils/cropImage";

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLang();
  const [records, setRecords] = useState([]);
  const [q, setQ] = useState("");
  const [year, setYear] = useState("all");
  const [err, setErr] = useState("");

  useEffect(() => {
    API.get("/records")
      .then(({ data }) => setRecords(data.records || []))
      .catch((e) => setErr(e.response?.data?.message || t("loadErr")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = records.filter(
    (r) =>
      `${r.fieldName} ${r.crop} ${r.village} ${r.district}`.toLowerCase().includes(q.toLowerCase()) &&
      (year === "all" || String(r.year) === year)
  );
  const mine = records.filter((r) => r.farmer?._id === user?.id || r.farmer === user?.id).length;
  const publicCount = records.filter((r) => r.visibility === "public").length;
  const years = [...new Set(records.map((r) => String(r.year)))].sort((a, b) => b - a);

  return (
    <div className="app-shell">
      <Topbar active="explore" />
      <main className="dashboard">
        <section className="welcome-banner">
          <div>
            <span className="eyebrow">{t("fieldKnowledge")}</span>
            <h1>{t("goodToSee")} {user?.name?.split(" ")[0] || ""}.</h1>
            <p>{t("exploreStories")}</p>
          </div>
          {user?.role === "farmer" && (
            <Link className="btn gold" to="/records/new"><Plus size={18} /> {t("addFieldHistory")}</Link>
          )}
        </section>

        <section className="stat-grid">
          <div className="stat-card"><span className="stat-icon"><Globe2 /></span><div><strong>{publicCount}</strong><small>{t("statPublic")}</small></div></div>
          <div className="stat-card"><span className="stat-icon"><Sprout /></span><div><strong>{mine}</strong><small>{t("statMine")}</small></div></div>
          <div className="stat-card"><span className="stat-icon"><CalendarDays /></span><div><strong>{years.length}</strong><small>{t("statYears")}</small></div></div>
        </section>

        <section className="explore-layout">
          <div className="records-column">
            <div className="section-heading">
              <div><span className="eyebrow">{t("communityArchive")}</span><h2>{t("fieldHistories")}</h2></div>
              <span className="result-count">{filtered.length} {t("records")}</span>
            </div>

            <div className="filter-row">
              <div className="search-box">
                <Search size={17} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPh")} />
                <VoiceButton onText={(text) => setQ(text.replace(/[.।]$/, ""))} />
              </div>
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="all">{t("allYears")}</option>
                {years.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>

            {err && <div className="error-box">{err}</div>}

            <div className="record-list">
              {filtered.map((r) => (
                <article className="record-card" key={r._id}>
                  <div className="record-img" style={{ backgroundImage: cropBg(r.crop) }}>
                    <span className="crop-tag"><Sprout size={14} />{r.crop}</span>
                    <span className="record-year">{r.year} · {t(r.season)}</span>
                  </div>
                  <div className="record-body">
                    <h3>{r.fieldName}</h3>
                    <p className="record-location"><MapPin size={15} />{[r.village, r.district, r.state].filter(Boolean).join(", ")}</p>
                    <div className="record-details">
                      <span>{t("soil")}: <b>{r.soilType || t("notRecorded")}</b></span>
                      <span>{t("yield")}: <b>{r.yieldAmount ? `${r.yieldAmount} ${r.yieldUnit || ""}` : t("notRecorded")}</b></span>
                    </div>
                    <div className="record-footer">
                      <span>{t("by")} {r.farmer?.name || t("communityFarmer")}</span>
                      <Link to={`/records/${r._id}`}>{t("viewHistory")} <ArrowUpRight size={15} /></Link>
                    </div>
                  </div>
                </article>
              ))}
              {!filtered.length && !err && (
                <div className="empty-state">
                  <Sprout size={30} />
                  <h3>{t("noFound")}</h3>
                  <p>{t("tryAnother")}</p>
                  {user?.role === "farmer" && <Link to="/records/new" className="btn primary">{t("addFirst")}</Link>}
                </div>
              )}
            </div>
          </div>

          <aside className="map-column">
            <div className="section-heading"><div><span className="eyebrow">{t("explorePlace")}</span><h2>{t("fieldMap")}</h2></div></div>
            <RecordMap records={filtered} />
            <p className="map-hint"><MapPin size={14} /> {t("mapHint")}</p>
            <div className="map-note"><strong>{t("whyHistory")}</strong><p>{t("whyHistoryText")}</p></div>
          </aside>
        </section>
      </main>
    </div>
  );
}


import {
  Routes,
  Route,
  Navigate,
  Link
} from "react-router-dom";

import {
  Sprout,
  ArrowRight,
  MapPin,
  BookOpen,
  Leaf,
  Globe2,
  Mic
} from "lucide-react";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { useLang } from "./context/LanguageContext";
import LanguageSwitcher from "./components/LanguageSwitcher";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import RecordForm from "./pages/RecordForm";
import RecordDetail from "./pages/RecordDetail";

function Home() {
  const { user } = useAuth();
  const { t } = useLang();

  return (
    <div className="landing">
      <section className="hero-full">
        <header className="landing-nav">
          <Link to="/" className="brand">
            <Sprout /> AgriHistory
          </Link>
          <div>
            <a href="#about" className="nav-about">{t("purpose")}</a>
            <LanguageSwitcher light />
            {user ? (
              <Link className="btn primary" to="/dashboard">
                {t("openArchive")} <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="nav-login">{t("signIn")}</Link>
                <Link to="/register" className="btn gold">
                  {t("joinArchive")} <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        </header>

        <div className="hero-inner">
          <span className="eyebrow">{t("heroEyebrow")}</span>
          <h1>
            {t("heroT1")} <em>{t("heroT2")}</em>
          </h1>
          <p>{t("heroText")}</p>
          <div className="hero-actions">
            <Link to={user ? "/dashboard" : "/register"} className="btn gold big">
              {t("exploreHistories")} <ArrowRight size={17} />
            </Link>
            {!user && <Link to="/login" className="text-link light">{t("haveAccount")}</Link>}
          </div>
          <div className="hero-proof">
            <span><Leaf size={16} /> {t("proofFarmer")}</span>
            <span><Globe2 size={16} /> {t("proofCommunity")}</span>
            <span><Mic size={16} /> English · తెలుగు · हिन्दी</span>
          </div>
        </div>

        <div className="floating-note">
          <span className="note-icon"><Sprout /></span>
          <div>
            <b>{t("oneSeason")}</b>
            <small>{t("buildHistory")}</small>
          </div>
        </div>
      </section>

      <main>
        <section className="purpose" id="about">
          <div className="purpose-heading">
            <span className="eyebrow">{t("whyEyebrow")}</span>
            <h2>{t("whyT1")} <em>{t("whyT2")}</em></h2>
            <p>{t("whyText")}</p>
          </div>

          <div className="feature-grid">
            {[
              ["paddy", BookOpen, "f1t", "f1p"],
              ["chilli", MapPin, "f2t", "f2p"],
              ["cotton", Globe2, "f3t", "f3p"],
            ].map(([img, Icon, tt, pp]) => (
              <article key={tt}>
                <div className="feature-img" style={{ backgroundImage: `url(${{
                    paddy: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=900&q=80",
                    chilli: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=900&q=80",
                    cotton: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=900&q=80"
                  }[img]})` }}>
                  <span><Icon /></span>
                </div>
                <div className="feature-body">
                  <h3>{t(tt)}</h3>
                  <p>{t(pp)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>


        <section className="gallery">
          <div className="purpose-heading">
            <span className="eyebrow">{t("galleryEyebrow")}</span>
            <h2>{t("galleryTitle")}</h2>
            <p>{t("galleryText")}</p>
          </div>
          <div className="gallery-grid">
            {[
              ["cotton", "capCotton", "g-wide"],
              ["chilli", "capChilli", "g-tall"],
              ["paddy", "capPaddy", "g-wide"],
            ].map(([img, cap, cls]) => (
              <figure key={img} className={cls}>
                <img src={{
                  cotton: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=1200&q=85",
                  chilli: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=85",
                  paddy: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=85"
                }[img]} alt={t(cap)} loading="lazy" />
                <figcaption>{t(cap)}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="voice-band">
          <div className="voice-copy">
            <span className="eyebrow">VOICE · వాయిస్ · आवाज़</span>
            <h2>{t("voiceTitle")}</h2>
            <p>{t("voiceText")}</p>
            <div className="lang-chips">
              <span>English</span><span>తెలుగు</span><span>हिन्दी</span>
            </div>
          </div>
          <div className="mic-orb" aria-hidden="true"><Mic size={44} /></div>
        </section>
      </main>

      <footer>
        <Link to="/" className="brand">
          <Sprout /> AgriHistory
        </Link>
        <span>{t("footerTag")}</span>
      </footer>
    </div>
  );
}

function Guard({ children, farmer = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    farmer &&
    user.role !== "farmer" &&
    user.role !== "admin"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={<AuthPage mode="login" />}
      />

      <Route
        path="/register"
        element={<AuthPage mode="register" />}
      />

      <Route
        path="/dashboard"
        element={<Guard><Dashboard /></Guard>}
      />

      <Route
        path="/records/new"
        element={<Guard farmer><RecordForm /></Guard>}
      />

      <Route
        path="/records/:id/edit"
        element={<Guard farmer><RecordForm /></Guard>}
      />

      <Route
        path="/records/:id"
        element={<Guard><RecordDetail /></Guard>}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

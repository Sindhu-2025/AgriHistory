import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const { t } = useLang();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "farmer" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isRegister) await register(form);
      else await login({ email: form.email, password: form.password });
      nav("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || t("connectErr"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-art">
        <div className="brand"><Sprout /> AgriHistory</div>
        <div className="auth-art-copy">
          <span className="eyebrow">{t("rooted")}</span>
          <h1>{t("authT1")} <em>{t("authT2")}</em></h1>
          <p>{t("authText")}</p>
        </div>
        <div className="art-bottom">{t("artBottom")}</div>
      </div>

      <section className="auth-panel">
        <div className="auth-top">
          <Link className="back-link" to="/">{t("backHome")}</Link>
          <LanguageSwitcher />
        </div>
        <form className="auth-form" onSubmit={submit}>
          <span className="eyebrow">{isRegister ? t("startJourney") : t("welcomeBack")}</span>
          <h2>{isRegister ? t("createTitle") : t("signInTitle")}</h2>
          <p className="muted">{isRegister ? t("createSub") : t("signInSub")}</p>
          {isRegister && (
            <label>{t("fullName")}
              <input name="name" value={form.name} onChange={change} placeholder={t("namePh")} required />
            </label>
          )}
          <label>{t("email")}
            <input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" required />
          </label>
          <label>{t("password")}
            <input name="password" type="password" minLength="6" value={form.password} onChange={change} placeholder={t("passPh")} required />
          </label>
          {isRegister && (
            <label>{t("accountType")}
              <select name="role" value={form.role} onChange={change}>
                <option value="farmer">{t("farmerOpt")}</option>
                <option value="visitor">{t("visitorOpt")}</option>
              </select>
            </label>
          )}
          {error && <div className="error-box">{error}</div>}
          <button className="btn primary full" disabled={busy}>
            {busy ? t("pleaseWait") : isRegister ? t("createBtn") : t("signInBtn")}
            <ArrowRight size={17} />
          </button>
          <p className="switch-auth">
            {isRegister ? t("already") : t("newTo")}{" "}
            <Link to={isRegister ? "/login" : "/register"}>{isRegister ? t("signIn") : t("createAnAccount")}</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

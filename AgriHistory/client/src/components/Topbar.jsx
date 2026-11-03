import { Link } from "react-router-dom";
import { Sprout, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Topbar({ active = "explore" }) {
  const { user, logout } = useAuth();
  const { t } = useLang();
  return (
    <header className="topbar">
      <Link to="/" className="brand dark"><Sprout /> AgriHistory</Link>
      <nav>
        <Link to="/dashboard" className={active === "explore" ? "active" : ""}>{t("explore")}</Link>
        {user?.role === "farmer" && <Link to="/records/new" className={active === "new" ? "active" : ""}>{t("addRecord")}</Link>}
      </nav>
      <LanguageSwitcher />
      <div className="user-chip"><span>{user?.name?.[0]?.toUpperCase()}</span><b>{user?.name}</b></div>
      <button className="icon-btn" onClick={logout} title={t("signOut")} aria-label={t("signOut")}><LogOut size={17} /></button>
    </header>
  );
}

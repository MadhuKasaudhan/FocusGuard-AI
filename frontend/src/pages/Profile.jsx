import { useTranslation } from "react-i18next";
import { UserCircle, Mail, ShieldCheck, BadgeCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>{t("profile.title")}</h1>
      <p className="page-subtitle">{t("profile.subtitle")}</p>

      <div className="panel">
        <div className="kv-grid">
          <div>
            <span className="kv-key">
              <UserCircle size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />
              {t("profile.name")}
            </span>
            <span className="kv-value">{user?.name}</span>
          </div>
          <div>
            <span className="kv-key">
              <Mail size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />
              {t("profile.email")}
            </span>
            <span className="kv-value">{user?.email}</span>
          </div>
          <div>
            <span className="kv-key">
              <ShieldCheck size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />
              {t("profile.accountStatus")}
            </span>
            <span className="kv-value">{user?.is_active ? t("profile.accountStatusActive") : t("profile.inactive")}</span>
          </div>
          <div>
            <span className="kv-key">
              <BadgeCheck size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />
              {t("profile.role")}
            </span>
            <span className="kv-value">{user?.is_superuser ? t("profile.admin") : t("profile.user")}</span>
          </div>
        </div>
      </div>

      <p className="empty-note">
        {t("profile.editingNotWired")}
      </p>
    </div>
  );
}

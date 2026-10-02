import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, AlarmClock, ShieldAlert } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import api from "../api/client";

const GENERATORS = [
  { key: "smart-reminders", labelKey: "notifications.smartReminders", icon: Sparkles },
  { key: "focus-session-alerts", labelKey: "notifications.focusSessionAlerts", icon: AlarmClock },
  { key: "distraction-alerts", labelKey: "notifications.distractionAlerts", icon: ShieldAlert },
];

export default function Notifications() {
  const { t } = useTranslation();
  const [results, setResults] = useState({});
  const [running, setRunning] = useState(null);
  const { data: notifications, loading, refetch } = useFetch("/monitoring/notifications");

  async function handleGenerate(key) {
    setRunning(key);
    try {
      const { data } = await api.post(`/notifications/${key}`);
      setResults((prev) => ({ ...prev, [key]: data.summary }));
      refetch();
    } catch {
      setResults((prev) => ({ ...prev, [key]: "Something went wrong generating this." }));
    } finally {
      setRunning(null);
    }
  }

  const sorted = [...(notifications || [])].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="page page-wide">
      <h1>{t("notifications.title")}</h1>
      <p className="page-subtitle">{t("notifications.subtitle")}</p>

      <div className="grid-3">
        {GENERATORS.map(({ key, labelKey, icon: Icon }) => (
          <div key={key} className="panel insight-card">
            <div className="insight-card-header">
              <h2>
                <Icon size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />
                {t(labelKey)}
              </h2>
            </div>
            <p className="insight-summary">{results[key] || t("notifications.notRunYet")}</p>
            <button
              className="btn-secondary"
              style={{ marginTop: 10 }}
              onClick={() => handleGenerate(key)}
              disabled={running === key}
            >
              {running === key ? t("notifications.generating") : t("notifications.generate")}
            </button>
          </div>
        ))}
      </div>

      <div className="section-block" style={{ marginTop: 24 }}>
        <div className="section-title">{t("notifications.notificationLog")}</div>
        <div className="panel">
          {loading ? (
            <p className="empty-note">{t("common.loading")}</p>
          ) : sorted.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("notifications.message")}</th>
                  <th>{t("notifications.channel")}</th>
                  <th>{t("notifications.status")}</th>
                  <th>{t("notifications.created")}</th>
                </tr>
              </thead>
              <tbody>
                {sorted.slice(0, 20).map((n) => (
                  <tr key={n.id}>
                    <td>{n.message}</td>
                    <td>{n.channel}</td>
                    <td>
                      <span className={`badge ${n.is_read ? "badge-muted" : "badge-success"}`}>
                        {n.is_read ? t("notifications.read") : t("notifications.unread")}
                      </span>
                    </td>
                    <td>{new Date(n.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-note">{t("notifications.noNotificationsYet")}</p>
          )}
        </div>
      </div>
    </div>
  );
}

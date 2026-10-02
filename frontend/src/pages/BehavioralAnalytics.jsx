import { useTranslation } from "react-i18next";
import { Brain, Focus, TrendingUp, Zap, Trash2 } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { translatePattern } from "../utils/translatePattern";
import api from "../api/client";

function Section({ icon: Icon, title, score, pattern, summary, t }) {
  return (
    <div className="panel insight-card">
      <div className="insight-card-header">
        <h2>
          <Icon size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />
          {title}
        </h2>
        {score !== undefined && <div className="mini-score">{score}</div>}
      </div>
      {pattern && <span className="pattern-badge">{translatePattern(t, pattern)}</span>}
      <p className="insight-summary">{summary}</p>
    </div>
  );
}

export default function BehavioralAnalytics() {
  const { t } = useTranslation();
  const { data, loading, error } = useFetch("/behavioral-analytics/summary");
  const { data: history, refetch: refetchHistory } = useFetch("/behavioral-analytics/insights");

  async function handleDelete(id) {
    try {
      await api.delete(`/behavioral-analytics/insights/${id}`);
      refetchHistory();
    } catch {
      // silently ignore - refetch will just show it's still there
    }
  }

  return (
    <div className="page page-wide">
      <h1>{t("behavioralAnalytics.title")}</h1>
      <p className="page-subtitle">{t("behavioralAnalytics.subtitle")}</p>

      {loading && <p className="empty-note">{t("common.loading")}</p>}
      {error && <p className="empty-note">{t("behavioralAnalytics.couldntLoad")}</p>}

      {data && (
        <div className="grid-2">
          <Section
            icon={Brain}
            title={t("behavioralAnalytics.attentionPattern")}
            score={data.attention_pattern.attention_stability_score}
            pattern={data.attention_pattern.pattern_label}
            summary={data.attention_pattern.summary}
            t={t}
          />
          <Section
            icon={Focus}
            title={t("behavioralAnalytics.focusSessions")}
            score={data.focus_session.completion_rate}
            pattern={data.focus_session.pattern_label}
            summary={data.focus_session.summary}
            t={t}
          />
          <Section
            icon={TrendingUp}
            title={t("behavioralAnalytics.productivityTrend")}
            score={data.productivity_trend.average_productivity_score}
            pattern={data.productivity_trend.trend.direction}
            summary={data.productivity_trend.summary}
            t={t}
          />
          <Section
            icon={Zap}
            title={t("behavioralAnalytics.distractionFrequency")}
            score={data.distraction_frequency.distraction_control_score}
            pattern={data.distraction_frequency.pattern_label}
            summary={data.distraction_frequency.summary}
            t={t}
          />
        </div>
      )}

      <div className="section-block" style={{ marginTop: 12 }}>
        <div className="section-title">{t("behavioralAnalytics.insightHistory")}</div>
        <div className="panel">
          {history && history.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("behavioralAnalytics.type")}</th>
                  <th>{t("behavioralAnalytics.score")}</th>
                  <th>{t("behavioralAnalytics.pattern")}</th>
                  <th>{t("behavioralAnalytics.created")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id}>
                    <td>{translatePattern(t, h.insight_type)}</td>
                    <td>{h.score ?? "—"}</td>
                    <td>{h.pattern_label ? translatePattern(t, h.pattern_label) : "—"}</td>
                    <td>{new Date(h.created_at).toLocaleString()}</td>
                    <td>
                      <button className="btn-ghost" onClick={() => handleDelete(h.id)} title={t("behavioralAnalytics.delete")}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-note">{t("behavioralAnalytics.noSavedInsights")}</p>
          )}
        </div>
      </div>
    </div>
  );
}

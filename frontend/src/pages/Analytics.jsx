import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFetch } from "../hooks/useFetch";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const CATEGORY_COLORS = [
  "var(--accent)",
  "var(--success)",
  "var(--blue)",
  "var(--warn)",
  "var(--danger)",
  "var(--accent-soft)",
  "var(--blue)",
  "var(--warn)",
];

export default function Analytics() {
  const { t } = useTranslation();
  const [day, setDay] = useState(todayISO());

  const { data: daily, loading: dailyLoading } = useFetch(`/analytics/daily?day=${day}`);
  const { data: weekly, loading: weeklyLoading } = useFetch(`/analytics/weekly?day=${day}`);
  const { data: monthly, loading: monthlyLoading } = useFetch(`/analytics/monthly?day=${day}`);
  const { data: productivity } = useFetch("/behavioral-analytics/productivity-trend");
  const { data: appUsage } = useFetch("/monitoring/app-usage");

  const weeklyChart = useMemo(() => {
    if (!weekly?.daily_breakdown) return [];
    return weekly.daily_breakdown.map((d) => ({
      label: new Date(d.date).toLocaleDateString(undefined, { weekday: "short" }),
      score: d.daily_focus_score,
    }));
  }, [weekly]);

  const monthlyChart = useMemo(() => {
    if (!monthly?.daily_breakdown) return [];
    return monthly.daily_breakdown.map((d) => ({
      label: new Date(d.date).getDate(),
      score: d.daily_focus_score,
    }));
  }, [monthly]);

  const productivityDonut = useMemo(() => {
    if (!productivity) return [];
    const productive = productivity.total_productive_minutes || 0;
    const unproductive = productivity.total_unproductive_minutes || 0;
    if (productive === 0 && unproductive === 0) return [];
    return [
      { name: "Productive", value: productive },
      { name: "Unproductive", value: unproductive },
    ];
  }, [productivity]);

  const categoryBreakdown = useMemo(() => {
    if (!appUsage) return [];
    const totals = {};
    for (const entry of appUsage) {
      const cat = entry.category || "Uncategorized";
      totals[cat] = (totals[cat] || 0) + (entry.usage_minutes || 0);
    }
    const grand = Object.values(totals).reduce((a, b) => a + b, 0);
    if (grand === 0) return [];
    return Object.entries(totals)
      .map(([name, minutes]) => ({ name, minutes, pct: Math.round((minutes / grand) * 100) }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [appUsage]);

  const topWebsites = useMemo(() => {
    if (!appUsage) return [];
    const totals = {};
    for (const entry of appUsage) {
      const key = entry.app_name;
      if (!totals[key]) totals[key] = { app_name: key, category: entry.category || "Uncategorized", minutes: 0 };
      totals[key].minutes += entry.usage_minutes || 0;
    }
    return Object.values(totals)
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 8);
  }, [appUsage]);

  return (
    <div className="page page-wide">
      <h1>{t("analytics.title")}</h1>
      <p className="page-subtitle">{t("analytics.subtitle")}</p>

      <div className="date-input-row">
        <label htmlFor="analytics-date" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          {t("analytics.viewing")}
        </label>
        <input id="analytics-date" type="date" value={day} onChange={(e) => setDay(e.target.value)} />
      </div>

      <div className="section-block">
        <div className="section-title">{t("analytics.daily")}</div>
        {dailyLoading ? (
          <p className="empty-note">{t("common.loading")}</p>
        ) : (
          <div className="card-grid">
            <div className="stat-card">
              <div>
                <div className="stat-label">{t("analytics.focusScore")}</div>
                <div className="stat-value">{daily?.daily_focus_score ?? 0}</div>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <div className="stat-label">{t("analytics.productivityScore")}</div>
                <div className="stat-value">{daily?.productivity_score ?? 0}</div>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <div className="stat-label">{t("analytics.attentionStability")}</div>
                <div className="stat-value">{daily?.attention_stability_score ?? 0}</div>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <div className="stat-label">{t("analytics.distractionFrequency")}</div>
                <div className="stat-value">{daily?.distraction_frequency ?? 0}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid-2">
        <div className="panel">
          <h2>{t("analytics.productiveVsUnproductive")}</h2>
          {productivityDonut.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={productivityDonut}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  <Cell fill="var(--success)" />
                  <Cell fill="var(--danger)" />
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="empty-note">{t("analytics.noDataYet")}</p>
          )}
        </div>

        <div className="panel">
          <h2>{t("analytics.timeByCategory")}</h2>
          {categoryBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categoryBreakdown} dataKey="minutes" nameKey="name" innerRadius={45} outerRadius={75}>
                    {categoryBreakdown.map((entry, i) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="legend-list">
                {categoryBreakdown.map((entry, i) => (
                  <div key={entry.name} className="legend-row">
                    <span
                      className="legend-dot"
                      style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                    />
                    <span className="legend-name">{entry.name}</span>
                    <span className="legend-pct">{entry.pct}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="empty-note">{t("analytics.noAppUsage")}</p>
          )}
        </div>
      </div>

      <div className="section-block">
        <div className="section-title">{t("analytics.topWebsites")}</div>
        <div className="panel">
          {topWebsites.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("analytics.topWebsites")}</th>
                  <th>{t("analytics.category")}</th>
                  <th>{t("analytics.time")}</th>
                </tr>
              </thead>
              <tbody>
                {topWebsites.map((w) => (
                  <tr key={w.app_name}>
                    <td>{w.app_name}</td>
                    <td>{w.category}</td>
                    <td>{w.minutes} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-note">{t("analytics.noAppUsage")}</p>
          )}
        </div>
      </div>

      <div className="section-block">
        <div className="section-title">{t("analytics.weeklyTrend")}</div>
        <div className="panel">
          {weeklyLoading ? (
            <p className="empty-note">{t("common.loading")}</p>
          ) : weeklyChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyChart}>
                <XAxis dataKey="label" stroke="var(--text-muted)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="score" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="empty-note">{t("analytics.noDataYet")}</p>
          )}
          {weekly && (
            <div className="kv-grid" style={{ marginTop: 12 }}>
              <div>
                <span className="kv-key">{t("analytics.avgProductivity")}</span>
                <span className="kv-value">{weekly.average_productivity_score}</span>
              </div>
              <div>
                <span className="kv-key">{t("analytics.totalFocusMinutes")}</span>
                <span className="kv-value">{weekly.total_focus_minutes}</span>
              </div>
              <div>
                <span className="kv-key">{t("analytics.sessionsCompleted")}</span>
                <span className="kv-value">{weekly.total_completed_sessions}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="section-block">
        <div className="section-title">{t("analytics.monthlyTrend")}</div>
        <div className="panel">
          {monthlyLoading ? (
            <p className="empty-note">{t("common.loading")}</p>
          ) : monthlyChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyChart}>
                <XAxis dataKey="label" stroke="var(--text-muted)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="score" fill="var(--accent-soft)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="empty-note">{t("analytics.noDataYet")}</p>
          )}
          {monthly && (
            <div className="kv-grid" style={{ marginTop: 12 }}>
              <div>
                <span className="kv-key">{t("analytics.avgProductivity")}</span>
                <span className="kv-value">{monthly.average_productivity_score}</span>
              </div>
              <div>
                <span className="kv-key">{t("analytics.totalFocusMinutes")}</span>
                <span className="kv-value">{monthly.total_focus_minutes}</span>
              </div>
              <div>
                <span className="kv-key">{t("analytics.sessionsCompleted")}</span>
                <span className="kv-value">{monthly.total_completed_sessions}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
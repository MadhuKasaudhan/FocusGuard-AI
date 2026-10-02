import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  XCircle,
  Clock,
  Sparkles,
  Wand2,
  Globe,
  History,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

/* =========================================================
   GREETING
========================================================= */

function greetingForNow(t) {
  const hour = new Date().getHours();

  if (hour < 12) {
    return t("dashboard.greetingMorning");
  }

  if (hour < 17) {
    return t("dashboard.greetingAfternoon");
  }

  return t("dashboard.greetingEvening");
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [topApps, setTopApps] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [recommendation, setRecommendation] = useState(null);
  const [recLoading, setRecLoading] = useState(false);

  /* =======================================================
     LOAD DASHBOARD DATA
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const results = await Promise.all([
          api.get("/ai/daily-summary"),
          api.get("/analytics/daily"),
          api.get("/analytics/weekly").catch(() => null),
          api.get("/monitoring/app-usage").catch(() => null),
          api.get("/monitoring/focus-sessions").catch(() => null),
        ]);

        if (!mounted) return;

        const [
          summaryRes,
          dailyRes,
          weeklyRes,
          appsRes,
          sessionsRes,
        ] = results;

        setSummary(summaryRes?.data || null);
        setDaily(dailyRes?.data || null);

        if (weeklyRes) {
          setWeekly(weeklyRes.data || null);
        }

        if (appsRes) {
          setTopApps(
            Array.isArray(appsRes.data)
              ? appsRes.data
              : []
          );
        }

        if (sessionsRes) {
          setRecentSessions(
            Array.isArray(sessionsRes.data)
              ? sessionsRes.data
              : []
          );
        }
      } catch (err) {
        if (mounted) {
          setError(t("dashboard.failedLoad"));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [t]);

  /* =======================================================
     WEEKLY CHART DATA
  ======================================================= */

  const chartData = useMemo(() => {
    if (!weekly?.daily_breakdown) {
      return [];
    }

    if (!Array.isArray(weekly.daily_breakdown)) {
      return [];
    }

    return weekly.daily_breakdown.map((day) => ({
      day: new Date(day.date).toLocaleDateString(undefined, {
        weekday: "short",
      }),
      score: Number(day.daily_focus_score || 0),
    }));
  }, [weekly]);

  /* =======================================================
     TOP APPLICATIONS
  ======================================================= */

  const topAppsRanked = useMemo(() => {
    const totals = {};

    for (const entry of topApps) {
      if (!entry?.app_name) continue;

      const minutes = Number(entry.usage_minutes || 0);

      totals[entry.app_name] =
        (totals[entry.app_name] || 0) + minutes;
    }

    const ranked = Object.entries(totals)
      .map(([app_name, minutes]) => ({
        app_name,
        minutes,
      }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 5);

    const max = ranked[0]?.minutes || 1;

    return ranked.map((item) => ({
      ...item,
      pct: Math.round((item.minutes / max) * 100),
    }));
  }, [topApps]);

  /* =======================================================
     RECENT SESSIONS
  ======================================================= */

  const recentSessionsSorted = useMemo(() => {
    return [...recentSessions]
      .filter((session) => session?.started_at)
      .sort(
        (a, b) =>
          new Date(b.started_at) -
          new Date(a.started_at)
      )
      .slice(0, 5);
  }, [recentSessions]);

  /* =======================================================
     GENERATE AI RECOMMENDATION
  ======================================================= */

  async function handleGenerateRecommendation() {
    if (recLoading) return;

    setRecLoading(true);

    try {
      const { data } = await api.get(
        "/recommendation/focus-improvements"
      );

      setRecommendation(data);
    } catch (err) {
      setRecommendation({
        suggestions: [
          t("dashboard.recommendationFailed"),
        ],
      });
    } finally {
      setRecLoading(false);
    }
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <>
        <style>{dashboardStyles}</style>

        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>{t("common.loading")}</p>
        </div>
      </>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <>
        <style>{dashboardStyles}</style>

        <div className="dashboard-error">
          <XCircle size={42} />
          <h2>{t("dashboard.failedLoad")}</h2>
          <p>{error}</p>
        </div>
      </>
    );
  }

  /* =======================================================
     USER / DATE
  ======================================================= */

  const firstName =
    user?.name?.split(" ")[0] ||
    t("dashboard.helloGuest");

  const today = new Date().toLocaleDateString(
    undefined,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  /* =======================================================
     JSX
  ======================================================= */

  return (
    <>
      <style>{dashboardStyles}</style>

      <main className="dashboard-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="dashboard-header">
          <div>
            <h1>
              {greetingForNow(t)}, {firstName}
            </h1>

            <p className="dashboard-date">
              {today}
            </p>
          </div>
        </header>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="stats-grid">

          {/* Focus */}
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-icon green">
                <TrendingUp size={22} />
              </div>

              <div className="stat-information">
                <span className="stat-label">
                  {t("dashboard.focusMinutes")}
                </span>

                <strong className="stat-value">
                  {daily?.total_focus_minutes ?? 0}
                </strong>

                <span className="stat-description">
                  Focus time today
                </span>
              </div>
            </div>
          </div>

          {/* Distractions */}
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-icon red">
                <XCircle size={22} />
              </div>

              <div className="stat-information">
                <span className="stat-label">
                  {t("dashboard.distractions")}
                </span>

                <strong className="stat-value">
                  {daily?.distraction_frequency ?? 0}
                </strong>

                <span className="stat-description">
                  Distractions detected
                </span>
              </div>
            </div>
          </div>

          {/* Sessions */}
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-icon blue">
                <Clock size={22} />
              </div>

              <div className="stat-information">
                <span className="stat-label">
                  {t("dashboard.sessionsCompleted")}
                </span>

                <strong className="stat-value">
                  {daily?.completed_sessions ?? 0}
                </strong>

                <span className="stat-description">
                  Completed focus sessions
                </span>
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-icon purple">
                <Sparkles size={22} />
              </div>

              <div className="stat-information">
                <span className="stat-label">
                  {t("dashboard.overallScore")}
                </span>

                <strong className="stat-value">
                  {summary?.overall_score ?? "—"}
                </strong>

                <span className="stat-description">
                  Overall productivity score
                </span>
              </div>
            </div>
          </div>

        </section>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <section className="dashboard-two-column">

          {/* =================================================
              WEEKLY TREND
          ================================================= */}

          <div className="dashboard-panel weekly-panel">

            <div className="panel-header">
              <div>
                <h2>
                  <BarChart3 size={20} />
                  {t("dashboard.weeklyTrend")}
                </h2>

                <p>
                  Your focus score throughout the week
                </p>
              </div>
            </div>

            <div className="chart-container">

              {chartData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 15,
                      right: 10,
                      left: -20,
                      bottom: 5,
                    }}
                  >
                    <XAxis
                      dataKey="day"
                      stroke="var(--text-muted)"
                      tick={{
                        fontSize: 12,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      hide
                      domain={[0, "auto"]}
                    />

                    <Tooltip
                      cursor={{
                        fill: "rgba(99, 78, 220, 0.05)",
                      }}
                      contentStyle={{
                        background:
                          "var(--bg-card)",
                        border:
                          "1px solid var(--border)",
                        borderRadius: "10px",
                        fontSize: "12px",
                        boxShadow:
                          "0 8px 25px rgba(0,0,0,0.08)",
                      }}
                    />

                    <Bar
                      dataKey="score"
                      fill="var(--accent)"
                      radius={[
                        7,
                        7,
                        0,
                        0,
                      ]}
                      barSize={42}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">
                  <BarChart3 size={35} />
                  <p>
                    {t(
                      "dashboard.notEnoughData"
                    )}
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* =================================================
              AI COACH
          ================================================= */}

          <div className="dashboard-panel coach-panel">

            <div className="coach-header">
              <div className="coach-icon">
                <Wand2 size={22} />
              </div>

              <div>
                <h2>
                  {t("dashboard.aiCoach")}
                </h2>

                <p>
                  Personalized productivity guidance
                </p>
              </div>
            </div>

            <div className="coach-content">

              {recommendation ? (
                <div className="recommendation-content">
                  {Array.isArray(
                    recommendation.suggestions
                  ) ? (
                    recommendation.suggestions.map(
                      (suggestion, index) => (
                        <div
                          className="recommendation-item"
                          key={index}
                        >
                          <ReactMarkdown>
                            {suggestion}
                          </ReactMarkdown>
                        </div>
                      )
                    )
                  ) : (
                    <ReactMarkdown>
                      {String(
                        recommendation.suggestions ||
                          ""
                      )}
                    </ReactMarkdown>
                  )}
                </div>
              ) : (
                <div className="coach-empty">
                  <Sparkles size={34} />

                  <p>
                    {t(
                      "dashboard.recommendationPlaceholder"
                    )}
                  </p>
                </div>
              )}

            </div>

            <button
              className="primary-button full-button"
              onClick={
                handleGenerateRecommendation
              }
              disabled={recLoading}
            >
              <Wand2 size={17} />

              {recLoading
                ? t("common.generating")
                : t(
                    "dashboard.generateRecommendation"
                  )}
            </button>

          </div>

        </section>

        {/* =================================================
            LOWER GRID
        ================================================= */}

        <section className="dashboard-two-column">

          {/* =================================================
              TOP APPS
          ================================================= */}

          <div className="dashboard-panel">

            <div className="panel-header">
              <div>
                <h2>
                  <Globe size={19} />
                  {t("dashboard.topApps")}
                </h2>

                <p>
                  Applications using your time
                </p>
              </div>
            </div>

            {topAppsRanked.length > 0 ? (
              <div className="apps-list">

                {topAppsRanked.map((app, index) => (
                  <div
                    key={app.app_name}
                    className="app-row"
                  >

                    <div className="app-row-top">

                      <div className="app-name-wrapper">
                        <span className="app-rank">
                          {index + 1}
                        </span>

                        <span className="app-name">
                          {app.app_name}
                        </span>
                      </div>

                      <span className="app-minutes">
                        {app.minutes}m
                      </span>

                    </div>

                    <div className="app-progress">
                      <div
                        className="app-progress-fill"
                        style={{
                          width: `${app.pct}%`,
                        }}
                      />
                    </div>

                  </div>
                ))}

              </div>
            ) : (
              <div className="empty-state small">
                <Globe size={30} />

                <p>
                  {t("dashboard.noAppUsage")}
                </p>
              </div>
            )}

          </div>

          {/* =================================================
              RECENT SESSIONS
          ================================================= */}

          <div className="dashboard-panel">

            <div className="panel-header">
              <div>
                <h2>
                  <History size={19} />
                  {t("dashboard.recentSessions")}
                </h2>

                <p>
                  Your latest focus activity
                </p>
              </div>
            </div>

            {recentSessionsSorted.length > 0 ? (
              <div className="sessions-list">

                {recentSessionsSorted.map(
                  (session) => (
                    <div
                      key={session.id}
                      className="session-row"
                    >

                      <div className="session-left">

                        <div
                          className={`session-status ${
                            session.is_completed
                              ? "completed"
                              : "incomplete"
                          }`}
                        >
                          <Clock size={16} />
                        </div>

                        <div>
                          <div className="session-title">
                            {session.is_completed
                              ? t(
                                  "dashboard.completedSession"
                                )
                              : t(
                                  "dashboard.incompleteSession"
                                )}
                          </div>

                          <div className="session-time">
                            {new Date(
                              session.started_at
                            ).toLocaleString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute:
                                  "2-digit",
                              }
                            )}
                          </div>
                        </div>

                      </div>

                      <span className="session-duration">
                        {session.duration_minutes}m
                      </span>

                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="empty-state small">
                <History size={30} />

                <p>
                  {t(
                    "dashboard.noSessionsLogged"
                  )}
                </p>
              </div>
            )}

          </div>

        </section>

        {/* =================================================
            QUICK LINKS
        ================================================= */}

        <section className="quick-links-section">

          <Link
            to="/behavioral-analytics"
            className="quick-link"
          >
            <div className="quick-link-icon">
              <BarChart3 size={20} />
            </div>

            <div>
              <strong>
                {t(
                  "dashboard.fullBehavioralAnalysis"
                )}
              </strong>

              <span>
                View detailed behavioral analytics
              </span>
            </div>
          </Link>

          <Link
            to="/chatbot"
            className="quick-link"
          >
            <div className="quick-link-icon">
              <MessageCircle size={20} />
            </div>

            <div>
              <strong>
                {t("dashboard.askChatbot")}
              </strong>

              <span>
                Talk with your AI productivity assistant
              </span>
            </div>
          </Link>

        </section>

      </main>
    </>
  );
}

/* =========================================================
   DASHBOARD CSS
   Everything is kept in this same JSX file.
========================================================= */

const dashboardStyles = `

/* =========================================================
   ROOT VARIABLES
========================================================= */

.dashboard-page {
  --dashboard-bg: var(--bg-page, #f5f6fa);
  --dashboard-card: var(--bg-card, #ffffff);
  --dashboard-border: var(--border, #e3e5ec);
  --dashboard-text: var(--text, #111827);
  --dashboard-muted: var(--text-muted, #64748b);
  --dashboard-accent: var(--accent, #5b45d9);

  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 34px 50px;
  box-sizing: border-box;
  color: var(--dashboard-text);
}

/* =========================================================
   HEADER
========================================================= */

.dashboard-header {
  margin-bottom: 28px;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 30px;
  line-height: 1.25;
  font-weight: 750;
  letter-spacing: -0.5px;
  color: var(--dashboard-text);
}

.dashboard-date {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--dashboard-muted);
}

/* =========================================================
   STAT GRID
========================================================= */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 22px;
}

.stat-card {
  min-width: 0;
  background: var(--dashboard-card);
  border: 1px solid var(--dashboard-border);
  border-radius: 15px;
  padding: 20px;
  box-sizing: border-box;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 25px rgba(15, 23, 42, 0.06);
}

.stat-card-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.green {
  color: #16a34a;
  background: #ecfdf3;
}

.stat-icon.red {
  color: #dc2626;
  background: #fef2f2;
}

.stat-icon.blue {
  color: #2563eb;
  background: #eff6ff;
}

.stat-icon.purple {
  color: #634bdc;
  background: #f1edff;
}

.stat-information {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.stat-label {
  color: var(--dashboard-muted);
  font-size: 13px;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  line-height: 1.1;
  font-weight: 750;
  color: var(--dashboard-text);
}

.stat-description {
  margin-top: 5px;
  color: var(--dashboard-muted);
  font-size: 11px;
}

/* =========================================================
   TWO COLUMN LAYOUT
========================================================= */

.dashboard-two-column {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

/* =========================================================
   PANELS
========================================================= */

.dashboard-panel {
  min-width: 0;
  background: var(--dashboard-card);
  border: 1px solid var(--dashboard-border);
  border-radius: 15px;
  padding: 22px;
  box-sizing: border-box;
}

.weekly-panel {
  min-height: 390px;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
}

.panel-header h2 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 700;
  color: var(--dashboard-text);
}

.panel-header p {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--dashboard-muted);
}

/* =========================================================
   CHART
========================================================= */

.chart-container {
  width: 100%;
  height: 300px;
  min-width: 0;
}

.empty-state {
  width: 100%;
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--dashboard-muted);
  text-align: center;
}

.empty-state p {
  margin: 0;
  font-size: 13px;
}

.empty-state.small {
  min-height: 180px;
}

/* =========================================================
   AI COACH
========================================================= */

.coach-panel {
  display: flex;
  flex-direction: column;
  min-height: 390px;
}

.coach-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 17px;
  border-bottom: 1px solid var(--dashboard-border);
}

.coach-icon {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #634bdc;
  background: #f1edff;
}

.coach-header h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
}

.coach-header p {
  margin: 4px 0 0;
  color: var(--dashboard-muted);
  font-size: 12px;
}

.coach-content {
  flex: 1;
  padding: 20px 0;
}

.coach-empty {
  height: 100%;
  min-height: 170px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--dashboard-muted);
}

.coach-empty svg {
  color: var(--dashboard-accent);
  margin-bottom: 10px;
}

.coach-empty p {
  max-width: 280px;
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
}

.recommendation-content {
  font-size: 13px;
  line-height: 1.65;
}

.recommendation-item {
  padding: 11px 13px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #f8f7ff;
  border: 1px solid #ece9ff;
}

.recommendation-item p {
  margin: 0;
}

.recommendation-item:last-child {
  margin-bottom: 0;
}

/* =========================================================
   BUTTON
========================================================= */

.primary-button {
  border: none;
  outline: none;
  cursor: pointer;
  min-height: 42px;
  padding: 0 18px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--dashboard-accent);
  color: white;
  font-size: 13px;
  font-weight: 650;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.primary-button:hover:not(:disabled) {
  background: #4e39c7;
  transform: translateY(-1px);
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.full-button {
  width: 100%;
}

/* =========================================================
   APPS
========================================================= */

.apps-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 5px;
}

.app-row {
  width: 100%;
}

.app-row-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 8px;
}

.app-name-wrapper {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-rank {
  width: 25px;
  height: 25px;
  flex: 0 0 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  background: #f2f3f7;
  color: var(--dashboard-muted);
  font-size: 11px;
  font-weight: 700;
}

.app-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 600;
}

.app-minutes {
  flex: 0 0 auto;
  font-size: 12px;
  color: var(--dashboard-muted);
}

.app-progress {
  width: 100%;
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: #eef0f5;
}

.app-progress-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--dashboard-accent);
  transition: width 0.4s ease;
}

/* =========================================================
   SESSIONS
========================================================= */

.sessions-list {
  display: flex;
  flex-direction: column;
}

.session-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 14px 0;
  border-bottom: 1px solid var(--dashboard-border);
}

.session-row:first-child {
  padding-top: 5px;
}

.session-row:last-child {
  border-bottom: none;
}

.session-left {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 11px;
}

.session-status {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
}

.session-status.completed {
  color: #16a34a;
  background: #ecfdf3;
}

.session-status.incomplete {
  color: #f59e0b;
  background: #fffbeb;
}

.session-title {
  font-size: 13px;
  font-weight: 600;
}

.session-time {
  margin-top: 4px;
  color: var(--dashboard-muted);
  font-size: 11px;
}

.session-duration {
  flex: 0 0 auto;
  font-size: 13px;
  font-weight: 700;
}

/* =========================================================
   QUICK LINKS
========================================================= */

.quick-links-section {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 4px;
}

.quick-link {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: var(--dashboard-card);
  border: 1px solid var(--dashboard-border);
  border-radius: 14px;
  text-decoration: none;
  color: var(--dashboard-text);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.quick-link:hover {
  transform: translateY(-2px);
  border-color: #cfc8ff;
  box-shadow:
    0 8px 20px rgba(15, 23, 42, 0.06);
}

.quick-link-icon {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dashboard-accent);
  background: #f1edff;
  border-radius: 11px;
}

.quick-link strong {
  display: block;
  font-size: 13px;
}

.quick-link span {
  display: block;
  margin-top: 4px;
  color: var(--dashboard-muted);
  font-size: 11px;
}

/* =========================================================
   LOADING
========================================================= */

.dashboard-loading {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--dashboard-muted);
}

.dashboard-loading p {
  margin-top: 12px;
  font-size: 14px;
}

.loading-spinner {
  width: 35px;
  height: 35px;
  border: 3px solid #e5e7eb;
  border-top-color: var(--dashboard-accent);
  border-radius: 50%;
  animation: dashboardSpin 0.8s linear infinite;
}

@keyframes dashboardSpin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   ERROR
========================================================= */

.dashboard-error {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #dc2626;
}

.dashboard-error h2 {
  margin: 15px 0 5px;
}

.dashboard-error p {
  color: var(--dashboard-muted);
}

/* =========================================================
   RESPONSIVE - TABLET
========================================================= */

@media (max-width: 1050px) {

  .dashboard-page {
    padding: 28px 24px 40px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-two-column {
    grid-template-columns: 1fr;
  }

  .weekly-panel,
  .coach-panel {
    min-height: auto;
  }

}

/* =========================================================
   RESPONSIVE - MOBILE
========================================================= */

@media (max-width: 650px) {

  .dashboard-page {
    padding: 22px 15px 35px;
  }

  .dashboard-header h1 {
    font-size: 24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .dashboard-two-column {
    gap: 14px;
    margin-bottom: 14px;
  }

  .dashboard-panel {
    padding: 17px;
    border-radius: 12px;
  }

  .chart-container {
    height: 240px;
  }

  .quick-links-section {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .stat-card {
    padding: 17px;
  }

  .stat-value {
    font-size: 22px;
  }

}

/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 420px) {

  .dashboard-page {
    padding-left: 12px;
    padding-right: 12px;
  }

  .dashboard-header h1 {
    font-size: 21px;
  }

  .dashboard-date {
    font-size: 12px;
  }

  .panel-header h2 {
    font-size: 15px;
  }

  .stat-icon {
    width: 42px;
    height: 42px;
    flex-basis: 42px;
  }

}

`;
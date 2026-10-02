import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../hooks/useFetch";
import api from "../api/client";

const TABS = [
  {
    key: "focus-sessions",
    labelKey: "monitoring.focusSessions",
  },
  {
    key: "app-usage",
    labelKey: "monitoring.appUsage",
  },
  {
    key: "screen-time",
    labelKey: "monitoring.screenTime",
  },
  {
    key: "task-switches",
    labelKey: "monitoring.taskSwitches",
  },
  {
    key: "notifications",
    labelKey: "monitoring.notifications",
  },
];

function fmt(value) {
  if (value == null) return "—";

  if (
    typeof value === "string" &&
    value.match(/^\d{4}-\d{2}-\d{2}T/)
  ) {
    return new Date(value).toLocaleString();
  }

  return String(value);
}

export default function Monitoring() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("focus-sessions");

  const {
    data,
    loading,
    refetch,
  } = useFetch(`/monitoring/${activeTab}`);

  // Focus session form
  const [duration, setDuration] = useState(25);
  const [isCompleted, setIsCompleted] = useState(true);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // App usage form
  const [appName, setAppName] = useState("");
  const [category, setCategory] = useState("");
  const [usageMinutes, setUsageMinutes] = useState(15);
  const [appSubmitting, setAppSubmitting] = useState(false);

  // -----------------------------
  // Add Focus Session
  // -----------------------------
  async function handleAddSession(e) {
    e.preventDefault();

    setSubmitting(true);

    try {
      await api.post("/monitoring/focus-sessions", {
        duration_minutes: Number(duration),
        is_completed: isCompleted,
        notes: notes || null,
      });

      setNotes("");
      refetch();
    } catch (error) {
      console.error("Failed to add focus session:", error);
    } finally {
      setSubmitting(false);
    }
  }

  // -----------------------------
  // Add App Usage
  // -----------------------------
  async function handleAddAppUsage(e) {
    e.preventDefault();

    setAppSubmitting(true);

    try {
      await api.post("/monitoring/app-usage", {
        app_name: appName,
        category: category || null,
        usage_minutes: Number(usageMinutes),
      });

      setAppName("");
      setCategory("");

      refetch();
    } catch (error) {
      console.error("Failed to add app usage:", error);
    } finally {
      setAppSubmitting(false);
    }
  }

  const rows = Array.isArray(data) ? data : [];

  const columns =
    rows.length > 0
      ? Object.keys(rows[0]).filter((key) => key !== "user_id")
      : [];

  return (
    <>
      {/* =====================================================
          MONITORING PAGE
      ====================================================== */}

      <div className="monitoring-page">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="monitoring-header">
          <div>
            <h1>{t("monitoring.title")}</h1>

            <p>
              {t("monitoring.subtitle")}
            </p>
          </div>
        </div>

        {/* =====================================================
            TABS
        ====================================================== */}

        <div className="monitoring-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`monitoring-tab ${
                activeTab === tab.key
                  ? "monitoring-tab-active"
                  : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {/* =====================================================
            FOCUS SESSION FORM
        ====================================================== */}

        {activeTab === "focus-sessions" && (
          <form
            className="monitoring-form-card"
            onSubmit={handleAddSession}
          >
            <div className="monitoring-form-title">
              <h2>{t("monitoring.focusSessions")}</h2>

              <span>
                Log a new focus session
              </span>
            </div>

            <div className="monitoring-form-grid">

              {/* Duration */}
              <div className="monitoring-field">
                <label>
                  {t("monitoring.durationMinutes")}
                </label>

                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                  required
                />
              </div>

              {/* Notes */}
              <div className="monitoring-field monitoring-field-wide">
                <label>
                  {t("monitoring.notes")}
                </label>

                <input
                  type="text"
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder={t("common.optional")}
                />
              </div>

              {/* Completed */}
              <div className="monitoring-checkbox-field">
                <label>
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={(e) =>
                      setIsCompleted(e.target.checked)
                    }
                  />

                  <span>
                    {t("monitoring.completed")}
                  </span>
                </label>
              </div>

            </div>

            <div className="monitoring-form-actions">
              <button
                className="monitoring-primary-button"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? t("monitoring.adding")
                  : t("monitoring.logFocusSession")}
              </button>
            </div>
          </form>
        )}

        {/* =====================================================
            APP USAGE FORM
        ====================================================== */}

        {activeTab === "app-usage" && (
          <form
            className="monitoring-form-card"
            onSubmit={handleAddAppUsage}
          >
            <div className="monitoring-form-title">
              <h2>{t("monitoring.appUsage")}</h2>

              <span>
                Log application or website usage
              </span>
            </div>

            <div className="monitoring-form-grid">

              {/* App Name */}
              <div className="monitoring-field">
                <label>
                  {t("monitoring.appWebsiteName")}
                </label>

                <input
                  type="text"
                  value={appName}
                  onChange={(e) =>
                    setAppName(e.target.value)
                  }
                  placeholder={t(
                    "monitoring.exampleAppName"
                  )}
                  required
                />
              </div>

              {/* Category */}
              <div className="monitoring-field">
                <label>
                  {t("monitoring.category")}
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  placeholder={t(
                    "monitoring.exampleCategory"
                  )}
                />
              </div>

              {/* Minutes */}
              <div className="monitoring-field">
                <label>
                  {t("monitoring.minutes")}
                </label>

                <input
                  type="number"
                  min="1"
                  value={usageMinutes}
                  onChange={(e) =>
                    setUsageMinutes(e.target.value)
                  }
                  required
                />
              </div>

            </div>

            <div className="monitoring-form-actions">
              <button
                className="monitoring-primary-button"
                type="submit"
                disabled={appSubmitting}
              >
                {appSubmitting
                  ? t("monitoring.adding")
                  : t("monitoring.logAppUsage")}
              </button>
            </div>
          </form>
        )}

        {/* =====================================================
            DATA TABLE
        ====================================================== */}

        <div className="monitoring-table-card">

          <div className="monitoring-table-header">
            <div>
              <h2>
                {t(
                  activeTab === "focus-sessions"
                    ? "monitoring.focusSessions"
                    : activeTab === "app-usage"
                    ? "monitoring.appUsage"
                    : TABS.find(
                        (tab) => tab.key === activeTab
                      )?.labelKey || activeTab
                )}
              </h2>

              <p>
                {rows.length > 0
                  ? `${rows.length} entries`
                  : "No entries available"}
              </p>
            </div>
          </div>

          {loading ? (
            /* =========================
               LOADING
            ========================== */

            <div className="monitoring-empty-state">
              <div className="monitoring-loader"></div>

              <p>
                {t("common.loading")}
              </p>
            </div>
          ) : rows.length > 0 ? (
            /* =========================
               TABLE
            ========================== */

            <div className="monitoring-table-wrapper">
              <table className="monitoring-table">

                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column}>
                        {column
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (letter) =>
                            letter.toUpperCase()
                          )}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.slice(0, 30).map((row, index) => (
                    <tr
                      key={
                        row.id ??
                        row._id ??
                        index
                      }
                    >
                      {columns.map((column) => (
                        <td key={column}>

                          {typeof row[column] ===
                          "boolean"
                            ? row[column]
                              ? t("common.yes")
                              : t("common.no")
                            : fmt(row[column])}

                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          ) : (
            /* =========================
               EMPTY STATE
            ========================== */

            <div className="monitoring-empty-state">

              <div className="monitoring-empty-icon">
                📊
              </div>

              <h3>
                No data available
              </h3>

              <p>
                {t(
                  "monitoring.noEntriesLoggedYet"
                )}
              </p>

            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          MONITORING CSS
      ====================================================== */}

      <style>{`

        /* =====================================================
           PAGE
        ====================================================== */

        .monitoring-page {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 40px 50px;
          box-sizing: border-box;
          color: var(--text-color, #111827);
        }


        /* =====================================================
           HEADER
        ====================================================== */

        .monitoring-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .monitoring-header h1 {
          margin: 0;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 700;
          color: var(--text-color, #111827);
        }

        .monitoring-header p {
          margin: 8px 0 0;
          font-size: 15px;
          color: var(--secondary-text, #64748b);
        }


        /* =====================================================
           TABS
        ====================================================== */

        .monitoring-tabs {
          display: flex;
          align-items: center;
          gap: 6px;

          width: 100%;

          padding: 5px;

          margin-bottom: 18px;

          background: var(--card-color, #ffffff);

          border: 1px solid var(--border-color, #e5e7eb);

          border-radius: 12px;

          overflow-x: auto;

          box-sizing: border-box;
        }

        .monitoring-tab {
          flex-shrink: 0;

          padding: 10px 16px;

          border: none;
          border-radius: 8px;

          background: transparent;

          color: var(--secondary-text, #64748b);

          font-family: inherit;
          font-size: 14px;
          font-weight: 500;

          cursor: pointer;

          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .monitoring-tab:hover {
          background: rgba(91, 69, 217, 0.08);
          color: #5b45d9;
        }

        .monitoring-tab-active {
          background: #5b45d9 !important;
          color: #ffffff !important;
          font-weight: 600;
        }


        /* =====================================================
           FORM CARD
        ====================================================== */

        .monitoring-form-card {
          width: 100%;

          background: var(--card-color, #ffffff);

          border: 1px solid var(--border-color, #e5e7eb);

          border-radius: 14px;

          padding: 22px;

          margin-bottom: 20px;

          box-sizing: border-box;

          box-shadow:
            0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .monitoring-form-title {
          display: flex;
          align-items: baseline;
          gap: 12px;

          margin-bottom: 20px;
        }

        .monitoring-form-title h2 {
          margin: 0;

          color: var(--text-color, #111827);

          font-size: 17px;
          font-weight: 650;
        }

        .monitoring-form-title span {
          color: var(--secondary-text, #64748b);

          font-size: 13px;
        }


        /* =====================================================
           FORM GRID
        ====================================================== */

        .monitoring-form-grid {
          display: grid;

          grid-template-columns:
            minmax(180px, 1fr)
            minmax(180px, 1fr)
            minmax(150px, 1fr);

          gap: 16px;

          align-items: end;
        }

        .monitoring-field {
          display: flex;
          flex-direction: column;
          gap: 7px;

          min-width: 0;
        }

        .monitoring-field-wide {
          min-width: 0;
        }

        .monitoring-field label {
          color: var(--secondary-text, #64748b);

          font-size: 13px;
          font-weight: 600;
        }

        .monitoring-field input {
          width: 100%;
          height: 42px;

          padding: 0 12px;

          box-sizing: border-box;

          border: 1px solid var(--border-color, #dfe3ea);

          border-radius: 8px;

          background: var(--input-color, #ffffff);

          color: var(--text-color, #111827);

          font-family: inherit;
          font-size: 14px;

          outline: none;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .monitoring-field input::placeholder {
          color: #9ca3af;
        }

        .monitoring-field input:focus {
          border-color: #5b45d9;

          box-shadow:
            0 0 0 3px rgba(91, 69, 217, 0.12);
        }


        /* =====================================================
           CHECKBOX
        ====================================================== */

        .monitoring-checkbox-field {
          display: flex;
          align-items: center;

          min-height: 42px;
        }

        .monitoring-checkbox-field label {
          display: flex;
          align-items: center;

          gap: 8px;

          color: var(--text-color, #111827);

          font-size: 14px;

          cursor: pointer;
        }

        .monitoring-checkbox-field input {
          width: 16px;
          height: 16px;

          accent-color: #5b45d9;

          cursor: pointer;
        }


        /* =====================================================
           FORM ACTIONS
        ====================================================== */

        .monitoring-form-actions {
          display: flex;
          justify-content: flex-end;

          margin-top: 20px;
        }

        .monitoring-primary-button {
          min-height: 42px;

          padding: 0 18px;

          border: none;
          border-radius: 8px;

          background: #5b45d9;
          color: #ffffff;

          font-family: inherit;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.1s ease;
        }

        .monitoring-primary-button:hover {
          background: #4c38c8;
        }

        .monitoring-primary-button:active {
          transform: translateY(1px);
        }

        .monitoring-primary-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }


        /* =====================================================
           TABLE CARD
        ====================================================== */

        .monitoring-table-card {
          width: 100%;

          background: var(--card-color, #ffffff);

          border: 1px solid var(--border-color, #e5e7eb);

          border-radius: 14px;

          overflow: hidden;

          box-shadow:
            0 2px 8px rgba(15, 23, 42, 0.04);
        }


        /* =====================================================
           TABLE HEADER
        ====================================================== */

        .monitoring-table-header {
          display: flex;

          align-items: center;
          justify-content: space-between;

          padding: 20px 22px;

          border-bottom:
            1px solid var(--border-color, #e5e7eb);
        }

        .monitoring-table-header h2 {
          margin: 0;

          color: var(--text-color, #111827);

          font-size: 17px;
          font-weight: 650;
        }

        .monitoring-table-header p {
          margin: 4px 0 0;

          color: var(--secondary-text, #64748b);

          font-size: 12px;
        }


        /* =====================================================
           TABLE WRAPPER
        ====================================================== */

        .monitoring-table-wrapper {
          width: 100%;

          overflow-x: auto;
        }


        /* =====================================================
           TABLE
        ====================================================== */

        .monitoring-table {
          width: 100%;

          border-collapse: collapse;

          min-width: 700px;

          font-size: 13px;
        }

        .monitoring-table th {
          padding: 13px 16px;

          text-align: left;

          background:
            var(--bg-color, #f8fafc);

          color:
            var(--secondary-text, #64748b);

          font-size: 11px;

          font-weight: 650;

          text-transform: uppercase;

          letter-spacing: 0.04em;

          border-bottom:
            1px solid var(--border-color, #e5e7eb);

          white-space: nowrap;
        }

        .monitoring-table td {
          padding: 14px 16px;

          color:
            var(--text-color, #111827);

          border-bottom:
            1px solid var(--border-color, #e5e7eb);

          white-space: nowrap;
        }

        .monitoring-table tbody tr {
          transition:
            background 0.15s ease;
        }

        .monitoring-table tbody tr:hover {
          background:
            rgba(91, 69, 217, 0.035);
        }

        .monitoring-table tbody tr:last-child td {
          border-bottom: none;
        }


        /* =====================================================
           EMPTY STATE
        ====================================================== */

        .monitoring-empty-state {
          min-height: 260px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;

          padding: 30px;
        }

        .monitoring-empty-state p {
          margin: 8px 0 0;

          color:
            var(--secondary-text, #64748b);

          font-size: 14px;
        }

        .monitoring-empty-state h3 {
          margin: 10px 0 0;

          color:
            var(--text-color, #111827);

          font-size: 16px;
        }

        .monitoring-empty-icon {
          width: 48px;
          height: 48px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background:
            rgba(91, 69, 217, 0.1);

          font-size: 22px;
        }


        /* =====================================================
           LOADER
        ====================================================== */

        .monitoring-loader {
          width: 26px;
          height: 26px;

          border: 3px solid #e5e7eb;

          border-top-color: #5b45d9;

          border-radius: 50%;

          animation:
            monitoring-spin 0.8s linear infinite;

          margin-bottom: 12px;
        }

        @keyframes monitoring-spin {
          to {
            transform: rotate(360deg);
          }
        }


        /* =====================================================
           DARK MODE
        ====================================================== */

        .dark .monitoring-page {
          color: #f8fafc;
        }

        .dark .monitoring-header h1 {
          color: #f8fafc;
        }

        .dark .monitoring-header p {
          color: #94a3b8;
        }

        .dark .monitoring-tabs {
          background: #1f2937;
          border-color: #374151;
        }

        .dark .monitoring-tab {
          color: #94a3b8;
        }

        .dark .monitoring-tab:hover {
          background: rgba(167, 139, 250, 0.1);
          color: #a78bfa;
        }

        .dark .monitoring-form-card,
        .dark .monitoring-table-card {
          background: #1f2937;
          border-color: #374151;
        }

        .dark .monitoring-form-title h2,
        .dark .monitoring-table-header h2,
        .dark .monitoring-table td,
        .dark .monitoring-checkbox-field label {
          color: #f8fafc;
        }

        .dark .monitoring-form-title span,
        .dark .monitoring-field label,
        .dark .monitoring-table-header p {
          color: #94a3b8;
        }

        .dark .monitoring-field input {
          background: #111827;
          border-color: #374151;
          color: #f8fafc;
        }

        .dark .monitoring-field input:focus {
          border-color: #8b5cf6;
          box-shadow:
            0 0 0 3px rgba(139, 92, 246, 0.15);
        }

        .dark .monitoring-table th {
          background: #111827;
          color: #94a3b8;
          border-color: #374151;
        }

        .dark .monitoring-table td {
          border-color: #374151;
        }

        .dark .monitoring-table tbody tr:hover {
          background: rgba(139, 92, 246, 0.06);
        }

        .dark .monitoring-empty-state p {
          color: #94a3b8;
        }

        .dark .monitoring-empty-state h3 {
          color: #f8fafc;
        }


        /* =====================================================
           RESPONSIVE - TABLET
        ====================================================== */

        @media (max-width: 1000px) {

          .monitoring-page {
            padding: 28px 24px 40px;
          }

          .monitoring-form-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .monitoring-field-wide {
            grid-column: span 2;
          }

        }


        /* =====================================================
           RESPONSIVE - MOBILE
        ====================================================== */

        @media (max-width: 700px) {

          .monitoring-page {
            padding: 22px 16px 35px;
          }

          .monitoring-header h1 {
            font-size: 25px;
          }

          .monitoring-header p {
            font-size: 14px;
          }

          .monitoring-tabs {
            border-radius: 10px;
          }

          .monitoring-tab {
            padding: 9px 12px;
            font-size: 13px;
          }

          .monitoring-form-card {
            padding: 18px;
          }

          .monitoring-form-title {
            flex-direction: column;
            gap: 4px;
          }

          .monitoring-form-grid {
            grid-template-columns: 1fr;
          }

          .monitoring-field-wide {
            grid-column: auto;
          }

          .monitoring-form-actions {
            justify-content: stretch;
          }

          .monitoring-primary-button {
            width: 100%;
          }

          .monitoring-table-header {
            padding: 17px 18px;
          }

        }

      `}</style>
    </>
  );
}
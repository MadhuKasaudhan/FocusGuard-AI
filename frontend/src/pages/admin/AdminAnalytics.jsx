import React from "react";
import {
  BarChart3,
  Users,
  UserCheck,
  UserX,
  Activity,
  TrendingUp,
  Building2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function AdminAnalytics() {
  const { user } = useAuth();

  // =====================================================
  // DEMO / ANALYTICS DATA
  // Replace these values with API data later
  // =====================================================

  const analytics = {
    managedUsers: 8,
    activeUsers: 7,
    inactiveUsers: 1,
    activeSessions: 15,

    weeklyActivity: [
      { day: "Mon", value: 55 },
      { day: "Tue", value: 72 },
      { day: "Wed", value: 48 },
      { day: "Thu", value: 82 },
      { day: "Fri", value: 67 },
      { day: "Sat", value: 40 },
      { day: "Sun", value: 58 },
    ],

    userDistribution: {
      active: 7,
      inactive: 1,
    },
  };

  const activePercentage =
    analytics.managedUsers > 0
      ? Math.round(
          (analytics.activeUsers / analytics.managedUsers) * 100
        )
      : 0;

  const inactivePercentage =
    analytics.managedUsers > 0
      ? Math.round(
          (analytics.inactiveUsers / analytics.managedUsers) * 100
        )
      : 0;

  const maxActivity = Math.max(
    ...analytics.weeklyActivity.map((item) => item.value)
  );

  const firstName = user?.name || "Sub Admin";

  return (
    <>
      {/* =====================================================
          ANALYTICS PAGE
      ===================================================== */}

      <div className="admin-analytics-page">

        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="analytics-header">

          <div className="analytics-header-left">

            <div className="analytics-header-icon">
              <BarChart3 size={26} />
            </div>

            <div>
              <div className="analytics-eyebrow">
                ADMIN ANALYTICS
              </div>

              <h1>
                Organization Analytics
              </h1>

              <p>
                Monitor users, sessions and productivity
                across your organization.
              </p>
            </div>

          </div>


          <div className="analytics-live">

            <span className="live-dot"></span>

            <Activity size={16} />

            <span>
              Live data
            </span>

          </div>

        </div>


        {/* ===================================================
            WELCOME / USER INFO
        =================================================== */}

        <div className="analytics-welcome">

          <div>
            <strong>
              Welcome, {firstName}
            </strong>

            <span>
              Here is your organization's latest activity overview.
            </span>
          </div>

          <div className="analytics-date">
            Last 7 days
          </div>

        </div>


        {/* ===================================================
            STAT CARDS
        =================================================== */}

        <div className="analytics-stat-grid">

          {/* MANAGED USERS */}

          <div className="analytics-stat-card">

            <div className="stat-top">

              <div className="stat-icon stat-blue">
                <Users size={22} />
              </div>

              <span className="stat-change positive">
                +12%
              </span>

            </div>

            <div className="stat-number">
              {analytics.managedUsers}
            </div>

            <div className="stat-title">
              Managed Users
            </div>

            <div className="stat-description">
              Users under your organization
            </div>

          </div>


          {/* ACTIVE USERS */}

          <div className="analytics-stat-card">

            <div className="stat-top">

              <div className="stat-icon stat-green">
                <UserCheck size={22} />
              </div>

              <span className="stat-change positive">
                +8%
              </span>

            </div>

            <div className="stat-number">
              {analytics.activeUsers}
            </div>

            <div className="stat-title">
              Active Users
            </div>

            <div className="stat-description">
              Currently active
            </div>

          </div>


          {/* INACTIVE USERS */}

          <div className="analytics-stat-card">

            <div className="stat-top">

              <div className="stat-icon stat-red">
                <UserX size={22} />
              </div>

              <span className="stat-change negative">
                -4%
              </span>

            </div>

            <div className="stat-number">
              {analytics.inactiveUsers}
            </div>

            <div className="stat-title">
              Inactive Users
            </div>

            <div className="stat-description">
              Requires attention
            </div>

          </div>


          {/* ACTIVE SESSIONS */}

          <div className="analytics-stat-card">

            <div className="stat-top">

              <div className="stat-icon stat-orange">
                <Activity size={22} />
              </div>

              <span className="stat-change positive">
                +18%
              </span>

            </div>

            <div className="stat-number">
              {analytics.activeSessions}
            </div>

            <div className="stat-title">
              Active Sessions
            </div>

            <div className="stat-description">
              Current focus sessions
            </div>

          </div>

        </div>


        {/* ===================================================
            MAIN ANALYTICS GRID
        =================================================== */}

        <div className="analytics-main-grid">

          {/* =================================================
              WEEKLY USER ACTIVITY
          ================================================= */}

          <section className="analytics-card weekly-card">

            <div className="analytics-card-header">

              <div>

                <h2>
                  Weekly User Activity
                </h2>

                <p>
                  User activity during the last 7 days
                </p>

              </div>

              <div className="card-header-icon">
                <TrendingUp size={21} />
              </div>

            </div>


            {/* CHART */}

            <div className="weekly-chart">

              {analytics.weeklyActivity.map(
                (item, index) => {

                  const height =
                    (item.value / maxActivity) * 100;

                  return (
                    <div
                      className="chart-column"
                      key={item.day}
                    >

                      <div className="chart-value">
                        {item.value}
                      </div>

                      <div className="chart-bar-container">

                        <div
                          className="chart-bar"
                          style={{
                            height: `${height}%`,
                          }}
                        ></div>

                      </div>

                      <div className="chart-day">
                        {item.day}
                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </section>


          {/* =================================================
              USER DISTRIBUTION
          ================================================= */}

          <section className="analytics-card distribution-card">

            <div className="analytics-card-header">

              <div>

                <h2>
                  User Distribution
                </h2>

                <p>
                  Current organization users
                </p>

              </div>

              <div className="card-header-icon">
                <Users size={21} />
              </div>

            </div>


            {/* ACTIVE USERS */}

            <div className="distribution-item">

              <div className="distribution-label">

                <span className="distribution-name">

                  <span className="legend-dot green-dot"></span>

                  Active Users

                </span>

                <strong>
                  {analytics.activeUsers}
                </strong>

              </div>


              <div className="distribution-progress">

                <div
                  className="distribution-progress-green"
                  style={{
                    width: `${activePercentage}%`,
                  }}
                ></div>

              </div>

              <div className="distribution-percentage">
                {activePercentage}%
              </div>

            </div>


            {/* INACTIVE USERS */}

            <div className="distribution-item">

              <div className="distribution-label">

                <span className="distribution-name">

                  <span className="legend-dot red-dot"></span>

                  Inactive Users

                </span>

                <strong>
                  {analytics.inactiveUsers}
                </strong>

              </div>


              <div className="distribution-progress">

                <div
                  className="distribution-progress-red"
                  style={{
                    width: `${inactivePercentage}%`,
                  }}
                ></div>

              </div>

              <div className="distribution-percentage">
                {inactivePercentage}%
              </div>

            </div>


            {/* TOTAL */}

            <div className="distribution-total">

              <span>
                Total Managed Users
              </span>

              <strong>
                {analytics.managedUsers}
              </strong>

            </div>

          </section>

        </div>


        {/* ===================================================
            ORGANIZATION OVERVIEW
        =================================================== */}

        <section className="analytics-card organization-card">

          <div className="analytics-card-header">

            <div>

              <h2>
                Organization Overview
              </h2>

              <p>
                Current organization status and activity.
              </p>

            </div>

            <div className="card-header-icon">
              <Building2 size={21} />
            </div>

          </div>


          <div className="organization-content">

            {/* ORGANIZATION */}

            <div className="organization-info">

              <div className="organization-icon">
                <Building2 size={28} />
              </div>

              <div>

                <h3>
                  FocusGuard Organization
                </h3>

                <p>
                  Your assigned organization
                </p>

                <div className="organization-status">

                  <span></span>

                  Active

                </div>

              </div>

            </div>


            {/* ORGANIZATION STATS */}

            <div className="organization-stats">

              <div className="organization-stat">

                <strong>
                  {analytics.managedUsers}
                </strong>

                <span>
                  Total Users
                </span>

              </div>


              <div className="organization-stat">

                <strong>
                  {analytics.activeSessions}
                </strong>

                <span>
                  Active Sessions
                </span>

              </div>


              <div className="organization-stat">

                <strong>
                  {analytics.activeUsers}
                </strong>

                <span>
                  Active Users
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            PRODUCTIVITY SUMMARY
        =================================================== */}

        <section className="analytics-card productivity-card">

          <div className="analytics-card-header">

            <div>

              <h2>
                Productivity Summary
              </h2>

              <p>
                Overall activity status of your organization.
              </p>

            </div>

            <div className="productivity-score">
              {activePercentage}%
            </div>

          </div>


          <div className="productivity-progress">

            <div
              className="productivity-progress-fill"
              style={{
                width: `${activePercentage}%`,
              }}
            ></div>

          </div>


          <div className="productivity-footer">

            <span>
              Active user availability
            </span>

            <strong>
              {analytics.activeUsers} /{" "}
              {analytics.managedUsers}
            </strong>

          </div>

        </section>

      </div>


      {/* =====================================================
          PAGE CSS
      ===================================================== */}

      <style>{`

        /* ===================================================
           PAGE
        =================================================== */

        .admin-analytics-page {
          width: 100%;
          max-width: 1450px;
          margin: 0 auto;
          padding: 30px 34px 50px;
          box-sizing: border-box;
        }


        /* ===================================================
           HEADER
        =================================================== */

        .analytics-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .analytics-header-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .analytics-header-icon {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0ebff;
          color: #6846e8;
          flex-shrink: 0;
        }

        .analytics-eyebrow {
          color: #6846e8;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }

        .analytics-header h1 {
          margin: 0;
          font-size: 30px;
          line-height: 1.2;
          color: #101828;
          font-weight: 750;
        }

        .analytics-header p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 15px;
        }

        .analytics-live {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 15px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #059669;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
        }


        /* ===================================================
           WELCOME
        =================================================== */

        .analytics-welcome {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .analytics-welcome strong {
          display: block;
          color: #111827;
          font-size: 18px;
          margin-bottom: 4px;
        }

        .analytics-welcome span {
          color: #64748b;
          font-size: 14px;
        }

        .analytics-date {
          color: #6846e8;
          background: #f3efff;
          border-radius: 8px;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 700;
        }


        /* ===================================================
           STAT GRID
        =================================================== */

        .analytics-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .analytics-stat-card {
          min-height: 180px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px;
          box-sizing: border-box;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .analytics-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.07);
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .stat-icon {
          width: 46px;
          height: 46px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-blue {
          background: #eaf2ff;
          color: #2563eb;
        }

        .stat-green {
          background: #e8f9ef;
          color: #16a34a;
        }

        .stat-red {
          background: #ffeded;
          color: #dc2626;
        }

        .stat-orange {
          background: #fff2e8;
          color: #f97316;
        }

        .stat-change {
          font-size: 12px;
          font-weight: 800;
        }

        .positive {
          color: #16a34a;
        }

        .negative {
          color: #dc2626;
        }

        .stat-number {
          color: #0f172a;
          font-size: 31px;
          line-height: 1;
          font-weight: 750;
          margin-bottom: 8px;
        }

        .stat-title {
          color: #111827;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .stat-description {
          color: #94a3b8;
          font-size: 12px;
          line-height: 1.4;
        }


        /* ===================================================
           MAIN GRID
        =================================================== */

        .analytics-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.65fr) minmax(300px, 0.9fr);
          gap: 20px;
          margin-bottom: 20px;
        }

        .analytics-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
          box-sizing: border-box;
        }

        .analytics-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding: 22px 22px 0;
        }

        .analytics-card-header h2 {
          margin: 0;
          color: #111827;
          font-size: 17px;
          font-weight: 750;
        }

        .analytics-card-header p {
          margin: 6px 0 0;
          color: #94a3b8;
          font-size: 13px;
        }

        .card-header-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6846e8;
        }


        /* ===================================================
           WEEKLY CHART
        =================================================== */

        .weekly-card {
          min-height: 370px;
        }

        .weekly-chart {
          height: 250px;
          padding: 30px 28px 15px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 14px;
        }

        .chart-column {
          height: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          min-width: 35px;
        }

        .chart-value {
          color: #64748b;
          font-size: 11px;
          margin-bottom: 7px;
          font-weight: 600;
        }

        .chart-bar-container {
          height: 175px;
          width: 100%;
          max-width: 52px;
          background: #edf1f7;
          border-radius: 9px 9px 5px 5px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .chart-bar {
          width: 100%;
          min-height: 5px;
          background: #6846e8;
          border-radius: 9px 9px 4px 4px;
          transition: height 0.3s ease;
        }

        .chart-bar:hover {
          background: #5938d6;
        }

        .chart-day {
          color: #94a3b8;
          font-size: 11px;
          margin-top: 9px;
        }


        /* ===================================================
           DISTRIBUTION
        =================================================== */

        .distribution-card {
          min-height: 370px;
        }

        .distribution-item {
          padding: 22px 22px 0;
        }

        .distribution-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 9px;
        }

        .distribution-name {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #334155;
          font-size: 13px;
        }

        .distribution-label strong {
          color: #111827;
          font-size: 14px;
        }

        .legend-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .green-dot {
          background: #16a34a;
        }

        .red-dot {
          background: #dc2626;
        }

        .distribution-progress {
          width: 100%;
          height: 8px;
          background: #edf1f5;
          border-radius: 999px;
          overflow: hidden;
        }

        .distribution-progress-green {
          height: 100%;
          background: #16a34a;
          border-radius: 999px;
        }

        .distribution-progress-red {
          height: 100%;
          background: #dc2626;
          border-radius: 999px;
        }

        .distribution-percentage {
          color: #94a3b8;
          text-align: right;
          font-size: 11px;
          margin-top: 5px;
        }

        .distribution-total {
          margin: 30px 22px 0;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .distribution-total span {
          color: #64748b;
          font-size: 13px;
        }

        .distribution-total strong {
          color: #111827;
          font-size: 18px;
        }


        /* ===================================================
           ORGANIZATION
        =================================================== */

        .organization-card {
          margin-bottom: 20px;
          padding-bottom: 22px;
        }

        .organization-content {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 20px;
          padding: 22px;
        }

        .organization-info {
          display: flex;
          align-items: center;
          gap: 17px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #f8fafc;
        }

        .organization-icon {
          width: 56px;
          height: 56px;
          flex-shrink: 0;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0891b2;
          background: #dff8fd;
        }

        .organization-info h3 {
          margin: 0 0 5px;
          color: #111827;
          font-size: 16px;
        }

        .organization-info p {
          margin: 0 0 9px;
          color: #64748b;
          font-size: 13px;
        }

        .organization-status {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #16a34a;
          font-size: 12px;
          font-weight: 700;
        }

        .organization-status span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #16a34a;
        }

        .organization-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .organization-stat {
          min-height: 110px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #ffffff;
        }

        .organization-stat strong {
          color: #111827;
          font-size: 23px;
          margin-bottom: 7px;
        }

        .organization-stat span {
          color: #94a3b8;
          font-size: 11px;
          text-align: center;
        }


        /* ===================================================
           PRODUCTIVITY
        =================================================== */

        .productivity-card {
          padding-bottom: 22px;
        }

        .productivity-score {
          color: #6846e8;
          font-size: 22px;
          font-weight: 800;
        }

        .productivity-progress {
          height: 11px;
          margin: 24px 22px 0;
          background: #eeeef7;
          border-radius: 999px;
          overflow: hidden;
        }

        .productivity-progress-fill {
          height: 100%;
          background: #6846e8;
          border-radius: 999px;
          transition: width 0.4s ease;
        }

        .productivity-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 10px 22px 0;
          color: #94a3b8;
          font-size: 12px;
        }

        .productivity-footer strong {
          color: #475569;
        }


        /* ===================================================
           DARK MODE
           Works with body.dark / html.dark / data-theme
        =================================================== */

        body.dark .admin-analytics-page,
        [data-theme="dark"] .admin-analytics-page {
          color: #e5e7eb;
        }

        body.dark .analytics-stat-card,
        body.dark .analytics-card,
        [data-theme="dark"] .analytics-stat-card,
        [data-theme="dark"] .analytics-card {
          background: #111827;
          border-color: #263244;
          box-shadow: none;
        }

        body.dark .analytics-header h1,
        body.dark .analytics-welcome strong,
        body.dark .analytics-card-header h2,
        body.dark .stat-number,
        body.dark .stat-title,
        body.dark .distribution-label strong,
        body.dark .distribution-total strong,
        body.dark .organization-info h3,
        body.dark .organization-stat strong,
        [data-theme="dark"] .analytics-header h1,
        [data-theme="dark"] .analytics-welcome strong,
        [data-theme="dark"] .analytics-card-header h2,
        [data-theme="dark"] .stat-number,
        [data-theme="dark"] .stat-title,
        [data-theme="dark"] .distribution-label strong,
        [data-theme="dark"] .distribution-total strong,
        [data-theme="dark"] .organization-info h3,
        [data-theme="dark"] .organization-stat strong {
          color: #f8fafc;
        }

        body.dark .analytics-header p,
        body.dark .analytics-welcome span,
        body.dark .analytics-card-header p,
        body.dark .stat-description,
        body.dark .distribution-name,
        body.dark .distribution-total span,
        body.dark .organization-info p,
        body.dark .organization-stat span,
        [data-theme="dark"] .analytics-header p,
        [data-theme="dark"] .analytics-welcome span,
        [data-theme="dark"] .analytics-card-header p,
        [data-theme="dark"] .stat-description,
        [data-theme="dark"] .distribution-name,
        [data-theme="dark"] .distribution-total span,
        [data-theme="dark"] .organization-info p,
        [data-theme="dark"] .organization-stat span {
          color: #94a3b8;
        }

        body.dark .organization-info,
        [data-theme="dark"] .organization-info {
          background: #172033;
          border-color: #263244;
        }

        body.dark .organization-stat,
        [data-theme="dark"] .organization-stat {
          background: #111827;
          border-color: #263244;
        }

        body.dark .distribution-total,
        [data-theme="dark"] .distribution-total {
          border-color: #263244;
        }

        body.dark .chart-bar-container,
        [data-theme="dark"] .chart-bar-container {
          background: #202b3d;
        }

        body.dark .distribution-progress,
        [data-theme="dark"] .distribution-progress {
          background: #202b3d;
        }


        /* ===================================================
           RESPONSIVE
        =================================================== */

        @media (max-width: 1200px) {

          .analytics-stat-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .analytics-main-grid {
            grid-template-columns: 1fr;
          }

          .organization-content {
            grid-template-columns: 1fr;
          }

        }


        @media (max-width: 768px) {

          .admin-analytics-page {
            padding: 20px 16px 40px;
          }

          .analytics-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .analytics-header-left {
            align-items: flex-start;
          }

          .analytics-header h1 {
            font-size: 25px;
          }

          .analytics-welcome {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }

          .analytics-stat-grid {
            grid-template-columns: 1fr;
          }

          .organization-stats {
            grid-template-columns: 1fr;
          }

          .weekly-chart {
            padding-left: 10px;
            padding-right: 10px;
            gap: 7px;
          }

          .chart-bar-container {
            max-width: 35px;
          }

        }


        @media (max-width: 500px) {

          .analytics-header-left {
            gap: 12px;
          }

          .analytics-header-icon {
            width: 48px;
            height: 48px;
          }

          .analytics-header h1 {
            font-size: 22px;
          }

          .analytics-live {
            align-self: flex-start;
          }

          .weekly-chart {
            height: 220px;
          }

          .chart-bar-container {
            height: 145px;
          }

        }

      `}</style>
    </>
  );
}
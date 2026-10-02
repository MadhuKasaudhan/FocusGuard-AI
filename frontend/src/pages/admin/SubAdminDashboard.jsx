import { Link } from "react-router-dom";
import {
  Users,
  Building2,
  UserCheck,
  UserX,
  Activity,
  BarChart3,
  UserPlus,
  Clock,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CircleCheck,
  CircleAlert,
} from "lucide-react";

export default function SubAdminDashboard() {
  // =====================================================
  // DASHBOARD STATISTICS
  // =====================================================

  const stats = [
    {
      title: "Managed Users",
      value: 8,
      icon: Users,
      className: "blue",
      description: "Users under your organization",
    },
    {
      title: "Active Users",
      value: 7,
      icon: UserCheck,
      className: "green",
      description: "Currently active",
    },
    {
      title: "Inactive Users",
      value: 1,
      icon: UserX,
      className: "red",
      description: "Currently inactive",
    },
    {
      title: "Organization",
      value: 1,
      icon: Building2,
      className: "cyan",
      description: "Assigned organization",
    },
    {
      title: "Active Sessions",
      value: 15,
      icon: Activity,
      className: "orange",
      description: "Current focus sessions",
    },
    {
      title: "Reports",
      value: 24,
      icon: BarChart3,
      className: "purple",
      description: "Available reports",
    },
  ];

  // =====================================================
  // RECENT USER ACTIVITY
  // =====================================================

  const recentActivity = [
    {
      name: "Rahul Sharma",
      email: "rahul@test.com",
      activity: "Completed Focus Session",
      time: "5 minutes ago",
      status: "Completed",
      type: "success",
    },
    {
      name: "Priya Singh",
      email: "priya@test.com",
      activity: "Started Focus Session",
      time: "18 minutes ago",
      status: "Active",
      type: "active",
    },
    {
      name: "Amit Kumar",
      email: "amit@test.com",
      activity: "Session interrupted",
      time: "35 minutes ago",
      status: "Attention",
      type: "warning",
    },
    {
      name: "Sneha Verma",
      email: "sneha@test.com",
      activity: "Completed Focus Session",
      time: "1 hour ago",
      status: "Completed",
      type: "success",
    },
    {
      name: "Vikas Yadav",
      email: "vikas@test.com",
      activity: "Logged in",
      time: "2 hours ago",
      status: "Active",
      type: "active",
    },
  ];

  // =====================================================
  // USER ACTIVITY DATA
  // =====================================================

  const activeUsers = 7;
  const inactiveUsers = 1;
  const totalUsers = activeUsers + inactiveUsers;

  const activePercentage =
    totalUsers > 0
      ? Math.round((activeUsers / totalUsers) * 100)
      : 0;

  const inactivePercentage =
    totalUsers > 0
      ? Math.round((inactiveUsers / totalUsers) * 100)
      : 0;

  return (
    <>
      {/* =================================================
          PAGE
      ================================================= */}

      <div className="subadmin-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="subadmin-header">

          <div>
            <div className="subadmin-title-row">
              <div className="subadmin-title-icon">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h1>Sub Admin Dashboard</h1>

                <p>
                  Manage your organization, monitor users, and
                  track productivity activity.
                </p>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <Link
              to="/admin/users"
              className="header-button secondary"
            >
              <Users size={17} />
              Manage Users
            </Link>

            <Link
              to="/admin/invite"
              className="header-button primary"
            >
              <UserPlus size={17} />
              Invite User
            </Link>
          </div>

        </div>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="subadmin-stats-grid">

          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                className="subadmin-stat-card"
                key={item.title}
              >

                <div className="stat-card-content">

                  <div>
                    <p className="stat-title">
                      {item.title}
                    </p>

                    <h2 className="stat-value">
                      {item.value}
                    </h2>

                    <span className="stat-description">
                      {item.description}
                    </span>
                  </div>

                  <div
                    className={`stat-icon ${item.className}`}
                  >
                    <Icon size={23} />
                  </div>

                </div>

              </div>
            );
          })}

        </div>


        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="dashboard-main-grid">

          {/* ===============================================
              USER ACTIVITY
          =============================================== */}

          <section className="dashboard-section user-activity-section">

            <div className="section-header">

              <div>
                <h2>User Activity</h2>

                <p>
                  Overview of users in your organization.
                </p>
              </div>

              <Link
                to="/admin/users"
                className="view-link"
              >
                View Users
                <ArrowRight size={16} />
              </Link>

            </div>


            {/* User activity numbers */}

            <div className="activity-overview">

              <div className="activity-item">

                <div className="activity-icon green">
                  <UserCheck size={20} />
                </div>

                <div className="activity-info">
                  <strong>{activeUsers}</strong>
                  <span>Active Users</span>
                </div>

                <div className="activity-percentage green-text">
                  {activePercentage}%
                </div>

              </div>


              <div className="activity-item">

                <div className="activity-icon red">
                  <UserX size={20} />
                </div>

                <div className="activity-info">
                  <strong>{inactiveUsers}</strong>
                  <span>Inactive Users</span>
                </div>

                <div className="activity-percentage red-text">
                  {inactivePercentage}%
                </div>

              </div>

            </div>


            {/* Active users progress */}

            <div className="progress-container">

              <div className="progress-header">
                <span>User availability</span>

                <strong>
                  {activeUsers}/{totalUsers}
                </strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${activePercentage}%`,
                  }}
                />
              </div>

              <div className="progress-labels">
                <span>
                  <CircleCheck size={13} />
                  Active
                </span>

                <span>
                  <CircleAlert size={13} />
                  Inactive
                </span>
              </div>

            </div>

          </section>


          {/* ===============================================
              ORGANIZATION SUMMARY
          =============================================== */}

          <section className="dashboard-section organization-section">

            <div className="section-header">

              <div>
                <h2>Organization</h2>

                <p>
                  Current organization overview.
                </p>
              </div>

              <Building2 size={22} className="section-icon" />

            </div>


            <div className="organization-card">

              <div className="organization-logo">
                <Building2 size={27} />
              </div>

              <div className="organization-info">

                <h3>FocusGuard Organization</h3>

                <p>
                  Your assigned organization
                </p>

                <span className="organization-status">
                  <span className="status-dot" />
                  Active
                </span>

              </div>

            </div>


            <div className="organization-stats">

              <div>
                <strong>8</strong>
                <span>Total Users</span>
              </div>

              <div>
                <strong>15</strong>
                <span>Active Sessions</span>
              </div>

              <div>
                <strong>24</strong>
                <span>Reports</span>
              </div>

            </div>


            <Link
              to="/admin/organizations"
              className="organization-button"
            >
              View Organization
              <ArrowRight size={16} />
            </Link>

          </section>

        </div>


        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>Quick Actions</h2>

              <p>
                Frequently used administration tools.
              </p>
            </div>

          </div>


          <div className="quick-action-grid">

            <Link
              to="/admin/users"
              className="quick-action-card"
            >
              <div className="quick-action-icon blue">
                <Users size={21} />
              </div>

              <div>
                <strong>Manage Users</strong>
                <span>
                  View and manage organization users
                </span>
              </div>

              <ArrowRight size={17} />
            </Link>


            <Link
              to="/admin/invite"
              className="quick-action-card"
            >
              <div className="quick-action-icon green">
                <UserPlus size={21} />
              </div>

              <div>
                <strong>Invite User</strong>
                <span>
                  Add a new user to the organization
                </span>
              </div>

              <ArrowRight size={17} />
            </Link>


            <Link
              to="/admin/analytics"
              className="quick-action-card"
            >
              <div className="quick-action-icon purple">
                <BarChart3 size={21} />
              </div>

              <div>
                <strong>Analytics</strong>
                <span>
                  View organization productivity analytics
                </span>
              </div>

              <ArrowRight size={17} />
            </Link>


            <Link
              to="/monitoring"
              className="quick-action-card"
            >
              <div className="quick-action-icon orange">
                <Activity size={21} />
              </div>

              <div>
                <strong>Monitoring</strong>
                <span>
                  Monitor focus sessions and activity
                </span>
              </div>

              <ArrowRight size={17} />
            </Link>

          </div>

        </section>


        {/* =================================================
            RECENT ACTIVITY
        ================================================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>Recent User Activity</h2>

              <p>
                Latest activity from your organization users.
              </p>
            </div>

            <div className="live-indicator">
              <span />
              Live
            </div>

          </div>


          <div className="activity-table-wrapper">

            <table className="activity-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Activity</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {recentActivity.map((item, index) => (

                  <tr key={index}>

                    <td>

                      <div className="table-user">

                        <div className="table-avatar">
                          {item.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {item.name}
                          </strong>

                          <span>
                            {item.email}
                          </span>
                        </div>

                      </div>

                    </td>


                    <td>

                      <div className="table-activity">

                        <Activity size={15} />

                        {item.activity}

                      </div>

                    </td>


                    <td>

                      <div className="activity-time">

                        <Clock size={14} />

                        {item.time}

                      </div>

                    </td>


                    <td>

                      <span
                        className={`activity-status ${item.type}`}
                      >
                        {item.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>


        {/* =================================================
            PRODUCTIVITY SUMMARY
        ================================================= */}

        <section className="dashboard-section productivity-section">

          <div className="section-header">

            <div>
              <h2>Productivity Overview</h2>

              <p>
                Current focus and session performance.
              </p>
            </div>

            <TrendingUp size={22} className="trending-icon" />

          </div>


          <div className="productivity-grid">

            <div className="productivity-card">

              <div className="productivity-card-header">
                <span>Focus Sessions</span>
                <Activity size={18} />
              </div>

              <strong>15</strong>

              <p>
                Active sessions currently running
              </p>

            </div>


            <div className="productivity-card">

              <div className="productivity-card-header">
                <span>Completed Sessions</span>
                <CircleCheck size={18} />
              </div>

              <strong>12</strong>

              <p>
                Sessions completed today
              </p>

            </div>


            <div className="productivity-card">

              <div className="productivity-card-header">
                <span>Reports Generated</span>
                <BarChart3 size={18} />
              </div>

              <strong>24</strong>

              <p>
                Organization reports available
              </p>

            </div>

          </div>

        </section>

      </div>


      {/* =================================================
          CSS
      ================================================= */}

      <style>{`

        /* =================================================
           PAGE
        ================================================= */

        .subadmin-page {
          width: 100%;
          max-width: 1450px;
          margin: 0 auto;
          color: #111827;
        }


        /* =================================================
           HEADER
        ================================================= */

        .subadmin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
        }

        .subadmin-title-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .subadmin-title-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ede9fe;
          color: #5b3fd4;
          flex-shrink: 0;
        }

        .subadmin-header h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.5px;
        }

        .subadmin-header p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .header-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .header-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 15px;
          border-radius: 9px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .header-button.primary {
          background: #5b3fd4;
          color: white;
        }

        .header-button.primary:hover {
          background: #4c32b8;
          transform: translateY(-1px);
        }

        .header-button.secondary {
          background: white;
          color: #334155;
          border: 1px solid #e2e8f0;
        }

        .header-button.secondary:hover {
          border-color: #5b3fd4;
          color: #5b3fd4;
        }


        /* =================================================
           STATISTICS
        ================================================= */

        .subadmin-stats-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 22px;
        }

        .subadmin-stat-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 17px;
          min-height: 120px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
          transition: all 0.2s ease;
        }

        .subadmin-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
        }

        .stat-card-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          gap: 10px;
        }

        .stat-title {
          margin: 0 0 7px;
          color: #64748b;
          font-size: 12px;
          font-weight: 500;
        }

        .stat-value {
          margin: 0;
          color: #0f172a;
          font-size: 25px;
          font-weight: 700;
        }

        .stat-description {
          display: block;
          margin-top: 5px;
          color: #94a3b8;
          font-size: 10px;
          line-height: 1.3;
        }

        .stat-icon {
          width: 43px;
          height: 43px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .stat-icon.blue {
          background: #2563eb;
        }

        .stat-icon.green {
          background: #16a34a;
        }

        .stat-icon.red {
          background: #dc2626;
        }

        .stat-icon.cyan {
          background: #0891b2;
        }

        .stat-icon.orange {
          background: #ea580c;
        }

        .stat-icon.purple {
          background: #7c3aed;
        }


        /* =================================================
           MAIN GRID
        ================================================= */

        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 18px;
          margin-bottom: 18px;
        }


        /* =================================================
           SECTIONS
        ================================================= */

        .dashboard-section {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          padding: 21px;
          margin-bottom: 18px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.035);
        }

        .dashboard-main-grid .dashboard-section {
          margin-bottom: 0;
        }

        .section-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }

        .section-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 17px;
          font-weight: 700;
        }

        .section-header p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .section-icon {
          color: #0891b2;
        }

        .view-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #5b3fd4;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
        }

        .view-link:hover {
          text-decoration: underline;
        }


        /* =================================================
           USER ACTIVITY
        ================================================= */

        .activity-overview {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px;
          border: 1px solid #edf1f5;
          border-radius: 10px;
          background: #fafbfc;
        }

        .activity-icon {
          width: 35px;
          height: 35px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-icon.green {
          background: #dcfce7;
          color: #16a34a;
        }

        .activity-icon.red {
          background: #fee2e2;
          color: #dc2626;
        }

        .activity-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .activity-info strong {
          font-size: 20px;
          color: #0f172a;
          line-height: 1.1;
        }

        .activity-info span {
          margin-top: 3px;
          font-size: 11px;
          color: #64748b;
        }

        .activity-percentage {
          margin-left: auto;
          font-size: 12px;
          font-weight: 700;
        }

        .green-text {
          color: #16a34a;
        }

        .red-text {
          color: #dc2626;
        }

        .progress-container {
          margin-top: 19px;
        }

        .progress-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 7px;
          color: #64748b;
          font-size: 11px;
        }

        .progress-header strong {
          color: #334155;
        }

        .progress-bar {
          height: 8px;
          width: 100%;
          background: #fee2e2;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #16a34a;
          border-radius: inherit;
          transition: width 0.4s ease;
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 7px;
          font-size: 10px;
          color: #64748b;
        }

        .progress-labels span {
          display: flex;
          align-items: center;
          gap: 4px;
        }


        /* =================================================
           ORGANIZATION
        ================================================= */

        .organization-card {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 14px;
          background: #f8fafc;
          border: 1px solid #edf1f5;
          border-radius: 10px;
        }

        .organization-logo {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: #cffafe;
          color: #0891b2;
          flex-shrink: 0;
        }

        .organization-info {
          min-width: 0;
        }

        .organization-info h3 {
          margin: 0;
          color: #0f172a;
          font-size: 14px;
        }

        .organization-info p {
          margin: 3px 0 6px;
          color: #64748b;
          font-size: 11px;
        }

        .organization-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #16a34a;
          font-size: 10px;
          font-weight: 600;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: #16a34a;
          border-radius: 50%;
        }

        .organization-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin: 14px 0;
        }

        .organization-stats div {
          padding: 10px;
          border: 1px solid #edf1f5;
          border-radius: 8px;
          background: #fafbfc;
          text-align: center;
        }

        .organization-stats strong {
          display: block;
          color: #0f172a;
          font-size: 17px;
        }

        .organization-stats span {
          display: block;
          margin-top: 2px;
          color: #64748b;
          font-size: 9px;
        }

        .organization-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px;
          border-radius: 8px;
          background: #f1efff;
          color: #5b3fd4;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .organization-button:hover {
          background: #e8e3ff;
        }


        /* =================================================
           QUICK ACTIONS
        ================================================= */

        .quick-action-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .quick-action-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          background: #fafbfc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          color: #0f172a;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .quick-action-card:hover {
          border-color: #c4b5fd;
          background: #faf9ff;
          transform: translateY(-1px);
        }

        .quick-action-icon {
          width: 37px;
          height: 37px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .quick-action-icon.blue {
          background: #dbeafe;
          color: #2563eb;
        }

        .quick-action-icon.green {
          background: #dcfce7;
          color: #16a34a;
        }

        .quick-action-icon.purple {
          background: #ede9fe;
          color: #7c3aed;
        }

        .quick-action-icon.orange {
          background: #ffedd5;
          color: #ea580c;
        }

        .quick-action-card > div:nth-child(2) {
          min-width: 0;
          flex: 1;
        }

        .quick-action-card strong {
          display: block;
          font-size: 12px;
        }

        .quick-action-card span {
          display: block;
          margin-top: 3px;
          color: #64748b;
          font-size: 9px;
          line-height: 1.3;
        }

        .quick-action-card > svg {
          color: #94a3b8;
          flex-shrink: 0;
        }


        /* =================================================
           ACTIVITY TABLE
        ================================================= */

        .activity-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .activity-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }

        .activity-table th {
          padding: 10px 12px;
          text-align: left;
          color: #64748b;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .activity-table td {
          padding: 12px;
          border-bottom: 1px solid #edf1f5;
          color: #334155;
          font-size: 11px;
        }

        .activity-table tbody tr:last-child td {
          border-bottom: none;
        }

        .activity-table tbody tr:hover {
          background: #fafbfc;
        }

        .table-user {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .table-avatar {
          width: 31px;
          height: 31px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ede9fe;
          color: #5b3fd4;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .table-user strong {
          display: block;
          color: #0f172a;
          font-size: 11px;
        }

        .table-user span {
          display: block;
          margin-top: 2px;
          color: #94a3b8;
          font-size: 9px;
        }

        .table-activity {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #475569;
        }

        .table-activity svg {
          color: #7c3aed;
        }

        .activity-time {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #64748b;
          white-space: nowrap;
        }

        .activity-status {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 700;
        }

        .activity-status.success {
          background: #dcfce7;
          color: #15803d;
        }

        .activity-status.active {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .activity-status.warning {
          background: #fef3c7;
          color: #b45309;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 8px;
          border-radius: 999px;
          background: #f0fdf4;
          color: #16a34a;
          font-size: 10px;
          font-weight: 700;
        }

        .live-indicator span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          animation: livePulse 1.5s infinite;
        }

        @keyframes livePulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: 0.4;
            transform: scale(1.35);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }


        /* =================================================
           PRODUCTIVITY
        ================================================= */

        .productivity-section {
          margin-bottom: 0;
        }

        .trending-icon {
          color: #16a34a;
        }

        .productivity-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .productivity-card {
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #fafbfc;
        }

        .productivity-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #64748b;
          font-size: 11px;
        }

        .productivity-card-header svg {
          color: #7c3aed;
        }

        .productivity-card > strong {
          display: block;
          margin-top: 10px;
          color: #0f172a;
          font-size: 25px;
        }

        .productivity-card p {
          margin: 3px 0 0;
          color: #94a3b8;
          font-size: 10px;
        }


        /* =================================================
           RESPONSIVE
        ================================================= */

        @media (max-width: 1250px) {

          .subadmin-stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .quick-action-grid {
            grid-template-columns: repeat(2, 1fr);
          }

        }


        @media (max-width: 950px) {

          .dashboard-main-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-main-grid .dashboard-section {
            margin-bottom: 18px;
          }

          .productivity-grid {
            grid-template-columns: 1fr;
          }

        }


        @media (max-width: 700px) {

          .subadmin-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
          }

          .header-button {
            flex: 1;
          }

          .subadmin-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .activity-overview {
            grid-template-columns: 1fr;
          }

          .quick-action-grid {
            grid-template-columns: 1fr;
          }

        }


        @media (max-width: 480px) {

          .subadmin-stats-grid {
            grid-template-columns: 1fr;
          }

          .subadmin-header h1 {
            font-size: 24px;
          }

          .subadmin-title-row {
            align-items: flex-start;
          }

          .dashboard-section {
            padding: 16px;
          }

          .organization-stats {
            grid-template-columns: 1fr;
          }

        }

      `}</style>
    </>
  );
}
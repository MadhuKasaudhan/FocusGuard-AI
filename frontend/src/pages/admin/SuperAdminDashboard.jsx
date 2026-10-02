import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaUserShield,
  FaUserCheck,
  FaUserTimes,
  FaBuilding,
  FaUserPlus,
  FaPlus,
  FaCog,
  FaChartPie,
  FaArrowRight,
  FaSyncAlt,
} from "react-icons/fa";

const API_URL = "http://127.0.0.1:8006";

export default function SuperAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // Fetch dashboard data
  // -----------------------------
  const fetchDashboardData = async () => {
    try {
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Users
      const usersResponse = await axios.get(
        `${API_URL}/admin/users`,
        config
      );

      setUsers(
        Array.isArray(usersResponse.data)
          ? usersResponse.data
          : usersResponse.data?.users || []
      );

      // Organizations
      try {
        const orgResponse = await axios.get(
          `${API_URL}/admin/organizations`,
          config
        );

        setOrganizations(
          Array.isArray(orgResponse.data)
            ? orgResponse.data
            : orgResponse.data?.organizations || []
        );
      } catch (orgError) {
        console.warn(
          "Organizations API unavailable:",
          orgError.response?.data || orgError.message
        );

        // Keep dashboard working if organization endpoint is unavailable
        setOrganizations([]);
      }
    } catch (err) {
      console.error(
        "Dashboard Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load Super Admin Dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // -----------------------------
  // Refresh
  // -----------------------------
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // -----------------------------
  // Statistics
  // -----------------------------
  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.is_active === true
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.is_active === false
  ).length;

  const subAdmins = users.filter((user) => {
    const role = String(user.role || "").toLowerCase();

    return (
      role === "subadmin" ||
      role === "sub_admin" ||
      role === "sub-admin"
    );
  }).length;

  const superAdmins = users.filter((user) => {
    const role = String(user.role || "").toLowerCase();

    return (
      role === "superadmin" ||
      role === "super_admin" ||
      role === "super-admin"
    );
  }).length;

  const normalUsers = users.filter((user) => {
    const role = String(user.role || "").toLowerCase();

    return (
      role === "user" ||
      role === "normal_user" ||
      role === "normaluser" ||
      role === ""
    );
  }).length;

  // -----------------------------
  // Recent users
  // -----------------------------
  const recentUsers = [...users]
    .slice(-5)
    .reverse();

  // -----------------------------
  // Loading
  // -----------------------------
  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <div className="super-loading">
          <div className="loading-spinner"></div>
          <h3>Loading Super Admin Dashboard...</h3>
          <p>Please wait while we load your data.</p>
        </div>
      </>
    );
  }

  // -----------------------------
  // Main dashboard
  // -----------------------------
  return (
    <>
      <style>{styles}</style>

      <div className="super-admin-page">

        {/* ================= HEADER ================= */}
        <div className="dashboard-header">

          <div>
            <div className="breadcrumb">
              Super Admin / Dashboard
            </div>

            <h1>Super Admin Dashboard</h1>

            <p>
              Manage users, organizations and system administration
              from one place.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <FaSyncAlt
              className={refreshing ? "rotate-icon" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* ================= STAT CARDS ================= */}
        <div className="stats-grid">

          {/* Total Users */}
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={<FaUsers />}
            className="blue"
          />

          {/* Active Users */}
          <StatCard
            title="Active Users"
            value={activeUsers}
            icon={<FaUserCheck />}
            className="green"
          />

          {/* Inactive Users */}
          <StatCard
            title="Inactive Users"
            value={inactiveUsers}
            icon={<FaUserTimes />}
            className="red"
          />

          {/* Organizations */}
          <StatCard
            title="Organizations"
            value={organizations.length}
            icon={<FaBuilding />}
            className="orange"
          />

          {/* Sub Admins */}
          <StatCard
            title="Sub Admins"
            value={subAdmins}
            icon={<FaUserShield />}
            className="purple"
          />
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <section className="section-card">

          <div className="section-header">
            <div>
              <h2>Quick Actions</h2>
              <p>
                Quickly manage your FocusGuard AI system.
              </p>
            </div>
          </div>

          <div className="quick-actions">

            <Link
              to="/admin/create-organization"
              className="quick-action blue-action"
            >
              <div className="quick-icon">
                <FaBuilding />
              </div>

              <div>
                <strong>Create Organization</strong>
                <span>Add a new organization</span>
              </div>

              <FaArrowRight className="arrow-icon" />
            </Link>

            <Link
              to="/admin/invite"
              className="quick-action green-action"
            >
              <div className="quick-icon">
                <FaUserPlus />
              </div>

              <div>
                <strong>Invite User</strong>
                <span>Invite a new user</span>
              </div>

              <FaArrowRight className="arrow-icon" />
            </Link>

            <Link
              to="/admin/create-sub-admin"
              className="quick-action purple-action"
            >
              <div className="quick-icon">
                <FaUserShield />
              </div>

              <div>
                <strong>Create Sub Admin</strong>
                <span>Create administrator account</span>
              </div>

              <FaArrowRight className="arrow-icon" />
            </Link>

            <Link
              to="/admin/settings"
              className="quick-action orange-action"
            >
              <div className="quick-icon">
                <FaCog />
              </div>

              <div>
                <strong>Admin Settings</strong>
                <span>Manage system settings</span>
              </div>

              <FaArrowRight className="arrow-icon" />
            </Link>

          </div>
        </section>

        {/* ================= ANALYTICS + USERS ================= */}
        <div className="content-grid">

          {/* Role Analytics */}
          <section className="section-card">

            <div className="section-title">
              <div className="title-icon">
                <FaChartPie />
              </div>

              <div>
                <h2>User Overview</h2>
                <p>User distribution by role</p>
              </div>
            </div>

            <div className="role-chart">

              <div className="donut">
                <div className="donut-inner">
                  <strong>{totalUsers}</strong>
                  <span>Total</span>
                </div>
              </div>

              <div className="role-list">

                <RoleItem
                  label="Normal Users"
                  value={normalUsers}
                  className="normal"
                />

                <RoleItem
                  label="Sub Admins"
                  value={subAdmins}
                  className="subadmin"
                />

                <RoleItem
                  label="Super Admins"
                  value={superAdmins}
                  className="superadmin"
                />

              </div>

            </div>
          </section>

          {/* System Status */}
          <section className="section-card">

            <div className="section-title">
              <div className="title-icon green-title">
                <FaUserCheck />
              </div>

              <div>
                <h2>System Status</h2>
                <p>Current platform status</p>
              </div>
            </div>

            <div className="status-list">

              <StatusRow
                title="User Accounts"
                value={activeUsers}
                text="Active"
                status="success"
              />

              <StatusRow
                title="Inactive Accounts"
                value={inactiveUsers}
                text="Inactive"
                status="danger"
              />

              <StatusRow
                title="Organizations"
                value={organizations.length}
                text="Registered"
                status="info"
              />

              <StatusRow
                title="Sub Admins"
                value={subAdmins}
                text="Administrators"
                status="purple"
              />

            </div>
          </section>
        </div>

        {/* ================= RECENT USERS ================= */}
        <section className="section-card">

          <div className="section-header">

            <div>
              <h2>Recent Users</h2>
              <p>
                Latest users registered in FocusGuard AI.
              </p>
            </div>

            <Link
              to="/admin/users"
              className="view-all"
            >
              View All
              <FaArrowRight />
            </Link>

          </div>

          {recentUsers.length === 0 ? (
            <div className="empty-state">
              No users found.
            </div>
          ) : (
            <div className="table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {recentUsers.map((user, index) => {

                    const role =
                      user.role || "user";

                    return (
                      <tr key={user.id || index}>

                        <td>
                          <div className="user-info">

                            <div className="avatar">
                              {(user.name || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <strong>
                              {user.name || "Unknown User"}
                            </strong>

                          </div>
                        </td>

                        <td>
                          {user.email || "N/A"}
                        </td>

                        <td>
                          <span className="role-badge">
                            {formatRole(role)}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              user.is_active
                                ? "status-badge active"
                                : "status-badge inactive"
                            }
                          >
                            {user.is_active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>
            </div>
          )}

        </section>

        {/* ================= ORGANIZATIONS ================= */}
        <section className="section-card">

          <div className="section-header">

            <div>
              <h2>Organizations</h2>

              <p>
                Manage organizations registered with
                FocusGuard AI.
              </p>
            </div>

            <div className="organization-actions">

              <Link
                to="/admin/organizations"
                className="secondary-button"
              >
                View Organizations
              </Link>

              <Link
                to="/admin/create-organization"
                className="primary-button"
              >
                <FaPlus />
                Create Organization
              </Link>

            </div>

          </div>

          {organizations.length === 0 ? (
            <div className="empty-state">
              No organizations available.
            </div>
          ) : (
            <div className="organization-grid">

              {organizations.slice(0, 6).map(
                (organization) => (

                  <div
                    className="organization-card"
                    key={organization.id}
                  >

                    <div className="organization-icon">
                      <FaBuilding />
                    </div>

                    <div className="organization-info">

                      <h3>
                        {organization.name ||
                          "Organization"}
                      </h3>

                      <p>
                        {organization.company_email ||
                          organization.email ||
                          "No email"}
                      </p>

                      <span>
                        {organization.address ||
                          "Address not available"}
                      </span>

                    </div>

                    <span className="organization-status">
                      {organization.is_active === false
                        ? "Inactive"
                        : "Active"}
                    </span>

                  </div>

                )
              )}

            </div>
          )}

        </section>

      </div>
    </>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  title,
  value,
  icon,
  className,
}) {
  return (
    <div className="stat-card">

      <div className="stat-content">

        <span>{title}</span>

        <strong>{value}</strong>

      </div>

      <div className={`stat-icon ${className}`}>
        {icon}
      </div>

    </div>
  );
}

/* =====================================================
   ROLE ITEM
===================================================== */

function RoleItem({
  label,
  value,
  className,
}) {
  return (
    <div className="role-item">

      <div className="role-label">

        <span className={`role-dot ${className}`}></span>

        <span>{label}</span>

      </div>

      <strong>{value}</strong>

    </div>
  );
}

/* =====================================================
   STATUS ROW
===================================================== */

function StatusRow({
  title,
  value,
  text,
  status,
}) {
  return (
    <div className="status-row">

      <div>

        <strong>{title}</strong>

        <span>{text}</span>

      </div>

      <div className={`status-number ${status}`}>
        {value}
      </div>

    </div>
  );
}

/* =====================================================
   FORMAT ROLE
===================================================== */

function formatRole(role) {
  return String(role)
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

/* =====================================================
   SAME PAGE CSS
===================================================== */

const styles = `

* {
  box-sizing: border-box;
}

.super-admin-page {
  min-height: 100vh;
  padding: 36px;
  background: #f5f7fb;
  color: #111827;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

/* ================= HEADER ================= */

.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 30px;
}

.breadcrumb {
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 8px;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
}

.dashboard-header p {
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 15px;
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  padding: 10px 16px;
  border-radius: 9px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.refresh-button:hover {
  background: #f9fafb;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.rotate-icon {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* ================= ERROR ================= */

.error-box {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 14px 18px;
  border-radius: 10px;
  margin-bottom: 22px;
}

/* ================= STAT CARDS ================= */

.stats-grid {
  display: grid;
  grid-template-columns:
    repeat(5, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 28px;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 130px;
  box-shadow:
    0 3px 12px rgba(15, 23, 42, 0.04);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-content span {
  color: #6b7280;
  font-size: 14px;
}

.stat-content strong {
  font-size: 30px;
  color: #111827;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 21px;
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

.stat-icon.orange {
  background: #ea580c;
}

.stat-icon.purple {
  background: #7c3aed;
}

/* ================= SECTIONS ================= */

.section-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow:
    0 3px 12px rgba(15, 23, 42, 0.035);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.section-header h2 {
  margin: 0 0 5px;
  font-size: 20px;
}

.section-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 25px;
}

.section-title h2 {
  margin: 0 0 4px;
  font-size: 19px;
}

.section-title p {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
}

.title-icon {
  width: 43px;
  height: 43px;
  border-radius: 10px;
  background: #ede9fe;
  color: #7c3aed;
  display: flex;
  align-items: center;
  justify-content: center;
}

.green-title {
  background: #dcfce7;
  color: #16a34a;
}

/* ================= QUICK ACTIONS ================= */

.quick-actions {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 15px;
}

.quick-action {
  text-decoration: none;
  color: #111827;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 13px;
  transition: 0.2s;
}

.quick-action:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 18px rgba(15, 23, 42, 0.08);
}

.quick-action > div:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.quick-action strong {
  font-size: 14px;
}

.quick-action span {
  color: #6b7280;
  font-size: 12px;
}

.quick-icon {
  width: 40px;
  height: 40px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white !important;
  font-size: 16px;
}

.blue-action .quick-icon {
  background: #2563eb;
}

.green-action .quick-icon {
  background: #16a34a;
}

.purple-action .quick-icon {
  background: #7c3aed;
}

.orange-action .quick-icon {
  background: #ea580c;
}

.arrow-icon {
  color: #9ca3af;
}

/* ================= TWO COLUMN ================= */

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* ================= ROLE CHART ================= */

.role-chart {
  display: flex;
  align-items: center;
  gap: 35px;
  min-height: 190px;
}

.donut {
  width: 155px;
  height: 155px;
  border-radius: 50%;
  background:
    conic-gradient(
      #2563eb 0deg 180deg,
      #7c3aed 180deg 270deg,
      #16a34a 270deg 360deg
    );
  display: flex;
  align-items: center;
  justify-content: center;
}

.donut-inner {
  width: 105px;
  height: 105px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.donut-inner strong {
  font-size: 25px;
}

.donut-inner span {
  color: #6b7280;
  font-size: 12px;
}

.role-list {
  flex: 1;
}

.role-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.role-label {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #4b5563;
  font-size: 14px;
}

.role-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.role-dot.normal {
  background: #2563eb;
}

.role-dot.subadmin {
  background: #7c3aed;
}

.role-dot.superadmin {
  background: #16a34a;
}

/* ================= STATUS ================= */

.status-list {
  display: flex;
  flex-direction: column;
}

.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 17px 0;
  border-bottom: 1px solid #f1f5f9;
}

.status-row > div:first-child {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.status-row strong {
  font-size: 14px;
}

.status-row span {
  color: #6b7280;
  font-size: 12px;
}

.status-number {
  min-width: 45px;
  text-align: center;
  padding: 7px 10px;
  border-radius: 8px;
  font-weight: 700;
}

.status-number.success {
  background: #dcfce7;
  color: #15803d;
}

.status-number.danger {
  background: #fee2e2;
  color: #dc2626;
}

.status-number.info {
  background: #dbeafe;
  color: #2563eb;
}

.status-number.purple {
  background: #ede9fe;
  color: #7c3aed;
}

/* ================= TABLE ================= */

.table-wrapper {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
  text-align: left;
  padding: 13px 15px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.admin-table td {
  padding: 15px;
  border-bottom: 1px solid #eef2f7;
  color: #4b5563;
  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #ede9fe;
  color: #6d28d9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.role-badge {
  background: #f1f5f9;
  color: #475569;
  padding: 5px 9px;
  border-radius: 6px;
  font-size: 12px;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background: #dcfce7;
  color: #15803d;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #dc2626;
}

/* ================= ORGANIZATIONS ================= */

.organization-actions {
  display: flex;
  gap: 10px;
}

.primary-button,
.secondary-button {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.primary-button {
  background: #2563eb;
  color: white;
}

.primary-button:hover {
  background: #1d4ed8;
}

.secondary-button {
  border: 1px solid #d1d5db;
  color: #374151;
  background: white;
}

.organization-grid {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 15px;
}

.organization-card {
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 11px;
  padding: 18px;
  display: flex;
  gap: 13px;
}

.organization-icon {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #dbeafe;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.organization-info {
  min-width: 0;
}

.organization-info h3 {
  margin: 0 0 5px;
  font-size: 14px;
}

.organization-info p {
  margin: 0 0 5px;
  color: #6b7280;
  font-size: 12px;
  word-break: break-word;
}

.organization-info span {
  color: #9ca3af;
  font-size: 11px;
}

.organization-status {
  position: absolute;
  top: 12px;
  right: 12px;
  color: #15803d;
  background: #dcfce7;
  padding: 4px 7px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 600;
}

/* ================= LINKS ================= */

.view-all {
  display: flex;
  align-items: center;
  gap: 7px;
  text-decoration: none;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
}

/* ================= EMPTY ================= */

.empty-state {
  text-align: center;
  padding: 35px;
  color: #9ca3af;
}

/* ================= LOADING ================= */

.super-loading {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #374151;
}

.super-loading h3 {
  margin: 18px 0 5px;
}

.super-loading p {
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ================= RESPONSIVE ================= */

@media (max-width: 1200px) {

  .stats-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }

  .quick-actions {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .organization-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 850px) {

  .super-admin-page {
    padding: 20px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 15px;
  }

  .stats-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .organization-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 550px) {

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .role-chart {
    flex-direction: column;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .organization-actions {
    flex-direction: column;
    width: 100%;
  }

  .primary-button,
  .secondary-button {
    justify-content: center;
  }

  .dashboard-header h1 {
    font-size: 25px;
  }
}

`;
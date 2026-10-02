import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Building2,
  UserCog,
  UserCheck,
  UserX,
  Plus,
  ArrowRight,
  Activity,
  ShieldCheck,
  RefreshCw,
  Settings,
  UserPlus,
} from "lucide-react";

import api from "../../api/client";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersResponse, organizationsResponse] =
        await Promise.all([
          api.get("/admin/users"),
          api.get("/organizations/"),
        ]);

      setUsers(usersResponse.data || []);
      setOrganizations(organizationsResponse.data || []);
    } catch (err) {
      console.error("Dashboard loading error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /*
   * User statistics
   */

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.is_active === true
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.is_active === false
  ).length;

  /*
   * Backend can use either:
   * super_admin
   * superadmin
   */

  const superAdmins = users.filter(
    (user) =>
      user.role === "super_admin" ||
      user.role === "superadmin"
  ).length;

  const subAdmins = users.filter(
    (user) =>
      user.role === "sub_admin" ||
      user.role === "subadmin"
  ).length;

  const normalUsers = users.filter(
    (user) =>
      user.role === "user" ||
      user.role === "USER" ||
      !user.role
  ).length;

  /*
   * User percentage
   */

  const activePercentage =
    totalUsers > 0
      ? Math.round((activeUsers / totalUsers) * 100)
      : 0;

  const inactivePercentage =
    totalUsers > 0
      ? Math.round((inactiveUsers / totalUsers) * 100)
      : 0;

  /*
   * Role statistics
   */

  const roleStats = useMemo(
    () => [
      {
        label: "Super Admin",
        value: superAdmins,
        className: "role-purple",
      },
      {
        label: "Sub Admin",
        value: subAdmins,
        className: "role-blue",
      },
      {
        label: "Users",
        value: normalUsers,
        className: "role-green",
      },
    ],
    [superAdmins, subAdmins, normalUsers]
  );

  /*
   * Recent organizations
   */

  const recentOrganizations = [...organizations]
    .reverse()
    .slice(0, 5);

  /*
   * Loading
   */

  if (loading) {
    return (
      <div className="admin-loading">
        <RefreshCw className="loading-icon" size={30} />

        <h2>Loading Super Admin Dashboard</h2>

        <p>
          Fetching users, organizations and system
          information...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* ================= HEADER ================= */}

      <div className="admin-header">
        <div>
          <div className="admin-breadcrumb">
            <ShieldCheck size={15} />
            Super Admin
          </div>

          <h1>Super Admin Dashboard</h1>

          <p>
            Manage organizations, users and platform
            activity from one place.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchDashboard}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* ================= STAT CARDS ================= */}

      <div className="stats-grid">

        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          className="blue"
          description="Registered users"
        />

        <StatCard
          title="Organizations"
          value={organizations.length}
          icon={Building2}
          className="green"
          description="Active organizations"
        />

        <StatCard
          title="Sub Admins"
          value={subAdmins}
          icon={UserCog}
          className="purple"
          description="Platform administrators"
        />

        <StatCard
          title="Active Users"
          value={activeUsers}
          icon={UserCheck}
          className="teal"
          description={`${activePercentage}% of users`}
        />

        <StatCard
          title="Inactive Users"
          value={inactiveUsers}
          icon={UserX}
          className="red"
          description={`${inactivePercentage}% of users`}
        />

      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <section className="section-card">

        <div className="section-heading">
          <div>
            <h2>Quick Actions</h2>
            <p>
              Frequently used administration actions.
            </p>
          </div>
        </div>

        <div className="quick-actions">

          <Link
            to="/admin/create-organization"
            className="quick-action"
          >
            <div className="quick-icon green">
              <Plus size={20} />
            </div>

            <div>
              <strong>Create Organization</strong>
              <span>
                Add a new organization
              </span>
            </div>

            <ArrowRight size={17} />
          </Link>

          <Link
            to="/admin/invite"
            className="quick-action"
          >
            <div className="quick-icon blue">
              <UserPlus size={20} />
            </div>

            <div>
              <strong>Invite User</strong>
              <span>
                Add a new platform user
              </span>
            </div>

            <ArrowRight size={17} />
          </Link>

          <Link
            to="/admin/create-sub-admin"
            className="quick-action"
          >
            <div className="quick-icon purple">
              <UserCog size={20} />
            </div>

            <div>
              <strong>Create Sub Admin</strong>
              <span>
                Add an administrator
              </span>
            </div>

            <ArrowRight size={17} />
          </Link>

          <Link
            to="/admin/settings"
            className="quick-action"
          >
            <div className="quick-icon orange">
              <Settings size={20} />
            </div>

            <div>
              <strong>Admin Settings</strong>
              <span>
                Configure administration
              </span>
            </div>

            <ArrowRight size={17} />
          </Link>

        </div>
      </section>

      {/* ================= MAIN GRID ================= */}

      <div className="dashboard-grid">

        {/* ================= USER OVERVIEW ================= */}

        <section className="section-card">

          <div className="section-heading">
            <div>
              <h2>User Overview</h2>
              <p>
                Current platform user status.
              </p>
            </div>

            <Activity size={20} />
          </div>

          <div className="user-overview">

            <div className="overview-circle">
              <div>
                <strong>{totalUsers}</strong>
                <span>Total</span>
              </div>
            </div>

            <div className="user-status-list">

              <StatusRow
                label="Active Users"
                value={activeUsers}
                percentage={activePercentage}
                className="active"
              />

              <StatusRow
                label="Inactive Users"
                value={inactiveUsers}
                percentage={inactivePercentage}
                className="inactive"
              />

            </div>

          </div>

        </section>

        {/* ================= ROLE OVERVIEW ================= */}

        <section className="section-card">

          <div className="section-heading">
            <div>
              <h2>Role Overview</h2>
              <p>
                Distribution of platform roles.
              </p>
            </div>

            <Users size={20} />
          </div>

          <div className="role-list">

            {roleStats.map((role) => (
              <div
                className="role-row"
                key={role.label}
              >
                <div className="role-info">

                  <span
                    className={`role-dot ${role.className}`}
                  ></span>

                  <span>{role.label}</span>

                </div>

                <strong>{role.value}</strong>
              </div>
            ))}

          </div>

        </section>

      </div>

      {/* ================= ORGANIZATIONS ================= */}

      <section className="section-card organizations-card">

        <div className="section-heading">

          <div>
            <h2>Recent Organizations</h2>

            <p>
              Recently created organizations.
            </p>
          </div>

          <Link
            to="/admin/organizations"
            className="view-all"
          >
            View All
            <ArrowRight size={16} />
          </Link>

        </div>

        {recentOrganizations.length === 0 ? (
          <div className="empty-state">
            <Building2 size={35} />

            <h3>No organizations found</h3>

            <p>
              Create your first organization to
              get started.
            </p>

            <Link
              to="/admin/create-organization"
              className="primary-button"
            >
              <Plus size={17} />
              Create Organization
            </Link>
          </div>
        ) : (
          <div className="organization-list">

            {recentOrganizations.map((organization) => (
              <div
                className="organization-row"
                key={organization.id}
              >

                <div className="organization-left">

                  <div className="organization-icon">
                    <Building2 size={20} />
                  </div>

                  <div>
                    <strong>
                      {organization.name}
                    </strong>

                    <span>
                      {organization.company_email ||
                        "No email available"}
                    </span>
                  </div>

                </div>

                <div className="organization-right">

                  <span className="status-badge">
                    {organization.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>

                  <Link
                    to={`/admin/organization/${organization.id}`}
                    className="details-link"
                  >
                    Details
                    <ArrowRight size={15} />
                  </Link>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

      {/* ================= SYSTEM SUMMARY ================= */}

      <section className="system-summary">

        <div className="summary-item">
          <Building2 size={20} />

          <div>
            <span>Organizations</span>
            <strong>{organizations.length}</strong>
          </div>
        </div>

        <div className="summary-item">
          <Users size={20} />

          <div>
            <span>Total Users</span>
            <strong>{totalUsers}</strong>
          </div>
        </div>

        <div className="summary-item">
          <UserCog size={20} />

          <div>
            <span>Sub Admins</span>
            <strong>{subAdmins}</strong>
          </div>
        </div>

        <div className="summary-item">
          <UserCheck size={20} />

          <div>
            <span>System Status</span>
            <strong className="system-online">
              Operational
            </strong>
          </div>
        </div>

      </section>

    </div>
  );
}


/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  title,
  value,
  icon: Icon,
  className,
  description,
}) {
  return (
    <div className="stat-card">

      <div className="stat-content">

        <span className="stat-title">
          {title}
        </span>

        <strong className="stat-value">
          {value}
        </strong>

        <span className="stat-description">
          {description}
        </span>

      </div>

      <div className={`stat-icon ${className}`}>
        <Icon size={23} />
      </div>

    </div>
  );
}


/* =====================================================
   STATUS ROW
===================================================== */

function StatusRow({
  label,
  value,
  percentage,
  className,
}) {
  return (
    <div className="status-row">

      <div className="status-row-top">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

      <div className="progress-background">

        <div
          className={`progress-bar ${className}`}
          style={{
            width: `${percentage}%`,
          }}
        ></div>

      </div>

      <small>
        {percentage}%
      </small>

    </div>
  );
}
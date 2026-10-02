import { NavLink, Outlet, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  BarChart3,
  Users,
  UserPlus,
  UserCog,
  Building2,
  PlusCircle,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // =====================================================
  // ROLE
  // =====================================================

  const role = String(user?.role || "")
    .toLowerCase()
    .trim();

  const isSuperAdmin =
    role === "super_admin" ||
    role === "superadmin" ||
    user?.is_superuser === true;

  const isSubAdmin =
    role === "sub_admin" ||
    role === "subadmin";

  // =====================================================
  // ROLE LABEL
  // =====================================================

  const roleLabel = isSuperAdmin
    ? "Super Admin"
    : isSubAdmin
    ? "Sub Admin"
    : "Admin";

  // =====================================================
  // DEBUG
  // =====================================================

  console.log("=================================");
  console.log("ADMIN LAYOUT");
  console.log("User:", user);
  console.log("Role:", role);
  console.log("Is Super Admin:", isSuperAdmin);
  console.log("Is Sub Admin:", isSubAdmin);
  console.log("Current Path:", location.pathname);
  console.log("=================================");

  // =====================================================
  // NAVIGATION CLASS
  // =====================================================

  const navLinkClass = ({ isActive }) => {
    return `admin-nav-link ${isActive ? "active" : ""}`;
  };

  // =====================================================
  // ORGANIZATION ACTIVE
  // =====================================================

  const organizationNavClass = () => {
    const active =
      location.pathname === "/admin/organizations" ||
      location.pathname.startsWith("/admin/organization/");

    return `admin-nav-link ${active ? "active" : ""}`;
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="admin-sidebar">

        {/* =================================================
            BRAND
        ================================================= */}

        <div className="admin-brand">
          <ShieldCheck size={23} />
          <span>FocusGuard AI</span>
        </div>

        {/* =================================================
            CURRENT USER
        ================================================= */}

        <div className="admin-controls">
          <div className="admin-control">

            <div className="user-chip">

              <div className="user-avatar">
                {(user?.name || "A")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="user-chip-text">

                <div className="user-name">
                  {user?.name || "Admin"}
                </div>

                <div className="user-email">
                  {roleLabel}
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="admin-nav">

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <NavLink
            to={
              isSuperAdmin
                ? "/admin/dashboard"
                : "/subadmin/dashboard"
            }
            end
            className={navLinkClass}
          >
            <LayoutDashboard size={18} />

            <span>
              {isSuperAdmin
                ? "Super Admin Dashboard"
                : "Sub Admin Dashboard"}
            </span>
          </NavLink>


          {/* =================================================
              ANALYTICS

              TEMPORARILY ALWAYS VISIBLE
          ================================================= */}

          <NavLink
            to="/admin/analytics"
            className={navLinkClass}
          >
            <BarChart3 size={18} />

            <span>
              Analytics
            </span>
          </NavLink>


          {/* =================================================
              USERS
          ================================================= */}

          {(isSuperAdmin || isSubAdmin) && (
            <NavLink
              to="/admin/users"
              className={navLinkClass}
            >
              <Users size={18} />

              <span>
                Users
              </span>
            </NavLink>
          )}


          {/* =================================================
              INVITE USER
          ================================================= */}

          {(isSuperAdmin || isSubAdmin) && (
            <NavLink
              to="/admin/invite"
              className={navLinkClass}
            >
              <UserPlus size={18} />

              <span>
                Invite User
              </span>
            </NavLink>
          )}


          {/* =================================================
              ORGANIZATIONS
          ================================================= */}

          {(isSuperAdmin || isSubAdmin) && (
            <NavLink
              to="/admin/organizations"
              className={organizationNavClass}
            >
              <Building2 size={18} />

              <span>
                Organizations
              </span>
            </NavLink>
          )}


          {/* =================================================
              CREATE ORGANIZATION
              SUPER ADMIN ONLY
          ================================================= */}

          {isSuperAdmin && (
            <NavLink
              to="/admin/create-organization"
              className={navLinkClass}
            >
              <PlusCircle size={18} />

              <span>
                Create Organization
              </span>
            </NavLink>
          )}


          {/* =================================================
              CREATE SUB ADMIN
              SUPER ADMIN ONLY
          ================================================= */}

          {isSuperAdmin && (
            <NavLink
              to="/admin/create-sub-admin"
              className={navLinkClass}
            >
              <UserCog size={18} />

              <span>
                Create Sub Admin
              </span>
            </NavLink>
          )}


          {/* =================================================
              SETTINGS
          ================================================= */}

          {(isSuperAdmin || isSubAdmin) && (
            <NavLink
              to="/admin/settings"
              className={navLinkClass}
            >
              <Settings size={18} />

              <span>
                Settings
              </span>
            </NavLink>
          )}

        </nav>


        {/* =================================================
            SIDEBAR FOOTER
        ================================================= */}

        <div className="admin-sidebar-footer">

          <div className="admin-user">

            {/* Avatar */}

            <div className="admin-avatar">
              {(user?.name || "A")
                .charAt(0)
                .toUpperCase()}
            </div>


            {/* User information */}

            <div className="admin-user-info">

              <strong>
                {user?.name || "Admin"}
              </strong>

              <span>
                {roleLabel}
              </span>

              <small>
                {user?.email || ""}
              </small>

            </div>


            {/* Logout */}

            <button
              type="button"
              className="admin-logout"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={18} />
            </button>

          </div>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="admin-content">
        <Outlet />
      </main>

    </div>
  );
}
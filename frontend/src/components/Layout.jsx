import { NavLink, Outlet } from "react-router-dom";

import {
  LayoutGrid,
  LineChart,
  Brain,
  Sparkles,
  Bell,
  MessageCircle,
  Activity,
  ShieldCheck,
  LogOut,
  Users,
  Building2,
  UserPlus,
  Settings,
} from "lucide-react";

import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

import {
  isSuperAdmin,
  isSubAdmin,
} from "../utils/roles";


/* =========================
   NORMAL USER NAVIGATION
========================= */

const USER_NAV = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutGrid,
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: LineChart,
  },
  {
    to: "/behavioral-analytics",
    label: "Behavioral Analytics",
    icon: Brain,
  },
  {
    to: "/ai-engine",
    label: "AI Engine",
    icon: Sparkles,
  },
  {
    to: "/recommendations",
    label: "Recommendations",
    icon: Sparkles,
  },
  {
    to: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    to: "/chatbot",
    label: "AI Chat",
    icon: MessageCircle,
  },
  {
    to: "/monitoring",
    label: "Monitoring",
    icon: Activity,
  },
];


/* =========================
   SUPER ADMIN NAVIGATION
========================= */

const SUPER_ADMIN_NAV = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutGrid,
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    to: "/admin/invite",
    label: "Invite User",
    icon: UserPlus,
  },
  {
    to: "/admin/create-sub-admin",
    label: "Sub Admins",
    icon: ShieldCheck,
  },
  {
    to: "/admin/organizations",
    label: "Organizations",
    icon: Building2,
  },
  {
    to: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];


/* =========================
   SUB ADMIN NAVIGATION
========================= */

const SUB_ADMIN_NAV = [
  {
    to: "/subadmin/dashboard",
    label: "Dashboard",
    icon: LayoutGrid,
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    to: "/admin/organizations",
    label: "Organization",
    icon: Building2,
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: LineChart,
  },
  {
    to: "/monitoring",
    label: "Monitoring",
    icon: Activity,
  },
  {
    to: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];


export default function Layout() {

  const { t } = useTranslation();

  const { user, logout } = useAuth();


  /* =========================
     SELECT NAVIGATION BY ROLE
  ========================= */

  let navItems = USER_NAV;

  if (isSuperAdmin(user)) {
    navItems = SUPER_ADMIN_NAV;
  } else if (isSubAdmin(user)) {
    navItems = SUB_ADMIN_NAV;
  }


  return (
    <div className="shell">

      {/* SIDEBAR */}

      <aside className="sidebar">

        {/* BRAND */}

        <div className="brand">
          <ShieldCheck size={20} />

          <span>
            FocusGuard AI
          </span>
        </div>


        {/* THEME */}

        <div style={{ padding: "8px" }}>
          <ThemeToggle />
        </div>


        {/* LANGUAGE */}

        <div style={{ padding: "8px" }}>
          <LanguageSwitcher />
        </div>


        {/* NAVIGATION */}

        <nav>

          {navItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  "nav-link" +
                  (isActive ? " active" : "")
                }
              >

                <Icon size={18} />

                <span>
                  {item.label}
                </span>

              </NavLink>
            );

          })}

        </nav>


        {/* USER */}

        <div className="sidebar-footer">

          <div className="user-chip">

            <div className="user-avatar">

              {(user?.name || "?")
                .charAt(0)
                .toUpperCase()}

            </div>


            <div className="user-chip-text">

              <div className="user-name">
                {user?.name}
              </div>

              <div className="user-email">
                {user?.email}
              </div>

            </div>


            <button
              className="logout-icon-btn"
              onClick={logout}
              title="Logout"
            >

              <LogOut size={18} />

            </button>

          </div>

        </div>

      </aside>


      {/* MAIN */}

      <main className="content">

        <Outlet />

      </main>

    </div>
  );
}
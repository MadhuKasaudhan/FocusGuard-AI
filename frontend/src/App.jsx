import { Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AdminLayout from "./components/admin/AdminLayout";

// ======================================================
// NORMAL USER PAGES
// ======================================================

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import Analytics from "./pages/Analytics";
import BehavioralAnalytics from "./pages/BehavioralAnalytics";
import AIEngine from "./pages/AIEngine";
import Recommendations from "./pages/Recommendations";
import Notifications from "./pages/Notifications";
import Monitoring from "./pages/Monitoring";

// ======================================================
// ADMIN PAGES
// ======================================================

import Admin from "./pages/Admin";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import SubAdminDashboard from "./pages/admin/SubAdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import InviteUser from "./pages/admin/InviteUser";
import CreateSubAdmin from "./pages/admin/CreateSubAdmin";
import Organization from "./pages/admin/Organization";
import CreateOrganization from "./pages/admin/CreateOrganization";
import EditOrganization from "./pages/admin/EditOrganization";
import OrganizationDetails from "./pages/admin/OrganizationDetails";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import Landing from "./pages/Landing";
// ======================================================
// APP
// ======================================================

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* ==================================================
            PUBLIC ROUTES
        ================================================== */}
         <Route path="/" element={<Landing />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==================================================
            NORMAL USER ROUTES
        ================================================== */}

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

          {/* Dashboard */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Chatbot */}

          <Route
            path="/chatbot"
            element={<Chatbot />}
          />

          {/* Normal User Analytics */}

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          {/* Behavioral Analytics */}

          <Route
            path="/behavioral-analytics"
            element={<BehavioralAnalytics />}
          />

          {/* AI Engine */}

          <Route
            path="/ai-engine"
            element={<AIEngine />}
          />

          {/* Recommendations */}

          <Route
            path="/recommendations"
            element={<Recommendations />}
          />

          {/* Notifications */}

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          {/* Monitoring */}

          <Route
            path="/monitoring"
            element={<Monitoring />}
          />

        </Route>


        {/* ==================================================
            ADMIN ROUTES
        ================================================== */}

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          {/* ==================================================
              SUPER ADMIN DASHBOARD
          ================================================== */}

          <Route
            path="/admin/dashboard"
            element={<SuperAdminDashboard />}
          />


          {/* ==================================================
              SUB ADMIN DASHBOARD
          ================================================== */}

          <Route
            path="/subadmin/dashboard"
            element={<SubAdminDashboard />}
          />


          {/* ==================================================
              ADMIN HOME
          ================================================== */}

          <Route
            path="/admin"
            element={<Admin />}
          />


          {/* ==================================================
              USERS
          ================================================== */}

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />


          {/* ==================================================
              INVITE USER
          ================================================== */}

          <Route
            path="/admin/invite"
            element={<InviteUser />}
          />


          {/* ==================================================
              CREATE SUB ADMIN
              SUPER ADMIN ONLY
          ================================================== */}

          <Route
            path="/admin/create-sub-admin"
            element={<CreateSubAdmin />}
          />


          {/* ==================================================
              ORGANIZATIONS
          ================================================== */}

          <Route
            path="/admin/organizations"
            element={<Organization />}
          />

          <Route
            path="/admin/organization/:id"
            element={<OrganizationDetails />}
          />

          <Route
            path="/admin/create-organization"
            element={<CreateOrganization />}
          />

          <Route
            path="/admin/edit-organization/:id"
            element={<EditOrganization />}
          />


          {/* ==================================================
              ADMIN ANALYTICS

              SUPER ADMIN + SUB ADMIN
          ================================================== */}

          <Route
            path="/admin/analytics"
            element={<AdminAnalytics />}
          />


          {/* ==================================================
              ADMIN SETTINGS
          ================================================== */}

          <Route
            path="/admin/settings"
            element={<AdminSettings />}
          />

        </Route>


        {/* ==================================================
            ROOT ROUTE
        ================================================== */}

        {/* <Route
          path="/"
          element={<RoleBasedRedirect />}
        /> */}


        {/* ==================================================
            UNKNOWN ROUTES
        ================================================== */}

        <Route
          path="*"
          element={<RoleBasedRedirect />}
        />

      </Routes>
    </AuthProvider>
  );
}


// ======================================================
// ROLE BASED REDIRECT
// ======================================================

function RoleBasedRedirect() {
  const { user, loading } = useAuth();


  // ====================================================
  // AUTHENTICATION LOADING
  // ====================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          color: "var(--text)",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }


  // ====================================================
  // NOT LOGGED IN
  // ====================================================

  if (!user) {
    return <Navigate to="/login" replace />;
  }


  // ====================================================
  // GET ROLE
  // ====================================================

  const role = String(user?.role || "")
    .toLowerCase()
    .trim();


  // ====================================================
  // SUPER ADMIN
  // ====================================================

  const isSuperAdmin =
    role === "super_admin" ||
    role === "superadmin" ||
    user?.is_superuser === true;

  if (isSuperAdmin) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }


  // ====================================================
  // SUB ADMIN
  // ====================================================

  const isSubAdmin =
    role === "sub_admin" ||
    role === "subadmin";

  if (isSubAdmin) {
    return (
      <Navigate
        to="/subadmin/dashboard"
        replace
      />
    );
  }


  // ====================================================
  // NORMAL USER
  // ====================================================

  return (
    <Navigate
      to="/dashboard"
      replace
    />
  );
}
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // NORMALIZE USER ROLE
  // =====================================================

  function normalizeUser(userData) {
    if (!userData) return null;

    const normalizedRole = String(
      userData.role ||
      userData.user_role ||
      userData.role_name ||
      ""
    )
      .trim()
      .toLowerCase()
      .replace(/-/g, "_")
      .replace(/\s+/g, "_");

    let role = normalizedRole;

    // Normalize possible backend role names
    if (
      normalizedRole === "superadmin" ||
      normalizedRole === "super_admin" ||
      userData.is_superuser === true
    ) {
      role = "super_admin";
    } else if (
      normalizedRole === "subadmin" ||
      normalizedRole === "sub_admin"
    ) {
      role = "sub_admin";
    } else {
      role = "user";
    }

    const normalizedUser = {
      ...userData,
      role,
    };

    console.log("=================================");
    console.log("AUTH USER");
    console.log("Original role:", userData.role);
    console.log("Normalized role:", role);
    console.log("Is superuser:", userData.is_superuser);
    console.log("Full user:", normalizedUser);
    console.log("=================================");

    return normalizedUser;
  }

  // =====================================================
  // CHECK CURRENT USER
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    console.log("Stored Token:", token);

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then(({ data }) => {
        console.log("Current User From Backend:", data);

        const normalizedUser = normalizeUser(data);

        setUser(normalizedUser);
      })
      .catch((err) => {
        console.error(
          "Auth Error:",
          err.response?.data || err
        );

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // =====================================================
  // LOGIN
  // =====================================================

  async function login(email, password) {
    const form = new URLSearchParams();

    form.append("username", email);
    form.append("password", password);

    try {
      const { data } = await api.post(
        "/auth/login",
        form,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("LOGIN RESPONSE:", data);

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      if (data.refresh_token) {
        localStorage.setItem(
          "refresh_token",
          data.refresh_token
        );
      }

      // Get logged-in user
      const me = await api.get("/auth/me");

      console.log(
        "Logged In User From Backend:",
        me.data
      );

      const normalizedUser = normalizeUser(me.data);

      setUser(normalizedUser);

      return normalizedUser;
    } catch (err) {
      console.error(
        "Login Failed:",
        err.response?.data || err
      );

      throw err;
    }
  }

  // =====================================================
  // REGISTER
  // =====================================================

  async function register(name, email, password) {
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      return await login(email, password);
    } catch (err) {
      console.error(
        "Registration Failed:",
        err.response?.data || err
      );

      throw err;
    }
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setUser(null);
  }

  // =====================================================
  // CONTEXT
  // =====================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// USE AUTH
// =====================================================

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return ctx;
}
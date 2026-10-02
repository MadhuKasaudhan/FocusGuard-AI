import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const loggedInUser = await login(email, password);

      console.log("Logged in user:", loggedInUser);

      // Redirect according to role
      if (
        loggedInUser?.is_superuser === true ||
        loggedInUser?.role === "superadmin" ||
        loggedInUser?.role === "super_admin"
      ) {
        navigate("/admin/dashboard", { replace: true });
      } else if (
        loggedInUser?.role === "subadmin" ||
        loggedInUser?.role === "sub_admin"
      ) {
        navigate("/subadmin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.detail ||
          t("auth.failedLogin") ||
          "Invalid email or password"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{t("auth.signIn")}</h1>

        <p className="login-subtitle">
          {t("auth.signInSubtitle")}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              {t("auth.email")}
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              {t("auth.password")}
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Sign In Button */}
          <div className="login-button-container">
            <button
              className="login-button"
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Signing in..."
                : t("auth.signIn")}
            </button>
          </div>

          {/* Register */}
          <p className="auth-switch">
            {t("auth.noAccount")}{" "}
            <Link to="/register">
              {t("auth.createOne")}
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
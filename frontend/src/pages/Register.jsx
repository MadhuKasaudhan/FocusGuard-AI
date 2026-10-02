import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || t("auth.failedRegister"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{t("auth.register")}</h1>
        <p className="login-subtitle">{t("auth.registerSubtitle")}</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">{t("auth.fullName")}</label>
            <input
              id="name"
              type="text"
              placeholder={t("auth.fullName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t("auth.email")}</label>
            <input
              id="email"
              type="email"
              placeholder={t("auth.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t("auth.password")}</label>
            <input
              id="password"
              type="password"
              placeholder={t("auth.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="login-button-container">
            <button className="login-button" type="submit" disabled={submitting}>
              {submitting ? t("auth.registering") : t("auth.register")}
            </button>
          </div>

          <p className="auth-switch">
            {t("auth.haveAccount")} <Link to="/login">{t("auth.signIn")}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
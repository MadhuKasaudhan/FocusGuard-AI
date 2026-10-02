import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-loading">{t("common.loading")}</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

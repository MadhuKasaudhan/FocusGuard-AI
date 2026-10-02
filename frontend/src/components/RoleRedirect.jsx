
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  isSuperAdmin,
  isSubAdmin,
} from "../utils/roles";

export default function RoleRedirect() {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isSuperAdmin(user)) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  if (isSubAdmin(user)) {
    return (
      <Navigate
        to="/subadmin/dashboard"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/dashboard"
      replace
    />
  );
}
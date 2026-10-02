import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Users, Trash2, UserPlus, Copy } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const ROLE_OPTIONS = ["user", "subadmin", "superadmin"];

export default function Admin() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const { data: users, loading, error, refetch } = useFetch("/admin/users");
  const [busyId, setBusyId] = useState(null);

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState(null);
  const [inviteError, setInviteError] = useState("");

  const isSuperadmin = currentUser?.role === "superadmin";

  async function handleInvite(e) {
    e.preventDefault();
    setInviting(true);
    setInviteError("");
    setInviteResult(null);
    try {
      const { data } = await api.post("/admin/invite", { name: inviteName, email: inviteEmail });
      setInviteResult(data);
      setInviteName("");
      setInviteEmail("");
      refetch();
    } catch (err) {
      setInviteError(err.response?.data?.detail || t("admin.failedInvite"));
    } finally {
      setInviting(false);
    }
  }

  function copyPassword() {
    if (inviteResult) navigator.clipboard.writeText(inviteResult.temporary_password);
  }

  async function handleToggleActive(u) {
    setBusyId(u.id);
    try {
      await api.patch(`/admin/users/${u.id}/status`, { is_active: !u.is_active });
      refetch();
    } catch (err) {
      alert(err.response?.data?.detail || t("admin.failedUpdateStatus"));
    } finally {
      setBusyId(null);
    }
  }

  async function handleRoleChange(u, newRole) {
    setBusyId(u.id);
    try {
      await api.patch(`/admin/users/${u.id}/role`, { role: newRole });
      refetch();
    } catch (err) {
      alert(err.response?.data?.detail || t("admin.failedUpdateRole"));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(u) {
    if (!window.confirm(t("admin.deleteConfirm", { email: u.email }))) return;
    setBusyId(u.id);
    try {
      await api.delete(`/admin/users/${u.id}`);
      refetch();
    } catch (err) {
      alert(err.response?.data?.detail || t("admin.failedDeleteUser"));
    } finally {
      setBusyId(null);
    }
  }

  if (currentUser && currentUser.role === "user") {
    return (
      <div className="page">
        <h1>{t("admin.title")}</h1>
        <p className="empty-note">{t("admin.noPermission")}</p>
      </div>
    );
  }

  return (
    <div className="page page-wide">
      <h1>
        <Users size={20} style={{ verticalAlign: "-3px", marginRight: 8 }} />
        {t("admin.title")}
      </h1>
      <p className="page-subtitle">
        {isSuperadmin ? t("admin.manageAllAccounts") : t("admin.manageRegularUsers")}
      </p>

      <div className="panel">
        <h2>
          <UserPlus size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />
          {t("admin.inviteUser")}
        </h2>
        <p className="insight-summary" style={{ marginBottom: 12 }}>
          {t("admin.inviteDescription")}
        </p>
        <form className="inline-form" onSubmit={handleInvite}>
          <label>
            {t("admin.name")}
            <input type="text" value={inviteName} onChange={(e) => setInviteName(e.target.value)} required />
          </label>
          <label>
            {t("admin.email")}
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
          </label>
          <button className="btn-primary" type="submit" disabled={inviting}>
            {inviting ? t("admin.inviting") : t("admin.sendInvite")}
          </button>
        </form>

        {inviteError && <p className="auth-error" style={{ marginTop: 10 }}>{inviteError}</p>}

        {inviteResult && (
          <div className="invite-result">
            <div>
              {t("admin.inviteCreatedFor", { email: inviteResult.email })}
            </div>
            <div className="invite-password-row">
              <code>{inviteResult.temporary_password}</code>
              <button className="btn-ghost" onClick={copyPassword} title={t("common.copy")}>
                <Copy size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {loading && <p className="empty-note">{t("admin.loadingUsers")}</p>}
      {error && <p className="empty-note">{t("admin.couldntLoadUsers")}</p>}

      {users && (
        <div className="panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("admin.nameColumn")}</th>
                <th>{t("admin.emailColumn")}</th>
                <th>{t("admin.roleColumn")}</th>
                <th>{t("admin.statusColumn")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    {isSuperadmin ? (
                      <select
                        value={u.role}
                        disabled={busyId === u.id || u.id === currentUser.id}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {t(`roles.${r}`)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="pattern-badge">{t(`roles.${u.role}`)}</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${u.is_active ? "badge-success" : "badge-muted"}`}>
                      {u.is_active ? t("common.active") : t("common.inactive")}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn-ghost"
                      disabled={busyId === u.id || u.id === currentUser.id}
                      onClick={() => handleToggleActive(u)}
                    >
                      {u.is_active ? t("admin.deactivate") : t("admin.activate")}
                    </button>
                    {isSuperadmin && u.id !== currentUser.id && (
                      <button
                        className="btn-ghost"
                        disabled={busyId === u.id}
                        onClick={() => handleDelete(u)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="empty-note">No users to show.</p>}
        </div>
      )}
    </div>
  );
}

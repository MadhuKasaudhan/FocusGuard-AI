import { useEffect, useState } from "react";
import api from "../../api/client";
import { useTranslation } from "react-i18next";

export default function AdminUsers() {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Loading users...");

      const response = await api.get("/admin/users");

      console.log("Users API response:", response.data);

      // Backend may return either an array or { users: [...] }
      const data = response.data;

      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (Array.isArray(data.items)) {
        setUsers(data.items);
      } else {
        console.error("Unexpected users response:", data);
        setUsers([]);
        setError("Invalid users response from server.");
      }
    } catch (err) {
      console.error("Failed to load users:", err);
      console.error("Status:", err.response?.status);
      console.error("Response:", err.response?.data);

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (user) => {
    try {
      await api.patch(`/admin/users/${user.id}/status`, {
        is_active: !user.is_active,
      });

      await loadUsers();
    } catch (err) {
      console.error("Status update failed:", err);
      alert(
        err.response?.data?.detail ||
          "Failed to update user status."
      );
    }
  };

  const deleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.email}?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/admin/users/${user.id}`);

      await loadUsers();
    } catch (err) {
      console.error("Delete failed:", err);

      alert(
        err.response?.data?.detail ||
          "Failed to delete user."
      );
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Manage Users</h1>
          <p style={styles.loading}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Manage Users</h1>
          <p style={styles.subtitle}>
            Manage user accounts, roles and account status.
          </p>
        </div>

        <button
          onClick={loadUsers}
          style={styles.refreshButton}
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <strong>Error:</strong> {error}

          <button
            onClick={loadUsers}
            style={styles.retryButton}
          >
            Retry
          </button>
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Change Status</th>
                <th style={styles.th}>Delete</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={styles.empty}
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td style={styles.td}>
                      {user.id}
                    </td>

                    <td style={styles.td}>
                      {user.name || "N/A"}
                    </td>

                    <td style={styles.td}>
                      {user.email || "N/A"}
                    </td>

                    <td style={styles.td}>
                      <span style={styles.role}>
                        {user.role || "user"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.status,
                          backgroundColor: user.is_active
                            ? "#dcfce7"
                            : "#fee2e2",
                          color: user.is_active
                            ? "#15803d"
                            : "#dc2626",
                        }}
                      >
                        {user.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <button
                        onClick={() =>
                          toggleStatus(user)
                        }
                        style={{
                          ...styles.statusButton,
                          backgroundColor: user.is_active
                            ? "#f59e0b"
                            : "#16a34a",
                        }}
                      >
                        {user.is_active
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>

                    <td style={styles.td}>
                      <button
                        onClick={() =>
                          deleteUser(user)
                        }
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "32px",
    minHeight: "100vh",
    background: "var(--bg, #f5f7fb)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "700",
    color: "var(--text, #111827)",
  },

  subtitle: {
    marginTop: "8px",
    color: "var(--text-muted, #64748b)",
    fontSize: "15px",
  },

  refreshButton: {
    padding: "10px 18px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    padding: "14px",
    textAlign: "left",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #e5e7eb",
    color: "#334155",
  },

  role: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#ede9fe",
    color: "#6d28d9",
    fontSize: "13px",
    fontWeight: "600",
  },

  status: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  statusButton: {
    border: "none",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  deleteButton: {
    border: "none",
    background: "#dc2626",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  loading: {
    color: "#64748b",
    fontSize: "16px",
  },

  empty: {
    padding: "30px",
    textAlign: "center",
    color: "#64748b",
  },

  errorBox: {
    marginBottom: "20px",
    padding: "14px 18px",
    borderRadius: "8px",
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
  },

  retryButton: {
    marginLeft: "15px",
    padding: "7px 14px",
    border: "none",
    borderRadius: "6px",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
  },
};
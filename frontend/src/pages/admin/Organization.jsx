import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import api from "../../api/client";

export default function Organization() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);

      const res = await api.get("/organizations");

      console.log("Organizations:", res.data);
      setOrganizations(res.data);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.detail ||
          "Unable to load organizations."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteOrganization = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this organization?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/organizations/${id}`);

      // Refresh list after deletion
      loadOrganizations();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.detail ||
          "Delete failed."
      );
    }
  };

  return (
    <div className="organization-page">

      {/* ================= HEADER ================= */}
      <div className="organization-header">

        <div>
          <h1>Organizations</h1>

          <p>
            Manage all organizations registered in
            FocusGuard AI.
          </p>
        </div>

        <Link
          to="/admin/create-organization"
          className="create-org-btn"
        >
          <Plus size={18} />
          Create Organization
        </Link>

      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="organization-card">

        {loading ? (
          <div className="loading">
            Loading organizations...
          </div>
        ) : (
          <div className="table-container">

            <table className="organization-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Organization</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Website</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {organizations.length > 0 ? (

                  organizations.map((org) => (

                    <tr key={org.id}>

                      {/* ID */}
                      <td>
                        <span className="org-id">
                          #{org.id}
                        </span>
                      </td>

                      {/* NAME */}
                      <td>
                        <div className="org-name">
                          {org.name}
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td>
                        {org.company_email || "N/A"}
                      </td>

                      {/* PHONE */}
                      <td>
                        {org.phone || "N/A"}
                      </td>

                      {/* WEBSITE */}
                      <td>
                        {org.website || "N/A"}
                      </td>

                      {/* ADDRESS */}
                      <td>
                        {org.address || "N/A"}
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={
                            org.is_active
                              ? "status active"
                              : "status inactive"
                          }
                        >
                          {org.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* ================= ACTIONS ================= */}
                      <td>

                        <div className="action-buttons">

                          {/* VIEW */}
                          <Link
                            to={`/admin/organization/${org.id}`}
                            className="action-btn view-btn"
                            title="View Organization"
                          >
                            <Eye size={16} />
                            <span>View</span>
                          </Link>

                          {/* EDIT */}
                          <Link
                            to={`/admin/edit-organization/${org.id}`}
                            className="action-btn edit-btn"
                            title="Edit Organization"
                          >
                            <Edit size={16} />
                            <span>Edit</span>
                          </Link>

                          {/* DELETE */}
                          <button
                            className="action-btn delete-btn"
                            onClick={() =>
                              deleteOrganization(org.id)
                            }
                            title="Delete Organization"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="8"
                      className="empty-state"
                    >
                      No organizations found.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ================= CSS ================= */}
      <style>{`

        * {
          box-sizing: border-box;
        }

        .organization-page {
          min-height: 100vh;
          padding: 30px;
          background: #f5f7fb;
        }

        /* HEADER */

        .organization-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          gap: 20px;
        }

        .organization-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: #111827;
        }

        .organization-header p {
          margin: 7px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        /* CREATE BUTTON */

        .create-org-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 18px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          transition: 0.2s ease;
          white-space: nowrap;
        }

        .create-org-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        /* TABLE CARD */

        .organization-card {
          background: white;
          border-radius: 14px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }

        .table-container {
          width: 100%;
          overflow-x: auto;
        }

        /* TABLE */

        .organization-table {
          width: 100%;
          min-width: 1000px;
          border-collapse: collapse;
        }

        .organization-table thead {
          background: #f8fafc;
        }

        .organization-table th {
          padding: 15px 14px;
          text-align: left;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          border-bottom: 1px solid #e5e7eb;
          white-space: nowrap;
        }

        .organization-table td {
          padding: 15px 14px;
          font-size: 13px;
          color: #374151;
          border-bottom: 1px solid #eef0f3;
          vertical-align: middle;
        }

        .organization-table tbody tr {
          transition: background 0.2s ease;
        }

        .organization-table tbody tr:hover {
          background: #f8fafc;
        }

        .organization-table tbody tr:last-child td {
          border-bottom: none;
        }

        /* ORGANIZATION NAME */

        .org-name {
          font-weight: 600;
          color: #111827;
          min-width: 150px;
        }

        /* ID */

        .org-id {
          color: #64748b;
          font-weight: 600;
        }

        /* STATUS */

        .status {
          display: inline-flex;
          align-items: center;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status.active {
          background: #dcfce7;
          color: #15803d;
        }

        .status.inactive {
          background: #fee2e2;
          color: #dc2626;
        }

        /* ================= ACTION BUTTONS ================= */

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;

          height: 34px;
          padding: 0 11px;

          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;

          text-decoration: none;
          cursor: pointer;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease,
            transform 0.15s ease;
        }

        .action-btn:hover {
          transform: translateY(-1px);
        }

        /* VIEW */

        .view-btn {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .view-btn:hover {
          background: #dbeafe;
          color: #1d4ed8;
        }

        /* EDIT */

        .edit-btn {
          background: #f5f3ff;
          color: #7c3aed;
          border: 1px solid #ddd6fe;
        }

        .edit-btn:hover {
          background: #ede9fe;
          color: #6d28d9;
        }

        /* DELETE */

        .delete-btn {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .delete-btn:hover {
          background: #fee2e2;
          color: #b91c1c;
        }

        /* LOADING */

        .loading {
          padding: 50px;
          text-align: center;
          color: #64748b;
          font-size: 15px;
        }

        /* EMPTY */

        .empty-state {
          text-align: center !important;
          padding: 50px !important;
          color: #64748b !important;
        }

        /* RESPONSIVE */

        @media (max-width: 768px) {

          .organization-page {
            padding: 20px;
          }

          .organization-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .create-org-btn {
            width: 100%;
            justify-content: center;
          }

        }

      `}</style>

    </div>
  );
}
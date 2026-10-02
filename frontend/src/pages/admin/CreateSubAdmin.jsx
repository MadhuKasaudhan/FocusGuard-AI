import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function CreateSubAdmin() {
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState([]);
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organization_id: "",
    is_active: true,
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // -----------------------------------------
  // Load organizations
  // -----------------------------------------
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get("/organizations/");

      setOrganizations(response.data || []);
    } catch (error) {
      console.error(
        "Organization error:",
        error.response?.data || error
      );

      setMessage({
        type: "error",
        text: "Unable to load organizations.",
      });
    } finally {
      setLoadingOrganizations(false);
    }
  };

  // -----------------------------------------
  // Handle form changes
  // -----------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  // -----------------------------------------
  // Submit
  // -----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    // Validation
    if (!form.name.trim()) {
      setMessage({
        type: "error",
        text: "Please enter the sub admin name.",
      });
      return;
    }

    if (!form.email.trim()) {
      setMessage({
        type: "error",
        text: "Please enter the email address.",
      });
      return;
    }

    if (!form.password) {
      setMessage({
        type: "error",
        text: "Please enter a password.",
      });
      return;
    }

    if (form.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must contain at least 6 characters.",
      });
      return;
    }

    if (!form.organization_id) {
      setMessage({
        type: "error",
        text: "Please select an organization.",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        organization_id: Number(form.organization_id),
        role: "subadmin",
        is_active: form.is_active,
      };

      console.log("Create Sub Admin Payload:", payload);

      /*
       * Change this endpoint if your backend
       * uses another URL.
       */
      await api.post("/admin/sub-admins", payload);

      setMessage({
        type: "success",
        text: "Sub Admin created successfully.",
      });

      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",
        organization_id: "",
        is_active: true,
      });
    } catch (error) {
      console.error(
        "Create Sub Admin error:",
        error.response?.data || error
      );

      const detail = error.response?.data?.detail;

      setMessage({
        type: "error",
        text:
          typeof detail === "string"
            ? detail
            : "Unable to create Sub Admin. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Find selected organization
  // -----------------------------------------
  const selectedOrganization = organizations.find(
    (organization) =>
      String(organization.id) ===
      String(form.organization_id)
  );

  // -----------------------------------------
  // UI
  // -----------------------------------------
  return (
    <div className="subadmin-page">
      <div className="subadmin-container">

        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Create Sub Admin</h1>

            <p>
              Create an administrator account and assign it
              to an organization.
            </p>
          </div>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/admin")}
          >
            ← Back
          </button>
        </div>

        {/* Main Card */}
        <div className="subadmin-card">

          {/* Message */}
          {message.text && (
            <div
              className={`message ${
                message.type === "success"
                  ? "success-message"
                  : "error-message"
              }`}
            >
              <span className="message-icon">
                {message.type === "success" ? "✓" : "!"}
              </span>

              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Account Information */}
            <div className="section-title">
              Account Information
            </div>

            <div className="form-grid">

              {/* Name */}
              <div className="form-group">
                <label htmlFor="name">
                  Full Name <span>*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                />

                <small>
                  Enter the name of the Sub Admin.
                </small>
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">
                  Email Address <span>*</span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                />

                <small>
                  This email will be used for login.
                </small>
              </div>

            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">
                Temporary Password <span>*</span>
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter temporary password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />

              <small>
                Password must contain at least 6 characters.
              </small>
            </div>

            {/* Organization */}
            <div className="section-title organization-title">
              Organization & Access
            </div>

            <div className="form-group">
              <label htmlFor="organization_id">
                Organization <span>*</span>
              </label>

              <select
                id="organization_id"
                name="organization_id"
                value={form.organization_id}
                onChange={handleChange}
                disabled={
                  loading || loadingOrganizations
                }
              >
                <option value="">
                  {loadingOrganizations
                    ? "Loading organizations..."
                    : "Select organization"}
                </option>

                {organizations.map((organization) => (
                  <option
                    key={organization.id}
                    value={organization.id}
                  >
                    {organization.name}
                  </option>
                ))}
              </select>

              <small>
                The Sub Admin will manage users belonging
                to this organization.
              </small>
            </div>

            {/* Role */}
            <div className="form-group">
              <label>
                Role
              </label>

              <div className="role-box">
                <div className="role-icon">
                  🛡
                </div>

                <div>
                  <strong>Sub Admin</strong>

                  <p>
                    Organization-level administrator
                  </p>
                </div>
              </div>
            </div>

            {/* Active Status */}
            <div className="form-group">

              <label className="checkbox-label">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  disabled={loading}
                />

                <span>
                  Keep Sub Admin account active
                </span>

              </label>

              <small>
                Inactive accounts cannot log in.
              </small>
            </div>

            {/* Summary */}
            <div className="summary-box">

              <div className="summary-header">
                <span>Sub Admin Summary</span>
              </div>

              <div className="summary-row">
                <span>Name</span>

                <strong>
                  {form.name || "Not provided"}
                </strong>
              </div>

              <div className="summary-row">
                <span>Email</span>

                <strong>
                  {form.email || "Not provided"}
                </strong>
              </div>

              <div className="summary-row">
                <span>Role</span>

                <strong>
                  Sub Admin
                </strong>
              </div>

              <div className="summary-row">
                <span>Organization</span>

                <strong>
                  {selectedOrganization?.name ||
                    "Not selected"}
                </strong>
              </div>

              <div className="summary-row">
                <span>Status</span>

                <strong
                  className={
                    form.is_active
                      ? "active-text"
                      : "inactive-text"
                  }
                >
                  {form.is_active
                    ? "Active"
                    : "Inactive"}
                </strong>
              </div>

            </div>

            {/* Actions */}
            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/admin")}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    🛡 Create Sub Admin
                  </>
                )}
              </button>

            </div>

          </form>
        </div>

        {/* Information */}
        <div className="info-box">

          <div className="info-icon">
            ⓘ
          </div>

          <div>
            <strong>
              Sub Admin permissions
            </strong>

            <p>
              A Sub Admin manages users and activities
              within the organization assigned by the
              Super Admin. They do not have access to
              Super Admin-level organization management.
            </p>
          </div>

        </div>

      </div>

      {/* CSS */}
      <style>{`

        * {
          box-sizing: border-box;
        }

        .subadmin-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding: 40px 30px;
        }

        .subadmin-container {
          max-width: 850px;
          margin: 0 auto;
        }

        /* Header */

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .page-header h1 {
          margin: 0;
          color: #111827;
          font-size: 32px;
          font-weight: 700;
        }

        .page-header p {
          margin-top: 8px;
          color: #6b7280;
          font-size: 15px;
        }

        .back-button {
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .back-button:hover {
          background: #f3f4f6;
        }

        /* Card */

        .subadmin-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 32px;
          box-shadow:
            0 4px 18px rgba(0, 0, 0, 0.05);
        }

        /* Messages */

        .message {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          font-size: 14px;
          font-weight: 500;
        }

        .success-message {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .error-message {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .message-icon {
          font-weight: bold;
        }

        /* Section */

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          padding-bottom: 12px;
          margin-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .organization-title {
          margin-top: 32px;
        }

        /* Form */

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 22px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #111827;
          font-size: 14px;
          font-weight: 600;
        }

        .form-group label span {
          color: #dc2626;
          margin-left: 3px;
        }

        .form-group input[type="text"],
        .form-group input[type="email"],
        .form-group input[type="password"],
        .form-group select {
          width: 100%;
          height: 46px;
          padding: 0 13px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          color: #111827;
          font-size: 14px;
          outline: none;
          transition: 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #4f46e5;
          box-shadow:
            0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .form-group input:disabled,
        .form-group select:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        .form-group small {
          display: block;
          margin-top: 6px;
          color: #6b7280;
          font-size: 12px;
        }

        /* Role */

        .role-box {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 15px;
          background: #f5f3ff;
          border: 1px solid #ddd6fe;
          border-radius: 9px;
        }

        .role-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #7c3aed;
          color: white;
          font-size: 20px;
        }

        .role-box strong {
          color: #4c1d95;
          font-size: 14px;
        }

        .role-box p {
          margin: 3px 0 0;
          color: #6b7280;
          font-size: 12px;
        }

        /* Checkbox */

        .checkbox-label {
          display: flex !important;
          align-items: center;
          gap: 9px;
          cursor: pointer;
        }

        .checkbox-label input {
          width: 17px;
          height: 17px;
          accent-color: #4f46e5;
          cursor: pointer;
        }

        /* Summary */

        .summary-box {
          background: #f8f9ff;
          border: 1px solid #e0e7ff;
          border-radius: 10px;
          padding: 20px;
          margin-top: 30px;
          margin-bottom: 28px;
        }

        .summary-header {
          color: #312e81;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-row span {
          color: #6b7280;
        }

        .summary-row strong {
          color: #111827;
          text-align: right;
          word-break: break-word;
        }

        .active-text {
          color: #059669 !important;
        }

        .inactive-text {
          color: #dc2626 !important;
        }

        /* Buttons */

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .cancel-button,
        .create-button {
          min-width: 140px;
          height: 44px;
          padding: 0 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .cancel-button {
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
        }

        .cancel-button:hover {
          background: #f3f4f6;
        }

        .create-button {
          border: none;
          background: #4f46e5;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .create-button:hover {
          background: #4338ca;
        }

        .create-button:disabled,
        .cancel-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Spinner */

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Info */

        .info-box {
          margin-top: 20px;
          padding: 18px 20px;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          border-radius: 10px;
          display: flex;
          gap: 14px;
          color: #3730a3;
        }

        .info-icon {
          font-size: 20px;
        }

        .info-box strong {
          font-size: 14px;
        }

        .info-box p {
          margin: 6px 0 0;
          color: #4f46e5;
          font-size: 13px;
          line-height: 1.5;
        }

        /* Responsive */

        @media (max-width: 650px) {

          .subadmin-page {
            padding: 25px 15px;
          }

          .page-header {
            align-items: flex-start;
            gap: 15px;
          }

          .page-header h1 {
            font-size: 26px;
          }

          .subadmin-card {
            padding: 22px;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .summary-row {
            flex-direction: column;
            gap: 4px;
          }

          .summary-row strong {
            text-align: left;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .cancel-button,
          .create-button {
            width: 100%;
          }
        }

      `}</style>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function InviteUser() {
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState([]);
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    organization_id: "",
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // --------------------------------------------------
  // Load organizations
  // --------------------------------------------------
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get("/organizations/");

      setOrganizations(response.data || []);
    } catch (error) {
      console.error(
        "Organization loading error:",
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

  // --------------------------------------------------
  // Handle input
  // --------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
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
        text: "Please enter the user's name.",
      });
      return;
    }

    if (!form.email.trim()) {
      setMessage({
        type: "error",
        text: "Please enter the user's email.",
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
        role: form.role,
        organization_id: Number(form.organization_id),
      };

      console.log("Invite payload:", payload);

      // Backend endpoint
      await api.post("/admin/invite", payload);

      setMessage({
        type: "success",
        text: "User invitation sent successfully.",
      });

      // Reset form
      setForm({
        name: "",
        email: "",
        role: "user",
        organization_id: "",
      });
    } catch (error) {
      console.error(
        "Invite user error:",
        error.response?.data || error
      );

      const detail = error.response?.data?.detail;

      setMessage({
        type: "error",
        text:
          typeof detail === "string"
            ? detail
            : "Unable to send invitation. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // JSX
  // --------------------------------------------------
  return (
    <div className="invite-page">
      <div className="invite-container">

        {/* Header */}
        <div className="invite-header">
          <div>
            <h1>Invite User</h1>
            <p>
              Add a new user to an organization and assign their role.
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

        {/* Card */}
        <div className="invite-card">

          {/* Message */}
          {message.text && (
            <div
              className={`message ${
                message.type === "success"
                  ? "success-message"
                  : "error-message"
              }`}
            >
              <span>
                {message.type === "success" ? "✓" : "!"}
              </span>

              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">
                Full Name
                <span>*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter user's full name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
              />

              <small>
                Enter the name of the user you want to invite.
              </small>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                Email Address
                <span>*</span>
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
              />

              <small>
                The invitation will be associated with this email.
              </small>
            </div>

            {/* Organization */}
            <div className="form-group">
              <label htmlFor="organization_id">
                Organization
                <span>*</span>
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
                Select the organization where this user belongs.
              </small>
            </div>

            {/* Role */}
            <div className="form-group">
              <label htmlFor="role">
                User Role
                <span>*</span>
              </label>

              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="user">
                  User
                </option>

                <option value="subadmin">
                  Sub Admin
                </option>
              </select>

              <small>
                Sub Admins can manage users within their assigned
                organization.
              </small>
            </div>

            {/* Summary */}
            <div className="invite-summary">
              <div className="summary-title">
                Invitation Summary
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
                  {form.role === "subadmin"
                    ? "Sub Admin"
                    : "User"}
                </strong>
              </div>

              <div className="summary-row">
                <span>Organization</span>
                <strong>
                  {form.organization_id
                    ? organizations.find(
                        (org) =>
                          String(org.id) ===
                          String(form.organization_id)
                      )?.name || "Selected"
                    : "Not selected"}
                </strong>
              </div>
            </div>

            {/* Buttons */}
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
                className="invite-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    ✉ Send Invitation
                  </>
                )}
              </button>

            </div>
          </form>
        </div>

        {/* Information */}
        <div className="invite-info">
          <div className="info-icon">ⓘ</div>

          <div>
            <strong>How invitations work</strong>

            <p>
              The invited user will receive access based on the
              selected role and organization. Make sure the email
              address is correct before sending the invitation.
            </p>
          </div>
        </div>

      </div>

      {/* Page CSS */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        .invite-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding: 40px 30px;
        }

        .invite-container {
          max-width: 850px;
          margin: 0 auto;
        }

        /* Header */

        .invite-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .invite-header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          color: #111827;
        }

        .invite-header p {
          margin: 8px 0 0;
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
          transition: 0.2s;
        }

        .back-button:hover {
          background: #f3f4f6;
        }

        /* Card */

        .invite-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 32px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
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

        /* Form */

        .form-group {
          margin-bottom: 23px;
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

        .form-group input,
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
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
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

        /* Summary */

        .invite-summary {
          margin-top: 28px;
          margin-bottom: 28px;
          padding: 20px;
          background: #f8f9ff;
          border: 1px solid #e0e7ff;
          border-radius: 10px;
        }

        .summary-title {
          font-size: 15px;
          font-weight: 700;
          color: #312e81;
          margin-bottom: 15px;
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

        /* Buttons */

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
        }

        .cancel-button,
        .invite-button {
          min-width: 130px;
          height: 44px;
          padding: 0 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .cancel-button {
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
        }

        .cancel-button:hover {
          background: #f3f4f6;
        }

        .invite-button {
          border: none;
          background: #4f46e5;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .invite-button:hover {
          background: #4338ca;
        }

        .invite-button:disabled,
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

        /* Information box */

        .invite-info {
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

        .invite-info strong {
          font-size: 14px;
        }

        .invite-info p {
          margin: 6px 0 0;
          color: #4f46e5;
          font-size: 13px;
          line-height: 1.5;
        }

        /* Responsive */

        @media (max-width: 650px) {
          .invite-page {
            padding: 25px 15px;
          }

          .invite-header {
            align-items: flex-start;
            gap: 15px;
          }

          .invite-header h1 {
            font-size: 26px;
          }

          .invite-card {
            padding: 22px;
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
          .invite-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
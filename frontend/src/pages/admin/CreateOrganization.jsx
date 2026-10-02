import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  ArrowLeft,
  Save,
} from "lucide-react";
import api from "../../api/client";
import "./CreateOrganization.css";


export default function CreateOrganization() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    company_email: "",
    phone: "",
    website: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Organization name is required.";
    }

    if (!formData.company_email.trim()) {
      newErrors.company_email = "Company email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company_email)
    ) {
      newErrors.company_email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must contain 10 digits.";
    }

    if (formData.website.trim()) {
      if (
        !/^https?:\/\/.+/i.test(formData.website.trim())
      ) {
        newErrors.website =
          "Website must start with http:// or https://";
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await api.post("/organizations/", {
        name: formData.name.trim(),
        company_email: formData.company_email.trim(),
        phone: formData.phone.trim(),
        website: formData.website.trim() || null,
        address: formData.address.trim(),
      });

      alert("Organization created successfully!");

      navigate("/admin/organizations");
    } catch (err) {
      console.error("Create organization error:", err);

      const message =
        err.response?.data?.detail ||
        "Unable to create organization.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="organization-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/admin/dashboard">
              Admin Dashboard
            </Link>

            <span>/</span>

            <span>Create Organization</span>
          </div>

          <h1>Create Organization</h1>

          <p>
            Add a new organization to your FocusGuard AI platform.
          </p>
        </div>

        <Link
          to="/admin/organizations"
          className="back-button"
        >
          <ArrowLeft size={17} />
          Back to Organizations
        </Link>
      </div>

      {/* Form Card */}
      <div className="form-card">

        <div className="form-card-header">
          <div className="header-icon">
            <Building2 size={24} />
          </div>

          <div>
            <h2>Organization Information</h2>
            <p>
              Enter the details of the organization below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Organization Name */}
          <div className="form-group">
            <label htmlFor="name">
              Organization Name
              <span className="required">*</span>
            </label>

            <div className="input-wrapper">
              <Building2 size={18} />

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter organization name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {errors.name && (
              <span className="error-message">
                {errors.name}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="company_email">
              Company Email
              <span className="required">*</span>
            </label>

            <div className="input-wrapper">
              <Mail size={18} />

              <input
                id="company_email"
                type="email"
                name="company_email"
                placeholder="admin@company.com"
                value={formData.company_email}
                onChange={handleChange}
              />
            </div>

            {errors.company_email && (
              <span className="error-message">
                {errors.company_email}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">
              Phone Number
              <span className="required">*</span>
            </label>

            <div className="input-wrapper">
              <Phone size={18} />

              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="9876543210"
                maxLength="10"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {errors.phone && (
              <span className="error-message">
                {errors.phone}
              </span>
            )}
          </div>

          {/* Website */}
          <div className="form-group">
            <label htmlFor="website">
              Website
              <span className="optional">
                Optional
              </span>
            </label>

            <div className="input-wrapper">
              <Globe size={18} />

              <input
                id="website"
                type="url"
                name="website"
                placeholder="https://company.com"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            {errors.website && (
              <span className="error-message">
                {errors.website}
              </span>
            )}
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="address">
              Address
              <span className="required">*</span>
            </label>

            <div className="input-wrapper textarea-wrapper">
              <MapPin size={18} />

              <textarea
                id="address"
                name="address"
                placeholder="Enter organization address"
                rows="4"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {errors.address && (
              <span className="error-message">
                {errors.address}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="form-actions">

            <Link
              to="/admin/organizations"
              className="cancel-button"
            >
              Cancel
            </Link>

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
                  <Save size={18} />
                  Create Organization
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
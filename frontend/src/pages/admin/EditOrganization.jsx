import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";

export default function EditOrganization() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    company_email: "",
    phone: "",
    address: "",
    is_active: true,
  });

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = async () => {
    try {
      const { data } = await api.get(`/organizations/${id}`);

      setFormData({
        name: data.name || "",
        company_email: data.company_email || "",
        phone: data.phone || "",
        address: data.address || "",
        is_active: data.is_active,
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to load organization");
      navigate("/admin/organizations");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/organizations/${id}`, formData);

      alert("Organization updated successfully.");

      navigate(`/admin/organizations/${id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to update organization");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Edit Organization</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Organization Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="company_email"
          placeholder="Company Email"
          value={formData.company_email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
          Active
        </label>

        <button type="submit">Update Organization</button>

        <button
          type="button"
          onClick={() => navigate("/admin/organizations")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
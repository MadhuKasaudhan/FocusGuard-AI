import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/client";

export default function OrganizationDetails() {
  const { id } = useParams();
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    loadOrganization();
  }, []);

 const loadOrganization = async () => {
  try {
    console.log("Organization ID:", id);

    const res = await api.get(`/organizations/${id}`);

    console.log("Response:", res.data);

    setOrganization(res.data);
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.detail || "Unable to load organization");
  }
};

  if (!organization) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Organization Details</h1>

      <p>
        <strong>ID:</strong> {organization.id}
      </p>

      <p>
        <strong>Name:</strong> {organization.name}
      </p>

      <p>
        <strong>Email:</strong> {organization.company_email || "N/A"}
      </p>

      <p>
        <strong>Phone:</strong> {organization.phone || "N/A"}
      </p>

      <p>
        <strong>Website:</strong> {organization.website || "N/A"}
      </p>

      <p>
        <strong>Address:</strong> {organization.address || "N/A"}
      </p>

      <div style={{ marginTop: "20px" }}>
        <Link to={`/admin/edit-organization/${organization.id}`}>
          <button
            style={{
              marginRight: "10px",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        </Link>

        <Link to="/admin/organizations">
          <button
            style={{
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Back
          </button>
        </Link>
      </div>
    </div>
  );
}
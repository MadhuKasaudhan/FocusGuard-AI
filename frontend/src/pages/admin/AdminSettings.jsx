import { useState } from "react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    name: "Madhu",
    email: "madhu@test.com",
    theme: "Light",
    language: "English",
    notifications: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveSettings = () => {
    if (
      settings.newPassword &&
      settings.newPassword !== settings.confirmPassword
    ) {
      alert("New Password and Confirm Password do not match.");
      return;
    }

    alert("Settings saved successfully!");
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <h1>Admin Settings</h1>

      <div
        style={{
          background: "#fff",
          marginTop: 20,
          padding: 25,
          borderRadius: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,.08)",
        }}
      >
        <h2>Profile Information</h2>

        <label>Name</label>
        <input
          type="text"
          name="name"
          value={settings.name}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={settings.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <h2 style={{ marginTop: 30 }}>Appearance</h2>

        <label>Theme</label>
        <select
          name="theme"
          value={settings.theme}
          onChange={handleChange}
          style={inputStyle}
        >
          <option>Light</option>
          <option>Dark</option>
          <option>System</option>
        </select>

        <label>Language</label>
        <select
          name="language"
          value={settings.language}
          onChange={handleChange}
          style={inputStyle}
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Telugu</option>
          <option>Tamil</option>
          <option>Malayalam</option>
        </select>

        <h2 style={{ marginTop: 30 }}>Notifications</h2>

        <label>
          <input
            type="checkbox"
            name="notifications"
            checked={settings.notifications}
            onChange={handleChange}
          />
          Enable Email Notifications
        </label>

        <h2 style={{ marginTop: 30 }}>Change Password</h2>

        <label>Current Password</label>
        <input
          type="password"
          name="currentPassword"
          value={settings.currentPassword}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>New Password</label>
        <input
          type="password"
          name="newPassword"
          value={settings.newPassword}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={settings.confirmPassword}
          onChange={handleChange}
          style={inputStyle}
        />

        <button
          onClick={saveSettings}
          style={{
            marginTop: 30,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "12px 30px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "20px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "15px",
};
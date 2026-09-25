// src/pages/SettingsPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    browserNotifications: false,
    theme: "light",
    language: "English"
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    // حفظ الإعدادات في localStorage لتطبيقها لو حابب
    localStorage.setItem("appSettings", JSON.stringify(settings));

    setSuccessMessage("Settings saved successfully! Redirecting...");
    
    // الانتقال التلقائي لصفحة الريكويست بعد ثغرة قصيرة
    setTimeout(() => {
      navigate("/requests");
    }, 1000);
  };

  return (
    <main className="requests-page">
      {/* Header */}
      <div className="requests-header mb-4">
        <div>
          <h1>Settings</h1>
          <p>Manage your application preferences and configurations</p>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMessage}
        </div>
      )}

      {/* Settings Card */}
      <section className="filters-card p-4">
        <form onSubmit={handleSave}>
          <h4 className="fw-bold mb-3">Notifications</h4>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="emailNotifications"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
            />
            <label className="form-check-label fw-semibold" htmlFor="emailNotifications">
              Email Notifications
            </label>
            <div className="text-muted small">Receive email updates when requests status changes.</div>
          </div>

          <div className="mb-4 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="browserNotifications"
              name="browserNotifications"
              checked={settings.browserNotifications}
              onChange={handleChange}
            />
            <label className="form-check-label fw-semibold" htmlFor="browserNotifications">
              Browser Push Notifications
            </label>
            <div className="text-muted small">Receive instant alerts right in your browser.</div>
          </div>

          <hr className="my-4" />

          <h4 className="fw-bold mb-3">Appearance & Preferences</h4>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-muted">Theme Mode</label>
              <select
                className="form-select"
                name="theme"
                value={settings.theme}
                onChange={handleChange}
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">System Default</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-muted">Language</label>
              <select
                className="form-select"
                name="language"
                value={settings.language}
                onChange={handleChange}
              >
                <option value="English">English</option>
                <option value="Arabic">Arabic (العربية)</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-success px-4">
              Save Settings
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default SettingsPage;
import React, { useState } from "react";

function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Omar",
    email: "omar@example.com",
    role: "Administrator",
    bio: "Frontend Developer working with React, Vite, and Bootstrap.",
    phone: "+20 123 456 7890"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <main className="requests-page">
      {/* Header */}
      <div className="requests-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal information and account settings</p>
        </div>
        {!isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            <i className="bi bi-pencil-square me-2"></i> Edit Profile
          </button>
        )}
      </div>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMessage}
        </div>
      )}

      {/* Profile Card (ماشية بنفس ستايل الـ Filters Card والجدول) */}
      <section className="filters-card p-4">
        <div className="row g-4 align-items-center mb-4">
          <div className="col-auto">
            <div 
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold display-5"
              style={{ width: "80px", height: "80px" }}
            >
              {profile.name.charAt(0)}
            </div>
          </div>
          <div className="col">
            <h3 className="fw-bold mb-1">{profile.name}</h3>
            <p className="text-muted mb-1">{profile.role}</p>
            <span className="badge bg-success text-white px-2 py-1">Active Status</span>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-muted">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={isEditing ? formData.name : profile.name}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-muted">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={isEditing ? formData.email : profile.email}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-muted">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={isEditing ? formData.phone : profile.phone}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-muted">Role / Title</label>
              <input
                type="text"
                className="form-control"
                value={profile.role}
                disabled
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold text-muted">Bio</label>
              <textarea
                className="form-control"
                rows="3"
                value={isEditing ? formData.bio : profile.bio}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              ></textarea>
            </div>

            {isEditing && (
              <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setFormData(profile);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}

export default ProfilePage;
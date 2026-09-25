// src/pages/ProfilePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "Omar",
    email: "omar@example.com",
    role: "Frontend Developer"
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // حفظ التعديلات (يمكنك تخزينها في localStorage أو الـ state العامة لو محتاج تظهر في مكان تاني)
    localStorage.setItem("userProfile", JSON.stringify(profile));
    
    setMessage("Profile updated successfully! Redirecting...");
    
    // الانتقال التلقائي لصفحة الريكويست بعد ثغرة قصيرة لرؤية التغييرات
    setTimeout(() => {
      navigate("/requests");
    }, 1000);
  };

  return (
    <main className="requests-page">
      <div className="requests-header mb-4">
        <div>
          <h1>My Profile</h1>
          <p>Manage your account details and profile information</p>
        </div>
      </div>

      {message && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}

      <section className="filters-card p-4">
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Role</label>
            <input
              type="text"
              className="form-control"
              name="role"
              value={profile.role}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary px-4">
              Save Changes
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ProfilePage;
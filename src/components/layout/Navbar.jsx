// src/components/layout/Navbar.jsx

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // إغلاق الـ dropdown لما تدوس في أي مكان برة
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="top-navbar bg-white border-bottom">
      <div className="d-flex align-items-center justify-content-between px-4 py-3">
        <div>
          <h5 className="mb-1 fw-bold">Requests</h5>
          <small className="text-muted">
            Manage and track your requests
          </small>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Profile Dropdown */}
          <div className="position-relative dropdown" ref={profileRef}>
            <button
              type="button"
              className="btn btn-light d-flex align-items-center gap-2 rounded-pill px-3 py-1 border-0"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: "35px", height: "35px" }}
              >
                O
              </div>

              <div className="d-none d-md-block text-start">
                <div className="fw-semibold lh-1">Omar</div>
                <small className="text-muted" style={{ fontSize: "11px" }}>Administrator</small>
              </div>

              <i className="bi bi-chevron-down text-muted small"></i>
            </button>

            {isProfileOpen && (
              <div className="dropdown-menu show position-absolute end-0 mt-2 shadow border-0 p-2" style={{ width: "200px" }}>
                <button 
                  className="dropdown-item rounded py-2" 
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/profile");
                  }}
                >
                  <i className="bi bi-person me-2"></i> Profile
                </button>
                <button 
                  className="dropdown-item rounded py-2" 
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/settings");
                  }}
                >
                  <i className="bi bi-gear me-2"></i> Settings
                </button>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item rounded py-2 text-danger" 
                  onClick={() => {
                    setIsProfileOpen(false);
                    alert("Logging out...");
                  }}
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Omar updated the landing page request.", time: "5m ago", read: false },
    { id: 2, text: "New request added by Ahmed.", time: "1h ago", read: false },
    { id: 3, text: "System maintenance scheduled for tonight.", time: "1d ago", read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
          {/* Notifications Dropdown */}
          <div className="position-relative dropdown">
            <button
              type="button"
              className="btn btn-light position-relative rounded-circle p-2"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              title="Notifications"
            >
              <i className="bi bi-bell fs-5"></i>
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div
                className="dropdown-menu show position-absolute end-0 mt-2 shadow border-0 p-2"
                style={{ width: "320px", zIndex: 1050 }}
              >
                <div className="d-flex justify-content-between align-items-center px-2 pb-2 border-bottom">
                  <h6 className="mb-0 fw-bold">Notifications</h6>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="btn btn-link btn-sm text-decoration-none p-0"
                      onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="notification-list py-2" style={{ maxHeight: "250px", overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <div className="text-center text-muted py-3">No notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`dropdown-item px-3 py-2 rounded mb-1 d-flex justify-content-between align-items-start ${
                          !notif.read ? "bg-light fw-bold" : ""
                        }`}
                        style={{ whiteSpace: "normal", cursor: "pointer" }}
                        onClick={() => {
                          setNotifications(
                            notifications.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                          );
                        }}
                      >
                        <div>
                          <p className="mb-1 small">{notif.text}</p>
                          <small className="text-muted" style={{ fontSize: "11px" }}>{notif.time}</small>
                        </div>
                        <button
                          type="button"
                          className="btn-close btn-close-sm ms-2"
                          aria-label="Close"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotifications(notifications.filter((n) => n.id !== notif.id));
                          }}
                        ></button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="vr"></div>

          {/* Profile Dropdown */}
          <div className="position-relative dropdown">
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
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar bg-dark text-white d-flex flex-column">
      <div className="p-4 border-bottom border-secondary">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary rounded-3 p-2">
            <i className="bi bi-grid-1x2-fill fs-5"></i>
          </div>

          <div>
            <h5 className="mb-0 fw-bold">RequestFlow</h5>
            <small className="text-secondary">Management System</small>
          </div>
        </div>
      </div>

      <nav className="p-3 flex-grow-1">
        <small className="text-uppercase text-secondary fw-semibold px-3">
          Main Menu
        </small>

        <div className="mt-3">
          <NavLink
            to="/requests"
            className={({ isActive }) =>
              `sidebar-link d-flex align-items-center gap-3 ${
                isActive ? "active" : ""
              }`
            }
          >
            <i className="bi bi-inbox fs-5"></i>
            <span>Requests</span>
          </NavLink>
        </div>
      </nav>

      <div className="p-3 border-top border-secondary">
        <div className="d-flex align-items-center gap-3 p-2">
          <div
            className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
            style={{ width: "42px", height: "42px" }}
          >
            <span className="fw-bold">O</span>
          </div>

          <div className="flex-grow-1">
            <div className="fw-semibold">Omar</div>
            <small className="text-secondary">Administrator</small>
          </div>

          <button className="btn btn-link text-secondary p-0">
            <i className="bi bi-three-dots-vertical"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Wrapper */}
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />

        {/* Page Content */}
        <main className="p-4 flex-grow-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
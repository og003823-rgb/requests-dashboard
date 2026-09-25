import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import RequestsPage from "./pages/RequestsPage";
import RequestDetailsPage from "./pages/RequestDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/requests" replace />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/requests/:id" element={<RequestDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/requests" replace />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
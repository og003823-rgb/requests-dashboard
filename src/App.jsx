// src/App.jsx

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import RequestsPage from "./pages/RequestsPage";
import RequestDetailsPage from "./pages/RequestDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { NotificationsProvider } from "./context/NotificationsContext";

function App() {
  // قراءة وتطبيق الإعدادات (Dark Mode & Language) أول ما التطبيق يفتح
  useEffect(() => {
    // 1. تطبيق الدارك مود
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    // 2. تطبيق اللغة والاتجاه (RTL / LTR)
    const savedLang = localStorage.getItem("language") || "en";
    document.documentElement.lang = savedLang;
    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
  }, []);

  return (
    <NotificationsProvider>
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
    </NotificationsProvider>
  );
}

export default App;
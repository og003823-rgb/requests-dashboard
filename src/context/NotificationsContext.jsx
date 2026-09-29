// src/context/NotificationsContext.jsx

import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import {
  fetchNotificationsApi,
  addNotificationApi,
  markAsReadApi,
  markAllAsReadApi,
  deleteNotificationApi,
} from "../services/mockNotificationsApi";

const NotificationsContext = createContext(null);

// Hook جاهز للاستخدام في أي مكان
export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used inside NotificationsProvider");
  }
  return ctx;
};

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // جلب الإشعارات من الـ "database"
  const refresh = useCallback(async () => {
    const data = await fetchNotificationsApi();
    setNotifications(data);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ✅ إضافة إشعار — بتتخزن في localStorage فوراً
  const addNotification = useCallback(
    async (text) => {
      await addNotificationApi(text);
      await refresh();
    },
    [refresh]
  );

  const markAsRead = useCallback(async (id) => {
    const updated = await markAsReadApi(id);
    setNotifications(updated);
  }, []);

  const markAllAsRead = useCallback(async () => {
    const updated = await markAllAsReadApi();
    setNotifications(updated);
  }, []);

  const deleteNotification = useCallback(async (id) => {
    const updated = await deleteNotificationApi(id);
    setNotifications(updated);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refresh,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
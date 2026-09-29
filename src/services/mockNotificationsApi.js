// src/services/mockNotificationsApi.js

const STORAGE_KEY = "mockNotificationsData";

// إشعارات البداية — نفس اللي كانوا hardcoded (2 unread عشان البادج يظهر 2)
const initialNotifications = [
  { id: 1, text: "Omar updated the landing page request.", timestamp: Date.now() - 5 * 60000, read: false },
  { id: 2, text: "New request added by Ahmed.", timestamp: Date.now() - 60 * 60000, read: false },
  { id: 3, text: "System maintenance scheduled for tonight.", timestamp: Date.now() - 24 * 60 * 60000, read: true },
];

// ===== Helpers: قراءة وكتابة في localStorage =====
const loadNotifications = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse stored notifications, resetting data.", e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotifications));
  return [...initialNotifications];
};

const saveNotifications = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const sortByNewest = (data) => [...data].sort((a, b) => b.timestamp - a.timestamp);

// جلب كل الإشعارات (الأحدث أولاً)
export const fetchNotificationsApi = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sortByNewest(loadNotifications()));
    }, 200);
  });
};

// ✅ إضافة إشعار جديد — دي اللي هننادي عليها من أي حدث في التطبيق
export const addNotificationApi = async (text) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const notifications = loadNotifications();
      const newNotif = {
        id: Date.now(),
        text,
        timestamp: Date.now(),
        read: false,
      };
      notifications.unshift(newNotif);
      saveNotifications(notifications);
      resolve(newNotif);
    }, 100);
  });
};

// تعليم إشعار واحد كمقروء
export const markAsReadApi = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updated = loadNotifications().map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      saveNotifications(updated);
      resolve(sortByNewest(updated));
    }, 100);
  });
};

// تعليم الكل كمقروء
export const markAllAsReadApi = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updated = loadNotifications().map((n) => ({ ...n, read: true }));
      saveNotifications(updated);
      resolve(sortByNewest(updated));
    }, 100);
  });
};

// حذف إشعار واحد
export const deleteNotificationApi = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updated = loadNotifications().filter((n) => n.id !== id);
      saveNotifications(updated);
      resolve(sortByNewest(updated));
    }, 100);
  });
};

// (اختياري) استرجاع الإشعارات الأصلية
export const resetNotificationsData = () => {
  localStorage.removeItem(STORAGE_KEY);
  return loadNotifications();
};
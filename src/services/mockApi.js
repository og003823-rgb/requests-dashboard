// src/services/mockApi.js

const STORAGE_KEY = "mockRequestsData";

// البيانات الافتراضية — بتتخزن مرة واحدة أول تشغيل بس
const initialRequests = [
  { id: 1, title: "Fix login page bug", owner: "Omar", status: "In Progress", priority: "High", createdAt: "2026-09-01" },
  { id: 2, title: "Update dashboard layout", owner: "Ahmed", status: "Pending", priority: "Medium", createdAt: "2026-09-03" },
  { id: 3, title: "Add internationalization support", owner: "Sara", status: "Completed", priority: "High", createdAt: "2026-09-05" },
  { id: 4, title: "Optimize database queries", owner: "Salma", status: "Pending", priority: "Low", createdAt: "2026-09-10" },
  { id: 5, title: "Configure security headers", owner: "youssef", status: "Rejected", priority: "Medium", createdAt: "2026-09-12" },
];

// ===== Helpers: قراءة وكتابة البيانات في localStorage =====
const loadRequests = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse stored requests, resetting data.", e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRequests));
  return [...initialRequests];
};

const saveRequests = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// (اختياري) دالة لاسترجاع البيانات الأصلية
export const resetMockData = () => {
  localStorage.removeItem(STORAGE_KEY);
  return loadRequests();
};

// ✅ جديد: جلب كل الأسماء الفريدة للـ Owners — عشان الفلتر يتحدث تلقائياً
export const fetchOwnersApi = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const owners = [
        ...new Set(
          loadRequests()
            .map((req) => req.owner)
            .filter(Boolean)
        ),
      ];
      resolve(owners);
    }, 200);
  });
};

// جلب الطلبات مع Filtering + Sorting + Pagination
export const fetchRequests = async (params = {}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (params.simulateError) {
        return reject(new Error("Server failed to fetch requests. Please try again."));
      }

      let data = [...loadRequests()];

      // 1. Filtering
      if (params.search) {
        const query = params.search.toLowerCase();
        data = data.filter(
          (req) =>
            req.title.toLowerCase().includes(query) ||
            req.owner.toLowerCase().includes(query)
        );
      }
      if (params.status && params.status !== "All") {
        data = data.filter((req) => req.status === params.status);
      }
      if (params.priority && params.priority !== "All") {
        data = data.filter((req) => req.priority === params.priority);
      }
      if (params.owner && params.owner !== "All") {
        data = data.filter((req) => req.owner.toLowerCase() === params.owner.toLowerCase());
      }

      // 2. Sorting
      if (params.sortBy) {
        data.sort((a, b) => {
          if (a[params.sortBy] < b[params.sortBy]) return params.order === "desc" ? 1 : -1;
          if (a[params.sortBy] > b[params.sortBy]) return params.order === "desc" ? -1 : 1;
          return 0;
        });
      }

      // 3. Pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const paginatedData = data.slice(startIndex, startIndex + limit);

      resolve({
        data: paginatedData,
        total: data.length,
        page,
        totalPages: Math.ceil(data.length / limit),
      });
    }, 400);
  });
};

// جلب طلب واحد بالـ ID
export const fetchRequestById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const request = loadRequests().find((req) => req.id === Number(id));
      if (request) {
        resolve({ ...request });
      } else {
        reject(new Error("Request not found on server."));
      }
    }, 300);
  });
};

// تحديث الحالة (مع محاكاة فشل 20% لاختبار الـ Rollback)
export const updateRequestStatusApi = async (id, newStatus) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.2) {
        return reject(new Error("Network error: Failed to update status on server."));
      }
      const requests = loadRequests();
      const index = requests.findIndex((req) => req.id === Number(id));
      if (index !== -1) {
        requests[index].status = newStatus;
        saveRequests(requests);
        resolve({ ...requests[index] });
      } else {
        reject(new Error("Request not found."));
      }
    }, 400);
  });
};

// تحديث بيانات الطلب (زرار Edit + صفحة التفاصيل)
export const updateRequestApi = async (id, updatedData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const requests = loadRequests();
      const index = requests.findIndex((req) => req.id === Number(id));
      if (index !== -1) {
        requests[index] = {
          ...requests[index],
          ...updatedData,
          updatedAt: new Date().toISOString().split("T")[0],
        };
        saveRequests(requests);
        resolve({ ...requests[index] });
      } else {
        reject(new Error("Request not found."));
      }
    }, 400);
  });
};

// إضافة طلب جديد
export const createRequestApi = async (newRequestData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const requests = loadRequests();
      const newReq = {
        id: Date.now(),
        ...newRequestData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      requests.unshift(newReq);
      saveRequests(requests);
      resolve(newReq);
    }, 400);
  });
};

// حذف طلب
export const deleteRequestApi = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const requests = loadRequests();
      const filtered = requests.filter((req) => req.id !== Number(id));
      saveRequests(filtered);
      resolve({ success: true, id });
    }, 300);
  });
};
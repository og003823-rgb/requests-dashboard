// Mock API محسّن وثابت وبدون أخطاء عشوائية مع ربط البروفايل

let mockRequests = [
  { id: 1, title: "Update Landing Page Hero Section", status: "In Progress", priority: "High", owner: "Omar", createdAt: "2026-09-20", updatedAt: "2026-09-24" },
  { id: 2, title: "Fix Authentication Redirect Bug", status: "Pending", priority: "High", owner: "Ahmed", createdAt: "2026-09-22", updatedAt: "2026-09-22" },
  { id: 3, title: "Redesign Dashboard Sidebar UI", status: "Completed", priority: "Medium", owner: "Omar", createdAt: "2026-09-18", updatedAt: "2026-09-21" },
  { id: 4, title: "Optimize Database Queries for Reports", status: "Pending", priority: "Low", owner: "Sara", createdAt: "2026-09-24", updatedAt: "2026-09-24" },
  { id: 5, title: "Add Dark Mode Toggle Support", status: "Rejected", priority: "Medium", owner: "Ahmed", createdAt: "2026-09-15", updatedAt: "2026-09-16" },
  { id: 6, title: "Add Dark Mode Toggle Support", status: "Rejected", priority: "Medium", owner: "Salma", createdAt: "2026-09-15", updatedAt: "2026-09-16" },
  { id: 7, title: "Add Dark Mode Toggle Support", status: "Rejected", priority: "Medium", owner: "youssef", createdAt: "2026-09-15", updatedAt: "2026-09-16" },
];

export const fetchRequests = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // قراءة اسم البروفايل المحفوظ لتحديث الـ owner لو تم تعديله
      const savedProfile = localStorage.getItem("userProfile");
      let currentOwner = "Omar";
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.name) {
            currentOwner = parsed.name;
          }
        } catch (e) {
          console.error("Error parsing profile", e);
        }
      }

      // تحديث الطلبات التي يمتلكها Omar بالاسم الجديد للبروفايل
      const updatedRequests = mockRequests.map(req => {
        if (req.owner === "Omar") {
          return { ...req, owner: currentOwner };
        }
        return req;
      });

      resolve([...updatedRequests]);
    }, 400);
  });
};

export const updateRequestStatusApi = async (id, newStatus) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockRequests = mockRequests.map(req => 
        req.id === id ? { ...req, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : req
      );
      resolve(true);
    }, 300);
  });
};
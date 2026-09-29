// src/hooks/useRequests.js

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  fetchRequests,
  fetchOwnersApi,
  updateRequestStatusApi,
  updateRequestApi,
  createRequestApi,
  deleteRequestApi,
} from "../services/mockApi";

const useRequests = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ===== 1. قراءة الفلاتر من الـ URL =====
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "All";
  const priority = searchParams.get("priority") || "All";
  const owner = searchParams.get("owner") || "All";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "asc";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  // ===== 2. State البيانات =====
  const [requests, setRequests] = useState([]);
  const [owners, setOwners] = useState([]); // ✅ جديد: قايمة الـ Owners الديناميكية
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== 3. تحديث الفلاتر في الـ URL =====
  const updateParam = useCallback(
    (key, value) => {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams.toString());
        if (value && value !== "All") {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
        if (key !== "page") {
          newParams.set("page", "1");
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  // ===== 4. جلب البيانات =====
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchRequests({
        search,
        status,
        priority,
        owner,
        sortBy,
        order,
        page,
        limit,
      });
      setRequests(response.data);
      setTotalRequests(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, owner, sortBy, order, page, limit]);

  // ===== ✅ جديد: جلب قايمة الـ Owners من الـ API =====
  const loadOwners = useCallback(async () => {
    try {
      const ownersList = await fetchOwnersApi();
      setOwners(ownersList);
    } catch (err) {
      console.error("Failed to load owners:", err);
    }
  }, []);

  // ===== 5. جلب تلقائي + Polling كل 30 ثانية =====
  useEffect(() => {
    loadData();
    loadOwners(); // ✅ بيحدث الـ Owners مع كل جلب
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData, loadOwners]);

  // ===== 6. تغيير الحالة (Optimistic Update + Rollback) =====
  const changeStatus = useCallback(
    async (id, newStatus) => {
      const previousRequests = [...requests];
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
      );
      try {
        await updateRequestStatusApi(id, newStatus);
      } catch (err) {
        setRequests(previousRequests);
        throw err;
      }
    },
    [requests]
  );

  // ===== 7. تعديل الطلب =====
  const updateRequest = useCallback(
    async (id, updatedData) => {
      const updated = await updateRequestApi(id, updatedData);
      await loadData();
      await loadOwners(); // ✅ لو اتغير الـ Owner، القايمة تتحدث
      return updated;
    },
    [loadData, loadOwners]
  );

  // ===== 8. إضافة طلب جديد =====
  const createRequest = useCallback(
    async (newRequestData) => {
      const created = await createRequestApi(newRequestData);
      await loadData();
      await loadOwners(); // ✅ الـ Owner الجديد يظهر في الفلتر فوراً
      return created;
    },
    [loadData, loadOwners]
  );

  // ===== 9. حذف طلب =====
  const deleteRequest = useCallback(
    async (id) => {
      await deleteRequestApi(id);
      await loadData();
      await loadOwners();
    },
    [loadData, loadOwners]
  );

  // ===== 10. تصفير الفلاتر =====
  const resetFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return {
    requests,
    owners, // ✅ جديد
    totalRequests,
    totalPages,
    loading,
    error,
    filters: { search, status, priority, owner, sortBy, order, page, limit },
    updateParam,
    refetch: loadData,
    changeStatus,
    updateRequest,
    createRequest,
    deleteRequest,
    resetFilters,
  };
};

export default useRequests;
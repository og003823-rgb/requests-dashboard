// src/pages/RequestsPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequestsTable from "../components/requests/RequestsTable";
import useRequests from "../hooks/useRequests";
import { translations } from "../utils/translations";
import Swal from "sweetalert2";
import "./RequestsPage.css";

// حماية: لو العنوان فيه علامات اقتباس متبوظش الـ HTML بتاع الـ Swal
const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const RequestsPage = () => {
  const navigate = useNavigate();

  const {
    requests,
    owners, // ✅ جديد: قايمة الـ Owners الديناميكية
    totalRequests,
    totalPages,
    loading,
    error,
    filters: {
      search: searchQuery,
      status: statusFilter,
      priority: priorityFilter,
      owner: ownerFilter,
      sortBy,
      order,
      page,
      limit,
    },
    updateParam,
    refetch,
    changeStatus,
    updateRequest,
    createRequest,
    deleteRequest,
    resetFilters,
  } = useRequests();

  const currentLang = localStorage.getItem("appSettings")
    ? JSON.parse(localStorage.getItem("appSettings")).language
    : "English";
  const t = translations[currentLang] || translations.English;

  const [currentOwnerName, setCurrentOwnerName] = useState("Omar");

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) setCurrentOwnerName(parsed.name);
      } catch (e) {
        console.error("Error parsing profile for owner name", e);
      }
    }
  }, []);

  // ===== ✅ جديد: بناء قايمة الـ Owners ديناميكياً =====
  // بندمج اسم المستخدم الحالي مع الـ Owners الجايين من البيانات
  const ownerOptions = [...new Set([currentOwnerName, ...owners])];

  // لو فيه فلتر Owner محفوظ في الـ URL ومش موجود في القايمة، ضيفه
  // (عشان الـ select ميبقاش فاضي لو الـ Owner اتشال)
  if (ownerFilter !== "All" && !ownerOptions.includes(ownerFilter)) {
    ownerOptions.unshift(ownerFilter);
  }

  // ===== تغيير حالة الطلب =====
  const handleStatusChange = async (id, newStatus) => {
    try {
      await changeStatus(id, newStatus);
    } catch (err) {
      Swal.fire(
        "Error",
        "Failed to update status on server. Reverting changes.",
        "error"
      );
    }
  };

  // ===== إضافة طلب جديد =====
  const handleAddRequest = () => {
    Swal.fire({
      title: currentLang === "Arabic" ? "إضافة طلب جديد" : "Add New Request",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="${currentLang === "Arabic" ? "عنوان الطلب" : "Request Title"}">
        <input id="swal-input2" class="swal2-input" placeholder="${currentLang === "Arabic" ? "اسم المسؤول" : "Owner Name"}" value="${escapeHtml(currentOwnerName)}">
        <select id="swal-input3" class="swal2-input">
          <option value="Low">Low</option>
          <option value="Medium" selected>Medium</option>
          <option value="High">High</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: t.addRequest,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#6c757d",
      preConfirm: () => {
        const title = document.getElementById("swal-input1").value;
        const owner = document.getElementById("swal-input2").value;
        const priority = document.getElementById("swal-input3").value;
        if (!title || !owner) {
          Swal.showValidationMessage(
            currentLang === "Arabic"
              ? "يرجى ملء الحقول المطلوبة!"
              : "Please fill in both fields!"
          );
        }
        return { title, owner, priority };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await createRequest({
            title: result.value.title,
            owner: result.value.owner,
            status: "Pending",
            priority: result.value.priority,
          });
          Swal.fire(
            currentLang === "Arabic" ? "تمت الإضافة!" : "Added!",
            currentLang === "Arabic"
              ? "تم إضافة الطلب الجديد بنجاح للسيرفر."
              : "New request has been added successfully to server.",
            "success"
          );
        } catch (err) {
          Swal.fire("Error", "Failed to create request on server.", "error");
        }
      }
    });
  };

  // ===== حذف طلب =====
  const handleDelete = (id) => {
    Swal.fire({
      title: currentLang === "Arabic" ? "هل أنت متأكد؟" : "Are you sure?",
      text: currentLang === "Arabic"
        ? "لن تتمكن من التراجع عن هذا!"
        : "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: currentLang === "Arabic" ? "نعم، احذفه!" : "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRequest(id);
          Swal.fire(
            currentLang === "Arabic" ? "تم الحذف!" : "Deleted!",
            currentLang === "Arabic"
              ? "تم حذف الطلب بنجاح."
              : "Your request has been deleted successfully.",
            "success"
          );
        } catch (err) {
          Swal.fire("Error", "Failed to delete request from server.", "error");
        }
      }
    });
  };

  // ===== تعديل الطلب =====
  const handleEdit = (req) => {
    Swal.fire({
      title: currentLang === "Arabic" ? "تعديل الطلب" : "Edit Request",
      html: `
        <input id="swal-edit-title" class="swal2-input" value="${escapeHtml(req.title)}" placeholder="${currentLang === "Arabic" ? "عنوان الطلب" : "Request Title"}">
        <input id="swal-edit-owner" class="swal2-input" value="${escapeHtml(req.owner)}" placeholder="${currentLang === "Arabic" ? "اسم المسؤول" : "Owner Name"}">
        <select id="swal-edit-priority" class="swal2-input">
          <option value="Low" ${req.priority === "Low" ? "selected" : ""}>Low</option>
          <option value="Medium" ${req.priority === "Medium" ? "selected" : ""}>Medium</option>
          <option value="High" ${req.priority === "High" ? "selected" : ""}>High</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: currentLang === "Arabic" ? "حفظ التغييرات" : "Save Changes",
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#6c757d",
      preConfirm: () => {
        const title = document.getElementById("swal-edit-title").value;
        const owner = document.getElementById("swal-edit-owner").value;
        const priority = document.getElementById("swal-edit-priority").value;
        if (!title || !owner) {
          Swal.showValidationMessage(
            currentLang === "Arabic"
              ? "يرجى ملء الحقول المطلوبة!"
              : "Please fill in both fields!"
          );
        }
        return { title, owner, priority };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateRequest(req.id, result.value);
          Swal.fire(
            currentLang === "Arabic" ? "تم التحديث!" : "Updated!",
            currentLang === "Arabic"
              ? "تم تحديث طلبك بنجاح."
              : "Your request has been updated.",
            "success"
          );
        } catch (err) {
          Swal.fire("Error", "Failed to update request.", "error");
        }
      }
    });
  };

  // ===== التنقل بين الصفحات =====
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateParam("page", String(newPage));
    }
  };

  // ===== تبديل اتجاه الترتيب =====
  const toggleOrder = () => {
    updateParam("order", order === "asc" ? "desc" : "asc");
  };

  const handleReset = () => resetFilters();
  const handleRetry = () => refetch();

  return (
    <main className="requests-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">{t.dashboard}</h2>
          <p className="text-muted mb-0">
            {t.totalRequests}:{" "}
            <span className="fw-semibold text-primary">{totalRequests}</span>
          </p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-1"
          onClick={handleAddRequest}
        >
          <i className="bi bi-plus-lg"></i> {t.addRequest}
        </button>
      </div>

      {/* Filters & Sorting */}
      <section className="filters-card mb-4">
        <div className="filters-grid">
          <div className="search-box">
            <span className="search-icon">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => updateParam("search", e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => updateParam("status", e.target.value)}
          >
            <option value="All">{t.allStatus}</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => updateParam("priority", e.target.value)}
          >
            <option value="All">{t.allPriority}</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* ✅ جديد: قايمة الـ Owners ديناميكية — أي Owner جديد بيظهر تلقائياً */}
          <select
            value={ownerFilter}
            onChange={(e) => updateParam("owner", e.target.value)}
          >
            <option value="All">{t.allOwners}</option>
            {ownerOptions.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => updateParam("sortBy", e.target.value)}
          >
            <option value="">Sort By...</option>
            <option value="title">Title</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Date</option>
          </select>

          {sortBy && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={toggleOrder}
              title={order === "asc" ? "Ascending" : "Descending"}
            >
              <i className={`bi bi-arrow-${order === "asc" ? "up" : "down"}`}></i>
              {order === "asc" ? " Asc" : " Desc"}
            </button>
          )}

          <select
            value={String(limit)}
            onChange={(e) => updateParam("limit", e.target.value)}
          >
            <option value="5">5 / page</option>
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
          </select>

          <button type="button" className="reset-button" onClick={handleReset}>
            {t.reset}
          </button>
        </div>
      </section>

      {/* Table */}
      <section className="requests-table-container">
        {loading && <div className="text-center py-3">Loading server data...</div>}
        <RequestsTable
          requests={requests}
          onRowClick={(id) => navigate(`/requests/${id}`)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onEdit={handleEdit}
          error={error}
          onRetry={handleRetry}
        />

        {/* Pagination */}
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3 p-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            <i className="bi bi-chevron-left"></i> Prev
          </button>

          <span className="text-muted small">
            Page {page} of {totalPages || 1}
          </span>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </section>
    </main>
  );
};

export default RequestsPage;
// RequestsPage.jsx

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import RequestsTable from "../components/requests/RequestsTable";
import { fetchRequests, updateRequestStatusApi } from "../services/mockApi";
import { translations } from "../utils/translations";
import Swal from "sweetalert2";
import "./RequestsPage.css";

const RequestsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // جلب اللغة الحالية من الـ localStorage لتطبيق الترجمة
  const currentLang = localStorage.getItem("appSettings") 
    ? JSON.parse(localStorage.getItem("appSettings")).language 
    : "English";
  const t = translations[currentLang] || translations.English;

  // قراءة القيم من الـ URL مباشرة
  const searchQuery = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "All";
  const priorityFilter = searchParams.get("priority") || "All";
  const ownerFilter = searchParams.get("owner") || "All";

  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [currentOwnerName, setCurrentOwnerName] = useState("Omar");

  // جلب اسم المستخدم من الـ localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) {
          setCurrentOwnerName(parsed.name);
        }
      } catch (e) {
        console.error("Error parsing profile for owner name", e);
      }
    }
  }, []);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "All") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const loadData = async () => {
    setError(null);
    try {
      const data = await fetchRequests();
      setRequests(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const previousRequests = [...requests];
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );

    try {
      await updateRequestStatusApi(id, newStatus);
    } catch (err) {
      setRequests(previousRequests);
      alert("Failed to update status on server. Reverting changes.");
    }
  };

  // دالة إضافة طلب جديد باستخدام SweetAlert2
  const handleAddRequest = () => {
    Swal.fire({
      title: currentLang === "Arabic" ? "إضافة طلب جديد" : "Add New Request",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="${currentLang === "Arabic" ? "عنوان الطلب" : "Request Title"}">
        <input id="swal-input2" class="swal2-input" placeholder="${currentLang === "Arabic" ? "اسم المسؤول" : "Owner Name"}" value="${currentOwnerName}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: t.addRequest,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#6c757d",
      preConfirm: () => {
        const title = document.getElementById("swal-input1").value;
        const owner = document.getElementById("swal-input2").value;
        if (!title || !owner) {
          Swal.showValidationMessage(currentLang === "Arabic" ? "يرجى ملء الحقول المطلوبة!" : "Please fill in both fields!");
        }
        return { title, owner };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newRequest = {
          id: Date.now(),
          title: result.value.title,
          owner: result.value.owner,
          status: "Pending",
          priority: "Medium"
        };
        setRequests((prev) => [newRequest, ...prev]);
        Swal.fire(
          currentLang === "Arabic" ? "تمت الإضافة!" : "Added!",
          currentLang === "Arabic" ? "تم إضافة الطلب الجديد بنجاح." : "New request has been added successfully.",
          "success"
        );
      }
    });
  };

  // دالة حذف طلب باستخدام SweetAlert2
  const handleDelete = (id) => {
    Swal.fire({
      title: currentLang === "Arabic" ? "هل أنت متأكد؟" : "Are you sure?",
      text: currentLang === "Arabic" ? "لن تتمكن من التراجع عن هذا!" : "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: currentLang === "Arabic" ? "نعم، احذفه!" : "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        setRequests((prev) => prev.filter((req) => req.id !== id));
        Swal.fire(
          currentLang === "Arabic" ? "تم الحذف!" : "Deleted!",
          currentLang === "Arabic" ? "تم حذف الطلب بنجاح." : "Your request has been deleted successfully.",
          "success"
        );
      }
    });
  };

  // دالة تعديل طلب باستخدام SweetAlert2 لتعديل العنوان مباشرة
  const handleEdit = (req) => {
    Swal.fire({
      title: currentLang === "Arabic" ? "تعديل عنوان الطلب" : "Edit Request Title",
      input: "text",
      inputValue: req.title,
      showCancelButton: true,
      confirmButtonText: currentLang === "Arabic" ? "حفظ التغييرات" : "Save Changes",
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#6c757d",
      inputValidator: (value) => {
        if (!value) {
          return currentLang === "Arabic" ? "يجب كتابة شيء ما!" : "You need to write something!";
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setRequests((prev) =>
          prev.map((item) =>
            item.id === req.id ? { ...item, title: result.value } : item
          )
        );
        Swal.fire(
          currentLang === "Arabic" ? "تم التحديث!" : "Updated!",
          currentLang === "Arabic" ? "تم تحديث طلبك بنجاح." : "Your request has been updated.",
          "success"
        );
      }
    });
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const handleRetry = () => {
    loadData();
  };

  const filteredRequests = requests.filter((request) => {
    const search = searchQuery.trim().toLowerCase();

    const matchesSearch =
      search === "" ||
      request.title.toLowerCase().includes(search) ||
      request.owner.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || request.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || request.priority === priorityFilter;

    const matchesOwner =
      ownerFilter === "All" ||
      request.owner.toLowerCase() === ownerFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority && matchesOwner;
  });

  return (
    <main className="requests-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">{t.dashboard}</h2>
          <p className="text-muted mb-0">
            {t.totalRequests}: <span className="fw-semibold text-primary">{filteredRequests.length}</span>
          </p>
        </div>
        {/* زر إضافة طلب جديد */}
        <button className="btn btn-primary d-flex align-items-center gap-1" onClick={handleAddRequest}>
          <i className="bi bi-plus-lg"></i> {t.addRequest}
        </button>
      </div>

      {/* Filters */}
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

          <select
            value={ownerFilter}
            onChange={(e) => updateParam("owner", e.target.value)}
          >
            <option value="All">{t.allOwners}</option>
            <option value={currentOwnerName}>{currentOwnerName}</option>
            <option value="Ahmed">Ahmed</option>
            <option value="Sara">Sara</option>
            <option value="Salma">Salma</option>
            <option value="youssef">youssef</option>
          </select>

          <button type="button" className="reset-button" onClick={handleReset}>
            {t.reset}
          </button>
        </div>
      </section>

      {/* Table with Delete & Edit props */}
      <section className="requests-table-container">
        <RequestsTable
          requests={filteredRequests}
          onRowClick={(id) => {
            navigate(`/requests/${id}`);
          }}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onEdit={handleEdit}
          error={error}
          onRetry={handleRetry}
        />
      </section>
    </main>
  );
};

export default RequestsPage;
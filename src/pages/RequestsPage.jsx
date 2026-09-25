// RequestsPage.jsx

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import RequestsTable from "../components/requests/RequestsTable";
import { fetchRequests, updateRequestStatusApi } from "../services/mockApi";
import Swal from "sweetalert2";
import "./RequestsPage.css";

const RequestsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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

  // دالة حذف طلب باستخدام SweetAlert2
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        setRequests((prev) => prev.filter((req) => req.id !== id));
        Swal.fire(
          "Deleted!",
          "Your request has been deleted successfully.",
          "success"
        );
      }
    });
  };

  // دالة تعديل طلب باستخدام SweetAlert2 لتعديل العنوان مباشرة
  const handleEdit = (req) => {
    Swal.fire({
      title: "Edit Request Title",
      input: "text",
      inputValue: req.title,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#6c757d",
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setRequests((prev) =>
          prev.map((item) =>
            item.id === req.id ? { ...item, title: result.value } : item
          )
        );
        Swal.fire("Updated!", "Your request has been updated.", "success");
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
          <h2 className="fw-bold text-dark mb-1">Requests Dashboard</h2>
          <p className="text-muted mb-0">
            Total Requests: <span className="fw-semibold text-primary">{filteredRequests.length}</span>
          </p>
        </div>
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
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => updateParam("search", e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => updateParam("status", e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => updateParam("priority", e.target.value)}
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={ownerFilter}
            onChange={(e) => updateParam("owner", e.target.value)}
          >
            <option value="All">All Owners</option>
            <option value={currentOwnerName}>{currentOwnerName}</option>
            <option value="Ahmed">Ahmed</option>
            <option value="Sara">Sara</option>
            <option value="Salma">Salma</option>
            <option value="youssef">youssef</option>
          </select>

          <button type="button" className="reset-button" onClick={handleReset}>
            Reset
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
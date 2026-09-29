// src/pages/RequestDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRequestById, updateRequestApi } from "../services/mockApi";
import { translations } from "../utils/translations";
import Swal from "sweetalert2";

function RequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentLang = localStorage.getItem("appSettings") 
    ? JSON.parse(localStorage.getItem("appSettings")).language 
    : "English";
  const t = translations[currentLang] || translations.English;

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRequestById(id);
        setRequest(data);
        setFormData({ ...data });
      } catch (err) {
        setError(err.message || "Failed to fetch request details.");
      } finally {
        setLoading(false);
      }
    };
    getDetails();
  }, [id]);

  useEffect(() => {
    if (!request) return;
    const isChanged = 
      formData.title !== request.title ||
      formData.status !== request.status ||
      formData.priority !== request.priority ||
      formData.owner !== request.owner;
    
    setHasUnsavedChanges(isChanged);
  }, [formData, request]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // ===== ✅ الحفظ — بيبعت كل الحقول (Title + Status + Priority + Owner) =====
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateRequestApi(request.id, {
        title: formData.title,
        status: formData.status,
        priority: formData.priority, // ✅ دي اللي كانت مش بتتحفظ
        owner: formData.owner,
      });
      // الـ API بيرجع الطلب المحدّث (بما فيه updatedAt الجديد تلقائياً)
      setRequest(updated);
      setFormData({ ...updated });
      setIsEditing(false);
      setHasUnsavedChanges(false);
      Swal.fire("Success", "Request updated successfully!", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to update request on server.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
      return;
    }
    setFormData({ ...request });
    setIsEditing(false);
  };

  if (loading) {
    return <div className="text-center py-5">Loading request details from server...</div>;
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">{error}</div>
        <button className="btn btn-secondary mt-3" onClick={() => navigate("/requests")}>
          Back to Requests
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* Header & Actions */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <button 
            type="button" 
            className="btn btn-sm btn-outline-secondary mb-2"
            onClick={() => {
              if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Leave anyway?")) return;
              navigate("/requests");
            }}
          >
            <i className="bi bi-arrow-left me-1"></i> Back to Requests
          </button>
          <h2 className="fw-bold mb-1">Request Details #{request.id}</h2>
          <p className="text-muted mb-0">View and manage request information</p>
        </div>

        <div>
          {!isEditing ? (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              <i className="bi bi-pencil-square me-2"></i> Edit Request
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="request-form"
                className="btn btn-success"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1"></i> Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && isEditing && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          You have unsaved changes! Don't forget to save before leaving.
        </div>
      )}

      {/* Details Card */}
      <div className="card border-0 shadow-sm p-4">
        <form id="request-form" onSubmit={handleSave}>
          <div className="row g-4">
            {/* Title */}
            <div className="col-12">
              <label className="form-label fw-semibold text-muted">Title</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              ) : (
                <h4 className="text-dark fw-bold mb-0">{request.title}</h4>
              )}
            </div>

            {/* Status */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-muted">Status</label>
              {isEditing ? (
                <select
                  className="form-select"
                  value={formData.status || ""}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              ) : (
                <div>
                  <span className="badge bg-primary px-3 py-2">
                    {request.status}
                  </span>
                </div>
              )}
            </div>

            {/* Priority */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-muted">Priority</label>
              {isEditing ? (
                <select
                  className="form-select"
                  value={formData.priority || ""}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              ) : (
                <div>
                  <span className={`badge bg-${request.priority === 'High' ? 'danger' : request.priority === 'Medium' ? 'warning text-dark' : 'secondary'} px-3 py-2`}>
                    {request.priority}
                  </span>
                </div>
              )}
            </div>

            {/* Owner */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-muted">Owner</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  value={formData.owner || ""}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  required
                />
              ) : (
                <div className="fw-semibold text-dark fs-6">{request.owner}</div>
              )}
            </div>

            <hr className="my-4 text-muted opacity-25" />

            {/* Timestamps */}
            <div className="col-md-6">
              <small className="text-muted d-block">Created At</small>
              <span className="fw-medium text-secondary">{request.createdAt || "N/A"}</span>
            </div>
            <div className="col-md-6">
              <small className="text-muted d-block">Updated At</small>
              <span className="fw-medium text-secondary">{request.updatedAt || request.createdAt || "N/A"}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestDetailsPage;
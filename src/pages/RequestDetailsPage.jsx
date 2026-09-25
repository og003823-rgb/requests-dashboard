import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RequestDetailsPage() {
  const { id } = useParams(); // استخراج الـ ID من الـ URL لفتح الطلب المناسب
  const navigate = useNavigate();

  // بيانات الطلب الوهمية (مع دعم جلب الطلب بناءً على الـ ID)
  const [request, setRequest] = useState({
    id: Number(id) || 1,
    title: "Update Landing Page Hero Section",
    status: "In Progress",
    priority: "High",
    owner: "Omar",
    createdAt: "2026-09-20 10:30 AM",
    updatedAt: "2026-09-24 02:15 PM"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(request);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // تتبع التعديلات لمعرفة هل هناك تغييرات غير محفوظة
  useEffect(() => {
    const isChanged = 
      formData.title !== request.title ||
      formData.status !== request.status ||
      formData.priority !== request.priority ||
      formData.owner !== request.owner;
    
    setHasUnsavedChanges(isChanged);
  }, [formData, request]);

  // حماية إغلاق الصفحة أو الخروج في حال وجود تعديلات غير محفوظة
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

  // حفظ التعديلات
  const handleSave = (e) => {
    e.preventDefault();
    setRequest({
      ...formData,
      updatedAt: new Date().toLocaleString()
    });
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  // إلغاء التعديل والرجوع للقيم الأصلية
  const handleCancel = () => {
    if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
      return;
    }
    setFormData(request);
    setIsEditing(false);
  };

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
              >
                <i className="bi bi-check-lg me-1"></i> Save Changes
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
                  value={formData.title}
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
                  value={formData.status}
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
                  value={formData.priority}
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
                  value={formData.owner}
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
              <span className="fw-medium text-secondary">{request.createdAt}</span>
            </div>
            <div className="col-md-6">
              <small className="text-muted d-block">Updated At</small>
              <span className="fw-medium text-secondary">{request.updatedAt}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestDetailsPage;
// RequestsTable.jsx

import React from "react";

function RequestsTable({ requests, onRowClick, onStatusChange, onDelete, onEdit, error, onRetry }) {
  if (error) {
    return (
      <div className="card border-0 shadow-sm p-5 text-center">
        <div className="text-danger mb-3 fs-3">
          <i className="bi bi-exclamation-circle"></i>
        </div>
        <h5 className="fw-bold mb-2">Something went wrong</h5>
        <p className="text-muted mb-3">{error}</p>
        <button className="btn btn-outline-primary btn-sm mx-auto" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1"></i> Retry
        </button>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="card border-0 shadow-sm p-5 text-center">
        <div className="text-muted mb-3 fs-3">
          <i className="bi bi-inbox"></i>
        </div>
        <h5 className="fw-bold mb-2">No requests found</h5>
        <p className="text-muted mb-0">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="py-3 px-4">Title</th>
              <th className="py-3">Status</th>
              <th className="py-3">Priority</th>
              <th className="py-3">Owner</th>
              <th className="py-3">Created At</th>
              <th className="py-3 px-4 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr 
                key={req.id} 
                style={{ cursor: "pointer" }}
                onClick={() => onRowClick(req.id)}
              >
                <td className="px-4 fw-semibold text-dark">{req.title}</td>
                <td>
                  <select
                    className={`form-select form-select-sm w-auto badge-status-${req.status}`}
                    value={req.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      onStatusChange(req.id, e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <span className={`badge bg-${req.priority === 'High' ? 'danger' : req.priority === 'Medium' ? 'warning text-dark' : 'secondary'}`}>
                    {req.priority}
                  </span>
                </td>
                <td className="text-muted">{req.owner}</td>
                <td className="text-muted small">{req.createdAt}</td>
                <td className="px-4 text-end" onClick={(e) => e.stopPropagation()}>
                  <div className="d-flex gap-2 justify-content-end">
                    {onEdit && (
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        title="Edit Request"
                        onClick={() => onEdit(req)}
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        title="Delete Request"
                        onClick={() => onDelete(req.id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RequestsTable;
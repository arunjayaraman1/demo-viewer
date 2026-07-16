'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Editing state for metadata
  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Custom access code state
  const [editingCodeProject, setEditingCodeProject] = useState(null);
  const [customCode, setCustomCode] = useState('');

  const showToast = (msg, isError = false) => {
    setToastMsg(isError ? `❌ ${msg}` : `✨ ${msg}`);
    setTimeout(() => {
      setToastMsg('');
    }, 4000);
  };

  // Fetch projects and trigger automatic sync on page load
  useEffect(() => {
    const initDashboard = async () => {
      setSyncing(true);
      try {
        // First run auto-sync to align manifest files with database
        const syncRes = await fetch('/api/sync');
        const syncData = await syncRes.json();
        
        if (syncRes.ok && syncData.success) {
          const summary = syncData.summary;
          if (summary.added > 0 || summary.removed > 0 || summary.restored > 0 || summary.updated > 0) {
            showToast(`Auto-Synced: Added ${summary.added}, Removed ${summary.removed}, Updated ${summary.updated}`);
          }
        }
      } catch (err) {
        console.error("Auto-sync failed on load:", err);
      } finally {
        setSyncing(false);
        fetchProjects();
      }
    };

    initDashboard();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.projects || []);
      } else {
        setErrorMsg(data.error || 'Failed to retrieve projects list.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to query database.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/sync');
      const data = await res.json();
      if (res.ok && data.success) {
        const summary = data.summary;
        showToast(`Sync Done! Added: ${summary.added}, Removed: ${summary.removed}, Restored: ${summary.restored}, Updated: ${summary.updated}`);
        fetchProjects();
      } else {
        setErrorMsg(data.error || 'Failed to sync projects.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Sync operation failed.');
    } finally {
      setSyncing(false);
    }
  };

  const toggleStatus = async (project) => {
    const newStatus = project.active === 1 ? false : true;
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'Status updated.');
        // Update local state without full reload
        setProjects(projects.map(p => p.id === project.id ? { ...p, active: newStatus ? 1 : 0 } : p));
      } else {
        showToast(data.error || 'Failed to toggle status.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating status.', true);
    }
  };

  const regenerateCode = async (project) => {
    if (!confirm(`Are you sure you want to regenerate the access code for "${project.name}"?`)) return;
    
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regenerateCode: true }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Access code regenerated successfully.');
        setProjects(projects.map(p => p.id === project.id ? { ...p, access_code: data.accessCode } : p));
      } else {
        showToast(data.error || 'Failed to regenerate code.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('Error regenerating code.', true);
    }
  };

  const handleCustomCodeSave = async (e) => {
    e.preventDefault();
    if (!customCode.trim()) return;

    try {
      const res = await fetch(`/api/projects/${editingCodeProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: customCode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Access code updated successfully.');
        setProjects(projects.map(p => p.id === editingCodeProject.id ? { ...p, access_code: data.accessCode } : p));
        setEditingCodeProject(null);
        setCustomCode('');
      } else {
        alert(data.error || 'Failed to update custom code.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating custom code.');
    }
  };

  const handleMetadataSave = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      const res = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, description: editDesc }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Project details updated.');
        setProjects(projects.map(p => p.id === editingProject.id ? { ...p, name: editName, description: editDesc } : p));
        setEditingProject(null);
      } else {
        alert(data.error || 'Failed to update details.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating details.');
    }
  };

  const deleteMetadata = async (project) => {
    if (!confirm(`Warning: This will delete the database mapping record for "${project.name}".\n\nIf the files still exist in GitHub, the project will reappear on the next sync/reload. Delete this record?`)) return;

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Database record deleted.');
        setProjects(projects.filter(p => p.id !== project.id));
      } else {
        showToast(data.error || 'Failed to delete record.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting record.', true);
    }
  };

  const startEditDetails = (project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditDesc(project.description || '');
  };

  const startEditCode = (project) => {
    setEditingCodeProject(project);
    setCustomCode(project.access_code);
  };

  return (
    <main className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="portal-title" style={{ fontSize: '2.25rem' }}>Admin Console</h1>
          <p className="portal-subtitle">Manage prototype mappings, access codes, and deployment syncs.</p>
        </div>
        <button 
          onClick={handleManualSync} 
          disabled={syncing}
          className="sync-btn"
        >
          {syncing ? (
            <>
              <span className="btn-loader" style={{ width: '16px', height: '16px', margin: 0 }}></span>
              Syncing...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
              Sync GitHub Projects
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="error-message" role="alert" style={{ marginBottom: '1.5rem' }}>
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="admin-card">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project Details</th>
                <th>Redirection Target</th>
                <th>Access Code</th>
                <th>Deployment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    <span className="btn-loader" style={{ width: '32px', height: '32px', borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#8b5cf6' }}></span>
                    <p style={{ marginTop: '1rem', fontWeight: 600 }}>Loading projects...</p>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    No projects mapped in D1 database. Click &quot;Sync GitHub Projects&quot; to scan files.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="project-name-cell">{project.name}</div>
                      <div className="project-desc-cell">{project.description || 'No description provided.'}</div>
                    </td>
                    <td>
                      <code style={{ color: '#60a5fa', fontSize: '0.85rem' }}>/projects/{project.slug}/index.html</code>
                    </td>
                    <td>
                      <div className="code-field-wrapper">
                        <span className={`code-display ${project.active === 0 ? 'inactive' : ''}`}>
                          {project.access_code}
                        </span>
                        {project.active === 1 && (
                          <>
                            <button 
                              onClick={() => startEditCode(project)}
                              title="Edit Access Code"
                              className="icon-btn"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => regenerateCode(project)}
                              title="Regenerate Access Code"
                              className="icon-btn"
                            >
                              🔄
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${project.active === 1 ? 'active' : 'inactive'}`}>
                        {project.active === 1 ? '🟢 Enabled' : '🔴 Disabled'}
                      </span>
                    </td>
                    <td>
                      <div className="action-row">
                        <button 
                          onClick={() => toggleStatus(project)}
                          className="btn-small btn-small-secondary"
                        >
                          {project.active === 1 ? 'Disable' : 'Enable'}
                        </button>
                        <button 
                          onClick={() => startEditDetails(project)}
                          className="btn-small btn-small-secondary"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteMetadata(project)}
                          className="btn-small btn-small-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Metadata Modal */}
      {editingProject && (
        <div className="modal-overlay">
          <form onSubmit={handleMetadataSave} className="modal-content">
            <h3 className="modal-title">Edit Project Details</h3>
            
            <div className="form-group">
              <label className="input-label">Project Name</label>
              <input 
                type="text" 
                className="form-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="input-label">Description</label>
              <textarea 
                className="form-input"
                style={{ minHeight: '80px', resize: 'vertical' }}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                onClick={() => setEditingProject(null)} 
                className="btn-small btn-small-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-small btn-small-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Access Code Modal */}
      {editingCodeProject && (
        <div className="modal-overlay">
          <form onSubmit={handleCustomCodeSave} className="modal-content">
            <h3 className="modal-title">Custom Access Code</h3>
            
            <div className="form-group">
              <label className="input-label">Enter Code</label>
              <input 
                type="text" 
                className="form-input"
                style={{ textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace' }}
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                required
              />
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                onClick={() => setEditingCodeProject(null)} 
                className="btn-small btn-small-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-small btn-small-primary"
              >
                Update Code
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sync Toast Notification */}
      {toastMsg && (
        <div className="sync-toast">
          {toastMsg}
        </div>
      )}
    </main>
  );
}

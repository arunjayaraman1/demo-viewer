'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(null); // null on load, then true or false
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

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

  async function checkAuthorization() {
    try {
      const res = await fetch('/api/projects');
      if (res.status === 401) {
        setIsAuthorized(false);
        setLoading(false);
      } else if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects || []);
          setIsAuthorized(true);
          // Run an auto-sync check silently on background
          runAutoSyncSilently();
        }
      } else {
        setIsAuthorized(false);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setIsAuthorized(false);
      setLoading(false);
    }
  }

  async function runAutoSyncSilently() {
    try {
      const syncRes = await fetch('/api/sync');
      const syncData = await syncRes.json();
      if (syncRes.ok && syncData.success) {
        const summary = syncData.summary;
        if (summary.added > 0 || summary.removed > 0 || summary.restored > 0 || summary.updated > 0) {
          showToast(`Synced: Added ${summary.added}, Removed ${summary.removed}, Updated ${summary.updated}`);
          // Refresh list to show newly added projects
          fetchProjects();
        }
      }
    } catch (err) {
      console.error('Silently syncing error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!password.trim()) return;

    setAuthLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthorized(true);
        fetchProjects();
      } else {
        setAuthError(data.error || 'Invalid admin password.');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Authentication server unreachable.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        setIsAuthorized(false);
        setProjects([]);
        setPassword('');
        showToast('Logged out successfully.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/projects');
      if (res.status === 401) {
        setIsAuthorized(false);
        return;
      }
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
      if (res.status === 401) {
        setIsAuthorized(false);
        return;
      }
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
      if (res.status === 401) {
        setIsAuthorized(false);
        return;
      }
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'Status updated.');
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
      if (res.status === 401) {
        setIsAuthorized(false);
        return;
      }
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
      if (res.status === 401) {
        setIsAuthorized(false);
        return;
      }
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
      if (res.status === 401) {
        setIsAuthorized(false);
        return;
      }
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
    if (!confirm(`Warning: This will delete the database mapping record for "${project.name}".\n\nIf the files still exist in GitHub, the project will reappear on the next sync. Delete this record?`)) return;

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE'
      });
      if (res.status === 401) {
        setIsAuthorized(false);
        return;
      }
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

  // Check auth status by fetching projects list on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    checkAuthorization();
  }, []);

  // Render Loading screen before we know auth status
  if (isAuthorized === null) {
    return (
      <main className="portal-container" style={{ minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <span className="btn-loader" style={{ width: '32px', height: '32px', borderTopColor: '#8b5cf6' }}></span>
          <p style={{ marginTop: '1.25rem', fontWeight: 600 }}>Securing session node...</p>
        </div>
      </main>
    );
  }

  // Render Login Gate if unauthenticated
  if (isAuthorized === false) {
    return (
      <main className="portal-container">
        <div className="auth-gate-card">
          <div className="auth-gate-icon">🔒</div>
          <h2 className="auth-gate-title">Admin Authorization</h2>
          <p className="auth-gate-desc">Authorized administrative access only. Access strictly logged.</p>
          
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <label className="input-label" htmlFor="password">Console Secret</label>
              <input 
                type="password" 
                id="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={authLoading}
                autoFocus
              />
            </div>
            
            {authError && (
              <p style={{ color: 'var(--danger-color)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                ❌ {authError}
              </p>
            )}

            <button 
              type="submit" 
              className="submit-btn" 
              style={{ padding: '0.85rem' }}
              disabled={authLoading}
            >
              {authLoading ? 'Verifying node...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Render SaaS Telemetry Dashboard if authenticated
  const activeCount = projects.filter(p => p.active === 1).length;

  return (
    <main className="admin-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div className="admin-header" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className="portal-title" style={{ fontSize: '2.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            Console Control Plane
            <span className="status-pill active" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>ONLINE</span>
          </h1>
          <p className="portal-subtitle">Telemetry orchestration, secure client codes, and deployment sync gateways.</p>
        </div>
        <div className="action-row" style={{ gap: '0.75rem' }}>
          <button 
            onClick={handleManualSync} 
            disabled={syncing}
            className="sync-btn"
            style={{ padding: '0.75rem 1.25rem', borderRadius: '12px' }}
          >
            {syncing ? (
              <>
                <span className="btn-loader" style={{ width: '14px', height: '14px', margin: 0 }}></span>
                Syncing...
              </>
            ) : (
              'Sync GitHub Mappings'
            )}
          </button>
          <button 
            onClick={handleLogout}
            className="btn-small btn-small-secondary"
            style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.4)', color: '#f43f5e' }}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* SaaS Telemetry Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <span className="metric-label">Total Prototypes</span>
          <span className="metric-value">{projects.length}</span>
          <span className="metric-footer">📂 Assets synced in workspace</span>
        </div>
        <div className="metric-card success">
          <span className="metric-label">Active Handlers</span>
          <span className="metric-value">{activeCount}</span>
          <span className="metric-footer">🟢 Gateway links authorized</span>
        </div>
        <div className="metric-card warning">
          <span className="metric-label">Inactive Records</span>
          <span className="metric-value">{projects.length - activeCount}</span>
          <span className="metric-footer">🔴 Code redirections blocked</span>
        </div>
        <div className="metric-card primary">
          <span className="metric-label">D1 Database Node</span>
          <span className="metric-value" style={{ fontSize: '1.45rem', padding: '0.4rem 0', textTransform: 'uppercase', color: '#60a5fa' }}>
            demo-viewer
          </span>
          <span className="metric-footer">🟢 Health Status: Connected</span>
        </div>
      </div>

      {errorMsg && (
        <div className="error-message" role="alert" style={{ marginBottom: '1.5rem' }}>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Database Mappings Grid Panel */}
      <div className="admin-card" style={{ borderRadius: '16px', border: '1px solid var(--border-color)', background: 'rgba(17, 24, 39, 0.45)' }}>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Assets Telemetry Details</th>
                <th>Routing URL Target</th>
                <th>Access Code Key</th>
                <th>Redirection state</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <span className="btn-loader" style={{ width: '32px', height: '32px', borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#8b5cf6' }}></span>
                    <p style={{ marginTop: '1rem', fontWeight: 600 }}>Loading node assets...</p>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    No project mappings found. Hit &quot;Sync GitHub Mappings&quot; to fetch files.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="project-name-cell" style={{ fontWeight: 700, fontSize: '0.95rem' }}>{project.name}</div>
                      <div className="project-desc-cell">{project.description || 'No description provided.'}</div>
                    </td>
                    <td>
                      <code style={{ color: '#60a5fa', fontSize: '0.85rem' }}>/projects/{project.slug}/index.html</code>
                    </td>
                    <td>
                      <div className="code-field-wrapper">
                        <span className={`code-display ${project.active === 0 ? 'inactive' : ''}`} style={{ fontWeight: 600, letterSpacing: '1px' }}>
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
          <form onSubmit={handleMetadataSave} className="modal-content" style={{ background: 'rgba(13, 17, 30, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px' }}>
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
          <form onSubmit={handleCustomCodeSave} className="modal-content" style={{ background: 'rgba(13, 17, 30, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px' }}>
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

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
  const [toastIcon, setToastIcon] = useState('check-circle');
  const [errorMsg, setErrorMsg] = useState('');

  // Editing state for metadata
  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Custom access code state
  const [editingCodeProject, setEditingCodeProject] = useState(null);
  const [customCode, setCustomCode] = useState('');

  const showToast = (msg, icon = 'check-circle') => {
    setToastMsg(msg);
    setToastIcon(icon);
    const timer = setTimeout(() => {
      setToastMsg('');
    }, 3500);
    return () => clearTimeout(timer);
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

  const runAutoSyncSilently = async () => {
    try {
      const syncRes = await fetch('/api/sync');
      const syncData = await syncRes.json();
      if (syncRes.ok && syncData.success) {
        const summary = syncData.summary;
        if (summary.added > 0 || summary.removed > 0 || summary.restored > 0 || summary.updated > 0) {
          showToast(`Synced: Added ${summary.added}, Removed ${summary.removed}, Updated ${summary.updated}`, 'refresh-cw');
          fetchProjects();
        }
      }
    } catch (err) {
      console.error('Silently syncing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthorization = async () => {
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
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuthorization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        showToast('Logged out successfully.', 'log-out');
      }
    } catch (err) {
      console.error(err);
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
        showToast(`Sync complete — ${summary.added} added, ${summary.removed} removed, ${summary.updated} updated.`, 'refresh-cw');
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
        showToast(`"${project.name}" status updated.`, 'check-circle');
        setProjects(projects.map(p => p.id === project.id ? { ...p, active: newStatus ? 1 : 0 } : p));
      } else {
        showToast(data.error || 'Failed to toggle status.', 'alert-circle');
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating status.', 'alert-circle');
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
        showToast('Access code regenerated successfully.', 'rotate-ccw');
        setProjects(projects.map(p => p.id === project.id ? { ...p, access_code: data.accessCode } : p));
      } else {
        showToast(data.error || 'Failed to regenerate code.', 'alert-circle');
      }
    } catch (err) {
      console.error(err);
      showToast('Error regenerating code.', 'alert-circle');
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
        showToast('Access code updated successfully.', 'check-circle');
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
        showToast('Project details updated successfully.', 'pencil');
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
        showToast('Database record deleted successfully.', 'trash-2');
        setProjects(projects.filter(p => p.id !== project.id));
      } else {
        showToast(data.error || 'Failed to delete record.', 'alert-circle');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting record.', 'alert-circle');
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

  // Render Loading screen before we know auth status
  if (isAuthorized === null) {
    return (
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-body)' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="np-icon np-spin">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--np-teal-700)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="6"/>
              <line x1="12" y1="18" x2="12" y2="22"/>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
              <line x1="2" y1="12" x2="6" y2="12"/>
              <line x1="18" y1="12" x2="22" y2="12"/>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
            </svg>
          </span>
          <p style={{ marginTop: '1.25rem', fontSize: '14.5px', fontWeight: 500 }}>Checking session…</p>
        </div>
      </main>
    );
  }

  // Render Login Gate if unauthenticated
  if (isAuthorized === false) {
    return (
      <main style={{ flex: 1, padding: '48px 24px' }}>
        <div 
          className="np-fade" 
          style={{ 
            maxWidth: '400px', 
            margin: '40px auto', 
            background: 'var(--surface-card)', 
            border: '1px solid var(--border-default)', 
            borderRadius: 'var(--radius-lg)', 
            boxShadow: 'var(--shadow-lifted)', 
            padding: '40px', 
            textAlign: 'center' 
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg className="np-icon" width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M10.6667 0H21.3333H32L21.3333 10.6667H10.6667H0L10.6667 0Z" fill="#08BDB8"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M21.3281 10.6667V21.3333V32L31.9948 21.3333V10.6667V0L21.3281 10.6667Z" fill="#FFCF36"/>
              <path d="M21.3281 0V10.6667L31.9948 0H21.3281Z" fill="#008C85"/>
              <path d="M21.3281 10.6667H31.9948V0L21.3281 10.6667Z" fill="#FF7F1F"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600, color: 'var(--text-strong)', margin: '0 0 8px' }}>
            Admin sign-in
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '0 0 28px' }}>
            Authorized administrative access only. Access strictly logged.
          </p>
          
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            <div className="np-input-wrapper">
              <label className="np-input-label" htmlFor="admin-secret">Console secret</label>
              <input 
                type="password" 
                id="admin-secret"
                className="np-input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={authLoading}
                autoFocus
              />
            </div>
            
            {authError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(209,75,75,0.08)', border: '1px solid rgba(209,75,75,0.25)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--np-danger)', fontSize: '13.5px', fontWeight: 500 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{authError}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="np-btn-primary" 
              style={{ width: '100%', padding: '12px' }}
              disabled={authLoading}
            >
              {authLoading && (
                <span className="np-icon np-spin">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"/>
                    <line x1="12" y1="18" x2="12" y2="22"/>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                    <line x1="2" y1="12" x2="6" y2="12"/>
                    <line x1="18" y1="12" x2="22" y2="12"/>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                  </svg>
                </span>
              )}
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
    <main style={{ flex: 1, padding: '48px 24px' }}>
      <div className="np-fade" style={{ maxWidth: 'var(--container-wide)', margin: '0 auto' }}>
        
        {/* Dashboard Header Title block */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 600, letterSpacing: '-1px', color: 'var(--text-strong)', margin: 0 }}>
                Console
              </h1>
              <span className="np-tag teal">Online</span>
            </div>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', margin: 0 }}>
              Telemetry orchestration, secure client codes, and deployment sync gateways.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleManualSync} 
              disabled={syncing}
              className="np-btn-secondary-sm"
              style={{ padding: '10px 18px', fontSize: '13.5px', height: '40px' }}
            >
              {syncing && (
                <span className="np-icon np-spin">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"/>
                    <line x1="12" y1="18" x2="12" y2="22"/>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                    <line x1="2" y1="12" x2="6" y2="12"/>
                    <line x1="18" y1="12" x2="22" y2="12"/>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                  </svg>
                </span>
              )}
              {syncing ? 'Syncing...' : 'Sync GitHub Mappings'}
            </button>
            <button 
              onClick={handleLogout}
              className="np-nav-btn"
              style={{ height: '40px', color: 'var(--np-danger)', border: '1px solid rgba(209, 75, 75, 0.25)', borderRadius: 'var(--radius-sm)', padding: '0 16px' }}
            >
              Log out
            </button>
          </div>
        </div>

        {/* Telemetry Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Total prototypes
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 700, color: 'var(--text-strong)' }}>
              {projects.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              Assets synced in workspace
            </div>
          </div>

          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Active handlers
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 700, color: 'var(--np-teal-700)' }}>
              {activeCount}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--np-teal-700)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Gateway links authorized
            </div>
          </div>

          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Inactive records
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 700, color: 'var(--np-orange)' }}>
              {projects.length - activeCount}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--np-orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Code redirections blocked
            </div>
          </div>

          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              D1 database node
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 600, color: 'var(--np-deep-teal)', margin: '6px 0 10px' }}>
              demo-viewer
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--np-teal-700)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
              </svg>
              Health status: connected
            </div>
          </div>
        </div>

        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(209,75,75,0.08)', border: '1px solid rgba(209,75,75,0.25)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', color: 'var(--np-danger)', fontSize: '13.5px', fontWeight: 500, marginBottom: '20px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Telemetry Asset Table */}
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="np-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Routing target</th>
                  <th>Access code</th>
                  <th>State</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                      <span className="np-icon np-spin">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--np-teal-700)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="2" x2="12" y2="6"/>
                          <line x1="12" y1="18" x2="12" y2="22"/>
                          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                          <line x1="2" y1="12" x2="6" y2="12"/>
                          <line x1="18" y1="12" x2="22" y2="12"/>
                          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                        </svg>
                      </span>
                      <p style={{ marginTop: '1rem', fontSize: '14.5px', fontWeight: 500 }}>Loading node assets...</p>
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
                        <div style={{ fontWeight: 600, fontSize: '14.5px', color: 'var(--text-strong)' }}>
                          {project.name}
                        </div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {project.description}
                        </div>
                      </td>
                      <td>
                        <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--text-link)' }}>
                          /projects/{project.slug}/index.html
                        </code>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ 
                            fontFamily: 'var(--font-mono)', 
                            fontSize: '13.5px', 
                            fontWeight: 600, 
                            color: project.active === 0 ? 'var(--text-muted)' : 'var(--np-teal-ink)',
                            textDecoration: project.active === 0 ? 'line-through' : 'none',
                            letterSpacing: '1px'
                          }}>
                            {project.access_code}
                          </span>
                          {project.active === 1 && (
                            <>
                              <button 
                                title="Edit access code" 
                                onClick={() => startEditCode(project)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '5px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 20h9"/>
                                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                                </svg>
                              </button>
                              <button 
                                title="Regenerate access code" 
                                onClick={() => regenerateCode(project)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '5px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                  <path d="M3 3v5h5"/>
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`np-tag ${project.active === 1 ? 'teal' : 'orange'}`}>
                          {project.active === 1 ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button 
                            onClick={() => toggleStatus(project)}
                            className="np-btn-secondary-sm"
                          >
                            {project.active === 1 ? 'Disable' : 'Enable'}
                          </button>
                          <button 
                            onClick={() => startEditDetails(project)}
                            className="np-btn-secondary-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteMetadata(project)}
                            className="np-btn-danger-sm"
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
      </div>

      {/* Edit Metadata Modal */}
      {editingProject && (
        <div className="np-modal-overlay">
          <form 
            onSubmit={handleMetadataSave} 
            style={{ 
              background: 'var(--surface-card)', 
              borderRadius: 'var(--radius-lg)', 
              width: '100%', 
              maxWidth: '440px', 
              padding: '32px', 
              boxShadow: 'var(--shadow-lifted)' 
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 600, color: 'var(--text-strong)', margin: '0 0 20px' }}>
              Edit project details
            </h3>
            
            <div className="np-input-wrapper" style={{ marginBottom: '16px' }}>
              <label className="np-input-label" htmlFor="edit-name">Project name</label>
              <input 
                type="text" 
                id="edit-name"
                className="np-input-field"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--np-graphite)', marginBottom: '6px' }}>
                Description
              </label>
              <textarea 
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                style={{ 
                  width: '100%', 
                  minHeight: '80px', 
                  padding: '10px 12px', 
                  border: '1px solid var(--border-default)', 
                  borderRadius: 'var(--radius-sm)', 
                  fontFamily: 'var(--font-body)', 
                  fontSize: '14.5px', 
                  color: 'var(--text-strong)', 
                  resize: 'vertical', 
                  boxSizing: 'border-box' 
                }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                type="button" 
                onClick={() => setEditingProject(null)} 
                className="np-btn-secondary-lg"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="np-btn-primary"
                style={{ padding: '10px 18px', fontSize: '13.5px' }}
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Access Code Modal */}
      {editingCodeProject && (
        <div className="np-modal-overlay">
          <form 
            onSubmit={handleCustomCodeSave} 
            style={{ 
              background: 'var(--surface-card)', 
              borderRadius: 'var(--radius-lg)', 
              width: '100%', 
              maxWidth: '400px', 
              padding: '32px', 
              boxShadow: 'var(--shadow-lifted)' 
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 600, color: 'var(--text-strong)', margin: '0 0 20px' }}>
              Custom access code
            </h3>
            
            <div className="np-input-wrapper" style={{ marginBottom: '8px' }}>
              <label className="np-input-label" htmlFor="edit-code">Enter code</label>
              <input 
                type="text" 
                id="edit-code"
                className="np-input-field"
                style={{ textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)' }}
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                required
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                type="button" 
                onClick={() => setEditingCodeProject(null)} 
                className="np-btn-secondary-lg"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="np-btn-primary"
                style={{ padding: '10px 18px', fontSize: '13.5px' }}
              >
                Update code
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bottom Toast Notification */}
      {toastMsg && (
        <div 
          style={{ 
            position: 'fixed', 
            bottom: '24px', 
            right: '24px', 
            background: 'var(--np-teal-ink)', 
            color: '#fff', 
            padding: '14px 20px', 
            borderRadius: 'var(--radius-md)', 
            fontSize: '13.5px', 
            fontWeight: 500, 
            boxShadow: 'var(--shadow-lifted)', 
            zIndex: 1000, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            animation: 'np-toast-in 0.25s var(--ease)', 
            maxWidth: '360px' 
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--np-teal-soft)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            {toastIcon === 'refresh-cw' ? (
              <>
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </>
            ) : toastIcon === 'log-out' ? (
              <>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </>
            ) : toastIcon === 'pencil' ? (
              <>
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
              </>
            ) : toastIcon === 'rotate-ccw' ? (
              <>
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </>
            ) : toastIcon === 'trash-2' ? (
              <>
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </>
            ) : (
              <>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </>
            )}
          </svg>
          <span>{toastMsg}</span>
        </div>
      )}
    </main>
  );
}

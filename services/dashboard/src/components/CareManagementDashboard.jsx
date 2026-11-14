import React, { useState, useEffect, useRef } from 'react';

const localDemo = import.meta.env.MODE === 'demo';
const apiBase = import.meta.env.VITE_API_BASE_URL || (localDemo ? '' : 'http://localhost:8003');
async function api(route, body) {
  const response = await fetch(apiBase + route, body === undefined ? undefined : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
}

const CareManagementDashboard = () => {
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState('');
  const modalRef = useRef(null);
  const previousFocus = useRef(null);
  const [members, setMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterHighRisk, setFilterHighRisk] = useState(false);
  const [filterEvidenceFound, setFilterEvidenceFound] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    evidenceFound: 0,
    inputSources: {}
  });

  useEffect(() => {
    fetchCareGaps();
  }, []);

  useEffect(() => {
    {
      let filteredMembers = allMembers;

      if (filterHighRisk) {
        filteredMembers = filteredMembers.filter(m => m.risk_level === 'HIGH');
      }

      if (filterEvidenceFound) {
        filteredMembers = filteredMembers.filter(m => m.evidence_found === true);
      }

      setMembers(filteredMembers);
    }
  }, [filterHighRisk, filterEvidenceFound, allMembers]);

  const fetchCareGaps = async () => {
    setLoading(true);
    setError('');
    try {
      const [data, counts] = await Promise.all([api('/care-gaps'), api('/care-management-stats')]);
      if (!Array.isArray(data)) throw new Error('The member response is invalid.');
      setAllMembers(data);
      setStats({ total: counts.total_members, highRisk: counts.high_risk,
        mediumRisk: counts.medium_risk, lowRisk: counts.low_risk,
        evidenceFound: counts.evidence_found, closed: counts.closed_gaps || 0,
        inputSources: counts.evidence_sources || {}, measures: counts.measures });
    } catch (failure) {
      setError(failure.message || 'Unable to load the local API. Start the demo and retry.');
    } finally { setLoading(false); }
  };

  const openMemberModal = async memberId => {
    setError('');
    try {
      const data = await api(`/member/${encodeURIComponent(memberId)}`);
      previousFocus.current = document.activeElement;
      setSelectedMember(data);
      setReason(''); setEvidence(''); setShowModal(true);
    } catch (failure) { setError(failure.message); }
  };

  useEffect(() => {
    if (!showModal) return;
    const dialog = modalRef.current;
    dialog?.querySelector('button')?.focus();
    const handleKey = event => {
      if (event.key === 'Escape') setShowModal(false);
      if (event.key === 'Tab') {
        const items = [...dialog.querySelectorAll('button:not(:disabled), input, textarea, a[href]')];
        const first = items[0]; const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); previousFocus.current?.focus(); };
  }, [showModal]);

  const sendManualAlert = async (memberId, alertType, message) => {
    setBusy(true); setError('');
    try {
      const result = await api(`/member/${encodeURIComponent(memberId)}/alert`, { alertType, message });
      setNotice(result.message || 'Scenario action recorded.');
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  };

  const closeGap = async (memberId, measureType) => {
    setBusy(true); setError('');
    try {
      await api(`/member/${encodeURIComponent(memberId)}/close-gap`, { measureType, closureReason: reason, evidence });
      setNotice('Synthetic gap closed. The event is available in the session export.');
      setShowModal(false); await fetchCareGaps();
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  };

  const resetDemo = async () => {
    setBusy(true); setError('');
    try { await api('/demo/reset', {}); setShowModal(false); setNotice('Demo reset: six open gaps, no events.'); await fetchCareGaps(); }
    catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  };
  const exportEvents = async () => {
    setError('');
    try {
      const data = await api('/demo/events');
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a'); link.href = url; link.download = 'synthetic-session.json'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (failure) { setError(failure.message); }
  };

  const getEvidenceSourceDisplay = (source) => {
    const sourceMap = {
      'EHR Epic': { label: 'EHR Epic', color: '#10b981', icon: '🏥' },
      'HIE (MMX)': { label: 'HIE (MMX)', color: '#8b5cf6', icon: '🔗' },
      'Corepoint Integration': { label: 'Corepoint Integration', color: '#3b82f6', icon: '⚡' },
      'SFTP Charts': { label: 'SFTP Charts', color: '#f59e0b', icon: '📊' },
      'FTP Load': { label: 'FTP Load', color: '#06b6d4', icon: '📁' },
      'None': { label: 'No Evidence Found', color: '#ef4444', icon: '❌' },
      'Synthetic fixture': { label: 'Synthetic fixture', color: '#059669', icon: '◈' },
      'NONE': { label: 'No Evidence Found', color: '#ef4444', icon: '❌' }
    };

    return sourceMap[source] || { label: source, color: '#6b7280', icon: '❓' };
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH': return '#ef4444';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW': return '#10b981';
      default: return '#6b7280';
    }
  };

  const styles = {
    container: {
      padding: '2rem',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '1rem'
    },
    dataSourceIndicators: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    sourceCard: {
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '0.75rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      minWidth: '120px',
      border: '2px solid #e5e7eb',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    sourceIcon: {
      fontSize: '1.5rem',
      marginBottom: '0.5rem'
    },
    sourceLabel: {
      fontWeight: 'bold',
      fontSize: '0.875rem',
      color: '#374151',
      marginBottom: '0.25rem'
    },
    sourceCount: {
      fontSize: '0.75rem',
      color: '#6b7280'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    statLabel: {
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    table: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    tableHeader: {
      backgroundColor: '#f9fafb',
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb'
    },
    tableRow: {
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    badge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      color: 'white'
    },
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      padding: '2rem',
      maxWidth: '800px',
      maxHeight: '80vh',
      overflow: 'auto',
      width: '90%'
    }
  };

  if (loading) {
    return (
      <div style={styles.container} className="care-workflow">
      {error && <div className="workflow-error" role="alert">{error} <button onClick={fetchCareGaps}>Retry loading</button></div>}
      {notice && <div className="workflow-status" role="status">{notice}</div>}
      {localDemo && <div className="workflow-toolbar">
        <p>Review evidence, record a decision, and inspect the event history.</p>
        <button onClick={exportEvents} disabled={busy}>Export session JSON</button>
        <button onClick={resetDemo} disabled={busy}>Reset demo</button>
      </div>}
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>Loading care management data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container} className="care-workflow">
      {error && <div className="workflow-error" role="alert">{error} <button onClick={fetchCareGaps}>Retry loading</button></div>}
      {notice && <div className="workflow-status" role="status">{notice}</div>}
      {localDemo && <div className="workflow-toolbar">
        <p>Review evidence, record a decision, and inspect the event history.</p>
        <button onClick={exportEvents} disabled={busy}>Export session JSON</button>
        <button onClick={resetDemo} disabled={busy}>Reset demo</button>
      </div>}
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Review a Synthetic Care Gap</h1>
        <p style={styles.subtitle}>
          Six fictional members. Inspect the evidence, simulate outreach, and record a reviewed closure.
        </p>

        <div style={styles.dataSourceIndicators}>
          <div style={styles.sourceCard}><div style={styles.sourceLabel}>01 · Review</div><div style={styles.sourceCount}>Inspect a fictional member and evidence</div></div>
          <div style={styles.sourceCard}><div style={styles.sourceLabel}>02 · Decide</div><div style={styles.sourceCount}>Record a reason and supporting evidence</div></div>
          <div style={styles.sourceCard}><div style={styles.sourceLabel}>03 · Inspect</div><div style={styles.sourceCount}>Export the real session event history</div></div>
        </div>
      </div>

      {/* Enhanced Statistics - Value Proposition Focus */}
      <div style={styles.statsGrid}>
        <div style={{
          ...styles.statCard,
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '2.5rem' }}>👥</div>
            <div style={{ ...styles.statValue, color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.total}</div>
          </div>
          <div style={{ ...styles.statLabel, color: 'rgba(255,255,255,0.9)', fontSize: '1rem', fontWeight: '600' }}>Total Members</div>
          <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '0.375rem' }}>
            📊 Fixture Priorities: <span style={{ fontWeight: 'bold' }}>{stats.highRisk}H</span> / <span style={{ fontWeight: 'bold' }}>{stats.mediumRisk}M</span> / <span style={{ fontWeight: 'bold' }}>{stats.lowRisk}L</span>
          </div>
        </div>

        <div
          style={{
            ...styles.statCard,
            cursor: 'pointer',
            background: filterEvidenceFound
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            color: filterEvidenceFound ? 'white' : '#065f46',
            border: filterEvidenceFound ? '3px solid #059669' : '2px solid #10b981',
            boxShadow: filterEvidenceFound
              ? '0 8px 25px rgba(16, 185, 129, 0.4)'
              : '0 4px 15px rgba(16, 185, 129, 0.2)',
            transform: filterEvidenceFound ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}
          role="button" tabIndex={0} aria-pressed={filterEvidenceFound}
          onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setFilterEvidenceFound(!filterEvidenceFound); } }}
          onClick={() => setFilterEvidenceFound(!filterEvidenceFound)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '2.5rem' }}>✅</div>
            <div style={{
              ...styles.statValue,
              color: filterEvidenceFound ? 'white' : '#059669',
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}>{stats.evidenceFound}</div>
          </div>
          <div style={{
            ...styles.statLabel,
            color: filterEvidenceFound ? 'rgba(255,255,255,0.9)' : '#065f46',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            Evidence Found {filterEvidenceFound ? '(Filtered)' : '(Click to Filter)'}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: filterEvidenceFound ? 'rgba(255,255,255,0.8)' : '#059669',
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: filterEvidenceFound ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.1)',
            borderRadius: '0.375rem',
            fontWeight: 'bold'
          }}>
            🎯 {stats.total > 0 ? Math.round((stats.evidenceFound / stats.total) * 100) : 0}% with fixture evidence
          </div>
        </div>

        <div style={{
          ...styles.statCard,
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          color: 'white',
          boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '2.5rem' }}>🔗</div>
            <div style={{ ...styles.statValue, color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}>{Object.keys(stats.inputSources || {}).length}</div>
          </div>
          <div style={{ ...styles.statLabel, color: 'rgba(255,255,255,0.9)', fontSize: '1rem', fontWeight: '600' }}>Evidence Categories</div>
          <div style={{
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            padding: '0.5rem',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '0.375rem'
          }}>
            {Object.entries(stats.inputSources || {}).map(([source, count]) => (
              <div key={source} style={{
                marginBottom: '0.25rem',
                color: 'rgba(255,255,255,0.9)',
                fontWeight: '500'
              }}>
                {getEvidenceSourceDisplay(source).icon} {getEvidenceSourceDisplay(source).label}: <span style={{ fontWeight: 'bold' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            ...styles.statCard,
            cursor: 'pointer',
            background: filterHighRisk
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            color: filterHighRisk ? 'white' : '#991b1b',
            border: filterHighRisk ? '3px solid #dc2626' : '2px solid #ef4444',
            boxShadow: filterHighRisk
              ? '0 8px 25px rgba(239, 68, 68, 0.4)'
              : '0 4px 15px rgba(239, 68, 68, 0.2)',
            transform: filterHighRisk ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}
          role="button" tabIndex={0} aria-pressed={filterHighRisk}
          onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setFilterHighRisk(!filterHighRisk); } }}
          onClick={() => setFilterHighRisk(!filterHighRisk)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '2.5rem' }}>⚠️</div>
            <div style={{
              ...styles.statValue,
              color: filterHighRisk ? 'white' : '#dc2626',
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}>{stats.highRisk || 0}</div>
          </div>
          <div style={{
            ...styles.statLabel,
            color: filterHighRisk ? 'rgba(255,255,255,0.9)' : '#991b1b',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            High Priority (Fixture) {filterHighRisk ? '(Filtered)' : '(Click to Filter)'}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: filterHighRisk ? 'rgba(255,255,255,0.8)' : '#dc2626',
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: filterHighRisk ? 'rgba(255,255,255,0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '0.375rem',
            fontWeight: 'bold'
          }}>
            🚨 Illustrative priority; not a prediction
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#06b6d4' }}>{stats.closed || 0}</div>
          <div style={styles.statLabel}>Gaps Closed This Session</div>
          <div style={{ fontSize: '0.75rem', color: '#06b6d4', marginTop: '0.25rem' }}>
            Explicit review actions recorded in memory
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="workflow-table-scroll"><div style={styles.table}>
        <div style={styles.tableHeader}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>
            Synthetic Care Gap Review Queue
          </h3>
        </div>

        {members.map((member, index) => {
          const evidenceSource = getEvidenceSourceDisplay(member.evidence_source);

          return (
            <div
              key={member.member_id}
              style={{
                ...styles.tableRow,
                minWidth: 840,
                backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb'
              }}
              onClick={() => openMemberModal(member.member_id)}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = index % 2 === 0 ? 'white' : '#f9fafb'}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600' }}>{member.name || `Member ${member.member_id.slice(-4)}`}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    ID: {member.member_id} | Age: {member.age}
                  </div>
                </div>

                <div>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: member.measure_type === 'CCS' ? '#8b5cf6' : member.measure_type === 'WCV' ? '#06b6d4' : '#f59e0b'
                  }}>
                    {member.measure_type}
                  </span>
                </div>

                <div>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: getRiskColor(member.risk_level)
                  }}>
                    {member.risk_level} PRIORITY
                  </span>
                </div>

                <div>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: evidenceSource.color
                  }}>
                    {evidenceSource.icon} {member.evidence_found ? 'FOUND' : 'MISSING'}
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {evidenceSource.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Status: {member.gap_status || 'scenario'}
                  </div>
                </div>

                <div>
                  <button
                    style={{
                      ...styles.button,
                      backgroundColor: '#3b82f6',
                      color: 'white'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openMemberModal(member.member_id);
                    }}
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      </div>
      {/* Member Detail Modal */}
      {showModal && selectedMember && (
        <div style={styles.modal}>
          <div style={styles.modalContent} role="dialog" aria-modal="true" aria-labelledby="member-dialog-title" ref={modalRef}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 id="member-dialog-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                Member Details: {selectedMember.name || `Member ${selectedMember.member_id}`}
              </h2>
              <button
                aria-label="Close member details" onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              {/* Member Information */}
              <div style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--primary-blue)' }}>
                  👤 Member Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Member ID:</strong> {selectedMember.member_id}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Name:</strong> {selectedMember.name}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Age:</strong> {selectedMember.age}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Language:</strong> {selectedMember.language}
                    </div>
                  </div>
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Fixture priority:</strong>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: getRiskColor(selectedMember.risk_level),
                        marginLeft: '0.5rem'
                      }}>
                        {selectedMember.risk_level}
                      </span>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Measure Type:</strong> {selectedMember.measure_type}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Illustrative priority score:</strong> {(selectedMember.risk_probability * 100).toFixed(1)}%
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Due Date:</strong> {selectedMember.intervention_due_date}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Layer 1: Evidence Extraction */}
              {selectedMember.evidence_found && selectedMember.clinical_quote && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '0.5rem',
                  border: '2px solid var(--success-green)'
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--success-green)' }}>
                    🤖 Synthetic Evidence for Review
                  </h3>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1fae5',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#065f46', marginBottom: '0.5rem' }}>
                      📋 Clinical Evidence Found:
                    </div>
                    <div style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#374151' }}>
                      "{selectedMember.clinical_quote}"
                    </div>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Evidence Source:</strong>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: getEvidenceSourceDisplay(selectedMember.evidence_source).color,
                      marginLeft: '0.5rem'
                    }}>
                      {getEvidenceSourceDisplay(selectedMember.evidence_source).icon} {getEvidenceSourceDisplay(selectedMember.evidence_source).label}
                    </span>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Data origin:</strong> Synthetic fixture
                  </div>
                </div>
              )}

              {/* AI Layer 2: Risk Prediction */}
              {!selectedMember.evidence_found && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#fef2f2',
                  borderRadius: '0.5rem',
                  border: '2px solid #ef4444'
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#ef4444' }}>
                    🧠 Synthetic Priority Context
                  </h3>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #fecaca',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>
                      ⚠️ No Evidence Found - Risk Analysis:
                    </div>
                    <div style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#374151' }}>
                      The fixture assigns a score of {(selectedMember.risk_probability * 100).toFixed(0)}%. This is demonstration data, not a model prediction or care recommendation.
                    </div>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Evidence Source:</strong>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: '#ef4444',
                      marginLeft: '0.5rem'
                    }}>
                      ❌ No Evidence Found
                    </span>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Data origin:</strong> Synthetic fixture
                  </div>
                </div>
              )}

              {/* Risk Factors and Protective Factors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Risk Factors */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#fef2f2',
                  borderRadius: '0.5rem',
                  border: '1px solid #fecaca'
                }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#dc2626' }}>
                    ⚠️ Risk Factors
                  </h4>
                  {selectedMember.risk_factors && selectedMember.risk_factors.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.875rem' }}>
                      {selectedMember.risk_factors.map((factor, index) => (
                        <li key={index} style={{ marginBottom: '0.25rem', color: '#374151' }}>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
                      No specific risk factors identified
                    </div>
                  )}
                </div>

                {/* Protective Factors */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1fae5'
                }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#059669' }}>
                    ✅ Protective Factors
                  </h4>
                  {selectedMember.protective_factors && selectedMember.protective_factors.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.875rem' }}>
                      {selectedMember.protective_factors.map((factor, index) => (
                        <li key={index} style={{ marginBottom: '0.25rem', color: '#374151' }}>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
                      No protective factors identified
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--primary-blue)' }}>
                  🎯 Care Management Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    style={{
                      ...styles.button,
                      backgroundColor: 'var(--primary-blue)',
                      color: 'white',
                      padding: '0.75rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}
                    disabled={busy || !localDemo}
                    onClick={() => sendManualAlert(selectedMember.member_id, 'text', 'Care gap intervention needed')}
                  >
                    📱 Simulate Text Outreach
                  </button>
                  <button
                    style={{
                      ...styles.button,
                      backgroundColor: 'var(--success-green)',
                      color: 'white',
                      padding: '0.75rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}
                    disabled={busy || !localDemo}
                    onClick={() => sendManualAlert(selectedMember.member_id, 'reminder', 'Appointment reminder')}
                  >
                    📅 Simulate Appointment Reminder
                  </button>
                  {localDemo && selectedMember.gap_status !== 'closed' && <div className="review-inputs">
                    <label>Review reason<input value={reason} maxLength={500} onChange={event => setReason(event.target.value)} placeholder="Use synthetic review notes only" /></label>
                    <label>Evidence reviewed<textarea value={evidence} maxLength={500} onChange={event => setEvidence(event.target.value)} placeholder="Describe the synthetic evidence you reviewed" /></label>
                  </div>}
                  {error && <p role="alert" className="workflow-error">{error}</p>}
                  {notice && <p role="status" className="workflow-status">{notice}</p>}
                  {selectedMember.gap_status === 'closed' ? (
                    <button
                      style={{
                        ...styles.button,
                        backgroundColor: '#059669',
                        color: 'white',
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'default',
                        opacity: 0.8
                      }}
                      disabled
                    >
                      ✅ Gap Closed in This Demo Session
                    </button>
                  ) : (
                    <button
                      style={{
                        ...styles.button,
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}
                      disabled={busy || !localDemo || !reason.trim() || !evidence.trim()}
                      onClick={() => closeGap(selectedMember.member_id, selectedMember.measure_type)}
                    >
                      🔄 Record Reviewed Closure
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareManagementDashboard;

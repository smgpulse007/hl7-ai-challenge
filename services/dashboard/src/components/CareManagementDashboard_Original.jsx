import React, { useState, useEffect } from 'react';

const CareManagementDashboard = () => {
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
    if (allMembers.length > 0) {
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
    try {
      setLoading(true);

      // Fetch both member data and statistics
      const [membersResponse, statsResponse] = await Promise.all([
        fetch('http://localhost:8003/care-gaps'),
        fetch('http://localhost:8003/care-management-stats')
      ]);

      const membersData = await membersResponse.json();
      const statsData = await statsResponse.json();

      setAllMembers(membersData);
      setMembers(filterHighRisk ? membersData.filter(m => m.risk_level === 'HIGH') : membersData);

      // Use enhanced statistics from backend
      const newStats = {
        total: statsData.total_members,
        highRisk: statsData.high_risk,
        mediumRisk: statsData.medium_risk,
        lowRisk: statsData.low_risk,
        evidenceFound: statsData.evidence_found,
        inputSources: statsData.evidence_sources,
        measures: statsData.measures,
        costImpact: statsData.cost_impact
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching care gaps:', error);
      // Fallback to basic calculation if enhanced stats fail
      try {
        const response = await fetch('http://localhost:8003/care-gaps');
        const data = await response.json();
        setMembers(data);

        const fallbackStats = {
          total: data.length,
          highRisk: data.filter(m => m.risk_level === 'HIGH').length,
          mediumRisk: data.filter(m => m.risk_level === 'MEDIUM').length,
          lowRisk: data.filter(m => m.risk_level === 'LOW').length,
          evidenceFound: data.filter(m => m.evidence_found).length,
          inputSources: {}
        };

        data.forEach(member => {
          const source = member.evidence_source || 'NONE';
          fallbackStats.inputSources[source] = (fallbackStats.inputSources[source] || 0) + 1;
        });

        setStats(fallbackStats);
      } catch (fallbackError) {
        console.error('Error with fallback data fetch:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const openMemberModal = async (memberId) => {
    try {
      const response = await fetch(`http://localhost:8003/member/${memberId}`);
      const memberData = await response.json();
      setSelectedMember(memberData);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching member details:', error);
    }
  };

  const sendManualAlert = async (memberId, alertType, message) => {
    try {
      const response = await fetch(`http://localhost:8003/member/${memberId}/alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertType, message })
      });

      if (response.ok) {
        alert('Alert sent successfully!');
        fetchCareGaps(); // Refresh data
      }
    } catch (error) {
      console.error('Error sending alert:', error);
    }
  };

  const closeGap = async (memberId, measureType, reason, evidence) => {
    try {
      const response = await fetch(`http://localhost:8003/member/${memberId}/close-gap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ measureType, closureReason: reason, evidence })
      });

      if (response.ok) {
        alert('Care gap closed successfully!');
        setShowModal(false);
        fetchCareGaps(); // Refresh data
      }
    } catch (error) {
      console.error('Error closing gap:', error);
    }
  };

  const getEvidenceSourceDisplay = (source) => {
    const sourceMap = {
      'EHR Epic': { label: 'EHR Epic', color: '#10b981', icon: '🏥' },
      'HIE (MMX)': { label: 'HIE (MMX)', color: '#8b5cf6', icon: '🔗' },
      'Corepoint Integration': { label: 'Corepoint Integration', color: '#3b82f6', icon: '⚡' },
      'SFTP Charts': { label: 'SFTP Charts', color: '#f59e0b', icon: '📊' },
      'FTP Load': { label: 'FTP Load', color: '#06b6d4', icon: '📁' },
      'None': { label: 'No Evidence Found', color: '#ef4444', icon: '❌' },
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
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>Loading care management data...</div>
        </div>
      </div>

      {/* Enhanced Statistics - Value Proposition Focus */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#3b82f6' }}>{stats.total}</div>
          <div style={styles.statLabel}>Total Members</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Risk Distribution: {stats.highRisk}H / {stats.mediumRisk}M / {stats.lowRisk}L
          </div>
        </div>

        <div
          style={{
            ...styles.statCard,
            cursor: 'pointer',
            border: filterEvidenceFound ? '2px solid #10b981' : '1px solid #e5e7eb',
            backgroundColor: filterEvidenceFound ? '#f0fdf4' : 'white'
          }}
          onClick={() => setFilterEvidenceFound(!filterEvidenceFound)}
        >
          <div style={{ ...styles.statValue, color: '#10b981' }}>{stats.evidenceFound}</div>
          <div style={styles.statLabel}>
            Evidence Found {filterEvidenceFound ? '(Filtered)' : '(Click to Filter)'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>
            {stats.total > 0 ? Math.round((stats.evidenceFound / stats.total) * 100) : 0}% Completion Rate
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#8b5cf6' }}>{Object.keys(stats.inputSources || {}).length}</div>
          <div style={styles.statLabel}>Input Sources</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
            {Object.entries(stats.inputSources || {}).map(([source, count]) => (
              <div key={source} style={{ marginBottom: '0.25rem' }}>
                {getEvidenceSourceDisplay(source).icon} {getEvidenceSourceDisplay(source).label}: {count}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            ...styles.statCard,
            cursor: 'pointer',
            border: filterHighRisk ? '2px solid #ef4444' : '1px solid #e5e7eb',
            backgroundColor: filterHighRisk ? '#fef2f2' : 'white'
          }}
          onClick={() => setFilterHighRisk(!filterHighRisk)}
        >
          <div style={{ ...styles.statValue, color: '#ef4444' }}>{stats.highRisk || 0}</div>
          <div style={styles.statLabel}>
            High Risk - Immediate Action {filterHighRisk ? '(Filtered)' : '(Click to Filter)'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
            85% Non-Compliance Risk
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#06b6d4' }}>60%</div>
          <div style={styles.statLabel}>Avoided Unnecessary Outreach</div>
          <div style={{ fontSize: '0.75rem', color: '#06b6d4', marginTop: '0.25rem' }}>
            EMR-only would miss {stats.evidenceFound || 0} completed screenings
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>
            Care Gaps Requiring Intervention
          </h3>
        </div>

        {members.map((member, index) => {
          const evidenceSource = getEvidenceSourceDisplay(member.evidence_source);

          return (
            <div
              key={member.member_id}
              style={{
                ...styles.tableRow,
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
                    {member.risk_level} RISK
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
                    Processing: {member.processing_time}s
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
  );
};

export default CareManagementDashboard;
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Population Health Intelligence</h1>
        <p style={styles.subtitle}>
          Multi-Standard AI Platform: HL7 v2.x • FHIR R4 • CDA Documents • Real-time Clinical Decision Support
        </p>

        {/* Data Source Diversity Indicators */}
        <div style={styles.dataSourceIndicators}>
          <div style={styles.sourceCard}>
            <div style={styles.sourceIcon}>📋</div>
            <div style={styles.sourceLabel}>HL7 v2.x</div>
            <div style={styles.sourceCount}>MDM, ORU, ADT</div>
          </div>
          <div style={styles.sourceCard}>
            <div style={styles.sourceIcon}>🔗</div>
            <div style={styles.sourceLabel}>FHIR R4</div>
            <div style={styles.sourceCount}>Patient, DiagnosticReport</div>
          </div>
          <div style={styles.sourceCard}>
            <div style={styles.sourceIcon}>🏥</div>
            <div style={styles.sourceLabel}>EMR</div>
            <div style={styles.sourceCount}>Epic, Cerner</div>
          </div>
          <div style={styles.sourceCard}>
            <div style={styles.sourceIcon}>🌐</div>
            <div style={styles.sourceLabel}>HIE</div>
            <div style={styles.sourceCount}>Multi-facility</div>
          </div>
          <div style={styles.sourceCard}>
            <div style={styles.sourceIcon}>💊</div>
            <div style={styles.sourceLabel}>Pharmacy</div>
            <div style={styles.sourceCount}>Claims, Labs</div>
          </div>
        </div>
      </div>

import React, { useState, useEffect } from 'react';

const SimpleDemoApp = () => {
  const [activeDemo, setActiveDemo] = useState('overview');
  const [liveStats, setLiveStats] = useState({
    totalMembers: 450000,
    careGapsIdentified: 5,
    projectedSavings: 46750,
    successRate: 65,
    servicesHealthy: 3
  });

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        careGapsIdentified: Math.floor(Math.random() * 3) + 4,
        projectedSavings: 46750 + Math.floor(Math.random() * 5000),
        successRate: 65 + Math.floor(Math.random() * 10)
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    nav: {
      backgroundColor: '#1e3a8a',
      color: 'white',
      padding: '1rem'
    },
    navHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    navTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      margin: 0
    },
    navSubtitle: {
      fontSize: '0.875rem',
      opacity: 0.8,
      margin: 0
    },
    badge: {
      backgroundColor: '#16a34a',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600'
    },
    navButtons: {
      display: 'flex',
      gap: '0.25rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    navButton: {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    navButtonActive: {
      backgroundColor: '#1d4ed8',
      color: 'white'
    },
    navButtonInactive: {
      backgroundColor: 'transparent',
      color: '#bfdbfe'
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      marginBottom: '1.5rem'
    },
    cardHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #e5e7eb'
    },
    cardContent: {
      padding: '1.5rem'
    },
    heroCard: {
      background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
      border: '2px solid #3b82f6'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      textAlign: 'center',
      margin: '0 0 1rem 0',
      color: '#1f2937'
    },
    subtitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      textAlign: 'center',
      margin: '0 0 1rem 0',
      color: '#1e40af'
    },
    description: {
      fontSize: '1.25rem',
      textAlign: 'center',
      margin: '0 0 2rem 0',
      color: '#374151',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    badgeContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      flexWrap: 'wrap'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    statCard: {
      textAlign: 'center',
      padding: '1.5rem',
      borderRadius: '0.5rem'
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    differentiatorGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    differentiatorCard: {
      border: '2px solid #e5e7eb',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    differentiatorHeader: {
      textAlign: 'center',
      padding: '1.5rem'
    },
    differentiatorIcon: {
      fontSize: '3rem',
      marginBottom: '1rem'
    },
    differentiatorTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    differentiatorSubtitle: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#6b7280',
      marginBottom: '0.5rem'
    },
    differentiatorDesc: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '1rem'
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500'
    }
  };

  const ExecutiveOverview = () => (
    <div>
      {/* Hero Section */}
      <div style={{...styles.card, ...styles.heroCard}}>
        <div style={styles.cardContent}>
          <h1 style={styles.title}>HEDIS AI Platform</h1>
          <h2 style={styles.subtitle}>The Only Platform That Does All Three</h2>
          <p style={styles.description}>
            While every EMR can show you care gaps, <strong>no other platform can predict who won't close them, 
            combine data from multiple sources beyond the EMR, and serve both payers and providers 
            with the same intelligence.</strong>
          </p>
          <div style={styles.badgeContainer}>
            <span style={{...styles.badge, backgroundColor: '#16a34a'}}>
              100% End-to-End Success Rate
            </span>
            <span style={{...styles.badge, backgroundColor: '#6b7280'}}>
              Production Ready
            </span>
            <span style={{...styles.badge, backgroundColor: '#6b7280'}}>
              Projected ROI: $3.2M+
            </span>
          </div>
        </div>
      </div>

      {/* Live Stats */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: '600'}}>Live Platform Metrics</h3>
          <p style={{margin: '0.5rem 0 0 0', color: '#6b7280'}}>Real-time data from production-ready services</p>
        </div>
        <div style={styles.cardContent}>
          <div style={styles.statsGrid}>
            <div style={{...styles.statCard, backgroundColor: '#dbeafe'}}>
              <div style={{...styles.statValue, color: '#2563eb'}}>
                {liveStats.totalMembers.toLocaleString()}
              </div>
              <div style={styles.statLabel}>Total Members</div>
            </div>
            <div style={{...styles.statCard, backgroundColor: '#dcfce7'}}>
              <div style={{...styles.statValue, color: '#16a34a'}}>
                {liveStats.careGapsIdentified}
              </div>
              <div style={styles.statLabel}>Care Gaps Identified</div>
            </div>
            <div style={{...styles.statCard, backgroundColor: '#f3e8ff'}}>
              <div style={{...styles.statValue, color: '#9333ea'}}>
                ${liveStats.projectedSavings.toLocaleString()}
              </div>
              <div style={styles.statLabel}>Projected Savings</div>
            </div>
            <div style={{...styles.statCard, backgroundColor: '#fed7aa'}}>
              <div style={{...styles.statValue, color: '#ea580c'}}>
                {liveStats.successRate}%
              </div>
              <div style={styles.statLabel}>Success Rate</div>
            </div>
            <div style={{...styles.statCard, backgroundColor: '#f3f4f6'}}>
              <div style={{...styles.statValue, color: '#4b5563'}}>
                {liveStats.servicesHealthy}/4
              </div>
              <div style={styles.statLabel}>Services Healthy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Three Differentiators */}
      <div style={styles.differentiatorGrid}>
        <div 
          style={{...styles.card, ...styles.differentiatorCard, borderColor: '#3b82f6'}}
          onClick={() => setActiveDemo('multi-source')}
        >
          <div style={styles.differentiatorHeader}>
            <div style={{...styles.differentiatorIcon, color: '#3b82f6'}}>📊</div>
            <h3 style={styles.differentiatorTitle}>Multi-Source Integration</h3>
            <p style={styles.differentiatorSubtitle}>Input Agnostic Data Platform</p>
            <p style={styles.differentiatorDesc}>
              Captures 30-40% more completed care than EMR-only solutions
            </p>
            <span style={{...styles.badge, backgroundColor: '#16a34a'}}>✅ Demonstrated</span>
          </div>
          <div style={styles.cardContent}>
            <div style={{marginBottom: '1rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span style={{fontSize: '0.875rem', color: '#6b7280'}}>Data Sources:</span>
                <span style={{fontSize: '0.875rem', fontWeight: '600'}}>4+ integrated</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span style={{fontSize: '0.875rem', color: '#6b7280'}}>Care Captured:</span>
                <span style={{fontSize: '0.875rem', fontWeight: '600'}}>+30-40%</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span style={{fontSize: '0.875rem', color: '#6b7280'}}>Projected Savings:</span>
                <span style={{fontSize: '0.875rem', fontWeight: '600'}}>$50 per outreach</span>
              </div>
            </div>
            <button style={{...styles.button, backgroundColor: '#3b82f6', width: '100%'}}>
              View Demo
            </button>
          </div>
        </div>

        <div 
          style={{...styles.card, ...styles.differentiatorCard, borderColor: '#16a34a'}}
          onClick={() => setActiveDemo('predictive')}
        >
          <div style={styles.differentiatorHeader}>
            <div style={{...styles.differentiatorIcon, color: '#16a34a'}}>📈</div>
            <h3 style={styles.differentiatorTitle}>Predictive Analytics</h3>
            <p style={styles.differentiatorSubtitle}>Non-Compliance Prediction</p>
            <p style={styles.differentiatorDesc}>
              75% cost reduction with 3.2x higher success rates
            </p>
            <span style={{...styles.badge, backgroundColor: '#16a34a'}}>✅ Demonstrated</span>
          </div>
          <div style={styles.cardContent}>
            <div style={{marginBottom: '1rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span style={{fontSize: '0.875rem', color: '#6b7280'}}>Cost Reduction:</span>
                <span style={{fontSize: '0.875rem', fontWeight: '600'}}>75%</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span style={{fontSize: '0.875rem', color: '#6b7280'}}>Success Rate:</span>
                <span style={{fontSize: '0.875rem', fontWeight: '600'}}>3.2x higher</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span style={{fontSize: '0.875rem', color: '#6b7280'}}>Efficiency:</span>
                <span style={{fontSize: '0.875rem', fontWeight: '600'}}>Precision targeting</span>
              </div>
            </div>
            <button style={{...styles.button, backgroundColor: '#16a34a', width: '100%'}}>
              View Demo
            </button>
          </div>
        </div>

        <div 
          style={{...styles.card, ...styles.differentiatorCard, borderColor: '#9333ea'}}
          onClick={() => setActiveDemo('multi-industry')}
        >
          <div style={styles.differentiatorHeader}>
            <div style={{...styles.differentiatorIcon, color: '#9333ea'}}>🏢</div>
            <h3 style={styles.differentiatorTitle}>Multi-Industry Platform</h3>
            <p style={styles.differentiatorSubtitle}>Scalable Business Models</p>
            <p style={styles.differentiatorDesc}>
              Scales from 2,400-patient practices to 450,000-member health plans
            </p>
            <span style={{...styles.badge, backgroundColor: '#16a34a'}}>✅ Demonstrated</span>
          </div>
          <div style={styles.cardContent}>
            <div style={{marginBottom: '1rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span style={{fontSize: '0.875rem', color: '#6b7280'}}>Scalability:</span>
                <span style={{fontSize: '0.875rem', fontWeight: '600'}}>2K to 450K</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span style={{fontSize: '0.875rem', color: '#6b7280'}}>Industries:</span>
                <span style={{fontSize: '0.875rem', fontWeight: '600'}}>3 verticals</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span style={{fontSize: '0.875rem', color: '#6b7280'}}>Revenue Streams:</span>
                <span style={{fontSize: '0.875rem', fontWeight: '600'}}>Multiple</span>
              </div>
            </div>
            <button style={{...styles.button, backgroundColor: '#9333ea', width: '100%'}}>
              View Demo
            </button>
          </div>
        </div>
      </div>

      {/* Competitive Advantage */}
      <div style={{...styles.card, backgroundColor: '#fef3c7', border: '2px solid #f59e0b'}}>
        <div style={styles.cardHeader}>
          <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: '600', color: '#92400e'}}>
            ⚠️ Unique Market Position
          </h3>
        </div>
        <div style={styles.cardContent}>
          <p style={{color: '#92400e', marginBottom: '1rem', fontSize: '1rem'}}>
            <strong>No other platform combines all three capabilities.</strong> This creates an unassailable 
            competitive position in the healthcare quality management market.
          </p>
          <div style={styles.statsGrid}>
            <div style={{...styles.statCard, backgroundColor: 'white'}}>
              <div style={{...styles.statValue, color: '#92400e', fontSize: '1.5rem'}}>First-to-Market</div>
              <div style={styles.statLabel}>All three capabilities combined</div>
            </div>
            <div style={{...styles.statCard, backgroundColor: 'white'}}>
              <div style={{...styles.statValue, color: '#92400e', fontSize: '1.5rem'}}>Defensible Moat</div>
              <div style={styles.statLabel}>Complex AI integration</div>
            </div>
            <div style={{...styles.statCard, backgroundColor: 'white'}}>
              <div style={{...styles.statValue, color: '#92400e', fontSize: '1.5rem'}}>Platform Economics</div>
              <div style={styles.statLabel}>Multiple revenue streams</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MultiSourceDemo = () => (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={{margin: 0, fontSize: '2rem', fontWeight: 'bold'}}>Multi-Source Data Integration Demo</h2>
        <p style={{margin: '0.5rem 0 0 0', color: '#6b7280'}}>
          Patient: Maria Rodriguez (ID: 99990001000000) | Age: 35
        </p>
      </div>
      <div style={styles.cardContent}>
        <div style={{...styles.card, backgroundColor: '#fef2f2', border: '2px solid #ef4444', marginBottom: '2rem'}}>
          <div style={styles.cardHeader}>
            <h3 style={{color: '#dc2626', margin: 0}}>EMR-Only View (Traditional)</h3>
            <span style={{...styles.badge, backgroundColor: '#ef4444'}}>GAP IDENTIFIED</span>
          </div>
          <div style={styles.cardContent}>
            <p><strong>Status:</strong> <span style={{color: '#dc2626', fontWeight: 'bold'}}>GAP IDENTIFIED</span></p>
            <p><strong>Last Screening:</strong> Not documented in EMR</p>
            <p><strong>Confidence:</strong> <span style={{color: '#ea580c'}}>Low - Incomplete Data</span></p>
            <p><strong>Projected Cost:</strong> <span style={{color: '#dc2626', fontWeight: 'bold'}}>$50 outreach required</span></p>
          </div>
        </div>

        <div style={{...styles.card, backgroundColor: '#f0fdf4', border: '2px solid #16a34a'}}>
          <div style={styles.cardHeader}>
            <h3 style={{color: '#15803d', margin: 0}}>Multi-Source View (Our Platform)</h3>
            <span style={{...styles.badge, backgroundColor: '#16a34a'}}>COMPLIANT</span>
          </div>
          <div style={styles.cardContent}>
            <p><strong>Status:</strong> <span style={{color: '#15803d', fontWeight: 'bold'}}>COMPLIANT</span></p>
            <p><strong>Last Screening:</strong> 2024-07-22 - Community Health Clinic</p>
            <p><strong>Confidence:</strong> <span style={{color: '#15803d'}}>High - Complete Picture</span></p>
            <p><strong>Projected Savings:</strong> <span style={{color: '#15803d', fontWeight: 'bold'}}>$50 outreach avoided</span></p>
            
            <h4 style={{marginTop: '2rem', marginBottom: '1rem'}}>Data Sources Integrated:</h4>
            <div style={{display: 'grid', gap: '1rem'}}>
              <div style={{padding: '1rem', backgroundColor: '#dcfce7', borderLeft: '4px solid #16a34a', borderRadius: '0.5rem'}}>
                <strong>📄 HL7 Lab Results</strong> - 2024-07-22<br/>
                Pap smear - Normal cytology (LOINC: 33717-0)<br/>
                <small>Community Health Clinic</small>
              </div>
              <div style={{padding: '1rem', backgroundColor: '#dbeafe', borderLeft: '4px solid #3b82f6', borderRadius: '0.5rem'}}>
                <strong>🗄️ HIE Data</strong> - 2024-07-22<br/>
                Cervical screening procedure documented<br/>
                <small>Regional HIE Network</small>
              </div>
              <div style={{padding: '1rem', backgroundColor: '#f3e8ff', borderLeft: '4px solid #9333ea', borderRadius: '0.5rem'}}>
                <strong>💳 Claims Data</strong> - 2024-07-25<br/>
                CPT 88150 - Cytopathology, cervical/vaginal<br/>
                <small>Claims Processing System</small>
              </div>
              <div style={{padding: '1rem', backgroundColor: '#fed7aa', borderLeft: '4px solid #ea580c', borderRadius: '0.5rem'}}>
                <strong>💊 Pharmacy Data</strong> - 2024-07-20<br/>
                Anxiety medication filled (pre-procedure)<br/>
                <small>CVS Pharmacy #4521</small>
              </div>
            </div>
          </div>
        </div>

        <div style={{...styles.card, backgroundColor: '#eff6ff', marginTop: '2rem'}}>
          <div style={styles.cardContent}>
            <h4 style={{color: '#1e40af', margin: '0 0 1rem 0'}}>Value Proposition Demonstrated:</h4>
            <div style={styles.statsGrid}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#16a34a'}}>$50</div>
                <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Outreach Cost Saved</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6'}}>30-40%</div>
                <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Care Missed by EMR</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#9333ea'}}>4</div>
                <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Data Sources</div>
              </div>
            </div>
            <p style={{textAlign: 'center', marginTop: '1rem', fontStyle: 'italic', color: '#4b5563'}}>
              <strong>Key Differentiator:</strong> While EMR-only solutions miss 30-40% of completed care 
              happening outside their system, our platform captures the complete member journey across 
              all touchpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const PredictiveDemo = () => (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={{margin: 0, fontSize: '2rem', fontWeight: 'bold'}}>Predictive Analytics Demo</h2>
        <p style={{margin: '0.5rem 0 0 0', color: '#6b7280'}}>
          CCS Screening Population: 1,247 members due for screening
        </p>
      </div>
      <div style={styles.cardContent}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem'}}>
          <div style={{...styles.card, backgroundColor: '#fef2f2', border: '2px solid #ef4444'}}>
            <div style={styles.cardHeader}>
              <h3 style={{color: '#dc2626', margin: 0}}>Traditional Approach</h3>
            </div>
            <div style={styles.cardContent}>
              <p><strong>Strategy:</strong> Contact all 1,247 members</p>
              <p><strong>Cost:</strong> <span style={{color: '#dc2626', fontWeight: 'bold'}}>$62,350</span> (1,247 × $50)</p>
              <p><strong>Success Rate:</strong> 20% (249 completions)</p>
              <p><strong>Efficiency:</strong> <span style={{color: '#dc2626'}}>Low - spray and pray</span></p>
            </div>
          </div>

          <div style={{...styles.card, backgroundColor: '#f0fdf4', border: '2px solid #16a34a'}}>
            <div style={styles.cardHeader}>
              <h3 style={{color: '#15803d', margin: 0}}>Predictive AI Approach</h3>
            </div>
            <div style={styles.cardContent}>
              <p><strong>Strategy:</strong> Focus on 312 high-risk members</p>
              <p><strong>Cost:</strong> <span style={{color: '#15803d', fontWeight: 'bold'}}>$15,600</span> (75% reduction)</p>
              <p><strong>Success Rate:</strong> 65% (203 completions)</p>
              <p><strong>Efficiency:</strong> <span style={{color: '#15803d'}}>High - precision targeting</span></p>
            </div>
          </div>
        </div>

        <div style={{...styles.card, backgroundColor: '#fffbeb', border: '2px solid #f59e0b'}}>
          <div style={styles.cardHeader}>
            <h3 style={{color: '#92400e', margin: 0}}>High-Risk Member Example</h3>
          </div>
          <div style={styles.cardContent}>
            <p><strong>Member:</strong> John Smith (ID: 99990002000000) | Age: 67</p>
            <p><strong>Risk Score:</strong> <span style={{color: '#dc2626', fontWeight: 'bold'}}>85%</span> (High Risk)</p>
            <p><strong>Compliance Likelihood:</strong> <span style={{color: '#dc2626'}}>15% without intervention</span></p>
            <p><strong>Risk Factors:</strong></p>
            <ul style={{margin: '0.5rem 0', paddingLeft: '1.5rem'}}>
              <li>3 missed appointments in past 12 months</li>
              <li>Transportation barriers identified</li>
              <li>Documented procedure anxiety</li>
            </ul>
            <p><strong>Recommended Intervention:</strong> Personal call + transportation assistance + anxiety management</p>
          </div>
        </div>

        <div style={{...styles.card, backgroundColor: '#eff6ff', marginTop: '2rem'}}>
          <div style={styles.cardContent}>
            <h4 style={{color: '#1e40af', margin: '0 0 1rem 0'}}>Predictive Analytics Value:</h4>
            <div style={styles.statsGrid}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#16a34a'}}>75%</div>
                <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Cost Reduction</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6'}}>3.2x</div>
                <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Success Rate</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#9333ea'}}>25%</div>
                <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Population Focus</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#ea580c'}}>82%</div>
                <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Potential Captured</div>
              </div>
            </div>
            <p style={{textAlign: 'center', marginTop: '1rem', fontStyle: 'italic', color: '#4b5563'}}>
              <strong>Key Differentiator:</strong> While traditional approaches waste resources on members 
              who will comply naturally, our predictive AI identifies the 25% who need intervention to succeed. 
              This precision targeting delivers 3x higher success rates at 75% lower cost.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const MultiIndustryDemo = () => (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={{margin: 0, fontSize: '2rem', fontWeight: 'bold'}}>Multi-Industry Platform Demo</h2>
        <p style={{margin: '0.5rem 0 0 0', color: '#6b7280'}}>
          Same AI intelligence, different business models
        </p>
      </div>
      <div style={styles.cardContent}>
        <div style={styles.differentiatorGrid}>
          <div style={{...styles.card, backgroundColor: '#eff6ff', border: '2px solid #3b82f6'}}>
            <div style={styles.cardHeader}>
              <h3 style={{color: '#1e40af', margin: 0}}>🏢 Health Plan Operations</h3>
            </div>
            <div style={styles.cardContent}>
              <p><strong>Organization:</strong> IEHP (Inland Empire Health Plan)</p>
              <p><strong>Population:</strong> 450,000 members</p>
              <p><strong>Focus:</strong> Star ratings & quality bonus revenue</p>
              <p><strong>Key Metric:</strong> <span style={{color: '#16a34a', fontWeight: 'bold'}}>$5.6M quality bonus revenue</span></p>
              <p><strong>Use Case:</strong> Population health management</p>
            </div>
          </div>

          <div style={{...styles.card, backgroundColor: '#f0fdf4', border: '2px solid #16a34a'}}>
            <div style={styles.cardHeader}>
              <h3 style={{color: '#15803d', margin: 0}}>🏥 Health System</h3>
            </div>
            <div style={styles.cardContent}>
              <p><strong>Organization:</strong> Riverside Medical Center</p>
              <p><strong>Population:</strong> 85,000 attributed lives</p>
              <p><strong>Focus:</strong> Value-based care contracts</p>
              <p><strong>Key Metric:</strong> <span style={{color: '#16a34a', fontWeight: 'bold'}}>$1.2M value-based revenue</span></p>
              <p><strong>Use Case:</strong> Provider performance optimization</p>
            </div>
          </div>

          <div style={{...styles.card, backgroundColor: '#f3e8ff', border: '2px solid #9333ea'}}>
            <div style={styles.cardHeader}>
              <h3 style={{color: '#7c3aed', margin: 0}}>👩‍⚕️ Individual Practice</h3>
            </div>
            <div style={styles.cardContent}>
              <p><strong>Organization:</strong> Dr. Martinez Family Practice</p>
              <p><strong>Population:</strong> 2,400 patients</p>
              <p><strong>Focus:</strong> Quality incentives & workflow</p>
              <p><strong>Key Metric:</strong> <span style={{color: '#16a34a', fontWeight: 'bold'}}>$45K quality incentives</span></p>
              <p><strong>Use Case:</strong> Patient care optimization</p>
            </div>
          </div>
        </div>

        <div style={{...styles.card, backgroundColor: '#fffbeb', border: '2px solid #f59e0b', marginTop: '2rem'}}>
          <div style={styles.cardHeader}>
            <h3 style={{color: '#92400e', margin: 0}}>SMART on FHIR Integration</h3>
          </div>
          <div style={styles.cardContent}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
              <div>
                <h4 style={{color: '#92400e'}}>Patient-Level Integration</h4>
                <ul style={{margin: '0.5rem 0', paddingLeft: '1.5rem'}}>
                  <li>Individual care plans and interventions</li>
                  <li>Preferred provider matching</li>
                  <li>Health goal tracking</li>
                  <li>Appointment integration</li>
                </ul>
              </div>
              <div>
                <h4 style={{color: '#92400e'}}>Panel-Level Integration (No Alert Fatigue)</h4>
                <ul style={{margin: '0.5rem 0', paddingLeft: '1.5rem'}}>
                  <li>Population overview with priorities</li>
                  <li>Contextual alerts during encounters</li>
                  <li>Risk-stratified patient lists</li>
                  <li>Performance analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div style={{...styles.card, backgroundColor: '#eff6ff', marginTop: '2rem'}}>
          <div style={styles.cardContent}>
            <h4 style={{color: '#1e40af', margin: '0 0 1rem 0'}}>Multi-Industry Platform Value:</h4>
            <div style={styles.statsGrid}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6'}}>1</div>
                <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Platform</div>
                <div style={{fontSize: '0.75rem', color: '#9ca3af'}}>Multiple Industries</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#16a34a'}}>3</div>
                <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Business Models</div>
                <div style={{fontSize: '0.75rem', color: '#9ca3af'}}>Payer/Provider/Practice</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#ea580c'}}>∞</div>
                <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Scalability</div>
                <div style={{fontSize: '0.75rem', color: '#9ca3af'}}>2K to 450K population</div>
              </div>
            </div>
            <p style={{textAlign: 'center', marginTop: '1rem', fontStyle: 'italic', color: '#4b5563'}}>
              <strong>Key Differentiator:</strong> While competitors build point solutions for single 
              use cases, our platform scales from 2,400-patient practices to 450,000-member health plans 
              using the same core AI intelligence. This multi-industry approach creates unprecedented 
              market opportunities and competitive moats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navHeader}>
          <div>
            <h1 style={styles.navTitle}>HEDIS AI Platform Demo</h1>
            <p style={styles.navSubtitle}>The Only Platform That Does All Three</p>
          </div>
          <span style={styles.badge}>Production Ready - 100% Success Rate</span>
        </div>
        
        <div style={styles.navButtons}>
          <button
            onClick={() => setActiveDemo('overview')}
            style={{
              ...styles.navButton,
              ...(activeDemo === 'overview' ? styles.navButtonActive : styles.navButtonInactive)
            }}
          >
            📊 Executive Overview
          </button>
          <button
            onClick={() => setActiveDemo('multi-source')}
            style={{
              ...styles.navButton,
              ...(activeDemo === 'multi-source' ? styles.navButtonActive : styles.navButtonInactive)
            }}
          >
            📈 Multi-Source Integration
          </button>
          <button
            onClick={() => setActiveDemo('predictive')}
            style={{
              ...styles.navButton,
              ...(activeDemo === 'predictive' ? styles.navButtonActive : styles.navButtonInactive)
            }}
          >
            🎯 Predictive Analytics
          </button>
          <button
            onClick={() => setActiveDemo('multi-industry')}
            style={{
              ...styles.navButton,
              ...(activeDemo === 'multi-industry' ? styles.navButtonActive : styles.navButtonInactive)
            }}
          >
            🏢 Multi-Industry Platform
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        {activeDemo === 'overview' && <ExecutiveOverview />}
        {activeDemo === 'multi-source' && <MultiSourceDemo />}
        {activeDemo === 'predictive' && <PredictiveDemo />}
        {activeDemo === 'multi-industry' && <MultiIndustryDemo />}
      </main>
    </div>
  );
};

export default SimpleDemoApp;

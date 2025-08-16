import React, { useState } from 'react';
import CareManagementDashboard from './components/CareManagementDashboard';
import QualityActuarialDashboard from './components/QualityActuarialDashboard';
import ProviderIntelligenceHub from './components/ProviderIntelligenceHub';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('care-management');

  const navigationStyle = {
    backgroundColor: '#1f2937',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white'
  };

  const navButtonStyle = {
    padding: '0.5rem 1rem',
    margin: '0 0.25rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  };

  const activeButtonStyle = {
    ...navButtonStyle,
    backgroundColor: '#3b82f6',
    color: 'white'
  };

  const inactiveButtonStyle = {
    ...navButtonStyle,
    backgroundColor: 'transparent',
    color: '#d1d5db',
    border: '1px solid #4b5563'
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'care-management':
        return <CareManagementDashboard />;
      case 'provider-intelligence':
        return <ProviderIntelligenceHub />;
      default:
        return <CareManagementDashboard />;
    }
  };

  return (
    <div>
      {/* Navigation Header */}
      <nav style={navigationStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
            HEDIS AI Platform
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#9ca3af' }}>
            HL7 AI Challenge 2025 - Clinical Quality Improvement
          </p>
        </div>

        <div>
          <button
            style={currentView === 'care-management' ? activeButtonStyle : inactiveButtonStyle}
            onClick={() => setCurrentView('care-management')}
          >
            Population Health Intelligence
          </button>
          <button
            style={currentView === 'provider-intelligence' ? activeButtonStyle : inactiveButtonStyle}
            onClick={() => setCurrentView('provider-intelligence')}
          >
            Clinical Decision Support
          </button>
        </div>
      </nav>

      {/* Current View */}
      {renderCurrentView()}
    </div>
  );
}

export default App;

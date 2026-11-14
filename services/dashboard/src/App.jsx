import React, { useState } from 'react';
import CareManagementDashboard from './components/CareManagementDashboard';
import ProviderIntelligenceHub from './components/ProviderIntelligenceHub';
import LiveProcessingDemo from './components/LiveProcessingDemo';
import MetricsOverview from './components/MetricsOverview';
import AIExplanationPanel from './components/AIExplanationPanel';
import LegacyDashboard from './components/LegacyDashboard';
import { Activity, Brain, BarChart3, Zap, Stethoscope, Clock } from 'lucide-react';
import './App.css';

const localDemo = import.meta.env.MODE === 'demo';

function App() {
  // Default to Population Health for demo-first payer value prop
  const [currentView, setCurrentView] = useState('care-management');

  // Reordered with explicit callouts for demo clarity
  const navigationViews = [
    {
      id: 'legacy-dashboard',
      label: 'Legacy System • Chase-and-Close',
      icon: Clock,
      description: 'Traditional care management workflow',
      audience: 'demo'
    },
    {
      id: 'care-management',
      label: 'Population Health • For Payers',
      icon: Activity,
      description: 'Population analytics and care gap management',
      audience: 'payer'
    },
    {
      id: 'provider-intelligence',
      label: 'Clinical Decision Support • For Providers',
      icon: Stethoscope,
      description: 'Historical provider workflow scenario',
      audience: 'provider'
    },
    {
      id: 'live-demo',
      label: 'Processing Scenario',
      icon: Zap,
      description: 'Historical scripted processing scenario',
      audience: 'technical'
    },
    {
      id: 'metrics',
      label: 'Scenario Metrics',
      icon: BarChart3,
      description: 'Illustrative scenario figures, not measured performance',
      audience: 'technical'
    },
    {
      id: 'ai-explanation',
      label: 'AI Insights',
      icon: Brain,
      description: 'AI decision explanation panel',
      audience: 'technical'
    }
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'legacy-dashboard':
        return <LegacyDashboard />;
      case 'live-demo':
        return <LiveProcessingDemo />;
      case 'metrics':
        return <MetricsOverview />;
      case 'care-management':
        return <CareManagementDashboard />;
      case 'ai-explanation':
        return <AIExplanationPanel />;
      case 'provider-intelligence':
        return <ProviderIntelligenceHub />;
      default:
        return <LiveProcessingDemo />;
    }
  };

  return (
    <div className="App">
      {/* Modern Navigation Header */}
      <nav className="modern-nav p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white m-0">
                Care Gap Workflow Lab
              </h1>
              <p className="text-sm text-blue-100 m-0">
                HL7 AI Challenge prototype • Synthetic workflow exploration
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap" hidden={localDemo}>
            {!localDemo && navigationViews.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  className={`nav-button ${currentView === view.id ? 'active' : ''}`}
                  onClick={() => setCurrentView(view.id)}
                  title={view.description}
                  data-audience={view.audience}
                >
                  <Icon className="w-4 h-4 inline mr-2" />
                  {view.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="demo-notice" role="note">
        {localDemo
          ? 'LOCAL SYNTHETIC DEMO · Actions update memory only. Outreach sends no messages. Restart or reset clears the session.'
          : 'HISTORICAL SCENARIOS · Figures and scripted processing are illustrative, not measured results or clinical validation.'}
      </div>
      {/* Current View */}
      <div className="dashboard-container">
        {renderCurrentView()}
      </div>
    </div>
  );
}

export default App;

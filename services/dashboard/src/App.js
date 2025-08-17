import React, { useState } from 'react';
import CareManagementDashboard from './components/CareManagementDashboard';
import QualityActuarialDashboard from './components/QualityActuarialDashboard';
import ProviderIntelligenceHub from './components/ProviderIntelligenceHub';
import LiveProcessingDemo from './components/LiveProcessingDemo';
import MetricsOverview from './components/MetricsOverview';
import AIExplanationPanel from './components/AIExplanationPanel';
import { Activity, Brain, BarChart3, Zap, Stethoscope } from 'lucide-react';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('live-demo');

  const navigationViews = [
    {
      id: 'live-demo',
      label: 'Live Processing Demo',
      icon: Zap,
      description: 'Real-time HL7 → FHIR transformation'
    },
    {
      id: 'metrics',
      label: 'Platform Metrics',
      icon: BarChart3,
      description: 'Real-time performance analytics'
    },
    {
      id: 'care-management',
      label: 'Population Health',
      icon: Activity,
      description: 'Care gap management dashboard'
    },
    {
      id: 'provider-intelligence',
      label: 'Clinical Decision Support',
      icon: Stethoscope,
      description: 'SMART on FHIR CDS Hooks integration'
    },
    {
      id: 'ai-explanation',
      label: 'AI Insights',
      icon: Brain,
      description: 'AI decision explanation panel'
    }
  ];

  const renderCurrentView = () => {
    switch (currentView) {
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
                HL7 AI Platform
              </h1>
              <p className="text-sm text-blue-100 m-0">
                HL7 AI Challenge 2025 - Standards-Based Clinical Intelligence
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {navigationViews.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  className={`nav-button ${currentView === view.id ? 'active' : ''}`}
                  onClick={() => setCurrentView(view.id)}
                  title={view.description}
                >
                  <Icon className="w-4 h-4 inline mr-2" />
                  {view.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Current View */}
      <div className="dashboard-container">
        {renderCurrentView()}
      </div>
    </div>
  );
}

export default App;

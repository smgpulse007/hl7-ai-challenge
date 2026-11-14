import React from 'react';
import { createRoot } from 'react-dom/client';
import CareManagementDashboard from './components/CareManagementDashboard';
import './index.css';
import './App.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="App">
      <header className="modern-nav p-4 text-left">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <img src="./favicon.svg" width="40" height="40" alt="" />
          <div><h1 className="text-xl font-bold text-white m-0">Care Gap Workflow Lab</h1>
            <p className="text-sm text-blue-100 m-0">HL7 AI Challenge prototype · Synthetic workflow exploration</p></div>
        </div>
      </header>
      <div className="demo-notice" role="note">LOCAL SYNTHETIC DEMO · Actions update memory only. Outreach sends no messages. Restart or reset clears the session.</div>
      <main><CareManagementDashboard /></main>
    </div>
  </React.StrictMode>
);

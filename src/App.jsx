import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FloatingDock from './components/FloatingDock';
import Dashboard from './pages/Dashboard';
import DiscoveryRadar from './pages/DiscoveryRadar';
import OracleWriter from './pages/OracleWriter';
import AuditMatrix from './pages/AuditMatrix';
import DataVault from './pages/DataVault';
import CampaignEngine from './pages/CampaignEngine';
import ProgramManager from './pages/ProgramManager';
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="app-container cinematic-layout">
        {/* Abstract Background Elements */}
        <div className="cinematic-bg"></div>
        <div className="bg-glow emerald-glow"></div>
        <div className="bg-glow gold-glow"></div>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/discovery" element={<DiscoveryRadar />} />
            <Route path="/writer" element={<OracleWriter />} />
            <Route path="/audit" element={<AuditMatrix />} />
            <Route path="/vault" element={<DataVault />} />
            <Route path="/campaigns" element={<CampaignEngine />} />
            <Route path="/programs" element={<ProgramManager />} />
          </Routes>
        </main>

        <FloatingDock />
      </div>
    </Router>
  );
}

export default App;

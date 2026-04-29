import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import FloatingDock from './components/FloatingDock';
import Dashboard from './pages/Dashboard';
import DiscoveryRadar from './pages/DiscoveryRadar';
import OracleWriter from './pages/OracleWriter';
import AuditMatrix from './pages/AuditMatrix';
import DataVault from './pages/DataVault';
import CampaignEngine from './pages/CampaignEngine';
import ProgramManager from './pages/ProgramManager';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import './App.css'; 

const AppLayout = () => {
  const location = useLocation();
  const isPublicRoute = location.pathname === '/' || location.pathname === '/auth';

  return (
    <div className="app-container cinematic-layout">
      {/* Abstract Background Elements */}
      <div className="cinematic-bg"></div>
      <div className="bg-glow emerald-glow"></div>
      <div className="bg-glow gold-glow"></div>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/discovery" element={<DiscoveryRadar />} />
          <Route path="/writer" element={<OracleWriter />} />
          <Route path="/audit" element={<AuditMatrix />} />
          <Route path="/vault" element={<DataVault />} />
          <Route path="/campaigns" element={<CampaignEngine />} />
          <Route path="/programs" element={<ProgramManager />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      {!isPublicRoute && <FloatingDock />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;

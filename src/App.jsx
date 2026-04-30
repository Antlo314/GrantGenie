import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import OracleWriter from './pages/OracleWriter';
import CampaignEngine from './pages/CampaignEngine';
import DiscoveryRadar from './pages/DiscoveryRadar';
import Settings from './pages/Settings';
import InvestorDeck from './pages/InvestorDeck';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/oracle" element={<OracleWriter />} />
        <Route path="/writer" element={<OracleWriter />} />
        <Route path="/campaign" element={<CampaignEngine />} />
        <Route path="/radar" element={<DiscoveryRadar />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/deck" element={<InvestorDeck />} />
      </Routes>
    </Router>
  );
}

export default App;


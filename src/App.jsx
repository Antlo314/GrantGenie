import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import OracleWriter from './pages/OracleWriter';
import CampaignEngine from './pages/CampaignEngine';
import InvestorDeck from './pages/InvestorDeck';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/writer" element={<OracleWriter />} />
        <Route path="/campaign" element={<CampaignEngine />} />
        <Route path="/deck" element={<InvestorDeck />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DiscoveryRadar from './pages/DiscoveryRadar';
import OracleWriter from './pages/OracleWriter';
import AuditMatrix from './pages/AuditMatrix';
import './App.css'; // Cleared file to prevent default Vite styles

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="bg-glow"></div>
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/discovery" element={<DiscoveryRadar />} />
            <Route path="/writer" element={<OracleWriter />} />
            <Route path="/audit" element={<AuditMatrix />} />
            <Route path="/vault" element={
              <div className="page-container flex items-center justify-center h-full">
                <div className="text-center animate-fade-in">
                  <h2 className="font-display text-gold mb-2" style={{fontSize: '2rem'}}>Zero-Trust Data Vault</h2>
                  <p className="text-muted">Enterprise document storage and compliance tracking.</p>
                  <p className="text-secondary mt-4 text-sm uppercase tracking-widest">Coming Soon</p>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

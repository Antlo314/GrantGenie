import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { TrendingUp, FileText, Search, Zap, ArrowRight, Clock, CheckCircle, AlertCircle, Activity } from 'lucide-react';

const grants = [
  { name: 'Lumina Catalyst Grant', funder: 'Lumina Foundation', match: 98, status: 'In Progress', deadline: '14 days', amount: '$150,000' },
  { name: 'Community Tech Initiative', funder: 'Schmidt Futures', match: 91, status: 'Submitted', deadline: '—', amount: '$75,000' },
  { name: 'Youth Digital Equity Fund', funder: 'Gates Foundation', match: 87, status: 'Draft', deadline: '32 days', amount: '$250,000' },
  { name: 'Arts & Education Bridge', funder: 'Ford Foundation', match: 79, status: 'Research', deadline: '45 days', amount: '$50,000' },
];

const StatusBadge = ({ status }) => {
  const map = {
    'In Progress': { bg: 'rgba(13,148,136,0.1)', color: 'var(--teal)' },
    'Submitted': { bg: 'rgba(16,185,129,0.1)', color: 'var(--emerald)' },
    'Draft': { bg: 'rgba(245,158,11,0.1)', color: 'var(--gold)' },
    'Research': { bg: 'var(--slate-100)', color: 'var(--slate-500)' },
  };
  const style = map[status] || map['Research'];
  return (
    <span style={{ background: style.bg, color: style.color, fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 999 }}>
      {status}
    </span>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setTimeout(() => setShowTour(true), 1000);
    }
  }, []);

  const closeTour = () => {
    localStorage.setItem('hasSeenTour', 'true');
    setShowTour(false);
  };

  return (
    <AppLayout title="Dashboard">
      {/* Onboarding Modal */}
      {showTour && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="animate-fade-in">
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }} onClick={closeTour} />
          <div style={{ position: 'relative', width: 440, background: 'white', borderRadius: 24, boxShadow: 'var(--shadow-2xl)', padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ width: 80, height: 80, background: 'var(--teal-xlight)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <Sparkles size={40} style={{ color: 'var(--teal)' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 8 }}>Welcome to Grant Genie</h2>
              <p style={{ fontSize: 15, color: 'var(--slate-500)', lineHeight: 1.6 }}>Your AI-powered operating system for finding, drafting, and winning grants is now active.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button className="btn btn-primary" style={{ width: '100%', height: 52, borderRadius: 12 }} onClick={closeTour}>Get Started</button>
              <button className="btn btn-ghost" style={{ width: '100%', height: 52, borderRadius: 12 }} onClick={() => navigate('/radar')}>Watch Video Demo</button>
            </div>
          </div>
        </div>
      )}
      {/* Stats Row - Desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }} className="desktop-only">
        <div className="stat-card">
          <div className="stat-label">Total Secured (YTD)</div>
          <div className="stat-value">$1.47M</div>
          <div className="stat-change stat-up">↑ 18% vs last year</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Applications</div>
          <div className="stat-value">12</div>
          <div className="stat-change" style={{ color: 'var(--slate-400)', fontSize: 13 }}>4 need your review</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Win Rate</div>
          <div className="stat-value">68%</div>
          <div className="stat-change stat-up">↑ 12% from baseline</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Funders Identified</div>
          <div className="stat-value">847</div>
          <div className="stat-change" style={{ color: 'var(--slate-400)', fontSize: 13 }}>23 new this week</div>
        </div>
      </div>

      {/* Stats Row - Mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }} className="mobile-only">
        <div className="stat-card" style={{ padding: 16 }}>
          <div className="stat-label" style={{ fontSize: 10 }}>Secured</div>
          <div className="stat-value" style={{ fontSize: 20 }}>$1.4M</div>
        </div>
        <div className="stat-card" style={{ padding: 16 }}>
          <div className="stat-label" style={{ fontSize: 10 }}>Active</div>
          <div className="stat-value" style={{ fontSize: 20 }}>12</div>
        </div>
        <div className="stat-card" style={{ padding: 16 }}>
          <div className="stat-label" style={{ fontSize: 10 }}>Win Rate</div>
          <div className="stat-value" style={{ fontSize: 20 }}>68%</div>
        </div>
        <div className="stat-card" style={{ padding: 16 }}>
          <div className="stat-label" style={{ fontSize: 10 }}>Funders</div>
          <div className="stat-value" style={{ fontSize: 20 }}>847</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 24 }}>
        {/* Active Grants Table */}
        <div className="dashboard-grid-span">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--slate-900)' }}>Active Grant Pipeline</h2>
            <button className="btn btn-ghost" style={{ fontSize: 13 }}>View All <ArrowRight size={14} /></button>
          </div>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--slate-200)', overflowX: 'auto' }}>
            <table style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  <th>Grant / Funder</th>
                  <th>Match</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {grants.map((g, i) => (
                  <tr key={i} style={{ cursor: 'pointer' }} onClick={() => navigate('/oracle')}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: 14 }}>{g.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate-400)', marginTop: 2 }}>{g.funder}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${g.match}%`, background: g.match > 90 ? 'var(--emerald)' : 'var(--teal)' }}></div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--slate-700)' }}>{g.match}%</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: 14 }}>{g.amount}</td>
                    <td><StatusBadge status={g.status} /></td>
                    <td style={{ fontSize: 13, color: 'var(--slate-500)' }}>{g.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Quick Actions */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 16 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start', gap: 12, borderRadius: 12 }} onClick={() => navigate('/oracle')}>
                <Zap size={16} /> Start New Grant Draft
              </button>
              <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 12, borderRadius: 12 }} onClick={() => navigate('/radar')}>
                <Search size={16} /> Scan New Funders
              </button>
              <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 12, borderRadius: 12 }} onClick={() => navigate('/oracle')}>
                <FileText size={16} /> Generate Full Proposal
              </button>
              <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 12, borderRadius: 12 }} onClick={() => navigate('/campaigns')}>
                <Activity size={16} /> Generate Impact Report
              </button>
            </div>
          </div>

          {/* AI Agents Status */}
          <div className="card" style={{ background: 'var(--slate-900)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Agents Status</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--emerald)', fontWeight: 700 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)', animation: 'pulse 2s infinite' }} /> Operational
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'Oracle Multi-Agent', status: 'Active', load: '12%' },
                { name: 'Quantum Radar', status: 'Active', load: '24%' },
                { name: 'Donna Stewardship', status: 'Active', load: '5%' }
              ].map((agent, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{agent.name}</div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Load: {agent.load}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--emerald)' }}>{agent.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Oracle Interactive Analysis */}
          <OracleAnalysisCard />

          {/* Alerts */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 16 }}>System Alerts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <AlertCircle size={16} style={{ color: 'var(--gold)', marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: 'var(--slate-600)', margin: 0 }}>
                  <strong style={{ color: 'var(--slate-800)' }}>Lumina Grant</strong> deadline in 14 days — draft is 65% complete.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <CheckCircle size={16} style={{ color: 'var(--emerald)', marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: 'var(--slate-600)', margin: 0 }}>
                  <strong style={{ color: 'var(--slate-800)' }}>23 new funders</strong> match your mission profile this week.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Clock size={16} style={{ color: 'var(--teal)', marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: 'var(--slate-600)', margin: 0 }}>
                  Vault sync required — upload your <strong style={{ color: 'var(--slate-800)' }}>2025 Audit</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

// Interactive Oracle Component
const OracleAnalysisCard = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setOutput('');
    
    try {
      // Lazy load the utility to avoid circular issues if any
      const { askGemini } = await import('../utils/ai');
      const response = await askGemini(`
        You are the Grant Genie Oracle. A user is asking for advice on this grant idea: "${input}".
        Provide a quick, professional 3-sentence evaluation and one "insider tip" to increase their win rate.
        Keep it brief and high-value.
      `);
      setOutput(response);
    } catch (err) {
      setError(err.message || 'Failed to connect to Oracle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow)', background: 'white' }}>
      <div style={{ position: 'relative', height: 110 }}>
        <img src="/nano-intelligence.png" alt="Oracle Intelligence" style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))' }}></div>
        <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Oracle Interactive</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'white', margin: 0 }}>Consult the Genie</p>
        </div>
      </div>
      
      <div style={{ padding: 20 }}>
        {output ? (
          <div className="animate-fade-in">
            <div style={{ maxHeight: 200, overflowY: 'auto', paddingRight: 8, marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--slate-600)', lineHeight: 1.6, margin: 0 }}>{output}</p>
            </div>
            
            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, fontSize: 12 }} 
                onClick={() => navigate('/oracle')}
              >
                Draft Full Proposal
              </button>
              <button 
                className="btn btn-ghost" 
                style={{ flex: 1, fontSize: 12 }} 
                onClick={() => { setOutput(''); setInput(''); }}
              >
                Reset
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <textarea 
              placeholder="Paste a grant mission or idea..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ 
                width: '100%', 
                height: 80, 
                padding: 12, 
                borderRadius: 8, 
                border: '1px solid var(--slate-200)', 
                fontSize: 13,
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />
            {error && <p style={{ fontSize: 11, color: 'var(--rose)', margin: 0 }}>{error}</p>}
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', gap: 8 }} 
              onClick={handleAnalyze}
              disabled={loading || !input.trim()}
            >
              {loading ? 'Consulting Oracle...' : <><Zap size={14} /> Analyze Concept</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import AppLayout from '../components/AppLayout';
import { TrendingUp, FileText, Search, Zap, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const grants = [
  { name: 'Lumina Catalyst Grant', funder: 'Lumina Foundation', match: 98, status: 'In Progress', deadline: '14 days', amount: '$150,000' },
  { name: 'Community Tech Initiative', funder: 'Schmidt Futures', match: 91, status: 'Submitted', deadline: '—', amount: '$75,000' },
  { name: 'Youth Digital Equity Fund', funder: 'Gates Foundation', match: 87, status: 'Draft', deadline: '32 days', amount: '$250,000' },
  { name: 'Arts & Education Bridge', funder: 'Ford Foundation', match: 79, status: 'Research', deadline: '45 days', amount: '$50,000' },
];

const StatusBadge = ({ status }) => {
  const map = {
    'In Progress': { bg: 'rgba(99,102,241,0.1)', color: 'var(--indigo)' },
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
  return (
    <AppLayout title="Dashboard">
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Active Grants Table */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--slate-900)' }}>Active Grant Pipeline</h2>
            <button className="btn btn-ghost" style={{ fontSize: 13 }}>View All <ArrowRight size={14} /></button>
          </div>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--slate-200)', overflow: 'hidden' }}>
            <table>
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
                  <tr key={i} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: 14 }}>{g.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate-400)', marginTop: 2 }}>{g.funder}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${g.match}%`, background: g.match > 90 ? 'var(--emerald)' : 'var(--indigo)' }}></div>
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
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start', gap: 12 }}>
                <Zap size={16} /> Start New Grant Draft
              </button>
              <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 12 }}>
                <Search size={16} /> Discover Funders
              </button>
              <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 12 }}>
                <FileText size={16} /> Generate Impact Report
              </button>
            </div>
          </div>

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
                <Clock size={16} style={{ color: 'var(--indigo)', marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: 'var(--slate-600)', margin: 0 }}>
                  Vault sync required — upload your <strong style={{ color: 'var(--slate-800)' }}>2025 Audit</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Oracle Status */}
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--indigo) 0%, #4338ca 100%)', border: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Oracle Active</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: 'white', margin: 0 }}>Scanning Funders</p>
              </div>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 0 3px rgba(74,222,128,0.3)', marginTop: 4 }}></div>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 12 }}>
              847 foundations analyzed · 23 new matches
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

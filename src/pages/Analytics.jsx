import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { 
  BarChart, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Clock, 
  Zap, 
  Download, 
  FileText, 
  PieChart, 
  Calendar, 
  ArrowUpRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const sampleGrants = [
  { id: 1, name: 'Climate Education Catalyst', funder: 'Bezos Earth Fund', amount: '$1,200,000', status: 'Awarded', winProb: '85%', impactScore: 98 },
  { id: 2, name: 'Urban STEM Initiative', funder: 'Schmidt Futures', amount: '$250,000', status: 'Awarded', winProb: '70%', impactScore: 92 },
  { id: 3, name: 'Lumina Digital Equity', funder: 'Lumina Foundation', amount: '$150,000', status: 'Awarded', winProb: '94%', impactScore: 85 },
  { id: 4, name: 'AI for Good Grant', funder: 'Google.org', amount: '$150,000', status: 'Submitted', winProb: '60%', impactScore: 88 },
  { id: 5, name: 'Social Justice Fund', funder: 'Ford Foundation', amount: '$400,000', status: 'In Progress', winProb: '90%', impactScore: 95 }
];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('Pipeline Performance');

  return (
    <AppLayout title="Reports & Analytics">
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: 0, margin: '-32px', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ background: 'white', padding: '24px 32px', borderBottom: '1px solid var(--slate-200)', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 4 }}>Reports & Analytics</h1>
              <p style={{ color: 'var(--slate-500)', fontSize: 14 }}>Track your grant impact, ROI, and pipeline performance metrics.</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="desktop-only" style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-ghost" style={{ gap: 8 }}><Download size={16} /> CSV</button>
                <button className="btn btn-ghost" style={{ gap: 8 }}><Download size={16} /> PDF</button>
              </div>
              <button className="btn btn-primary" style={{ gap: 8 }}><Zap size={16} /> <span className="desktop-only">Generate Full Impact Report</span><span className="mobile-only">Generate</span></button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20 }}>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Total Secured (YTD)</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>$1.47M</div>
              <div style={{ fontSize: 11, color: 'var(--emerald)', fontWeight: 600, marginTop: 4 }}>↑ 18% vs last year</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Overall Win Rate</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--teal)' }}>68%</div>
              <div style={{ fontSize: 11, color: 'var(--slate-400)', marginTop: 4 }}>Industry Avg: 12%</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">ROI This Year</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--emerald)' }}>14.2x</div>
              <div style={{ fontSize: 11, color: 'var(--slate-400)', marginTop: 4 }}>Based on cost</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }} className="desktop-only">
              <div className="stat-label">Avg. Time Saved</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--teal)' }}>164h</div>
              <div style={{ fontSize: 11, color: 'var(--slate-400)', marginTop: 4 }}>Per application</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {/* Main Tabs */}
          <div style={{ display: 'flex', background: 'var(--slate-100)', borderRadius: 10, padding: 4, gap: 4, marginBottom: 24, width: 'fit-content', overflowX: 'auto' }}>
            {['Pipeline Performance', 'Win/Loss Analysis', 'Funder Insights', 'Impact Reports'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: 8, 
                  fontSize: 13, 
                  fontWeight: 600, 
                  border: 'none', 
                  background: activeTab === tab ? 'white' : 'transparent',
                  color: activeTab === tab ? 'var(--slate-900)' : 'var(--slate-500)',
                  cursor: 'pointer',
                  boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Interactive Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 32 }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Win-Rate Trend Line</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="badge badge-teal">Weekly</button>
                </div>
              </div>
              <div style={{ height: 240, background: 'var(--slate-50)', borderRadius: 12, border: '1px solid var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-300)', fontSize: 14 }}>
                [Chart Visualization]
              </div>
            </div>
            <div className="card">
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Funding by Category</h3>
              <div style={{ height: 240, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
                {[
                  { label: 'Education', val: 65, color: 'var(--teal)' },
                  { label: 'STEM', val: 20, color: 'var(--gold)' },
                  { label: 'Climate', val: 15, color: 'var(--emerald)' }
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      <span>{item.label}</span>
                      <span>{item.val}%</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--slate-100)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${item.val}%`, height: '100%', background: item.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Institutional Impact Ledger</h3>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>View All</button>
            </div>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Grant / Funder</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Impact Score</th>
                </tr>
              </thead>
              <tbody>
                {sampleGrants.map(g => (
                  <tr key={g.id}>
                    <td data-label="Grant / Funder">
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{g.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate-400)' }}>{g.funder}</div>
                    </td>
                    <td data-label="Amount" style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{g.amount}</td>
                    <td data-label="Status">
                      <span style={{ 
                        fontSize: 11, 
                        fontWeight: 700, 
                        background: g.status === 'Awarded' ? 'rgba(16,185,129,0.1)' : 'var(--slate-100)', 
                        color: g.status === 'Awarded' ? 'var(--emerald)' : 'var(--slate-500)',
                        padding: '4px 10px',
                        borderRadius: 999
                      }}>{g.status}</span>
                    </td>
                    <td data-label="Impact Score">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                        <div style={{ fontSize: 13, fontWeight: 800 }}>{g.impactScore}</div>
                        <ShieldCheck size={14} style={{ color: 'var(--teal)' }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;

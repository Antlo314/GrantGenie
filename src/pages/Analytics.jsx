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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 4 }}>Reports & Analytics</h1>
              <p style={{ color: 'var(--slate-500)', fontSize: 14 }}>Track your grant impact, ROI, and pipeline performance metrics.</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" style={{ gap: 8 }}><Download size={16} /> CSV</button>
              <button className="btn btn-ghost" style={{ gap: 8 }}><Download size={16} /> PDF</button>
              <button className="btn btn-primary" style={{ gap: 8 }}><Zap size={16} /> Generate Full Impact Report</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Total Secured (YTD)</div>
              <div className="stat-value" style={{ fontSize: 24 }}>$1.47M</div>
              <div style={{ fontSize: 11, color: 'var(--emerald)', fontWeight: 600, marginTop: 4 }}>↑ 18% vs last year</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Overall Win Rate</div>
              <div className="stat-value" style={{ fontSize: 24, color: 'var(--teal)' }}>68%</div>
              <div style={{ fontSize: 11, color: 'var(--slate-400)', marginTop: 4 }}>Industry Avg: 12%</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">ROI This Year</div>
              <div className="stat-value" style={{ fontSize: 24, color: 'var(--emerald)' }}>14.2x</div>
              <div style={{ fontSize: 11, color: 'var(--slate-400)', marginTop: 4 }}>Based on enterprise cost</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Avg. Time Saved</div>
              <div className="stat-value" style={{ fontSize: 24, color: 'var(--teal)' }}>164h</div>
              <div style={{ fontSize: 11, color: 'var(--slate-400)', marginTop: 4 }}>Per grant application</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {/* Main Tabs */}
          <div style={{ display: 'flex', background: 'var(--slate-100)', borderRadius: 10, padding: 4, gap: 4, marginBottom: 24, width: 'fit-content' }}>
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
                  transition: 'all 0.2s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Interactive Charts Section (Simulated) */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Win-Rate Trend Line</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="badge badge-teal">Weekly</button>
                  <button className="badge" style={{ background: 'var(--slate-100)', color: 'var(--slate-500)' }}>Monthly</button>
                </div>
              </div>
              <div style={{ height: 240, background: 'linear-gradient(to right, rgba(13,148,136,0.02), rgba(13,148,136,0.05))', borderRadius: 12, border: '1px solid var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-300)', fontSize: 14, fontWeight: 500 }}>
                [Interactive Win-Rate Chart Rendering...]
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
            <div className="card">
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Deadline Heat Map</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} style={{ height: 20, background: i % 5 === 0 ? 'var(--teal)' : i % 3 === 0 ? 'var(--teal-light)' : 'var(--slate-100)', borderRadius: 4, opacity: 0.3 + (i % 10) / 10 }}></div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 11, color: 'var(--slate-400)' }}>
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
            <div className="card">
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>ROI Calculator Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--slate-100)' }}>
                  <span style={{ fontSize: 13, color: 'var(--slate-600)' }}>Capital Secured</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-900)' }}>$1,475,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--slate-100)' }}>
                  <span style={{ fontSize: 13, color: 'var(--slate-600)' }}>Operating Cost</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-900)' }}>$104,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--slate-100)' }}>
                  <span style={{ fontSize: 13, color: 'var(--slate-600)' }}>Efficiency Yield</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--emerald)' }}>14.2x ROI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Institutional Impact Ledger</h3>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>View All History</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Grant / Funder</th>
                  <th>Amount Awarded</th>
                  <th>Status</th>
                  <th>Win Prob (Hist)</th>
                  <th>Impact Score</th>
                </tr>
              </thead>
              <tbody>
                {sampleGrants.map(g => (
                  <tr key={g.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{g.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate-400)' }}>{g.funder}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{g.amount}</td>
                    <td>
                      <span style={{ 
                        fontSize: 11, 
                        fontWeight: 700, 
                        background: g.status === 'Awarded' ? 'var(--emerald)15' : 'var(--slate-100)', 
                        color: g.status === 'Awarded' ? 'var(--emerald)' : 'var(--slate-500)',
                        padding: '4px 10px',
                        borderRadius: 999
                      }}>{g.status}</span>
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal)' }}>{g.winProb}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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

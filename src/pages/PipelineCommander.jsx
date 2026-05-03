import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { 
  Filter, 
  Search, 
  Plus, 
  MoreVertical, 
  ArrowUpRight, 
  Clock, 
  Target, 
  Zap, 
  Layers,
  ChevronRight,
  ArrowRight,
  Sparkles,
  X,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const samplePipeline = [
  { id: 1, name: 'Climate Education Catalyst', funder: 'Bezos Earth Fund', amount: '$1,200,000', status: 'In Progress', match: 98, winProb: '85%', deadline: 'Dec 15, 2026', nextAction: 'Refine Sustainability Section' },
  { id: 2, name: 'Urban STEM Initiative', funder: 'Schmidt Futures', amount: '$250,000', status: 'Review', match: 92, winProb: '70%', deadline: 'Nov 24, 2026', nextAction: 'Wait for internal review' },
  { id: 3, name: 'Lumina Digital Equity', funder: 'Lumina Foundation', amount: '$150,000', status: 'Drafting', match: 94, winProb: '92%', deadline: 'Jan 10, 2027', nextAction: 'Draft Executive Summary' },
  { id: 4, name: 'AI for Good Grant', funder: 'Google.org', amount: '$500,000', status: 'Research', match: 88, winProb: '45%', deadline: 'Feb 02, 2027', nextAction: 'Assess eligibility' },
  { id: 5, name: 'Social Justice Fund', funder: 'Ford Foundation', amount: '$400,000', status: 'In Progress', match: 90, winProb: '78%', deadline: 'Mar 15, 2027', nextAction: 'Donna following up' }
];

const tabs = ['All', 'In Progress', 'Submitted', 'Draft', 'Research'];

const PipelineCommander = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrant, setSelectedGrant] = useState(null);

  const filteredGrants = samplePipeline.filter(g => 
    (activeTab === 'All' || g.status === activeTab) &&
    (g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.funder.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Progress': return 'var(--teal)';
      case 'Review': return 'var(--gold)';
      case 'Submitted': return 'var(--emerald)';
      case 'Drafting': return 'var(--teal-light)';
      default: return 'var(--slate-400)';
    }
  };

  return (
    <AppLayout title="Pipeline Commander">
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: 0, margin: '-32px', overflow: 'hidden' }}>
        
        {/* Top Header */}
        <div style={{ background: 'white', padding: '24px 32px', borderBottom: '1px solid var(--slate-200)', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 4 }}>Pipeline Commander</h1>
              <p style={{ color: 'var(--slate-500)', fontSize: 14 }}>Managing <span style={{ color: 'var(--teal)', fontWeight: 700 }}>$3.8M</span> in active grant opportunities.</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" style={{ gap: 8 }}><Plus size={18} /> Add Opportunity</button>
              <button className="btn btn-primary" style={{ gap: 8 }} onClick={() => navigate('/radar')}><Search size={18} /> Discovery Radar</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Total Opportunities</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>24</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Projected Win Value</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--emerald)' }}>$1.8M</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Win Probability</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--teal)' }}>72%</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Main List Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div className="scroll-x hide-scrollbar" style={{ display: 'flex', background: 'var(--slate-100)', borderRadius: 10, padding: 4, gap: 4 }}>
                {tabs.map(tab => (
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
              <div style={{ display: 'flex', gap: 12, flex: 1, maxWidth: 400 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                  <input 
                    type="text" 
                    placeholder="Search grants..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: 36, height: 40, borderRadius: 10, width: '100%' }} 
                  />
                </div>
                <button className="btn btn-ghost" style={{ padding: '0 12px', height: 40, borderRadius: 10 }}><Filter size={18} /></button>
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Grant / Funder</th>
                    <th>Match</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th className="desktop-only">Win Prob.</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrants.map((grant) => (
                    <tr key={grant.id} onClick={() => setSelectedGrant(grant)} style={{ cursor: 'pointer' }}>
                      <td data-label="Grant / Funder">
                        <div style={{ fontWeight: 700, color: 'var(--slate-900)', fontSize: 14 }}>{grant.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 2 }}>{grant.funder}</div>
                      </td>
                      <td data-label="Match">
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)' }}>{grant.match}%</div>
                      </td>
                      <td data-label="Amount" style={{ fontWeight: 600, fontSize: 14 }}>{grant.amount}</td>
                      <td data-label="Status">
                        <span style={{ 
                          background: `${getStatusColor(grant.status)}15`, 
                          color: getStatusColor(grant.status),
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: 999
                        }}>{grant.status}</span>
                      </td>
                      <td data-label="Deadline" style={{ fontSize: 13, color: 'var(--slate-500)' }}>{grant.deadline.split(', ')[0]}</td>
                      <td data-label="Win Prob." className="desktop-only">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, color: 'var(--slate-700)' }}>
                          {grant.winProb}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Strategist Sidebar */}
          <aside className="desktop-only" style={{ width: 340, background: 'var(--slate-50)', borderLeft: '1px solid var(--slate-200)', overflowY: 'auto', padding: '32px 24px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>AI Strategy Insights</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: 'white', padding: 20, borderRadius: 16, border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--gold)', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
                  <Sparkles size={18} /> High-Yield Recommendations
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 13, color: 'var(--slate-600)', lineHeight: 1.5, paddingLeft: 12, borderLeft: '3px solid var(--teal)' }}>
                    Priority: <strong>Bezos Earth Fund</strong> draft is at 94% match. Refine the sustainability section to push it to 98% for near-certain funding.
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--slate-600)', lineHeight: 1.5, paddingLeft: 12, borderLeft: '3px solid var(--gold)' }}>
                    Action Required: <strong>Schmidt Futures</strong> review is pending internal feedback. Donna recommends a follow-up email by Thursday.
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Upcoming Deadlines</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {samplePipeline.slice(0, 3).map(g => (
                    <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--slate-700)' }}>{g.name.substring(0, 15)}...</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--rose)' }}>{g.deadline.split(', ')[0]}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', height: 52, borderRadius: 12, gap: 10 }}>
                <Zap size={18} /> Generate Strategy Report
              </button>
            </div>
          </aside>
        </div>

        {/* Selected Grant Side Panel (Mobile/Tablet Friendly) */}
        {selectedGrant && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedGrant(null)} />
            <aside style={{ position: 'relative', width: '100%', maxWidth: 440, background: 'white', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 50px rgba(0,0,0,0.1)', padding: 32, animation: 'slideInRight 0.4s ease' }}>
              <style>{`
                @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
              `}</style>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
                <div style={{ width: 48, height: 48, background: 'var(--teal-xlight)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)' }}>
                  <Layers size={24} />
                </div>
                <button onClick={() => setSelectedGrant(null)} style={{ background: 'var(--slate-100)', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{selectedGrant.name}</h2>
              <div style={{ fontSize: 15, color: 'var(--slate-500)', marginBottom: 32 }}>{selectedGrant.funder}</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                <div className="card" style={{ padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 4 }}>Amount</div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{selectedGrant.amount}</div>
                </div>
                <div className="card" style={{ padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 4 }}>Win Prob.</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--teal)' }}>{selectedGrant.winProb}</div>
                </div>
              </div>

              <div style={{ background: 'var(--slate-50)', borderRadius: 16, padding: 20, marginBottom: 32 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 12 }}>Current Next Action</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)', marginTop: 6 }}></div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--slate-700)', lineHeight: 1.5 }}>{selectedGrant.nextAction}</div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button className="btn btn-primary" style={{ width: '100%', height: 56, borderRadius: 14, gap: 10 }} onClick={() => navigate('/oracle')}>
                  <FileText size={20} />
                  <span>Open in Oracle Writer</span>
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <button className="btn btn-secondary" style={{ height: 48 }}>View in Radar</button>
                  <button className="btn btn-ghost" style={{ height: 48 }}>Archive</button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default PipelineCommander;

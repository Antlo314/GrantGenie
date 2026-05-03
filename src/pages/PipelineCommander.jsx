import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { 
  Layers, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  MoreHorizontal, 
  Zap, 
  Search, 
  Download, 
  Plus, 
  Filter, 
  FileText, 
  MessageSquare, 
  AlertCircle,
  TrendingUp,
  X,
  RefreshCw,
  Sparkles
} from 'lucide-react';

const samplePipeline = [
  { id: 1, name: 'Climate Resilient Education', funder: 'Bezos Earth Fund', match: 94, amount: '$1.2M', status: 'In Progress', deadline: '12 days', prob: '85%', next: 'Drafting Evaluation section', type: 'Foundation' },
  { id: 2, name: 'Urban STEM Initiative', funder: 'Schmidt Futures', match: 91, amount: '$250k', status: 'Review', deadline: '24 days', prob: '70%', next: 'Internal peer review', type: 'Foundation' },
  { id: 3, name: 'Global Health Equity', funder: 'Gates Foundation', match: 88, amount: '$500k', status: 'Submitted', deadline: 'Passed', prob: '45%', next: 'Awaiting funder decision', type: 'Foundation' },
  { id: 4, name: 'AI for Good Grant', funder: 'Google.org', match: 84, amount: '$150k', status: 'Draft', deadline: '42 days', prob: '60%', next: 'Verify hardware budget', type: 'Corporate' },
  { id: 5, name: 'Clean Air for Cities', funder: 'Bloomberg Philanthropies', match: 82, amount: '$750k', status: 'Research', deadline: '68 days', prob: '30%', next: 'Confirm eligibility checklist', type: 'Foundation' },
  { id: 6, name: 'STEM Excellence in K-12', funder: 'National Science Foundation', match: 79, amount: '$300k', status: 'Draft', deadline: '56 days', prob: '40%', next: 'Refine research outcomes', type: 'Federal' },
  { id: 7, name: 'Social Justice Fund', funder: 'Ford Foundation', match: 92, status: 'In Progress', amount: '$400k', deadline: '8 days', prob: '90%', next: 'Upload logic model', type: 'Foundation' },
  { id: 8, name: 'Environmental Justice Program', funder: 'EPA', match: 81, status: 'Research', amount: '$100k', deadline: '14 days', prob: '55%', next: 'Contact program officer', type: 'Federal' }
];

const PipelineCommander = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = ['All', 'In Progress', 'Submitted', 'Draft', 'Research'];

  const filteredGrants = samplePipeline.filter(g => {
    const matchesTab = activeTab === 'All' || g.status === activeTab;
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.funder.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status) => {
    const map = {
      'In Progress': 'var(--teal)',
      'Submitted': 'var(--emerald)',
      'Draft': 'var(--gold)',
      'Research': 'var(--slate-500)',
      'Review': '#6366f1'
    };
    return map[status] || 'var(--slate-400)';
  };

  const getUrgencyColor = (deadline) => {
    if (deadline === 'Passed') return 'var(--slate-400)';
    const days = parseInt(deadline);
    if (days <= 14) return 'var(--rose)';
    if (days <= 30) return 'var(--gold)';
    return 'var(--slate-700)';
  };

  return (
    <AppLayout title="Pipeline Commander">
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: 0, margin: '-32px', overflow: 'hidden' }}>
        
        {/* Header Section */}
        <div style={{ background: 'white', padding: '24px 32px', borderBottom: '1px solid var(--slate-200)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 4 }}>Pipeline Commander</h1>
              <p style={{ color: 'var(--slate-500)', fontSize: 14 }}>The central operating system for your grant fundraising lifecycle.</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" style={{ gap: 8 }}><Download size={16} /> Export Report</button>
              <button className="btn btn-ghost" style={{ gap: 8 }}><RefreshCw size={16} /> Sync Radar</button>
              <button className="btn btn-primary" style={{ gap: 8 }}><Plus size={16} /> Add Grant to Pipeline</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Total in Pipeline</div>
              <div className="stat-value" style={{ fontSize: 24 }}>$3.85M</div>
              <div style={{ fontSize: 11, color: 'var(--slate-400)', marginTop: 4 }}>Across 12 active grants</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Upcoming (30d)</div>
              <div className="stat-value" style={{ fontSize: 24, color: 'var(--rose)' }}>4 Deadlines</div>
              <div style={{ fontSize: 11, color: 'var(--slate-400)', marginTop: 4 }}>Next: Ford Foundation (8d)</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Projected Value</div>
              <div className="stat-value" style={{ fontSize: 24, color: 'var(--emerald)' }}>$1.47M</div>
              <div style={{ fontSize: 11, color: 'var(--slate-400)', marginTop: 4 }}>Based on Win Probabilities</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Avg. Match Score</div>
              <div className="stat-value" style={{ fontSize: 24, color: 'var(--teal)' }}>86%</div>
              <div style={{ fontSize: 11, color: 'var(--slate-400)', marginTop: 4 }}>High-alignment portfolio</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Main List Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', background: 'var(--slate-100)', borderRadius: 10, padding: 4, gap: 4 }}>
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
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                  <input 
                    type="text" 
                    placeholder="Search grants..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: 36, width: 240, height: 40, borderRadius: 10 }} 
                  />
                </div>
                <button className="btn btn-ghost" style={{ padding: '0 12px', height: 40, borderRadius: 10 }}><Filter size={18} /></button>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--slate-200)', overflow: 'hidden' }}>
              <table style={{ minWidth: '900px' }}>
                <thead>
                  <tr>
                    <th>Grant / Funder</th>
                    <th>Match</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Win Prob.</th>
                    <th>Next Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrants.map((grant) => (
                    <tr key={grant.id} onClick={() => setSelectedGrant(grant)} style={{ cursor: 'pointer' }}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--slate-900)', fontSize: 14 }}>{grant.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 2 }}>{grant.funder}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)' }}>{grant.match}%</div>
                      </td>
                      <td style={{ fontWeight: 600, fontSize: 14 }}>{grant.amount}</td>
                      <td>
                        <span style={{ 
                          background: `${getStatusColor(grant.status)}15`, 
                          color: getStatusColor(grant.status),
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: 999,
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em'
                        }}>{grant.status}</span>
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 600, color: getUrgencyColor(grant.deadline) }}>{grant.deadline}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 40, height: 4, background: 'var(--slate-100)', borderRadius: 999, overflow: 'hidden' }}>
                            <div style={{ width: grant.prob, height: '100%', background: parseInt(grant.prob) > 70 ? 'var(--emerald)' : 'var(--teal)' }}></div>
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--slate-600)', fontWeight: 600 }}>{grant.prob}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--slate-500)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{grant.next}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside style={{ width: 340, background: 'white', borderLeft: '1px solid var(--slate-200)', overflowY: 'auto', padding: '32px' }} className="desktop-only">
            <div style={{ marginBottom: 40 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Upcoming Deadlines</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {samplePipeline.filter(g => g.deadline !== 'Passed' && parseInt(g.deadline) < 20).map(g => (
                  <div key={g.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CalendarIcon day={g.deadline.split(' ')[0]} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-900)' }}>{g.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--rose)', fontWeight: 600, marginTop: 2 }}>{g.deadline} remaining</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>AI Insights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ padding: 16, background: 'rgba(13,148,136,0.03)', border: '1px solid rgba(13,148,136,0.1)', borderRadius: 16 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--teal)', fontWeight: 700, fontSize: 12, marginBottom: 8 }}>
                    <Sparkles size={14} /> Attention Needed
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--slate-600)', lineHeight: 1.5, margin: 0 }}>
                    3 grants have deadlines within 14 days and are less than 50% drafted.
                  </p>
                </div>
                <div style={{ padding: 16, background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 16 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--gold)', fontWeight: 700, fontSize: 12, marginBottom: 8 }}>
                    <AlertCircle size={14} /> Stewardship Alert
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--slate-600)', lineHeight: 1.5, margin: 0 }}>
                    Donna recommends follow-up on <strong>Lumina Grant</strong> — no update since submission.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Detail Side Panel */}
        {selectedGrant && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }} className="animate-fade-in">
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedGrant(null)} />
            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 440, background: 'white', boxShadow: 'var(--shadow-2xl)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>Pipeline Detail</h2>
                <button onClick={() => setSelectedGrant(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}><X size={24} /></button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ padding: '4px 10px', background: `${getStatusColor(selectedGrant.status)}15`, color: getStatusColor(selectedGrant.status), fontSize: 11, fontWeight: 700, borderRadius: 999, textTransform: 'uppercase' }}>{selectedGrant.status}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)' }}>{selectedGrant.match}% Match</span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 4 }}>{selectedGrant.name}</h3>
                  <p style={{ fontSize: 15, color: 'var(--slate-500)', fontWeight: 600 }}>{selectedGrant.funder}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: 'var(--slate-50)', padding: 16, borderRadius: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 4 }}>Amount</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)' }}>{selectedGrant.amount}</div>
                  </div>
                  <div style={{ background: 'var(--slate-50)', padding: 16, borderRadius: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 4 }}>Deadline</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: getUrgencyColor(selectedGrant.deadline) }}>{selectedGrant.deadline}</div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Zap size={16} style={{ color: 'var(--teal)' }} /> Strategic Next Action
                  </h4>
                  <div style={{ background: 'rgba(13,148,136,0.03)', border: '1px solid rgba(13,148,136,0.1)', padding: 16, borderRadius: 12, fontSize: 14, color: 'var(--slate-700)', fontWeight: 600 }}>
                    {selectedGrant.next}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button className="btn btn-primary" style={{ width: '100%', height: 52, borderRadius: 12, gap: 10 }} onClick={() => navigate('/oracle')}>
                    <FileText size={18} /> Open in Oracle Writer
                  </button>
                  <button className="btn btn-ghost" style={{ width: '100%', height: 52, borderRadius: 12, gap: 10 }} onClick={() => navigate('/radar')}>
                    <Search size={18} /> View in Discovery Radar
                  </button>
                  <button className="btn btn-ghost" style={{ width: '100%', height: 52, borderRadius: 12, gap: 10 }}>
                    <TrendingUp size={18} /> Generate Impact Report
                  </button>
                  <button className="btn btn-ghost" style={{ width: '100%', height: 52, borderRadius: 12, gap: 10 }}>
                    <MessageSquare size={18} /> Add Private Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

const CalendarIcon = ({ day }) => {
  const isNumber = !isNaN(parseInt(day));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--slate-900)' }}>{isNumber ? day : '—'}</div>
      <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>{isNumber ? 'Days' : 'None'}</div>
    </div>
  );
};

export default PipelineCommander;

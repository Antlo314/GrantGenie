import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { TrendingUp, FileText, Search, Zap, ArrowRight, Clock, CheckCircle, AlertCircle, Activity, Sparkles } from 'lucide-react';

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
    <AppLayout title="System Overview">
      <div className="animate-fade-in">
        
        {/* Onboarding Modal */}
        {showTour && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }} onClick={closeTour} />
            <div style={{ position: 'relative', width: '90%', maxWidth: 440, background: 'white', borderRadius: 24, padding: 32, textAlign: 'center', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ width: 64, height: 64, background: 'var(--teal-xlight)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Sparkles size={32} style={{ color: 'var(--teal)' }} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Welcome to Grant Genie</h2>
              <p style={{ color: 'var(--slate-500)', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>Your AI-powered operating system for finding, drafting, and winning grants is now active.</p>
              <button className="btn btn-primary" style={{ width: '100%', borderRadius: 12 }} onClick={closeTour}>Initialize Dashboard</button>
            </div>
          </div>
        )}

        {/* Bento Grid Metrics */}
        <div className="bento-grid" style={{ marginBottom: 32 }}>
          <div className="card bento-card bento-span-2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--gradient-teal)', color: 'white', border: 'none' }}>
            <div>
              <div style={{ opacity: 0.8, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Total Pipeline Value</div>
              <div style={{ fontSize: 36, fontWeight: 800 }}>$3,852,000</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: 8, width: 'fit-content' }}>
              <TrendingUp size={16} /> <span>+12.4% from last month</span>
            </div>
          </div>

          <div className="card bento-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="stat-label">Active Oracle Drafts</div>
            <div className="stat-value">12</div>
            <div className="stat-change stat-up">4 ready to submit</div>
          </div>

          <div className="card bento-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="stat-label">Quantum Radar Matches</div>
            <div className="stat-value">142</div>
            <div className="stat-change stat-up">24 new today</div>
          </div>

          <div className="card bento-card bento-span-2" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div className="stat-label">Win Rate Improvement</div>
              <div className="stat-value" style={{ color: 'var(--teal)' }}>+42%</div>
              <p style={{ fontSize: 12, color: 'var(--slate-400)', marginTop: 4 }}>Compared to industry standard benchmarks</p>
            </div>
            <div style={{ width: 80, height: 80, borderRadius: '50%', border: '8px solid var(--teal-xlight)', borderTopColor: 'var(--teal)', transform: 'rotate(45deg)' }}></div>
          </div>

          <div className="card bento-card bento-span-2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="stat-label">Donna Stewardship Score</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="stat-value">A+</div>
              <div style={{ flex: 1, height: 8, background: 'var(--slate-100)', borderRadius: 99 }}>
                <div style={{ width: '94%', height: '100%', background: 'var(--teal)', borderRadius: 99 }}></div>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--teal)' }}>94%</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 32 }}>
          {/* Active Pipeline Table - Responsive */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Active Grant Pipeline</h3>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => navigate('/pipeline')}>View All</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Grant Name</th>
                    <th>Funder</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Climate Resilience Fund', funder: 'Bezos Earth Fund', amount: '$1.2M', status: 'In Progress', deadline: 'Dec 15' },
                    { name: 'Urban STEM Initiative', funder: 'Schmidt Futures', amount: '$250K', status: 'Review', deadline: 'Nov 24' },
                    { name: 'Digital Equity Grant', funder: 'Lumina Foundation', amount: '$150K', status: 'Drafting', deadline: 'Jan 10' },
                    { name: 'Social Justice Fund', funder: 'Ford Foundation', amount: '$400K', status: 'Awarded', deadline: 'Feb 01' }
                  ].map((grant, i) => (
                    <tr key={i}>
                      <td data-label="Grant Name" style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{grant.name}</td>
                      <td data-label="Funder">{grant.funder}</td>
                      <td data-label="Amount" style={{ fontWeight: 600 }}>{grant.amount}</td>
                      <td data-label="Status">
                        <span style={{ 
                          fontSize: 11, 
                          fontWeight: 700, 
                          background: grant.status === 'Awarded' ? 'var(--emerald)15' : 'var(--slate-100)', 
                          color: grant.status === 'Awarded' ? 'var(--emerald)' : 'var(--slate-500)',
                          padding: '4px 10px',
                          borderRadius: 999
                        }}>{grant.status}</span>
                      </td>
                      <td data-label="Deadline" style={{ color: 'var(--slate-500)', fontSize: 13 }}>{grant.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Command Center</h3>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', width: '100%', gap: 12 }} onClick={() => navigate('/radar')}>
              <Search size={18} /> Scan New Funders
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', width: '100%', gap: 12 }} onClick={() => navigate('/oracle')}>
              <FileText size={18} /> Generate Full Proposal
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', width: '100%', gap: 12 }}>
              <TrendingUp size={18} /> Performance Audit
            </button>
            <div style={{ marginTop: 'auto', padding: 16, background: 'var(--slate-50)', borderRadius: 12, border: '1px solid var(--slate-100)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--teal)', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
                <Activity size={14} /> System Health
              </div>
              <p style={{ fontSize: 12, color: 'var(--slate-500)' }}>Quantum Radar & Oracle Agent clusters operating at peak efficiency.</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

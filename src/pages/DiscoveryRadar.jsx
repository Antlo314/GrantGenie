import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { 
  Search, 
  Filter, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle, 
  X, 
  ChevronRight, 
  Loader2, 
  Zap,
  Target,
  Clock,
  ArrowRight
} from 'lucide-react';

const sampleGrants = [
  {
    id: 1,
    title: "Climate Education Catalyst",
    funder: "Bezos Earth Fund",
    amount: "$500,000 - $1,500,000",
    deadline: "Dec 15, 2026",
    matchScore: 98,
    type: "Foundation",
    aiReason: "Directly matches your STEM focus and geographic priority for urban California districts.",
    eligibility: ["501(c)(3) Status", "Urban Focus", "3+ Years Operation"],
    summary: "Supporting innovative K-12 climate education programs that leverage technology to drive student engagement in underserved communities."
  },
  {
    id: 2,
    title: "Urban STEM Initiative",
    funder: "Schmidt Futures",
    amount: "$250,000",
    deadline: "Nov 24, 2026",
    matchScore: 92,
    type: "Philanthropy",
    aiReason: "High alignment with your mobile 'Quantum Lab' technology deployment model.",
    eligibility: ["Nonprofit Status", "Technology Focus", "Scalable Model"],
    summary: "Funding for scalable technology solutions that improve STEM education outcomes in urban environments."
  },
  {
    id: 3,
    title: "Global Health Equity Grant",
    funder: "Bill & Melinda Gates Foundation",
    amount: "$1,000,000+",
    deadline: "Jan 10, 2027",
    matchScore: 85,
    type: "International",
    aiReason: "Matches your long-term goal for international expansion, though less immediate than local grants.",
    eligibility: ["Global Reach", "Health/Education Nexus", "Evidence-based"],
    summary: "Improving health outcomes through education and technological intervention in developing regions."
  },
  {
    id: 4,
    title: "Digital Literacy for All",
    funder: "Google.org",
    amount: "$100,000 - $500,000",
    deadline: "Feb 02, 2027",
    matchScore: 88,
    type: "Corporate",
    aiReason: "Perfect fit for your teacher professional development pillar in climate pedagogy.",
    eligibility: ["US-based 501(c)(3)", "Digital Content", "K-12 Scope"],
    summary: "Grants for organizations bridging the digital divide through innovative curriculum and teacher training."
  }
];

const DiscoveryRadar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [grants, setGrants] = useState(sampleGrants);
  const [selectedGrant, setSelectedGrant] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // In a real app, this would be an API call
    }, 1500);
  };

  return (
    <AppLayout title="Discovery Radar">
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 140px)', gap: 0, margin: 'calc(var(--container-px) * -1)', overflow: 'hidden' }}>
        
        {/* Search Header */}
        <div style={{ background: 'white', padding: 'var(--container-px)', borderBottom: '1px solid var(--slate-200)', flexShrink: 0 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, maxWidth: 1000, margin: '0 auto', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input 
                type="text" 
                placeholder="Describe your project..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 44, height: 50, borderRadius: 12, fontSize: 14, background: 'var(--slate-50)', border: '1px solid var(--slate-200)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 24px', height: 50, borderRadius: 12, gap: 8, flex: '0 0 auto' }}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
              <span className="desktop-only">Scan Funders</span>
              <span className="mobile-only">Scan</span>
            </button>
          </form>
        </div>

        {/* Filter Bar */}
        <div className="scroll-x hide-scrollbar" style={{ background: 'var(--slate-50)', padding: '10px var(--container-px)', borderBottom: '1px solid var(--slate-200)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>Urgency:</span>
            <select style={{ background: 'transparent', border: 'none', fontSize: 12, fontWeight: 600, color: 'var(--slate-700)', cursor: 'pointer', outline: 'none' }}>
              <option>All Deadlines</option>
              <option>Next 30 Days</option>
              <option>Next 90 Days</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>Funding Type:</span>
            <select style={{ background: 'transparent', border: 'none', fontSize: 12, fontWeight: 600, color: 'var(--slate-700)', cursor: 'pointer', outline: 'none' }}>
              <option>All Types</option>
              <option>Foundation</option>
              <option>Federal</option>
              <option>Corporate</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>Success Rate:</span>
            <select style={{ background: 'transparent', border: 'none', fontSize: 12, fontWeight: 600, color: 'var(--slate-700)', cursor: 'pointer', outline: 'none' }}>
              <option>All Rates</option>
              <option>High ({'>'}15%)</option>
              <option>Medium ({'>'}8%)</option>
            </select>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: 'row' }} className="responsive-radar-layout">
          <style>{`
            @media (max-width: 1024px) {
              .responsive-radar-layout { flex-direction: column !important; overflow-y: auto !important; height: auto !important; }
              .radar-results { padding: 16px !important; overflow-y: visible !important; }
              .radar-card { grid-template-columns: 1fr !important; gap: 12px !important; padding: 16px !important; }
              .radar-card-metrics { flex-direction: row !important; justify-content: space-between !important; gap: 12px !important; text-align: left !important; border-top: 1px solid var(--slate-100); padding-top: 12px; }
              .radar-card-metrics > div:first-child { display: block !important; }
            }
          `}</style>
          
          {/* Results Table */}
          <div className="radar-results" style={{ flex: 1, overflowY: 'auto', padding: '24px var(--container-px)' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 16 }}>
                <Loader2 size={32} className="animate-spin" style={{ color: 'var(--teal)' }} />
                <p style={{ fontWeight: 600, color: 'var(--slate-500)', textAlign: 'center' }}>Quantum Match Engine is processing funders...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate-400)', marginBottom: 4 }}>Scanning 40,000+ funders · <span style={{ color: 'var(--teal)' }}>142 Matches</span></div>
                {grants.map((grant) => (
                  <div 
                    key={grant.id} 
                    onClick={() => setSelectedGrant(grant)}
                    className="radar-card"
                    style={{ 
                      background: 'white', 
                      borderRadius: 12, 
                      border: `1px solid ${selectedGrant?.id === grant.id ? 'var(--teal)' : 'var(--slate-200)'}`,
                      padding: 20,
                      display: 'grid',
                      gridTemplateColumns: '1fr 120px 100px 80px',
                      alignItems: 'center',
                      gap: 20,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: selectedGrant?.id === grant.id ? 'var(--shadow-md)' : 'none'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--slate-900)' }}>{grant.title}</h3>
                        <span style={{ padding: '2px 6px', background: 'var(--slate-100)', borderRadius: 4, fontSize: 10, fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', flexShrink: 0 }}>{grant.type}</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600, marginBottom: 6 }}>{grant.funder}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--slate-500)' }}>
                        <Sparkles size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                        <span style={{ fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{grant.aiReason}</span>
                      </div>
                    </div>

                    <div className="radar-card-metrics" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 2 }}>Amount</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-900)' }}>{grant.amount.split(' - ')[0]}</div>
                    </div>

                    <div className="radar-card-metrics" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 2 }}>Deadline</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-900)' }}>{grant.deadline.split(', ')[0]}</div>
                    </div>

                    <div className="radar-card-metrics" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 2 }}>Match</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: grant.matchScore > 95 ? 'var(--emerald)' : 'var(--teal)' }}>{grant.matchScore}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel: Detail View */}
          {selectedGrant && (
            <aside style={{ width: 400, background: 'white', borderLeft: '1px solid var(--slate-200)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="radar-detail-panel">
              <style>{`
                @media (max-width: 1024px) {
                  .radar-detail-panel { width: 100% !important; border-left: none !important; border-top: 1px solid var(--slate-200) !important; position: fixed !important; bottom: 0 !important; left: 0 !important; right: 0 !important; height: 85vh !important; z-index: 1000 !important; box-shadow: 0 -20px 50px rgba(0,0,0,0.1) !important; animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important; border-radius: 24px 24px 0 0 !important; }
                  .radar-detail-content { padding: 24px !important; }
                }
                @keyframes slideInUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
              `}</style>
              <div className="radar-detail-content" style={{ padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, background: 'var(--slate-100)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)' }}>
                    <Target size={24} />
                  </div>
                  <button onClick={() => setSelectedGrant(null)} style={{ background: 'var(--slate-100)', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--slate-500)' }}><X size={18} /></button>
                </div>

                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 6 }}>{selectedGrant.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <span className="badge badge-teal">{selectedGrant.type}</span>
                  <span style={{ fontSize: 13, color: 'var(--slate-500)', fontWeight: 600 }}>{selectedGrant.funder}</span>
                </div>

                <div style={{ background: 'var(--slate-50)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--teal)', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
                    <Sparkles size={16} /> AI Match Reasoning
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--slate-600)', lineHeight: 1.6 }}>{selectedGrant.aiReason}</p>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Funding Summary</h3>
                  <p style={{ fontSize: 14, color: 'var(--slate-700)', lineHeight: 1.6 }}>{selectedGrant.summary}</p>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Eligibility Checklist</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {selectedGrant.eligibility.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--slate-600)' }}>
                        <CheckCircle size={14} color="var(--emerald)" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button className="btn btn-primary" style={{ width: '100%', height: 50, borderRadius: 12, gap: 8 }} onClick={() => navigate('/oracle')}>
                    <span>Start Draft in Oracle</span>
                    <ArrowRight size={16} />
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button className="btn btn-secondary" style={{ height: 44, borderRadius: 10, fontSize: 12 }}>Save</button>
                    <button className="btn btn-ghost" style={{ height: 44, borderRadius: 10, fontSize: 12 }}>Profile</button>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DiscoveryRadar;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { 
  Search, 
  Zap, 
  Activity, 
  Heart, 
  X, 
  Filter, 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  Globe, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Download,
  PlusCircle,
  FileText
} from 'lucide-react';
import { askGemini } from '../utils/ai';

const sampleGrants = [
  { 
    id: 1, 
    title: 'Climate Education Catalyst Grant', 
    funder: 'Bezos Earth Fund', 
    amount: '$250,000 - $1,000,000', 
    deadline: 'Dec 15, 2026', 
    matchScore: 98,
    type: 'Foundation',
    successRate: '12%',
    location: 'Global / US Priority',
    aiReason: 'Direct alignment with your "Quantum Lab" mobile initiative and focus on underserved urban Title I districts.',
    eligibility: ['501(c)(3) Status', 'Documented 3-year track record', 'Focus on STEM/Climate education'],
    fullDescription: 'The Bezos Earth Fund is seeking applications for innovative education programs that bridge the gap between climate science and local community action. Priority is given to projects that leverage technology to reach marginalized student populations.'
  },
  { 
    id: 2, 
    title: 'Environmental Justice Small Grants', 
    funder: 'EPA (Environmental Protection Agency)', 
    amount: '$50,000 - $100,000', 
    deadline: 'Jan 10, 2027', 
    matchScore: 91,
    type: 'Federal',
    successRate: '24%',
    location: 'United States',
    aiReason: 'Matches your localized air quality monitoring program for community resilience mapping.',
    eligibility: ['Nonprofit organizations', 'Tribal governments', 'Localized community focus'],
    fullDescription: 'Supports community-driven projects that address environmental and public health issues in areas disproportionately affected by pollution and climate change.'
  },
  { 
    id: 3, 
    title: 'Urban Green Space Innovation', 
    funder: 'Bloomberg Philanthropies', 
    amount: '$500,000', 
    deadline: 'Nov 01, 2026', 
    matchScore: 87,
    type: 'Foundation',
    successRate: '8%',
    location: 'C40 Cities Network',
    aiReason: 'Fits your scalable model for urban carbon sequestration education in metropolitan areas.',
    eligibility: ['Registered non-profits', 'City government partnership required'],
    fullDescription: 'Accelerating the development of urban green infrastructure through community engagement and education.'
  },
  { 
    id: 4, 
    title: 'Digital Equity & Climate Awareness', 
    funder: 'Google.org', 
    amount: '$150,000', 
    deadline: 'Feb 20, 2027', 
    matchScore: 84,
    type: 'Corporate',
    successRate: '15%',
    location: 'United States',
    aiReason: 'Matches your integration of tech hardware with environmental awareness curriculum.',
    eligibility: ['501(c)(3) Status', 'Technology-driven approach'],
    fullDescription: 'Funding organizations that use technology to solve the worlds biggest challenges, with a focus on climate resilience and digital inclusion.'
  },
  { 
    id: 5, 
    title: 'K-12 STEM Excellence Fund', 
    funder: 'National Science Foundation (NSF)', 
    amount: '$300,000 - $750,000', 
    deadline: 'Dec 01, 2026', 
    matchScore: 79,
    type: 'Federal',
    successRate: '10%',
    location: 'United States',
    aiReason: 'Strong for your teacher professional development pillar, though more academic focus required.',
    eligibility: ['Educational institutions', 'Associated non-profits'],
    fullDescription: 'Promoting excellence in STEM education through research-driven instructional models and teacher training.'
  },
  { 
    id: 6, 
    title: 'Community Resilience Building', 
    funder: 'Rockefeller Foundation', 
    amount: '$200,000', 
    deadline: 'Rolling', 
    matchScore: 76,
    type: 'Foundation',
    successRate: '5%',
    location: 'Global',
    aiReason: 'General match for community mapping, but requires stronger emphasis on healthcare nexus.',
    eligibility: ['Global non-profits', 'Evidence of systemic impact'],
    fullDescription: 'Building resilience for individuals, communities, and systems to survive, adapt, and grow in the face of climate shocks.'
  }
];

const DiscoveryRadar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [grants, setGrants] = useState(sampleGrants);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate real-time scanning
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'var(--emerald)';
    if (score >= 80) return 'var(--teal)';
    return 'var(--gold)';
  };

  return (
    <AppLayout title="Discovery Radar">
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: 0, overflow: 'hidden', margin: '-32px' }}>
        
        {/* Search & Header Section */}
        <div style={{ background: 'white', borderBottom: '1px solid var(--slate-200)', padding: '24px 32px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: '8px 16px', background: 'var(--slate-900)', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)', animation: 'pulse 2s infinite' }} />
                <span style={{ color: 'white', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quantum Radar Active</span>
              </div>
              <span style={{ color: 'var(--slate-400)', fontSize: 13, fontWeight: 500 }}>Scanning 42,817 Global Funders</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" style={{ gap: 8 }}><Download size={16} /> Export List</button>
              <button className="btn btn-primary" style={{ gap: 8 }}><Zap size={16} /> Save to Pipeline</button>
            </div>
          </div>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input 
                type="text" 
                placeholder="Search via natural language (e.g. 'climate education for small nonprofits in California')..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 48, height: 52, fontSize: 15, borderRadius: 12 }}
              />
            </div>
            <button className="btn btn-primary" style={{ padding: '0 24px', height: 52, borderRadius: 12 }}>Search Funders</button>
            <button className="btn btn-ghost" style={{ padding: '0 16px', height: 52, borderRadius: 12 }}><Filter size={20} /></button>
          </form>
        </div>

        {/* Filter Bar */}
        <div style={{ background: 'var(--slate-50)', padding: '12px 32px', borderBottom: '1px solid var(--slate-200)', display: 'flex', gap: 24, flexShrink: 0 }}>
          <div className="filter-group">
            <span className="filter-label">Urgency:</span>
            <select className="filter-select"><option>All Deadlines</option><option>Next 30 Days</option><option>Next 90 Days</option></select>
          </div>
          <div className="filter-group">
            <span className="filter-label">Funding Type:</span>
            <select className="filter-select"><option>All Types</option><option>Foundation</option><option>Federal</option><option>Corporate</option></select>
          </div>
          <div className="filter-group">
            <span className="filter-label">Amount:</span>
            <select className="filter-select"><option>Any Amount</option><option>$50k+</option><option>$250k+</option><option>$1M+</option></select>
          </div>
          <div className="filter-group">
            <span className="filter-label">Success Rate:</span>
            <select className="filter-select"><option>All Rates</option><option>High ({'>'}15%)</option><option>Medium ({'>'}8%)</option></select>
          </div>
          <style>{`
            .filter-group { display: flex; alignItems: center; gap: 8; }
            .filter-label { font-size: 11px; font-weight: 700; color: var(--slate-400); text-transform: uppercase; }
            .filter-select { background: transparent; border: none; font-size: 13px; font-weight: 600; color: var(--slate-700); cursor: pointer; outline: none; }
          `}</style>
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Results Table */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--teal)' }} />
                <p style={{ fontWeight: 600, color: 'var(--slate-500)' }}>Quantum Match Engine is processing funders...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {grants.map((grant) => (
                  <div 
                    key={grant.id} 
                    onClick={() => setSelectedGrant(grant)}
                    style={{ 
                      background: 'white', 
                      borderRadius: 16, 
                      border: `1px solid ${selectedGrant?.id === grant.id ? 'var(--teal)' : 'var(--slate-200)'}`,
                      padding: 24,
                      display: 'grid',
                      gridTemplateColumns: '1fr 150px 120px 140px',
                      alignItems: 'center',
                      gap: 24,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: selectedGrant?.id === grant.id ? 'var(--shadow-md)' : 'none'
                    }}
                    onMouseEnter={(e) => { if (selectedGrant?.id !== grant.id) e.currentTarget.style.borderColor = 'var(--teal-light)'; }}
                    onMouseLeave={(e) => { if (selectedGrant?.id !== grant.id) e.currentTarget.style.borderColor = 'var(--slate-200)'; }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)' }}>{grant.title}</h3>
                        <span style={{ padding: '2px 8px', background: 'var(--slate-100)', borderRadius: 4, fontSize: 11, fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>{grant.type}</span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 600, marginBottom: 8 }}>{grant.funder}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--slate-500)' }}>
                        <Sparkles size={14} style={{ color: 'var(--gold)' }} />
                        <span style={{ fontStyle: 'italic' }}>{grant.aiReason.substring(0, 80)}...</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 4 }}>Amount</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)' }}>{grant.amount.split(' - ')[0]}</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 4 }}>Deadline</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)' }}>{grant.deadline.split(', ')[0]}</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 4 }}>Match Score</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: getScoreColor(grant.matchScore) }}>{grant.matchScore}%</span>
                        <div style={{ width: 40, height: 4, background: 'var(--slate-100)', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ width: `${grant.matchScore}%`, height: '100%', background: getScoreColor(grant.matchScore) }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail Side Panel */}
          {selectedGrant && (
            <aside style={{ width: 440, background: 'white', borderLeft: '1px solid var(--slate-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="animate-fade-in">
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>Grant Details</h2>
                <button onClick={() => setSelectedGrant(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}><X size={24} /></button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 8 }}>{selectedGrant.title}</h3>
                  <p style={{ fontSize: 15, color: 'var(--teal)', fontWeight: 700, marginBottom: 20 }}>{selectedGrant.funder}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ background: 'var(--slate-50)', padding: 16, borderRadius: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 4 }}>Amount</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--slate-900)' }}>{selectedGrant.amount}</div>
                    </div>
                    <div style={{ background: 'var(--slate-50)', padding: 16, borderRadius: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 4 }}>Success Rate</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--emerald)' }}>{selectedGrant.successRate}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={16} style={{ color: 'var(--gold)' }} /> Why it matches
                  </h4>
                  <p style={{ fontSize: 14, color: 'var(--slate-600)', lineHeight: 1.6, background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.1)', padding: 16, borderRadius: 12 }}>
                    {selectedGrant.aiReason}
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 12 }}>Eligibility Checklist</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {selectedGrant.eligibility.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'var(--slate-600)' }}>
                        <CheckCircle2 size={16} style={{ color: 'var(--emerald)' }} /> {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 12 }}>Grant Overview</h4>
                  <p style={{ fontSize: 14, color: 'var(--slate-500)', lineHeight: 1.7 }}>
                    {selectedGrant.fullDescription}
                  </p>
                </div>
              </div>

              <div style={{ padding: 32, borderTop: '1px solid var(--slate-100)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button className="btn btn-primary" style={{ height: 52, borderRadius: 12, gap: 10 }} onClick={() => navigate('/oracle')}>
                  <FileText size={18} /> Start Draft in Oracle
                </button>
                <button className="btn btn-ghost" style={{ height: 52, borderRadius: 12, gap: 10 }}>
                  <PlusCircle size={18} /> Add to Pipeline Commander
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DiscoveryRadar;

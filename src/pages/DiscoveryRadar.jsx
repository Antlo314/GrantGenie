import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { Search, Zap, Activity, Heart, X, Filter, Loader2, Sparkles } from 'lucide-react';
import { askGemini } from '../utils/ai';

const DiscoveryRadar = () => {
  const [loading, setLoading] = useState(false);
  const [grants, setGrants] = useState([
    {
      id: 1,
      title: 'Lumina Foundation Catalyst Fund',
      funder: 'Lumina Foundation',
      amount: '$150,000',
      deadline: 'Nov 15, 2026',
      matchScore: 94,
      tags: ['Education', 'Tech'],
      status: 'High Probability',
      description: 'Funding for innovative tech solutions in education.'
    },
    {
      id: 2,
      title: 'Global Tech Endowment for Youth',
      funder: 'Global Tech Initiatives',
      amount: '$75,000',
      deadline: 'Dec 01, 2026',
      matchScore: 88,
      tags: ['Youth', 'STEM'],
      status: 'Strong Match',
      description: 'Empowering the next generation of engineers.'
    }
  ]);

  const handleLiveScan = async () => {
    setLoading(true);
    try {
      const response = await askGemini(`
        Generate 3 realistic grant opportunities for a nonprofit focused on "Digital Equity and STEM education for Title I school districts".
        Format each as a JSON-like object with: title, funder, amount, deadline, matchScore (80-99), tags (array), and description.
        Return only the descriptions and titles in a professional list format.
      `);
      // For the demo, we'll just prepend a "New Discovery" card based on the AI response
      const newGrant = {
        id: Date.now(),
        title: 'AI Identified: Schmidt Futures Equity Fund',
        funder: 'Schmidt Futures',
        amount: '$125,000',
        deadline: 'Mar 12, 2027',
        matchScore: 97,
        tags: ['AI', 'Equity', 'Scale'],
        status: 'AI Verified',
        description: response.substring(0, 100) + "..."
      };
      setGrants([newGrant, ...grants]);
    } catch (error) {
      alert("Scan failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Discovery Radar">
      <div className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 8 }}>Algorithmic Match Engine</h2>
            <p style={{ color: 'var(--slate-500)', fontSize: 16 }}>Scanning global databases against your organization's DNA profile.</p>
          </div>
          <button className="btn btn-primary" onClick={handleLiveScan} disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Activity size={18} />}
            {loading ? 'Scanning Global Databases...' : 'Initiate Live Scan'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {grants.map((grant) => (
            <div key={grant.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(13,148,136,0.1)', color: 'var(--teal)', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Zap size={14} /> {grant.matchScore}% Match
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost" style={{ padding: 8, borderRadius: '50%' }}><Heart size={16} /></button>
                  <button className="btn btn-ghost" style={{ padding: 8, borderRadius: '50%' }}><X size={16} /></button>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 4 }}>{grant.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--teal)', fontWeight: 600 }}>{grant.funder}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '16px 0', borderTop: '1px solid var(--slate-100)', borderBottom: '1px solid var(--slate-100)' }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 4 }}>Amount</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)' }}>{grant.amount}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 4 }}>Deadline</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)' }}>{grant.deadline}</p>
                </div>
              </div>

              <p style={{ fontSize: 14, color: 'var(--slate-600)', lineHeight: 1.6 }}>{grant.description}</p>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {grant.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate-500)', background: 'var(--slate-100)', padding: '2px 10px', borderRadius: 4 }}>{tag}</span>
                ))}
              </div>

              <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }}>
                Send to Oracle Writer <Sparkles size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default DiscoveryRadar;
  );
};

export default DiscoveryRadar;


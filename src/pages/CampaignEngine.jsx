import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { 
  Megaphone, 
  Users, 
  Heart, 
  Share2, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Zap, 
  Mail, 
  FileText, 
  Plus, 
  ArrowRight,
  X,
  Send,
  Loader2
} from 'lucide-react';
import { askGemini } from '../utils/ai';

const sampleStewardship = [
  { id: 1, name: 'Climate Education Catalyst', funder: 'Bezos Earth Fund', status: 'Awarded', nextAction: 'Send 6-month Impact Highlights', copy: 'Dear Program Officer, I am thrilled to share that our mobile labs have now reached 14 districts...', due: 'Nov 12', confidence: 98 },
  { id: 2, name: 'Urban STEM Initiative', funder: 'Schmidt Futures', status: 'Submitted', nextAction: 'Request status check-in', copy: 'Hello, we are following up on our proposal submitted last month. We have updated data on teacher training...', due: 'Nov 08', confidence: 92 },
  { id: 3, name: 'Global Health Equity', funder: 'Gates Foundation', status: 'Reporting', nextAction: 'Draft Q3 Financial Report', copy: 'This report details the allocation of the $500k disbursement toward community health mapping...', due: 'Nov 15', confidence: 85 },
  { id: 4, name: 'AI for Good Grant', funder: 'Google.org', status: 'In Progress', nextAction: 'Submit hardware budget update', copy: 'Thank you for the recent feedback. We have adjusted the hardware procurement timeline as requested...', due: 'Nov 20', confidence: 88 },
  { id: 5, name: 'Social Justice Fund', funder: 'Ford Foundation', status: 'Awarded', nextAction: 'Schedule strategy call', copy: 'We would love to invite you to our upcoming advisor-style strategy call to discuss the 2027 roadmap...', due: 'Nov 25', confidence: 95 }
];

const CampaignEngine = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: "Hi! I'm Donna. I've analyzed your awarded grants. We have 3 reports due in the next 14 days. Should I start drafting the Bezos Earth Fund highlights?" }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const tabs = ['All', 'In Progress', 'Submitted', 'Awarded', 'Reporting'];

  const filteredCampaigns = sampleStewardship.filter(c => 
    activeTab === 'All' || c.status === activeTab
  );

  const sendMessage = async () => {
    if (!chatInput.trim() || isThinking) return;
    const msg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setIsThinking(true);

    try {
      const response = await askGemini(`
        You are Donna, the AI Grant Stewardship Assistant.
        Context: Managing follow-ups and reporting for various funders.
        User Question: ${msg}
        Provide a proactive, helpful, and professional response.
      `);
      setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'ai', text: "Snag in the system. Try again!" }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <AppLayout title="Donna Auto-Stewardship">
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: 0, margin: '-32px', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ background: 'white', padding: '24px 32px', borderBottom: '1px solid var(--slate-200)', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 4 }}>Donna Auto-Stewardship</h1>
              <p style={{ color: 'var(--slate-500)', fontSize: 14 }}>Your proactive AI agent for funder relations and campaign success.</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" style={{ gap: 8 }}><FileText size={16} /> Export Report</button>
              <button className="btn btn-primary" style={{ gap: 8 }}><Plus size={16} /> <span className="desktop-only">Start New Campaign</span><span className="mobile-only">New</span></button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Active Campaigns</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>8</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Follow-ups Needed</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gold)' }}>3 Open</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Avg. Response Rate</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--teal)' }}>62%</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: 'row' }} className="responsive-campaign-layout">
          <style>{`
            @media (max-width: 1024px) {
              .responsive-campaign-layout { flex-direction: column !important; overflow-y: auto !important; }
              .campaign-list { padding: 16px !important; }
              .campaign-sidebar { width: 100% !important; border-left: none !important; border-top: 1px solid var(--slate-200) !important; padding: 24px !important; }
              .campaign-card { grid-template-columns: 1fr !important; gap: 16px !important; }
            }
          `}</style>
          
          {/* Main List Area */}
          <div className="campaign-list" style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', background: 'var(--slate-100)', borderRadius: 10, padding: 4, gap: 4, marginBottom: 24, width: 'fit-content', overflowX: 'auto' }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredCampaigns.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedCampaign(c)}
                  className="campaign-card"
                  style={{ 
                    background: 'white', 
                    borderRadius: 16, 
                    border: `1px solid ${selectedCampaign?.id === c.id ? 'var(--teal)' : 'var(--slate-200)'}`,
                    padding: 24,
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 120px 1.5fr 100px',
                    alignItems: 'center',
                    gap: 24,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: selectedCampaign?.id === c.id ? 'var(--shadow-md)' : 'none'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 2 }}>{c.name}</h3>
                    <p style={{ fontSize: 13, color: 'var(--slate-500)' }}>{c.funder}</p>
                  </div>
                  
                  <div>
                    <span style={{ 
                      fontSize: 11, 
                      fontWeight: 700, 
                      background: c.status === 'Awarded' ? 'rgba(16,185,129,0.1)' : 'var(--slate-100)', 
                      color: c.status === 'Awarded' ? 'var(--emerald)' : 'var(--slate-600)',
                      padding: '4px 10px',
                      borderRadius: 999,
                      textTransform: 'uppercase'
                    }}>{c.status}</span>
                  </div>

                  <div style={{ background: 'var(--slate-50)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--slate-100)' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', marginBottom: 4, display: 'flex', gap: 4, alignItems: 'center' }}>
                      <Sparkles size={10} /> AI Next Action
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--slate-700)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nextAction}</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 4 }}>Due</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)' }}>{c.due}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="campaign-sidebar" style={{ width: 360, background: 'white', borderLeft: '1px solid var(--slate-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
                <Sparkles size={16} style={{ color: 'var(--teal)' }} /> Donna's Insights
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                <div style={{ padding: 16, background: 'rgba(13,148,136,0.03)', border: '1px solid rgba(13,148,136,0.1)', borderRadius: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal-dark)', marginBottom: 8 }}>High Priority: Lumina Update</div>
                  <p style={{ fontSize: 13, color: 'var(--slate-600)', lineHeight: 1.5, margin: 0 }}>
                    Lumina Foundation typically awards follow-on grants to organizations that provide video evidence.
                  </p>
                  <button className="btn btn-primary" style={{ marginTop: 12, width: '100%', fontSize: 12 }}>Generate Note</button>
                </div>
              </div>

              {/* Chat Window */}
              <div style={{ border: '1px solid var(--slate-200)', borderRadius: 20, overflow: 'hidden', height: 340, display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: 'var(--slate-900)', color: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)' }} />
                  <span style={{ fontSize: 12, fontWeight: 700 }}>Ask Donna</span>
                </div>
                <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {chatMessages.map((msg, i) => (
                    <div key={i} style={{ fontSize: 12, background: msg.role === 'ai' ? 'var(--slate-100)' : 'var(--teal)', color: msg.role === 'ai' ? 'var(--slate-700)' : 'white', padding: '10px 12px', borderRadius: 8, maxWidth: '90%', alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end' }}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                <div style={{ padding: 12, borderTop: '1px solid var(--slate-100)', display: 'flex', gap: 8 }}>
                  <input 
                    type="text" 
                    placeholder="Ask Donna..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    style={{ fontSize: 12, padding: '8px 12px', height: 36 }}
                  />
                  <button className="btn btn-primary" style={{ padding: 8, borderRadius: 8 }} onClick={sendMessage}><Send size={14} /></button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Selected Campaign Overlay */}
        {selectedCampaign && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedCampaign(null)} />
            <aside style={{ position: 'relative', width: '100%', maxWidth: 440, background: 'white', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 50px rgba(0,0,0,0.1)', padding: 32, animation: 'slideInRight 0.4s ease' }}>
              <style>{`
                @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
              `}</style>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
                <div style={{ width: 48, height: 48, background: 'var(--teal-xlight)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)' }}>
                  <Megaphone size={24} />
                </div>
                <button onClick={() => setSelectedCampaign(null)} style={{ background: 'var(--slate-100)', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{selectedCampaign.name}</h2>
              <p style={{ color: 'var(--slate-500)', marginBottom: 32 }}>{selectedCampaign.funder}</p>

              <div style={{ background: 'var(--slate-50)', borderRadius: 16, padding: 20, marginBottom: 32 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', marginBottom: 12 }}>Drafted Follow-up</div>
                <p style={{ fontSize: 14, color: 'var(--slate-700)', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>"{selectedCampaign.copy}"</p>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button className="btn btn-primary" style={{ width: '100%', height: 56, borderRadius: 14, gap: 10 }}>
                  <Mail size={18} />
                  <span>Send Follow-up</span>
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <button className="btn btn-secondary" style={{ height: 48 }}>Draft Report</button>
                  <button className="btn btn-ghost" style={{ height: 48 }}>Schedule</button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CampaignEngine;

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
  { id: 5, name: 'Social Justice Fund', funder: 'Ford Foundation', status: 'Awarded', nextAction: 'Schedule strategy call', copy: 'We would love to invite you to our upcoming advisor-style strategy call to discuss the 2027 roadmap...', due: 'Nov 25', confidence: 95 },
  { id: 6, name: 'Clean Air for Cities', funder: 'Bloomberg Philanthropies', status: 'Submitted', nextAction: 'Send supplemental pilot video', copy: 'We have just released a short 2-minute video showing the air quality monitors in action at local schools...', due: 'Nov 05', confidence: 76 }
];

const CampaignEngine = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isChatting, setIsChatting] = useState(false);
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 4 }}>Donna Auto-Stewardship</h1>
              <p style={{ color: 'var(--slate-500)', fontSize: 14 }}>Your proactive AI agent for funder relations and campaign success.</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" style={{ gap: 8 }}><FileText size={16} /> Export Report</button>
              <button className="btn btn-ghost" style={{ gap: 8 }}><Mail size={16} /> Batch Follow-ups</button>
              <button className="btn btn-primary" style={{ gap: 8 }}><Plus size={16} /> Start New Campaign</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Active Campaigns</div>
              <div className="stat-value" style={{ fontSize: 24 }}>8</div>
              <div style={{ fontSize: 11, color: 'var(--slate-400)', marginTop: 4 }}>4 foundations, 4 corporate</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Follow-ups Needed</div>
              <div className="stat-value" style={{ fontSize: 24, color: 'var(--gold)' }}>3 Open</div>
              <div style={{ fontSize: 11, color: 'var(--slate-400)', marginTop: 4 }}>Avg. response time: 2.1 days</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Reports Due</div>
              <div className="stat-value" style={{ fontSize: 24, color: 'var(--rose)' }}>2 In 14d</div>
              <div style={{ fontSize: 11, color: 'var(--slate-400)', marginTop: 4 }}>Next: Bezos Foundation (Nov 12)</div>
            </div>
            <div className="stat-card" style={{ padding: '16px 20px' }}>
              <div className="stat-label">Avg. Response Rate</div>
              <div className="stat-value" style={{ fontSize: 24, color: 'var(--teal)' }}>62%</div>
              <div style={{ fontSize: 11, color: 'var(--slate-400)', marginTop: 4 }}>↑ 12% since Donna v2.1</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Main List Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', background: 'var(--slate-100)', borderRadius: 10, padding: 4, gap: 4, marginBottom: 24, width: 'fit-content' }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredCampaigns.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedCampaign(c)}
                  style={{ 
                    background: 'white', 
                    borderRadius: 16, 
                    border: `1px solid ${selectedCampaign?.id === c.id ? 'var(--teal)' : 'var(--slate-200)'}`,
                    padding: 24,
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 120px 1.5fr 100px 100px',
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
                      background: c.status === 'Awarded' ? 'var(--emerald)15' : 'var(--slate-100)', 
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

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 4 }}>Confidence</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--teal)' }}>{c.confidence}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside style={{ width: 360, background: 'white', borderLeft: '1px solid var(--slate-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="desktop-only">
            <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
                <Sparkles size={16} style={{ color: 'var(--teal)' }} /> Donna's Recommendations
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                <div style={{ padding: 16, background: 'rgba(13,148,136,0.03)', border: '1px solid rgba(13,148,136,0.1)', borderRadius: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal-dark)', marginBottom: 8 }}>High Priority: Lumina Update</div>
                  <p style={{ fontSize: 13, color: 'var(--slate-600)', lineHeight: 1.5, margin: 0 }}>
                    Lumina Foundation typically awards follow-on grants to organizations that provide <strong>video evidence</strong> of hardware deployment. Send thank-you note with video link today.
                  </p>
                  <button className="btn" style={{ marginTop: 12, width: '100%', fontSize: 12, background: 'var(--teal)', color: 'white' }}>Generate Note</button>
                </div>
                <div style={{ padding: 16, background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', marginBottom: 8 }}>Reporting Deadline</div>
                  <p style={{ fontSize: 13, color: 'var(--slate-600)', lineHeight: 1.5, margin: 0 }}>
                    Bezos Earth Fund Q3 report is due in 9 days. I have synced your <strong>Oracle Budget</strong> data for easy export.
                  </p>
                  <button className="btn" style={{ marginTop: 12, width: '100%', fontSize: 12, background: 'white', border: '1px solid var(--slate-200)', color: 'var(--slate-700)' }}>Review Data</button>
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
                  {isThinking && <div style={{ fontSize: 11, color: 'var(--slate-400)' }}>Donna is typing...</div>}
                </div>
                <div style={{ padding: 12, borderTop: '1px solid var(--slate-100)', display: 'flex', gap: 8 }}>
                  <input 
                    type="text" 
                    placeholder="Ask for advice..." 
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

        {/* Detail Side Panel */}
        {selectedCampaign && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }} className="animate-fade-in">
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedCampaign(null)} />
            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 440, background: 'white', boxShadow: 'var(--shadow-2xl)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>Stewardship Detail</h2>
                <button onClick={() => setSelectedCampaign(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}><X size={24} /></button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 4 }}>{selectedCampaign.name}</h3>
                  <p style={{ fontSize: 15, color: 'var(--teal)', fontWeight: 700 }}>{selectedCampaign.funder}</p>
                </div>

                <div style={{ padding: 20, background: 'var(--slate-50)', borderRadius: 16, border: '1px solid var(--slate-200)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Sparkles size={14} /> Donna's Draft Follow-up
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--slate-700)', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                    "{selectedCampaign.copy}"
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button className="btn btn-primary" style={{ width: '100%', height: 52, borderRadius: 12, gap: 10 }}>
                    <Mail size={18} /> Send Follow-up Email
                  </button>
                  <button className="btn btn-ghost" style={{ width: '100%', height: 52, borderRadius: 12, gap: 10 }}>
                    <FileText size={18} /> Draft Impact Report
                  </button>
                  <button className="btn btn-ghost" style={{ width: '100%', height: 52, borderRadius: 12, gap: 10 }}>
                    <Calendar size={18} /> Schedule Check-in
                  </button>
                  <button className="btn btn-ghost" style={{ width: '100%', height: 52, borderRadius: 12, gap: 10 }}>
                    <Zap size={18} /> Auto-Reply Templates
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

export default CampaignEngine;

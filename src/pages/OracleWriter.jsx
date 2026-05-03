import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { 
  Send, 
  Sparkles, 
  Type, 
  MessageSquare, 
  CheckCircle, 
  Save, 
  Zap, 
  Loader2, 
  ChevronRight, 
  FileText, 
  Download, 
  Rocket, 
  Clock, 
  Target,
  Edit3,
  X,
  Plus
} from 'lucide-react';
import { askGemini } from '../utils/ai';

const sections = [
  { id: 'summary', title: 'Executive Summary', status: 'completed' },
  { id: 'needs', title: 'Needs Statement', status: 'completed' },
  { id: 'project', title: 'Project Description', status: 'active' },
  { id: 'budget', title: 'Budget Justification', status: 'pending' },
  { id: 'evaluation', title: 'Evaluation Plan', status: 'pending' },
  { id: 'sustainability', title: 'Sustainability', status: 'pending' },
];

const rubricItems = [
  { text: 'Demonstrates clear measurable outcomes', score: 95 },
  { text: 'Directly addresses environmental justice', score: 92 },
  { text: 'Scalability of the education model', score: 88 },
  { text: 'Cost-effectiveness of hardware deployment', score: 75 },
];

const OracleWriter = () => {
  const [activeSection, setActiveSection] = useState('project');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [grantTitle, setGrantTitle] = useState('Climate Resilient Urban Education (CRUE) Initiative');
  const [content, setContent] = useState(`Our "CRUE" initiative is designed to bridge the gap between climate science and urban K-12 education. By deploying mobile "Quantum Labs" across the district, we will provide students with real-time data monitoring tools. 

The project description focuses on three core pillars:
1. Real-time Environmental Sensing
2. Community Resilience Mapping
3. Teacher Professional Development in Climate Pedagogy

Initial pilot results from 2025 showed a 40% increase in student engagement when using localized data rather than abstract global models.`);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: "Hello! I've analyzed the Bezos Earth Fund rubric. Your 'Project Description' is strong, but we could strengthen the 'Scalability' section to reach that 98% match. Want me to draft a paragraph on national replication?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = async () => {
    if (!chatInput.trim() || isThinking) return;
    const msg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setIsThinking(true);

    try {
      const response = await askGemini(`
        Context: You are the Grant Genie Oracle helping with a climate education grant for Bezos Earth Fund.
        Title: ${grantTitle}
        Current Section: ${activeSection}
        User Request: ${msg}
        Current Text: ${content}
        
        Provide a concise, high-value expert response.
      `);
      setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'ai', text: "I hit a snag. Please try again." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <AppLayout title="Oracle Writer">
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', gap: 0, overflow: 'hidden' }}>
        
        {/* Top bar: Grant Info */}
        <div style={{ 
          background: 'white', 
          borderBottom: '1px solid var(--slate-200)', 
          padding: '16px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              {isEditingTitle ? (
                <input 
                  autoFocus
                  value={grantTitle}
                  onChange={(e) => setGrantTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  style={{ fontSize: 20, fontWeight: 800, color: 'var(--slate-900)', border: 'none', background: 'var(--slate-100)', padding: '4px 8px', borderRadius: 4, width: 400 }}
                />
              ) : (
                <h1 
                  style={{ fontSize: 20, fontWeight: 800, color: 'var(--slate-900)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  onClick={() => setIsEditingTitle(true)}
                >
                  {grantTitle} <Edit3 size={16} style={{ color: 'var(--slate-300)' }} />
                </h1>
              )}
              <div style={{ fontSize: 13, color: 'var(--slate-500)', marginTop: 2 }}>Funder: <strong style={{ color: 'var(--slate-800)' }}>Bezos Earth Fund</strong> · $1,000,000</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 32 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 4 }}>Match Score</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--teal)' }}>94%</div>
                <div style={{ width: 60, height: 6, background: 'var(--slate-100)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: '94%', height: '100%', background: 'var(--teal)' }}></div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', borderLeft: '1px solid var(--slate-100)', paddingLeft: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 4 }}>Deadline</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--rose)', fontWeight: 700, fontSize: 20 }}>
                <Clock size={18} /> 12d 4h
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Left Panel: Outline */}
          <aside style={{ width: 280, borderRight: '1px solid var(--slate-200)', background: 'var(--white)', overflowY: 'auto', padding: '24px 0' }}>
            <div style={{ padding: '0 24px 16px', fontSize: 12, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proposal Outline</div>
            {sections.map(s => (
              <button 
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  padding: '12px 24px', 
                  border: 'none', 
                  background: activeSection === s.id ? 'var(--teal-xlight)' : 'transparent',
                  color: activeSection === s.id ? 'var(--teal-dark)' : 'var(--slate-600)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  borderLeft: `4px solid ${activeSection === s.id ? 'var(--teal)' : 'transparent'}`
                }}
              >
                {s.status === 'completed' ? (
                  <CheckCircle size={16} style={{ color: 'var(--emerald)' }} />
                ) : s.status === 'active' ? (
                  <Edit3 size={16} style={{ color: 'var(--teal)' }} />
                ) : (
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--slate-200)' }} />
                )}
                <span style={{ fontSize: 14, fontWeight: activeSection === s.id ? 700 : 500 }}>{s.title}</span>
              </button>
            ))}
            <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', border: 'none', background: 'transparent', color: 'var(--slate-400)', cursor: 'pointer', marginTop: 12 }}>
              <Plus size={16} /> <span style={{ fontSize: 14 }}>Add Section</span>
            </button>
          </aside>

          {/* Center Panel: Editor */}
          <main style={{ flex: 1, background: 'var(--slate-50)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: 40, flex: 1, overflowY: 'auto' }}>
              <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal)', textTransform: 'uppercase', marginBottom: 4 }}>Currently Editing</div>
                    <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--slate-900)' }}>{sections.find(s => s.id === activeSection)?.title}</h2>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Loader2 size={14} className="animate-spin" /> Saving changes...
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ 
                      width: '100%', 
                      minHeight: 500, 
                      padding: 40, 
                      borderRadius: 20, 
                      border: '1px solid var(--slate-200)', 
                      background: 'white', 
                      fontSize: 18, 
                      lineHeight: 1.8, 
                      color: 'var(--slate-800)',
                      fontFamily: 'Georgia, serif',
                      outline: 'none',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                  />
                  
                  {/* Floating AI Suggestion */}
                  <div style={{ position: 'absolute', right: -320, top: 40, width: 280 }} className="desktop-only">
                    <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--teal-light)', padding: 20, boxShadow: 'var(--shadow-xl)', position: 'relative' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--teal)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', marginBottom: 12 }}>
                        <Sparkles size={14} /> AI Suggestions
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <button className="suggestion-btn">Make it more compelling</button>
                        <button className="suggestion-btn">Quantify these claims</button>
                        <button className="suggestion-btn">Align to Bezos Rubric</button>
                        <style>{`
                          .suggestion-btn { 
                            background: var(--slate-50); border: 1px solid var(--slate-200); padding: 10px 12px; border-radius: 8px; text-align: left; font-size: 13; color: var(--slate-700); cursor: pointer; transition: all 0.2s;
                          }
                          .suggestion-btn:hover {
                            background: var(--teal-xlight); border-color: var(--teal); color: var(--teal-dark);
                          }
                        `}</style>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div style={{ background: 'white', borderTop: '1px solid var(--slate-200)', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-ghost" style={{ gap: 8 }}><Save size={16} /> Save Draft</button>
                <button className="btn btn-ghost" style={{ gap: 8 }}><Download size={16} /> Export PDF</button>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-secondary" style={{ gap: 8 }}><Zap size={16} /> Refine with AI</button>
                <button className="btn btn-primary" style={{ gap: 8, padding: '12px 32px' }}><Rocket size={16} /> Generate Full Draft</button>
                <button className="btn" style={{ background: 'var(--slate-900)', color: 'white', padding: '12px 32px', gap: 8 }}>Submit to Funder</button>
              </div>
            </div>
          </main>

          {/* Right Panel: Rubric */}
          <aside style={{ width: 340, borderLeft: '1px solid var(--slate-200)', background: 'var(--white)', overflowY: 'auto', padding: 24 }} className="desktop-only">
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Target size={18} style={{ color: 'var(--teal)' }} /> Grant Rubric Analysis
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {rubricItems.map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 8 }}>
                    <span>{item.text}</span>
                    <span style={{ color: item.score > 90 ? 'var(--emerald)' : item.score > 80 ? 'var(--teal)' : 'var(--gold)' }}>{item.score}%</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--slate-100)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${item.score}%`, height: '100%', background: item.score > 90 ? 'var(--emerald)' : item.score > 80 ? 'var(--teal)' : 'var(--gold)' }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40, padding: 20, borderRadius: 16, background: 'rgba(13,148,136,0.03)', border: '1px solid rgba(13,148,136,0.1)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal-dark)', marginBottom: 12 }}>Oracle Strategy Note</h4>
              <p style={{ fontSize: 13, color: 'var(--slate-600)', lineHeight: 1.6, margin: 0 }}>
                Bezos Earth Fund values <strong>hardware-software integration</strong>. Ensure the budget justification explicitly breaks down the mobile lab manufacturing costs vs. curriculum design.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Genie Chat Toggle */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          style={{ position: 'fixed', bottom: 32, right: 32, width: 64, height: 64, borderRadius: '50%', background: 'var(--teal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(13,148,136,0.3)', border: 'none', cursor: 'pointer', zIndex: 100 }}
        >
          <Sparkles size={24} />
        </button>
      )}

      {/* Consult the Genie Chat Window */}
      {isChatOpen && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, width: 400, height: 500, background: 'white', borderRadius: 24, boxShadow: 'var(--shadow-xl)', border: '1px solid var(--slate-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1000 }} className="animate-fade-in">
          <div style={{ background: 'var(--slate-900)', color: 'white', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Consult the Genie</div>
                <div style={{ fontSize: 11, color: 'var(--emerald)', fontWeight: 600 }}>Oracle Online</div>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.6 }}><X size={20} /></button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                {msg.role === 'ai' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--teal-xlight)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={14} />
                  </div>
                )}
                <div style={{ 
                  background: msg.role === 'ai' ? 'var(--slate-100)' : 'var(--teal)', 
                  color: msg.role === 'ai' ? 'var(--slate-800)' : 'white',
                  padding: '12px 16px',
                  borderRadius: msg.role === 'ai' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                  fontSize: 13,
                  lineHeight: 1.5,
                  maxWidth: '85%'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Loader2 size={14} className="animate-spin color-slate-400" />
                <span style={{ fontSize: 12, color: 'var(--slate-400)' }}>Genie is thinking...</span>
              </div>
            )}
          </div>

          <div style={{ padding: 20, borderTop: '1px solid var(--slate-200)', display: 'flex', gap: 12 }}>
            <input 
              type="text" 
              placeholder="How can I strengthen my impact statement?"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              style={{ flex: 1 }}
            />
            <button 
              className="btn btn-primary" 
              style={{ padding: '8px 12px' }} 
              onClick={sendMessage}
              disabled={isThinking || !chatInput.trim()}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default OracleWriter;

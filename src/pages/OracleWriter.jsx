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
        You are the Grant Genie Oracle, an AI grant writing expert.
        Drafting Context: ${grantTitle}
        Section: ${activeSection}
        User Prompt: ${msg}
        Current Content: ${content}
        Provide expert advice and high-fidelity drafting suggestions.
      `);
      setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'ai', text: "The Oracle is experiencing a surge in requests. Please try again." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <AppLayout title="Oracle Writer">
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: 0, margin: '-32px', overflow: 'hidden' }}>
        
        {/* Top Info Bar */}
        <div style={{ background: 'white', padding: '16px 32px', borderBottom: '1px solid var(--slate-200)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 10, background: 'var(--slate-50)', borderRadius: 12 }}>
              <FileText size={20} color="var(--teal)" />
            </div>
            <div>
              {isEditingTitle ? (
                <input 
                  autoFocus 
                  value={grantTitle} 
                  onChange={(e) => setGrantTitle(e.target.value)} 
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  style={{ fontSize: 16, fontWeight: 800, border: 'none', padding: 0, width: '100%', maxWidth: 400 }}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, cursor: 'pointer' }} onClick={() => setIsEditingTitle(true)}>{grantTitle}</h2>
                  <Edit3 size={14} color="var(--slate-400)" />
                </div>
              )}
              <p style={{ fontSize: 12, color: 'var(--slate-500)', fontWeight: 600 }}>Funder: <span style={{ color: 'var(--teal)' }}>Bezos Earth Fund</span></p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ textAlign: 'right' }} className="desktop-only">
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 2 }}>Match Score</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--emerald)' }}>94%</span>
                <div style={{ width: 60, height: 4, background: 'var(--slate-100)', borderRadius: 999 }}>
                  <div style={{ width: '94%', height: '100%', background: 'var(--emerald)' }}></div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }} className="desktop-only">
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 2 }}>Deadline</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--rose)' }}>12 Days Left</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: 'row' }} className="responsive-editor-layout">
          <style>{`
            @media (max-width: 1024px) {
              .responsive-editor-layout { flex-direction: column !important; overflow-y: auto !important; }
              .editor-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid var(--slate-200) !important; flex-shrink: 0 !important; }
              .editor-main { overflow-y: visible !important; min-height: 500px !important; }
              .editor-right { width: 100% !important; border-left: none !important; border-top: 1px solid var(--slate-200) !important; }
            }
          `}</style>
          
          {/* Left Sidebar: Outline */}
          <aside className="editor-sidebar" style={{ width: 280, background: 'var(--slate-50)', borderRight: '1px solid var(--slate-200)', overflowY: 'auto', padding: '24px 16px' }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, paddingLeft: 8 }}>Proposal Outline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {sections.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => setActiveSection(s.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12, 
                    padding: '12px 16px', 
                    borderRadius: 12, 
                    border: 'none',
                    background: activeSection === s.id ? 'white' : 'transparent',
                    color: activeSection === s.id ? 'var(--slate-900)' : 'var(--slate-500)',
                    fontWeight: activeSection === s.id ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: activeSection === s.id ? 'var(--shadow-sm)' : 'none',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid', borderColor: s.status === 'completed' ? 'var(--emerald)' : s.status === 'active' ? 'var(--teal)' : 'var(--slate-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {s.status === 'completed' && <CheckCircle size={10} color="var(--emerald)" fill="var(--emerald)" />}
                  </div>
                  <span style={{ fontSize: 13 }}>{s.title}</span>
                </button>
              ))}
            </div>
            
            <div style={{ marginTop: 40, padding: 20, background: 'var(--gradient-teal)', borderRadius: 16, color: 'white' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
                <Zap size={16} /> Agent Active
              </div>
              <p style={{ fontSize: 12, opacity: 0.9, lineHeight: 1.5, margin: 0 }}>Oracle is live-scanning the funder rubric to optimize your draft in real-time.</p>
            </div>
          </aside>

          {/* Main Content: Editor */}
          <main className="editor-main" style={{ flex: 1, overflowY: 'auto', background: 'white', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '40px 60px', flex: 1, maxWidth: 900, margin: '0 auto', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h1 style={{ fontSize: 32, fontWeight: 800 }}>{sections.find(s => s.id === activeSection).title}</h1>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="badge badge-teal" style={{ background: 'var(--slate-100)', color: 'var(--slate-500)' }}><Clock size={12} /> Auto-saved</button>
                </div>
              </div>
              
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ 
                  width: '100%', 
                  height: 'calc(100% - 100px)', 
                  border: 'none', 
                  resize: 'none', 
                  fontSize: 16, 
                  lineHeight: 1.8, 
                  color: 'var(--slate-700)',
                  background: 'transparent',
                  padding: 0
                }}
                placeholder="Start writing your grant section here..."
              />
            </div>
            
            {/* Bottom Controls */}
            <div style={{ background: 'var(--slate-50)', padding: '16px 32px', borderTop: '1px solid var(--slate-200)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" style={{ gap: 8, padding: '10px 20px' }}><Zap size={16} /> Refine with AI</button>
                <button className="btn btn-secondary" style={{ gap: 8, padding: '10px 20px' }}><Sparkles size={16} /> Make it Compelling</button>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-ghost" style={{ gap: 8, padding: '10px 20px' }}><Download size={16} /> Export PDF</button>
                <button className="btn btn-primary" style={{ gap: 8, padding: '10px 24px', background: 'var(--slate-900)', border: 'none' }}><Rocket size={16} /> Submit to Funder</button>
              </div>
            </div>
          </main>

          {/* Right Sidebar: Analysis */}
          <aside className="editor-right" style={{ width: 320, background: 'var(--slate-50)', borderLeft: '1px solid var(--slate-200)', overflowY: 'auto', padding: '24px' }}>
            <div style={{ marginBottom: 40 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Funder Rubric Analysis</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {rubricItems.map((item, i) => (
                  <div key={i} style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid var(--slate-200)' }}>
                    <p style={{ fontSize: 13, color: 'var(--slate-700)', fontWeight: 600, marginBottom: 12, lineHeight: 1.4 }}>{item.text}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--slate-100)', borderRadius: 999 }}>
                        <div style={{ width: `${item.score}%`, height: '100%', background: item.score > 80 ? 'var(--emerald)' : 'var(--gold)', borderRadius: 999 }}></div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: item.score > 80 ? 'var(--emerald)' : 'var(--gold)' }}>{item.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'white', padding: 20, borderRadius: 16, border: '1px dotted var(--teal)' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--teal)', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
                <MessageSquare size={16} /> Consult the Genie
              </div>
              <p style={{ fontSize: 13, color: 'var(--slate-500)', lineHeight: 1.6, marginBottom: 16 }}>
                "Strengthen the Budget Justification by adding a 15% contingency for hardware maintenance in year 2."
              </p>
              <button className="btn btn-secondary" style={{ width: '100%', fontSize: 12, padding: '8px' }} onClick={() => setIsChatOpen(true)}>Ask Genie to Apply</button>
            </div>
          </aside>
        </div>

        {/* Chat Window Overlay (Mobile-optimized) */}
        {isChatOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setIsChatOpen(false)} />
            <div style={{ position: 'relative', width: '100%', maxWidth: 440, background: 'white', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 50px rgba(0,0,0,0.1)' }}>
              <div style={{ background: 'var(--slate-900)', color: 'white', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Sparkles size={20} color="var(--teal)" />
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>Consult the Genie</h3>
                </div>
                <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{ alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                    <div style={{ 
                      background: msg.role === 'ai' ? 'var(--slate-100)' : 'var(--teal)', 
                      color: msg.role === 'ai' ? 'var(--slate-800)' : 'white',
                      padding: '12px 16px',
                      borderRadius: msg.role === 'ai' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                      fontSize: 14,
                      lineHeight: 1.5
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isThinking && <div style={{ fontSize: 12, color: 'var(--slate-400)' }}>Oracle is typing...</div>}
              </div>

              <div style={{ padding: 24, borderTop: '1px solid var(--slate-200)', display: 'flex', gap: 12 }}>
                <input 
                  type="text" 
                  placeholder="Ask for advice..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  style={{ flex: 1, height: 48, borderRadius: 12 }}
                />
                <button className="btn btn-primary" onClick={sendMessage} disabled={isThinking}><Send size={18} /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default OracleWriter;

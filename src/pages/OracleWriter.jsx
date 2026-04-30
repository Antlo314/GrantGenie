import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { Send, Sparkles, Type, MessageSquare, CheckCircle, Save, Zap, Loader2 } from 'lucide-react';
import { askGemini } from '../utils/ai';

const OracleWriter = () => {
  const [mode, setMode] = useState('editor');
  const [draft, setDraft] = useState(`Our organization stands at the vanguard of educational equity, recognizing that access to technology is not merely a convenience, but a fundamental right in the 21st century.\n\nDrawing upon our successful 2025 Impact Report, which demonstrated a 40% increase in digital literacy among our target demographic, we are positioned to scale our "Tech-Forward Youth" initiative across 14 Title I school districts.\n\nWith the support of the Lumina Foundation Catalyst Grant, we will deploy 500 new interactive learning terminals, train 120 educators in digital pedagogy, and extend our proven curriculum to reach an additional 8,500 students over the next program year.`);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: "I've loaded the Lumina Foundation rubric and your 2025 Impact Report. I can help you draft, refine tone, or strengthen specific sections. Where would you like to start?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input;
    setInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const prompt = `
        You are the Grant Genie Oracle, an expert grant writer.
        Current Grant: Lumina Catalyst Grant ($150,000)
        Current Draft:
        "${draft}"
        
        User Request: "${userMessage}"
        
        Please provide a helpful, expert response. If the user asks to rewrite or improve, provide the revised text and explain why it's better.
        Keep your tone professional and encouraging.
      `;
      
      const response = await askGemini(prompt);
      setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error: " + error.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAudit = async () => {
    setLoading(true);
    setMode('chat');
    try {
      const response = await askGemini(`
        Perform a professional "AI Audit" on the following grant draft for the Lumina Catalyst Grant:
        "${draft}"
        
        Identify 3 strengths and 3 areas for improvement based on standard nonprofit funding rubrics.
      `);
      setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      alert("Audit failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Oracle Writer">
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, height: 'calc(100vh - 128px)' }}>
        
        {/* Left: Grant Context */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
          {/* Grant Info */}
          <div className="card">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Current Grant</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 4 }}>Lumina Catalyst Grant</div>
            <div style={{ fontSize: 13, color: 'var(--slate-500)', marginBottom: 16 }}>Lumina Foundation · $150,000</div>
            <div className="progress-bar" style={{ marginBottom: 6 }}>
              <div className="progress-fill" style={{ width: '65%' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--slate-500)' }}>
              <span>Completion</span><span style={{ fontWeight: 600, color: 'var(--teal)' }}>65%</span>
            </div>
          </div>

          {/* Vault */}
          <div className="card">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Vault Documents</div>
            {['2025 Impact Report', 'Board Member Biographies', 'IRS 501c3 Letter', '2024 Annual Budget'].map((doc, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--slate-100)' : 'none' }}>
                <CheckCircle size={14} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--slate-700)' }}>{doc}</span>
              </div>
            ))}
          </div>

          {/* Strategy */}
          <div className="card">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Oracle Strategy</div>
            <p style={{ fontSize: 13, color: 'var(--slate-600)', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
              "Lead with the 40% digital literacy improvement metric. Lumina prioritizes scalability evidence — cite the Title I district data."
            </p>
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }}>
            <Save size={15} /> Save Draft
          </button>
        </div>

        {/* Right: Editor / Chat */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--slate-200)', background: 'var(--slate-50)' }}>
            <div style={{ display: 'flex', background: 'var(--slate-200)', borderRadius: 8, padding: 3, gap: 2 }}>
              <button
                onClick={() => setMode('editor')}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, background: mode === 'editor' ? 'white' : 'transparent', color: mode === 'editor' ? 'var(--slate-900)' : 'var(--slate-500)', border: 'none', cursor: 'pointer', boxShadow: mode === 'editor' ? 'var(--shadow)' : 'none', transition: 'all 0.15s' }}
              >
                <Type size={14} /> Editor
              </button>
              <button
                onClick={() => setMode('chat')}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, background: mode === 'chat' ? 'white' : 'transparent', color: mode === 'chat' ? 'var(--slate-900)' : 'var(--slate-500)', border: 'none', cursor: 'pointer', boxShadow: mode === 'chat' ? 'var(--shadow)' : 'none', transition: 'all 0.15s' }}
              >
                <MessageSquare size={14} /> Chat with Oracle
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="badge badge-teal" style={{ cursor: 'pointer' }}>Tone: Persuasive</button>
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={handleAudit} disabled={loading}>
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />} AI Audit
              </button>
            </div>
          </div>

          {mode === 'editor' ? (
            <textarea
              style={{
                flex: 1,
                padding: '28px 32px',
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontSize: 16,
                lineHeight: 1.9,
                color: 'var(--slate-800)',
                fontFamily: 'Georgia, serif',
                background: 'white',
              }}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }} className="animate-fade-in">
                    {msg.role === 'ai' && (
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal) 0%, #0f766e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Sparkles size={15} style={{ color: 'white' }} />
                      </div>
                    )}
                    <div className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Loader2 size={15} className="animate-spin text-slate-400" />
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--slate-400)' }}>Oracle is thinking...</span>
                  </div>
                )}
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--slate-200)', display: 'flex', gap: 12 }}>
                <input
                  type="text"
                  placeholder="Ask the Oracle to rewrite, strengthen, or adjust tone..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  style={{ flex: 1 }}
                  disabled={loading}
                />
                <button className="btn btn-primary" onClick={sendMessage} style={{ padding: '10px 16px' }} disabled={loading || !input.trim()}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default OracleWriter;


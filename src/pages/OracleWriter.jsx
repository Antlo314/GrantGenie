import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Sparkles, Send, Save, BookOpen, MessageSquare, Maximize2 } from 'lucide-react';
import './OracleWriter.css';

const OracleWriter = () => {
  const [activeMode, setActiveMode] = useState('editor'); // 'editor' or 'chat'
  
  return (
    <div className="page-container">
      <Navbar title="Oracle Writer" />
      
      <div className="page-content writer-layout animate-fade-in">
        
        {/* Left Side: Context & Chat toggle */}
        <div className="writer-sidebar">
          <GlassCard className="context-panel h-full flex-col">
            <div className="panel-header flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="text-gold" size={20} />
                <h4 className="font-display">Grant Context</h4>
              </div>
            </div>
            
            <div className="context-body flex-1 overflow-y-auto">
              <div className="context-section mb-6">
                <h5 className="text-muted text-uppercase text-xs tracking-widest mb-2">Target Funder</h5>
                <p className="text-primary font-display text-lg">Lumina Foundation Catalyst Fund</p>
              </div>
              
              <div className="context-section mb-6">
                <h5 className="text-muted text-uppercase text-xs tracking-widest mb-2">Prompt Strategy</h5>
                <p className="text-secondary text-sm italic border-l-2 border-gold pl-3">
                  "Focus heavily on the quantitative metrics from the 2025 Impact Report. Emphasize scalability."
                </p>
              </div>

              <div className="context-section">
                <h5 className="text-muted text-uppercase text-xs tracking-widest mb-2">Data Vault Sources</h5>
                <ul className="vault-list">
                  <li><CheckIcon /> 2025 Impact Report</li>
                  <li><CheckIcon /> Board Member Biographies</li>
                  <li><CheckIcon /> Q3 Financial Audit</li>
                </ul>
              </div>
            </div>

            <div className="context-footer mt-auto pt-4 border-t border-white/10">
              <div className="mode-toggle">
                <button 
                  className={`toggle-btn ${activeMode === 'editor' ? 'active' : ''}`}
                  onClick={() => setActiveMode('editor')}
                >
                  <Sparkles size={16} /> Draft Editor
                </button>
                <button 
                  className={`toggle-btn ${activeMode === 'chat' ? 'active' : ''}`}
                  onClick={() => setActiveMode('chat')}
                >
                  <MessageSquare size={16} /> Genie Chat
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: The Editor or Chat */}
        <div className="writer-main">
          {activeMode === 'editor' ? (
            <GlassCard className="editor-panel h-full flex-col">
              <div className="editor-toolbar flex justify-between p-4 border-b border-white/10">
                <div className="flex gap-2">
                  <button className="toolbar-btn">Format</button>
                  <button className="toolbar-btn text-gold">Tone: Persuasive</button>
                  <button className="toolbar-btn">Length: ~500 words</button>
                </div>
                <div className="flex gap-3">
                  <button className="icon-btn-small"><Maximize2 size={16}/></button>
                  <button className="btn btn-outline py-1 px-4 text-sm"><Save size={14} className="mr-2"/> Save</button>
                  <button className="btn btn-primary py-1 px-4 text-sm"><Send size={14} className="mr-2"/> Audit</button>
                </div>
              </div>
              
              <div className="editor-workspace flex-1 p-6">
                <textarea 
                  className="ai-textarea w-full h-full bg-transparent text-lg resize-none outline-none text-primary"
                  defaultValue={`Our organization stands at the vanguard of educational equity, recognizing that access to technology is not merely a convenience, but a fundamental right in the 21st century.

Drawing upon our successful 2025 Impact Report, which demonstrated a 40% increase in digital literacy among our target demographic, we are positioned to scale our "Tech-Forward Youth" initiative.

The Lumina Foundation Catalyst Fund will enable us to deploy 500 new interactive learning terminals to underserved districts. By integrating AI-driven personalized tutoring software, we project a minimum 25% improvement in standardized test scores over the next 24 months. 

Our board, comprising leading technologists and educators, guarantees the rigorous oversight and innovative execution required to transform this vision into measurable reality.`}
                />
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="chat-panel h-full flex-col">
              <div className="chat-header p-4 border-b border-white/10">
                <h4 className="font-display text-gold flex items-center gap-2">
                  <Sparkles size={18} /> Genie Conversational Oracle
                </h4>
              </div>
              
              <div className="chat-history flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                <div className="chat-message ai-message">
                  <div className="message-avatar"><Sparkles size={14} className="text-gold" /></div>
                  <div className="message-bubble">
                    <p>I've loaded the Lumina Foundation rubric and your 2025 Impact Report. How would you like to approach the narrative for the new terminals?</p>
                  </div>
                </div>
                
                <div className="chat-message user-message">
                  <div className="message-bubble">
                    <p>Let's make sure we emphasize that the 500 terminals are specifically going to Title I schools, and link that to our previous success with digital literacy.</p>
                  </div>
                  <div className="message-avatar bg-white/10 text-white font-display text-xs">DIR</div>
                </div>

                <div className="chat-message ai-message">
                  <div className="message-avatar"><Sparkles size={14} className="text-gold" /></div>
                  <div className="message-bubble">
                    <p>Excellent strategy. I will draft the section highlighting the 40% digital literacy increase from the Impact Report and directly correlate it to the proposed Title I deployment. Would you like me to generate the draft now?</p>
                    <button className="btn btn-outline text-xs mt-3 py-1">Generate Draft</button>
                  </div>
                </div>
              </div>
              
              <div className="chat-input-area p-4 border-t border-white/10">
                <div className="chat-input-box flex items-center bg-black/40 border border-white/10 rounded-full p-1 pl-4">
                  <input type="text" placeholder="Instruct the Genie..." className="flex-1 bg-transparent border-none outline-none text-primary" />
                  <button className="btn btn-primary rounded-full w-10 h-10 p-0 flex items-center justify-center"><Send size={16} /></button>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-emerald)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default OracleWriter;

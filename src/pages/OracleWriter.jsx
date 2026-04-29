import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import gsap from 'gsap';
import { 
  Send, 
  Sparkles, 
  Bold, 
  Italic, 
  Type, 
  Settings2, 
  History, 
  Eye,
  CheckCircle,
  Clock,
  MessageSquare,
  Maximize2,
  Save
} from 'lucide-react';
import './OracleWriter.css';

const OracleWriter = () => {
  const [activeMode, setActiveMode] = useState('editor'); // 'editor' or 'chat'
  const sidebarRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(sidebarRef.current, 
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: "expo.out" }
    );
    tl.fromTo(mainRef.current, 
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: "expo.out" },
      "-=1"
    );
  }, []);

  return (
    <div className="page-container">
      <Navbar title="Oracle Strategy Engine" />
      
      <div className="page-content animate-fade-in">
        <div className="writer-layout-premium">
          
          {/* Strategy Sidebar */}
          <div ref={sidebarRef} className="writer-sidebar-premium">
            <GlassCard className="strategy-panel-organic h-full flex flex-col">
              <div className="panel-header mb-8">
                <h3 className="font-display text-xl flex items-center gap-2 text-gold">
                  <Settings2 size={20} /> Grant Context
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-8 pr-2">
                <div className="context-item">
                  <h5 className="text-[10px] uppercase text-muted tracking-widest mb-3">Target Funder</h5>
                  <p className="text-primary font-display text-lg glow-text">Lumina Foundation Catalyst Fund</p>
                </div>
                
                <div className="context-item">
                  <h5 className="text-[10px] uppercase text-muted tracking-widest mb-3">Prompt Strategy</h5>
                  <p className="text-secondary text-sm italic border-l-2 border-gold/30 pl-4 py-1 leading-relaxed">
                    "Focus heavily on the quantitative metrics from the 2025 Impact Report. Emphasize scalability."
                  </p>
                </div>

                <div className="context-item">
                  <h5 className="text-[10px] uppercase text-muted tracking-widest mb-3">Data Vault Sources</h5>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 text-xs text-secondary">
                      <CheckCircle size={12} className="text-emerald" /> 2025 Impact Report
                    </div>
                    <div className="flex items-center gap-2 text-xs text-secondary">
                      <CheckCircle size={12} className="text-emerald" /> Board Member Biographies
                    </div>
                    <div className="flex items-center gap-2 text-xs text-secondary">
                      <CheckCircle size={12} className="text-emerald" /> Q3 Financial Audit
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="writer-mode-selector p-1 bg-black/40 rounded-full flex">
                  <button 
                    className={`mode-tab flex-1 flex items-center justify-center gap-2 py-2 text-xs rounded-full transition-all ${activeMode === 'editor' ? 'bg-gold text-black font-bold' : 'text-muted hover:text-white'}`}
                    onClick={() => setActiveMode('editor')}
                  >
                    <Type size={14} /> Editor
                  </button>
                  <button 
                    className={`mode-tab flex-1 flex items-center justify-center gap-2 py-2 text-xs rounded-full transition-all ${activeMode === 'chat' ? 'bg-gold text-black font-bold' : 'text-muted hover:text-white'}`}
                    onClick={() => setActiveMode('chat')}
                  >
                    <MessageSquare size={14} /> Chat
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Main Content Area */}
          <div ref={mainRef} className="writer-main-premium">
            <GlassCard className="editor-panel-organic h-full flex flex-col p-0 overflow-hidden">
              {activeMode === 'editor' ? (
                <>
                  <div className="toolbar-organic p-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button className="btn btn-outline py-1.5 px-4 text-[10px]">Format</button>
                      <button className="btn btn-outline py-1.5 px-4 text-[10px] text-gold border-gold/30">Tone: Persuasive</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="icon-btn hover:text-gold transition-colors"><Maximize2 size={18} /></button>
                      <button className="btn btn-outline py-1.5 px-4 text-[10px]"><Save size={14} /> Save</button>
                      <button className="btn btn-primary py-1.5 px-6 text-[10px]"><Send size={14} /> Audit</button>
                    </div>
                  </div>
                  <div className="editor-content-organic flex-1 p-8">
                    <textarea 
                      className="w-full h-full bg-transparent border-none outline-none text-lg leading-relaxed text-primary resize-none placeholder-white/10 font-sans"
                      defaultValue={`Our organization stands at the vanguard of educational equity, recognizing that access to technology is not merely a convenience, but a fundamental right in the 21st century.

Drawing upon our successful 2025 Impact Report, which demonstrated a 40% increase in digital literacy among our target demographic, we are positioned to scale our "Tech-Forward Youth" initiative.

The Lumina Foundation Catalyst Fund will enable us to deploy 500 new interactive learning terminals to underserved districts. By integrating AI-driven personalized tutoring software, we project a minimum 25% improvement in standardized test scores over the next 24 months.`}
                    />
                  </div>
                </>
              ) : (
                <div className="chat-container-organic h-full flex flex-col">
                  <div className="chat-header-premium p-6 border-b border-white/5">
                    <h4 className="font-display text-gold flex items-center gap-3">
                      <Sparkles size={20} className="animate-pulse" /> Genie Conversational Oracle
                    </h4>
                  </div>
                  
                  <div className="chat-scroll flex-1 p-6 overflow-y-auto space-y-6">
                    <div className="chat-msg ai">
                      <div className="msg-avatar"><Sparkles size={16} className="text-gold" /></div>
                      <div className="msg-content glass-panel p-4">
                        <p className="text-sm text-secondary">I've loaded the Lumina Foundation rubric and your 2025 Impact Report. How would you like to approach the narrative for the new terminals?</p>
                      </div>
                    </div>
                    
                    <div className="chat-msg user self-end flex flex-row-reverse">
                      <div className="msg-avatar bg-white/10 text-white flex items-center justify-center text-[10px] font-bold">DIR</div>
                      <div className="msg-content glass-panel p-4 mr-3 bg-white/5">
                        <p className="text-sm text-primary">Let's make sure we emphasize that the 500 terminals are specifically going to Title I schools.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="chat-input-premium p-6 border-t border-white/5">
                    <div className="input-pill flex items-center bg-black/40 border border-white/10 rounded-full p-2 pl-6">
                      <input type="text" placeholder="Instruct the Genie..." className="flex-1 bg-transparent border-none outline-none text-sm" />
                      <button className="btn btn-primary rounded-full w-10 h-10 p-0 ml-2"><Send size={16} /></button>
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OracleWriter;

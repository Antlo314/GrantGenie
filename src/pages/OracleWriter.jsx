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
            <GlassCard className="h-full flex flex-col">
              <div className="panel-header mb-10">
                <div className="text-xs-caps text-gold mb-2">Strategy Lab</div>
                <h3 className="text-2xl flex items-center gap-2">
                  <Settings2 size={24} /> Grant Context
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-10 pr-2">
                <div className="context-item">
                  <span className="text-xs-caps block mb-3">Target Funder</span>
                  <p className="text-2xl tracking-tight text-white">Lumina Foundation</p>
                </div>
                
                <div className="context-item">
                  <span className="text-xs-caps block mb-3">Prompt Strategy</span>
                  <p className="text-secondary italic border-l-2 border-gold/30 pl-5 py-1 leading-relaxed">
                    "Focus heavily on the quantitative metrics from the 2025 Impact Report. Emphasize scalability."
                  </p>
                </div>

                <div className="context-item">
                  <span className="text-xs-caps block mb-3">Compliance Vault</span>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-3 text-sm text-secondary">
                      <CheckCircle size={14} className="text-emerald" /> 2025 Impact Report
                    </div>
                    <div className="flex items-center gap-3 text-sm text-secondary">
                      <CheckCircle size={14} className="text-emerald" /> Board Member Biographies
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5">
                <div className="p-1 bg-black/60 rounded-full flex border border-white/5">
                  <button 
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-full transition-all ${activeMode === 'editor' ? 'bg-gold text-black' : 'text-muted hover:text-white'}`}
                    onClick={() => setActiveMode('editor')}
                  >
                    <Type size={14} /> Editor
                  </button>
                  <button 
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-full transition-all ${activeMode === 'chat' ? 'bg-gold text-black' : 'text-muted hover:text-white'}`}
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
            <GlassCard className="h-full flex flex-col p-0 overflow-hidden">
              {activeMode === 'editor' ? (
                <>
                  <div className="toolbar-organic p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                    <div className="flex gap-4">
                      <button className="btn btn-outline py-2 px-6">Format</button>
                      <button className="btn btn-outline py-2 px-6 text-gold">Tone: Persuasive</button>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="icon-btn-premium"><Maximize2 size={20} /></button>
                      <button className="btn btn-outline py-2 px-6"><Save size={16} /> Save</button>
                      <button className="btn btn-primary py-2 px-8"><Send size={16} /> Audit</button>
                    </div>
                  </div>
                  <div className="editor-content-organic flex-1 p-10">
                    <textarea 
                      className="w-full h-full bg-transparent border-none outline-none text-xl leading-loose text-white resize-none placeholder-white/5 font-body"
                      defaultValue={`Our organization stands at the vanguard of educational equity, recognizing that access to technology is not merely a convenience, but a fundamental right in the 21st century.

Drawing upon our successful 2025 Impact Report, which demonstrated a 40% increase in digital literacy among our target demographic, we are positioned to scale our "Tech-Forward Youth" initiative.`}
                    />
                  </div>
                </>
              ) : (
                <div className="chat-container-organic h-full flex flex-col">
                  <div className="chat-header-premium p-8 border-b border-white/5 bg-black/20">
                    <h4 className="text-xl flex items-center gap-3">
                      <Sparkles size={24} className="text-gold animate-pulse" /> Genie Conversational Oracle
                    </h4>
                  </div>
                  
                  <div className="chat-scroll flex-1 p-8 overflow-y-auto space-y-8">
                    <div className="chat-msg ai max-w-[80%]">
                      <div className="msg-avatar border border-gold/20 bg-gold/5"><Sparkles size={16} className="text-gold" /></div>
                      <div className="msg-content p-6 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-secondary">I've loaded the Lumina Foundation rubric and your 2025 Impact Report. How would you like to approach the narrative for the new terminals?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="chat-input-premium p-8 border-t border-white/5">
                    <div className="input-pill flex items-center bg-black/60 border border-white/5 rounded-full p-2 pl-8">
                      <input type="text" placeholder="Instruct the Genie..." className="flex-1 bg-transparent border-none outline-none text-white" />
                      <button className="btn btn-primary rounded-full w-12 h-12 p-0 ml-4"><Send size={18} /></button>
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

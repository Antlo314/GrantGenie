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
    <div className="page-container relative overflow-hidden bg-white">
      <div className="bg-flux"></div>
      <Navbar title="Oracle Strategy Engine" />
      
      <div className="page-content animate-fade-in px-8 max-w-[1600px] mx-auto">
        <div className="writer-layout-premium flex flex-col lg:flex-row gap-10 pt-10 h-[calc(100vh-120px)]">
          
          {/* Strategy Sidebar */}
          <div ref={sidebarRef} className="writer-sidebar-premium w-full lg:w-96 shrink-0">
            <GlassCard className="h-full flex flex-col p-10">
              <div className="panel-header mb-12">
                <div className="text-xs-caps text-periwinkle mb-4">Strategy Lab</div>
                <h3 className="text-3xl flex items-center gap-4 tracking-tight">
                  <Settings2 size={28} className="text-periwinkle" /> Grant Context
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-12 pr-2">
                <div className="context-item">
                  <span className="text-xs-caps block mb-4">Target Funder</span>
                  <p className="text-2xl tracking-tight text-primary font-bold">Lumina Foundation</p>
                </div>
                
                <div className="context-item">
                  <span className="text-xs-caps block mb-4">Prompt Strategy</span>
                  <p className="text-lg text-secondary italic border-l-4 border-periwinkle/20 pl-6 py-2 leading-relaxed">
                    "Focus heavily on the quantitative metrics from the 2025 Impact Report. Emphasize scalability."
                  </p>
                </div>

                <div className="context-item">
                  <span className="text-xs-caps block mb-4">Compliance Vault</span>
                  <div className="space-y-4 mt-6">
                    <div className="flex items-center gap-4 text-secondary font-medium">
                      <CheckCircle size={18} className="text-emerald" /> 2025 Impact Report
                    </div>
                    <div className="flex items-center gap-4 text-secondary font-medium">
                      <CheckCircle size={18} className="text-emerald" /> Board Member Biographies
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-periwinkle/10">
                <div className="p-1.5 bg-periwinkle/5 rounded-full flex border border-periwinkle/10">
                  <button 
                    className={`flex-1 flex items-center justify-center gap-3 py-4 text-xs font-bold rounded-full transition-all ${activeMode === 'editor' ? 'bg-periwinkle text-white' : 'text-secondary hover:text-primary'}`}
                    onClick={() => setActiveMode('editor')}
                  >
                    <Type size={16} /> Editor
                  </button>
                  <button 
                    className={`flex-1 flex items-center justify-center gap-3 py-4 text-xs font-bold rounded-full transition-all ${activeMode === 'chat' ? 'bg-periwinkle text-white' : 'text-secondary hover:text-primary'}`}
                    onClick={() => setActiveMode('chat')}
                  >
                    <MessageSquare size={16} /> Chat
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Main Content Area */}
          <div ref={mainRef} className="writer-main-premium flex-1">
            <GlassCard className="h-full flex flex-col p-0 overflow-hidden bg-white">
              {activeMode === 'editor' ? (
                <>
                  <div className="toolbar-organic p-8 border-b border-periwinkle/10 flex items-center justify-between bg-periwinkle/5">
                    <div className="flex gap-6">
                      <button className="btn btn-outline py-3 px-8 text-xs">Format</button>
                      <button className="btn btn-outline py-3 px-8 text-xs font-bold">Tone: Persuasive</button>
                    </div>
                    <div className="flex items-center gap-6">
                      <button className="nav-icon-btn text-secondary"><Maximize2 size={24} /></button>
                      <button className="btn btn-outline py-3 px-8 text-xs"><Save size={18} className="mr-3" /> Save</button>
                      <button className="btn btn-primary py-3 px-10 text-xs"><Send size={18} className="mr-3" /> Audit</button>
                    </div>
                  </div>
                  <div className="editor-content-organic flex-1 p-12">
                    <textarea 
                      className="w-full h-full bg-transparent border-none outline-none text-2xl leading-loose text-primary resize-none placeholder-secondary/20 font-body"
                      defaultValue={`Our organization stands at the vanguard of educational equity, recognizing that access to technology is not merely a convenience, but a fundamental right in the 21st century.

Drawing upon our successful 2025 Impact Report, which demonstrated a 40% increase in digital literacy among our target demographic, we are positioned to scale our "Tech-Forward Youth" initiative.`}
                    />
                  </div>
                </>
              ) : (
                <div className="chat-container-organic h-full flex flex-col">
                  <div className="chat-header-premium p-10 border-b border-periwinkle/10 bg-periwinkle/5">
                    <h4 className="text-2xl flex items-center gap-4 font-bold tracking-tight">
                      <Sparkles size={28} className="text-periwinkle animate-pulse" /> Genie Conversational Oracle
                    </h4>
                  </div>
                  
                  <div className="chat-scroll flex-1 p-10 overflow-y-auto space-y-10">
                    <div className="chat-msg ai max-w-[80%] flex gap-6">
                      <div className="msg-avatar w-12 h-12 rounded-full border border-periwinkle/30 bg-periwinkle/10 flex items-center justify-center shrink-0">
                        <Sparkles size={20} className="text-periwinkle" />
                      </div>
                      <div className="msg-content p-8 rounded-3xl bg-periwinkle/5 border border-periwinkle/10">
                        <p className="text-lg text-secondary leading-relaxed">I've loaded the Lumina Foundation rubric and your 2025 Impact Report. How would you like to approach the narrative for the new terminals?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="chat-input-premium p-10 border-t border-periwinkle/10">
                    <div className="input-pill flex items-center bg-periwinkle/5 border border-periwinkle/10 rounded-full p-3 pl-10 shadow-sm">
                      <input type="text" placeholder="Instruct the Genie..." className="flex-1 bg-transparent border-none outline-none text-xl text-primary" />
                      <button className="btn btn-primary rounded-full w-14 h-14 p-0 ml-6"><Send size={22} /></button>
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

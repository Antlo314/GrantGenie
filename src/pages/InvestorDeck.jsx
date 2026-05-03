import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { 
  TrendingUp, 
  Download, 
  Presentation, 
  FileText, 
  Monitor, 
  Edit3, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Target, 
  Users, 
  Rocket, 
  Layout,
  Zap,
  CheckCircle2
} from 'lucide-react';

const slides = [
  { id: 1, title: 'The Problem', content: 'Grant search & writing is manually intensive, slow, and pain-prone. Nonprofits lose 40% of their funding potential to administrative friction.' },
  { id: 2, title: 'The Solution', content: 'The AI Grant Operating System. Quantum Radar finds the perfect matches; Oracle Writer drafts the proposals; Donna manages stewardship.' },
  { id: 3, title: 'Traction', content: '$1.47M Secured Year-to-Date. 68% Win Rate. 164 hours saved per application.' },
  { id: 4, title: 'Market Opportunity', content: '$260B+ U.S. Grants Market. Zero existing automated lifecycle operating systems.' },
  { id: 5, title: 'Product Deep Dive', content: 'Multi-agent orchestration. Quantum Radar scans 40,000+ funders. Oracle drafting engine with 98% rubric alignment.' },
  { id: 6, title: 'The Ask', content: '$2,500 Founding Partner Slots. Lifetime Enterprise Access. 0.25% Equity via SAFE.' }
];

const InvestorDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2000);
  };

  return (
    <AppLayout title="Investor Deck">
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: 0, margin: '-32px', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ background: 'white', padding: '24px 32px', borderBottom: '1px solid var(--slate-200)', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 4 }}>Investor Deck Generator</h1>
              <p style={{ color: 'var(--slate-500)', fontSize: 14 }}>Auto-populate your pitch deck using real-time traction data.</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {isGenerated ? (
                <>
                  <button className="btn btn-ghost desktop-only" style={{ gap: 8 }}><Download size={16} /> PowerPoint</button>
                  <button className="btn btn-primary" style={{ gap: 8 }}><Download size={16} /> <span className="desktop-only">Export PDF</span><span className="mobile-only">PDF</span></button>
                </>
              ) : (
                <button className="btn btn-primary" style={{ gap: 8, padding: '12px 24px' }} onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? <><Zap size={16} className="animate-pulse" /> Syncing...</> : <><Sparkles size={16} /> Generate Deck</>}
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', flexDirection: 'row' }} className="responsive-deck-layout">
          <style>{`
            @media (max-width: 1024px) {
              .responsive-deck-layout { flex-direction: column !important; overflow-y: auto !important; }
              .deck-preview { padding: 16px !important; }
              .deck-sidebar { width: 100% !important; border-left: none !important; border-top: 1px solid var(--slate-200) !important; padding: 24px !important; }
              .slide-card { padding: 32px !important; }
              .slide-title { fontSize: 28px !important; }
              .slide-text { fontSize: 16px !important; }
            }
          `}</style>
          
          {/* Main Area: Preview */}
          <main className="deck-preview" style={{ flex: 1, background: 'var(--slate-100)', padding: 40, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {isGenerated ? (
              <div style={{ width: '100%', maxWidth: 800 }}>
                {/* Slide Preview */}
                <div className="slide-card" style={{ 
                  aspectRatio: '16/9', 
                  background: 'white', 
                  borderRadius: 20, 
                  boxShadow: 'var(--shadow-xl)', 
                  padding: 60, 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
                      <img src="/grant_genie_favicon.png" alt="Grant Genie" style={{ width: 24, height: 24 }} />
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-400)' }}>Grant <span style={{ color: 'var(--teal)' }}>Genie</span></div>
                    </div>
                    
                    <h2 className="slide-title" style={{ fontSize: 42, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 24, letterSpacing: '-0.02em' }}>{slides[currentSlide].title}</h2>
                    <p className="slide-text" style={{ fontSize: 20, color: 'var(--slate-600)', lineHeight: 1.6 }}>{slides[currentSlide].content}</p>
                    
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div style={{ fontSize: 12, color: 'var(--slate-300)', fontWeight: 600 }}>PRIVATE & CONFIDENTIAL · © 2026 GRANT GENIE</div>
                      <div style={{ fontSize: 12, color: 'var(--slate-300)', fontWeight: 600 }}>SLIDE {currentSlide + 1} OF {slides.length}</div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, marginTop: 32 }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ width: 48, height: 48, padding: 0, borderRadius: '50%' }}
                    onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                    disabled={currentSlide === 0}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-500)' }}>Slide {currentSlide + 1} of {slides.length}</div>
                  <button 
                    className="btn btn-secondary" 
                    style={{ width: 48, height: 48, padding: 0, borderRadius: '50%' }}
                    onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
                    disabled={currentSlide === slides.length - 1}
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', color: 'var(--slate-400)' }}>
                <Monitor size={64} strokeWidth={1.5} style={{ marginBottom: 24, opacity: 0.5 }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 8 }}>Ready to Generate</h3>
                <p style={{ maxWidth: 400 }}>Click the button above to synchronize your platform traction and generate a professional pitch deck.</p>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="deck-sidebar" style={{ width: 340, background: 'white', borderLeft: '1px solid var(--slate-200)', padding: 32, overflowY: 'auto' }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 24 }}>Deck Configuration</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--teal)', fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
                  <Layout size={18} /> Dynamic Branding
                </div>
                <p style={{ fontSize: 12, color: 'var(--slate-500)', lineHeight: 1.5 }}>Using your primary brand colors (Teal/Slate) and high-fidelity typography.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Data Sync Status</div>
                {[
                  { label: 'Traction Metrics', status: 'Synced' },
                  { label: 'Market Analysis', status: 'Live' },
                  { label: 'Nonprofit Logos', status: 'Active' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--slate-50)', borderRadius: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--slate-600)' }}>{item.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--emerald)', textTransform: 'uppercase' }}>{item.status}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'var(--slate-900)', borderRadius: 16, padding: 20, color: 'white' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
                  <Rocket size={18} color="var(--teal)" /> Founding PartnerSAFE
                </div>
                <p style={{ fontSize: 12, opacity: 0.8, lineHeight: 1.5, marginBottom: 16 }}>Your current deck is optimized for the $2,500 Founding Partner round.</p>
                <button className="btn btn-primary" style={{ width: '100%', height: 40, fontSize: 12, background: 'var(--teal)', border: 'none' }}>Edit SAFE Terms</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
};

export default InvestorDeck;

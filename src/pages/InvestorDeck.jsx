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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 4 }}>Investor Deck Generator</h1>
              <p style={{ color: 'var(--slate-500)', fontSize: 14 }}>Auto-populate your professional pitch deck using real-time platform traction data.</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {isGenerated && (
                <>
                  <button className="btn btn-ghost" style={{ gap: 8 }}><Download size={16} /> PowerPoint</button>
                  <button className="btn btn-primary" style={{ gap: 8 }}><Download size={16} /> PDF</button>
                </>
              )}
              {!isGenerated && (
                <button className="btn btn-primary" style={{ gap: 8, padding: '12px 24px' }} onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? <><Zap size={16} className="animate-pulse" /> Syncing Data...</> : <><Sparkles size={16} /> Generate My Investor Deck</>}
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Main Area: Preview */}
          <main style={{ flex: 1, background: 'var(--slate-100)', padding: 40, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {isGenerated ? (
              <div style={{ width: '100%', maxWidth: 800 }}>
                {/* Slide Preview */}
                <div style={{ 
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
                  {/* Slide Background Elements */}
                  <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'rgba(13,148,136,0.03)' }}></div>
                  <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(13,148,136,0.02)' }}></div>
                  
                  <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
                      <img src="/grant_genie_favicon.png" alt="Grant Genie" style={{ width: 32, height: 32 }} />
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-400)' }}>Grant <span style={{ color: 'var(--teal)' }}>Genie</span></div>
                    </div>
                    
                    <h2 style={{ fontSize: 42, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 24, letterSpacing: '-0.02em' }}>{slides[currentSlide].title}</h2>
                    <p style={{ fontSize: 20, color: 'var(--slate-600)', lineHeight: 1.6, maxWidth: 600 }}>{slides[currentSlide].content}</p>
                    
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase' }}>Confidential Pitch Deck · 2026</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)' }}>Slide {currentSlide + 1} / {slides.length}</div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32 }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: 12, borderRadius: '50%' }} 
                    onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                    disabled={currentSlide === 0}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: 12, borderRadius: '50%' }} 
                    onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
                    disabled={currentSlide === slides.length - 1}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 20, opacity: 0.5 }}>
                <Monitor size={64} style={{ color: 'var(--slate-300)' }} />
                <p style={{ fontWeight: 600, color: 'var(--slate-400)' }}>Generator idle. Click the button above to sync platform data.</p>
              </div>
            )}
          </main>

          {/* Right Panel: Settings */}
          <aside style={{ width: 340, background: 'white', borderLeft: '1px solid var(--slate-200)', overflowY: 'auto', padding: 32 }} className="desktop-only">
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 24 }}>Deck Customization</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate-600)' }}>Deck Theme</label>
                <select style={{ height: 40, fontSize: 13, borderRadius: 8 }}>
                  <option>Institutional Teal (Premium)</option>
                  <option>Midnight Blue</option>
                  <option>Modern Light</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate-600)' }}>Included Traction Data</label>
                {[
                  { label: 'YTD Secured ($1.47M)', active: true },
                  { label: 'Overall Win Rate (68%)', active: true },
                  { label: 'Pipeline Value ($3.85M)', active: true },
                  { label: 'Founding Partner Offer', active: true }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--slate-700)' }}>
                    <CheckCircle2 size={16} style={{ color: item.active ? 'var(--teal)' : 'var(--slate-300)' }} /> {item.label}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto', padding: 20, background: 'var(--slate-50)', borderRadius: 16, border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--teal)', fontWeight: 700, fontSize: 12, marginBottom: 8 }}>
                  <Zap size={14} /> AI Tip
                </div>
                <p style={{ fontSize: 12, color: 'var(--slate-500)', lineHeight: 1.5, margin: 0 }}>
                  Investors love the **14.2x ROI** metric. I have highlighted this on Slide 3 to maximize conversion.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
};

export default InvestorDeck;

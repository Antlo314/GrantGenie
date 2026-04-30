import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Database, CheckCircle, Star, FileText, Users, TrendingUp } from 'lucide-react';

const teal = 'var(--teal)';
const tealDark = 'var(--teal-dark)';

const LandingPage = () => {
  const navigate = useNavigate();
  const [grantsPerMonth, setGrantsPerMonth] = useState(5);
  const [currentSpend, setCurrentSpend] = useState(300);

  const features = [
    { icon: <FileText size={22} />, title: 'Multi-Agent Oracle Writer', desc: 'Drafts complete, rubric-aligned grant applications using recursive AI logic — not just a ChatGPT wrapper.' },
    { icon: <Shield size={22} />, title: 'Zero-Trust Data Vault', desc: 'Your 501c3 audits and financial docs never leave your browser. Encrypted locally, zero server exposure.' },
    { icon: <Database size={22} />, title: 'Unlimited Programs', desc: 'Track every initiative, funder, and deadline simultaneously. No per-project upgrade fees.' },
    { icon: <TrendingUp size={22} />, title: 'Quantum Funder Discovery', desc: 'Real-time AI radar scans 40,000+ active foundations to surface grants matching your exact mission.' },
    { icon: <Users size={22} />, title: 'Donna Stewardship Engine', desc: 'Automatically generates personalized donor updates, impact reports, and press releases from won grants.' },
    { icon: <Zap size={22} />, title: 'BYOK Architecture', desc: 'Bring Your Own Key — use your OpenAI or Anthropic API key directly. Fractions of a cent per grant.' },
  ];

  const comparisons = [
    { feature: 'Starting Price', gg: '$150/mo', inst: '$299/mo', vee: '$249/mo', ga: '$200/mo+', highlight: true },
    { feature: 'AI Grant Writing', gg: 'Multi-Agent Oracle', inst: 'Basic Assistant', vee: 'Basic AI', ga: 'Collaborative AI' },
    { feature: 'Monthly Grant Limit', gg: '5 + Unlimited Overage', inst: 'Capped', vee: 'Capped (3)', ga: 'Strict Quotas' },
    { feature: 'Active Programs', gg: 'Unlimited', inst: 'Limited', vee: 'Limited (3)', ga: 'Limited' },
    { feature: 'Data Privacy', gg: 'Zero-Trust Vault', inst: 'Centralized Cloud', vee: 'Centralized Cloud', ga: 'Centralized Cloud' },
    { feature: 'Donor Relations', gg: 'Included (Donna)', inst: 'Add-on', vee: 'Premium Only', ga: 'Limited' },
    { feature: 'Funder Discovery', gg: 'Quantum Real-time', inst: 'Standard', vee: 'Standard', ga: 'Standard' },
  ];

  return (
    <div style={{ background: '#fff' }}>
      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <img src="/logo.png" alt="Grant Genie" style={{ width: 34, height: 34, objectFit: 'contain' }} />
          <span>Grant <span style={{ color: teal }}>Genie</span></span>
        </div>
        <div className="landing-nav-links">
          <button className="landing-nav-link">Features</button>
          <button className="landing-nav-link">Pricing</button>
          <button className="landing-nav-link" onClick={() => navigate('/deck')}>Investors</button>
          <button className="btn btn-ghost" onClick={() => navigate('/auth')}>Sign In</button>
          <button className="btn btn-primary" onClick={() => navigate('/auth')}>Get Started Free</button>
        </div>
      </nav>

      {/* Hero with Nano Banner */}
      <div className="section-padding" style={{ position: 'relative', overflow: 'hidden', minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 60, paddingTop: 100, textAlign: 'center' }}>
        <img src="/nano-hero.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,1) 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(13,148,136,0.1)`, color: teal, fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 999, marginBottom: 20, boxShadow: '0 2px 8px rgba(255,255,255,0.8)' }}>
            <Zap size={14} /> Built to beat Instrumentl, Vee & GrantAssistant
          </div>
          <h1 style={{ fontSize: 'clamp(36px,5vw,68px)', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20, textShadow: '0 4px 12px rgba(255,255,255,0.9)' }}>
            The AI Grant Platform<br /><span style={{ color: teal }}>That Has No Limits</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--slate-700)', maxWidth: 540, margin: '0 auto 36px', lineHeight: 1.75, textShadow: '0 2px 4px rgba(255,255,255,0.9)', fontWeight: 500 }}>
            Stop paying $300+/mo for capped AI tools. Grant Genie automates your entire fundraising lifecycle with multi-agent intelligence.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/auth')}>
              Start Free Trial <ArrowRight size={18} />
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/deck')} style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)' }}>
              View Investor Deck
            </button>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="section-padding" style={{ background: 'var(--slate-50)', borderTop: '1px solid var(--slate-200)', padding: '16px 48px', display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
        {['14-day free trial', 'No credit card required', '98% gross margin platform', 'Cancel anytime'].map(t => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--slate-500)', fontWeight: 500 }}>
            <CheckCircle size={15} style={{ color: teal }} /> {t}
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="section section-padding">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: teal, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Platform Features</p>
          <h2 style={{ fontSize: 'clamp(28px,3vw,48px)', fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em', marginBottom: 16 }}>Everything your grant team needs</h2>
          <p style={{ fontSize: 18, color: 'var(--slate-500)', maxWidth: 560, margin: '0 auto' }}>Powered by autonomous AI agents that work while you sleep.</p>
        </div>
        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-item">
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `rgba(13,148,136,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: teal }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--slate-500)', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intelligence Banner */}
      <div className="section-padding" style={{ padding: '0 48px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-xl)', position: 'relative' }}>
          <img src="/nano-intelligence.png" alt="Grant Genie Intelligence" style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(13,148,136,0.85) 0%, rgba(13,148,136,0.4) 50%, transparent 100%)', display: 'flex', alignItems: 'center', padding: 'var(--main-padding)' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>Oracle Active</p>
              <h3 style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 12, letterSpacing: '-0.02em' }}>40,000+ Funders<br />Scanned in Real-Time</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>Our Quantum Radar never sleeps.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Calculator Section */}
      <section className="section-padding" style={{ padding: '0 48px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ background: 'var(--slate-900)', borderRadius: 24, padding: 'min(60px, var(--main-padding)) var(--main-padding)', color: 'white', position: 'relative', overflow: 'hidden' }}>
          {/* Background Glow */}
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 400, height: 400, background: `radial-gradient(circle, ${teal} 0%, transparent 70%)`, opacity: 0.15, pointerEvents: 'none' }} />
          
          <div className="roi-grid">
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: teal, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>ROI CALCULATOR</p>
              <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 20, letterSpacing: '-0.02em' }}>See how much you save</h2>
              <p style={{ color: 'var(--slate-400)', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
                Stop overpaying for capped seats and limited AI. Grant Genie scales with your organization's ambitions, not its invoice.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--slate-300)' }}>Grants Written Per Month</label>
                    <span style={{ color: teal, fontWeight: 700 }}>{grantsPerMonth}</span>
                  </div>
                  <input 
                    type="range" min="1" max="20" step="1" 
                    value={grantsPerMonth} 
                    onChange={(e) => setGrantsPerMonth(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: teal }} 
                  />
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--slate-300)' }}>Current Software Spend (Monthly)</label>
                    <span style={{ color: teal, fontWeight: 700 }}>${currentSpend}</span>
                  </div>
                  <input 
                    type="range" min="50" max="1000" step="50" 
                    value={currentSpend} 
                    onChange={(e) => setCurrentSpend(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: teal }} 
                  />
                </div>
              </div>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 'var(--main-padding)', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'var(--slate-400)', marginBottom: 8, fontWeight: 500 }}>Estimated Annual Savings</p>
              <div style={{ fontSize: 64, fontWeight: 800, color: 'white', marginBottom: 24, letterSpacing: '-0.04em' }}>
                ${((currentSpend - 150) * 12).toLocaleString()}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ padding: 16, background: 'rgba(13,148,136,0.1)', borderRadius: 12 }}>
                  <p style={{ fontSize: 12, color: 'var(--slate-400)', marginBottom: 4 }}>Hours Saved/Yr</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: teal }}>{grantsPerMonth * 4 * 12}h</p>
                </div>
                <div style={{ padding: 16, background: 'rgba(13,148,136,0.1)', borderRadius: 12 }}>
                  <p style={{ fontSize: 12, color: 'var(--slate-400)', marginBottom: 4 }}>ROI Factor</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: teal }}>{((currentSpend / 150) * 10).toFixed(1)}x</p>
                </div>
              </div>
              
              <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 32 }} onClick={() => navigate('/auth')}>
                Get This Savings <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-padding" style={{ background: 'var(--slate-50)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: teal, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Competitive Analysis</p>
            <h2 style={{ fontSize: 'clamp(28px,3vw,48px)', fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em', marginBottom: 16 }}>We're not the same</h2>
            <p style={{ fontSize: 18, color: 'var(--slate-500)', maxWidth: 500, margin: '0 auto' }}>A direct comparison against the most popular platforms in the market.</p>
          </div>
          <div className="comparison-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th style={{ color: teal, background: 'rgba(13,148,136,0.04)' }}>Grant Genie ✦</th>
                  <th>Instrumentl</th>
                  <th>Vee.com</th>
                  <th>GrantAssistant</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{row.feature}</td>
                    <td style={{ background: 'rgba(13,148,136,0.03)', color: teal, fontWeight: 700 }}>{row.gg}</td>
                    <td>{row.inst}</td>
                    <td>{row.vee}</td>
                    <td>{row.ga}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section section-padding">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: teal, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Simple Pricing</p>
          <h2 style={{ fontSize: 'clamp(28px,3vw,48px)', fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em', marginBottom: 16 }}>Start saving today</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
          {/* Disruptor */}
          <div style={{ background: 'white', border: '1.5px solid var(--slate-200)', borderRadius: 20, padding: 'min(32px, var(--main-padding))', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>DISRUPTOR</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1 }}>$150<span style={{ fontSize: 16, color: 'var(--slate-400)', fontWeight: 400 }}>/mo</span></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['5 AI grants per month', 'Unlimited funder discovery', 'Zero-Trust Vault', '50 campaign posts/mo', 'Donna donor relations'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--slate-700)', alignItems: 'center' }}>
                  <CheckCircle size={16} style={{ color: 'var(--emerald)', flexShrink: 0 }} /> {f}
                </div>
              ))}
            </div>
            <button className="btn btn-ghost btn-lg" style={{ width: '100%' }} onClick={() => navigate('/auth')}>Get Started</button>
          </div>

          {/* Enterprise */}
          <div style={{ background: 'white', border: `2px solid ${teal}`, borderRadius: 20, padding: 'min(32px, var(--main-padding))', display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', boxShadow: `0 4px 20px rgba(13,148,136,0.1)` }}>
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: teal, color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <Star size={11} /> Most Popular
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: teal, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>ENTERPRISE</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1 }}>$299<span style={{ fontSize: 16, color: 'var(--slate-400)', fontWeight: 400 }}>/mo</span></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Everything in Disruptor', 'Unlimited AI grants + overage', 'BYOK (your own API key)', 'Unlimited campaigns', 'Priority Oracle support', 'White-label reports'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--slate-700)', alignItems: 'center' }}>
                  <CheckCircle size={16} style={{ color: teal, flexShrink: 0 }} /> {f}
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => navigate('/auth')}>Start Free Trial <ArrowRight size={18} /></button>
          </div>

          {/* Founding Partner */}
          <div style={{ background: 'var(--slate-900)', border: `2px solid var(--gold)`, borderRadius: 20, padding: 'min(32px, var(--main-padding))', display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', boxShadow: `0 4px 30px rgba(245,158,11,0.2)` }}>
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: 'var(--slate-900)', fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', width: 'max-content' }}>
              <Zap size={11} /> LIMITED SEED ROUND
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>FOUNDING PARTNER</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: 'white', lineHeight: 1 }}>$1,000<span style={{ fontSize: 16, color: 'var(--slate-400)', fontWeight: 400 }}> once</span></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                <span key="1"><strong>1% Equity</strong> in the platform IP</span>,
                'Lifetime Enterprise License',
                'Zero Monthly Fees — Forever',
                'Founding Board Advisor Seat',
                'Direct channel to founders',
                'Early access to all modules'
              ].map((f, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--slate-300)', alignItems: 'center' }}>
                  <CheckCircle size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} /> {f}
                </div>
              ))}
            </div>
            <button className="btn btn-lg" style={{ width: '100%', background: 'var(--gold)', color: 'var(--slate-900)', fontWeight: 800 }} onClick={() => navigate('/deck')}>
              Secure Your Equity <ArrowRight size={18} />
            </button>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--slate-500)', fontWeight: 600 }}>ONLY 10 SLOTS AVAILABLE</div>
          </div>
        </div>
      </section>

      {/* Growth Banner */}
      <div className="section-padding" style={{ padding: '0 48px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
          <img src="/nano-growth.png" alt="Growth" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
        </div>
      </div>

      {/* CTA */}
      <section className="section-padding" style={{ background: teal, padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: 'white', marginBottom: 16, letterSpacing: '-0.02em' }}>Ready to deploy your Genie?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
          Join organizations that have moved off Instrumentl and Vee — and never looked back.
        </p>
        <button className="btn btn-lg" style={{ background: 'white', color: teal, fontWeight: 700 }} onClick={() => navigate('/auth')}>
          Deploy Your Genie <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer className="section-padding" style={{ background: 'var(--slate-900)', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white', fontWeight: 700 }}>
          <img src="/logo.png" alt="Grant Genie" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          Grant Genie
        </div>
        <p style={{ color: 'var(--slate-500)', fontSize: 13 }}>© 2026 Grant Genie. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

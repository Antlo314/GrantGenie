import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Database, CheckCircle, Star, ChevronRight, FileText, Users, TrendingUp } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileText size={22} />,
      title: 'Multi-Agent Oracle Writer',
      desc: 'Drafts complete, rubric-aligned grant applications using recursive AI logic — not just a ChatGPT wrapper.'
    },
    {
      icon: <Shield size={22} />,
      title: 'Zero-Trust Data Vault',
      desc: 'Your 501c3 audits and financial docs never leave your browser. Encrypted locally, zero server exposure.'
    },
    {
      icon: <Database size={22} />,
      title: 'Unlimited Programs',
      desc: 'Track every initiative, funder, and deadline simultaneously. No per-project upgrade fees.'
    },
    {
      icon: <TrendingUp size={22} />,
      title: 'Quantum Funder Discovery',
      desc: 'Real-time AI radar scans 40,000+ active foundations to surface grants matching your exact mission.'
    },
    {
      icon: <Users size={22} />,
      title: 'Donna Stewardship Engine',
      desc: 'Automatically generates personalized donor updates, impact reports, and press releases from won grants.'
    },
    {
      icon: <Zap size={22} />,
      title: 'BYOK Architecture',
      desc: 'Bring Your Own Key. Use your OpenAI or Anthropic API key directly — fractions of a cent per generation.'
    },
  ];

  const comparisons = [
    { feature: 'Starting Price', gg: '$150/mo', inst: '$299/mo', vee: '$249/mo', ga: '$200/mo+', highlight: true },
    { feature: 'AI Grant Writing', gg: 'Multi-Agent Oracle', inst: 'Basic Assistant', vee: 'Basic AI', ga: 'Collaborative AI' },
    { feature: 'Monthly Grant Limit', gg: '5 + Unlimited Overage', inst: 'Capped', vee: '3 Grants', ga: 'Strict Quotas' },
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
          <img src="/logo.png" alt="Grant Genie" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span>Grant <span style={{ color: 'var(--indigo)' }}>Genie</span></span>
        </div>
        <div className="landing-nav-links">
          <button className="landing-nav-link">Features</button>
          <button className="landing-nav-link">Pricing</button>
          <button className="landing-nav-link" onClick={() => navigate('/deck')}>Investors</button>
          <button className="btn btn-ghost" onClick={() => navigate('/auth')}>Sign In</button>
          <button className="btn btn-primary" onClick={() => navigate('/auth')}>Get Started Free</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(180deg, #f0f0ff 0%, #fff 60%)', paddingTop: 140, paddingBottom: 80, textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
          <div className="hero-eyebrow">
            <Zap size={14} /> Built to beat Instrumentl, Vee, and GrantAssistant
          </div>
          <h1 style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
            The AI Grant Platform<br />
            <span style={{ color: 'var(--indigo)' }}>That Has No Limits</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--slate-600)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Stop paying $300+/mo for capped AI tools. Grant Genie automates your entire fundraising lifecycle — from discovery to donor stewardship — with multi-agent intelligence.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/auth')}>
              Start Free Trial <ArrowRight size={18} />
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/deck')}>
              View Investor Deck
            </button>
          </div>
          <p style={{ marginTop: 24, fontSize: 13, color: 'var(--slate-400)' }}>
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="section-label">Platform Features</p>
          <h2 className="section-title">Everything your grant team needs</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>Powered by autonomous AI agents that work while you sleep.</p>
        </div>
        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-item">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section style={{ background: 'var(--slate-50)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="section-label">Competitive Analysis</p>
            <h2 className="section-title">We're not the same</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>A direct comparison against the most popular platforms in the market.</p>
          </div>
          <div className="comparison-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th style={{ color: 'var(--indigo)', background: 'rgba(99,102,241,0.04)' }}>Grant Genie ✦</th>
                  <th>Instrumentl</th>
                  <th>Vee.com</th>
                  <th>GrantAssistant</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={i} className={row.highlight ? 'comp-winner' : ''}>
                    <td style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{row.feature}</td>
                    <td style={{ background: 'rgba(99,102,241,0.04)', color: 'var(--indigo)', fontWeight: 600 }}>{row.gg}</td>
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
      <section className="section">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="section-label">Simple Pricing</p>
          <h2 className="section-title">Start saving today</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>All plans include unlimited funder discovery and the Zero-Trust Vault.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {/* Starter */}
          <div className="pricing-card">
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--slate-500)', marginBottom: 8 }}>DISRUPTOR</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1 }}>$150<span style={{ fontSize: 16, color: 'var(--slate-400)', fontWeight: 400 }}>/mo</span></div>
              <p style={{ fontSize: 14, color: 'var(--slate-500)', marginTop: 12 }}>For small nonprofits ready to scale their grants program.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['5 AI grants per month', 'Unlimited funder discovery', 'Zero-Trust Vault', 'Campaign engine (50 posts/mo)', 'Donna donor relations'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--slate-700)', alignItems: 'center' }}>
                  <CheckCircle size={16} style={{ color: 'var(--emerald)', flexShrink: 0 }} /> {f}
                </div>
              ))}
            </div>
            <button className="btn btn-ghost btn-lg" style={{ width: '100%' }} onClick={() => navigate('/auth')}>Get Started</button>
          </div>

          {/* Pro */}
          <div className="pricing-card featured">
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)' }}>
              <span className="badge badge-indigo"><Star size={12} /> Most Popular</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--indigo)', marginBottom: 8 }}>ENTERPRISE</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1 }}>$299<span style={{ fontSize: 16, color: 'var(--slate-400)', fontWeight: 400 }}>/mo</span></div>
              <p style={{ fontSize: 14, color: 'var(--slate-500)', marginTop: 12 }}>For established organizations with active multi-funder pipelines.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Everything in Disruptor', 'Unlimited AI grants + overage', 'BYOK (Bring Your Own API Key)', 'Unlimited campaigns', 'Priority Oracle support', 'White-label reports'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--slate-700)', alignItems: 'center' }}>
                  <CheckCircle size={16} style={{ color: 'var(--indigo)', flexShrink: 0 }} /> {f}
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => navigate('/auth')}>Start Free Trial <ArrowRight size={18} /></button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--indigo)', padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: 'white', marginBottom: 16, letterSpacing: '-0.02em' }}>
          Ready to beat the competition?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
          Join organizations that have moved from Instrumentl and Vee to Grant Genie and never looked back.
        </p>
        <button className="btn btn-lg" style={{ background: 'white', color: 'var(--indigo)' }} onClick={() => navigate('/auth')}>
          Deploy Your Genie <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--slate-900)', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
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

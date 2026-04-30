import React from 'react';
import AppLayout from '../components/AppLayout';
import { CheckCircle, XCircle, TrendingUp, ArrowRight, Star, Cpu, Shield, Zap, DollarSign } from 'lucide-react';

const Check = () => <CheckCircle size={18} style={{ color: 'var(--emerald)', flexShrink: 0 }} />;
const X = () => <span style={{ fontSize: 18, color: 'var(--slate-300)', fontWeight: 700 }}>—</span>;

const comparisons = [
  {
    category: 'Pricing',
    rows: [
      { feature: 'Starting Price', gg: '$150/mo', inst: '$299/mo', vee: '$249/mo', ga: '$200+/mo', tip: 'The lowest monthly cost to access the platform.' },
      { feature: 'Grant Volume Limits', gg: '5 grants + unlimited overage', inst: 'Capped (2-3)', vee: 'Capped (3)', ga: 'Strict quotas', tip: 'Maximum number of AI-drafted grants per billing cycle.' },
      { feature: 'Active Programs', gg: 'Unlimited', inst: 'Limited tiers', vee: 'Limited (3)', ga: 'Limited', tip: 'Separate organizational initiatives tracked simultaneously.' },
    ]
  },
  {
    category: 'Technology',
    rows: [
      { feature: 'AI Writing Depth', gg: 'Multi-Agent Oracle (recursive)', inst: 'Basic AI assistant', vee: 'Standard GPT wrapper', ga: 'Collaborative AI', tip: 'Our Oracle recursively self-edits drafts against funder rubrics — not just a simple AI prompt.' },
      { feature: 'BYOK Support', gg: 'Full (OpenAI / Anthropic)', inst: '✗', vee: '✗', ga: 'Partial', tip: 'Bring Your Own Key — use your API key to generate at cost, bypassing per-credit fees.' },
      { feature: 'Funder Discovery', gg: 'Quantum real-time (40k+ funders)', inst: 'Standard database', vee: 'Standard', ga: 'Standard', tip: 'AI that continuously scans global foundations to find grants matching your mission.' },
    ]
  },
  {
    category: 'Features',
    rows: [
      { feature: 'Data Privacy', gg: 'Zero-Trust Vault (local-first)', inst: 'Centralized cloud', vee: 'Centralized cloud', ga: 'Centralized cloud', tip: 'Your 501c3 docs and financials are encrypted locally — never uploaded to our servers.' },
      { feature: 'Donor Relations (CRM)', gg: 'Donna Protocol (included)', inst: 'Add-on / Extra', vee: 'Premium only', ga: 'Limited', tip: 'Automated donor stewardship: personalized letters, impact reports, and announcements from each won grant.' },
      { feature: 'Social Media Engine', gg: 'Unlimited campaigns', inst: 'None', vee: '24 posts/mo', ga: 'Limited', tip: 'Generates LinkedIn posts, newsletters, and press releases from your grant activity.' },
    ]
  },
];

const roadmap = [
  { phase: 'Phase 1', title: 'MVP Launch', status: 'complete', desc: 'Oracle Writer, Campaign Engine, Zero-Trust Vault, Funder Discovery. 100 beta users.' },
  { phase: 'Phase 2', title: 'Growth Engine', status: 'active', desc: 'Donna Protocol automation, BYOK API integration, mobile app, team collaboration.' },
  { phase: 'Phase 3', title: '$30k MRR', status: 'upcoming', desc: 'Enterprise CRM, white-label licensing, integration with Salesforce NPSP and Bloomerang.' },
  { phase: 'Phase 4', title: 'Market Leader', status: 'upcoming', desc: 'API marketplace, AI-to-funder direct submission pipeline, government grant module.' },
];

const InvestorDeck = () => {
  return (
    <AppLayout title="Investor Deck">
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 64 }}>

        {/* Hero Slide with Nano Banner */}
        <section style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', color: 'white', minHeight: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 24px' }}>
          <img src="/nano-hero.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,148,136,0.92) 0%, rgba(15,118,110,0.88) 100%)', zIndex: 1 }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <p style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>Seed Round · 2026</p>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: 20 }}>Grant Genie</h1>
            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.85)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
              The world's first <strong style={{ color: 'white' }}>infinite-capacity</strong> grant operating system. Automating the $50B nonprofit funding sector with multi-agent AI.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[['$10K', 'Seed Ask'], ['$30K', 'MRR Target'], ['98%', 'Gross Margin']].map(([v, l]) => (
                <div key={l} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 32px', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>{v}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Competitive Matrix */}
        <section>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Market Positioning</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em', marginBottom: 8 }}>Systemic Competitive Advantage</h2>
          <p style={{ color: 'var(--slate-500)', marginBottom: 40, fontSize: 16 }}>A direct feature-by-feature comparison. Every tooltip explains the feature in plain English.</p>

          {comparisons.map((section, si) => (
            <div key={si} style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--slate-400)', marginBottom: 8, paddingLeft: 8 }}>{section.category}</div>
              <div className="comparison-table-wrap" style={{ background: 'white', borderRadius: 16, border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--slate-500)', background: 'var(--slate-50)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--slate-200)' }}>Feature</th>
                      <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--teal)', background: 'rgba(13,148,136,0.04)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--slate-200)' }}>Grant Genie ✦</th>
                      <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--slate-500)', background: 'var(--slate-50)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--slate-200)' }}>Instrumentl</th>
                      <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--slate-500)', background: 'var(--slate-50)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--slate-200)' }}>Vee.com</th>
                      <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--slate-500)', background: 'var(--slate-50)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--slate-200)' }}>GrantAssistant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row, ri) => (
                      <tr key={ri} style={{ borderBottom: ri < section.rows.length - 1 ? '1px solid var(--slate-100)' : 'none' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: 14 }}>{row.feature}</div>
                          <div style={{ fontSize: 12, color: 'var(--slate-400)', marginTop: 3, lineHeight: 1.5 }}>{row.tip}</div>
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center', background: 'rgba(13,148,136,0.03)', color: 'var(--teal)', fontWeight: 700, fontSize: 14 }}>{row.gg}</td>
                        <td style={{ padding: '16px 20px', textAlign: 'center', color: 'var(--slate-500)', fontSize: 14 }}>{row.inst}</td>
                        <td style={{ padding: '16px 20px', textAlign: 'center', color: 'var(--slate-500)', fontSize: 14 }}>{row.vee}</td>
                        <td style={{ padding: '16px 20px', textAlign: 'center', color: 'var(--slate-500)', fontSize: 14 }}>{row.ga}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        {/* Unit Economics */}
        <section>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Financial Model</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em', marginBottom: 40 }}>The Road to $30K MRR</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 40 }}>
            {[
              { icon: <DollarSign size={20} />, label: 'Cost per Grant', value: '$0.02', sub: 'API token cost' },
              { icon: <TrendingUp size={20} />, label: 'Gross Margin', value: '98%', sub: 'At $150/mo tier' },
              { icon: <Cpu size={20} />, label: 'Users for $30K MRR', value: '100–200', sub: 'At blended ARPU' },
              { icon: <Shield size={20} />, label: 'Seed Ask', value: '$10,000', sub: '$4K build + $6K acq.' },
            ].map((m, i) => (
              <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)', margin: '0 auto 12px' }}>{m.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 4 }}>{m.value}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 12, color: 'var(--slate-400)' }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* MRR Path */}
          <div className="card">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 20 }}>Acquisition Path</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 20 }}>
              {[
                { step: '01', title: 'Disrupt', desc: 'Target $299/mo Instrumentl users. Win with price ($150) and unlimited capacity.', target: '100 users · $15K MRR' },
                { step: '02', title: 'Upsell', desc: 'Convert power users to $299 Enterprise with BYOK, team features, and white-label.', target: '50 users · $15K MRR' },
                { step: '03', title: 'Scale', desc: 'Partner with nonprofits, associations, and fiscal sponsors for group pricing.', target: 'Reach $30K+ MRR' },
              ].map(s => (
                <div key={s.step} style={{ padding: 20, background: 'var(--slate-50)', borderRadius: 12, border: '1px solid var(--slate-200)' }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--slate-200)', marginBottom: 8 }}>{s.step}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 8 }}>{s.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--slate-500)', margin: '0 0 12px', lineHeight: 1.6 }}>{s.desc}</p>
                  <span className="badge badge-teal" style={{ fontSize: 12 }}>{s.target}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Product Roadmap</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em', marginBottom: 40 }}>Four Phases to Market Leadership</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {roadmap.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, paddingBottom: i < roadmap.length - 1 ? 32 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: item.status === 'complete' ? 'var(--emerald)' : item.status === 'active' ? 'var(--teal)' : 'var(--slate-200)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.status === 'upcoming' ? 'var(--slate-400)' : 'white',
                    fontWeight: 700, fontSize: 14
                  }}>
                    {item.status === 'complete' ? '✓' : i + 1}
                  </div>
                  {i < roadmap.length - 1 && <div style={{ width: 2, flex: 1, background: 'var(--slate-200)', marginTop: 8 }}></div>}
                </div>
                <div style={{ paddingBottom: i < roadmap.length - 1 ? 24 : 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{item.phase}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 8 }}>{item.title}</div>
                  <p style={{ fontSize: 14, color: 'var(--slate-500)', margin: 0, lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Equity Opportunity */}
        <section style={{ background: 'linear-gradient(135deg, var(--slate-900) 0%, #0f172a 100%)', borderRadius: 24, padding: 'min(60px, var(--main-padding)) var(--main-padding)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
          {/* Accent Glow */}
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: 300, height: 300, background: 'var(--teal)', filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none' }} />
          
          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 40, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>Early Adopter Round</p>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: 'white', marginBottom: 20, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Founding Investor <br />Equity Opportunity</h2>
              <p style={{ color: 'var(--slate-400)', fontSize: 18, lineHeight: 1.7, marginBottom: 32 }}>
                We are rewarding our first $10K in seed capital with aggressive equity incentives. Own a piece of the infrastructure that disrupts the $50B nonprofit tech market.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  '1% Equity per $1,000 investment',
                  'Board Advisor seat for lead investor ($5K+)',
                  'Lifetime Platform License for your organization',
                  'Priority access to future funding rounds'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'var(--slate-300)' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(13,148,136,0.2)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>✓</div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 'min(40px, var(--main-padding))', textAlign: 'center', backdropFilter: 'blur(12px)' }}>
              <div style={{ fontSize: 14, color: 'var(--slate-400)', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Valuation Multiplier</div>
              <div style={{ fontSize: 64, fontWeight: 800, color: 'white', marginBottom: 8, letterSpacing: '-0.04em' }}>10.0x</div>
              <p style={{ color: 'var(--teal)', fontSize: 14, fontWeight: 600, marginBottom: 32 }}>Targeting Series A in Q4 2026</p>
              
              <button className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: 16 }}>
                Initialize Term Sheet <ArrowRight size={18} />
              </button>
              <p style={{ fontSize: 12, color: 'var(--slate-500)' }}>Legal review required. Accredited investors only.</p>
            </div>
          </div>
        </section>

      </div>
    </AppLayout>
  );
};

export default InvestorDeck;


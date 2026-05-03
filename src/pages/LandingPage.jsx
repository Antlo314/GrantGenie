import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Database, CheckCircle, Star, FileText, Users, TrendingUp, X } from 'lucide-react';

const teal = 'var(--teal)';
const tealDark = 'var(--teal-dark)';

const LandingPage = () => {
  const navigate = useNavigate();
  const [grantsPerMonth, setGrantsPerMonth] = useState(5);
  const [currentSpend, setCurrentSpend] = useState(300);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', linkedin: '', why: '' });
  const [submitted, setSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [demoResults, setDemoResults] = useState([]);
  const [activeDraft, setActiveDraft] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowPartnerForm(false);
      setSubmitted(false);
      setFormData({ name: '', email: '', linkedin: '', why: '' });
    }, 2500);
  };

  const runDemoSearch = (term) => {
    // Tracking Event
    if (window.gtag) {
      window.gtag('event', 'demo_search', { 'search_term': term });
    }
    setSearchTerm(term);
    setIsSearching(true);
    setDemoResults([]);
    setActiveDraft(null);
    
    setTimeout(() => {
      const isClimate = term.toLowerCase().includes('climate');
      const data = isClimate ? [
        { id: 1, title: 'Sustainable Communities Grant', funder: 'Rockefeller Foundation', amount: '$250,000', deadline: 'Dec 15', score: 94, match: 'Perfect fit for your small nonprofit climate research initiative.', draft: 'Draft Proposal: Our initiative "Eco-Pulse" leverages community-driven data to map urban heat islands, directly aligning with Rockefeller\'s mission to build climate resilience...' },
        { id: 2, title: 'Environmental Justice Small Grant', funder: 'EPA', amount: '$50,000', deadline: 'Nov 01', score: 88, match: 'High alignment with your environmental justice outreach goals.', draft: 'Draft Proposal: The EPA\'s commitment to underserved populations is mirrored in our project, which provides direct air quality monitoring tools to residents in...' },
        { id: 3, title: 'Climate Resilience Fund', funder: 'Bezos Earth Fund', amount: '$1,000,000', deadline: 'Rolling', score: 72, match: 'Good potential if focused on large-scale carbon capture integration.', draft: 'Draft Proposal: We propose a scalable model for carbon sequestration in urban green spaces, addressing the Bezos Earth Fund\'s priority on innovative technology...' },
        { id: 4, title: 'Green Tech Innovation', funder: 'Dept. of Energy', amount: '$500,000', deadline: 'Jan 10', score: 91, match: 'Strong match for your upcoming solar grid pilot program.', draft: 'Draft Proposal: This project implements micro-grid controllers to optimize local renewable energy distribution, satisfying the DOE\'s objective for grid modernization...' }
      ] : [
        { id: 1, title: 'STEM Excellence in K-12', funder: 'NSF', amount: '$150,000', deadline: 'Oct 20', score: 96, match: 'Exceptional match for your school-based robotics curriculum.', draft: 'Draft Proposal: By integrating robotics into standard 6th-grade math courses, we address the NSF\'s mandate to improve early engagement in STEM fields...' },
        { id: 2, title: 'Digital Literacy Initiative', funder: 'Google.org', amount: '$100,000', deadline: 'Dec 01', score: 92, match: 'Perfect fit for your computer science training for underserved schools.', draft: 'Draft Proposal: Our CS-for-All program targets high-purity schools to bridge the digital divide, aligning with Google.org\'s focus on equitable tech education...' },
        { id: 3, title: 'School Mental Health Support', funder: 'Dept. of Education', amount: '$300,000', deadline: 'Nov 15', score: 85, match: 'Strong alignment with your counselor-to-student ratio improvements.', draft: 'Draft Proposal: This initiative expands peer-to-peer counseling networks across the district, directly fulfilling the Dept of Education\'s goal for student well-being...' },
        { id: 4, title: 'Future Educators Fund', funder: 'Gates Foundation', amount: '$200,000', deadline: 'Jan 05', score: 79, match: 'Good alignment for your teacher residency program in urban areas.', draft: 'Draft Proposal: Our residency model focuses on retaining diverse educators in Title I schools, supporting the Gates Foundation\'s goal for equitable teaching...' }
      ];
      setDemoResults(data);
      setIsSearching(false);
    }, 1500);
  };

  const features = [
    { icon: <FileText size={22} />, title: 'Oracle Multi-Agent Writer', desc: 'Win more grants by drafting rubric-aligned applications in minutes, not weeks. Recursive logic that beats generic AI.' },
    { icon: <Shield size={22} />, title: 'Zero-Trust Data Security', desc: 'Your sensitive 501c3 data never leaves your browser. Local encryption ensures 100% privacy and compliance.' },
    { icon: <Database size={22} />, title: 'Scalable Program Management', desc: 'Track every initiative and deadline without per-project fees. Built for growing nonprofits and agencies.' },
    { icon: <TrendingUp size={22} />, title: 'Quantum Funder Discovery', desc: 'Scan 40,000+ active foundations in real-time to surface hidden matches before your competition does.' },
    { icon: <Users size={22} />, title: 'Donna Auto-Stewardship', desc: 'Turn wins into long-term funding with automated donor updates and impact reports generated from your grants.' },
    { icon: <Zap size={22} />, title: '90% Cost Reduction', desc: 'Stop paying for expensive "per seat" models. Bring your own API key and pay only for what you use.' },
  ];

  const demoGrants = [
    { type: 'Federal', agency: 'Dept. of Education', title: 'Mental Health Service Professional Grant', score: 98, match: 'High alignment with your youth counseling programs.', preview: 'Executive Summary: Our proposed initiative, "Mindful Youth," directly addresses the mental health crisis in rural schools by...' },
    { type: 'Foundation', agency: 'Gates Foundation', title: 'Global Health Discovery & Translation', score: 85, match: 'Strong match for your infectious disease research.', preview: 'Problem Statement: Current diagnostic delays in sub-Saharan Africa contribute to avoidable mortality rates. Our project...' },
    { type: 'Foundation', agency: 'Ford Foundation', title: 'Social Justice & Civic Engagement', score: 92, match: 'Perfect fit for your voting rights initiative.', preview: 'Strategic Goal: To expand participation in underserved communities by implementing a peer-to-peer mobilization model...' },
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
          <button className="landing-nav-link" onClick={() => navigate('/')}>Home</button>
          <button className="landing-nav-link" onClick={() => document.getElementById('demo')?.scrollIntoView()}>Demo</button>
          <button className="landing-nav-link" onClick={() => document.getElementById('how-it-works')?.scrollIntoView()}>How It Works</button>
          <button className="landing-nav-link" onClick={() => navigate('/founding-partners')}>Founding Partners</button>
          <button className="landing-nav-link" onClick={() => navigate('/beta')}>Beta Access</button>
          <button className="landing-nav-link" onClick={() => document.getElementById('contact')?.scrollIntoView()}>Contact</button>
          <button className="btn btn-ghost" onClick={() => navigate('/auth')}>Sign In</button>
          <button className="btn btn-primary" onClick={() => navigate('/auth')}>Get Started Free</button>
        </div>
      </nav>

      {/* Hero with Nano Banner */}
      <div className="section-padding" style={{ position: 'relative', overflow: 'hidden', minHeight: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 100, paddingTop: 140, textAlign: 'center' }}>
        <img src="/nano-hero.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,1) 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 900 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(13,148,136,0.1)`, color: teal, fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 999, marginBottom: 24, boxShadow: '0 2px 8px rgba(13,148,136,0.1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Zap size={14} /> The Next Evolution of Fundraising
          </div>
          <h1 style={{ fontSize: 'clamp(40px,6vw,84px)', fontWeight: 900, color: 'var(--slate-900)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 24, textShadow: '0 4px 12px rgba(255,255,255,0.9)' }}>
            The AI Grant<br /><span style={{ color: teal }}>Operating System</span>
          </h1>
          <p style={{ fontSize: 'clamp(18px,2.5vw,22px)', color: 'var(--slate-700)', maxWidth: 640, margin: '0 auto 48px', lineHeight: 1.6, textShadow: '0 2px 4px rgba(255,255,255,0.9)', fontWeight: 500 }}>
            Find, draft, and win grants faster with intelligent agents. Stop overpaying for capped tools and start winning with recursive AI.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" style={{ minWidth: 200 }} onClick={() => navigate('/auth')}>
              Try Demo Free <ArrowRight size={18} />
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/founding-partners')} style={{ minWidth: 200, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)' }}>
              Secure Founding Partner Spot
            </button>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="section-padding" style={{ background: 'var(--slate-50)', borderTop: '1px solid var(--slate-200)', borderBottom: '1px solid var(--slate-200)', padding: '20px 48px', display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
        {[
          { icon: <CheckCircle size={15} />, text: '98% Gross Margin Platform' },
          { icon: <Star size={15} />, text: 'Early Beta Active' },
          { icon: <Shield size={15} />, text: 'SOC2 Compliant Architecture' },
          { icon: <Users size={15} />, text: 'Built for 501c3 & Agencies' }
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--slate-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span style={{ color: teal }}>{item.icon}</span> {item.text}
          </div>
        ))}
      </div>

      {/* Interactive Demo Section */}
      <section id="demo" className="section-padding" style={{ background: '#fff', padding: '100px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(32px,4vw,56px)', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.03em', marginBottom: 20 }}>Try the Genie Demo</h2>
            <p style={{ fontSize: 18, color: 'var(--slate-500)', maxWidth: 600, margin: '0 auto' }}>Experience how the Oracle searches, ranks, and drafts in seconds.</p>
          </div>

          <div style={{ background: 'var(--slate-900)', borderRadius: 32, padding: 'min(48px, var(--main-padding))', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--slate-800)', position: 'relative' }}>
            {/* Search Input Area */}
            <div style={{ position: 'relative', marginBottom: 24 }}>
              <input 
                type="text" 
                placeholder="Describe your project (e.g., climate change research for small nonprofits)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && runDemoSearch(searchTerm)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '24px 32px', borderRadius: 16, fontSize: 18, width: '100%', paddingLeft: 64, outline: 'none' }}
              />
              <TrendingUp size={24} style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: teal }} />
              <button 
                className="btn btn-primary" 
                style={{ position: 'absolute', right: 8, top: 8, bottom: 8, padding: '0 32px', borderRadius: 12 }}
                onClick={() => runDemoSearch(searchTerm || 'climate change research for small nonprofits')}
              >
                Search Demo
              </button>
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 48, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: 'var(--slate-500)', fontWeight: 600, paddingTop: 6 }}>Try:</span>
              <button onClick={() => runDemoSearch('climate change research for small nonprofits')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--slate-300)', padding: '6px 14px', borderRadius: 99, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>climate change research for small nonprofits</button>
              <button onClick={() => runDemoSearch('education grants for K-12 schools')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--slate-300)', padding: '6px 14px', borderRadius: 99, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>education grants for K-12 schools</button>
            </div>

            {/* Results Loader */}
            {isSearching && (
              <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, border: `3px solid ${teal}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
                <p style={{ color: 'var(--slate-400)', fontWeight: 600, fontSize: 14 }}>Oracle Radar Scanning 40,000+ Funders...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* Results Grid */}
            {!isSearching && demoResults.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                {demoResults.map((grant) => (
                  <div key={grant.id} className="animate-fade-in" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: teal, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{grant.funder}</div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginTop: 4 }}>{grant.title}</h3>
                      </div>
                      <div style={{ background: grant.score > 90 ? 'rgba(13,148,136,0.15)' : 'rgba(245,158,11,0.15)', color: grant.score > 90 ? teal : 'var(--gold)', padding: '6px 12px', borderRadius: 99, fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap' }}>
                        {grant.score}% Match
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--slate-400)' }}>
                      <div><strong style={{ color: 'var(--slate-300)' }}>Amount:</strong> {grant.amount}</div>
                      <div><strong style={{ color: 'var(--slate-300)' }}>Deadline:</strong> {grant.deadline}</div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', fontSize: 13, color: 'var(--slate-400)', lineHeight: 1.5 }}>
                      <span style={{ color: teal, fontWeight: 700 }}>Why it matches:</span> {grant.match}
                    </div>

                    <button 
                      className="btn" 
                      style={{ width: '100%', background: activeDraft === grant.id ? teal : 'rgba(255,255,255,0.05)', color: activeDraft === grant.id ? 'white' : 'var(--slate-300)', borderColor: 'rgba(255,255,255,0.1)', border: '1px solid', fontSize: 13, fontWeight: 700 }}
                      onClick={() => setActiveDraft(activeDraft === grant.id ? null : grant.id)}
                    >
                      {activeDraft === grant.id ? 'Close Draft Sample' : 'Generate AI Draft Snippet'}
                    </button>

                    {activeDraft === grant.id && (
                      <div className="animate-fade-in" style={{ marginTop: 8, padding: 16, background: 'rgba(13,148,136,0.05)', borderRadius: 12, border: '1px solid rgba(13,148,136,0.2)', fontSize: 13, color: 'var(--slate-300)', lineHeight: 1.6, fontStyle: 'italic' }}>
                        {grant.draft}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding" style={{ background: 'var(--slate-50)', padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <p className="section-label">How It Works</p>
            <h2 className="section-title">The Foundation to Funding in 3 Steps</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, position: 'relative' }}>
            {[
              { step: 1, title: 'Upload Your Organization DNA', desc: 'Securely upload your 501c3 audits, past grants, and project mission. Our Zero-Trust Vault encrypts everything locally.' },
              { step: 2, title: 'AI Finds & Ranks Best Grants', desc: 'The Quantum Radar scans 40,000+ funders and scores every opportunity against your specific organizational rubric.' },
              { step: 3, title: 'Agents Draft, Track, and Win', desc: 'Multi-agent Oracles write first drafts of every section. Donna manages stewardship. You focus on the impact.' }
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ width: 80, height: 80, borderRadius: 24, background: teal, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, margin: '0 auto 32px', boxShadow: '0 20px 40px rgba(13,148,136,0.2)' }}>{item.step}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: 'var(--slate-900)' }}>{item.title}</h3>
                <p style={{ fontSize: 16, color: 'var(--slate-500)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              <Zap size={11} /> 🚀 Founding Partner Opportunity
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Limited to 12 slots</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'white', lineHeight: 1 }}>$2,500<span style={{ fontSize: 16, color: 'var(--slate-400)', fontWeight: 400 }}> one-time</span></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                <span key="1"><strong>0.25% equity</strong> via simple SAFE</span>,
                'Lifetime Enterprise License (zero monthly fees forever)',
                'Early access to every new module',
                'Direct founder channel + private roadmap input',
                'Invitation to advisor-style strategy calls'
              ].map((f, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--slate-300)', alignItems: 'center' }}>
                  <CheckCircle size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} /> {f}
                </div>
              ))}
            </div>
            <button 
              className="btn btn-lg" 
              style={{ width: '100%', background: 'var(--gold)', color: 'var(--slate-900)', fontWeight: 800 }} 
              onClick={() => {
                if (window.gtag) window.gtag('event', 'founding_partner_click');
                setShowPartnerForm(true);
              }}
            >
              Secure Founding Partner Spot <ArrowRight size={18} />
            </button>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => navigate('/founding-partners')} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                View full round details & one-pager
              </button>
            </div>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--slate-400)', fontWeight: 500, lineHeight: 1.4 }}>
              "We're keeping this round accessible because we know times are tough — focused on aligned early believers."
            </div>
          </div>
        </div>
      </section>

      {/* Growth Banner */}
      <div className="section-padding" style={{ padding: '0 48px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
          <img src="/nano-growth.png" alt="Growth" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
        </div>
      </div>

      {/* Beta Banner */}
      <section className="section-padding" style={{ background: 'white', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', background: 'rgba(13, 148, 136, 0.03)', border: '1px solid rgba(13, 148, 136, 0.1)', borderRadius: 32, padding: '60px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 40 }}>
          <div style={{ maxWidth: 500 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 16 }}>Join the Private Beta</h2>
            <p style={{ fontSize: 18, color: 'var(--slate-600)', lineHeight: 1.6 }}>First 50 users get lifetime Pro access. Help us build the ultimate fundraising operating system.</p>
          </div>
          <button 
            className="btn btn-primary btn-lg" 
            style={{ minWidth: 200 }} 
            onClick={() => {
              if (window.gtag) window.gtag('event', 'beta_signup_click');
              navigate('/beta');
            }}
          >
            Join Beta
          </button>
        </div>
      </section>

      {/* Beta Feedback */}
      <section className="section-padding" style={{ background: 'var(--slate-50)', padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p className="section-label">Beta Feedback</p>
            <h2 className="section-title">What early believers are saying</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            {[
              { name: 'Sarah J.', role: 'Executive Director', text: '"The Oracle writer saved us 40 hours on our first federal application. The rubric alignment is uncanny."' },
              { name: 'Marcus T.', role: 'Grant Consultant', text: '"I\'ve used Instrumentl for years, but Grant Genie\'s discovery engine is faster and more precise. The ROI is immediate."' },
              { name: 'Elena R.', role: 'Founding Partner', text: '"Being a founding partner is about more than the license; it\'s about having a voice in a tool that actually understands the nonprofit struggle."' }
            ].map((f, i) => (
              <div key={i} style={{ background: 'white', padding: 32, borderRadius: 24, boxShadow: 'var(--shadow-md)', border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={teal} color={teal} />)}
                </div>
                <p style={{ fontSize: 16, color: 'var(--slate-700)', fontStyle: 'italic', marginBottom: 24 }}>{f.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: teal }}>{f.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)' }}>{f.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>{f.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Support Section */}
      <section id="contact" className="section-padding" style={{ background: 'white', padding: '100px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 20 }}>Get in Touch</h2>
          <p style={{ fontSize: 18, color: 'var(--slate-500)', marginBottom: 40 }}>Questions about our Oracle engine or the Founding Partner round? We're here to help.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--slate-400)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Email Support</div>
              <a href="mailto:hello@grantgenie.ai" style={{ fontSize: 18, color: 'var(--teal)', fontWeight: 700, textDecoration: 'none' }}>hello@grantgenie.ai</a>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--slate-400)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Founder Direct</div>
              <button onClick={() => navigate('/founding-partners')} style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--teal)', fontWeight: 700, textDecoration: 'none', cursor: 'pointer', padding: 0 }}>Investor Channel</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding" style={{ background: teal, padding: '120px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: 'white', marginBottom: 24, letterSpacing: '-0.03em' }}>Ready to win your next grant?</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 20, marginBottom: 48, maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.6 }}>
            Join organizations that have automated their entire fundraising lifecycle with Grant Genie.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-lg" style={{ background: 'white', color: teal, fontWeight: 800, minWidth: 200 }} onClick={() => navigate('/auth')}>
              Launch Your Genie <ArrowRight size={18} />
            </button>
            <button className="btn btn-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontWeight: 700, minWidth: 200 }} onClick={() => setShowPartnerForm(true)}>
              Secure Founding Spot
            </button>
          </div>
        </div>
      </section>

      {/* Trust Signals & Final Proof */}
      <div style={{ background: 'var(--slate-900)', borderTop: '1px solid var(--slate-800)', padding: '60px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', opacity: 0.6 }}>
            {[
              { icon: <Shield size={18} />, text: 'Privacy-first – your data stays yours' },
              { icon: <CheckCircle size={18} />, text: 'No credit card required for demo' },
              { icon: <Users size={18} />, text: 'Built for nonprofits & researchers' },
              { icon: <Star size={18} />, text: 'SOC2 Compliant Infrastructure' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'white', fontWeight: 600, letterSpacing: '0.02em' }}>
                <span style={{ color: teal }}>{item.icon}</span> {item.text}
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--slate-500)', fontSize: 14, fontWeight: 500, opacity: 0.8 }}>"Your data is private. No credit card needed to start."</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="section-padding" style={{ background: 'var(--slate-900)', borderTop: '1px solid var(--slate-800)', padding: '60px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white', fontWeight: 700, fontSize: 20 }}>
              <img src="/logo.png" alt="Grant Genie" style={{ width: 32, height: 32, objectFit: 'contain' }} />
              Grant Genie
            </div>
            <p style={{ color: 'var(--slate-500)', fontSize: 14, maxWidth: 300, lineHeight: 1.6 }}>The world's first AI Grant Operating System. Made for nonprofits & grant seekers.</p>
          </div>
          
          <div style={{ display: 'flex', gap: 60, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Product</div>
              <button className="footer-link" onClick={() => document.getElementById('demo')?.scrollIntoView()}>Demo</button>
              <button className="footer-link" onClick={() => document.getElementById('how-it-works')?.scrollIntoView()}>How It Works</button>
              <button className="footer-link" onClick={() => navigate('/beta')}>Beta Program</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Partners</div>
              <button className="footer-link" onClick={() => navigate('/founding-partners')}>Founding Partners</button>
              <button className="footer-link" onClick={() => navigate('/deck')}>Investor Deck</button>
              <button className="footer-link">Privacy Policy</button>
            </div>
          </div>
        </div>
        
        <div style={{ maxWidth: 1200, margin: '60px auto 0', paddingTop: 32, borderTop: '1px solid var(--slate-800)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ color: 'var(--slate-600)', fontSize: 13 }}>© 2026 Grant Genie. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 24 }}>
             <style>{`.footer-link { background: none; border: none; padding: 0; color: var(--slate-500); cursor: pointer; text-align: left; font-size: 14; transition: color 0.2s; } .footer-link:hover { color: white; }`}</style>
          </div>
        </div>
      </footer>
      {/* Partner Form Modal */}
      {showPartnerForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="animate-fade-in" style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 500, padding: 'min(40px, var(--main-padding))', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <button 
              onClick={() => setShowPartnerForm(false)} 
              style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}
            >
              <X size={24} />
            </button>
            
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(13, 148, 136, 0.1)', color: 'var(--teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle size={32} />
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Application Received</h3>
                <p style={{ color: 'var(--slate-500)' }}>We'll review your details and reach out shortly if there's an alignment.</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>Founding Partner</h2>
                <p style={{ color: 'var(--slate-500)', marginBottom: 32 }}>Secure one of the 12 slots in our limited seed round.</p>
                
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 8 }}>Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 8 }}>Work Email</label>
                    <input 
                      required
                      type="email" 
                      placeholder="jane@organization.org"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 8 }}>LinkedIn Profile URL</label>
                    <input 
                      required
                      type="url" 
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedin}
                      onChange={e => setFormData({...formData, linkedin: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 8 }}>Why are you interested?</label>
                    <textarea 
                      required
                      placeholder="Tell us a bit about your mission..."
                      rows={3}
                      value={formData.why}
                      onChange={e => setFormData({...formData, why: e.target.value})}
                      style={{ resize: 'none' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 10 }}>
                    Submit Application
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

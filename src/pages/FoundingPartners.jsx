import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Zap, Star, Shield, TrendingUp, Users, DollarSign, Copy, Check } from 'lucide-react';
import AppLayout from '../components/AppLayout';

const FoundingPartners = () => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState(null);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', linkedin: '', why: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowPartnerForm(false);
      setSubmitted(false);
      setFormData({ name: '', email: '', linkedin: '', why: '' });
    }, 2500);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const templates = {
    linkedin: `Hi [Name], I hope you're doing well! 

I'm currently helping build Grant Genie, the first AI Grant Operating System designed to automate the entire fundraising lifecycle for nonprofits and researchers. We've just opened a very limited "Founding Partner" round — it's a small $2,500 slot that includes 0.25% equity and a lifetime enterprise license (no fees forever).

Given your background in [Field/Interest], I thought you might want to see the deck or join as an early believer. Let me know if you're open to a quick chat!`,
    cold: `Subject: Founding Partner Opportunity: Grant Genie AI

Hi [Name],

I'm reaching out because of your track record in [Investor Interest/Industry]. 

We are Grant Genie, and we are building the AI Grant Operating System. We've automated the grant search, ranking, and drafting process using multi-agent intelligence, targeting a $260B+ market that is currently stuck in manual, slow workflows.

We are opening 12 "Founding Partner" slots at $2,500 each to accelerate our pre-seed growth. This is a high-alignment round for early believers, offering 0.25% equity and lifetime access.

Would you be open to a 10-minute intro call this week?

Best,
[Your Name]`,
    pitch: `(0:00-0:10) "Hi, I'm [Your Name]. We're building Grant Genie, the AI Grant Operating System."
(0:10-0:20) "Nonprofits lose thousands of hours every year manually searching and writing grants. We've built autonomous agents that find, score, and draft rubric-aligned proposals in seconds."
(0:20-0:30) "The U.S. grant market is $260 billion, and we're already seeing incredible traction with our beta users. We're opening 12 Founding Partner slots for $2,500 to own a piece of the future of fundraising. Are you in?"`
  };

  return (
    <AppLayout title="Founding Partners">
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 80, padding: '40px 0 100px' }}>
        
        {/* Hero Section */}
        <section style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245, 158, 11, 0.1)', color: 'var(--gold)', fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 999, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Zap size={14} /> Exclusive Pre-Seed Opportunity
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, color: 'var(--slate-900)', letterSpacing: '-0.03em', marginBottom: 24, lineHeight: 1.1 }}>
            Join Our Limited<br /><span style={{ color: 'var(--teal)' }}>Founding Partner Round</span>
          </h1>
          <p style={{ fontSize: 20, color: 'var(--slate-600)', maxWidth: 700, margin: '0 auto 40px', lineHeight: 1.6 }}>
            We're raising a small, accessible pre-seed round to accelerate the AI Grant Operating System. Only 12 slots available for aligned early believers.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" style={{ minWidth: 240, background: 'var(--gold)', color: 'var(--slate-900)', fontWeight: 800 }} onClick={() => setShowPartnerForm(true)}>
              Secure Your Spot <ArrowRight size={18} />
            </button>
            <button className="btn btn-ghost btn-lg" style={{ minWidth: 240 }} onClick={() => navigate('/')}>
              Back to Homepage
            </button>
          </div>
        </section>

        {/* The Offer Card */}
        <section style={{ background: 'var(--slate-900)', borderRadius: 32, padding: 'min(60px, var(--main-padding))', color: 'white', border: '1px solid var(--slate-800)', boxShadow: 'var(--shadow-xl)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: 300, height: 300, background: 'var(--gold)', filter: 'blur(120px)', opacity: 0.1 }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>The $2,500 Founding Partner Offer</h2>
              <div style={{ fontSize: 18, color: 'var(--gold)', fontWeight: 600 }}>Limited to first 12 participants</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {[
                { title: '0.25% Equity', desc: 'Secure direct equity via a simple SAFE (Simple Agreement for Future Equity).', icon: <TrendingUp size={20} /> },
                { title: 'Lifetime Enterprise', desc: 'A perpetual Enterprise License. Zero monthly fees, forever. (A $3,600/yr value).', icon: <Star size={20} /> },
                { title: 'Early Access', desc: 'Be the first to test and deploy new Oracle modules and stewardship agents.', icon: <Zap size={20} /> },
                { title: 'Founder Channel', desc: 'Direct 1-on-1 access to the founders via private Slack/Discord channel.', icon: <Users size={20} /> },
                { title: 'Strategy Calls', desc: 'Invitation to monthly advisor-style strategy calls to influence the roadmap.', icon: <CheckCircle size={20} /> },
                { title: 'Zero Fees Forever', desc: 'Lock in your fundraising infrastructure cost at zero for the life of your org.', icon: <Shield size={20} /> }
              ].map((f, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
                  <div style={{ color: 'var(--gold)', marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--slate-400)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* One-Pager Summary */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          <div style={{ textAlign: 'center' }}>
            <p className="section-label">Investment Summary</p>
            <h2 className="section-title">The Grant Genie One-Pager</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 40 }}>
            <div className="card" style={{ padding: 40 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#ef4444' }}>Problem:</span> The Fundraising Bottleneck
              </h3>
              <p style={{ color: 'var(--slate-600)', lineHeight: 1.7 }}>
                Grant writing is currently a slow, manual, and expensive process. Nonprofits spend an average of 40-80 hours per federal application, with no guarantee of success. Existing tools are often just basic search databases or simple GPT wrappers that lack the "recursive logic" required for high-stakes funding.
              </p>
            </div>
            
            <div className="card" style={{ padding: 40 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: 'var(--teal)' }}>Solution:</span> The AI Grant OS
              </h3>
              <p style={{ color: 'var(--slate-600)', lineHeight: 1.7 }}>
                Grant Genie is the first multi-agent platform that automates the full lifecycle. Our **Oracle** agents draft rubric-aligned proposals, our **Radar** finds 40,000+ funders in real-time, and **Donna** handles donor stewardship. We move at the speed of AI, not manual labor.
              </p>
            </div>

            <div className="card" style={{ padding: 40 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: 'var(--slate-900)' }}>Market:</span> $260B+ Opportunity
              </h3>
              <p style={{ color: 'var(--slate-600)', lineHeight: 1.7 }}>
                The U.S. grant market exceeds $260 billion annually across federal and foundation sources. The nonprofit tech sector (NPT) is a massive, underserved $50B+ industry hungry for true automation. We are positioning Grant Genie as the infrastructure layer for this transition.
              </p>
            </div>

            <div className="card" style={{ padding: 40 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: 'var(--gold)' }}>Traction & Team:</span> Built for Speed
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <CheckCircle size={18} style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: 'var(--slate-600)' }}><strong>MVP Live:</strong> Core Oracle and Radar modules operational with early beta users.</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <CheckCircle size={18} style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: 'var(--slate-600)' }}><strong>High Margins:</strong> 98% gross margins via efficient BYOK architecture.</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <CheckCircle size={18} style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: 'var(--slate-600)' }}><strong>Leadership:</strong> Led by expert builders in AI automation and nonprofit growth.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Outreach Assets */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          <div style={{ textAlign: 'center' }}>
            <p className="section-label">Partner Resources</p>
            <h2 className="section-title">Ready-to-Use Outreach Assets</h2>
            <p style={{ color: 'var(--slate-500)', maxWidth: 600, margin: '0 auto' }}>Copy and paste these templates to share the opportunity with your network.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32 }}>
            {/* LinkedIn Template */}
            <div style={{ background: 'white', borderRadius: 24, border: '1px solid var(--slate-200)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)' }}>LinkedIn / Personal Network</span>
                <button 
                  onClick={() => copyToClipboard(templates.linkedin, 'linkedin')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === 'linkedin' ? 'var(--teal)' : 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}
                >
                  {copiedId === 'linkedin' ? <Check size={14} /> : <Copy size={14} />} {copiedId === 'linkedin' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div style={{ padding: 24, fontSize: 14, color: 'var(--slate-600)', whiteSpace: 'pre-wrap', lineHeight: 1.6, background: '#fafafa' }}>
                {templates.linkedin}
              </div>
            </div>

            {/* Cold Email Template */}
            <div style={{ background: 'white', borderRadius: 24, border: '1px solid var(--slate-200)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)' }}>Cold Outreach Email</span>
                <button 
                  onClick={() => copyToClipboard(templates.cold, 'cold')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === 'cold' ? 'var(--teal)' : 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}
                >
                  {copiedId === 'cold' ? <Check size={14} /> : <Copy size={14} />} {copiedId === 'cold' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div style={{ padding: 24, fontSize: 14, color: 'var(--slate-600)', whiteSpace: 'pre-wrap', lineHeight: 1.6, background: '#fafafa' }}>
                {templates.cold}
              </div>
            </div>

            {/* Pitch Script */}
            <div style={{ background: 'white', borderRadius: 24, border: '1px solid var(--slate-200)', overflow: 'hidden', gridColumn: 'span 1' }}>
              <div style={{ padding: '20px 24px', background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)' }}>30-Second Elevator Pitch</span>
                <button 
                  onClick={() => copyToClipboard(templates.pitch, 'pitch')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === 'pitch' ? 'var(--teal)' : 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}
                >
                  {copiedId === 'pitch' ? <Check size={14} /> : <Copy size={14} />} {copiedId === 'pitch' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div style={{ padding: 24, fontSize: 14, color: 'var(--slate-600)', whiteSpace: 'pre-wrap', lineHeight: 1.6, background: '#fafafa' }}>
                {templates.pitch}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ background: 'var(--teal)', borderRadius: 32, padding: '80px 48px', textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 20 }}>Secure Your Founding Partner Slot</h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            We are moving fast to close this round and finalize our first 12 partners. 
            Apply now to lock in your equity and lifetime license.
          </p>
          <button className="btn btn-lg" style={{ background: 'white', color: 'var(--teal)', fontWeight: 800, minWidth: 280 }} onClick={() => setShowPartnerForm(true)}>
            Apply for Partner Slot <ArrowRight size={18} />
          </button>
        </section>

      </div>

      {/* Partner Form Modal (Duplicate for functionality) */}
      {showPartnerForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="animate-fade-in" style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 500, padding: 40, position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <button 
              onClick={() => setShowPartnerForm(false)} 
              style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}
            >
              <Zap size={24} />
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
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid var(--slate-200)' }}
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
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid var(--slate-200)' }}
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
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid var(--slate-200)' }}
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
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid var(--slate-200)', resize: 'none' }}
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
    </AppLayout>
  );
};

export default FoundingPartners;

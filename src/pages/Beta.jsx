import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Zap, Users, Shield, Sparkles, Send } from 'lucide-react';
import AppLayout from '../components/AppLayout';

const Beta = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', org: '', focus: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tracking Event
    if (window.gtag) {
      window.gtag('event', 'beta_signup', {
        'org_type': formData.org,
        'project_focus': formData.focus
      });
    }
    setSubmitted(true);
  };

  return (
    <AppLayout title="Join the Beta">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 0 100px' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'none', border: 'none', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 40 }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(13, 148, 136, 0.1)', color: 'var(--teal)', fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 999, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Sparkles size={14} /> Early Access Program
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, color: 'var(--slate-900)', letterSpacing: '-0.03em', marginBottom: 24, lineHeight: 1.1 }}>
              Join the Beta – First 50 Users Get <span style={{ color: 'var(--teal)' }}>Lifetime Pro Access</span>
            </h1>
            <p style={{ fontSize: 18, color: 'var(--slate-600)', marginBottom: 40, lineHeight: 1.6 }}>
              We are looking for serious nonprofit leaders, researchers, and grant consultants to help shape the future of fundraising.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { icon: <Zap size={20} />, title: 'Free Lifetime Access', desc: 'No monthly fees. Ever. A reward for being an early believer.' },
                { icon: <Users size={20} />, title: 'Early Feature Input', desc: 'Directly influence the roadmap of our Oracle and Donna agents.' },
                { icon: <Shield size={20} />, title: 'Priority Support', desc: 'Direct 1-on-1 onboarding and technical assistance from our team.' }
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(13, 148, 136, 0.05)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {b.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 4 }}>{b.title}</h3>
                    <p style={{ fontSize: 14, color: 'var(--slate-500)', lineHeight: 1.5 }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--slate-200)', borderRadius: 32, padding: 40, boxShadow: 'var(--shadow-xl)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(13, 148, 136, 0.1)', color: 'var(--teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle size={32} />
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>You're on the list!</h3>
                <p style={{ color: 'var(--slate-500)', lineHeight: 1.6 }}>Thank you for your interest in Grant Genie. We'll review your application and reach out within 48 hours.</p>
                <button className="btn btn-ghost" style={{ marginTop: 32, width: '100%' }} onClick={() => navigate('/')}>Return Home</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 8 }}>Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '14px 18px', borderRadius: 12, border: '1.5px solid var(--slate-200)', fontSize: 15 }}
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
                    style={{ width: '100%', padding: '14px 18px', borderRadius: 12, border: '1.5px solid var(--slate-200)', fontSize: 15 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 8 }}>Organization Type</label>
                  <select 
                    required
                    value={formData.org}
                    onChange={e => setFormData({...formData, org: e.target.value})}
                    style={{ width: '100%', padding: '14px 18px', borderRadius: 12, border: '1.5px solid var(--slate-200)', fontSize: 15, background: 'white' }}
                  >
                    <option value="">Select type...</option>
                    <option value="501c3">501(c)(3) Nonprofit</option>
                    <option value="research">Research Institution</option>
                    <option value="consultancy">Grant Consultancy</option>
                    <option value="other">Other Small Organization</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 8 }}>What's your primary funding focus?</label>
                  <textarea 
                    required
                    placeholder="e.g., Federal education grants, local community foundation funding..."
                    rows={3}
                    value={formData.focus}
                    onChange={e => setFormData({...formData, focus: e.target.value})}
                    style={{ width: '100%', padding: '14px 18px', borderRadius: 12, border: '1.5px solid var(--slate-200)', fontSize: 15, resize: 'none' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }}>
                  Apply for Beta Access <Send size={18} style={{ marginLeft: 8 }} />
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--slate-400)' }}>
                  Your data is 100% private. No credit card required.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Beta;

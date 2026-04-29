import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { Megaphone, Mail, Share2, Send, Copy, ThumbsUp, Sparkles, ArrowRight, Check } from 'lucide-react';

const CampaignEngine = () => {
  const [tab, setTab] = useState('social');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialPost = `🎉 Thrilled to announce that we've been awarded a $150,000 Catalyst Grant from the Lumina Foundation!

This funding will allow us to deploy 500 new interactive learning terminals to Title I schools, train 120 educators in digital pedagogy, and reach 8,500 additional students this year.

None of this would be possible without our incredible community of supporters. Thank you for believing in educational equity. 💙

#GrantWin #EducationalEquity #TechForGood #LuminaFoundation`;

  const emailSubject = 'A Major Milestone for Our Students (And You!)';
  const emailBody = `Dear [First Name],

Because of your early belief in our mission, I want to share some incredible news with you before we announce it publicly.

We have just been awarded a $150,000 Catalyst Grant from the Lumina Foundation — one of the most competitive grants in educational technology funding.

This is a direct result of the impact we've achieved together. In our 2025 report, we documented a 40% increase in digital literacy among our students — a metric that caught Lumina's eye.

With this grant, we will:
• Deploy 500 interactive learning terminals to Title I schools
• Train 120 educators in digital pedagogy
• Serve 8,500 additional students

Your support made this possible. Thank you.

With gratitude,
[Executive Director Name]`;

  return (
    <AppLayout title="Campaign Engine">
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>

        {/* Left Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Source Grant */}
          <div className="card">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Source Grant</div>
            <div>
              <div style={{ padding: '12px 16px', background: 'rgba(13,148,136,0.06)', border: '1.5px solid var(--teal)', borderRadius: 10, cursor: 'pointer', marginBottom: 10 }}>
                <div style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: 14 }}>Lumina Catalyst Award</div>
                <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 3 }}>Won · $150,000</div>
              </div>
              <div style={{ padding: '12px 16px', background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 10, cursor: 'pointer', opacity: 0.6 }}>
                <div style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: 14 }}>Community Health Initiative</div>
                <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 3 }}>Pending · $75,000</div>
              </div>
            </div>
          </div>

          {/* Campaign Type */}
          <div className="card">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Campaign Type</div>
            <select style={{ width: '100%', marginBottom: 0 }}>
              <option>Announce Grant Win</option>
              <option>Monthly Donor Update</option>
              <option>Capital Campaign Push</option>
              <option>Year-End Impact Report</option>
            </select>
            <p style={{ fontSize: 12, color: 'var(--slate-400)', marginTop: 8, lineHeight: 1.5 }}>
              The Oracle adjusts tone and call-to-action based on your objective.
            </p>
          </div>

          {/* Donna Protocol */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #f0f0ff 0%, #fff 100%)', border: '1px solid var(--slate-200)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <Sparkles size={18} style={{ color: 'var(--teal)', marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 4 }}>Donna Protocol Active</div>
                <p style={{ fontSize: 12, color: 'var(--slate-500)', margin: 0, lineHeight: 1.6 }}>
                  Donna automatically generates your social posts, donor newsletters, and press releases from every won grant.
                </p>
              </div>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }}>
            Generate Campaign <ArrowRight size={16} />
          </button>
        </div>

        {/* Right Panel */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Tab Bar */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--slate-200)', background: 'var(--slate-50)' }}>
            {[
              { key: 'social', label: 'Social Media', icon: <Share2 size={15} /> },
              { key: 'email', label: 'Donor Email', icon: <Mail size={15} /> },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '14px 24px',
                  fontSize: 14, fontWeight: 600,
                  color: tab === t.key ? 'var(--teal)' : 'var(--slate-500)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: `2px solid ${tab === t.key ? 'var(--teal)' : 'transparent'}`,
                  transition: 'all 0.2s'
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div style={{ padding: 32 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 4 }}>
                  {tab === 'social' ? 'LinkedIn / Facebook Post' : 'Personalized Donor Letter'}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge badge-emerald"><ThumbsUp size={11} /> 98% Predicted Engagement</span>
                  <span className="badge badge-teal">Tone: Warm & Authoritative</span>
                </div>
              </div>
              <button className="btn btn-ghost" onClick={handleCopy} style={{ gap: 8 }}>
                {copied ? <Check size={15} style={{ color: 'var(--emerald)' }} /> : <Copy size={15} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {tab === 'social' ? (
              <div style={{ background: 'var(--slate-50)', borderRadius: 12, padding: 24, border: '1px solid var(--slate-200)' }}>
                <p style={{ fontSize: 15, color: 'var(--slate-800)', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{socialPost}</p>
              </div>
            ) : (
              <div>
                <div style={{ background: 'var(--slate-50)', padding: '10px 16px', borderRadius: '8px 8px 0 0', border: '1px solid var(--slate-200)', borderBottom: 'none' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--slate-500)' }}>Subject: </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--slate-900)' }}>{emailSubject}</span>
                </div>
                <div style={{ background: 'white', padding: 24, borderRadius: '0 0 12px 12px', border: '1px solid var(--slate-200)' }}>
                  <p style={{ fontSize: 15, color: 'var(--slate-800)', lineHeight: 1.9, margin: 0, whiteSpace: 'pre-wrap' }}>{emailBody}</p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn btn-primary">
                <Send size={15} /> {tab === 'social' ? 'Schedule Post' : 'Send Email'}
              </button>
              <button className="btn btn-ghost">
                <Sparkles size={15} /> Regenerate
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CampaignEngine;


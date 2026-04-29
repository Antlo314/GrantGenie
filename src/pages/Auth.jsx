import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, ArrowRight } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [org, setOrg] = useState('');
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--slate-50)' }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <img src="/logo.png" alt="Grant Genie" style={{ width: 36, height: 36, objectFit: 'contain' }} />
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--slate-900)' }}>
              Grant <span style={{ color: 'var(--teal)' }}>Genie</span>
            </span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 8 }}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p style={{ color: 'var(--slate-500)', marginBottom: 32, fontSize: 15 }}>
            {isLogin ? 'Sign in to your Grant Genie workspace.' : 'Start your 14-day free trial today.'}
          </p>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {!isLogin && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: 6 }}>
                  Organization Name
                </label>
                <input
                  type="text"
                  placeholder="Lumina Foundation"
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  type="email"
                  placeholder="director@nonprofit.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: 38 }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: 38 }}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 4 }}>
              {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <span style={{ fontSize: 14, color: 'var(--slate-500)' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                style={{ color: 'var(--teal)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
              >
                {isLogin ? 'Sign up free' : 'Sign in'}
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, var(--teal) 0%, #0f766e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 64,
        color: 'white'
      }} className="hidden md:flex">
        <div style={{ maxWidth: 420 }}>
          <Shield size={48} style={{ opacity: 0.8, marginBottom: 32 }} />
          <h2 style={{ fontSize: 32, fontWeight: 700, color: 'white', marginBottom: 20, lineHeight: 1.2 }}>
            Enterprise grant intelligence, democratized.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 1.75, marginBottom: 40 }}>
            Grant Genie replaces a $40k/yr grant writer with multi-agent AI that works around the clock to find funders, draft applications, and steward your donors.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              '5 AI-drafted grants per month included',
              'Zero-Trust Vault — your data never leaves your browser',
              '40,000+ funders scanned in real-time',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 15, color: 'rgba(255,255,255,0.85)' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, fontSize: 12, fontWeight: 700 }}>✓</div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;


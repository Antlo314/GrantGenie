import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Key } from 'lucide-react';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    // Simulate auth & bypass to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="auth-container flex items-center justify-center min-h-screen relative z-10 p-4">
      
      {/* Background glow specific to auth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="auth-card glass-panel w-full max-w-md p-8 md:p-10 animate-fade-in">
        <div className="flex flex-col items-center mb-8 text-center">
          <img src="/logo.png" alt="Grant Genie" className="h-16 w-16 object-contain mb-4" />
          <h2 className="font-display text-2xl font-bold text-primary">
            {isLogin ? 'Access Terminal' : 'Initialize Workspace'}
          </h2>
          <p className="text-secondary text-sm mt-2">
            {isLogin ? 'Enter your credentials to continue.' : 'Deploy your own zero-trust grant engine.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-5">
          {!isLogin && (
            <div className="input-group">
              <label className="text-xs uppercase tracking-widest text-muted mb-1 block">Organization Name</label>
              <div className="auth-input-wrapper">
                <input type="text" className="auth-input" placeholder="e.g. Lumina Foundation" required />
              </div>
            </div>
          )}

          <div className="input-group">
            <label className="text-xs uppercase tracking-widest text-muted mb-1 block">Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="email" className="auth-input pl-10" placeholder="director@organization.org" required />
            </div>
          </div>

          <div className="input-group">
            <label className="text-xs uppercase tracking-widest text-muted mb-1 block">Passphrase</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="password" className="auth-input pl-10" placeholder="••••••••" required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2 py-3 text-base">
            {isLogin ? 'Authenticate' : 'Deploy Instance'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-secondary hover:text-gold transition-colors"
          >
            {isLogin ? "Don't have an instance? Deploy one." : "Already initialized? Access Terminal."}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

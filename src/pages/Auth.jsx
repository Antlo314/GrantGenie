import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield } from 'lucide-react';
import GlassCard from '../components/GlassCard';
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
    <div className="auth-container flex items-center justify-center min-h-screen relative z-10 p-4 bg-white">
      <div className="bg-flux"></div>
      
      {/* Cinematic Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-periwinkle/5 blur-[160px] rounded-full pointer-events-none"></div>

      <GlassCard className="w-full max-w-md p-12 animate-fade-in">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="p-4 bg-periwinkle/10 rounded-full mb-6 border border-periwinkle/20">
            <Shield className="text-periwinkle" size={32} />
          </div>
          <div className="text-xs-caps text-periwinkle mb-2">Secure Gateway</div>
          <h2 className="text-3xl tracking-tight text-primary">
            {isLogin ? 'Access Terminal' : 'Initialize Genie'}
          </h2>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs-caps block">Organization</label>
              <input type="text" className="w-full" placeholder="e.g. Lumina Foundation" required />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs-caps block">Email Address</label>
            <div className="relative">
              <Mail size={16} className="text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
              <input type="email" className="w-full pl-12" placeholder="director@organization.org" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs-caps block">Passphrase</label>
            <div className="relative">
              <Lock size={16} className="text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
              <input type="password" className="w-full pl-12" placeholder="••••••••" required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4">
            {isLogin ? 'Authenticate' : 'Initialize Engine'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs-caps text-secondary hover:text-periwinkle transition-all"
          >
            {isLogin ? "Request New Instance" : "Return to Terminal"}
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default Auth;

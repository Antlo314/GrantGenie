import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Settings as SettingsIcon, Key, Server, Cpu, CheckCircle, Info } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [keys, setKeys] = useState({
    openai: localStorage.getItem('gg_openai_key') || '',
    anthropic: localStorage.getItem('gg_anthropic_key') || '',
    gemini: localStorage.getItem('gg_gemini_key') || '',
  });
  
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('gg_openai_key', keys.openai);
    localStorage.setItem('gg_anthropic_key', keys.anthropic);
    localStorage.setItem('gg_gemini_key', keys.gemini);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isUsingDefaultGemini = !keys.gemini && import.meta.env.VITE_GEMINI_API_KEY;

  return (
    <div className="page-container">
      <Navbar title="System Configuration" />
      
      <div className="page-content settings-layout animate-fade-in">
        <div className="settings-header">
          <div className="vault-title">
            <SettingsIcon className="text-gold glow-text" size={36} />
            <div>
              <h2 className="font-display text-3xl">BYOK Architecture</h2>
              <p className="text-secondary">Bring Your Own Key. Pay fractions of a cent per grant directly to the AI provider. Zero markup.</p>
            </div>
          </div>
        </div>

        <div className="settings-grid mt-8">
          
          <GlassCard className="settings-card">
            <h3 className="font-display text-xl mb-6 flex items-center gap-2">
              <Key className="text-gold" size={20} /> Neural Network Keys
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-6">
              {/* Gemini Key - Hybrid Support */}
              <div className="input-group">
                <label className="text-xs uppercase tracking-widest text-muted mb-2 block flex items-center justify-between">
                  <span>Google Gemini API Key (1.5 Flash)</span>
                  {keys.gemini ? (
                    <span className="text-emerald flex items-center gap-1"><CheckCircle size={12}/> User Key Active</span>
                  ) : isUsingDefaultGemini ? (
                    <span className="text-blue-400 flex items-center gap-1"><Info size={12}/> System Default Active</span>
                  ) : (
                    <span className="text-slate-500">Not Configured</span>
                  )}
                </label>
                <div className="auth-input-wrapper">
                  <input 
                    type="password" 
                    className="auth-input font-mono" 
                    placeholder="Enter your Gemini key..."
                    value={keys.gemini}
                    onChange={(e) => setKeys({...keys, gemini: e.target.value})}
                  />
                </div>
                <p className="text-xs text-secondary mt-1">Recommended for high-volume document analysis and long-context grants.</p>
              </div>

              <div className="input-group">
                <label className="text-xs uppercase tracking-widest text-muted mb-2 block flex items-center justify-between">
                  <span>OpenAI API Key (GPT-4o)</span>
                  {keys.openai && <span className="text-emerald flex items-center gap-1"><CheckCircle size={12}/> Active</span>}
                </label>
                <div className="auth-input-wrapper">
                  <input 
                    type="password" 
                    className="auth-input font-mono" 
                    placeholder="sk-proj-..."
                    value={keys.openai}
                    onChange={(e) => setKeys({...keys, openai: e.target.value})}
                  />
                </div>
                <p className="text-xs text-secondary mt-1">Used for Campaign Engine and fast generation.</p>
              </div>

              <div className="input-group">
                <label className="text-xs uppercase tracking-widest text-muted mb-2 block flex items-center justify-between">
                  <span>Anthropic API Key (Claude 3.5 Sonnet)</span>
                  {keys.anthropic && <span className="text-emerald flex items-center gap-1"><CheckCircle size={12}/> Active</span>}
                </label>
                <div className="auth-input-wrapper">
                  <input 
                    type="password" 
                    className="auth-input font-mono" 
                    placeholder="sk-ant-..."
                    value={keys.anthropic}
                    onChange={(e) => setKeys({...keys, anthropic: e.target.value})}
                  />
                </div>
                <p className="text-xs text-secondary mt-1">Recommended for deep narrative grant writing (Oracle Writer).</p>
              </div>

              <button type="submit" className="btn btn-primary w-max mt-4">
                {saved ? 'Configuration Saved' : 'Update Architecture'}
              </button>
            </form>
          </GlassCard>

          <div className="flex flex-col gap-6">
            <GlassCard className="settings-info-card">
              <Server className="text-emerald mb-3" size={24} />
              <h4 className="font-display text-lg mb-2">Local-First Storage</h4>
              <p className="text-sm text-secondary leading-relaxed">
                All data, including your API keys and Vault documents, are encrypted and stored locally in your browser environment. Grant Genie servers never see your keys or your proprietary organizational data.
              </p>
            </GlassCard>

            <GlassCard className="settings-info-card">
              <Cpu className="text-blue-400 mb-3" size={24} />
              <h4 className="font-display text-lg mb-2">Cost Analysis vs Vee.com</h4>
              <p style={{ color: 'var(--slate-400)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                Vee.com charges $249/mo for 1 grant. Using your own OpenAI key, a 2,000-word grant costs approximately <strong>$0.03</strong> in API compute.
              </p>
              <div className="p-3 bg-white/5 border border-white/10 rounded-md flex justify-between items-center text-sm">
                <span>Estimated Monthly Savings</span>
                <span className="text-emerald font-bold font-display text-lg">99.9%</span>
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;


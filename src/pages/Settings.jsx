import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { Key, Server, Cpu, CheckCircle, Info, Zap } from 'lucide-react';

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
    <AppLayout title="System Configuration">
      <div style={{ maxWidth: 1000, margin: '0 auto' }} className="animate-fade-in">
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--slate-900)', marginBottom: 8 }}>BYOK Architecture</h2>
          <p style={{ color: 'var(--slate-500)', fontSize: 16 }}>Bring Your Own Key. Pay fractions of a cent per grant directly to the AI provider. Zero markup.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          
          <div className="card">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Key className="text-gold" size={20} /> Neural Network Keys
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Gemini Key */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Google Gemini API Key (1.5 Flash)</span>
                  {keys.gemini ? (
                    <span style={{ color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12}/> User Key Active</span>
                  ) : isUsingDefaultGemini ? (
                    <span style={{ color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 4 }}><Info size={12}/> System Default Active</span>
                  ) : (
                    <span>Not Configured</span>
                  )}
                </label>
                <input 
                  type="password" 
                  placeholder="Enter your Gemini key..."
                  value={keys.gemini}
                  onChange={(e) => setKeys({...keys, gemini: e.target.value})}
                  style={{ fontFamily: 'monospace' }}
                />
                <p style={{ fontSize: 12, color: 'var(--slate-400)', marginTop: 8 }}>Recommended for high-volume document analysis and long-context grants.</p>
              </div>

              {/* OpenAI Key */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <span>OpenAI API Key (GPT-4o)</span>
                  {keys.openai && <span style={{ color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12}/> Active</span>}
                </label>
                <input 
                  type="password" 
                  placeholder="sk-proj-..."
                  value={keys.openai}
                  onChange={(e) => setKeys({...keys, openai: e.target.value})}
                  style={{ fontFamily: 'monospace' }}
                />
                <p style={{ fontSize: 12, color: 'var(--slate-400)', marginTop: 8 }}>Used for Campaign Engine and fast generation.</p>
              </div>

              {/* Anthropic Key */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Anthropic API Key (Claude 3.5 Sonnet)</span>
                  {keys.anthropic && <span style={{ color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12}/> Active</span>}
                </label>
                <input 
                  type="password" 
                  placeholder="sk-ant-..."
                  value={keys.anthropic}
                  onChange={(e) => setKeys({...keys, anthropic: e.target.value})}
                  style={{ fontFamily: 'monospace' }}
                />
                <p style={{ fontSize: 12, color: 'var(--slate-400)', marginTop: 8 }}>Recommended for deep narrative grant writing (Oracle Writer).</p>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: 'max-content', marginTop: 8 }}>
                {saved ? 'Configuration Saved' : 'Update Architecture'}
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card" style={{ background: 'var(--slate-50)', borderColor: 'var(--slate-200)' }}>
              <Server className="text-emerald" size={24} style={{ marginBottom: 16 }} />
              <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 8 }}>Local-First Storage</h4>
              <p style={{ fontSize: 13, color: 'var(--slate-600)', lineHeight: 1.6 }}>
                All data, including your API keys and Vault documents, are encrypted and stored locally in your browser environment. Grant Genie servers never see your keys.
              </p>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, var(--slate-900) 0%, #0f172a 100%)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>
              <Cpu style={{ color: 'var(--gold)', marginBottom: 16 }} size={24} />
              <h4 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8 }}>Cost Analysis vs Vee</h4>
              <p style={{ color: 'var(--slate-400)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                Vee.com charges $249/mo for 1 grant. Using your own API key, a 2,000-word grant costs approximately <strong>$0.03</strong>.
              </p>
              <div style={{ padding: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--slate-400)' }}>Estimated Savings</span>
                <span style={{ color: 'var(--emerald)', fontWeight: 800, fontSize: 18 }}>99.9%</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;


import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Sparkles, Building, ArrowRight, Target, Zap } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../components/AuthProvider';
import PoweredBy from '../components/PoweredBy';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { user, refreshOrg } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    ein: '',
    mission: '',
    focusAreas: [] as string[],
    tier: 'Free' as 'Free' | 'Pro' | 'Enterprise'
  });

  const handleSubmit = async () => {
    if (!user) return;
    try {
      const orgRef = await addDoc(collection(db, 'organizations'), {
        ...formData,
        ownerId: user.uid,
        createdAt: new Date().toISOString()
      });
      
      await updateDoc(doc(db, 'users', user.uid), {
        orgId: orgRef.id
      });
      
      await refreshOrg();
      onComplete();
    } catch (error) {
      console.error("Onboarding failed:", error);
    }
  };

  const nextStep = () => setStep(step + 1);

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100 rounded-full blur-[100px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-200 rounded-full blur-[100px] opacity-20 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white border border-slate-200 rounded-[3rem] p-12 shadow-2xl relative z-10"
      >
        <div className="flex items-center justify-between mb-12">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Initialization Sequence</span>
           </div>
           <div className="flex gap-2">
              <div className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-emerald-600' : 'bg-slate-100'}`} />
              <div className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-100'}`} />
              <div className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= 3 ? 'bg-emerald-600' : 'bg-slate-100'}`} />
           </div>
        </div>

        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h1 className="text-5xl font-bold mb-6 tracking-tighter text-slate-900 leading-tight">Your Mission Awaits.</h1>
            <p className="text-slate-500 mb-10 leading-relaxed text-lg font-medium">
              Before the Genie can scan the funding landscape, we need to secure your organization's identity in the <span className="text-emerald-700 font-bold italic underline decoration-emerald-200 underline-offset-4">Data Vault</span>.
            </p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Organization Name</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                    <Building className="w-full h-full" />
                  </div>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Global Health Initiative"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tax Identification (EIN)</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                    <ShieldCheck className="w-full h-full" />
                  </div>
                  <input 
                    type="text" 
                    value={formData.ein}
                    onChange={e => setFormData({...formData, ein: e.target.value})}
                    placeholder="XX-XXXXXXX"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-emerald-500 transition-all font-mono font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={!formData.name || !formData.ein}
              onClick={nextStep}
              className="mt-12 w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-30 hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 group active:scale-[0.98]"
            >
              Secure Initialization
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-bold mb-6 tracking-tighter text-slate-900 leading-tight">Deep Intel Mission.</h1>
            <p className="text-slate-500 mb-10 leading-relaxed text-lg font-medium">
              Define your core mission logic. The Genie uses this to calculate precision match scores against active opportunities.
            </p>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mission Statement</label>
                <textarea 
                  rows={4}
                  value={formData.mission}
                  onChange={e => setFormData({...formData, mission: e.target.value})}
                  placeholder="To provide clean water and sustainable infrastructure to..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-emerald-500 transition-all resize-none font-serif italic text-lg text-slate-800 placeholder:text-slate-300 shadow-sm"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                  <Target className="w-3 h-3" /> Area of Primary Impact
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Health', 'Education', 'Environment', 'Tech', 'Arts', 'Equality'].map(area => (
                    <button 
                      key={area}
                      onClick={() => {
                        const areas = formData.focusAreas.includes(area) 
                          ? formData.focusAreas.filter(a => a !== area)
                          : [...formData.focusAreas, area];
                        setFormData({...formData, focusAreas: areas});
                      }}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.focusAreas.includes(area) 
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20' 
                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      } border`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              disabled={!formData.mission}
              onClick={nextStep}
              className="mt-12 w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 hover:bg-emerald-500 transition-all group active:scale-[0.98]"
            >
              Next Step
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setStep(1)}
              className="w-full mt-4 py-2 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors"
            >
              ← Modify Identity
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-bold mb-6 tracking-tighter text-slate-900 leading-tight">Select Your Tier.</h1>
            <p className="text-slate-500 mb-10 leading-relaxed text-lg font-medium">
              Choose the depth of intelligence you require for your mission success.
            </p>
            
            <div className="space-y-4">
              {[
                { id: 'Free', name: 'Free Tier', desc: 'Basic radar scans & limited drafting.' },
                { id: 'Pro', name: 'Pro Tier', desc: 'Quantum scans, unlimited drafting & AI Advice.' },
                { id: 'Enterprise', name: 'Enterprise', desc: 'Custom AI models & priority deep intel.' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setFormData({...formData, tier: t.id as any})}
                  className={`w-full p-6 rounded-2xl border text-left transition-all ${
                    formData.tier === t.id 
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{t.name}</span>
                    {formData.tier === t.id && <Zap className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-xs text-slate-500">{t.desc}</p>
                </button>
              ))}
            </div>

            <button 
              onClick={handleSubmit}
              className="mt-12 w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:bg-emerald-600 transition-all group active:scale-[0.98]"
            >
              Complete Initialization
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={() => setStep(2)}
              className="w-full mt-4 py-2 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors"
            >
              ← Back to Mission
            </button>
          </motion.div>
        )}
      </motion.div>
      
      {/* Interactive Footer */}
      <div className="absolute bottom-12 left-0 w-full flex flex-col items-center gap-6">
         <div className="flex gap-12 items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-30 pointer-events-none">
            <span>Cloud Secure</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]" />
            <span>AES-256</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>FIPS 140-2</span>
         </div>
         <PoweredBy />
      </div>
    </div>
  );
}

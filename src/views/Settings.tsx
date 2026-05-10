import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Settings as SettingsIcon, BrainCircuit, Target, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Settings() {
  const { organization, setOrganization, user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: organization?.name || '',
    mission: organization?.mission || '',
    ein: organization?.ein || '',
    taxStatus: organization?.taxStatus || '501(c)(3)'
  });
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    
    try {
      const orgRef = doc(db, 'organizations', user.uid);
      await setDoc(orgRef, formData, { merge: true });
      if (setOrganization) {
        setOrganization({ id: user.uid, ...formData });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error("Failed to save organization profile:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 h-full flex flex-col pb-12 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Organization Profile</h2>
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900">Settings & Alignment</h1>
        </motion.div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 rounded-xl font-bold text-xs uppercase tracking-widest text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Profile</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
               <SettingsIcon className="w-5 h-5 text-emerald-600" />
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Core Identity</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Organization Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">EIN / Tax ID</label>
                  <input 
                    type="text" 
                    value={formData.ein}
                    onChange={(e) => setFormData({...formData, ein: e.target.value})}
                    placeholder="XX-XXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Tax Status</label>
                  <select 
                    value={formData.taxStatus}
                    onChange={(e) => setFormData({...formData, taxStatus: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
                  >
                    <option value="501(c)(3)">501(c)(3) Non-Profit</option>
                    <option value="LLC">LLC</option>
                    <option value="C-Corp">C-Corporation</option>
                    <option value="Individual">Individual / Researcher</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Mission Statement</label>
                <textarea 
                  value={formData.mission}
                  onChange={(e) => setFormData({...formData, mission: e.target.value})}
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none custom-scrollbar"
                  placeholder="Describe your organization's core mission and specific programmatic goals..."
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info / Help Card */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-800 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <BrainCircuit className="w-32 h-32" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Target className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Genie Alignment Engine</h3>
              </div>

              <h4 className="text-xl font-bold tracking-tight mb-4">How your profile powers the AI</h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                The information you provide here—especially your Mission Statement—is the core context Grant Genie uses across the entire platform. 
              </p>

              <div className="space-y-4">
                <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Discovery Radar</div>
                  <p className="text-xs text-slate-300">The "Deep Scan" feature compares federal grants directly against your mission statement to generate your Match Score.</p>
                </div>
                
                <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Oracle Writer</div>
                  <p className="text-xs text-slate-300">When you use "Amplify Impact", the AI specifically rewrites your text to align with the core identity saved here.</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex items-start gap-3">
                <div className="w-1.5 h-4 bg-amber-500 rounded-full mt-0.5 shrink-0" />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                  Pro Tip: Keep your mission statement highly specific. Include your target demographic and location for better grant matching.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

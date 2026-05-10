import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Zap, 
  Globe, 
  CreditCard,
  LogOut,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function ProfileView() {
  const { user, organization } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    notifications: true,
    twoFactor: false
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="space-y-8 pb-12 w-full max-w-4xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Identity Management</h2>
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900">User Profile</h1>
        </motion.div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-red-100 rounded-xl font-bold text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" /> Terminate Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-4 flex flex-col gap-6"
        >
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-1 right-1 p-2 bg-slate-900 text-white rounded-full border-2 border-white hover:bg-emerald-600 transition-all shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{user?.displayName}</h3>
            <p className="text-sm text-slate-500 mb-6">{user?.email}</p>
            
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${organization?.tier === 'Pro' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
               <Zap className="w-3 h-3" /> {organization?.tier || 'Free'} Member
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Shield className="w-32 h-32" />
             </div>
             <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-4">Security Protocol</h4>
             <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                   <span className="text-xs font-medium text-slate-400">Status</span>
                   <span className="text-xs font-bold text-emerald-400">Verified</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xs font-medium text-slate-400">2FA</span>
                   <span className="text-xs font-bold text-slate-500">Disabled</span>
                </div>
                <button className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                   Strengthen Intel
                </button>
             </div>
          </div>
        </motion.div>

        {/* Settings List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-8 space-y-8"
        >
          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
             <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                Personal Intelligence
             </h3>
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Display Name</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={formData.displayName}
                          onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                           <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                      </div>
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Primary Email</label>
                      <div className="relative">
                        <input 
                          type="email" 
                          readOnly
                          value={formData.email}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 cursor-not-allowed"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                           <Mail className="w-4 h-4 text-slate-300" />
                        </div>
                      </div>
                   </div>
                </div>
                
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-slate-400" />
                      <div>
                         <div className="text-sm font-bold text-slate-900">Push Notifications</div>
                         <div className="text-[10px] text-slate-400 uppercase font-black">Strategic alerts & deadline signals</div>
                      </div>
                   </div>
                   <button 
                    onClick={() => setFormData({...formData, notifications: !formData.notifications})}
                    className={`w-12 h-6 rounded-full transition-all relative ${formData.notifications ? 'bg-emerald-500' : 'bg-slate-200'}`}
                   >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.notifications ? 'right-1' : 'left-1'}`} />
                   </button>
                </div>
             </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="bg-white border border-slate-200 p-8 rounded-[2rem] text-left hover:shadow-md transition-all group"
             >
                <CreditCard className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors mb-4" />
                <h4 className="font-bold text-slate-900 mb-1">Billing Intel</h4>
                <p className="text-xs text-slate-500">Manage subscriptions & invoices.</p>
             </motion.button>
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="bg-white border border-slate-200 p-8 rounded-[2rem] text-left hover:shadow-md transition-all group"
             >
                <Globe className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors mb-4" />
                <h4 className="font-bold text-slate-900 mb-1">Integrations</h4>
                <p className="text-xs text-slate-500">Connect to Grants.gov & SAM.</p>
             </motion.button>
          </div>

          <div className="flex justify-end pt-4">
             <button 
               disabled={saving}
               className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-emerald-600 transition-all flex items-center gap-2"
             >
               {saving ? 'Syncing...' : 'Update Intelligence'}
             </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

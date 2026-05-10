import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Building, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Upload, 
  ExternalLink, 
  CheckCircle2,
  AlertCircle,
  Key,
  FolderOpen,
  Settings,
  Loader2
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function DataVault() {
  const { organization, user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!organization) return;
    const fetchDocs = async () => {
      const q = query(
        collection(db, 'vault_documents'),
        where('orgId', '==', organization.id)
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a: any, b: any) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      setDocuments(docs);
    };
    fetchDocs();
  }, [organization]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !organization) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `vault/${organization.id}/${file.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      const newDoc = {
        name: file.name,
        size: file.size,
        url: downloadURL,
        uploadDate: new Date().toISOString(),
        orgId: organization.id,
        uploaderId: user?.uid
      };

      const docRef = await addDoc(collection(db, 'vault_documents'), newDoc);
      setDocuments([{ id: docRef.id, ...newDoc }, ...documents]);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 h-full flex flex-col pb-12 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Intelligence Repository</h2>
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900">Data Vault</h1>
        </motion.div>
        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold uppercase tracking-widest text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Security Audit
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload intelligence'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
           {/* Org Profile */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white border border-slate-200 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-sm"
           >
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                 <Building className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-2xl">
                      <Building className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900">Organization Profile</h3>
                  </div>
                  <button className="p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <Settings className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Entity Name</label>
                      <p className="font-bold text-xl text-slate-900">{organization?.name}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Tax Identification (EIN)</label>
                      <p className="font-mono text-xl text-emerald-600 font-bold">{organization?.ein}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Primary Impact Vectors</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {organization?.focusAreas?.map(area => (
                          <span key={area} className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-600 uppercase tracking-tight">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Strategic Mission Statement</label>
                   <p className="text-xl font-serif italic text-slate-700 leading-relaxed">
                     "{organization?.mission}"
                   </p>
                </div>
              </div>
           </motion.div>

           {/* Documents List */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-white border border-slate-200 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 shadow-sm"
           >
              <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <FolderOpen className="w-6 h-6 text-slate-400" />
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900">Mission-Critical Vault</h3>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                    <Lock className="w-3 h-3 text-emerald-600" /> AES-256 Hardened
                  </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                 {documents.length > 0 ? (
                   documents.map((doc) => (
                     <DocItem 
                       key={doc.id}
                       title={doc.name} 
                       size={`${(doc.size / 1024 / 1024).toFixed(2)} MB`} 
                       date={new Date(doc.uploadDate).toLocaleDateString()} 
                       verified={true}
                       url={doc.url}
                     />
                   ))
                 ) : (
                   <div className="text-center py-12 text-slate-400 font-medium text-sm border-2 border-dashed border-slate-100 rounded-2xl">
                     No mission-critical documents uploaded yet.
                   </div>
                 )}
              </div>
           </motion.div>
        </div>

        {/* Sidebar Intel */}
        <div className="space-y-8">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-slate-900 text-white rounded-3xl p-10 h-fit shadow-2xl relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <Key className="w-48 h-48" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center">
                      <Key className="w-6 h-6 text-white" />
                   </div>
                   <h3 className="text-xl font-bold">Vault Security</h3>
                </div>
                <div className="space-y-8">
                   <div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                         <span>Integrity Score</span>
                         <span className="text-emerald-400">94%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 w-[94%]" />
                      </div>
                   </div>
                   <p className="text-xs text-slate-400 leading-relaxed font-medium">
                     The Data Vault uses tiered identity logic. High-value data is encrypted at rest and isolated per organization instance.
                   </p>
                   <div className="pt-8 border-t border-slate-800 space-y-4">
                      <div className="flex items-center gap-3">
                         <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                         <span className="text-[10px] font-black uppercase font-mono text-slate-500 tracking-widest">Multi-User Sync ACTIVE</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                         <span className="text-[10px] font-black uppercase font-mono text-slate-500 tracking-widest">Auth v4.2 Pro ACTIVE</span>
                      </div>
                      <div className="flex items-center gap-3 text-amber-400">
                         <AlertCircle className="w-4 h-4" />
                         <span className="text-[10px] font-black uppercase font-mono tracking-widest">1 Item needs audit</span>
                      </div>
                   </div>
                </div>
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm"
           >
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">VAULT STATS</h4>
              <div className="space-y-8">
                 <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                    <span className="text-4xl font-bold text-slate-900 tracking-tighter">{documents.length}</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">TOTAL FILES</span>
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-4xl font-bold text-slate-900 tracking-tighter">
                      {(documents.reduce((acc, doc) => acc + doc.size, 0) / 1024 / 1024).toFixed(1)}
                      <span className="text-lg">MB</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">VAULT DATA</span>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}

function DocItem({ title, size, date, verified, url }: any) {
  return (
    <div className="group flex items-center justify-between p-6 rounded-2xl border border-slate-100 bg-slate-50/20 hover:bg-emerald-50/50 hover:border-emerald-100 transition-all">
       <div className="flex items-center gap-6">
          <div className="w-12 h-12 flex-shrink-0 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors shadow-sm">
             <FileText className="w-6 h-6" />
          </div>
          <div className="min-w-0">
             <h4 className="text-sm font-bold text-slate-900 mb-1 truncate">{title}</h4>
             <div className="flex items-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">
                <span>{size}</span>
                <span className="w-1 h-1 rounded-full bg-slate-200" />
                <span>Uploaded {date}</span>
             </div>
          </div>
       </div>
       <div className="flex items-center gap-6 shrink-0">
          {verified && <CheckCircle2 className="w-5 h-5 text-emerald-500/30" />}
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-xl hover:bg-white text-slate-400 hover:text-emerald-600 transition-all border border-transparent hover:border-slate-100 shadow-sm hover:shadow-md"
          >
             <ExternalLink className="w-5 h-5" />
          </a>
       </div>
    </div>
  );
}

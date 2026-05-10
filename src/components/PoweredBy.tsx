import React from 'react';

export default function PoweredBy() {
  return (
    <a 
      href="https://lumenlabsatl.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 group transition-all hover:opacity-80"
    >
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Powered by</span>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Lumen Labs</span>
      </div>
    </a>
  );
}

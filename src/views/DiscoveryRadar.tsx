import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, 
  Target, 
  ChevronRight, 
  ExternalLink, 
  Sparkles, 
  Zap,
  LayoutGrid,
  FileSearch,
  Filter,
  Search,
  X,
  ArrowUpDown,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../components/AuthProvider';
import { Grant } from '../types';
import { generateGrantIntel, searchGlobalGrants } from '../services/geminiService';
import GrantIntelligence from './GrantIntelligence';

export default function DiscoveryRadar({ onStartDraft }: { onStartDraft: (g: any) => void }) {
  const { organization } = useAuth();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [scanning, setScanning] = useState(false);
  const [viewingIntelligence, setViewingIntelligence] = useState<Grant | null>(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'deadline' | 'matchScore'>('deadline');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchGrants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'grants'));
        const grantList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Grant));
        
        if (grantList.length === 0) {
          setGrants(MOCK_GRANTS);
        } else {
          setGrants(grantList);
        }
      } catch (err) {
        console.error("Error fetching grants:", err);
        setGrants(MOCK_GRANTS);
      } finally {
        setLoading(false);
      }
    };
    fetchGrants();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    grants.forEach(g => g.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [grants]);

  const filteredGrants = useMemo(() => {
    let result = grants.filter(g => {
      const matchScore = g.matchScore || 0;
      const passesScore = matchScore >= minMatchScore;
      const passesTags = activeTags.length === 0 || activeTags.some(t => g.tags.includes(t));
      
      const searchLower = searchTerm.toLowerCase();
      const passesSearch = searchTerm === '' || 
        g.title.toLowerCase().includes(searchLower) || 
        g.description.toLowerCase().includes(searchLower) ||
        g.funder.toLowerCase().includes(searchLower);

      return passesScore && passesTags && passesSearch;
    });

    result.sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return (b.matchScore || 0) - (a.matchScore || 0);
    });

    return result;
  }, [grants, minMatchScore, activeTags, sortBy]);

  if (viewingIntelligence) {
    return <GrantIntelligence grant={viewingIntelligence} onBack={() => setViewingIntelligence(null)} onStartDraft={onStartDraft} />;
  }

  const handleDeepScan = async (grant: Grant) => {
    if (!organization) return;
    setScanning(true);
    try {
      const intel = await generateGrantIntel(organization.mission, grant.description);
      const updatedGrant = {
        ...grant,
        matchScore: intel.matchScore,
        matchExplanation: intel.strategicIntelligence,
        tags: intel.tags
      };
      setSelectedGrant(updatedGrant);
      setGrants(prev => prev.map(g => g.id === grant.id ? updatedGrant : g));
    } catch (err) {
      console.error("Deep scan failed:", err);
    } finally {
      setScanning(false);
    }
  };

  const handleGlobalSearch = async (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if ((!e || e.key === 'Enter') && searchTerm.trim() !== '') {
      setLoading(true);
      const query = searchTerm;
      try {
        const aiResults = await searchGlobalGrants(query);
        if (aiResults && aiResults.length > 0) {
          setGrants(prev => {
            const existingIds = new Set(prev.map(g => g.id));
            const newGrants = aiResults.filter(g => !existingIds.has(g.id));
            return [...newGrants, ...prev];
          });
          setSearchTerm(''); // Clear to show all (including new ones)
        } else {
          // If no results, we still clear search to show the user it finished
          alert("No grants found for that keyword on Grants.gov. Try a broader term.");
        }
      } catch (err) {
        console.error("AI Search failed:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleTag = (tag: string) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <div className="h-full flex flex-col xl:flex-row gap-8">
      {/* Search & List Pane */}
      <div className="flex-1 flex flex-col min-w-0 min-h-[400px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Active Scans</h2>
            <h1 className="text-3xl font-bold tracking-tighter text-slate-900">Discovery Radar</h1>
          </motion.div>
          <div className="flex flex-wrap gap-2">
            <div className="relative group flex-1 md:flex-none">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search grants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleGlobalSearch}
                className="block w-full md:w-[320px] pl-10 pr-24 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:text-slate-600 text-slate-400 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <button 
              onClick={() => {}} // We can add a similar modal here later
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 transition-all font-bold text-xs uppercase tracking-widest"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${showFilters ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Filter className="w-4 h-4" /> Filters {(activeTags.length > 0 || minMatchScore > 0) && <span className="ml-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white">!</span>}
            </button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 rounded-xl font-bold text-xs uppercase tracking-widest text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
            >
              <Radar className="w-4 h-4" /> Sync
            </motion.button>
          </div>
        </div>

        {/* Filter Controls */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Match Score Threshold */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Threshold</label>
                      <span className="text-xs font-bold text-emerald-600">{minMatchScore}%+</span>
                    </div>
                    <div className="flex gap-2">
                      {[0, 50, 70, 80, 90].map(score => (
                        <button
                          key={score}
                          onClick={() => setMinMatchScore(score)}
                          className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${minMatchScore === score ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                        >
                          {score === 0 ? 'All' : `${score}%+`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sorting */}
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Prioritization</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSortBy('deadline')}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border flex items-center justify-center gap-2 ${sortBy === 'deadline' ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                        <Calendar className="w-3 h-3" /> Near Deadlines
                      </button>
                      <button
                        onClick={() => setSortBy('matchScore')}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border flex items-center justify-center gap-2 ${sortBy === 'matchScore' ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                        <Target className="w-3 h-3" /> Best Match
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tag Selection */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Impact Vectors (Tags)</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${activeTags.includes(tag) ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                        {tag}
                      </button>
                    ))}
                    {activeTags.length > 0 && (
                      <button 
                        onClick={() => setActiveTags([])}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex-1 flex flex-col"
        >
          <div className="flex-1 overflow-auto custom-scrollbar relative">
            {loading && (
              <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                    <Radar className="w-12 h-12 text-emerald-500" />
                 </motion.div>
                 <div className="mt-4 text-[10px] font-black text-emerald-600 animate-pulse uppercase tracking-[0.4em]">Querying Global Database...</div>
              </div>
            )}
            {filteredGrants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100">
                    <Layers className="w-8 h-8 text-slate-200" />
                 </div>
                 <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Intel Matches</h3>
                 <p className="text-slate-300 text-sm mt-2 max-w-[200px] font-medium leading-relaxed">Try adjusting your keyword search or filters to reveal broader tactical signals.</p>
                 <button onClick={() => { setSearchTerm(''); setMinMatchScore(0); setActiveTags([]); }} className="mt-6 text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:underline">Reset Intelligence Stack</button>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-slate-100">
                {/* Desktop Header */}
                <div className="hidden md:flex items-center px-6 py-4 bg-slate-50 text-[10px] uppercase font-bold text-slate-400 sticky top-0 z-10 border-b border-slate-100">
                  <div className="flex-[2]">Opportunity Signal</div>
                  <div className="flex-1">Trust Provider</div>
                  <div className="flex-1">Match Intel</div>
                  <div className="flex-1 text-right">Window</div>
                </div>
                
                {/* List Body */}
                <div className="flex flex-col">
                  {filteredGrants.map((grant) => (
                    <div 
                      key={grant.id}
                      onClick={() => setSelectedGrant(grant)}
                      className={`
                        cursor-pointer transition-colors group flex flex-col md:flex-row md:items-center px-4 md:px-6 py-5 gap-4 md:gap-0
                        ${selectedGrant?.id === grant.id ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}
                      `}
                    >
                      {/* Title & Tags */}
                      <div className="flex-[2] flex items-start md:items-center gap-3">
                         <div className={`w-2 h-2 rounded-full mt-1.5 md:mt-0 shrink-0 ${grant.matchScore && grant.matchScore > 80 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-200'}`} />
                         <div>
                            <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">{grant.title}</div>
                            <div className="flex gap-1 mt-2 md:mt-1 flex-wrap">
                              {grant.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-400 uppercase">
                                  {tag}
                                </span>
                              ))}
                            </div>
                         </div>
                      </div>

                      {/* Mobile Metadata Row */}
                      <div className="flex items-center justify-between md:hidden pl-5">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{grant.funder}</span>
                         <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                           {new Date(grant.deadline).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                         </span>
                      </div>
                      
                      {/* Funder Desktop */}
                      <div className="flex-1 hidden md:block pr-4">
                        <span className="text-xs font-semibold text-slate-500 italic line-clamp-2">{grant.funder}</span>
                      </div>
                      
                      {/* Match Score */}
                      <div className="flex-1 pl-5 md:pl-0 flex items-center md:block">
                        {grant.matchScore ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${grant.matchScore}%` }}
                                className={`h-full ${grant.matchScore > 80 ? 'bg-emerald-500' : 'bg-blue-400'}`} 
                              />
                            </div>
                            <span className="text-xs font-black text-slate-900">Match: {grant.matchScore}%</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Awaiting Analysis</span>
                        )}
                      </div>
                      
                      {/* Deadline Desktop */}
                      <div className="flex-1 text-right hidden md:block font-mono text-xs font-bold text-slate-500 uppercase">
                        {new Date(grant.deadline).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Intelligence Pane */}
      <AnimatePresence mode="wait">
        {selectedGrant ? (
          <motion.div 
            key={selectedGrant.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full xl:w-[450px] shrink-0 bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl flex flex-col relative z-20"
          >
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setSelectedGrant(null)}
                className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-colors flex items-center gap-1"
              >
                ← Return to Radar
              </button>
              <a 
                href={selectedGrant.sourceUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] font-black text-emerald-600 flex items-center gap-1 hover:underline uppercase tracking-[0.2em]"
              >
                External Source <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="mb-8">
              <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">Deep Intel Briefing</div>
              <h2 className="text-2xl font-bold tracking-tighter text-slate-900 mb-6 leading-tight">{selectedGrant.title}</h2>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Max Award</div>
                    <div className="text-xl font-bold text-slate-900">${selectedGrant.amount.toLocaleString()}</div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Deadline</div>
                    <div className="text-xl font-bold text-slate-900">{new Date(selectedGrant.deadline).toLocaleDateString()}</div>
                 </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-10 pr-2 custom-scrollbar mb-8">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Narrative Scope</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic font-medium pr-4">
                  "{selectedGrant.description}"
                </p>
              </section>

              <section className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden shadow-xl border border-slate-800">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                   <Target className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Genie Alignment Score</h3>
                  </div>
                  
                  {!selectedGrant.matchScore && !scanning && (
                     <button 
                      onClick={() => handleDeepScan(selectedGrant)}
                      className="w-full bg-emerald-600 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 transition-all active:scale-[0.98] relative group"
                     >
                        <Zap className="w-3 h-3" /> Initialize Deep Scan
                        {organization?.tier === 'Free' && (
                          <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-[8px] px-2 py-0.5 rounded-full border border-slate-700 shadow-xl group-hover:bg-emerald-500 transition-colors">PRO</div>
                        )}
                     </button>
                  )}

                  {scanning && (
                    <div className="flex flex-col items-center justify-center py-6 gap-4">
                       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                          <Radar className="w-12 h-12 text-emerald-400" />
                       </motion.div>
                       <div className="text-[10px] font-black text-emerald-400 animate-pulse uppercase tracking-[0.4em]">Processing Mission logic...</div>
                    </div>
                  )}

                  {selectedGrant.matchScore && (
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Match Strength</span>
                          <span className="text-4xl font-bold text-emerald-400">{selectedGrant.matchScore}%</span>
                       </div>
                       <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedGrant.matchScore}%` }}
                            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                          />
                       </div>
                       <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-emerald-500/30 pl-4 py-2 font-medium">
                         "{selectedGrant.matchExplanation}"
                       </p>
                       <button 
                         onClick={() => setViewingIntelligence(selectedGrant)}
                         className="w-full mt-4 bg-white/10 hover:bg-white/20 border border-white/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                       >
                          <FileSearch className="w-3 h-3" /> Expand Tactical Intelligence
                       </button>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <button 
              onClick={async () => {
                try {
                  if (organization && selectedGrant) {
                     const docRef = await addDoc(collection(db, 'pipeline_grants'), {
                       grantId: selectedGrant.id,
                       orgId: organization.id,
                       title: selectedGrant.title,
                       funder: selectedGrant.funder,
                       amount: selectedGrant.amount,
                       matchScore: selectedGrant.matchScore || 0,
                       stage: 'drafting',
                       addedAt: new Date().toISOString()
                     });
                     onStartDraft({ ...selectedGrant, pipelineId: docRef.id });
                     return;
                  }
                } catch(e) { console.error("Error adding to pipeline", e); }
                onStartDraft(selectedGrant);
              }}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 active:scale-[0.98]"
            >
              Add to Pipeline <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <div className="w-full xl:w-[450px] shrink-0 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/30 min-h-[400px]">
             <div className="text-center p-12">
                <div className="w-20 h-20 bg-white rounded-3xl border border-slate-100 flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Radar className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Intelligence Ready</h3>
                <p className="text-xs text-slate-300 mt-2 max-w-[200px] mx-auto font-medium">Capture an opportunity to process alignment vectors.</p>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MOCK_GRANTS: Grant[] = [
  {
    id: '1',
    title: 'Global Health & Tech Infrastructure 2026',
    funder: 'Bill & Melinda Gates Foundation',
    amount: 1500000,
    deadline: '2026-12-15T00:00:00Z',
    description: 'Providing large-scale funding for non-profits implementing verifiable digital health systems in sub-Saharan Africa. Priority given to organizations with existing local partnerships.',
    matchScore: 92,
    matchExplanation: 'Direct alignment with your "Health" and "Technology" impact vectors. Your existing EIN validation and Data Vault structure match their scalability requirements.',
    tags: ['Health', 'Technology', 'Infrastucture'],
    sourceUrl: 'https://www.gatesfoundation.org/our-work/programs/global-health',
    active: true
  },
  {
    id: '2',
    title: 'Community Environmental Justice Grant',
    funder: 'U.S. EPA',
    amount: 250000,
    deadline: '2026-08-30T00:00:00Z',
    description: 'Funding for projects that address environmental and public health issues in disproportionately burdened communities. Focus on climate resilience and clean water access.',
    matchScore: 0,
    matchExplanation: '',
    tags: ['Environment', 'Justice', 'Community'],
    sourceUrl: 'https://www.epa.gov/environmental-justice',
    active: true
  },
  {
    id: '3',
    title: 'Educational Equity AI Initiative',
    funder: 'Google.org',
    amount: 500000,
    deadline: '2027-01-20T00:00:00Z',
    description: 'Supporting non-profits that leverage AI to close the educational achievement gap in underserved urban school districts. Must demonstrate scalable model.',
    matchScore: 78,
    matchExplanation: 'Matches your "Education" focus. Requires specific emphasis on your digital framework to hit the >90% match threshold.',
    tags: ['Education', 'AI', 'Urban'],
    sourceUrl: 'https://www.google.org/our-work/',
    active: true
  },
  {
    id: '4',
    title: 'Urban Water Resilience Challenge',
    funder: 'Rockefeller Foundation',
    amount: 1000000,
    deadline: '2026-11-05T00:00:00Z',
    description: 'Accelerating innovative water management solutions in rapidly growing cities. Part of the 100 Resilient Cities initiative.',
    matchScore: 0,
    matchExplanation: '',
    tags: ['Water', 'Urban', 'Innovation'],
    sourceUrl: 'https://www.rockefellerfoundation.org/',
    active: true
  },
  {
    id: '5',
    title: 'Sustainable Cities Pilot Program',
    funder: 'Bloomberg Philanthropies',
    amount: 2000000,
    deadline: '2027-03-12T00:00:00Z',
    description: 'Data-driven projects that help city leaders improve the quality of life for residents through climate action and public health.',
    matchScore: 0,
    matchExplanation: '',
    tags: ['Cities', 'Climate', 'Data'],
    sourceUrl: 'https://www.bloomberg.org/',
    active: true
  },
  {
    id: '6',
    title: 'Open Source Security Grant',
    funder: 'Ford Foundation',
    amount: 150000,
    deadline: '2026-09-15T00:00:00Z',
    description: 'Supporting the digital infrastructure that underpins civil society. Focus on privacy, security, and interoperability.',
    matchScore: 0,
    matchExplanation: '',
    tags: ['Technology', 'Security', 'Civil Society'],
    sourceUrl: 'https://www.fordfoundation.org/',
    active: true
  }
];

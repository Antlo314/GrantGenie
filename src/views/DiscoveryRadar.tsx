import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Radar,
  Target,
  ExternalLink,
  Sparkles,
  Search,
  X,
  Calendar,
  Layers,
  Loader2,
  RefreshCw,
  Link2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { Grant } from '../types';
import {
  analyzeGrantMatch,
  profileFromOrganization,
} from '../services/geminiService';
import { searchLiveGrants, SUGGESTED_QUERIES } from '../services/grantSearch';
import GrantIntelligence from './GrantIntelligence';

export default function DiscoveryRadar({ onStartDraft }: { onStartDraft: (g: any) => void }) {
  const { organization } = useAuth();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [scanning, setScanning] = useState(false);
  const [viewingIntelligence, setViewingIntelligence] = useState<Grant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [hitCount, setHitCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'deadline' | 'matchScore'>('deadline');
  const [liveOnly, setLiveOnly] = useState(true);

  const runLiveSearch = useCallback(async (query: string) => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setLastQuery(q);
    try {
      const result = await searchLiveGrants(q, { rows: 30 });
      if (result.error && result.grants.length === 0) {
        setError(
          `Could not reach Grants.gov (${result.error}). Check your connection or try again.`
        );
        setGrants([]);
        setHitCount(0);
      } else {
        setGrants(result.grants);
        setHitCount(result.hitCount);
        if (result.grants.length === 0) {
          setError(`No open federal opportunities found for “${q}”. Try a broader keyword.`);
        }
      }
      setSelectedGrant(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Search failed');
      setGrants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search from org mission keywords or a solid default
  useEffect(() => {
    const seed =
      organization?.focusAreas?.[0] ||
      organization?.mission?.split(/\s+/).slice(0, 3).join(' ') ||
      'community nonprofit';
    const q = seed.length > 3 ? seed : 'community development';
    setSearchTerm(q);
    runLiveSearch(q);
  }, [organization?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredGrants = useMemo(() => {
    let result = [...grants];
    if (liveOnly) {
      result = result.filter((g) => g.source === 'grants.gov' || g.sourceUrl?.includes('grants.gov'));
    }
    result.sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return (b.matchScore || 0) - (a.matchScore || 0);
    });
    return result;
  }, [grants, sortBy, liveOnly]);

  if (viewingIntelligence) {
    return (
      <GrantIntelligence
        grant={viewingIntelligence}
        onBack={() => setViewingIntelligence(null)}
        onStartDraft={onStartDraft}
      />
    );
  }

  const handleDeepScan = async (grant: Grant) => {
    if (!organization?.mission) {
      alert('Add your organization mission first (onboarding / profile) to score matches.');
      return;
    }
    setScanning(true);
    try {
      const profile = profileFromOrganization(organization, {
        projectScope: organization.mission,
        industry: organization.focusAreas?.[0] || 'nonprofit',
      });
      const analysis = await analyzeGrantMatch(profile, grant);
      const updatedGrant: Grant = {
        ...grant,
        matchScore: analysis.compositeScore,
        matchExplanation: analysis.strategicIntelligence || analysis.alignmentSummary,
        tags: Array.isArray(analysis.tags)
          ? [...new Set([...(grant.tags || []), ...analysis.tags])]
          : grant.tags,
        strategicAlignmentScore: analysis.strategicAlignmentScore,
        feasibilityScore: analysis.feasibilityScore,
        winProbability: analysis.winProbability,
        eligible: analysis.eligible,
        eligibilityFailures: analysis.eligibilityFailures,
        eligibilityPasses: analysis.eligibilityPasses,
        recommendedNextStep: analysis.recommendedNextStep,
      };
      setSelectedGrant(updatedGrant);
      setGrants((prev) => prev.map((g) => (g.id === grant.id ? updatedGrant : g)));
    } catch (err) {
      console.error('Match analysis failed:', err);
      alert('Match analysis failed. Check GEMINI_API_KEY in .env.local');
    } finally {
      setScanning(false);
    }
  };

  const onSubmitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    runLiveSearch(searchTerm);
  };

  return (
    <div className="h-full flex flex-col xl:flex-row gap-6 min-h-0">
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Header */}
        <div className="mb-5 shrink-0">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live · Grants.gov
                </span>
                {hitCount > 0 && (
                  <span className="text-xs text-slate-400 font-medium">
                    {hitCount.toLocaleString()} total hits · showing {filteredGrants.length} open
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Find open grants
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Free federal opportunities from{' '}
                <a
                  href="https://www.grants.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Grants.gov
                </a>
                . No paid API key. Search → open → match to your mission → draft.
              </p>
            </div>
            <button
              type="button"
              onClick={() => runLiveSearch(lastQuery || searchTerm || 'community')}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Search bar */}
          <form onSubmit={onSubmitSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Try education, housing, youth, STEM…"
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-medium shadow-sm focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radar className="w-4 h-4" />}
              Search live
            </button>
          </form>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setSearchTerm(q);
                  runLiveSearch(q);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  lastQuery === q
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="flex rounded-xl border border-slate-200 overflow-hidden text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSortBy('deadline')}
                className={`px-3 py-2 flex items-center gap-1.5 ${sortBy === 'deadline' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500'}`}
              >
                <Calendar className="w-3.5 h-3.5" /> Deadline
              </button>
              <button
                type="button"
                onClick={() => setSortBy('matchScore')}
                className={`px-3 py-2 flex items-center gap-1.5 ${sortBy === 'matchScore' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500'}`}
              >
                <Target className="w-3.5 h-3.5" /> Best match
              </button>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={liveOnly}
                onChange={(e) => setLiveOnly(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              Live federal only
            </label>
          </div>

          {error && (
            <div className="mt-3 flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-auto relative">
            {loading && (
              <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Querying Grants.gov…
                </p>
              </div>
            )}

            {!loading && filteredGrants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                  <Layers className="w-7 h-7 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-700">No open grants yet</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-xs">
                  Search a topic above. Results come live from the free federal Grants.gov API.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {filteredGrants.map((grant) => (
                  <li key={grant.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedGrant(grant)}
                      className={`w-full text-left px-4 sm:px-5 py-4 transition-colors ${
                        selectedGrant?.id === grant.id
                          ? 'bg-emerald-50/70'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                              {grant.source === 'grants.gov' ? 'Live' : grant.source || 'Grant'}
                            </span>
                            {grant.status && (
                              <span className="text-[10px] font-semibold uppercase text-slate-400">
                                {grant.status}
                              </span>
                            )}
                            {grant.opportunityNumber && (
                              <span className="text-[10px] font-mono text-slate-400">
                                {grant.opportunityNumber}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-900 leading-snug group-hover:text-emerald-800">
                            {grant.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 font-medium">{grant.funder}</p>
                        </div>
                        <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
                          {grant.matchScore ? (
                            <span className="text-xs font-black text-slate-800">
                              {grant.matchScore}% match
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-300 uppercase">
                              Unscored
                            </span>
                          )}
                          <span className="text-xs font-mono font-semibold text-slate-500">
                            {new Date(grant.deadline).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Detail pane */}
      <AnimatePresence mode="wait">
        {selectedGrant ? (
          <motion.aside
            key={selectedGrant.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            className="xl:w-[380px] shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col max-h-full overflow-auto"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Grants.gov live
              </span>
              <button
                type="button"
                onClick={() => setSelectedGrant(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug mb-2">{selectedGrant.title}</h2>
            <p className="text-sm text-slate-500 font-medium mb-3">{selectedGrant.funder}</p>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{selectedGrant.description}</p>

            {selectedGrant.matchScore > 0 && (
              <div className="mb-4 space-y-3">
                <div
                  className={`p-3 rounded-xl border ${
                    selectedGrant.eligible === false
                      ? 'bg-red-50 border-red-100'
                      : 'bg-emerald-50 border-emerald-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-800">
                      Module 2 · Match analysis
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        selectedGrant.winProbability === 'High'
                          ? 'bg-emerald-600 text-white'
                          : selectedGrant.winProbability === 'Medium'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-400 text-white'
                      }`}
                    >
                      Win: {selectedGrant.winProbability || '—'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <ScoreChip label="Composite" value={selectedGrant.matchScore} />
                    <ScoreChip
                      label="Alignment"
                      value={selectedGrant.strategicAlignmentScore ?? selectedGrant.matchScore}
                    />
                    <ScoreChip
                      label="Feasibility"
                      value={selectedGrant.feasibilityScore ?? 0}
                    />
                  </div>
                  {selectedGrant.eligible === false && (
                    <p className="text-[11px] font-bold text-red-700 mb-1">
                      Strict eligibility: not recommended
                    </p>
                  )}
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedGrant.matchExplanation}
                  </p>
                  {selectedGrant.eligibilityFailures && selectedGrant.eligibilityFailures.length > 0 && (
                    <ul className="mt-2 text-[11px] text-red-700 list-disc pl-4 space-y-0.5">
                      {selectedGrant.eligibilityFailures.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  )}
                  {selectedGrant.recommendedNextStep && (
                    <p className="mt-2 text-[11px] font-semibold text-slate-600">
                      Next: {selectedGrant.recommendedNextStep}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 mb-5">
              {selectedGrant.tags.slice(0, 8).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 uppercase"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <a
                href={selectedGrant.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <ExternalLink className="w-4 h-4" />
                Open on Grants.gov
              </a>
              <button
                type="button"
                disabled={scanning}
                onClick={() => handleDeepScan(selectedGrant)}
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 disabled:opacity-50"
              >
                {scanning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Run match analysis
              </button>
              <button
                type="button"
                onClick={() => onStartDraft(selectedGrant)}
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
              >
                <Link2 className="w-4 h-4" />
                Write proposal
              </button>
            </div>
          </motion.aside>
        ) : (
          <motion.aside
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden xl:flex xl:w-[380px] shrink-0 border border-dashed border-slate-200 rounded-2xl items-center justify-center p-8 text-center bg-slate-50/50"
          >
            <div>
              <Radar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500">Select a grant</p>
              <p className="text-xs text-slate-400 mt-1">
                View details, score against your mission, or open the official posting.
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScoreChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white/80 border border-black/5 px-2 py-1.5 text-center">
      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-sm font-black text-slate-900">{value}%</div>
    </div>
  );
}

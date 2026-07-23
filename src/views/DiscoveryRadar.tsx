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
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  XCircle,
  Bookmark,
  Check,
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../components/AuthProvider';
import { Grant } from '../types';
import {
  analyzeGrantMatch,
  profileFromOrganization,
} from '../services/geminiService';
import { SUGGESTED_QUERIES } from '../services/grantSearch';
import { searchOpportunities } from '../services/searchHub';
import { getPortalForState } from '../services/sources/statePortals';
import GrantIntelligence from './GrantIntelligence';
import PageHeader from '../components/PageHeader';
import InfoTip from '../components/InfoTip';
import GenieAvatar from '../components/GenieAvatar';
import { BRAND } from '../lib/brand';
import { GLOSSARY, PAGE_HINTS } from '../lib/hints';
import SpecsBar, { keywordsToQuery } from '../components/SpecsBar';

const CONTRACT_QUERIES = [
  'construction',
  'information technology',
  'janitorial',
  'medical supplies',
  'training',
  'engineering',
];

export default function DiscoveryRadar({
  onStartDraft,
  sector = 'grants',
  onSectorChange,
}: {
  onStartDraft: (g: any) => void;
  sector?: 'grants' | 'contracts';
  onSectorChange?: (s: 'grants' | 'contracts') => void;
}) {
  const { organization, profile } = useAuth();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [scanning, setScanning] = useState(false);
  const [viewingIntelligence, setViewingIntelligence] = useState<Grant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [hitCount, setHitCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sourceNote, setSourceNote] = useState<string | null>(null);
  const [sourceRuns, setSourceRuns] = useState<
    { id: string; ok: boolean; count: number; error?: string; note?: string }[]
  >([]);
  const [sortBy, setSortBy] = useState<'deadline' | 'matchScore'>('deadline');
  const [openOnly, setOpenOnly] = useState(sector === 'grants');
  const [isExpandedDetail, setIsExpandedDetail] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);

  const saveGrant = async (grant: Grant, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!grant || savedIds.has(grant.id) || savingId === grant.id) return;
    const orgId = organization?.id;
    if (!orgId) {
      alert('Organization profile required to save grants.');
      return;
    }
    setSavingId(grant.id);
    try {
      await addDoc(collection(db, 'pipeline_grants'), {
        orgId,
        grantId: grant.id,
        title: grant.title || '',
        funder: grant.funder || '',
        amount: grant.amount || 0,
        matchScore: grant.matchScore || 0,
        description: grant.description || '',
        sourceUrl: grant.sourceUrl || '',
        stage: 'discovery',
        createdAt: new Date().toISOString(),
      });
      setSavedIds((prev) => new Set(prev).add(grant.id));
    } catch (err) {
      console.error('Failed to save grant to pipeline:', err);
      alert('Failed to save grant to pipeline.');
    } finally {
      setSavingId(null);
    }
  };

  const hasActiveDateFilter = dateFrom || dateTo;

  const isContracts = sector === 'contracts';
  const chips = isContracts ? CONTRACT_QUERIES : SUGGESTED_QUERIES;
  const statePortal = getPortalForState(profile?.state);

  const runLiveSearch = useCallback(
    async (query: string) => {
      const q = query.trim();
      if (!q) return;
      setLoading(true);
      setError(null);
      setSourceNote(null);
      setSourceRuns([]);
      setLastQuery(q);
      try {
        const result = await searchOpportunities(q, sector, { rows: 30 });
        setSourceNote(result.note || null);
        setSourceRuns(result.sourceRuns || []);
        if (result.error && result.grants.length === 0) {
          setError(result.error);
          setGrants([]);
          setHitCount(0);
        } else {
          setGrants(result.grants);
          setHitCount(result.hitCount);
          if (result.grants.length === 0) {
            setError(
              isContracts
                ? `No contract results for “${q}”. Try a broader word, or add SAM_API_KEY for open solicitations.`
                : `No grant results for “${q}”. Try a broader keyword, or add SIMPLER_GRANTS_API_KEY.`
            );
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
    },
    [sector, isContracts]
  );

  useEffect(() => {
    const seed =
      keywordsToQuery(profile?.keywords || []) ||
      organization?.focusAreas?.[0] ||
      (isContracts ? 'construction' : 'community development');
    const q = seed.length > 2 ? seed : isContracts ? 'services' : 'community development';
    setSearchTerm(q);
    setOpenOnly(!isContracts);
    runLiveSearch(q);
  }, [organization?.id, profile?.uid, sector, profile?.keywords?.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredGrants = useMemo(() => {
    let result = [...grants];
    if (openOnly && !isContracts) {
      result = result.filter(
        (g) => g.isOpenOpportunity !== false && (g.source === 'grants.gov' || g.sourceUrl?.includes('grants.gov'))
      );
    }
    // Date range filter
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      result = result.filter((g) => new Date(g.deadline).getTime() >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86_400_000 - 1; // inclusive end of day
      result = result.filter((g) => new Date(g.deadline).getTime() <= to);
    }
    result.sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return (b.matchScore || 0) - (a.matchScore || 0);
    });
    return result;
  }, [grants, sortBy, openOnly, isContracts, dateFrom, dateTo]);

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
    const mission = profile?.description || organization?.mission;
    if (!mission) {
      alert('Add a short description of what you do (Profile) so we can score the fit.');
      return;
    }
    setScanning(true);
    try {
      const applicant = profileFromOrganization(organization, {
        projectScope: mission,
        industry: profile?.keywords?.[0] || organization?.focusAreas?.[0] || 'general',
        geography: profile?.state || 'United States',
        orgName: profile?.name || organization?.name,
      });
      const analysis = await analyzeGrantMatch(applicant, grant);
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

  const ph = PAGE_HINTS.radar;

  return (
    <div className="h-full flex flex-col xl:flex-row gap-6 min-h-0">
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Header */}
        <div className="mb-5 shrink-0">
          <PageHeader
            title={isContracts ? 'Find contracts' : 'Find open grants'}
            subtitle={ph.subtitle}
            hint={
              isContracts
                ? `${ph.hint} ${GLOSSARY.openVsPast.body}`
                : ph.hint
            }
            infoTitle={isContracts ? GLOSSARY.contract.title : GLOSSARY.grant.title}
            infoBody={
              <>
                <p className="mb-2">{isContracts ? GLOSSARY.contract.body : GLOSSARY.grant.body}</p>
                <p>{GLOSSARY.officialPage.body}</p>
              </>
            }
            actions={
              <button
                type="button"
                onClick={() => runLiveSearch(lastQuery || searchTerm || 'community')}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm font-semibold text-slate-700 hover:bg-emerald-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            }
          />
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isContracts ? 'SAM + USASpending' : 'Live · Grants.gov'}
                </span>
                <InfoTip title={GLOSSARY.openVsPast.title} label="Open vs past">
                  {GLOSSARY.openVsPast.body}
                </InfoTip>
                {hitCount > 0 && (
                  <span className="text-xs text-slate-400 font-medium">
                    {hitCount.toLocaleString()} total · showing {filteredGrants.length}
                  </span>
                )}
              </div>
              {onSectorChange && (
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => onSectorChange('grants')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                      !isContracts
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Grants (free money)
                  </button>
                  <button
                    type="button"
                    onClick={() => onSectorChange('contracts')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                      isContracts
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Contracts (paid work)
                  </button>
                </div>
              )}
              {statePortal && (
                <p className="text-xs text-slate-500 mt-1">
                  Your state ({statePortal.stateName}):{' '}
                  {statePortal.grantsUrl && !isContracts && (
                    <a
                      href={statePortal.grantsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-semibold hover:underline mr-2"
                    >
                      State grants site
                    </a>
                  )}
                  {statePortal.contractsUrl && isContracts && (
                    <a
                      href={statePortal.contractsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-semibold hover:underline"
                    >
                      State contracts site
                    </a>
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <SpecsBar
              compact
              onSpecsChange={(kw) => {
                const q = keywordsToQuery(kw);
                setSearchTerm(q);
                void runLiveSearch(q);
              }}
            />
          </div>

          {/* Search bar */}
          <form
            data-tour="search"
            onSubmit={onSubmitSearch}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Or type any keyword…"
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
            {chips.map((q) => (
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
            {/* Sort toggle */}
            <div className="flex rounded-xl border border-slate-200 overflow-hidden text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSortBy('deadline')}
                className={`px-3 py-2 flex items-center gap-1.5 transition-colors ${sortBy === 'deadline' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
              >
                <Calendar className="w-3.5 h-3.5" /> {isContracts ? 'End date' : 'Deadline'}
              </button>
              <button
                type="button"
                onClick={() => setSortBy('matchScore')}
                className={`px-3 py-2 flex items-center gap-1.5 transition-colors ${sortBy === 'matchScore' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
              >
                <Target className="w-3.5 h-3.5" /> Best match
              </button>
            </div>

            {/* Date filter button */}
            <button
              type="button"
              onClick={() => setShowDateFilter((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                hasActiveDateFilter
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : showDateFilter
                    ? 'bg-slate-100 border-slate-300 text-slate-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {hasActiveDateFilter ? 'Date filter on' : 'Filter by date'}
              {hasActiveDateFilter && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); setDateFrom(''); setDateTo(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && (setDateFrom(''), setDateTo(''))}
                  className="ml-1 hover:opacity-70"
                  aria-label="Clear date filter"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </span>
              )}
            </button>

            {!isContracts && (
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={openOnly}
                  onChange={(e) => setOpenOnly(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Open only
              </label>
            )}
          </div>

          {/* Date filter panel */}
          <AnimatePresence>
            {showDateFilter && (
              <motion.div
                key="date-filter"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="glass-panel border border-slate-200/70 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    Deadline range
                  </div>
                  <div className="flex flex-wrap items-center gap-3 flex-1">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="date-from" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From</label>
                      <input
                        id="date-from"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 outline-none cursor-pointer"
                      />
                    </div>
                    <span className="text-slate-300 font-bold mt-4 hidden sm:block">—</span>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="date-to" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">To</label>
                      <input
                        id="date-to"
                        type="date"
                        value={dateTo}
                        min={dateFrom || undefined}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 outline-none cursor-pointer"
                      />
                    </div>
                    {hasActiveDateFilter && (
                      <button
                        type="button"
                        onClick={() => { setDateFrom(''); setDateTo(''); }}
                        className="mt-4 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors underline underline-offset-2"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {hasActiveDateFilter && (
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest shrink-0 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                      {filteredGrants.length} result{filteredGrants.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {sourceNote && (
            <div className="mt-3 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 leading-relaxed">
              {sourceNote}
            </div>
          )}

          {sourceRuns.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {sourceRuns.map((s) => (
                <span
                  key={s.id}
                  title={s.error || s.note || s.id}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    s.count > 0
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : s.error?.includes('not set')
                        ? 'bg-slate-50 text-slate-500 border-slate-200'
                        : s.ok
                          ? 'bg-slate-50 text-slate-500 border-slate-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      s.count > 0 ? 'bg-emerald-500' : s.error?.includes('not set') ? 'bg-slate-300' : 'bg-amber-400'
                    }`}
                  />
                  {s.id}
                  {s.count > 0 ? ` · ${s.count}` : s.error?.includes('not set') ? ' · needs key' : s.error ? ' · fail' : ' · 0'}
                </span>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results */}
        <div
          data-tour="results"
          className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <div className="flex-1 overflow-auto relative">
            {loading && (
              <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-emerald-700">
                  {isContracts ? 'Searching USASpending…' : 'Searching Grants.gov…'}
                </p>
              </div>
            )}

            {!loading && filteredGrants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                <GenieAvatar src={BRAND.assets.wave} size={96} float className="mb-2" />
                <h3 className="font-bold text-slate-800 text-lg">Nothing matched that search</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
                  Try a simpler word like “education”, “construction”, or “health”. Results come from free
                  U.S. government databases — we never invent listings.
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
                          <div className="flex items-center gap-2">
                            {grant.matchScore ? (
                              <span className="text-xs font-black text-slate-800">
                                {grant.matchScore}% match
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-300 uppercase">
                                Unscored
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => saveGrant(grant, e)}
                              disabled={savedIds.has(grant.id) || savingId === grant.id}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                savedIds.has(grant.id)
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600 font-bold'
                                  : 'bg-white border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200'
                              }`}
                              title={savedIds.has(grant.id) ? 'Saved to Pipeline' : 'Save to Pipeline'}
                            >
                              {savingId === grant.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                              ) : savedIds.has(grant.id) ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Bookmark className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
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
            className="xl:w-[420px] w-full shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6 flex flex-col max-h-[85vh] xl:max-h-full overflow-auto custom-scrollbar"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Grants.gov live
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpandedDetail(true)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                  title="Expand Full View"
                >
                  <Maximize2 className="w-4 h-4 text-emerald-600" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGrant(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug mb-2">{selectedGrant.title}</h2>
            <p className="text-sm text-slate-500 font-medium mb-4">{selectedGrant.funder}</p>

            {/* What is this & why it fits you */}
            <div className="mb-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                  <span>🟢</span> What this grant is about
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {selectedGrant.description || 'No description available for this grant.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                  <span>🟣</span> Why it could be a fit for you
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {selectedGrant.matchExplanation ? (
                    selectedGrant.matchExplanation
                  ) : (
                    <>
                      Based on your profile ({organization?.focusAreas?.[0] || profile?.keywords?.[0] || 'workforce development'}, {profile?.state || 'Maryland'}), this is a potential match — click "Run match analysis" below to check exact score.
                    </>
                  )}
                </p>
              </div>
            </div>

            {selectedGrant.matchScore > 0 && (
              <div className="mb-4 space-y-3">
                <div
                  className={`p-4 rounded-2xl border ${
                    selectedGrant.eligible === false
                      ? 'bg-red-50 border-red-100'
                      : 'bg-emerald-50 border-emerald-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-800">
                      Match analysis
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

            <div className="mt-auto flex flex-col gap-2 pt-4">
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
                onClick={(e) => saveGrant(selectedGrant, e)}
                disabled={savedIds.has(selectedGrant.id) || savingId === selectedGrant.id}
                className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl border text-sm font-bold transition-all ${
                  savedIds.has(selectedGrant.id)
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                    : 'bg-white border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {savingId === selectedGrant.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                ) : savedIds.has(selectedGrant.id) ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    Saved ✓
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-emerald-600" />
                    Save this
                  </>
                )}
              </button>

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

      {/* Expanded Full Screen Grant Detail Modal */}
      <AnimatePresence>
        {isExpandedDetail && selectedGrant && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-8 bg-slate-900/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-4xl p-6 sm:p-10 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-2">
                    <CheckCircle2 className="w-4 h-4" /> Official Posting
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedGrant.title}</h2>
                  <p className="text-sm text-slate-500 font-medium">{selectedGrant.funder}</p>
                </div>
                <button 
                  onClick={() => setIsExpandedDetail(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              <div className="space-y-6 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Award Ceiling</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">
                      {selectedGrant.amount > 0 ? `$${Number(selectedGrant.amount).toLocaleString()}` : 'See NOFO'}
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">
                      {new Date(selectedGrant.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Score</div>
                    <div className="text-xl font-bold text-emerald-600 mt-1">
                      {selectedGrant.matchScore ? `${selectedGrant.matchScore}%` : 'Unscored'}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Full Description & Scope</h4>
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                    {selectedGrant.description}
                  </div>
                </div>

                {selectedGrant.matchExplanation && (
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">AI Match Intelligence</h4>
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-sm text-slate-800 leading-relaxed">
                      {selectedGrant.matchExplanation}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
                <a
                  href={selectedGrant.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <ExternalLink className="w-4 h-4" /> Open Grants.gov
                </a>
                <button
                  onClick={() => {
                    setIsExpandedDetail(false);
                    onStartDraft(selectedGrant);
                  }}
                  className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Link2 className="w-4 h-4" /> Write Proposal
                </button>
              </div>
            </motion.div>
          </div>
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

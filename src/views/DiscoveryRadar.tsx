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
  CircleDot,
  Loader2,
  RefreshCw,
  Link2,
  CheckCircle2,
  AlertCircle,
  Maximize2,
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
import PageHeader from '../components/PageHeader';
import InfoTip from '../components/InfoTip';
import { EmptyState } from '../components/ui';
import { BRAND } from '../lib/brand';
import { GLOSSARY, PAGE_HINTS } from '../lib/hints';
import SpecsBar, { keywordsToQuery } from '../components/SpecsBar';
import { trackEvent } from '../lib/activityStore';

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
  const { organization, profile, user } = useAuth();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [scanning, setScanning] = useState(false);
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
  const [notice, setNotice] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  // Toasts auto-dismiss
  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(t);
  }, [notice]);

  const saveGrant = async (grant: Grant, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!grant || savedIds.has(grant.id) || savingId === grant.id) return;
    const orgId = organization?.id;
    if (!orgId) {
      setNotice({
        kind: 'error',
        text: 'Finish your profile first (Settings page) so we know where to save this.',
      });
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
      if (user?.uid) trackEvent(user.uid, 'save');
      setNotice({ kind: 'success', text: 'Saved! Find it anytime under My applications.' });
    } catch (err) {
      console.error('Failed to save grant to pipeline:', err);
      setNotice({
        kind: 'error',
        text: 'Could not save right now — check your connection and try again.',
      });
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
          if (user?.uid) trackEvent(user.uid, 'search');
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
    [sector, isContracts, user?.uid]
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

  const handleDeepScan = async (grant: Grant) => {
    const mission = profile?.description || organization?.mission;
    if (!mission) {
      setNotice({
        kind: 'error',
        text: 'Add a short description of what you do (Profile page) so we can score the fit.',
      });
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
      setNotice({
        kind: 'error',
        text: 'Match analysis is unavailable right now (AI key missing or offline). You can still open the official page.',
      });
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
    <div className="h-full flex flex-col xl:flex-row gap-6 min-h-0 relative">
      {/* Toast */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-[120] flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl backdrop-blur ${
              notice.kind === 'success'
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/95 border-amber-200 text-amber-900'
            }`}
            role="status"
          >
            {notice.kind === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            {notice.text}
          </motion.div>
        )}
      </AnimatePresence>

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
                className="btn btn-secondary"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            }
          />
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 glass-emerald px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                  {isContracts ? 'SAM + USASpending' : 'Live · Grants.gov'}
                </span>
                <InfoTip title={GLOSSARY.openVsPast.title} label="Open vs past">
                  {GLOSSARY.openVsPast.body}
                </InfoTip>
                {hitCount > 0 && (
                  <span className="text-xs text-slate-500 font-medium">
                    <span className="font-mono">{hitCount.toLocaleString()}</span> total · showing{' '}
                    <span className="font-mono">{filteredGrants.length}</span>
                  </span>
                )}
              </div>
              {onSectorChange && (
                <div className="flex gap-2 mb-3" role="group" aria-label="Choose grants or contracts">
                  <button
                    type="button"
                    onClick={() => onSectorChange('grants')}
                    aria-pressed={!isContracts}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                      !isContracts
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25'
                        : 'bg-white/80 text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
                    }`}
                  >
                    Grants (free money)
                  </button>
                  <button
                    type="button"
                    onClick={() => onSectorChange('contracts')}
                    aria-pressed={isContracts}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                      isContracts
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25'
                        : 'bg-white/80 text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
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
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Or type any keyword…"
                className="field !pl-10 !pr-10 font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              className="btn btn-primary"
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
                aria-pressed={lastQuery === q}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  lastQuery === q
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'bg-white/80 border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            {/* Sort toggle */}
            <div className="flex rounded-xl border border-slate-200 bg-white/80 overflow-hidden text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSortBy('deadline')}
                aria-pressed={sortBy === 'deadline'}
                className={`px-3 py-2 flex items-center gap-1.5 transition-colors ${sortBy === 'deadline' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Calendar className="w-3.5 h-3.5" /> {isContracts ? 'End date' : 'Deadline'}
              </button>
              <button
                type="button"
                onClick={() => setSortBy('matchScore')}
                aria-pressed={sortBy === 'matchScore'}
                className={`px-3 py-2 flex items-center gap-1.5 transition-colors ${sortBy === 'matchScore' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Target className="w-3.5 h-3.5" /> Best match
              </button>
            </div>

            {/* Date filter toggle + clear */}
            <div
              className={`inline-flex items-stretch rounded-xl border text-xs font-semibold overflow-hidden transition-all ${
                hasActiveDateFilter
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : showDateFilter
                    ? 'bg-slate-100 border-slate-300 text-slate-700'
                    : 'bg-white/80 border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setShowDateFilter((v) => !v)}
                aria-expanded={showDateFilter}
                className="inline-flex items-center gap-1.5 px-3 py-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {hasActiveDateFilter ? 'Date filter on' : 'Filter by date'}
              </button>
              {hasActiveDateFilter && (
                <button
                  type="button"
                  onClick={() => { setDateFrom(''); setDateTo(''); }}
                  className="inline-flex items-center pl-0.5 pr-2.5 hover:opacity-70 transition-opacity"
                  aria-label="Clear date filter"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {!isContracts && (
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
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
                <div className="glass-panel rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-500 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    Deadline range
                  </div>
                  <div className="flex flex-wrap items-center gap-3 flex-1">
                    <div className="flex flex-col gap-1 w-44">
                      <label htmlFor="date-from" className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">From</label>
                      <input
                        id="date-from"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="field font-mono cursor-pointer"
                      />
                    </div>
                    <span className="text-slate-400 font-bold mt-5 hidden sm:block" aria-hidden="true">—</span>
                    <div className="flex flex-col gap-1 w-44">
                      <label htmlFor="date-to" className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">To</label>
                      <input
                        id="date-to"
                        type="date"
                        value={dateTo}
                        min={dateFrom || undefined}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="field font-mono cursor-pointer"
                      />
                    </div>
                    {hasActiveDateFilter && (
                      <button
                        type="button"
                        onClick={() => { setDateFrom(''); setDateTo(''); }}
                        className="btn btn-ghost btn-sm mt-5"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {hasActiveDateFilter && (
                    <div className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-widest shrink-0 glass-emerald px-2.5 py-1 rounded-full">
                      <span className="font-mono">{filteredGrants.length}</span> result{filteredGrants.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {sourceNote && (
            <div className="mt-3 text-xs text-slate-600 glass-panel rounded-2xl px-4 py-3 leading-relaxed">
              {sourceNote}
            </div>
          )}

          {sourceRuns.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {sourceRuns.map((s) => (
                <span
                  key={s.id}
                  title={s.error || s.note || s.id}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
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
                    aria-hidden="true"
                    className={`w-1.5 h-1.5 rounded-full ${
                      s.count > 0 ? 'bg-emerald-500' : s.error?.includes('not set') ? 'bg-slate-300' : 'bg-amber-400'
                    }`}
                  />
                  {s.id}
                  {s.count > 0 ? (
                    <> · <span className="font-mono">{s.count}</span> results</>
                  ) : s.error?.includes('not set') ? (
                    <> · add free key</>
                  ) : s.error ? (
                    <> · unavailable</>
                  ) : (
                    <> · <span className="font-mono">0</span> results</>
                  )}
                </span>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-start gap-2 text-sm text-amber-900 bg-amber-50/90 border border-amber-200 rounded-2xl px-4 py-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results */}
        <motion.div
          data-tour="results"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 26 }}
          className="glass-panel rounded-[2rem] flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <div className="flex-1 overflow-auto custom-scrollbar relative">
            {loading && (
              <div className="absolute inset-0 z-10 bg-white/75 backdrop-blur-[2px] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-emerald-700">
                  {isContracts ? 'Searching USASpending…' : 'Searching Grants.gov…'}
                </p>
              </div>
            )}

            {!loading && filteredGrants.length === 0 ? (
              <EmptyState
                className="h-full"
                image={BRAND.assets.wave}
                title="Nothing matched that search"
                body="Try a simpler, broader word — one tap below runs a fresh search. Results come from free U.S. government databases; we never invent listings."
                action={
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                      {(isContracts
                        ? ['construction', 'training', 'services']
                        : ['education', 'health', 'community']
                      ).map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => {
                            setSearchTerm(q);
                            void runLiveSearch(q);
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          Try “{q}”
                        </button>
                      ))}
                    </div>
                    {openOnly && !isContracts && grants.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setOpenOnly(false)}
                        className="text-xs font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
                      >
                        Or show <span className="font-mono">{grants.length}</span> result{grants.length === 1 ? '' : 's'} hidden by the
                        “Open only” filter
                      </button>
                    )}
                  </div>
                }
              />
            ) : (
              <ul className="p-3 sm:p-4 space-y-2.5">
                {filteredGrants.map((grant, i) => (
                  <motion.li
                    key={grant.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.4), type: 'spring', stiffness: 260, damping: 26 }}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedGrant(grant)}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedGrant(grant)}
                      className={`card-3d w-full cursor-pointer rounded-2xl border px-4 sm:px-5 py-4 transition-colors ${
                        selectedGrant?.id === grant.id
                          ? 'glass-emerald'
                          : 'bg-white/70 border-white/80 hover:border-emerald-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                              {grant.source === 'grants.gov' ? 'Live' : grant.source || 'Grant'}
                            </span>
                            {grant.status && (
                              <span className="text-[11px] font-semibold uppercase text-slate-500">
                                {grant.status}
                              </span>
                            )}
                            {grant.opportunityNumber && (
                              <span className="text-[11px] font-mono text-slate-500">
                                {grant.opportunityNumber}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-900 leading-snug">
                            {grant.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 font-medium">{grant.funder}</p>
                        </div>
                        <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
                          <div className="flex items-center gap-2">
                            {grant.matchScore ? (
                              <span className="text-xs font-black text-slate-800">
                                <span className="font-mono">{grant.matchScore}%</span> match
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                                Not scored
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => saveGrant(grant, e)}
                              disabled={savedIds.has(grant.id) || savingId === grant.id}
                              aria-label={savedIds.has(grant.id) ? 'Saved to My applications' : 'Save to My applications'}
                              title={savedIds.has(grant.id) ? 'Saved to My applications' : 'Save to My applications'}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                savedIds.has(grant.id)
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                  : 'bg-white/80 border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-300'
                              }`}
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
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>

      {/* Detail pane */}
      <AnimatePresence mode="wait">
        {selectedGrant ? (
          <motion.aside
            key={selectedGrant.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ type: 'spring', stiffness: 240, damping: 28 }}
            className="xl:w-[420px] w-full shrink-0 glass-panel rounded-[2rem] p-5 md:p-6 flex flex-col max-h-[85vh] xl:max-h-full overflow-auto custom-scrollbar"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 glass-emerald px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {selectedGrant.source ? `${selectedGrant.source} · official data` : 'Official data'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsExpandedDetail(true)}
                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                  aria-label="Expand to full view"
                  title="Expand to full view"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGrant(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug mb-2">{selectedGrant.title}</h2>
            <p className="text-sm text-slate-500 font-medium mb-4">{selectedGrant.funder}</p>

            {/* What is this & why it fits you */}
            <div className="mb-5 p-4 rounded-2xl glass-panel space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                  <CircleDot className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  {isContracts ? 'What this contract is about' : 'What this grant is about'}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {selectedGrant.description || 'No description available for this listing.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                  <Target className="w-4 h-4 text-violet-500" aria-hidden="true" />
                  Why it could be a fit for you
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {selectedGrant.matchExplanation ? (
                    selectedGrant.matchExplanation
                  ) : (
                    <>
                      Based on your profile
                      {(organization?.focusAreas?.[0] || profile?.keywords?.[0] || profile?.state) && (
                        <>
                          {' '}({[organization?.focusAreas?.[0] || profile?.keywords?.[0], profile?.state]
                            .filter(Boolean)
                            .join(', ')})
                        </>
                      )}
                      , this is a potential match — click "Run match analysis" below to get an exact score.
                    </>
                  )}
                </p>
              </div>
            </div>

            {selectedGrant.matchScore > 0 && (
              <div className="mb-4 space-y-3">
                <div
                  className={`p-4 rounded-2xl ${
                    selectedGrant.eligible === false
                      ? 'bg-rose-50/80 border border-rose-200'
                      : 'glass-emerald'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-800">
                      Match analysis
                    </span>
                    <span
                      className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-full ${
                        selectedGrant.winProbability === 'High'
                          ? 'bg-emerald-600 text-white'
                          : selectedGrant.winProbability === 'Medium'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-500 text-white'
                      }`}
                    >
                      Win chance: {selectedGrant.winProbability || '—'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <ScoreChip label="Overall" value={selectedGrant.matchScore} />
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
                    <p className="text-[11px] font-bold text-rose-700 mb-1">
                      Heads up: you may not meet the rules for this one.
                    </p>
                  )}
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedGrant.matchExplanation}
                  </p>
                  {selectedGrant.eligibilityFailures && selectedGrant.eligibilityFailures.length > 0 && (
                    <ul className="mt-2 text-[11px] text-rose-700 list-disc pl-4 space-y-0.5">
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
                  className="px-2 py-0.5 rounded-md bg-slate-100/80 text-[11px] font-bold text-slate-500 uppercase"
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
                className="btn btn-secondary w-full"
              >
                <ExternalLink className="w-4 h-4" />
                Open the official page
              </a>

              <button
                type="button"
                onClick={(e) => saveGrant(selectedGrant, e)}
                disabled={savedIds.has(selectedGrant.id) || savingId === selectedGrant.id}
                className={
                  savedIds.has(selectedGrant.id)
                    ? 'btn w-full bg-emerald-100/80 !border-emerald-300 text-emerald-800'
                    : 'btn btn-secondary w-full'
                }
              >
                {savingId === selectedGrant.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                ) : savedIds.has(selectedGrant.id) ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    Saved
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
                className="btn btn-dark w-full"
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
                className="btn btn-primary w-full"
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
            className="hidden xl:flex xl:w-[380px] shrink-0 rounded-[2rem] border-2 border-dashed border-slate-200/90 bg-white/40 items-center justify-center p-8 text-center"
          >
            <div>
              <Radar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">Pick a listing to see details</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Check the fit, run a match score, or open the official page.
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
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: 'spring', stiffness: 240, damping: 26 }}
              className="glass-panel rounded-[2rem] w-full max-w-4xl p-6 sm:p-10 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-slate-200/60">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 glass-emerald px-3 py-1 rounded-full mb-2">
                    <CheckCircle2 className="w-4 h-4" /> Official posting
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedGrant.title}</h2>
                  <p className="text-sm text-slate-500 font-medium">{selectedGrant.funder}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExpandedDetail(false)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  aria-label="Close full view"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass-emerald p-4 rounded-2xl">
                    <div className="text-[11px] font-extrabold text-emerald-800/70 uppercase tracking-widest">Most you could get</div>
                    <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                      {selectedGrant.amount > 0 ? `$${Number(selectedGrant.amount).toLocaleString()}` : 'Not listed'}
                    </div>
                  </div>
                  <div className="glass-gold p-4 rounded-2xl">
                    <div className="text-[11px] font-extrabold text-amber-800/70 uppercase tracking-widest">Deadline</div>
                    <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                      {new Date(selectedGrant.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="glass-panel p-4 rounded-2xl">
                    <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Match score</div>
                    <div className="text-xl font-bold font-mono text-emerald-600 mt-1">
                      {selectedGrant.matchScore ? `${selectedGrant.matchScore}%` : 'Not scored yet'}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Full description</h4>
                  <div className="glass-panel rounded-2xl p-6 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedGrant.description}
                  </div>
                </div>

                {selectedGrant.matchExplanation && (
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Match analysis</h4>
                    <div className="glass-emerald rounded-2xl p-6 text-sm text-slate-800 leading-relaxed">
                      {selectedGrant.matchExplanation}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-end gap-3">
                <a
                  href={selectedGrant.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  <ExternalLink className="w-4 h-4" /> Open the official page
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsExpandedDetail(false);
                    onStartDraft(selectedGrant);
                  }}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  <Link2 className="w-4 h-4" /> Write proposal
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
    <div className="rounded-xl bg-white/80 border border-white/90 px-2 py-1.5 text-center shadow-sm">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-sm font-black font-mono text-slate-900">{value}%</div>
    </div>
  );
}

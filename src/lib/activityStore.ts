/**
 * Lightweight local activity tracking — powers the Home dashboard stats
 * and the getting-started checklist. Stored per-user in localStorage so it
 * works offline and in demo mode (no Firestore writes needed).
 */

export type ActivityEvent = 'search' | 'save' | 'draft' | 'genie_chat';

export interface ActivityCounts {
  search: number;
  save: number;
  draft: number;
  genie_chat: number;
  /** ISO timestamp of the most recent event of any kind */
  lastActiveAt?: string;
}

const EMPTY: ActivityCounts = { search: 0, save: 0, draft: 0, genie_chat: 0 };

const keyFor = (uid: string) => `grantgenie_activity_v1_${uid || 'anon'}`;

export function getActivity(uid: string): ActivityCounts {
  try {
    const raw = localStorage.getItem(keyFor(uid));
    if (!raw) return { ...EMPTY };
    const data = JSON.parse(raw) as Partial<ActivityCounts>;
    return {
      search: Number(data.search) || 0,
      save: Number(data.save) || 0,
      draft: Number(data.draft) || 0,
      genie_chat: Number(data.genie_chat) || 0,
      lastActiveAt: data.lastActiveAt,
    };
  } catch {
    return { ...EMPTY };
  }
}

export function trackEvent(uid: string, event: ActivityEvent): ActivityCounts {
  const current = getActivity(uid);
  const next: ActivityCounts = {
    ...current,
    [event]: (current[event] || 0) + 1,
    lastActiveAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(keyFor(uid), JSON.stringify(next));
  } catch {
    /* quota / private mode — counts just stay in memory for this call */
  }
  // Let any mounted dashboard update live
  try {
    window.dispatchEvent(new CustomEvent('gg-activity', { detail: next }));
  } catch {
    /* ignore (non-browser env) */
  }
  return next;
}

/** Subscribe to activity changes (returns unsubscribe). */
export function onActivityChange(cb: (counts: ActivityCounts) => void): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<ActivityCounts>).detail;
    if (detail) cb(detail);
  };
  window.addEventListener('gg-activity', handler);
  return () => window.removeEventListener('gg-activity', handler);
}

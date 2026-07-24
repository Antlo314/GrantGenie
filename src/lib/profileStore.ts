import type { UserProfile } from '../types';

const keyFor = (uid: string) => `grantgenie_profile_v1_${uid}`;

/**
 * Firestore rejects `undefined` field values.
 * Strip them (and nested plain objects) before setDoc/updateDoc.
 */
export function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) {
      out[k] = stripUndefined(v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out as T;
}

/**
 * Test profile used ONLY by the ?dev=1 onboarding shortcut.
 * Real users start the Get started quiz with blank answers.
 */
export function buildTestProfileFields(user: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}): UserProfile {
  const now = new Date().toISOString();
  return {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? 'Test User',
    photoURL: user.photoURL ?? null,
    profileComplete: true,
    entityType: 'company',
    sector: 'both',
    name: user.displayName || 'Test Services LLC',
    state: 'GA',
    city: 'Atlanta',
    zip: '30303',
    description:
      'We provide IT services, training, and community technology projects for small businesses and nonprofits in Georgia.',
    keywords: ['IT services', 'Education', 'Workforce', 'Health'],
    sizeBand: 'small',
    fundingNeedBand: '25k_100k',
    flags: { smallBiz: true },
    tier: 'Free',
    createdAt: now,
    updatedAt: now,
  };
}

export function saveLocalProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(keyFor(profile.uid), JSON.stringify(stripUndefined(profile as unknown as Record<string, unknown>)));
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadLocalProfile(uid: string): UserProfile | null {
  try {
    const raw = localStorage.getItem(keyFor(uid));
    if (!raw) return null;
    const data = JSON.parse(raw) as UserProfile;
    if (!data || data.uid !== uid) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearLocalProfile(uid: string): void {
  try {
    localStorage.removeItem(keyFor(uid));
  } catch {
    /* ignore */
  }
}

export function isPermissionError(e: unknown): boolean {
  if (!e || typeof e !== 'object') return false;
  const any = e as { code?: string; message?: string };
  return (
    any.code === 'permission-denied' ||
    /insufficient permissions|permission/i.test(any.message || '')
  );
}

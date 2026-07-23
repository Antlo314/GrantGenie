import type { UserProfile } from '../types';

const keyFor = (uid: string) => `grantgenie_profile_v1_${uid}`;

export function saveLocalProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(keyFor(profile.uid), JSON.stringify(profile));
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

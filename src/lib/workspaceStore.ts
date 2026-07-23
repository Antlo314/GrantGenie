import { WorkspaceOrg, UserProfile } from '../types';

const STORAGE_KEY_ACTIVE_ORG = 'grantgenie_active_org_id';
const STORAGE_KEY_WORKSPACES = 'grantgenie_workspaces_v1';

export function getActiveOrgId(uid: string, defaultId?: string): string {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_ACTIVE_ORG}_${uid}`);
    if (stored) return stored;
  } catch (e) {
    console.error('Error reading active org ID:', e);
  }
  return defaultId || uid;
}

export function setActiveOrgId(uid: string, orgId: string): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_ACTIVE_ORG}_${uid}`, orgId);
  } catch (e) {
    console.error('Error saving active org ID:', e);
  }
}

export function getStoredWorkspaces(profile: UserProfile | null): WorkspaceOrg[] {
  if (!profile) return [];
  
  const primaryWorkspace: WorkspaceOrg = {
    id: profile.orgId || profile.uid,
    name: profile.name || profile.displayName || 'Primary Organization',
    role: profile.role || 'admin',
    ein: profile.ein || '',
    mission: profile.description || '',
    state: profile.state || 'United States',
    keywords: profile.keywords || [],
    entityType: profile.entityType || 'nonprofit',
  };

  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_WORKSPACES}_${profile.uid}`);
    if (raw) {
      const parsed: WorkspaceOrg[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure primary is present
        const hasPrimary = parsed.some(w => w.id === primaryWorkspace.id);
        return hasPrimary ? parsed : [primaryWorkspace, ...parsed];
      }
    }
  } catch (e) {
    console.error('Error reading stored workspaces:', e);
  }

  return [primaryWorkspace];
}

export function saveStoredWorkspaces(uid: string, workspaces: WorkspaceOrg[]): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_WORKSPACES}_${uid}`, JSON.stringify(workspaces));
  } catch (e) {
    console.error('Error saving workspaces:', e);
  }
}

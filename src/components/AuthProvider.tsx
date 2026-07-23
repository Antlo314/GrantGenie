import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuth } from '../auth';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Organization, UserProfile, WorkspaceOrg, UserRole } from '../types';
import { profileToOrganization } from '../types';
import { loadLocalProfile, saveLocalProfile } from '../lib/profileStore';
import {
  getActiveOrgId,
  setActiveOrgId,
  getStoredWorkspaces,
  saveStoredWorkspaces,
} from '../lib/workspaceStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  /** Full profile from Firestore (null until loaded or incomplete) */
  profile: UserProfile | null;
  /** Org-shaped view for older screens */
  organization: Organization | null;
  /** Active workspace organization */
  activeWorkspace: WorkspaceOrg | null;
  /** Current user role in active workspace */
  userRole: UserRole;
  /** All accessible workspace organizations */
  workspaces: WorkspaceOrg[];
  switchWorkspace: (orgId: string) => void;
  createWorkspace: (orgData: Omit<WorkspaceOrg, 'id'>) => void;
  /** Explicit demo mode (user clicked Try demo) */
  isDemo: boolean;
  enterDemo: () => void;
  exitDemo: () => void;
  refreshProfile: () => Promise<void>;
  /** @deprecated use refreshProfile */
  refreshOrg: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER = {
  uid: 'demo-user-123',
  displayName: 'Demo User',
  email: 'demo@grantgenie.local',
  photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GrantGenie',
} as User;

const DEMO_PROFILE: UserProfile = {
  uid: DEMO_USER.uid,
  email: DEMO_USER.email,
  displayName: DEMO_USER.displayName,
  photoURL: DEMO_USER.photoURL,
  profileComplete: true,
  sector: 'grants',
  entityType: 'nonprofit',
  name: 'Demo Community Org',
  description:
    'We help local communities with health, education, and technology projects.',
  keywords: ['health', 'community', 'education', 'technology'],
  state: 'GA',
  city: 'Atlanta',
  sizeBand: 'small',
  fundingNeedBand: '25k_100k',
  flags: { is501c3: true },
  tier: 'Pro',
  ein: '12-3456789',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const [workspaces, setWorkspaces] = useState<WorkspaceOrg[]>([]);
  const [activeOrgId, setActiveOrgIdState] = useState<string>('');

  const loadProfile = useCallback(async (uid: string) => {
    if (uid === DEMO_USER.uid) {
      setProfile(DEMO_PROFILE);
      const ws = getStoredWorkspaces(DEMO_PROFILE);
      setWorkspaces(ws);
      setActiveOrgIdState(getActiveOrgId(uid, ws[0]?.id));
      return;
    }
    // Prefer local complete profile if cloud is blocked
    const local = loadLocalProfile(uid);
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      let currentProfile = local;
      if (snap.exists()) {
        currentProfile = { uid, ...snap.data() } as UserProfile;
        if (currentProfile.profileComplete) saveLocalProfile(currentProfile);
      }
      setProfile(currentProfile);
      if (currentProfile) {
        const ws = getStoredWorkspaces(currentProfile);
        setWorkspaces(ws);
        setActiveOrgIdState(getActiveOrgId(uid, ws[0]?.id));
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setProfile(local);
      if (local) {
        const ws = getStoredWorkspaces(local);
        setWorkspaces(ws);
        setActiveOrgIdState(getActiveOrgId(uid, ws[0]?.id));
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (currentUser) => {
      if (currentUser) {
        setIsDemo(false);
        setUser(currentUser);
        await loadProfile(currentUser.uid);
      } else if (!isDemo) {
        setUser(null);
        setProfile(null);
        setWorkspaces([]);
        setActiveOrgIdState('');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadProfile, isDemo]);

  const enterDemo = () => {
    setIsDemo(true);
    setUser(DEMO_USER);
    setProfile(DEMO_PROFILE);
    const ws = getStoredWorkspaces(DEMO_PROFILE);
    setWorkspaces(ws);
    setActiveOrgIdState(ws[0]?.id || DEMO_PROFILE.uid);
    setLoading(false);
  };

  const exitDemo = () => {
    setIsDemo(false);
    setUser(null);
    setProfile(null);
    setWorkspaces([]);
    setActiveOrgIdState('');
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.uid);
  };

  const switchWorkspace = (orgId: string) => {
    const uid = user?.uid || DEMO_USER.uid;
    setActiveOrgId(uid, orgId);
    setActiveOrgIdState(orgId);
  };

  const createWorkspace = (orgData: Omit<WorkspaceOrg, 'id'>) => {
    const newId = `org_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newWs: WorkspaceOrg = {
      id: newId,
      ...orgData,
    };
    const updated = [...workspaces, newWs];
    setWorkspaces(updated);
    const uid = user?.uid || DEMO_USER.uid;
    saveStoredWorkspaces(uid, updated);
    switchWorkspace(newId);
  };

  const activeWorkspace = React.useMemo(() => {
    if (!workspaces.length) return null;
    return workspaces.find(w => w.id === activeOrgId) || workspaces[0] || null;
  }, [workspaces, activeOrgId]);

  const userRole: UserRole = activeWorkspace?.role || profile?.role || 'admin';

  const organization: Organization | null = React.useMemo(() => {
    if (activeWorkspace) {
      return {
        id: activeWorkspace.id,
        name: activeWorkspace.name,
        ein: activeWorkspace.ein || '',
        mission: activeWorkspace.mission || profile?.description || '',
        focusAreas: activeWorkspace.keywords || profile?.keywords || [],
        ownerId: profile?.uid || '',
        tier: profile?.tier || 'Pro',
      };
    }
    return profile ? profileToOrganization(profile) : null;
  }, [activeWorkspace, profile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        profile,
        organization,
        activeWorkspace,
        userRole,
        workspaces,
        switchWorkspace,
        createWorkspace,
        isDemo,
        enterDemo,
        exitDemo,
        refreshProfile,
        refreshOrg: refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

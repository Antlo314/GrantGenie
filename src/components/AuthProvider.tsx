import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuth } from '../auth';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Organization, UserProfile } from '../types';
import { profileToOrganization } from '../types';
import { loadLocalProfile, saveLocalProfile } from '../lib/profileStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  /** Full profile from Firestore (null until loaded or incomplete) */
  profile: UserProfile | null;
  /** Org-shaped view for older screens */
  organization: Organization | null;
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

  const loadProfile = useCallback(async (uid: string) => {
    if (uid === DEMO_USER.uid) {
      setProfile(DEMO_PROFILE);
      return;
    }
    // Prefer local complete profile if cloud is blocked
    const local = loadLocalProfile(uid);
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const cloud = { uid, ...snap.data() } as UserProfile;
        setProfile(cloud);
        if (cloud.profileComplete) saveLocalProfile(cloud);
        return;
      }
      // No cloud doc yet — use local onboarding answers if any
      setProfile(local);
    } catch (err) {
      console.error('Error loading profile:', err);
      setProfile(local);
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
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadProfile, isDemo]);

  const enterDemo = () => {
    setIsDemo(true);
    setUser(DEMO_USER);
    setProfile(DEMO_PROFILE);
    setLoading(false);
  };

  const exitDemo = () => {
    setIsDemo(false);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.uid);
  };

  const organization = profile ? profileToOrganization(profile) : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        profile,
        organization,
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

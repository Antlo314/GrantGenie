import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuth } from '../auth';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Organization } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  organization: Organization | null;
  refreshOrg: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER = {
  uid: 'demo-user-123',
  displayName: 'Genie Architect',
  email: 'demo@grantgenie.ai',
  photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GrantGenie'
} as any;

const DEMO_ORG: Organization = {
  id: 'demo-org-123',
  name: 'Lumen Labs',
  mission: 'To empower humanity through verifiable digital health infrastructure and sustainable community-led technological advancement.',
  ein: '12-3456789',
  focusAreas: ['health', 'community', 'education', 'technology'],
  ownerId: 'demo-user-123',
  tier: 'Pro',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEMO_USER);
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(DEMO_ORG);

  const fetchOrg = async (uid: string) => {
    if (uid === DEMO_USER.uid) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists() && userDoc.data()?.orgId) {
        const orgDoc = await getDoc(doc(db, 'organizations', userDoc.data().orgId));
        if (orgDoc.exists()) {
          setOrganization({ id: orgDoc.id, ...orgDoc.data() } as Organization);
        }
      }
    } catch (err) {
      console.error("Error fetching org:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchOrg(currentUser.uid);
      } else {
        setUser(DEMO_USER);
        setOrganization(DEMO_ORG);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshOrg = async () => {
    if (user) await fetchOrg(user.uid);
  };

  return (
    <AuthContext.Provider value={{ user, loading, organization, refreshOrg }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);

  const fetchOrg = async (uid: string) => {
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
      setUser(currentUser);
      if (currentUser) {
        await fetchOrg(currentUser.uid);
      } else {
        setOrganization(null);
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

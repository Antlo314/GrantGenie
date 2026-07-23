import { auth, db } from './lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { stripUndefined } from './lib/profileStore';

async function ensureUserDoc(user: User) {
  const userDocRef = doc(db, 'users', user.uid);
  try {
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const payload = stripUndefined({
        uid: user.uid,
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
        profileComplete: false,
        sector: 'grants',
        entityType: 'other',
        tier: 'Free',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await setDoc(userDocRef, payload);
    }
  } catch (err) {
    // Firestore rules not published yet — sign-in still works; onboarding can save locally
    console.warn('Could not ensure user doc (check Firestore rules):', err);
  }
  return user;
}

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return await ensureUserDoc(result.user);
  } catch (error) {
    console.error('Error signing in with Google', error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName.trim()) {
    await updateProfile(result.user, { displayName: displayName.trim() });
  }
  return await ensureUserDoc(result.user);
};

export const signInWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return await ensureUserDoc(result.user);
};

export const logout = () => signOut(auth);

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

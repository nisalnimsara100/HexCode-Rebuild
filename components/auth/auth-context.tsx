"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { ref, get, set, onValue } from "firebase/database";
import { auth, database } from "@/lib/firebase";

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "employee" | "staff";
  employeeId?: string;
  department?: string;
  profilePicture?: string;
  dateOfBirth?: string;
}

interface AuthContextType {
  userProfile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signUp: (email: string, password: string, profile: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let dbUnsubscribe: (() => void) | undefined;

    const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
      // Cleanup previous db listener if any
      if (dbUnsubscribe) {
        dbUnsubscribe();
        dbUnsubscribe = undefined;
      }

      if (user) {
        // Logic to determine which path to listen to, mirroring the previous get logic
        const uidPath = `users/${user.uid}`;
        const adminPath = `users/admin`;

        // We need to check existence first to know which one to listen to, 
        // similar to the original logic: "First try... If not found..."
        // However, for a cleaner realtime setup, we can default to UID, 
        // and if it's the specific admin email and UID path is empty, try admin path.

        try {
          const uidRef = ref(database, uidPath);
          const snapshot = await get(uidRef);

          if (snapshot.exists()) {
            // Listen to users/{uid}
            dbUnsubscribe = onValue(uidRef, (snap) => {
              setUserProfile(snap.exists() ? snap.val() : null);
            });
          } else if (user.email === "admin@hexcode.lk") {
            // Listen to users/admin
            const adminRef = ref(database, adminPath);
            dbUnsubscribe = onValue(adminRef, (snap) => {
              if (snap.exists()) {
                setUserProfile({ ...snap.val(), uid: user.uid });
              } else {
                setUserProfile(null);
              }
            });
          } else {
            // Even if it doesn't exist yet, we might want to listen to UID path 
            // in case it gets created (e.g. registration flow).
            // But the original logic set null if not found.
            // Let's listen to UID path by default if not admin fallback.
            dbUnsubscribe = onValue(uidRef, (snap) => {
              setUserProfile(snap.exists() ? snap.val() : null);
            });
          }
        } catch (error) {
          console.error("Error setting up user listener:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      authUnsubscribe();
      if (dbUnsubscribe) dbUnsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<UserProfile> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // First try to get user profile by UID
      let userRef = ref(database, `users/${user.uid}`);
      let snapshot = await get(userRef);

      if (snapshot.exists()) {
        const profile = snapshot.val();
        setUserProfile(profile);
        return profile;
      }

      // If not found by UID, check if it's the admin user with static key
      if (user.email === "admin@hexcode.lk") {
        userRef = ref(database, `users/admin`);
        snapshot = await get(userRef);

        if (snapshot.exists()) {
          const dbData = snapshot.val();

          // The database structure shows the role is under profile.role
          const profile = {
            uid: user.uid,
            email: dbData.email || user.email,
            name: dbData.profile?.name || "System Administrator",
            role: dbData.profile?.role || "admin",
            employeeId: dbData.profile?.employeeId || "ADM001",
            department: dbData.profile?.department || "IT Administration"
          };

          setUserProfile(profile);
          return profile;
        }
      }

      throw new Error("User profile not found");
    } catch (error: any) {
      // Re-throw if it's already an Error with a custom message (like "User profile not found")
      if (error instanceof Error && error.message === "User profile not found") {
        throw error;
      }

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        throw new Error("Invalid email or password");
      }
      console.error("Sign in error:", error);
      throw new Error("Invalid credentials");
    }
  };

  const signUp = async (email: string, password: string, profile: Partial<UserProfile>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        name: profile.name || "",
        role: "employee", // Force role to employee as requested
        employeeId: profile.employeeId || "", // Keep optional if needed for internal logic elsewhere
        department: profile.department || "",
        profilePicture: profile.profilePicture || "",
        dateOfBirth: profile.dateOfBirth || "",
      };

      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, userProfile);

      setUserProfile(userProfile);
    } catch (error) {
      throw new Error("Registration failed");
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      throw new Error("Logout failed");
    }
  };

  const value = {
    userProfile,
    signIn,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
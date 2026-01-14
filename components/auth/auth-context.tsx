"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { ref, get, set } from "firebase/database";
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // First try to get user profile by UID
        let userRef = ref(database, `users/${user.uid}`);
        let snapshot = await get(userRef);

        if (snapshot.exists()) {
          setUserProfile(snapshot.val());
          return;
        }

        // If not found by UID, check if it's the admin user with static key
        if (user.email === "admin@hexcode.lk") {
          userRef = ref(database, `users/admin`);
          snapshot = await get(userRef);

          if (snapshot.exists()) {
            const profile = {
              ...snapshot.val(),
              uid: user.uid // Use the actual Firebase Auth UID
            };
            setUserProfile(profile);
            return;
          }
        }

        setUserProfile(null);
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
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
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        throw new Error("Invalid email or password");
      }
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
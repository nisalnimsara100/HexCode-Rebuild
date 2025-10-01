"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { auth, database } from "@/lib/firebase";

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "employee";
  employeeId?: string;
  department?: string;
  profilePicture?: string;
}

interface AuthContextType {
  userProfile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signUp: (email: string, password: string, profile: Partial<UserProfile>) => Promise<void>;
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
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserProfile(snapshot.val());
        } else {
          setUserProfile(null);
        }
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
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const profile = snapshot.val();
        setUserProfile(profile);
        return profile;
      } else {
        throw new Error("User profile not found");
      }
    } catch (error) {
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
        role: profile.role || "employee", // Default role for new registrations
        employeeId: profile.employeeId || "",
        department: profile.department || "", // Will be assigned by admin
        profilePicture: profile.profilePicture || "",
      };

      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, userProfile);

      setUserProfile(userProfile);
    } catch (error) {
      throw new Error("Registration failed");
    }
  };

  const value = {
    userProfile,
    signIn,
    signUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
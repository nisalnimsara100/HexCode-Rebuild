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

interface ClientProfile {
  uid: string;
  email: string;
  name: string;
  company: string;
  phone?: string;
  profilePicture?: string;
  role: "client";
  joinDate: string;
  projects: string[]; // Array of project IDs
}

interface ClientAuthContextType {
  clientProfile: ClientProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<ClientProfile>;
  signUp: (email: string, password: string, profile: Partial<ClientProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider");
  }
  return context;
}

export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Client-side only authentication check
    const initAuth = () => {
      try {
        // Check localStorage first
        const storedProfile = localStorage.getItem('clientProfile');
        if (storedProfile) {
          try {
            const profile = JSON.parse(storedProfile);
            if (profile.role === "client") {
              setClientProfile(profile);
              setLoading(false);
              return;
            }
          } catch (parseError) {
            console.error("Error parsing stored profile:", parseError);
            localStorage.removeItem('clientProfile');
          }
        }

        // Set up Firebase auth listener
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            try {
              const clientRef = ref(database, `clients/${user.uid}`);
              const snapshot = await get(clientRef);
              if (snapshot.exists()) {
                const profile = snapshot.val();
                if (profile.role === "client") {
                  setClientProfile(profile);
                  localStorage.setItem('clientProfile', JSON.stringify(profile));
                } else {
                  setClientProfile(null);
                }
              } else {
                setClientProfile(null);
              }
            } catch (error) {
              console.error("Error fetching client profile:", error);
              setClientProfile(null);
            }
          } else {
            setClientProfile(null);
          }
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error initializing auth:", error);
        setLoading(false);
        return () => {};
      }
    };

    const unsubscribe = initAuth();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<ClientProfile> => {
    try {
      setLoading(true);
      
      // First try Firebase authentication
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const clientRef = ref(database, `clients/${user.uid}`);
        const snapshot = await get(clientRef);
        
        if (snapshot.exists()) {
          const profile = snapshot.val();
          if (profile.role === "client") {
            setClientProfile(profile);
            localStorage.setItem('clientProfile', JSON.stringify(profile));
            return profile;
          } else {
            throw new Error("Access denied. This account is not a client account.");
          }
        } else {
          throw new Error("Client profile not found");
        }
      } catch (firebaseError: any) {
        // If Firebase auth fails, fall back to demo authentication for development
        console.log("Firebase auth failed, trying demo authentication:", firebaseError.message);
        
        // Demo authentication for development - check against known demo accounts
        const demoClients = [
          { email: "john.doe@techstartup.com", uid: "client_001" },
          { email: "sarah.johnson@shopflow.com", uid: "client_002" },
          { email: "demo@client.com", uid: "demo-client-001" }
        ];
        
        const demoClient = demoClients.find(client => client.email === email);
        if (demoClient && password.length >= 6) {
          // Create demo profile
          const mockProfile: ClientProfile = {
            uid: demoClient.uid,
            email: email,
            name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            company: demoClient.uid === "client_001" ? "TechStartup Inc." : 
                     demoClient.uid === "client_002" ? "ShopFlow Inc" : "Demo Company Inc.",
            phone: "+1 (555) 123-4567",
            role: "client" as const,
            joinDate: new Date().toISOString().split('T')[0],
            projects: demoClient.uid === "client_001" ? ["project_001", "project_002"] : 
                      demoClient.uid === "client_002" ? ["project_003", "project_004"] : []
          };
          
          setClientProfile(mockProfile);
          localStorage.setItem('clientProfile', JSON.stringify(mockProfile));
          return mockProfile;
        }
        
        throw new Error("Invalid email or password");
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, profile: Partial<ClientProfile>) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const clientProfile: ClientProfile = {
        uid: user.uid,
        email: user.email!,
        name: profile.name || "",
        company: profile.company || "",
        phone: profile.phone || "",
        profilePicture: profile.profilePicture || "",
        role: "client",
        joinDate: new Date().toISOString().split('T')[0],
        projects: [], // Will be assigned by admin when creating projects
      };

      const clientRef = ref(database, `clients/${user.uid}`);
      await set(clientRef, clientProfile);

      setClientProfile(clientProfile);
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear client profile state
      setClientProfile(null);
      
      // Clear localStorage
      localStorage.removeItem('clientProfile');
      
      // Sign out from Firebase
      try {
        await signOut(auth);
      } catch (firebaseError) {
        console.log("Firebase signout error:", firebaseError);
        // Continue even if Firebase signout fails
      }
      
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, ensure local state is cleared
      setClientProfile(null);
      localStorage.removeItem('clientProfile');
      throw new Error("Logout failed");
    }
  };

  const value = {
    clientProfile,
    loading,
    signIn,
    signUp,
    logout,
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
}
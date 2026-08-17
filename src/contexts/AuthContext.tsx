import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { saveAccessCode, unlockGlobally, isUnlocked, getSavedAccessCode, syncProStatusToCloud } from "@/lib/unlock";

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
  kcet_rank?: number;
  kcet_category?: string;
  comedk_rank?: number;
  badge?: string;
  is_admin?: boolean;
  is_pro?: boolean;
  pro_access_code?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, email?: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles" as any)
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        const p = data as unknown as UserProfile;
        setProfile(p);

        // Auto-unlock this device if user's cloud account is Pro
        if (p.is_pro || p.pro_access_code) {
          if (p.pro_access_code) {
            saveAccessCode(p.pro_access_code);
          } else {
            unlockGlobally();
          }
        } else {
          // If this device was already unlocked locally, link it to this account
          const localCode = getSavedAccessCode();
          if (localCode || isUnlocked()) {
            syncProStatusToCloud(localCode || undefined);
          }
        }
      } else {
        // Fallback default profile from local or auth state
        const fallbackName = email ? email.split("@")[0] : "KCET Aspirant";
        const newFallback: UserProfile = {
          id: userId,
          display_name: fallbackName,
          kcet_category: "GM",
          badge: "Verified Student"
        };
        setProfile(newFallback);

        // Link local Pro status if active
        const localCode = getSavedAccessCode();
        if (localCode || isUnlocked()) {
          syncProStatusToCloud(localCode || undefined);
        }
      }
    } catch {
      // Ignore profile fetch failure
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      // 1. If returning from OAuth redirect with hash parameters (#access_token=...)
      if (window.location.hash && window.location.hash.includes("access_token")) {
        try {
          const hashStr = window.location.hash.startsWith("#") ? window.location.hash.substring(1) : window.location.hash;
          const hashParams = new URLSearchParams(hashStr);
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token") || "";

          if (accessToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (!error && data?.session && isMounted) {
              setSession(data.session);
              setUser(data.session.user);
              await fetchProfile(data.session.user.id, data.session.user.email);
              // Clean up token hash from browser URL without triggering reload
              window.history.replaceState(null, "", window.location.pathname + window.location.search);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error("Error parsing OAuth hash token:", err);
        }
      }

      // 2. Standard getSession check
      const { data: { session } } = await supabase.auth.getSession();
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email);
        }
        setLoading(false);
      }
    };

    initAuth();

    // 3. Listen for subsequent auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const redirectPath = window.location.pathname.startsWith("/forum") ? "/forum" : "/dashboard";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${redirectPath}`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      if (err?.message?.includes("validation_failed") || err?.message?.includes("provider is not enabled")) {
        toast.error("Google Auth is not enabled in Supabase settings yet. Please sign in with Email below!");
      } else {
        toast.error(err.message || "Failed to initiate Google sign in.");
      }
    }
  };

  const signInWithEmail = async (email: string) => {
    try {
      const redirectPath = window.location.pathname.startsWith("/forum") ? "/forum" : "/dashboard";
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}${redirectPath}`
        }
      });
      if (error) throw error;
      toast.success("Magic login link sent to your email! Please check your inbox.");
      return { success: true };
    } catch (err: any) {
      toast.error(err.message || "Failed to send login email.");
      return { success: false, error: err.message };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      toast.success("Signed out successfully.");
    } catch (err: any) {
      toast.error("Error signing out.");
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    try {
      const newProfile = {
        ...profile,
        ...updates,
        id: user.id,
        updated_at: new Date().toISOString()
      };

      setProfile(newProfile as UserProfile);

      const { error } = await supabase
        .from("profiles" as any)
        .upsert(newProfile);

      if (error) {
        console.warn("Db profile update notice:", error);
      }
      toast.success("Profile details updated!");
      return true;
    } catch (err: any) {
      toast.error("Failed to update profile.");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signOut,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

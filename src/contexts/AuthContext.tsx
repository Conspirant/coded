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

  const syncUserAndProfile = (currSession: Session | null) => {
    setSession(currSession);
    const currUser = currSession?.user ?? null;
    setUser(currUser);

    if (currUser) {
      const name = currUser.user_metadata?.full_name || 
                   currUser.user_metadata?.name || 
                   (currUser.email ? currUser.email.split("@")[0] : "KCET Aspirant");
      
      const initialProfile: UserProfile = {
        id: currUser.id,
        display_name: name,
        avatar_url: currUser.user_metadata?.avatar_url,
        kcet_category: "GM",
        badge: "Verified Student"
      };

      setProfile(initialProfile);
      fetchCloudProfile(currUser.id, initialProfile);
    } else {
      setProfile(null);
    }
    setLoading(false);
  };

  const fetchCloudProfile = async (userId: string, currentProfile: UserProfile) => {
    try {
      const { data, error } = await supabase
        .from("profiles" as any)
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        const p = data as unknown as UserProfile;
        setProfile((prev) => ({ ...prev, ...p }));

        if (p.is_pro || p.pro_access_code) {
          if (p.pro_access_code) {
            saveAccessCode(p.pro_access_code);
          } else {
            unlockGlobally();
          }
        }
      } else {
        // If device had local Pro, sync to cloud in background
        const localCode = getSavedAccessCode();
        if (localCode || isUnlocked()) {
          syncProStatusToCloud(localCode || undefined);
        }
      }
    } catch {
      // Non-blocking fallback
    }
  };

  useEffect(() => {
    let mounted = true;

    const handleAuthInit = async () => {
      // If there is an OAuth hash token in the URL (#access_token=...)
      if (typeof window !== "undefined" && window.location.hash && window.location.hash.includes("access_token")) {
        try {
          const hashClean = window.location.hash.replace(/^#/, "");
          const params = new URLSearchParams(hashClean);
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || accessToken,
            });

            if (!error && data?.session && mounted) {
              syncUserAndProfile(data.session);
              window.history.replaceState(null, "", window.location.pathname + window.location.search);
              return;
            }
          }
        } catch (e) {
          console.error("Manual token exchange failed:", e);
        }
      }

      // Check existing session
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      if (mounted) {
        syncUserAndProfile(existingSession);
      }
    };

    handleAuthInit();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        syncUserAndProfile(currentSession);
        if (currentSession && window.location.hash && window.location.hash.includes("access_token")) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      }
    });

    return () => {
      mounted = false;
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
    } catch (err) {
      console.warn("Sign out notice:", err);
    } finally {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith("sb-") || k.includes("supabase.auth.token"))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch {}

      setUser(null);
      setSession(null);
      setProfile(null);
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      toast.success("Signed out successfully.");
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

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Demo mode flag - set to true to use mock auth (when Supabase is unavailable)
const DEMO_MODE = true;

interface DemoSession {
  user: {
    id: string;
    email: string;
  };
}

interface AuthContextType {
  session: (Session | DemoSession) | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<(Session | DemoSession) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      if (!DEMO_MODE) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setLoading(false);
      } else {
        // Demo mode: check localStorage
        const demoSession = localStorage.getItem("demo_session");
        if (demoSession) {
          setSession(JSON.parse(demoSession));
        }
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    if (!DEMO_MODE) {
      const subscription = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setLoading(false);
        },
      );

      return () => subscription.data.subscription.unsubscribe();
    }
  }, []);

  const handleSignIn = async (
    email: string,
    password: string,
  ): Promise<void> => {
    if (DEMO_MODE) {
      // Demo mode: create a mock session
      const demoSession: DemoSession = {
        user: {
          id: `demo_${Date.now()}`,
          email,
        },
      };
      setSession(demoSession);
      localStorage.setItem("demo_session", JSON.stringify(demoSession));
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Sign in error:", error);
        throw new Error(error.message || "Failed to sign in");
      }
    } catch (err) {
      console.error("Sign in exception:", err);
      throw err;
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
  ): Promise<void> => {
    if (DEMO_MODE) {
      // Demo mode: create a mock session
      const demoSession: DemoSession = {
        user: {
          id: `demo_${Date.now()}`,
          email,
        },
      };
      setSession(demoSession);
      localStorage.setItem("demo_session", JSON.stringify(demoSession));
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) {
        console.error("Sign up error:", error);
        throw new Error(error.message || "Failed to sign up");
      }
    } catch (err) {
      console.error("Sign up exception:", err);
      throw err;
    }
  };

  const handleSignOut = async (): Promise<void> => {
    if (DEMO_MODE) {
      // Demo mode: clear session
      setSession(null);
      localStorage.removeItem("demo_session");
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        throw new Error(error.message || "Failed to sign out");
      }
    } catch (err) {
      console.error("Sign out exception:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthUser } from "./types";
import { authService } from "./authService";
import { supabase } from "../supabase";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  accessToken: string | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  accessToken: null,
  signIn: async () => ({ error: new Error("Not implemented") }),
  signUp: async () => ({ error: new Error("Not implemented") }),
  signOut: async () => ({ error: new Error("Not implemented") }),
  resetPassword: async () => ({ error: new Error("Not implemented") }),
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session, error } = await authService.getSession();

        if (error) {
          console.error("Error fetching session:", error);
        }

        setAccessToken(session?.access_token || null);

        setUser(session?.user || null);
      } catch (error) {
        console.error("Error in getInitialSession:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const value = {
    user,
    isLoading,
    accessToken,
    signIn: async (email: string, password: string) => {
      const { error } = await authService.signIn({ email, password });
      return { error };
    },
    signUp: async (email: string, password: string) => {
      const { error } = await authService.signUp({ email, password });
      return { error };
    },
    signOut: async () => {
      return await authService.signOut();
    },
    resetPassword: async (email: string) => {
      return await authService.resetPassword({ email });
    },
  };

  return (
    <AuthContext.Provider value={{ ...value }}>{children}</AuthContext.Provider>
  );
}

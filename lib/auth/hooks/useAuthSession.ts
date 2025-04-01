import { useAuth } from "../AuthContext";

export function useAuthSession() {
  const { user, isLoading, signOut, accessToken } = useAuth();

  return {
    user,
    isLoading,
    signOut,
    isAuthenticated: !!user,
    userEmail: user?.email,
    displayName: user?.email?.split("@")[0] || "User",
    accessToken: accessToken,
  };
}

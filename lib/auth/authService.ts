import { supabase } from "../supabase";
import {
  AuthResponse,
  SignInCredentials,
  SignUpCredentials,
  ResetPasswordRequest,
  UpdatePasswordRequest,
} from "./types";

export class AuthService {
  // Sign up a new user with email and password
  async signUp({ email, password }: SignUpCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return {
        user: data.user,
        error: null,
      };
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        user: null,
        error: error as Error,
      };
    }
  }

  // Sign in an existing user with email and password
  async signIn({ email, password }: SignInCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        user: data.user,
        error: null,
      };
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        user: null,
        error: error as Error,
      };
    }
  }

  // Sign out the current user
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error: error as Error };
    }
  }

  // Reset password by sending a password reset email
  async resetPassword({
    email,
  }: ResetPasswordRequest): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Reset password error:", error);
      return { error: error as Error };
    }
  }

  // Update user's password (after reset)
  async updatePassword({
    password,
  }: UpdatePasswordRequest): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Update password error:", error);
      return { error: error as Error };
    }
  }

  // Get the current user
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      console.error("Get current user error:", error);
      return { user: null, error: error as Error };
    }
  }

  // Get the current session
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session: data.session, error: null };
    } catch (error) {
      console.error("Get session error:", error);
      return { session: null, error: error as Error };
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/app/dashboard`,
        },
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Google sign in error:", error);
      return { error: error as Error };
    }
  }
}

export const authService = new AuthService();

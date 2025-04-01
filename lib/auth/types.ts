import { User } from "@supabase/supabase-js";

export type AuthUser = User;

export interface SignUpCredentials {
  email: string;
  password: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: Error | null;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  password: string;
}

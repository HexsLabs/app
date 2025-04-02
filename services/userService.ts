import { apiService } from "./apiService";

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  preferences?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

class UserService {
  // Get current user profile
  async getProfile(): Promise<UserProfile> {
    return apiService.request<UserProfile>("/api/user/profile");
  }

  // Update user profile
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    return apiService.request<UserProfile>("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // Sync Supabase user with backend (called after authentication)
  async syncUser(supabaseUserId: string, email: string): Promise<UserProfile> {
    return apiService.request<UserProfile>("/api/user/sync", {
      method: "POST",
      body: JSON.stringify({ supabaseUserId, email }),
    });
  }
}

export const userService = new UserService();

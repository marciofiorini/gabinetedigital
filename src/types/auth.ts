
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface Profile {
  id: string;
  name: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  language: string;
  timezone: string;
  keyboard_shortcuts_enabled: boolean;
  theme: string;
  dark_mode: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  settings: UserSettings | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (profileData: any) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<void>;
}

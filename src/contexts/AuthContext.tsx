
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: any;
  profile: any;
  session: any;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    console.log('Google sign in mock');
  };

  const signInWithEmail = async (email: string, password: string) => {
    console.log('Email sign in mock:', email);
    setUser({ email });
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    console.log('Email sign up mock:', email, name);
  };

  const resetPassword = async (email: string) => {
    console.log('Reset password mock:', email);
  };

  const updatePassword = async (password: string) => {
    console.log('Update password mock');
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session, 
      loading, 
      signInWithGoogle, 
      signInWithEmail, 
      signUpWithEmail, 
      resetPassword,
      updatePassword,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

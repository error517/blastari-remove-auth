
import React, { createContext, useContext, useState } from 'react';

// Mock user and session types
type User = {
  id: string;
  email: string;
};

type Session = {
  user: User;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

// Create a mock user
const mockUser: User = {
  id: 'mock-user-id',
  email: 'user@example.com'
};

// Create a mock session
const mockSession: Session = {
  user: mockUser
};

// Create a mock profile
const mockProfile = {
  id: 'mock-user-id',
  username: 'User',
  avatar_url: null
};

const AuthContext = createContext<AuthContextType>({
  session: mockSession,
  user: mockUser,
  profile: mockProfile,
  isLoading: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always provide a mock authenticated session
  const [session] = useState<Session | null>(mockSession);
  const [user] = useState<User | null>(mockUser);
  const [profile] = useState<any | null>(mockProfile);
  const [isLoading] = useState(false);

  // Mock signOut function that does nothing
  const signOut = async () => {
    console.log('Sign out is disabled');
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

import React, {
  createContext,
  useContext,
  useState,
} from 'react';

export type UserRole =
  | 'EMPLOYEE'
  | 'PRACTITIONER'
  | 'EXTERNAL'
  | 'MANAGER'
  | 'COMEDOR';

export interface AuthUser {
  id: string;
  employeeNumber: string | null;
  name: string;
  role: UserRole;
  department: string | null;
}

interface AuthContextData {
  user: AuthUser | null;
  token: string | null;

  setSession: (
    user: AuthUser,
    token: string,
  ) => void;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextData>(
    {} as AuthContextData,
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const setSession = (
    authenticatedUser: AuthUser,
    authenticationToken: string,
  ) => {
    setUser(authenticatedUser);
    setToken(authenticationToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
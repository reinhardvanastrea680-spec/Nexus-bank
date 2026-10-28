import { createContext, useContext, useState, useMemo, useCallback } from "react";

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  accountNumber: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Landing page has no backend — start with loading:false so the page
  // renders immediately. Users log in via the dashboard app.
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(false);

  const login = useCallback(async (_username: string, _password: string) => {
    // Login redirects to the dashboard app — nothing to do here
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { User, AuthState, AuthContextType } from "../types";
import {
  getMe,
  logout as authServiceLogout,
} from "../services/authService";
import { tokenUtils } from "../utils/token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  /**
   * On app mount: if a token exists in localStorage, silently call
   * GET /api/auth/me to verify it with the backend.
   * - Valid token  → restore the session
   * - Expired/invalid → wipe storage + treat as logged out
   */
  const initializeAuth = useCallback(async () => {
    if (!tokenUtils.hasToken()) {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    const user = await getMe();
    if (user) {
      setAuthState({ user, isAuthenticated: true, isLoading: false });
    } else {
      tokenUtils.clearAll();
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /** Called by Login/Register pages after a successful API response. */
  const login = (user: User) => {
    setAuthState({ user, isAuthenticated: true, isLoading: false });
  };

  /** Clears token from storage and resets context state. */
  const logout = () => {
    authServiceLogout();
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


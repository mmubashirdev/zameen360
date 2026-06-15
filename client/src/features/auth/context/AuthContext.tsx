import {
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import type { AuthContextType, AuthState, User } from "../types/auth.types";
import { getStoredUser, getStoredToken, clearAuth } from "../services/authService";
import { getProfile } from "../api/authApi";
import { AuthContext } from "./authContextStore";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user:            getStoredUser(),
    token:           getStoredToken(),
    isAuthenticated: Boolean(getStoredToken()), // Optimistically authenticate if token exists
    isLoading:       true, // Start loading if we need to fetch user
    error:           null,
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setUser = useCallback(
    (user: User | null, token?: string) => {
      setState((prev) => ({
        user,
        token:           token ?? prev.token,
        isAuthenticated: !!user,
        isLoading:       false,
        error:           null,
      }));
    },
    []
  );

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setState({
      user:            null,
      token:           null,
      isAuthenticated: false,
      isLoading:       false,
      error:           null,
    });
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      try {
        const response = await getProfile();
        if (response.data) {
          setUser(response.data as User, token);
        } else {
          logout();
        }
      } catch (err) {
        console.error("Auth init failed:", err);
        logout();
      }
    };

    if (!state.user && state.token) {
      initAuth();
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.user, state.token, setUser, logout]);

  const value = useMemo<AuthContextType>(
    () => ({ ...state, setLoading, setUser, setError, logout }),
    [state, setLoading, setUser, setError, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

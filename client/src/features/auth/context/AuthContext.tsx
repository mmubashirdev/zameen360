import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import type { ReactNode } from "react";
import type { AuthContextType, AuthState, User } from "../types/auth.types";
import { getStoredUser, clearAuth } from "../services/authService";
import { STORAGE_KEYS } from "../constants/authConstants";
import { getProfile, logout as logoutApi } from "../api/authApi";
import { AuthContext } from "./authContextStore";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user:            getStoredUser(),
    token:           null,
    isAuthenticated: Boolean(getStoredUser()), // Optimistically authenticate if user exists
    isLoading:       true, // Start loading if we need to fetch user
    error:           null,
  });

  const isInitialized = useRef(false);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setUser = useCallback(
    (user: User | null, token?: string) => {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        clearAuth();
      }

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

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      clearAuth();
      setState({
        user:            null,
        token:           null,
        isAuthenticated: false,
        isLoading:       false,
        error:           null,
      });
    }
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initAuth = async () => {
      const user = getStoredUser();
      if (!user) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const response = await getProfile();
        if (response.data) {
          setUser(response.data as User);
        } else {
          logout();
        }
      } catch (err) {
        console.error("Auth init failed:", err);
        logout();
      }
    };

    initAuth();
  }, [setUser, logout]);

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

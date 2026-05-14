import {
  useState,
  useCallback,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import type { AuthContextType, AuthState, User } from "../types/auth.types";
import { getStoredUser, getStoredToken } from "../services/authService";
import { AuthContext } from "./authContextStore";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user:            getStoredUser(),
    token:           getStoredToken(),
    isAuthenticated: Boolean(getStoredToken() && getStoredUser()),
    isLoading:       false,
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
    setState({
      user:            null,
      token:           null,
      isAuthenticated: false,
      isLoading:       false,
      error:           null,
    });
  }, []);

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

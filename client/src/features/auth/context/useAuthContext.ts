import { useContext } from "react";
import { AuthContext } from "./authContextStore";
import type { AuthContextType } from "../types/auth.types";

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuthContext must be used within <AuthProvider>");
  }

  return ctx;
}

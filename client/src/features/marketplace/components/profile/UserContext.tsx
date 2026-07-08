import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type { ReactNode } from "react";
import {
  getSellerProfile,
  updateSellerProfile,
  type SellerProfile,
  type UpdateProfileData,
} from "../../../../api/seller.api";
import { useAuthContext } from "@features/auth/hooks/useAuth";

interface UserContextType {
  user: SellerProfile | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  updateUser: (data: UpdateProfileData) => Promise<void>;
  setProfileImage: (img: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuthContext();

  // Derive stable primitives from the auth user to avoid object-reference churn
  const authUserId = (authUser as any)?.userId ?? (authUser as any)?.id ?? null;
  const authUserRole = authUser?.role ?? null;

  // Prevent concurrent or duplicate fetches
  const isFetchingRef = useRef(false);

  const fetchUser = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated || !authUserId) {
        setUser(null);
        return;
      }

      const role = String(authUserRole || "").toUpperCase();
      const canUseSellerProfile = role === "SELLER" || role === "SOCIETY_OWNER";

      if (!canUseSellerProfile) {
        setUser(null);
        return;
      }

      const data = await getSellerProfile();
      setUser(data);
    } catch (err: any) {
      setUser(null);
      setError(err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
    // Only re-create fetchUser when the user's identity or role changes (primitives)
  }, [authUserId, authUserRole, isAuthenticated]);

  // Run once auth has finished loading
  useEffect(() => {
    if (authLoading) return;
    fetchUser();
  }, [authLoading, fetchUser]);

  const updateUser = useCallback(async (data: UpdateProfileData) => {
    try {
      const updated = await updateSellerProfile(data);
      setUser(updated);
    } catch (err: any) {
      console.error("Error updating user:", err);
      throw err;
    }
  }, []);

  const setProfileImage = useCallback(async (img: string) => {
    try {
      const updated = await updateSellerProfile({ profilePicture: img });
      setUser(updated);
    } catch (err: any) {
      console.error("Error updating profile image:", err);
      throw err;
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        refreshUser: fetchUser,
        updateUser,
        setProfileImage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};

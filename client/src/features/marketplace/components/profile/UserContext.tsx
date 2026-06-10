import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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

  const fetchUser = useCallback(async () => {
    if (authLoading) return;
    
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated || !authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Only fetch if user is SELLER
      if (authUser.role !== 'SELLER') {
        console.log("⏭️ Skipping seller fetch - user is", authUser.role);
        setUser(null);
        setLoading(false);
        return;
      }

      console.log("🔍 Fetching seller profile...");
      const data = await getSellerProfile();
      console.log("✅ Seller data:", data);
      setUser(data);
    } catch (err: any) {
      console.log("⚠️ Seller profile fetch skipped");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [authUser, isAuthenticated, authLoading]);

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

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
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
  getBuyerProfile,
  updateBuyerProfile,
  type BuyerProfile,
  type UpdateBuyerData,
} from "../../../../api/buyer.api";
import { useAuthContext } from "@features/auth/hooks/useAuth";

interface BuyerContextType {
  buyer: BuyerProfile | null;
  loading: boolean;
  error: string | null;
  refreshBuyer: () => Promise<void>;
  updateBuyer: (data: UpdateBuyerData) => Promise<void>;
  setProfileImage: (img: string) => Promise<void>;
}

const BuyerContext = createContext<BuyerContextType | undefined>(undefined);

export const BuyerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [buyer, setBuyer] = useState<BuyerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuthContext();

  // Derive stable primitives from the auth user to avoid object-reference churn
  const authUserId = (authUser as any)?.userId ?? (authUser as any)?.id ?? null;
  const authUserRole = authUser?.role ?? null;

  // Prevent concurrent or duplicate fetches
  const isFetchingRef = useRef(false);

  const fetchBuyer = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated || !authUserId || authUserRole !== "BUYER") {
        setBuyer(null);
        return;
      }

      const data = await getBuyerProfile();
      setBuyer(data);
    } catch (err: any) {
      console.error("❌ Buyer fetch error:", err?.message);
      setError(err?.message || "Failed to load buyer profile");
      setBuyer(null);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
    // Only re-create fetchBuyer when the user's identity or role changes (primitives)
  }, [authUserId, authUserRole, isAuthenticated]);

  // Run once auth has finished loading
  useEffect(() => {
    if (authLoading) return;
    fetchBuyer();
  }, [authLoading, fetchBuyer]);

  const updateBuyer = useCallback(async (data: UpdateBuyerData) => {
    try {
      const updated = await updateBuyerProfile(data);
      setBuyer(updated);
    } catch (err: any) {
      console.error("Error updating buyer:", err);
      throw err;
    }
  }, []);

  const setProfileImage = useCallback(async (img: string) => {
    try {
      const updated = await updateBuyerProfile({ profilePicture: img });
      setBuyer(updated);
    } catch (err: any) {
      console.error("Error updating profile image:", err);
      throw err;
    }
  }, []);

  return (
    <BuyerContext.Provider
      value={{
        buyer,
        loading,
        error,
        refreshBuyer: fetchBuyer,
        updateBuyer,
        setProfileImage,
      }}
    >
      {children}
    </BuyerContext.Provider>
  );
};

export const useBuyer = () => {
  const ctx = useContext(BuyerContext);
  if (!ctx) throw new Error("useBuyer must be used within BuyerProvider");
  return ctx;
};
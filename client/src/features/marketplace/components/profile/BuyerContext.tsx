import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import {
  getBuyerProfile,
  updateBuyerProfile,
  type BuyerProfile,
  type UpdateBuyerData,
} from "../../../../api/buyer.api";

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

  const fetchBuyer = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("zameen360_token");
      if (!token) {
        setBuyer(null);
        setLoading(false);
        return;
      }

      // Check role from localStorage first
      const storedUser = JSON.parse(localStorage.getItem('zameen360_user') || '{}');
      const userRole = String(storedUser.role || '').toUpperCase();

      // Only fetch if user is BUYER
      if (userRole !== 'BUYER') {
        console.log("⏭️ Skipping buyer fetch - user is", userRole);
        setBuyer(null);
        setLoading(false);
        return;
      }

      console.log("🔍 Fetching buyer profile...");
      const data = await getBuyerProfile();
      console.log("✅ Buyer data:", data);
      setBuyer(data);
    } catch (err: any) {
      console.error("❌ Buyer fetch error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Failed to load buyer profile");
      setBuyer(null);
    } finally {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    fetchBuyer();
  }, [fetchBuyer]);

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
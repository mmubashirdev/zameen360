import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { STORAGE_KEYS } from "../constants/authConstants";
import { useAuthContext } from "../hooks/useAuth";
import axiosInstance from "@shared/lib/axios";

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ctx = useAuthContext();
  const processed = useRef(false);

  useEffect(() => {
    // Prevent double execution
    if (processed.current) return;
    processed.current = true;

    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      navigate(`/login?error=${error}`, { replace: true });
      return;
    }

    if (!token) {
      navigate("/login?error=no_token", { replace: true });
      return;
    }

    // Save token
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }

    // Fetch user profile
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/auth/profile");
        const data = response as unknown as {
          success: boolean;
          data?: {
            id?: string;
            userId?: string;
            fullName: string;
            email: string;
            role: "BUYER" | "SELLER" | "ADMIN";
            isVerified: boolean;
          };
        };

        if (data.success && data.data) {
          const user = {
            userId: data.data.userId ?? data.data.id ?? "",
            fullName: data.data.fullName,
            email: data.data.email,
            role: data.data.role,
            isVerified: data.data.isVerified,
          };

          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
          ctx?.setUser?.(user, token);

          // Redirect to welcome
          navigate("/marketplace", { replace: true });
        } else {
          navigate("/login?error=profile_failed", { replace: true });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        navigate("/login?error=profile_failed", { replace: true });
      }
    };

    fetchUser();
  }, [searchParams, navigate, ctx]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #4F46E5, #3b82f6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          boxShadow: "0 20px 60px rgba(79, 70, 229, 0.3)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid rgba(255,255,255,0.3)",
            borderTopColor: "#ffffff",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>

      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#0f172a",
          margin: "0 0 8px",
        }}
      >
        Signing you in...
      </h2>
      <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
        Please wait while we complete your authentication
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

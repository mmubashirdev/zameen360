import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import AuthFooter from "../components/AuthFooter";
import { ToastContainer } from "@shared/components/Toast";
import { useToast } from "@shared/hooks/useToast";
import { useAuth } from "../hooks/useAuth";

interface VerifyEmailLocationState {
  email?: string;
}

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { verifyEmail, resendVerificationOtp, isLoading } = useAuth();
  const state = (location.state as VerifyEmailLocationState | null) ?? null;

  const [email, setEmail] = useState(state?.email ?? "");
  const [otpCode, setOtpCode] = useState("");
  const [isResending, setIsResending] = useState(false);

  const cleanedOtp = useMemo(
    () => otpCode.replace(/\D/g, "").slice(0, 6),
    [otpCode]
  );

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || cleanedOtp.length !== 6) {
      toast.error("Missing details", "Enter your email and the 6-digit OTP.");
      return;
    }

    try {
      await verifyEmail({
        email: email.trim().toLowerCase(),
        otpCode: cleanedOtp,
      });
      toast.success("Email verified", "Your account is ready.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String(err.message)
          : "Verification failed.";
      toast.error("Verification failed", message);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      toast.error("Email required", "Enter your email first.");
      return;
    }

    setIsResending(true);
    try {
      const message = await resendVerificationOtp(email.trim().toLowerCase());
      toast.success("OTP sent", message);
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String(err.message)
          : "Could not resend the OTP.";
      toast.error("Resend failed", message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <AuthNavbar />
      <main
        style={{
          minHeight: "calc(100vh - 68px)",
          marginTop: 68,
          display: "grid",
          placeItems: "center",
          padding: "32px 20px",
          background:
            "radial-gradient(circle at top, #dbeafe 0%, #f8fafc 42%, #ffffff 100%)",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: 520,
            background: "#ffffff",
            borderRadius: 24,
            padding: 32,
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
            border: "1px solid #dbeafe",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <h1 style={{ margin: "0 0 12px", color: "#0f172a", fontSize: 32 }}>
            Verify your email
          </h1>
          <p style={{ margin: "0 0 24px", color: "#64748b", lineHeight: 1.7 }}>
            Enter the verification code sent to your inbox to activate your
            Zameen 360 account.
          </p>

          <form
            onSubmit={handleVerify}
            style={{ display: "grid", gap: 16 }}
            noValidate
          >
            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ color: "#334155", fontWeight: 600 }}>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ color: "#334155", fontWeight: 600 }}>
                6-digit OTP
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={cleanedOtp}
                onChange={(event) => setOtpCode(event.target.value)}
                placeholder="123456"
                style={{ ...inputStyle, letterSpacing: 6, fontSize: 20 }}
              />
            </label>

            <button type="submit" disabled={isLoading} style={primaryButtonStyle}>
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              marginTop: 16,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              style={secondaryButtonStyle}
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
            <Link
              to="/login"
              style={{
                color: "#2563eb",
                fontWeight: 600,
                alignSelf: "center",
                textDecoration: "none",
              }}
            >
              Back to login
            </Link>
          </div>
        </section>
      </main>
      <AuthFooter />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  padding: "14px 16px",
  outline: "none",
  fontSize: 15,
  color: "#0f172a",
  background: "#ffffff",
};

const primaryButtonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 14,
  padding: "14px 18px",
  fontWeight: 700,
  color: "#ffffff",
  cursor: "pointer",
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
};

const secondaryButtonStyle: React.CSSProperties = {
  border: "1px solid #bfdbfe",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 600,
  color: "#1d4ed8",
  cursor: "pointer",
  background: "#eff6ff",
};

// Email Verification page (after registration)


// VerifyEmailPage.tsx
import { useMemo, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import AuthFooter from "../components/AuthFooter";
import { ToastContainer } from "@shared/components/Toast";
import { useToast } from "@shared/hooks/useToast";
import { useAuth } from "../hooks/useAuth";

interface VerifyEmailLocationState {
  email?: string;
  userId?: string;
}

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { verifyEmail, resendVerificationOtp, isLoading } = useAuth();
  const state = (location.state as VerifyEmailLocationState | null) ?? null;

  const [email] = useState(state?.email ?? "");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const cleanedOtp = useMemo(() => otp.join(""), [otp]);

  // ── OTP Input Handlers ─────────────────────────────────────────────

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // ── Verify Handler ─────────────────────────────────────────────────

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cleanedOtp.length !== 6) {
      toast.error("Incomplete Code", "Please enter the full 6-digit verification code.");
      return;
    }

    try {
      await verifyEmail({
        email: email.trim().toLowerCase(),
        otpCode: cleanedOtp,
      });
      toast.success("Email Verified!", "Your account has been activated successfully.");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1200);
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: string }).message)
          : "Invalid or expired code. Please try again.";
      toast.error("Verification Failed", message);
      // Clear OTP and refocus
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  // ── Resend Handler ─────────────────────────────────────────────────

  const handleResend = async () => {
    if (!email.trim()) {
      toast.error("Email Required", "No email found. Please sign up again.");
      return;
    }
    if (resendTimer > 0) return;

    setIsResending(true);
    try {
      const message = await resendVerificationOtp(email.trim().toLowerCase());
      toast.success("Code Sent!", message || "A new verification code has been sent.");
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: string }).message)
          : "Could not resend the code. Please try again.";
      toast.error("Resend Failed", message);
    } finally {
      setIsResending(false);
    }
  };

  // ── Mask Email ─────────────────────────────────────────────────────

  const maskedEmail = useMemo(() => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (!domain) return email;
    if (local.length <= 2) return `${local}***@${domain}`;
    return `${local.slice(0, 2)}${"•".repeat(Math.min(local.length - 2, 6))}@${domain}`;
  }, [email]);

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <>
      <AuthNavbar />

      <main style={mainStyle}>
        {/* Decorative top gradient bar */}
        <div style={topBarStyle} />

        <section style={cardStyle}>
          {/* Icon */}
          <div style={iconContainerStyle}>
            <div style={iconCircleStyle}>
              <i
                className="fa-solid fa-envelope-open-text"
                style={{ fontSize: 28, color: "#2563eb" }}
              />
            </div>
          </div>

          {/* Heading */}
          <h1 style={headingStyle}>Verify Your Email</h1>
          <p style={subtitleStyle}>
            We've sent a 6-digit verification code to
          </p>
          <p style={emailDisplayStyle}>{maskedEmail || "your email"}</p>

          {/* OTP Form */}
          <form onSubmit={handleVerify} noValidate style={{ width: "100%" }}>
            {/* OTP Inputs */}
            <div style={otpContainerStyle} onPaste={handleOtpPaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                  style={{
                    ...otpInputStyle,
                    borderColor: digit ? "#2563eb" : "#e2e8f0",
                    background: digit ? "#eff6ff" : "#f8fafc",
                    transform: digit ? "scale(1.05)" : "scale(1)",
                  }}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || cleanedOtp.length !== 6}
              style={{
                ...verifyBtnStyle,
                opacity: isLoading || cleanedOtp.length !== 6 ? 0.6 : 1,
                cursor:
                  isLoading || cleanedOtp.length !== 6
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                  <span style={spinnerStyle} />
                  Verifying...
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                  <i className="fa-solid fa-shield-check" style={{ fontSize: 16 }} />
                  Verify Email
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={dividerStyle}>
            <span style={dividerLineStyle} />
            <span style={dividerTextStyle}>Didn't receive the code?</span>
            <span style={dividerLineStyle} />
          </div>

          {/* Resend Button */}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || resendTimer > 0}
            style={{
              ...resendBtnStyle,
              opacity: isResending || resendTimer > 0 ? 0.5 : 1,
              cursor: isResending || resendTimer > 0 ? "not-allowed" : "pointer",
            }}
          >
            {isResending ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <span style={spinnerSmallStyle} />
                Sending...
              </span>
            ) : resendTimer > 0 ? (
              `Resend in ${resendTimer}s`
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <i className="fa-solid fa-rotate-right" style={{ fontSize: 14 }} />
                Resend Code
              </span>
            )}
          </button>

          {/* Help Text */}
          <p style={helpTextStyle}>
            <i
              className="fa-solid fa-circle-info"
              style={{ color: "#94a3b8", marginRight: 6 }}
            />
            Check your spam folder if you don't see the email
          </p>

          {/* Back to Login */}
          <Link to="/login" style={backLinkStyle}>
            <i className="fa-solid fa-arrow-left" style={{ fontSize: 12 }} />
            Back to Login
          </Link>
        </section>
      </main>

      <AuthFooter />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

      {/* Keyframe for spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}



const mainStyle: React.CSSProperties = {
  minHeight: "calc(100vh - 68px)",
  marginTop: 68,
  display: "grid",
  placeItems: "center",
  padding: "40px 20px",
  background: "linear-gradient(180deg, #f0f5ff 0%, #f8fafc 50%, #ffffff 100%)",
  fontFamily: "'Poppins', 'Inter', sans-serif",
};

const topBarStyle: React.CSSProperties = {
  position: "fixed",
  top: 68,
  left: 0,
  right: 0,
  height: 4,
  background:
    "linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa, #3b82f6, #2563eb)",
  backgroundSize: "200% 100%",
  zIndex: 10,
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 460,
  background: "#ffffff",
  borderRadius: 20,
  padding: "40px 36px 36px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 20px 60px rgba(37,99,235,0.08)",
  border: "1px solid #e8eef6",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  animation: "fadeInUp 0.5s ease-out",
};

const iconContainerStyle: React.CSSProperties = {
  marginBottom: 20,
};

const iconCircleStyle: React.CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
  display: "grid",
  placeItems: "center",
  border: "2px solid #bfdbfe",
};

const headingStyle: React.CSSProperties = {
  margin: "0 0 8px",
  fontSize: 26,
  fontWeight: 700,
  color: "#0f172a",
  textAlign: "center",
  letterSpacing: "-0.02em",
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  color: "#64748b",
  textAlign: "center",
  lineHeight: 1.5,
};

const emailDisplayStyle: React.CSSProperties = {
  margin: "4px 0 28px",
  fontSize: 14,
  fontWeight: 600,
  color: "#2563eb",
  textAlign: "center",
  background: "#eff6ff",
  padding: "6px 16px",
  borderRadius: 8,
  border: "1px solid #dbeafe",
};

const otpContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  justifyContent: "center",
  marginBottom: 24,
  width: "100%",
};

const otpInputStyle: React.CSSProperties = {
  width: 50,
  height: 56,
  borderRadius: 12,
  border: "2px solid #e2e8f0",
  fontSize: 22,
  fontWeight: 700,
  color: "#0f172a",
  textAlign: "center",
  outline: "none",
  transition: "all 0.2s ease",
  fontFamily: "'Poppins', monospace",
};

const verifyBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 20px",
  borderRadius: 12,
  border: "none",
  fontSize: 15,
  fontWeight: 700,
  color: "#ffffff",
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
  transition: "all 0.2s ease",
  fontFamily: "'Poppins', sans-serif",
  letterSpacing: "0.02em",
};

const dividerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  margin: "24px 0 16px",
};

const dividerLineStyle: React.CSSProperties = {
  flex: 1,
  height: 1,
  background: "#e2e8f0",
};

const dividerTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#94a3b8",
  whiteSpace: "nowrap",
  fontWeight: 500,
};

const resendBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 20px",
  borderRadius: 12,
  border: "1.5px solid #dbeafe",
  fontSize: 14,
  fontWeight: 600,
  color: "#2563eb",
  background: "#f8fafc",
  transition: "all 0.2s ease",
  fontFamily: "'Poppins', sans-serif",
};

const helpTextStyle: React.CSSProperties = {
  margin: "20px 0 16px",
  fontSize: 12,
  color: "#94a3b8",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const backLinkStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "#64748b",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: 6,
  transition: "color 0.2s ease",
};

const spinnerStyle: React.CSSProperties = {
  width: 18,
  height: 18,
  border: "2.5px solid rgba(255,255,255,0.3)",
  borderTopColor: "#ffffff",
  borderRadius: "50%",
  animation: "spin 0.6s linear infinite",
};

const spinnerSmallStyle: React.CSSProperties = {
  width: 14,
  height: 14,
  border: "2px solid rgba(37,99,235,0.2)",
  borderTopColor: "#2563eb",
  borderRadius: "50%",
  animation: "spin 0.6s linear infinite",
};

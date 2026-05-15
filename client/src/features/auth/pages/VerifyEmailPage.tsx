import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "@shared/components/Toast";
import { useToast } from "@shared/hooks/useToast";
import { useAuth } from "../hooks/useAuth";
import styles from "../pages/verifyemail.module.css";

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
  const [expiryTimer, setExpiryTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Auto focus first input ──────────────────────────────
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // ── Resend cooldown timer ───────────────────────────────
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // ── Code expiry timer ───────────────────────────────────
  useEffect(() => {
    if (expiryTimer <= 0) return;
    const interval = setInterval(() => {
      setExpiryTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryTimer]);

  const cleanedOtp = useMemo(() => otp.join(""), [otp]);

  // ── Format timer ────────────────────────────────────────
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // ── OTP Handlers ────────────────────────────────────────
  const handleOtpChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = digit;
      return newOtp;
    });

    if (digit && index < 5) {
      requestAnimationFrame(() => {
        inputRefs.current[index + 1]?.focus();
      });
    }
  }, []);

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        setOtp((prev) => {
          const newOtp = [...prev];
          if (!newOtp[index] && index > 0) {
            newOtp[index - 1] = "";
            requestAnimationFrame(() => {
              inputRefs.current[index - 1]?.focus();
            });
          } else {
            newOtp[index] = "";
          }
          return newOtp;
        });
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    []
  );

  const handleOtpPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const newOtp = ["", "", "", "", "", ""];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);

    const focusIndex = Math.min(pasted.length, 5);
    requestAnimationFrame(() => {
      inputRefs.current[focusIndex]?.focus();
    });
  }, []);

  // ── Verify Handler ──────────────────────────────────────
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cleanedOtp.length !== 6) {
      toast.error("Incomplete Code", "Please enter the full 6-digit code.");
      return;
    }

    try {
      await verifyEmail({
        email: email.trim().toLowerCase(),
        otpCode: cleanedOtp,
      });

      toast.success("Email Verified!", "Account activated successfully.");
      navigate("/welcome", { replace: true });
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: string }).message)
          : "Invalid or expired code.";

      toast.error("Verification Failed", message);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  // ── Resend Handler ──────────────────────────────────────
  const handleResend = async () => {
    if (!email.trim()) {
      toast.error("Email Required", "No email found. Please sign up again.");
      return;
    }
    if (resendTimer > 0) return;

    setIsResending(true);
    try {
      const message = await resendVerificationOtp(email.trim().toLowerCase());
      toast.success("Code Sent!", message || "New code sent.");
      setResendTimer(60);
      setExpiryTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: string }).message)
          : "Could not resend code.";
      toast.error("Resend Failed", message);
    } finally {
      setIsResending(false);
    }
  };

  // ── Mask Email - Split into local & domain ──────────────
  const emailLocal = useMemo(() => {
    if (!email) return "";
    const local = email.split("@")[0] || "";
    if (local.length <= 3) return `${local}***`;
    return `${local.slice(0, 3)}${"*".repeat(Math.min(local.length - 3, 10))}`;
  }, [email]);

  const emailDomain = useMemo(() => {
    if (!email) return "";
    return email.split("@")[1] || "";
  }, [email]);

  return (
    <div className={styles.page}>
      {/* ─── LEFT SIDE - Hero ──────────────────────────────────── */}
      <div className={styles.leftSide}>
        <div className={styles.bgImage}>
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
            alt="Luxury Property"
          />
          <div className={styles.overlay} />
        </div>

        {/* Logo Top Left */}
        <div className={styles.logoBox}>
          <div className={styles.logoPlaceholder}>
            <span className={styles.logoText}>
              Z<span>360</span>
            </span>
          </div>
        </div>

        {/* Hero Content Center */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Find. Buy. Sell.
            <br />
            Your Property{" "}
            <span className={styles.heroAccent}>360°</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Discover the best properties, connect with trusted agents, and
            make smart real estate decisions.
          </p>
        </div>

        {/* Stats Bottom */}
        <div className={styles.statsBox}>
          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <i className="fa-solid fa-house" aria-hidden="true" />
            </div>
            <div className={styles.statNumber}>10K+</div>
            <div className={styles.statLabel}>Properties</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <i className="fa-solid fa-users" aria-hidden="true" />
            </div>
            <div className={styles.statNumber}>500+</div>
            <div className={styles.statLabel}>Agents</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIconWrap}>
              <i className="fa-solid fa-location-dot" aria-hidden="true" />
            </div>
            <div className={styles.statNumber}>50+</div>
            <div className={styles.statLabel}>Cities</div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT SIDE - Verify Form ─────────────────────────── */}
      <div className={styles.rightSide}>
        <div className={styles.card}>
          {/* Back to Login */}
          <Link to="/login" className={styles.backLink}>
            <i className="fa-solid fa-arrow-left" />
            Back to Login
          </Link>

          {/* Shield Icon */}
          <div className={styles.shieldIconWrap}>
            <div className={styles.shieldCircle}>
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
            </div>
          </div>

          {/* Title */}
          <h2 className={styles.cardTitle}>Verify Your Email</h2>
          <p className={styles.cardSubtitle}>
            Enter the 6-digit code sent to
          </p>

          {/* ✅ Email split into spans (using DIV not P) */}
          <div className={styles.emailMasked}>
            {email ? (
              <>
                <span>{emailLocal}</span>
                <span aria-hidden="true" style={{ margin: "0 4px" }}>
                  @
                </span>
                <span>{emailDomain}</span>
              </>
            ) : (
              "your email"
            )}
          </div>

          {/* OTP Form */}
          <form onSubmit={handleVerify} noValidate className={styles.form}>
            <div
              className={styles.otpContainer}
              onPaste={handleOtpPaste}
            >
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
                  className={`${styles.otpInput} ${
                    digit ? styles.otpInputFilled : ""
                  }`}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            {/* Expiry Timer */}
            <p className={styles.expiryText}>
              <i className="fa-regular fa-clock" aria-hidden="true" />
              Code expires in{" "}
              <span className={styles.timerValue}>
                {formatTime(expiryTimer)}
              </span>
            </p>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || cleanedOtp.length !== 6}
              className={`${styles.verifyBtn} ${
                cleanedOtp.length === 6 ? styles.verifyBtnActive : ""
              }`}
            >
              {isLoading ? (
                <span className={styles.btnLoading}>
                  <span className={styles.spinner} />
                  Verifying...
                </span>
              ) : (
                "Verify Code"
              )}
            </button>
          </form>

          {/* Resend */}
          <p className={styles.resendText}>
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || resendTimer > 0}
              className={styles.resendBtn}
            >
              {isResending
                ? "Sending..."
                : resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Resend Code"}
            </button>
          </p>
        </div>
      </div>

      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  );
}
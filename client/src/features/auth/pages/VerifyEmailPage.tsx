import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "@shared/components/Toast";
import { useToast } from "@shared/hooks/useToast";
import { getErrorMessage } from "@shared/utils/errorHandler";
import { useAuth } from "../hooks/useAuth";
import styles from "../pages/verifyemail.module.css";

const EMAIL_OTP_EXPIRY_MS = 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const VERIFY_EMAIL_RESEND_KEY = "verify_email_resend_expiry";
const VERIFY_EMAIL_CODE_KEY = "verify_email_code_expiry";
const VERIFY_EMAIL_PENDING_EMAIL_KEY = "verify_email_pending_email";

interface VerifyEmailLocationState {
  email?: string;
  userId?: string;
  otpExpiresAt?: string;
  resendAvailableAt?: string;
}

const getRemainingSeconds = (timestampMs: number) =>
  Math.max(0, Math.ceil((timestampMs - Date.now()) / 1000));

const parseTimestamp = (value?: string | null) => {
  if (!value) return null;
  const parsed = Number(value);
  if (Number.isFinite(parsed)) return parsed;

  const isoParsed = Date.parse(value);
  return Number.isFinite(isoParsed) ? isoParsed : null;
};

const initializeTimer = (
  storageKey: string,
  preferredTimestamp: string | undefined,
  fallbackMs: number
) => {
  const preferredTime = parseTimestamp(preferredTimestamp);
  if (preferredTime !== null) {
    sessionStorage.setItem(storageKey, String(preferredTime));
    return getRemainingSeconds(preferredTime);
  }

  const storedTime = parseTimestamp(sessionStorage.getItem(storageKey));
  if (storedTime !== null) {
    return getRemainingSeconds(storedTime);
  }

  const fallbackTime = Date.now() + fallbackMs;
  sessionStorage.setItem(storageKey, String(fallbackTime));
  return getRemainingSeconds(fallbackTime);
};

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { verifyEmail, resendVerificationOtp, isLoading } = useAuth();
  const state = (location.state as VerifyEmailLocationState | null) ?? null;

  const [email] = useState(
    () =>
      state?.email ??
      sessionStorage.getItem(VERIFY_EMAIL_PENDING_EMAIL_KEY) ??
      ""
  );
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(() =>
    initializeTimer(
      VERIFY_EMAIL_RESEND_KEY,
      state?.resendAvailableAt,
      RESEND_COOLDOWN_MS
    )
  );
  const [expiryTimer, setExpiryTimer] = useState(() =>
    initializeTimer(
      VERIFY_EMAIL_CODE_KEY,
      state?.otpExpiresAt,
      EMAIL_OTP_EXPIRY_MS
    )
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const cleanedOtp = useMemo(() => otp.join(""), [otp]);
  const isCodeExpired = expiryTimer <= 0;

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (state?.email) {
      sessionStorage.setItem(VERIFY_EMAIL_PENDING_EMAIL_KEY, state.email);
    }
  }, [state?.email]);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = window.setTimeout(() => {
      setResendTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (expiryTimer <= 0) return;

    const timer = window.setTimeout(() => {
      setExpiryTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [expiryTimer]);

  useEffect(() => {
    if (!isCodeExpired) return;
    setOtp(["", "", "", "", "", ""]);
  }, [isCodeExpired]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (isCodeExpired) return;

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
    },
    [isCodeExpired]
  );

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

  const handleOtpPaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (isCodeExpired) return;

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
    },
    [isCodeExpired]
  );

  const clearVerifyEmailSession = () => {
    sessionStorage.removeItem(VERIFY_EMAIL_RESEND_KEY);
    sessionStorage.removeItem(VERIFY_EMAIL_CODE_KEY);
    sessionStorage.removeItem(VERIFY_EMAIL_PENDING_EMAIL_KEY);
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email Required", "No email found. Please sign up again.");
      return;
    }

    if (isCodeExpired) {
      toast.error("Code Expired", "Please request a new verification code.");
      return;
    }

    if (cleanedOtp.length !== 6) {
      toast.error("Incomplete Code", "Please enter the full 6-digit code.");
      return;
    }

    try {
      await verifyEmail({
        email: email.trim().toLowerCase(),
        otpCode: cleanedOtp,
      });

      clearVerifyEmailSession();
      toast.success("Email Verified!", "Account activated successfully.");
      navigate("/marketplace", { replace: true });
    } catch (err) {
      const message = getErrorMessage(err, "Invalid or expired code.");

      if (message.toLowerCase().includes("expired")) {
        setExpiryTimer(0);
      }

      toast.error("Verification Failed", message);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      toast.error("Email Required", "No email found. Please sign up again.");
      return;
    }
    if (resendTimer > 0) return;

    setIsResending(true);
    try {
      const result = await resendVerificationOtp(email.trim().toLowerCase());
      toast.success("Code Sent!", result.message || "New code sent.");

      const resendAvailableAt =
        parseTimestamp(result.data?.resendAvailableAt) ??
        Date.now() + RESEND_COOLDOWN_MS;
      const otpExpiresAt =
        parseTimestamp(result.data?.otpExpiresAt) ??
        Date.now() + EMAIL_OTP_EXPIRY_MS;

      sessionStorage.setItem(
        VERIFY_EMAIL_RESEND_KEY,
        String(resendAvailableAt)
      );
      sessionStorage.setItem(VERIFY_EMAIL_CODE_KEY, String(otpExpiresAt));

      setResendTimer(getRemainingSeconds(resendAvailableAt));
      setExpiryTimer(getRemainingSeconds(otpExpiresAt));
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      const message = getErrorMessage(err, "Could not resend code.");
      toast.error("Resend Failed", message);
    } finally {
      setIsResending(false);
    }
  };

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
      <div className={styles.leftSide}>
        <div className={styles.bgImage}>
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
            alt="Luxury Property"
          />
          <div className={styles.overlay} />
        </div>

        <div className={styles.logoBox}>
          <div className={styles.logoPlaceholder}>
            <span className={styles.logoText}>
              Z<span>360</span>
            </span>
          </div>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Find. Buy. Sell.
            <br />
            Your Property{" "}
            <span className={styles.heroAccent}>360°</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Discover the best properties, connect with trusted agents, and make
            smart real estate decisions.
          </p>
        </div>

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

      <div className={styles.rightSide}>
        <div className={styles.card}>
          <Link to="/login" className={styles.backLink}>
            <i className="fa-solid fa-arrow-left" />
            Back to Login
          </Link>

          <div className={styles.shieldIconWrap}>
            <div className={styles.shieldCircle}>
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
            </div>
          </div>

          <h2 className={styles.cardTitle}>Verify Your Email</h2>
          <p className={styles.cardSubtitle}>Enter the 6-digit code sent to</p>

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

          <form onSubmit={handleVerify} noValidate className={styles.form}>
            <div className={styles.otpContainer} onPaste={handleOtpPaste}>
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
                  disabled={isCodeExpired}
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

            <p className={styles.expiryText}>
              <i className="fa-regular fa-clock" aria-hidden="true" />
              {isCodeExpired ? (
                <>
                  Code expired. <span className={styles.timerValue}>Resend required</span>
                </>
              ) : (
                <>
                  Code expires in{" "}
                  <span className={styles.timerValue}>
                    {formatTime(expiryTimer)}
                  </span>
                </>
              )}
            </p>

            <button
              type="submit"
              disabled={isLoading || cleanedOtp.length !== 6 || isCodeExpired}
              className={`${styles.verifyBtn} ${
                cleanedOtp.length === 6 && !isCodeExpired
                  ? styles.verifyBtnActive
                  : ""
              }`}
            >
              {isLoading ? (
                <span className={styles.btnLoading}>
                  <span className={styles.spinner} />
                  Verifying...
                </span>
              ) : isCodeExpired ? (
                "Code Expired"
              ) : (
                "Verify Code"
              )}
            </button>
          </form>

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
                ? `Resend in ${formatTime(resendTimer)}`
                : "Resend Code"}
            </button>
          </p>
        </div>
      </div>

      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  );
}

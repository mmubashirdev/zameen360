import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer } from "@shared/components/Toast";
import { useToast } from "@shared/hooks/useToast";
import { getErrorMessage } from "@shared/utils/errorHandler";
import { useAuthContext } from "../hooks/useAuth";
import { setupSocietyOwnerPassword } from "../../../api/scheme.api";
import styles from "./societysetuppassword.module.css";
// We reuse the VerifyEmail image or a placeholder
import image from "../assets/photo-1722421492323-eaf9c401befe.avif";

export default function SocietySetupPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const toast = useToast();
  const { setUser } = useAuthContext();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid Request", "No activation token found.");
      return;
    }

    if (!password) {
      toast.error("Required Field", "Please enter a password.");
      return;
    }

    if (password.length < 8) {
      toast.error("Weak Password", "Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password Mismatch", "Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await setupSocietyOwnerPassword({ token, password });
      
      // Assume response returns { success: true, message, accessToken, user }
      if (response.success && response.accessToken && response.user) {
        setUser?.(response.user, response.accessToken);
        toast.success("Success", "Password set successfully. Welcome!");
        
        // Redirect to profile/dashboard
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
      } else {
        toast.error("Setup Failed", response.message || "Could not complete setup.");
      }
    } catch (err) {
      const message = getErrorMessage(err, "Failed to set password. Token may be invalid or expired.");
      toast.error("Setup Failed", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.leftSide}>
        <div className={styles.bgImage}>
          <img src={image} alt="Luxury Property" />
          <div className={styles.overlay} />
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Manage Your
            <br />
            Housing Society <span className={styles.heroAccent}>360°</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Set up your account to access your Society Owner Dashboard and start managing your properties.
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
        </div>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.card}>
          <div className={styles.shieldIconWrap}>
            <div className={styles.shieldCircle}>
              <i className="fa-solid fa-lock" aria-hidden="true" />
            </div>
          </div>

          <h2 className={styles.cardTitle}>Setup Password</h2>
          <p className={styles.cardSubtitle}>
            Your housing society application has been approved! Set a secure password for your new account.
          </p>

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="password">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={styles.inputField}
                placeholder="At least 8 characters"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className={styles.inputField}
                placeholder="Re-enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className={styles.submitBtn}
            >
              {isLoading ? (
                <span className={styles.btnLoading}>
                  <span className={styles.spinner} />
                  Saving...
                </span>
              ) : (
                "Set Password"
              )}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  );
}

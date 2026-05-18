import { Check, X } from "lucide-react";
import styles from "../styles/passwordStrengthMeter.module.css";

interface PasswordStrengthMeterProps {
  password?: string;
}

interface Criterion {
  label: string;
  test: (p: string) => boolean;
}

const CRITERIA: Criterion[] = [
  { label: "At least 8 characters long", test: (p) => p.length >= 8 },
  {
    label: "Contains uppercase and lowercase letters",
    test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  },
  { label: "Contains at least one number", test: (p) => /\d/.test(p) },
  {
    label: "Contains at least one special character",
    test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

const LABELS: string[] = ["", "Weak", "Fair", "Good", "Strong"];

const SEG_CLASS_MAP: Record<number, string> = {
  1: styles.seg1,
  2: styles.seg2,
  3: styles.seg3,
  4: styles.seg4,
};

const STRENGTH_TEXT_CLASS_MAP: Record<number, string> = {
  1: styles.strengthWeak,
  2: styles.strengthFair,
  3: styles.strengthGood,
  4: styles.strengthStrong,
};

export default function PasswordStrengthMeter({
  password = "",
}: PasswordStrengthMeterProps) {
  const metCount = CRITERIA.filter((c) => c.test(password)).length;
  const score = password ? Math.max(1, metCount) : 0;

  return (
    <div className={styles.wrapper}>
      {/* Bar */}
      <div className={styles.barRow}>
        <span className={styles.barLabel}>Password Strength:</span>
        <div className={styles.barSegments}>
          {[1, 2, 3, 4].map((seg) => (
            <div
              key={seg}
              className={[
                styles.segment,
                seg <= score ? SEG_CLASS_MAP[score] : styles.segEmpty,
              ].join(" ")}
            />
          ))}
        </div>
        {score > 0 && (
          <span className={[styles.strengthText, STRENGTH_TEXT_CLASS_MAP[score]].join(" ")}>
            {LABELS[score]}
          </span>
        )}
      </div>

      {/* Checklist */}
      <ul className={styles.checklist}>
        {CRITERIA.map((c, i) => {
          const ok = c.test(password);
          return (
            <li key={i} className={styles.checkItem}>
              <span className={[styles.checkIcon, ok ? styles.checkIconOk : styles.checkIconFail].join(" ")}>
                {ok ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  <X size={14} strokeWidth={2.5} />
                )}
              </span>
              <span className={ok ? styles.checkTextOk : styles.checkTextFail}>
                {c.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

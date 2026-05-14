import styles from "../styles/auth.module.css";
import { getPasswordStrength } from "@shared/utils/helpers";

interface PasswordStrengthProps {
  password: string;
}

const SEGMENT_CLASSES: Record<string, string> = {
  weak:   styles.segmentWeak,
  fair:   styles.segmentFair,
  good:   styles.segmentGood,
  strong: styles.segmentStrong,
  "":     "",
};

const LABEL_CLASSES: Record<string, string> = {
  weak:   styles.labelWeak,
  fair:   styles.labelFair,
  good:   styles.labelGood,
  strong: styles.labelStrong,
  "":     "",
};

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const strength = getPasswordStrength(password);
  const label = strength.level
    ? strength.level.charAt(0).toUpperCase() + strength.level.slice(1)
    : "";

  return (
    <div>
      <div className={styles.strengthBar}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={[
              styles.strengthSegment,
              i <= strength.score ? SEGMENT_CLASSES[strength.level] : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
      </div>
      {label && (
        <span
          className={`${styles.strengthLabel} ${
            LABEL_CLASSES[strength.level]
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}

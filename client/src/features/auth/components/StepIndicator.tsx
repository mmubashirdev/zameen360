import { Check } from "lucide-react";
import styles from "../styles/stepIndicator.module.css";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
}

const STEPS = [
  { id: 1, label: "Email" },
  { id: 2, label: "Verify" },
  { id: 3, label: "New Password" },
  { id: 4, label: "Success" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        {/* Background line */}
        <div className={styles.trackBg} />
        {/* Filled progress line */}
        <div
          className={styles.trackFill}
          style={{ width: `${progressPercent}%` }}
        />

        {STEPS.map((step) => {
          const done = step.id < currentStep;
          const active = step.id === currentStep;

          return (
            <div key={step.id} className={styles.stepItem}>
              <div
                className={[
                  styles.bubble,
                  done
                    ? styles.bubbleDone
                    : active
                    ? styles.bubbleActive
                    : styles.bubbleDefault,
                ].join(" ")}
              >
                {done ? <Check size={14} strokeWidth={3} /> : step.id}
              </div>
              <span
                className={[
                  styles.label,
                  active
                    ? styles.labelActive
                    : done
                    ? styles.labelDone
                    : styles.labelDefault,
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { ClipboardList } from 'lucide-react';
import styles from '../PostProperty/styles/ProgressSteps.module.css';

interface ProgressStepsProps {
  currentStep?: number;
}

const ProgressSteps = ({ currentStep = 1 }: ProgressStepsProps) => {
  const steps = [
    { num: 1, label: 'Property Info', active: currentStep === 1 },
    { num: 2, label: 'Media & Location', active: currentStep === 2 },
    { num: 3, label: 'Review & Publish', active: currentStep === 3 },
  ];

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.steps}>
        {steps.map((step, idx) => (
          <div key={step.num} className={styles.stepWrap}>
            <div className={`${styles.circle} ${step.active ? styles.active : ''}`}>
              {step.active ? <ClipboardList size={20} /> : step.num}
            </div>
            <span className={`${styles.label} ${step.active ? styles.activeLabel : ''}`}>{step.label}</span>
            {idx < steps.length - 1 && <div className={styles.line} />}
          </div>
        ))}
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }} />
      </div>
      <div className={styles.info}>
        <span>{Math.round(progressPercentage)}% Complete</span>
        <span>Step {currentStep} of 3</span>
      </div>
    </div>
  );
};

export default ProgressSteps;
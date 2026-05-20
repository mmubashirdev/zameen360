import { ClipboardList } from 'lucide-react';
import styles from '../PostProperty/styles/ProgressSteps.module.css';

const ProgressSteps = () => {
  const steps = [
    { num: 1, label: 'Property Info', active: true },
    { num: 2, label: 'Media & Location', active: false },
    { num: 3, label: 'Review & Publish', active: false },
  ];

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
        <div className={styles.progressFill} style={{ width: '33%' }} />
      </div>
      <div className={styles.info}>
        <span>33% Complete</span>
        <span>Step 1 of 3</span>
      </div>
    </div>
  );
};

export default ProgressSteps;
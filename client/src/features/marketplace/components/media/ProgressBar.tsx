import React from 'react';
import styles from './styles/ProgressBar.module.css';

const ProgressBar: React.FC = () => (
  <div className={styles.wrapper}>
    <div className={styles.steps}>
      <div className={styles.step}>
        <div className={`${styles.circle} ${styles.done}`}>1</div>
        <span className={styles.label}>Property Info</span>
      </div>
      <div className={styles.line} />
      <div className={styles.step}>
        <div className={`${styles.circle} ${styles.active}`}>2</div>
        <span className={`${styles.label} ${styles.activeLabel}`}>Media & Location</span>
      </div>
      <div className={`${styles.line} ${styles.inactive}`} />
      <div className={styles.step}>
        <div className={styles.circle}>3</div>
        <span className={styles.label}>Review & Publish</span>
      </div>
    </div>
    <div className={styles.bar}>
      <div className={styles.fill} />
    </div>
    <div className={styles.meta}>
      <span>66% Complete</span>
      <span>Step 2 of 3</span>
    </div>
  </div>
);

export default ProgressBar;

import { useState } from 'react';
import { Tag, Key, FileText, Home, Building, Store, Map, Castle, ShoppingBag, Briefcase, Warehouse, Sprout } from 'lucide-react';
import styles from '../PostProperty/styles/BasicInformation.module.css';

const BasicInformation = () => {
  const [purpose, setPurpose] = useState('Sell');
  const [propType, setPropType] = useState('House');

  const purposes = [
    { label: 'Sell', icon: <Tag size={20} /> },
    { label: 'Rent', icon: <Key size={20} /> },
    { label: 'Lease', icon: <FileText size={20} /> },
  ];
  const types = [
    { label: 'House', icon: <Home size={18} /> },
    { label: 'Apartment', icon: <Building size={18} /> },
    { label: 'Commercial', icon: <Store size={18} /> },
    { label: 'Plot / Land', icon: <Map size={18} /> },
    { label: 'Villa', icon: <Castle size={18} /> },
    { label: 'Shop', icon: <ShoppingBag size={18} /> },
    { label: 'Office', icon: <Briefcase size={18} /> },
    { label: 'Warehouse', icon: <Warehouse size={18} /> },
    { label: 'Agricultural', icon: <Sprout size={18} /> },
  ];

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>A. Basic Information</h3>
      <div className={styles.grid}>
        <div>
          <label className={styles.label}>Purpose <span className={styles.req}>*</span></label>
          <div className={styles.optionGrid3}>
            {purposes.map((p) => (
              <div
                key={p.label}
                className={`${styles.option} ${purpose === p.label ? styles.active : ''}`}
                onClick={() => setPurpose(p.label)}
              >
                <div className={styles.iconWrap}>{p.icon}</div>
                <span>{p.label}</span>
              </div>
            ))}
          </div>
          <label className={styles.label} style={{ marginTop: 16 }}>Property Title <span className={styles.req}>*</span></label>
          <input className={styles.input} placeholder="e.g., Beautiful 5 Marla House in DHA" />
          <span className={styles.counter}>0/100</span>
        </div>

        <div>
          <label className={styles.label}>Property Type <span className={styles.req}>*</span></label>
          <div className={styles.optionGrid5}>
            {types.map((t) => (
              <div
                key={t.label}
                className={`${styles.option} ${propType === t.label ? styles.active : ''}`}
                onClick={() => setPropType(t.label)}
              >
                <div className={styles.iconWrap}>{t.icon}</div>
                <span className={styles.optionLabel}>{t.label}</span>
              </div>
            ))}
          </div>
          <label className={styles.label} style={{ marginTop: 16 }}>Description <span className={styles.req}>*</span></label>
          <textarea className={styles.textarea} placeholder="Describe your property in detail..." rows={4} />
          <span className={styles.counter}>0/3000</span>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
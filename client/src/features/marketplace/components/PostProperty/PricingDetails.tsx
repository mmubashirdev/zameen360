import { useState } from 'react';
import styles from '../PostProperty/styles/PricingDetails.module.css';

const amenities = [
  'Central AC','Generator Backup','Solar Panels','Servant Quarter','Lawn/Garden','Boundary Wall',
  'Swimming Pool','Gym Area','CCTV Security','Security System','Gated Community','Water Boring',
  'Gas Supply','Internet Ready','Parking/Garage','Modular Kitchen','Water Boring'
];

const PricingDetails = () => {
  const [negotiable, setNegotiable] = useState(true);
  const [installment, setInstallment] = useState(true);
  const [selected, setSelected] = useState<string[]>(['Central AC','Generator Backup','Solar Panels','Servant Quarter','Lawn/Garden','Boundary Wall','Swimming Pool','Gym Area','CCTV Security','Security System','Gated Community','Water Boring','Gas Supply','Internet Ready']);

  const toggle = (a: string) => {
    setSelected(selected.includes(a) ? selected.filter(s => s !== a) : [...selected, a]);
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>C. Pricing Details</h3>
      <div className={styles.grid}>
        <div>
          <label className={styles.label}>Price (PKR) <span className={styles.req}>*</span></label>
          <input className={styles.input} defaultValue="25,000,000" />
          <span className={styles.note}>In Words: Two Crore Fifty Lakh Only</span>
        </div>
        <div className={styles.toggleWrap}>
          <label className={styles.label}>Price Negotiable?</label>
          <label className={styles.switch}>
            <input type="checkbox" checked={negotiable} onChange={() => setNegotiable(!negotiable)} />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.rentBox}>
          <div className={styles.rentTitle}>For Rent Only</div>
          <div className={styles.rentGrid}>
            <div><label className={styles.smLabel}>Monthly Rent (PKR)</label><input className={styles.input} placeholder="100,000"/></div>
            <div><label className={styles.smLabel}>Security Deposit (PKR)</label><input className={styles.input} placeholder="200,000"/></div>
            <div><label className={styles.smLabel}>Advance Months</label><input className={styles.input} placeholder="3"/></div>
          </div>
        </div>
      </div>

      <div className={styles.installmentRow}>
        <label className={styles.label}>Installment Available?</label>
        <label className={styles.switch}>
          <input type="checkbox" checked={installment} onChange={() => setInstallment(!installment)} />
          <span className={styles.slider}></span>
        </label>
      </div>

      <div className={styles.grid3}>
        <div><label className={styles.label}>Down Payment (PKR)</label><input className={styles.input} defaultValue="5,000,000"/></div>
        <div><label className={styles.label}>Monthly Installment (PKR)</label><input className={styles.input} defaultValue="500,000"/></div>
        <div><label className={styles.label}>Duration</label><select className={styles.input}><option>5 Years</option></select></div>
      </div>

      <h3 className={styles.title} style={{ marginTop: 24 }}>D. Amenities & Features</h3>
      <div className={styles.amenities}>
        {amenities.map((a, i) => (
          <label key={i} className={styles.amenity}>
            <input type="checkbox" checked={selected.includes(a)} onChange={() => toggle(a)} />
            <span>{a}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PricingDetails;
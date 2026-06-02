import { useCallback } from 'react';
import styles from '../PostProperty/styles/PricingDetails.module.css';
import { useProperty } from '../context/useProperty';

const amenities = [
  'Central AC','Generator Backup','Solar Panels','Servant Quarter','Lawn/Garden','Boundary Wall',
  'Swimming Pool','Gym Area','CCTV Security','Security System','Gated Community','Water Boring',
  'Gas Supply','Internet Ready','Parking/Garage','Modular Kitchen','Water Boring'
];

const PricingDetails = () => {
  const { data, updateData } = useProperty();
  
  const negotiable = data.negotiable ?? false;
  const installment = data.installmentAvailable ?? false;
  const price = data.price || '';
  const downPayment = data.downPayment || '';
  const monthlyInstallment = data.monthlyInstallment || '';
  const duration = data.duration || '5 Years';
  const monthlyRent = data.monthlyRent || '';
  const securityDeposit = data.securityDeposit || '';
  const advanceMonths = data.advanceMonths || '';
  const selected = data.amenities || [];

  const handleUpdate = useCallback((updates: Partial<typeof data>) => {
    updateData(updates);
  }, [updateData]);

  const toggle = (a: string) => {
    const newAmenities = selected.includes(a) 
      ? selected.filter(s => s !== a) 
      : [...selected, a];
    handleUpdate({ amenities: newAmenities });
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>C. Pricing Details</h3>
      <div className={styles.grid}>
        <div>
          <label className={styles.label}>Price (PKR) <span className={styles.req}>*</span></label>
          <input 
            className={styles.input}
            value={price}
            onChange={(e) => handleUpdate({ price: e.target.value })}
          />
          <span className={styles.note}>In Words: {new Intl.NumberFormat('en-IN').format(Number(price) || 0)}</span>
        </div>
        <div className={styles.toggleWrap}>
          <label className={styles.label}>Price Negotiable?</label>
          <label className={styles.switch}>
            <input 
              type="checkbox" 
              checked={negotiable} 
              onChange={() => handleUpdate({ negotiable: !negotiable })} 
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.rentBox}>
          <div className={styles.rentTitle}>For Rent Only</div>
          <div className={styles.rentGrid}>
            <div>
              <label className={styles.smLabel}>Monthly Rent (PKR)</label>
              <input 
                className={styles.input} 
                placeholder="100,000"
                value={monthlyRent}
                onChange={(e) => handleUpdate({ monthlyRent: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.smLabel}>Security Deposit (PKR)</label>
              <input 
                className={styles.input} 
                placeholder="200,000"
                value={securityDeposit}
                onChange={(e) => handleUpdate({ securityDeposit: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.smLabel}>Advance Months</label>
              <input 
                className={styles.input} 
                placeholder="3"
                value={advanceMonths}
                onChange={(e) => handleUpdate({ advanceMonths: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.installmentRow}>
        <label className={styles.label}>Installment Available?</label>
        <label className={styles.switch}>
          <input 
            type="checkbox" 
            checked={installment} 
            onChange={() => handleUpdate({ installmentAvailable: !installment })} 
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      <div className={styles.grid3}>
        <div>
          <label className={styles.label}>Down Payment (PKR)</label>
          <input 
            className={styles.input}
            value={downPayment}
            onChange={(e) => handleUpdate({ downPayment: e.target.value })}
          />
        </div>
        <div>
          <label className={styles.label}>Monthly Installment (PKR)</label>
          <input 
            className={styles.input}
            value={monthlyInstallment}
            onChange={(e) => handleUpdate({ monthlyInstallment: e.target.value })}
          />
        </div>
        <div>
          <label className={styles.label}>Duration</label>
          <select 
            className={styles.input}
            value={duration}
            onChange={(e) => handleUpdate({ duration: e.target.value })}
          >
            <option>1 Year</option>
            <option>2 Years</option>
            <option>3 Years</option>
            <option>5 Years</option>
            <option>10 Years</option>
            <option>15 Years</option>
            <option>20 Years</option>
          </select>
        </div>
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
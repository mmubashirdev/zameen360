import { useState } from 'react';
import styles from '../PostProperty/styles/PropertyDetails.module.css';

const PropertyDetails = () => {
  const [beds, setBeds] = useState('5');
  const [baths, setBaths] = useState('6');
  const [floors, setFloors] = useState('2');
  const [parking, setParking] = useState('2');
  const [furnishing, setFurnishing] = useState('Semi-Furnished');
  const [possession, setPossession] = useState('Ready to Move');

  const bedOptions = ['1','2','3','4','5','6','7','8','9','10+'];
  const bathOptions = ['1','2','3','4','5','6','7','8+'];
  const floorOptions = ['1','2','3','4','5+'];
  const parkOptions = ['0','1','2','3','4+'];

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>B. Property Details</h3>
      <div className={styles.grid3}>
        <div>
          <label className={styles.label}>Area Size <span className={styles.req}>*</span></label>
          <div className={styles.row}>
            <input className={styles.input} defaultValue="5" />
            <select className={styles.select}><option>Marla</option></select>
          </div>
        </div>
        <div>
          <label className={styles.label}>Bedrooms <span className={styles.req}>*</span></label>
          <div className={styles.btnRow}>
            {bedOptions.map(b => (
              <button key={b} className={`${styles.numBtn} ${beds===b?styles.numActive:''}`} onClick={()=>setBeds(b)}>{b}</button>
            ))}
          </div>
        </div>
        <div>
          <label className={styles.label}>Bathrooms <span className={styles.req}>*</span></label>
          <div className={styles.btnRow}>
            {bathOptions.map(b => (
              <button key={b} className={`${styles.numBtn} ${baths===b?styles.numActive:''}`} onClick={()=>setBaths(b)}>{b}</button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.grid3}>
        <div>
          <label className={styles.label}>Floors</label>
          <div className={styles.btnRow}>
            {floorOptions.map(f => (
              <button key={f} className={`${styles.numBtn} ${floors===f?styles.numActive:''}`} onClick={()=>setFloors(f)}>{f}</button>
            ))}
          </div>
        </div>
        <div>
          <label className={styles.label}>Parking</label>
          <div className={styles.btnRow}>
            {parkOptions.map(p => (
              <button key={p} className={`${styles.numBtn} ${parking===p?styles.numActive:''}`} onClick={()=>setParking(p)}>{p}</button>
            ))}
          </div>
        </div>
        <div>
          <label className={styles.label}>Year Built</label>
          <select className={styles.select}><option>2023</option></select>
        </div>
      </div>

      <div className={styles.grid3}>
        <div>
          <label className={styles.label}>Furnishing <span className={styles.req}>*</span></label>
          <div className={styles.tabRow}>
            {['Unfurnished','Semi-Furnished','Fully Furnished'].map(f => (
              <button key={f} className={`${styles.tab} ${furnishing===f?styles.tabActive:''}`} onClick={()=>setFurnishing(f)}>{f}</button>
            ))}
          </div>
        </div>
        <div>
          <label className={styles.label}>Possession <span className={styles.req}>*</span></label>
          <div className={styles.tabRow}>
            {['Ready to Move','Under Construction'].map(p => (
              <button key={p} className={`${styles.tab} ${possession===p?styles.tabActive:''}`} onClick={()=>setPossession(p)}>{p}</button>
            ))}
          </div>
        </div>
        <div>
          <label className={styles.label}>Facing Direction</label>
          <select className={styles.select}><option>North</option></select>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
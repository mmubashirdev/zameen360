import styles from "../styles/propertiesCategories.module.css"

function PropertiesCategories() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Properties <span>Categories</span></h2>
        <p className={styles.subtitle}>Find your dream home by choosing a category</p>
      </div>
      <div className='div-Containers'>
        <div>
            <i className={`ri-home-4-fill ${styles.hello}`}></i>
            <h3>Houses</h3>
            <p>2,450+ Listings</p>
        </div>

        <div>
            <i className={`ri-building-4-fill ${styles.hello}`}></i>
            <h3>Apartments</h3>
            <p>3,120. Listings</p>
        </div>

        <div>
            <i className={`ri-building-2-fill ${styles.hello}`}></i>
            <h3>Commercial</h3>
            <p>1,120+ Listings</p>
        </div>

        <div>
            <i className={`ri-home-4-fill ${styles.hello}`}></i>
            <h3>Plots</h3>
            <p>4,230 Listings</p>
        </div>

        <div>
            <i className={`ri-building-2-fill ${styles.hello}`}></i>
            <h3>Villas</h3>
            <p>1,850+ Listings</p>
        </div>

        <div>
             <i className={`ri-building-4-fill ${styles.hello}`}></i>
            <h3>Offices</h3>
            <p>820+ Listings</p>
        </div>
      </div>
    
    </div>
  );
}

export default PropertiesCategories;
import { Cities } from "../data/cities"
import styles from '../styles/PopularLocations.module.css'

function PopularLocations() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Popular <span>Locations</span></h2>
        <p className={styles.subtitle}>Explore properties in Pakistan's most prominent cities</p>
      </div>

      <div className={styles.container}>

        {Cities.map((city) => (

          <div key={city.id} className={styles.card}>

            <img src={city.image} alt={city.city} className={styles.image} />

            <div className={styles.overlay}>

              <h2 className={styles.cityName}>{city.city}</h2>

              <p className={styles.properties}>{city.properties} Properties</p>
              
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bottomActions}>
        <a href="#" className={styles.viewAll}>
          <span className={styles.viewAllText}>View All Cities</span>
          <span className={styles.arrow}>→</span>
        </a>
      </div>
    </section>
  )
}

export default PopularLocations
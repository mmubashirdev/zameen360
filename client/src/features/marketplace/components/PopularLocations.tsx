import { Cities } from "../data/cities"
import styles from '../styles/PopularLocations.module.css'

function PopularLocations() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>

        <h1 className={styles.title}>
          Popular Locations
          </h1>

        <a href="#" className={styles.viewAll}>
          View All Cities
          <span className={styles.arrow}>→</span>
        </a>


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
    </section>
  )
}

export default PopularLocations
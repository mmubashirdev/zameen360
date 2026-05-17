// FeaturedProperties.tsx
import { useState } from "react";
import { propertiesData } from "../data/propertyData";
import type { Property } from "../data/propertyData";
import styles from "../styles/FeatureProperty.module.css";

function FeaturedProperties() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Show 4 cards on desktop, slide 1 at a time
  const itemsPerPage = 4; 
  const maxIndex = propertiesData.length - itemsPerPage;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Featured <span>Properties</span></h2>
          <p className={styles.subtitle}>Handpicked properties just for you</p>
        </div>

        <div className={styles.carouselWrapper}>
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prevSlide}>
            &#8249;
          </button>

          <div className={styles.carouselViewport}>
            <div 
              className={styles.cardContainer}
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
            >
              {propertiesData.map((property: Property) => (
                <div className={styles.card} key={property.id}>
                  <div className={styles.imageWrapper}>
                    <img src={property.image} alt={property.title} className={styles.cardImage} />
                    <span className={`${styles.badge} ${property.status === "For Rent" ? styles.badgeRent : styles.badgeSale}`}>
                      {property.status}
                    </span>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{property.title}</h3>
                    <p className={styles.cardLocation}>
                      <span className={styles.pinIcon}>📍</span> {property.location}
                    </p>
                    <p className={styles.cardPrice}>{property.price}</p>
                    <div className={styles.features}>
                      <span>{property.beds} Beds</span>
                      <span className={styles.divider}></span>
                      <span>{property.baths} Baths</span>
                      <span className={styles.divider}></span>
                      <span>{property.area}</span>
                    </div>
                    <button className={styles.detailsBtn}>View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={nextSlide}>
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProperties;

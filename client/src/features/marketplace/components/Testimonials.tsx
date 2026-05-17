// Testimonials.tsx
import { useState } from "react";
import { testimonialsData } from "../data/testimonialData";
import type { Testimonial } from "../data/testimonialData";
import styles from "../styles/Testimonials.module.css";

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  const maxIndex = testimonialsData.length - itemsPerPage;

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
          <h2 className={styles.title}>
            What Our <span>Clients Say</span>
          </h2>
        </div>

        <div className={styles.carouselWrapper}>
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prevSlide}>
            &#8249;
          </button>

          <div className={styles.carouselViewport}>
            <div 
              className={styles.track}
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
            >
              {testimonialsData.map((client: Testimonial) => (
                <div className={styles.card} key={client.id}>
                  <div className={styles.quoteIcon}>&ldquo;</div>
                  
                  <div className={styles.stars}>
                    {Array.from({ length: client.rating }).map((_, i) => (
                      <span key={i} className={styles.star}>&#9733;</span>
                    ))}
                  </div>

                  <p className={styles.review}>{client.review}</p>

                  <div className={styles.profile}>
                    <img src={client.avatar} alt={client.name} className={styles.avatar} />
                    <div>
                      <h4 className={styles.name}>{client.name}</h4>
                      <p className={styles.location}>{client.location}</p>
                    </div>
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

export default Testimonials;

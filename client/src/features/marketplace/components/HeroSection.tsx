import React, { useState } from 'react';
import styles from '../styles/HeroSection.module.css';
import image1 from "../assets/Screenshot 2026-05-18 010903.png"
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');
  const navigate = useNavigate();
  const navigationToCreateProperty = ()=>{
    navigate("/post-property")
  }
  return (
    <section className={styles.hero}>
      <div className={`${styles.heroInner} py-10`}>
        <div className={styles.heroImageContainer}>
          <img
            src={image1}
            alt="Modern architectural house"
            className={styles.heroImage}
          />
          <div className={styles.heroImageFade} />
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.headline}>
            Find Your Dream Property with{" "}
            <span className={styles.brandName}>Zameen 360</span>
          </h1>
          <p className={styles.subHeadline}>
            Buy, sell or rent properties in the best locations across Pakistan.
            Verified listings, trusted properties.
          </p>
          <div className={`${styles.ctaButtons} py-4 gap-4 flex`}>
            <button className={`btn ${styles.btnPrimary} py-20`}>
              Explore Properties
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.arrowIcon}
              >
                <path
                  d="M3.333 8h9.334M8.667 4l4 4-4 4"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className={styles.btnSecondary}
              onClick={navigationToCreateProperty}
            >
              Post Property
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className={styles.searchBarWrapper}>
          <div className={styles.searchTabs}>
            <button
              className={`${styles.searchTab} ${activeTab === "buy" ? styles.searchTabActive : ""}`}
              onClick={() => setActiveTab("buy")}
            >
              Buy
            </button>
            <button
              className={`${styles.searchTab} ${activeTab === "rent" ? styles.searchTabActive : ""}`}
              onClick={() => setActiveTab("rent")}
            >
              Rent
            </button>
          </div>
          <div className={styles.searchBar}>
            <div className={styles.searchField}>
              <label className={styles.searchLabel}>Location</label>
              <div className={styles.searchInputWrapper}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.pinIcon}
                >
                  <path
                    d="M8 8.667a2 2 0 100-4 2 2 0 000 4z"
                    stroke="#6B7280"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 14.667S13.333 10.667 13.333 6.667a5.333 5.333 0 10-10.666 0c0 4 5.333 8 5.333 8z"
                    stroke="#6B7280"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Enter city, area or location"
                  className={styles.searchInput}
                />
              </div>
            </div>
            <div className={styles.searchDivider} />
            <div className={styles.searchField}>
              <label className={styles.searchLabel}>Property Type</label>
              <div className={styles.searchSelectWrapper}>
                <select className={styles.searchSelect}>
                  <option>All Types</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Plot</option>
                  <option>Commercial</option>
                </select>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.chevronIcon}
                >
                  <path
                    d="M3.5 5.25L7 8.75l3.5-3.5"
                    stroke="#6B7280"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.searchDivider} />
            <div className={styles.searchField}>
              <label className={styles.searchLabel}>Price Range</label>
              <div className={styles.searchSelectWrapper}>
                <select className={styles.searchSelect}>
                  <option>Any Price</option>
                  <option>Under 50 Lac</option>
                  <option>50 Lac - 1 Crore</option>
                  <option>1 Crore - 5 Crore</option>
                  <option>Above 5 Crore</option>
                </select>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.chevronIcon}
                >
                  <path
                    d="M3.5 5.25L7 8.75l3.5-3.5"
                    stroke="#6B7280"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <button className={styles.searchButton}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.searchIcon}
              >
                <path
                  d="M8.25 14.25a6 6 0 100-12 6 6 0 000 12zM15.75 15.75l-3.262-3.262"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Search Properties
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
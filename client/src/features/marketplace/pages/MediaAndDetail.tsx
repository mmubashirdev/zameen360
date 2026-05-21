import React, { useState } from 'react';
import Navbar from "../components/PostProperty/PropertyNav";
import ProgressBar from '../components/media/ProgressBar';
import ImageUpload from '../components/media/ImageUpload';
import MediaSection from '../components/media/MediaSection';
import LocationSection from '../components/media/LocationSection';
import LivePreview from '../components/media/LivePreview';
import type { UploadedImage } from '../components/media/types';
import styles from '../components/media/styles/PostProperty.module.css';
import { useNavigate } from 'react-router-dom';





const MediaAndDetail: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [coverId, setCoverId] = useState<string | null>(null);

  const coverImage = images.find((image) => image.id === coverId) || null;
  const canProceed = images.length >= 5;

  const NavigateToReview = () => {
    navigate("/review");
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>
        <div className={styles.main}>
          <h2 className={styles.title}>Post Your Property</h2>
          <p className={styles.sub}>List your property in 3 easy steps and reach thousands of buyers</p>
          <p className={styles.note}>
            Fields marked with <span className={styles.req}>*</span> are required
          </p>

          <ProgressBar />
          <ImageUpload images={images} setImages={setImages} coverId={coverId} setCoverId={setCoverId} />
          <MediaSection />
          <LocationSection />

          <div className={styles.actions}>
            <button className={styles.backBtn} type="button">
              Back
            </button>
            <button className={styles.nextBtn} type="button" disabled={!canProceed} onClick={NavigateToReview}>
              Next: Review & Publish
            </button>
          </div>
        </div>

        <div className={styles.sidebar}>
          <LivePreview coverImage={coverImage} />
        </div>
      </div>
    </div>
  );
};

export default MediaAndDetail;

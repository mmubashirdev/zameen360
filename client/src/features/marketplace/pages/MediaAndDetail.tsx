import React, { useState, useEffect } from 'react';
import DashboardNavbar from "../components/DashboardNavbar";
import ProgressBar from '../components/media/ProgressBar';
import ImageUpload from '../components/media/ImageUpload';
import MediaSection from '../components/media/MediaSection';
import LocationSection from '../components/media/LocationSection';
import LivePreview from '../components/media/LivePreview';
import type { UploadedImage } from '../components/media/types';
import styles from '../components/media/styles/PostProperty.module.css';
import { useNavigate } from 'react-router-dom';
import { useProperty } from '../components/context/useProperty';
import type { UploadedImage as ContextUploadedImage } from '../components/context/type';

const MediaAndDetail: React.FC = () => {
  const navigate = useNavigate();
  const { data, updateData } = useProperty();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [coverId, setCoverId] = useState<string | null>(null);

  // Load saved images from context on mount
  useEffect(() => {
    if (data.imageFiles && data.imageFiles.length > 0) {
      const contextImages: UploadedImage[] = data.imageFiles.map(img => ({
        id: img.id,
        file: img.file,
        url: img.url
      }));
      setImages(contextImages);
      if (contextImages.length > 0) {
        setCoverId(contextImages[0].id);
      }
    }
  }, []);

  const coverImage = images.find((image) => image.id === coverId) || null;
  const canProceed = images.length >= 5;

  const NavigateToReview = () => {
    // Save images to context before navigating
    const imageFilesToSave: ContextUploadedImage[] = images.map(img => ({
      id: img.id,
      file: img.file,
      url: img.url
    }));
    updateData({ imageFiles: imageFilesToSave });
    navigate("/review");
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar />

      <div className={styles.container}>
        <div className={styles.main}>
          <h2 className={styles.title}>Post Your Property</h2>
          <p className={styles.sub}>
            List your property in 3 easy steps and reach thousands of buyers
          </p>
          <p className={styles.note}>
            Fields marked with <span className={styles.req}>*</span> are
            required
          </p>

          <ProgressBar />
          <ImageUpload
            images={images}
            setImages={setImages}
            coverId={coverId}
            setCoverId={setCoverId}
          />
          <MediaSection onDataChange={updateData} />
          <LocationSection onDataChange={updateData} />

          <div className={styles.actions}>
            <button
              className={styles.backBtn}
              type="button"
              onClick={() => navigate("/post-property")}
            >
              Back
            </button>
            <button
              className={styles.nextBtn}
              type="button"
              disabled={!canProceed}
              onClick={NavigateToReview}
            >
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

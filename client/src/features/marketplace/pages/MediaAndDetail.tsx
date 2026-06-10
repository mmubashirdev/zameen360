// client/src/features/marketplace/pages/MediaAndDetail.tsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ImageUpload from "../components/media/ImageUpload";
import MediaSection from "../components/media/MediaSection";
import LocationSection from "../components/media/LocationSection";
import LivePreview from "../components/media/LivePreview";
import type { UploadedImage } from "../components/media/types";
import styles from "../components/media/styles/PostProperty.module.css";
import { useProperty } from "../components/context/useProperty";
import type { UploadedImage as ContextUploadedImage } from "../components/context/PropertyContext";

interface MediaAndDetailProps {
  onNext?: () => void;
  onBack?: () => void;
}

const MediaAndDetail: React.FC<MediaAndDetailProps> = ({ onNext, onBack }) => {
  const { data, updateData } = useProperty();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [coverId, setCoverId] = useState<string | null>(null);

  // ⭐ DEBUG - Check what's in context
  console.log("📍 MediaAndDetail Context Data:", {
    city: data.city,
    locality: data.locality,
    address: data.address,
    imageFiles: data.imageFiles?.length || 0,
    videoUrl: data.videoUrl,
    floorPlan: data.floorPlan,
  });

  // ⭐ Load saved images from context on mount
  useEffect(() => {
    if (data.imageFiles && data.imageFiles.length > 0) {
      const contextImages: UploadedImage[] = data.imageFiles.map((img) => ({
        id:
          (img as ContextUploadedImage & { id?: string }).id ||
          Math.random().toString(36).substring(7),
        file: img.file,
        url: img.url,
      }));
      setImages(contextImages);
      if (contextImages.length > 0 && !coverId) {
        setCoverId(contextImages[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ⭐ AUTO-SAVE images to context whenever they change
  useEffect(() => {
    const imageFilesToSave: ContextUploadedImage[] = images.map(
      (img) =>
      ({
        id: img.id,
        file: img.file,
        url: img.url,
      } as ContextUploadedImage)
    );

    updateData({ imageFiles: imageFilesToSave });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const coverImage = images.find((image) => image.id === coverId) || null;

  // ⭐ Handle next - validate before allowing
  const handleNext = () => {
    // Check images
    if (images.length < 5) {
      toast.error(
        `Please upload at least 5 images. You have ${images.length}.`
      );
      return;
    }

    // Check location fields
    if (!data.city) {
      toast.error("Please select a city");
      return;
    }
    if (!data.locality) {
      toast.error("Please enter locality/area");
      return;
    }
    if (!data.address) {
      toast.error("Please enter complete address");
      return;
    }

    // All good - proceed to next step
    if (onNext) {
      onNext();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className={styles.page}>
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

          {/* ⭐ Image Upload Section */}
          <ImageUpload
            images={images}
            setImages={setImages}
            coverId={coverId}
            setCoverId={setCoverId}
          />

          {/* ⭐ Media Section - Video & Floor Plan */}
          <MediaSection onDataChange={updateData} />

          {/* ⭐ Location Section - Pass initial values from context */}
          <LocationSection
            onDataChange={updateData}
            initialCity={data.city}
            initialLocality={data.locality}
            initialAddress={data.address}
          />

          {/* ⭐ Helper info for user */}
          <div
            style={{
              padding: "12px 16px",
              background: "#f0f9ff",
              border: "1px solid #bfdbfe",
              borderRadius: "8px",
              marginTop: "16px",
              fontSize: "13px",
              color: "#1e40af",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>ℹ️</span>
            <span>
              <strong>Required:</strong> Minimum 5 images ({images.length}/5
              uploaded), City, Locality, and Address
            </span>
          </div>

          {/* ⭐ Action Buttons */}
          <div className={styles.actions}>
            <button
              className={styles.backBtn}
              type="button"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className={styles.nextBtn}
              type="button"
              onClick={handleNext}
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
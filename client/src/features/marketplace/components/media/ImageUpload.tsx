import React, { useRef, useState } from 'react';
import styles from './styles/ImageUpload.module.css';
import type { UploadedImage } from './types';

interface ImageUploadProps {
  images: UploadedImage[];
  setImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  coverId: string | null;
  setCoverId: (id: string) => void;
}

const MAX = 30;
const MAX_SIZE = 5 * 1024 * 1024;

const ImageUpload: React.FC<ImageUploadProps> = ({ images, setImages, coverId, setCoverId }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null): void => {
    if (!files) return;

    const accepted = ['image/jpeg', 'image/png', 'image/webp'];
    const newImages: UploadedImage[] = [];

    Array.from(files).forEach((file) => {
      if (!accepted.includes(file.type)) return;
      if (file.size > MAX_SIZE) return;
      if (images.length + newImages.length >= MAX) return;

      newImages.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
      });
    });

    if (!newImages.length) return;

    setImages((previous) => {
      const updated = [...previous, ...newImages];
      if (!coverId && updated.length > 0) {
        setCoverId(updated[0].id);
      }
      return updated;
    });
  };

  const removeImage = (id: string): void => {
    setImages((previous) => {
      const image = previous.find((item) => item.id === id);
      if (image) {
        URL.revokeObjectURL(image.url);
      }

      const filtered = previous.filter((item) => item.id !== id);
      if (coverId === id && filtered.length > 0) {
        setCoverId(filtered[0].id);
      }

      return filtered;
    });
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3>
          A. Property Images <span className={styles.req}>*</span>
        </h3>
        <span className={styles.count}>{images.length}/30 uploaded</span>
      </div>

      <div
        className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          handleFiles(event.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <div className={styles.cloudIcon}>Upload</div>
        <p className={styles.mainText}>Drag & drop images here</p>
        <p className={styles.subText}>or click to browse files</p>
        <p className={styles.hint}>JPG, PNG, WEBP | Max 5MB each | Min 5, Max 30</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className={styles.grid}>
          {images.map((image) => (
            <div key={image.id} className={styles.thumb} onClick={() => setCoverId(image.id)}>
              <img src={image.url} alt={image.file.name} />
              {coverId === image.id && <span className={styles.coverBadge}>Cover</span>}
              <button
                className={styles.remove}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  removeImage(image.id);
                }}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

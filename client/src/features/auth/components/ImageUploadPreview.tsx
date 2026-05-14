import { useState, useRef, useCallback } from "react";
import styles from "../styles/auth.module.css";
import { formatFileSize } from "@shared/utils/helpers";
import { FILE_UPLOAD } from "../constants/authConstants";

interface ImageUploadPreviewProps {
  onChange: (file: File | null) => void;
  error?: string;
}

export default function ImageUploadPreview({
  onChange,
  error,
}: ImageUploadPreviewProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const processFile = useCallback(
    (f: File) => {
      setLocalError("");

      if (!FILE_UPLOAD.ALLOWED_TYPES.includes(f.type)) {
        setLocalError("Only JPG and PNG files are allowed.");
        return;
      }
      if (f.size > FILE_UPLOAD.MAX_SIZE_BYTES) {
        setLocalError("File size must be less than 5MB.");
        return;
      }

      setFile(f);
      onChange(f);

      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(f);
    },
    [onChange]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setFile(null);
      setPreviewUrl(null);
      setLocalError("");
      onChange(null);
      if (inputRef.current) inputRef.current.value = "";
    },
    [onChange]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragOver(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) processFile(dropped);
    },
    [processFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) processFile(selected);
    },
    [processFile]
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  }, []);

  const displayError = localError || error;

  const areaClass = [
    styles.uploadArea,
    isDragOver ? styles.uploadDragover : "",
    displayError ? styles.uploadErrorState : "",
    previewUrl ? styles.uploadHasImage : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.formGroup}>
      <div
        className={areaClass}
        role="button"
        tabIndex={0}
        aria-label="Upload profile image. Drag and drop or click to browse."
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
      >
        {previewUrl && file ? (
          <div className={styles.uploadPreview}>
            <img
              src={previewUrl}
              alt="Profile preview"
              className={styles.previewImage}
            />
            <div className={styles.previewInfo}>
              <p className={styles.previewName}>{file.name}</p>
              <p className={styles.previewSize}>
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={handleRemove}
              aria-label="Remove image"
            >
              <i className="fa-solid fa-trash-can" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <>
            <div className={styles.uploadIcon}>
              <i
                className="fa-solid fa-cloud-arrow-up"
                aria-hidden="true"
              />
            </div>
            <p className={styles.uploadText}>
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p className={styles.uploadHint}>JPG, PNG (max 5MB)</p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          className={styles.hiddenFileInput}
          onChange={handleChange}
          aria-label="Choose profile image file"
        />
      </div>

      {displayError && (
        <p className={styles.fieldError} role="alert">
          <i
            className="fa-solid fa-circle-exclamation"
            aria-hidden="true"
          />
          {displayError}
        </p>
      )}
    </div>
  );
}
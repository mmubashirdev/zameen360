import React, { useRef, useState, useCallback } from 'react';
import styles from './styles/MediaSection.module.css';

interface MediaSectionProps {
  
  onDataChange?: (data: Partial<{videoUrl: string; floorPlan: string}>) => void;
}

const MediaSection: React.FC<MediaSectionProps> = ({ onDataChange }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [tourLink, setTourLink] = useState('');
  const [floorPlan, setFloorPlan] = useState<string | null>(null);

  const videoRef = useRef<HTMLInputElement>(null);
  const floorRef = useRef<HTMLInputElement>(null);

  const handleYoutubeUrlChange = useCallback((url: string) => {
    setYoutubeUrl(url);
    onDataChange?.({ videoUrl: url });
  }, [onDataChange]);

  const handleFloorPlanChange = useCallback((file: File | undefined): void => {
    if (!file) return;
    if (floorPlan) {
      URL.revokeObjectURL(floorPlan);
    }
    const url = URL.createObjectURL(file);
    setFloorPlan(url);
    onDataChange?.({ floorPlan: url });
  }, [floorPlan, onDataChange]);

  const getYouTubeEmbed = (url: string): string => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : '';
  };

  return (
    <div className={styles.row}>
      <div className={styles.card}>
        <label className={styles.label}>
          Property Video <span className={styles.optional}>(Optional)</span>
        </label>
        <div className={styles.uploadBox} onClick={() => videoRef.current?.click()}>
          <div className={styles.icon}>Video</div>
          <div>
            Upload Video
            <br />
            <span className={styles.small}>or paste YouTube URL</span>
          </div>
          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            hidden
            onChange={(event) => setVideoFile(event.target.files?.[0] || null)}
          />
        </div>
        {videoFile && <p className={styles.fileName}>Selected: {videoFile.name}</p>}
        <input
          type="text"
          className={styles.input}
          placeholder="Paste YouTube URL here"
          value={youtubeUrl}
          onChange={(event) => handleYoutubeUrlChange(event.target.value)}
        />
        <p className={styles.hint}>e.g. https://youtube.com/watch?v=abc123</p>
        {youtubeUrl && getYouTubeEmbed(youtubeUrl) && (
          <iframe className={styles.preview} src={getYouTubeEmbed(youtubeUrl)} title="Video preview" allowFullScreen />
        )}
      </div>

      <div className={styles.card}>
        <label className={styles.label}>
          3D Virtual Tour <span className={styles.optional}>(Optional)</span>
        </label>
        <div className={styles.uploadBox}>
          <div className={styles.icon}>3D</div>
          <div>Paste 3D Tour Link</div>
        </div>
        <input
          type="text"
          className={styles.input}
          placeholder="Paste 3D Tour Link"
          value={tourLink}
          onChange={(event) => setTourLink(event.target.value)}
        />
        <p className={styles.hint}>e.g. https://my-matterport.com/show/?m=abc123</p>
      </div>

      <div className={styles.card}>
        <label className={styles.label}>
          Floor Plan <span className={styles.optional}>(Optional)</span>
        </label>
        <div className={styles.uploadBox} onClick={() => floorRef.current?.click()}>
          {floorPlan ? (
            <img src={floorPlan} alt="Floor plan preview" className={styles.floorImg} />
          ) : (
            <>
              <div className={styles.icon}>Plan</div>
              <div>Upload Floor Plan</div>
            </>
          )}
          <input
            ref={floorRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => handleFloorPlanChange(event.target.files?.[0])}
          />
        </div>
      </div>
    </div>
  );
};

export default MediaSection;

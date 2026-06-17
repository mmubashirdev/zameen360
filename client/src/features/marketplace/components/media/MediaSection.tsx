// client/src/features/marketplace/components/media/MediaSection.tsx
import { useRef, useState, useCallback } from "react";
import { Camera, X, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import styles from "./styles/MediaSection.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PanoramaRoom {
  id: string;
  roomName: string;
  file: File | null;
  previewUrl: string | null;
  isValid: boolean;
  error: string | null;
}

interface MediaSectionProps {
  onDataChange?: (
    data: Partial<{
      videoUrl: string;
      floorPlan: string;
      panoramas: { roomName: string; file: File }[];
    }>,
  ) => void;
}

// ─── Validate 2:1 equirectangular ratio ──────────────────────────────────────

const validate360Image = (
  file: File,
): Promise<{ valid: boolean; error?: string }> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = img.width / img.height;

if (ratio < 1.5 || ratio > 4.5) {
  resolve({
    valid: false,
    error: `Image ratio too extreme (${ratio.toFixed(1)}:1). Use a panoramic or 360° photo.`,
  });
} else {
  resolve({ valid: true });
}
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, error: "Cannot read image file." });
    };
    img.src = url;
  });
};

const ROOM_SUGGESTIONS = [
  "Living Room",
  "Master Bedroom",
  "Kitchen",
  "Bathroom",
  "Guest Room",
  "Dining Room",
  "Study / Office",
  "Terrace",
  "Garage",
];

// ─── Component ────────────────────────────────────────────────────────────────

const MediaSection = ({ onDataChange }: MediaSectionProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [floorPlan, setFloorPlan] = useState<string | null>(null);

  // 3D tour state
  const [tourOpen, setTourOpen] = useState(false);
  const [panoramaRooms, setPanoramaRooms] = useState<PanoramaRoom[]>([
    {
      id: "1",
      roomName: "Living Room",
      file: null,
      previewUrl: null,
      isValid: false,
      error: null,
    },
  ]);

  const videoRef = useRef<HTMLInputElement>(null);
  const floorRef = useRef<HTMLInputElement>(null);
  const roomRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // ─── Notify parent ────────────────────────────────────────────────────────

  const notifyParent = useCallback(
    (rooms: PanoramaRoom[], vidUrl: string, fpUrl: string | null) => {
      const validRooms = rooms
        .filter((r) => r.file && r.isValid)
        .map((r) => ({ roomName: r.roomName, file: r.file! }));

      onDataChange?.({
        videoUrl: vidUrl || undefined,
        floorPlan: fpUrl || undefined,
        panoramas: validRooms.length > 0 ? validRooms : undefined,
      });
    },
    [onDataChange],
  );

  // ─── Video handlers ───────────────────────────────────────────────────────

  const handleYoutubeUrlChange = useCallback(
    (url: string) => {
      setYoutubeUrl(url);
      notifyParent(panoramaRooms, url, floorPlan);
    },
    [panoramaRooms, floorPlan, notifyParent],
  );

  // ─── Floor plan handler ───────────────────────────────────────────────────

  const handleFloorPlanChange = useCallback(
    (file: File | undefined): void => {
      if (!file) return;
      if (floorPlan) URL.revokeObjectURL(floorPlan);
      const url = URL.createObjectURL(file);
      setFloorPlan(url);
      notifyParent(panoramaRooms, youtubeUrl, url);
    },
    [floorPlan, panoramaRooms, youtubeUrl, notifyParent],
  );

  // ─── Panorama handlers ────────────────────────────────────────────────────

  const handlePanoramaFile = async (roomId: string, file: File | null) => {
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setPanoramaRooms((prev) =>
        prev.map((r) =>
          r.id === roomId
            ? { ...r, error: "File must be under 20 MB", isValid: false }
            : r,
        ),
      );
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const { valid, error } = await validate360Image(file);

    setPanoramaRooms((prev) => {
      const next = prev.map((r) =>
        r.id === roomId
          ? { ...r, file, previewUrl, isValid: valid, error: error || null }
          : r,
      );
      notifyParent(next, youtubeUrl, floorPlan);
      return next;
    });
  };

  const handleRoomNameChange = (roomId: string, name: string) => {
    setPanoramaRooms((prev) => {
      const next = prev.map((r) =>
        r.id === roomId ? { ...r, roomName: name } : r,
      );
      notifyParent(next, youtubeUrl, floorPlan);
      return next;
    });
  };

  const addRoom = () => {
    if (panoramaRooms.length >= 10) return;
    setPanoramaRooms((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        roomName: `Room ${prev.length + 1}`,
        file: null,
        previewUrl: null,
        isValid: false,
        error: null,
      },
    ]);
  };

  const removeRoom = (roomId: string) => {
    setPanoramaRooms((prev) => {
      const room = prev.find((r) => r.id === roomId);
      if (room?.previewUrl) URL.revokeObjectURL(room.previewUrl);
      const next = prev.filter((r) => r.id !== roomId);
      notifyParent(next, youtubeUrl, floorPlan);
      return next;
    });
  };

  const validRoomCount = panoramaRooms.filter((r) => r.isValid).length;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>

          <div className={`${styles.card} mb-4 h-40`}>
          <label className={styles.label}>
            3D Virtual Tour <span className={styles.optional}>(Optional)</span>
          </label>
          <div
            className={`${styles.uploadBox}`}
            onClick={() => setTourOpen(true)}
            style={{
              cursor: "pointer",
              borderColor: validRoomCount > 0 ? "#16a34a" : undefined,
            }}
          >
            <div
              className={styles.icon}
              style={{ color: validRoomCount > 0 ? "#16a34a" : undefined }}
            >
              3D
            </div>
            <div style={{ color: validRoomCount > 0 ? "#16a34a" : undefined }}>
              {validRoomCount > 0
                ? `${validRoomCount} room${validRoomCount !== 1 ? "s" : ""} uploaded`
                : "Upload 360° Room Photos"}
            </div>
          </div>
          {validRoomCount > 0 && (
            <p className={styles.fileName}>
              ✓ {validRoomCount} room{validRoomCount > 1 ? "s" : ""} ready for
              virtual tour
            </p>
          )}
        </div>
      {/* ✅ Original 3-card row — unchanged */}
      <div className={styles.row}>
        {/* Card 1: Video */}
        <div className={styles.card}>
          <label className={styles.label}>
            Property Video <span className={styles.optional}>(Optional)</span>
          </label>
          <div
            className={styles.uploadBox}
            onClick={() => videoRef.current?.click()}
          >
            <div className={styles.icon}>Video</div>
            <div>
              Upload Video
              <br />
            </div>
          </div>
          {videoFile && (
            <p className={styles.fileName}>Selected: {videoFile.name}</p>
          )}
          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            hidden
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          />
        </div>


        {/* Card 3: Floor Plan */}
        <div className={styles.card}>
          <label className={styles.label}>
            Floor Plan <span className={styles.optional}>(Optional)</span>
          </label>
          <div
            className={styles.uploadBox}
            onClick={() => floorRef.current?.click()}
          >
            {floorPlan ? (
              <img
                src={floorPlan}
                alt="Floor plan preview"
                className={styles.floorImg}
              />
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
              onChange={(e) => handleFloorPlanChange(e.target.files?.[0])}
            />
          </div>
        </div>
      </div>

      {/* ✅ Modal popup with backdrop blur */}
      {tourOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setTourOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Camera size={20} className="text-blue-600" />
                    360° Virtual Tour
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload equirectangular photos (2:1 ratio) for each room
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTourOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {/* Info banner */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex gap-3">
                  <Camera size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>How to take 360° photos:</strong> Use a Ricoh Theta,
                    Insta360, or the free <strong>Google Street View</strong>{" "}
                    app on your phone. Export as equirectangular JPG (2:1 ratio,
                    e.g. 4096×2048).
                  </p>
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Rooms ({panoramaRooms.length}/10)
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      validRoomCount > 0
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-gray-50 text-gray-400 border border-gray-200"
                    }`}
                  >
                    {validRoomCount > 0
                      ? `✓ ${validRoomCount} room${validRoomCount > 1 ? "s" : ""} ready`
                      : "No rooms uploaded yet"}
                  </span>
                </div>

                {/* Room list */}
                <div className="space-y-3">
                  {panoramaRooms.map((room) => (
                    <div
                      key={room.id}
                      className={`flex gap-3 items-start p-3.5 rounded-xl border transition-colors ${
                        room.isValid
                          ? "border-green-200 bg-green-50/50"
                          : room.error
                            ? "border-red-200 bg-red-50/50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div
                        onClick={() => roomRefs.current[room.id]?.click()}
                        className="shrink-0 w-[88px] h-[60px] rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative gap-1 hover:border-blue-400 transition-colors"
                      >
                        {room.previewUrl ? (
                          <img
                            src={room.previewUrl}
                            alt="360 preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <Camera size={18} className="text-gray-400" />
                            <span className="text-[10px] text-gray-400">
                              Upload
                            </span>
                          </>
                        )}
                        {room.isValid && (
                          <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5">
                            <CheckCircle2 size={10} className="text-white" />
                          </div>
                        )}
                        <input
                          ref={(el) => {
                            roomRefs.current[room.id] = el;
                          }}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          className="hidden"
                          onChange={(e) =>
                            handlePanoramaFile(
                              room.id,
                              e.target.files?.[0] || null,
                            )
                          }
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={room.roomName}
                          onChange={(e) =>
                            handleRoomNameChange(room.id, e.target.value)
                          }
                          placeholder="Room name"
                          className="w-full border-0 border-b border-gray-200 focus:border-blue-500 outline-none pb-1 text-sm font-semibold bg-transparent mb-2"
                        />
                        <div className="flex flex-wrap gap-1">
                          {ROOM_SUGGESTIONS.filter(
                            (s) =>
                              !panoramaRooms.some(
                                (r) => r.id !== room.id && r.roomName === s,
                              ),
                          )
                            .slice(0, 5)
                            .map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => handleRoomNameChange(room.id, s)}
                                className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 bg-white text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                              >
                                {s}
                              </button>
                            ))}
                        </div>
                        {room.error && (
                          <p className="flex items-center gap-1 mt-2 text-[11px] text-red-600">
                            <AlertCircle size={12} /> {room.error}
                          </p>
                        )}
                        {room.isValid && (
                          <p className="text-[11px] text-green-600 mt-1.5">
                            ✓ Valid 360° image — will appear in virtual tour
                          </p>
                        )}
                        {!room.file && !room.error && (
                          <p className="text-[11px] text-gray-400 mt-1.5">
                            Upload a 360° equirectangular image for this room
                          </p>
                        )}
                      </div>

                      {/* Remove */}
                      {panoramaRooms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRoom(room.id)}
                          className="shrink-0 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add room */}
                {panoramaRooms.length < 10 && (
                  <button
                    type="button"
                    onClick={addRoom}
                    className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 flex items-center justify-center gap-2 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <Plus size={15} /> Add Another Room
                  </button>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                <p className="text-[11px] text-gray-400">
                  Max 10 rooms • Max 20 MB each • 2:1 ratio required
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTourOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setTourOpen(false)}
                    className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={15} />
                    {validRoomCount > 0
                      ? `Save ${validRoomCount} Room${validRoomCount > 1 ? "s" : ""}`
                      : "Done"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MediaSection;

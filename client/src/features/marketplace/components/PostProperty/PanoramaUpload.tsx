// client/src/features/marketplace/components/PostProperty/PanoramaUpload.tsx
import { useState, useCallback, useRef } from "react";
import { Plus, X, Camera, AlertCircle, CheckCircle2 } from "lucide-react";

interface PanoramaRoom {
  roomName: string;
  file: File | null;
  previewUrl: string | null;
  isValid: boolean;
  error: string | null;
}

interface PanoramaUploadProps {
  onRoomsChange: (rooms: { roomName: string; file: File }[]) => void;
}

// ─── Validate 2:1 equirectangular ratio ───────────────────────────────────────
const validate360Image = (file: File): Promise<{ valid: boolean; error?: string }> => {
  return new Promise((resolve) => {
    const img   = new Image();
    const url   = URL.createObjectURL(file);
    img.onload  = () => {
      URL.revokeObjectURL(url);
      const ratio = img.width / img.height;
      if (Math.abs(ratio - 2) > 0.1) {
        resolve({
          valid: false,
          error: `Image must be 2:1 ratio (e.g. 4096×2048). Got ${img.width}×${img.height}.`,
        });
      } else {
        resolve({ valid: true });
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, error: "Could not read image file." });
    };
    img.src = url;
  });
};

const ROOM_SUGGESTIONS = [
  "Living Room", "Master Bedroom", "Kitchen",
  "Bathroom", "Guest Room", "Study", "Terrace", "Garage",
];

const PanoramaUpload = ({ onRoomsChange }: PanoramaUploadProps) => {
  const [rooms, setRooms] = useState<PanoramaRoom[]>([
    { roomName: "Living Room", file: null, previewUrl: null, isValid: false, error: null },
  ]);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateParent = useCallback((updatedRooms: PanoramaRoom[]) => {
    const validRooms = updatedRooms
      .filter((r) => r.file && r.isValid)
      .map((r) => ({ roomName: r.roomName, file: r.file! }));
    onRoomsChange(validRooms);
  }, [onRoomsChange]);

  const handleFileChange = async (index: number, file: File | null) => {
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setRooms((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], error: "File must be under 20 MB", isValid: false };
        return next;
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const { valid, error } = await validate360Image(file);

    setRooms((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        file,
        previewUrl,
        isValid: valid,
        error: error || null,
      };
      updateParent(next);
      return next;
    });
  };

  const handleRoomNameChange = (index: number, name: string) => {
    setRooms((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], roomName: name };
      updateParent(next);
      return next;
    });
  };

  const addRoom = () => {
    setRooms((prev) => [
      ...prev,
      { roomName: `Room ${prev.length + 1}`, file: null, previewUrl: null, isValid: false, error: null },
    ]);
  };

  const removeRoom = (index: number) => {
    setRooms((prev) => {
      const next = prev.filter((_, i) => i !== index);
      updateParent(next);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-800 text-sm">
            360° Virtual Tour Images
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            Upload equirectangular images (2:1 ratio) taken with a 360° camera or Google Street View app
          </p>
        </div>
        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
          Optional
        </span>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3">
        <Camera className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-700 space-y-1">
          <p className="font-semibold">How to take 360° photos:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-blue-600">
            <li>Use a Ricoh Theta, Insta360, or Samsung 360 camera</li>
            <li>Or use "Street View" app on iPhone/Android (free)</li>
            <li>Export as equirectangular JPG (2:1 ratio, e.g. 4096×2048)</li>
          </ol>
        </div>
      </div>

      {/* Room list */}
      <div className="space-y-3">
        {rooms.map((room, index) => (
          <div
            key={index}
            className={`
              border rounded-xl p-4 transition-all
              ${room.isValid
                ? "border-green-200 bg-green-50/30"
                : room.error
                  ? "border-red-200 bg-red-50/30"
                  : "border-gray-200 bg-white"
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* Upload area */}
              <div
                className="relative shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                onClick={() => fileInputRefs.current[index]?.click()}
              >
                {room.previewUrl ? (
                  <img
                    src={room.previewUrl}
                    alt="360 preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-6 h-6 text-gray-400" />
                )}
                <input
                  ref={(el) => (fileInputRefs.current[index] = el)}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  className="hidden"
                  onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                />
                {room.isValid && (
                  <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Room details */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={room.roomName}
                  onChange={(e) => handleRoomNameChange(index, e.target.value)}
                  placeholder="Room name"
                  className="w-full text-sm font-medium border-0 border-b border-gray-200 focus:border-blue-500 focus:outline-none bg-transparent pb-1 mb-2"
                />

                {/* Room name suggestions */}
                <div className="flex flex-wrap gap-1">
                  {ROOM_SUGGESTIONS
                    .filter((s) => !rooms.some((r, i) => i !== index && r.roomName === s))
                    .slice(0, 4)
                    .map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleRoomNameChange(index, suggestion)}
                        className="text-xs px-2 py-0.5 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                </div>

                {/* Status */}
                {room.error && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {room.error}
                  </div>
                )}
                {room.isValid && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Valid 360° image
                  </p>
                )}
                {!room.file && !room.error && (
                  <p className="text-xs text-gray-400 mt-1">
                    Click thumbnail to upload 360° image
                  </p>
                )}
              </div>

              {/* Remove button */}
              {rooms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRoom(index)}
                  className="shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add room button */}
      {rooms.length < 10 && (
        <button
          type="button"
          onClick={addRoom}
          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Another Room
        </button>
      )}

      {/* Summary */}
      <p className="text-xs text-gray-400 text-center">
        {rooms.filter((r) => r.isValid).length} of {rooms.length} rooms ready •
        Max 10 rooms • Max 20 MB per image
      </p>
    </div>
  );
};

export default PanoramaUpload;
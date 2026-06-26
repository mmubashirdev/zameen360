import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  X,
  Plus,
  MapPin,
  DoorOpen,
  ChevronsUp,
  Trees,
  Bath,
  Utensils,
  Bed,
  Sofa,
  Save,
  ArrowLeft,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type HotspotType =
  | "doorknob"
  | "stairs"
  | "garden"
  | "bedroom"
  | "bathroom"
  | "kitchen"
  | "living"
  | "rooftop"
  | "exit";

export interface Hotspot {
  id: string;
  type: HotspotType;
  label: string;
  sourceRoomIndex?: number;
  targetRoomIndex: number;
  phi: number; // vertical angle
  theta: number; // horizontal angle
}

interface HotspotEditorProps {
  imageUrl: string;
  roomName: string;
  allRooms: { roomName: string }[];
  currentRoomIndex: number;
  existingHotspots: Hotspot[];
  onSave: (hotspots: Hotspot[]) => void;
  onClose: () => void;
}

// ─── Hotspot icon mappings ────────────────────────────────────────────────────

const HOTSPOT_ICONS: Record<
  HotspotType,
  { icon: any; color: string; label: string }
> = {
  doorknob: { icon: DoorOpen, color: "#f59e0b", label: "Door Knob" },
  stairs: { icon: ChevronsUp, color: "#8b5cf6", label: "Stairs" },
  garden: { icon: Trees, color: "#10b981", label: "Garden Access" },
  bedroom: { icon: Bed, color: "#3b82f6", label: "Bedroom Door" },
  bathroom: { icon: Bath, color: "#06b6d4", label: "Bathroom Door" },
  kitchen: { icon: Utensils, color: "#ef4444", label: "Kitchen Door" },
  living: { icon: Sofa, color: "#ec4899", label: "Living Room" },
  rooftop: { icon: ChevronsUp, color: "#a855f7", label: "Rooftop Access" },
  exit: { icon: X, color: "#6b7280", label: "Exit" },
};

// In MediaSection — add a sorted "tour order" hint
const TOUR_ORDER_SUGGESTION = [
  {
    order: 1,
    name: "Front Door / Entrance",
    hint: "Exterior view of the house",
  },
  { order: 2, name: "Living Room", hint: "First view inside" },
  { order: 3, name: "Kitchen", hint: "Usually from living room" },
  { order: 4, name: "Master Bedroom", hint: "Main bedroom" },
  { order: 5, name: "Master Bathroom", hint: "Attached to master" },
  { order: 6, name: "Guest Bedroom", hint: "Secondary bedrooms" },
  { order: 7, name: "Common Bathroom", hint: "Shared bathroom" },
  { order: 8, name: "Laundry / Utility", hint: "Service area" },
  { order: 9, name: "Garden / Backyard", hint: "Outdoor space" },
  { order: 10, name: "Rooftop / Balcony", hint: "Top view" },
];

const HotspotEditor = ({
  imageUrl,
  roomName,
  allRooms,
  currentRoomIndex,
  existingHotspots,
  onSave,
  onClose,
}: HotspotEditorProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const hotspotMeshes = useRef<THREE.Mesh[]>([]);
  const animFrameRef = useRef<number>(0);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const lon = useRef(0);
  const lat = useRef(0);

  const [hotspots, setHotspots] = useState<Hotspot[]>(existingHotspots);
  const [pendingHotspot, setPendingHotspot] = useState<{
    phi: number;
    theta: number;
  } | null>(null);
  const [editingHotspot, setEditingHotspot] = useState<Hotspot | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

  // ─── Init scene ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mountRef.current || sceneReady) return;

    const initTimer = setTimeout(() => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      if (w === 0 || h === 0) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(w, h);
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
      camera.position.set(0, 0, 0.1);
      cameraRef.current = camera;

      const geometry = new THREE.SphereGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      sphereRef.current = sphere;

      // Load texture
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin("anonymous");
      loader.load(imageUrl, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        material.map = texture;
        material.needsUpdate = true;
      });

      // Animation loop
      const animate = () => {
        animFrameRef.current = requestAnimationFrame(animate);
        if (!cameraRef.current || !rendererRef.current || !sceneRef.current)
          return;

        lat.current = Math.max(-85, Math.min(85, lat.current));
        const phi = THREE.MathUtils.degToRad(90 - lat.current);
        const theta = THREE.MathUtils.degToRad(lon.current);

        cameraRef.current.lookAt(
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta),
        );

        // Pulse hotspot meshes
        const t = Date.now() * 0.003;
        hotspotMeshes.current.forEach((m, i) => {
          const scale = 1 + 0.2 * Math.sin(t + i);
          m.scale.setScalar(scale);
        });

        rendererRef.current.render(sceneRef.current, cameraRef.current);
      };
      animate();

      setSceneReady(true);
    }, 100);

    return () => clearTimeout(initTimer);
  }, [imageUrl, sceneReady]);

  // ─── Build hotspot visual markers ───────────────────────────────────────
  const buildHotspotMeshes = useCallback(() => {
    if (!sceneRef.current) return;

    // Remove old
    hotspotMeshes.current.forEach((m) => sceneRef.current!.remove(m));
    hotspotMeshes.current = [];

    hotspots.forEach((hs, i) => {
      // Outer white ring
      const ringGeo = new THREE.RingGeometry(14, 18, 32);

      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });

      const ring = new THREE.Mesh(ringGeo, ringMat);

      // Position on sphere
      const radius = 480;
      const x = radius * Math.sin(hs.phi) * Math.cos(hs.theta);
      const y = radius * Math.cos(hs.phi);
      const z = radius * Math.sin(hs.phi) * Math.sin(hs.theta);

      ring.position.set(x, y, z);
      ring.lookAt(0, 0, 0);

      ring.userData = {
        hotspotId: hs.id,
        index: i,
      };

      sceneRef.current!.add(ring);
      hotspotMeshes.current.push(ring);
    });
  }, [hotspots]);

  useEffect(() => {
    if (sceneReady) buildHotspotMeshes();
  }, [sceneReady, hotspots, buildHotspotMeshes]);

  // ─── Mouse events for drag + click placement ────────────────────────────
  useEffect(() => {
    if (!sceneReady || !mountRef.current) return;
    const el = mountRef.current;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      dragMoved.current = false;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved.current = true;

      lon.current -= dx * 0.2;
      lat.current -= dy * 0.2;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = (e: MouseEvent) => {
      isDragging.current = false;

      // Only treat as click if user didn't drag
      if (
        !dragMoved.current &&
        mountRef.current &&
        cameraRef.current &&
        sceneRef.current
      ) {
        const rect = mountRef.current.getBoundingClientRect();
        mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

        // Check if clicked on existing hotspot first
        const hotspotHits = raycasterRef.current.intersectObjects(
          hotspotMeshes.current,
        );
        if (hotspotHits.length > 0) {
          const hotspotId = hotspotHits[0].object.userData.hotspotId;
          const found = hotspots.find((h) => h.id === hotspotId);
          if (found) setEditingHotspot(found);
          return;
        }

        // Otherwise, place a new hotspot on the sphere
        const sphereHits = raycasterRef.current.intersectObject(
          sphereRef.current!,
        );
        if (sphereHits.length > 0) {
          const point = sphereHits[0].point;
          const phi = Math.acos(point.y / 500);
          const theta = Math.atan2(point.z, point.x);
          setPendingHotspot({ phi, theta });
        }
      }
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", () => {
      isDragging.current = false;
    });

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseup", onMouseUp);
    };
  }, [sceneReady, hotspots]);

  // ─── Cleanup ────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      rendererRef.current?.dispose();
      if (mountRef.current && rendererRef.current?.domElement) {
        try {
          mountRef.current.removeChild(rendererRef.current.domElement);
        } catch {
          /* ignore */
        }
      }
    };
  }, []);

  // ─── Add hotspot from pending click ─────────────────────────────────────
  const handleAddHotspot = (
    type: HotspotType,
    label: string,
    targetIndex: number,
  ) => {
    if (!pendingHotspot) return;
    const newHotspot: Hotspot = {
      id: `hs_${Date.now()}`,
      type,
      label,
      sourceRoomIndex: currentRoomIndex,
      targetRoomIndex: targetIndex,
      phi: pendingHotspot.phi,
      theta: pendingHotspot.theta,
    };
    setHotspots([...hotspots, newHotspot]);
    setPendingHotspot(null);
  };

  const handleUpdateHotspot = (updated: Hotspot) => {
    setHotspots(hotspots.map((h) => (h.id === updated.id ? updated : h)));
    setEditingHotspot(null);
  };

  const handleDeleteHotspot = (id: string) => {
    setHotspots(hotspots.filter((h) => h.id !== id));
    setEditingHotspot(null);
  };

  const handleBackToMedia = () => {
    onSave(hotspots);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-3 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            onClick={handleBackToMedia}
            aria-label="Back to Media and Details"
            className="shrink-0 mt-0.5 inline-flex items-center gap-1.5 px-3 py-2 text-gray-200 hover:text-white hover:bg-gray-800 rounded-lg text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Media & Details
          </button>
          <div className="min-w-0">
            <h2 className="text-white font-bold flex items-center gap-2">
              <MapPin size={18} className="text-blue-400 shrink-0" />
              <span className="truncate">Place Hotspots in: {roomName}</span>
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              Click on the panorama to place a navigation hotspot (e.g., door
              knob)
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg text-sm"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onSave(hotspots)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5"
          >
            <Save size={15} />
            Save {hotspots.length} Hotspot{hotspots.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 relative">
        <div ref={mountRef} className="absolute inset-0" />

        <button
          type="button"
          onClick={handleBackToMedia}
          aria-label="Back to Media and Details"
          className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 rounded-lg bg-white/95 px-4 py-2 text-sm font-semibold text-gray-900 shadow-lg hover:bg-white"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Instructions overlay */}
        <div className="absolute top-16 left-4 bg-black/60 text-white text-xs px-3 py-2 rounded-lg space-y-1 backdrop-blur-sm">
          <p>🖱 Drag to rotate view</p>
          <p>👆 Click on a spot to add hotspot</p>
          <p>🎯 Click existing hotspot to edit</p>
        </div>

        {/* Hotspot count */}
        <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
          {hotspots.length} hotspot{hotspots.length !== 1 ? "s" : ""} placed
        </div>
      </div>

      {/* Pending hotspot dialog (placing new) */}
      {pendingHotspot && (
        <HotspotConfigModal
          allRooms={allRooms}
          currentRoomIndex={currentRoomIndex}
          onConfirm={handleAddHotspot}
          onCancel={() => setPendingHotspot(null)}
        />
      )}

      {/* Editing existing hotspot */}
      {editingHotspot && (
        <HotspotConfigModal
          allRooms={allRooms}
          currentRoomIndex={currentRoomIndex}
          existing={editingHotspot}
          onConfirm={(type, label, targetIndex) =>
            handleUpdateHotspot({
              ...editingHotspot,
              type,
              label,
              sourceRoomIndex: currentRoomIndex,
              targetRoomIndex: targetIndex,
            })
          }
          onCancel={() => setEditingHotspot(null)}
          onDelete={() => handleDeleteHotspot(editingHotspot.id)}
        />
      )}
    </div>
  );
};

// ─── Config Modal — choose type, label, destination ──────────────────────────
interface ConfigModalProps {
  allRooms: { roomName: string }[];
  currentRoomIndex: number;
  existing?: Hotspot;
  onConfirm: (type: HotspotType, label: string, targetIndex: number) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const HotspotConfigModal = ({
  allRooms,
  currentRoomIndex,
  existing,
  onConfirm,
  onCancel,
  onDelete,
}: ConfigModalProps) => {
  const [type, setType] = useState<HotspotType>(existing?.type || "doorknob");
  const [label, setLabel] = useState(existing?.label || "Enter Room");
  const getDefaultTargetIndex = () => {
    if (typeof existing?.targetRoomIndex === "number") {
      return existing.targetRoomIndex;
    }

    const nextRoomIndex = currentRoomIndex + 1;
    if (nextRoomIndex < allRooms.length) return nextRoomIndex;

    const previousRoomIndex = currentRoomIndex - 1;
    if (previousRoomIndex >= 0) return previousRoomIndex;

    return 0;
  };

  const [targetIndex, setTargetIndex] = useState(getDefaultTargetIndex());

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full m-4 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">
            {existing ? "Edit Hotspot" : "Configure New Hotspot"}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Choose what this hotspot does
          </p>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Type selector */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-2 block">
              Hotspot Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(HOTSPOT_ICONS) as HotspotType[]).map((t) => {
                const cfg = HOTSPOT_ICONS[t];
                const Icon = cfg.icon;
                const active = type === t;
                return (
                  <button
                    key={t}
                    onClick={() => {
                      setType(t);
                      if (!existing) setLabel(`Go to ${cfg.label}`);
                    }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                      active
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon
                      size={20}
                      style={{ color: active ? cfg.color : "#6b7280" }}
                    />
                    <span className="text-[10px] font-medium text-gray-700">
                      {cfg.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Label */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              Label (shown to buyer)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Open Front Door"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
            />
          </div>

          {/* Destination room */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              Goes To Which Room
            </label>
            <select
              value={targetIndex}
              onChange={(e) => setTargetIndex(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none bg-white"
            >
              {allRooms.map((r, i) => (
                <option key={i} value={i} disabled={i === currentRoomIndex}>
                  {r.roomName} {i === currentRoomIndex && "(current)"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 flex justify-between bg-gray-50">
          {onDelete ? (
            <button
              onClick={onDelete}
              className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
            >
              Delete
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                onConfirm(
                  type,
                  label,
                  targetIndex === currentRoomIndex
                    ? (() => {
                        const nextRoomIndex = currentRoomIndex + 1;
                        if (nextRoomIndex < allRooms.length) {
                          return nextRoomIndex;
                        }

                        const previousRoomIndex = currentRoomIndex - 1;
                        return previousRoomIndex >= 0 ? previousRoomIndex : 0;
                      })()
                    : targetIndex,
                )
              }
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5"
            >
              <Plus size={14} />
              {existing ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotspotEditor;

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

export interface Hotspot {
  id: string;
  type: string;
  label: string;
  targetRoomIndex: number;
  phi: number;
  theta: number;
}

export interface PanoramaRoom {
  roomName: string;
  imageUrl: string;
  hotspots: Hotspot[];
}

interface VirtualTourProps {
  rooms: PanoramaRoom[];
}

const SPHERE_RADIUS = 500;
const FOV = 75;
const MIN_FOV = 30;
const MAX_FOV = 100;

const VirtualTour = ({ rooms }: VirtualTourProps) => {
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
  const prevMousePos = useRef({ x: 0, y: 0 });
  const lon = useRef(0);
  const lat = useRef(0);
  const currentFov = useRef(FOV);
  const lastTouch = useRef<{ x: number; y: number } | null>(null);

  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

  const currentRoom = rooms?.[currentRoomIndex];

  // ─── Build hotspot meshes (called when room changes) ─────────────────────
  const buildHotspots = useCallback((hotspots: Hotspot[]) => {
    if (!sceneRef.current) return;

    // Remove old hotspots
    hotspotMeshes.current.forEach((m) => sceneRef.current!.remove(m));
    hotspotMeshes.current = [];

    hotspots.forEach((hotspot, i) => {
      // Glowing outer ring
      const ringGeo = new THREE.RingGeometry(15, 22, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);

      // Inner solid dot
      const dotGeo = new THREE.CircleGeometry(10, 32);
      const dotMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);

      const group = new THREE.Group();
      group.add(ring);
      group.add(dot);

      // Position on sphere surface (slightly inside)
      const radius = SPHERE_RADIUS * 0.95;
      const x = radius * Math.sin(hotspot.phi) * Math.cos(hotspot.theta);
      const y = radius * Math.cos(hotspot.phi);
      const z = radius * Math.sin(hotspot.phi) * Math.sin(hotspot.theta);
      group.position.set(x, y, z);
      group.lookAt(0, 0, 0);

      (dot as any).userData = {
        hotspotIndex: i,
        label: hotspot.label,
        targetRoomIndex: hotspot.targetRoomIndex,
      };
      (ring as any).userData = {
        hotspotIndex: i,
        label: hotspot.label,
        targetRoomIndex: hotspot.targetRoomIndex,
      };

      sceneRef.current!.add(group);
      hotspotMeshes.current.push(dot, ring);
    });
  }, []);

  // ─── Load texture ─────────────────────────────────────────────────────────
  const loadTexture = useCallback((imageUrl: string) => {
    setIsLoading(true);
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      imageUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        if (sphereRef.current) {
          const mat = sphereRef.current.material as THREE.MeshBasicMaterial;
          if (mat.map) mat.map.dispose();
          mat.map = texture;
          mat.color.set(0xffffff);
          mat.needsUpdate = true;
        }
        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.error("Texture load error:", err);
        setIsLoading(false);
      },
    );
  }, []);

  // ─── Init Three.js scene (ONCE) ──────────────────────────────────────────
  useEffect(() => {
    if (!rooms?.length || !mountRef.current || sceneReady) return;

    const initTimer = setTimeout(() => {
      if (!mountRef.current) return;

      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      if (w === 0 || h === 0) return;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(w, h);
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera at center
      const camera = new THREE.PerspectiveCamera(FOV, w / h, 0.1, 1000);
      camera.position.set(0, 0, 0.1);
      cameraRef.current = camera;

      // Sphere (inside-out)
      const geometry = new THREE.SphereGeometry(SPHERE_RADIUS, 60, 40);
      geometry.scale(-1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x222222 });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      sphereRef.current = sphere;

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

        // Pulse hotspot rings
        const t = Date.now() * 0.003;
        hotspotMeshes.current.forEach((m, i) => {
          if (i % 2 === 0) {
            // rings only (every other mesh)
            const scale = 1 + 0.2 * Math.sin(t + i);
            m.scale.setScalar(scale);
          }
        });

        rendererRef.current.render(sceneRef.current, cameraRef.current);
      };
      animate();

      setSceneReady(true);
    }, 100);

    return () => clearTimeout(initTimer);
  }, [rooms, sceneReady]);

  // ─── Load texture + hotspots when room changes ───────────────────────────
  useEffect(() => {
    if (!sceneReady || !currentRoom) return;
    loadTexture(currentRoom.imageUrl);
    buildHotspots(currentRoom.hotspots || []);
    lon.current = 0;
    lat.current = 0;
  }, [sceneReady, currentRoom, loadTexture, buildHotspots]);

  // ─── Window resize ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current)
        return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ─── Mouse / Touch events ────────────────────────────────────────────────
  useEffect(() => {
    if (!sceneReady || !mountRef.current) return;
    const el = mountRef.current;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      dragMoved.current = false;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;

      // Hover detection
      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const hits = raycasterRef.current.intersectObjects(hotspotMeshes.current);

      if (hits.length > 0) {
        const label = hits[0].object.userData?.label;
        setHoveredHotspot(label || null);
        document.body.style.cursor = "pointer";
      } else {
        setHoveredHotspot(null);
        document.body.style.cursor = isDragging.current ? "grabbing" : "grab";
      }

      // Drag rotation
      if (!isDragging.current) return;
      const dx = e.clientX - prevMousePos.current.x;
      const dy = e.clientY - prevMousePos.current.y;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved.current = true;

      lon.current -= dx * 0.2;
      lat.current -= dy * 0.2;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = (e: MouseEvent) => {
      isDragging.current = false;
      document.body.style.cursor = "grab";

      // Click on hotspot = navigate
      if (!dragMoved.current && mountRef.current && cameraRef.current) {
        const rect = mountRef.current.getBoundingClientRect();
        mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const hits = raycasterRef.current.intersectObjects(
          hotspotMeshes.current,
        );

        if (hits.length > 0) {
          const targetIndex = hits[0].object.userData?.targetRoomIndex;
          if (typeof targetIndex === "number") {
            setCurrentRoomIndex(targetIndex);
          }
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      currentFov.current = THREE.MathUtils.clamp(
        currentFov.current + e.deltaY * 0.05,
        MIN_FOV,
        MAX_FOV,
      );
      cameraRef.current.fov = currentFov.current;
      cameraRef.current.updateProjectionMatrix();
    };

    const onTouchStart = (e: TouchEvent) => {
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!lastTouch.current) return;
      lon.current -= (e.touches[0].clientX - lastTouch.current.x) * 0.3;
      lat.current -= (e.touches[0].clientY - lastTouch.current.y) * 0.3;
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", () => {
      isDragging.current = false;
    });
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchmove", onTouchMove);

    document.body.style.cursor = "grab";

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      document.body.style.cursor = "default";
    };
  }, [sceneReady]);

  // ─── Cleanup ─────────────────────────────────────────────────────────────
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

  if (!rooms?.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-gray-400 text-sm">No 360° tour available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Room tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-3 border-b border-gray-100">
        {rooms.map((room, index) => (
          <button
            key={index}
            onClick={() => setCurrentRoomIndex(index)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              index === currentRoomIndex
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {room.roomName}
          </button>
        ))}
      </div>

      {/* Three.js mount */}
      <div
        className="relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm"
        style={{ height: 480 }}
      >
        <div ref={mountRef} className="w-full h-full" />

        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm">Loading 360° view...</p>
          </div>
        )}

        {hoveredHotspot && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1.5 rounded-full z-10 pointer-events-none">
            → {hoveredHotspot}
          </div>
        )}

        <div className="absolute bottom-4 left-4 z-10 bg-black/50 text-white text-sm px-3 py-1.5 rounded-lg pointer-events-none">
          📍 {currentRoom?.roomName}
        </div>

        <div className="absolute top-4 right-4 z-10 bg-black/40 text-white text-xs px-2.5 py-1 rounded-lg pointer-events-none flex flex-col gap-1">
          <span>🖱 Drag to look</span>
          <span>👆 Click hotspots</span>
          <span>⚲ Scroll to zoom</span>
        </div>

        <div className="absolute bottom-4 right-4 z-10 bg-black/40 text-white text-xs px-2.5 py-1 rounded-lg pointer-events-none">
          Room {currentRoomIndex + 1} / {rooms.length}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-2">
        Click the glowing dots to navigate between rooms
      </p>
    </div>
  );
};

export default VirtualTour;
export type { VirtualTourProps };

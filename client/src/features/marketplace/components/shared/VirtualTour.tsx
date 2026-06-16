// client/src/features/marketplace/components/shared/VirtualTour.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Hotspot {
  targetRoomIndex: number;
  label: string;
  // Spherical coords: phi (vertical 0-PI), theta (horizontal 0-2PI)
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

// ─── Constants ────────────────────────────────────────────────────────────────

const SPHERE_RADIUS = 500;
const FOV = 75;
const MIN_FOV = 30;
const MAX_FOV = 100;

// ─── Convert spherical coords to 3D position on sphere ───────────────────────
const sphericalToCartesian = (
  phi: number,
  theta: number,
  radius: number,
): THREE.Vector3 => {
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const VirtualTour = ({ rooms }: VirtualTourProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const hotspotMeshes = useRef<THREE.Mesh[]>([]);
  const animFrameRef = useRef<number>(0);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const lon = useRef(0); // horizontal angle
  const lat = useRef(0); // vertical angle
  const currentFov = useRef(FOV);

  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  const currentRoom = rooms?.[currentRoomIndex];

  // ─── Init Three.js scene ───────────────────────────────────────────────────
  const initScene = useCallback(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera — placed at center of sphere
    const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0.1);
    cameraRef.current = camera;

    // Sphere — inside-out so texture faces inward
    const geometry = new THREE.SphereGeometry(SPHERE_RADIUS, 60, 40);
    geometry.scale(-1, 1, 1); // flip normals inward

    const material = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;
  }, []);

  // ─── Load panorama texture ─────────────────────────────────────────────────
  const loadTexture = useCallback((imageUrl: string) => {
    setIsLoading(true);
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        if (sphereRef.current) {
          (sphereRef.current.material as THREE.MeshBasicMaterial).map = texture;
          (sphereRef.current.material as THREE.MeshBasicMaterial).needsUpdate =
            true;
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

  // ─── Build hotspot meshes ──────────────────────────────────────────────────
  const buildHotspots = useCallback((hotspots: Hotspot[]) => {
    if (!sceneRef.current) return;

    // Remove old hotspots
    hotspotMeshes.current.forEach((m) => sceneRef.current!.remove(m));
    hotspotMeshes.current = [];

    hotspots.forEach((hotspot, i) => {
      // Outer ring
      const ringGeo = new THREE.RingGeometry(8, 12, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x2563eb,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);

      // Inner dot
      const dotGeo = new THREE.CircleGeometry(6, 32);
      const dotMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);

      // Group
      const group = new THREE.Group();
      group.add(ring);
      group.add(dot);

      // Position on sphere surface
      const pos = sphericalToCartesian(
        hotspot.phi,
        hotspot.theta,
        SPHERE_RADIUS * 0.95,
      );
      group.position.copy(pos);
      group.lookAt(0, 0, 0); // always face camera at center

      // Store metadata for raycasting
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

  // ─── Animate loop ──────────────────────────────────────────────────────────
  const animate = useCallback(() => {
    animFrameRef.current = requestAnimationFrame(animate);
    if (!cameraRef.current || !rendererRef.current || !sceneRef.current) return;

    // Clamp lat
    lat.current = Math.max(-85, Math.min(85, lat.current));

    const phi = THREE.MathUtils.degToRad(90 - lat.current);
    const theta = THREE.MathUtils.degToRad(lon.current);

    cameraRef.current.lookAt(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta),
    );

    // Pulse hotspots
    const t = Date.now() * 0.002;
    hotspotMeshes.current.forEach((m, i) => {
      if (i % 2 === 1) {
        // ring meshes
        const scale = 1 + 0.15 * Math.sin(t + i);
        m.scale.setScalar(scale);
      }
    });

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, []);

  // ─── Resize handler ────────────────────────────────────────────────────────
  const handleResize = useCallback(() => {
    if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;
    cameraRef.current.aspect = w / h;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(w, h);
  }, []);

  // ─── Mouse / Touch events ──────────────────────────────────────────────────
  const onMouseDown = useCallback((e: MouseEvent) => {
    isDragging.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!mountRef.current) return;

    // Hover detection via raycaster
    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (cameraRef.current && sceneRef.current) {
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
    }

    if (!isDragging.current) return;
    const dx = e.clientX - prevMousePos.current.x;
    const dy = e.clientY - prevMousePos.current.y;
    lon.current -= dx * 0.2;
    lat.current -= dy * 0.2;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "grab";
  }, []);

  const onClick = useCallback((e: MouseEvent) => {
    if (!mountRef.current || !cameraRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const hits = raycasterRef.current.intersectObjects(hotspotMeshes.current);
    if (hits.length > 0) {
      const { targetRoomIndex } = hits[0].object.userData;
      if (targetRoomIndex !== undefined) {
        setCurrentRoomIndex(targetRoomIndex);
      }
    }
  }, []);

  // Scroll to zoom (change FOV)
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (!cameraRef.current) return;
    currentFov.current = THREE.MathUtils.clamp(
      currentFov.current + e.deltaY * 0.05,
      MIN_FOV,
      MAX_FOV,
    );
    cameraRef.current.fov = currentFov.current;
    cameraRef.current.updateProjectionMatrix();
  }, []);

  // Touch support
  const lastTouch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = useCallback((e: TouchEvent) => {
    lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!lastTouch.current) return;
    const dx = e.touches[0].clientX - lastTouch.current.x;
    const dy = e.touches[0].clientY - lastTouch.current.y;
    lon.current -= dx * 0.3;
    lat.current -= dy * 0.3;
    lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  // ─── Lifecycle ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!rooms?.length) return;

    initScene();
    animate();
    window.addEventListener("resize", handleResize);

    const el = mountRef.current!;
    el.addEventListener("mousedown", onMouseDown as EventListener);
    el.addEventListener("mousemove", onMouseMove as EventListener);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("click", onClick as EventListener);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart as EventListener);
    el.addEventListener("touchmove", onTouchMove as EventListener);

    document.body.style.cursor = "grab";

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
      el.removeEventListener("mousedown", onMouseDown as EventListener);
      el.removeEventListener("mousemove", onMouseMove as EventListener);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("click", onClick as EventListener);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart as EventListener);
      el.removeEventListener("touchmove", onTouchMove as EventListener);
      document.body.style.cursor = "default";

      rendererRef.current?.dispose();
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load texture + hotspots whenever room changes
  useEffect(() => {
    if (!currentRoom) return;
    loadTexture(currentRoom.imageUrl);
    buildHotspots(currentRoom.hotspots);
    lon.current = 0;
    lat.current = 0;
  }, [currentRoom, loadTexture, buildHotspots]);

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
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${
                index === currentRoomIndex
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {room.roomName}
          </button>
        ))}
      </div>

      {/* Three.js mount point */}
      <div
        className="relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm"
        style={{ height: 480 }}
      >
        {/* Canvas mount */}
        <div ref={mountRef} className="w-full h-full" />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm">Loading 360° view...</p>
          </div>
        )}

        {/* Hotspot label tooltip */}
        {hoveredHotspot && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1.5 rounded-full z-10 pointer-events-none">
            → {hoveredHotspot}
          </div>
        )}

        {/* Room label */}
        <div className="absolute bottom-4 left-4 z-10 bg-black/50 text-white text-sm px-3 py-1.5 rounded-lg pointer-events-none">
          {currentRoom?.roomName}
        </div>

        {/* Controls hint */}
        <div className="absolute top-4 right-4 z-10 bg-black/40 text-white text-xs px-2.5 py-1 rounded-lg pointer-events-none flex flex-col gap-1">
          <span>🖱 Drag to look around</span>
          <span>⚲ Scroll to zoom</span>
        </div>

        {/* Room counter */}
        <div className="absolute bottom-4 right-4 z-10 bg-black/40 text-white text-xs px-2.5 py-1 rounded-lg pointer-events-none">
          {currentRoomIndex + 1} / {rooms.length}
        </div>
      </div>

      {/* Keyboard instructions */}
      <p className="text-xs text-gray-400 text-center mt-2">
        Click the blue markers to move between rooms
      </p>
    </div>
  );
};

export default VirtualTour;
export type { VirtualTourProps };

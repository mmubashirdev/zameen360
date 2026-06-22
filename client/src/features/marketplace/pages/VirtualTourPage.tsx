import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as THREE from "three";
import { ArrowLeft, Maximize, Minimize, RotateCcw } from "lucide-react";
import DashboardNavbar from "../components/DashboardNavbar";

interface PanoramaRoom {
  roomName: string;
  imageUrl: string;
  hotspots?: Hotspot[];
}

interface Hotspot {
  id: string;
  type?: string;
  label: string;
  targetRoomIndex: number;
  phi: number;
  theta: number;
}

const VirtualTourPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [rooms, setRooms] = useState<PanoramaRoom[]>([]);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [propertyTitle, setPropertyTitle] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [sceneReady, setSceneReady] = useState(false); // ✅ Track scene initialization

  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const hotspotMeshesRef = useRef<THREE.Object3D[]>([]);
  const animFrameRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const lon = useRef(0);
  const lat = useRef(0);
  const currentFov = useRef(75);
  const lastTouch = useRef<{ x: number; y: number } | null>(null);

  const currentRoom = rooms[currentRoomIndex];

  const clearHotspots = () => {
    if (!sceneRef.current) return;
    hotspotMeshesRef.current.forEach((mesh) => {
      sceneRef.current?.remove(mesh);
      if (mesh instanceof THREE.Group) {
        mesh.children.forEach((child) => {
          const childMesh = child as THREE.Mesh;
          childMesh.geometry?.dispose();
          if (Array.isArray(childMesh.material)) {
            childMesh.material.forEach((mat) => mat.dispose());
          } else {
            childMesh.material?.dispose();
          }
        });
      }
    });
    hotspotMeshesRef.current = [];
  };

  const buildHotspots = (hotspots: Hotspot[] = []) => {
    if (!sceneRef.current) return;
    clearHotspots();

    hotspots.forEach((hotspot) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(15, 23, 32),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        }),
      );

      const hitArea = new THREE.Mesh(
        new THREE.CircleGeometry(42, 32),
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );

      const group = new THREE.Group();
      group.add(ring);
      group.add(hitArea);

      const radius = 480;
      const x = radius * Math.sin(hotspot.phi) * Math.cos(hotspot.theta);
      const y = radius * Math.cos(hotspot.phi);
      const z = radius * Math.sin(hotspot.phi) * Math.sin(hotspot.theta);

      group.position.set(x, y, z);
      group.lookAt(0, 0, 0);
      group.userData = {
        label: hotspot.label,
        targetRoomIndex: hotspot.targetRoomIndex,
      };

      sceneRef.current.add(group);
      hotspotMeshesRef.current.push(group);
    });
  };

  // ─── Fetch rooms ──────────────────────────────────────────────────────
  useEffect(() => {
    const stateRooms = (location.state as any)?.panoramas;
    const stateTitle = (location.state as any)?.propertyTitle;

    if (stateRooms && stateRooms.length > 0) {
      console.log("✅ Using rooms from navigation state:", stateRooms);
      setRooms(stateRooms);
      setPropertyTitle(stateTitle || "Property Tour");
      return;
    }

    const fetchPanoramas = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/properties/${id}`);
        const result = await res.json();

        if (result.success && result.data?.panoramas?.length > 0) {
          console.log("✅ Fetched panoramas from API:", result.data.panoramas);
          setRooms(
            result.data.panoramas.map((p: any) => ({
              roomName: p.roomName,
              imageUrl: p.imageUrl,
              hotspots: Array.isArray(p.hotspots) ? p.hotspots : [],
            })),
          );
          setPropertyTitle(result.data.title || "Property Tour");
        } else {
          setFetchError("No 360° tour available for this property");
        }
      } catch (err) {
        console.error("Failed to fetch panoramas:", err);
        setFetchError("Failed to load virtual tour");
      }
    };

    if (id) fetchPanoramas();
  }, [id, location.state]);

  // ─── Init Three.js (only ONCE when rooms first load) ──────────────────
  useEffect(() => {
    if (rooms.length === 0 || !mountRef.current || sceneReady) return;

    // ✅ Wait for next frame so the DOM has actual dimensions
    const initTimer = setTimeout(() => {
      if (!mountRef.current) return;

      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;

      console.log("🎬 Initializing Three.js scene:", { w, h });

      if (w === 0 || h === 0) {
        console.warn("⚠️ Container has zero dimensions, retrying...");
        return;
      }

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
      const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
      camera.position.set(0, 0, 0.1);
      cameraRef.current = camera;

      // Sphere
      const geometry = new THREE.SphereGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x222222 });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      sphereRef.current = sphere;

      // Start animation loop
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

        rendererRef.current.render(sceneRef.current, cameraRef.current);

        const t = Date.now() * 0.003;
        hotspotMeshesRef.current.forEach((group, index) => {
          const ring = group.children[0];
          if (ring) ring.scale.setScalar(1 + 0.18 * Math.sin(t + index));
        });
      };
      animate();

      setSceneReady(true); // ✅ Mark scene as ready
      console.log("✅ Scene ready");
    }, 100); // Small delay to ensure DOM is painted

    return () => {
      clearTimeout(initTimer);
    };
  }, [rooms, sceneReady]);

  // ─── Load texture when room changes (after scene is ready) ────────────
  useEffect(() => {
    if (!sceneReady || !currentRoom || !sphereRef.current) return;

    console.log("🖼️ Loading texture:", currentRoom.imageUrl);
    setIsLoading(true);

    const loader = new THREE.TextureLoader();
    // ✅ Enable CORS for Cloudinary images
    loader.setCrossOrigin("anonymous");

    loader.load(
      currentRoom.imageUrl,
      (texture) => {
        console.log("✅ Texture loaded successfully");
        texture.colorSpace = THREE.SRGBColorSpace;
        if (sphereRef.current) {
          const mat = sphereRef.current.material as THREE.MeshBasicMaterial;
          // Dispose old texture
          if (mat.map) mat.map.dispose();
          mat.map = texture;
          mat.color.set(0xffffff); // ✅ Reset color to white so texture shows properly
          mat.needsUpdate = true;
        }
        lon.current = 0;
        lat.current = 0;
        buildHotspots(currentRoom.hotspots || []);
        setIsLoading(false);
      },
      (progress) => {
        console.log("Loading:", (progress.loaded / progress.total) * 100, "%");
      },
      (err) => {
        console.error("❌ Texture load error:", err);
        setIsLoading(false);
      },
    );
  }, [sceneReady, currentRoom]);

  // ─── Window resize handler ────────────────────────────────────────────
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

  // ─── Mouse / Touch / Wheel events ─────────────────────────────────────
  useEffect(() => {
    if (!sceneReady || !mountRef.current) return;

    const el = mountRef.current;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      dragMoved.current = false;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!mountRef.current || !cameraRef.current) return;

      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const hits = raycasterRef.current.intersectObjects(
        hotspotMeshesRef.current,
        true,
      );
      el.style.cursor = hits.length > 0 ? "pointer" : "grab";

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
      if (dragMoved.current || !mountRef.current || !cameraRef.current) return;

      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const hits = raycasterRef.current.intersectObjects(
        hotspotMeshesRef.current,
        true,
      );

      const hotspotGroup = hits[0]?.object.parent;
      const targetIndex = hotspotGroup?.userData?.targetRoomIndex;
      if (
        typeof targetIndex === "number" &&
        targetIndex >= 0 &&
        targetIndex < rooms.length
      ) {
        setCurrentRoomIndex(targetIndex);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      currentFov.current = THREE.MathUtils.clamp(
        currentFov.current + e.deltaY * 0.05,
        30,
        100,
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
    el.addEventListener("mouseleave", onMouseUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchmove", onTouchMove);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseUp);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [sceneReady]);

  // ─── Cleanup on unmount ───────────────────────────────────────────────
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (sphereRef.current) {
        sphereRef.current.geometry.dispose();
        const mat = sphereRef.current.material as THREE.MeshBasicMaterial;
        if (mat.map) mat.map.dispose();
        mat.dispose();
      }
      clearHotspots();
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

  // ─── Fullscreen toggle ────────────────────────────────────────────────
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const resetView = () => {
    lon.current = 0;
    lat.current = 0;
    currentFov.current = 75;
    if (cameraRef.current) {
      cameraRef.current.fov = 75;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  // ─── Empty state ──────────────────────────────────────────────────────
  if (rooms.length === 0 && fetchError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm">
            <p className="text-5xl mb-4">🏠</p>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {fetchError}
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Property
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main render ──────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-gray-900 flex flex-col" ref={containerRef}>
      {/* Header */}
      <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-white font-bold text-sm">{propertyTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetView}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>

      {/* Room tabs */}
      {rooms.length > 1 && (
        <div className="bg-gray-900/90 px-4 py-2 flex gap-2 overflow-x-auto border-b border-gray-800 shrink-0">
          {rooms.map((room, index) => (
            <button
              key={index}
              onClick={() => setCurrentRoomIndex(index)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                index === currentRoomIndex
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              {room.roomName}
            </button>
          ))}
        </div>
      )}

      {/* ✅ Canvas — flex-1 fills remaining space, minHeight ensures non-zero */}
      <div
        className="flex-1 relative bg-black"
        style={{
          minHeight: "400px",
          cursor: isDragging.current ? "grabbing" : "grab",
        }}
      >
        <div ref={mountRef} className="absolute inset-0 w-full h-full" />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm font-medium">
              Loading 360° view...
            </p>
          </div>
        )}

        {/* Room label */}
        <div className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-lg pointer-events-none">
          {currentRoom?.roomName}
        </div>

        {/* Controls hint */}
        <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg pointer-events-none space-y-1">
          <p>Drag to look around</p>
          <p>Click hotspots to move</p>
          <p>Scroll to zoom</p>
          <p>Swipe on mobile</p>
        </div>

        {/* Room counter */}
        {rooms.length > 1 && (
          <div className="absolute bottom-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg pointer-events-none">
            Room {currentRoomIndex + 1} / {rooms.length}
          </div>
        )}

        {/* Prev / Next arrows */}
        {rooms.length > 1 && (
          <>
            {currentRoomIndex > 0 && (
              <button
                onClick={() => setCurrentRoomIndex((i) => i - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
              >
                ←
              </button>
            )}
            {currentRoomIndex < rooms.length - 1 && (
              <button
                onClick={() => setCurrentRoomIndex((i) => i + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
              >
                →
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VirtualTourPage;

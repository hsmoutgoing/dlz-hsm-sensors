"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";

/** HSM10 photo-inspired assembly, built entirely from local Three.js primitives. */
const STEEL = "#c8d0d8";
const STEEL_DARK = "#8f9aa6";
const DARK = "#2a323c";

function Cable({ from, to, sag = 0.35 }: { from: [number, number, number]; to: [number, number, number]; sag?: number }) {
  const curve = useMemo(() => {
    const mid = new THREE.Vector3(
      (from[0] + to[0]) / 2,
      Math.min(from[1], to[1]) - sag,
      (from[2] + to[2]) / 2,
    );
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...from),
      mid,
      new THREE.Vector3(...to),
    );
  }, [from, to, sag]);

  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 40, 0.035, 10, false), [curve]);

  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial color={DARK} roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

function SensorAssembly({ pointer, onHover, onOpen }: { pointer: { x: number; y: number }; onHover: (hover: boolean) => void; onOpen: () => void }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    target.current = { x: pointer.x, y: pointer.y };
  }, [pointer]);

  useFrame((state, delta) => {
    if (!group.current) return;
    // Slow constant drift plus pointer parallax, eased so it never snaps.
    const drift = Math.sin(state.clock.elapsedTime * 0.25) * 0.16;
    const wantY = -0.22 + target.current.x * 0.35 + drift;
    const wantX = -target.current.y * 0.22 + Math.sin(drift * 0.7) * 0.045;
    group.current.rotation.y += (wantY - group.current.rotation.y) * Math.min(1, delta * 2.2);
    group.current.rotation.x += (wantX - group.current.rotation.x) * Math.min(1, delta * 2.2);
  });

  const label = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#dce0e2"; ctx.fillRect(0, 0, 512, 512);
    ctx.textAlign = "center";
    ctx.fillStyle = "#40565b"; ctx.font = "500 27px Arial";
    ctx.fillText("HSM10", 256, 165);
    ctx.fillStyle = "#465056"; ctx.font = "24px Arial";
    ctx.fillText("Flow Switch", 256, 218);
    // Indicator scale, like the printed marks on the reference top plate.
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = i < 6 ? "#668c6c" : "#b2b7ad";
      ctx.fillRect(155 + i * 23, 272, 15, 24);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
  useEffect(() => () => label.dispose(), [label]);
  const metal = <meshStandardMaterial color={STEEL} metalness={0.96} roughness={0.22} />;
  return (
    <group ref={group} position={[-0.18, 0.12, 0]} onPointerOver={(event) => { event.stopPropagation(); onHover(true); }} onPointerOut={() => onHover(false)} onClick={(event) => { event.stopPropagation(); onOpen(); }}>
      {/* Wide, straight-sided stainless enclosure. No display head or brand band. */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.86, 0.86, 1.18, 96]} />
        {metal}
      </mesh>
      <mesh position={[0, 0.603, 0]} castShadow>
        <cylinderGeometry args={[0.851, 0.851, 0.035, 96]} />
        <meshStandardMaterial color="#dce0e2" roughness={0.34} metalness={0.82} />
      </mesh>
      <mesh position={[0, 0.623, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.824, 96]} />
        <meshStandardMaterial map={label} roughness={0.43} metalness={0.65} />
      </mesh>
      {[0.59, -0.585].map(y => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.013, 10, 96]} />
        <meshStandardMaterial color={STEEL_DARK} metalness={0.95} roughness={0.25} />
      </mesh>)}
      {/* Recessed adjustment screw on the lid. */}
      <group position={[0.32, 0.638, 0.34]}>
        <mesh><cylinderGeometry args={[0.105, 0.105, 0.028, 40]} />{metal}</mesh>
        <mesh position={[0, 0.018, 0]}><boxGeometry args={[0.11, 0.006, 0.018]} /><meshStandardMaterial color="#535b60" /></mesh>
      </group>
      {/* Hexagonal wrench shoulder and threaded process fitting. */}
      <mesh position={[0, -0.705, 0]} castShadow><cylinderGeometry args={[0.40, 0.40, 0.23, 6]} />{metal}</mesh>
      <mesh position={[0, -0.985, 0]} castShadow><cylinderGeometry args={[0.29, 0.29, 0.38, 64]} />{metal}</mesh>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0, -1.15 + i * 0.041, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.291, 0.018, 8, 64]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.25} metalness={0.96} />
      </mesh>)}
      <mesh position={[0, -1.36, 0]} castShadow><cylinderGeometry args={[0.10, 0.10, 0.40, 40]} />{metal}</mesh>
      <mesh position={[0, -1.56, 0]}><sphereGeometry args={[0.10, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />{metal}</mesh>
      {/* Side-entry metal gland, hex compression nut, and black cable. */}
      <group position={[0.84, -0.02, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.19, 0.19, 0.15, 48]} />{metal}</mesh>
        <mesh position={[0, 0.20, 0]} castShadow><cylinderGeometry args={[0.22, 0.22, 0.16, 6]} />{metal}</mesh>
        <mesh position={[0, 0.34, 0]} castShadow><cylinderGeometry args={[0.155, 0.18, 0.16, 48]} />{metal}</mesh>
        {[0.29, 0.34, 0.39].map(y => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.167, 0.013, 8, 40]} />{metal}</mesh>)}
        <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.087, 0.10, 0.09, 32]} /><meshStandardMaterial color={DARK} roughness={0.8} /></mesh>
      </group>
      <Cable from={[1.32, -0.02, 0]} to={[2.03, -0.31, 0.13]} sag={0.10} />
    </group>
  );
}

export function HeroScene() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const openProduct = () => router.push("/products/flow/hsm10-thermal-flow-switch");
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  return (
    <div
      className={`relative h-full w-full rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300 ${hovered ? "cursor-pointer" : ""}`}
      role="link"
      tabIndex={0}
      aria-label="查看产品？ HSM10"
      onKeyDown={(event) => { if (event.key === "Enter") openProduct(); }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPointer({
          x: ((e.clientX - r.left) / r.width) * 2 - 1,
          y: ((e.clientY - r.top) / r.height) * 2 - 1,
        });
      }}
      onPointerLeave={() => { setPointer({ x: 0, y: 0 }); setHovered(false); }}
    >
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [0, 1.75, 5.6], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setReady(true)}
        className="!touch-pan-y"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[4, 6, 5]}
            intensity={2.1}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0006}
          />
          <directionalLight position={[-5, 2, -3]} intensity={1.1} color="#79b4e9" />
          <spotLight
            position={[0, 7, 2]}
            angle={0.7}
            penumbra={1}
            intensity={1.4}
            color="#ffffff"
          />
          <SensorAssembly pointer={pointer} onHover={setHovered} onOpen={openProduct} />
          <ContactShadows
            position={[0, -1.72, 0]}
            opacity={0.42}
            scale={7}
            blur={2.6}
            far={3.4}
            color="#0a355c"
          />
          <Environment resolution={128} environmentIntensity={0.8}>
            <Lightformer position={[0, 5, -3]} intensity={3} scale={[8, 4, 1]} />
            <Lightformer position={[-4, 1, 3]} rotation={[0, Math.PI / 3, 0]} intensity={4} scale={[2, 6, 1]} />
            <Lightformer position={[4, 2, 2]} rotation={[0, -Math.PI / 3, 0]} intensity={3} scale={[1.5, 5, 1]} />
          </Environment>
        </Suspense>
      </Canvas>


      {/* Loading shimmer, removed once the canvas is live */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="h-40 w-40 animate-pulse rounded-full bg-brand-500/10" />
      </div>
    </div>
  );
}

export default HeroScene;

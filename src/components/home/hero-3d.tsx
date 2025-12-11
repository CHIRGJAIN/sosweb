"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Html, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

type OrbitConfig = {
  label: string;
  color: string;
  radius: number;
  speed: number;
  size: number;
  phase: number;
};

const orbitNodes: OrbitConfig[] = [
  { label: "SOS", color: "#FF7300", radius: 5.2, speed: 0.42, size: 0.6, phase: 0 },
  { label: "NGO", color: "#0175C2", radius: 6.6, speed: 0.36, size: 0.54, phase: 1.2 },
  { label: "Ops", color: "#0B1D3A", radius: 7.8, speed: 0.32, size: 0.5, phase: 2.4 },
  { label: "Shield", color: "#FF9A3E", radius: 5.9, speed: 0.48, size: 0.48, phase: 3.6 },
];

function OrbitingBadge({ node }: { node: OrbitConfig }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() * node.speed + node.phase;
    const x = Math.cos(t) * node.radius;
    const z = Math.sin(t) * node.radius;
    const y = Math.sin(t * 1.4) * 0.9;
    groupRef.current.position.set(x, y, z);
    groupRef.current.rotation.y = t;
  });

  return (
    <group ref={groupRef}>
      <Float speed={0.8} floatIntensity={0.4} rotationIntensity={0.4}>
        <mesh>
          <icosahedronGeometry args={[node.size, 0]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.32}
            roughness={0.2}
          />
        </mesh>
        <Html
          position={[0, -(node.size + 0.7), 0]}
          className="pointer-events-none select-none text-xs font-semibold uppercase tracking-[0.2em] text-white/80"
          center
        >
          {node.label}
        </Html>
      </Float>
    </group>
  );
}

function CoreCrystal() {
  return (
    <Float speed={0.4} floatIntensity={0.6} rotationIntensity={0.35}>
      <mesh scale={1.8}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#8BD6FF"
          emissiveIntensity={0.4}
          roughness={0.08}
          metalness={0.35}
        />
      </mesh>
    </Float>
  );
}

function EnergyRing() {
  return (
    <Float speed={0.25} floatIntensity={0.18} rotationIntensity={0.2}>
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[9.2, 0.4, 46, 360]} />
        <meshStandardMaterial
          color="#FF7300"
          emissive="#FF7300"
          emissiveIntensity={0.45}
          roughness={0.12}
          metalness={0.2}
        />
      </mesh>
    </Float>
  );
}

function UniverseScene() {
  const nodes = useMemo(() => orbitNodes, []);

  return (
    <Canvas
      className="absolute inset-0 h-full w-full"
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 2]}
      camera={{ position: [0, 6.2, 30], fov: 30 }}
    >
      <color attach="background" args={["#020814"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 8, 6]} intensity={1.1} color="#f0f5ff" />
      <directionalLight position={[-6, -10, -4]} intensity={0.45} color="#1a6dff" />
      <Suspense fallback={null}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
          target={[0, 0.6, 0]}
        />
        <Sparkles
          count={4200}
          size={3}
          speed={0.3}
          opacity={0.68}
          scale={[48, 28, 48]}
          color="#ffffff"
        />
        <Stars radius={110} depth={80} count={8200} factor={12} speed={0.32} saturation={0.22} />
        <group position={[0, 1.8, 0]} scale={[1.04, 1.04, 1.04]}>
          <EnergyRing />
          <CoreCrystal />
          {nodes.map((node) => (
            <OrbitingBadge key={node.label} node={node} />
          ))}
        </group>
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}

export function HeroSection() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#010516]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(1,117,194,0.25),transparent_65%)] opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,5,18,0.2)_0%,rgba(1,3,12,0.75)_65%,rgba(1,3,12,0.95)_100%)]" />

      <div className="relative flex min-h-[720px] w-full items-stretch">
        <div className="relative flex w-full flex-col justify-center overflow-hidden border border-white/10 bg-[#020818]/80 shadow-[0_50px_160px_rgba(2,4,26,0.6)]">
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ scale: 1.08, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <UniverseScene />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(1,117,194,0.28)_0%,rgba(6,16,48,0.88)_58%,rgba(0,5,18,1)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(1,7,23,0.32)_45%,rgba(1,7,23,0.95)_100%)] mix-blend-screen" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,115,0,0.18),transparent_60%)] opacity-75" />
          </motion.div>

          <div className="relative z-10 flex min-h-[720px] w-full flex-col justify-center gap-10 px-8 py-12 sm:px-12 sm:py-16 lg:flex-row lg:items-center lg:-translate-y-6">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
              className="flex w-full max-w-3xl flex-col gap-8 text-white"
            >
              <div className="inline-flex items-center gap-3">
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                  Sankatmochan
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Crisis Grid
                </span>
              </div>
              <div className="space-y-4">
                <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  First Call in Crisis Response
                </h1>
                <p className="max-w-2xl text-sm text-white/70 sm:text-base">
                  Immerse in the Trinix response lattice where SOS signals, NGO alliances, and ops teams orbit a unified command core—always-on, always-resilient.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <motion.a
                  href="/ops"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(255,115,0,0.32)]"
                >
                  Enter Ops Grid
                </motion.a>
                <motion.a
                  href="/ngos"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-semibold text-white/80 backdrop-blur"
                >
                  Browse NGOs
                </motion.a>
              </div>
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.35em] text-white/40">
                <span>Live Coordination</span>
                <span className="hidden sm:inline">Signal Integrity</span>
                <span>Resilient Ops</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

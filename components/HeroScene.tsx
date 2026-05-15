"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars, Torus } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function Orb() {
  const ref = useRef<Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.18;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.2}>
      <Sphere args={[1.4, 96, 96]} ref={ref}>
        <MeshDistortMaterial
          color="#7C3AED"
          attach="material"
          distort={0.42}
          speed={1.6}
          roughness={0.15}
          metalness={0.55}
          emissive="#FF7BD5"
          emissiveIntensity={0.45}
        />
      </Sphere>
    </Float>
  );
}

function Rings() {
  const a = useRef<Mesh>(null!);
  const b = useRef<Mesh>(null!);
  const c = useRef<Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (a.current) {
      a.current.rotation.x = t * 0.25;
      a.current.rotation.y = t * 0.2;
    }
    if (b.current) {
      b.current.rotation.x = -t * 0.18;
      b.current.rotation.z = t * 0.15;
    }
    if (c.current) {
      c.current.rotation.y = t * 0.35;
      c.current.rotation.z = -t * 0.22;
    }
  });
  return (
    <group>
      <Torus ref={a} args={[2.1, 0.012, 16, 200]}>
        <meshStandardMaterial color="#A87BFF" emissive="#A87BFF" emissiveIntensity={1.2} />
      </Torus>
      <Torus ref={b} args={[2.5, 0.008, 16, 200]}>
        <meshStandardMaterial color="#FF7BD5" emissive="#FF7BD5" emissiveIntensity={1.1} />
      </Torus>
      <Torus ref={c} args={[2.9, 0.006, 16, 200]}>
        <meshStandardMaterial color="#7BEAFF" emissive="#7BEAFF" emissiveIntensity={0.9} />
      </Torus>
    </group>
  );
}

function Particles() {
  return <Stars radius={20} depth={40} count={1800} factor={4} saturation={1} fade speed={1} />;
}

export function HeroScene({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <pointLight position={[5, 5, 5]} intensity={2.2} color="#FF7BD5" />
          <pointLight position={[-5, -2, -3]} intensity={2} color="#7BEAFF" />
          <directionalLight position={[0, 3, 4]} intensity={0.9} color="#C5A6FF" />
          <Particles />
          <Rings />
          <Orb />
        </Suspense>
      </Canvas>
    </div>
  );
}

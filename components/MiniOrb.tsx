"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function Inner() {
  const ref = useRef<Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.35;
  });
  return (
    <Sphere ref={ref} args={[1, 64, 64]}>
      <MeshDistortMaterial
        color="#8B5CF6"
        distort={0.35}
        speed={1.8}
        roughness={0.2}
        metalness={0.6}
        emissive="#FF7BD5"
        emissiveIntensity={0.5}
      />
    </Sphere>
  );
}

export function MiniOrb({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Canvas camera={{ position: [0, 0, 2.6], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[3, 3, 3]} intensity={2} color="#FF7BD5" />
          <pointLight position={[-3, -3, -3]} intensity={1.6} color="#7BEAFF" />
          <Inner />
        </Suspense>
      </Canvas>
    </div>
  );
}

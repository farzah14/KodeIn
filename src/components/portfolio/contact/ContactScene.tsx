"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function ContactScene() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.001;
    ref.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={ref} position={[2.2, 0, 0]}>
      <torusKnotGeometry args={[0.8, 0.16, 96, 16]} />
      <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function SkillsScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, linePositions } = useMemo(() => {
    const rng = seededRandom(789);
    const categories = ["language", "framework", "tool", "ml", "cloud"];
    const n: THREE.Vector3[] = [];
    const positions: number[] = [];
    
    categories.forEach((cat, ci) => {
      const angle = (ci / categories.length) * Math.PI * 2;
      const count = 3;
      for (let i = 0; i < count; i++) {
        const r = 1.2 + i * 0.4;
        const a = angle + (i / count) * Math.PI * 0.5;
        const y = (rng() - 0.5) * 0.5;
        n.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
      }
    });
    
    for (let i = 0; i < n.length; i++) {
      for (let j = i + 1; j < n.length; j++) {
        if (n[i].distanceTo(n[j]) < 1.8) {
          positions.push(n[i].x, n[i].y, n[i].z);
          positions.push(n[j].x, n[j].y, n[j].z);
        }
      }
    }
    
    return { nodes: n, linePositions: new Float32Array(positions) };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshBasicMaterial color="#00f0ff" wireframe />
        </mesh>
      ))}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#7c3aed" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, LineBasicMaterial, IcosahedronGeometry, MeshBasicMaterial } from "three";
import * as THREE from "three";

interface SkillsSceneProps {
  highlightedCategory?: string;
}

export default function SkillsScene({ highlightedCategory }: SkillsSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, connections } = useMemo(() => {
    const categories = ["language", "framework", "tool", "ml", "cloud"];
    const catColors: Record<string, string> = {
      language: "#00f0ff",
      framework: "#7c3aed",
      tool: "#ff00aa",
      ml: "#22c55e",
      cloud: "#f59e0b",
    };
    const n: THREE.Vector3[] = [];
    const c: [THREE.Vector3, THREE.Vector3][] = [];
    categories.forEach((cat, ci) => {
      const angle = (ci / categories.length) * Math.PI * 2;
      const count = 3;
      for (let i = 0; i < count; i++) {
        const r = 1.2 + i * 0.4;
        const a = angle + (i / count) * Math.PI * 0.5;
        const y = (Math.random() - 0.5) * 0.5;
        n.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
      }
    });
    for (let i = 0; i < n.length; i++) {
      for (let j = i + 1; j < n.length; j++) {
        if (n[i].distanceTo(n[j]) < 1.8) {
          c.push([n[i], n[j]]);
        }
      }
    }
    return { nodes: n, connections: c };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((pos, i) => (
        <group key={i}>
          <mesh position={pos}>
            <octahedronGeometry args={[0.08, 0]} />
            <meshBasicMaterial color="#00f0ff" wireframe />
          </mesh>
        </group>
      ))}
      {connections.map(([a, b], i) => (
        <Line key={i} points={[a, b]}>
          <lineBasicMaterial color="#7c3aed" transparent opacity={0.15} />
        </Line>
      ))}
    </group>
  );
}
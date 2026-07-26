"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, LineBasicMaterial, MeshBasicMaterial } from "three";
import * as THREE from "three";

interface TimelineSceneProps {
  activeIndex: number;
}

export default function TimelineScene({ activeIndex }: TimelineSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nodePositions = useMemo(() => {
    return [
      new THREE.Vector3(0, 3, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, -1, 0),
    ];
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child.material && "emissiveIntensity" in child.material) {
          (child.material as THREE.MeshBasicMaterial).emissiveIntensity =
            i === activeIndex ? 2 : 0.5;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <Line points={nodePositions}>
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.4} />
      </Line>
      {nodePositions.map((pos, i) => (
        <group key={i} position={pos}>
          <octahedronGeometry args={[0.1, 0]} />
          <meshBasicMaterial color={i === activeIndex ? "#00f0ff" : "#ff00aa"} wireframe emissive={i === activeIndex ? "#00f0ff" : "#ff00aa"} emissiveIntensity={i === activeIndex ? 1 : 0.3} />
        </group>
      ))}
    </group>
  );
}
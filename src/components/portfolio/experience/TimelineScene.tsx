"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
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

  const linePositions = useMemo(() => {
    const positions: number[] = [];
    for (const pos of nodePositions) {
      positions.push(pos.x, pos.y, pos.z);
    }
    return new Float32Array(positions);
  }, [nodePositions]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (child.material instanceof THREE.MeshPhongMaterial) {
            child.material.emissiveIntensity = i === activeIndex ? 2 : 0.5;
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.4} />
      </lineSegments>
      {nodePositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <octahedronGeometry args={[0.1, 0]} />
          <meshPhongMaterial
            color={i === activeIndex ? "#00f0ff" : "#ff00aa"}
            emissive={i === activeIndex ? "#00f0ff" : "#ff00aa"}
            emissiveIntensity={i === activeIndex ? 1 : 0.3}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}
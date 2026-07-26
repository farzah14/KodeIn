"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, LineBasicMaterial, BoxGeometry, MeshBasicMaterial } from "three";
import * as THREE from "three";

interface ProjectsSceneProps {
  activeIndex: number;
}

export default function ProjectsScene({ activeIndex }: ProjectsSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const panels = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const x = (i - 1.5) * 2.5;
      const y = (Math.random() - 0.5) * 0.5;
      const z = (Math.random() - 0.5) * 1;
      return new THREE.Vector3(x, y, z);
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child.material) {
          child.material.opacity = i === activeIndex ? 0.9 : 0.3;
          child.material.emissiveIntensity = i === activeIndex ? 1.5 : 0.2;
        }
        if (child.position) {
          child.position.y += Math.sin(state.clock.elapsedTime + i) * 0.001;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {panels.map((pos, i) => (
        <group key={i} position={pos}>
          <boxGeometry args={[1.5, 1, 0.1]} />
          <meshBasicMaterial
            color={i === activeIndex ? "#00f0ff" : "#7c3aed"}
            wireframe
            transparent
            opacity={i === activeIndex ? 0.9 : 0.3}
            emissive={i === activeIndex ? "#00f0ff" : "#7c3aed"}
            emissiveIntensity={i === activeIndex ? 0.5 : 0.1}
          />
        </group>
      ))}
    </group>
  );
}
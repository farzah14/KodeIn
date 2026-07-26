"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Line, LineBasicMaterial, IcosahedronGeometry, MeshBasicMaterial } from "three";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const count = 200;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.0005;
    ref.current.rotation.x += 0.0002;
  });
  return (
    <points ref={ref} positions={positions} frustumCulled={false}>
      <pointsMaterial size={0.05} color="#00f0ff" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

function NeuralWeb() {
  const nodeCount = 12;
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => {
      const theta = (i / nodeCount) * Math.PI * 2;
      const r = 1.5 + Math.random() * 0.5;
      return new THREE.Vector3(Math.cos(theta) * r, (Math.random() - 0.5) * 2, Math.sin(theta) * r);
    });
  }, []);
  const lines = useMemo(() => {
    const result = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 2.5) {
          result.push([nodes[i], nodes[j]]);
        }
      }
    }
    return result;
  }, [nodes]);
  const centralRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (centralRef.current) {
      centralRef.current.rotation.y += 0.005;
      centralRef.current.rotation.x += 0.002;
    }
  });
  return (
    <group>
      <icosahedronGeometry args={[0.4, 1]} />
      <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.6} />
      {nodes.map((pos, i) => (
        <group key={i}>
          <mesh position={pos}>
            <icosahedronGeometry args={[0.05, 0]} />
            <meshBasicMaterial color="#ff00aa" />
          </mesh>
        </group>
      ))}
      {lines.map(([a, b], i) => (
        <Line key={i} points={[a, b]}>
          <lineBasicMaterial color="#00f0ff" transparent opacity={0.2} />
        </Line>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <ParticleField />
      <NeuralWeb />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

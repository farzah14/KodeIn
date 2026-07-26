"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function ParticleField() {
  const count = 200;
  const positions = useMemo(() => {
    const rng = seededRandom(42);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rng() - 0.5) * 20;
      arr[i * 3 + 1] = (rng() - 0.5) * 20;
      arr[i * 3 + 2] = (rng() - 0.5) * 20;
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.0005;
    ref.current.rotation.x += 0.0002;
  });
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);
  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial size={0.05} color="#00f0ff" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

function NeuralWeb() {
  const nodeCount = 12;
  const nodes = useMemo(() => {
    const rng = seededRandom(123);
    return Array.from({ length: nodeCount }, (_, i) => {
      const theta = (i / nodeCount) * Math.PI * 2;
      const r = 1.5 + rng() * 0.5;
      return new THREE.Vector3(Math.cos(theta) * r, (rng() - 0.5) * 2, Math.sin(theta) * r);
    });
  }, []);

  const linePositions = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 2.5) {
          positions.push(nodes[i].x, nodes[i].y, nodes[i].z);
          positions.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    return new Float32Array(positions);
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
      <mesh ref={centralRef}>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.6} />
      </mesh>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <icosahedronGeometry args={[0.05, 0]} />
          <meshBasicMaterial color="#ff00aa" />
        </mesh>
      ))}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.2} />
      </lineSegments>
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

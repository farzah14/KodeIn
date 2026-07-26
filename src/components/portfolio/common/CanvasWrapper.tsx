"use client";

import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Suspense, ReactNode } from "react";

interface CanvasWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function CanvasWrapper({ children, className }: CanvasWrapperProps) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        onCreated={(state) => {
          state.gl.toneMapping = 1;
          state.gl.toneMappingExposure = 1.2;
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
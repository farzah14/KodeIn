"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, ReactNode, useEffect, useState } from "react";

interface CanvasWrapperProps {
  children: ReactNode;
  className?: string;
  active?: boolean;
}

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

export default function CanvasWrapper({ children, className, active = true }: CanvasWrapperProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        frameloop={active && !reducedMotion ? "always" : "demand"}
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

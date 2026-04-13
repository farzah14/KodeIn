"use client";

import { useMemo, useState, useRef, useEffect } from "react";

type Avatar3DProps = {
  seed: string;
  size?: number;
  className?: string;
  title?: string;
  variant?: number; 
};

function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Avatar3D({ seed, size = 72, className = "", title = "Avatar" }: Avatar3DProps) {
  const [rotate, setRotate] = useState({ x: 5, y: -8 });
  const containerRef = useRef<HTMLDivElement>(null);

  const cfg = useMemo(() => {
    let variantOffset = 0;
    if (seed.endsWith("-v2")) variantOffset = 1;
    if (seed.endsWith("-v3")) variantOffset = 2;

    const h = hashString(seed || "anonymous");
    const rnd = mulberry32(h);

    const skinColors = ["#F7D7C4", "#EFC7A9", "#E7B38D", "#D99A6C", "#C7804F", "#A9653C"];
    const hairColors = ["#111827", "#1F2937", "#3F2E1E", "#5B3A1E", "#7A4B2A", "#D6B06E"];
    const shirtColors = ["#111827", "#0F172A", "#1D4ED8", "#16A34A", "#DC2626", "#7C3AED"];

    const skin = skinColors[Math.floor(rnd() * skinColors.length)];
    const hair = hairColors[(Math.floor(rnd() * hairColors.length) + variantOffset) % hairColors.length];
    const shirt = shirtColors[(Math.floor(rnd() * shirtColors.length) + (variantOffset * 2)) % shirtColors.length];

    const eyeType = Math.floor(rnd() * 3);
    const mouthType = Math.floor(rnd() * 3);

    const pupilX = 47 + Math.floor(rnd() * 7);
    const pupilY = 48 + Math.floor(rnd() * 4);

    return { skin, hair, shirt, eyeType, mouthType, pupilX, pupilY };
  }, [seed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
        const rotateY = ((x / rect.width) - 0.5) * 40;
        const rotateX = ((y / rect.height) - 0.5) * -40;
        setRotate({ x: rotateX, y: rotateY });
      } else {
        setRotate({ x: 5, y: -8 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const px = `${size}px`;

  const mouthPath =
    cfg.mouthType === 0
      ? "M40 64 C47 70, 53 70, 60 64" 
      : cfg.mouthType === 1
      ? "M40 66 C47 64, 53 64, 60 66" 
      : "M42 66 C48 62, 52 62, 58 66"; 

  const eyeOpen = cfg.eyeType === 0 ? 1 : cfg.eyeType === 1 ? 0.65 : 0.35; 

  return (
    <div
      ref={containerRef}
      className={[
        "relative overflow-hidden rounded-full border border-edu-border bg-edu-surface1 transition-all duration-300",
        className,
      ].join(" ")}
      style={{ 
        width: px, 
        height: px,
        perspective: "1000px"
      }}
      aria-label={title}
      title={title}
    >
      <div 
        className="w-full h-full transform-gpu transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: "preserve-3d"
        }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label={title}>
          <defs>
            <radialGradient id={`faceGrad-${seed}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="35%" stopColor={cfg.skin} stopOpacity="1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
            </radialGradient>

            <linearGradient id={`hairGrad-${seed}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="40%" stopColor={cfg.hair} stopOpacity="1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id={`shirtGrad-${seed}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="35%" stopColor={cfg.shirt} stopOpacity="1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="100" height="100" fill="transparent" />

          <g style={{ transform: "translateZ(10px)" }}>
            <path
              d="M18 98 C24 78, 34 70, 50 70 C66 70, 76 78, 82 98 Z"
              fill={`url(#shirtGrad-${seed})`}
            />
          </g>

          <path d="M44 66 C46 73, 54 73, 56 66 Z" fill={cfg.skin} opacity="0.95" style={{ transform: "translateZ(20px)" }} />

          <g style={{ transform: "translateZ(30px)" }}>
            <ellipse cx="50" cy="48" rx="24" ry="26" fill={`url(#faceGrad-${seed})`} />
          </g>

          <path
            d="M26 46 C26 26, 38 16, 50 16 C62 16, 74 26, 74 46
               C72 34, 62 30, 50 30 C38 30, 28 34, 26 46 Z"
            fill={`url(#hairGrad-${seed})`}
            style={{ transform: "translateZ(40px)" }}
          />

          <g style={{ transform: "translateZ(50px)" }}>
            <ellipse cx="41" cy="48" rx="6.2" ry={4.6 * eyeOpen} fill="#fff" opacity="0.95" />
            <circle cx={cfg.pupilX - 9} cy={cfg.pupilY} r="2.2" fill="#111827" opacity="0.95" />
            <ellipse cx="59" cy="48" rx="6.2" ry={4.6 * eyeOpen} fill="#fff" opacity="0.95" />
            <circle cx={cfg.pupilX + 9} cy={cfg.pupilY} r="2.2" fill="#111827" opacity="0.95" />
          </g>

          <path d={mouthPath} fill="none" stroke="#111827" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" style={{ transform: "translateZ(55px)" }} />
        </svg>
      </div>
    </div>
  );
}
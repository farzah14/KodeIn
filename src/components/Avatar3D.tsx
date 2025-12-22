"use client";

import { useMemo } from "react";

type Avatar3DProps = {
  seed: string;
  size?: number;
  className?: string;
  title?: string;
  // Kita tambahkan prop opsional jika ingin memaksa variasi manual, 
  // tapi logika utama kita tanam di dalam deteksi seed.
  variant?: number; 
};

function hashString(input: string) {
  // deterministic hash (FNV-1a-like)
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
  const cfg = useMemo(() => {
    // 1. Deteksi Variasi dari String Seed
    // Ini trik agar desainnya PASTI berbeda
    let variantOffset = 0;
    if (seed.endsWith("-v2")) variantOffset = 1; // Geser 1 langkah
    if (seed.endsWith("-v3")) variantOffset = 2; // Geser 2 langkah

    // Bersihkan seed dari suffix agar bentuk wajah dasarnya tetap konsisten (opsional), 
    // atau biarkan hash berubah total. 
    // Di sini kita biarkan hash berubah total TAPI kita paksa warna berbeda.
    const h = hashString(seed || "anonymous");
    const rnd = mulberry32(h);

    const skinColors = [
      "#F7D7C4", "#EFC7A9", "#E7B38D", 
      "#D99A6C", "#C7804F", "#A9653C",
    ];
    
    const hairColors = [
      "#111827", "#1F2937", "#3F2E1E", 
      "#5B3A1E", "#7A4B2A", "#D6B06E",
    ];

    const shirtColors = [
      "#111827", // Hitam/Gelap
      "#0F172A", // Navy
      "#1D4ED8", // Biru
      "#16A34A", // Hijau
      "#DC2626", // Merah
      "#7C3AED", // Ungu
    ];

    // LOGIKA PERBEDAAN WARNA:
    // Kita ambil random index, lalu tambahkan offset berdasarkan variasi (-v2, -v3).
    // Modulo (%) memastikan index berputar kembali ke awal jika melebihi batas.
    // variantOffset * 2 memastikan loncatannya jauh (misal: Hitam -> Biru -> Merah).
    const skin = skinColors[Math.floor(rnd() * skinColors.length)];
    
    // Agar rambut berbeda tiap varian
    const rawHairIdx = Math.floor(rnd() * hairColors.length);
    const hair = hairColors[(rawHairIdx + variantOffset) % hairColors.length];

    // Agar baju PASTI berbeda tiap varian
    const rawShirtIdx = Math.floor(rnd() * shirtColors.length);
    const shirt = shirtColors[(rawShirtIdx + (variantOffset * 2)) % shirtColors.length];

    const eyeType = Math.floor(rnd() * 3); // 0..2
    const mouthType = Math.floor(rnd() * 3); // 0..2

    const pupilX = 47 + Math.floor(rnd() * 7); // 47..53
    const pupilY = 48 + Math.floor(rnd() * 4); // 48..51

    return { skin, hair, shirt, eyeType, mouthType, pupilX, pupilY };
  }, [seed]);

  const px = `${size}px`;

  // Bentuk mulut
  const mouthPath =
    cfg.mouthType === 0
      ? "M40 64 C47 70, 53 70, 60 64" // smile
      : cfg.mouthType === 1
      ? "M40 66 C47 64, 53 64, 60 66" // flat
      : "M42 66 C48 62, 52 62, 58 66"; // small smirk

  // Tinggi mata
  const eyeOpen =
    cfg.eyeType === 0 ? 1 : cfg.eyeType === 1 ? 0.65 : 0.35; 

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm",
        "dark:border-zinc-800 dark:bg-zinc-950",
        className,
      ].join(" ")}
      style={{ width: px, height: px }}
      aria-label={title}
      title={title}
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

          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2.2" stdDeviation="2.2" floodColor="#000" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="100" height="100" fill="transparent" />

        {/* Body / shirt */}
        <g filter="url(#softShadow)">
          <path
            d="M18 98 C24 78, 34 70, 50 70 C66 70, 76 78, 82 98 Z"
            fill={`url(#shirtGrad-${seed})`}
          />
        </g>

        {/* Neck */}
        <path d="M44 66 C46 73, 54 73, 56 66 Z" fill={cfg.skin} opacity="0.95" />

        {/* Face */}
        <g filter="url(#softShadow)">
          <ellipse cx="50" cy="48" rx="24" ry="26" fill={`url(#faceGrad-${seed})`} />
        </g>

        {/* Hair cap */}
        <path
          d="M26 46 C26 26, 38 16, 50 16 C62 16, 74 26, 74 46
             C72 34, 62 30, 50 30 C38 30, 28 34, 26 46 Z"
          fill={`url(#hairGrad-${seed})`}
        />

        {/* Ears */}
        <ellipse cx="26.5" cy="50" rx="5" ry="7" fill={cfg.skin} opacity="0.95" />
        <ellipse cx="73.5" cy="50" rx="5" ry="7" fill={cfg.skin} opacity="0.95" />

        {/* Eyes */}
        <g>
          {/* left eye */}
          <ellipse cx="41" cy="48" rx="6.2" ry={4.6 * eyeOpen} fill="#fff" opacity="0.95" />
          <circle cx={cfg.pupilX - 9} cy={cfg.pupilY} r="2.2" fill="#111827" opacity="0.95" />
          <circle cx={cfg.pupilX - 9.7} cy={cfg.pupilY - 0.8} r="0.7" fill="#fff" opacity="0.9" />

          {/* right eye */}
          <ellipse cx="59" cy="48" rx="6.2" ry={4.6 * eyeOpen} fill="#fff" opacity="0.95" />
          <circle cx={cfg.pupilX + 9} cy={cfg.pupilY} r="2.2" fill="#111827" opacity="0.95" />
          <circle cx={cfg.pupilX + 8.3} cy={cfg.pupilY - 0.8} r="0.7" fill="#fff" opacity="0.9" />
        </g>

        {/* Nose */}
        <path d="M50 50 C49 55, 48 57, 50 58 C52 57, 51 55, 50 50 Z" fill="#000" opacity="0.10" />

        {/* Mouth */}
        <path d={mouthPath} fill="none" stroke="#111827" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />

        {/* Face highlight */}
        <path
          d="M34 40 C36 30, 44 24, 50 24"
          fill="none"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.18"
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 avatar-gloss" />

      <style jsx>{`
        .avatar-gloss {
          background: radial-gradient(80% 60% at 30% 20%, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0) 60%);
        }
        div {
          transform: perspective(700px) rotateX(7deg) rotateY(-10deg);
          transform-style: preserve-3d;
        }
        @media (prefers-reduced-motion: no-preference) {
          div {
            animation: bob 2.8s ease-in-out infinite;
          }
          @keyframes bob {
            0%, 100% { transform: perspective(700px) rotateX(7deg) rotateY(-10deg) translateY(0); }
            50% { transform: perspective(700px) rotateX(7deg) rotateY(-10deg) translateY(-1px); }
          }
        }
      `}</style>
    </div>
  );
}
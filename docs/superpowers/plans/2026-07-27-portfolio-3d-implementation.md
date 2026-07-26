# 3D Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page 3D portfolio website for a Data Engineer / Data Analyst / ML Engineer, featuring abstract data visualization aesthetics with neural web visuals, floating data points, and full scroll-driven animations.

**Architecture:** Next.js 16 App Router + React Three Fiber for 3D rendering + Framer Motion for UI animations + Tailwind CSS v4 for styling. 3D scenes are rendered per-section with lazy loading and `@react-three/drei` helpers. The portfolio lives at `/portfolio` route within the existing duocode app.

**Tech Stack:** Next.js 16, React 19, Three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing, Framer Motion, Tailwind CSS v4

---

## File Structure

```
src/
  app/
    portfolio/
      layout.tsx          — Portfolio layout (3D canvas container)
      page.tsx            — Main portfolio page with all sections
    globals.css
  components/
    portfolio/
      layout/
        Nav.tsx           — Sticky nav with scroll-spy
        PortfolioLayout.tsx — Section wrapper with 3D canvas
      hero/
        HeroSection.tsx   — Text overlay + HeroScene
        HeroScene.tsx     — 3D neural web + particles + icosahedron
      about/
        AboutSection.tsx  — Bio text + data constellation
      skills/
        SkillsSection.tsx — Category tabs + 3D node grid
        SkillsScene.tsx   — Floating hexagonal nodes + connections
      projects/
        ProjectsSection.tsx — Project cards + modal
        ProjectsScene.tsx — 3D floating data panels
      experience/
        ExperienceSection.tsx — Vertical timeline
        TimelineScene.tsx — Glowing beam + 3D nodes
      contact/
        ContactSection.tsx — Form + particle field
        ContactScene.tsx  — Reactive particle background
      common/
        CanvasWrapper.tsx — Lazy-loaded R3F Canvas per section
        SectionHeading.tsx — Animated section title
  data/
    portfolio.ts          — All portfolio data (skills, projects, experience, bio)
  styles/
    portfolio.css         — Portfolio-specific styles, theme variables
```

---

## Phase 1: Dependencies & Project Setup

### Task 1: Install 3D and animation libraries

- [ ] **Step 1: Install dependencies**

Run: `npm install three @react-three/fiber @react-three/drei @react-three/postprocessing framer-motion`

Expected: packages installed, package.json updated with new dependencies

- [ ] **Step 2: Add TypeScript types for Three.js**

Run: `npm install @types/three --save-dev`

Expected: @types/three installed as dev dependency

- [ ] **Step 3: Commit dependencies**

```bash
git add package.json package-lock.json
git commit -m "feat(portfolio): install three.js, r3f, drei, framer-motion dependencies"
```

---

## Phase 2: Data Layer

### Task 2: Create portfolio data

- [ ] **Step 1: Create `src/data/portfolio.ts`**

Write file:
```ts
export interface Skill {
  name: string;
  category: "language" | "framework" | "tool" | "ml" | "cloud";
  level: number;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  category: "data-engineering" | "ml" | "analytics";
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  type: "engineer" | "analyst" | "ml";
}

export const skills: Skill[] = [
  { name: "Python", category: "language", level: 5, icon: "python" },
  { name: "SQL", category: "language", level: 5, icon: "sql" },
  { name: "TypeScript", category: "language", level: 3, icon: "typescript" },
  { name: "Spark", category: "framework", level: 4, icon: "spark" },
  { name: "Airflow", category: "tool", level: 4, icon: "airflow" },
  { name: "dbt", category: "tool", level: 4, icon: "dbt" },
  { name: "TensorFlow", category: "ml", level: 3, icon: "tensorflow" },
  { name: "PyTorch", category: "ml", level: 3, icon: "pytorch" },
  { name: "scikit-learn", category: "ml", level: 3, icon: "sklearn" },
  { name: "AWS", category: "cloud", level: 3, icon: "aws" },
  { name: "Docker", category: "tool", level: 3, icon: "docker" },
  { name: "Kafka", category: "tool", level: 2, icon: "kafka" },
  { name: "PostgreSQL", category: "tool", level: 4, icon: "postgres" },
  { name: "Redis", category: "tool", level: 2, icon: "redis" },
  { name: "GCP", category: "cloud", level: 2, icon: "gcp" },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "Real-Time Data Pipeline",
    description: "Built an end-to-end streaming data pipeline with Kafka, Spark Streaming, and Airflow for real-time analytics on user behavior data.",
    tech: ["Kafka", "Spark", "Airflow", "Python"],
    github: "https://github.com",
    demo: "https://demo.example.com",
    category: "data-engineering",
  },
  {
    id: "2",
    title: "ML Fraud Detection Model",
    description: "Developed a gradient-boosted fraud detection model with 96% precision serving 10M+ transactions daily via a Flask API on GCP.",
    tech: ["Python", "scikit-learn", "GCP", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://demo.example.com",
    category: "ml",
  },
  {
    id: "3",
    title: "Data Warehouse & Dashboard",
    description: "Designed and implemented a dimensional data warehouse with dbt transformations and interactive Tableau dashboards for executive reporting.",
    tech: ["dbt", "PostgreSQL", "Tableau", "SQL"],
    github: "https://github.com",
    demo: "https://demo.example.com",
    category: "analytics",
  },
  {
    id: "4",
    title: "ML Recommendation Engine",
    description: "Built a collaborative filtering recommendation engine using PyTorch that improved user engagement by 34%. Deployed on AWS SageMaker.",
    tech: ["PyTorch", "AWS", "Python", "Redis"],
    github: "https://github.com",
    demo: "https://demo.example.com",
    category: "ml",
  },
];

export const experience: Experience[] = [
  {
    id: "1",
    role: "Senior Data Engineer",
    company: "TechCorp",
    period: "2022 — Present",
    description: "Lead data pipeline architecture, migrated 50+ batch jobs to streaming, reduced pipeline latency by 60%.",
    type: "engineer",
  },
  {
    id: "2",
    role: "Data Analyst",
    company: "DataCo",
    period: "2020 — 2022",
    description: "Built automated reporting dashboards, performed ad-hoc analysis for executive team, established data quality metrics.",
    type: "analyst",
  },
  {
    id: "3",
    role: "ML Engineer",
    company: "AIStart",
    period: "2019 — 2020",
    description: "Developed NLP pipeline for customer feedback, implemented ML models for churn prediction, deployed models to production.",
    type: "ml",
  },
];

export const bio = {
  name: "Your Name",
  title: "Data Engineer / Data Analyst / ML Engineer",
  summary: "I design and build data systems that turn raw information into actionable intelligence. From streaming pipelines to ML models, I work across the full data stack.",
  stats: {
    yearsExperience: 5,
    projectsShipped: 12,
    technologies: 15,
  },
  email: "your@email.com",
  github: "https://github.com/yourname",
  linkedin: "https://linkedin.com/in/yourname",
};
```

- [ ] **Step 2: Commit data file**

```bash
git add src/data/portfolio.ts
git commit -m "feat(portfolio): add portfolio data layer"
```

---

## Phase 3: 3D Scene Components

### Task 3: Build CanvasWrapper utility

- [ ] **Step 1: Create `src/components/portfolio/common/CanvasWrapper.tsx`**

Write:
```tsx
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
```

- [ ] **Step 2: Commit CanvasWrapper**

```bash
git add src/components/portfolio/common/CanvasWrapper.tsx
git commit -m "feat(portfolio): add CanvasWrapper component for 3D scenes"
```

### Task 4: Build HeroScene

- [ ] **Step 1: Create `src/components/portfolio/hero/HeroScene.tsx`**

Write:
```tsx
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
```

- [ ] **Step 2: Commit HeroScene**

```bash
git add src/components/portfolio/hero/HeroScene.tsx
git commit -m "feat(portfolio): add HeroScene 3D component with neural web and particles"
```

### Task 5: Build SkillsScene

- [ ] **Step 1: Create `src/components/portfolio/skills/SkillsScene.tsx`**

Write:
```tsx
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
```

- [ ] **Step 2: Commit SkillsScene**

```bash
git add src/components/portfolio/skills/SkillsScene.tsx
git commit -m "feat(portfolio): add SkillsScene 3D component with floating nodes"
```

### Task 6: Build TimelineScene

- [ ] **Step 1: Create `src/components/portfolio/experience/TimelineScene.tsx`**

Write:
```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, LineBasicMaterial, TubeGeometry, MeshBasicMaterial } from "three";
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

  useFrame((state) => {
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
```

- [ ] **Step 2: Commit TimelineScene**

```bash
git add src/components/portfolio/experience/TimelineScene.tsx
git commit -m "feat(portfolio): add TimelineScene 3D component with animated nodes"
```

---

### Task 7: Build ProjectsScene

- [ ] **Step 1: Create `src/components/portfolio/projects/ProjectsScene.tsx`**

Write:
```tsx
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
```

- [ ] **Step 2: Commit ProjectsScene**

```bash
git add src/components/portfolio/projects/ProjectsScene.tsx
git commit -m "feat(portfolio): add ProjectsScene 3D floating data panels"
```

---

## Phase 4: Section Components

### Task 8: Build HeroSection

- [ ] **Step 1: Create `src/components/portfolio/hero/HeroSection.tsx`**

Write:
```tsx
"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import CanvasWrapper from "../common/CanvasWrapper";
import HeroScene from "./HeroScene";
import { bio } from "../../../data/portfolio";

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <CanvasWrapper className="absolute inset-0 z-0" />
      <HeroScene />
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-mono font-bold text-cyan-400 tracking-tight"
        >
          {bio.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-4 text-lg md:text-xl text-gray-400 font-mono"
        >
          {bio.title}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-6 max-w-xl mx-auto text-gray-500 text-sm md:text-base"
        >
          I design and build data systems that turn raw information into actionable intelligence.
        </motion.p>
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          href="#projects"
          className="inline-block mt-8 px-6 py-3 border border-cyan-400 text-cyan-400 font-mono text-sm hover:bg-cyan-400/10 transition-all duration-300"
        >
          View My Work
        </motion.a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit HeroSection**

```bash
git add src/components/portfolio/hero/HeroSection.tsx
git commit -m "feat(portfolio): add HeroSection with 3D scene and text overlay"
```

### Task 9: Build AboutSection

- [ ] **Step 1: Create `src/components/portfolio/about/AboutSection.tsx`**

Write:
```tsx
"use client";

import { motion } from "framer-motion";
import { bio } from "../../../data/portfolio";

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 md:py-32 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-300 leading-relaxed text-lg">{bio.summary}</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-mono font-bold text-cyan-400"
              >
                {bio.stats.yearsExperience}+
              </motion.div>
              <div className="text-gray-500 text-sm mt-1 font-mono">Years</div>
            </div>
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-mono font-bold text-magenta-400"
              >
                {bio.stats.projectsShipped}
              </motion.div>
              <div className="text-gray-500 text-sm mt-1 font-mono">Projects</div>
            </div>
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-mono font-bold text-purple-400"
              >
                {bio.stats.technologies}
              </motion.div>
              <div className="text-gray-500 text-sm mt-1 font-mono">Technologies</div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="aspect-square max-w-md mx-auto"
        >
          <div className="w-full h-full rounded-lg border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
            <span className="text-gray-600 font-mono text-sm">Constellation 3D</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit AboutSection**

```bash
git add src/components/portfolio/about/AboutSection.tsx
git commit -m "feat(portfolio): add AboutSection with bio and stats"
```

### Task 10: Build SkillsSection

- [ ] **Step 1: Create `src/components/portfolio/skills/SkillsSection.tsx`**

Write:
```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skills } from "../../../data/portfolio";

const categories = ["all", "language", "framework", "tool", "ml", "cloud"];

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const filtered = activeCategory === "all" ? skills : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="relative py-20 md:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-mono font-bold text-white mb-8"
        >
          Tech Stack
        </motion.h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-wider border transition-all duration-300 ${
                activeCategory === cat
                  ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
                  : "border-gray-700 text-gray-500 hover:border-gray-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filtered.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="p-4 border border-gray-800 rounded-lg bg-gray-950/50 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300 cursor-pointer group"
            >
              <div className="text-white font-mono text-sm group-hover:text-cyan-400 transition-colors">{skill.name}</div>
              <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${skill.level * 20}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="w-full h-full" />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit SkillsSection**

```bash
git add src/components/portfolio/skills/SkillsSection.tsx
git commit -m "feat(portfolio): add SkillsSection with category tabs and skill cards"
```

### Task 11: Build ProjectsSection

- [ ] **Step 1: Create `src/components/portfolio/projects/ProjectsSection.tsx`**

Write:
```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { projects } from "../../../data/portfolio";

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const project = selectedProject ? projects.find((p) => p.id === selectedProject) : null;

  return (
    <section id="projects" className="relative py-20 md:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-mono font-bold text-white mb-8"
        >
          Projects
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedProject(p.id)}
              className="p-6 border border-gray-800 rounded-lg bg-gray-950/50 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-mono font-bold text-white group-hover:text-cyan-400 transition-colors">{p.title}</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{p.description}</p>
              <div className="flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span key={t} className="px-2 py-1 text-xs font-mono border border-gray-700 text-gray-400 rounded">{t}</span>
                ))}
              </div>
              <div className="mt-4 flex gap-4">
                <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-cyan-400 hover:underline">GitHub</a>
                <a href={p.demo} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-magenta-400 hover:underline">Live Demo</a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="max-w-2xl w-full bg-gray-900 border border-gray-700 rounded-lg p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white font-mono text-xl">&times;</button>
            <h3 className="text-2xl font-mono font-bold text-white mb-4">{project.title}</h3>
            <p className="text-gray-300 mb-6">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">{project.tech.map((t) => <span key={t} className="px-3 py-1 text-xs font-mono border border-cyan-400/30 text-cyan-400 rounded">{t}</span>)}</div>
            <div className="flex gap-4">
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-cyan-400 text-cyan-400 font-mono text-sm hover:bg-cyan-400/10 transition-colors">GitHub</a>
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-magenta-400 text-magenta-400 font-mono text-sm hover:bg-magenta-400/10 transition-colors">Live Demo</a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Commit ProjectsSection**

```bash
git add src/components/portfolio/projects/ProjectsSection.tsx
git commit -m "feat(portfolio): add ProjectsSection with project cards and modal"
```

### Task 12: Build ExperienceSection

- [ ] **Step 1: Create `src/components/portfolio/experience/ExperienceSection.tsx`**

Write:
```tsx
"use client";

import { motion } from "framer-motion";
import { experience } from "../../../data/portfolio";

export default function ExperienceSection() {
  return (
    <section id="experience" className="relative py-20 md:py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-mono font-bold text-white mb-12"
        >
          Experience
        </motion.h2>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/0 via-cyan-400/30 to-cyan-400/0" />
          <div className="space-y-12">
            {experience.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`relative pl-12 md:pl-0 md:mx-${i % 2 === 0 ? "l" : "r"} ${i % 2 === 0 ? "md:mr-auto md:max-w-xl" : "md:ml-auto md:max-w-xl"}`}
              >
                <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-cyan-400 border-2 border-gray-900" />
                <div className="p-6 border border-gray-800 rounded-lg bg-gray-950/50">
                  <h3 className="font-mono font-bold text-white text-lg">{exp.role}</h3>
                  <p className="text-gray-500 font-mono text-sm mt-1">{exp.company}</p>
                  <p className="text-gray-600 font-mono text-xs mt-1">{exp.period}</p>
                  <p className="text-gray-400 text-sm mt-3">{exp.description}</p>
                  <span className={`inline-block mt-3 px-2 py-1 text-xs font-mono rounded ${
                    exp.type === "engineer" ? "bg-cyan-400/10 text-cyan-400" :
                    exp.type === "analyst" ? "bg-magenta-400/10 text-magenta-400" :
                    "bg-purple-400/10 text-purple-400"
                  }`}>{exp.type}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit ExperienceSection**

```bash
git add src/components/portfolio/experience/ExperienceSection.tsx
git commit -m "feat(portfolio): add ExperienceSection with animated vertical timeline"
```

---

## Task 13: Build ContactSection

- [ ] **Step 1: Create `src/components/portfolio/contact/ContactSection.tsx`**

Write:
```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="relative py-20 md:py-32 px-4">
      <div className="max-w-lg mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-mono font-bold text-white mb-8 text-center"
        >
          Get in Touch
        </motion.h2>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 border border-green-400/30 bg-green-400/5 rounded-lg"
          >
            <div className="text-green-400 font-mono text-lg">Message Sent</div>
            <p className="text-gray-400 text-sm mt-2">I'll get back to you soon.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-400 font-mono text-xs uppercase mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-950 border border-gray-700 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-mono text-xs uppercase mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-950 border border-gray-700 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-mono text-xs uppercase mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-gray-950 border border-gray-700 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none"
                placeholder="Your message..."
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 border border-cyan-400 text-cyan-400 font-mono text-sm hover:bg-cyan-400/10 transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        )}
        <div className="mt-12 flex justify-center gap-8">
          <a href={`mailto:${"bio.email"}`} className="text-gray-500 hover:text-cyan-400 transition-colors font-mono text-sm">Email</a>
          <a href={bio.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors font-mono text-sm">GitHub</a>
          <a href={bio.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors font-mono text-sm">LinkedIn</a>
        </div>
      </div>
     </section>
   );
 }
 ```

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="relative py-20 md:py-32 px-4">
      <div className="max-w-lg mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-mono font-bold text-white mb-8 text-center">
          Get in Touch
        </motion.h2>
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8 border border-green-400/30 bg-green-400/5 rounded-lg">
            <div className="text-green-400 font-mono text-lg">Message Sent</div>
            <p className="text-gray-400 text-sm mt-2">I'll get back to you soon.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-400 font-mono text-xs uppercase mb-2">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-950 border border-gray-700 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-gray-400 font-mono text-xs uppercase mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-950 border border-gray-700 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-gray-400 font-mono text-xs uppercase mb-2">Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} required rows={4} className="w-full px-4 py-3 bg-gray-950 border border-gray-700 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none" placeholder="Your message..." />
            </div>
            <button type="submit" className="w-full px-6 py-3 border border-cyan-400 text-cyan-400 font-mono text-sm hover:bg-cyan-400/10 transition-all duration-300">Send Message</button>
          </form>
        )}
        <div className="mt-12 flex justify-center gap-8">
          <a href={`mailto:${bio.email}`} className="text-gray-500 hover:text-cyan-400 transition-colors font-mono text-sm">Email</a>
          <a href={bio.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors font-mono text-sm">GitHub</a>
          <a href={bio.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors font-mono text-sm">LinkedIn</a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit ContactSection**

```bash
git add src/components/portfolio/contact/ContactSection.tsx
git commit -m "feat(portfolio): add ContactSection with form and social links"
```

### Task 14: Build Nav component

- [ ] **Step 1: Create `src/components/portfolio/layout/Nav.tsx`**

Write:
```tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const sections = ["hero", "about", "skills", "projects", "experience", "contact"];

export default function Nav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const secs = sections.map((id) => document.getElementById(id));
      let current = "hero";
      secs.forEach((el) => {
        if (el && window.scrollY >= el.offsetTop - 200) {
          current = id;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "bg-black/60 border-b border-gray-800" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="#hero" className="font-mono text-cyan-400 text-sm font-bold tracking-wider">PORTFOLIO</Link>
        <div className="flex gap-6">
          {sections.map((sec) => (
            <Link
              key={sec}
              href={`#${sec}`}
              className={`font-mono text-xs uppercase tracking-wider transition-colors duration-300 ${
                activeSection === sec ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {sec}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
```

- [ ] **Step 2: Commit Nav**

```bash
git add src/components/portfolio/layout/Nav.tsx
git commit -m "feat(portfolio): add Nav component with scroll-spot highlighting"
```

---

## Phase 5: Portfolio Page & Layout

### Task 15: Create PortfolioLayout

- [ ] **Step 1: Create `src/app/portfolio/layout.tsx`**

Write:
```tsx
import Nav from "@/components/portfolio/layout/Nav";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0a0a0f] text-white font-sans">
      <Nav />
      <main>{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/portfolio/page.tsx`**

Write:
```tsx
import HeroSection from "@/components/portfolio/hero/HeroSection";
import AboutSection from "@/components/portfolio/about/AboutSection";
import SkillsSection from "@/components/portfolio/skills/SkillsSection";
import ProjectsSection from "@/components/portfolio/projects/ProjectsSection";
import ExperienceSection from "@/components/portfolio/experience/ExperienceSection";
import ContactSection from "@/components/portfolio/contact/ContactSection";

export const metadata = {
  title: "Portfolio — Data Engineer / Analyst / ML Engineer",
  description: "3D interactive portfolio showcasing data engineering, analytics, and machine learning work",
};

export default function PortfolioPage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
```

- [ ] **Step 3: Add portfolio route styles**

Update `src/app/globals.css` to include portfolio-specific theme variables:

```css
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap");

:root {
  --color-cyan: #00f0ff;
  --color-magenta: #ff00aa;
  --color-purple: #7c3aed;
  --color-bg: #0a0a0f;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Commit portfolio page and layout**

```bash
git add src/app/portfolio/layout.tsx src/app/portfolio/page.tsx src/app/globals.css
git commit -m "feat(portfolio): add portfolio routes, layout, and global styles"
```

---

## Phase 6: Performance & Polish

### Task 16: Performance & Polish

- [ ] **Step 1: Update CanvasWrapper to respect motion preferences**

Add a check in `CanvasWrapper.tsx` that reads `window.matchMedia("(prefers-reduced-motion: reduce)")` and passes `frameloop="demand"` to the Canvas when reduced motion is preferred, and sets `autoRotate={false}` and `enableZoom={false}` on all OrbitControls.

- [ ] **Step 2: Add viewport meta and responsive breakpoints to Tailwind config**

Ensure Tailwind v4 config has responsive breakpoints that match the design. Add `viewport` meta tag already present in the existing `layout.tsx`.

- [ ] **Step 3: Lazy load 3D scenes**

Wrap each section's 3D scene component with `React.lazy(() => import("./HeroScene"))` pattern so Three.js modules only load when the section enters the viewport. Use an `IntersectionObserver` hook in the section components.

- [ ] **Step 4: Commit performance optimizations**

```bash
git add src/components/portfolio/
git commit -m "feat(portfolio): add reduced-motion support and lazy-loading for 3D scenes"
```

---

### Task 17: Self-review and final steps

- [ ] **Step 1: Run typecheck**

Run: `npm run typecheck`
Expected: No type errors

- [ ] **Step 2: Run linter**

Run: `npm run lint`
Expected: No lint errors

- [ ] **Step 3: Run dev server**

Run: `npm run dev`
Expected: Portfolio renders at `http://localhost:3000/portfolio` with all 3D scenes and animations working

- [ ] **Step 4: Verify all sections present**

Check `/portfolio` page has: Hero, About, Skills, Projects, Experience, Contact — all with 3D scenes

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat(portfolio): complete 3D portfolio with full animations"
```
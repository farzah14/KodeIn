# 3D Portfolio Website — Design Spec

## Overview

A single-page 3D portfolio website for a Data Engineer / Data Analyst / Machine Learning Engineer, featuring abstract data visualization aesthetics with floating data points, neural web visuals, and full animations.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **3D Rendering:** React Three Fiber (R3F) + Three.js
- **Animation:** Framer Motion (page transitions, UI animations) + R3F built-in animation primitives
- **Styling:** Tailwind CSS
- **3D Helpers:** `@react-three/drei` (OrbitControls, ScrollControls, Float, Text, etc.)
- **Hosting:** Vercel

## Color Palette & Theme

- **Base:** Dark (#0a0a0f) to deep navy
- **Accents:** Cyan (#00f0ff), Magenta (#ff00aa), Purple (#7c3aed)
- **Glow:** Blur + opacity layers on all 3D elements
- **Font:** Monospace for headings (data/tech feel), clean sans-serif for body

## Sections

### 1. Hero

- **3D Scene:** Neural web nodes connected by animated glowing lines, floating data particles orbiting, central rotating icosahedron ("brain") pulsing with data stream rings
- **Overlay:** Name + title in large monospace, subtitle, CTA button ("View My Work")
- **Interaction:** Mouse parallax — camera follows cursor subtly

### 2. About / Bio

- **Layout:** Split screen — text on one side, 3D constellation on the other
- **3D Element:** Floating data constellation — nodes representing milestones and bio facts, connected by animated lines that pulse on scroll
- **Content:** Brief intro + animated stats row (years experience, projects shipped, technologies known)
- **Animation:** Text fades in on scroll via Framer Motion

### 3. Skills / Tech Stack

- **3D Element:** Floating hexagonal nodes in a 3D grid, grouped by category (Languages, Tools, ML/AI, Cloud)
- **Connections:** Animated data-flow lines between related skills with traveling particles
- **Interaction:** Hover pulses/glows a node; category tabs filter and highlight relevant nodes; click tile to expand detail
- **Labels:** Each node shows skill name, appears on hover or on scroll into view

### 4. Projects

- **Layout:** 3D staggered grid with floating panels at varying Z depths
- **3D Element:** Each project card is a floating "data dashboard" panel with a mini 3D chart (bar/line/scatter) where applicable
- **Interaction:**
  - Hover: panel tilts toward cursor, glows, reveals tech tags + links (GitHub / live demo)
  - Click: expands into a modal with detailed case study (problem, approach, tech stack, results)
- **Animation:** Panels bob gently; horizontal scroll or parallax as user scrolls

### 5. Experience / Timeline

- **Layout:** Vertical timeline down the center of the page
- **3D Element:** Glowing animated beam extends upward; each entry has a 3D geometric node (octahedron/icosahedron) that pulses when scrolled into view
- **Connections:** Data waves flow between nodes, color-coded by role type (engineer / analyst / ml)
- **Interaction:** Click a node to expand role details (company, duration, responsibilities)

### 6. Contact

- **Layout:** Centered form (name, email, message)
- **3D Element:** Subtle particle field background that reacts to form focus (particles drift toward active input)
- **Interaction:** Input borders glow on focus; social icons (GitHub, LinkedIn, email) have hover glow/slide animations
- **Success State:** Particle "transmission" burst animation on successful submit

### 7. Blog / Writing (Optional)

- **Layout:** Cards in a 3D grid matching project card style
- **Alternative:** Defer to a separate blog subdomain (e.g., blog.domain.com)

## Navigation

- Sticky top nav with transparent backdrop blur
- Section links with scroll-spot highlighting (Intersection Observer)
- Smooth scroll behavior between sections
- Optional: small rotating 3D logo/icon in nav

## Performance

- 3D scenes lazy-loaded when scrolled into viewport
- `<Canvas>` suspended (paused) when off-screen
- Post-processing: bloom glow effect, minimal depth-of-field
- Reduced polygon counts and particle counts on mobile/slow devices
- Respect `prefers-reduced-motion`: disable parallax, reduce animation intensity, keep transitions minimal
- Semantic HTML with focus-visible states on all interactive elements

## File Structure (planned)

```
portofolio-3d/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── 3d/
│   │   ├── HeroScene.tsx
│   │   ├── SkillsScene.tsx
│   │   ├── ProjectsScene.tsx
│   │   ├── TimelineScene.tsx
│   │   └── ContactScene.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Experience.tsx
│   │   └── Contact.tsx
│   ├── Nav.tsx
│   └── Layout.tsx
├── hooks/
│   └── useScrollProgress.ts
├── data/
│   ├── skills.ts
│   ├── projects.ts
│   └── experience.ts
├── styles/
│   └── theme.css
├── package.json
├── next.config.ts
└── tailwind.config.js
```
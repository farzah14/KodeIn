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
  category: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  type: "professional" | "coop" | "internship";
}

export const bio = {
  name: "KodeIn Developer",
  title: "Full-Stack Developer & 3D Engineer",
  summary:
    "Passionate developer specializing in modern web technologies, 3D visualization, and interactive experiences. I build performant, accessible applications with a focus on craft and user experience.",
  stats: [
    { label: "Years of Experience", value: "5+" },
    { label: "Projects Completed", value: "12" },
    { label: "Technologies", value: "10+" },
    { label: "Open Source Contrib", value: "8" },
  ],
  email: "hello@kodein.dev",
  github: "https://github.com/kodein",
  linkedin: "https://linkedin.com/in/kodein",
};

export const skills: Skill[] = [
  { name: "TypeScript", category: "language", level: 90, icon: "📘" },
  { name: "JavaScript", category: "language", level: 85, icon: "📗" },
  { name: "Python", category: "language", level: 75, icon: "🐍" },
  { name: "React", category: "framework", level: 88, icon: "⚛" },
  { name: "Next.js", category: "framework", level: 85, icon: "▲" },
  { name: "Three.js", category: "framework", level: 70, icon: "🎲" },
  { name: "React Three Fiber", category: "framework", level: 65, icon: "🌿" },
  { name: "Node.js", category: "framework", level: 80, icon: "🟢" },
  { name: "Git", category: "tool", level: 85, icon: "🔀" },
  { name: "Docker", category: "tool", level: 60, icon: "🐳" },
  { name: "VS Code", category: "tool", level: 90, icon: "💻" },
  { name: "Framer Motion", category: "tool", level: 65, icon: "🎬" },
  { name: "TensorFlow", category: "ml", level: 55, icon: "🧠" },
  { name: "PyTorch", category: "ml", level: 50, icon: "🔥" },
  { name: "AWS", category: "cloud", level: 60, icon: "☁" },
];

export const projects: Project[] = [
  {
    id: "proj-1",
    title: "3D Portfolio",
    description:
      "A modern 3D portfolio website built with Next.js, Three.js, and React Three Fiber featuring interactive scene transitions and immersive storytelling.",
    tech: ["Next.js", "Three.js", "R3F", "Framer Motion", "TypeScript"],
    github: "https://github.com/kodein/3d-portfolio",
    demo: "https://kodein.dev",
    category: "web",
  },
  {
    id: "proj-2",
    title: "Battle Arena",
    description:
      "Real-time multiplayer coding battle platform where developers compete in timed coding challenges with live leaderboards.",
    tech: ["Next.js", "Socket.io", "Prisma", "PostgreSQL", "TypeScript"],
    github: "https://github.com/kodein/battle-arena",
    demo: "https://battle.kodein.dev",
    category: "web",
  },
  {
    id: "proj-3",
    title: "AI Code Assistant",
    description:
      "AI-powered coding assistant that provides real-time suggestions, code generation, and intelligent debugging assistance for multiple languages.",
    tech: ["Python", "TensorFlow", "Next.js", "OpenAI API", "TypeScript"],
    github: "https://github.com/kodein/ai-code-assistant",
    demo: "https://ai.kodein.dev",
    category: "ai",
  },
  {
    id: "proj-4",
    title: "Dev Dashboard",
    description:
      "Developer productivity dashboard with project analytics, git activity tracking, and custom workflow automation.",
    tech: ["React", "D3.js", "Node.js", "MongoDB", "TypeScript"],
    github: "https://github.com/kodein/dev-dashboard",
    demo: "https://dash.kodein.dev",
    category: "web",
  },
];

export const experience: Experience[] = [
  {
    id: "exp-1",
    role: "Senior Full-Stack Developer",
    company: "KodeIn Inc.",
    period: "2023 - Present",
    description:
      "Leading development of the 3D portfolio platform and internal tooling. Mentoring junior developers and establishing best practices for React and Three.js adoption.",
    type: "professional",
  },
  {
    id: "exp-2",
    role: "Software Engineering Co-op",
    company: "TechCorp",
    period: "2021 - 2023",
    description:
      "Contributed to backend services and frontend features using React, Node.js, and PostgreSQL. Built REST APIs and participated in code reviews and sprint planning.",
    type: "coop",
  },
  {
    id: "exp-3",
    role: "Backend Engineering Intern",
    company: "StartupLabs",
    period: "2020 - 2021",
    description:
      "Developed microservices in Python and Node.js, implemented CI/CD pipelines, and optimized database queries for improved application performance.",
    type: "internship",
  },
];
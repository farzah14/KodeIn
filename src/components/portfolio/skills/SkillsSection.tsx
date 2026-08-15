"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/data/portfolio";
import dynamic from "next/dynamic";
import CanvasWrapper from "../common/CanvasWrapper";
import { useSectionVisibility } from "../common/useSectionVisibility";

const SkillsScene = dynamic(() => import("./SkillsScene"), { ssr: false });

const categories = ["all", "language", "framework", "tool", "ml", "cloud"];

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { ref, visible } = useSectionVisibility<HTMLElement>();
  const filtered = activeCategory === "all" ? skills : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" ref={ref} className="relative py-20 md:py-32 px-4 overflow-hidden">
      {visible && (
        <CanvasWrapper active={visible} className="pointer-events-none absolute inset-0 z-0 opacity-40">
          <ambientLight intensity={0.5} />
          <SkillsScene />
        </CanvasWrapper>
      )}
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-mono font-bold text-white mb-8">Tech Stack</motion.h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 font-mono text-xs uppercase tracking-wider border transition-all duration-300 ${activeCategory === cat ? "border-cyan-400 text-cyan-400 bg-cyan-400/10" : "border-gray-700 text-gray-500 hover:border-gray-500"}`}>{cat}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filtered.map((skill, i) => (
            <motion.div key={skill.name} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: i * 0.05 }} viewport={{ once: true }} className="p-4 border border-gray-800 rounded-lg bg-gray-950/50 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300 cursor-pointer group">
              <div className="text-white font-mono text-sm group-hover:text-cyan-400 transition-colors">{skill.name}</div>
              <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-cyan-400 rounded-full transition-all duration-500" style={{ width: `${skill.level * 20}%` }} /></div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-30"><div className="w-full h-full" /></div>
    </section>
  );
}

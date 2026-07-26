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
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-mono font-bold text-white mb-8">Projects</motion.h2>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }} onClick={() => setSelectedProject(p.id)} className="p-6 border border-gray-800 rounded-lg bg-gray-950/50 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300 cursor-pointer group">
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedProject(null)}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-2xl w-full bg-gray-900 border border-gray-700 rounded-lg p-8" onClick={(e) => e.stopPropagation()}>
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
"use client";

import { motion } from "framer-motion";
import { bio } from "@/data/portfolio";

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 md:py-32 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <p className="text-gray-300 leading-relaxed text-lg">{bio.summary}</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-mono font-bold text-cyan-400">{bio.stats.yearsExperience}+</motion.div>
              <div className="text-gray-500 text-sm mt-1 font-mono">Years</div>
            </div>
            <div className="text-center">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-mono font-bold text-magenta-400">{bio.stats.projectsShipped}</motion.div>
              <div className="text-gray-500 text-sm mt-1 font-mono">Projects</div>
            </div>
            <div className="text-center">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-mono font-bold text-purple-400">{bio.stats.technologies}</motion.div>
              <div className="text-gray-500 text-sm mt-1 font-mono">Technologies</div>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="aspect-square max-w-md mx-auto">
          <div className="w-full h-full rounded-lg border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
            <span className="text-gray-600 font-mono text-sm">Constellation 3D</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import { experience } from "@/data/portfolio";
import dynamic from "next/dynamic";
import CanvasWrapper from "../common/CanvasWrapper";
import { useSectionVisibility } from "../common/useSectionVisibility";

const TimelineScene = dynamic(() => import("./TimelineScene"), { ssr: false });

export default function ExperienceSection() {
  const { ref, visible } = useSectionVisibility<HTMLElement>();
  return (
    <section id="experience" ref={ref} className="relative py-20 md:py-32 px-4 overflow-hidden">
      {visible && (
        <CanvasWrapper active={visible} className="pointer-events-none absolute inset-0 z-0 opacity-30">
          <ambientLight intensity={0.5} />
          <pointLight position={[-2, 2, 3]} intensity={15} />
          <TimelineScene activeIndex={0} />
        </CanvasWrapper>
      )}
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-mono font-bold text-white mb-12">Experience</motion.h2>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/0 via-cyan-400/30 to-cyan-400/0" />
          <div className="space-y-12">
            {experience.map((exp, i) => {
              const isLeft = i % 2 === 0;
              const sideClasses = isLeft ? "md:mr-auto md:max-w-xl" : "md:ml-auto md:max-w-xl";
              return (
                <motion.div key={exp.id} initial={{ opacity: 0, x: isLeft ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className={`relative pl-12 md:pl-0 ${sideClasses}`}>
                <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-cyan-400 border-2 border-gray-900" />
                <div className="p-6 border border-gray-800 rounded-lg bg-gray-950/50">
                  <h3 className="font-mono font-bold text-white text-lg">{exp.role}</h3>
                  <p className="text-gray-500 font-mono text-sm mt-1">{exp.company}</p>
                  <p className="text-gray-600 font-mono text-xs mt-1">{exp.period}</p>
                  <p className="text-gray-400 text-sm mt-3">{exp.description}</p>
                  <span className={`inline-block mt-3 px-2 py-1 text-xs font-mono rounded ${exp.type === "engineer" ? "bg-cyan-400/10 text-cyan-400" : exp.type === "analyst" ? "bg-magenta-400/10 text-magenta-400" : "bg-purple-400/10 text-purple-400"}`}>{exp.type}</span>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}

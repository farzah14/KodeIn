"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import CanvasWrapper from "../common/CanvasWrapper";
import HeroScene from "./HeroScene";
import { bio } from "@/data/portfolio";

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  return (
    <section id="hero" ref={sectionRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      <CanvasWrapper className="absolute inset-0 z-0">
        <HeroScene />
      </CanvasWrapper>
      <div className="relative z-10 text-center px-4">
        <motion.h1 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-5xl md:text-7xl font-mono font-bold text-cyan-400 tracking-tight">{bio.name}</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="mt-4 text-lg md:text-xl text-gray-400 font-mono">{bio.title}</motion.p>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} viewport={{ once: true }} className="mt-6 max-w-xl mx-auto text-gray-500 text-sm md:text-base">I design and build data systems that turn raw information into actionable intelligence.</motion.p>
        <motion.a initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} viewport={{ once: true }} href="#projects" className="inline-block mt-8 px-6 py-3 border border-cyan-400 text-cyan-400 font-mono text-sm hover:bg-cyan-400/10 transition-all duration-300">View My Work</motion.a>
      </div>
    </section>
  );
}
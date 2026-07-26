"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }} className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${scrolled ? "bg-black/60 border-b border-gray-800" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="#hero" className="font-mono text-cyan-400 text-sm font-bold tracking-wider">PORTFOLIO</Link>
        <div className="flex gap-6">
          {sections.map((sec) => (
            <Link key={sec} href={`#${sec}`} className={`font-mono text-xs uppercase tracking-wider transition-colors duration-300 ${activeSection === sec ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}>{sec}</Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
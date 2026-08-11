"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { bio } from "@/data/portfolio";
import dynamic from "next/dynamic";
import CanvasWrapper from "../common/CanvasWrapper";
import { useSectionVisibility } from "../common/useSectionVisibility";

const ContactScene = dynamic(() => import("./ContactScene"), { ssr: false });

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const { ref, visible } = useSectionVisibility<HTMLElement>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("pending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "CONTACT_DELIVERY_UNAVAILABLE");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
      setError("Message could not be delivered. Please try again later.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" ref={ref} className="relative py-20 md:py-32 px-4 overflow-hidden">
      {visible && (
        <CanvasWrapper active={visible} className="pointer-events-none absolute inset-0 z-0 opacity-30">
          <ambientLight intensity={0.5} />
          <ContactScene />
        </CanvasWrapper>
      )}
      <div className="relative z-10 max-w-lg mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-mono font-bold text-white mb-8 text-center">Get in Touch</motion.h2>
        {status === "success" ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8 border border-green-400/30 bg-green-400/5 rounded-lg">
            <div className="text-green-400 font-mono text-lg" role="status">Message Sent</div>
            <p className="text-gray-400 text-sm mt-2">Your message was accepted for delivery.</p>
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
            {status === "error" && <p role="alert" className="text-red-400 text-sm font-mono">{error}</p>}
            <button type="submit" disabled={status === "pending"} className="w-full px-6 py-3 border border-cyan-400 text-cyan-400 font-mono text-sm hover:bg-cyan-400/10 transition-all duration-300 disabled:cursor-wait disabled:opacity-50">{status === "pending" ? "Sending..." : "Send Message"}</button>
          </form>
        )}
        {bio.isDemo ? (
          <p className="mt-12 text-center text-xs font-mono text-amber-300">Demo portfolio: contact and social destinations require owner configuration.</p>
        ) : (
          <div className="mt-12 flex justify-center gap-8">
            <a href={`mailto:${bio.email}`} className="text-gray-500 hover:text-cyan-400 transition-colors font-mono text-sm">Email</a>
            <a href={bio.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors font-mono text-sm">GitHub</a>
            <a href={bio.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors font-mono text-sm">LinkedIn</a>
          </div>
        )}
      </div>
    </section>
  );
}

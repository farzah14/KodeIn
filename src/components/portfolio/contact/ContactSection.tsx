"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { bio } from "../../../data/portfolio";

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
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-mono font-bold text-white mb-8 text-center">Get in Touch</motion.h2>
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
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import YashLogo from "./YashLogo";
import CyberBackground from "./CyberBackground";
import { 
  Code2, 
  Sparkles, 
  Lightbulb, 
  Cpu, 
  ArrowUpRight, 
  Zap,
  Terminal,
  BrainCircuit,
  FileCode,
  Flame
} from "lucide-react";

export default function EmptyState({ onSelectPrompt }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Prompts", icon: Sparkles },
    { id: "code", label: "Coding & Web", icon: Code2 },
    { id: "ideas", label: "Brainstorming", icon: Lightbulb },
    { id: "architecture", label: "Architecture", icon: Cpu },
  ];

  const promptCards = [
    {
      category: "code",
      title: "Build a Modern React Hook",
      desc: "Write a custom useDebounce hook with TypeScript types, cancel methods, and tests.",
      prompt: "Write a clean custom useDebounce hook in React with explanation and example usage.",
      icon: Code2,
      badge: "TypeScript",
      accent: "text-blue-400 border-[#3e55af]/50",
    },
    {
      category: "code",
      title: "HTML5 & Tailwind Masterclass",
      desc: "Explain HTML5 semantic layout structure with practical responsive design patterns.",
      prompt: "Tell me about HTML with full code examples, semantic elements, and modern practices.",
      icon: FileCode,
      badge: "Frontend",
      accent: "text-sky-400 border-sky-500/40",
    },
    {
      category: "architecture",
      title: "Design Next.js SaaS Architecture",
      desc: "Architect a production-ready Next.js SaaS folder layout with MongoDB Atlas & Auth.",
      prompt: "Architect a scalable Next.js 15+ SaaS folder structure with App Router, MongoDB Atlas, and Auth.",
      icon: Terminal,
      badge: "Fullstack",
      accent: "text-indigo-400 border-indigo-500/40",
    },
    {
      category: "ideas",
      title: "Generate High-Impact AI SaaS Ideas",
      desc: "Brainstorm 5 profitable AI micro-SaaS ideas with monetization strategies and tech stacks.",
      prompt: "Brainstorm 5 high-impact AI SaaS product ideas for developers in 2026 with unique selling points and monetization models.",
      icon: BrainCircuit,
      badge: "Strategy",
      accent: "text-blue-300 border-blue-500/40",
    },
  ];

  const filteredCards = activeCategory === "all" 
    ? promptCards 
    : promptCards.filter(c => c.category === activeCategory);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-4xl mx-auto w-full relative overflow-hidden">
      
      {/* Anime.js / Motion Interactive Cyber Background */}
      <CyberBackground />

      {/* Hero Ambient Radial Beam */}
      <motion.div 
        animate={{ 
          scale: [1, 1.12, 1],
          opacity: [0.3, 0.6, 0.3] 
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[#024dbe]/15 rounded-full blur-3xl pointer-events-none -z-10"
      />

      {/* Hero Branding */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-3.5 mb-6 z-10"
      >
        {/* Animated Pill Badge (Kokonut UI Shimmer) */}
        <motion.div 
          whileHover={{ scale: 1.04 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] bg-[#3e55af]/15 border border-[#3e55af]/40 text-blue-200 text-xs font-semibold shadow-md backdrop-blur-md relative overflow-hidden"
        >
          {/* Moving Light Shimmer */}
          <div className="absolute inset-0 animate-shimmer opacity-40 pointer-events-none" />
          <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400/40 animate-pulse" />
          <span>Yash AI 3.0 • Real-Time Streaming & MongoDB Atlas</span>
        </motion.div>

        {/* Logo Monogram with floating hover */}
        <div className="flex justify-center my-2">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
            transition={{ type: "spring", stiffness: 350, damping: 15 }}
            className="p-2.5 rounded-[4px] bg-slate-900/90 border border-slate-800 shadow-2xl relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#3e55af] to-[#024dbe] rounded-[6px] blur-sm opacity-35 animate-pulse" />
            <div className="relative">
              <YashLogo size={50} />
            </div>
          </motion.div>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          What would you like to build today?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed font-normal">
          Instant answers, code generation, system architecture, and deep reasoning powered by Google Gemini.
        </p>
      </motion.div>

      {/* Category Pills (Framer Motion spring tabs) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center justify-center flex-wrap gap-2 mb-6 z-10"
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] text-xs font-semibold transition-all relative ${
                isActive
                  ? "bg-brand text-white shadow-md border border-[#3e55af]"
                  : "bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Kokonut UI Animated Cards Grid with Border Beams */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-3xl z-10"
      >
        <AnimatePresence mode="popLayout">
          {filteredCards.map((card, idx) => {
            const CardIcon = card.icon;
            return (
              <motion.div
                key={card.title}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 14 }}
                transition={{ duration: 0.3, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPrompt(card.prompt)}
                className="glass-card group p-4 rounded-[4px] cursor-pointer flex flex-col justify-between relative overflow-hidden shadow-lg border border-slate-800/90"
              >
                {/* Kokonut Rotating Border Beam on hover */}
                <div className="absolute inset-0 border border-transparent group-hover:border-[#3e55af]/70 rounded-[4px] transition-colors pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        whileHover={{ rotate: 10 }}
                        className="p-1.5 rounded-[4px] bg-slate-900 border border-slate-800 text-blue-400 group-hover:text-white group-hover:bg-brand transition-colors"
                      >
                        <CardIcon className="w-3.5 h-3.5" />
                      </motion.div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] border ${card.accent} font-semibold`}>
                        {card.badge}
                      </span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-xs text-slate-200 group-hover:text-white transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

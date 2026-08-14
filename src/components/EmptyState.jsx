"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import YashLogo from "./YashLogo";
import { 
  Code2, 
  Sparkles, 
  Lightbulb, 
  Cpu, 
  ArrowUpRight, 
  Zap,
  Terminal,
  BrainCircuit,
  FileCode
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
      desc: "Write a custom useDebounce hook with TypeScript types and cleanup.",
      prompt: "Write a clean custom useDebounce hook in React with explanation and example usage.",
      icon: Code2,
      badge: "TypeScript",
      gradient: "from-[#3e55af] to-[#024dbe]",
      accent: "text-blue-400 border-[#3e55af]/50",
    },
    {
      category: "code",
      title: "HTML5 & Tailwind Masterclass",
      desc: "Explain HTML5 semantic structure with practical modern layout examples.",
      prompt: "Tell me about HTML with full code examples, semantic elements, and modern practices.",
      icon: FileCode,
      badge: "Frontend",
      gradient: "from-[#3e55af] to-[#024dbe]",
      accent: "text-sky-400 border-sky-500/40",
    },
    {
      category: "architecture",
      title: "Design Next.js App Architecture",
      desc: "Architect a scalable SaaS directory structure with Server Actions & MongoDB.",
      prompt: "Architect a scalable Next.js 15+ SaaS folder structure with App Router, MongoDB Atlas, and Auth.",
      icon: Terminal,
      badge: "Fullstack",
      gradient: "from-[#3e55af] to-[#024dbe]",
      accent: "text-indigo-400 border-indigo-500/40",
    },
    {
      category: "ideas",
      title: "Generate High-Impact AI SaaS Ideas",
      desc: "Brainstorm 5 profitable AI micro-SaaS ideas with monetization strategies.",
      prompt: "Brainstorm 5 high-impact AI SaaS product ideas for developers in 2026 with unique selling points and monetization models.",
      icon: BrainCircuit,
      badge: "Strategy",
      gradient: "from-[#3e55af] to-[#024dbe]",
      accent: "text-blue-300 border-blue-500/40",
    },
  ];

  const filteredCards = activeCategory === "all" 
    ? promptCards 
    : promptCards.filter(c => c.category === activeCategory);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-4xl mx-auto w-full relative overflow-hidden bg-cyber-grid">
      
      {/* Background Radial Glow with brand colors #3e55af / #024dbe */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#024dbe]/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

      {/* Hero Branding with Framer Motion */}
      <motion.div 
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-3.5 mb-6"
      >
        {/* Glowing Hero Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[4px] bg-[#3e55af]/15 border border-[#3e55af]/40 text-blue-200 text-xs font-semibold shadow-xs">
          <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400/30" />
          <span>Yash AI 3.0 • Real-Time Streaming & MongoDB Atlas</span>
        </div>

        {/* Logo Monogram */}
        <div className="flex justify-center my-2">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="p-2 rounded-[4px] bg-slate-900/90 border border-slate-800 shadow-xl"
          >
            <YashLogo size={46} />
          </motion.div>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          What would you like to build today?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed font-normal">
          Instant answers, code generation, system architecture, and deep analysis powered by Google Gemini.
        </p>
      </motion.div>

      {/* Category Pills (with brand gradient) */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center justify-center flex-wrap gap-1.5 mb-5"
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-all ${
                isActive
                  ? "bg-brand text-white shadow-xs border border-[#3e55af]"
                  : "bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Prompt Cards Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-3xl"
      >
        {filteredCards.map((card, idx) => {
          const CardIcon = card.icon;
          return (
            <motion.div
              key={card.title}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectPrompt(card.prompt)}
              className="glass-card group p-3.5 rounded-[4px] cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top brand gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-[4px] bg-slate-900 border border-slate-800 text-blue-400 group-hover:text-white group-hover:bg-brand transition-colors">
                      <CardIcon className="w-3.5 h-3.5" />
                    </div>
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
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

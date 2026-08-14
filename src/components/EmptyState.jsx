"use client";

import YashLogo from "./YashLogo";
import { Code, Lightbulb, PenTool, GraduationCap, Zap, ArrowUpRight } from "lucide-react";

const PROMPT_STARTERS = [
  {
    icon: Code,
    category: "Coding & Web",
    color: "from-blue-500/15 to-cyan-500/15 border-blue-500/20 text-blue-400",
    title: "Build a React Custom Hook",
    prompt: "Write a complete custom React hook `useDebounce` with full explanations, TypeScript types, and an example usage component.",
  },
  {
    icon: Lightbulb,
    category: "Brainstorming",
    color: "from-amber-500/15 to-yellow-500/15 border-amber-500/20 text-amber-400",
    title: "Micro-SaaS Startup Ideas",
    prompt: "Give me 5 unique, profitable Micro-SaaS ideas that can be built by a solo developer using AI and Next.js in 2026.",
  },
  {
    icon: PenTool,
    category: "Writing & Content",
    color: "from-purple-500/15 to-pink-500/15 border-purple-500/20 text-purple-400",
    title: "Draft Professional Cold Email",
    prompt: "Write a high-converting, professional cold outreach email to pitch freelance full-stack web development services to agency owners.",
  },
  {
    icon: GraduationCap,
    category: "Learning",
    color: "from-emerald-500/15 to-teal-500/15 border-emerald-500/20 text-emerald-400",
    title: "Explain Quantum Computing",
    prompt: "Explain how quantum computers work and why qubits are different from traditional binary bits using simple analogies.",
  },
];

export default function EmptyState({ onSelectPrompt }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 max-w-4xl mx-auto w-full text-center">
      {/* Modern Yash AI Emblem */}
      <div className="relative mb-5">
        <YashLogo size={56} className="shadow-lg shadow-indigo-500/20 ring-1 ring-white/15 mx-auto" />
      </div>

      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-2.5">
        How can <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Yash AI</span> assist you today?
      </h1>
      <p className="text-slate-400 text-xs md:text-sm max-w-md mb-7 leading-relaxed font-normal">
        Your intelligent pair programmer and creative AI assistant. Build code, brainstorm ideas, write content, and solve complex problems.
      </p>

      {/* Grid of Prompt Starters with 4px radius */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl text-left">
        {PROMPT_STARTERS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="group relative p-3.5 rounded-[4px] bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all duration-150 text-left flex flex-col justify-between hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-[4px] bg-gradient-to-br border ${item.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 group-hover:text-indigo-300 flex items-center gap-0.5 transition-colors">
                    Try this <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
                <h3 className="font-semibold text-slate-200 text-xs md:text-sm mb-1 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
                  {item.prompt}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-7 flex items-center gap-1.5 text-xs text-slate-500 font-normal">
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span>Yash AI Engine • Context-aware memory • Real-time Markdown & Code</span>
      </div>
    </div>
  );
}

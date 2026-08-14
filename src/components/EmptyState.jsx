"use client";

import { Sparkles, Code, Lightbulb, PenTool, GraduationCap, Zap, ArrowUpRight } from "lucide-react";

const PROMPT_STARTERS = [
  {
    icon: Code,
    category: "Coding & Web",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
    title: "Build a React Custom Hook",
    prompt: "Write a complete custom React hook `useDebounce` with full explanations, TypeScript types, and an example usage component.",
  },
  {
    icon: Lightbulb,
    category: "Brainstorming",
    color: "from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-400",
    title: "Micro-SaaS Startup Ideas",
    prompt: "Give me 5 unique, profitable Micro-SaaS ideas that can be built by a solo developer using AI and Next.js in 2026.",
  },
  {
    icon: PenTool,
    category: "Writing & Content",
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
    title: "Draft Professional Cold Email",
    prompt: "Write a high-converting, professional cold outreach email to pitch freelance full-stack web development services to agency owners.",
  },
  {
    icon: GraduationCap,
    category: "Learning",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
    title: "Explain Quantum Computing",
    prompt: "Explain how quantum computers work and why qubits are different from traditional binary bits using simple analogies.",
  },
];

export default function EmptyState({ onSelectPrompt }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 max-w-4xl mx-auto w-full text-center">
      {/* Emblem & Title */}
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-2xl opacity-60"></div>
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/25 ring-1 ring-white/20 mx-auto">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
        How can I help you today?
      </h1>
      <p className="text-slate-400 text-sm md:text-base max-w-lg mb-8 leading-relaxed">
        Powered by Google Gemini. Ask me code questions, brainstorm startup ideas, write content, or learn complex concepts.
      </p>

      {/* Grid of Prompt Starters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl text-left">
        {PROMPT_STARTERS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="group relative p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-200 text-left flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className={`p-2 rounded-xl bg-gradient-to-br border ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 group-hover:text-indigo-300 flex items-center gap-0.5 transition-colors">
                    Try this <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
                <h3 className="font-semibold text-slate-200 text-sm mb-1 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.prompt}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-slate-500">
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span>Gemini 2.5 Flash • Context-aware memory • Real-time Markdown & Code rendering</span>
      </div>
    </div>
  );
}

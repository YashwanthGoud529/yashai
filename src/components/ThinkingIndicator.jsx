"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, BrainCircuit, Zap } from "lucide-react";

export default function ThinkingIndicator() {
  const [elapsed, setElapsed] = useState(0.1);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => +(prev + 0.1).toFixed(1));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="space-y-3 py-1.5 max-w-lg"
    >
      {/* Top Reasoning Pill Badge with Kokonut Shimmer */}
      <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-[4px] bg-[#161b22]/90 border border-[#3e55af]/50 text-blue-200 text-xs shadow-lg backdrop-blur-md relative overflow-hidden group">
        {/* Shimmer Light Beam */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/15 to-transparent -translate-x-full animate-shimmer pointer-events-none" />

        {/* Animated Cyber Core Icon */}
        <div className="relative flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 rounded-full border border-dashed border-blue-400"
          />
          <BrainCircuit className="w-3 h-3 text-blue-400 absolute" />
        </div>

        {/* Status text */}
        <div className="flex items-center gap-1.5 font-semibold text-[11px] tracking-wide">
          <span className="text-white">Reasoning with Gemini</span>
          <span className="text-slate-400 font-mono font-normal">({elapsed}s)</span>
        </div>

        {/* Waveform Equalizer Bars */}
        <div className="flex items-center gap-0.5 h-3 ml-1">
          <span className="w-0.5 bg-blue-400 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
          <span className="w-0.5 bg-blue-400 rounded-full animate-bounce h-3.5" style={{ animationDelay: '150ms' }} />
          <span className="w-0.5 bg-blue-400 rounded-full animate-bounce h-1.5" style={{ animationDelay: '300ms' }} />
          <span className="w-0.5 bg-blue-400 rounded-full animate-bounce h-3" style={{ animationDelay: '450ms' }} />
        </div>
      </div>

      {/* Cyber Shimmer Skeleton Lines */}
      <div className="space-y-2 pt-1">
        <div className="h-3 rounded-[3px] bg-slate-800/70 relative overflow-hidden w-4/5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3e55af]/30 to-transparent -translate-x-full animate-shimmer" />
        </div>
        <div className="h-3 rounded-[3px] bg-slate-800/60 relative overflow-hidden w-11/12">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3e55af]/25 to-transparent -translate-x-full animate-shimmer" style={{ animationDelay: '200ms' }} />
        </div>
        <div className="h-3 rounded-[3px] bg-slate-800/50 relative overflow-hidden w-2/3">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3e55af]/20 to-transparent -translate-x-full animate-shimmer" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </motion.div>
  );
}

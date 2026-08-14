"use client";

export default function YashLogo({ size = 28, className = "" }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-[4px] overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="yashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background container */}
        <rect width="100" height="100" rx="16" fill="#0d1117" />
        <rect width="100" height="100" rx="16" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />

        {/* Glowing Neural Circuit Lines */}
        <path
          d="M20 50 H38 L50 68"
          stroke="url(#glowGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 4"
          opacity="0.6"
        />
        <path
          d="M80 50 H62 L50 68"
          stroke="url(#glowGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 4"
          opacity="0.6"
        />

        {/* Dynamic 'Y' Monogram */}
        <path
          d="M26 24 L50 56 L74 24"
          stroke="url(#yashGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#neonGlow)"
        />
        <path
          d="M50 56 V80"
          stroke="url(#yashGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          filter="url(#neonGlow)"
        />

        {/* AI Sparkle Core Node */}
        <circle cx="50" cy="56" r="4.5" fill="#ffffff" />
        <circle cx="26" cy="24" r="3.5" fill="#38bdf8" />
        <circle cx="74" cy="24" r="3.5" fill="#a855f7" />
        <circle cx="50" cy="80" r="3.5" fill="#06b6d4" />
      </svg>
    </div>
  );
}

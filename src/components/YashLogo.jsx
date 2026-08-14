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
          <linearGradient id="yashBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3e55af" />
            <stop offset="100%" stopColor="#024dbe" />
          </linearGradient>
          <linearGradient id="yashGlowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3e55af" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#024dbe" stopOpacity="0.9" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background container */}
        <rect width="100" height="100" rx="16" fill="#0d1117" />
        <rect width="100" height="100" rx="16" stroke="rgba(62,85,175,0.4)" strokeWidth="3" />

        {/* Glowing Neural Circuit Lines */}
        <path
          d="M20 50 H38 L50 68"
          stroke="url(#yashGlowGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 4"
          opacity="0.7"
        />
        <path
          d="M80 50 H62 L50 68"
          stroke="url(#yashGlowGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 4"
          opacity="0.7"
        />

        {/* Dynamic 'Y' Monogram with linear-gradient(90deg, #3e55af 0%, #024dbe 100%) */}
        <path
          d="M26 24 L50 56 L74 24"
          stroke="url(#yashBrandGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#neonGlow)"
        />
        <path
          d="M50 56 V80"
          stroke="url(#yashBrandGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          filter="url(#neonGlow)"
        />

        {/* AI Sparkle Core Node */}
        <circle cx="50" cy="56" r="4.5" fill="#ffffff" />
        <circle cx="26" cy="24" r="3.5" fill="#3e55af" />
        <circle cx="74" cy="24" r="3.5" fill="#024dbe" />
        <circle cx="50" cy="80" r="3.5" fill="#024dbe" />
      </svg>
    </div>
  );
}

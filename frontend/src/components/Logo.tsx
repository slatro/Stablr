import React from 'react';

export const Logo = () => (
  <div className="flex items-center gap-4 group cursor-pointer">
    <div className="relative w-12 h-12 flex items-center justify-center shrink-0" style={{ width: '48px', height: '48px' }}>
      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-transform duration-500 group-hover:scale-110">
        <defs>
          <linearGradient id="silverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <linearGradient id="blueMetallic" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="40%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* The Outer Arch (A) */}
        <path 
          d="M20 85 C 20 20, 80 20, 80 85" 
          fill="none" 
          stroke="url(#silverGradient)" 
          strokeWidth="12" 
          strokeLinecap="round"
        />

        {/* The 'F' Bar integration */}
        <path 
          d="M32 55 L 55 55" 
          fill="none" 
          stroke="url(#silverGradient)" 
          strokeWidth="10" 
          strokeLinecap="round"
        />

        {/* The 'X' integration (Blue part) */}
        <path 
          d="M45 75 L 68 55 M 45 55 L 68 75" 
          fill="none" 
          stroke="url(#blueMetallic)" 
          strokeWidth="10" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>

    <div className="flex flex-col">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-light tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-300 to-slate-500 uppercase font-sans">
          ARC
        </span>
        <span className="text-2xl font-bold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-blue-300 via-blue-500 to-blue-800 uppercase font-sans">
          FX
        </span>
      </div>
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </div>
  </div>
);

import React from 'react';

export const Logo = () => (
  <div className="flex items-center gap-4 group cursor-pointer">
    <div className="relative w-12 h-12 flex items-center justify-center shrink-0" style={{ width: '48px', height: '48px' }}>
      <svg viewBox="0 0 100 100" className="w-full h-full transition-all duration-500 group-hover:scale-105">
        <defs>
          <linearGradient id="logoSilver" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          
          <linearGradient id="logoBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          {/* Neon Glow Filter */}
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feFlood floodColor="#3B82F6" floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#neonGlow)">
          {/* Main Arch 'A' Shape */}
          <path 
            d="M 22 82 C 22 15, 78 15, 78 82 L 68 82 C 68 35, 32 35, 32 82 Z" 
            fill="url(#logoSilver)" 
          />
          
          {/* Integrated 'F' Bar */}
          <path 
            d="M 32 58 L 54 58 L 54 52 L 32 52 Z" 
            fill="url(#logoSilver)" 
          />

          {/* Integrated 'X' Symbol */}
          <path 
            d="M 46 82 L 56 68 L 66 82 L 76 82 L 62 62 L 78 62 L 78 70 L 68 82 Z" 
            fill="url(#logoSilver)" 
            opacity="0.3"
          />
          
          {/* The Blue 'X' Accent */}
          <path 
            d="M 45 82 L 58 64 L 71 82 H 58 L 52 74 L 46 82 Z" 
            fill="url(#logoBlue)" 
          />
        </g>
      </svg>
    </div>

    <div className="flex items-baseline gap-1 pt-1">
      <span className="text-2xl font-light tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-300 to-slate-500 uppercase font-sans leading-none">
        ARC
      </span>
      <span className="text-2xl font-bold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-blue-300 via-blue-500 to-blue-800 uppercase font-sans leading-none">
        FX
      </span>
    </div>
  </div>
);

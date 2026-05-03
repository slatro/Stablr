import React from 'react';

export const Logo = () => (
  <div className="flex items-center gap-4 group cursor-pointer">
    {/* The Latest Original Logo Image */}
    <div className="shrink-0 transition-all duration-500 group-hover:scale-105">
      <img 
        src="/assets/logo-v3.png" 
        alt="ArcFX Logo"
        className="w-[48px] h-[48px] object-contain mix-blend-screen brightness-110 contrast-125"
        style={{ 
          filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.5))'
        }}
      />
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

import React from 'react';

export const Logo = () => (
  <div className="flex items-center gap-4 group cursor-pointer">
    {/* The ABSOLUTE REAL Logo Image (Now with surgical background removal) */}
    <div className="relative w-[56px] h-[56px] flex items-center justify-center shrink-0">
      <img 
        src="/assets/logo-real-final.jpg" 
        alt="ArcFX Logo"
        className="w-full h-full object-contain mix-blend-screen"
        style={{ 
          filter: 'contrast(1.6) brightness(0.85) saturate(1.1)',
          maskImage: 'radial-gradient(circle, black 60%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 95%)'
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

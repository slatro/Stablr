import React from 'react';

export const Logo = () => (
  <div className="flex items-center gap-3 md:gap-4 group cursor-pointer shrink-0">
    {/* The ABSOLUTE REAL Logo Image */}
    <div className="relative w-[44px] h-[44px] md:w-[56px] md:h-[56px] flex items-center justify-center shrink-0">
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

    <div className="flex items-baseline gap-1 pt-1 whitespace-nowrap">
      <span 
        className="text-xl md:text-2xl font-light tracking-[0.25em] uppercase font-sans leading-none"
        style={{
          background: 'linear-gradient(to bottom, #ffffff, #94a3b8, #64748b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        ARC
      </span>
      <span 
        className="text-xl md:text-2xl font-bold tracking-[0.15em] uppercase font-sans leading-none"
        style={{
          background: 'linear-gradient(to bottom, #93c5fd, #3b82f6, #1e40af)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        FX
      </span>
    </div>
  </div>
);

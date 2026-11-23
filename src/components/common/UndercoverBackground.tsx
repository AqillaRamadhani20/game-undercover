import React from 'react';

interface UndercoverBackgroundProps {
  opacity?: number; // 0 to 1
  showStars?: boolean;
}

export const UndercoverBackground: React.FC<UndercoverBackgroundProps> = ({
  opacity = 0.45,
  showStars = true,
}) => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-300"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* 1. Deep Midnight Base Canvas with Nocturnal Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050914] via-[#081022] to-[#03060D]" />

      {/* 2. Soft Pulsing Cyan & Teal Aurora Glows */}
      <div 
        className="absolute left-1/2 bottom-[24%] -translate-x-1/2 w-[180%] max-w-4xl h-[420px] rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.45) 0%, rgba(20, 184, 166, 0.32) 35%, rgba(14, 116, 144, 0.18) 60%, rgba(3, 6, 13, 0) 80%)',
          animationDuration: '6s',
        }}
      />
      <div 
        className="absolute left-1/3 bottom-[30%] -translate-x-1/2 w-[120%] max-w-2xl h-80 rounded-full blur-3xl pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.3) 0%, rgba(6, 182, 212, 0.2) 40%, rgba(3, 6, 13, 0) 75%)',
        }}
      />

      {/* 3. Starry Constellation Night Sky with Glowing Stars */}
      {showStars && (
        <svg className="absolute inset-0 w-full h-[70%] opacity-85" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle Star Grid */}
          <circle cx="8%" cy="12%" r="1" fill="#FFFFFF" opacity="0.8" />
          <circle cx="16%" cy="28%" r="1.5" fill="#E2E8F0" opacity="0.9" />
          <circle cx="24%" cy="8%" r="1.2" fill="#38BDF8" opacity="0.85" />
          <circle cx="36%" cy="18%" r="1.8" fill="#FFFFFF" opacity="0.95" />
          <circle cx="48%" cy="9%" r="1" fill="#FFFFFF" opacity="0.75" />
          <circle cx="58%" cy="22%" r="1.4" fill="#38BDF8" opacity="0.8" />
          <circle cx="68%" cy="11%" r="1.6" fill="#E2E8F0" opacity="0.9" />
          <circle cx="82%" cy="16%" r="1.2" fill="#FFFFFF" opacity="0.85" />
          <circle cx="92%" cy="10%" r="1.5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="12%" cy="42%" r="1.2" fill="#94A3B8" opacity="0.7" />
          <circle cx="28%" cy="38%" r="1.4" fill="#CBD5E1" opacity="0.75" />
          <circle cx="42%" cy="48%" r="1" fill="#FFFFFF" opacity="0.8" />
          <circle cx="62%" cy="40%" r="1.5" fill="#E2E8F0" opacity="0.85" />
          <circle cx="76%" cy="34%" r="1.2" fill="#38BDF8" opacity="0.8" />
          <circle cx="88%" cy="44%" r="1" fill="#FFFFFF" opacity="0.7" />

          {/* Glowing Cross Stars (Shining Highlights) */}
          <g transform="translate(140, 48) scale(0.8)" opacity="0.9">
            <path d="M0 -6 L0 6 M-6 0 L6 0" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />
          </g>
          <g transform="translate(280, 80) scale(0.6)" opacity="0.85">
            <path d="M0 -6 L0 6 M-6 0 L6 0" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />
          </g>
          <g transform="translate(60, 110) scale(0.55)" opacity="0.8">
            <path d="M0 -6 L0 6 M-6 0 L6 0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />
          </g>
        </svg>
      )}

      {/* 4. Distant Mountain Silhouette (Midground Ridge with Subtle Rim Glow) */}
      <svg 
        viewBox="0 0 1000 450" 
        preserveAspectRatio="none"
        className="absolute bottom-16 w-full h-72 opacity-70"
      >
        <path
          d="M 0 450 L 0 280 Q 120 250, 240 270 T 420 220 Q 500 130, 560 210 T 740 260 Q 860 220, 1000 270 L 1000 450 Z"
          fill="#0C1426"
        />
        {/* Soft mountain peak rim light */}
        <path
          d="M 420 220 Q 500 130, 560 210"
          stroke="rgba(56, 189, 248, 0.35)"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* 5. Majestic Undercover Mountain Peak Silhouette */}
      <svg 
        viewBox="0 0 1000 500" 
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-88 opacity-95"
      >
        {/* Sharp silhouette with ridge highlights */}
        <path
          d="M 0 500 L 0 350 L 120 340 L 260 310 L 350 250 L 440 210 L 485 145 L 500 130 L 515 145 L 560 210 L 650 250 L 740 310 L 880 340 L 1000 350 L 1000 500 Z"
          fill="#070C1B"
        />
        <path
          d="M 440 210 L 485 145 L 500 130 L 515 145 L 560 210"
          stroke="rgba(45, 212, 191, 0.4)"
          strokeWidth="2"
          fill="none"
        />
        {/* Foreground rolling dark hills */}
        <path
          d="M 0 500 L 0 385 Q 200 345, 360 365 Q 500 325, 640 365 Q 820 335, 1000 380 L 1000 500 Z"
          fill="#040711"
        />
      </svg>

      {/* 6. Deep Vignette Frame for Edge Contrast */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 45%, transparent 40%, rgba(3, 6, 13, 0.65) 90%)',
      }} />

      {/* 7. Bottom Dark Fog Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#03060D] via-[#050914]/80 to-transparent" />
    </div>
  );
};

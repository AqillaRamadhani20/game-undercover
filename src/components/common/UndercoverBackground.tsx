import React from 'react';

interface UndercoverBackgroundProps {
  opacity?: number; // 0 to 1
  showStars?: boolean;
}

export const UndercoverBackground: React.FC<UndercoverBackgroundProps> = ({
  opacity = 0.35,
  showStars = true,
}) => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-300"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* 1. Deep Midnight Base Canvas */}
      <div className="absolute inset-0 bg-[#070B16]" />

      {/* 2. Soft Horizon Cyan-Teal Aurora Glow (Behind the Mountain Peak) */}
      <div 
        className="absolute left-1/2 bottom-[22%] -translate-x-1/2 w-[160%] max-w-3xl h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.42) 0%, rgba(20, 184, 166, 0.30) 35%, rgba(14, 116, 144, 0.15) 60%, rgba(7, 11, 22, 0) 80%)',
        }}
      />

      {/* 3. Subtle Twinkling Stars in Night Sky */}
      {showStars && (
        <svg className="absolute inset-0 w-full h-[65%] opacity-70" xmlns="http://www.w3.org/2000/svg">
          {/* Static and subtle twinkling star field */}
          <circle cx="12%" cy="14%" r="1" fill="#FFFFFF" opacity="0.8" />
          <circle cx="28%" cy="22%" r="1.5" fill="#E2E8F0" opacity="0.9" />
          <circle cx="45%" cy="10%" r="1" fill="#FFFFFF" opacity="0.7" />
          <circle cx="68%" cy="18%" r="1.2" fill="#E2E8F0" opacity="0.85" />
          <circle cx="85%" cy="12%" r="1" fill="#FFFFFF" opacity="0.75" />
          <circle cx="18%" cy="35%" r="1" fill="#94A3B8" opacity="0.6" />
          <circle cx="38%" cy="40%" r="1.2" fill="#FFFFFF" opacity="0.8" />
          <circle cx="60%" cy="32%" r="1.5" fill="#E2E8F0" opacity="0.9" />
          <circle cx="78%" cy="42%" r="1" fill="#94A3B8" opacity="0.65" />
          <circle cx="92%" cy="28%" r="1" fill="#FFFFFF" opacity="0.7" />
          <circle cx="8%" cy="50%" r="1.2" fill="#CBD5E1" opacity="0.75" />
          <circle cx="52%" cy="25%" r="1" fill="#FFFFFF" opacity="0.85" />
          <circle cx="72%" cy="8%" r="1" fill="#FFFFFF" opacity="0.7" />
          <circle cx="32%" cy="8%" r="1.2" fill="#E2E8F0" opacity="0.8" />
          <circle cx="88%" cy="52%" r="1" fill="#94A3B8" opacity="0.6" />
        </svg>
      )}

      {/* 4. Distant Mountain Silhouette (Midground Ridge) */}
      <svg 
        viewBox="0 0 1000 450" 
        preserveAspectRatio="none"
        className="absolute bottom-16 w-full h-72 opacity-65"
      >
        <path
          d="M 0 450 L 0 280 Q 120 250, 240 270 T 420 220 Q 500 130, 560 210 T 740 260 Q 860 220, 1000 270 L 1000 450 Z"
          fill="#0D1527"
        />
      </svg>

      {/* 5. Majestic Solitary Mountain Peak Silhouette (Authentic Undercover Peak) */}
      <svg 
        viewBox="0 0 1000 500" 
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-84 opacity-95"
      >
        {/* Soft edge ambient ridge line */}
        <path
          d="M 0 500 L 0 350 L 120 340 L 260 310 L 350 250 L 440 210 L 485 145 L 500 130 L 515 145 L 560 210 L 650 250 L 740 310 L 880 340 L 1000 350 L 1000 500 Z"
          fill="#080E1E"
        />
        {/* Foreground rolling dark hills */}
        <path
          d="M 0 500 L 0 385 Q 200 345, 360 365 Q 500 325, 640 365 Q 820 335, 1000 380 L 1000 500 Z"
          fill="#050811"
        />
      </svg>

      {/* 6. Bottom Vignette Soft Dimmer */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070B16] to-transparent opacity-80" />
    </div>
  );
};

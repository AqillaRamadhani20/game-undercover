import React from 'react';

// Boy Silhouette with '?' inside head
export const BoyCardSilhouette: React.FC<{ className?: string }> = ({ className = "w-16 h-20 text-white" }) => (
  <svg viewBox="0 0 100 120" fill="currentColor" className={className}>
    {/* Boy head with spiky hair and neck */}
    <path d="M 50 15 C 38 15, 30 22, 26 28 C 22 25, 17 29, 19 36 C 14 38, 15 46, 21 47 C 19 55, 23 62, 28 66 C 29 74, 34 80, 42 82 L 40 98 L 60 98 L 58 82 C 66 80, 71 74, 72 66 C 77 62, 81 55, 79 47 C 85 46, 86 38, 81 36 C 83 29, 78 25, 74 28 C 70 22, 62 15, 50 15 Z" />
    {/* Shoulder baseline */}
    <path d="M 25 106 C 25 102, 35 98, 50 98 C 65 98, 75 102, 75 106 L 82 115 L 18 115 Z" />
    {/* Question mark in the center of face */}
    <text
      x="50"
      y="58"
      fontSize="26"
      fontWeight="900"
      fontFamily="sans-serif"
      textAnchor="middle"
      fill="#F59E0B"
    >
      ?
    </text>
  </svg>
);

// Girl Silhouette with '?' inside head
export const GirlCardSilhouette: React.FC<{ className?: string }> = ({ className = "w-16 h-20 text-white" }) => (
  <svg viewBox="0 0 100 120" fill="currentColor" className={className}>
    {/* Girl head with bob/shoulder hair */}
    <path d="M 50 14 C 36 14, 25 24, 23 38 C 21 45, 19 55, 19 65 C 22 72, 28 75, 33 73 C 35 77, 40 80, 46 81 L 44 98 L 56 98 L 54 81 C 60 80, 65 77, 67 73 C 72 75, 78 72, 81 65 C 81 55, 79 45, 77 38 C 75 24, 64 14, 50 14 Z" />
    {/* Shoulder baseline */}
    <path d="M 25 106 C 25 102, 35 98, 50 98 C 65 98, 75 102, 75 106 L 82 115 L 18 115 Z" />
    {/* Question mark in the center of face */}
    <text
      x="50"
      y="54"
      fontSize="26"
      fontWeight="900"
      fontFamily="sans-serif"
      textAnchor="middle"
      fill="#F59E0B"
    >
      ?
    </text>
  </svg>
);

// Cartoon Boy Avatar Face for Slider Thumb
export const SliderBoyThumb: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" className={className}>
    {/* Hair */}
    <path d="M 14 26 C 12 16, 22 8, 32 8 C 44 8, 52 16, 50 26 C 54 28, 55 35, 50 38 C 48 45, 42 50, 32 50 C 22 50, 16 45, 14 38 C 9 35, 10 28, 14 26 Z" fill="#6D4C41" />
    {/* Face */}
    <path d="M 18 28 C 18 22, 24 18, 32 18 C 40 18, 46 22, 46 28 C 48 35, 44 46, 32 46 C 20 46, 16 35, 18 28 Z" fill="#FFCC80" />
    {/* Hair fringe */}
    <path d="M 16 22 Q 24 26, 32 18 Q 40 26, 48 22 Q 44 14, 32 12 Q 20 14, 16 22 Z" fill="#5D4037" />
    {/* Eyes */}
    <ellipse cx="26" cy="30" rx="2.5" ry="3.5" fill="#212121" />
    <ellipse cx="38" cy="30" rx="2.5" ry="3.5" fill="#212121" />
    <circle cx="27" cy="29" r="1" fill="#FFFFFF" />
    <circle cx="39" cy="29" r="1" fill="#FFFFFF" />
    {/* Smile */}
    <path d="M 28 38 Q 32 42, 36 38" stroke="#D84315" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

// Infiltrator Fedora Hat (Silhouette)
export const InfiltratorHat: React.FC<{ isWhite?: boolean; className?: string }> = ({
  isWhite = false,
  className = "w-5 h-5",
}) => (
  <svg viewBox="0 0 24 24" fill={isWhite ? "#FFFFFF" : "#18181B"} className={className}>
    {/* Hat brim */}
    <path d="M 2 17 C 2 15, 6 14, 12 14 C 18 14, 22 15, 22 17 C 22 18, 18 19, 12 19 C 6 19, 2 18, 2 17 Z" />
    {/* Hat crown with crease */}
    <path d="M 6 14 L 7 7 C 8 5, 11 6, 12 5 C 13 6, 16 5, 17 7 L 18 14 Z" />
    {/* Silhouette face suggestion */}
    <path d="M 8 18 C 8 21, 10 22, 12 22 C 14 22, 16 21, 16 18 Z" opacity={isWhite ? "0.9" : "1"} />
  </svg>
);

// Special Role Silhouette Icons
export const JesterSilhouette: React.FC<{ className?: string; active?: boolean }> = ({ className = "w-6 h-6", active = false }) => (
  <svg viewBox="0 0 24 24" fill={active ? "#F59E0B" : "currentColor"} className={className}>
    {/* Jester cap with bells */}
    <circle cx="6" cy="5" r="1.5" />
    <circle cx="18" cy="5" r="1.5" />
    <circle cx="12" cy="2" r="1.5" />
    <path d="M 6 6 Q 9 9, 12 6 Q 15 9, 18 6 L 16 12 L 8 12 Z" />
    <circle cx="12" cy="14" r="3" />
    <path d="M 8 18 C 8 16, 10 15, 12 15 C 14 15, 16 16, 16 18 L 18 22 L 6 22 Z" />
  </svg>
);

export const LoversSilhouette: React.FC<{ className?: string; active?: boolean }> = ({ className = "w-6 h-6", active = false }) => (
  <svg viewBox="0 0 24 24" fill={active ? "#F43F5E" : "currentColor"} className={className}>
    {/* Heart with 2 heads */}
    <path d="M 12 21.35 L 10.55 20.03 C 5.4 15.36, 2 12.28, 2 8.5 C 2 5.42, 4.42, 3, 7.5, 3 C 9.24 3, 10.91 3.81, 12 5.09 C 13.09 3.81, 14.76 3, 16.5 3 C 19.58 3, 22 5.42, 22 8.5 C 22 12.28, 18.6 15.36, 13.45 20.04 L 12 21.35 Z" />
  </svg>
);

export const GoddessSilhouette: React.FC<{ className?: string; active?: boolean }> = ({ className = "w-6 h-6", active = false }) => (
  <svg viewBox="0 0 24 24" fill={active ? "#A855F7" : "currentColor"} className={className}>
    {/* Scales of justice */}
    <path d="M 12 2 L 12 20 M 6 20 L 18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M 4 7 L 20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M 4 7 L 1 12 C 1 14, 7 14, 7 12 Z" />
    <path d="M 20 7 L 17 12 C 17 14, 23 14, 23 12 Z" />
  </svg>
);

export const RevengerSilhouette: React.FC<{ className?: string; active?: boolean }> = ({ className = "w-6 h-6", active = false }) => (
  <svg viewBox="0 0 24 24" fill={active ? "#EF4444" : "currentColor"} className={className}>
    {/* Sword */}
    <path d="M 19 3 L 21 5 L 10 16 L 8 16 L 8 14 Z" />
    <path d="M 5 19 L 8 16 L 6 14 L 3 17 Z" />
    <path d="M 2 21 L 4 21 L 5 20 L 3 18 L 2 19 Z" />
  </svg>
);

export const MemeSilhouette: React.FC<{ className?: string; active?: boolean }> = ({ className = "w-6 h-6", active = false }) => (
  <svg viewBox="0 0 24 24" fill={active ? "#06B6D4" : "currentColor"} className={className}>
    {/* Finger on lips mime silence */}
    <circle cx="12" cy="8" r="5" />
    <path d="M 11 11 L 11 20 L 13 20 L 13 11 Z" />
    <path d="M 6 21 C 6 17, 9 15, 12 15 C 15 15, 18 17, 18 21 Z" opacity="0.6" />
  </svg>
);

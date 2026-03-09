"use client";

interface GeometricBorderProps {
  className?: string;
  opacity?: number;
}

export function GeometricPattern({ className = "", opacity = 0.08 }: GeometricBorderProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="zellij" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          {/* 8-point star: two overlapping squares rotated 45° */}
          <g fill="none" stroke="#1F3C88" strokeWidth="1">
            <polygon points="60,8 112,60 60,112 8,60" />
            <rect x="22" y="22" width="76" height="76" />
          </g>
          <circle cx="60" cy="60" r="7" fill="none" stroke="#C99A2E" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#zellij)" />
    </svg>
  );
}

export function GeometricDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 bg-[#C99A2E] opacity-25" style={{ height: 2 }} />
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* 8-point star: diamond + square overlay */}
        <polygon points="16,2 30,16 16,30 2,16" fill="#C99A2E" fillOpacity="0.45" />
        <rect x="7" y="7" width="18" height="18" fill="#C99A2E" fillOpacity="0.45" />
        <polygon
          points="16,2 30,16 16,30 2,16"
          fill="none"
          stroke="#C99A2E"
          strokeWidth="1"
          strokeOpacity="0.8"
        />
      </svg>
      <div className="flex-1 bg-[#C99A2E] opacity-25" style={{ height: 2 }} />
    </div>
  );
}

export function IslamicArch({ className = "" }: { className?: string }) {
  return (
    <svg
      width="80"
      height="40"
      viewBox="0 0 80 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Double ogival arch */}
      <path
        d="M8,40 L8,22 Q8,4 24,4 Q40,4 40,22 L40,40"
        stroke="#C99A2E"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M40,40 L40,22 Q40,4 56,4 Q72,4 72,22 L72,40"
        stroke="#C99A2E"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      {/* Diamond at apex */}
      <polygon points="40,0 44,4 40,8 36,4" fill="#C99A2E" opacity="0.55" />
    </svg>
  );
}

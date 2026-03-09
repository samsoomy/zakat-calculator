"use client";

import { useEffect, useState } from "react";

interface ZakatRingProps {
  amount: number;
  effectiveWealth: number;
  nisabValue: number;
  isObligatory: boolean;
}

const CIRCUMFERENCE = 502.65;

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function ZakatRing({ amount, effectiveWealth, nisabValue, isObligatory }: ZakatRingProps) {
  const [animate, setAnimate] = useState(false);

  // Below nisab: fill shows progress toward threshold (0 → nisab = 0% → 100%)
  // Above nisab: fill shows wealth relative to 4× nisab (nisab → 4×nisab = 25% → 100%)
  const fillRatio = nisabValue > 0
    ? isObligatory
      ? Math.min(0.25 + (effectiveWealth - nisabValue) / (nisabValue * 3) * 0.75, 1)
      : Math.min(effectiveWealth / nisabValue, 1) * 0.25
    : 0;
  const targetOffset = CIRCUMFERENCE * (1 - fillRatio);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center py-4">
      {/* Islamic arch decoration */}
      <svg
        width="80"
        height="40"
        viewBox="0 0 80 40"
        fill="none"
        aria-hidden="true"
        style={{ marginBottom: 8 }}
      >
        <path
          d="M8,40 L8,22 Q8,4 24,4 Q40,4 40,22 L40,40"
          stroke="#C99A2E"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M40,40 L40,22 Q40,4 56,4 Q72,4 72,22 L72,40"
          stroke="#C99A2E"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <polygon points="40,0 44,4 40,8 36,4" fill="#C99A2E" opacity="0.6" />
      </svg>

      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(58,42,34,0.5)",
          marginBottom: 12,
        }}
      >
        Zakat Due
      </div>

      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        aria-label={`Zakat due: ${fmt(amount)}`}
      >
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1F3C88" />
            <stop offset="100%" stopColor="#2FAFA3" />
          </linearGradient>
        </defs>

        {/* Outer decorative dashed ring */}
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="#C99A2E"
          strokeWidth="1"
          strokeDasharray="4 6"
          opacity="0.3"
        />

        {/* Background track */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#1F3C88"
          strokeWidth="12"
          strokeOpacity="0.08"
          transform="rotate(-90 100 100)"
        />

        {/* Nisab marker tick at 25% (= exactly at nisab) */}
        {nisabValue > 0 && (
          <line
            x1="100"
            y1="12"
            x2="100"
            y2="22"
            stroke="#C99A2E"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
            style={{ transform: "rotate(-90deg)", transformOrigin: "100px 100px" }}
          />
        )}

        {/* Progress arc */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={isObligatory ? "url(#ringGradient)" : "#C99A2E"}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={animate ? targetOffset : CIRCUMFERENCE}
          strokeOpacity={isObligatory ? 1 : 0.5}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "100px 100px",
            transition: animate ? "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)" : "none",
          }}
        />

        {/* Center text */}
        {isObligatory ? (
          <>
            <text
              x="100"
              y="86"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#1F3C88"
              fontSize="22"
              fontWeight="700"
              fontFamily="var(--font-poppins), system-ui"
            >
              {fmt(amount)}
            </text>
            <text
              x="100"
              y="108"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#3A2A22"
              fontSize="10"
              opacity="0.5"
              fontFamily="var(--font-poppins), system-ui"
            >
              2.5% of {fmt(effectiveWealth)}
            </text>
            <text
              x="100"
              y="122"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#2FAFA3"
              fontSize="10"
              fontWeight="600"
              opacity="0.8"
              fontFamily="var(--font-poppins), system-ui"
            >
              {(effectiveWealth / nisabValue).toFixed(1)}× nisab
            </text>
          </>
        ) : (
          <>
            <text
              x="100"
              y="90"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#8C3D2E"
              fontSize="12"
              fontWeight="600"
              fontFamily="var(--font-poppins), system-ui"
            >
              Not obligatory
            </text>
            <text
              x="100"
              y="110"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#3A2A22"
              fontSize="10"
              opacity="0.5"
              fontFamily="var(--font-poppins), system-ui"
            >
              {nisabValue > 0
                ? `${fmt(nisabValue - effectiveWealth)} below nisab`
                : "Below threshold"}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

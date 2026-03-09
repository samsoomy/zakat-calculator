"use client";

interface PageNavProps {
  onBack: () => void;
  right?: React.ReactNode;
}

export function PageNav({ onBack, right }: PageNavProps) {
  return (
    <div
      className="w-full sticky top-0 z-50"
      style={{
        borderBottom: "1px solid rgba(201,154,46,0.2)",
        background: "rgba(247,244,236,0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        willChange: "transform",
      }}
    >
      <div
        className="relative flex items-center justify-between"
        style={{ maxWidth: 720, margin: "0 auto", padding: "14px 24px" }}
      >
        {/* Left: back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-[#1F3C88] hover:opacity-60 transition-opacity z-10"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>

        {/* Center: brand — absolutely centered */}
        <span
          className="font-bold text-[#1F3C88] text-lg tracking-tight pointer-events-none select-none"
          style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}
        >
          زكاة{" "}
          <span style={{ color: "#C99A2E", fontSize: "0.6em", verticalAlign: "middle" }}>◆</span>{" "}
          Zakat
        </span>

        {/* Right: step dots or label */}
        <div className="z-10">{right ?? null}</div>
      </div>
    </div>
  );
}

export function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
      {/* Connecting line behind dots */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 3,
          right: 3,
          height: 1,
          background: "rgba(201,154,46,0.2)",
          transform: "translateY(-50%)",
          zIndex: 0,
        }}
      />
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 6,
            width: i === current ? 20 : 6,
            borderRadius: 999,
            transition: "width 0.25s ease, background 0.25s ease",
            background:
              i === current
                ? "#C99A2E"
                : i < current
                ? "rgba(201,154,46,0.45)"
                : "rgba(201,154,46,0.18)",
            position: "relative",
            zIndex: 1,
          }}
        />
      ))}
    </div>
  );
}

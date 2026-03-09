"use client";

import { NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS } from "@/lib/zakat";
import type { MetalPrices } from "@/lib/metals";

interface NisabBadgeProps {
  method: "gold" | "silver";
  metalPrices: MetalPrices | null;
}

export function NisabBadge({ method, metalPrices }: NisabBadgeProps) {
  if (!metalPrices) {
    return (
      <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#1F3C88]/10 text-[#1F3C88]">
        Loading prices...
      </span>
    );
  }

  const value =
    method === "gold"
      ? NISAB_GOLD_GRAMS * metalPrices.goldPerGram
      : NISAB_SILVER_GRAMS * metalPrices.silverPerGram;

  return (
    <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#C99A2E]/15 text-[#1F3C88] border border-[#C99A2E]/30 font-medium">
      Nisab threshold:{" "}
      {value.toLocaleString("en-US", { style: "currency", currency: "USD" })}
    </span>
  );
}

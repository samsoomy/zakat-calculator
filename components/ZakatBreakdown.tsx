"use client";

import type { AssetBreakdown } from "@/lib/zakat";
import { calculateZakat, getNisabValue } from "@/lib/zakat";
import type { MetalPrices } from "@/lib/metals";
import { GeometricDivider } from "./GeometricBorder";
import { ZakatRing } from "./ZakatRing";

interface ZakatBreakdownProps {
  breakdown: AssetBreakdown;
  metalPrices: MetalPrices;
  nisabMethod: "gold" | "silver";
  hawlMinimum?: number;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function Row({
  label,
  value,
  negative,
  dotColor,
}: {
  label: string;
  value: number;
  negative?: boolean;
  dotColor?: string;
}) {
  if (value === 0) return null;
  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex items-center gap-2">
        {dotColor && (
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: dotColor,
              flexShrink: 0,
            }}
          />
        )}
        <span className="text-[#3A2A22]/70">{label}</span>
      </div>
      <span className={negative ? "text-[#8C3D2E] font-medium" : "font-medium text-[#3A2A22]"}>
        {negative ? "−" : ""}
        {fmt(value)}
      </span>
    </div>
  );
}

export function ZakatBreakdown({
  breakdown,
  metalPrices,
  nisabMethod,
  hawlMinimum,
}: ZakatBreakdownProps) {
  const nisabValue = getNisabValue(metalPrices, nisabMethod);
  const meetsNisab = breakdown.total >= nisabValue;
  // Hawl is only complete if wealth never dipped below nisab during the year
  const hawlNisabMaintained = hawlMinimum === undefined || hawlMinimum >= nisabValue;
  const isZakatDue = meetsNisab && hawlNisabMaintained;
  const effectiveWealth =
    hawlMinimum !== undefined ? Math.min(hawlMinimum, breakdown.total) : breakdown.total;
  const zakatFromHawl = isZakatDue ? calculateZakat(effectiveWealth) : 0;

  return (
    <div className="space-y-6">
      {/* Zakat Ring */}
      <div className="card-elevated">
        <ZakatRing
          amount={zakatFromHawl}
          effectiveWealth={effectiveWealth}
          nisabValue={nisabValue}
          isObligatory={isZakatDue}
        />
      </div>

      {/* Breakdown */}
      <div className="card-elevated">
        <h3 className="font-semibold text-[#1F3C88] mb-3">Zakatable Wealth Breakdown</h3>
        <div className="divide-y divide-[#C99A2E]/10">
          <Row label="Cash & Savings" value={breakdown.cashAndSavings} dotColor="#1F3C88" />
          <Row label="Investments" value={breakdown.investments} dotColor="#2FAFA3" />
          <Row label="Gold & Silver" value={breakdown.goldSilverValue} dotColor="#C99A2E" />
          <Row label="Other Assets" value={breakdown.manualAssets} dotColor="#3A2A22" />
          <Row label="Outstanding Debts" value={breakdown.debts} negative dotColor="#8C3D2E" />
        </div>
        <GeometricDivider className="my-3" />
        <div className="flex justify-between items-center font-semibold text-[#1F3C88]">
          <span>Total Zakatable Wealth</span>
          <span>{fmt(breakdown.total)}</span>
        </div>
      </div>

      {/* Nisab check */}
      <div
        className={`card border-2 ${
          meetsNisab ? "border-[#2FAFA3]/40 bg-[#2FAFA3]/5" : "border-[#8C3D2E]/30 bg-[#8C3D2E]/5"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{meetsNisab ? "✓" : "✕"}</span>
          <span className="font-semibold text-[#3A2A22]">
            {meetsNisab ? "Nisab threshold met" : "Below nisab threshold"}
          </span>
        </div>
        <p className="text-sm text-[#3A2A22]/70">
          {nisabMethod === "gold" ? "Gold" : "Silver"} nisab: {fmt(nisabValue)}.{" "}
          {meetsNisab
            ? `Your wealth exceeds nisab by ${fmt(breakdown.total - nisabValue)}.`
            : "Zakat is not obligatory this year."}
        </p>
      </div>

      {/* Hawl note */}
      {hawlMinimum !== undefined && !hawlNisabMaintained && (
        <div className="card border-2 border-[#8C3D2E]/30 bg-[#8C3D2E]/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">✕</span>
            <span className="font-semibold text-[#3A2A22]">Hawl broken</span>
          </div>
          <p className="text-sm text-[#3A2A22]/70">
            Your wealth dropped below the nisab threshold ({fmt(nisabValue)}) during the
            year — your minimum was {fmt(hawlMinimum)}. The hawl resets when wealth
            falls below nisab, so zakat is not due for this period.
          </p>
        </div>
      )}
      {hawlMinimum !== undefined && hawlNisabMaintained && hawlMinimum < breakdown.total && (
        <div className="card" style={{ borderLeft: "3px solid var(--gold)" }}>
          <p className="text-sm text-[#3A2A22]/80">
            <strong>Hawl note:</strong> Your minimum wealth over the past lunar year was{" "}
            {fmt(hawlMinimum)}. Zakat is calculated on this lower amount.
          </p>
        </div>
      )}

      <p className="text-xs text-[#3A2A22]/50 text-center">
        This is a guide only. Consult a scholar for your specific situation.
      </p>
    </div>
  );
}

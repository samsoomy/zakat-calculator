"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/components/AppStateProvider";
import { ZakatBreakdown } from "@/components/ZakatBreakdown";
import { GeometricDivider } from "@/components/GeometricBorder";
import { PageNav, StepDots } from "@/components/PageNav";
import {
  aggregateAssets,
  computeHawlMinimum,
  type Account,
  type Holding,
  type Transaction,
  type AssetBreakdown,
} from "@/lib/zakat";
import type { MetalPrices } from "@/lib/metals";

export default function ResultsPage() {
  const router = useRouter();
  const { items, manualAssets, settings, metalPrices, setMetalPrices } = useAppState();
  const [breakdown, setBreakdown] = useState<AssetBreakdown | null>(null);
  const [hawlMinimum, setHawlMinimum] = useState<number | undefined>(undefined);
  const [loadingPrices, setLoadingPrices] = useState(!metalPrices);

  useEffect(() => {
    if (metalPrices) {
      setLoadingPrices(false);
      return;
    }
    fetch("/api/metals/prices")
      .then((r) => r.json())
      .then((p: MetalPrices) => {
        setMetalPrices(p);
        setLoadingPrices(false);
      })
      .catch(() => setLoadingPrices(false));
  }, [metalPrices, setMetalPrices]);

  useEffect(() => {
    if (!metalPrices) return;

    const allAccounts = items.flatMap((item) => item.accounts) as Account[];
    const allHoldings = items.flatMap((item) => item.holdings) as Holding[];
    const allTransactions = items.flatMap((item) => item.transactions) as Transaction[];

    const result = aggregateAssets(
      allAccounts,
      allHoldings,
      manualAssets,
      metalPrices,
      settings.includeRetirement
    );
    setBreakdown(result);

    if (allTransactions.length > 0) {
      // hawlDate is the start of the hawl year; reconstruct minimum total wealth since then
      const hawlStart = new Date(settings.hawlDate);
      const minimum = computeHawlMinimum(allTransactions, result.total, hawlStart);
      setHawlMinimum(minimum);
    }
  }, [metalPrices, items, manualAssets, settings]);

  if (loadingPrices || !breakdown) {
    return (
      <main className="min-h-screen geo-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          {/* Pulsing arch + spinner */}
          <div className="relative flex items-center justify-center" style={{ width: 64, height: 64, margin: "0 auto" }}>
            <svg
              width="64"
              height="32"
              viewBox="0 0 64 32"
              fill="none"
              style={{ position: "absolute", top: 0, left: 0, animation: "pulse 1.8s ease-in-out infinite" }}
              aria-hidden="true"
            >
              <path
                d="M6,32 L6,18 Q6,3 20,3 Q32,3 32,18 L32,32"
                stroke="#1F3C88"
                strokeWidth="2"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M32,32 L32,18 Q32,3 44,3 Q58,3 58,18 L58,32"
                stroke="#1F3C88"
                strokeWidth="2"
                fill="none"
                opacity="0.5"
              />
              <polygon points="32,0 36,3 32,6 28,3" fill="#C99A2E" opacity="0.6" />
            </svg>
            <div
              className="w-8 h-8 border-2 border-[#C99A2E]/30 border-t-[#1F3C88] rounded-full animate-spin"
              style={{ marginTop: 28 }}
            />
          </div>
          <p className="text-[#3A2A22]/60 text-sm">Computing your zakat...</p>
        </div>
      </main>
    );
  }

  if (!metalPrices) {
    return (
      <main className="min-h-screen geo-bg flex items-center justify-center">
        <div className="card text-center max-w-sm">
          <p className="text-[#8C3D2E] text-sm">
            Could not load metal prices. Please check your connection and try again.
          </p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-4 text-sm">
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen geo-bg flex flex-col">
      <PageNav
        onBack={() => router.push("/manual")}
        right={<StepDots current={3} total={4} />}
      />

      <div className="container-main flex-1 py-10 max-w-xl mx-auto w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3C88] mb-1">Your Zakat Calculation</h1>
          <p className="text-[#3A2A22]/60 text-sm">
            Based on {settings.nisabMethod} nisab · Hawl from{" "}
            {new Date(settings.hawlDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <ZakatBreakdown
          breakdown={breakdown}
          metalPrices={metalPrices}
          nisabMethod={settings.nisabMethod}
          hawlMinimum={hawlMinimum}
        />

        <GeometricDivider />

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push("/connect")}
            className="btn-secondary text-sm"
          >
            Recalculate
          </button>
          <button
            onClick={() => {
              const amount = breakdown
                ? (hawlMinimum !== undefined
                    ? Math.min(hawlMinimum, breakdown.total)
                    : breakdown.total) * 0.025
                : 0;
              alert(
                `Your zakat due: ${amount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}\n\nMay Allah accept your zakat.`
              );
            }}
            className="btn-teal text-sm"
          >
            Share Result
          </button>
        </div>
      </div>

      <footer className="border-t border-[#C99A2E]/15 py-6 text-center text-xs text-[#3A2A22]/40">
        This is a guide only. Consult a qualified scholar for your specific situation. · Metal
        prices updated hourly.
      </footer>
    </main>
  );
}

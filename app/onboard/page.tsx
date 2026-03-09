"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/components/AppStateProvider";
import { NisabBadge } from "@/components/NisabBadge";
import { GeometricDivider, IslamicArch } from "@/components/GeometricBorder";
import { PageNav, StepDots } from "@/components/PageNav";
import type { ZakatSettings } from "@/components/AppStateProvider";
import type { MetalPrices } from "@/lib/metals";

const TOTAL_STEPS = 3;

export default function OnboardPage() {
  const router = useRouter();
  const { settings, setSettings, setMetalPrices, metalPrices } = useAppState();
  const [step, setStep] = useState(0);
  const [local, setLocal] = useState<ZakatSettings>(settings);

  useEffect(() => {
    fetch("/api/metals/prices")
      .then((r) => r.json())
      .then((p: MetalPrices) => setMetalPrices(p))
      .catch(() => {});
  }, [setMetalPrices]);

  function next() {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      setSettings(local);
      router.push("/connect");
    }
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
    else router.push("/");
  }

  return (
    <main className="min-h-screen geo-bg flex flex-col">
      <PageNav onBack={back} right={<StepDots current={step} total={TOTAL_STEPS} />} />

      <div className="container-main flex-1 py-10 max-w-xl mx-auto w-full">
        {step === 0 && (
          <StepNisab
            value={local.nisabMethod}
            onChange={(v) => setLocal((p) => ({ ...p, nisabMethod: v }))}
            metalPrices={metalPrices}
          />
        )}
        {step === 1 && (
          <StepHawl
            value={local.hawlDate}
            onChange={(v) => setLocal((p) => ({ ...p, hawlDate: v }))}
          />
        )}
        {step === 2 && (
          <StepRetirement
            value={local.includeRetirement}
            onChange={(v) => setLocal((p) => ({ ...p, includeRetirement: v }))}
          />
        )}

        <GeometricDivider className="my-8" />

        <div className="flex justify-between items-center">
          <span className="text-sm text-[#3A2A22]/50">
            Step {step + 1} of {TOTAL_STEPS}
          </span>
          <button onClick={next} className="btn-primary px-8">
            {step < TOTAL_STEPS - 1 ? "Continue" : "Connect Accounts →"}
          </button>
        </div>
      </div>
    </main>
  );
}

function StepNisab({
  value,
  onChange,
  metalPrices,
}: {
  value: "gold" | "silver";
  onChange: (v: "gold" | "silver") => void;
  metalPrices: MetalPrices | null;
}) {
  const goldNisab = metalPrices
    ? (87.48 * metalPrices.goldPerGram).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    : "Loading...";

  const silverNisab = metalPrices
    ? (612.36 * metalPrices.silverPerGram).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    : "Loading...";

  return (
    <div className="space-y-6">
      <div>
        <IslamicArch className="mb-3" />
        <h1 className="text-2xl font-bold text-[#1F3C88] mb-1">Nisab Method</h1>
        <p className="text-[#3A2A22]/60 text-sm leading-relaxed">
          The nisab is the minimum wealth threshold for zakat to be obligatory.
          Scholars differ on whether to use the gold or silver standard. Gold is more
          common today; silver sets a lower threshold.
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            key: "gold" as const,
            label: "Gold standard",
            sub: "87.48g of gold",
            value: goldNisab,
            note: "Most commonly used today",
          },
          {
            key: "silver" as const,
            label: "Silver standard",
            sub: "612.36g of silver",
            value: silverNisab,
            note: "Lower threshold — more inclusive",
          },
        ].map(({ key, label, sub, value: v, note }) => (
          <label
            key={key}
            className={`radio-card flex items-center justify-between gap-4 ${
              value === key ? "selected" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="nisab"
                value={key}
                checked={value === key}
                onChange={() => onChange(key)}
                className="accent-[#C99A2E]"
              />
              <div>
                <div className="font-medium text-[#3A2A22]">{label}</div>
                <div className="text-xs text-[#3A2A22]/50">{sub} · {note}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-[#1F3C88] text-sm">{v}</div>
              <div className="text-xs text-[#3A2A22]/40">threshold</div>
            </div>
          </label>
        ))}
      </div>

      <NisabBadge method={value} metalPrices={metalPrices} />
    </div>
  );
}

function StepHawl({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F3C88] mb-1">Hawl Date</h1>
        <p className="text-[#3A2A22]/60 text-sm leading-relaxed">
          Zakat is only due on wealth that has been held for a complete lunar year
          (hawl). Enter your zakat anniversary — the date you started tracking your
          wealth. If this is your first time, use today.
        </p>
      </div>

      <div className="card space-y-3">
        <label className="block text-sm font-medium text-[#3A2A22]">
          Your zakat anniversary
        </label>
        <input
          type="date"
          value={value}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-[#C99A2E]/30 rounded-lg px-3 py-2 text-sm bg-white"
          style={{ outline: "none" }}
          onFocus={(e) => (e.target.style.outline = "2px solid var(--royal-blue)")}
          onBlur={(e) => (e.target.style.outline = "none")}
        />
        <p className="text-xs text-[#3A2A22]/50">
          We will pull 13 months of transactions starting from this date to
          determine your minimum balance (hawl minimum).
        </p>
      </div>

      <div className="card border-[#C99A2E]/30 bg-[#C99A2E]/5 text-sm text-[#3A2A22]/70">
        <strong className="text-[#1F3C88]">First time?</strong> Select today — your
        hawl will begin now, and you would calculate zakat next year. However, if you
        already have wealth above nisab, you may still owe for the current year from
        your last anniversary.
      </div>
    </div>
  );
}

function StepRetirement({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <IslamicArch className="mb-3" />
        <h1 className="text-2xl font-bold text-[#1F3C88] mb-1">Retirement Accounts</h1>
        <p className="text-[#3A2A22]/60 text-sm leading-relaxed">
          Scholars differ on whether retirement accounts (401k, IRA, etc.) are zakatable.
          Some hold that only vested, accessible funds are subject to zakat; others
          include the full balance. Choose based on your scholarly reference.
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            v: false,
            label: "Exclude retirement accounts",
            sub: "Funds are not readily accessible — not zakatable (conservative view)",
          },
          {
            v: true,
            label: "Include retirement accounts",
            sub: "Full balance counts as wealth (broader view, more cautious)",
          },
        ].map(({ v, label, sub }) => (
          <label
            key={String(v)}
            className={`radio-card flex items-center gap-3 ${
              value === v ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              name="retirement"
              checked={value === v}
              onChange={() => onChange(v)}
              className="accent-[#C99A2E]"
            />
            <div>
              <div className="font-medium text-[#3A2A22]">{label}</div>
              <div className="text-xs text-[#3A2A22]/50 mt-0.5">{sub}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

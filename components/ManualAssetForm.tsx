"use client";

import { useState } from "react";
import type { ManualAssets } from "@/lib/zakat";
import type { MetalPrices } from "@/lib/metals";

interface ManualAssetFormProps {
  initialValues: ManualAssets;
  metalPrices: MetalPrices | null;
  onChange: (values: ManualAssets) => void;
}

function Field({
  label,
  hint,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[#3A2A22]">{label}</label>
      {hint && <p className="text-xs text-[#3A2A22]/50">{hint}</p>}
      <div className="flex items-center border border-[#C99A2E]/30 rounded-lg overflow-hidden bg-white"
        style={{ transition: "outline 0.1s" }}
        onFocusCapture={(e) => (e.currentTarget.style.outline = "2px solid var(--royal-blue)")}
        onBlurCapture={(e) => (e.currentTarget.style.outline = "none")}
      >
        {prefix && (
          <span className="px-3 text-[#3A2A22]/50 bg-[#F7F4EC] border-r border-[#C99A2E]/20 py-2 text-sm">
            {prefix}
          </span>
        )}
        <input
          type="number"
          min="0"
          step="any"
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
          placeholder="0"
        />
        {suffix && (
          <span className="px-3 text-[#3A2A22]/50 bg-[#F7F4EC] border-l border-[#C99A2E]/20 py-2 text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function ManualAssetForm({ initialValues, metalPrices, onChange }: ManualAssetFormProps) {
  const [values, setValues] = useState<ManualAssets>(initialValues);

  function update(key: keyof ManualAssets, val: number) {
    const next = { ...values, [key]: val };
    setValues(next);
    onChange(next);
  }

  const goldValue = values.goldGrams * (metalPrices?.goldPerGram ?? 0);
  const silverValue = values.silverGrams * (metalPrices?.silverPerGram ?? 0);

  return (
    <div className="space-y-5">
      {/* Precious metals section */}
      <div
        className="rounded-xl p-4 space-y-4"
        style={{ background: "rgba(201,154,46,0.04)", border: "1px solid rgba(201,154,46,0.15)" }}
      >
        <div className="flex items-center gap-2">
          <div
            style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#C99A2E" }}
          />
          <span className="text-xs font-semibold text-[#3A2A22]/60 uppercase tracking-wide">
            Precious Metals
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Field
              label="Gold jewelry / coins"
              hint="Weight in grams"
              value={values.goldGrams}
              onChange={(v) => update("goldGrams", v)}
              suffix="g"
            />
            {goldValue > 0 && metalPrices && (
              <p className="text-xs text-[#2FAFA3]">
                ≈ ${goldValue.toFixed(2)} at ${metalPrices.goldPerGram.toFixed(2)}/g
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Field
              label="Silver jewelry / coins"
              hint="Weight in grams"
              value={values.silverGrams}
              onChange={(v) => update("silverGrams", v)}
              suffix="g"
            />
            {silverValue > 0 && metalPrices && (
              <p className="text-xs text-[#2FAFA3]">
                ≈ ${silverValue.toFixed(2)} at ${metalPrices.silverPerGram.toFixed(2)}/g
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Other assets */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Cash on hand"
          value={values.cashOnHand}
          onChange={(v) => update("cashOnHand", v)}
          prefix="$"
        />

        <Field
          label="Money owed to you"
          hint="Receivables you expect to collect"
          value={values.receivables}
          onChange={(v) => update("receivables", v)}
          prefix="$"
        />

        <Field
          label="Business inventory"
          hint="Goods held for sale at current market value"
          value={values.businessInventory}
          onChange={(v) => update("businessInventory", v)}
          prefix="$"
        />

        <Field
          label="Outstanding debts"
          hint="Debts due within the next year (subtracted)"
          value={values.debts}
          onChange={(v) => update("debts", v)}
          prefix="$"
        />
      </div>
    </div>
  );
}

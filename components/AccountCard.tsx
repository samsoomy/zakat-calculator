"use client";

import type { Account } from "@/lib/zakat";

interface AccountCardProps {
  account: Account;
  onRemove?: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  depository: "#1F3C88",
  investment: "#2FAFA3",
  credit: "#8C3D2E",
  loan: "#8C3D2E",
  other: "#C99A2E",
};

export function AccountCard({ account, onRemove }: AccountCardProps) {
  const balance = account.balances.current ?? account.balances.available ?? 0;
  const barColor = TYPE_COLORS[account.type] ?? "#C99A2E";

  return (
    <div
      className="card flex items-center justify-between gap-4"
      style={{ paddingLeft: 0, overflow: "hidden" }}
    >
      {/* Color bar */}
      <div
        style={{
          width: 10,
          minHeight: 56,
          backgroundColor: barColor,
          borderRadius: "14px 0 0 14px",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      />
      <div className="flex items-center gap-3 flex-1 py-0.5">
        <div>
          <div className="font-medium text-[#3A2A22]">{account.name}</div>
          <div className="text-sm text-[#3A2A22]/60 capitalize">
            {account.institution_name} · {account.subtype || account.type}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 pr-4">
        <div className="text-right">
          <div className="font-semibold text-[#1F3C88]">
            {balance.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
          <div className="text-xs text-[#3A2A22]/50">current balance</div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-[#8C3D2E]/60 hover:text-[#8C3D2E] transition-colors text-sm px-2 py-1 rounded hover:bg-[#8C3D2E]/10"
            aria-label="Remove account"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/components/AppStateProvider";
import { PlaidLinkButton } from "@/components/PlaidLinkButton";
import { AccountCard } from "@/components/AccountCard";
import { GeometricDivider } from "@/components/GeometricBorder";
import type { Account, Holding, Transaction } from "@/lib/zakat";
import { PageNav, StepDots } from "@/components/PageNav";

export default function ConnectPage() {
  const router = useRouter();
  const { items, addItem, removeItem } = useAppState();
  const [error, setError] = useState<string | null>(null);

  function handleSuccess(data: {
    item_id: string;
    accounts: unknown[];
    holdings: unknown[];
    transactions: unknown[];
    institution_name: string;
  }) {
    addItem({
      item_id: data.item_id,
      institution_name: data.institution_name,
      accounts: data.accounts as Account[],
      holdings: data.holdings as Holding[],
      transactions: data.transactions as Transaction[],
    });
    setError(null);
  }

  function handleRemove(item_id: string) {
    removeItem(item_id);
  }

  const allAccounts = items.flatMap((item) =>
    item.accounts.map((a) => ({ ...a, _item_id: item.item_id }))
  );

  return (
    <main className="min-h-screen geo-bg flex flex-col">
      <PageNav
        onBack={() => router.push("/onboard")}
        right={<StepDots current={1} total={4} />}
      />

      <div className="container-main flex-1 py-10 max-w-xl mx-auto w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3D5C] mb-1">Connect Accounts</h1>
          <p className="text-[#1C1C1C]/60 text-sm leading-relaxed">
            Link your bank and investment accounts. Plaid uses read-only access —
            we can never move your money.
          </p>
        </div>

{error && (
          <div className="card border-[#8C3D2E]/30 bg-[#8C3D2E]/5 text-sm text-[#8C3D2E]">
            {error}
          </div>
        )}

        {/* Connected accounts */}
        {items.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[#1C1C1C]/60 uppercase tracking-wider">
              Connected Institutions
            </h2>
            {items.map((item) => (
              <div key={item.item_id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1A3D5C]">
                    {item.institution_name}
                  </span>
                  <button
                    onClick={() => handleRemove(item.item_id)}
                    className="text-xs text-[#8C3D2E]/60 hover:text-[#8C3D2E] transition-colors"
                  >
                    Remove
                  </button>
                </div>
                {item.accounts.map((acct) => (
                  <AccountCard key={acct.account_id} account={acct} />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Add account */}
        <div className="card border-dashed border-2 border-[#C9A227]/30 bg-[#C9A227]/3 text-center py-6 space-y-3">
          <div className="text-[#1C1C1C]/40 text-sm">
            {items.length > 0
              ? "Add another institution"
              : "No accounts connected yet"}
          </div>
          <PlaidLinkButton
            onSuccess={handleSuccess}
            onError={setError}
            label={items.length > 0 ? "Add Another Account" : "Connect Bank Account"}
          />
        </div>

        <div className="card border-[#2C6B5A]/20 bg-[#2C6B5A]/5 text-xs text-[#1C1C1C]/60 leading-relaxed">
          <strong className="text-[#2C6B5A]">Privacy:</strong> We never store balances or
          transactions. Only an encrypted session token is saved, keyed to your anonymous browser
          ID. It auto-expires in 13 months.
        </div>

        <GeometricDivider />

        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push("/manual")}
            className="btn-secondary text-sm"
          >
            Add Manual Assets
          </button>
          <button
            onClick={() => {
              if (items.length === 0) {
                setError("Connect at least one account, or go directly to manual assets.");
                return;
              }
              router.push("/results");
            }}
            className="btn-primary"
            disabled={items.length === 0}
          >
            Calculate Zakat →
          </button>
        </div>

        {items.length === 0 && (
          <div className="text-center">
            <button
              onClick={() => router.push("/manual")}
              className="text-sm text-[#1A3D5C] underline hover:no-underline"
            >
              Skip — enter assets manually instead
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

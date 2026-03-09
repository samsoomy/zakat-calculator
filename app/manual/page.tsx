"use client";

import { useRouter } from "next/navigation";
import { useAppState } from "@/components/AppStateProvider";
import { ManualAssetForm } from "@/components/ManualAssetForm";
import { GeometricDivider } from "@/components/GeometricBorder";
import { PageNav, StepDots } from "@/components/PageNav";

export default function ManualPage() {
  const router = useRouter();
  const { manualAssets, setManualAssets, metalPrices } = useAppState();

  return (
    <main className="min-h-screen geo-bg flex flex-col">
      <PageNav
        onBack={() => router.push("/connect")}
        right={<StepDots current={2} total={4} />}
      />

      <div className="container-main flex-1 py-10 max-w-xl mx-auto w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3D5C] mb-1">Manual Assets</h1>
          <p className="text-[#1C1C1C]/60 text-sm leading-relaxed">
            Add assets that Plaid cannot see — physical gold, cash on hand, money owed
            to you, business inventory, and debts. All fields are optional.
          </p>
        </div>

        <div className="card">
          <ManualAssetForm
            initialValues={manualAssets}
            metalPrices={metalPrices}
            onChange={setManualAssets}
          />
        </div>

        <GeometricDivider />

        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push("/results")}
            className="btn-secondary text-sm"
          >
            Skip
          </button>
          <button
            onClick={() => router.push("/results")}
            className="btn-primary"
          >
            Calculate Zakat →
          </button>
        </div>
      </div>
    </main>
  );
}

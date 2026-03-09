"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Account, Holding, Transaction, ManualAssets } from "@/lib/zakat";
import type { MetalPrices } from "@/lib/metals";

export interface ConnectedItem {
  item_id: string;
  institution_name: string;
  accounts: Account[];
  holdings: Holding[];
  transactions: Transaction[];
}

export interface ZakatSettings {
  nisabMethod: "gold" | "silver";
  hawlDate: string; // ISO date string
  includeRetirement: boolean;
}

interface AppState {
  settings: ZakatSettings;
  items: ConnectedItem[];
  manualAssets: ManualAssets;
  metalPrices: MetalPrices | null;
  setSettings: (s: ZakatSettings) => void;
  addItem: (item: ConnectedItem) => void;
  removeItem: (item_id: string) => void;
  setManualAssets: (m: ManualAssets) => void;
  setMetalPrices: (p: MetalPrices) => void;
}

const defaultManual: ManualAssets = {
  goldGrams: 0,
  silverGrams: 0,
  cashOnHand: 0,
  receivables: 0,
  businessInventory: 0,
  debts: 0,
};

const defaultSettings: ZakatSettings = {
  nisabMethod: "gold",
  hawlDate: new Date().toISOString().split("T")[0],
  includeRetirement: false,
};

const AppContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ZakatSettings>(defaultSettings);
  const [items, setItems] = useState<ConnectedItem[]>([]);
  const [manualAssets, setManualAssets] = useState<ManualAssets>(defaultManual);
  const [metalPrices, setMetalPrices] = useState<MetalPrices | null>(null);

  function addItem(item: ConnectedItem) {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.item_id !== item.item_id);
      return [...filtered, item];
    });
  }

  function removeItem(item_id: string) {
    setItems((prev) => prev.filter((i) => i.item_id !== item_id));
  }

  return (
    <AppContext.Provider
      value={{
        settings,
        items,
        manualAssets,
        metalPrices,
        setSettings,
        addItem,
        removeItem,
        setManualAssets,
        setMetalPrices,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

import type { MetalPrices } from "./metals";

export interface Transaction {
  date: string;
  amount: number; // positive = debit, negative = credit in Plaid convention
}

export interface ManualAssets {
  goldGrams: number;
  silverGrams: number;
  cashOnHand: number;
  receivables: number;
  businessInventory: number;
  debts: number;
}

export interface Account {
  account_id: string;
  name: string;
  type: string;
  subtype: string;
  balances: {
    current: number | null;
    available: number | null;
  };
  institution_name?: string;
}

export interface Holding {
  account_id: string;
  security_id: string;
  quantity: number;
  institution_value: number | null;
}

export interface AssetBreakdown {
  cashAndSavings: number;
  investments: number;
  manualAssets: number;
  goldSilverValue: number;
  debts: number;
  total: number;
}

// NISAB thresholds (grams)
export const NISAB_GOLD_GRAMS = 87.48;
export const NISAB_SILVER_GRAMS = 612.36;
export const ZAKAT_RATE = 0.025;

export function getNisabValue(
  metalPrices: MetalPrices,
  method: "gold" | "silver"
): number {
  if (method === "gold") {
    return NISAB_GOLD_GRAMS * metalPrices.goldPerGram;
  }
  return NISAB_SILVER_GRAMS * metalPrices.silverPerGram;
}

export function meetsNisab(
  wealth: number,
  metalPrices: MetalPrices,
  method: "gold" | "silver"
): boolean {
  return wealth >= getNisabValue(metalPrices, method);
}

/**
 * Compute minimum balance over the hawl period from transaction history.
 * Plaid transactions: amount > 0 means money left the account (debit),
 * amount < 0 means money entered the account (credit).
 */
export function computeHawlMinimum(
  transactions: Transaction[],
  currentBalance: number,
  startDate: Date
): number {
  // Sort newest-to-oldest so we can reconstruct historical balances going backwards
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let balance = currentBalance;
  let minimum = currentBalance;

  for (const tx of sorted) {
    const txDate = new Date(tx.date);
    if (txDate < startDate) break;
    // Undo each transaction: debit (positive amount) means balance was higher before
    balance += tx.amount;
    if (balance < minimum) minimum = balance;
  }

  // Ignore negative minimum (can happen with unsettled transactions)
  return Math.max(0, minimum);
}

export function aggregateAssets(
  accounts: Account[],
  holdings: Holding[],
  manual: ManualAssets,
  metalPrices: MetalPrices,
  includeRetirement: boolean
): AssetBreakdown {
  const RETIREMENT_SUBTYPES = ["401k", "ira", "roth", "403b", "pension", "retirement"];

  let cashAndSavings = 0;
  let investments = 0;

  for (const acct of accounts) {
    const balance = acct.balances.current ?? acct.balances.available ?? 0;
    const isRetirement = RETIREMENT_SUBTYPES.includes(
      (acct.subtype ?? "").toLowerCase()
    );

    if (isRetirement && !includeRetirement) continue;

    if (["depository", "credit"].includes(acct.type.toLowerCase())) {
      // For credit accounts, balance is what you owe (already handled via debts or ignored)
      if (acct.type.toLowerCase() === "depository") {
        cashAndSavings += balance;
      }
    } else if (acct.type.toLowerCase() === "investment") {
      investments += balance;
    }
  }

  // Holdings value (investment accounts already summed above by balance, but let's use holdings if available)
  // Holdings provide more accurate values; if provided, override investment balance
  if (holdings.length > 0) {
    investments = holdings.reduce(
      (sum, h) => sum + (h.institution_value ?? 0),
      0
    );
  }

  const goldSilverValue =
    manual.goldGrams * metalPrices.goldPerGram +
    manual.silverGrams * metalPrices.silverPerGram;

  const manualAssets =
    manual.cashOnHand + manual.receivables + manual.businessInventory;

  const total = Math.max(
    0,
    cashAndSavings +
      investments +
      goldSilverValue +
      manualAssets -
      manual.debts
  );

  return {
    cashAndSavings,
    investments,
    manualAssets,
    goldSilverValue,
    debts: manual.debts,
    total,
  };
}

export function calculateZakat(zakatableWealth: number): number {
  return zakatableWealth * ZAKAT_RATE;
}

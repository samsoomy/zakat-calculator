import { NextResponse } from "next/server";
import { getPlaidClient } from "@/lib/plaid";
import { Transaction, TransactionsSyncRequest } from "plaid";
import { subMonths } from "date-fns";

export async function POST(req: Request) {
  try {
    const { public_token } = await req.json();
    if (!public_token) {
      return NextResponse.json({ error: "public_token required" }, { status: 400 });
    }

    const plaid = getPlaidClient();

    // Exchange public token for access token
    const exchangeRes = await plaid.itemPublicTokenExchange({ public_token });
    const { access_token, item_id } = exchangeRes.data;

    // Fetch institution info
    const itemRes = await plaid.itemGet({ access_token });
    const institutionId = itemRes.data.item.institution_id;
    let institutionName = "Connected Bank";
    if (institutionId) {
      const instRes = await plaid.institutionsGetById({
        institution_id: institutionId,
        country_codes: ["US"] as never,
      });
      institutionName = instRes.data.institution.name;
    }

    // Fetch current balances
    const balancesRes = await plaid.accountsBalanceGet({ access_token });
    const accounts = balancesRes.data.accounts.map((a) => ({
      account_id: a.account_id,
      name: a.name,
      type: a.type,
      subtype: a.subtype ?? "",
      balances: {
        current: a.balances.current,
        available: a.balances.available,
      },
      institution_name: institutionName,
    }));

    // Fetch holdings if available
    let holdings: unknown[] = [];
    try {
      const holdingsRes = await plaid.investmentsHoldingsGet({ access_token });
      holdings = holdingsRes.data.holdings.map((h) => ({
        account_id: h.account_id,
        security_id: h.security_id,
        quantity: h.quantity,
        institution_value: h.institution_value,
      }));
    } catch {
      // Investment product may not be available for this account
    }

    // Fetch 13 months of transactions
    const startDate = subMonths(new Date(), 13);
    let transactions: Transaction[] = [];
    let cursor: string | undefined;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const request: TransactionsSyncRequest = { access_token };
      if (cursor) request.cursor = cursor;
      const syncRes = await plaid.transactionsSync(request);
      transactions = [
        ...transactions,
        ...syncRes.data.added.filter(
          (t) => new Date(t.date) >= startDate
        ),
      ];
      cursor = syncRes.data.next_cursor;
      if (!syncRes.data.has_more) break;
    }

    const txSummary = transactions.map((t) => ({
      date: t.date,
      amount: t.amount,
      account_id: t.account_id,
    }));

    return NextResponse.json({
      item_id,
      accounts,
      holdings,
      transactions: txSummary,
      institution_name: institutionName,
    });
  } catch (err: unknown) {
    console.error("exchange-token error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

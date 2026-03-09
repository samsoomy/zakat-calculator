import { NextResponse } from "next/server";
import { getPlaidClient } from "@/lib/plaid";
import { getTokens } from "@/lib/kv";
import { TransactionsSyncRequest, Transaction } from "plaid";
import { subMonths } from "date-fns";

export async function POST(req: Request) {
  try {
    const { uuid } = await req.json();
    if (!uuid) {
      return NextResponse.json({ error: "uuid required" }, { status: 400 });
    }

    const accessTokens = await getTokens(uuid);
    if (!accessTokens.length) {
      return NextResponse.json({ accounts: [], holdings: [], transactions: [] });
    }

    const plaid = getPlaidClient();
    const startDate = subMonths(new Date(), 13);

    const allAccounts: unknown[] = [];
    const allHoldings: unknown[] = [];
    const allTransactions: unknown[] = [];

    for (const access_token of accessTokens) {
      try {
        // Get institution info
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

        // Balances
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
        allAccounts.push(...accounts);

        // Holdings
        try {
          const holdingsRes = await plaid.investmentsHoldingsGet({ access_token });
          const holdings = holdingsRes.data.holdings.map((h) => ({
            account_id: h.account_id,
            security_id: h.security_id,
            quantity: h.quantity,
            institution_value: h.institution_value,
          }));
          allHoldings.push(...holdings);
        } catch {
          // Not available
        }

        // Transactions
        let transactions: Transaction[] = [];
        let cursor: string | undefined;
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

        allTransactions.push(
          ...transactions.map((t) => ({
            date: t.date,
            amount: t.amount,
            account_id: t.account_id,
          }))
        );
      } catch (err) {
        console.error("Error fetching data for token:", err);
      }
    }

    return NextResponse.json({
      accounts: allAccounts,
      holdings: allHoldings,
      transactions: allTransactions,
    });
  } catch (err: unknown) {
    console.error("fetch-data error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

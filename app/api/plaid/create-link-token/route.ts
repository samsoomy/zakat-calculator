import { NextResponse } from "next/server";
import { getPlaidClient } from "@/lib/plaid";
import { CountryCode, Products } from "plaid";

export async function POST(req: Request) {
  try {
    const { uuid } = await req.json();
    if (!uuid) {
      return NextResponse.json({ error: "uuid required" }, { status: 400 });
    }

    const plaid = getPlaidClient();
    const response = await plaid.linkTokenCreate({
      user: { client_user_id: uuid },
      client_name: "Zakat Calculator",
      products: [Products.Transactions, Products.Investments],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    return NextResponse.json({ link_token: response.data.link_token });
  } catch (err: unknown) {
    console.error("create-link-token error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

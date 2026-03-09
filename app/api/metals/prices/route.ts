import { NextResponse } from "next/server";
import { getMetalPrices } from "@/lib/metals";

export async function GET() {
  try {
    const prices = await getMetalPrices();
    return NextResponse.json(prices);
  } catch (err: unknown) {
    console.error("metals prices error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

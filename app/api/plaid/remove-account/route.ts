import { NextResponse } from "next/server";
import { deleteToken } from "@/lib/kv";

export async function DELETE(req: Request) {
  try {
    const { uuid, item_id } = await req.json();
    if (!uuid || !item_id) {
      return NextResponse.json(
        { error: "uuid and item_id required" },
        { status: 400 }
      );
    }
    await deleteToken(uuid, item_id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("remove-account error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

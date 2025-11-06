import { NextRequest, NextResponse } from "next/server";
import { isUser } from '@/lib/LFirebaseAdmin';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { err, xuser } = await isUser(id);

    if (err || !xuser) throw new Error("User tidak ditemukan");

    return NextResponse.json({ success: true, user: xuser });
  } catch (err: any) {
    console.error("Error listing users:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
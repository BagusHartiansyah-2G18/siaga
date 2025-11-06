import { NextRequest, NextResponse } from "next/server";
import { isUser} from "@/lib/LFirebaseAdmin";
import { Iaktivitas } from "@/types";
export async function GET(request:NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID tidak ditemukan." }, { status: 400 });
    }
    const {err,xuser}= await isUser(id);
    if (typeof xuser == "number") throw err;
    const aktivitas = xuser.aktivitas as Iaktivitas[];
    const dt = aktivitas.filter(item => Number(item.aktif) ==2).map(v=>({...v,nama:xuser.nama}));
    if (dt.length === 0) {
      return NextResponse.json(
        { error: `Tidak ada aktivitas yang aktif` },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: dt});
  } catch (error) {
    console.error("GET error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server.", msg: message },
      { status: 404 }
    );
  }
}

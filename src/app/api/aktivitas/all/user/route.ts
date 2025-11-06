import { NextRequest, NextResponse } from "next/server";
import { isUser} from "@/lib/LFirebaseAdmin";
import { encrypt } from "@/lib/Lcript";
import { Iaktivitas } from "@/types";
export async function GET(request:NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) throw "ID tidak ditemukan."
    
    const {err,xuser}= await isUser(id);
    if (typeof xuser=="number") throw err;
    const aktivitas = xuser.aktivitas as Iaktivitas[];
    const dt = (aktivitas?aktivitas:[]).filter(item => Number(item.aktif) <2)
    .map(v=>({
        ...v,nama:xuser.nama,
        key:encrypt(JSON.stringify({id:v.id,kategori:v.kategori}))
      }));
    if (dt.length === 0) {
      throw  `Tidak ada aktivitas yang aktif`;
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

import { NextRequest, NextResponse } from "next/server";
import { isUser,db} from "@/lib/LFirebaseAdmin";
export async function GET(request :NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const {err,xuser}= await isUser(String(id));
    if (xuser==0) throw err;

    const userRef = db.collection("user");
    const snapshot = await userRef.get();

    if (snapshot.empty) {
      throw "data user masih kosong !!!";
    }
    let aktivitasList = snapshot.docs.filter(v=>{
      const {role} = v.data();
      return role!='';
    }).map((doc)=>{
      const { alamat,img,kecamatan,nama,no_hp,no_wa,desa,role } = doc.data();
      return {alamat,img,kecamatan,nama,no_hp,no_wa,desa,role}
    });

    return NextResponse.json({ success: true, data: aktivitasList });
  } catch (err) {
    console.error("GET error:", err);
    const message = err instanceof Error ? err.message : String(err);
    
    return NextResponse.json(
      { error: "Terjadi kesalahan server.", msg: message },
      { status: 404 }
    );
  }
}

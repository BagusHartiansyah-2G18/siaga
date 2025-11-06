// import { NextRequest, NextResponse } from "next/server";
// import { db, isAdminID} from "@/lib/LFirebaseAdmin";
// import { encrypt } from "@/lib/Lcript";
// import { Iaktivitas } from "@/types";
// export async function GET(request: NextRequest) {
//   try {
//     const id = request.nextUrl.searchParams.get("id");
//     if (!id) {
//       return NextResponse.json({ error: "ID tidak ditemukan." }, { status: 400 });
//     }
//     const {err,xAdmin}= await isAdminID(id);
//     if (xAdmin==0) throw err;
    
//     const userRef = db.collection("user");
//     const snapshot = await userRef.get();

//     if (snapshot.empty) {
//       return NextResponse.json({ error: "Tidak ada data user." }, { status: 404 });
//     }
//     let aktivitasList:Iaktivitas[] = [];
//     snapshot.forEach(doc => {
//       const data = doc.data();
//       if ( Array.isArray(data.aktivitas)) {
//         const hasil = data.aktivitas.filter(
//             item => Number(item.aktif) < 2
//           ).map(v=>({...v,nama:data.nama, key:encrypt(JSON.stringify({id:v.id,kategori:v.kategori})), ket:`${data.nama} (${data.desa} , ${data.kecamatan}) `}));
//         if(hasil.length>0){
//           aktivitasList.push(...hasil);
//         }
//       }
//     });

//     if (aktivitasList.length === 0) {
//       return NextResponse.json(
//         { error: `Tidak ada aktivitas yang aktif` },
//         { status: 404 }
//       );
//     }

//     // ⬇ hanya return aktivitas
//     return NextResponse.json({ success: true, data: aktivitasList });
//   } catch (error) {
//     console.error("GET error:", error);
//     return NextResponse.json(
//       { error: "Terjadi kesalahan server.", msg: error },
//       { status: 404 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { db, isAdminID } from "@/lib/LFirebaseAdmin";
import { encrypt } from "@/lib/Lcript";
import { Iaktivitas } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID tidak ditemukan." }, { status: 400 });
    }

    const { err, xAdmin } = await isAdminID(id);
    if (typeof xAdmin === "number") throw new Error(err || "User tidak valid.");

    const snapshot = await db.collection("user").get();
    if (snapshot.empty) {
      return NextResponse.json({ error: "Tidak ada data user." }, { status: 404 });
    }

    const aktivitasList: Iaktivitas[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!Array.isArray(data.aktivitas)) return;

      const hasil = data.aktivitas
        .filter((item) => Number(item.aktif) < 2)
        .map((v) => ({
          ...v,
          nama: data.nama,
          key: encrypt(JSON.stringify({ id: v.id, kategori: v.kategori })),
          ket: `${data.nama} (${data.desa}, ${data.kecamatan})`,
        }));

      if (hasil.length > 0) {
        aktivitasList.push(...hasil);
      }
    });

    if (aktivitasList.length === 0) {
      return NextResponse.json({ error: "Tidak ada aktivitas yang aktif." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: aktivitasList });
  } catch (error) {
    console.error("GET error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server.", msg: message },
      { status: 500 }
    );
  }
}
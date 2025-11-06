// import { NextResponse,NextRequest } from "next/server";
// import { db,isNotPublic} from "@/lib/LFirebaseAdmin";
// import { encrypt } from "@/lib/Lcript";
// import { Iaktivitas } from "@/types";
// export async function GET(request: NextRequest) {
//   try {
//     const {err,xuser}= await isNotPublic(request);
//     if (xuser==0) throw err;
    
//     const userRef = db.collection("user");
//     const snapshot = await userRef.get();

//     if (snapshot.empty) throw "Tidak ada data user.";
//     const aktivitasList: Iaktivitas[] = [];

//     snapshot.forEach(doc => {
//       const data = doc.data();
//       if ( Array.isArray(data.aktivitas)) {
//         const hasil = data.aktivitas.filter(
//             item =>{
//               let kon =
//                 (item.kategori === "darurat" && (xuser.role === "linmas" || xuser.role === "admin")) ||
//               (item.kategori !== "darurat" && (xuser.role === "titram"  || xuser.role === "admin"));
//               if(kon && Number(item.aktif) <2){
//                 return item;
//               }
//             }
//           ).map(v=>({...v,nama:data.nama, key:encrypt(JSON.stringify({id:v.id,kategori:v.kategori})), ket:`${data.nama} (${data.desa} , ${data.kecamatan}) `}));
//         if(hasil.length>0){
//           aktivitasList.push(...hasil);
//         }
//       }
//     });

//     if (aktivitasList.length === 0) {
//       throw `Tidak ada aktivitas yang aktif` ; 
//     }

//     // ⬇ hanya return aktivitas
//     return NextResponse.json({ success: true, data: aktivitasList });
//   } catch (error) {
//     console.error("GET error:", error);
//     const message = error instanceof Error ? error.message : String(error);
//     return NextResponse.json(
//       { error: "Terjadi kesalahan server.", msg: message },
//       { status: 404 }
//     );

//   }
// }


import { NextResponse, NextRequest } from "next/server";
import { db, isNotPublic } from "@/lib/LFirebaseAdmin";
import { encrypt } from "@/lib/Lcript";
import { Iaktivitas } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { err, xuser } = await isNotPublic(request);
    if (!xuser || xuser === 0) throw new Error(err || "User tidak valid.");

    const snapshot = await db.collection("user").get();
    if (snapshot.empty) throw new Error("Tidak ada data user.");

    const aktivitasList: Iaktivitas[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!Array.isArray(data.aktivitas)) return;

      const hasil = data.aktivitas
        .filter((item) => {
          const isDarurat = item.kategori === "darurat";
          const isAktif = Number(item.aktif) < 2;
          const isRoleValid =
            
            (typeof xuser === "object" && isDarurat && ["linmas", "admin"].includes(xuser.role)) ||
            (typeof xuser === "object" && !isDarurat && ["titram", "admin"].includes(xuser.role));
          return isRoleValid && isAktif;
        })
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
      throw new Error("Tidak ada aktivitas yang aktif.");
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
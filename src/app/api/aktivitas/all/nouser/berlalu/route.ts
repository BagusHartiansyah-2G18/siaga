// import { NextResponse,NextRequest } from "next/server";
// import { db,isUser} from "@/lib/LFirebaseAdmin";
// import { encrypt } from "@/lib/Lcript";
// import { Iaktivitas } from "@/types";
// export async function GET(request:NextRequest) {
//   try {
//     const id = request.nextUrl.searchParams.get("id");
//     if (!id) if (!id) throw "ID tidak ditemukan."

//     const {err,xuser}= await isUser(id);
//     if (xuser==0) throw err;
    
//     const userRef = db.collection("user");
//     const snapshot = await userRef.get();

//     if (snapshot.empty) {
//       return NextResponse.json({ error: "Tidak ada data user." }, { status: 404 });
//     }
//     let aktivitasList :Iaktivitas[]=[];
//     snapshot.forEach(doc => {
//       const data = doc.data();
//       if ( Array.isArray(data.aktivitas)) {
//         const hasil = data.aktivitas.filter(
//             item =>{
//               let kon =
//                 (item.kategori === "darurat" && (xuser.role === "linmas" || xuser.role === "admin")) ||
//               (item.kategori !== "darurat" && (xuser.role === "titram"  || xuser.role === "admin"));
//               if(kon && Number(item.aktif) ==2){
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
//       return NextResponse.json(
//         { error: `Tidak ada aktivitas yang aktif` },
//         { status: 404 }
//       );
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
import { db, isUser } from "@/lib/LFirebaseAdmin";
import { encrypt } from "@/lib/Lcript";
import { Iaktivitas } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) throw new Error("ID tidak ditemukan.");

    const { err, xuser } = await isUser(id);
    if (!xuser || xuser === 0) throw new Error(err || "User tidak valid.");

    const snapshot = await db.collection("user").get();
    if (snapshot.empty) {
      return NextResponse.json({ error: "Tidak ada data user." }, { status: 404 });
    }

    const aktivitasList: Iaktivitas[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!Array.isArray(data.aktivitas)) return;

      const hasil = data.aktivitas
        .filter((item) => {
          const isDarurat = item.kategori === "darurat";
          const isAktif = Number(item.aktif) === 2;
          const checkRole = (typeof xuser == "object" ?  xuser.role:"");
          const isRoleValid =
            (isDarurat && ["linmas", "admin"].includes(checkRole )) ||
            (!isDarurat && ["titram", "admin"].includes(checkRole));
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
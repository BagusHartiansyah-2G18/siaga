// import { NextResponse } from "next/server";
// import { auth,db,isNotPublic } from "@/lib/LFirebaseAdmin";
// import { encrypt, decrypt } from '@/lib/Lcript';

// export async function GET(req: Request) {
//   const { xuser , err} = await isNotPublic(req);
//   if (xuser==0){
//     return NextResponse.json({ error: err }, { status: 400 });
//   }
//   let aktivitasList = [];
//   try {
//     const userRef = db.collection("user");
//     const snapshot = await userRef.get();
    
//     if (snapshot.empty) {
//       throw "data user tidak tersedia";
//     } 
//     snapshot.forEach(doc => {
//       const data = doc.data();
//       if ( Array.isArray(data.aktivitas)) {
//         aktivitasList.push(...data.aktivitas.filter(
//           item =>{
//             let kon =
//               (item.kategori === "darurat" && (xuser.role === "linmas" || xuser.role === "admin")) ||
//               (item.kategori !== "darurat" && (xuser.role === "titram"  || xuser.role === "admin"));
//             if(kon && Number(item.aktif) === 0){
//               return item;
//             }
//           }
//         ).map(v=>({...data,...v, key:encrypt(JSON.stringify({id:v.id,kategori:v.kategori})), ket:`${data.nama} (${data.desa} , ${data.kecamatan}) `}))
//       );
//       }
//     });

//     if (aktivitasList.length === 0) {
//       return NextResponse.json(
//         { error: `Tidak ada aktivitas yang aktif` },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json({ success: true, data: aktivitasList });
//   } catch (error) {
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { db, isNotPublic } from "@/lib/LFirebaseAdmin";
import { encrypt } from "@/lib/Lcript";
import { Iaktivitas } from "@/types";

export async function GET(req: NextRequest) {
  const { xuser, err } = await isNotPublic(req);
  if (!xuser || xuser === 0) {
    return NextResponse.json({ error: err }, { status: 400 });
  }

  try {
    const snapshot = await db.collection("user").get();
    if (snapshot.empty) {
      throw new Error("Data user tidak tersedia.");
    }

    const aktivitasList :Iaktivitas[]= [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!Array.isArray(data.aktivitas)) return;
      const checkRole = (typeof xuser == "object" ?  xuser.role:"");
          
      const hasil = data.aktivitas
        .filter((item) => {
          const kon =
            (item.kategori === "darurat" &&
              ["linmas", "admin"].includes(checkRole)) ||
            (item.kategori !== "darurat" &&
              ["titram", "admin"].includes(checkRole));
          return kon && Number(item.aktif) === 0;
        })
        .map((v) => ({
          ...data,
          ...v,
          key: encrypt(JSON.stringify({ id: v.id, kategori: v.kategori })),
          ket: `${data.nama} (${data.desa}, ${data.kecamatan})`,
        }));

      if (hasil.length > 0) {
        aktivitasList.push(...hasil);
      }
    });

    if (aktivitasList.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada aktivitas yang aktif." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: aktivitasList });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
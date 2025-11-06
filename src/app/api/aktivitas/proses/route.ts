// import { NextResponse } from "next/server";
// import { auth,db,messaging, isNotPublic,isUser,__token, lagiKosongJin} from "@/lib/LFirebaseAdmin";
// export async function POST(req: Request) {
//   const { xuser , err} = await isNotPublic(req);
//   try {
//     if (xuser==0){
//       throw err;
//     }
//     const dataProses = await req.json(); 
//     const {id,kategori,lokasiy,datetimeP,judul} = dataProses;

//     if ((xuser.role =="linmas"? "darurat":"laporan") != kategori) {
//       throw "bukan untuk bidang anda";
//     } 
    
//     const {err,xuser : duser, userRef}= await isUser(id);
//     if(duser==0) throw err;
//     const { pesan } = await lagiKosongJin(xuser.id);
//     if(pesan!= "") throw pesan;
//     await userRef.update({
//       aktivitas: (duser.aktivitas? duser.aktivitas:[]).map(v=>{
//         if(v.aktif == 0 && v.kategori == kategori){
//           return {
//             ...v,
//             lokasiy,
//             datetimeP,
//             idPetugas:xuser.id,
//             nmPetugas:xuser.nama,
//             aktif: 1
//           }
//         }
//         return v;
//       }),
//     });
//     try {
//       sendNotif({
//         nmPetugas : xuser.nama+" [ "+xuser.role+" ]",
//         nmUser : duser.nama,
//         kategori,
//         judul,
//         id
//       });
//     } catch (error) {
//       console.log(error);
//       console.log("error send notif");
//     }
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.log(error);  
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }

// async function sendNotif(dt:object) {
//   try {
//     const { nmPetugas, nmUser, kategori,judul,id} = dt;
//     const darurat = (kategori =="darurat");
//     const title = `${nmPetugas} telah memproses ${(darurat ? "Panggilan Darurat":" Laporan ")} dari ${nmUser}`;
//     const body = "dalam proses...";
//     const tokens: string[] = [];
//     const duser = await db.collection("user").where("role", "in",['admin',(darurat?"linmas":"titram")]).get();
//     if(darurat){
      
//     }
//     // const snapshot = await db.collection("fcmTokens").get();
//     // const snapshot = await db.collection("fcmTokens").get();
//     const snapshot = await __token(id);
//     if(snapshot!="0")tokens.push(snapshot);

//     for (const doc of duser.docs) {
//       const snapshot = await __token(doc.id);
//       if(snapshot!="0")tokens.push(snapshot);
//     }
    
//     if (tokens.length === 0) {
//       throw "No tokens found";
//     }
//     const response = await messaging.sendEachForMulticast({
//       tokens,
//       notification: {
//         title: title || "🚀 Notifikasi Baru",
//         body: body || "Ada update dari sistem",
//       },
//       data:stringifyData({})
//     });

//     // response.responses.forEach((r, i) => {
//     //   console.log(r); 
//     //   // if (!r.success && r.error?.code === "messaging/registration-token-not-registered") {
//     //   //   console.log(r);
//     //   // }
//     // });
//     return true;
//   } catch (err: any) {
//     console.error("❌ Error sending broadcast:", err);
//     // return NextResponse.json({ error: err.message }, { status: 500 });
//     return false;
//   }
// } 

// function stringifyData(obj: Record<string, any>): Record<string, string> {
//   const result: Record<string, string> = {};
//   for (const key in obj) {
//     const value = obj[key];
//     result[key] = value !== null && value !== undefined ? String(value) : "";
//   }
//   return result;
// }



import { NextRequest, NextResponse } from "next/server";
import { db, isNotPublic, isUser, __token, lagiKosongJin, messaging } from "@/lib/LFirebaseAdmin";

import { Iaktivitas, NotifPayload } from "@/types";
export async function POST(req: NextRequest) {
  const { xuser, err } = await isNotPublic(req);

  try {
    if (typeof xuser =="number") {
      throw new Error(err || "User tidak valid.");
    }

    const dataProses: Iaktivitas = await req.json();
    const { id, kategori, lokasiy, datetimeP, judul } = dataProses;

    
    const bidang = xuser.role === "linmas" ? "darurat" : "laporan";
    if (kategori !== bidang) {
      throw new Error("Bukan untuk bidang anda.");
    }

    const { xuser: duser, userRef } = await isUser(id);
    if (typeof duser =="number") throw new Error(err || "User target tidak valid.");

    const { pesan } = await lagiKosongJin(xuser.id);
    if (pesan) throw new Error(pesan);

    const updatedAktivitas = (duser.aktivitas || []).map((v: Record<string, unknown>) => {
      if (v.aktif === 0 && v.kategori === kategori) {
        return {
          ...v,
          lokasiy,
          datetimeP,
          idPetugas: xuser.id,
          nmPetugas: xuser.nama,
          aktif: 1,
        };
      }
      return v;
    });

    if (!(userRef instanceof FirebaseFirestore.DocumentReference)) throw new Error("Invalid userRef");
    await userRef.update({ aktivitas: updatedAktivitas });

    try {
      await sendNotif({
        nmPetugas: `${xuser.nama} [${xuser.role}]`,
        nmUser: duser.nama,
        kategori,
        judul:String(judul),
        id,
      });
    } catch (notifErr) {
      console.error("Error send notif:", notifErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("POST error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function sendNotif(dt: NotifPayload): Promise<boolean> {
  try {
    const { nmPetugas, nmUser, kategori, judul, id } = dt;
    const darurat = kategori === "darurat";
    const title = `${nmPetugas} telah memproses ${darurat ? "Panggilan Darurat" : "Laporan"} dari ${nmUser}`;
    const body = "Dalam proses...";
    const tokens: string[] = [];

    const duser = await db
      .collection("user")
      .where("role", "in", ["admin", darurat ? "linmas" : "titram"])
      .get();

    const userToken = await __token(id);
    if (userToken !== "0") tokens.push(userToken);

    for (const doc of duser.docs) {
      const token = await __token(doc.id);
      if (token !== "0") tokens.push(token);
    }

    if (tokens.length === 0) {
      throw new Error("Tidak ada token ditemukan.");
    }

    await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title,
        body,
      },
      data: stringifyData(dt),
    });

    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ Error sending broadcast:", message);
    return false;
  }
}

function stringifyData(obj:NotifPayload ): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in obj) {
    const value = obj[key];
    result[key] = value !== null && value !== undefined ? String(value) : "";
  }
  return result;
}
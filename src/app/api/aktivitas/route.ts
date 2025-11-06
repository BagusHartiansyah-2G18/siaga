// import { NextResponse } from "next/server";
// import { auth,db,messaging } from "@/lib/LFirebaseAdmin";
// export async function POST(req: Request) {
//   try {
//     const aktivitasBaru = await req.json(); 
//     const {id} = aktivitasBaru;

//     if (!id || typeof id !== 'string' || id.trim() === '') {
//       throw "ID user tidak valid atau kosong.";
//     }

//     const userRef = db.collection("user").doc(id);
//     const docSnap = await userRef.get();
//     if (!docSnap.exists) {
//       throw new Error(`User dengan ID '${id}' tidak ditemukan.`);
//     }
//     const existingData = docSnap.data();
//     const aktivitasLama = existingData.aktivitas || [];
    
//     if(aktivitasLama.filter(x=>x.kategori==aktivitasBaru.kategori && x.aktif==0).length>0 ) throw "berikan kami waktu untuk fokus pada pengaduan sebelumnnya yang masih aktif"
//     await userRef.update({
//       aktivitas: [...aktivitasLama,aktivitasBaru],
//     });
//     try {
//       sendNotif(aktivitasBaru);
//     } catch (error) {
//       console.log("error send notif");
//     }
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }

// async function sendNotif(aktivitas:object) {
//   try {
//     const { kategori, judul, deskripsi} = aktivitas;
//     const darurat = (kategori =="darurat");
//     const title = (darurat ? "Panggilan Darurat":" Laporan Pelanggan");
//     const body = (darurat ? "Sangat memerlukan bantuan":`${judul} \n ${deskripsi}`);
//     const tokens: string[] = [];
//     const duser = await db.collection("user").where("role", "in",['admin',(darurat?"linmas":"titram")]).get();
//     if(darurat){
      
//     }
//     // const snapshot = await db.collection("fcmTokens").get();
//     // const snapshot = await db.collection("fcmTokens").get();
 
//     for (const doc of duser.docs) {
//       const snapshot = await db.collection("fcmTokens").doc(doc.id).get();
//       const xdata = snapshot.data();
//       if (xdata?.token) tokens.push(xdata.token);
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
//       data:stringifyData(aktivitas)
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


import { NextResponse } from "next/server";
import { db, messaging } from "@/lib/LFirebaseAdmin";

interface Aktivitas {
  id: string;
  kategori: string;
  judul?: string;
  deskripsi?: string;
  [key: string]: unknown;
}

export async function POST(req: Request) {
  try {
    const aktivitasBaru: Aktivitas = await req.json();
    const { id } = aktivitasBaru;

    if (!id || typeof id !== "string" || id.trim() === "") {
      throw new Error("ID user tidak valid atau kosong.");
    }

    const userRef = db.collection("user").doc(id);
    const docSnap = await userRef.get();
    if (!docSnap.exists) {
      throw new Error(`User dengan ID '${id}' tidak ditemukan.`);
    }

    const existingData = docSnap.data();
    const aktivitasLama = existingData?.aktivitas || [];

    const masihAktif = aktivitasLama.some(
      (x: Record<string, unknown>) =>
        x.kategori === aktivitasBaru.kategori && x.aktif === 0
    );
    if (masihAktif) {
      throw new Error("Berikan kami waktu untuk fokus pada pengaduan sebelumnya yang masih aktif.");
    }

    await userRef.update({
      aktivitas: [...aktivitasLama, aktivitasBaru],
    });

    try {
      await sendNotif(aktivitasBaru);
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

async function sendNotif(aktivitas: Aktivitas): Promise<boolean> {
  try {
    const { kategori, judul, deskripsi } = aktivitas;
    const darurat = kategori === "darurat";
    const title = darurat ? "Panggilan Darurat" : "Laporan Pelanggan";
    const body = darurat ? "Sangat memerlukan bantuan" : `${judul ?? ""}\n${deskripsi ?? ""}`;
    const tokens: string[] = [];

    const duser = await db
      .collection("user")
      .where("role", "in", ["admin", darurat ? "linmas" : "titram"])
      .get();

    for (const doc of duser.docs) {
      const snapshot = await db.collection("fcmTokens").doc(doc.id).get();
      const xdata = snapshot.data() as { token?: string } | undefined;
      if (xdata?.token) tokens.push(xdata.token);
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
      data: stringifyData(aktivitas),
    });

    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ Error sending broadcast:", message);
    return false;
  }
}

function stringifyData(obj: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in obj) {
    const value = obj[key];
    result[key] = value !== null && value !== undefined ? String(value) : "";
  }
  return result;
}
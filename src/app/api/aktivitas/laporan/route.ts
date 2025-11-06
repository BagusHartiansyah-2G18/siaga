// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";
// import { auth,isUser,db, times,messaging } from '@/lib/LFirebaseAdmin';
// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const userData = { 
//       judul: formData.get("judul")?.toString() || "",
//       deskripsi: formData.get("deskripsi")?.toString() || "",
//       status: formData.get("status")?.toString() || "",
//       datetime: formData.get("datetime")?.toString() || "",
//       lokasi: formData.get("lokasi")?.toString() || "",
//       aktif: formData.get("aktif")?.toString() || "",
//       feedback: formData.get("feedback")?.toString() || "",
//       idFinish: formData.get("idFinish")?.toString() || "", 
//       kategori: formData.get("kategori")?.toString() || "", 
//       id: formData.get("id")?.toString() || "", 
//       idPetugas: formData.get("idPetugas")?.toString() || "", 
//     };

    
//     let fileUrl = null;
//     const file = formData.get("img") as File | null;

//     if (file) {
//       const bytes = Buffer.from(await file.arrayBuffer());
//       const uploadDir = path.join(process.cwd(), "public/uploads");
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//       }
//       const filePath = path.join(uploadDir, file.name);
//       fs.writeFileSync(filePath, bytes);
//       fileUrl = `/uploads/${file.name}`;
//     }else{
//       throw "Tambahkan poto pendukung";
//     } 
//     const {err,xuser,userRef}= await isUser(userData.id);
//     if(err!=undefined)throw err;
//     const aktivitasLama = xuser.aktivitas || [];
    
//     if(aktivitasLama.filter(x=>x.kategori==userData.kategori && x.aktif==0).length>0 ) throw "berikan kami waktu untuk fokus pada pengaduan sebelumnnya yang masih aktif"
//     await userRef.update({
//       aktivitas: [...aktivitasLama,{...userData,img:fileUrl}],
//     });
//     try {
//       sendNotif(userData);
//     } catch (error) {
//       console.log("error send notif");
//     }
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.log(error);
    
//     return NextResponse.json({ error: error }, { status: 400 });
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
import fs from "fs";
import path from "path";
import { isUser, db, messaging } from "@/lib/LFirebaseAdmin";
import { Iaktivitas } from "@/types";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userData: Iaktivitas = {
      judul: formData.get("judul")?.toString() || "",
      deskripsi: formData.get("deskripsi")?.toString() || "",
      status: formData.get("status")?.toString() || "",
      datetime: formData.get("datetime")?.toString() || "",
      lokasi: formData.get("lokasi")?.toString() || "",
      aktif: formData.get("aktif")?.toString() || "",
      feedback: formData.get("feedback")?.toString() || "",
      idFinish: formData.get("idFinish")?.toString() || "",
      kategori: formData.get("kategori")?.toString() || "",
      id: formData.get("id")?.toString() || "",
      idPetugas: formData.get("idPetugas")?.toString() || "",
    };

    let fileUrl: string | null = null;
    const file = formData.get("img") as File | null;

    if (file) {
      const bytes = Buffer.from(await file.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, file.name);
      fs.writeFileSync(filePath, bytes);
      fileUrl = `/uploads/${file.name}`;
    } else {
      throw new Error("Tambahkan foto pendukung.");
    }

    const { err, xuser, userRef } = await isUser(userData.id);
    if (typeof xuser === "number") throw new Error(err);
    if (!(userRef instanceof FirebaseFirestore.DocumentReference)) throw new Error("Invalid userRef");

    const aktivitasLama = xuser.aktivitas || [];
    const masihAktif = aktivitasLama.some(
      (x: Record<string, unknown>) => x.kategori === userData.kategori && x.aktif === 0
    );
    if (masihAktif) {
      throw new Error("Berikan kami waktu untuk fokus pada pengaduan sebelumnya yang masih aktif.");
    }

    await userRef.update({
      aktivitas: [...aktivitasLama, { ...userData, img: fileUrl }],
    });

    await sendNotif(userData);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("POST error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

async function sendNotif(aktivitas: Iaktivitas): Promise<boolean> {
  try {
    const { kategori, judul, deskripsi } = aktivitas;
    const darurat = kategori === "darurat";
    const title = darurat ? "Panggilan Darurat" : "Laporan Pelanggan";
    const body = darurat ? "Sangat memerlukan bantuan" : `${judul}\n${deskripsi}`;
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
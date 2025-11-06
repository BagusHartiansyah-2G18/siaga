// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";
// import { auth,isUser,db, times,messaging,__token } from '@/lib/LFirebaseAdmin';
// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const userData = { 
//       judul: formData.get("judul")?.toString() || "",
//       deskripsi: formData.get("deskripsi")?.toString() || "",
//       status: formData.get("status")?.toString() || "",
//       datetimeF: formData.get("datetimeF")?.toString() || "",
//       lokasiF: formData.get("lokasiF")?.toString() || "",
//       idFinish: formData.get("idFinish")?.toString() || "", 
//       kategori: formData.get("kategori")?.toString() || "", 
//       id: formData.get("idData")?.toString() || ""
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
  
//     await userRef.update({
//       aktivitas: (xuser.aktivitas? xuser.aktivitas:[]).map(v=>{
//         if(v.aktif == 1 && v.kategori == userData.kategori && v.idPetugas == userData.idFinish){
//           return {
//             ...v,
//             judul:userData.judul,
//             deskripsi:userData.deskripsi,
//             status:userData.status,
//             lokasiF:userData.lokasiF,
//             datetimeF:userData.datetimeF,
//             idFinish:userData.idFinish,
//             aktif: 2,
//             imgF:fileUrl
//           }
//         }
//         return v;
//       }),
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
//     const { kategori, judul, deskripsi,id} = aktivitas;
//     const darurat = (kategori =="darurat");
//     const title = (darurat ? "Panggilan Darurat [FINISH]":"Laporan [FINISH]");
//     const body ="feedback anda, sangat kami harapkan";
//     const tokens: string[] = [];
//     const duser = await db.collection("user").where("role", "in",['admin']).get();

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
import { isUser, db, messaging, __token } from "@/lib/LFirebaseAdmin";
import { Iaktivitas } from "@/types";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userData: Iaktivitas = {
      judul: formData.get("judul")?.toString() || "",
      deskripsi: formData.get("deskripsi")?.toString() || "",
      status: formData.get("status")?.toString() || "",
      datetimeF: formData.get("datetimeF")?.toString() || "",
      lokasiF: formData.get("lokasiF")?.toString() || "",
      idFinish: formData.get("idFinish")?.toString() || "",
      kategori: formData.get("kategori")?.toString() || "",
      id: formData.get("idData")?.toString() || "",
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


    await userRef.update({
      aktivitas: (xuser.aktivitas || []).map((v: Iaktivitas) => {
        if (
          Number(v.aktif) === 1 &&
          v.kategori === userData.kategori &&
          v.idPetugas === userData.idFinish
        ) {
          return {
            ...v,
            judul: userData.judul,
            deskripsi: userData.deskripsi,
            status: userData.status,
            lokasiF: userData.lokasiF,
            datetimeF: userData.datetimeF,
            idFinish: userData.idFinish,
            aktif: 2,
            imgF: fileUrl,
          };
        }
        return v;
      }),
    });

    await sendNotif(userData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
async function sendNotif(aktivitas: Iaktivitas): Promise<boolean> {
  try {
    const { kategori, id } = aktivitas;
    const title = kategori === "darurat" ? "Panggilan Darurat [FINISH]" : "Laporan [FINISH]";
    const body = "Feedback anda sangat kami harapkan";
    const tokens: string[] = [];

    const adminUsers = await db.collection("user").where("role", "in", ["admin"]).get();
    const userToken = await __token(id);
    if (userToken !== "0") tokens.push(userToken);

    for (const doc of adminUsers.docs) {
      const token = await __token(doc.id);
      if (token !== "0") tokens.push(token);
    }

    if (tokens.length === 0) throw new Error("Tidak ada token ditemukan.");

    await messaging.sendEachForMulticast({
      tokens,
      notification: { title, body },
      data: stringifyData(aktivitas),
    });

    return true;
  } catch (err) {
    console.error("❌ Error sending broadcast:", err);
    return false;
  }
}

function stringifyData(obj: Iaktivitas): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in obj) {
    const value = obj[key];
    result[key] = value !== null && value !== undefined ? String(value) : "";
  }
  return result;
}

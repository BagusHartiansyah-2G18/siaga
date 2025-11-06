import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { auth,isAdmin,db, times } from '@/lib/LFirebaseAdmin';
export async function POST(req: Request) {
  try {
    // return NextResponse.json({ success: true, uid: "Ryk1h2VvK4PSgYhfLowCwnpEVSx2" });
    const formData = await req.formData();
    
    // Ambil semua field text
    const userData = {
      nama: formData.get("nama")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      password: formData.get("password")?.toString() || "",
      role: formData.get("role")?.toString() || "",
      alamat: formData.get("alamat")?.toString() || "",
      desa: formData.get("desa")?.toString() || "",
      kecamatan: formData.get("kecamatan")?.toString() || "",
      no_hp: formData.get("no_hp")?.toString() || "",
      no_wa: formData.get("no_wa")?.toString() || "",
      nik: formData.get("nik")?.toString() || "",
    };

    const userRef = db.collection("user");
    const snapshot = await userRef.get();

    if (!snapshot.empty) {
      let aktivitasList = [];

      snapshot.forEach(doc => {
        const data = doc.data(); 
        if ( data.nik == userData.nik) {
          throw "Nik tersebut telah terdaftar";
        }
      });
    }


    // Handle file upload
    let fileUrl = null;
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
    }else{
      throw "Tambahkan Photo Profil";
    }

    const userRecord = await auth.createUser({
      email:userData.email,
      password:userData.password,
      displayName:userData.nama,
    });
    if(userRecord){
      const dtResp = {
        ...userData,
        nama:userRecord.displayName,
        id:userRecord.uid,
        img:fileUrl,
        createdAt: times,
      };
      await db.collection("user").doc(userRecord.uid).set(dtResp);
      return NextResponse.json({ success: true, data:dtResp });
    }

    throw "Gagal melakukan pendaftaran..";
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}

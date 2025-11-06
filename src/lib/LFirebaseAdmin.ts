import admin, { ServiceAccount } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../../firebase-service-account.json';
import { NextRequest } from 'next/server';
import { Ixadmin, Ixuser,Iuser } from '@/types';



if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
}

export const messaging = admin.messaging();
export const auth = admin.auth();
export const db = getFirestore();
export const times = admin.firestore.FieldValue.serverTimestamp(); 

export function getXUser(req: NextRequest): string | null {
  const xUser = req.headers.get('x-user');
  return typeof xUser === 'string' ? xUser : null;
}
export async function isAdmin(req: NextRequest): Promise<Ixadmin> {
  try {
    const xUser = getXUser(req); 
    
    if (!xUser) throw "Missing x-user header";

    const userDoc = await db.collection("user").doc(xUser).get();
    const userData = userDoc.data() as Iuser | undefined; 
    
    if (!userData || userData.role !== "admin") {
      throw "Anda bukan admin!";
    }

    return {
      xAdmin: { ...userData, id: xUser },
      err: "",
    };
  } catch (err) {
    return {
      err: String(err),
      xAdmin: 0,
    };
  }
}


export async function isAdminID(id:string): Promise<Ixadmin> {
  try {
    const { err,xuser } = await isUser(id) ;
    if(typeof xuser=="number")throw err;
    if (xuser?.role !== 'admin') {
      throw 'anda bukan admin !!!';
    }
    return { xAdmin: { ...xuser, id: id }, err:''};
  } catch (err) { 
    
    return {err:String(err),xAdmin:0};
  }
}

// export async function isUser(id: string): Promise<{ err: string; xuser: any }> {
//   try {
//     if (!id || typeof id !== 'string') {
//       throw new Error('Missing x-user header');
//     }

//     const userRef = db.collection("user").doc(id);
//     const docSnap = await userRef.get();

//     if (!docSnap.exists) {
//       throw new Error(`User dengan ID '${id}' tidak ditemukan.`);
//     }

//     return { err: "", xuser: docSnap.data() };
//   } catch (err) {
//     console.error("isUser error:", err);
//     // const message = err instanceof Error ? err.message : String(err);
    
//     return { err:String(err), xuser: null };
//   }
// } 
export async function isUser(id: string): Promise<{
  err: string;
  xuser: Iuser | number;
  userRef: FirebaseFirestore.DocumentReference | null;
}> {
  if (!id || typeof id !== 'string') {
    return { err: 'Missing x-user header', xuser: 0, userRef: null };
  }

  try {
    const userRef = db.collection("user").doc(id);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      return { err: `User dengan ID '${id}' tidak ditemukan.`, xuser: 0, userRef: null };
    }

    return { err: "", xuser: docSnap.data() as Iuser, userRef };
  } catch (error) {
    console.error("isUser error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { err: message, xuser: 0, userRef: null };
  }
}

export async function isNotPublic(req: NextRequest): Promise<Ixuser> {
  const xUser = getXUser(req);

  try {
    if (!xUser) throw new Error("Missing x-user header");

    const userRef = db.collection("user").doc(xUser);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      throw new Error(`User dengan ID '${xUser}' tidak ditemukan.`);
    }

    const data = docSnap.data() as Iuser;
    if (typeof data !="object") {
      throw new Error("Tidak memiliki akses !!!");
    }

    const xuser: Iuser = {
      ...data,
      id: xUser,
    };

    return { xuser, err: "" };
  } catch (err) {
    console.error("isNotPublic error:", err);
    return { err: String(err), xuser: 0 };
  }
}


export async function __token(id:string): Promise<string>{
  const snapshot = await getFirestore().collection("fcmTokens").doc(id).get();
  const xdata = snapshot.data();
  if (xdata?.token) return xdata?.token;
  return "0";
}

export async function lagiKosong(id:string){
  const userRef = db.collection("user");
  const snapshot = await userRef.get();
  let laporan = false,darurat = false,bertugas = false;
  snapshot.forEach(doc => {
    const data = doc.data();
    if ( Array.isArray(data.aktivitas)) { 
        (data.aktivitas? data.aktivitas:[]).forEach(v => {
          if(doc.id == id){
            if(v.aktif <2){
              if(v.kategori == "darurat"){
                darurat = true;
              }
              laporan = true;
            }
          }else{
            if(v.aktif <2 && v.idPetugas ==id){
              bertugas=true;
            }
          }
        });
    }
  })

  return {laporan,darurat,bertugas};
}
export async function lagiKosongJin(id: string) {
  let laporan = false, darurat = false, bertugas = false, pesan="";

  // 🔹 Cek laporan & darurat (langsung ambil user doc)
  const docSnap = await db.collection("user").doc(id).get();
  if (docSnap.exists) {
    const data = docSnap.data();
    const aktivitas = Array.isArray(data?.aktivitas) ? data!.aktivitas : [];

    for (const v of aktivitas) {
      if (v.aktif < 2) {
        laporan = true;
        if (v.kategori === "darurat") {
          darurat = true;
        }
      }
    }
  }

  // 🔹 Cek bertugas (cari semua user yang punya aktivitas.idPetugas == id)
  const snapshot = await db.collection("user")
    .where("aktivitas", "array-contains", { idPetugas: id }) // ini tidak bisa langsung kalau elemennya object kompleks
    .get();

  snapshot.forEach(doc => {
    const data = doc.data();
    const aktivitas = Array.isArray(data?.aktivitas) ? data!.aktivitas : [];
    for (const v of aktivitas) {
      if (v.aktif < 2 && v.idPetugas === id) {
        bertugas = true;
      }
    }
  });
  if(laporan){
    pesan+=`aktivitas Laporan anda masih aktif\n`;
  }
  if(darurat){
    pesan+=`aktivitas darurat anda masih aktif\n`;
  }
  if(bertugas){
    pesan+=`anda masih aktif bertugas \n`;
  }
  return { laporan, darurat, bertugas, pesan };
}

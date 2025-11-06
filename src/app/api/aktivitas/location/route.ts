// import { NextResponse } from "next/server";
// import { auth,db,messaging, isUser} from "@/lib/LFirebaseAdmin";
// import {decrypt,encrypt} from "@/lib/Lcript";
// export async function POST(req: Request) {
//   try {
//     const {id, lokasi, idUser,lokasix,lokasiy, kategori,idPetugas} = await req.json();

//     const {err,xuser,userRef}= await isUser(id);
//     if(xuser==0) throw err;
//     let dt = {},uref ={};
    
//     if(id == idUser){
//       dt = xuser;
//       uref= userRef;
//     }else{
//       const {err,xuser:dtx, userRef :urep}= await isUser(idUser);
//       uref = urep;
//       dt = dtx;
//     }
//     await uref.update({
//       aktivitas: (dt.aktivitas? dt.aktivitas:[]).map(v=>{ 
//         if(idPetugas!=undefined){
//           if(idPetugas == v.idPetugas){
//             return {
//               ...v,
//               lokasiy : lokasiy,
//             }
//           }
//         }else if(v.id == idUser && lokasix!=undefined){
//             return {
//               ...v,
//               lokasix : lokasix,
//             }
//         }
//         return v;
//       }),
//     });
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.log(error);
    
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const idS = searchParams.get('idS');
//     const idE = searchParams.get('idE');

//     if (!idS || !idE) {
//       return new Response('Missing parameters', { status: 400 });
//     }

//     const {id,kategori} = JSON.parse(decrypt(idS)); 
    
//     const userRef = db.collection('user');
//     const snapshots = await db.getAll(
//       userRef.doc(id),
//       userRef.doc(idE)
//     );
//     const posisi = snapshots.map(doc => {
//       const data = doc.data() || {};
//       const aktivitas = Array.isArray(data.aktivitas)
//         ? data.aktivitas.filter(v => v.aktif <2 && v.kategori === kategori)
//         : [];

//       return {
//         id: doc.id,
//         ...data,
//         aktivitas,
//         ini:(id == doc.id)
//       };
//     });

//     // throw "sasa";
//     return NextResponse.json({ success: true, data:posisi});
//   } catch (error) {
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { db, isUser } from "@/lib/LFirebaseAdmin";
import { decrypt } from "@/lib/Lcript";
import { Iaktivitas } from "@/types";

export async function POST(req: Request) {
  try {
    const {
      id,
      idUser,
      lokasix,
      lokasiy,
      idPetugas,
    }:Iaktivitas = await req.json();

    const { xuser, userRef } = await isUser(id);
    if (!xuser || xuser === 0) throw new Error("User tidak valid.");

    let targetUser = xuser;
    let targetRef = userRef;

    if (typeof idUser == "string" && id !== idUser) {
      const { xuser: otherUser, userRef: otherRef } = await isUser(idUser);
      targetUser = otherUser;
      targetRef = otherRef;
    }
    if(typeof targetUser == "object") {
      const updatedAktivitas = (targetUser.aktivitas || []).map((v: any) => {
      if (idPetugas && idPetugas === v.idPetugas) {
          return { ...v, lokasiy };
        } else if (v.id === idUser && lokasix) {
          return { ...v, lokasix };
        }
        return v;
      });
 
      if (!(targetRef instanceof FirebaseFirestore.DocumentReference)) throw new Error("Invalid userRef");


      await targetRef.update({ aktivitas: updatedAktivitas });

      return NextResponse.json({ success: true });
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("POST error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idS = searchParams.get("idS");
    const idE = searchParams.get("idE");

    if (!idS || !idE) {
      return new Response("Missing parameters", { status: 400 });
    }

    const { id, kategori }: { id: string; kategori: string } = JSON.parse(decrypt(idS));

    const userRef = db.collection("user");
    const snapshots = await db.getAll(userRef.doc(id), userRef.doc(idE));

    const posisi = snapshots.map((doc) => {
      const data = doc.data() || {};
      const aktivitas = Array.isArray(data.aktivitas)
        ? data.aktivitas.filter((v: any) => v.aktif < 2 && v.kategori === kategori)
        : [];

      return {
        id: doc.id,
        ...data,
        aktivitas,
        ini: id === doc.id,
      };
    });

    return NextResponse.json({ success: true, data: posisi });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("GET error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
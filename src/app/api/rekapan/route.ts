// import { NextRequest, NextResponse } from 'next/server';
// import { auth,isAdmin,db } from '@/lib/LFirebaseAdmin';
// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';

// import { NextRequest, NextResponse } from 'next/server';
// import { auth, isAdmin, db } from '@/lib/LFirebaseAdmin';
// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';

// dayjs.extend(duration); // ⬅️ aktifkan plugin


// export async function GET(req: NextRequest) {
//   const { xAdmin , err} = await isAdmin(req);
//   if (xAdmin==0){
//     return NextResponse.json({ error: err }, { status: 400 });
//   }
//   try {
//     const userRef = db.collection("user");
//     const snapshot = await userRef.get();

//     if (snapshot.empty) {
//       throw "data user masih kosong !!!";
//     }
//     const resp ={
//       user :0,
//       aktivitas :{
//         darurat:0,
//         laporan:0
//       },
//       feedback:{
//         satu:0,
//         dua:0,
//         tiga:0,
//         persentase:0
//       },
//       rataRespon:{
//         proses:[],
//         selesai:[],
//         Rproses:{},
//         Rselesai:{},
//       }

//     }
//     // resp.user = snapshot.docs.length;

//     let aktivitasList = snapshot.docs.filter(v=>{
//       const {role} = v.data();
//       return role=='';
//     }).forEach((v,i)=>{
//       (v.data().aktivitas? v.data().aktivitas:[]).forEach((q,w)=>{
//         if(q.kategori == "darurat"){
//           resp.aktivitas.darurat +=1;
//         }else{
//           resp.aktivitas.laporan +=1;
//         }

//         switch (q.feedback) {
//           case 1: resp.feedback.satu+=1; break;
//           case 2: resp.feedback.dua+=1; break;
//           case 3: resp.feedback.tiga+=1; break;
//           default:
//             break;
//         }

//         const start = dayjs(q.datetime);
//         const proses = dayjs(q.datetimeP);
//         const finish = dayjs(q.datetimeF);

//         resp.rataRespon.proses.push(dayjs.duration(proses.diff(start)));
//         resp.rataRespon.selesai.push(dayjs.duration(finish.diff(proses)));

//       })
//       resp.user+=1;
//     });
//     const Totalproses = resp.rataRespon.proses.reduce((sum, val) => sum + val, 0);
//     const RptosesMs = Totalproses / resp.rataRespon.proses.length;
//     resp.rataRespon.Rproses = dayjs.duration(RptosesMs);

//     const TotalSelesai = resp.rataRespon.selesai.reduce((sum, val) => sum + val, 0);
//     const RselesaiMs = TotalSelesai / resp.rataRespon.selesai.length;
//     resp.rataRespon.Rselesai = dayjs.duration(RselesaiMs);

    

//     return new NextResponse(
//       JSON.stringify({ success: true, users: resp }),
//       {
//         status: 200,
//         headers: {
//           'Content-Type': 'application/json',
//           'Cache-Control': 's-maxage=60, stale-while-revalidate',
//         },
//       }
//     );

//   } catch (err: any) {
//     console.error('Error listing users:', err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function GET(req: NextRequest) {
//   const { xAdmin, err } = await isAdmin(req);
//   if (xAdmin == 0) {
//     return NextResponse.json({ error: err }, { status: 400 });
//   }

//   try {
//     const userRef = db.collection("user");
//     const snapshot = await userRef.get();

//     if (snapshot.empty) {
//       throw "data user masih kosong !!!";
//     }

//     const resp = {
//       user: 0,
//       aktivitas: {
//         darurat: 0,
//         laporan: 0,
//         total:0,
//         selesai:0
//       },
//       feedback: {
//         satu: 0,
//         dua: 0,
//         tiga: 0,
//         persentase: 0
//       },
//       rataRespon: {
//         proses: [],
//         selesai: [],
//         Rproses: {},
//         Rselesai: {},
//         RprosesString: '',
//         RselesaiString: ''
//       }
//     };

//     const sekarang = dayjs();

//     snapshot.docs
//       .filter(v => {
//         const { role } = v.data();
//         return role == '';
//       })
//       .forEach((v, i) => {
//         (v.data().aktivitas ? v.data().aktivitas : []).forEach((q, w) => {
//           if (q.kategori == "darurat") {
//             resp.aktivitas.darurat += 1;
//           } else {
//             resp.aktivitas.laporan += 1;
//           }
//           resp.aktivitas.total += 1;
          
//           if(Number(q.aktif)==2){
//             const tanggal = dayjs(q.datetimeF);
//             const isBulanIni = tanggal.month() === sekarang.month() && tanggal.year() === sekarang.year();
//             if(isBulanIni){
//               resp.aktivitas.selesai+=1;
//             }
//           }

//           switch (q.feedback) {
//             case 1: resp.feedback.satu += 1; break;
//             case 2: resp.feedback.dua += 1; break;
//             case 3: resp.feedback.tiga += 1; break;
//             default: break;
//           }

//           const start = dayjs(q.datetime);
//           if(q.datetimeP!=undefined){
//             const proses = dayjs(q.datetimeP);  
//             resp.rataRespon.proses.push(dayjs.duration(proses.diff(start)));
//             if(q.datetimeF!=undefined){
//               const finish = dayjs(q.datetimeF);  
//               resp.rataRespon.selesai.push(dayjs.duration(finish.diff(proses)));
//             }
//           }
          
//         });

//         resp.user += 1;
//       });

//     const Totalproses = resp.rataRespon.proses.reduce((sum, val) => sum + val.asMilliseconds(), 0);
//     const RptosesMs = Totalproses / resp.rataRespon.proses.length;
//     resp.rataRespon.Rproses = dayjs.duration(RptosesMs);

//     const TotalSelesai = resp.rataRespon.selesai.reduce((sum, val) => sum + val.asMilliseconds(), 0);
//     const RselesaiMs = TotalSelesai / resp.rataRespon.selesai.length;
//     resp.rataRespon.Rselesai = dayjs.duration(RselesaiMs);

//     const formatDurasi = (dur) => {
//       const hari = dur.days();
//       const jam = dur.hours();
//       const menit = dur.minutes();
//       const detik = dur.seconds();

//       const parts = [];
//       if (hari) parts.push(`${hari} hari`);
//       if (jam) parts.push(`${jam} jam`);
//       if (menit) parts.push(`${menit} menit`);
//       if (detik || parts.length === 0) parts.push(`${detik} detik`);

//       return parts.join(' ');
//     };

//     resp.rataRespon.RprosesString = formatDurasi(resp.rataRespon.Rproses);
//     resp.rataRespon.RselesaiString = formatDurasi(resp.rataRespon.Rselesai);

//     return new NextResponse(
//       JSON.stringify({ success: true, data: resp }),
//       {
//         status: 200,
//         headers: {
//           'Content-Type': 'application/json',
//           'Cache-Control': 's-maxage=60, stale-while-revalidate',
//         },
//       }
//     );

//   } catch (err: any) {
//     console.error('Error listing users:', err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


import { NextResponse, NextRequest } from "next/server";
import { db, isAdmin } from "@/lib/LFirebaseAdmin";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import type { Duration } from "dayjs/plugin/duration";
import { DashboardResp } from "@/types";


dayjs.extend(duration);

export async function GET(req: NextRequest) {
  const { xAdmin, err } = await isAdmin(req);
  if (typeof xAdmin=="number") {
    return NextResponse.json({ error: err }, { status: 400 });
  }

  try {
    const snapshot = await db.collection("user").get();
    if (snapshot.empty) {
      throw new Error("Data user masih kosong.");
    }

    const resp = {
      user: 0,
      aktivitas: {
        darurat: 0,
        laporan: 0,
        total: 0,
        selesai: 0,
      },
      feedback: {
        satu: 0,
        dua: 0,
        tiga: 0,
        persentase: 0,
      },
      rataRespon: {
        proses: [] as Duration[],
        selesai: [] as Duration[],
        Rproses: dayjs.duration(0),
        Rselesai: dayjs.duration(0),
        RprosesString: "",
        RselesaiString: "",
      },
    } as DashboardResp;

    const sekarang = dayjs();

    snapshot.docs
      .filter((doc) => doc.data().role === "")
      .forEach((doc) => {
        const data = doc.data();
        const aktivitas = Array.isArray(data.aktivitas) ? data.aktivitas : [];

        aktivitas.forEach((q) => {
          if (q.kategori === "darurat") {
            resp.aktivitas.darurat += 1;
          } else {
            resp.aktivitas.laporan += 1;
          }
          resp.aktivitas.total += 1;

          if (Number(q.aktif) === 2 && q.datetimeF) {
            const tanggal = dayjs(q.datetimeF);
            const isBulanIni =
              tanggal.month() === sekarang.month() &&
              tanggal.year() === sekarang.year();
            if (isBulanIni) {
              resp.aktivitas.selesai += 1;
            }
          }

          switch (q.feedback) {
            case 1:
              resp.feedback.satu += 1;
              break;
            case 2:
              resp.feedback.dua += 1;
              break;
            case 3:
              resp.feedback.tiga += 1;
              break;
          }

          const start = dayjs(q.datetime);
          if (q.datetimeP) {
            const proses = dayjs(q.datetimeP);
            resp.rataRespon.proses.push(dayjs.duration(proses.diff(start)));

            if (q.datetimeF) {
              const finish = dayjs(q.datetimeF);
              resp.rataRespon.selesai.push(dayjs.duration(finish.diff(proses)));
            }
          }
        });

        resp.user += 1;
      });

    const totalProsesMs = resp.rataRespon.proses.reduce(
      (sum, dur) => sum + dur.asMilliseconds(),
      0
    );
    const rataProsesMs =
      resp.rataRespon.proses.length > 0
        ? totalProsesMs / resp.rataRespon.proses.length
        : 0;
    resp.rataRespon.Rproses = dayjs.duration(rataProsesMs);

    const totalSelesaiMs = resp.rataRespon.selesai.reduce(
      (sum, dur) => sum + dur.asMilliseconds(),
      0
    );
    const rataSelesaiMs =
      resp.rataRespon.selesai.length > 0
        ? totalSelesaiMs / resp.rataRespon.selesai.length
        : 0;
    resp.rataRespon.Rselesai = dayjs.duration(rataSelesaiMs);

    const formatDurasi = (dur: Duration): string => {
      const hari = dur.days();
      const jam = dur.hours();
      const menit = dur.minutes();
      const detik = dur.seconds();

      const parts: string[] = [];
      if (hari) parts.push(`${hari} hari`);
      if (jam) parts.push(`${jam} jam`);
      if (menit) parts.push(`${menit} menit`);
      if (detik || parts.length === 0) parts.push(`${detik} detik`);

      return parts.join(" ");
    };

    resp.rataRespon.RprosesString = formatDurasi(resp.rataRespon.Rproses);
    resp.rataRespon.RselesaiString = formatDurasi(resp.rataRespon.Rselesai);

    return new NextResponse(JSON.stringify({ success: true, data: resp }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=60, stale-while-revalidate",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error listing users:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
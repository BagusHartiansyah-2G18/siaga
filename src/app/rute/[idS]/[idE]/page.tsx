// "use client";
// import { useState,useEffect,use } from "react";
// import dynamic from "next/dynamic";
// const MapView = dynamic(() => import("@/components/MapViewRoute"), {
//   ssr: false, // <- penting! jangan render di server
// });

// import Slokasi  from "@/services/Slokasi";
// import { GeolocationService, LocationData, PermissionState } from '@/lib/Lgeoloation';

// interface Props {
//   params: Promise<{
//     idS: string;
//     idE: string;
//   }>;
// }


// export default function rute({ params }: Props) {
//   const { idS,idE } = use(params);
//   const [start, _start] = useState({});
//   const [end, _end] = useState({}); 
//   useEffect(() => {
//     async function fetchData({latitude,longitude}:object) {
//       const xdt = await Slokasi.__(`?idS=${idS}&idE=${idE}`);
//       let kon = true;
//       if (xdt) {
//           xdt.forEach((x,i) => {
//             let okPetugas = x.aktivitas.length==0;
//             const {lokasi,lokasix,lokasiy} = xdt[(okPetugas?(i==0?1:0):i)].aktivitas[0];
//             if(okPetugas && lokasiy==undefined){
//                 const dlok= (lokasiy || latitude ? [x.nama,JSON.parse(`[${lokasiy}]`)]: (latitude==undefined?["Kantor SATPOL PP, (LOKASI ANDA TIDAK DAPAT DIAKSES)",[-8.752074014286272, 116.85467152660803]]:["anda",[latitude,longitude]])); 
//                 _start({
//                   nama:dlok[0],
//                   lokasi:dlok[1]
//                 });
//             }else{
//               if( kon && lokasiy!=undefined){
//                 _start({
//                   nama:x.nama,
//                   lokasi:JSON.parse(lokasiy)
//                 });
//                 kon =false;
//               }else{
//                 _end({
//                   nama:x.nama,
//                   lokasi:(lokasix != undefined ? JSON.parse(lokasix):JSON.parse(`[${lokasi}]`))
//                 })
//               }
//             }
//           }); 
//       }
//     }

//     // async function ambilLokasi() {
//     //   const status = GeolocationService.checkPermission();
//     //   try {
//     //       const data = GeolocationService.getCurrentLocation();
//     //       fetchData(data);
//     //   } catch (err: any) {
//     //     console.log(`eror ambilLokasi : ${err}`);
//     //     fetchData([]);
//     //   }
//     // }
//     // ambilLokasi();
//     fetchData([]);
    
    
//   }, [idS, idE]); 
  
//   if(Object.keys(start).length ==0 || Object.keys(end).length ==0){
//     return (
//         <div className="flex items-center justify-center h-screen bg-gray-100">
//           <div className="flex flex-col items-center">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
//             <p className="mt-4 text-gray-600 text-lg">Loading, please wait...</p>
//           </div>
//         </div>
//       )
//   }

//   return (
//     <main className="flex-1 overflow-auto space-y-6">
//       <section className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 text-white px-6 py-20">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="text-5xl font-extrabold tracking-tight mb-4">SIAGA TRANTIBUM</h1>
//           <p className="text-lg opacity-90 mb-8">
//             Sistem Informasi Ketertiban Umum dan Keamanan Lingkungan.  
//             Kolaborasi warga dan petugas dalam menjaga kenyamanan bersama.
//           </p>
//         </div>
//         <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-3xl"></div>
//       </section>
//       <MapView Dstart={start} Dend={end}  />
//       <footer className="bg-gray-100 text-center py-6 text-sm text-gray-500">
//         &copy; {new Date().getFullYear()} Sumbawa Barat 
//       </footer>
//     </main>
//   );
// }


"use client";
import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
const MapView = dynamic(() => import("@/components/MapViewRoute"), {
  ssr: false,
});

import Slokasi from "@/services/Slokasi";
import { GeolocationService, LocationData, PermissionState } from "@/lib/Lgeoloation";
import { Iaktivitas, Iuser } from "@/types";

interface Props {
  params: Promise<{
    idS: string;
    idE: string;
  }>;
}

export default function rute({ params }: Props) {
  const { idS, idE } = use(params);
  const [start, _start] = useState({});
  const [end, _end] = useState({});

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchData({ latitude, longitude }: { latitude?: number; longitude?: number }) {
      const xdt = await Slokasi.__(`?idS=${idS}&idE=${idE}`) as Iuser[];
      let kon = true;
      if (xdt) {
        xdt.forEach((x, i) => {
          let okPetugas = x.aktivitas.length === 0; 
          
          const { lokasi, lokasix, lokasiy } = xdt[(okPetugas ? (i === 0 ? 1 : 0) : i)].aktivitas[0];
          if (okPetugas && lokasiy === undefined) {
            const dlok =
              lokasiy || latitude
                ? [x.nama, JSON.parse(`[${lokasiy}]`)]
                : latitude === undefined
                ? [
                    "Kantor SATPOL PP, (LOKASI ANDA TIDAK DAPAT DIAKSES)",
                    [-8.752074014286272, 116.85467152660803],
                  ]
                : ["anda", [latitude, longitude]];
            _start({
              nama: dlok[0],
              lokasi: dlok[1],
            });
          } else {
            if (kon && lokasiy !== undefined) {
              _start({
                nama: x.nama,
                lokasi: JSON.parse(lokasiy),
              });
              kon = false;
            } else {
              _end({
                nama: x.nama,
                lokasi:
                  lokasix !== undefined ? JSON.parse(lokasix) : JSON.parse(`[${lokasi}]`),
              });
            }
          }
        });
      }
    }

    async function ambilLokasiDanUpdate() {
      try {
        const status = await GeolocationService.checkPermission();
        if (status === "granted") {
          const data = await GeolocationService.getCurrentLocation();
          fetchData(data);
        } else {
          fetchData({});
        }
      } catch (err) {
        console.log(`eror ambilLokasi : ${err}`);
        fetchData({});
      }
    }

    ambilLokasiDanUpdate(); // panggilan pertama

    intervalId = setInterval(() => {
      ambilLokasiDanUpdate(); // panggilan berkala
    }, 30000); // 30 detik

    return () => clearInterval(intervalId); // cleanup saat unmount
  }, [idS, idE]);

  if (Object.keys(start).length === 0 || Object.keys(end).length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading, please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-auto space-y-6">
      <section className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 text-white px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">SIAGA TRANTIBUM</h1>
          <p className="text-lg opacity-90 mb-8">
            Sistem Informasi Ketertiban Umum dan Keamanan Lingkungan. Kolaborasi warga dan petugas
            dalam menjaga kenyamanan bersama.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-3xl"></div>
      </section>
      <MapView Dstart={start} Dend={end} />
      <footer className="bg-gray-100 text-center py-6 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Sumbawa Barat
      </footer>
    </main>
  );
}
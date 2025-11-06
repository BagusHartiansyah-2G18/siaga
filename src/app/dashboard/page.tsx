"use client";
import { useState,useEffect } from "react";
import dynamic from "next/dynamic";
import { GeolocationService, LocationData, PermissionState } from '@/lib/Lgeoloation';


const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false, // <- penting! jangan render di server
});
import Cchart from "@/components/Cchart";

import Saktivitas  from "@/services/Saktivitas";
import { DashboardResp, Iaktivitas } from "@/types";

export default function Dashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const [daktivitas, _daktivitas] = useState<Iaktivitas[]>();
    const [rekapan, _rekapan] = useState<DashboardResp>();
    const [dlocations, _dlocations] = useState<Iaktivitas[]>();
    const [dchart, _dchart] = useState({});
    
    const cardITotal=({judul,value}:{judul:string,value:number})=>{
        return (
            <div className="bg-white shadow rounded p-4 m-4">
                <h6>{judul}</h6>
                <h1><b>{value}</b></h1>
            </div>
        )
    } 

    // location 
    // const [lokasi, setLokasi] = useState<LocationData | null>(null);
    // const [error, setError] = useState<string | null>(null);
    // const [izin, setIzin] = useState<PermissionState>('prompt');


    useEffect(() => {
        const allaktivitas = async () => {
            const xdt = await Saktivitas.__allAktif() as Iaktivitas[]; 
            if(xdt){
                const mappedLocations: Iaktivitas[] = xdt.map((v) => ({
                    lat: v.lat ?? "",
                    lng: v.lng ?? "",
                    nama: String(v.nama ?? ""),
                    kategori: v.kategori ?? "",
                    judul: v.judul ?? "",
                    key: String(v.key ?? ""),
                    aktif: v.aktif ?? "",
                    nmPetugas: String(v.nmPetugas ?? ""),
                    id:v.id
                    }));

                _daktivitas(xdt);
                _dlocations(mappedLocations);
            }

            const xdtx = await Saktivitas.__allRekapan() as DashboardResp; 
            if(xdtx){
                const {
                    satu,
                    dua,
                    tiga,
                    persentase
                } = xdtx.feedback;
                _dchart({
                    "Tidak Puas":satu,
                    "Biasa Saja":dua,
                    "Sangat Puas":tiga
                })
                _rekapan(xdtx);
            }
        };
        allaktivitas();

        async function ambilLokasi() {
            const status = await GeolocationService.checkPermission();
            try {
                const data = await GeolocationService.getCurrentLocation();
            } catch (err: any) {
            }
        }
        ambilLokasi();


    }, []);
     
  return (
    <main className="p-6 flex-1 overflow-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mt-6">
                <Cchart
                    data={{
                        labels: Object.keys(dchart),
                        datasets: [
                        {
                            label: "Jumlah Feedback",
                            data: Object.values(dchart),
                            backgroundColor: ["#22c55e", "#eab308", "#ef4444"],
                        },
                        ],
                    }}
                />
            </div>
            {typeof rekapan == "object" && Object.keys(rekapan).length != 0 &&
                <div style={{height:"100%"}}>
                    {cardITotal({judul:"Pengguna",value:rekapan.user})}
                    {cardITotal({judul:"Laporan Masuk",value:rekapan.aktivitas.total})}
                    {cardITotal({judul:"Laporan Selesai (Bulan Ini)",value:rekapan.aktivitas.selesai})}
                </div>
            }
        </div>
        {typeof rekapan == "object" &&  Object.keys(rekapan).length != 0 &&
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cardITotal({judul:"Rata-rata Waktu Respon",value:Number(rekapan.rataRespon.RprosesString)})}
                {cardITotal({judul:"Rata-rata Waktu Bertindak",value:Number(rekapan.rataRespon.RselesaiString)})}
            </div>
        }
        
        
        <div className="bg-white shadow rounded p-4">
        <div className="h-64 bg-gray-200 rounded">
            <MapView defaultLocations={dlocations??[]}/>
        </div>
        </div>
        <div className="bg-white shadow rounded p-4">
        <table className="min-w-full">
            <thead>
            <tr className="bg-gray-50">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr className="border-b">
                <td className="px-4 py-2">Alice</td>
                <td className="px-4 py-2">Active</td>
                <td className="px-4 py-2">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="ml-2 text-red-600 hover:underline">Delete</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </main>
  );
}

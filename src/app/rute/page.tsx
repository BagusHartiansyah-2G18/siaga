"use client";
import { useState,useEffect } from "react";
import dynamic from "next/dynamic";
const MapView = dynamic(() => import("@/components/MapViewRoute"), {
  ssr: false, // <- penting! jangan render di server
});
import { useRouter } from 'next/router';


export default function rute(params:object) {
  // const { idS,idE } = params;

  useEffect(() => {
  }, []);

  return (
    <main className="flex-1 overflow-auto space-y-6">
      <section className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 text-white px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">SIAGA TRANTIBUM</h1>
          <p className="text-lg opacity-90 mb-8">
            Sistem Informasi Ketertiban Umum dan Keamanan Lingkungan.  
            Kolaborasi warga dan petugas dalam menjaga kenyamanan bersama.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-3xl"></div>
      </section>
      <MapView Dstart={[-6.2, 106.8]} Dend={[-6.21, 106.82]}  />
      <footer className="bg-gray-100 text-center py-6 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Sumbawa Barat 
      </footer>
    </main>
  );
}

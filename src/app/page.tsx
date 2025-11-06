'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { __duser } from '../lib/firebase';
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
      const user = __duser();
      console.log(user);
      
      if(user!=null && typeof user =="object" && user.id!=""){
          router.replace('/dashboard');
      }
     
    // const unsubscribe = onAuthStateChanged(authUser, (user) => {
    //   if (user) { 
    //     router.replace('/dashboard');
    //   }
    // });
    // return () => unsubscribe();
  }, []);
  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans">
      <div className="text-gray-900">        
        <section className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 text-white px-6 py-20">
          <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="md:w-1/2 mb-8 md:mb-0">
                      <h1 className="text-white font-bold text-5xl leading-tight mb-6">Sistem Pengaduan dan Pelaporan Cepat</h1>
                      <p className="p-2 text-white text-xl mb-8" style={{textAlign:'justify'}}>menerima laporan dan melakukan penanganan cepat, layanan ini juga menghadirkan fasilitas antar warga langsung ke rumah atau tempat tujuan bagi mereka yang merasa terancam atau ragu pulang karena sudah larut malam.</p>
                      <a href="#"
                          className="px-6 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-700 transition duration-200">Donwload Now</a>
                  </div>
                  <div className="md:w-1/2">
                      <img src="/image1.png" alt="Coffee beans"
                          className="w-full rounded-lg shadow-lg"/>
                  </div>
              </div>
          </div>
        </section>
        <section className="bg-white px-6 py-16">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
            <FeatureCard
              title="Laporan Cepat"
              desc="Laporkan pelanggaran trantibum langsung dari aplikasi dengan bukti foto dan lokasi."
              icon="📸"
            />
            <FeatureCard
              title="Peta Interaktif"
              desc="Pantau status laporan dan titik rawan di wilayahmu secara real-time."
              icon="🗺️"
            />
            <FeatureCard
              title="Kolaborasi Warga"
              desc="Warga dan petugas saling terhubung untuk menciptakan lingkungan yang aman."
              icon="🤝"
            />
          </div>
        </section>
      </div>
  </main>
  );
}

function FeatureCard({ title, desc, icon }:{title:string, desc:string, icon:string}) {
  return (
    <div className="p-6 border rounded-xl shadow hover:shadow-md transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold mb-2 text-blue-700">{title}</h2>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

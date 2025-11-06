"use client"; 
import React, { useEffect,useState} from "react";
import Link from "next/link";
import { HomeIcon, ChartBarIcon, ChartPieIcon, Bars3Icon, UserCircleIcon, InformationCircleIcon,ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { authUser,__duser,sendNotif,_token,__token, __doc, logoutUser} from "../../lib/firebase";
import { requestForToken, onMessageListener } from "@/lib/firebaseClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const [notifEnabled, setNotifEnabled] = useState(false);
    const [idUser, _idUser] = useState("");
    const [showModal, _showModal] = useState(false);
    const [loading, _loading] = useState(true);
    const [nmUser, _nmUser] = useState("");
    
    const router = useRouter();
    
    
    
    useEffect(() => {
      const user = __duser();
      console.log(user);
      
      if(user==null || typeof user !="object" || user.id==""){
          return router.replace('/');
      }
      if(user.role == "admin"){
        _loading(false);
        _idUser(user.uid);
        _nmUser(user.nama);
        // const oldToken = await __token();
        // const token = await requestForToken();
        // if (oldToken == token) { 
        //   _token({token:String(token), idUser:user.uid});
        // //   sendNotif({token});
        // }else{
        //   _showModal(true);
        //   setNotifEnabled(false);
        // } 

      }else{
        router.replace('/');
      }

        // const unsubscribe = onAuthStateChanged(authUser, async (user) => {
        //   if (!user) { 
        //     router.replace('/');
        //   } else {
            // __doc({ nmColl:'user', id:user.uid}).then(async r=>{
            //   const xdt = r.data(); 
            //   if(xdt.role == "admin"){
            //     _loading(false);
            //     _idUser(user.uid);
            //     _nmUser(xdt.nama);
            //     const oldToken = await __token();
            //     const token = await requestForToken();
            //     if (oldToken == token) { 
            //       _token({token:String(token), idUser:user.uid});
            //     //   sendNotif({token});
            //     }else{
            //       _showModal(true);
            //       setNotifEnabled(false);
            //     } 

            //   }else{
            //     router.replace('/');
            //   }
            // })
        //   }
        // });
    
    
        const unsubscribex = onMessageListener((payload:any) => { 
          console.log("📩 Pesan masuk (foreground):", payload);
          if (payload.notification) {
            // alert(`${payload.notification.title}: ${payload.notification.body}`);
            const result = confirm(`${payload.notification.title}\n${payload.notification.body}\n\n👉 Mau buka sekarang?`);
            if (result) {
              window.open(window.location.origin+"/dashboard", "_blank");
            } else {
              console.log("User tidak akses notifikasi");
            }
          }
        });
        
        return () => {
          // unsubscribe();
          unsubscribex();
        };
      }, [router]);

    
    const handleEnableNotif = async () => {
        try {
          const token = await requestForToken();
          if (token) { 
            _token({token, idUser});
            setNotifEnabled(true); 
            // TODO: simpan ke Firestore biar server bisa kirim notif
          } else {
            console.warn("⚠️ Token tidak didapat");
          }
        } catch (err) {
          console.error("❌ Error minta token:", err);
        }
    };

    if(loading){
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading, please wait...</p>
          </div>
        </div>
      )
    }
    return (
    <div className="flex min-h-screen bg-gray-100">
        <aside
            // className={`flex flex-col bg-white border-r shadow-md h-screen transition-all duration-300 ${
            // collapsed ? "w-20" : "w-64"
            // }`}
            className={`sticky top-0 h-screen overflow-y-auto bg-white  shadow-md transition-all duration-300 ${
              collapsed ? "w-20" : "w-64"
              }`}
        >
            <div
            className={`h-16 flex items-center px-4 justify-between ${
                collapsed ? "justify-center" : ""
            }`}
            >
            {!collapsed &&  <Link href="/dashboard"><span className="text-xl font-bold">Dashboard</span> </Link>}
            
            <button
                className="p-2 rounded hover:bg-gray-200 focus:outline-none"
                onClick={() => setCollapsed(!collapsed)}
            >
                <Bars3Icon className="h-6 w-6" />
            </button>
            </div>
            <nav className={`flex-1 px-2 space-y-2 mt-4 ${collapsed ? "items-center" : ""}`}>
            <Link
                href="/dashboard/akun"
                className={`flex items-center px-2 py-2 rounded hover:bg-gray-200 ${
                collapsed ? "justify-center" : ""
                }`}
            >
                <UserCircleIcon className="h-6 w-6 text-gray-700" />
                {!collapsed && <span className="ml-3">Akun</span>}
            </Link>
            <Link
                href="/dashboard/data"
                className={`flex items-center px-2 py-2 rounded hover:bg-gray-200 ${
                collapsed ? "justify-center" : ""
                }`}
            >
                <ChartPieIcon className="h-6 w-6 text-gray-700" />
                {!collapsed && <span className="ml-3">Data</span>}
            </Link>
            <Link
                href="/dashboard/laporan"
                className={`flex items-center px-2 py-2 rounded hover:bg-gray-200 ${
                collapsed ? "justify-center" : ""
                }`}
            >
                <ChartBarIcon className="h-6 w-6 text-gray-700" />
                {!collapsed && <span className="ml-3">Laporan</span>}
            </Link>
            <button
                onClick={logoutUser}
                className={`flex items-center w-full px-2 py-2 rounded hover:bg-red-100 text-red-600 ${collapsed ? "justify-center" : ""}`}
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
                {!collapsed && <span className="ml-3">Logout</span>}
            </button>

            </nav>
        </aside>

        {/* Konten utama */}
        
        <div className="flex-1 flex flex-col">
            <header 
              // className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm"
               className="sticky top-0 z-10 h-16 bg-white flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center space-x-4">
                {/* <button
                className="p-2 rounded hover:bg-gray-200 focus:outline-none"
                onClick={() => setCollapsed(!collapsed)}
                >
                <Bars3Icon className="h-6 w-6" />
                </button> */}
                <input
                type="text"
                placeholder="Search..."
                className="border rounded px-3 py-1 focus:outline-none"
                />
            </div>
            <div className="flex items-center space-x-4">
                {/* Notification icon contoh pakai Heroicons juga */}
                <button className="relative">
                  <InformationCircleIcon className="h-6 w-6 text-gray-700" />
                  <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center space-x-2">
                {/* <img
                    src="/globe.svg"
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                /> */}
                <UserCircleIcon className="w-8 h-8 rounded-full"></UserCircleIcon>
                {!collapsed && <span>{nmUser ? nmUser : "-"}</span>}
                </div>
            </div>
            </header>
            {children}
            <footer className="bg-white  text-center p-4 text-sm text-gray-500">
            © 2025 SIAGA
            </footer>

            {showModal && !notifEnabled && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 text-white">
                    Konfirmasi
                    </h2>
                    <p className="text-gray-600 text-gray-300 mb-6">
                    Untuk merespon dengan cepat, aktifkan notifikasi.
                    </p>
                    <div className="flex justify-end space-x-2"> 
                    <button
                        onClick={handleEnableNotif}
                        className="px-4 py-2 rounded bg-blue-600 text-white"
                    >
                        Aktifkan
                    </button>
                    </div>
                </div>
            </div>
            )}
        </div>
    </div>   
    );
}


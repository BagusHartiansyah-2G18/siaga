'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import { _duser} from "@/lib/firebase";
import Lfetch from "@/lib/Lfetch";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const lfetch = new Lfetch();
  

  const handleLogin = async () => {
    try {
      setIsLoading(true); 
      const resp = await lfetch.post("/user/login",{email,password}) ;
      if (resp.success) {
        const { displayName,email,img,role,uid} = resp.data;
        _duser({nama:displayName,email,img,role,id:uid});
        
        // _duser();
        router.push("/"); 
      } else {
        alert("user belum terverifikasi...");  
      }
    } catch (error) {
      console.log(error);
      
      alert("Email atau password salah!");
    } finally{
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Masuk Siaga Trantibum</h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
           <button
      onClick={handleLogin}
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
      disabled={isLoading}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 mr-2 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
          ></path>
        </svg>
      ) : null}
      {isLoading ? 'Memuat...' : 'Masuk'}
    </button>

        </div>

        <p className="text-sm text-center text-gray-600 mt-6">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </main>
  );
}
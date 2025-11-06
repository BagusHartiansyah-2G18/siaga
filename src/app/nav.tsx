'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/auth/login';
  if(pathname.split("ute").length==2){
    return "";
  }
  
  return (
    <div className="hidden md:block">
      {isLoginPage ? (
        <Link href="/">
          <span className="py-3 px-8 text-sm bg-teal-500 hover:bg-teal-600 rounded text-white">
            Halaman Utama
          </span>
        </Link>
      ) : (
        <Link href="/auth/login">
          <span className="py-3 px-8 text-sm bg-teal-500 hover:bg-teal-600 rounded text-white">
            Login
          </span>
        </Link>
      )}
    </div>
  );
}
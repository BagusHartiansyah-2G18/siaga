"use client";
import { useEffect } from 'react';
import { ThemeProvider } from "next-themes";
import "./globals.css"; 
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import Link from "next/link";
import Navbar from './nav';
import { usePathname } from 'next/navigation';


export default function RootLayout({ children }:{children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration);
        })
        .catch((err) =>
          console.error("❌ Service Worker registration failed:", err)
        );
    }
  }, []);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');



  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Toaster position="top-right" />
          {!isDashboard && <header className="sticky top-0 bg-white shadow">
            <div className="container flex flex-col sm:flex-row justify-between items-center mx-auto py-4 px-8">
                <Link href="/">  
                  <div className="flex items-center text-2xl">
                      <div className="w-12 mr-3">
                          <img src="/a.png" alt="logo"/>
                      </div>SPPC
                  </div>
                </Link>
                {/* <div className="flex mt-4 sm:mt-0">
                    <a className="px-4" href="#features">Login</a>
                    <a className="px-4" href="#services">Services</a>
                    <a className="px-4" href="#stats">Stats</a>
                    <a className="px-4" href="#testimonials">Testimonials</a>
                </div> */}
                <Navbar></Navbar>
            </div>
        </header>}
          {children}
        </ThemeProvider>

          {!isDashboard && <footer className="container-fluid py-16 px-3 mb-8 bg-gray-100 text-gray-800">
            <div className="flex -mx-3 justify-center">
                <div className="flex-1 px-3">
                    <h2 className="text-lg font-semibold">About Us</h2>
                    <p className="mt-5">Layanan Digital Siaga Ketertiban Umum dan Perlindungan Masyarakat</p>
                </div>
                <div className="flex-1 px-3">
                    <h2 className="text-lg font-semibold">Important Links</h2>
                    <ul className="mt-4 leading-loose">
                        <li><a href="/">Terms &amp; Conditions</a></li>
                        <li><a href="/">Privacy Policy</a></li>
                    </ul>
                </div>
                <div className="flex-1 px-3">
                    <h2 className="text-lg font-semibold">Social Media</h2>
                    <ul className="mt-4 leading-loose">
                        <li><a href="/">Facebook</a></li>
                        <li><a href="/">Instagram</a></li>
                        <li><a href="/">Tik Tok</a></li>
                    </ul>
                </div>
            </div>
        </footer>}
      </body>
    </html>
  );
}

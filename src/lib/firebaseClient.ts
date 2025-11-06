// // be 
// // src/lib/firebaseClient.ts
// import { initializeApp, getApps } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// // const firebaseConfig = {
// //   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
// //   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
// //   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
// //   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
// //   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
// //   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// // };
// const firebaseConfig = {
//   apiKey: "AIzaSyCNgdiQX_ZyzTXwRJhdyVz_268CupL6InM",
//   authDomain: "siagas-cc523.firebaseapp.com",
//   projectId: "siagas-cc523",
//   storageBucket: "siagas-cc523.firebasestorage.app",
//   messagingSenderId: "833025681646",
//   appId: "1:833025681646:web:e7e18d058e6ec70043ebff",
//   measurementId: "G-LS286N8VJL"
// };

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
// export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

// export async function requestForToken() {
//   if (!messaging) {
//     console.warn("⚠️ Firebase messaging belum diinisialisasi");
//     return null;
//   }

//   if (Notification.permission === "denied") {
//     console.warn("🚫 Notifikasi sudah diblokir oleh user");
//     return null;
//   }

//   try {
//     const permission = await Notification.requestPermission();
//     if (permission !== "granted") {
//       console.warn("⚠️ Izin notifikasi tidak diberikan");
//       return null;
//     } 
//     const token = await getToken(messaging, {
//       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
//     });

//     if (!token) {
//       console.warn("⚠️ Token FCM tidak tersedia");
//       return null;
//     }

//     console.log("✅ FCM Token:", token);
//     return token;
//   } catch (err: any) {
//     console.error("❌ Gagal ambil token FCM:", err.message || err);
//     return null;
//   }
// }

// export function onMessageListener() {
//   return new Promise((resolve) => {
//     if (!messaging) return;
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });
// }



// src/lib/firebaseClient.js
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// const app = !getApps().length
//   ? initializeApp(firebaseConfig)
//   : getApp();

// // Messaging in client side
// let messaging:unknown = null;
// if (typeof window !== "undefined") {
//   try {
//     messaging = getMessaging(app);
//   } catch (err) {
//     console.error("Error initializing messaging:", err);
//     messaging = null;
//   }
// }

// export async function requestForToken() {
//   if (!messaging) {
//     console.warn("Firebase messaging is not supported / not initialized");
//     return null;
//   }

//   const permission = await Notification.requestPermission();
//   if (permission !== "granted") {
//     console.log("Permission not granted for Notification");
//     return null;
//   }

//   try {
//     const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
//     const currentToken = await getToken(messaging, {
//       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
//       serviceWorkerRegistration: registration
//     });
//     return currentToken;
//   } catch (err) {
//     console.error("An error occurred getting token:", err);
//     return null;
//   }
// }

// export function onMessageListener(callback) {
//   if (!messaging) {
//     console.warn("Messaging not initialized for foreground onMessage");
//     return () => {};
//   }
//   const unsubscribe = onMessage(messaging, (payload) => {
//     callback(payload);
//   });
//   return unsubscribe;
// }

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  type Messaging,
  type MessagePayload,
} from "firebase/messaging";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inisialisasi Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi Messaging hanya di client
export let messaging: Messaging | null = null;
if (typeof window !== "undefined") {
  try {
    messaging = getMessaging(app);
  } catch (err) {
    console.error("❌ Gagal inisialisasi messaging:", err);
    messaging = null;
  }
}

// ✅ Ambil token FCM
export async function requestForToken(): Promise<string | null> {
  if (!messaging) {
    console.warn("⚠️ Firebase messaging belum tersedia di client");
    return null;
  }

  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    console.warn("🚫 Browser tidak mendukung Notification atau Service Worker");
    return null;
  }

  if (Notification.permission === "denied") {
    console.warn("🚫 Notifikasi sudah diblokir oleh user");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("⚠️ Izin notifikasi tidak diberikan");
      return null;
    }

    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("⚠️ Token FCM tidak tersedia");
      return null;
    }

    console.log("✅ FCM Token:", token);
    return token;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ Gagal ambil token FCM:", message);
    return null;
  }
}

// ✅ Listener untuk pesan di foreground
export function onMessageListener(callback: (payload: MessagePayload) => void): () => void {
  if (!messaging) {
    console.warn("⚠️ Messaging belum diinisialisasi");
    return () => {};
  }

  const unsubscribe = onMessage(messaging, callback);
  return unsubscribe;
}

// src/lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getMessaging, Messaging,isSupported } from "firebase/messaging";
 
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const authUser = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

// Firestore helpers
export { doc, getDoc, setDoc };

// LocalStorage helpers
export const _duser = (value: unknown): void => {
  localStorage.setItem("duser", JSON.stringify(value));
};

export const __duser = (): any | null => {
  try {
    const raw = localStorage.getItem("duser");
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Gagal parsing duser dari localStorage:", error);
    return null;
  }
};

export const _token = async ({
  token,
  idUser,
}: {
  token: string;
  idUser: string;
}): Promise<void> => {
  await setDoc(
    doc(getFirestore(app), "fcmTokens", idUser),
    {
      token,
      updatedAt: new Date(),
    },
    { merge: true }
  );
  localStorage.setItem("mfcToken", token);
};

export const __token = (): string | null => {
  return localStorage.getItem("mfcToken");
};

// Messaging (client-side only)
export const messagingPromise = isSupported().then((supported) =>
  supported ? getMessaging(app) : null
);
// Send notification
export const sendNotif = async ({
  token = "0",
  title = "siaga",
  body = "tester Notif !!!",
}: {
  token?: string;
  title?: string;
  body?: string;
}): Promise<void> => {
  const res = await fetch("/api/sendNotification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, title, body }),
  });

  await res.json();
};

// Firestore doc fetch
export const __doc = async ({
  nmColl,
  id,
}: {
  nmColl: string;
  id: string;
}): Promise<any> => {
  return await getDoc(doc(db, nmColl, id));
};

// Logout
export const logoutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    await signOut(authUser);
    localStorage.removeItem("duser");
    return { success: true };
  } catch (error: any) {
    console.error("Logout gagal:", error.message);
    return { success: false, error: error.message };
  }
};
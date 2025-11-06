import { NextResponse } from "next/server";
import admin, { ServiceAccount } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
// import serviceAccount from "../../../../../firebase-service-account.json";
import { keyFSA as serviceAccount } from "@/lib/Lcript";

// Init Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
}

const db = getFirestore();
export async function POST(req: Request) {
  try {
    const { token, title, body } = await req.json();
    // const snapshot = await db.collection("fcmTokens").get();
    // const tokens: string[] = [];

    // snapshot.forEach((doc) => {
    //     const data = doc.data();
    //     if (data.token) tokens.push(data.token);
    // });

    // if (tokens.length === 0) {
    //     return NextResponse.json({ error: "No tokens found" }, { status: 404 });
    // }
    const message = {
      token,
      notification: {
        title: title || "📢 Notifikasi Baru",
        body: body || "Ada update dari sistem",
      },
    };

    const response = await admin.messaging().send(message);

    return NextResponse.json({ success: true, messageId: response });
  } catch (err: any) {
    console.error("❌ Error kirim notifikasi:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


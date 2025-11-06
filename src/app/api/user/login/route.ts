import { NextRequest, NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authUser } from "../../../../lib/firebase";
import { db } from "@/lib/LFirebaseAdmin";

export async function POST(req: NextRequest) {
  const { email, password }: { email: string; password: string } = await req.json();

  try {
    // Sign in user
    await signInWithEmailAndPassword(authUser, email, password);
    const user = authUser.currentUser;

    if (!user || !user.uid) {
      throw new Error("User not found after sign-in.");
    }

    // Get Firestore user document
    const userRef = db.collection("user").doc(user.uid);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      throw new Error("User document not found in Firestore.");
    }

    const userData = docSnap.data();

    return NextResponse.json({
      success: true,
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: userData?.role ?? null,
        img: userData?.img ?? null,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Login error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
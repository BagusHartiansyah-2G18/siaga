import { NextRequest, NextResponse } from 'next/server';
import { auth,isUser, db } from '@/lib/LFirebaseAdmin';
export async function POST(req: Request) {
  const { id, token } = await req.json();
  const { xuser , err} = await isUser(id);
  if (xuser==0){
    return NextResponse.json({ error: err }, { status: 400 });
  }
  try {
    const userRef = db.collection("fcmTokens").doc(id);
    await userRef.set({
      token: token,
      updatedAt: new Date()
    }, { merge: true });
    return NextResponse.json({ success: true});
  } catch (err: any) {
    console.error('Error listing users:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
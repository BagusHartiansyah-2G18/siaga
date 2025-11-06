import { NextRequest, NextResponse } from 'next/server';
import { auth,isAdmin, db } from '@/lib/LFirebaseAdmin';
export async function POST(req: NextRequest) {
  const { xAdmin , err} = await isAdmin(req);
  if (xAdmin==0){
    return NextResponse.json({ error: err }, { status: 400 });
  }
  const { id,role } = await req.json();
  try {
    const userRef = db.collection("user").doc(id);
    const docSnap = await userRef.get();
    if (!docSnap.exists) {
      throw new Error(`User dengan ID '${id}' tidak ditemukan.`);
    }
    // throw new Error(`User dengan ID '${id}' tidak ditemukan.`);
    await userRef.update({
      role
    });
    return NextResponse.json({ success: true});
  } catch (err: any) {
    console.error('Error listing users:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
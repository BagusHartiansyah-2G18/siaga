import { NextRequest, NextResponse } from 'next/server';
import { auth,isAdmin } from '@/lib/LFirebaseAdmin';
export async function GET(req: NextRequest) {
  const { xAdmin , err} = await isAdmin(req);
  if (xAdmin==0){
    return NextResponse.json({ error: err }, { status: 400 });
  }
  try {
    const listUsersResult = await auth.listUsers(1000);
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      emailVerified: userRecord.emailVerified,
      creationTime: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime,
    }));

    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    console.error('Error listing users:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
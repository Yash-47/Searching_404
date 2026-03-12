import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    authSecretPresent: !!process.env.AUTH_SECRET,
    nextAuthSecretPresent: !!process.env.NEXTAUTH_SECRET,
    authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
    dbUrlPresent: !!process.env.DATABASE_URL,
  });
}

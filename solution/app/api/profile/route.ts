import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ profile: null });
    }

    const { generateRoadmap } = await import("@/lib/roadmapGenerator");
    const roadmap = generateRoadmap(profile.missingSkills as string[]);

    return NextResponse.json({ profile, roadmap });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[profile-get] ERROR:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

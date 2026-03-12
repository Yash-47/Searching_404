import { NextRequest, NextResponse } from "next/server";
import { analyzeSkillGap, getJobRoles } from "@/lib/skillGapEngine";
import { generateRoadmap } from "@/lib/roadmapGenerator";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skills, jobRole } = body as {
      skills?: string[];
      jobRole?: string;
    };

    if (!Array.isArray(skills)) {
      return NextResponse.json(
        { error: "skills must be an array of strings." },
        { status: 400 }
      );
    }

    if (!jobRole || typeof jobRole !== "string") {
      return NextResponse.json(
        { error: "Please provide a jobRole string." },
        { status: 400 }
      );
    }

    const validRoles = getJobRoles();
    if (!validRoles.includes(jobRole)) {
      return NextResponse.json(
        {
          error: `Invalid job role. Available roles: ${validRoles.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Analyze skill gap
    const gapResult = analyzeSkillGap(skills, jobRole);

    // Generate learning roadmap for missing skills
    const roadmap = generateRoadmap(gapResult.missingSkills);

    // Persist to DB if user is authenticated
    try {
      const session = await auth();
      if (session?.user?.id) {
        await prisma.profile.upsert({
          where: { userId: session.user.id },
          update: {
            targetRole: jobRole,
            detectedSkills: skills,
            matchedSkills: gapResult.matchedSkills,
            missingSkills: gapResult.missingSkills,
            bonusSkills: gapResult.bonusSkills,
            readinessScore: gapResult.readinessScore,
          },
          create: {
            userId: session.user.id,
            targetRole: jobRole,
            detectedSkills: skills,
            matchedSkills: gapResult.matchedSkills,
            missingSkills: gapResult.missingSkills,
            bonusSkills: gapResult.bonusSkills,
            readinessScore: gapResult.readinessScore,
          },
        });
      }
    } catch (dbErr) {
      // Non-fatal: log but don't fail the request
      console.warn("[skill-gap] DB persist failed:", dbErr);
    }

    return NextResponse.json({
      ...gapResult,
      roadmap,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[skill-gap]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET — return available job roles
export async function GET() {
  return NextResponse.json({ roles: getJobRoles() });
}


import { NextRequest, NextResponse } from "next/server";
import { refreshGitHubProfile, timeSince } from "@/lib/githubMonitor";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, previousSkills } = body as {
      username?: string;
      previousSkills?: string[];
    };

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid GitHub username." },
        { status: 400 }
      );
    }

    const prev = Array.isArray(previousSkills) ? previousSkills : [];
    const { result, newSkills, removedSkills, state } =
      await refreshGitHubProfile(username.trim(), prev);

    return NextResponse.json({
      skills: result.skills,
      repoCount: result.repoCount,
      languages: result.languages,
      topics: result.topTopics,
      newSkills,
      removedSkills,
      lastChecked: state.lastChecked,
      lastCheckedLabel: timeSince(state.lastChecked),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[github-refresh]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

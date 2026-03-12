import { NextRequest, NextResponse } from "next/server";
import { analyzeGitHubProfile } from "@/lib/githubAnalyzer";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body as { username?: string };

    // Accept both full URLs (https://github.com/username) and bare usernames
    const raw = (username ?? "").trim();
    const cleanUsername = raw
      .replace(/^https?:\/\//i, "")   // strip https://
      .replace(/^github\.com\//i, "")  // strip github.com/
      .replace(/\/.*$/, "")            // strip any trailing path
      .trim();

    if (!cleanUsername) {
      return NextResponse.json(
        { error: "Please provide a valid GitHub username." },
        { status: 400 }
      );
    }

    const result = await analyzeGitHubProfile(cleanUsername);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[github-skills]", message);

    const statusCode = message.includes("not found")
      ? 404
      : message.includes("rate limit")
      ? 429
      : 500;

    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

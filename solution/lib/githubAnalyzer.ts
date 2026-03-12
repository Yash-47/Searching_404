import { SKILL_DICTIONARY } from "@/data/skillDictionary";

interface GitHubRepo {
  language: string | null;
  topics: string[];
  name: string;
  description: string | null;
}

export interface GitHubAnalysisResult {
  skills: string[];
  languages: Record<string, number>;
  repoCount: number;
  topTopics: string[];
}

/**
 * Fetches public repos for a GitHub user and extracts skills from
 * programming languages, topics, and repo descriptions.
 */
export async function analyzeGitHubProfile(
  username: string
): Promise<GitHubAnalysisResult> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "SkillGapAnalyzer/1.0",
  };

  // Use GITHUB_TOKEN if available to increase rate limit (60 → 5000 req/hr)
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
    { headers }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`GitHub user "${username}" not found.`);
    }
    if (response.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Try again later.");
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const repos: GitHubRepo[] = await response.json();

  // --- Aggregate languages ---
  const languageCounts: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  }

  // --- Aggregate topics ---
  const topicCounts: Record<string, number> = {};
  for (const repo of repos) {
    for (const topic of repo.topics || []) {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    }
  }

  // Build combined text from languages + topics + descriptions for skill matching
  const languageText = Object.keys(languageCounts).join(" ");
  const topicText = Object.keys(topicCounts).join(" ");
  const descriptionText = repos
    .map((r) => r.description || "")
    .join(" ");

  const combinedText = `${languageText} ${topicText} ${descriptionText}`;

  // Match against skill dictionary (case-insensitive)
  const lower = combinedText.toLowerCase();
  const skills = SKILL_DICTIONARY.filter((skill) =>
    lower.includes(skill.toLowerCase())
  );

  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([t]) => t);

  return {
    skills: [...new Set(skills)],
    languages: languageCounts,
    repoCount: repos.length,
    topTopics,
  };
}

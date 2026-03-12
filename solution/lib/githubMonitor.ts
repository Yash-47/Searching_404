/**
 * GitHub Monitor — periodically re-fetches a GitHub profile
 * and returns a diff of newly discovered skills.
 */

import { analyzeGitHubProfile, GitHubAnalysisResult } from "./githubAnalyzer";

export interface GitHubMonitorState {
  username: string;
  skills: string[];
  repoCount: number;
  lastChecked: number;  // epoch ms
  checkCount: number;
}

/**
 * Fetch the current GitHub skill snapshot and diff vs a previous snapshot.
 * Returns the new skills discovered (delta) and the updated full state.
 */
export async function refreshGitHubProfile(
  username: string,
  previousSkills: string[]
): Promise<{
  result: GitHubAnalysisResult;
  newSkills: string[];
  removedSkills: string[];
  state: GitHubMonitorState;
}> {
  const result = await analyzeGitHubProfile(username);

  const prevSet = new Set(previousSkills.map((s) => s.toLowerCase()));
  const currSet = new Set(result.skills.map((s) => s.toLowerCase()));

  // Skills in new snapshot but not in previous
  const newSkills = result.skills.filter(
    (s) => !prevSet.has(s.toLowerCase())
  );

  // Skills in previous snapshot but not in current (edge case: repo deleted)
  const removedSkills = previousSkills.filter(
    (s) => !currSet.has(s.toLowerCase())
  );

  const state: GitHubMonitorState = {
    username,
    skills: result.skills,
    repoCount: result.repoCount,
    lastChecked: Date.now(),
    checkCount: 1,
  };

  return { result, newSkills, removedSkills, state };
}

/** Human-readable relative time string (e.g. "2 minutes ago") */
export function timeSince(epochMs: number): string {
  const seconds = Math.floor((Date.now() - epochMs) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

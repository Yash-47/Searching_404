import { matchSkills } from "@/data/skillDictionary";

/**
 * Extracts detected skills from raw resume text.
 * Uses keyword matching against the skill dictionary.
 */
export function parseResumeSkills(text: string): string[] {
  const skills = matchSkills(text);
  // Deduplicate
  return [...new Set(skills)];
}

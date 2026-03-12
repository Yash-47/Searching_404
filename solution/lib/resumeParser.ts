import { matchSkills } from "@/data/skillDictionary";

/**
 * Extracts detected skills from raw resume text.
 * Uses keyword matching against the skill dictionary.
 */
export function parseResumeSkills(text: string): string[] {
  // Normalize common versioned tech names to their base names for better matching
  const normalizedText = text
    .replace(/\bHTML5\b/gi, "HTML")
    .replace(/\bCSS3\b/gi, "CSS");

  const skills = matchSkills(normalizedText);
  // Deduplicate
  return [...new Set(skills)];
}

/**
 * Comprehensive skill dictionary imported from skillDictionary.json
 * Covers 18 domains: languages, frameworks, databases, cloud, devops,
 * data science, ML/AI, security, mobile, blockchain, game dev, IoT, networking, etc.
 */
import skillData from "./skillDictionary.json";

// ── Typed category map ────────────────────────────────────────
export type SkillCategory = keyof typeof skillData;

export const SKILL_CATEGORIES = skillData as Record<SkillCategory, string[]>;

// ── Flat deduplicated list of all skills ──────────────────────
export const SKILL_DICTIONARY: string[] = [
  ...new Set(
    Object.values(skillData).flat()
  ),
];

// ── Case-insensitive keyword matching ─────────────────────────
/**
 * Given any blob of text, return the list of known skills that appear in it.
 * Performs whole-word / boundary-aware matching (handles punctuation, slashes, etc.)
 */
export function matchSkills(text: string): string[] {
  const normalised = text.toLowerCase();

  return SKILL_DICTIONARY.filter((skill) => {
    const escaped = skill
      .toLowerCase()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")  // escape regex special chars
      .replace(/\s+/g, "[\\s/\\-_.]+");          // flexible whitespace/separator

    // word-boundary aware: preceded / followed by non-alphanumeric or start/end
    const pattern = new RegExp(
      `(?<![a-z0-9])${escaped}(?![a-z0-9])`,
      "i"
    );
    return pattern.test(normalised);
  });
}

// ── Per-category matching (useful for analytics / reporting) ──
/**
 * Returns skills from a specific category found in the text.
 */
export function matchSkillsInCategory(text: string, category: SkillCategory): string[] {
  const normalised = text.toLowerCase();

  return (SKILL_CATEGORIES[category] ?? []).filter((skill) => {
    const escaped = skill
      .toLowerCase()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\s+/g, "[\\s/\\-_.]+");

    const pattern = new RegExp(
      `(?<![a-z0-9])${escaped}(?![a-z0-9])`,
      "i"
    );
    return pattern.test(normalised);
  });
}

// ── Lookup: which category does a skill belong to? ───────────
export function getCategoryForSkill(skill: string): SkillCategory | null {
  const lower = skill.toLowerCase();
  for (const [cat, skills] of Object.entries(SKILL_CATEGORIES)) {
    if (skills.some((s) => s.toLowerCase() === lower)) {
      return cat as SkillCategory;
    }
  }
  return null;
}

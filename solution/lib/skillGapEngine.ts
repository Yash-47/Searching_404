import jobRolesData from "@/data/jobRoles.json";

export interface SkillGapResult {
  jobRole: string;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  bonusSkills: string[];    // skills detected but not required for the role
  readinessScore: number;   // 0–100
}

type JobRolesMap = Record<string, { required: string[] }>;
const jobRoles = jobRolesData as JobRolesMap;

/**
 * Compares detected skills against a job role's required skills.
 * Returns matched, missing, bonus skills and a career readiness score.
 */
export function analyzeSkillGap(
  detectedSkills: string[],
  jobRole: string
): SkillGapResult {
  const roleData = jobRoles[jobRole];
  if (!roleData) {
    throw new Error(`Job role "${jobRole}" not found.`);
  }

  const required = roleData.required;
  const detectedLower = detectedSkills.map((s) => s.toLowerCase());

  const matchedSkills = required.filter((skill) =>
    detectedLower.includes(skill.toLowerCase())
  );

  const missingSkills = required.filter(
    (skill) => !detectedLower.includes(skill.toLowerCase())
  );

  const requiredLower = required.map((s) => s.toLowerCase());
  const bonusSkills = detectedSkills.filter(
    (skill) => !requiredLower.includes(skill.toLowerCase())
  );

  const readinessScore =
    required.length > 0
      ? Math.round((matchedSkills.length / required.length) * 100)
      : 0;

  return {
    jobRole,
    requiredSkills: required,
    matchedSkills,
    missingSkills,
    bonusSkills,
    readinessScore,
  };
}

/**
 * Returns all available job role names.
 */
export function getJobRoles(): string[] {
  return Object.keys(jobRoles);
}

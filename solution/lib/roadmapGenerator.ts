import skillResourcesData from "@/data/skillResources.json";

export interface LearningResource {
  title: string;
  url: string;
  type: string;
}

export interface RoadmapItem {
  skill: string;
  resources: LearningResource[];
}

type SkillResourcesMap = Record<string, LearningResource[]>;
const skillResources = skillResourcesData as SkillResourcesMap;

/**
 * Generates a structured learning roadmap for a list of missing skills.
 * Maps each skill to curated resources from skillResources.json.
 * Skills without resources are still included (empty resources array).
 */
export function generateRoadmap(missingSkills: string[]): RoadmapItem[] {
  return missingSkills.map((skill) => ({
    skill,
    resources: skillResources[skill] ?? [],
  }));
}

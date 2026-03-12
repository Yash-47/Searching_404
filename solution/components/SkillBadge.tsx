interface SkillBadgeProps {
  skill: string;
  variant?: "matched" | "missing" | "bonus" | "neutral";
}

const variantMap: Record<string, string> = {
  matched: "badge badge-matched",
  missing: "badge badge-missing",
  bonus:   "badge badge-bonus",
  neutral: "badge badge-neutral",
};
const variantIcon: Record<string, string> = {
  matched: "✓", missing: "✗", bonus: "★", neutral: "",
};

export default function SkillBadge({ skill, variant = "neutral" }: SkillBadgeProps) {
  return (
    <span className={variantMap[variant]}>
      {variantIcon[variant] && <span style={{ fontSize: "0.62rem" }}>{variantIcon[variant]}</span>}
      {skill}
    </span>
  );
}

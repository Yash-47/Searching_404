import { LearningResource, ProjectIdea } from "@/lib/roadmapGenerator";

interface RoadmapCardProps {
  skill: string;
  resources: LearningResource[];
  projectIdeas: ProjectIdea[];
  index: number;
}

const typeEmoji: Record<string, string> = {
  documentation: "📄", course: "🎓", video: "🎬", tutorial: "⚡", book: "📚",
};
const difficultyColor: Record<string, string> = {
  Beginner: "#34d399",
  Intermediate: "#fbbf24",
  Advanced: "#f43f5e",
};

export default function RoadmapCard({ skill, resources, projectIdeas, index }: RoadmapCardProps) {
  return (
    <div className="glass-card animate-fade-in-up"
      style={{ padding: "1.25rem 1.5rem", animationDelay: `${index * 0.055}s`, animationFillMode: "both" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #f43f5e, #f97316)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.75rem", fontWeight: 800, color: "#fff", flexShrink: 0,
          boxShadow: "0 3px 12px rgba(244,63,94,0.30)" }}>{index + 1}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{skill}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            {resources.length} resource{resources.length !== 1 ? "s" : ""} · {projectIdeas.length} project idea{projectIdeas.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div style={{ marginBottom: projectIdeas.length > 0 ? "0.85rem" : 0 }}>
        {resources.length === 0 ? (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontStyle: "italic" }}>
            Search &quot;{skill}&quot; on YouTube or Google for tutorials.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {resources.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem",
                  padding: "0.55rem 0.8rem", background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px",
                  textDecoration: "none", transition: "all 0.2s ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.10)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.28)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>{typeEmoji[r.type] ?? "🔗"}</span>
                  <span style={{ fontSize: "0.83rem", color: "var(--text-primary)", fontWeight: 500 }}>{r.title}</span>
                </span>
                <span className="badge badge-type">{r.type}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Project Ideas */}
      {projectIdeas.length > 0 && (
        <div>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.10em",
            textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.55rem" }}>
            💡 Project Ideas
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {projectIdeas.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem",
                padding: "0.65rem 0.85rem", background: "rgba(99,102,241,0.05)",
                border: "1px solid rgba(99,102,241,0.12)", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.55rem",
                  borderRadius: "999px", whiteSpace: "nowrap", flexShrink: 0,
                  background: `${difficultyColor[p.difficulty]}18`,
                  border: `1px solid ${difficultyColor[p.difficulty]}44`,
                  color: difficultyColor[p.difficulty] }}>
                  {p.difficulty}
                </span>
                <div>
                  <div style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)" }}>{p.title}</div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>{p.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

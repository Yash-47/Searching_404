import { LearningResource } from "@/lib/roadmapGenerator";

interface RoadmapCardProps {
  skill: string;
  resources: LearningResource[];
  index: number;
}

const typeEmoji: Record<string, string> = {
  documentation: "📄", course: "🎓", video: "🎬", tutorial: "⚡", book: "📚",
};

export default function RoadmapCard({ skill, resources, index }: RoadmapCardProps) {
  return (
    <div className="glass-card animate-fade-in-up"
      style={{ padding: "1.25rem 1.5rem", animationDelay: `${index * 0.06}s`, animationFillMode: "both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #f43f5e, #f97316)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.75rem", fontWeight: 800, color: "#fff", flexShrink: 0,
          boxShadow: "0 3px 12px rgba(244,63,94,0.30)",
        }}>{index + 1}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{skill}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            {resources.length} resource{resources.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {resources.length === 0 ? (
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontStyle: "italic" }}>
          Search &quot;{skill}&quot; on YouTube or Google for tutorials.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
          {resources.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem",
                padding: "0.6rem 0.85rem", background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px",
                textDecoration: "none", transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.10)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.30)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>{typeEmoji[r.type] ?? "🔗"}</span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 500 }}>{r.title}</span>
              </span>
              <span className="badge badge-type">{r.type}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

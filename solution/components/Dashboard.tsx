"use client";

import { RoadmapItem } from "@/lib/roadmapGenerator";
import ScoreCard from "./ScoreCard";
import SkillBadge from "./SkillBadge";
import RoadmapCard from "./RoadmapCard";

interface DashboardProps {
  jobRole: string;
  detectedSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  bonusSkills: string[];
  readinessScore: number;
  roadmap: RoadmapItem[];
  onReset: () => void;
}

export default function Dashboard({ jobRole, detectedSkills, matchedSkills, missingSkills, bonusSkills, readinessScore, roadmap, onReset }: DashboardProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div className="section-label" style={{ marginBottom: "0.25rem" }}>Analysis Results</div>
          <h2 className="gradient-text" style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>{jobRole}</h2>
        </div>
        <button className="btn-secondary" onClick={onReset} id="reset-btn">← New Analysis</button>
      </div>

      {/* Score + Detected Skills */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.25rem", alignItems: "start" }}>
        <div style={{ minWidth: 210 }}>
          <ScoreCard score={readinessScore} matched={matchedSkills.length} total={matchedSkills.length + missingSkills.length} />
        </div>
        <div className="glass-card" style={{ padding: "1.5rem", height: "100%" }}>
          <div className="section-label">All Detected Skills ({detectedSkills.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", maxHeight: 200, overflowY: "auto" }}>
            {detectedSkills.length === 0
              ? <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No skills detected yet.</span>
              : detectedSkills.map((s) => <SkillBadge key={s} skill={s} variant={matchedSkills.includes(s) ? "matched" : "bonus"} />)
            }
          </div>
        </div>
      </div>

      {/* Readiness Bar */}
      <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
          <div className="section-label" style={{ margin: 0 }}>Career Readiness</div>
          <span style={{ fontSize: "0.875rem", fontWeight: 700, color: readinessScore >= 75 ? "#34d399" : readinessScore >= 50 ? "#fbbf24" : "#fb7185" }}>{readinessScore}%</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${readinessScore}%` }} />
        </div>
        <div style={{ marginTop: "0.5rem", fontSize: "0.76rem", color: "var(--text-muted)" }}>
          {matchedSkills.length} of {matchedSkills.length + missingSkills.length} required skills matched
          {bonusSkills.length > 0 && ` · ${bonusSkills.length} bonus skills`}
        </div>
      </div>

      {/* Matched + Missing */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
          <div className="section-label">✓ Matched ({matchedSkills.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            {matchedSkills.length === 0
              ? <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>None matched yet.</span>
              : matchedSkills.map((s) => <SkillBadge key={s} skill={s} variant="matched" />)
            }
          </div>
        </div>
        <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
          <div className="section-label">✗ Missing ({missingSkills.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            {missingSkills.length === 0
              ? <span style={{ fontSize: "0.82rem", color: "#34d399" }}>🎉 All required skills matched!</span>
              : missingSkills.map((s) => <SkillBadge key={s} skill={s} variant="missing" />)
            }
          </div>
        </div>
      </div>

      {/* Bonus Skills */}
      {bonusSkills.length > 0 && (
        <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
          <div className="section-label">★ Bonus Skills — Beyond the role ({bonusSkills.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            {bonusSkills.map((s) => <SkillBadge key={s} skill={s} variant="bonus" />)}
          </div>
        </div>
      )}

      {/* Learning Roadmap */}
      {roadmap.length > 0 && (
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <div className="section-label">🗺 Learning Roadmap</div>
            <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
              Curated learning resources and hands-on project ideas for each missing skill.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {roadmap.map((item, i) => (
              <RoadmapCard key={item.skill} skill={item.skill}
                resources={item.resources} projectIdeas={item.projectIdeas ?? []} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

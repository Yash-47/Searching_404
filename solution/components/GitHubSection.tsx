"use client";

import { useState } from "react";

interface GitHubSectionProps {
  onSkillsDetected: (skills: string[], repoCount: number) => void;
  onNewSkills?: (newSkills: string[]) => void;
}

export default function GitHubSection({ onSkillsDetected, onNewSkills }: GitHubSectionProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ repoCount: number; skillCount: number } | null>(null);
  const [skipped, setSkipped] = useState(false);
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [newSkillsDelta, setNewSkillsDelta] = useState<string[]>([]);

  async function fetchSkills(endpoint: string, prev: string[], isRefresh = false) {
    const setter = isRefresh ? setRefreshing : setLoading;
    setter(true); setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), previousSkills: prev }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to fetch GitHub data."); return; }

      const skills: string[] = data.skills ?? [];
      const newSkills: string[] = data.newSkills ?? [];

      setSuccess({ repoCount: data.repoCount ?? 0, skillCount: skills.length });
      setCurrentSkills(skills);
      setLastChecked(data.lastCheckedLabel ?? null);
      if (newSkills.length > 0) {
        setNewSkillsDelta(newSkills);
        onNewSkills?.(newSkills);
      }
      onSkillsDetected(skills, data.repoCount ?? 0);
    } catch { setError("Network error. Please try again."); }
    finally { setter(false); }
  }

  function handleFetch() {
    if (!username.trim() || skipped) return;
    setNewSkillsDelta([]);
    fetchSkills("/api/github-skills", []);
  }

  function handleRefresh() {
    if (!username.trim() || loading) return;
    fetchSkills("/api/github-refresh", currentSkills, true);
  }

  function handleSkip() { setSkipped(true); setError(null); setSuccess(null); }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {/* Optional badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", background: "rgba(245,158,11,0.12)",
          border: "1px solid rgba(245,158,11,0.3)", color: "#fbbf24",
          padding: "0.15rem 0.6rem", borderRadius: "999px" }}>Optional</span>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Skip if you don&apos;t have GitHub or hit a rate limit
        </span>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <span style={{ position: "absolute", left: "0.9rem", top: "50%",
            transform: "translateY(-50%)", fontSize: "1rem", pointerEvents: "none",
            color: "var(--text-muted)" }}>🐙</span>
          <input className="input-field" id="github-username-input" type="text"
            placeholder="GitHub username or profile URL" value={username}
            onChange={(e) => { setUsername(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
            style={{ paddingLeft: "2.4rem" }} disabled={skipped} />
        </div>
        <button className="btn-primary" onClick={handleFetch}
          disabled={!username.trim() || loading || refreshing || skipped}
          id="fetch-github-btn" style={{ flexShrink: 0 }}>
          {loading ? <span className="animate-spin">↻</span> : "Fetch"}
        </button>
        {success && (
          <button className="btn-secondary" onClick={handleRefresh}
            disabled={loading || refreshing} id="refresh-github-btn"
            title="Re-check GitHub for new repos and skills"
            style={{ flexShrink: 0 }}>
            {refreshing ? <span className="animate-spin">↻</span> : "🔄 Refresh"}
          </button>
        )}
        {!success && (
          <button className="btn-secondary" onClick={handleSkip}
            disabled={loading} id="skip-github-btn" style={{ flexShrink: 0 }}>
            Skip
          </button>
        )}
      </div>

      {error && (
        <div style={{ fontSize: "0.82rem", color: "#fb7185", padding: "0.65rem 0.85rem",
          background: "rgba(244,63,94,0.08)", borderRadius: "7px",
          border: "1px solid rgba(244,63,94,0.22)" }}>
          <div style={{ fontWeight: 600, marginBottom: "0.2rem" }}>{error}</div>
          {error.includes("rate limit") && (
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
              💡 Add <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: "3px" }}>GITHUB_TOKEN</code>{" "}
              to <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: "3px" }}>.env.local</code>, or{" "}
              <span style={{ color: "var(--indigo-light)", cursor: "pointer", textDecoration: "underline" }} onClick={handleSkip}>
                skip this step
              </span>.
            </div>
          )}
        </div>
      )}

      {success && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ fontSize: "0.82rem", color: "#34d399", padding: "0.55rem 0.85rem",
            background: "rgba(16,185,129,0.08)", borderRadius: "7px",
            border: "1px solid rgba(16,185,129,0.22)" }}>
            ✓ Analyzed {success.repoCount} repos → {success.skillCount} skills detected
            {lastChecked && <span style={{ color: "var(--text-muted)", marginLeft: "0.5rem", fontSize: "0.76rem" }}>· checked {lastChecked}</span>}
          </div>
          {newSkillsDelta.length > 0 && (
            <div style={{ fontSize: "0.80rem", color: "#818cf8", padding: "0.5rem 0.85rem",
              background: "rgba(99,102,241,0.08)", borderRadius: "7px",
              border: "1px solid rgba(99,102,241,0.22)" }}>
              🆕 {newSkillsDelta.length} new skill{newSkillsDelta.length > 1 ? "s" : ""} detected:{" "}
              {newSkillsDelta.join(", ")}
            </div>
          )}
        </div>
      )}

      {skipped && (
        <div style={{ fontSize: "0.82rem", color: "#fbbf24", padding: "0.55rem 0.85rem",
          background: "rgba(245,158,11,0.08)", borderRadius: "7px",
          border: "1px solid rgba(245,158,11,0.22)" }}>
          ⏭ GitHub skipped — using resume skills only.
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

interface GitHubSectionProps {
  onSkillsDetected: (skills: string[], repoCount: number) => void;
}

export default function GitHubSection({ onSkillsDetected }: GitHubSectionProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ repoCount: number; skillCount: number } | null>(null);
  const [skipped, setSkipped] = useState(false);

  async function handleFetch() {
    const trimmed = username.trim();
    if (!trimmed) return;
    setLoading(true); setError(null); setSuccess(null); setSkipped(false);
    try {
      const res = await fetch("/api/github-skills", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to fetch GitHub data."); return; }
      setSuccess({ repoCount: data.repoCount ?? 0, skillCount: (data.skills ?? []).length });
      onSkillsDetected(data.skills ?? [], data.repoCount ?? 0);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  }

  function handleSkip() { setSkipped(true); setError(null); setSuccess(null); }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {/* Optional badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{
          fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)",
          color: "#fbbf24", padding: "0.15rem 0.6rem", borderRadius: "999px",
        }}>Optional</span>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Skip if you don&apos;t have GitHub or hit a rate limit
        </span>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <span style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)",
            fontSize: "1rem", pointerEvents: "none", color: "var(--text-muted)" }}>🐙</span>
          <input className="input-field" id="github-username-input" type="text"
            placeholder="GitHub username or profile URL" value={username}
            onChange={(e) => { setUsername(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
            style={{ paddingLeft: "2.4rem" }} disabled={skipped} />
        </div>
        <button className="btn-primary" onClick={handleFetch}
          disabled={!username.trim() || loading || skipped} id="fetch-github-btn" style={{ flexShrink: 0 }}>
          {loading ? <span className="animate-spin">↻</span> : "Fetch"}
        </button>
        <button className="btn-secondary" onClick={handleSkip}
          disabled={loading} id="skip-github-btn" style={{ flexShrink: 0 }}>
          Skip
        </button>
      </div>

      {error && (
        <div style={{ fontSize: "0.82rem", color: "#fb7185", padding: "0.65rem 0.85rem",
          background: "rgba(244,63,94,0.08)", borderRadius: "7px", border: "1px solid rgba(244,63,94,0.22)" }}>
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
        <div style={{ fontSize: "0.82rem", color: "#34d399", padding: "0.55rem 0.85rem",
          background: "rgba(16,185,129,0.08)", borderRadius: "7px", border: "1px solid rgba(16,185,129,0.22)" }}>
          ✓ Analyzed {success.repoCount} repos → {success.skillCount} skills detected!
        </div>
      )}
      {skipped && (
        <div style={{ fontSize: "0.82rem", color: "#fbbf24", padding: "0.55rem 0.85rem",
          background: "rgba(245,158,11,0.08)", borderRadius: "7px", border: "1px solid rgba(245,158,11,0.22)" }}>
          ⏭ GitHub skipped — using resume skills only.
        </div>
      )}
    </div>
  );
}

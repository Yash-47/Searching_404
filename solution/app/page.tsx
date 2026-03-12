"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import UploadSection from "@/components/UploadSection";
import GitHubSection from "@/components/GitHubSection";
import JobRoleSelector from "@/components/JobRoleSelector";
import Dashboard from "@/components/Dashboard";
import { RoadmapItem } from "@/lib/roadmapGenerator";

interface AnalysisResult {
  jobRole: string;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  bonusSkills: string[];
  readinessScore: number;
  roadmap: RoadmapItem[];
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobRoles, setJobRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [resumeSkills, setResumeSkills] = useState<string[]>([]);
  const [githubSkills, setGithubSkills] = useState<string[]>([]);
  const [newGithubSkills, setNewGithubSkills] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Fetch available job roles on mount
  useEffect(() => {
    fetch("/api/skill-gap")
      .then((r) => r.json())
      .then((d) => setJobRoles(d.roles ?? []))
      .catch(console.error);
  }, []);

  // Check for existing profile on load
  useEffect(() => {
    if (status === "authenticated") {
      setAnalyzing(true);
      fetch("/api/profile")
        .then((r) => r.json())
        .then((d) => {
          if (d.profile && d.profile.targetRole && (d.profile.detectedSkills as string[]).length > 0) {
            setResult({
              jobRole: d.profile.targetRole,
              requiredSkills: [], 
              matchedSkills: d.profile.matchedSkills as string[],
              missingSkills: d.profile.missingSkills as string[],
              bonusSkills: d.profile.bonusSkills as string[],
              readinessScore: d.profile.readinessScore || 0,
              roadmap: d.roadmap || [],
            });
            setResumeSkills(d.profile.detectedSkills as string[] || []);
            setGithubSkills([]);
            setSelectedRole(d.profile.targetRole);
          }
        })
        .catch(console.error)
        .finally(() => setAnalyzing(false));
    }
  }, [status]);

  // Merge skills from both sources (deduplicated)
  const allDetectedSkills = [...new Set([...resumeSkills, ...githubSkills])];
  const hasSkills = allDetectedSkills.length > 0;

  async function handleAnalyze() {
    if (!selectedRole || !hasSkills) return;
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: allDetectedSkills, jobRole: selectedRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Analysis failed.");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  function handleReset() {
    setResult(null);
    setResumeSkills([]);
    setGithubSkills([]);
    setNewGithubSkills([]);
    setSelectedRole("");
    setError(null);
  }

  // Suppress unused warning — newGithubSkills shown in UI below
  void newGithubSkills;

  // Loading / auth gate
  if (status === "loading" || status === "unauthenticated") {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="animate-spin" style={{ fontSize: "2rem" }}>⟳</div>
      </main>
    );
  }

  // ──────────────────────────────────────────────────────────
  // RESULTS DASHBOARD
  // ──────────────────────────────────────────────────────────
  if (result) {
    return (
      <main style={{ minHeight: "100vh", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Dashboard
            jobRole={result.jobRole}
            detectedSkills={allDetectedSkills}
            matchedSkills={result.matchedSkills}
            missingSkills={result.missingSkills}
            bonusSkills={result.bonusSkills}
            readinessScore={result.readinessScore}
            roadmap={result.roadmap}
            userEmail={session?.user?.email}
            onSignOut={() => signOut({ callbackUrl: "/login" })}
            onReset={handleReset}
          />
        </div>
      </main>
    );
  }

  // ──────────────────────────────────────────────────────────
  // INPUT FORM
  // ──────────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: "100vh", padding: "2.5rem 1rem 4rem" }}>
      {/* User Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          padding: "0.75rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          zIndex: 100,
        }}
      >
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          {session?.user?.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="btn-secondary"
          style={{ padding: "0.4rem 0.9rem", fontSize: "0.78rem", minHeight: "auto" }}
        >
          Sign Out
        </button>
      </div>
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 1rem",
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--indigo-light)",
              marginBottom: "1.25rem",
              letterSpacing: "0.05em",
            }}
          >
            🚀 Hackathon MVP · Skill Gap Analyzer
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 6vw, 3.25rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}
          >
            <span className="gradient-text">Analyze Your Skills.</span>
            <br />
            <span style={{ color: "var(--text-primary)" }}>Close the Gap.</span>
          </h1>

          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Upload your resume and connect your GitHub to discover your skill gaps against any job role — then get a personalized learning roadmap.
          </p>
        </div>

        {/* Step cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Step 1 — Resume */}
          <div className="glass-card" style={{ padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>
              <StepBadge n={1} />
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem" }}>Upload Your Resume</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>PDF format · Skills are auto-detected</div>
              </div>
              {resumeSkills.length > 0 && (
                <div style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#34d399", fontWeight: 600 }}>
                  ✓ {resumeSkills.length} skills found
                </div>
              )}
            </div>
            <UploadSection onSkillsDetected={setResumeSkills} />
          </div>

          {/* Step 2 — GitHub */}
          <div className="glass-card" style={{ padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>
              <StepBadge n={2} />
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem" }}>GitHub Profile</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Analyzes public repos, languages &amp; topics</div>
              </div>
              {githubSkills.length > 0 && (
                <div style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#34d399", fontWeight: 600 }}>
                  ✓ {githubSkills.length} skills found
                </div>
              )}
            </div>
            <GitHubSection
              onSkillsDetected={(skills) => setGithubSkills(skills)}
              onNewSkills={(ns) => setNewGithubSkills(ns)}
            />
          </div>

          {/* Step 3 — Job Role */}
          <div className="glass-card" style={{ padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>
              <StepBadge n={3} />
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem" }}>Target Job Role</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Pick which role to benchmark against</div>
              </div>
            </div>
            <JobRoleSelector roles={jobRoles} value={selectedRole} onChange={setSelectedRole} />
          </div>

          {/* Detected skills preview */}
          {allDetectedSkills.length > 0 && (
            <div
              className="glass-card animate-fade-in-up"
              style={{ padding: "1.25rem 1.5rem" }}
            >
              <div className="section-label">Detected Skills Preview ({allDetectedSkills.length})</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                {allDetectedSkills.slice(0, 30).map((s) => (
                  <span key={s} className="badge badge-neutral" style={{ fontSize: "0.75rem" }}>{s}</span>
                ))}
                {allDetectedSkills.length > 30 && (
                  <span className="badge badge-neutral" style={{ fontSize: "0.75rem" }}>+{allDetectedSkills.length - 30} more</span>
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ fontSize: "0.85rem", color: "#fb7185", padding: "0.65rem 1rem", background: "rgba(244,63,94,0.08)", borderRadius: "8px", border: "1px solid rgba(244,63,94,0.2)" }}>
              {error}
            </div>
          )}

          {/* Analyze Button */}
          <button
            className="btn-primary"
            id="analyze-btn"
            onClick={handleAnalyze}
            disabled={!hasSkills || !selectedRole || analyzing}
            style={{ width: "100%", padding: "0.9rem", fontSize: "1rem", letterSpacing: "0.02em" }}
          >
            {analyzing ? (
              <><span className="animate-spin">⟳</span> Analyzing…</>
            ) : (
              <>🔍 Analyze Skill Gap</>
            )}
          </button>

          {(!hasSkills || !selectedRole) && (
            <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              {!hasSkills ? "Add a resume or GitHub username to continue." : "Select a job role to continue."}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "linear-gradient(135deg, var(--indigo), var(--violet))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: "0.9rem",
        color: "#fff",
        flexShrink: 0,
        boxShadow: "var(--glow-indigo)",
      }}
    >
      {n}
    </div>
  );
}

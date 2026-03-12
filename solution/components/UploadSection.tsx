"use client";

import { useRef, useState } from "react";

interface UploadSectionProps {
  onSkillsDetected: (skills: string[]) => void;
}

export default function UploadSection({ onSkillsDetected }: UploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<number | null>(null); // number of skills
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(f: File) {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setError(null);
    setSuccess(null);

    // Auto-parse immediately on file selection
    setLoading(true);
    try {
      const form = new FormData();
      form.append("resume", f);
      const res = await fetch("/api/parse-resume", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to parse resume.");
        return;
      }
      const skills: string[] = data.skills ?? [];
      setSuccess(skills.length);
      onSkillsDetected(skills);
    } catch {
      setError("Network error while parsing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {/* Drop Zone */}
      <div
        onClick={() => !loading && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        style={{
          border: `2px dashed ${isDragging ? "var(--indigo)" : loading ? "rgba(99,102,241,0.40)" : "rgba(255,255,255,0.12)"}`,
          borderRadius: "10px",
          padding: "1.75rem 1.5rem",
          textAlign: "center",
          cursor: loading ? "default" : "pointer",
          background: isDragging ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.02)",
          transition: "all 0.2s ease",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          {loading ? <span className="animate-spin" style={{ display: "inline-block" }}>↻</span> : "📄"}
        </div>

        {loading ? (
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--indigo-light)" }}>
              Parsing {file?.name}…
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Detecting skills from your resume
            </div>
          </div>
        ) : file && success !== null ? (
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#34d399" }}>
              ✓ {file.name}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              {success} skill{success !== 1 ? "s" : ""} detected · Click to change file
            </div>
          </div>
        ) : file && error ? (
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--indigo-light)" }}>
              {file.name}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Click to try again
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-secondary)" }}>
              Drop your resume here
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              PDF only · Skills are auto-detected on upload
            </div>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,application/pdf"
          style={{ display: "none" }}
          id="resume-upload"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {error && (
        <div style={{
          fontSize: "0.82rem", color: "#fb7185", padding: "0.55rem 0.85rem",
          background: "rgba(244,63,94,0.08)", borderRadius: "7px",
          border: "1px solid rgba(244,63,94,0.22)",
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";

interface UploadSectionProps {
  onSkillsDetected: (skills: string[]) => void;
}

export default function UploadSection({ onSkillsDetected }: UploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (f.type !== "application/pdf") { setError("Please upload a PDF file."); return; }
    setFile(f); setError(null); setSuccess(false);
  }

  async function handleParse() {
    if (!file) return;
    setLoading(true); setError(null);
    try {
      const form = new FormData();
      form.append("resume", file);
      const res = await fetch("/api/parse-resume", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to parse resume."); return; }
      setSuccess(true);
      onSkillsDetected(data.skills ?? []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {/* Drop Zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        style={{
          border: `2px dashed ${isDragging ? "var(--indigo)" : "rgba(255,255,255,0.12)"}`,
          borderRadius: "10px", padding: "1.75rem 1.5rem", textAlign: "center",
          cursor: "pointer",
          background: isDragging ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.02)",
          transition: "all 0.2s ease",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📄</div>
        {file ? (
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--indigo-light)" }}>{file.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              {(file.size / 1024).toFixed(1)} KB · Click to change
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-secondary)" }}>
              Drop your resume here
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              PDF only · Max 10 MB
            </div>
          </div>
        )}
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} id="resume-upload" />
      </div>

      {error && (
        <div style={{ fontSize: "0.82rem", color: "#fb7185", padding: "0.55rem 0.85rem",
          background: "rgba(244,63,94,0.08)", borderRadius: "7px", border: "1px solid rgba(244,63,94,0.22)" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ fontSize: "0.82rem", color: "#34d399", padding: "0.55rem 0.85rem",
          background: "rgba(16,185,129,0.08)", borderRadius: "7px", border: "1px solid rgba(16,185,129,0.22)" }}>
          ✓ Resume parsed successfully!
        </div>
      )}

      <button className="btn-primary" onClick={handleParse} disabled={!file || loading}
        id="parse-resume-btn" style={{ width: "100%" }}>
        {loading ? <><span className="animate-spin">↻</span> Parsing…</> : <>📋 Parse Resume</>}
      </button>
    </div>
  );
}

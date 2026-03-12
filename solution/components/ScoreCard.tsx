"use client";

import { useEffect, useState } from "react";

interface ScoreCardProps {
  score: number;
  matched: number;
  total: number;
}

function getScoreColor(s: number) {
  if (s >= 75) return "#10b981";
  if (s >= 50) return "#f59e0b";
  return "#f43f5e";
}
function getScoreLabel(s: number) {
  if (s >= 80) return "Excellent";
  if (s >= 60) return "Good";
  if (s >= 40) return "Fair";
  return "Needs Work";
}

export default function ScoreCard({ score, matched, total }: ScoreCardProps) {
  const [displayed, setDisplayed] = useState(0);
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  useEffect(() => {
    let v = 0;
    const step = Math.ceil(score / 40);
    const t = setInterval(() => {
      v += step;
      if (v >= score) { setDisplayed(score); clearInterval(t); }
      else setDisplayed(v);
    }, 20);
    return () => clearInterval(t);
  }, [score]);

  const r = 54, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", textAlign: "center" }}>
      <div style={{ position: "relative", width: 140, height: 140 }}>
        <svg width={140} height={140} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={70} cy={70} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={10} />
          <circle cx={70} cy={70} r={r} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 8px ${color})` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <span style={{ fontSize: "2rem", fontWeight: 800, color, lineHeight: 1 }}>{displayed}%</span>
          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>{label}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "2rem", paddingTop: "0.75rem", borderTop: "1px solid var(--card-border)", width: "100%", justifyContent: "center" }}>
        {[
          { n: matched, l: "Matched", c: "#34d399" },
          { n: total - matched, l: "Missing", c: "#fb7185" },
          { n: total, l: "Required", c: "var(--text-secondary)" },
        ].map(({ n, l, c }) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: c, lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

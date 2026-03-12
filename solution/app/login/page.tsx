"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Registration failed.");
          return;
        }
      }

      // Sign in after register or directly
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      {/* Decorative orbs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            top: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
            bottom: "10%",
            right: "5%",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div
        className="animate-fade-in-up"
        style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}
      >
        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1.1rem",
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--indigo-light)",
              marginBottom: "1.5rem",
              letterSpacing: "0.05em",
            }}
          >
            🚀 Skill Gap Analyzer
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "0.5rem",
            }}
          >
            <span className="gradient-text">
              {mode === "login" ? "Welcome back" : "Create account"}
            </span>
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Start your skill gap analysis journey"}
          </p>
        </div>

        {/* Tab Toggle */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--card-border)",
            borderRadius: "10px",
            padding: "4px",
            marginBottom: "1.75rem",
          }}
        >
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              style={{
                flex: 1,
                padding: "0.55rem",
                borderRadius: "7px",
                border: "none",
                fontFamily: "inherit",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                background:
                  mode === m
                    ? "linear-gradient(135deg, var(--indigo), var(--violet))"
                    : "transparent",
                color: mode === m ? "#fff" : "var(--text-secondary)",
                boxShadow: mode === m ? "var(--glow-indigo)" : "none",
              }}
            >
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div className="glass-card" style={{ padding: "2rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Name field — register only */}
            {mode === "register" && (
              <div>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: "0.4rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="input-field"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "0.4rem",
                  letterSpacing: "0.02em",
                }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "0.4rem",
                  letterSpacing: "0.02em",
                }}
              >
                Password
                {mode === "register" && (
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      fontWeight: 400,
                      color: "var(--text-muted)",
                    }}
                  >
                    (min. 8 characters)
                  </span>
                )}
              </label>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="animate-fade-in-up"
                style={{
                  fontSize: "0.83rem",
                  color: "#fb7185",
                  padding: "0.65rem 1rem",
                  background: "rgba(244,63,94,0.08)",
                  borderRadius: "8px",
                  border: "1px solid rgba(244,63,94,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="auth-submit-btn"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%", marginTop: "0.5rem", fontSize: "0.95rem" }}
            >
              {loading ? (
                <>
                  <span className="animate-spin">⟳</span>
                  {mode === "login" ? " Signing in…" : " Creating account…"}
                </>
              ) : mode === "login" ? (
                "Sign In →"
              ) : (
                "Create Account →"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--indigo-light)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.8rem",
              fontFamily: "inherit",
              padding: 0,
            }}
          >
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}

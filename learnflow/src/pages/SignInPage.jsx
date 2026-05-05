import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuroraBg, GlowBtn } from "../components/Shared";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        login(data.token, data.user);
        navigate("/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred during login. Is the server running?");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #07041c 0%, #0d0630 50%, #08031a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "'Outfit', sans-serif",
        position: "relative",
      }}
    >
      <AuroraBg />
      <div
        style={{
          position: "relative",
          zIndex: 5,
          background: "rgba(20, 20, 40, 0.4)",
          border: "1px solid rgba(0, 230, 255, 0.2)",
          borderRadius: "24px",
          padding: "3.5rem 3rem",
          width: "100%",
          maxWidth: "420px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          color: "#fff",
          animation: "fadeUp 0.6s ease-out",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(0, 230, 255, 0.1)",
            padding: "1rem",
            borderRadius: "50%",
            marginBottom: "1rem"
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" stroke="#00eaff" strokeWidth="2" fill="none" />
              <circle cx="16" cy="16" r="4" fill="#00eaff" />
            </svg>
          </div>
          <h2 style={{ fontSize: "2.2rem", fontWeight: "900", letterSpacing: "-0.5px" }}>
            Welcome Back
          </h2>
          <p style={{ color: "rgba(180, 200, 255, 0.6)", marginTop: "0.5rem" }}>Log in to continue your journey</p>
        </div>

        {error && (
          <div style={{
            background: "rgba(255, 70, 100, 0.1)",
            borderLeft: "4px solid #ff6b6b",
            color: "#ff6b6b",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            fontSize: "0.9rem"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div className="input-group">
            <label style={{ display: "block", marginBottom: "0.5rem", color: "rgba(200,220,255,0.9)", fontSize: "0.9rem", fontWeight: "600" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "12px",
                border: "1px solid rgba(100,130,255,0.2)",
                background: "rgba(0,0,0,0.3)",
                color: "#fff",
                outline: "none",
                fontSize: "1rem",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => e.target.style.borderColor = "#00eaff"}
              onBlur={(e) => e.target.style.borderColor = "rgba(100,130,255,0.2)"}
            />
          </div>
          <div className="input-group">
            <label style={{ display: "block", marginBottom: "0.5rem", color: "rgba(200,220,255,0.9)", fontSize: "0.9rem", fontWeight: "600" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "12px",
                border: "1px solid rgba(100,130,255,0.2)",
                background: "rgba(0,0,0,0.3)",
                color: "#fff",
                outline: "none",
                fontSize: "1rem",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => e.target.style.borderColor = "#00eaff"}
              onBlur={(e) => e.target.style.borderColor = "rgba(100,130,255,0.2)"}
            />
          </div>
          <GlowBtn type="submit" style={{ width: "100%", marginTop: "1.5rem", padding: "1rem", fontSize: "1.1rem" }}>
            Sign In
          </GlowBtn>
        </form>
        <p style={{ marginTop: "2rem", textAlign: "center", color: "rgba(180,200,255,0.7)" }}>
          Don't have an account? <Link to="/sign-up" style={{ color: "#00eaff", textDecoration: "none", fontWeight: "bold" }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default SignInPage;
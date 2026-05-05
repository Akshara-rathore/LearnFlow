import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuroraBg, Navbar, GlowBtn, LANG_DATA } from "../components/Shared";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    language = "",
    answers = [],
    questions = [],
    score,
    total,
    percentage,
    detectedLevel,
  } = location.state || {};

  const normalizedLanguage = language ? String(language).toLowerCase() : "";
  const lang = LANG_DATA[normalizedLanguage] || {
    label: normalizedLanguage || "Language",
    color: "#7b2fff",
    icon: "📘",
  };

  const correct =
    typeof score === "number"
      ? score
      : answers.filter((a) => a.selected === a.correct).length;

  const totalQuestions =
    typeof total === "number" && total > 0 ? total : questions.length || 1;

  const pct =
    typeof percentage === "number"
      ? percentage
      : Math.round((correct / totalQuestions) * 100);

  let level = detectedLevel || "Beginner";
  if (!detectedLevel) {
    if (pct >= 75) level = "Advanced";
    else if (pct >= 40) level = "Intermediate";
  }

  const [showReview, setShowReview] = useState(true);

  const goHome = () => navigate("/dashboard");

  const generateRoadmap = () => {
    navigate("/roadmap", {
      state: {
        language: normalizedLanguage,
        score: correct,
        total: totalQuestions,
        percentage: pct,
        detectedLevel: level,
      },
    });
  };

  const grade =
    pct >= 85
      ? { label: "Excellent", icon: "🏆", color: "#f7c948", msg: "Outstanding performance." }
      : pct >= 65
      ? { label: "Good", icon: "⭐", color: "#3dd68c", msg: "Solid grasp of the topic." }
      : pct >= 45
      ? { label: "Fair", icon: "📚", color: "#00eaff", msg: "Some understanding, focused practice needed." }
      : { label: "Needs Work", icon: "💪", color: "#ff6b35", msg: "Start with basics." };

  const circumference = 2 * Math.PI * 54;
  const dash = (pct / 100) * circumference;

  if (!location.state) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#07041c 0%,#0d0630 50%,#08031a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        <div style={{ textAlign: "center", color: "#fff" }}>
          <p>No quiz result found. Please take the quiz first.</p>
          <GlowBtn onClick={goHome}>Go to Dashboard</GlowBtn>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#07041c 0%,#0d0630 50%,#08031a 100%)",
        fontFamily: "'Outfit',sans-serif",
        position: "relative",
      }}
    >
      <AuroraBg accentColor={lang.color} />
      <Navbar onHome={goHome} />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: 900,
          margin: "0 auto",
          padding: "7rem 2rem 4rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{grade.icon}</div>
          <h1 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, color: "#fff", marginBottom: "0.5rem" }}>
            Assessment Complete!
          </h1>
          <p style={{ color: "rgba(180,200,255,0.7)", fontSize: "1rem" }}>
            {lang.label} · Detected Level: <b style={{ color: lang.color }}>{level}</b>
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem", marginBottom: "2.5rem" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(100,130,255,0.15)", borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle cx="65" cy="65" r="54" fill="none" stroke={grade.color} strokeWidth="10" strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" transform="rotate(-90 65 65)" style={{ filter: `drop-shadow(0 0 8px ${grade.color}88)` }} />
              <text x="65" y="60" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="900">{pct}%</text>
              <text x="65" y="78" textAnchor="middle" fill={grade.color} fontSize="10">{grade.label.toUpperCase()}</text>
            </svg>
            <p style={{ color: "rgba(180,200,255,0.65)", fontSize: "0.82rem", textAlign: "center", marginTop: "0.8rem" }}>{grade.msg}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { val: correct, label: "Correct", color: "#3dd68c", icon: "✓" },
              { val: totalQuestions - correct, label: "Incorrect", color: "#ff6b6b", icon: "✗" },
              { val: totalQuestions, label: "Total Questions", color: "#00eaff", icon: "#" },
              { val: level, label: "Detected Level", color: lang.color, icon: "★" },
            ].map(({ val, label, color, icon }) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(100,130,255,0.12)", borderRadius: "16px", padding: "1.4rem" }}>
                <div style={{ fontSize: "0.68rem", color: "rgba(150,170,220,0.5)", marginBottom: "0.4rem" }}>{icon} {label.toUpperCase()}</div>
                <div style={{ fontSize: label === "Detected Level" ? "1.35rem" : "2rem", fontWeight: 900, color }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <GlowBtn onClick={generateRoadmap} style={{ padding: "1rem 3rem", fontSize: "1.2rem" }}>
            Generate Custom Roadmap 🚀
          </GlowBtn>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(100,130,255,0.12)", borderRadius: "20px", overflow: "hidden" }}>
          <div onClick={() => setShowReview(!showReview)} style={{ padding: "1.2rem 1.8rem", display: "flex", justifyContent: "space-between", cursor: "pointer", borderBottom: showReview ? "1px solid rgba(100,130,255,0.1)" : "none" }}>
            <span style={{ fontWeight: 700, color: "#e0e8ff" }}>📋 Question Review & Explanations</span>
            <span style={{ color: "rgba(150,180,220,0.5)", fontSize: "0.85rem" }}>{showReview ? "▲ Hide" : "▼ Show all"}</span>
          </div>

          {showReview && (
            <div style={{ padding: "1.2rem 1.8rem", display: "flex", flexDirection: "column", gap: "1rem", maxHeight: 600, overflowY: "auto" }}>
              {questions.map((q, i) => {
                const a = answers[i];
                const isRight = a?.selected === q.ans;
                return (
                  <div key={i} style={{ padding: "1rem 1.2rem", borderRadius: "12px", background: isRight ? "rgba(61,214,140,0.05)" : "rgba(255,70,100,0.05)", border: `1px solid ${isRight ? "#3dd68c2a" : "#ff44662a"}` }}>
                    <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                      <span style={{ fontSize: "0.68rem", color: "rgba(150,180,220,0.45)", minWidth: 24 }}>Q{i + 1}</span>
                      <p style={{ fontSize: "0.88rem", color: "#d0dbff", flex: 1 }}>{q.q}</p>
                      <span>{isRight ? "✅" : "❌"}</span>
                    </div>
                    {!isRight && a && (
                      <div style={{ paddingLeft: "1.5rem", fontSize: "0.78rem", color: "rgba(160,185,220,0.55)", marginTop: "0.2rem" }}>
                        <span style={{ color: "#ff7088" }}>You: </span>{q.opts?.[a.selected] || "Not answered"} &nbsp;·&nbsp;
                        <span style={{ color: "#3dd68c" }}>Correct: </span>{q.opts?.[q.ans]}
                      </div>
                    )}
                    <div style={{ paddingLeft: "1.5rem", fontSize: "0.78rem", color: "rgba(180,210,255,0.65)", marginTop: "0.4rem" }}>
                      <span style={{ color: "#00eaff" }}>Explanation: </span>{q.exp}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
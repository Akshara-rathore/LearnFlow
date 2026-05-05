import React, { useMemo, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuroraBg, LANG_DATA } from "../components/Shared";

function Dashboard() {
  const [hov, setHov] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const firstName = useMemo(() => {
    if (!user) return "Learner";
    return user.name || user.email?.split("@")[0] || "Learner";
  }, [user]);

  const handleSelect = (lang) => {
    navigate(`/quiz/${lang.toLowerCase()}`);
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#07041c 0%,#0d0630 50%,#08031a 100%)",
        fontFamily: "'Outfit',sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AuroraBg />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: 1150,
          margin: "0 auto",
          padding: "7rem 2rem 4rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "2rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.78rem",
                color: "#00eaff",
                letterSpacing: "0.18em",
                fontFamily: "'Space Mono', monospace",
                marginBottom: "0.9rem",
              }}
            >
              PERSONALIZED LEARNING SPACE
            </div>

            <h1
              style={{
                fontSize: "clamp(2.1rem,4vw,3.5rem)",
                fontWeight: 900,
                color: "#fff",
                marginBottom: "0.7rem",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back,{" "}
              <span style={{ color: "#00eaff" }}>{firstName}</span> 👋
            </h1>

            <p
              style={{
                fontSize: "1.02rem",
                color: "rgba(180,200,255,0.72)",
                maxWidth: 620,
                lineHeight: 1.6,
              }}
            >
              Choose a programming language to begin your quiz and generate your
              personalized AI roadmap.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.9rem",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              padding: "0.8rem 1rem",
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                {user?.name || firstName}
              </div>
              <div
                style={{
                  color: "rgba(180,200,255,0.65)",
                  fontSize: "0.8rem",
                }}
              >
                {user?.isGuest ? "Guest" : user?.email || "Signed in"}
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              style={{
                background: "rgba(255, 70, 100, 0.2)",
                color: "#ff6b6b",
                border: "1px solid rgba(255, 70, 100, 0.4)",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div
          style={{
            marginBottom: "2rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(0,230,255,0.12)",
            borderRadius: "22px",
            padding: "1.3rem 1.4rem",
            color: "#d9ecff",
            lineHeight: 1.7,
            boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
          }}
        >
          <span style={{ color: "#00eaff", fontWeight: 700 }}>Flow:</span>{" "}
          Select language → take quiz → get your level → view roadmap.
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))",
            gap: "1.5rem",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {Object.entries(LANG_DATA).map(([lang, data], i) => (
            <div
              key={lang}
              onMouseEnter={() => setHov(lang)}
              onMouseLeave={() => setHov(null)}
              onClick={() => handleSelect(lang)}
              style={{
                background:
                  hov === lang
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.03)",
                border: `1.5px solid ${hov === lang ? `${data.color}88` : "rgba(100,130,255,0.15)"
                  }`,
                borderRadius: "20px",
                padding: "2rem 1.5rem",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                transform:
                  hov === lang
                    ? "translateY(-6px) scale(1.02)"
                    : "translateY(0) scale(1)",
                boxShadow:
                  hov === lang
                    ? `0 12px 50px ${data.glow}, 0 0 0 1px ${data.color}22`
                    : "none",
                animation: `fadeUp 0.7s ${0.1 * i + 0.2}s both`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background:
                    hov === lang
                      ? `linear-gradient(90deg, ${data.color}, transparent)`
                      : "transparent",
                  transition: "all 0.3s",
                  borderRadius: "20px 20px 0 0",
                }}
              />

              <div style={{ fontSize: "2.8rem", marginBottom: "0.9rem" }}>
                {data.icon}
              </div>

              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: hov === lang ? data.color : "#fff",
                  marginBottom: "0.6rem",
                  transition: "color 0.2s",
                }}
              >
                {lang}
              </h3>

              <p
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(160,180,220,0.7)",
                  lineHeight: 1.65,
                  marginBottom: "1.2rem",
                  fontWeight: 300,
                }}
              >
                {data.desc}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {data.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "0.68rem",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "50px",
                      background: `${data.color}15`,
                      border: `1px solid ${data.color}33`,
                      color: data.color,
                      letterSpacing: "0.07em",
                      fontFamily: "'Space Mono',monospace",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {hov === lang && (
                <div
                  style={{
                    marginTop: "1.5rem",
                    textAlign: "center",
                    fontSize: "0.82rem",
                    color: data.color,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                  }}
                >
                  START QUIZ →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
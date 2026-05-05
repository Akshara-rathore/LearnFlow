import { AuroraBg, Navbar, LANG_DATA, LEVELS } from "../components/Shared";
import { useState } from "react";

function LevelSelectionPage({ language, onSelect, onBack, onHome }) {
  const lang = LANG_DATA[language];
  const [hov, setHov] = useState(null);

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
      <Navbar onHome={onHome} />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: 900,
          margin: "0 auto",
          padding: "7rem 2rem 4rem",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "rgba(180,200,255,0.5)",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontFamily: "'Outfit',sans-serif",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          ← Back to Languages
        </button>

        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div
            style={{
              fontSize: "0.75rem",
              color: lang.color,
              letterSpacing: "0.2em",
              fontFamily: "'Space Mono',monospace",
              marginBottom: "1rem",
            }}
          >
            STEP 2 OF 3
          </div>

          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{lang.icon}</div>

          <h1
            style={{
              fontSize: "clamp(2rem,4vw,3.2rem)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "0.7rem",
            }}
          >
            <span style={{ color: lang.color }}>{language}</span> — What's your level?
          </h1>

          <p
            style={{
              fontSize: "1rem",
              color: "rgba(180,200,255,0.65)",
              fontWeight: 300,
              maxWidth: 460,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            We'll generate a tailored 20-question quiz to assess your proficiency
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
            gap: "1.5rem",
          }}
        >
          {LEVELS.map((lv, i) => (
            <div
              key={lv.id}
              onMouseEnter={() => setHov(lv.id)}
              onMouseLeave={() => setHov(null)}
              onClick={() => onSelect(lv.id)}
              style={{
                background: hov === lv.id ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                border: `1.5px solid ${
                  hov === lv.id ? lv.color + "88" : "rgba(100,130,255,0.15)"
                }`,
                borderRadius: "20px",
                padding: "2.2rem 1.8rem",
                cursor: "pointer",
                transition: "all 0.3s",
                textAlign: "center",
                transform: hov === lv.id ? "translateY(-6px) scale(1.03)" : "translateY(0)",
                boxShadow: hov === lv.id
                  ? `0 14px 50px rgba(0,0,0,0.4), 0 0 30px ${lv.color}33`
                  : "none",
                animation: `fadeUp 0.7s ${0.15 * i + 0.2}s both`,
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>{lv.icon}</div>

              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: hov === lv.id ? lv.color : "#fff",
                  marginBottom: "0.7rem",
                  transition: "color 0.2s",
                }}
              >
                {lv.label}
              </h3>

              <p
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(160,180,220,0.65)",
                  lineHeight: 1.65,
                  fontWeight: 300,
                }}
              >
                {lv.desc}
              </p>

              {hov === lv.id && (
                <div
                  style={{
                    marginTop: "1.2rem",
                    fontSize: "0.8rem",
                    color: lv.color,
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

export default LevelSelectionPage;
import { useState } from "react";

export const LANG_DATA = {
  python: {
    label: "Python",
    icon: "🐍",
    color: "#3dd68c",
    glow: "rgba(61,214,140,0.35)",
    desc: "The world's most beginner-friendly language. Perfect for data science, AI, automation, and web backends.",
    tags: ["Data Science", "AI/ML", "Automation"],
  },
  cpp: {
    label: "C++",
    icon: "⚡",
    color: "#f7c948",
    glow: "rgba(247,201,72,0.35)",
    desc: "The powerhouse of systems programming. Used in game engines, OS kernels, and high-performance computing.",
    tags: ["Systems", "Game Dev", "Performance"],
  },
  java: {
    label: "Java",
    icon: "☕",
    color: "#ff6b35",
    glow: "rgba(255,107,53,0.35)",
    desc: "Enterprise-grade and platform-independent. The backbone of Android apps and large-scale backend systems.",
    tags: ["Enterprise", "Android", "Backend"],
  },
  javascript: {
    label: "JavaScript",
    icon: "✦",
    color: "#00eaff",
    glow: "rgba(0,234,255,0.35)",
    desc: "The language of the web. From interactive UIs to server-side APIs, JS runs everywhere.",
    tags: ["Web", "Frontend", "Full Stack"],
  },
};

export const LEVELS = [
  {
    id: "beginner",
    label: "Beginner",
    icon: "🌱",
    desc: "Just starting out — learning syntax, basic concepts, and simple programs.",
    color: "#3dd68c",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    icon: "🔥",
    desc: "Comfortable with fundamentals — exploring OOP, data structures, and real projects.",
    color: "#f7c948",
  },
  {
    id: "advanced",
    label: "Advanced",
    icon: "⚡",
    desc: "Deep knowledge — optimizations, design patterns, and complex system architecture.",
    color: "#ff6b35",
  },
];

export function AuroraBg({ accentColor = "#00eaff" }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 500,
          borderRadius: "40% 60%",
          background: `radial-gradient(ellipse, ${accentColor}22 0%, transparent 70%)`,
          top: "-100px",
          right: "0%",
          animation: "auroraA 13s ease-in-out infinite alternate",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "60% 40%",
          background:
            "radial-gradient(ellipse, rgba(130,0,255,0.2) 0%, transparent 70%)",
          top: "15%",
          right: "30%",
          animation: "auroraB 17s ease-in-out infinite alternate",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(255,0,180,0.14) 0%, transparent 70%)",
          bottom: "0%",
          right: "5%",
          animation: "auroraC 11s ease-in-out infinite alternate",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,230,255,0.012) 2px, rgba(0,230,255,0.012) 4px)",
        }}
      />
    </div>
  );
}

export function GlowBtn({
  children,
  onClick,
  variant = "primary",
  color = "#00eaff",
  disabled = false,
  style: extStyle = {},
}) {
  const [hov, setHov] = useState(false);
  const [press, setPress] = useState(false);
  const isPrimary = variant === "primary";

  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => {
        setHov(false);
        setPress(false);
      }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      onClick={onClick}
      style={{
        padding: "0.75rem 1.9rem",
        borderRadius: "50px",
        fontSize: "0.9rem",
        fontWeight: 600,
        fontFamily: "'Outfit',sans-serif",
        letterSpacing: "0.06em",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        outline: "none",
        border: isPrimary
          ? "none"
          : `1.5px solid ${hov ? color : "rgba(100,150,255,0.3)"}`,
        background: isPrimary
          ? hov
            ? `linear-gradient(135deg, ${color} 0%, #7b2fff 100%)`
            : `linear-gradient(135deg, ${color}cc 0%, #5a10d0 100%)`
          : "transparent",
        color: isPrimary ? "#fff" : hov ? color : "rgba(200,215,255,0.8)",
        boxShadow: isPrimary
          ? press
            ? `0 0 60px 18px ${color}bb`
            : hov
            ? `0 0 36px 10px ${color}66`
            : `0 0 18px 4px ${color}33`
          : hov
          ? `0 0 20px 4px ${color}33`
          : "none",
        transform: press ? "scale(0.96)" : hov ? "scale(1.04)" : "scale(1)",
        transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
        whiteSpace: "nowrap",
        ...extStyle,
      }}
    >
      {children}
    </button>
  );
}

export function Navbar({ onHome }) {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        padding: "1rem 3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(8,4,28,0.75)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(0,230,255,0.07)",
      }}
    >
      <div
        onClick={onHome}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.55rem",
          cursor: "pointer",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <polygon
            points="16,2 28,9 28,23 16,30 4,23 4,9"
            stroke="#00eaff"
            strokeWidth="1.8"
            fill="none"
          />
          <circle cx="16" cy="16" r="3" fill="#00eaff" opacity="0.8" />
        </svg>
        <span
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "#fff",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Learn<span style={{ color: "#00eaff" }}>Flow</span>
        </span>
      </div>

      <GlowBtn variant="secondary" onClick={onHome}>
        ← Home
      </GlowBtn>
    </nav>
  );
}
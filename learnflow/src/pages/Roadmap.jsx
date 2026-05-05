import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuroraBg, Navbar, GlowBtn, LANG_DATA } from "../components/Shared";

function Roadmap() {
  const location = useLocation();
  const navigate = useNavigate();

  const { language = "", score, total, percentage, detectedLevel } = location.state || {};

  const normalizedLanguage = language ? String(language).toLowerCase() : "";
  const lang = LANG_DATA[normalizedLanguage] || {
    label: normalizedLanguage || "Language",
    color: "#7b2fff",
    icon: "📘",
  };

  const [roadmap, setRoadmap] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);
  const [roadmapError, setRoadmapError] = useState(null);

  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [leetcode, setLeetcode] = useState([]);
  const [expandedNote, setExpandedNote] = useState(null);
  const [loadingResources, setLoadingResources] = useState(false);

  useEffect(() => {
    if (!normalizedLanguage) {
      setRoadmapError("No language data found.");
      setLoadingRoadmap(false);
      return;
    }

    const fetchRoadmap = async () => {
      try {
        setLoadingRoadmap(true);
        const res = await fetch("http://127.0.0.1:5000/generate-roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course: normalizedLanguage,
            score,
            total,
            percentage,
            detectedLevel,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Failed to generate roadmap");
        
        setRoadmap(data.roadmap);
      } catch (err) {
        setRoadmapError(err.message || "Failed to generate roadmap");
      } finally {
        setLoadingRoadmap(false);
      }
    };

    fetchRoadmap();
  }, [normalizedLanguage, score, total, percentage, detectedLevel]);

  useEffect(() => {
    if (!roadmap || !normalizedLanguage || !detectedLevel) return;

    const fetchResources = async () => {
      try {
        setLoadingResources(true);
        const res = await fetch("http://127.0.0.1:5000/generate-resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course: normalizedLanguage,
            level: detectedLevel,
            roadmap,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error("Failed to load resources");

        setVideos(Array.isArray(data.videos) ? data.videos : []);
        setNotes(Array.isArray(data.notes) ? data.notes : []);
        setLeetcode(Array.isArray(data.leetcode) ? data.leetcode : []);
      } catch (err) {
        console.error("Resources error:", err);
      } finally {
        setLoadingResources(false);
      }
    };

    fetchResources();
  }, [roadmap, normalizedLanguage, detectedLevel]);

  const goHome = () => navigate("/dashboard");

  if (!location.state) {
    return (
      <div style={{ minHeight: "100vh", background: "#07041c", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#fff" }}>
          <p>No roadmap data found. Please take the quiz first.</p>
          <GlowBtn onClick={goHome}>Go Home</GlowBtn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#07041c 0%,#0d0630 50%,#08031a 100%)", fontFamily: "'Outfit',sans-serif", position: "relative" }}>
      <AuroraBg accentColor={lang.color} />
      <Navbar onHome={goHome} />

      <div style={{ position: "relative", zIndex: 5, maxWidth: 900, margin: "0 auto", padding: "7rem 2rem 4rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#fff", marginBottom: "0.5rem", textAlign: "center" }}>
          Your 4-Week Roadmap
        </h1>
        <p style={{ color: lang.color, fontSize: "1.1rem", textAlign: "center", marginBottom: "2rem" }}>
          Target Level: {detectedLevel}
        </p>

        {score !== undefined && total !== undefined && percentage !== undefined && (
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "3rem", flexWrap: "wrap" }}>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem 2rem", borderRadius: "12px", border: "1px solid rgba(100,130,255,0.2)", textAlign: "center", minWidth: "120px" }}>
              <div style={{ fontSize: "0.85rem", color: "rgba(150,170,220,0.7)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.3rem" }}>Score</div>
              <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#3dd68c" }}>{score}/{total}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem 2rem", borderRadius: "12px", border: "1px solid rgba(100,130,255,0.2)", textAlign: "center", minWidth: "120px" }}>
              <div style={{ fontSize: "0.85rem", color: "rgba(150,170,220,0.7)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.3rem" }}>Percentage</div>
              <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#00eaff" }}>{percentage}%</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem 2rem", borderRadius: "12px", border: "1px solid rgba(100,130,255,0.2)", textAlign: "center", minWidth: "120px" }}>
              <div style={{ fontSize: "0.85rem", color: "rgba(150,170,220,0.7)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.3rem" }}>Level</div>
              <div style={{ fontSize: "1.8rem", fontWeight: "900", color: lang.color }}>{detectedLevel}</div>
            </div>
          </div>
        )}

        {loadingRoadmap ? (
          <div style={{ textAlign: "center", color: "#00eaff", fontSize: "1.2rem", animation: "pulse 2s infinite" }}>Generating your 4-week personalized plan...</div>
        ) : roadmapError ? (
          <div style={{ textAlign: "center", color: "#ff6b6b", fontSize: "1.2rem" }}>{roadmapError}</div>
        ) : (
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(100,130,255,0.2)", borderRadius: "20px", padding: "2.5rem", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}>
            <p style={{ color: "#ffffff", fontSize: "1.15rem", marginBottom: "2.5rem", lineHeight: "1.8", fontWeight: "500" }}>
              {roadmap.summary}
            </p>

            <div style={{ display: "grid", gap: "2rem" }}>
              {roadmap.weeks?.map((week, idx) => (
                <div key={idx} style={{ background: "rgba(10,15,35,0.6)", borderRadius: "16px", padding: "2rem", borderLeft: `5px solid ${lang.color}`, border: "1px solid rgba(255,255,255,0.08)", borderLeftColor: lang.color }}>
                  <h3 style={{ color: "#ffffff", marginBottom: "1rem", fontSize: "1.4rem", fontWeight: "800" }}>Week {week.week}: <span style={{ color: lang.color }}>{week.topic}</span></h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div>
                      <h4 style={{ color: "#00eaff", fontSize: "1.1rem", marginBottom: "0.5rem", fontWeight: "700" }}>🎯 Goals</h4>
                      <ul style={{ color: "#e2e8f0", paddingLeft: "1.5rem", margin: 0, lineHeight: "1.6", fontSize: "1rem" }}>
                        {week.goals?.map((g, i) => <li key={i}>{g}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "3rem", background: "rgba(0, 230, 255, 0.05)", padding: "2rem", borderRadius: "16px", border: "1px solid rgba(0, 230, 255, 0.2)" }}>
              <h3 style={{ color: "#00eaff", marginBottom: "1rem", fontSize: "1.3rem", fontWeight: "800" }}>💡 Pro Tips for Success</h3>
              <ul style={{ color: "#ffffff", paddingLeft: "1.5rem", lineHeight: "1.8", fontSize: "1.05rem" }}>
                {roadmap.tips?.map((tip, i) => <li key={i} style={{ marginBottom: "0.5rem" }}>{tip}</li>)}
              </ul>
            </div>
          </div>
        )}

        <div style={{ marginTop: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "2rem", color: "#fff", fontWeight: "800", margin: 0 }}>📺 Recommended Videos</h2>
            <span style={{ background: "rgba(255, 70, 100, 0.2)", color: "#ff6b6b", padding: "0.3rem 0.8rem", borderRadius: "50px", fontSize: "0.8rem", fontWeight: "bold" }}>Handpicked</span>
          </div>
          {loadingResources ? (
            <p style={{ color: "#00eaff", fontSize: "1.1rem" }}>Finding the best tutorials...</p>
          ) : videos.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {videos.map((video, idx) => (
                <a key={idx} href={video.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{ 
                    background: "rgba(255,255,255,0.03)", 
                    border: "1px solid rgba(255,255,255,0.1)", 
                    borderRadius: "16px", 
                    overflow: "hidden",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = `0 10px 30px ${lang.color}33`;
                    e.currentTarget.style.borderColor = lang.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}>
                    <img src={video.thumbnail} alt={video.title} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                    <div style={{ padding: "1.2rem", display: "flex", flexDirection: "column", height: "calc(100% - 160px)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                        <span style={{ color: "#00eaff", fontSize: "0.8rem", fontWeight: "bold", background: "rgba(0,230,255,0.1)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>Week {video.week || idx + 1}</span>
                        <span style={{ color: "rgba(180,200,255,0.7)", fontSize: "0.8rem", maxWidth: "60%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{video.topic || "Tutorial"}</span>
                      </div>
                      <h4 style={{ color: "#fff", margin: "0 0 0.5rem 0", fontSize: "1.1rem", lineHeight: "1.4", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{video.title}</h4>
                      <p style={{ color: "rgba(180,200,255,0.7)", fontSize: "0.9rem", margin: "0 0 auto 0" }}>{video.channelTitle}</p>
                      
                      <button style={{ 
                        width: "100%", 
                        padding: "0.6rem", 
                        marginTop: "1rem",
                        background: "rgba(0, 230, 255, 0.15)", 
                        color: "#00eaff", 
                        border: "1px solid rgba(0,230,255,0.3)", 
                        borderRadius: "8px", 
                        fontWeight: "bold", 
                        cursor: "pointer", 
                        transition: "all 0.2s" 
                      }} 
                      onMouseEnter={(e) => e.target.style.background="rgba(0, 230, 255, 0.25)"} 
                      onMouseLeave={(e) => e.target.style.background="rgba(0, 230, 255, 0.15)"}>
                        Watch Video
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.6)" }}>No videos found.</p>
          )}
        </div>

        <div style={{ marginTop: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "2rem", color: "#fff", fontWeight: "800", margin: 0 }}>📚 Study Notes</h2>
          </div>
          {loadingResources ? (
            <p style={{ color: "#00eaff", fontSize: "1.1rem" }}>Preparing notes...</p>
          ) : notes.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {notes.map((note, idx) => {
                const isExpanded = expandedNote === idx;
                return (
                  <div key={idx} style={{ 
                    background: "rgba(255,255,255,0.03)", 
                    border: "1px solid rgba(255,255,255,0.1)", 
                    borderRadius: "12px", 
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                  }}>
                    <div 
                      onClick={() => setExpandedNote(isExpanded ? null : idx)}
                      style={{ padding: "1.2rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", background: isExpanded ? "rgba(255,255,255,0.08)" : "transparent" }}
                    >
                      <span style={{ color: "#fff", fontWeight: "600", fontSize: "1.1rem" }}>{note.title}</span>
                      <span style={{ color: "#00eaff", fontSize: "1.5rem", fontWeight: "bold" }}>{isExpanded ? "−" : "+"}</span>
                    </div>
                    {isExpanded && (
                      <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(10,15,35,0.4)" }}>
                        <p style={{ color: "#e2e8f0", lineHeight: "1.6", marginBottom: "1.5rem" }}>{note.content}</p>
                        
                        {note.keyPoints && note.keyPoints.length > 0 && (
                          <div style={{ marginBottom: "1.5rem" }}>
                            <h4 style={{ color: "#00eaff", fontSize: "1rem", marginBottom: "0.5rem" }}>Key Points:</h4>
                            <ul style={{ color: "#cbd5e1", paddingLeft: "1.5rem", margin: 0 }}>
                              {note.keyPoints.map((kp, kIdx) => <li key={kIdx} style={{ marginBottom: "0.3rem" }}>{kp}</li>)}
                            </ul>
                          </div>
                        )}
                        
                        {note.example && (
                          <div style={{ marginBottom: "1.5rem" }}>
                            <h4 style={{ color: "#3dd68c", fontSize: "1rem", marginBottom: "0.5rem" }}>Example:</h4>
                            <div style={{ background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "8px", color: "#a7f3d0", fontFamily: "monospace", fontSize: "0.9rem" }}>{note.example}</div>
                          </div>
                        )}
                        
                        {note.practiceTask && (
                          <div>
                            <h4 style={{ color: "#f7c948", fontSize: "1rem", marginBottom: "0.5rem" }}>Practice Task:</h4>
                            <p style={{ color: "#fef08a", margin: 0, fontSize: "0.95rem" }}>{note.practiceTask}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.6)" }}>No notes available.</p>
          )}
        </div>

        <div style={{ marginTop: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "2rem", color: "#fff", fontWeight: "800", margin: 0 }}>💻 LeetCode Practice</h2>
          </div>
          {loadingResources ? (
            <p style={{ color: "#00eaff", fontSize: "1.1rem" }}>Finding the best problems...</p>
          ) : leetcode && leetcode.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {leetcode.map((lc, idx) => (
                <a key={idx} href={lc.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{ 
                    background: "rgba(255,255,255,0.03)", 
                    border: "1px solid rgba(255,255,255,0.1)", 
                    borderRadius: "12px", 
                    padding: "1.5rem",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.8rem",
                    height: "100%"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = "#f7c948";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}>
                    <h4 style={{ color: "#fff", margin: 0, fontSize: "1.1rem" }}>{lc.title}</h4>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <span style={{ 
                        fontSize: "0.75rem", 
                        padding: "0.2rem 0.6rem", 
                        borderRadius: "4px", 
                        background: lc.difficulty === "Easy" ? "rgba(61, 214, 140, 0.15)" : lc.difficulty === "Medium" ? "rgba(247, 201, 72, 0.15)" : "rgba(255, 107, 107, 0.15)",
                        color: lc.difficulty === "Easy" ? "#3dd68c" : lc.difficulty === "Medium" ? "#f7c948" : "#ff6b6b",
                        fontWeight: "bold"
                      }}>
                        {lc.difficulty}
                      </span>
                      <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: "4px", background: "rgba(0, 234, 255, 0.1)", color: "#00eaff" }}>
                        {lc.topic}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.6)" }}>No practice questions available.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Roadmap;

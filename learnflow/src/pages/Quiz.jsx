import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuroraBg, Navbar, GlowBtn, LANG_DATA } from "../components/Shared";

function Quiz() {
  const { language } = useParams();
  const navigate = useNavigate();

  const normalizedLanguage = language
    ? decodeURIComponent(language).trim().toLowerCase()
    : "";

  const lang = LANG_DATA[normalizedLanguage] || {
    label: normalizedLanguage || "Language",
    color: "#7b2fff",
    icon: "📘",
  };

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMsg, setLoadMsg] = useState("Preparing your skill assessment…");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState(null);

  const goHome = () => {
    navigate("/dashboard");
  };

  const handleFinish = (finalAnswers, finalQuestions) => {
    const score = finalAnswers.filter(
      (item) => item.selected === item.correct
    ).length;

    const total = finalQuestions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    let detectedLevel = "Beginner";
    if (percentage >= 75) detectedLevel = "Advanced";
    else if (percentage >= 40) detectedLevel = "Intermediate";

    navigate("/result", {
      state: {
        language: normalizedLanguage,
        score,
        total,
        percentage,
        detectedLevel,
        answers: finalAnswers,
        questions: finalQuestions,
      },
    });
  };

  useEffect(() => {
    if (!normalizedLanguage) {
      setError("No language selected.");
      setLoading(false);
      return;
    }

    const msgs = [
      "Preparing your skill assessment…",
      "Balancing easy and advanced questions…",
      "Evaluating your learning path…",
      "Almost ready…",
    ];

    let idx = 0;
    const messageInterval = setInterval(() => {
      idx = (idx + 1) % msgs.length;
      setLoadMsg(msgs[idx]);
    }, 1800);
const generateQuiz = async () => {
  try {
    setLoading(true);
    setError(null);
    setQuestions([]);
    setAnswers([]);
    setCurrent(0);
    setSelected(null);
    setRevealed(false);

    const resp = await fetch("http://127.0.0.1:5000/generate-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course: normalizedLanguage,
      }),
    });

    const rawText = await resp.text();
    console.log("Raw backend response:", rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error(`Backend returned non-JSON response: ${rawText}`);
    }

    if (!resp.ok || !data.success) {
      throw new Error(
        data?.error || data?.message || data?.raw || "Failed to generate quiz"
      );
    }

    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      throw new Error("No quiz questions received.");
    }

    const formattedQuestions = data.questions
      .map((item) => {
        const options = Array.isArray(item.options) ? item.options : [];
        if (!item.question || options.length !== 4) return null;

        let answerIndex = options.indexOf(item.answer);

        if (answerIndex === -1) {
          const letterMap = { A: 0, B: 1, C: 2, D: 3 };
          const normalizedAnswer =
            typeof item.answer === "string"
              ? item.answer.trim().toUpperCase()
              : "";
          answerIndex = letterMap[normalizedAnswer] ?? 0;
        }

        return {
          q: item.question,
          opts: options,
          ans: answerIndex,
          exp: item.explanation || "No explanation provided.",
        };
      })
      .filter(Boolean);

    if (!formattedQuestions.length) {
      throw new Error("Quiz data was invalid or incomplete.");
    }

    setQuestions(formattedQuestions);
  } catch (e) {
    console.error("Quiz generation error:", e);
    setError(e.message || "Failed to generate quiz. Please try again.");
  } finally {
    clearInterval(messageInterval);
    setLoading(false);
  }
};

    generateQuiz();

    return () => {
      clearInterval(messageInterval);
    };
  }, [normalizedLanguage]);

  const handleNext = () => {
    if (selected === null || !questions[current]) return;

    const newAnswers = [...answers, { selected, correct: questions[current].ans }];
    setAnswers(newAnswers);

    if (current + 1 >= questions.length) {
      handleFinish(newAnswers, questions);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const retryFetch = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#07041c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Outfit',sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center", color: "#ff6b6b", maxWidth: "900px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
          <p
            style={{
              marginBottom: "1.5rem",
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
              wordBreak: "break-word",
            }}
          >
            {error}
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <GlowBtn onClick={retryFetch} color={lang.color}>
              Retry
            </GlowBtn>
            <GlowBtn variant="secondary" onClick={goHome} color={lang.color}>
              Go Home
            </GlowBtn>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#07041c 0%,#0d0630 50%,#08031a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Outfit',sans-serif",
          position: "relative",
        }}
      >
        <AuroraBg accentColor={lang.color} />
        <div style={{ position: "relative", zIndex: 5, textAlign: "center" }}>
          <div
            style={{
              fontSize: "3.5rem",
              marginBottom: "1.5rem",
              animation: "spin 2s linear infinite",
              display: "inline-block",
            }}
          >
            ⚙️
          </div>

          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#fff",
              marginBottom: "0.7rem",
            }}
          >
            Generating Your Quiz
          </h2>

          <p
            style={{
              color: lang.color,
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
            }}
          >
            {loadMsg}
          </p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#07041c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        <div style={{ textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
          <p style={{ marginBottom: "1.5rem" }}>No questions available.</p>
          <GlowBtn onClick={goHome}>Go Home</GlowBtn>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const optLabels = ["A", "B", "C", "D"];
  const correctSoFar = answers.filter((a) => a.selected === a.correct).length;

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
          maxWidth: 780,
          margin: "0 auto",
          padding: "7rem 2rem 4rem",
        }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.6rem",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                color: "rgba(150,180,220,0.6)",
                fontFamily: "'Space Mono',monospace",
                letterSpacing: "0.1em",
              }}
            >
              Q {current + 1} / {questions.length}
            </span>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: lang.color,
                  fontFamily: "'Space Mono',monospace",
                }}
              >
                {lang.icon} {lang.label || normalizedLanguage} Skill Assessment
              </span>

              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#3dd68c",
                  fontFamily: "'Space Mono',monospace",
                }}
              >
                ✓ {correctSoFar}
              </span>
            </div>
          </div>

          <div
            style={{
              height: 5,
              background: "rgba(255,255,255,0.07)",
              borderRadius: 5,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${lang.color}, #7b2fff)`,
                borderRadius: 5,
                transition: "width 0.45s ease",
              }}
            />
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(100,130,255,0.15)",
            borderRadius: "22px",
            padding: "2.2rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              color: "rgba(150,180,220,0.45)",
              letterSpacing: "0.15em",
              fontFamily: "'Space Mono',monospace",
              marginBottom: "0.9rem",
            }}
          >
            QUESTION {current + 1}
          </div>

          <p
            style={{
              fontSize: "1.05rem",
              color: "#e8eeff",
              lineHeight: 1.72,
              fontWeight: 500,
              marginBottom: "2rem",
            }}
          >
            {q.q}
          </p>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            {q.opts.map((opt, i) => (
              <div
                key={i}
                onClick={() => !revealed && setSelected(i)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1rem 1.2rem",
                  borderRadius: "12px",
                  background: selected === i ? `${lang.color}15` : "rgba(255,255,255,0.03)",
                  border:
                    selected === i
                      ? `1px solid ${lang.color}66`
                      : "1px solid rgba(100,130,255,0.15)",
                  color: "rgba(200,215,255,0.8)",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    minWidth: 18,
                  }}
                >
                  {optLabels[i]}
                </span>
                <span style={{ fontSize: "0.92rem", lineHeight: 1.55, flex: 1 }}>
                  {opt}
                </span>
              </div>
            ))}
          </div>

          {revealed && (
            <div
              style={{
                marginTop: "1.2rem",
                padding: "1rem 1.2rem",
                background: "rgba(0,230,255,0.05)",
                border: "1px solid rgba(0,230,255,0.15)",
                borderRadius: "12px",
                fontSize: "0.85rem",
                color: "rgba(180,210,255,0.75)",
              }}
            >
              <span style={{ color: "#00eaff", fontWeight: 600 }}>Explanation: </span>
              {q.exp}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          {!revealed && selected !== null && (
            <GlowBtn variant="secondary" color={lang.color} onClick={() => setRevealed(true)}>
              See Explanation
            </GlowBtn>
          )}

          <GlowBtn
            variant="primary"
            color={lang.color}
            onClick={handleNext}
            disabled={selected === null}
          >
            {current + 1 === questions.length ? "Finish Quiz →" : "Next →"}
          </GlowBtn>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
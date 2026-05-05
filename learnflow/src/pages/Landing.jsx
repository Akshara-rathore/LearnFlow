import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();

  const handleGuest = () => {
    loginAsGuest();
    navigate("/dashboard");
  };

  return (
    <div className="landing-page">
      <div className="landing-grid" />
      <div className="landing-noise" />
      <div className="landing-glow landing-glow-1" />
      <div className="landing-glow landing-glow-2" />
      <div className="landing-glow landing-glow-3" />

      <header className="landing-header">
        <div className="brand">
          <div className="brand-icon">
            <span className="brand-icon-inner" />
          </div>
          <h2 className="brand-text">
            Learn<span>Flow</span>
          </h2>
        </div>

        <nav className="landing-nav">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#blog">Blog</a>
        </nav>
      </header>

      <main className="landing-main" id="home">
        <section className="hero-left">


          <h1 className="hero-title">
            <span className="hero-title-main">LearnFlow</span>

          </h1>

          <h3 className="hero-tagline">
            Your personalized roadmap and learning platform
          </h3>

          <p className="hero-desc">
            Unlock your potential with AI-curated learning paths tailored to
            your goals, pace, and expertise — from beginner to mastery, every
            step of the way.
          </p>

          <div className="hero-actions">
            <div className="landing-auth" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/sign-in">
                <button type="button">Log In</button>
              </Link>
              <Link to="/sign-up">
                <button type="button">Register</button>
              </Link>
              <button
                type="button"
                onClick={handleGuest}
                style={{ background: "transparent", border: "1px solid rgba(0,230,255,0.4)" }}
              >
                Continue as Guest
              </button>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">50K+</div>
              <div className="stat-label">Learners</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">800+</div>
              <div className="stat-label">Courses</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">98%</div>
              <div className="stat-label">Satisfaction</div>
            </div>
          </div>
        </section>

        <aside className="hero-right">
          <div className="vertical-copy">
            LEARNFLOW · PERSONALIZED EDUCATION
          </div>

          <div className="social-stack">
            <button type="button" className="social-btn">◫</button>
            <button type="button" className="social-btn">T</button>
            <button type="button" className="social-btn">G</button>
            <button type="button" className="social-btn">in</button>
          </div>
        </aside>
      </main>

      <footer className="landing-footer">
        <span>© 2026 LearnFlow</span>
        <span>Privacy</span>
        <span>Terms</span>
        <span>Contact</span>
      </footer>
    </div>
  );
}

export default Landing;
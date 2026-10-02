import { Link, Navigate } from "react-router-dom";

import {
  ShieldCheck,
  Brain,
  Sparkles,
  MessageCircle,
  Lightbulb,
  Globe,
  Users,
  ArrowRight,
  Activity,
  LineChart,
  Target,
  Clock3,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./Landing.css";

/* =====================================================
   FEATURES
===================================================== */

const FEATURES = [
  {
    icon: Brain,
    title: "Behavioral Analytics",
    description:
      "Understand attention patterns, focus quality, productivity trends, and distraction frequency from your real activity.",
  },
  {
    icon: Sparkles,
    title: "AI Engine",
    description:
      "Detect distraction patterns, calculate predictive risk scores, and generate intelligent insights from your activity.",
  },
  {
    icon: MessageCircle,
    title: "AI Chatbot",
    description:
      "Ask questions in natural language and receive answers grounded in your own productivity data.",
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    description:
      "Get personalized focus improvements, break schedules, and suggestions based on your behavioral patterns.",
  },
  {
    icon: Users,
    title: "Role-Based Administration",
    description:
      "Superadmin and subadmin capabilities make user and organization management simple and secure.",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description:
      "Use the platform in English, Hindi, Telugu, Tamil, and Malayalam with light and dark themes.",
  },
];

/* =====================================================
   HOW IT WORKS
===================================================== */

const STEPS = [
  {
    icon: Activity,
    title: "Track",
    description:
      "Capture focus sessions, application activity, and distraction events.",
  },
  {
    icon: LineChart,
    title: "Analyze",
    description:
      "Convert raw activity into meaningful behavioral and statistical insights.",
  },
  {
    icon: Sparkles,
    title: "Improve",
    description:
      "Use AI-powered recommendations to build healthier and more productive work habits.",
  },
];

/* =====================================================
   BENEFITS
===================================================== */

const BENEFITS = [
  "Understand where your time actually goes",
  "Identify your biggest distraction patterns",
  "Measure attention and productivity trends",
  "Receive personalized AI recommendations",
  "Interact with your data through an AI chatbot",
  "Monitor productivity through intelligent analytics",
];

/* =====================================================
   DASHBOARD PREVIEW DATA
===================================================== */

const DASHBOARD_STATS = [
  {
    icon: Target,
    label: "Attention Score",
    value: "87%",
  },
  {
    icon: Clock3,
    label: "Focus Time",
    value: "6h 24m",
  },
  {
    icon: TrendingUp,
    label: "Productivity",
    value: "+18%",
  },
];

/* =====================================================
   ROLE BASED DASHBOARD
===================================================== */

function dashboardPathForUser(user) {
  const role = String(user?.role || "")
    .toLowerCase()
    .trim();

  if (
    role === "superadmin" ||
    role === "super_admin" ||
    user?.is_superuser === true
  ) {
    return "/admin/dashboard";
  }

  if (role === "subadmin" || role === "sub_admin") {
    return "/subadmin/dashboard";
  }

  return "/dashboard";
}

/* =====================================================
   LANDING PAGE
===================================================== */

export default function Landing() {
  const { user, loading } = useAuth();

  /* Redirect logged-in users */
  if (!loading && user) {
    return <Navigate to={dashboardPathForUser(user)} replace />;
  }

  return (
    <div className="landing">

      {/* =================================================
          BACKGROUND EFFECTS
      ================================================= */}

      <div className="landing-background">
        <div className="background-grid"></div>
        <div className="background-glow glow-one"></div>
        <div className="background-glow glow-two"></div>
        <div className="background-glow glow-three"></div>
      </div>

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="landing-nav">

        <Link to="/" className="landing-brand">
          <div className="brand-icon">
            <ShieldCheck size={21} />
          </div>

          <span>FocusGuard AI</span>
        </Link>

        <nav className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#benefits">Benefits</a>
        </nav>

        <div className="landing-nav-actions">
          <Link to="/login" className="btn-ghost">
            Sign In
          </Link>

          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
        </div>

      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <main>

        <section className="landing-hero">

          <div className="hero-content">

            <div className="hero-badge">
              <Sparkles size={15} />
              AI-Powered Productivity Intelligence
            </div>

            <h1>
              Understand your focus.
              <br />

              <span className="accent-name">
                Master your productivity.
              </span>
            </h1>

            <p className="landing-hero-subtitle">
              FocusGuard AI transforms your everyday activity into
              meaningful productivity insights. Discover attention
              patterns, identify distractions, and receive personalized
              AI-powered guidance to work smarter.
            </p>

            <div className="landing-hero-actions">

              <Link
                to="/register"
                className="btn-primary landing-cta"
              >
                Start Your Focus Journey
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/login"
                className="btn-secondary landing-cta"
              >
                Sign In
              </Link>

            </div>

            <div className="hero-trust">

              <div>
                <CheckCircle2 size={16} />
                AI-powered insights
              </div>

              <div>
                <CheckCircle2 size={16} />
                Behavioral analytics
              </div>

              <div>
                <CheckCircle2 size={16} />
                Personalized recommendations
              </div>

            </div>

          </div>

          {/* =================================================
              HERO DASHBOARD PREVIEW
          ================================================= */}

          <div className="hero-dashboard">

            <div className="dashboard-window">

              <div className="dashboard-window-header">

                <div className="window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <span>FocusGuard AI Dashboard</span>

                <div className="live-status">
                  <span></span>
                  Live
                </div>

              </div>

              <div className="dashboard-preview-content">

                <div className="preview-heading">
                  <div>
                    <span>Good morning 👋</span>
                    <h3>Your focus overview</h3>
                  </div>

                  <div className="preview-date">
                    Today
                  </div>
                </div>

                <div className="preview-stat-grid">

                  {DASHBOARD_STATS.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        className="preview-stat"
                        key={item.label}
                      >
                        <div className="preview-stat-icon">
                          <Icon size={17} />
                        </div>

                        <div>
                          <span>{item.label}</span>
                          <strong>{item.value}</strong>
                        </div>
                      </div>
                    );
                  })}

                </div>

                <div className="preview-chart-card">

                  <div className="chart-header">
                    <div>
                      <span>Focus performance</span>
                      <strong>Weekly activity</strong>
                    </div>

                    <TrendingUp size={18} />
                  </div>

                  <div className="fake-chart">

                    <div className="chart-line line-one"></div>
                    <div className="chart-line line-two"></div>
                    <div className="chart-line line-three"></div>

                    <div className="chart-bars">
                      <span style={{ height: "38%" }}></span>
                      <span style={{ height: "55%" }}></span>
                      <span style={{ height: "46%" }}></span>
                      <span style={{ height: "72%" }}></span>
                      <span style={{ height: "64%" }}></span>
                      <span style={{ height: "84%" }}></span>
                      <span style={{ height: "94%" }}></span>
                    </div>

                  </div>

                </div>

                <div className="preview-ai-card">

                  <div className="ai-card-icon">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <strong>AI Insight</strong>
                    <p>
                      Your focus is strongest between 9 AM and 11 AM.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="landing-mini-stats">

          <div className="mini-stat">
            <Brain size={21} />
            <strong>AI</strong>
            <span>Powered insights</span>
          </div>

          <div className="mini-stat">
            <Activity size={21} />
            <strong>Real-time</strong>
            <span>Activity intelligence</span>
          </div>

          <div className="mini-stat">
            <LineChart size={21} />
            <strong>Smart</strong>
            <span>Behavioral analytics</span>
          </div>

          <div className="mini-stat">
            <Shield size={21} />
            <strong>Secure</strong>
            <span>Role-based access</span>
          </div>

        </section>

        {/* =================================================
            FEATURES
        ================================================= */}

        <section
          className="landing-section"
          id="features"
        >

          <div className="section-heading">

            <span className="section-eyebrow">
              POWERFUL FEATURES
            </span>

            <h2 className="landing-section-title">
              Everything you need to
              <span> focus better.</span>
            </h2>

            <p>
              One intelligent platform that connects behavioral
              analytics, AI, and personalized productivity guidance.
            </p>

          </div>

          <div className="landing-feature-grid">

            {FEATURES.map((feature) => {

              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="landing-feature-card"
                >

                  <div className="landing-feature-icon">
                    <Icon size={21} />
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                  <div className="feature-arrow">
                    <ArrowRight size={15} />
                  </div>

                </div>
              );

            })}

          </div>

        </section>

        {/* =================================================
            WHY FOCUSGUARD
        ================================================= */}

        <section
          className="why-section"
          id="benefits"
        >

          <div className="why-content">

            <span className="section-eyebrow">
              WHY FOCUSGUARD AI
            </span>

            <h2>
              Stop guessing where
              <span> your time goes.</span>
            </h2>

            <p>
              Traditional productivity tools tell you what you
              completed. FocusGuard AI helps you understand how
              you actually work.
            </p>

            <div className="benefits-list">

              {BENEFITS.map((benefit) => (

                <div
                  className="benefit-item"
                  key={benefit}
                >
                  <CheckCircle2 size={18} />
                  <span>{benefit}</span>
                </div>

              ))}

            </div>

            <Link
              to="/register"
              className="btn-primary landing-cta"
            >
              Discover Your Productivity
              <ArrowRight size={16} />
            </Link>

          </div>

          <div className="why-visual">

            <div className="focus-orb">

              <div className="orb-ring ring-one"></div>
              <div className="orb-ring ring-two"></div>

              <div className="orb-center">
                <Target size={38} />
                <strong>87%</strong>
                <span>Focus Score</span>
              </div>

            </div>

            <div className="floating-card floating-card-one">
              <Zap size={17} />
              <div>
                <strong>+18%</strong>
                <span>Productivity</span>
              </div>
            </div>

            <div className="floating-card floating-card-two">
              <Activity size={17} />
              <div>
                <strong>Low</strong>
                <span>Distraction Risk</span>
              </div>
            </div>

          </div>

        </section>

        {/* =================================================
            HOW IT WORKS
        ================================================= */}

        <section
          className="landing-section landing-steps-section"
          id="how-it-works"
        >

          <div className="section-heading">

            <span className="section-eyebrow">
              SIMPLE PROCESS
            </span>

            <h2 className="landing-section-title">
              From activity to
              <span> improvement.</span>
            </h2>

            <p>
              FocusGuard AI continuously turns your activity into
              actionable intelligence.
            </p>

          </div>

          <div className="landing-steps">

            {STEPS.map((step, index) => {

              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="landing-step"
                >

                  <div className="landing-step-number">
                    0{index + 1}
                  </div>

                  <div className="landing-step-icon">
                    <Icon size={24} />
                  </div>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>

                  {index < STEPS.length - 1 && (
                    <div className="step-connector">
                      <ArrowRight size={18} />
                    </div>
                  )}

                </div>
              );

            })}

          </div>

        </section>

        {/* =================================================
            AI CALLOUT
        ================================================= */}

        <section className="ai-callout">

          <div className="ai-callout-icon">
            <Sparkles size={28} />
          </div>

          <div>

            <span>INTELLIGENT PRODUCTIVITY COACH</span>

            <h2>
              Your data shouldn't just be stored.
              <br />
              <span>It should teach you.</span>
            </h2>

            <p>
              FocusGuard AI combines behavioral signals,
              statistical analysis, and AI-generated insights
              to help you continuously improve.
            </p>

          </div>

        </section>

        {/* =================================================
            FINAL CTA
        ================================================= */}

        <section className="landing-final-cta">

          <div className="final-cta-glow"></div>

          <div className="final-cta-content">

            <div className="hero-badge">
              <Sparkles size={15} />
              Start your productivity journey
            </div>

            <h2>
              Ready to understand
              <span> your own patterns?</span>
            </h2>

            <p>
              Build better focus habits with data,
              intelligence, and personalized guidance.
            </p>

            <Link
              to="/register"
              className="btn-primary landing-cta"
            >
              Create Your Free Account
              <ArrowRight size={17} />
            </Link>

          </div>

        </section>

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="landing-footer">

        <div className="landing-brand">

          <div className="brand-icon">
            <ShieldCheck size={18} />
          </div>

          FocusGuard AI

        </div>

        <p>
          AI-powered human attention and productivity intelligence.
        </p>

        <span>
          © 2026 FocusGuard AI
        </span>

      </footer>

    </div>
  );
}
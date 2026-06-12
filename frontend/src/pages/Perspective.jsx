import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --deep:   #0f1e35;
    --coral:  #FF7B54;
    --amber:  #FFB347;
    --teal:   #4ECDC4;
    --muted:  #8faac4;
    --glass:  rgba(255,255,255,0.05);
    --border: rgba(255,255,255,0.08);
  }

  @keyframes slideDown  { from{transform:translateY(-100%);opacity:0;}to{transform:translateY(0);opacity:1;} }
  @keyframes fadeUp     { from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);} }
  @keyframes fadeIn     { from{opacity:0;}to{opacity:1;} }
  @keyframes orb1       { 0%,100%{transform:translate(0,0);}50%{transform:translate(35px,-25px);} }
  @keyframes orb2       { 0%,100%{transform:translate(0,0);}50%{transform:translate(-28px,20px);} }
  @keyframes botFloat   { 0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);} }
  @keyframes glowCoral  { 0%,100%{box-shadow:0 0 20px rgba(255,123,84,0.28);}50%{box-shadow:0 0 42px rgba(255,123,84,0.58);} }
  @keyframes glowTeal   { 0%,100%{box-shadow:0 0 14px rgba(78,205,196,0.3);}50%{box-shadow:0 0 32px rgba(78,205,196,0.55);} }
  @keyframes pulse      { 0%,100%{opacity:0.5;}50%{opacity:1;} }
  @keyframes cardIn     { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }
  @keyframes scoreFill  { from{stroke-dashoffset:283;}to{stroke-dashoffset:var(--offset);} }
  @keyframes scoreNum   { from{opacity:0;transform:scale(0.7);}to{opacity:1;transform:scale(1);} }
  @keyframes badgePop   { 0%{transform:scale(0.5) rotate(-8deg);opacity:0;} 70%{transform:scale(1.1) rotate(2deg);}100%{transform:scale(1) rotate(0deg);opacity:1;} }
  @keyframes confetti   { 0%{transform:translateY(0) rotate(0deg);opacity:1;} 100%{transform:translateY(-60px) rotate(360deg);opacity:0;} }

  body, #root {
    font-family:'Outfit',sans-serif;
    background:var(--deep); color:#fff;
    min-height:100vh; overflow-x:hidden;
  }

  /* ── NAV ── */
  .pv-nav {
    position:fixed; top:0; left:0; right:0; z-index:200;
    display:flex; align-items:center; justify-content:space-between;
    padding:0.9rem 4vw;
    background:rgba(15,30,53,0.88); backdrop-filter:blur(20px);
    border-bottom:1px solid var(--border);
    animation:slideDown 0.6s ease both;
  }
  .pv-logo { font-family:'Cormorant Garamond',serif; font-size:1.55rem; font-weight:700; color:#fff; }
  .pv-logo span { color:var(--coral); }
  .pv-nav-badge {
    display:flex; align-items:center; gap:0.55rem;
    background:rgba(255,179,71,0.1); border:1px solid rgba(255,179,71,0.22);
    color:var(--amber); padding:0.35rem 1rem; border-radius:50px;
    font-size:0.75rem; font-weight:700; letter-spacing:0.07em; text-transform:uppercase;
  }
  .pv-nav-dot { width:7px;height:7px;border-radius:50%;background:var(--amber);animation:pulse 2s ease-in-out infinite; }

  /* ── PAGE ── */
  .pv-page {
    min-height:100vh; padding:6.5rem 4vw 4rem;
    max-width:900px; margin:0 auto; position:relative;
  }
  .pv-orb {
    position:fixed; border-radius:50%;
    filter:blur(100px); pointer-events:none; z-index:0;
  }
  .pv-orb-1 { width:500px;height:500px;background:rgba(255,123,84,0.06);top:-60px;right:-80px;animation:orb1 14s ease-in-out infinite; }
  .pv-orb-2 { width:400px;height:400px;background:rgba(78,205,196,0.05);bottom:0;left:-80px;animation:orb2 11s ease-in-out infinite; }
  .pv-orb-3 { width:300px;height:300px;background:rgba(255,179,71,0.04);top:40%;left:30%;animation:orb1 18s ease-in-out infinite reverse; }

  /* ── HERO HEADER ── */
  .pv-hero {
    text-align:center; margin-bottom:3rem; position:relative; z-index:1;
    animation:fadeUp 0.6s 0.1s ease both;
  }
  .pv-hero-eyebrow {
    font-size:0.72rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase;
    color:var(--amber); margin-bottom:0.6rem;
  }
  .pv-hero-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2rem,4vw,3rem); font-weight:700; color:#fff; line-height:1.1;
    margin-bottom:0.8rem;
  }
  .pv-hero-title em { font-style:italic; color:var(--coral); }
  .pv-hero-sub { font-size:0.92rem; color:rgba(255,255,255,0.45); font-weight:300; max-width:480px; margin:0 auto; line-height:1.7; }

  /* ── SCORE RING ── */
  .pv-score-wrap {
    display:flex; flex-direction:column; align-items:center;
    margin-bottom:3rem; position:relative; z-index:1;
    animation:fadeUp 0.6s 0.2s ease both;
  }
  .pv-score-ring { position:relative; width:140px; height:140px; margin-bottom:1rem; }
  .pv-ring-svg { transform:rotate(-90deg); }
  .pv-ring-bg   { fill:none; stroke:rgba(255,255,255,0.07); stroke-width:8; }
  .pv-ring-fill {
    fill:none; stroke-width:8; stroke-linecap:round;
    stroke-dasharray:283;
    animation:scoreFill 1.4s 0.5s cubic-bezier(0.4,0,0.2,1) both;
  }
  .pv-score-inner {
    position:absolute; inset:0;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
  }
  .pv-score-num {
    font-family:'Cormorant Garamond',serif;
    font-size:2.2rem; font-weight:700; line-height:1;
    animation:scoreNum 0.6s 0.8s ease both; opacity:0;
    animation-fill-mode:both;
  }
  .pv-score-label-sm { font-size:0.65rem; color:var(--muted); font-weight:500; letter-spacing:0.05em; text-transform:uppercase; }
  .pv-score-title { font-size:0.8rem; font-weight:600; color:rgba(255,255,255,0.6); letter-spacing:0.06em; text-transform:uppercase; }
  .pv-score-desc  { font-size:0.82rem; color:var(--muted); max-width:320px; text-align:center; line-height:1.6; font-weight:300; }

  /* ── TWO-COL GRID ── */
  .pv-grid {
    display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;
    position:relative; z-index:1; margin-bottom:1.5rem;
  }

  /* answer card */
  .pv-answer-card {
    background:var(--glass); border:1px solid var(--border);
    border-radius:20px; padding:1.5rem;
    backdrop-filter:blur(16px);
    animation:cardIn 0.5s ease both;
    transition:border-color 0.3s;
  }
  .pv-answer-card:hover { border-color:rgba(255,123,84,0.25); }
  .pv-answer-eyebrow { font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--coral); margin-bottom:0.35rem; display:flex; align-items:center; gap:0.4rem; }
  .pv-answer-q { font-size:0.78rem; color:rgba(255,255,255,0.35); line-height:1.5; margin-bottom:0.7rem; font-weight:300; font-style:italic; }
  .pv-answer-text { font-size:0.9rem; color:rgba(255,255,255,0.78); line-height:1.7; font-weight:300; }

  /* ── AI PERSPECTIVE ── */
  .pv-ai-card {
    background:linear-gradient(135deg, rgba(78,205,196,0.07) 0%, rgba(255,123,84,0.05) 100%);
    border:1px solid rgba(78,205,196,0.22);
    border-radius:22px; padding:2rem;
    position:relative; z-index:1;
    margin-bottom:1.5rem;
    animation:cardIn 0.5s 0.15s ease both;
    overflow:hidden;
  }
  .pv-ai-card::before {
    content:'';
    position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg, var(--teal), var(--amber), var(--coral));
    opacity:0.6;
  }
  .pv-ai-header { display:flex; align-items:center; gap:1rem; margin-bottom:1.2rem; }
  .pv-ai-avatar {
    width:44px; height:44px; border-radius:50%;
    background:linear-gradient(135deg, var(--teal), #0d8a7a);
    display:flex; align-items:center; justify-content:center; font-size:1.2rem;
    box-shadow:0 0 18px rgba(78,205,196,0.3); flex-shrink:0;
    animation:botFloat 4s ease-in-out infinite;
  }
  .pv-ai-name  { font-size:0.8rem; font-weight:700; color:var(--teal); }
  .pv-ai-sub   { font-size:0.7rem; color:rgba(255,255,255,0.35); }
  .pv-ai-quote {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(1rem,1.8vw,1.25rem); font-style:italic; font-weight:600;
    color:rgba(255,255,255,0.85); line-height:1.7;
    padding-left:1.2rem;
    border-left:2px solid var(--teal);
  }

  /* ── GROWTH BADGES ── */
  .pv-badges-wrap {
    position:relative; z-index:1; margin-bottom:1.5rem;
    background:var(--glass); border:1px solid var(--border);
    border-radius:20px; padding:1.5rem;
    animation:cardIn 0.5s 0.2s ease both;
  }
  .pv-badges-title { font-size:0.72rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--amber); margin-bottom:1.1rem; }
  .pv-badges-row   { display:flex; flex-wrap:wrap; gap:0.8rem; }
  .pv-badge {
    display:flex; align-items:center; gap:0.55rem;
    background:rgba(255,179,71,0.1); border:1px solid rgba(255,179,71,0.25);
    border-radius:50px; padding:0.5rem 1.1rem;
    font-size:0.82rem; font-weight:600; color:var(--amber);
    animation:badgePop 0.5s ease both;
  }
  .pv-badge.teal-badge {
    background:rgba(78,205,196,0.1); border-color:rgba(78,205,196,0.25); color:var(--teal);
  }
  .pv-badge.coral-badge {
    background:rgba(255,123,84,0.1); border-color:rgba(255,123,84,0.25); color:var(--coral);
  }

  /* ── BOTTOM BAR ── */
  .pv-bottom {
    position:relative; z-index:1;
    background:var(--glass); border:1px solid var(--border);
    border-radius:20px; padding:1.4rem 1.8rem;
    display:grid; grid-template-columns:auto 1fr auto;
    align-items:center; gap:2rem;
    animation:fadeUp 0.6s 0.3s ease both;
  }
  .pv-bot-wrap   { display:flex; align-items:center; gap:0.9rem; }
  .pv-bot-avatar {
    width:48px; height:48px; border-radius:50%; flex-shrink:0;
    background:linear-gradient(135deg, var(--coral), var(--amber));
    display:flex; align-items:center; justify-content:center; font-size:1.3rem;
    box-shadow:0 0 18px rgba(255,123,84,0.28);
    animation:botFloat 4s ease-in-out infinite;
  }
  .pv-bot-bubble {
    background:rgba(255,255,255,0.05); border:1px solid var(--border);
    border-radius:14px 14px 14px 4px; padding:0.65rem 1rem; max-width:300px;
  }
  .pv-bot-label { font-size:0.67rem; color:var(--teal); font-weight:700; letter-spacing:0.07em; text-transform:uppercase; margin-bottom:0.2rem; }
  .pv-bot-text  { font-size:0.83rem; color:rgba(255,255,255,0.7); line-height:1.5; font-weight:300; }

  .pv-session-note { font-size:0.8rem; color:rgba(255,255,255,0.3); text-align:center; line-height:1.6; }

  .pv-end-btn {
    display:flex; align-items:center; gap:0.6rem; white-space:nowrap;
    background:var(--coral); border:none; color:#fff;
    padding:0.85rem 2rem; border-radius:50px;
    cursor:pointer; font-size:0.95rem; font-weight:700;
    font-family:'Outfit',sans-serif;
    box-shadow:0 0 25px rgba(255,123,84,0.35);
    animation:glowCoral 3s ease-in-out infinite;
    transition:transform 0.2s, box-shadow 0.2s;
  }
  .pv-end-btn:hover { transform:translateY(-2px) scale(1.03); box-shadow:0 0 45px rgba(255,123,84,0.55); }

  @media(max-width:720px){
    .pv-grid{ grid-template-columns:1fr; }
    .pv-bottom{ grid-template-columns:1fr; gap:1.2rem; text-align:center; }
    .pv-bot-wrap{ justify-content:center; }
    .pv-bot-bubble{ max-width:100%; }
  }
`;

function InjectStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

// Animated SVG ring
function ScoreRing({ score }) {
  const pct    = Math.round((score || 0) * 100);
  const radius = 45;
  const circ   = 2 * Math.PI * radius; // ≈ 283
  const offset = circ - (pct / 100) * circ;

  const color = pct >= 80 ? "var(--teal)" : pct >= 60 ? "var(--amber)" : "var(--coral)";
  const label = pct >= 80 ? "Excellent depth" : pct >= 60 ? "Good reflection" : "Keep exploring";

  return (
    <div className="pv-score-wrap">
      <div className="pv-score-ring">
        <svg className="pv-ring-svg" width="140" height="140" viewBox="0 0 100 100">
          <circle className="pv-ring-bg" cx="50" cy="50" r={radius} />
          <circle
            className="pv-ring-fill"
            cx="50" cy="50" r={radius}
            stroke={color}
            style={{ "--offset": offset, strokeDashoffset: offset }}
          />
        </svg>
        <div className="pv-score-inner">
          <span className="pv-score-num" style={{ color }}>{pct}%</span>
          <span className="pv-score-label-sm">depth</span>
        </div>
      </div>
      <div className="pv-score-title">Reflection Depth Score</div>
      <div className="pv-score-desc">{label} — your thoughts show real engagement with the story.</div>
    </div>
  );
}

const FALLBACK_QUESTIONS = [
  "How did the main character's decisions affect those around them?",
  "What emotion stood out to you the most, and why?",
  "What would you have done differently in their situation?",
];

const BADGES = [
  { label: "Perspective Taker", icon: "👁️", cls: "teal-badge" },
  { label: "Deep Thinker",      icon: "🧠", cls: "coral-badge" },
  { label: "Empathy Explorer",  icon: "🤝", cls: "" },
];

function Perspective() {
  const navigate = useNavigate();
  const [perspectiveData, setPerspectiveData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("horizon_perspective");
    if (stored) setPerspectiveData(JSON.parse(stored));
  }, []);

  const answers      = perspectiveData?.user_answers || {};
  const aiPerspective = perspectiveData?.ai_perspective;
  const score        = perspectiveData?.understanding_score;

  const answerEntries = Object.values(answers).filter(v => v?.trim());

  return (
    <>
      <InjectStyles />

      {/* ── NAV ── */}
      <nav className="pv-nav">
        <div className="pv-logo">Hori<span>zon</span></div>
        <div className="pv-nav-badge">
          <div className="pv-nav-dot" />
          Session Complete
        </div>
      </nav>

      {/* orbs */}
      <div className="pv-orb pv-orb-1" />
      <div className="pv-orb pv-orb-2" />
      <div className="pv-orb pv-orb-3" />

      <div className="pv-page">

        {/* ── HERO ── */}
        <div className="pv-hero">
          <div className="pv-hero-eyebrow">✦ Reflection Complete</div>
          <h1 className="pv-hero-title">Exploring Other <em>Perspectives</em></h1>
          <p className="pv-hero-sub">See how your thoughts compare with other ways of seeing the story — there's always more than one truth.</p>
        </div>

        {/* ── SCORE RING ── */}
        {score != null && <ScoreRing score={score} />}

        {/* ── ANSWER CARDS (two-col) ── */}
        {answerEntries.length > 0 && (
          <div className="pv-grid">
            {answerEntries.map((answer, i) => (
              <div
                key={i}
                className="pv-answer-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="pv-answer-eyebrow">✦ Your View · Q{i + 1}</div>
                <div className="pv-answer-q">{FALLBACK_QUESTIONS[i] || `Question ${i + 1}`}</div>
                <div className="pv-answer-text">{answer}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── AI PERSPECTIVE ── */}
        {aiPerspective && (
          <div className="pv-ai-card">
            <div className="pv-ai-header">
              <div className="pv-ai-avatar">🤖</div>
              <div>
                <div className="pv-ai-name">Horizon AI</div>
                <div className="pv-ai-sub">Another way to see this story</div>
              </div>
            </div>
            <blockquote className="pv-ai-quote">"{aiPerspective}"</blockquote>
          </div>
        )}

        {/* ── GROWTH BADGES ── */}
        <div className="pv-badges-wrap">
          <div className="pv-badges-title">✦ Growth badges earned this session</div>
          <div className="pv-badges-row">
            {BADGES.map((b, i) => (
              <div
                key={i}
                className={`pv-badge ${b.cls}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {b.icon} {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="pv-bottom">
          <div className="pv-bot-wrap">
            <div className="pv-bot-avatar">🤖</div>
            <div className="pv-bot-bubble">
              <div className="pv-bot-label">Horizon AI</div>
              <div className="pv-bot-text">
                Different people see the same story differently. That's what makes empathy so powerful.
              </div>
            </div>
          </div>

          <div className="pv-session-note">
            Your reflections have been saved to<br />your growth profile.
          </div>

          <button className="pv-end-btn" onClick={() => navigate("/")}>
            Back to Home ✦
          </button>
        </div>

      </div>
    </>
  );
}

export default Perspective;
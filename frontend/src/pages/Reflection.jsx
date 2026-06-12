import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --deep:   #0f1e35;
    --navy:   #1B2A4A;
    --coral:  #FF7B54;
    --amber:  #FFB347;
    --teal:   #4ECDC4;
    --muted:  #8faac4;
    --glass:  rgba(255,255,255,0.05);
    --border: rgba(255,255,255,0.08);
  }

  @keyframes slideDown { from{transform:translateY(-100%);opacity:0;}to{transform:translateY(0);opacity:1;} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);} }
  @keyframes fadeIn    { from{opacity:0;}to{opacity:1;} }
  @keyframes orb1      { 0%,100%{transform:translate(0,0);}50%{transform:translate(35px,-25px);} }
  @keyframes orb2      { 0%,100%{transform:translate(0,0);}50%{transform:translate(-28px,20px);} }
  @keyframes botFloat  { 0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);} }
  @keyframes glowCoral { 0%,100%{box-shadow:0 0 20px rgba(255,123,84,0.28);}50%{box-shadow:0 0 42px rgba(255,123,84,0.58);} }
  @keyframes pulse     { 0%,100%{opacity:0.5;}50%{opacity:1;} }
  @keyframes cardIn    { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
  @keyframes charFill  { from{width:0;}to{width:var(--w);} }
  @keyframes spinArc   { to{transform:rotate(360deg);} }
  @keyframes successPop{ 0%{transform:scale(0.6);opacity:0;}70%{transform:scale(1.12);}100%{transform:scale(1);opacity:1;} }

  body, #root {
    font-family:'Outfit',sans-serif;
    background:var(--deep);
    color:#fff;
    min-height:100vh;
    overflow-x:hidden;
  }

  /* ── NAV ── */
  .rf-nav {
    position:fixed; top:0; left:0; right:0; z-index:200;
    display:flex; align-items:center; justify-content:space-between;
    padding:0.9rem 4vw;
    background:rgba(15,30,53,0.88);
    backdrop-filter:blur(20px);
    border-bottom:1px solid var(--border);
    animation:slideDown 0.6s ease both;
  }
  .rf-logo { font-family:'Cormorant Garamond',serif; font-size:1.55rem; font-weight:700; color:#fff; }
  .rf-logo span { color:var(--coral); }
  .rf-nav-badge {
    display:flex; align-items:center; gap:0.55rem;
    background:rgba(78,205,196,0.1); border:1px solid rgba(78,205,196,0.22);
    color:var(--teal); padding:0.35rem 1rem; border-radius:50px;
    font-size:0.75rem; font-weight:700; letter-spacing:0.07em; text-transform:uppercase;
  }
  .rf-nav-dot { width:7px;height:7px;border-radius:50%;background:var(--teal);animation:pulse 2s ease-in-out infinite; }
  .rf-back-btn {
    display:flex; align-items:center; gap:0.4rem;
    background:rgba(255,255,255,0.06); border:1px solid var(--border);
    color:rgba(255,255,255,0.6); padding:0.4rem 1rem; border-radius:50px;
    cursor:pointer; font-size:0.82rem; font-weight:500;
    font-family:'Outfit',sans-serif; transition:all 0.2s;
  }
  .rf-back-btn:hover { background:rgba(255,255,255,0.11); color:#fff; }

  /* ── PAGE ── */
  .rf-page {
    min-height:100vh;
    padding:6.5rem 4vw 4rem;
    max-width:860px;
    margin:0 auto;
    position:relative;
  }
  .rf-orb {
    position:fixed; border-radius:50%;
    filter:blur(100px); pointer-events:none; z-index:0;
  }
  .rf-orb-1 { width:480px;height:480px;background:rgba(255,123,84,0.06);top:-80px;right:-60px;animation:orb1 14s ease-in-out infinite; }
  .rf-orb-2 { width:400px;height:400px;background:rgba(78,205,196,0.05);bottom:0;left:-80px;animation:orb2 11s ease-in-out infinite; }

  /* ── BOT HEADER ── */
  .rf-header {
    display:flex; align-items:flex-start; gap:1.2rem;
    margin-bottom:2.5rem; position:relative; z-index:1;
    animation:fadeUp 0.6s 0.1s ease both;
  }
  .rf-bot-avatar {
    width:56px; height:56px; flex-shrink:0;
    border-radius:50%;
    background:linear-gradient(135deg, var(--coral), var(--amber));
    display:flex; align-items:center; justify-content:center;
    font-size:1.5rem;
    box-shadow:0 0 22px rgba(255,123,84,0.3);
    animation:botFloat 4s ease-in-out infinite;
  }
  .rf-header-text { flex:1; }
  .rf-header-eyebrow { font-size:0.7rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--coral); margin-bottom:0.3rem; }
  .rf-header-title { font-family:'Cormorant Garamond',serif; font-size:clamp(1.6rem,3vw,2.2rem); font-weight:700; color:#fff; line-height:1.2; }

  /* ── GUIDANCE CARD ── */
  .rf-guidance {
    background:rgba(78,205,196,0.07);
    border:1px solid rgba(78,205,196,0.2);
    border-radius:18px; padding:1.3rem 1.6rem;
    margin-bottom:2.5rem; position:relative; z-index:1;
    display:flex; align-items:flex-start; gap:1rem;
    animation:fadeUp 0.6s 0.2s ease both;
  }
  .rf-guidance-icon { font-size:1.4rem; flex-shrink:0; margin-top:2px; }
  .rf-guidance-text { font-size:0.9rem; color:rgba(255,255,255,0.65); line-height:1.75; font-weight:300; }
  .rf-guidance-text strong { color:var(--teal); font-weight:600; }

  /* ── PROGRESS DOTS ── */
  .rf-progress-dots {
    display:flex; align-items:center; gap:0.5rem;
    margin-bottom:2rem; position:relative; z-index:1;
    animation:fadeIn 0.6s 0.3s ease both;
  }
  .rf-dot {
    height:4px; border-radius:10px;
    transition:all 0.4s cubic-bezier(0.4,0,0.2,1);
  }
  .rf-dot.active { background:var(--coral); width:28px; }
  .rf-dot.done   { background:var(--teal);  width:16px; }
  .rf-dot.upcoming{ background:rgba(255,255,255,0.15); width:16px; }
  .rf-progress-label { font-size:0.75rem; color:var(--muted); margin-left:0.5rem; }

  /* ── QUESTION CARDS ── */
  .rf-questions { display:flex; flex-direction:column; gap:1.4rem; position:relative; z-index:1; }

  .rf-q-card {
    background:var(--glass);
    border:1px solid var(--border);
    border-radius:20px; padding:1.6rem 1.8rem;
    backdrop-filter:blur(16px);
    transition:border-color 0.3s, box-shadow 0.3s;
    animation:cardIn 0.5s ease both;
  }
  .rf-q-card.focused {
    border-color:rgba(255,123,84,0.35);
    box-shadow:0 0 0 1px rgba(255,123,84,0.12), 0 8px 30px rgba(0,0,0,0.2);
  }
  .rf-q-card.answered {
    border-color:rgba(78,205,196,0.25);
  }

  .rf-q-top { display:flex; align-items:flex-start; gap:0.9rem; margin-bottom:1.1rem; }
  .rf-q-num {
    width:30px; height:30px; flex-shrink:0;
    border-radius:50%;
    background:rgba(255,123,84,0.12);
    border:1px solid rgba(255,123,84,0.28);
    display:flex; align-items:center; justify-content:center;
    font-size:0.75rem; font-weight:700; color:var(--coral);
  }
  .rf-q-num.done-num {
    background:rgba(78,205,196,0.12);
    border-color:rgba(78,205,196,0.28);
    color:var(--teal);
  }
  .rf-q-text { font-size:0.94rem; color:rgba(255,255,255,0.82); line-height:1.6; font-weight:400; padding-top:4px; }

  .rf-textarea {
    width:100%; background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.1);
    border-radius:14px; padding:1rem 1.1rem;
    color:#fff; font-size:0.88rem; font-family:'Outfit',sans-serif;
    font-weight:300; line-height:1.7; resize:vertical; min-height:90px;
    transition:border-color 0.2s, background 0.2s;
    outline:none;
  }
  .rf-textarea::placeholder { color:rgba(255,255,255,0.25); }
  .rf-textarea:focus {
    border-color:rgba(255,123,84,0.4);
    background:rgba(255,255,255,0.06);
  }
  .rf-char-row {
    display:flex; justify-content:space-between; align-items:center;
    margin-top:0.5rem;
  }
  .rf-char-count { font-size:0.72rem; color:var(--muted); }
  .rf-char-count.has-text { color:var(--teal); }
  .rf-answered-badge {
    display:flex; align-items:center; gap:0.35rem;
    font-size:0.7rem; font-weight:700; color:var(--teal); letter-spacing:0.05em;
  }

  /* loading skeleton */
  .rf-skeleton {
    display:flex; flex-direction:column; gap:1.4rem; position:relative; z-index:1;
  }
  .rf-skel-card {
    background:var(--glass); border:1px solid var(--border);
    border-radius:20px; padding:1.6rem 1.8rem;
    animation:pulse 1.8s ease-in-out infinite;
  }
  .rf-skel-line {
    height:12px; background:rgba(255,255,255,0.07); border-radius:6px; margin-bottom:0.6rem;
  }
  .rf-skel-box  { height:80px; background:rgba(255,255,255,0.05); border-radius:12px; margin-top:1rem; }

  /* ── SUBMIT AREA ── */
  .rf-submit-area {
    display:flex; flex-direction:column; align-items:center; gap:1rem;
    margin-top:2.5rem; position:relative; z-index:1;
    animation:fadeUp 0.6s 0.5s ease both;
  }
  .rf-completion-row {
    display:flex; align-items:center; gap:0.6rem;
    font-size:0.82rem; color:var(--muted);
  }
  .rf-completion-bar-bg { width:160px; height:4px; background:rgba(255,255,255,0.08); border-radius:10px; overflow:hidden; }
  .rf-completion-bar    { height:100%; background:linear-gradient(90deg,var(--coral),var(--amber)); border-radius:10px; transition:width 0.5s ease; }

  .rf-submit-btn {
    display:flex; align-items:center; gap:0.7rem;
    background:var(--coral); border:none; color:#fff;
    padding:0.95rem 2.8rem; border-radius:50px;
    cursor:pointer; font-size:1rem; font-weight:700;
    font-family:'Outfit',sans-serif;
    box-shadow:0 0 28px rgba(255,123,84,0.35);
    animation:glowCoral 3s ease-in-out infinite;
    transition:transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  }
  .rf-submit-btn:hover:not(:disabled) { transform:translateY(-2px) scale(1.04); box-shadow:0 0 50px rgba(255,123,84,0.55); }
  .rf-submit-btn:disabled { opacity:0.55; cursor:not-allowed; animation:none; }

  .rf-submit-note { font-size:0.78rem; color:rgba(255,255,255,0.3); text-align:center; max-width:380px; line-height:1.6; }

  /* ── SUBMITTING OVERLAY ── */
  .rf-overlay {
    position:fixed; inset:0; z-index:500;
    background:rgba(15,30,53,0.92); backdrop-filter:blur(16px);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:1.5rem; animation:fadeIn 0.3s ease both;
  }
  .rf-spinner {
    width:56px; height:56px;
    border:3px solid rgba(255,123,84,0.15);
    border-top-color:var(--coral);
    border-radius:50%;
    animation:spinArc 0.9s linear infinite;
  }
  .rf-overlay-title { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:700; color:#fff; }
  .rf-overlay-sub   { font-size:0.9rem; color:var(--muted); font-weight:300; }
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

const FALLBACK_QUESTIONS = [
  "How did the main character's decisions affect the people around them?",
  "What emotion stood out to you the most, and why did it resonate?",
  "Is there anything you would have done differently in their situation?",
];

function Reflection() {
  const navigate = useNavigate();
  const [questions, setQuestions]   = useState([]);
  const [answers, setAnswers]       = useState({});
  const [sessionData, setSessionData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(null);
  const userId = "u_001";

  useEffect(() => {
    const stored = localStorage.getItem("horizon_session");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSessionData(parsed);
      setQuestions(parsed.reflection_questions?.length ? parsed.reflection_questions : FALLBACK_QUESTIONS);
    } else {
      setQuestions(FALLBACK_QUESTIONS);
    }
  }, []);

  const handleChange = (index, value) => setAnswers(prev => ({ ...prev, [index]: value }));

  const answeredCount  = Object.values(answers).filter(v => v?.trim()).length;
  const completionPct  = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const mediaId = sessionData?.media?.id;
      const combinedAnswer = Object.values(answers).join("\n");
      const res = await fetch("http://localhost:5000/chat/reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, media_id: mediaId, answer: combinedAnswer }),
      });
      const data = await res.json();
      localStorage.setItem("horizon_perspective", JSON.stringify({
        ai_perspective: data?.ai_perspective || "Another way to interpret the story is that the characters may have misunderstood each other's intentions.",
        understanding_score: data?.understanding_score || 0.65,
        user_answers: answers,
      }));
      navigate("/perspective");
    } catch {
      localStorage.setItem("horizon_perspective", JSON.stringify({
        ai_perspective: "Some viewers might interpret the situation differently. The characters may simply have misunderstood each other's intentions.",
        understanding_score: 0.6,
        user_answers: answers,
      }));
      navigate("/perspective");
    }
  }

  return (
    <>
      <InjectStyles />

      {/* submitting overlay */}
      {submitting && (
        <div className="rf-overlay">
          <div className="rf-spinner" />
          <div className="rf-overlay-title">Analysing your reflections…</div>
          <div className="rf-overlay-sub">Horizon AI is reading your thoughts with care</div>
        </div>
      )}

      {/* ── NAV ── */}
      <nav className="rf-nav">
        <div className="rf-logo">Hori<span>zon</span></div>
        <div className="rf-nav-badge">
          <div className="rf-nav-dot" />
          Reflection Time
        </div>
        <button className="rf-back-btn" onClick={() => navigate("/movie")}>
          ← Back
        </button>
      </nav>

      {/* orbs */}
      <div className="rf-orb rf-orb-1" />
      <div className="rf-orb rf-orb-2" />

      <div className="rf-page">

        {/* ── BOT HEADER ── */}
        <div className="rf-header">
          <div className="rf-bot-avatar">🤖</div>
          <div className="rf-header-text">
            <div className="rf-header-eyebrow">Post-Session Reflection</div>
            <div className="rf-header-title">Let's Reflect<br />Together</div>
          </div>
        </div>

        {/* ── GUIDANCE ── */}
        <div className="rf-guidance">
          <span className="rf-guidance-icon">💬</span>
          <p className="rf-guidance-text">
            <strong>There are no right or wrong answers here.</strong> We're simply exploring perspectives and understanding the story together. Share what you <em>truly</em> think — your honest thoughts help Horizon personalise your next session.
          </p>
        </div>

        {/* ── PROGRESS DOTS ── */}
        {questions.length > 0 && (
          <div className="rf-progress-dots">
            {questions.map((_, i) => {
              const isDone    = answers[i]?.trim()?.length > 0;
              const isActive  = focusedIdx === i;
              return (
                <div key={i} className={`rf-dot ${isDone ? "done" : isActive ? "active" : "upcoming"}`} />
              );
            })}
            <span className="rf-progress-label">{answeredCount} of {questions.length} answered</span>
          </div>
        )}

        {/* ── QUESTIONS ── */}
        {questions.length === 0 ? (
          <div className="rf-skeleton">
            {[0,1,2].map(i => (
              <div key={i} className="rf-skel-card">
                <div className="rf-skel-line" style={{ width:"65%" }} />
                <div className="rf-skel-line" style={{ width:"40%" }} />
                <div className="rf-skel-box" />
              </div>
            ))}
          </div>
        ) : (
          <div className="rf-questions">
            {questions.map((q, i) => {
              const val      = answers[i] || "";
              const isDone   = val.trim().length > 0;
              const isFocused = focusedIdx === i;
              return (
                <div
                  key={i}
                  className={`rf-q-card${isFocused ? " focused" : ""}${isDone ? " answered" : ""}`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="rf-q-top">
                    <div className={`rf-q-num${isDone ? " done-num" : ""}`}>
                      {isDone ? "✓" : i + 1}
                    </div>
                    <p className="rf-q-text">{q}</p>
                  </div>
                  <textarea
                    className="rf-textarea"
                    rows="3"
                    placeholder="Write your thoughts here…"
                    value={val}
                    onFocus={() => setFocusedIdx(i)}
                    onBlur={() => setFocusedIdx(null)}
                    onChange={e => handleChange(i, e.target.value)}
                  />
                  <div className="rf-char-row">
                    <span className={`rf-char-count${val.length > 0 ? " has-text" : ""}`}>
                      {val.length} characters
                    </span>
                    {isDone && (
                      <span className="rf-answered-badge">✦ Answered</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SUBMIT ── */}
        <div className="rf-submit-area">
          <div className="rf-completion-row">
            <span>{completionPct}% complete</span>
            <div className="rf-completion-bar-bg">
              <div className="rf-completion-bar" style={{ width: `${completionPct}%` }} />
            </div>
          </div>
          <button
            className="rf-submit-btn"
            onClick={handleSubmit}
            disabled={submitting || answeredCount === 0}
          >
            {submitting ? "Thinking…" : "Submit Your View ✦"}
          </button>
          <p className="rf-submit-note">
            Your reflections are private and used only to personalise your Horizon learning journey.
          </p>
        </div>

      </div>
    </>
  );
}

export default Reflection;
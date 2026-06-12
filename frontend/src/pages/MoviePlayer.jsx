import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --deep:   #0f1e35;
    --navy:   #1B2A4A;
    --coral:  #FF7B54;
    --amber:  #FFB347;
    --teal:   #4ECDC4;
    --cream:  #F9F4EF;
    --muted:  #8faac4;
    --glass:  rgba(255,255,255,0.05);
    --border: rgba(255,255,255,0.08);
  }

  @keyframes slideDown  { from{transform:translateY(-100%);opacity:0;}to{transform:translateY(0);opacity:1;} }
  @keyframes fadeUp     { from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);} }
  @keyframes fadeIn     { from{opacity:0;}to{opacity:1;} }
  @keyframes orb1       { 0%,100%{transform:translate(0,0);}50%{transform:translate(30px,-20px);} }
  @keyframes orb2       { 0%,100%{transform:translate(0,0);}50%{transform:translate(-25px,18px);} }
  @keyframes botFloat   { 0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);} }
  @keyframes glowCoral  { 0%,100%{box-shadow:0 0 18px rgba(255,123,84,0.3);}50%{box-shadow:0 0 40px rgba(255,123,84,0.6);} }
  @keyframes glowTeal   { 0%,100%{box-shadow:0 0 12px rgba(78,205,196,0.3);}50%{box-shadow:0 0 28px rgba(78,205,196,0.55);} }
  @keyframes pulse      { 0%,100%{opacity:0.5;}50%{opacity:1;} }
  @keyframes tipSlide   { from{opacity:0;transform:translateX(-10px);}to{opacity:1;transform:translateX(0);} }
  @keyframes progressGlow { 0%,100%{box-shadow:0 0 6px rgba(255,123,84,0.4);}50%{box-shadow:0 0 16px rgba(255,123,84,0.7);} }

  body, #root {
    font-family:'Outfit',sans-serif;
    background:var(--deep);
    color:#fff;
    min-height:100vh;
    overflow-x:hidden;
  }

  /* ── NAV ── */
  .mp-nav {
    position:fixed; top:0; left:0; right:0; z-index:200;
    display:flex; align-items:center; justify-content:space-between;
    padding:0.9rem 4vw;
    background:rgba(15,30,53,0.9);
    backdrop-filter:blur(20px);
    border-bottom:1px solid var(--border);
    animation:slideDown 0.6s ease both;
  }
  .mp-logo {
    font-family:'Cormorant Garamond',serif;
    font-size:1.5rem; font-weight:700; color:#fff;
  }
  .mp-logo span { color:var(--coral); }
  .mp-nav-center {
    display:flex; align-items:center; gap:0.6rem;
  }
  .mp-nav-dot {
    width:8px; height:8px; border-radius:50%;
    background:var(--teal);
    box-shadow:0 0 10px rgba(78,205,196,0.6);
    animation:pulse 2s ease-in-out infinite;
  }
  .mp-nav-session { font-size:0.82rem; color:rgba(255,255,255,0.55); font-weight:500; }
  .mp-nav-session strong { color:rgba(255,255,255,0.85); }
  .mp-back-btn {
    display:flex; align-items:center; gap:0.4rem;
    background:rgba(255,255,255,0.06); border:1px solid var(--border);
    color:rgba(255,255,255,0.65); padding:0.4rem 1rem;
    border-radius:50px; cursor:pointer; font-size:0.82rem; font-weight:500;
    font-family:'Outfit',sans-serif; transition:all 0.2s;
  }
  .mp-back-btn:hover { background:rgba(255,255,255,0.11); color:#fff; }

  /* ── PAGE ── */
  .mp-page {
    min-height:100vh;
    display:flex; flex-direction:column;
    padding:5.5rem 4vw 1.5rem;
    position:relative; overflow:hidden;
    gap:1.2rem;
  }

  .mp-orb {
    position:absolute; border-radius:50%;
    filter:blur(100px); pointer-events:none; z-index:0;
  }
  .mp-orb-1 { width:500px;height:500px;background:rgba(255,123,84,0.06);top:-80px;right:0;animation:orb1 14s ease-in-out infinite; }
  .mp-orb-2 { width:400px;height:400px;background:rgba(78,205,196,0.05);bottom:0;left:-60px;animation:orb2 11s ease-in-out infinite; }

  /* ── TITLE ── */
  .mp-title-wrap {
    text-align:center; position:relative; z-index:1;
    animation:fadeUp 0.6s 0.1s ease both;
  }
  .mp-eyebrow {
    font-size:0.7rem; font-weight:700; letter-spacing:0.12em;
    text-transform:uppercase; color:var(--coral); margin-bottom:0.4rem;
  }
  .mp-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(1.4rem,2.5vw,2rem); font-weight:700; color:#fff;
  }

  /* ── VIDEO WRAPPER ── */
  .mp-video-outer {
    flex:1; display:flex; align-items:center; justify-content:center;
    position:relative; z-index:1;
    animation:fadeUp 0.6s 0.2s ease both;
  }
  .mp-video-shell {
    width:100%; max-width:920px;
    border-radius:22px; overflow:hidden;
    border:1px solid var(--border);
    box-shadow:0 30px 80px rgba(0,0,0,0.55);
    background:#000;
    position:relative;
  }
  .mp-video-shell video {
    width:100%; display:block;
    max-height:62vh;
    background:#000;
  }
  /* subtle coral top-border glow */
  .mp-video-shell::before {
    content:'';
    position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg, transparent, var(--coral), var(--amber), var(--teal), transparent);
    z-index:2; opacity:0.7;
  }

  /* ── BOTTOM PANEL ── */
  .mp-panel {
    position:relative; z-index:1;
    background:var(--glass);
    border:1px solid var(--border);
    border-radius:20px;
    backdrop-filter:blur(18px);
    padding:1.2rem 1.8rem;
    display:grid;
    grid-template-columns:auto 1fr auto;
    align-items:center;
    gap:2rem;
    animation:fadeUp 0.6s 0.35s ease both;
  }

  /* bot section */
  .mp-bot {
    display:flex; align-items:center; gap:1rem;
    min-width:0;
  }
  .mp-bot-avatar {
    width:52px; height:52px; flex-shrink:0;
    border-radius:50%;
    background:linear-gradient(135deg, var(--coral), var(--amber));
    display:flex; align-items:center; justify-content:center;
    font-size:1.4rem;
    box-shadow:0 0 20px rgba(255,123,84,0.3);
    animation:botFloat 4s ease-in-out infinite;
  }
  .mp-bot-bubble {
    background:rgba(255,255,255,0.05);
    border:1px solid rgba(255,255,255,0.09);
    border-radius:14px 14px 14px 4px;
    padding:0.65rem 1rem;
    max-width:280px;
  }
  .mp-bot-label { font-size:0.68rem; color:var(--teal); font-weight:700; letter-spacing:0.07em; text-transform:uppercase; margin-bottom:0.25rem; }
  .mp-bot-text  { font-size:0.84rem; color:rgba(255,255,255,0.75); line-height:1.5; font-weight:300; animation:tipSlide 0.5s ease both; }

  /* progress section */
  .mp-progress-wrap { display:flex; flex-direction:column; gap:0.5rem; }
  .mp-progress-top  { display:flex; justify-content:space-between; align-items:center; }
  .mp-progress-label{ font-size:0.72rem; color:var(--muted); font-weight:500; letter-spacing:0.05em; text-transform:uppercase; }
  .mp-progress-pct  { font-size:0.78rem; font-weight:700; color:var(--coral); }
  .mp-bar-bg {
    width:100%; height:6px;
    background:rgba(255,255,255,0.08);
    border-radius:10px; overflow:hidden;
    cursor:pointer;
  }
  .mp-bar-fill {
    height:100%; border-radius:10px;
    background:linear-gradient(90deg, var(--coral), var(--amber));
    transition:width 0.3s ease;
    animation:progressGlow 2s ease-in-out infinite;
  }
  .mp-time-row { display:flex; justify-content:space-between; }
  .mp-time { font-size:0.72rem; color:var(--muted); font-family:'Outfit',sans-serif; }

  /* finish button */
  .mp-finish-btn {
    display:flex; align-items:center; gap:0.6rem; white-space:nowrap;
    background:var(--coral); border:none; color:#fff;
    padding:0.8rem 1.8rem; border-radius:50px;
    cursor:pointer; font-size:0.92rem; font-weight:700;
    font-family:'Outfit',sans-serif;
    box-shadow:0 0 25px rgba(255,123,84,0.35);
    animation:glowCoral 3s ease-in-out infinite;
    transition:transform 0.2s, box-shadow 0.2s;
  }
  .mp-finish-btn:hover { transform:translateY(-2px) scale(1.03); box-shadow:0 0 45px rgba(255,123,84,0.55); }

  @media(max-width:720px){
    .mp-panel{ grid-template-columns:1fr; gap:1.2rem; }
    .mp-bot-bubble{ max-width:100%; }
    .mp-nav-center{ display:none; }
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

function formatTime(secs) {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const TIPS = [
  "Pay attention to how the characters respond to each other.",
  "Notice what emotions the main character is feeling right now.",
  "Think about how you'd react in this situation.",
  "What values does this story seem to be exploring?",
  "Consider the perspective of the supporting characters too.",
];

function MoviePlayer() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [sessionData, setSessionData] = useState(null);
  const [progress, setProgress]       = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]       = useState(0);
  const [tipIndex, setTipIndex]       = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("horizon_session");
    if (stored) setSessionData(JSON.parse(stored));
  }, []);

  // Rotate tips every 30 seconds
  useEffect(() => {
    const id = setInterval(() => setTipIndex(i => (i + 1) % TIPS.length), 30000);
    return () => clearInterval(id);
  }, []);

  const media = sessionData?.media || {};
  const videoSrc = media.video_file
    ? `http://localhost:5000/media/videos/${media.video_file}`
    : "http://localhost:5000/media/videos/vid_001.mp4";

  function updateProgress() {
    const v = videoRef.current;
    if (!v) return;
    const pct = (v.currentTime / v.duration) * 100;
    setProgress(pct || 0);
    setCurrentTime(v.currentTime);
    setDuration(v.duration);
  }

  // Click on progress bar to seek
  function handleSeek(e) {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    v.currentTime = ratio * v.duration;
  }

  return (
    <>
      <InjectStyles />

      {/* ── NAV ── */}
      <nav className="mp-nav">
        <div className="mp-logo">Hori<span>zon</span></div>
        <div className="mp-nav-center">
          <div className="mp-nav-dot" />
          <span className="mp-nav-session">
            Now Watching &nbsp;·&nbsp; <strong>{media.title || "Today's Story"}</strong>
          </span>
        </div>
        <button className="mp-back-btn" onClick={() => navigate("/session")}>
          ← Back to Session
        </button>
      </nav>

      <div className="mp-page">
        {/* orbs */}
        <div className="mp-orb mp-orb-1" />
        <div className="mp-orb mp-orb-2" />

        {/* ── TITLE ── */}
        {media.title && (
          <div className="mp-title-wrap">
            <div className="mp-eyebrow">Now Playing</div>
            <div className="mp-title">{media.title}</div>
          </div>
        )}

        {/* ── VIDEO ── */}
        <div className="mp-video-outer">
          <div className="mp-video-shell">
            <video
              ref={videoRef}
              controls
              onTimeUpdate={updateProgress}
              onLoadedMetadata={updateProgress}
              src={videoSrc}
            />
          </div>
        </div>

        {/* ── BOTTOM PANEL ── */}
        <div className="mp-panel">

          {/* Bot / Tip */}
          <div className="mp-bot">
            <div className="mp-bot-avatar">🤖</div>
            <div className="mp-bot-bubble">
              <div className="mp-bot-label">Horizon AI</div>
              <div className="mp-bot-text" key={tipIndex}>
                {sessionData ? TIPS[tipIndex] : "Watching together…"}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mp-progress-wrap">
            <div className="mp-progress-top">
              <span className="mp-progress-label">Session Progress</span>
              <span className="mp-progress-pct">{Math.round(progress)}%</span>
            </div>
            <div className="mp-bar-bg" onClick={handleSeek}>
              <div className="mp-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="mp-time-row">
              <span className="mp-time">{formatTime(currentTime)}</span>
              <span className="mp-time">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Finish */}
          <button className="mp-finish-btn" onClick={() => navigate("/reflection")}>
            Finish &nbsp;✦
          </button>

        </div>
      </div>
    </>
  );
}

export default MoviePlayer;
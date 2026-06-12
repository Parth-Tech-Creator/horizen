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
    --cream:  #F9F4EF;
    --muted:  #8faac4;
    --glass:  rgba(255,255,255,0.06);
    --border: rgba(255,255,255,0.09);
  }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(32px);}to{opacity:1;transform:translateY(0);} }
  @keyframes fadeIn   { from{opacity:0;}to{opacity:1;} }
  @keyframes slideDown{ from{transform:translateY(-100%);opacity:0;}to{transform:translateY(0);opacity:1;} }
  @keyframes float    { 0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);} }
  @keyframes orb1     { 0%,100%{transform:translate(0,0);}50%{transform:translate(35px,-25px);} }
  @keyframes orb2     { 0%,100%{transform:translate(0,0);}50%{transform:translate(-30px,20px);} }
  @keyframes shimmerPulse { 0%,100%{opacity:0.6;}50%{opacity:1;} }
  @keyframes progressFill { from{width:0;}to{width:var(--target-w);} }
  @keyframes tagPop   { from{opacity:0;transform:scale(0.8);}to{opacity:1;transform:scale(1);} }
  @keyframes glowCoral{ 0%,100%{box-shadow:0 0 20px rgba(255,123,84,0.25);}50%{box-shadow:0 0 45px rgba(255,123,84,0.55);} }

  body, #root {
    font-family:'Outfit',sans-serif;
    background: var(--deep);
    color: #fff;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── nav ── */
  .sn-nav {
    position:fixed; top:0; left:0; right:0; z-index:100;
    display:flex; align-items:center; justify-content:space-between;
    padding:1rem 5vw;
    background:rgba(15,30,53,0.85);
    backdrop-filter:blur(20px);
    border-bottom:1px solid var(--border);
    animation:slideDown 0.6s ease both;
  }
  .sn-logo {
    font-family:'Cormorant Garamond',serif;
    font-size:1.6rem; font-weight:700; color:#fff;
  }
  .sn-logo span { color:var(--coral); }
  .sn-back-btn {
    display:flex; align-items:center; gap:0.5rem;
    background:rgba(255,255,255,0.07);
    border:1px solid var(--border);
    color:rgba(255,255,255,0.7);
    padding:0.45rem 1.1rem; border-radius:50px;
    cursor:pointer; font-size:0.85rem; font-weight:500;
    font-family:'Outfit',sans-serif;
    transition:all 0.2s;
  }
  .sn-back-btn:hover { background:rgba(255,255,255,0.12); color:#fff; }

  /* ── page ── */
  .sn-page {
    min-height:100vh;
    padding:7rem 5vw 5rem;
    position:relative; overflow:hidden;
  }

  /* background orbs */
  .sn-orb {
    position:absolute; border-radius:50%;
    filter:blur(90px); pointer-events:none; z-index:0;
  }
  .sn-orb-1 { width:500px;height:500px;background:rgba(255,123,84,0.07);top:-100px;right:-60px;animation:orb1 14s ease-in-out infinite; }
  .sn-orb-2 { width:420px;height:420px;background:rgba(78,205,196,0.06);bottom:0;left:-80px;animation:orb2 11s ease-in-out infinite; }
  .sn-orb-3 { width:300px;height:300px;background:rgba(255,179,71,0.05);top:50%;left:40%;animation:orb1 16s ease-in-out infinite reverse; }

  /* ── quote strip ── */
  .sn-quote-wrap {
    text-align:center; margin-bottom:3.5rem; position:relative; z-index:1;
    animation:fadeUp 0.7s 0.1s ease both;
  }
  .sn-quote-line {
    display:inline-block;
    width:40px; height:2px;
    background:var(--coral); border-radius:2px;
    vertical-align:middle; margin:0 0.8rem;
  }
  .sn-quote {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(1.3rem,2.5vw,2rem);
    font-weight:600; font-style:italic;
    color:rgba(255,255,255,0.88);
    line-height:1.45; max-width:750px; margin:0 auto 1rem;
  }
  .sn-focus-pill {
    display:inline-flex; align-items:center; gap:0.5rem;
    background:rgba(255,123,84,0.12); border:1px solid rgba(255,123,84,0.28);
    color:var(--coral); padding:0.35rem 1rem; border-radius:50px;
    font-size:0.78rem; font-weight:700; letter-spacing:0.07em; text-transform:uppercase;
  }

  /* ── main grid ── */
  .sn-grid {
    display:grid;
    grid-template-columns:1fr 1.15fr;
    gap:2rem; position:relative; z-index:1;
  }

  /* ── left column ── */
  .sn-left { display:flex; flex-direction:column; gap:1.5rem; }

  /* thumbnail card */
  .sn-thumb-card {
    border-radius:22px; overflow:hidden;
    border:1px solid var(--border);
    background:var(--glass);
    backdrop-filter:blur(16px);
    position:relative;
    animation:fadeUp 0.7s 0.2s ease both;
    transition:transform 0.3s, box-shadow 0.3s;
  }
  .sn-thumb-card:hover { transform:translateY(-5px); box-shadow:0 25px 60px rgba(0,0,0,0.35); }
  .sn-thumb-img {
    width:100%; height:220px; object-fit:cover; display:block;
    filter:brightness(0.9) saturate(0.95);
  }
  .sn-thumb-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to top, rgba(15,30,53,0.7) 0%, transparent 55%);
  }
  .sn-thumb-label {
    position:absolute; bottom:14px; left:16px;
    display:flex; align-items:center; gap:0.5rem;
  }
  .sn-play-icon {
    width:38px; height:38px; border-radius:50%;
    background:var(--coral);
    display:flex; align-items:center; justify-content:center;
    font-size:1rem;
    box-shadow:0 0 18px rgba(255,123,84,0.5);
    animation:glowCoral 2.5s ease-in-out infinite;
    cursor:pointer; transition:transform 0.2s;
  }
  .sn-play-icon:hover { transform:scale(1.12); }
  .sn-watch-text { font-size:0.82rem; font-weight:600; color:rgba(255,255,255,0.85); }

  /* meta card */
  .sn-meta-card {
    border-radius:18px; padding:1.3rem 1.5rem;
    background:var(--glass); border:1px solid var(--border);
    backdrop-filter:blur(16px);
    animation:fadeUp 0.7s 0.35s ease both;
  }
  .sn-meta-row {
    display:flex; align-items:center; gap:0.6rem;
    margin-bottom:1rem;
  }
  .sn-meta-icon { font-size:1rem; }
  .sn-meta-label { font-size:0.75rem; color:var(--muted); font-weight:500; text-transform:uppercase; letter-spacing:0.06em; }
  .sn-meta-value { font-size:0.9rem; font-weight:600; color:rgba(255,255,255,0.85); margin-left:auto; }

  .sn-divider { border:none; border-top:1px solid var(--border); margin:0.8rem 0; }

  .sn-tags-wrap { display:flex; flex-wrap:wrap; gap:0.6rem; margin-top:0.8rem; }
  .sn-tag {
    display:flex; align-items:center; gap:0.35rem;
    padding:0.38rem 0.9rem; border-radius:50px;
    font-size:0.78rem; font-weight:600;
    border:1px solid; cursor:default;
    animation:tagPop 0.4s ease both;
  }
  .sn-tag-coral  { background:rgba(255,123,84,0.12); border-color:rgba(255,123,84,0.3); color:var(--coral); }
  .sn-tag-teal   { background:rgba(78,205,196,0.12); border-color:rgba(78,205,196,0.3); color:var(--teal); }
  .sn-tag-amber  { background:rgba(255,179,71,0.12); border-color:rgba(255,179,71,0.3); color:var(--amber); }

  /* ── right column ── */
  .sn-right { display:flex; flex-direction:column; gap:1.5rem; }

  .sn-desc-card {
    border-radius:22px; padding:2rem;
    background:var(--glass); border:1px solid var(--border);
    backdrop-filter:blur(16px);
    animation:fadeUp 0.7s 0.25s ease both;
    flex:1;
  }
  .sn-story-eyebrow {
    font-size:0.72rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
    color:var(--coral); margin-bottom:0.7rem;
  }
  .sn-story-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(1.5rem,2.5vw,2.1rem);
    font-weight:700; color:#fff; line-height:1.2;
    margin-bottom:1.2rem;
  }
  .sn-story-desc {
    font-size:0.92rem; color:rgba(255,255,255,0.6);
    line-height:1.8; font-weight:300;
    margin-bottom:1.5rem;
  }
  .sn-reason-box {
    background:rgba(255,179,71,0.08);
    border:1px solid rgba(255,179,71,0.22);
    border-radius:14px; padding:1rem 1.2rem;
  }
  .sn-reason-title {
    font-size:0.72rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;
    color:var(--amber); margin-bottom:0.45rem;
  }
  .sn-reason-text { font-size:0.85rem; color:rgba(255,255,255,0.6); line-height:1.65; font-weight:300; }

  /* growth traits */
  .sn-traits-card {
    border-radius:18px; padding:1.4rem 1.6rem;
    background:var(--glass); border:1px solid var(--border);
    backdrop-filter:blur(16px);
    animation:fadeUp 0.7s 0.4s ease both;
  }
  .sn-traits-title {
    font-size:0.75rem; font-weight:700; letter-spacing:0.09em; text-transform:uppercase;
    color:var(--teal); margin-bottom:1.1rem;
  }
  .sn-trait-row { margin-bottom:0.9rem; }
  .sn-trait-row:last-child { margin-bottom:0; }
  .sn-trait-top { display:flex; justify-content:space-between; margin-bottom:0.4rem; }
  .sn-trait-name { font-size:0.83rem; font-weight:600; color:rgba(255,255,255,0.8); }
  .sn-trait-pct { font-size:0.78rem; color:var(--muted); }
  .sn-bar-bg { height:5px; background:rgba(255,255,255,0.07); border-radius:10px; overflow:hidden; }
  .sn-bar-fill { height:100%; border-radius:10px; transition:width 1.2s cubic-bezier(0.4,0,0.2,1); }

  /* ── bottom actions ── */
  .sn-actions {
    display:flex; justify-content:space-between; align-items:center;
    margin-top:2.5rem; position:relative; z-index:1;
    animation:fadeUp 0.7s 0.55s ease both;
    padding: 1.5rem 2rem;
    background:var(--glass); border:1px solid var(--border);
    border-radius:20px; backdrop-filter:blur(16px);
  }
  .sn-session-info { display:flex; align-items:center; gap:1rem; }
  .sn-session-dot {
    width:10px; height:10px; border-radius:50%;
    background:var(--teal);
    box-shadow:0 0 12px rgba(78,205,196,0.6);
    animation:shimmerPulse 2s ease-in-out infinite;
  }
  .sn-session-label { font-size:0.85rem; color:rgba(255,255,255,0.5); font-weight:400; }
  .sn-session-label strong { color:rgba(255,255,255,0.85); font-weight:600; }

  .sn-btn-back {
    display:flex; align-items:center; gap:0.5rem;
    background:rgba(255,255,255,0.06);
    border:1px solid var(--border);
    color:rgba(255,255,255,0.65);
    padding:0.75rem 1.6rem; border-radius:50px;
    cursor:pointer; font-size:0.9rem; font-weight:500;
    font-family:'Outfit',sans-serif;
    transition:all 0.2s;
  }
  .sn-btn-back:hover { background:rgba(255,255,255,0.1); color:#fff; }

  .sn-btn-start {
    display:flex; align-items:center; gap:0.65rem;
    background:var(--coral);
    border:none; color:#fff;
    padding:0.85rem 2.2rem; border-radius:50px;
    cursor:pointer; font-size:0.98rem; font-weight:700;
    font-family:'Outfit',sans-serif;
    box-shadow:0 0 28px rgba(255,123,84,0.35);
    transition:transform 0.2s, box-shadow 0.2s;
    animation:glowCoral 3s ease-in-out infinite;
  }
  .sn-btn-start:hover { transform:translateY(-2px) scale(1.03); box-shadow:0 0 45px rgba(255,123,84,0.55); }

  @media(max-width:820px){
    .sn-grid{grid-template-columns:1fr;}
    .sn-actions{flex-direction:column;gap:1.2rem;text-align:center;}
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

// Animated progress bar
function TraitBar({ name, pct, color, delay }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div className="sn-trait-row" ref={ref}>
      <div className="sn-trait-top">
        <span className="sn-trait-name">{name}</span>
        <span className="sn-trait-pct">{pct}%</span>
      </div>
      <div className="sn-bar-bg">
        <div className="sn-bar-fill" style={{
          width: started ? `${pct}%` : "0%",
          background: color,
          transitionDelay: `${delay}ms`
        }} />
      </div>
    </div>
  );
}

const TAG_COLORS = ["sn-tag-coral", "sn-tag-teal", "sn-tag-amber", "sn-tag-coral", "sn-tag-teal"];
const TAG_ICONS  = ["✦", "◆", "★", "✦", "◆"];

const TRAITS = [
  { name: "Empathy",           pct: 82, color: "var(--coral)",  delay: 0   },
  { name: "Critical Thinking", pct: 68, color: "var(--teal)",   delay: 100 },
  { name: "Cultural Awareness",pct: 75, color: "var(--amber)",  delay: 200 },
];

function Session() {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("horizon_session");
    if (stored) setSessionData(JSON.parse(stored));
  }, []);

  const media  = sessionData?.media || {};
  const intro  = sessionData?.session_intro || {};
  const tags   = media.tags?.length ? media.tags : ["Empathy", "Perspective", "Growth"];

  const thumbSrc = (media.thumbnail && !media.thumbnail.includes("vite.svg"))
    ? media.thumbnail
    : "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=700&q=80";

  return (
    <>
      <InjectStyles />

      {/* ── NAV ── */}
      <nav className="sn-nav">
        <div className="sn-logo">Hori<span>zon</span></div>
        <button className="sn-back-btn" onClick={() => navigate("/")}>
          ← Home
        </button>
      </nav>

      <div className="sn-page">
        {/* orbs */}
        <div className="sn-orb sn-orb-1" />
        <div className="sn-orb sn-orb-2" />
        <div className="sn-orb sn-orb-3" />

        {/* ── QUOTE ── */}
        <div className="sn-quote-wrap">
          <p className="sn-quote">
            <span className="sn-quote-line" />
            "{intro.quote || "Stories help us see the world through another lens."}"
            <span className="sn-quote-line" />
          </p>
          {(intro.focus_trait || "empathy") && (
            <div style={{ marginTop: "0.9rem" }}>
              <span className="sn-focus-pill">
                ✦ &nbsp;Today's Focus: {intro.focus_trait || "Empathy"}
              </span>
            </div>
          )}
        </div>

        {/* ── MAIN GRID ── */}
        <div className="sn-grid">

          {/* LEFT */}
          <div className="sn-left">

            {/* Thumbnail */}
            <div className="sn-thumb-card">
              <img className="sn-thumb-img" src={thumbSrc} alt="story preview" />
              <div className="sn-thumb-overlay" />
              <div className="sn-thumb-label">
                <div className="sn-play-icon">▶</div>
                <span className="sn-watch-text">Preview available</span>
              </div>
            </div>

            {/* Meta */}
            <div className="sn-meta-card">
              <div className="sn-meta-row">
                <span className="sn-meta-icon">🕐</span>
                <span className="sn-meta-label">Runtime</span>
                <span className="sn-meta-value">{media.runtime || "6 minutes"}</span>
              </div>
              <hr className="sn-divider" />
              <div className="sn-meta-row" style={{ marginBottom: 0 }}>
                <span className="sn-meta-icon">🎯</span>
                <span className="sn-meta-label">Growth Tags</span>
              </div>
              <div className="sn-tags-wrap">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`sn-tag ${TAG_COLORS[i % TAG_COLORS.length]}`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {TAG_ICONS[i % TAG_ICONS.length]} {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="sn-right">

            {/* Description */}
            <div className="sn-desc-card">
              <div className="sn-story-eyebrow">Today's Story</div>
              <div className="sn-story-title">{media.title || "Story Preview"}</div>
              <p className="sn-story-desc">
                {media.description || "This story explores how understanding another person's perspective can change how we see the world. Through vivid storytelling and emotional depth, it invites young viewers to step into someone else's shoes."}
              </p>
              {(media.reason || true) && (
                <div className="sn-reason-box">
                  <div className="sn-reason-title">✦ Why this story was chosen for you</div>
                  <p className="sn-reason-text">
                    {media.reason || "Based on your recent reflections, this story will help strengthen your empathy and expose you to a new cultural perspective you haven't explored yet."}
                  </p>
                </div>
              )}
            </div>

            {/* Growth traits */}
            <div className="sn-traits-card">
              <div className="sn-traits-title">◆ Skills this story develops</div>
              {TRAITS.map((t) => (
                <TraitBar key={t.name} {...t} />
              ))}
            </div>

          </div>
        </div>

        {/* ── ACTIONS BAR ── */}
        <div className="sn-actions">
          <div className="sn-session-info">
            <div className="sn-session-dot" />
            <span className="sn-session-label">
              Session ready &nbsp;·&nbsp; <strong>{media.title || "Today's Story"}</strong>
            </span>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="sn-btn-back" onClick={() => navigate("/")}>
              ← Go Back
            </button>
            <button className="sn-btn-start" onClick={() => navigate("/movie")}>
              ▶ &nbsp;Start Session
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

export default Session;
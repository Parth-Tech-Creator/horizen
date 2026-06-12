import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import HorizonLogo from "../components/HorizonLogo";
import { loginWithGoogle } from "../firebase";


// ─── Inline styles & keyframes injected once ───────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --deep:   #071526;
    --ocean:  #0d3b6e;
    --sky:    #1a6ea8;
    --teal:   #0fcfb0;
    --gold:   #f4c56a;
    --light:  #f0f7ff;
    --muted:  #6a8db0;
    --white:  #ffffff;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Outfit', sans-serif;
    background: var(--deep);
    color: var(--white);
    overflow-x: hidden;
  }

  /* ── scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--deep); }
  ::-webkit-scrollbar-thumb { background: var(--ocean); border-radius: 3px; }

  /* ── keyframes ── */
  @keyframes fadeUp   { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes float    { 0%,100%{transform:translateY(0) rotate(-1deg);} 50%{transform:translateY(-14px) rotate(1deg);} }
  @keyframes pulse    { 0%,100%{transform:scale(1);} 50%{transform:scale(1.06);} }
  @keyframes orb1     { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(40px,-30px) scale(1.15);} }
  @keyframes orb2     { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-35px,25px) scale(1.1);} }
  @keyframes orb3     { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(20px,40px) scale(1.08);} }
  @keyframes stripScroll { from{transform:translateX(0);} to{transform:translateX(-50%);} }
  @keyframes dotBounce { 0%,60%,100%{transform:translateY(0);} 30%{transform:translateY(-7px);} }
  @keyframes shimmer  { from{opacity:0;transform:scale(0.88);} to{opacity:1;transform:scale(1);} }
  @keyframes slideDown{ from{transform:translateY(-100%);opacity:0;} to{transform:translateY(0);opacity:1;} }
  @keyframes spin     { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
  @keyframes glowPulse{ 0%,100%{box-shadow:0 0 20px rgba(15,207,176,0.3);} 50%{box-shadow:0 0 45px rgba(15,207,176,0.6);} }

  /* ── nav ── */
  .hz-nav {
    position: fixed; top:0; left:0; right:0; z-index:200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 5vw;
    background: rgba(7,21,38,0.82);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    animation: slideDown 0.7s ease both;
  }
  .hz-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.75rem; font-weight: 700;
    letter-spacing: -0.01em; color: var(--white);
  }
  .hz-logo span { color: var(--teal); }
  .hz-nav-links { display: flex; gap:2.2rem; list-style:none; }
  .hz-nav-links a {
    text-decoration:none; color:rgba(255,255,255,0.6);
    font-size:0.85rem; font-weight:500; letter-spacing:0.03em;
    transition: color 0.2s;
  }
  .hz-nav-links a:hover { color: var(--teal); }
  .hz-nav-btn {
    background: var(--teal); color: var(--deep) !important;
    padding: 0.5rem 1.3rem; border-radius:50px;
    font-weight:700 !important; transition: transform 0.2s, box-shadow 0.2s !important;
    box-shadow: 0 0 20px rgba(15,207,176,0.3);
  }
  .hz-nav-btn:hover { transform:scale(1.05); box-shadow:0 0 35px rgba(15,207,176,0.5) !important; }

  /* ── hero ── */
  .hz-hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    padding: 8rem 5vw 5rem;
    position: relative; overflow: hidden;
  }
  .hz-orb {
    position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none;
  }
  .hz-orb-1 { width:600px;height:600px;background:rgba(15,207,176,0.08);top:-150px;left:-100px;animation:orb1 12s ease-in-out infinite; }
  .hz-orb-2 { width:500px;height:500px;background:rgba(13,59,110,0.35);bottom:-100px;right:-80px;animation:orb2 15s ease-in-out infinite; }
  .hz-orb-3 { width:400px;height:400px;background:rgba(244,197,106,0.06);top:40%;left:50%;animation:orb3 10s ease-in-out infinite; }

  .hz-hero-pill {
    display:inline-flex; align-items:center; gap:0.5rem;
    background:rgba(15,207,176,0.12); border:1px solid rgba(15,207,176,0.3);
    color:var(--teal); padding:0.35rem 1.1rem; border-radius:50px;
    font-size:0.75rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
    margin-bottom:1.8rem;
    animation: fadeUp 0.8s 0.1s ease both;
  }

  .hz-hero h1 {
    font-family:'Cormorant Garamond',serif;
    font-size: clamp(3.2rem, 6.5vw, 6rem);
    font-weight:700; line-height:1.05;
    color:var(--white);
    margin-bottom:1.5rem;
    animation: fadeUp 0.8s 0.25s ease both;
    max-width: 900px;
  }
  .hz-hero h1 em { font-style:italic; color:var(--teal); }
  .hz-hero h1 .gold { color:var(--gold); font-style:italic; }

  .hz-hero-sub {
    font-size:1.1rem; color:rgba(255,255,255,0.55);
    line-height:1.8; max-width:560px; margin:0 auto 2.5rem;
    font-weight:300;
    animation: fadeUp 0.8s 0.4s ease both;
  }

  .hz-hero-btns {
    display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;
    animation: fadeUp 0.8s 0.55s ease both;
    margin-bottom: 3.5rem;
  }
  .hz-btn-primary {
    background:var(--teal); color:var(--deep);
    padding:0.95rem 2.2rem; border-radius:50px;
    font-weight:700; font-size:0.95rem;
    border:none; cursor:pointer;
    box-shadow:0 0 30px rgba(15,207,176,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
    animation: glowPulse 3s ease-in-out infinite;
  }
  .hz-btn-primary:hover { transform:translateY(-3px) scale(1.04); box-shadow:0 0 50px rgba(15,207,176,0.6); }
  .hz-btn-primary:disabled { opacity:0.6; cursor:not-allowed; animation:none; }
  .hz-btn-secondary {
    background:transparent; color:rgba(255,255,255,0.85);
    padding:0.95rem 2.2rem; border-radius:50px;
    font-weight:600; font-size:0.95rem;
    border:1.5px solid rgba(255,255,255,0.2); cursor:pointer;
    transition: all 0.2s;
  }
  .hz-btn-secondary:hover { background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.4); }
  .hz-btn-ghost {
    background:transparent; color:rgba(255,255,255,0.7);
    padding:0.95rem 2.2rem; border-radius:50px;
    font-weight:600; font-size:0.95rem;
    border:1.5px solid rgba(255,255,255,0.15); cursor:pointer;
    transition: all 0.2s;
  }
  .hz-btn-ghost:hover { background:rgba(255,255,255,0.06); }

  /* hero image grid */
  .hz-hero-imgs {
    display:grid;
    grid-template-columns: 1fr 1.3fr 1fr;
    gap:1rem; max-width:860px; width:100%;
    animation: fadeUp 0.8s 0.7s ease both;
    position:relative;
  }
  .hz-hero-img {
    border-radius:20px; overflow:hidden; position:relative;
  }
  .hz-hero-img img { width:100%; height:100%; object-fit:cover; display:block; }
  .hz-hero-img.tall { height:220px; }
  .hz-hero-img.mid  { height:260px; border-radius:24px; box-shadow:0 30px 80px rgba(0,0,0,0.4); }
  .hz-hero-img.short{ height:200px; }
  .hz-hero-img-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to top, rgba(7,21,38,0.5) 0%, transparent 60%);
  }
  .hz-float-badge {
    position:absolute; z-index:10;
    background:rgba(7,21,38,0.85);
    border:1px solid rgba(15,207,176,0.25);
    backdrop-filter:blur(12px);
    border-radius:14px; padding:0.75rem 1.1rem;
    animation:float 5s ease-in-out infinite;
  }
  .hz-float-badge.b1 { bottom:-15px; left:-20px; animation-delay:0s; }
  .hz-float-badge.b2 { top:20px; right:-25px; animation-delay:2s; }
  .hz-badge-icon { font-size:1.3rem; margin-bottom:0.25rem; }
  .hz-badge-title { font-size:0.78rem; font-weight:700; color:var(--white); }
  .hz-badge-sub   { font-size:0.68rem; color:var(--teal); }

  /* stats row */
  .hz-stats {
    display:flex; gap:0; justify-content:center;
    border:1px solid rgba(255,255,255,0.08);
    border-radius:16px; overflow:hidden;
    max-width:560px; width:100%; margin-top:2.5rem;
    animation: fadeUp 0.8s 0.85s ease both;
    background:rgba(255,255,255,0.03);
    backdrop-filter:blur(10px);
  }
  .hz-stat { flex:1; padding:1.2rem 1rem; text-align:center; border-right:1px solid rgba(255,255,255,0.08); }
  .hz-stat:last-child { border-right:none; }
  .hz-stat-num {
    font-family:'Cormorant Garamond',serif;
    font-size:1.9rem; font-weight:700; color:var(--teal);
    line-height:1;
  }
  .hz-stat-label { font-size:0.72rem; color:rgba(255,255,255,0.45); font-weight:500; margin-top:0.25rem; letter-spacing:0.03em; }

  /* ── how it works ── */
  .hz-section { padding:6rem 5vw; }
  .hz-section-dark { background:rgba(255,255,255,0.02); }
  .hz-section-center { text-align:center; }
  .hz-tag {
    display:inline-block;
    font-size:0.72rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase;
    color:var(--teal); margin-bottom:0.9rem;
  }
  .hz-h2 {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2rem,3.5vw,2.8rem); font-weight:700;
    color:var(--white); line-height:1.15; margin-bottom:1rem;
  }
  .hz-h2 em { font-style:italic; color:var(--gold); }
  .hz-intro { font-size:1rem; color:rgba(255,255,255,0.5); line-height:1.8; max-width:560px; font-weight:300; }

  .hz-steps {
    display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; margin-top:3.5rem;
  }
  .hz-step {
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
    border-radius:20px; padding:1.8rem;
    transition: transform 0.3s, background 0.3s, border-color 0.3s;
    cursor:default;
  }
  .hz-step:hover { transform:translateY(-6px); background:rgba(15,207,176,0.06); border-color:rgba(15,207,176,0.25); }
  .hz-step-num {
    font-family:'Cormorant Garamond',serif;
    font-size:3rem; font-weight:700;
    color:rgba(15,207,176,0.15); line-height:1; margin-bottom:0.3rem;
  }
  .hz-step-icon { font-size:1.8rem; margin-bottom:0.9rem; }
  .hz-step-title { font-weight:700; font-size:0.92rem; margin-bottom:0.5rem; color:var(--white); }
  .hz-step-desc { font-size:0.82rem; color:rgba(255,255,255,0.5); line-height:1.65; font-weight:300; }

  /* ── features ── */
  .hz-features {
    display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; margin-top:3.5rem;
  }
  .hz-feat {
    border-radius:20px; overflow:hidden;
    border:1px solid rgba(255,255,255,0.07);
    transition: transform 0.3s, box-shadow 0.3s;
    background:rgba(255,255,255,0.03);
  }
  .hz-feat:hover { transform:translateY(-8px); box-shadow:0 25px 60px rgba(0,0,0,0.35); }
  .hz-feat img { width:100%; height:180px; object-fit:cover; display:block; filter:brightness(0.85) saturate(0.9); }
  .hz-feat-body { padding:1.4rem; }
  .hz-feat-tag { font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--teal); margin-bottom:0.4rem; }
  .hz-feat-title { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:700; color:var(--white); margin-bottom:0.5rem; }
  .hz-feat-desc { font-size:0.82rem; color:rgba(255,255,255,0.5); line-height:1.65; font-weight:300; }

  /* ── photo strip ── */
  .hz-strip { overflow:hidden; padding:3.5rem 0; background:rgba(255,255,255,0.015); }
  .hz-strip-track { display:flex; gap:1.2rem; animation:stripScroll 28s linear infinite; width:max-content; }
  .hz-strip-img { width:260px; height:165px; object-fit:cover; border-radius:14px; flex-shrink:0; filter:brightness(0.8) saturate(0.85); }

  /* ── themes ── */
  .hz-themes-scroll { display:flex; gap:1rem; overflow-x:auto; padding-bottom:1rem; scrollbar-width:none; margin-top:2.5rem; }
  .hz-themes-scroll::-webkit-scrollbar { display:none; }
  .hz-theme-pill {
    flex-shrink:0; display:flex; align-items:center; gap:0.65rem;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
    border-radius:50px; padding:0.75rem 1.3rem;
    font-size:0.85rem; font-weight:600; color:rgba(255,255,255,0.8);
    cursor:pointer; transition:all 0.2s; white-space:nowrap;
    animation:shimmer 0.4s ease both;
  }
  .hz-theme-pill:hover { background:rgba(15,207,176,0.12); border-color:rgba(15,207,176,0.4); color:var(--teal); transform:scale(1.04); }

  /* ── companion ── */
  .hz-companion {
    display:grid; grid-template-columns:1fr 1fr; gap:5rem; align-items:center; padding:6rem 5vw;
  }
  .hz-chat-box {
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
    border-radius:24px; padding:1.5rem; max-width:380px;
  }
  .hz-chat-header {
    display:flex; align-items:center; gap:0.75rem;
    margin-bottom:1.4rem; padding-bottom:1.2rem;
    border-bottom:1px solid rgba(255,255,255,0.08);
  }
  .hz-chat-avatar {
    width:40px; height:40px; border-radius:50%;
    background:linear-gradient(135deg, var(--teal), #0d7a64);
    display:flex; align-items:center; justify-content:center; font-size:1.1rem;
    box-shadow:0 0 15px rgba(15,207,176,0.3);
  }
  .hz-chat-name { font-weight:700; font-size:0.88rem; color:var(--white); }
  .hz-chat-status { font-size:0.72rem; color:var(--teal); }
  .hz-bubble {
    padding:0.75rem 1rem; border-radius:14px;
    font-size:0.83rem; line-height:1.55; margin-bottom:0.7rem; max-width:86%;
  }
  .hz-bubble.ai { background:rgba(15,207,176,0.1); color:rgba(255,255,255,0.85); }
  .hz-bubble.user { background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.8); margin-left:auto; text-align:right; }
  .hz-typing { display:flex; gap:4px; padding:0.7rem 1rem; background:rgba(15,207,176,0.08); border-radius:14px; width:fit-content; }
  .hz-dot { width:6px; height:6px; background:var(--teal); border-radius:50%; animation:dotBounce 1s infinite; }
  .hz-dot:nth-child(2){animation-delay:0.2s;} .hz-dot:nth-child(3){animation-delay:0.4s;}

  .hz-companion-list { list-style:none; margin-top:2rem; display:flex; flex-direction:column; gap:0.85rem; }
  .hz-companion-list li { display:flex; align-items:flex-start; gap:0.85rem; color:rgba(255,255,255,0.65); font-size:0.88rem; line-height:1.6; font-weight:300; }
  .hz-check { width:22px;height:22px; border-radius:50%; background:rgba(15,207,176,0.15); border:1px solid rgba(15,207,176,0.3); display:flex;align-items:center;justify-content:center; font-size:0.7rem; color:var(--teal); flex-shrink:0; margin-top:2px; }

  /* ── comparison ── */
  .hz-comp-row {
    display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:1rem;
    align-items:center; padding:0.9rem 1.5rem; border-radius:12px;
    transition:background 0.2s;
  }
  .hz-comp-row:hover { background:rgba(255,255,255,0.03); }
  .hz-comp-header { font-weight:700; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.07em; color:rgba(255,255,255,0.3); border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:0.9rem !important; }
  .hz-comp-header:hover { background:transparent !important; }
  .hz-comp-feat { font-size:0.88rem; font-weight:500; color:rgba(255,255,255,0.75); }
  .hz-comp-cell { text-align:center; font-size:1.1rem; }
  .hz-tick { color:var(--teal); }
  .hz-cross { color:rgba(255,255,255,0.15); }

  /* ── CTA ── */
  .hz-cta {
    text-align:center; padding:7rem 5vw;
    background:linear-gradient(160deg, rgba(15,207,176,0.07) 0%, rgba(7,21,38,0) 60%);
    border-top:1px solid rgba(255,255,255,0.05);
    position:relative; overflow:hidden;
  }
  .hz-cta::before {
    content:''; position:absolute; top:-200px; left:50%; transform:translateX(-50%);
    width:700px; height:700px; border-radius:50%;
    background:radial-gradient(circle, rgba(15,207,176,0.08) 0%, transparent 70%);
    pointer-events:none;
  }
  .hz-cta h2 { font-size:clamp(2rem,4vw,3rem); margin-bottom:1rem; }
  .hz-cta p { font-size:1rem; color:rgba(255,255,255,0.5); max-width:480px; margin:0 auto 2.5rem; font-weight:300; line-height:1.8; }

  /* ── footer ── */
  .hz-footer {
    background:rgba(0,0,0,0.3); border-top:1px solid rgba(255,255,255,0.04);
    display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;
    gap:1rem; padding:2.5rem 5vw; font-size:0.8rem; color:rgba(255,255,255,0.3);
  }

  /* ── responsive ── */
  @media(max-width:900px){
    .hz-steps,.hz-features{grid-template-columns:repeat(2,1fr);}
    .hz-companion{grid-template-columns:1fr;}
    .hz-hero-imgs{grid-template-columns:1fr;}
    .hz-nav-links{display:none;}
  }
  @media(max-width:600px){
    .hz-steps,.hz-features{grid-template-columns:1fr;}
  }
`;

// ─── Inject styles ───────────────────────────────────────────────────────────
function InjectStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

// ─── Scroll reveal hook ──────────────────────────────────────────────────────
function useReveal(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

// ─── RevealBox component ─────────────────────────────────────────────────────
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const vis = useReveal(ref);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.6s ${delay}ms, transform 0.6s ${delay}ms`,
      ...style
    }}>{children}</div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
function Home() {

  const navigate = useNavigate();
  const [quote, setQuote] = useState("Loading inspiration....");
  const [focusTrait, setFocusTrait] = useState(null);
  const [recommendedTitle, setRecommendedTitle] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);

  const userId = "u_001";

  useEffect(() => { fetchDashboardData(); }, []);

  async function fetchDashboardData() {
    try {
      const res = await fetch(`http://localhost:5000/dashboard/overview?user_id=${userId}`);
      if (!res.ok) throw new Error("Dashboard data not available");
      const data = await res.json();
      setQuote(data.daily_quote);
      setFocusTrait(data.daily_focus_trait);
      setRecommendedTitle(data.recommended_video?.title);
    } catch {
      setQuote("Growth begins the moment you try to understand another perspective.");
      setFocusTrait("empathy");
      setRecommendedTitle("Today's Story");
    }
  }

  async function startSession() {
    setLoadingSession(true);
    try {
      const res = await fetch("http://localhost:5000/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      localStorage.setItem("horizon_session", JSON.stringify(data));
      navigate("/session");
    } catch {
      navigate("/session");
    }
  }

  const STRIP_IMGS = [
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=75",
    "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=75",
    "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&q=75",
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=75",
    "https://images.unsplash.com/photo-1601132359864-c974e79890ac?w=400&q=75",
    "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&q=75",
  ];

  const THEMES = [
    ["🌏", "Cultural Diversity"], ["⚖️", "Moral Dilemmas"], ["♿", "Disability Inclusion"],
    ["💰", "Social Awareness"], ["🌱", "Environment"], ["🕰️", "History"],
    ["💜", "Gender & Identity"], ["🧠", "Emotional Intelligence"], ["🤝", "Empathy"], ["💪", "Resilience"],
  ];

  const STEPS = [
    { icon: "🎯", title: "Curated Content", desc: "AI picks stories based on emotional development — not just what you already love." },
    { icon: "💬", title: "AI Reflections", desc: "After each story, thoughtful questions spark deeper thinking and self-awareness." },
    { icon: "🗣️", title: "Peer Discussions", desc: "Join moderated rooms to share perspectives and build critical thinking." },
    { icon: "🏆", title: "Growth Badges", desc: "Unlock Empathy Explorer, Cultural Ambassador and more as you grow." },
  ];

  const FEATURES = [
    { tag: "Content Engine", title: "Anti-Bubble Picks", desc: "Instead of 10 more princess movies, Horizon balances genres, cultures and viewpoints for real growth.", img: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&q=80" },
    { tag: "Safe Social", title: "Moderated Peer Rooms", desc: "AI + human moderation keeps discussions safe. Debate rooms build open-mindedness and communication.", img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80" },
    { tag: "For Parents", title: "Progress Reports", desc: "Parents & educators see emotional and intellectual development summaries with full content control.", img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80" },
  ];

  const COMPS = [
    ["Personality Growth Focus", true, false, false],
    ["AI Reflection Questions", true, false, false],
    ["Moderated Peer Discussions", true, false, false],
    ["Anti-Bubble Recommendations", true, false, false],
    ["Cultural Diversity Driven", true, false, false],
    ["Parental Progress Reports", true, false, true],
  ];

  return (
    <>
      <InjectStyles />

      {/* ── NAV ── */}
      <nav className="hz-nav">
        <HorizonLogo size={34} wordmark />
        <ul className="hz-nav-links">
          <li><a href="#how">How It Works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#companion">AI Companion</a></li>
          <li><a href="#cta" className="hz-nav-btn">Get Started</a></li>
        </ul>
        {/* Profile button from original */}
        <button
          onClick={() => {

            const user = localStorage.getItem("horizon_user")

            if (!user) {
              navigate("/login")
            } else {
              navigate("/profile")
            }

          }}

          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "white",
            padding: "0.45rem 1.1rem",
            borderRadius: "50px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
            transition: "background 0.2s"
          }}

          onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.14)"}
          onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.08)"}

        >
          Profile
        </button>
      </nav>

      {/* ════════════════════════════════════════
          HERO — CENTERED
      ════════════════════════════════════════ */}
      <section className="hz-hero">
        {/* background orbs */}
        <div className="hz-orb hz-orb-1" />
        <div className="hz-orb hz-orb-2" />
        <div className="hz-orb hz-orb-3" />

        <HorizonLogo size={72} style={{ marginBottom: "1.6rem", animation: "fadeUp 0.8s 0.05s ease both" }} />

        <div className="hz-hero-pill">✦ &nbsp;AI-Powered Growth · Ages 5–20</div>

        <h1>
          Expand Your <em>Mind</em>,<br />
          Embrace the <span className="gold">World</span>
        </h1>

        {/* Dynamic quote from API */}
        <p className="hz-hero-sub">"{quote}"</p>

        {/* Focus trait */}
        {focusTrait && (
          <div style={{ marginBottom: "1.2rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", animation: "fadeUp 0.8s 0.5s ease both", opacity: 0 }}>
            Today's focus: <span style={{ color: "var(--teal)", fontWeight: 700, textTransform: "capitalize" }}>{focusTrait}</span>
          </div>
        )}

        {/* Recommended story */}
        {recommendedTitle && (
          <div style={{ marginBottom: "1.8rem", display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(15,207,176,0.08)", border: "1px solid rgba(15,207,176,0.2)", borderRadius: "50px", padding: "0.4rem 1.1rem", fontSize: "0.82rem", color: "var(--teal)", fontWeight: 600, animation: "fadeUp 0.8s 0.6s ease both", opacity: 0 }}>
            🎬 &nbsp;Recommended: {recommendedTitle}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="hz-hero-btns">
          <button className="hz-btn-primary" onClick={startSession} disabled={loadingSession}>
            {loadingSession ? "⏳ Preparing…" : "▶ Today's Session"}
          </button>
          <button className="hz-btn-secondary" onClick={() => navigate("/companion")}>
            💬 Let's Talk
          </button>
          <button
            className="hz-btn-ghost"
            onClick={() => navigate("/insights")}
          >
            📈 Growth Insights
          </button>
        </div>

        {/* Hero photo triptych */}
        <div className="hz-hero-imgs">
          <div className="hz-hero-img tall" style={{ animationDelay: "0.1s" }}>
            <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&q=80" alt="Children learning" />
            <div className="hz-hero-img-overlay" />
          </div>
          <div className="hz-hero-img mid" style={{ position: "relative" }}>
            <img src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80" alt="Kids discussing" />
            <div className="hz-hero-img-overlay" />
            <div className="hz-float-badge b1">
              <div className="hz-badge-icon">🌍</div>
              <div className="hz-badge-title">Cultural Explorer</div>
              <div className="hz-badge-sub">Badge unlocked!</div>
            </div>
            <div className="hz-float-badge b2">
              <div className="hz-badge-icon">🤝</div>
              <div className="hz-badge-title">Empathy +12</div>
              <div className="hz-badge-sub">This week</div>
            </div>
          </div>
          <div className="hz-hero-img short">
            <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80" alt="Parent and child" />
            <div className="hz-hero-img-overlay" />
          </div>
        </div>

        {/* Stats */}
        <div className="hz-stats">
          <div className="hz-stat"><div className="hz-stat-num">7+</div><div className="hz-stat-label">Cultural Themes</div></div>
          <div className="hz-stat"><div className="hz-stat-num">AI</div><div className="hz-stat-label">Guided Reflections</div></div>
          <div className="hz-stat"><div className="hz-stat-num">Safe</div><div className="hz-stat-label">Peer Discussions</div></div>
          <div className="hz-stat"><div className="hz-stat-num">5–20</div><div className="hz-stat-label">Age Range</div></div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════ */}
      <section className="hz-section hz-section-dark hz-section-center" id="how">
        <Reveal><span className="hz-tag">The Process</span></Reveal>
        <Reveal delay={80}><h2 className="hz-h2">Growth Through <em>Every Story</em></h2></Reveal>
        <Reveal delay={140} style={{ display: "flex", justifyContent: "center" }}>
          <p className="hz-intro">A purposeful 4-step journey from watching to growing — engineered for young minds.</p>
        </Reveal>
        <div className="hz-steps">
          {STEPS.map((s, i) => (
            <Reveal key={i} delay={i * 110}>
              <div className="hz-step">
                <div className="hz-step-num">0{i + 1}</div>
                <div className="hz-step-icon">{s.icon}</div>
                <div className="hz-step-title">{s.title}</div>
                <div className="hz-step-desc">{s.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════ */}
      <section className="hz-section" id="features">
        <Reveal><span className="hz-tag">Core Features</span></Reveal>
        <Reveal delay={80}><h2 className="hz-h2">Everything a Growing<br /><em>Mind Needs</em></h2></Reveal>
        <div className="hz-features">
          {FEATURES.map((f, i) => (
            <Reveal key={i} delay={i * 130}>
              <div className="hz-feat">
                <img src={f.img} alt={f.title} />
                <div className="hz-feat-body">
                  <div className="hz-feat-tag">{f.tag}</div>
                  <div className="hz-feat-title">{f.title}</div>
                  <div className="hz-feat-desc">{f.desc}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          PHOTO STRIP
      ════════════════════════════════════════ */}
      <div className="hz-strip">
        <div className="hz-strip-track">
          {[...STRIP_IMGS, ...STRIP_IMGS].map((src, i) => (
            <img key={i} className="hz-strip-img" src={src} alt="" />
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          THEMES
      ════════════════════════════════════════ */}
      <section className="hz-section hz-section-dark">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem", marginBottom: "0.5rem" }}>
          <div>
            <Reveal><span className="hz-tag">Perspectives</span></Reveal>
            <Reveal delay={80}><h2 className="hz-h2">A Wider Worldview,<br /><em>One Story at a Time</em></h2></Reveal>
          </div>
          <Reveal><p className="hz-intro" style={{ maxWidth: 360 }}>Every theme is woven into recommendations to ensure balanced, inclusive growth.</p></Reveal>
        </div>
        <div className="hz-themes-scroll">
          {THEMES.map(([emoji, label], i) => (
            <div key={i} className="hz-theme-pill" style={{ animationDelay: `${i * 60}ms` }}>
              <span>{emoji}</span>{label}
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          AI COMPANION
      ════════════════════════════════════════ */}
      <section className="hz-companion" id="companion">
        <Reveal>
          <div className="hz-chat-box">
            <div className="hz-chat-header">
              <div className="hz-chat-avatar">🤖</div>
              <div>
                <div className="hz-chat-name">Horizon AI</div>
                <div className="hz-chat-status">● Online · Your growth companion</div>
              </div>
            </div>
            <div className="hz-bubble ai">Hi! How are you feeling today? 😊</div>
            <div className="hz-bubble user">I feel a bit left out at school…</div>
            <div className="hz-bubble ai">I hear you — that's tough. Have you seen <strong>Wonder</strong>? It's a beautiful story about belonging. Want to watch it together?</div>
            <div className="hz-bubble user">That sounds really nice!</div>
            <div className="hz-typing"><div className="hz-dot" /><div className="hz-dot" /><div className="hz-dot" /></div>
          </div>
        </Reveal>

        <div>
          <Reveal><span className="hz-tag">AI Companion</span></Reveal>
          <Reveal delay={80}><h2 className="hz-h2">A Safe Space to Talk,<br /><em>Reflect & Grow</em></h2></Reveal>
          <Reveal delay={140}><p className="hz-intro">Kids talk to Horizon AI about anything — school stress, friendships, feelings — and receive empathetic, thoughtful guidance.</p></Reveal>
          <ul className="hz-companion-list">
            {[
              "Listens and responds with empathy to anything",
              "Recommends stories that match their current emotions",
              "Asks gentle questions for self-discovery",
              "Tracks emotional growth with daily challenges",
              "Interactive journaling with AI encouragement",
            ].map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <li><span className="hz-check">✓</span>{item}</li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ════════════════════════════════════════
          COMPARISON
      ════════════════════════════════════════ */}
      <section className="hz-section hz-section-dark">
        <Reveal><span className="hz-tag">Why Horizon</span></Reveal>
        <Reveal delay={80}><h2 className="hz-h2">Not Just Another <em>Streaming App</em></h2></Reveal>
        <Reveal delay={160}>
          <div style={{ marginTop: "2.5rem", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
            <div className="hz-comp-row hz-comp-header">
              <div>Feature</div><div style={{ textAlign: "center" }}>Horizon</div>
              <div style={{ textAlign: "center" }}>Streaming</div><div style={{ textAlign: "center" }}>Learning Apps</div>
            </div>
            {COMPS.map(([feat, h, s, l], i) => (
              <div key={i} className="hz-comp-row">
                <div className="hz-comp-feat">{feat}</div>
                <div className="hz-comp-cell">{h ? <span className="hz-tick">✓</span> : <span className="hz-cross">✗</span>}</div>
                <div className="hz-comp-cell">{s ? <span className="hz-tick">✓</span> : <span className="hz-cross">✗</span>}</div>
                <div className="hz-comp-cell">{l ? <span className="hz-tick">✓</span> : <span className="hz-cross">✗</span>}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ════════════════════════════════════════
          CTA
      ════════════════════════════════════════ */}
      <section className="hz-cta" id="cta">
        <Reveal><span className="hz-tag">Ready to Begin?</span></Reveal>
        <Reveal delay={80}><h2 className="hz-h2">Help Your Child<br /><em>See the Whole World</em></h2></Reveal>
        <Reveal delay={160}><p>Join Horizon and raise emotionally intelligent, open-minded, and socially aware individuals — one story at a time.</p></Reveal>
        <Reveal delay={240}>
          <button className="hz-btn-primary" onClick={startSession} disabled={loadingSession} style={{ fontSize: "1rem", padding: "1.1rem 2.8rem" }}>
            {loadingSession ? "⏳ Preparing…" : "▶ Start for Free Today"}
          </button>
        </Reveal>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer className="hz-footer">
        <div className="hz-logo" style={{ fontSize: "1.4rem" }}>Hori<span style={{ color: "var(--teal)" }}>zon</span></div>
        <div>Expand Your Mind. Embrace the World.</div>
        <div>© 2025 Horizon · All rights reserved</div>
      </footer>
    </>
  );
}

export default Home;
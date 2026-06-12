import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Radar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, RadialLinearScale,
  ArcElement, Tooltip, Legend, Filler
);

// ─── Styles ────────────────────────────────────────────────────────────────
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

  @keyframes slideDown { from{transform:translateY(-100%);opacity:0;}to{transform:translateY(0);opacity:1;} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);} }
  @keyframes orb1      { 0%,100%{transform:translate(0,0);}50%{transform:translate(35px,-25px);} }
  @keyframes orb2      { 0%,100%{transform:translate(0,0);}50%{transform:translate(-28px,20px);} }
  @keyframes barGrow   { from{transform:scaleY(0);}to{transform:scaleY(1);} }
  @keyframes pulse     { 0%,100%{opacity:0.4;}50%{opacity:1;} }
  @keyframes glowCoral { 0%,100%{box-shadow:0 0 18px rgba(255,123,84,0.25);}50%{box-shadow:0 0 38px rgba(255,123,84,0.5);} }
  @keyframes cardIn    { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }
  @keyframes fillBar   { from{width:0;}to{width:var(--w);} }

  body, #root {
    font-family:'Outfit',sans-serif;
    background:var(--deep); color:#fff;
    min-height:100vh; overflow-x:hidden;
  }

  /* NAV */
  .ig-nav {
    position:fixed; top:0; left:0; right:0; z-index:200;
    display:flex; align-items:center; justify-content:space-between;
    padding:0.9rem 4vw;
    background:rgba(15,30,53,0.9); backdrop-filter:blur(20px);
    border-bottom:1px solid var(--border);
    animation:slideDown 0.6s ease both;
  }
  .ig-logo { font-family:'Cormorant Garamond',serif; font-size:1.55rem; font-weight:700; color:#fff; }
  .ig-logo span { color:var(--coral); }
  .ig-nav-badge {
    display:flex; align-items:center; gap:0.55rem;
    background:rgba(255,179,71,0.1); border:1px solid rgba(255,179,71,0.22);
    color:var(--amber); padding:0.35rem 1rem; border-radius:50px;
    font-size:0.75rem; font-weight:700; letter-spacing:0.07em; text-transform:uppercase;
  }
  .ig-nav-dot { width:7px;height:7px;border-radius:50%;background:var(--amber);animation:pulse 2s ease-in-out infinite; }
  .ig-back-btn {
    display:flex; align-items:center; gap:0.4rem;
    background:rgba(255,255,255,0.06); border:1px solid var(--border);
    color:rgba(255,255,255,0.6); padding:0.4rem 1rem; border-radius:50px;
    cursor:pointer; font-size:0.82rem; font-weight:500;
    font-family:'Outfit',sans-serif; transition:all 0.2s;
  }
  .ig-back-btn:hover { background:rgba(255,255,255,0.11); color:#fff; }

  /* PAGE */
  .ig-page { min-height:100vh; padding:6.5rem 4vw 5rem; position:relative; }
  .ig-orb {
    position:fixed; border-radius:50%;
    filter:blur(100px); pointer-events:none; z-index:0;
  }
  .ig-orb-1 { width:500px;height:500px;background:rgba(255,123,84,0.06);top:-60px;right:-80px;animation:orb1 14s ease-in-out infinite; }
  .ig-orb-2 { width:400px;height:400px;background:rgba(78,205,196,0.05);bottom:0;left:-80px;animation:orb2 11s ease-in-out infinite; }
  .ig-orb-3 { width:300px;height:300px;background:rgba(255,179,71,0.04);top:50%;left:40%;animation:orb1 18s reverse ease-in-out infinite; }

  /* HEADER */
  .ig-header {
    margin-bottom:3rem; position:relative; z-index:1;
    animation:fadeUp 0.6s 0.1s ease both;
  }
  .ig-eyebrow { font-size:0.72rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--amber); margin-bottom:0.6rem; }
  .ig-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2rem,4vw,3rem); font-weight:700; color:#fff; line-height:1.1; margin-bottom:0.7rem;
  }
  .ig-title em { font-style:italic; color:var(--coral); }
  .ig-subtitle { font-size:0.92rem; color:rgba(255,255,255,0.45); font-weight:300; max-width:500px; line-height:1.7; }

  /* SUMMARY CARDS ROW */
  .ig-summary-row {
    display:grid; grid-template-columns:repeat(4,1fr); gap:1.2rem;
    margin-bottom:2.5rem; position:relative; z-index:1;
  }
  .ig-sum-card {
    background:var(--glass); border:1px solid var(--border);
    border-radius:18px; padding:1.2rem 1.4rem;
    backdrop-filter:blur(16px);
    animation:cardIn 0.5s ease both;
    transition:border-color 0.3s, transform 0.3s;
  }
  .ig-sum-card:hover { border-color:rgba(255,123,84,0.25); transform:translateY(-4px); }
  .ig-sum-icon  { font-size:1.4rem; margin-bottom:0.5rem; }
  .ig-sum-val   { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:700; line-height:1; margin-bottom:0.2rem; }
  .ig-sum-label { font-size:0.72rem; color:var(--muted); font-weight:500; text-transform:uppercase; letter-spacing:0.06em; }

  /* CHART GRID */
  .ig-charts-grid {
    display:grid; grid-template-columns:1.4fr 1fr; gap:1.5rem;
    margin-bottom:1.5rem; position:relative; z-index:1;
  }
  .ig-chart-card {
    background:var(--glass); border:1px solid var(--border);
    border-radius:20px; padding:1.6rem;
    backdrop-filter:blur(16px);
    animation:cardIn 0.5s ease both;
    /* FIX 7: overflow hidden prevents charts spilling outside card */
    overflow:hidden;
  }
  .ig-chart-title { font-size:0.72rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--teal); margin-bottom:0.3rem; }
  .ig-chart-sub   { font-size:0.82rem; color:rgba(255,255,255,0.4); margin-bottom:1.2rem; font-weight:300; }

  /* FIX 2 + 4 + 7: explicit height containers so charts never overflow */
  .ig-chart-wrap-bar   { position:relative; height:280px; width:100%; }
  .ig-chart-wrap-radar { position:relative; height:320px; width:100%; }
  .ig-chart-wrap-pie   { position:relative; height:260px; width:100%; }

  /* BOTTOM ROW */
  .ig-bottom-grid {
    display:grid; grid-template-columns:1fr 1fr 1.2fr; gap:1.5rem;
    position:relative; z-index:1;
  }

  /* TRAIT LIST CARDS */
  .ig-trait-card {
    background:var(--glass); border:1px solid var(--border);
    border-radius:20px; padding:1.5rem;
    backdrop-filter:blur(16px);
    animation:cardIn 0.5s 0.1s ease both;
  }
  .ig-trait-heading {
    font-size:0.72rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
    margin-bottom:1.1rem;
  }
  .ig-trait-heading.strong { color:var(--teal); }
  .ig-trait-heading.weak   { color:var(--amber); }

  .ig-trait-row { margin-bottom:0.9rem; }
  .ig-trait-row:last-child { margin-bottom:0; }
  .ig-trait-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem; }
  .ig-trait-name { font-size:0.85rem; font-weight:600; color:rgba(255,255,255,0.82); }
  /* FIX 5: scores formatted as % with toFixed, never raw floats */
  .ig-trait-pct  { font-size:0.78rem; font-weight:700; }
  .ig-trait-pct.strong { color:var(--teal); }
  .ig-trait-pct.weak   { color:var(--amber); }
  .ig-bar-bg   { height:5px; background:rgba(255,255,255,0.07); border-radius:10px; overflow:hidden; }
  .ig-bar-fill { height:100%; border-radius:10px; transition:width 1.2s cubic-bezier(0.4,0,0.2,1); }

  /* GROWTH SUMMARY CARD */
  .ig-summary-card {
    background:linear-gradient(135deg, rgba(78,205,196,0.07) 0%, rgba(255,123,84,0.05) 100%);
    border:1px solid rgba(78,205,196,0.22);
    border-radius:20px; padding:1.6rem;
    position:relative; overflow:hidden;
    animation:cardIn 0.5s 0.15s ease both;
  }
  .ig-summary-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,var(--teal),var(--amber),var(--coral));
    opacity:0.6;
  }
  .ig-summary-label { font-size:0.72rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--teal); margin-bottom:0.8rem; }
  .ig-summary-text  {
    font-family:'Cormorant Garamond',serif;
    font-size:1.05rem; font-style:italic; font-weight:600;
    color:rgba(255,255,255,0.8); line-height:1.75;
  }

  /* LOADING / ERROR */
  .ig-loading {
    min-height:100vh; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:1.2rem;
  }
  .ig-spinner {
    width:48px; height:48px;
    border:3px solid rgba(255,123,84,0.15);
    border-top-color:var(--coral);
    border-radius:50%;
    animation:glowCoral 1s linear infinite, spin 0.9s linear infinite;
  }
  @keyframes spin { to{transform:rotate(360deg);} }
  .ig-loading-text { font-size:0.9rem; color:var(--muted); }

  .ig-error-box {
    background:rgba(255,123,84,0.08); border:1px solid rgba(255,123,84,0.25);
    border-radius:16px; padding:1.5rem 2rem; max-width:480px; margin:0 auto;
    text-align:center; color:var(--coral); font-size:0.9rem; line-height:1.7;
  }

  @media(max-width:900px){
    .ig-charts-grid  { grid-template-columns:1fr; }
    .ig-bottom-grid  { grid-template-columns:1fr; }
    .ig-summary-row  { grid-template-columns:1fr 1fr; }
  }
  @media(max-width:500px){
    .ig-summary-row  { grid-template-columns:1fr 1fr; }
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

// ─── Animated trait bar ─────────────────────────────────────────────────────
function TraitBar({ name, score, variant }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // FIX 5: safely coerce score to number, clamp to 0–1, format as %
  const raw = parseFloat(score);
  const pct = isNaN(raw) ? 0 : Math.min(1, Math.max(0, raw));
  const display = `${Math.round(pct * 100)}%`;
  const barColor = variant === "strong"
    ? "linear-gradient(90deg, var(--teal), #0d8a7a)"
    : "linear-gradient(90deg, var(--amber), #e09030)";

  return (
    <div className="ig-trait-row" ref={ref}>
      <div className="ig-trait-top">
        <span className="ig-trait-name">{name || "—"}</span>
        <span className={`ig-trait-pct ${variant}`}>{display}</span>
      </div>
      <div className="ig-bar-bg">
        <div className="ig-bar-fill" style={{
          width: started ? `${pct * 100}%` : "0%",
          background: barColor,
        }} />
      </div>
    </div>
  );
}

// ─── Shared Chart.js theme options ──────────────────────────────────────────
const CHART_COLORS = {
  coral:      "rgba(255,123,84,0.85)",
  coralLight: "rgba(255,123,84,0.15)",
  amber:      "rgba(255,179,71,0.85)",
  amberLight: "rgba(255,179,71,0.15)",
  teal:       "rgba(78,205,196,0.85)",
  tealLight:  "rgba(78,205,196,0.15)",
  rose:       "rgba(255,100,130,0.85)",
  sky:        "rgba(100,180,255,0.85)",
  mint:       "rgba(100,220,160,0.85)",
  gold:       "rgba(240,200,80,0.85)",
};

const PIE_BG = [
  CHART_COLORS.coral, CHART_COLORS.teal, CHART_COLORS.amber,
  CHART_COLORS.rose,  CHART_COLORS.sky,  CHART_COLORS.mint, CHART_COLORS.gold,
];

const baseFont = { family: "'Outfit', sans-serif", size: 11 };

// FIX 8: tooltip formatter rounds to % string
const tooltipPct = {
  callbacks: {
    label: (ctx) => {
      const v = parseFloat(ctx.raw);
      return isNaN(v) ? ctx.label : ` ${Math.round(v * 100)}%`;
    },
  },
};

// ─── Main Component ──────────────────────────────────────────────────────────
function Insights() {
  const navigate   = useNavigate();
  const [data, setData]     = useState(null);
  const [error, setError]   = useState(false);
  const userId = "u_001";

  useEffect(() => {
    fetch(`http://localhost:5000/dashboard/insights?user_id=${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  // ── Loading ──
  if (!data && !error) return (
    <>
      <InjectStyles />
      <div className="ig-loading">
        <div className="ig-spinner" />
        <div className="ig-loading-text">Loading your growth insights…</div>
      </div>
    </>
  );

  // ── Error ──
  if (error) return (
    <>
      <InjectStyles />
      <div className="ig-loading">
        <div className="ig-error-box">
          ⚠️ Couldn't load insights right now.<br />Make sure the backend is running and try again.
        </div>
        <button className="ig-back-btn" style={{ marginTop:"1rem" }} onClick={() => navigate("/")}>← Back Home</button>
      </div>
    </>
  );

  // FIX 6: safe fallbacks so .map() never crashes on undefined arrays
  const allTraits    = Array.isArray(data?.all_traits)    ? data.all_traits    : [];
  const strongTraits = Array.isArray(data?.strong_traits) ? data.strong_traits : [];
  const weakTraits   = Array.isArray(data?.weak_traits)   ? data.weak_traits   : [];
  const summary      = data?.growth_summary || "Keep exploring stories to build your growth summary.";

  const labels = allTraits.map(t => t?.trait || "");
  // FIX 5: clamp raw scores safely
  const scores = allTraits.map(t => {
    const v = parseFloat(t?.score);
    return isNaN(v) ? 0 : Math.min(1, Math.max(0, v));
  });

  // ── Chart datasets ──
  // FIX 1: all datasets now have explicit backgroundColor + borderColor
  const barData = {
    labels,
    datasets: [{
      label: "Trait Strength",
      data: scores,
      backgroundColor: scores.map((_, i) => i % 2 === 0 ? CHART_COLORS.coral : CHART_COLORS.teal),
      borderColor: "transparent",
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  // FIX 2: bar options — explicit height via wrapper div, maintainAspectRatio:false
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,    // ← KEY FIX: respects wrapper height
    plugins: {
      legend: { display: false },
      tooltip: tooltipPct,
    },
    scales: {
      x: {
        ticks: {
          color: "rgba(255,255,255,0.5)",
          font: baseFont,
          // FIX 2: max rotation prevents label spill on many traits
          maxRotation: 35,
          minRotation: 0,
        },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        min: 0,
        max: 1,
        ticks: {
          color: "rgba(255,255,255,0.4)",
          font: baseFont,
          // FIX 8: format y-axis ticks as %
          callback: (v) => `${Math.round(v * 100)}%`,
        },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  const radarData = {
    labels,
    datasets: [{
      label: "Personality Spread",
      data: scores,
      backgroundColor: "rgba(78,205,196,0.15)",  // FIX 1
      borderColor: CHART_COLORS.teal,             // FIX 1
      borderWidth: 2,
      pointBackgroundColor: CHART_COLORS.coral,
      pointBorderColor: "transparent",
      pointRadius: 4,
      fill: true,
    }],
  };

  // FIX 3: radar — explicit min/max + pointLabels font to stop label overflow
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,    // ← KEY FIX
    plugins: {
      legend: { display: false },
      tooltip: tooltipPct,
    },
    scales: {
      r: {
        min: 0,
        max: 1,                    // ← FIX 3: explicit max prevents scale cramping
        ticks: {
          display: false,          // hide crowded radial ticks
          stepSize: 0.25,
        },
        grid:        { color: "rgba(255,255,255,0.08)" },
        angleLines:  { color: "rgba(255,255,255,0.08)" },
        pointLabels: {
          color: "rgba(255,255,255,0.6)",
          font: { ...baseFont, size: 10 },  // FIX 3: small font prevents overflow
        },
      },
    },
  };

  const pieData = {
    labels,
    datasets: [{
      label: "Trait Distribution",
      data: scores,
      backgroundColor: PIE_BG,    // FIX 1: explicit colors for each slice
      borderColor: "rgba(15,30,53,0.8)",
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  // FIX 4: pie options — maintainAspectRatio:false + wrapper height controls size
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,    // ← KEY FIX
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "rgba(255,255,255,0.55)",
          font: baseFont,
          padding: 12,
          boxWidth: 10,
          // FIX 4: usePointStyle shrinks legend so it never overflows pie container
          usePointStyle: true,
        },
      },
      tooltip: tooltipPct,
    },
  };

  // Summary cards derived safely
  const avgScore   = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const topTrait   = allTraits.reduce((best, t) => (parseFloat(t?.score) > parseFloat(best?.score) ? t : best), allTraits[0]);
  const sessCount  = data?.session_count ?? "—";

  return (
    <>
      <InjectStyles />

      {/* NAV */}
      <nav className="ig-nav">
        <div className="ig-logo">Hori<span>zon</span></div>
        <div className="ig-nav-badge">
          <div className="ig-nav-dot" />
          Growth Insights
        </div>
        <button className="ig-back-btn" onClick={() => navigate("/")}>← Home</button>
      </nav>

      <div className="ig-orb ig-orb-1" />
      <div className="ig-orb ig-orb-2" />
      <div className="ig-orb ig-orb-3" />

      <div className="ig-page">

        {/* HEADER */}
        <div className="ig-header">
          <div className="ig-eyebrow">✦ Your Growth Profile</div>
          <h1 className="ig-title">Growth <em>Insights</em></h1>
          <p className="ig-subtitle">A window into how your personality is developing through stories, reflections and conversations.</p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="ig-summary-row">
          {[
            { icon:"🧠", val:`${Math.round(avgScore * 100)}%`, label:"Avg Trait Score" },
            { icon:"🌟", val: topTrait?.trait || "—",          label:"Top Trait" },
            { icon:"📚", val: allTraits.length || "—",         label:"Traits Tracked" },
            { icon:"🎯", val: sessCount,                        label:"Sessions Done" },
          ].map((s, i) => (
            <div key={i} className="ig-sum-card" style={{ animationDelay:`${i*80}ms` }}>
              <div className="ig-sum-icon">{s.icon}</div>
              <div className="ig-sum-val" style={{ color: i === 0 ? "var(--coral)" : i === 2 ? "var(--teal)" : "var(--amber)" }}>
                {s.val}
              </div>
              <div className="ig-sum-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CHARTS GRID — Bar (left, wide) + Radar (right) */}
        <div className="ig-charts-grid">
          <div className="ig-chart-card">
            <div className="ig-chart-title">Trait Strength Overview</div>
            <div className="ig-chart-sub">How strongly each trait has developed</div>
            {/* FIX 2: explicit height wrapper — chart stays contained */}
            <div className="ig-chart-wrap-bar">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          <div className="ig-chart-card">
            <div className="ig-chart-title">Personality Spread</div>
            <div className="ig-chart-sub">Your balance across all dimensions</div>
            {/* FIX 3 + 7: explicit height + options.maintainAspectRatio:false */}
            <div className="ig-chart-wrap-radar">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>
        </div>

        {/* BOTTOM GRID — Strong | Weak | Summary + Pie */}
        <div className="ig-bottom-grid">

          {/* STRONG TRAITS */}
          <div className="ig-trait-card">
            <div className="ig-trait-heading strong">✦ Strong Traits</div>
            {strongTraits.length === 0
              ? <p style={{ fontSize:"0.82rem", color:"var(--muted)" }}>No data yet</p>
              : strongTraits.map((t, i) => (
                  <TraitBar key={i} name={t?.trait} score={t?.score} variant="strong" />
                ))
            }
          </div>

          {/* WEAK TRAITS */}
          <div className="ig-trait-card">
            <div className="ig-trait-heading weak">◆ Areas to Grow</div>
            {weakTraits.length === 0
              ? <p style={{ fontSize:"0.82rem", color:"var(--muted)" }}>No data yet</p>
              : weakTraits.map((t, i) => (
                  <TraitBar key={i} name={t?.trait} score={t?.score} variant="weak" />
                ))
            }
          </div>

          {/* DISTRIBUTION + SUMMARY stacked */}
          <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
            <div className="ig-chart-card">
              <div className="ig-chart-title">Trait Distribution</div>
              <div className="ig-chart-sub">Share of each trait</div>
              {/* FIX 4: explicit height wrapper prevents pie overflow */}
              <div className="ig-chart-wrap-pie">
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>

            <div className="ig-summary-card">
              <div className="ig-summary-label">✦ Growth Summary</div>
              <p className="ig-summary-text">"{summary}"</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Insights;
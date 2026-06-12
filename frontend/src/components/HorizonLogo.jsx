/**
 * HorizonLogo — the Horizon app logomark + wordmark
 *
 * Usage:
 *   import HorizonLogo from "./HorizonLogo";
 *
 *   <HorizonLogo size={40} />
 *   <HorizonLogo size={40} wordmark />
 *   <HorizonLogo size={32} variant="coral" wordmark />
 *
 * Props:
 *   size      — icon height in px (default 40)
 *   wordmark  — show "Horizon" text beside icon (default false)
 *   variant   — "default" | "light" | "coral" | "mono"
 *   className / style — passed to root wrapper
 */

const VARIANTS = {
  default: { arc:"#4ECDC4", dot:"#FF7B54", line:"#FFB347", text:"#ffffff", accent:"#FF7B54" },
  light:   { arc:"#0fcfb0", dot:"#FF7B54", line:"#FFB347", text:"#071526", accent:"#FF7B54" },
  coral:   { arc:"#FF7B54", dot:"#FFB347", line:"#4ECDC4", text:"#ffffff", accent:"#FFB347" },
  mono:    { arc:"#ffffff", dot:"#ffffff", line:"#ffffff", text:"#ffffff", accent:"#ffffff" },
};

export default function HorizonLogo({
  size = 40,
  wordmark = false,
  variant = "default",
  className = "",
  style = {},
}) {
  const c  = VARIANTS[variant] || VARIANTS.default;
  const id = `hzl-${variant}`;   // unique gradient IDs per variant

  return (
    <div
      className={className}
      style={{ display:"inline-flex", alignItems:"center", gap: size * 0.28 + "px", userSelect:"none", ...style }}
    >
      {/* ══════════ ICON ══════════ */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Horizon"
      >
        <defs>
          {/* soft glow filter */}
          <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* tighter glow for sun dot */}
          <filter id={`${id}-dotglow`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* arc sweep gradient: fade at tips */}
          <linearGradient id={`${id}-arc`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={c.arc}  stopOpacity="0"   />
            <stop offset="30%"  stopColor={c.arc}  stopOpacity="1"   />
            <stop offset="70%"  stopColor={c.arc}  stopOpacity="1"   />
            <stop offset="100%" stopColor={c.arc}  stopOpacity="0"   />
          </linearGradient>

          {/* horizon line gradient */}
          <linearGradient id={`${id}-hline`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={c.line} stopOpacity="0"   />
            <stop offset="25%"  stopColor={c.line} stopOpacity="0.9" />
            <stop offset="75%"  stopColor={c.arc}  stopOpacity="0.9" />
            <stop offset="100%" stopColor={c.arc}  stopOpacity="0"   />
          </linearGradient>

          {/* bg glow behind icon */}
          <radialGradient id={`${id}-bg`} cx="50%" cy="65%" r="50%">
            <stop offset="0%"   stopColor={c.arc} stopOpacity="0.12" />
            <stop offset="100%" stopColor={c.arc} stopOpacity="0"    />
          </radialGradient>

          {/* sun core gradient */}
          <radialGradient id={`${id}-sun`} cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#fff"  stopOpacity="0.9" />
            <stop offset="50%"  stopColor={c.dot} stopOpacity="1"   />
            <stop offset="100%" stopColor={c.dot} stopOpacity="0.6" />
          </radialGradient>
        </defs>

        {/* ── ambient background glow ── */}
        <circle cx="50" cy="62" r="40" fill={`url(#${id}-bg)`} />

        {/* ══ EARTH / GROUND CURVE ══ */}
        {/* subtle half-ellipse beneath the horizon — gives depth */}
        <path
          d="M 12 65 Q 50 75 88 65"
          stroke={c.line}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.18"
          fill="none"
        />

        {/* ══ HORIZON LINE ══ */}
        <line
          x1="10" y1="64"
          x2="90" y2="64"
          stroke={`url(#${id}-hline)`}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* ══ ATMOSPHERE ARCS (3 concentric, fading out) ══ */}
        {/* outermost — very faint */}
        <path
          d="M 16 64 A 34 34 0 0 1 84 64"
          stroke={c.arc}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.15"
          fill="none"
        />
        {/* middle */}
        <path
          d="M 22 64 A 28 28 0 0 1 78 64"
          stroke={`url(#${id}-arc)`}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
          fill="none"
        />
        {/* innermost — brightest, with glow */}
        <path
          d="M 30 64 A 20 20 0 0 1 70 64"
          stroke={c.arc}
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity="1"
          fill="none"
          filter={`url(#${id}-glow)`}
        />

        {/* ══ SUN ══ */}
        {/* outer corona / halo */}
        <circle
          cx="50" cy="46"
          r="9"
          fill={c.dot}
          opacity="0.12"
        />
        {/* main sun circle */}
        <circle
          cx="50" cy="46"
          r="6"
          fill={`url(#${id}-sun)`}
          filter={`url(#${id}-dotglow)`}
        />

        {/* ══ SUN RAYS ══ */}
        {/* 6 rays at different angles — feel like light breaking over horizon */}
        {[
          [50, 37, 50, 33],        // top
          [57.5, 39, 60.5, 35.5],  // top-right
          [42.5, 39, 39.5, 35.5],  // top-left
          [62, 46, 66.5, 46],      // right
          [38, 46, 33.5, 46],      // left
          [59, 52.5, 62, 56],      // bottom-right (peeking over horizon)
          [41, 52.5, 38, 56],      // bottom-left
        ].map(([x1,y1,x2,y2], i) => (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={c.dot}
            strokeWidth={i < 3 ? "1.8" : "1.4"}
            strokeLinecap="round"
            opacity={i < 3 ? "0.9" : "0.55"}
          />
        ))}

        {/* ══ REFLECTION DOTS on horizon ══ */}
        {/* mimics light reflecting off water/earth — adds life */}
        <circle cx="32" cy="64" r="1.3" fill={c.arc} opacity="0.45" />
        <circle cx="41" cy="64" r="1"   fill={c.arc} opacity="0.3"  />
        <circle cx="50" cy="64" r="1.8" fill={c.arc} opacity="0.7"  />
        <circle cx="59" cy="64" r="1"   fill={c.arc} opacity="0.3"  />
        <circle cx="68" cy="64" r="1.3" fill={c.arc} opacity="0.45" />
      </svg>

      {/* ══════════ WORDMARK ══════════ */}
      {wordmark && (
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: size * 0.6 + "px",
            lineHeight: 1,
            letterSpacing: "-0.015em",
            color: c.text,
            whiteSpace: "nowrap",
          }}
        >
          Hori<span style={{ color: c.accent }}>zon</span>
        </span>
      )}
    </div>
  );
}

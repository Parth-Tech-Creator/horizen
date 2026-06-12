import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  @keyframes fadeUp     { from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);} }
  @keyframes fadeIn     { from{opacity:0;}to{opacity:1;} }
  @keyframes orb1       { 0%,100%{transform:translate(0,0);}50%{transform:translate(35px,-25px);} }
  @keyframes orb2       { 0%,100%{transform:translate(0,0);}50%{transform:translate(-28px,20px);} }
  @keyframes botFloat   { 0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);} }
  @keyframes glowCoral  { 0%,100%{box-shadow:0 0 18px rgba(255,123,84,0.28);}50%{box-shadow:0 0 40px rgba(255,123,84,0.55);} }
  @keyframes pulse      { 0%,100%{opacity:0.4;}50%{opacity:1;} }
  @keyframes msgIn      { from{opacity:0;transform:translateY(12px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);} }
  @keyframes dotBounce  { 0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-6px);} }
  @keyframes inputGlow  { 0%,100%{box-shadow:0 0 0 0 transparent;}50%{box-shadow:0 0 0 3px rgba(255,123,84,0.15);} }
  @keyframes suggPop    { from{opacity:0;transform:scale(0.9);}to{opacity:1;transform:scale(1);} }
  @keyframes statusPing { 0%{transform:scale(1);opacity:1;}100%{transform:scale(2.2);opacity:0;} }

  body, #root {
    font-family:'Outfit',sans-serif;
    background:var(--deep); color:#fff;
    min-height:100vh; overflow:hidden;
  }

  /* ── NAV ── */
  .cp-nav {
    position:fixed; top:0; left:0; right:0; z-index:200;
    display:flex; align-items:center; justify-content:space-between;
    padding:0.9rem 4vw;
    background:rgba(15,30,53,0.9); backdrop-filter:blur(20px);
    border-bottom:1px solid var(--border);
    animation:slideDown 0.6s ease both;
  }
  .cp-logo { font-family:'Cormorant Garamond',serif; font-size:1.55rem; font-weight:700; color:#fff; }
  .cp-logo span { color:var(--coral); }
  .cp-nav-center {
    display:flex; align-items:center; gap:0.5rem;
    background:rgba(78,205,196,0.1); border:1px solid rgba(78,205,196,0.2);
    padding:0.35rem 1rem; border-radius:50px;
  }
  .cp-status-dot {
    width:8px; height:8px; border-radius:50%; background:var(--teal);
    position:relative;
  }
  .cp-status-dot::after {
    content:''; position:absolute; inset:0; border-radius:50%;
    background:var(--teal);
    animation:statusPing 1.6s ease-out infinite;
  }
  .cp-nav-label { font-size:0.75rem; font-weight:700; color:var(--teal); letter-spacing:0.07em; text-transform:uppercase; }
  .cp-back-btn {
    display:flex; align-items:center; gap:0.4rem;
    background:rgba(255,255,255,0.06); border:1px solid var(--border);
    color:rgba(255,255,255,0.6); padding:0.4rem 1rem; border-radius:50px;
    cursor:pointer; font-size:0.82rem; font-weight:500;
    font-family:'Outfit',sans-serif; transition:all 0.2s;
  }
  .cp-back-btn:hover { background:rgba(255,255,255,0.11); color:#fff; }

  /* ── LAYOUT ── */
  .cp-layout {
    height:100vh;
    display:grid;
    grid-template-columns:280px 1fr;
    padding-top:58px;
    position:relative;
  }

  .cp-orb {
    position:fixed; border-radius:50%;
    filter:blur(100px); pointer-events:none; z-index:0;
  }
  .cp-orb-1 { width:450px;height:450px;background:rgba(255,123,84,0.06);top:-60px;right:0;animation:orb1 14s ease-in-out infinite; }
  .cp-orb-2 { width:380px;height:380px;background:rgba(78,205,196,0.05);bottom:0;left:0;animation:orb2 11s ease-in-out infinite; }

  /* ── SIDEBAR ── */
  .cp-sidebar {
    border-right:1px solid var(--border);
    background:rgba(255,255,255,0.02);
    display:flex; flex-direction:column;
    padding:1.5rem 1.2rem;
    position:relative; z-index:1;
    overflow-y:auto;
    animation:fadeIn 0.5s 0.1s ease both;
  }

  .cp-bot-profile { text-align:center; margin-bottom:1.8rem; padding-bottom:1.5rem; border-bottom:1px solid var(--border); }
  .cp-bot-ring {
    width:72px; height:72px; border-radius:50%; margin:0 auto 0.7rem;
    background:linear-gradient(135deg, var(--coral), var(--amber));
    display:flex; align-items:center; justify-content:center; font-size:1.8rem;
    box-shadow:0 0 24px rgba(255,123,84,0.3);
    animation:botFloat 4s ease-in-out infinite;
  }
  .cp-bot-name { font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-weight:700; color:#fff; margin-bottom:0.2rem; }
  .cp-bot-tagline { font-size:0.72rem; color:var(--muted); font-weight:300; }

  .cp-sidebar-section { margin-bottom:1.4rem; }
  .cp-sidebar-heading { font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted); margin-bottom:0.7rem; }

  .cp-mood-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; }
  .cp-mood-btn {
    background:rgba(255,255,255,0.04); border:1px solid var(--border);
    border-radius:12px; padding:0.6rem 0.5rem; text-align:center;
    cursor:pointer; transition:all 0.2s; font-size:0.8rem; color:rgba(255,255,255,0.65);
    font-family:'Outfit',sans-serif;
  }
  .cp-mood-btn:hover, .cp-mood-btn.active {
    background:rgba(255,123,84,0.1); border-color:rgba(255,123,84,0.3); color:var(--coral);
  }
  .cp-mood-emoji { font-size:1.2rem; display:block; margin-bottom:0.2rem; }

  .cp-sugg-list { display:flex; flex-direction:column; gap:0.5rem; }
  .cp-sugg-btn {
    background:rgba(255,255,255,0.03); border:1px solid var(--border);
    border-radius:12px; padding:0.65rem 0.8rem;
    cursor:pointer; text-align:left; font-size:0.78rem;
    color:rgba(255,255,255,0.6); font-family:'Outfit',sans-serif;
    line-height:1.45; transition:all 0.2s;
    animation:suggPop 0.4s ease both;
  }
  .cp-sugg-btn:hover { background:rgba(78,205,196,0.08); border-color:rgba(78,205,196,0.25); color:var(--teal); }

  .cp-talk-later {
    margin-top:auto; width:100%;
    background:transparent; border:1px solid var(--border);
    color:rgba(255,255,255,0.4); padding:0.65rem;
    border-radius:12px; cursor:pointer; font-size:0.8rem; font-weight:500;
    font-family:'Outfit',sans-serif; transition:all 0.2s;
  }
  .cp-talk-later:hover { background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.7); }

  /* ── CHAT MAIN ── */
  .cp-main {
    display:flex; flex-direction:column;
    position:relative; z-index:1;
    overflow:hidden;
  }

  /* messages area */
  .cp-messages {
    flex:1; overflow-y:auto; padding:1.8rem 2rem;
    display:flex; flex-direction:column; gap:1rem;
    scrollbar-width:thin; scrollbar-color:rgba(255,255,255,0.08) transparent;
  }
  .cp-messages::-webkit-scrollbar { width:4px; }
  .cp-messages::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:4px; }

  .cp-date-divider {
    text-align:center; font-size:0.7rem; color:rgba(255,255,255,0.2);
    letter-spacing:0.08em; text-transform:uppercase; margin:0.5rem 0;
  }

  /* message row */
  .cp-msg-row { display:flex; align-items:flex-end; gap:0.65rem; animation:msgIn 0.3s ease both; }
  .cp-msg-row.user { flex-direction:row-reverse; }

  .cp-msg-avatar {
    width:32px; height:32px; border-radius:50%; flex-shrink:0;
    display:flex; align-items:center; justify-content:center; font-size:0.9rem;
    margin-bottom:4px;
  }
  .cp-msg-avatar.bot { background:linear-gradient(135deg,var(--teal),#0d8a7a); box-shadow:0 0 10px rgba(78,205,196,0.25); }
  .cp-msg-avatar.user{ background:linear-gradient(135deg,var(--coral),var(--amber)); box-shadow:0 0 10px rgba(255,123,84,0.25); }

  .cp-bubble-wrap { display:flex; flex-direction:column; max-width:68%; }
  .cp-msg-row.user .cp-bubble-wrap { align-items:flex-end; }

  .cp-bubble {
    padding:0.8rem 1.1rem; border-radius:18px;
    font-size:0.88rem; line-height:1.65; font-weight:300;
  }
  .cp-bubble.bot  {
    background:rgba(255,255,255,0.06); border:1px solid var(--border);
    color:rgba(255,255,255,0.82);
    border-radius:4px 18px 18px 18px;
  }
  .cp-bubble.user {
    background:linear-gradient(135deg,var(--coral),#e85d2e);
    color:#fff; border-radius:18px 18px 4px 18px;
    box-shadow:0 4px 18px rgba(255,123,84,0.25);
  }
  .cp-bubble strong { font-weight:600; color:var(--amber); }

  .cp-msg-time { font-size:0.65rem; color:rgba(255,255,255,0.25); margin-top:0.3rem; }

  /* typing indicator */
  .cp-typing-row { display:flex; align-items:center; gap:0.65rem; animation:msgIn 0.3s ease both; }
  .cp-typing-bubble {
    background:rgba(255,255,255,0.05); border:1px solid var(--border);
    border-radius:4px 18px 18px 18px;
    padding:0.75rem 1rem; display:flex; gap:5px; align-items:center;
  }
  .cp-dot { width:6px;height:6px;background:var(--teal);border-radius:50%;animation:dotBounce 1s infinite; }
  .cp-dot:nth-child(2){animation-delay:0.2s;} .cp-dot:nth-child(3){animation-delay:0.4s;}

  /* ── INPUT BAR ── */
  .cp-input-bar {
    border-top:1px solid var(--border);
    background:rgba(15,30,53,0.7); backdrop-filter:blur(16px);
    padding:1rem 1.5rem;
    display:flex; flex-direction:column; gap:0.75rem;
  }

  /* quick replies */
  .cp-quick-wrap { display:flex; gap:0.5rem; overflow-x:auto; scrollbar-width:none; }
  .cp-quick-wrap::-webkit-scrollbar { display:none; }
  .cp-quick-btn {
    flex-shrink:0;
    background:rgba(255,255,255,0.04); border:1px solid var(--border);
    color:rgba(255,255,255,0.55); padding:0.35rem 0.9rem; border-radius:50px;
    font-size:0.75rem; font-weight:500; font-family:'Outfit',sans-serif;
    cursor:pointer; white-space:nowrap; transition:all 0.2s;
  }
  .cp-quick-btn:hover { background:rgba(255,123,84,0.1); border-color:rgba(255,123,84,0.3); color:var(--coral); }

  .cp-input-row { display:flex; gap:0.75rem; align-items:flex-end; }
  .cp-textarea {
    flex:1; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
    border-radius:16px; padding:0.85rem 1.1rem;
    color:#fff; font-size:0.9rem; font-family:'Outfit',sans-serif; font-weight:300;
    resize:none; outline:none; line-height:1.5; max-height:120px;
    transition:border-color 0.2s, background 0.2s;
    scrollbar-width:none;
  }
  .cp-textarea::placeholder { color:rgba(255,255,255,0.22); }
  .cp-textarea:focus { border-color:rgba(255,123,84,0.4); background:rgba(255,255,255,0.07); }
  .cp-textarea::-webkit-scrollbar { display:none; }

  .cp-send-btn {
    width:46px; height:46px; border-radius:50%; border:none;
    background:var(--coral); color:#fff; font-size:1.1rem;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    box-shadow:0 0 20px rgba(255,123,84,0.35);
    animation:glowCoral 3s ease-in-out infinite;
    transition:transform 0.2s, box-shadow 0.2s; flex-shrink:0;
  }
  .cp-send-btn:hover { transform:scale(1.1); box-shadow:0 0 35px rgba(255,123,84,0.55); }
  .cp-send-btn:disabled { opacity:0.4; animation:none; cursor:not-allowed; }

  /* responsive */
  @media(max-width:700px){
    .cp-layout { grid-template-columns:1fr; }
    .cp-sidebar { display:none; }
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

const API_BASE = "http://localhost:5000";

const MOODS = [
  { emoji:"😊", label:"Happy" },
  { emoji:"😔", label:"Sad" },
  { emoji:"😤", label:"Frustrated" },
  { emoji:"😟", label:"Worried" },
  { emoji:"😌", label:"Calm" },
  { emoji:"🤔", label:"Confused" },
];

const SUGGESTIONS = [
  "I feel left out at school lately",
  "I'm struggling with a friendship",
  "I feel really proud of something I did",
  "I've been feeling anxious recently",
];

const QUICK_REPLIES = [
  "Tell me more 💬",
  "That's helpful 🙏",
  "I'm not sure…",
  "Can you explain?",
  "I feel better now ✨",
];

function getTime() {
  return new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
}

function Companion() {
  const navigate   = useNavigate();
  const bottomRef  = useRef(null);
  const textareaRef = useRef(null);

  const [message, setMessage]   = useState("");
  const [chat, setChat]         = useState([
    { sender:"bot", text:"Hey! I'm <strong>Horizon AI</strong> — your safe space to talk. How are you feeling today? 😊", time: getTime() },
  ]);
  const [typing, setTyping]     = useState(false);
  const [activeMood, setActiveMood] = useState(null);

  // auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [chat, typing]);

  async function sendMessage(text) {
    const msg = (text || message).trim();
    if (!msg) return;

    setChat(prev => [...prev, { sender:"user", text: msg, time: getTime() }]);
    setMessage("");
    setTyping(true);

    try {
      const res = await fetch(`${API_BASE}/chat/companion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: "u_001", message: msg }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const reply = data?.response || "I'm here with you. Tell me more.";

      setChat(prev => [...prev, { sender:"bot", text: reply, time: getTime() }]);
    } catch {
      setChat(prev => [...prev, {
        sender:"bot",
        text: "I'm here — it looks like there was a small hiccup. Can you say that again?",
        time: getTime(),
      }]);
    } finally {
      setTyping(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleMood(mood) {
    setActiveMood(mood.label);
    sendMessage(`I'm feeling ${mood.label.toLowerCase()} ${mood.emoji}`);
  }

  return (
    <>
      <InjectStyles />

      {/* ── NAV ── */}
      <nav className="cp-nav">
        <div className="cp-logo">Hori<span>zon</span></div>
        <div className="cp-nav-center">
          <div className="cp-status-dot" />
          <span className="cp-nav-label">AI Companion · Online</span>
        </div>
        <button className="cp-back-btn" onClick={() => navigate("/")}>← Home</button>
      </nav>

      {/* orbs */}
      <div className="cp-orb cp-orb-1" />
      <div className="cp-orb cp-orb-2" />

      <div className="cp-layout">

        {/* ── SIDEBAR ── */}
        <aside className="cp-sidebar">
          <div className="cp-bot-profile">
            <div className="cp-bot-ring">🤖</div>
            <div className="cp-bot-name">Horizon AI</div>
            <div className="cp-bot-tagline">Your personal growth companion</div>
          </div>

          <div className="cp-sidebar-section">
            <div className="cp-sidebar-heading">How are you feeling?</div>
            <div className="cp-mood-grid">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  className={`cp-mood-btn${activeMood === m.label ? " active" : ""}`}
                  onClick={() => handleMood(m)}
                >
                  <span className="cp-mood-emoji">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="cp-sidebar-section">
            <div className="cp-sidebar-heading">Talk about…</div>
            <div className="cp-sugg-list">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="cp-sugg-btn"
                  style={{ animationDelay:`${i*80}ms` }}
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button className="cp-talk-later" onClick={() => navigate("/")}>
            Talk Later →
          </button>
        </aside>

        {/* ── CHAT ── */}
        <main className="cp-main">
          <div className="cp-messages">
            <div className="cp-date-divider">Today</div>

            {chat.map((msg, i) => (
              <div key={i} className={`cp-msg-row ${msg.sender}`}>
                <div className={`cp-msg-avatar ${msg.sender}`}>
                  {msg.sender === "bot" ? "🤖" : "🧒"}
                </div>
                <div className="cp-bubble-wrap">
                  <div
                    className={`cp-bubble ${msg.sender}`}
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                  {msg.time && <span className="cp-msg-time">{msg.time}</span>}
                </div>
              </div>
            ))}

            {typing && (
              <div className="cp-typing-row">
                <div className="cp-msg-avatar bot">🤖</div>
                <div className="cp-typing-bubble">
                  <div className="cp-dot" /><div className="cp-dot" /><div className="cp-dot" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── INPUT BAR ── */}
          <div className="cp-input-bar">
            <div className="cp-quick-wrap">
              {QUICK_REPLIES.map((q, i) => (
                <button key={i} className="cp-quick-btn" onClick={() => sendMessage(q)}>{q}</button>
              ))}
            </div>
            <div className="cp-input-row">
              <textarea
                ref={textareaRef}
                className="cp-textarea"
                rows={1}
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share what's on your mind… (Enter to send)"
              />
              <button
                className="cp-send-btn"
                onClick={() => sendMessage()}
                disabled={!message.trim() || typing}
              >
                ➤
              </button>
            </div>
          </div>
        </main>

      </div>
    </>
  );
}

export default Companion;
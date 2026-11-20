import { useState } from "react";

// ============================================================
// 🧱 BH-6 — AI BUSINESS COACH (Voice + Chat Assistant)
// 🏗️  Part of: Panda Business Hub (Module 3)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 🤖  AI hooks marked with:            // 🤖 AI
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export AIBusinessCoach from this file
//     Props: { businessId, currentUser, onBack, onNavigate }
// ============================================================

// ─── Design Tokens ────────────────────────────────────────────
const T = {
  navy:      "#0B1F4B",
  navyMid:   "#1A3A6E",
  navyLight: "#EEF2FF",
  gold:      "#C9960A",
  goldMid:   "#F5C842",
  white:     "#FFFFFF",
  bg:        "#F4F6FF",
  card:      "#FFFFFF",
  border:    "#DDE3F5",
  textMain:  "#0B1F4B",
  textMid:   "#3D5A8A",
  textMute:  "#8A9BC0",
  green:     "#0A7B4B",
  greenBg:   "#E8F7F0",
  red:       "#C0392B",
  purple:    "#6D28D9",
  purpleMid: "#4C1D95",
  purpleBg:  "#F5F3FF",
  blue:      "#1D4ED8",
  amber:     "#B45309",
  shadow:    "0 2px 16px rgba(11,31,75,0.07)",
  shadowMd:  "0 8px 32px rgba(11,31,75,0.11)",
  shadowLg:  "0 20px 60px rgba(11,31,75,0.16)",
};

const fmt = n => "TSh " + Number(n).toLocaleString();

// ─── SVG Icons ─────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    arrowLeft:    <><line x1="19" y1="12" x2="5" y2="12" {...s}/><polyline points="12 19 5 12 12 5" {...s}/></>,
    mic:          <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" {...s}/><path d="M19 10v2a7 7 0 0 1-14 0v-2" {...s}/><line x1="12" y1="19" x2="12" y2="23" {...s}/><line x1="8" y1="23" x2="16" y2="23" {...s}/></>,
    send:         <><line x1="22" y1="2" x2="11" y2="13" {...s}/><polygon points="22 2 15 22 11 13 2 9 22 2" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    grid:         <><rect x="3" y="3" width="7" height="7" {...s}/><rect x="14" y="3" width="7" height="7" {...s}/><rect x="14" y="14" width="7" height="7" {...s}/><rect x="3" y="14" width="7" height="7" {...s}/></>,
    camera:       <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    trendingUp:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav (Business Hub) ─────────────────────────────────
function BottomNav({ active = "home" }) {
  const items = [
    { id:"home",      icon:"home",      label:"Dashboard" },
    { id:"inventory", icon:"grid",      label:"Inventory" },
    { id:"scan",      icon:"camera",    label:""          },
    { id:"reports",   icon:"barChart",  label:"Reports"   },
    { id:"profile",   icon:"user",      label:"Profile"   },
  ];
  return (
    <div style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:430,
      background:T.white, borderTop:`1px solid ${T.border}`,
      display:"flex", alignItems:"center", justifyContent:"space-around",
      padding:"8px 0 20px", zIndex:200,
      boxShadow:"0 -4px 24px rgba(11,31,75,0.08)",
    }}>
      {items.map(item => {
        const isCenter = item.id === "scan";
        const isActive = item.id === active;
        if (isCenter) return (
          <div key={item.id} style={{
            width:54, height:54, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 6px 20px ${T.gold}66`, cursor:"pointer",
            marginTop:-22, border:`3px solid ${T.white}`,
          }}>
            <Icon name="camera" size={22} color="#fff"/>
          </div>
        );
        return (
          <div key={item.id} style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            gap:3, cursor:"pointer", minWidth:44, padding:"4px 0",
          }}>
            <Icon name={item.icon} size={20} color={isActive ? T.navy : T.textMute}/>
            <span style={{ fontSize:10, fontWeight:isActive?800:500,
              color:isActive?T.navy:T.textMute }}>{item.label}</span>
            {isActive && <div style={{ width:4, height:4, borderRadius:"50%", background:T.gold }}/>}
          </div>
        );
      })}
    </div>
  );
}

const QUICK_PROMPTS = [
  "How much inventory do I have?",
  "What sold best this week?",
  "Which products are running low?",
  "How's my cash flow looking?",
  "What should I focus on today?",
  "Suggest a pricing strategy",
];

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — BUSINESS CONTEXT
// The AI Coach needs live business data to answer accurately.
// Replace with: supabase.from('businesses')
//   .select('*,inventory_items(*),ledger_entries(*),daily_cashflow(*)')
//   .eq('id', businessId).single()
// This context object is passed into the Claude system prompt below.
// ============================================================
const MOCK_BUSINESS_CONTEXT = {
  name: "Tech Master Store",
  inventory: { totalItems: 181, lowStock: ["Coca Cola 500ml", "Cooking Oil 5L"] },
  cashflow:  { netThisMonth: 650000, burnRate: 1650000 },
  topSeller: "Coca Cola 500ml",
};

// ============================================================
// 🧱 MAIN COMPONENT — AIBusinessCoach
// ============================================================
export default function App({
  businessContext = MOCK_BUSINESS_CONTEXT,

  // 🧭 NAVIGATE
  onBack     = () => {},   // → BH-1 Dashboard
  onNavigate = () => {},   // → central navigate(screen), e.g. inventory/cashflow
}) {
  const [messages, setMessages] = useState([
    { role:"ai", text:`Habari! 🐼 I'm your Panda AI Business Coach for ${businessContext.name}. Ask me anything about your inventory, sales, or cash flow — or tap the mic to talk to me.` }
  ]);
  const [input,      setInput]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [listening,  setListening]  = useState(false);

  // 🤖 AI — Send message to Claude via Supabase Edge Function
  // 🔐 SECURITY — Anthropic API key lives ONLY in the Edge Function
  const sendMessage = async (textOverride) => {
    const userMsg = (textOverride || input).trim();
    if (!userMsg) return;
    setInput("");
    setMessages(m => [...m, { role:"user", text:userMsg }]);
    setLoading(true);

    // 🔌 BACKEND — replace with:
    // const res = await supabase.functions.invoke('ai-business-coach', {
    //   body: { message: userMsg, business_id: businessId, context: businessContext }
    // })
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:300,
          system:`You are Panda AI, a business coach for ${businessContext.name},
          a small business in Tanzania using Panda Finance.
          Current data: ${businessContext.inventory.totalItems} items in stock,
          low stock on: ${businessContext.inventory.lowStock.join(", ")}.
          This month's net cash flow: TSh ${businessContext.cashflow.netThisMonth.toLocaleString()},
          monthly burn rate: TSh ${businessContext.cashflow.burnRate.toLocaleString()}.
          Top seller: ${businessContext.topSeller}.
          Give specific, actionable advice in 2-3 sentences. Be warm and
          practical, use Swahili words naturally, focus on Tanzania SME context.`,
          messages:[{ role:"user", content:userMsg }],
        }),
      });
      const data  = await res.json();
      const reply = data.content?.[0]?.text || "Samahani, let me think about that differently. Could you ask again?";
      setMessages(m => [...m, { role:"ai", text:reply }]);
    } catch {
      setMessages(m => [...m, {
        role:"ai",
        text:"Samahani! Connection hiccup. Quick tip while I reconnect: check your low stock items in Inventory — that's usually the highest priority. 📦"
      }]);
    }
    setLoading(false);
  };

  // 🔌 BACKEND — Voice input via device speech-to-text
  // Real implementation: Web Speech API (SpeechRecognition) or a
  // Supabase Edge Function wrapping a speech-to-text provider.
  // This toggle simulates listening state for the UI.
  const toggleVoice = () => {
    setListening(l => !l);
    if (!listening) {
      setTimeout(() => {
        setListening(false);
        sendMessage("How much inventory do I have?");
      }, 1800);
    }
  };

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", display:"flex", flexDirection:"column",
      height:"100vh",
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes micPulse { 0%{box-shadow:0 0 0 0 rgba(192,57,43,0.5)} 70%{box-shadow:0 0 0 18px rgba(192,57,43,0)} 100%{box-shadow:0 0 0 0 rgba(192,57,43,0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input { font-family:inherit; }
        input::placeholder { color:${T.textMute}; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        background:`linear-gradient(135deg,#3B1FA3,#6D28D9)`,
        padding:"52px 20px 18px", position:"relative", overflow:"hidden",
        flexShrink:0,
      }}>
        <div style={{ position:"absolute", inset:0, opacity:0.06,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"16px 16px" }}/>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", position:"relative" }}>
          <button onClick={onBack} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.15)",
            border:"1px solid rgba(255,255,255,0.25)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="arrowLeft" size={18} color="#fff"/>
          </button>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ width:34, height:34, borderRadius:10,
              background:"rgba(255,255,255,0.15)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16 }}>🐼</div>
            <div>
              <div style={{ fontSize:13, fontWeight:900, color:"#fff" }}>
                Panda AI Business Coach
              </div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)" }}>
                {businessContext.name} · Powered by Claude
              </div>
            </div>
          </div>
          <div style={{ width:40 }}/>
        </div>
      </div>

      {/* ── CHAT MESSAGES ── */}
      <div style={{ flex:1, overflowY:"auto", padding:"18px 20px" }}>
        {messages.map((msg,i) => (
          <div key={i} style={{ display:"flex",
            justifyContent:msg.role==="user" ? "flex-end" : "flex-start",
            marginBottom:14, animation:"fadeUp 0.2s ease" }}>
            {msg.role === "ai" && (
              <div style={{ width:30, height:30, borderRadius:9, flexShrink:0,
                background:T.purpleBg, marginRight:8, alignSelf:"flex-end",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:15 }}>🐼</div>
            )}
            <div style={{
              maxWidth:"78%", padding:"12px 15px",
              borderRadius:msg.role==="user"
                ? "18px 6px 18px 18px"
                : "6px 18px 18px 18px",
              background:msg.role==="user"
                ? `linear-gradient(135deg,${T.navy},${T.navyMid})`
                : T.card,
              color:msg.role==="user" ? "#fff" : T.textMain,
              fontSize:13, lineHeight:1.65,
              border:msg.role==="ai" ? `1px solid ${T.border}` : "none",
              boxShadow:T.shadow,
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:15 }}>🐼</div>
            <div style={{ background:T.card, border:`1px solid ${T.border}`,
              borderRadius:"6px 18px 18px 18px", padding:"12px 16px",
              display:"flex", gap:4 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width:6, height:6, borderRadius:"50%",
                  background:T.purple, opacity:0.5,
                  animation:`pulse 1.2s ${i*0.2}s infinite` }}/>
              ))}
            </div>
          </div>
        )}

        {/* Quick prompts — only show early in conversation */}
        {messages.length <= 1 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:6 }}>
            {QUICK_PROMPTS.map(p => (
              <button key={p} onClick={() => sendMessage(p)} style={{
                padding:"9px 14px", borderRadius:99, background:T.card,
                border:`1px solid ${T.border}`, fontSize:11.5, fontWeight:700,
                color:T.textMid, boxShadow:T.shadow }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── VOICE LISTENING OVERLAY ── */}
      {listening && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.85)", backdropFilter:"blur(10px)",
          display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", maxWidth:430, margin:"0 auto" }}>
          <div style={{ width:100, height:100, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.red},#8E2A1E)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            animation:"micPulse 1.5s infinite", marginBottom:24 }}>
            <Icon name="mic" size={40} color="#fff"/>
          </div>
          <div style={{ fontSize:16, fontWeight:800, color:"#fff",
            marginBottom:8 }}>Listening...</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)",
            marginBottom:28 }}>Ask me anything about your business</div>
          <button onClick={() => setListening(false)} style={{
            width:44, height:44, borderRadius:"50%",
            background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="x" size={18} color="#fff"/>
          </button>
        </div>
      )}

      {/* ── INPUT BAR ── */}
      <div style={{ padding:"12px 20px 20px", borderTop:`1px solid ${T.border}`,
        background:T.white, flexShrink:0,
        display:"flex", gap:10, alignItems:"center" }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && sendMessage()}
          placeholder="Ask your AI coach anything..."
          style={{ flex:1, background:T.navyLight, border:`1px solid ${T.border}`,
            borderRadius:14, padding:"12px 16px", fontSize:13,
            color:T.textMain, outline:"none" }}/>
        <button onClick={toggleVoice} style={{
          width:44, height:44, borderRadius:14, flexShrink:0,
          background:listening ? T.red : T.navyLight,
          border:listening ? "none" : `1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="mic" size={18} color={listening ? "#fff" : T.textMute}/>
        </button>
        <button onClick={() => sendMessage()} style={{
          width:44, height:44, borderRadius:14, flexShrink:0,
          background:input.trim()
            ? `linear-gradient(135deg,${T.purple},${T.purpleMid})`
            : T.navyLight,
          border:input.trim() ? "none" : `1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:input.trim() ? `0 4px 14px ${T.purple}44` : "none" }}>
          <Icon name="send" size={17} color={input.trim() ? "#fff" : T.textMute}/>
        </button>
      </div>

      <div style={{ paddingBottom: 90 }}/>
      <BottomNav active="home"/>
    </div>
  );
}

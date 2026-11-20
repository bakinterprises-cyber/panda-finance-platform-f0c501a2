import { useState } from "react";

// ============================================================
// 🧱 BRICK 13 — PANDA TRUST SCORE SYSTEM
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 🤖  AI hooks marked with:            // 🤖 AI
// 📦  Assembly: export TrustScoreSystem from this file
//     Props: { sellerId, currentUser, onBack, onNavigate }
// ============================================================

// ─── Design Tokens ────────────────────────────────────────────
const T = {
  navy:      "#0B1F4B",
  navyMid:   "#1A3A6E",
  navyLight: "#EEF2FF",
  gold:      "#C9960A",
  goldMid:   "#F5C842",
  goldLight: "#FFF8E1",
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
  redBg:     "#FDECEA",
  purple:    "#6D28D9",
  purpleBg:  "#F5F3FF",
  blue:      "#1D4ED8",
  blueBg:    "#EFF6FF",
  amber:     "#B45309",
  amberBg:   "#FEF3C7",
  bronze:    "#CD7F32",
  bronzeBg:  "#FDF3E7",
  silver:    "#A8A9AD",
  silverBg:  "#F5F5F5",
  shadow:    "0 2px 16px rgba(11,31,75,0.07)",
  shadowMd:  "0 8px 32px rgba(11,31,75,0.11)",
  shadowLg:  "0 20px 60px rgba(11,31,75,0.16)",
};

// ─── SVG Icons ─────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    arrowLeft:    <><line x1="19" y1="12" x2="5" y2="12" {...s}/><polyline points="12 19 5 12 12 5" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    activity:     <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" {...s}/></>,
    alertCircle:  <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    lightbulb:    <><path d="M9 18h6" {...s}/><path d="M10 22h4" {...s}/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronUp:    <><polyline points="18 15 12 9 6 15" {...s}/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    dollarSign:   <><line x1="12" y1="1" x2="12" y2="23" {...s}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...s}/></>,
    trending:     <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    share:        <><circle cx="18" cy="5" r="3" {...s}/><circle cx="6" cy="12" r="3" {...s}/><circle cx="18" cy="19" r="3" {...s}/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" {...s}/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav ───────────────────────────────────────────────
function BottomNav({ active = "profile" }) {
  const items = [
    { id:"home",     icon:"home",    label:"Home"     },
    { id:"discover", icon:"compass", label:"Discover" },
    { id:"create",   icon:"plus",    label:""         },
    { id:"messages", icon:"message", label:"Messages" },
    { id:"wallet",   icon:"wallet",  label:"Wallet"   },
    { id:"profile",  icon:"user",    label:"Profile"  },
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
        const isCenter = item.id === "create";
        const isActive = item.id === active;
        if (isCenter) return (
          <div key={item.id} style={{
            width:52, height:52, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 6px 20px ${T.navy}55`, cursor:"pointer",
            marginTop:-20, border:`3px solid ${T.white}`,
          }}>
            <Icon name="plus" size={22} color="#fff"/>
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

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — TRUST SCORE DATA
// Replace with: supabase.from('trust_scores')
//   .select('*').eq('seller_id', sellerId).single()
// Score calculated nightly via Edge Function cron:
// supabase.functions.invoke('calculate-trust-score', { seller_id })
// ============================================================
const MOCK_SCORE = {
  current:     87,
  previous:    82,
  tier:        "gold",   // new | bronze | silver | gold | elite
  breakdown: [
    { id:"identity",  label:"Identity Verified",  score:20, max:20, color:T.blue,   icon:"shield"      },
    { id:"delivery",  label:"Delivery Performance",score:24, max:25, color:T.green,  icon:"truck"       },
    { id:"reviews",   label:"Review Score",        score:18, max:20, color:T.gold,   icon:"star"        },
    { id:"response",  label:"Response Rate",       score:13, max:15, color:T.purple, icon:"message"     },
    { id:"disputes",  label:"Dispute History",     score:8,  max:10, color:T.red,    icon:"alertCircle" },
    { id:"activity",  label:"Activity Score",      score:4,  max:10, color:T.amber,  icon:"activity"    },
  ],
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — SCORE HISTORY
// Replace with: supabase.from('trust_score_history')
//   .select('score, date').eq('seller_id', sellerId)
//   .order('date', { ascending: true }).limit(12)
// ============================================================
const MOCK_HISTORY = [
  { month:"Jan", score:62 }, { month:"Feb", score:65 }, { month:"Mar", score:68 },
  { month:"Apr", score:71 }, { month:"May", score:74 }, { month:"Jun", score:76 },
  { month:"Jul", score:78 }, { month:"Aug", score:80 }, { month:"Sep", score:82 },
  { month:"Oct", score:84 }, { month:"Nov", score:82 }, { month:"Dec", score:87 },
];

// Tier definitions
const TIERS = [
  { id:"new",    label:"New Seller", range:"0–39",   color:T.textMute, bg:T.navyLight, icon:"user"  },
  { id:"bronze", label:"Bronze",      range:"40–59",  color:T.bronze,   bg:T.bronzeBg,  icon:"shield"},
  { id:"silver", label:"Silver",      range:"60–79",  color:T.silver,   bg:T.silverBg,  icon:"shield"},
  { id:"gold",   label:"Gold",        range:"80–94",  color:T.gold,     bg:T.goldLight, icon:"award" },
  { id:"elite",  label:"Elite",       range:"95–100", color:T.purple,   bg:T.purpleBg,  icon:"sparkle"},
];

// What score unlocks
const TIER_BENEFITS = {
  new:    ["List up to 10 products", "Basic marketplace access"],
  bronze: ["List up to 50 products", "Bronze Trust Badge", "Standard search ranking"],
  silver: ["Unlimited products", "Silver Trust Badge", "Priority search ranking", "Lower escrow review time"],
  gold:   ["Gold Verified Badge", "Top search placement", "Loan eligibility unlocked", "Featured seller opportunities"],
  elite:  ["Elite Badge", "Homepage featured placement", "Dedicated support", "Panda Capital investment access", "Lowest transaction fees"],
};

// ============================================================
// 🤖 AI SWAP POINT — IMPROVEMENT RECOMMENDATIONS
// Replace with: supabase.functions.invoke('ai-trust-recommendations', {
//   body: { seller_id: sellerId, breakdown: scoreBreakdown }
// })
// ============================================================
const AI_RECOMMENDATIONS = [
  {
    id:1, icon:"activity", color:T.amber, priority:"high",
    title:"Boost your Activity Score (+6 points available)",
    text:"You're at 4/10 on activity. Post product updates weekly and go live at least twice a month to reach full marks.",
  },
  {
    id:2, icon:"message", color:T.purple, priority:"medium",
    title:"Improve Response Rate (+2 points available)",
    text:"Your response rate is 87%. Replying within 1 hour to all buyer messages would push this to 95%+.",
  },
  {
    id:3, icon:"star", color:T.gold, priority:"medium",
    title:"Encourage more reviews (+2 points available)",
    text:"You have 234 reviews. Asking satisfied buyers to leave reviews after delivery could add 2 more points.",
  },
];

// What score impacts
const SCORE_IMPACTS = [
  { icon:"trending",   label:"Search Ranking",     desc:"Higher score = appear first in search results", color:T.blue   },
  { icon:"dollarSign", label:"Loan Eligibility",    desc:"80+ unlocks Panda Capital business loans",       color:T.green  },
  { icon:"lock",       label:"Escrow Fees",         desc:"Higher tiers get lower transaction fees",        color:T.gold   },
  { icon:"award",      label:"Featured Placement",  desc:"Elite sellers get homepage spotlight",           color:T.purple },
];

// ============================================================
// 🧱 MAIN COMPONENT — TrustScoreSystem
// ============================================================
export default function App({
  // 👤 AUTH — replace with real seller from supabase.auth.getUser()
  seller       = { name:"Tech Master Store", initials:"TM", color:"#1D4ED8" },
  scoreData    = MOCK_SCORE,
  history      = MOCK_HISTORY,
  recommendations = AI_RECOMMENDATIONS,

  // 🧭 NAVIGATE
  onBack          = () => {},   // → Brick 5 Command Center
  onVerification  = () => {},   // → Brick 7 Business Verification
  onShare         = () => {},   // → Share Trust Score badge
}) {
  const [expandedBreakdown, setExpandedBreakdown] = useState(null);
  const [showAllTiers,      setShowAllTiers]      = useState(false);

  const change       = scoreData.current - scoreData.previous;
  const currentTier  = TIERS.find(t => t.id === scoreData.tier);
  const nextTierIdx  = TIERS.findIndex(t => t.id === scoreData.tier) + 1;
  const nextTier     = TIERS[nextTierIdx];
  const totalScore   = scoreData.breakdown.reduce((s,b) => s+b.score, 0);
  const totalMax     = scoreData.breakdown.reduce((s,b) => s+b.max, 0);

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounceIn { 0%{transform:scale(0.85)} 60%{transform:scale(1.03)} 100%{transform:scale(1)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.5} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{
        background:"rgba(255,255,255,0.96)", backdropFilter:"blur(16px)",
        padding:"14px 20px", position:"sticky", top:0, zIndex:100,
        borderBottom:`1px solid ${T.border}`,
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <button onClick={onBack} style={{
          width:40, height:40, borderRadius:12, background:T.navyLight,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="arrowLeft" size={18} color={T.navy}/>
        </button>
        <div style={{ fontSize:15, fontWeight:800, color:T.textMain }}>
          Panda Trust Score
        </div>
        <button onClick={onShare} style={{
          width:40, height:40, borderRadius:12, background:T.navyLight,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="share" size={17} color={T.navy}/>
        </button>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── HERO SCORE CARD ── */}
        <div style={{
          background:`linear-gradient(135deg,${T.navy} 0%,${T.navyMid} 100%)`,
          borderRadius:26, padding:"28px 24px", marginBottom:16,
          position:"relative", overflow:"hidden", textAlign:"center",
        }}>
          <div style={{ position:"absolute", inset:0, opacity:0.05,
            backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize:"18px 18px" }}/>
          <div style={{ position:"absolute", top:-40, right:-40,
            width:160, height:160, borderRadius:"50%",
            background:"rgba(255,255,255,0.04)" }}/>

          <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
            fontWeight:700, letterSpacing:1, marginBottom:16, position:"relative" }}>
            {seller.name.toUpperCase()}
          </div>

          {/* Big score ring */}
          <div style={{ width:160, height:160, borderRadius:"50%", margin:"0 auto 16px",
            background:`conic-gradient(${currentTier.color} ${scoreData.current * 3.6}deg, rgba(255,255,255,0.12) 0deg)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            position:"relative", animation:"bounceIn 0.5s ease" }}>
            <div style={{ width:136, height:136, borderRadius:"50%",
              background:"rgba(11,31,75,0.9)",
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center" }}>
              <div style={{ fontSize:48, fontWeight:900, color:"#fff",
                lineHeight:1, fontFamily:"monospace", letterSpacing:-1 }}>
                {scoreData.current}
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)",
                fontWeight:700, marginTop:4 }}>OUT OF 100</div>
            </div>
          </div>

          {/* Tier badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:7,
            background:currentTier.color+"33",
            border:`1.5px solid ${currentTier.color}66`,
            borderRadius:12, padding:"7px 16px", marginBottom:10,
            position:"relative" }}>
            <Icon name={currentTier.icon} size={15} color={currentTier.color}/>
            <span style={{ fontSize:13, fontWeight:900, color:"#fff" }}>
              {currentTier.label} Seller
            </span>
          </div>

          {/* Change indicator */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
            gap:6, position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:4,
              background:change>=0?"rgba(10,123,75,0.25)":"rgba(192,57,43,0.25)",
              borderRadius:8, padding:"3px 10px" }}>
              <Icon name="trending" size={11}
                color={change>=0 ? "#4ADE80" : "#FCA5A5"}/>
              <span style={{ fontSize:11, fontWeight:800,
                color:change>=0 ? "#4ADE80" : "#FCA5A5" }}>
                {change>=0?"+":""}{change} this month
              </span>
            </div>
          </div>
        </div>

        {/* ── PROGRESS TO NEXT TIER ── */}
        {nextTier && (
          <div style={{ background:T.card, borderRadius:20, padding:"18px 20px",
            boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Icon name={nextTier.icon} size={16} color={nextTier.color}/>
                <span style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                  Progress to {nextTier.label}
                </span>
              </div>
              <span style={{ fontSize:12, fontWeight:900, color:nextTier.color }}>
                {scoreData.current}/{nextTier.range.split("–")[0]}
              </span>
            </div>
            <div style={{ height:10, background:T.border, borderRadius:99,
              overflow:"hidden", marginBottom:8 }}>
              <div style={{ height:"100%",
                width:`${Math.min(100,(scoreData.current/parseInt(nextTier.range.split("–")[0]))*100)}%`,
                background:`linear-gradient(90deg,${currentTier.color},${nextTier.color})`,
                borderRadius:99, transition:"width 0.8s ease" }}/>
            </div>
            <div style={{ fontSize:11, color:T.textMute }}>
              {parseInt(nextTier.range.split("–")[0]) - scoreData.current} more points to unlock {nextTier.label} tier benefits
            </div>
          </div>
        )}

        {/* ── SCORE BREAKDOWN ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:16, fontWeight:900, color:T.textMain,
              letterSpacing:-0.3 }}>Score Breakdown</span>
            <span style={{ fontSize:12, fontWeight:800, color:T.green }}>
              {totalScore}/{totalMax} pts
            </span>
          </div>
          <div style={{ background:T.card, borderRadius:22, padding:"6px",
            border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
            {scoreData.breakdown.map((item, i) => {
              const pct       = Math.round((item.score/item.max)*100);
              const expanded  = expandedBreakdown === item.id;
              return (
                <div key={item.id} style={{
                  borderBottom:i<scoreData.breakdown.length-1?`1px solid ${T.border}`:"none",
                }}>
                  <div onClick={() => setExpandedBreakdown(expanded?null:item.id)}
                    style={{ padding:"14px 14px", cursor:"pointer" }}>
                    <div style={{ display:"flex", gap:12, alignItems:"center",
                      marginBottom:8 }}>
                      <div style={{ width:36, height:36, borderRadius:10, flexShrink:0,
                        background:item.color+"14",
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name={item.icon} size={16} color={item.color}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                          {item.label}
                        </div>
                      </div>
                      <span style={{ fontSize:13, fontWeight:900, color:item.color,
                        fontFamily:"monospace" }}>{item.score}/{item.max}</span>
                      <Icon name={expanded ? "chevronUp" : "chevronDown"}
                        size={14} color={T.textMute}/>
                    </div>
                    <div style={{ height:6, background:T.border, borderRadius:99,
                      overflow:"hidden", marginLeft:48 }}>
                      <div style={{ height:"100%", width:`${pct}%`,
                        background:`linear-gradient(90deg,${item.color},${item.color}99)`,
                        borderRadius:99, transition:"width 0.6s ease" }}/>
                    </div>
                  </div>
                  {expanded && (
                    <div style={{ padding:"0 14px 14px 62px",
                      animation:"fadeUp 0.2s ease" }}>
                      <div style={{ fontSize:11, color:T.textMute, lineHeight:1.6 }}>
                        {item.id==="identity"  && "NIDA, BRELA, TIN verification all completed and confirmed."}
                        {item.id==="delivery"  && "96% of your orders delivered on time over the last 90 days."}
                        {item.id==="reviews"   && "4.8/5 average rating across 234 reviews."}
                        {item.id==="response"  && "87% of buyer messages answered within 2 hours."}
                        {item.id==="disputes"  && "Only 1 dispute in the last 90 days, resolved fairly."}
                        {item.id==="activity"  && "Low posting frequency — only 2 updates in the last 30 days."}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── AI RECOMMENDATIONS ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <Icon name="sparkle" size={16} color={T.purple}/>
            <span style={{ fontSize:16, fontWeight:900, color:T.textMain,
              letterSpacing:-0.3 }}>How to Improve</span>
          </div>
          {recommendations.map((rec, i) => (
            <div key={rec.id} style={{ background:T.card, borderRadius:20,
              padding:"16px 18px", marginBottom:10,
              border:`1px solid ${rec.color}22`, boxShadow:T.shadow,
              animation:`fadeUp 0.25s ease ${i*0.07}s both` }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ width:38, height:38, borderRadius:11, flexShrink:0,
                  background:rec.color+"14",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={rec.icon} size={17} color={rec.color}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                    marginBottom:5, lineHeight:1.4 }}>{rec.title}</div>
                  <div style={{ fontSize:11, color:T.textMute, lineHeight:1.6 }}>
                    {rec.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SCORE HISTORY CHART ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
            marginBottom:16 }}>Score History — 12 Months</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:90 }}>
            {history.map((h, i) => {
              const isLast = i === history.length-1;
              const heightPct = Math.round((h.score/100)*100);
              return (
                <div key={h.month} style={{ flex:1,
                  display:"flex", flexDirection:"column",
                  alignItems:"center", gap:4 }}>
                  <div style={{ width:"100%", height:`${heightPct*0.7}px`,
                    borderRadius:"4px 4px 0 0",
                    background:isLast
                      ? `linear-gradient(180deg,${T.gold},#A07008)`
                      : `linear-gradient(180deg,${T.navy}88,${T.navy}44)`,
                    transition:"height 0.6s ease" }}/>
                  <span style={{ fontSize:8, fontWeight:isLast?900:600,
                    color:isLast?T.gold:T.textMute }}>{h.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ALL TIERS ── */}
        <div style={{ marginBottom:16 }}>
          <div onClick={() => setShowAllTiers(s => !s)}
            style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:12, cursor:"pointer" }}>
            <span style={{ fontSize:16, fontWeight:900, color:T.textMain,
              letterSpacing:-0.3 }}>Tier System</span>
            <Icon name={showAllTiers ? "chevronUp" : "chevronDown"}
              size={16} color={T.textMute}/>
          </div>
          {showAllTiers && (
            <div style={{ animation:"fadeUp 0.25s ease" }}>
              {TIERS.map(tier => {
                const isCurrent = tier.id === scoreData.tier;
                return (
                  <div key={tier.id} style={{ background:isCurrent?tier.bg:T.card,
                    borderRadius:18, padding:"14px 16px", marginBottom:10,
                    border:`1.5px solid ${isCurrent?tier.color+"55":T.border}`,
                    boxShadow:T.shadow }}>
                    <div style={{ display:"flex", gap:12, alignItems:"center",
                      marginBottom:isCurrent?10:0 }}>
                      <div style={{ width:38, height:38, borderRadius:11, flexShrink:0,
                        background:tier.color+"18",
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name={tier.icon} size={17} color={tier.color}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontSize:13, fontWeight:900,
                            color:tier.color }}>{tier.label}</span>
                          {isCurrent && (
                            <div style={{ background:tier.color, borderRadius:7,
                              padding:"1px 8px", fontSize:9,
                              fontWeight:900, color:"#fff" }}>YOU ARE HERE</div>
                          )}
                        </div>
                        <div style={{ fontSize:11, color:T.textMute }}>
                          Score range: {tier.range}
                        </div>
                      </div>
                    </div>
                    {isCurrent && (
                      <div style={{ paddingLeft:50 }}>
                        {TIER_BENEFITS[tier.id].map(b => (
                          <div key={b} style={{ display:"flex", gap:7,
                            alignItems:"center", marginBottom:5 }}>
                            <Icon name="check" size={11} color={tier.color}/>
                            <span style={{ fontSize:11, color:T.textMid,
                              fontWeight:600 }}>{b}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── SCORE IMPACT ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:16, fontWeight:900, color:T.textMain,
            letterSpacing:-0.3, marginBottom:12 }}>What Your Score Unlocks</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {SCORE_IMPACTS.map(item => (
              <div key={item.label} style={{ background:T.card, borderRadius:18,
                padding:"14px", border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
                <div style={{ width:32, height:32, borderRadius:9,
                  background:item.color+"14",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  marginBottom:9 }}>
                  <Icon name={item.icon} size={15} color={item.color}/>
                </div>
                <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                  marginBottom:4 }}>{item.label}</div>
                <div style={{ fontSize:10, color:T.textMute, lineHeight:1.5 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── VERIFICATION CTA ── */}
        <button onClick={onVerification} style={{
          width:"100%", padding:"16px 0", borderRadius:18,
          background:`linear-gradient(135deg,${T.gold},#A07008)`,
          border:"none", color:"#fff", fontSize:14, fontWeight:900,
          cursor:"pointer", display:"flex", alignItems:"center",
          justifyContent:"center", gap:8, marginBottom:16,
          boxShadow:`0 6px 20px ${T.gold}44`,
        }}>
          <Icon name="shield" size={18} color="#fff"/>
          {/* 🧭 NAVIGATE → Brick 7 Business Verification */}
          Complete Verification to Boost Score
        </button>

      </div>

      <BottomNav active="profile"/>
    </div>
  );
}

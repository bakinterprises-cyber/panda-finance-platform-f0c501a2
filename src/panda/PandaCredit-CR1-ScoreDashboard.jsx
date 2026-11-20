import { useState } from "react";

// ============================================================
// 🧱 CR-1 — PANDA SCORE DASHBOARD
// 🏗️  Part of: Panda Credit (Module 4)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 🤖  AI hooks marked with:            // 🤖 AI
// 📦  Assembly: export PandaScoreDashboard from this file
//     Props: { currentUser, onBack, onNavigate }
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
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    trendingUp:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    lightbulb:    <><path d="M9 18h6" {...s}/><path d="M10 22h4" {...s}/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronUp:    <><polyline points="18 15 12 9 6 15" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    creditCard:   <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" {...s}/><line x1="1" y1="10" x2="23" y2="10" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav (Panda Credit) ─────────────────────────────────
function BottomNav({ active = "score" }) {
  const items = [
    { id:"home",   icon:"home",       label:"Home"    },
    { id:"loans",  icon:"package",    label:"Loans"   },
    { id:"score",  icon:"creditCard", label:"Score"   },
    { id:"apply",  icon:"fileText",   label:"Apply"   },
    { id:"profile",icon:"user",       label:"Profile" },
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
        const isActive = item.id === active;
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
// 🔌 BACKEND SWAP POINT #1 — PANDA SCORE DATA
// Replace with: supabase.from('panda_scores')
//   .select('*').eq('user_id', currentUser.id).single()
// Score calculated via nightly Edge Function cron, reading from:
// wallet transaction history, marketplace trust_score, loan repayment
// history, bookkeeping cash flow (if business owner)
// ============================================================
const MOCK_SCORE = {
  current:   742,
  previous:  698,
  max:       1000,
  tier:      "good",   // building | fair | good | very_good | excellent
  breakdown: [
    { id:"wallet_activity",  label:"Wallet Activity",     score:180, max:200, color:T.blue,   icon:"wallet"     },
    { id:"repayment_history",label:"Repayment History",   score:220, max:250, color:T.green,  icon:"check"      },
    { id:"business_health",  label:"Business Health",     score:150, max:200, color:T.purple,  icon:"trendingUp" },
    { id:"marketplace_trust",label:"Marketplace Trust",   score:142, max:150, color:T.gold,    icon:"shield"     },
    { id:"savings_behavior", label:"Savings Behavior",    score:50,  max:100, color:T.amber,   icon:"package"    },
    { id:"account_age",      label:"Account Age",         score:0,   max:100, color:T.textMute,icon:"clock"      },
  ],
};

// Tier definitions
const TIERS = [
  { id:"building",   label:"Building",   range:"300–579",  color:T.red,     bg:T.redBg    },
  { id:"fair",        label:"Fair",        range:"580–669",  color:T.amber,   bg:T.amberBg  },
  { id:"good",         label:"Good",         range:"670–739",  color:T.blue,    bg:T.blueBg   },
  { id:"very_good",   label:"Very Good",   range:"740–819",  color:T.green,   bg:T.greenBg  },
  { id:"excellent",   label:"Excellent",   range:"820–1000", color:T.purple,  bg:T.purpleBg },
];

const TIER_UNLOCKS = {
  building:   ["Basic Panda Wallet features", "No loan access yet"],
  fair:       ["Small microloans up to TSh 200,000", "Higher escrow limits"],
  good:        ["Loans up to TSh 1,000,000", "Lower interest rates", "Faster approval"],
  very_good:  ["Loans up to TSh 5,000,000", "Priority lender matching", "Reduced fees"],
  excellent:  ["Loans up to TSh 20,000,000", "Best interest rates in Tanzania", "Instant approval", "Investment opportunities"],
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — SCORE HISTORY
// Replace with: supabase.from('panda_score_history')
//   .select('score, date').eq('user_id', currentUser.id)
//   .order('date', { ascending: true }).limit(6)
// ============================================================
const MOCK_HISTORY = [
  { month:"Feb", score:610 }, { month:"Mar", score:645 },
  { month:"Apr", score:668 }, { month:"May", score:695 },
  { month:"Jun", score:698 }, { month:"Jul", score:742 },
];

// ============================================================
// 🤖 AI SWAP POINT — SCORE IMPROVEMENT RECOMMENDATIONS
// Replace with: supabase.functions.invoke('ai-score-recommendations', {
//   body: { user_id: currentUser.id, breakdown: scoreBreakdown }
// })
// ============================================================
const AI_RECOMMENDATIONS = [
  {
    id:1, icon:"clock", color:T.textMute, priority:"high",
    title:"Account age is your biggest opportunity (+100 points available)",
    text:"Your Panda account is less than 6 months old. This score component grows automatically over time — no action needed, just keep using Panda Wallet regularly.",
  },
  {
    id:2, icon:"package", color:T.amber, priority:"medium",
    title:"Build a savings habit (+50 points available)",
    text:"You're at 50/100 on savings behavior. Setting aside even TSh 20,000/week into Panda Savings would steadily grow this component.",
  },
  {
    id:3, icon:"trendingUp", color:T.purple, priority:"medium",
    title:"Business health has room to grow (+50 points available)",
    text:"Keep your Business Hub cash flow positive for 3 more months to maximize this component.",
  },
];

// What score impacts
const SCORE_IMPACTS = [
  { icon:"creditCard", label:"Loan Amount",       desc:"Higher score unlocks larger loan limits",         color:T.green  },
  { icon:"trendingUp", label:"Interest Rate",     desc:"670+ scores get preferential rates",              color:T.blue   },
  { icon:"clock",      label:"Approval Speed",    desc:"800+ scores get instant approval",                color:T.purple },
  { icon:"award",      label:"Investment Access", desc:"Excellent tier unlocks Panda Investments",         color:T.gold   },
];

// ============================================================
// 🧱 MAIN COMPONENT — PandaScoreDashboard
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user from supabase.auth.getUser()
  currentUser  = { name:"BAK", initials:"B" },
  scoreData    = MOCK_SCORE,
  history      = MOCK_HISTORY,
  recommendations = AI_RECOMMENDATIONS,

  // 🧭 NAVIGATE
  onBack        = () => {},   // → Panda Credit Home
  onViewLoans   = () => {},   // → CR-2 Loan Marketplace
  onApply       = () => {},   // → CR-3 Loan Application
}) {
  const [expandedBreakdown, setExpandedBreakdown] = useState(null);
  const [showAllTiers,      setShowAllTiers]      = useState(false);

  const change       = scoreData.current - scoreData.previous;
  const currentTier  = TIERS.find(t => t.id === scoreData.tier);
  const nextTierIdx  = TIERS.findIndex(t => t.id === scoreData.tier) + 1;
  const nextTier     = TIERS[nextTierIdx];
  const totalScore   = scoreData.breakdown.reduce((s,b) => s+b.score, 0);
  const totalMax     = scoreData.breakdown.reduce((s,b) => s+b.max, 0);
  const scorePct     = Math.round((scoreData.current/scoreData.max)*100);

  const nextTierMin = nextTier ? parseInt(nextTier.range.split("–")[0]) : null;

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounceIn { 0%{transform:scale(0.85)} 60%{transform:scale(1.03)} 100%{transform:scale(1)} }
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
          Panda Score
        </div>
        <div style={{ width:40 }}/>
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
            {currentUser.name.toUpperCase()}'S PANDA SCORE
          </div>

          {/* Big score ring */}
          <div style={{ width:170, height:170, borderRadius:"50%", margin:"0 auto 16px",
            background:`conic-gradient(${currentTier.color} ${scorePct * 3.6}deg, rgba(255,255,255,0.12) 0deg)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            position:"relative", animation:"bounceIn 0.5s ease" }}>
            <div style={{ width:144, height:144, borderRadius:"50%",
              background:"rgba(11,31,75,0.9)",
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center" }}>
              <div style={{ fontSize:44, fontWeight:900, color:"#fff",
                lineHeight:1, fontFamily:"monospace", letterSpacing:-1 }}>
                {scoreData.current}
              </div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)",
                fontWeight:700, marginTop:4 }}>OUT OF {scoreData.max}</div>
            </div>
          </div>

          {/* Tier badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:7,
            background:currentTier.color+"33",
            border:`1.5px solid ${currentTier.color}66`,
            borderRadius:12, padding:"7px 16px", marginBottom:10,
            position:"relative" }}>
            <Icon name="award" size={15} color={currentTier.color}/>
            <span style={{ fontSize:13, fontWeight:900, color:"#fff" }}>
              {currentTier.label} Standing
            </span>
          </div>

          {/* Change indicator */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
            gap:6, position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:4,
              background:change>=0?"rgba(10,123,75,0.25)":"rgba(192,57,43,0.25)",
              borderRadius:8, padding:"3px 10px" }}>
              <Icon name="trendingUp" size={11}
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
                <Icon name="award" size={16} color={nextTier.color}/>
                <span style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                  Progress to {nextTier.label}
                </span>
              </div>
              <span style={{ fontSize:12, fontWeight:900, color:nextTier.color }}>
                {scoreData.current}/{nextTierMin}
              </span>
            </div>
            <div style={{ height:10, background:T.border, borderRadius:99,
              overflow:"hidden", marginBottom:8 }}>
              <div style={{ height:"100%",
                width:`${Math.min(100,(scoreData.current/nextTierMin)*100)}%`,
                background:`linear-gradient(90deg,${currentTier.color},${nextTier.color})`,
                borderRadius:99, transition:"width 0.8s ease" }}/>
            </div>
            <div style={{ fontSize:11, color:T.textMute }}>
              {nextTierMin - scoreData.current} more points to unlock {nextTier.label} benefits
            </div>
          </div>
        )}

        {/* ── QUICK ACTIONS ── */}
        <div style={{ display:"flex", gap:10, marginBottom:16 }}>
          <button onClick={onViewLoans} style={{
            flex:1, padding:"14px 0", borderRadius:16,
            background:T.card, border:`1px solid ${T.border}`,
            display:"flex", flexDirection:"column", alignItems:"center", gap:6,
            boxShadow:T.shadow }}>
            <Icon name="package" size={18} color={T.navy}/>
            <span style={{ fontSize:11, fontWeight:800, color:T.textMain }}>
              Browse Loans
            </span>
          </button>
          <button onClick={onApply} style={{
            flex:1, padding:"14px 0", borderRadius:16,
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            border:"none",
            display:"flex", flexDirection:"column", alignItems:"center", gap:6,
            boxShadow:`0 4px 16px ${T.gold}44` }}>
            <Icon name="fileText" size={18} color="#fff"/>
            <span style={{ fontSize:11, fontWeight:800, color:"#fff" }}>
              Apply for Loan
            </span>
          </button>
        </div>

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
                        {item.id==="wallet_activity"   && "Based on frequency and consistency of Panda Wallet transactions over the last 12 months."}
                        {item.id==="repayment_history" && "88% of past obligations paid on time. No missed payments in the last 90 days."}
                        {item.id==="business_health"   && "Cash flow trend from your Business Hub — positive net profit 3 of the last 4 months."}
                        {item.id==="marketplace_trust" && "Derived from your Panda Marketplace Trust Score (98/100 as a seller)."}
                        {item.id==="savings_behavior"  && "Frequency and consistency of deposits into Panda Savings."}
                        {item.id==="account_age"       && "How long you've held an active Panda Finance account. Grows automatically over time."}
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
            marginBottom:16 }}>Score History — 6 Months</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:90 }}>
            {history.map((h, i) => {
              const isLast = i === history.length-1;
              const heightPct = Math.round((h.score/scoreData.max)*100);
              return (
                <div key={h.month} style={{ flex:1,
                  display:"flex", flexDirection:"column",
                  alignItems:"center", gap:6 }}>
                  <div style={{ width:"100%", height:`${heightPct*0.85}px`,
                    borderRadius:"4px 4px 0 0",
                    background:isLast
                      ? `linear-gradient(180deg,${T.gold},#A07008)`
                      : `linear-gradient(180deg,${T.navy}88,${T.navy}44)`,
                    transition:"height 0.6s ease" }}/>
                  <span style={{ fontSize:9, fontWeight:isLast?900:600,
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
                        <Icon name="award" size={17} color={tier.color}/>
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
                        {TIER_UNLOCKS[tier.id].map(b => (
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

      </div>

      <BottomNav active="score"/>
    </div>
  );
}

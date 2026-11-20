import { useState } from "react";

// ============================================================
// 🧱 IN-1 — INVESTMENT DASHBOARD
// 🏗️  Part of: Panda Investments (Module 5)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 📦  Assembly: export InvestmentDashboard from this file
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
  teal:      "#0D9488",
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
    trendingUp:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    trendingDown: <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" {...s}/><polyline points="17 18 23 18 23 12" {...s}/></>,
    arrowUp:      <><line x1="12" y1="19" x2="12" y2="5" {...s}/><polyline points="5 12 12 5 19 12" {...s}/></>,
    arrowDown:    <><line x1="12" y1="5" x2="12" y2="19" {...s}/><polyline points="19 12 12 19 5 12" {...s}/></>,
    pieChart:     <><path d="M21.21 15.89A10 10 0 1 1 8 2.83" {...s}/><path d="M22 12A10 10 0 0 0 12 2v10z" {...s}/></>,
    briefcase:    <><rect x="2" y="7" width="20" height="14" rx="2" {...s}/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    dollarSign:   <><line x1="12" y1="1" x2="12" y2="23" {...s}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav (Panda Investments) ─────────────────────────────
function BottomNav({ active = "home" }) {
  const items = [
    { id:"home",     icon:"home",       label:"Portfolio"  },
    { id:"browse",   icon:"briefcase",  label:"Browse"     },
    { id:"raise",    icon:"plus",       label:"Raise"      },
    { id:"score",    icon:"award",      label:"Score"      },
    { id:"profile",  icon:"user",       label:"Profile"    },
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
            <span style={{ fontSize:9.5, fontWeight:isActive?800:500,
              color:isActive?T.navy:T.textMute }}>{item.label}</span>
            {isActive && <div style={{ width:4, height:4, borderRadius:"50%", background:T.gold }}/>}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — PORTFOLIO SUMMARY
// Replace with: supabase.from('investment_portfolios')
//   .select('*').eq('user_id', currentUser.id).single()
// ============================================================
const MOCK_PORTFOLIO = {
  totalInvested:   2400000,
  currentValue:    2688000,
  totalReturns:    288000,
  returnsPct:      12.0,
  eligibleTier:    "very_good",   // ties to Panda Score tier from CR-1
  eligibleToInvest:true,
  maxInvestable:   5000000,
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — ACTIVE INVESTMENT POSITIONS
// Replace with: supabase.from('investments')
//   .select('*,opportunity(*)').eq('investor_id', currentUser.id)
//   .eq('status','active').order('created_at', { ascending: false })
// ============================================================
const MOCK_POSITIONS = [
  {
    id:"POS-001", type:"fixed_return", name:"Panda Capital Fixed Return — 12mo",
    color:T.navy, invested:1000000, currentValue:1085000,
    returnPct:8.5, maturityDate:"Jan 15, 2027", monthsLeft:6,
  },
  {
    id:"POS-002", type:"business_equity", name:"Fatuma Hardware Ltd — Growth Round",
    color:T.purple, invested:800000, currentValue:944000,
    returnPct:18.0, maturityDate:"Ongoing (revenue-share)", monthsLeft:null,
  },
  {
    id:"POS-003", type:"fixed_return", name:"Panda Agri Fund — 6mo",
    color:T.teal, invested:600000, currentValue:659000,
    returnPct:9.8, maturityDate:"Sep 3, 2026", monthsLeft:2,
  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #3 — PORTFOLIO ALLOCATION
// Computed from positions, or cached via:
// supabase.from('investment_portfolios').select('allocation').eq('user_id', ...)
// ============================================================
const ALLOCATION = [
  { label:"Fixed-Return Products", pct:62, color:T.navy   },
  { label:"Business Equity",        pct:31, color:T.purple },
  { label:"Cash (Uninvested)",       pct:7,  color:T.textMute },
];

// ============================================================
// 🤖 AI-STYLE INSIGHT (static for now, same pattern as other dashboards)
// 🔌 BACKEND — supabase.functions.invoke('ai-investment-insights', {...})
// ============================================================
const INSIGHT = {
  title: "Your portfolio is performing well",
  text:  "12% average return this year, above the 9% average for Fixed-Return investors on Panda. Your business equity position in Fatuma Hardware is your top performer at 18%.",
};

// ============================================================
// 🧱 MAIN COMPONENT — InvestmentDashboard
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user + portfolio from Supabase
  currentUser = { name:"BAK", initials:"B" },
  portfolio   = MOCK_PORTFOLIO,
  positions   = MOCK_POSITIONS,
  allocation  = ALLOCATION,
  insight     = INSIGHT,

  // 🧭 NAVIGATE
  onBack        = () => {},   // → Panda Finance Home
  onBrowse      = () => {},   // → IN-2 Investment Marketplace
  onPositionTap = () => {},   // → IN-4 Portfolio & Returns (single position)
  onRaiseCapital= () => {},   // → IN-5 Raise Capital
  onViewScore   = () => {},   // → CR-1 Panda Score Dashboard
}) {
  const [expandAllocation, setExpandAllocation] = useState(false);

  const gainPct = Math.round((portfolio.totalReturns / portfolio.totalInvested) * 1000) / 10;

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounceIn { 0%{transform:scale(0.9)} 60%{transform:scale(1.02)} 100%{transform:scale(1)} }
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
          Panda Investments
        </div>
        <div style={{ width:40 }}/>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── PORTFOLIO VALUE HERO ── */}
        <div style={{
          background:`linear-gradient(135deg,${T.navy} 0%,${T.navyMid} 100%)`,
          borderRadius:26, padding:"28px 24px", marginBottom:16,
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", inset:0, opacity:0.05,
            backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize:"18px 18px" }}/>
          <div style={{ position:"absolute", top:-40, right:-40,
            width:160, height:160, borderRadius:"50%",
            background:"rgba(255,255,255,0.04)" }}/>

          <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
            fontWeight:700, letterSpacing:1, marginBottom:10, position:"relative" }}>
            PORTFOLIO VALUE
          </div>
          <div style={{ fontSize:38, fontWeight:900, color:"#fff",
            fontFamily:"monospace", letterSpacing:-1, marginBottom:14,
            position:"relative", animation:"bounceIn 0.4s ease" }}>
            {fmt(portfolio.currentValue)}
          </div>

          <div style={{ display:"flex", gap:10, position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5,
              background:"rgba(10,123,75,0.25)", borderRadius:9,
              padding:"5px 11px" }}>
              <Icon name="trendingUp" size={12} color="#4ADE80"/>
              <span style={{ fontSize:12, fontWeight:800, color:"#4ADE80" }}>
                +{fmt(portfolio.totalReturns)} ({gainPct}%)
              </span>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
            gap:10, marginTop:18, position:"relative" }}>
            <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:12,
              padding:"10px 12px" }}>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.55)",
                fontWeight:700, marginBottom:3 }}>TOTAL INVESTED</div>
              <div style={{ fontSize:14, fontWeight:900, color:"#fff",
                fontFamily:"monospace" }}>{fmt(portfolio.totalInvested)}</div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:12,
              padding:"10px 12px" }}>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.55)",
                fontWeight:700, marginBottom:3 }}>ACTIVE POSITIONS</div>
              <div style={{ fontSize:14, fontWeight:900, color:T.goldMid,
                fontFamily:"monospace" }}>{positions.length}</div>
            </div>
          </div>
        </div>

        {/* ── ELIGIBILITY / SCORE LINK ── */}
        <div onClick={onViewScore} style={{ display:"flex",
          alignItems:"center", gap:10, background:T.card,
          border:`1px solid ${T.gold}33`, borderRadius:18,
          padding:"12px 16px", marginBottom:16, cursor:"pointer",
          boxShadow:T.shadow }}>
          <div style={{ width:38, height:38, borderRadius:11,
            background:T.goldLight,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="award" size={18} color={T.gold}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
              Eligible to invest up to {fmt(portfolio.maxInvestable)}
            </div>
            <div style={{ fontSize:11, color:T.textMute }}>
              Based on your Panda Score tier: {portfolio.eligibleTier.replace("_"," ")}
            </div>
          </div>
          <Icon name="chevronRight" size={14} color={T.textMute}/>
        </div>

        {/* ── BROWSE CTA ── */}
        <button onClick={onBrowse} style={{
          width:"100%", padding:"16px 0", borderRadius:18, marginBottom:16,
          background:`linear-gradient(135deg,${T.gold},#A07008)`,
          border:"none", color:"#fff", fontSize:14, fontWeight:900,
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          boxShadow:`0 6px 20px ${T.gold}44` }}>
          <Icon name="briefcase" size={17} color="#fff"/>
          Browse Investment Opportunities
        </button>

        {/* ── AI-STYLE INSIGHT ── */}
        <div style={{ background:`linear-gradient(135deg,#3B1FA3,#6D28D9)`,
          borderRadius:22, padding:"18px 20px", marginBottom:16,
          position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, opacity:0.06,
            backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize:"14px 14px" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:8,
            marginBottom:10, position:"relative" }}>
            <Icon name="sparkle" size={16} color={T.goldMid}/>
            <span style={{ fontSize:12, fontWeight:900, color:"#fff" }}>
              Portfolio Insight
            </span>
          </div>
          <div style={{ fontSize:13, fontWeight:800, color:"#fff",
            marginBottom:6, position:"relative" }}>{insight.title}</div>
          <div style={{ fontSize:11.5, color:"rgba(255,255,255,0.75)",
            lineHeight:1.7, position:"relative" }}>{insight.text}</div>
        </div>

        {/* ── ALLOCATION BREAKDOWN ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
          <div onClick={() => setExpandAllocation(e => !e)}
            style={{ display:"flex", alignItems:"center", gap:8,
              cursor:"pointer", marginBottom:14 }}>
            <Icon name="pieChart" size={16} color={T.purple}/>
            <span style={{ fontSize:14, fontWeight:900, color:T.textMain, flex:1 }}>
              Portfolio Allocation
            </span>
          </div>
          {/* Stacked bar */}
          <div style={{ height:14, borderRadius:99, overflow:"hidden",
            display:"flex", marginBottom:14 }}>
            {allocation.map(a => (
              <div key={a.label} style={{ width:`${a.pct}%`, background:a.color }}/>
            ))}
          </div>
          {allocation.map(a => (
            <div key={a.label} style={{ display:"flex", alignItems:"center",
              gap:8, marginBottom:8 }}>
              <div style={{ width:10, height:10, borderRadius:3, background:a.color,
                flexShrink:0 }}/>
              <span style={{ fontSize:12, color:T.textMid, flex:1 }}>{a.label}</span>
              <span style={{ fontSize:12, fontWeight:800, color:T.textMain }}>{a.pct}%</span>
            </div>
          ))}
        </div>

        {/* ── ACTIVE POSITIONS ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:16, fontWeight:900, color:T.textMain,
              letterSpacing:-0.3 }}>Active Positions</span>
          </div>
          {positions.map((pos,i) => (
            <div key={pos.id} onClick={() => onPositionTap(pos)} style={{
              background:T.card, borderRadius:20, padding:"16px 18px",
              marginBottom:12, border:`1px solid ${T.border}`, boxShadow:T.shadow,
              cursor:"pointer", animation:`fadeUp 0.25s ease ${i*0.06}s both` }}>
              <div style={{ display:"flex", gap:12, alignItems:"center",
                marginBottom:12 }}>
                <div style={{ width:40, height:40, borderRadius:12, flexShrink:0,
                  background:pos.color+"14",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={pos.type==="fixed_return"?"shield":"briefcase"}
                    size={18} color={pos.color}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                    overflow:"hidden", textOverflow:"ellipsis",
                    whiteSpace:"nowrap" }}>{pos.name}</div>
                  <div style={{ fontSize:10, color:T.textMute, marginTop:2 }}>
                    {pos.type==="fixed_return" ? "Fixed-Return" : "Business Equity"} · {pos.maturityDate}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:9, color:T.textMute, fontWeight:700 }}>
                    CURRENT VALUE
                  </div>
                  <div style={{ fontSize:15, fontWeight:900, color:T.navy,
                    fontFamily:"monospace" }}>{fmt(pos.currentValue)}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4,
                  background:T.greenBg, borderRadius:8, padding:"4px 10px" }}>
                  <Icon name="trendingUp" size={11} color={T.green}/>
                  <span style={{ fontSize:11, fontWeight:800, color:T.green }}>
                    +{pos.returnPct}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── RAISE CAPITAL CTA (business side) ── */}
        <div onClick={onRaiseCapital} style={{ background:T.navyLight,
          border:`1px solid ${T.border}`, borderRadius:18,
          padding:"16px 18px", marginBottom:16,
          display:"flex", gap:12, alignItems:"center", cursor:"pointer" }}>
          <div style={{ width:42, height:42, borderRadius:13,
            background:T.navy,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="dollarSign" size={19} color="#fff"/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
              Run a business? Raise capital here
            </div>
            <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
              List your business for investor funding
            </div>
          </div>
          <Icon name="chevronRight" size={14} color={T.textMute}/>
        </div>

        {/* ── RISK DISCLOSURE ── */}
        <div style={{ background:T.amberBg, border:`1px solid ${T.amber}22`,
          borderRadius:16, padding:"14px 18px", marginBottom:16,
          display:"flex", gap:10, alignItems:"flex-start" }}>
          <Icon name="lock" size={14} color={T.amber}/>
          <span style={{ fontSize:10.5, color:T.amber, lineHeight:1.6, fontWeight:600 }}>
            Investments carry risk, including loss of principal. Past returns
            do not guarantee future performance. Panda Finance does not
            provide investment advice — review each opportunity carefully.
          </span>
        </div>

      </div>

      <BottomNav active="home"/>
    </div>
  );
}

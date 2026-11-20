import { useState } from "react";

// ============================================================
// 🧱 IN-4 — PORTFOLIO & RETURNS
// 🏗️  Part of: Panda Investments (Module 5)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 📦  Assembly: export PortfolioReturns from this file
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
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    briefcase:    <><rect x="2" y="7" width="20" height="14" rx="2" {...s}/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...s}/></>,
    trendingUp:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    trendingDown: <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" {...s}/><polyline points="17 18 23 18 23 12" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    download:     <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...s}/><polyline points="7 10 12 15 17 10" {...s}/><line x1="12" y1="15" x2="12" y2="3" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronUp:    <><polyline points="18 15 12 9 6 15" {...s}/></>,
    dollarSign:   <><line x1="12" y1="1" x2="12" y2="23" {...s}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...s}/></>,
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
// 🔌 BACKEND SWAP POINT #1 — ALL INVESTMENT POSITIONS (full detail)
// Replace with: supabase.from('investments')
//   .select('*,opportunity(*),payouts(*))').eq('investor_id', currentUser.id)
//   .order('created_at', { ascending: false })
// ============================================================
const MOCK_POSITIONS = [
  {
    id:"POS-001", type:"fixed_return", status:"active",
    name:"Panda Capital Fixed Return — 12mo", issuer:"Panda Capital",
    issuerInitials:"PC", color:T.navy,
    invested:1000000, currentValue:1085000, returnPct:8.5,
    startDate:"Jul 15, 2026", maturityDate:"Jul 15, 2027", monthsElapsed:0, monthsTotal:12,
    payouts:[
      { date:"Aug 15, 2026", amount:7083, status:"upcoming" },
    ],
  },
  {
    id:"POS-002", type:"business_equity", status:"active",
    name:"Fatuma Hardware Ltd — Growth Round", issuer:"Fatuma Hardware Ltd",
    issuerInitials:"FH", color:T.purple,
    invested:800000, currentValue:944000, returnPct:18.0,
    startDate:"Mar 1, 2026", maturityDate:"Ongoing", monthsElapsed:4, monthsTotal:null,
    payouts:[
      { date:"Apr 1, 2026", amount:32000, status:"paid" },
      { date:"May 1, 2026", amount:36000, status:"paid" },
      { date:"Jun 1, 2026", amount:38000, status:"paid" },
      { date:"Jul 1, 2026", amount:38000, status:"paid" },
    ],
  },
  {
    id:"POS-003", type:"fixed_return", status:"active",
    name:"Panda Agri Fund — 6mo", issuer:"Panda Agri Fund",
    issuerInitials:"PA", color:"#0D9488",
    invested:600000, currentValue:659000, returnPct:9.8,
    startDate:"May 3, 2026", maturityDate:"Nov 3, 2026", monthsElapsed:2, monthsTotal:6,
    payouts:[],
  },
  {
    id:"POS-004", type:"fixed_return", status:"completed",
    name:"Panda Capital Fixed Return — 6mo", issuer:"Panda Capital",
    issuerInitials:"PC", color:T.navy,
    invested:500000, currentValue:531250, returnPct:8.5,
    startDate:"Nov 10, 2025", maturityDate:"May 10, 2026", completedDate:"May 10, 2026",
    monthsElapsed:6, monthsTotal:6,
    payouts:[
      { date:"May 10, 2026", amount:31250, status:"paid" },
    ],
  },
];

const TYPE_LABEL = { fixed_return:"Fixed-Return", business_equity:"Business Equity" };

// ============================================================
// 🧱 MAIN COMPONENT — PortfolioReturns
// ============================================================
export default function App({
  positions = MOCK_POSITIONS,

  // 🧭 NAVIGATE
  onBack        = () => {},   // → IN-1 Dashboard
  onWithdraw    = () => {},   // → withdraw matured investment to wallet
  onReinvest    = () => {},   // → IN-2 Marketplace (reinvest proceeds)
}) {
  const [filter,     setFilter]     = useState("active");
  const [expandPos,  setExpandPos]  = useState(null);
  const [toast,      setToast]      = useState(null);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = positions.filter(p => filter === "all" || p.status === filter);
  const activePositions    = positions.filter(p => p.status === "active");
  const completedPositions = positions.filter(p => p.status === "completed");

  const totalInvested = activePositions.reduce((s,p) => s+p.invested, 0);
  const totalValue      = activePositions.reduce((s,p) => s+p.currentValue, 0);
  const totalReturns    = totalValue - totalInvested;
  const returnsPct       = totalInvested > 0 ? Math.round((totalReturns/totalInvested)*1000)/10 : 0;

  const handleWithdraw = (pos) => {
    onWithdraw(pos);
    showToast(`${fmt(pos.currentValue)} withdrawn to Panda Wallet!`, T.green);
  };

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

      {toast && (
        <div style={{
          position:"fixed", bottom:100, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:T.white,
          border:`1px solid ${toast.color}33`, borderLeft:`4px solid ${toast.color}`,
          borderRadius:14, padding:"12px 20px", boxShadow:T.shadowLg,
          whiteSpace:"nowrap", animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex", alignItems:"center", gap:10,
        }}>
          <Icon name="check" size={14} color={toast.color}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>{toast.msg}</span>
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{
        background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:"52px 20px 22px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, opacity:0.05,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"20px 20px" }}/>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:18, position:"relative" }}>
          <button onClick={onBack} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="arrowLeft" size={18} color="#fff"/>
          </button>
          <div style={{ fontSize:16, fontWeight:900, color:"#fff" }}>
            Portfolio & Returns
          </div>
          <div style={{ width:40 }}/>
        </div>

        {/* Summary */}
        <div style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,0.15)", borderRadius:18,
          padding:"16px 18px", position:"relative" }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)",
            fontWeight:700, marginBottom:4 }}>TOTAL RETURNS EARNED</div>
          <div style={{ fontSize:26, fontWeight:900, color:"#4ADE80",
            fontFamily:"monospace", marginBottom:10 }}>+{fmt(totalReturns)}</div>
          <div style={{ display:"flex", gap:16 }}>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)" }}>Invested</div>
              <div style={{ fontSize:13, fontWeight:800, color:"#fff",
                fontFamily:"monospace" }}>{fmt(totalInvested)}</div>
            </div>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)" }}>Current Value</div>
              <div style={{ fontSize:13, fontWeight:800, color:"#fff",
                fontFamily:"monospace" }}>{fmt(totalValue)}</div>
            </div>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)" }}>Return</div>
              <div style={{ fontSize:13, fontWeight:800, color:T.goldMid }}>
                +{returnsPct}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── FILTER TABS ── */}
        <div style={{ display:"flex", gap:7, marginBottom:16 }}>
          {[
            { id:"active",    label:"Active"    },
            { id:"completed", label:"Completed" },
            { id:"all",       label:"All"       },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              flex:1, padding:"9px 0", borderRadius:12,
              background:filter===f.id ? T.navy : T.card,
              border:filter===f.id ? "none" : `1px solid ${T.border}`,
              color:filter===f.id ? "#fff" : T.textMid,
              fontSize:12, fontWeight:800,
              boxShadow:filter===f.id ? `0 4px 12px ${T.navy}33` : T.shadow,
            }}>{f.label}</button>
          ))}
        </div>

        {/* ── POSITIONS LIST ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:"48px", marginBottom:12 }}>📈</div>
            <div style={{ fontSize:16, fontWeight:800, color:T.textMain,
              marginBottom:8 }}>No positions here</div>
            <div style={{ fontSize:13, color:T.textMute }}>
              Browse the Investment Marketplace to get started
            </div>
          </div>
        ) : filtered.map((pos,i) => {
          const isExpanded  = expandPos === pos.id;
          const isCompleted = pos.status === "completed";
          const progressPct = pos.monthsTotal
            ? Math.round((pos.monthsElapsed/pos.monthsTotal)*100)
            : null;
          const gain = pos.currentValue - pos.invested;
          return (
            <div key={pos.id} style={{
              background:T.card, borderRadius:22, marginBottom:14,
              border:`1.5px solid ${T.border}`, boxShadow:T.shadow,
              overflow:"hidden", animation:`fadeUp 0.25s ease ${i*0.05}s both` }}>

              <div onClick={() => setExpandPos(isExpanded?null:pos.id)}
                style={{ padding:"16px 18px", cursor:"pointer" }}>
                <div style={{ display:"flex", gap:12, alignItems:"center",
                  marginBottom:12 }}>
                  <div style={{ width:42, height:42, borderRadius:13, flexShrink:0,
                    background:`linear-gradient(135deg,${pos.color}22,${pos.color}44)`,
                    border:`2px solid ${pos.color}33`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:13, fontWeight:900, color:pos.color }}>
                    {pos.issuerInitials}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {pos.name}
                    </div>
                    <div style={{ fontSize:10, color:T.textMute, marginTop:2 }}>
                      {TYPE_LABEL[pos.type]} · {isCompleted?`Completed ${pos.completedDate}`:pos.maturityDate}
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:4,
                    background:T.greenBg, borderRadius:8, padding:"4px 9px" }}>
                    <Icon name="trendingUp" size={11} color={T.green}/>
                    <span style={{ fontSize:11, fontWeight:800, color:T.green }}>
                      +{pos.returnPct}%
                    </span>
                  </div>
                </div>

                {progressPct !== null && !isCompleted && (
                  <div style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      marginBottom:5 }}>
                      <span style={{ fontSize:10, color:T.textMute }}>
                        {pos.monthsElapsed}/{pos.monthsTotal} months
                      </span>
                      <span style={{ fontSize:10, fontWeight:800, color:pos.color }}>
                        {progressPct}%
                      </span>
                    </div>
                    <div style={{ height:6, background:T.border, borderRadius:99,
                      overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${progressPct}%`,
                        background:`linear-gradient(90deg,${pos.color},${pos.color}88)`,
                        borderRadius:99 }}/>
                    </div>
                  </div>
                )}

                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:9, color:T.textMute, fontWeight:700 }}>
                      CURRENT VALUE
                    </div>
                    <div style={{ fontSize:16, fontWeight:900, color:T.navy,
                      fontFamily:"monospace" }}>{fmt(pos.currentValue)}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:9, color:T.textMute, fontWeight:700 }}>
                      GAIN
                    </div>
                    <div style={{ fontSize:13, fontWeight:800, color:T.green,
                      fontFamily:"monospace" }}>+{fmt(gain)}</div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div style={{ borderTop:`1px solid ${T.border}`,
                  animation:"fadeUp 0.2s ease" }}>
                  <div style={{ padding:"14px 18px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      padding:"6px 0" }}>
                      <span style={{ fontSize:11, color:T.textMute }}>Amount Invested</span>
                      <span style={{ fontSize:11, fontWeight:700, color:T.textMain,
                        fontFamily:"monospace" }}>{fmt(pos.invested)}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      padding:"6px 0" }}>
                      <span style={{ fontSize:11, color:T.textMute }}>Start Date</span>
                      <span style={{ fontSize:11, fontWeight:700, color:T.textMain }}>
                        {pos.startDate}
                      </span>
                    </div>
                  </div>

                  {pos.payouts.length > 0 && (
                    <div style={{ padding:"0 18px 14px" }}>
                      <div style={{ fontSize:11, fontWeight:700, color:T.textMute,
                        textTransform:"uppercase", letterSpacing:0.6, marginBottom:10 }}>
                        Payout History
                      </div>
                      {pos.payouts.map((p,idx) => (
                        <div key={idx} style={{ display:"flex", justifyContent:"space-between",
                          alignItems:"center", padding:"7px 0" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <Icon name={p.status==="paid"?"check":"clock"} size={12}
                              color={p.status==="paid"?T.green:T.textMute}/>
                            <span style={{ fontSize:11, color:T.textMid }}>{p.date}</span>
                          </div>
                          <span style={{ fontSize:11, fontWeight:800,
                            color:p.status==="paid"?T.green:T.textMute,
                            fontFamily:"monospace" }}>{fmt(p.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ padding:"0 18px 16px", display:"flex", gap:8 }}>
                    {isCompleted ? (
                      <button onClick={() => showToast("Downloading statement...", T.navy)}
                        style={{ flex:1, padding:"12px 0", borderRadius:14,
                          background:T.navyLight, border:`1px solid ${T.border}`,
                          fontSize:12, fontWeight:800, color:T.navy,
                          display:"flex", alignItems:"center",
                          justifyContent:"center", gap:6 }}>
                        <Icon name="download" size={13} color={T.navy}/>
                        Statement
                      </button>
                    ) : pos.type === "fixed_return" && progressPct === 100 ? (
                      <button onClick={() => handleWithdraw(pos)} style={{
                        flex:1, padding:"12px 0", borderRadius:14,
                        background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
                        border:"none", fontSize:12, fontWeight:900, color:"#fff",
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6 }}>
                        <Icon name="wallet" size={13} color="#fff"/>
                        Withdraw
                      </button>
                    ) : (
                      <div style={{ flex:1, padding:"12px 0", borderRadius:14,
                        background:T.blueBg, border:`1px solid ${T.blue}22`,
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6 }}>
                        <Icon name="clock" size={13} color={T.blue}/>
                        <span style={{ fontSize:12, fontWeight:800, color:T.blue }}>
                          Active — matures {pos.maturityDate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ── REINVEST CTA ── */}
        {completedPositions.length > 0 && (
          <div onClick={onReinvest} style={{ background:T.goldLight,
            border:`1px solid ${T.gold}33`, borderRadius:18,
            padding:"14px 18px", marginBottom:16,
            display:"flex", gap:12, alignItems:"center", cursor:"pointer" }}>
            <Icon name="trendingUp" size={20} color={T.gold}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                Reinvest your completed returns
              </div>
              <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
                Keep your money growing — browse new opportunities
              </div>
            </div>
          </div>
        )}

      </div>

      <BottomNav active="home"/>
    </div>
  );
}

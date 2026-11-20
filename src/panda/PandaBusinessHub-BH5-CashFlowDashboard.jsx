import { useState } from "react";

// ============================================================
// 🧱 BH-5 — CASH FLOW DASHBOARD
// 🏗️  Part of: Panda Business Hub (Module 3)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 🤖  AI hooks marked with:            // 🤖 AI
// 📦  Assembly: export CashFlowDashboard from this file
//     Props: { businessId, currentUser, onBack, onNavigate }
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
    trendingUp:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    trendingDown: <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" {...s}/><polyline points="17 18 23 18 23 12" {...s}/></>,
    arrowUp:      <><line x1="12" y1="19" x2="12" y2="5" {...s}/><polyline points="5 12 12 5 19 12" {...s}/></>,
    arrowDown:    <><line x1="12" y1="5" x2="12" y2="19" {...s}/><polyline points="19 12 12 19 5 12" {...s}/></>,
    dollarSign:   <><line x1="12" y1="1" x2="12" y2="23" {...s}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    alertTriangle:<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" {...s}/><line x1="12" y1="9" x2="12" y2="13" {...s}/><line x1="12" y1="17" x2="12.01" y2="17" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    grid:         <><rect x="3" y="3" width="7" height="7" {...s}/><rect x="14" y="3" width="7" height="7" {...s}/><rect x="14" y="14" width="7" height="7" {...s}/><rect x="3" y="14" width="7" height="7" {...s}/></>,
    camera:       <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    pieChart:     <><path d="M21.21 15.89A10 10 0 1 1 8 2.83" {...s}/><path d="M22 12A10 10 0 0 0 12 2v10z" {...s}/></>,
    tag:          <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" {...s}/><line x1="7" y1="7" x2="7.01" y2="7" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav (Business Hub) ─────────────────────────────────
function BottomNav({ active = "reports" }) {
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

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — CASH FLOW SERIES
// Replace with: supabase.from('daily_cashflow')
//   .select('date, income, expenses').eq('business_id', businessId)
//   .order('date', { ascending: true }).limit(30)
// ============================================================
const MOCK_CASHFLOW_30D = [
  { date:"Jun 4",  income:320000, expenses:90000  }, { date:"Jun 6",  income:410000, expenses:110000 },
  { date:"Jun 8",  income:280000, expenses:75000  }, { date:"Jun 10", income:520000, expenses:130000 },
  { date:"Jun 12", income:610000, expenses:150000 }, { date:"Jun 14", income:390000, expenses:95000  },
  { date:"Jun 16", income:485000, expenses:120000 }, { date:"Jun 18", income:350000, expenses:85000  },
  { date:"Jun 20", income:590000, expenses:140000 }, { date:"Jun 22", income:420000, expenses:100000 },
  { date:"Jun 24", income:670000, expenses:160000 }, { date:"Jun 26", income:510000, expenses:125000 },
  { date:"Jun 28", income:380000, expenses:90000  }, { date:"Jun 30", income:730000, expenses:175000 },
  { date:"Jul 2",  income:485000, expenses:120000 },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — EXPENSE CATEGORIES
// Replace with: supabase.from('ledger_entries')
//   .select('category, sum(amount)').eq('business_id', businessId)
//   .eq('type', 'expense').group('category')
// ============================================================
const MOCK_EXPENSE_BREAKDOWN = [
  { category:"Supplier Restock", amount:680000, pct:38, color:T.blue   },
  { category:"Rent",             amount:400000, pct:22, color:T.purple },
  { category:"Transport",        amount:210000, pct:12, color:T.teal||T.green },
  { category:"Utilities",        amount:180000, pct:10, color:T.amber  },
  { category:"Staff Wages",      amount:220000, pct:12, color:T.red    },
  { category:"Other",            amount:110000, pct:6,  color:T.textMute },
];

// ============================================================
// 🤖 AI SWAP POINT — CASH FLOW FORECAST & RUNWAY
// Replace with: supabase.functions.invoke('ai-cashflow-forecast', {
//   body: { business_id: businessId }
// })
// ============================================================
const MOCK_FORECAST = {
  burnRate:        1650000,   // monthly average expenses
  runwayMonths:    5.2,
  projectedNext30: 14200000,
  confidence:      "high",
};

const MOCK_AI_INSIGHT = {
  title: "Cash flow is healthy but seasonal",
  text:  "Your income dips every 2 weeks around restocking days. Consider holding a small buffer of TSh 300,000 to smooth out those weeks without affecting daily operations.",
};

// ============================================================
// 🧱 MAIN COMPONENT — CashFlowDashboard
// ============================================================
export default function App({
  cashflow  = MOCK_CASHFLOW_30D,
  breakdown = MOCK_EXPENSE_BREAKDOWN,
  forecast  = MOCK_FORECAST,
  aiInsight = MOCK_AI_INSIGHT,

  // 🧭 NAVIGATE
  onBack     = () => {},   // → BH-1 Dashboard
  onNavigate = () => {},   // → central navigate(screen), e.g. bookkeeping
}) {
  const [period, setPeriod] = useState("30d");

  const totalIncome   = cashflow.reduce((s,d) => s+d.income, 0);
  const totalExpenses = cashflow.reduce((s,d) => s+d.expenses, 0);
  const netCashFlow   = totalIncome - totalExpenses;
  const maxVal         = Math.max(...cashflow.map(d => d.income));

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

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
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:900, color:"#fff",
              letterSpacing:-0.3 }}>Cash Flow</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>Last 30 days</div>
          </div>
          <div style={{ width:40 }}/>
        </div>

        {/* Net cash flow */}
        <div style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,0.15)", borderRadius:18,
          padding:"16px 18px", position:"relative" }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)",
            fontWeight:700, marginBottom:4 }}>NET CASH FLOW</div>
          <div style={{ fontSize:26, fontWeight:900, color:"#fff",
            fontFamily:"monospace", marginBottom:10 }}>{fmt(netCashFlow)}</div>
          <div style={{ display:"flex", gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Icon name="arrowUp" size={12} color="#4ADE80"/>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.8)" }}>
                In: <b style={{ color:"#4ADE80", fontFamily:"monospace" }}>{fmt(totalIncome)}</b>
              </span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Icon name="arrowDown" size={12} color="#FCA5A5"/>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.8)" }}>
                Out: <b style={{ color:"#FCA5A5", fontFamily:"monospace" }}>{fmt(totalExpenses)}</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── PERIOD SELECTOR ── */}
        <div style={{ display:"flex", gap:7, marginBottom:16 }}>
          {["7d","30d","90d","1y"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              flex:1, padding:"8px 0", borderRadius:12,
              background:period===p ? T.navy : T.card,
              border:period===p ? "none" : `1px solid ${T.border}`,
              color:period===p ? "#fff" : T.textMid,
              fontSize:11, fontWeight:800,
              boxShadow:period===p ? `0 4px 12px ${T.navy}33` : T.shadow,
            }}>{p}</button>
          ))}
        </div>

        {/* ── CASH FLOW CHART ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:16 }}>
            <span style={{ fontSize:14, fontWeight:900, color:T.textMain }}>
              Income vs Expenses
            </span>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:110,
            overflowX:"auto" }}>
            {cashflow.map(d => {
              const incomeH  = Math.round((d.income/maxVal)*90);
              const expenseH = Math.round((d.expenses/maxVal)*90);
              return (
                <div key={d.date} style={{ minWidth:20, flex:1,
                  display:"flex", flexDirection:"column",
                  alignItems:"center", gap:6 }}>
                  <div style={{ width:"100%", display:"flex", gap:2,
                    alignItems:"flex-end", height:90 }}>
                    <div style={{ flex:1, height:incomeH, borderRadius:"3px 3px 0 0",
                      background:`linear-gradient(180deg,${T.green},#0A5C3A)` }}/>
                    <div style={{ flex:1, height:expenseH, borderRadius:"3px 3px 0 0",
                      background:`linear-gradient(180deg,${T.red}88,${T.red}44)` }}/>
                  </div>
                  <span style={{ fontSize:8, fontWeight:600, color:T.textMute,
                    whiteSpace:"nowrap" }}>{d.date}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:16, justifyContent:"center",
            marginTop:14, paddingTop:14, borderTop:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:8, height:8, borderRadius:2, background:T.green }}/>
              <span style={{ fontSize:11, color:T.textMute, fontWeight:600 }}>Income</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:8, height:8, borderRadius:2, background:T.red+"88" }}/>
              <span style={{ fontSize:11, color:T.textMute, fontWeight:600 }}>Expenses</span>
            </div>
          </div>
        </div>

        {/* ── AI FORECAST & RUNWAY ── */}
        <div style={{ background:`linear-gradient(135deg,#3B1FA3,#6D28D9)`,
          borderRadius:22, padding:"20px", marginBottom:16,
          position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, opacity:0.06,
            backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize:"14px 14px" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:8,
            marginBottom:16, position:"relative" }}>
            <Icon name="sparkle" size={16} color={T.goldMid}/>
            <span style={{ fontSize:13, fontWeight:900, color:"#fff" }}>
              AI Cash Flow Forecast
            </span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
            gap:10, marginBottom:14, position:"relative" }}>
            <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:14,
              padding:"12px 14px" }}>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.65)",
                fontWeight:700, marginBottom:4 }}>MONTHLY BURN RATE</div>
              <div style={{ fontSize:15, fontWeight:900, color:"#fff",
                fontFamily:"monospace" }}>{fmt(forecast.burnRate)}</div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:14,
              padding:"12px 14px" }}>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.65)",
                fontWeight:700, marginBottom:4 }}>RUNWAY</div>
              <div style={{ fontSize:15, fontWeight:900, color:T.goldMid,
                fontFamily:"monospace" }}>{forecast.runwayMonths} months</div>
            </div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:14,
            padding:"12px 14px", position:"relative" }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#fff",
              marginBottom:5 }}>{aiInsight.title}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)",
              lineHeight:1.6 }}>{aiInsight.text}</div>
          </div>
        </div>

        {/* ── EXPENSE BREAKDOWN ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <Icon name="pieChart" size={16} color={T.purple}/>
            <span style={{ fontSize:14, fontWeight:900, color:T.textMain }}>
              Expense Breakdown
            </span>
          </div>
          {breakdown.map(cat => (
            <div key={cat.category} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", marginBottom:5 }}>
                <span style={{ fontSize:12, fontWeight:700, color:T.textMid }}>
                  {cat.category}
                </span>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ fontSize:11, color:T.textMute,
                    fontFamily:"monospace" }}>{fmt(cat.amount)}</span>
                  <span style={{ fontSize:12, fontWeight:900,
                    color:cat.color }}>{cat.pct}%</span>
                </div>
              </div>
              <div style={{ height:7, background:T.border, borderRadius:99,
                overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${cat.pct}%`,
                  background:`linear-gradient(90deg,${cat.color},${cat.color}88)`,
                  borderRadius:99 }}/>
              </div>
            </div>
          ))}
        </div>

        {/* ── PROJECTED NEXT 30 DAYS ── */}
        <div onClick={() => onNavigate("bookkeeping")} style={{ background:T.greenBg,
          border:`1px solid ${T.green}22`, borderRadius:18,
          padding:"16px 18px", marginBottom:16, cursor:"pointer",
          display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ width:42, height:42, borderRadius:13,
            background:T.green+"18",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="trendingUp" size={19} color={T.green}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
              Projected Next 30 Days
            </div>
            <div style={{ fontSize:15, fontWeight:900, color:T.green,
              fontFamily:"monospace", marginTop:2 }}>
              {fmt(forecast.projectedNext30)}
            </div>
          </div>
          <Icon name="chevronRight" size={14} color={T.green}/>
        </div>

      </div>

      <BottomNav active="reports"/>
    </div>
  );
}

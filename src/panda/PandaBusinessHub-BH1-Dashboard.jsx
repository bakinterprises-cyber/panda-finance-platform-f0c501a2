import { useState } from "react";

// ============================================================
// 🧱 BH-1 — BUSINESS DASHBOARD
// 🏗️  Part of: Panda Business Hub (Module 3)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🤖  AI hooks marked with:            // 🤖 AI
// 📦  Assembly: export BusinessDashboard from this file
//     Props: { currentUser, onNavigate }
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
    camera:       <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    bell:         <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...s}/><path d="M13.73 21a2 2 0 0 1-3.46 0" {...s}/></>,
    dollarSign:   <><line x1="12" y1="1" x2="12" y2="23" {...s}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...s}/></>,
    trendingUp:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    trendingDown: <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" {...s}/><polyline points="17 18 23 18 23 12" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    bookOpen:     <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" {...s}/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" {...s}/></>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    fileMinus:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="9" y1="15" x2="15" y2="15" {...s}/></>,
    alertTriangle:<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" {...s}/><line x1="12" y1="9" x2="12" y2="13" {...s}/><line x1="12" y1="17" x2="12.01" y2="17" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    grid:         <><rect x="3" y="3" width="7" height="7" {...s}/><rect x="14" y="3" width="7" height="7" {...s}/><rect x="14" y="14" width="7" height="7" {...s}/><rect x="3" y="14" width="7" height="7" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    mic:          <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" {...s}/><path d="M19 10v2a7 7 0 0 1-14 0v-2" {...s}/><line x1="12" y1="19" x2="12" y2="23" {...s}/><line x1="8" y1="23" x2="16" y2="23" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    arrowUp:      <><line x1="12" y1="19" x2="12" y2="5" {...s}/><polyline points="5 12 12 5 19 12" {...s}/></>,
    arrowDown:    <><line x1="12" y1="5" x2="12" y2="19" {...s}/><polyline points="19 12 12 19 5 12" {...s}/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
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

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — BUSINESS PROFILE & METRICS
// Replace with: supabase.from('businesses')
//   .select('*,business_metrics(*)').eq('owner_id', currentUser.id).single()
// ============================================================
const MOCK_BUSINESS = {
  name:        "Tech Master Store",
  initials:    "TM",
  color:       "#1D4ED8",
  owner:       "BAK",
  metrics: {
    revenueToday:   485000,
    revenueGrowth:  12.4,
    expensesToday:  120000,
    expensesGrowth: -5.2,
    profitToday:    365000,
    profitGrowth:   18.7,
  },
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — CASH FLOW SNAPSHOT (7 days)
// Replace with: supabase.from('daily_cashflow')
//   .select('date, income, expenses').eq('business_id', businessId)
//   .order('date', { ascending: true }).limit(7)
// ============================================================
const MOCK_CASHFLOW = [
  { day:"Mon", income:320000, expenses:90000  },
  { day:"Tue", income:410000, expenses:110000 },
  { day:"Wed", income:280000, expenses:75000  },
  { day:"Thu", income:520000, expenses:130000 },
  { day:"Fri", income:610000, expenses:150000 },
  { day:"Sat", income:390000, expenses:95000  },
  { day:"Sun", income:485000, expenses:120000 },
];

// ============================================================
// 🤖 AI SWAP POINT — DAILY BUSINESS ALERTS
// Replace with: supabase.functions.invoke('ai-business-alerts', {
//   body: { business_id: businessId }
// })
// ============================================================
const MOCK_AI_ALERTS = [
  {
    id:1, priority:"high", icon:"alertTriangle", color:T.red,
    title:"Coca Cola stock running low",
    text:"Only 8 units left. At current sales pace, you'll run out in 2 days.",
    action:"Reorder Now",
  },
  {
    id:2, priority:"medium", icon:"trendingUp", color:T.green,
    title:"Revenue up 12% this week",
    text:"Your best week this month. Azam Juice is your top performer.",
    action:"View Report",
  },
  {
    id:3, priority:"medium", icon:"fileMinus", color:T.amber,
    title:"3 unpaid invoices",
    text:"TSh 340,000 outstanding from clients. 2 are overdue by 5+ days.",
    action:"View Invoices",
  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #3 — RECENT BUSINESS ACTIVITY
// Replace with: supabase.from('business_activity')
//   .select('*').eq('business_id', businessId)
//   .order('created_at', { ascending: false }).limit(6)
// ============================================================
const MOCK_ACTIVITY = [
  { id:1, type:"sale",    desc:"Sale — 3 items via Panda Vision AI", amount:45000,  time:"12 mins ago" },
  { id:2, type:"expense", desc:"Expense — Supplier payment (Azam)",  amount:-180000,time:"1 hour ago"  },
  { id:3, type:"invoice", desc:"Invoice #INV-0042 sent to client",   amount:250000, time:"3 hours ago" },
  { id:4, type:"sale",    desc:"Sale — Marketplace order #ORD-8821", amount:1650000,time:"Yesterday"   },
  { id:5, type:"expense", desc:"Expense — Shop rent",                amount:-400000,time:"2 days ago"  },
];

const ACTIVITY_CONFIG = {
  sale:    { icon:"dollarSign", color:T.green },
  expense: { icon:"arrowDown",  color:T.red   },
  invoice: { icon:"fileText",   color:T.blue  },
};

const QUICK_TOOLS = [
  { id:"scan-product", label:"Scan Product",    icon:"camera",   color:T.gold,   screen:"vision-inventory" },
  { id:"scan-receipt", label:"Scan Receipt",    icon:"fileText", color:T.blue,   screen:"vision-receipt"   },
  { id:"new-invoice",  label:"New Invoice",     icon:"fileMinus",color:T.purple, screen:"invoice-new"      },
  { id:"new-sale",     label:"Quick Sale",      icon:"zap",      color:T.red,    screen:"vision-pos"       },
  { id:"inventory",    label:"Inventory",       icon:"grid",     color:T.teal,   screen:"inventory"        },
  { id:"bookkeeping",  label:"Bookkeeping",     icon:"bookOpen", color:T.navy,   screen:"bookkeeping"      },
  { id:"cashflow",     label:"Cash Flow",       icon:"barChart", color:T.green,  screen:"cashflow"         },
  { id:"ai-coach",     label:"Ask AI Coach",    icon:"sparkle",  color:T.purple, screen:"ai-coach"         },
];

// ============================================================
// 🧱 MAIN COMPONENT — BusinessDashboard
// ============================================================
export default function App({
  // 👤 AUTH — replace with real business from supabase.auth.getUser()
  business     = MOCK_BUSINESS,
  cashflow     = MOCK_CASHFLOW,
  aiAlerts     = MOCK_AI_ALERTS,
  activity     = MOCK_ACTIVITY,

  // 🧭 NAVIGATE
  onNavigate      = () => {},   // → central navigate(screen)
  onNotifications = () => {},
  onVoiceAssistant= () => {},   // → BH-6 AI Business Coach (voice mode)
}) {
  const [period,          setPeriod]          = useState("today");
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [toast,           setToast]           = useState(null);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const visibleAlerts = aiAlerts.filter(a => !dismissedAlerts.includes(a.id));
  const maxFlow = Math.max(...cashflow.map(d => d.income));

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes glow     { 0%,100%{box-shadow:0 6px 20px rgba(201,150,10,0.4)} 50%{box-shadow:0 6px 32px rgba(201,150,10,0.7)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:100, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:T.white,
          border:`1px solid ${toast.color}33`,
          borderLeft:`4px solid ${toast.color}`,
          borderRadius:14, padding:"12px 20px",
          boxShadow:T.shadowLg, whiteSpace:"nowrap",
          animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex", alignItems:"center", gap:10,
        }}>
          <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>{toast.msg}</span>
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{
        background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:"52px 20px 24px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, opacity:0.05,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"20px 20px" }}/>

        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:18, position:"relative" }}>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ width:46, height:46, borderRadius:14,
              background:`linear-gradient(135deg,${business.color}44,${business.color}88)`,
              border:"2px solid rgba(255,255,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, fontWeight:900, color:"#fff" }}>
              {business.initials}
            </div>
            <div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
                fontWeight:600 }}>Business Hub</div>
              <div style={{ fontSize:16, fontWeight:900, color:"#fff",
                letterSpacing:-0.3 }}>{business.name}</div>
            </div>
          </div>
          <button onClick={onNotifications} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center",
            position:"relative" }}>
            <Icon name="bell" size={18} color="#fff"/>
            {visibleAlerts.length > 0 && (
              <div style={{ position:"absolute", top:8, right:8,
                width:7, height:7, borderRadius:"50%", background:T.red,
                border:"1.5px solid rgba(11,31,75,0.8)",
                animation:"pulse 1.5s infinite" }}/>
            )}
          </button>
        </div>

        {/* Period selector */}
        <div style={{ display:"flex", gap:6, position:"relative" }}>
          {["today","week","month"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding:"7px 16px", borderRadius:99, fontSize:11, fontWeight:700,
              background: period===p ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
              border: period===p ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.15)",
              color:"#fff", textTransform:"capitalize",
            }}>{p}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── REVENUE / EXPENSES / PROFIT ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
          gap:12, marginBottom:12 }}>
          {[
            { label:"Revenue",  value:business.metrics.revenueToday,  growth:business.metrics.revenueGrowth,  icon:"dollarSign", color:T.green },
            { label:"Expenses", value:business.metrics.expensesToday, growth:business.metrics.expensesGrowth, icon:"arrowDown",  color:T.red   },
          ].map(m => (
            <div key={m.label} style={{ background:T.card, borderRadius:20,
              padding:"16px", border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"flex-start", marginBottom:10 }}>
                <div style={{ width:32, height:32, borderRadius:10,
                  background:m.color+"14",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={m.icon} size={15} color={m.color}/>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:3,
                  background:m.growth>=0 ? T.greenBg : T.redBg,
                  borderRadius:8, padding:"3px 7px" }}>
                  <Icon name={m.growth>=0?"arrowUp":"arrowDown"} size={9}
                    color={m.growth>=0 ? T.green : T.red}/>
                  <span style={{ fontSize:10, fontWeight:800,
                    color:m.growth>=0 ? T.green : T.red }}>
                    {Math.abs(m.growth)}%
                  </span>
                </div>
              </div>
              <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
                textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>
                {m.label} Today
              </div>
              <div style={{ fontSize:16, fontWeight:900, color:T.navy,
                fontFamily:"monospace", letterSpacing:-0.5 }}>{fmt(m.value)}</div>
            </div>
          ))}
        </div>

        {/* Profit banner */}
        <div style={{ background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
          borderRadius:20, padding:"16px 20px", marginBottom:16,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, opacity:0.06,
            backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize:"14px 14px" }}/>
          <div style={{ position:"relative" }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)",
              fontWeight:700, marginBottom:4 }}>NET PROFIT TODAY</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#fff",
              fontFamily:"monospace", letterSpacing:-0.5 }}>
              {fmt(business.metrics.profitToday)}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:4,
            background:"rgba(255,255,255,0.2)", borderRadius:10,
            padding:"5px 10px", position:"relative" }}>
            <Icon name="trendingUp" size={13} color="#fff"/>
            <span style={{ fontSize:12, fontWeight:900, color:"#fff" }}>
              +{business.metrics.profitGrowth}%
            </span>
          </div>
        </div>

        {/* ── PANDA VISION AI CTA ── */}
        <div onClick={() => onNavigate("vision-hub")} style={{
          background:`linear-gradient(135deg,#3B1FA3,#6D28D9)`,
          borderRadius:24, padding:"20px", marginBottom:16,
          position:"relative", overflow:"hidden", cursor:"pointer",
          animation:"glow 3s infinite",
        }}>
          <div style={{ position:"absolute", inset:0, opacity:0.06,
            backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize:"14px 14px" }}/>
          <div style={{ display:"flex", gap:14, alignItems:"center",
            position:"relative" }}>
            <div style={{ width:54, height:54, borderRadius:16,
              background:"rgba(255,255,255,0.15)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="camera" size={26} color="#fff"/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                <span style={{ fontSize:15, fontWeight:900, color:"#fff" }}>
                  Panda Vision AI
                </span>
                <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:6,
                  padding:"1px 7px" }}>
                  <span style={{ fontSize:9, fontWeight:900, color:T.goldMid }}>NEW</span>
                </div>
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>
                Point. Scan. Sell. Manage. — tap to open camera
              </div>
            </div>
            <Icon name="chevronRight" size={18} color="rgba(255,255,255,0.7)"/>
          </div>
        </div>

        {/* ── AI ALERTS ── */}
        {visibleAlerts.length > 0 && (
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <Icon name="sparkle" size={16} color={T.purple}/>
              <span style={{ fontSize:16, fontWeight:900, color:T.textMain,
                letterSpacing:-0.3 }}>AI Alerts</span>
            </div>
            {visibleAlerts.map((alert,i) => (
              <div key={alert.id} style={{ background:T.card, borderRadius:20,
                padding:"16px 18px", marginBottom:10,
                border:`1.5px solid ${alert.color}22`, boxShadow:T.shadow,
                animation:`fadeUp 0.25s ease ${i*0.06}s both` }}>
                <div style={{ display:"flex", gap:12, alignItems:"flex-start",
                  marginBottom:12 }}>
                  <div style={{ width:38, height:38, borderRadius:11, flexShrink:0,
                    background:alert.color+"14",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name={alert.icon} size={17} color={alert.color}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                      marginBottom:4 }}>{alert.title}</div>
                    <div style={{ fontSize:11, color:T.textMute, lineHeight:1.6 }}>
                      {alert.text}
                    </div>
                  </div>
                  <button onClick={() => setDismissedAlerts(d => [...d, alert.id])}
                    style={{ background:"none", border:"none", flexShrink:0 }}>
                    <Icon name="x" size={14} color={T.textMute}/>
                  </button>
                </div>
                <button onClick={() => showToast(`${alert.action} — opening...`, alert.color)}
                  style={{ width:"100%", padding:"9px 0", borderRadius:12,
                    background:alert.color+"14", border:`1px solid ${alert.color}33`,
                    fontSize:11, fontWeight:800, color:alert.color }}>
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── QUICK TOOLS GRID ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:16, fontWeight:900, color:T.textMain,
            letterSpacing:-0.3, marginBottom:12 }}>Quick Tools</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
            {QUICK_TOOLS.map(tool => (
              <div key={tool.id} onClick={() => onNavigate(tool.screen)}
                style={{ background:T.card, borderRadius:18, padding:"14px 6px",
                  textAlign:"center", border:`1px solid ${T.border}`,
                  boxShadow:T.shadow, cursor:"pointer" }}>
                <div style={{ width:36, height:36, borderRadius:11,
                  background:tool.color+"14",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 7px" }}>
                  <Icon name={tool.icon} size={16} color={tool.color}/>
                </div>
                <div style={{ fontSize:8.5, fontWeight:800, color:T.textMid,
                  textTransform:"uppercase", letterSpacing:0.2,
                  lineHeight:1.3 }}>{tool.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CASH FLOW MINI CHART ── */}
        <div onClick={() => onNavigate("cashflow")} style={{ background:T.card,
          borderRadius:22, padding:"20px", boxShadow:T.shadow, marginBottom:16,
          border:`1px solid ${T.border}`, cursor:"pointer" }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:16 }}>
            <span style={{ fontSize:14, fontWeight:900, color:T.textMain }}>
              Cash Flow — Last 7 Days
            </span>
            <Icon name="chevronRight" size={14} color={T.textMute}/>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:90 }}>
            {cashflow.map(d => {
              const incomeH   = Math.round((d.income/maxFlow)*80);
              const expenseH  = Math.round((d.expenses/maxFlow)*80);
              return (
                <div key={d.day} style={{ flex:1,
                  display:"flex", flexDirection:"column",
                  alignItems:"center", gap:6 }}>
                  <div style={{ width:"100%", display:"flex", gap:2,
                    alignItems:"flex-end", height:80 }}>
                    <div style={{ flex:1, height:incomeH, borderRadius:"4px 4px 0 0",
                      background:`linear-gradient(180deg,${T.green},#0A5C3A)` }}/>
                    <div style={{ flex:1, height:expenseH, borderRadius:"4px 4px 0 0",
                      background:`linear-gradient(180deg,${T.red}88,${T.red}44)` }}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:600,
                    color:T.textMute }}>{d.day}</span>
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

        {/* ── RECENT ACTIVITY ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:16, fontWeight:900, color:T.textMain,
              letterSpacing:-0.3 }}>Recent Activity</span>
            <button onClick={() => onNavigate("bookkeeping")} style={{
              background:"none", border:"none",
              fontSize:12, fontWeight:700, color:T.navy }}>
              See All
            </button>
          </div>
          <div style={{ background:T.card, borderRadius:22,
            border:`1px solid ${T.border}`, boxShadow:T.shadow, overflow:"hidden" }}>
            {activity.map((a,i) => {
              const cfg = ACTIVITY_CONFIG[a.type];
              const isCredit = a.amount > 0;
              return (
                <div key={a.id} style={{ display:"flex", gap:12,
                  alignItems:"center", padding:"13px 16px",
                  borderBottom:i<activity.length-1?`1px solid ${T.border}`:"none" }}>
                  <div style={{ width:36, height:36, borderRadius:11, flexShrink:0,
                    background:cfg.color+"14",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name={cfg.icon} size={16} color={cfg.color}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                      marginBottom:2, overflow:"hidden", textOverflow:"ellipsis",
                      whiteSpace:"nowrap" }}>{a.desc}</div>
                    <div style={{ fontSize:10, color:T.textMute }}>{a.time}</div>
                  </div>
                  <div style={{ fontSize:13, fontWeight:900,
                    color:isCredit ? T.green : T.textMain,
                    fontFamily:"monospace", flexShrink:0 }}>
                    {isCredit?"+":""}{fmt(a.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── VOICE ASSISTANT CTA ── */}
        <div onClick={onVoiceAssistant} style={{ background:T.navyLight,
          border:`1px solid ${T.border}`, borderRadius:18,
          padding:"14px 18px", marginBottom:16,
          display:"flex", gap:12, alignItems:"center", cursor:"pointer" }}>
          <div style={{ width:38, height:38, borderRadius:"50%",
            background:T.navy,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="mic" size={17} color="#fff"/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
              Ask Panda AI Coach
            </div>
            <div style={{ fontSize:11, color:T.textMute }}>
              "How much inventory do I have?" · "What sold best this week?"
            </div>
          </div>
          <Icon name="chevronRight" size={14} color={T.textMute}/>
        </div>

      </div>

      <BottomNav active="home"/>
    </div>
  );
}

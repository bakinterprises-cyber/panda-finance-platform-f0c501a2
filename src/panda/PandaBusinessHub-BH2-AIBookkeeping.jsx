import { useState } from "react";

// ============================================================
// 🧱 BH-2 — AI BOOKKEEPING
// 🏗️  Part of: Panda Business Hub (Module 3)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 🤖  AI hooks marked with:            // 🤖 AI (Panda Vision AI writes here)
// 📦  Assembly: export AIBookkeeping from this file
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
    camera:       <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    search:       <><circle cx="11" cy="11" r="8" {...s}/><line x1="21" y1="21" x2="16.65" y2="16.65" {...s}/></>,
    dollarSign:   <><line x1="12" y1="1" x2="12" y2="23" {...s}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...s}/></>,
    arrowUp:      <><line x1="12" y1="19" x2="12" y2="5" {...s}/><polyline points="5 12 12 5 19 12" {...s}/></>,
    arrowDown:    <><line x1="12" y1="5" x2="12" y2="19" {...s}/><polyline points="19 12 12 19 5 12" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    grid:         <><rect x="3" y="3" width="7" height="7" {...s}/><rect x="14" y="3" width="7" height="7" {...s}/><rect x="14" y="14" width="7" height="7" {...s}/><rect x="3" y="14" width="7" height="7" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronUp:    <><polyline points="18 15 12 9 6 15" {...s}/></>,
    tag:          <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" {...s}/><line x1="7" y1="7" x2="7.01" y2="7" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    edit:         <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...s}/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...s}/></>,
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
// 🔌 BACKEND SWAP POINT #1 — BOOKKEEPING SUMMARY
// Replace with: supabase.from('bookkeeping_summary')
//   .select('*').eq('business_id', businessId).eq('period', period).single()
// ============================================================
const MOCK_SUMMARY = {
  totalIncome:   2300000,
  totalExpenses: 1650000,
  netProfit:     650000,
  incomeGrowth:  14.2,
  expenseGrowth: -3.8,
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — LEDGER ENTRIES
// Replace with: supabase.from('ledger_entries')
//   .select('*').eq('business_id', businessId)
//   .order('date', { ascending: false })
// 🤖 AI — Vision AI writes entries here via:
// supabase.functions.invoke('vision-log-receipt', {
//   body: { business_id, receipt_image }
// })
// ============================================================
const MOCK_ENTRIES = [
  { id:1, type:"income",  category:"Sales",     desc:"Marketplace order #ORD-8821",   amount:1650000, date:"Today",       source:"marketplace" },
  { id:2, type:"income",  category:"Sales",     desc:"Vision AI Sale — 3 items",      amount:45000,   date:"Today",       source:"vision"       },
  { id:3, type:"expense", category:"Supplier",  desc:"Azam Juice restock",            amount:-180000, date:"Today",       source:"manual"       },
  { id:4, type:"expense", category:"Rent",      desc:"Shop rent — July",              amount:-400000, date:"Yesterday",   source:"manual"       },
  { id:5, type:"expense", category:"Utilities", desc:"Electricity bill",              amount:-45000,  date:"Yesterday",   source:"receipt"      },
  { id:6, type:"income",  category:"Sales",     desc:"Vision AI Sale — AirPods",      amount:350000,  date:"2 days ago",  source:"vision"       },
  { id:7, type:"expense", category:"Transport", desc:"Delivery fuel costs",           amount:-25000,  date:"2 days ago",  source:"receipt"      },
  { id:8, type:"income",  category:"Sales",     desc:"Walk-in customer sale",         amount:120000,  date:"3 days ago",  source:"manual"       },
];

const CATEGORIES_FILTER = ["All", "Income", "Expenses"];

const SOURCE_CONFIG = {
  vision:      { label:"Vision AI", color:T.purple, icon:"sparkle"  },
  receipt:     { label:"Receipt",   color:T.blue,   icon:"fileText" },
  marketplace: { label:"Marketplace",color:T.green, icon:"package"  },
  manual:      { label:"Manual",    color:T.textMute,icon:"edit"    },
};

const CATEGORY_ICONS = {
  Sales:      "dollarSign",
  Supplier:   "truck",
  Rent:       "home",
  Utilities:  "zap",
  Transport:  "truck",
};

// ============================================================
// 🧱 MAIN COMPONENT — AIBookkeeping
// ============================================================
export default function App({
  summary  = MOCK_SUMMARY,
  entries  = MOCK_ENTRIES,

  // 🧭 NAVIGATE
  onBack        = () => {},   // → BH-1 Dashboard
  onScanReceipt = () => {},   // → Panda Vision AI (receipt reader mode)
  onAddEntry    = () => {},   // → Manual entry form
  onNavigate    = () => {},   // → central navigate(screen)
}) {
  const [period,       setPeriod]       = useState("month");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchText,   setSearchText]   = useState("");
  const [expandEntry,  setExpandEntry]  = useState(null);
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = entries
    .filter(e => activeFilter === "All" ||
      (activeFilter === "Income" && e.type === "income") ||
      (activeFilter === "Expenses" && e.type === "expense"))
    .filter(e => !searchText || e.desc.toLowerCase().includes(searchText.toLowerCase()));

  const visionEntries = entries.filter(e => e.source === "vision" || e.source === "receipt").length;

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input { font-family:inherit; }
        input::placeholder { color:${T.textMute}; }
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
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:900, color:"#fff",
              letterSpacing:-0.3 }}>AI Bookkeeping</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>{visionEntries} entries auto-logged by AI</div>
          </div>
          <button onClick={onAddEntry} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="plus" size={18} color="#fff"/>
          </button>
        </div>

        {/* Period selector */}
        <div style={{ display:"flex", gap:6, position:"relative" }}>
          {["week","month","year"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding:"7px 16px", borderRadius:99, fontSize:11, fontWeight:700,
              background: period===p ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
              border: period===p ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.15)",
              color:"#fff", textTransform:"capitalize",
            }}>{p === "week" ? "This Week" : p === "month" ? "This Month" : "This Year"}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── P&L SUMMARY ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
          gap:12, marginBottom:12 }}>
          {[
            { label:"Income",   value:summary.totalIncome,   growth:summary.incomeGrowth,  icon:"arrowUp",   color:T.green },
            { label:"Expenses", value:summary.totalExpenses, growth:summary.expenseGrowth, icon:"arrowDown", color:T.red   },
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
                  <span style={{ fontSize:10, fontWeight:800,
                    color:m.growth>=0 ? T.green : T.red }}>
                    {m.growth>=0?"+":""}{m.growth}%
                  </span>
                </div>
              </div>
              <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
                textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>
                {m.label}
              </div>
              <div style={{ fontSize:15, fontWeight:900, color:T.navy,
                fontFamily:"monospace", letterSpacing:-0.5 }}>{fmt(m.value)}</div>
            </div>
          ))}
        </div>

        {/* Net profit banner */}
        <div style={{ background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
          borderRadius:20, padding:"16px 20px", marginBottom:16,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)",
              fontWeight:700, marginBottom:4 }}>NET PROFIT ({period.toUpperCase()})</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#fff",
              fontFamily:"monospace", letterSpacing:-0.5 }}>
              {fmt(summary.netProfit)}
            </div>
          </div>
          <Icon name="dollarSign" size={28} color="rgba(255,255,255,0.3)"/>
        </div>

        {/* ── PANDA VISION AI RECEIPT SCAN CTA ── */}
        <div onClick={onScanReceipt} style={{
          background:`linear-gradient(135deg,#3B1FA3,#6D28D9)`,
          borderRadius:20, padding:"16px 18px", marginBottom:16,
          display:"flex", gap:12, alignItems:"center",
          cursor:"pointer", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, opacity:0.06,
            backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize:"14px 14px" }}/>
          <div style={{ width:44, height:44, borderRadius:14,
            background:"rgba(255,255,255,0.15)",
            display:"flex", alignItems:"center", justifyContent:"center",
            position:"relative" }}>
            <Icon name="camera" size={21} color="#fff"/>
          </div>
          <div style={{ flex:1, position:"relative" }}>
            <div style={{ fontSize:13, fontWeight:900, color:"#fff", marginBottom:2 }}>
              Scan a Receipt
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)" }}>
              Photo it — Panda Vision AI logs the expense automatically
            </div>
          </div>
          <Icon name="chevronRight" size={16} color="rgba(255,255,255,0.7)"/>
        </div>

        {/* ── SEARCH ── */}
        <div style={{ display:"flex", gap:10, alignItems:"center",
          background:T.card, border:`1px solid ${T.border}`,
          borderRadius:16, padding:"11px 16px", marginBottom:14,
          boxShadow:T.shadow }}>
          <Icon name="search" size={16} color={T.textMute}/>
          <input value={searchText} onChange={e => setSearchText(e.target.value)}
            placeholder="Search transactions..."
            style={{ flex:1, background:"transparent", border:"none",
              outline:"none", fontSize:13, color:T.textMain }}/>
        </div>

        {/* ── FILTER TABS ── */}
        <div style={{ display:"flex", gap:7, marginBottom:16 }}>
          {CATEGORIES_FILTER.map(cat => (
            <button key={cat} onClick={() => setActiveFilter(cat)} style={{
              padding:"7px 16px", borderRadius:99,
              background:activeFilter===cat ? T.navy : T.card,
              border:activeFilter===cat ? "none" : `1px solid ${T.border}`,
              color:activeFilter===cat ? "#fff" : T.textMid,
              fontSize:11, fontWeight:700,
              boxShadow:activeFilter===cat ? `0 4px 12px ${T.navy}33` : T.shadow,
            }}>{cat}</button>
          ))}
        </div>

        {/* ── LEDGER ENTRIES ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
            letterSpacing:-0.3, marginBottom:12 }}>Ledger</div>

          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 0" }}>
              <div style={{ fontSize:"48px", marginBottom:12 }}>📒</div>
              <div style={{ fontSize:16, fontWeight:800, color:T.textMain,
                marginBottom:8 }}>No transactions found</div>
              <div style={{ fontSize:13, color:T.textMute }}>
                Try scanning a receipt or adding an entry
              </div>
            </div>
          ) : (
            <div style={{ background:T.card, borderRadius:22,
              border:`1px solid ${T.border}`, boxShadow:T.shadow, overflow:"hidden" }}>
              {filtered.map((entry, i) => {
                const src       = SOURCE_CONFIG[entry.source];
                const isCredit  = entry.type === "income";
                const isExpanded= expandEntry === entry.id;
                const catIcon   = CATEGORY_ICONS[entry.category] || "tag";
                return (
                  <div key={entry.id} style={{
                    borderBottom:i<filtered.length-1?`1px solid ${T.border}`:"none" }}>
                    <div onClick={() => setExpandEntry(isExpanded?null:entry.id)}
                      style={{ display:"flex", gap:12, alignItems:"center",
                        padding:"14px 16px", cursor:"pointer" }}>
                      <div style={{ width:38, height:38, borderRadius:11, flexShrink:0,
                        background:isCredit ? T.greenBg : T.redBg,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name={catIcon} size={16} color={isCredit?T.green:T.red}/>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                          marginBottom:2, overflow:"hidden",
                          textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {entry.desc}
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ fontSize:10, color:T.textMute }}>{entry.date}</span>
                          <div style={{ width:3, height:3, borderRadius:"50%",
                            background:T.border }}/>
                          <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                            <Icon name={src.icon} size={9} color={src.color}/>
                            <span style={{ fontSize:10, fontWeight:700,
                              color:src.color }}>{src.label}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize:13, fontWeight:900,
                        color:isCredit ? T.green : T.textMain,
                        fontFamily:"monospace", flexShrink:0 }}>
                        {isCredit?"+":""}{fmt(entry.amount)}
                      </div>
                    </div>
                    {isExpanded && (
                      <div style={{ padding:"0 16px 14px 66px",
                        animation:"fadeUp 0.2s ease" }}>
                        <div style={{ background:T.bg, borderRadius:12,
                          padding:"10px 14px", fontSize:11, color:T.textMute,
                          lineHeight:1.6 }}>
                          Category: <b style={{ color:T.textMid }}>{entry.category}</b><br/>
                          Logged via: <b style={{ color:src.color }}>{src.label}</b>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      <BottomNav active="home"/>
    </div>
  );
}

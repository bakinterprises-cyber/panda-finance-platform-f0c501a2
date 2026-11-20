import { useState } from "react";

// ============================================================
// 🧱 BH-8 — BUSINESS REPORTS
// 🏗️  Part of: Panda Business Hub (Module 3)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 🤖  AI hooks marked with:            // 🤖 AI
// 📦  Assembly: export BusinessReports from this file
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
    download:     <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...s}/><polyline points="7 10 12 15 17 10" {...s}/><line x1="12" y1="15" x2="12" y2="3" {...s}/></>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    pieChart:     <><path d="M21.21 15.89A10 10 0 1 1 8 2.83" {...s}/><path d="M22 12A10 10 0 0 0 12 2v10z" {...s}/></>,
    trendingUp:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    trendingDown: <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" {...s}/><polyline points="17 18 23 18 23 12" {...s}/></>,
    arrowUp:      <><line x1="12" y1="19" x2="12" y2="5" {...s}/><polyline points="5 12 12 5 19 12" {...s}/></>,
    arrowDown:    <><line x1="12" y1="5" x2="12" y2="19" {...s}/><polyline points="19 12 12 19 5 12" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    grid:         <><rect x="3" y="3" width="7" height="7" {...s}/><rect x="14" y="3" width="7" height="7" {...s}/><rect x="14" y="14" width="7" height="7" {...s}/><rect x="3" y="14" width="7" height="7" {...s}/></>,
    camera:       <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    share:        <><circle cx="18" cy="5" r="3" {...s}/><circle cx="6" cy="12" r="3" {...s}/><circle cx="18" cy="19" r="3" {...s}/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" {...s}/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" {...s}/></>,
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
// 🔌 BACKEND SWAP POINT #1 — P&L SUMMARY
// Replace with: supabase.from('business_reports')
//   .select('*').eq('business_id', businessId).eq('period', period).single()
// Or compute live: aggregate ledger_entries for the period
// ============================================================
const MOCK_PNL = {
  period:        "June 2026",
  revenue:       8420000,
  cogs:          3680000,   // cost of goods sold
  grossProfit:   4740000,
  operatingExp:  2210000,
  netProfit:     2530000,
  revenueGrowth: 16.8,
  profitMargin:  30.0,
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — MONTHLY TREND (12 months)
// Replace with: supabase.from('business_reports')
//   .select('period, revenue, net_profit').eq('business_id', businessId)
//   .order('period').limit(12)
// ============================================================
const MOCK_MONTHLY_TREND = [
  { month:"Jul", revenue:5200000, profit:1400000 }, { month:"Aug", revenue:5800000, profit:1650000 },
  { month:"Sep", revenue:6100000, profit:1720000 }, { month:"Oct", revenue:6700000, profit:1980000 },
  { month:"Nov", revenue:7200000, profit:2100000 }, { month:"Dec", revenue:8900000, profit:2750000 },
  { month:"Jan", revenue:6300000, profit:1750000 }, { month:"Feb", revenue:6800000, profit:1900000 },
  { month:"Mar", revenue:7100000, profit:2050000 }, { month:"Apr", revenue:7500000, profit:2200000 },
  { month:"May", revenue:7900000, profit:2380000 }, { month:"Jun", revenue:8420000, profit:2530000 },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #3 — BALANCE SHEET SNAPSHOT
// Replace with: supabase.from('balance_sheet')
//   .select('*').eq('business_id', businessId).order('date', {ascending:false}).limit(1).single()
// ============================================================
const MOCK_BALANCE_SHEET = {
  assets: [
    { label:"Cash & Panda Wallet", amount:2340000 },
    { label:"Inventory Value",     amount:4180000 },
    { label:"Accounts Receivable", amount:590000  },
  ],
  liabilities: [
    { label:"Accounts Payable",    amount:820000  },
    { label:"VAT Payable",         amount:738000  },
  ],
};

// ============================================================
// 🔌 BACKEND SWAP POINT #4 — TOP PRODUCTS BY PROFIT
// Replace with: supabase.from('products')
//   .select('name, revenue, profit').eq('seller_id', businessId)
//   .order('profit', { ascending: false }).limit(5)
// ============================================================
const MOCK_TOP_PRODUCTS = [
  { name:"Coca Cola 500ml",      revenue:1240000, profit:496000, margin:40 },
  { name:"AirPods Pro 2nd Gen",  revenue:980000,  profit:392000, margin:40 },
  { name:"Rice 25kg Bag",        revenue:870000,  profit:174000, margin:20 },
  { name:"Azam Mango Juice 1L",  revenue:640000,  profit:224000, margin:35 },
  { name:"Cooking Oil 5L",       revenue:520000,  profit:104000, margin:20 },
];

// ============================================================
// 🤖 AI SWAP POINT — EXECUTIVE SUMMARY
// Replace with: supabase.functions.invoke('ai-report-summary', {
//   body: { business_id: businessId, period: selectedPeriod }
// })
// ============================================================
const MOCK_AI_SUMMARY = {
  title: "Strong month with healthy margins",
  text:  "Revenue grew 16.8% this month, driven mainly by Coca Cola and AirPods sales. Your gross margin of 30% is above the retail average for Tanzania SMEs. Consider reinvesting profit into restocking your top 3 performers before the next flash sale.",
};

const PERIODS = ["This Month", "Last Quarter", "This Year", "Custom"];

// ============================================================
// 🧱 MAIN COMPONENT — BusinessReports
// ============================================================
export default function App({
  pnl           = MOCK_PNL,
  monthlyTrend  = MOCK_MONTHLY_TREND,
  balanceSheet  = MOCK_BALANCE_SHEET,
  topProducts   = MOCK_TOP_PRODUCTS,
  aiSummary     = MOCK_AI_SUMMARY,

  // 🧭 NAVIGATE
  onBack       = () => {},   // → BH-1 Dashboard
  onExportPDF  = () => {},   // → PDF generation (Edge Function or client-side)
  onNavigate   = () => {},   // → central navigate(screen)
}) {
  const [period, setPeriod] = useState("This Month");
  const [toast,  setToast]  = useState(null);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  const totalAssets      = balanceSheet.assets.reduce((s,a) => s+a.amount, 0);
  const totalLiabilities = balanceSheet.liabilities.reduce((s,l) => s+l.amount, 0);
  const netWorth          = totalAssets - totalLiabilities;
  const maxTrend           = Math.max(...monthlyTrend.map(m => m.revenue));

  const exportReport = () => {
    // 🔌 BACKEND — generate PDF via Edge Function or client-side lib
    // supabase.functions.invoke('generate-report-pdf', { body: { business_id, period } })
    showToast("Generating PDF report...", T.navy);
    setTimeout(() => onExportPDF({ pnl, period }), 800);
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
              letterSpacing:-0.3 }}>Business Reports</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>{pnl.period}</div>
          </div>
          <button onClick={exportReport} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="download" size={18} color="#fff"/>
          </button>
        </div>

        {/* Period selector */}
        <div style={{ display:"flex", gap:6, overflowX:"auto", position:"relative" }}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding:"7px 14px", borderRadius:99, fontSize:11, fontWeight:700,
              flexShrink:0,
              background: period===p ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
              border: period===p ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.15)",
              color:"#fff",
            }}>{p}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── AI EXECUTIVE SUMMARY ── */}
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
              AI Executive Summary
            </span>
          </div>
          <div style={{ fontSize:13, fontWeight:800, color:"#fff",
            marginBottom:6, position:"relative" }}>{aiSummary.title}</div>
          <div style={{ fontSize:11.5, color:"rgba(255,255,255,0.75)",
            lineHeight:1.7, position:"relative" }}>{aiSummary.text}</div>
        </div>

        {/* ── P&L SUMMARY ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:16 }}>
            <span style={{ fontSize:14, fontWeight:900, color:T.textMain }}>
              Profit & Loss
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:4,
              background:T.greenBg, borderRadius:8, padding:"3px 8px" }}>
              <Icon name="arrowUp" size={10} color={T.green}/>
              <span style={{ fontSize:10, fontWeight:800, color:T.green }}>
                +{pnl.revenueGrowth}%
              </span>
            </div>
          </div>

          {[
            { label:"Revenue",           value:pnl.revenue,      bold:false },
            { label:"Cost of Goods Sold",value:-pnl.cogs,        bold:false },
            { label:"Gross Profit",      value:pnl.grossProfit,  bold:true  },
            { label:"Operating Expenses",value:-pnl.operatingExp,bold:false },
          ].map((row,i) => (
            <div key={row.label} style={{ display:"flex",
              justifyContent:"space-between", alignItems:"center",
              padding:"10px 0",
              borderBottom: row.bold ? `1.5px solid ${T.border}` : `1px solid ${T.border}` }}>
              <span style={{ fontSize:12, fontWeight:row.bold?800:600,
                color:row.bold?T.textMain:T.textMid }}>{row.label}</span>
              <span style={{ fontSize:row.bold?13:12, fontWeight:row.bold?900:700,
                color:row.value<0?T.red:T.textMain,
                fontFamily:"monospace" }}>
                {row.value<0?"-":""}{fmt(Math.abs(row.value))}
              </span>
            </div>
          ))}

          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", padding:"14px 0 0" }}>
            <span style={{ fontSize:14, fontWeight:900, color:T.textMain }}>
              Net Profit
            </span>
            <span style={{ fontSize:18, fontWeight:900, color:T.green,
              fontFamily:"monospace" }}>{fmt(pnl.netProfit)}</span>
          </div>
          <div style={{ marginTop:10, background:T.greenBg, borderRadius:10,
            padding:"7px 12px", textAlign:"center" }}>
            <span style={{ fontSize:11, fontWeight:800, color:T.green }}>
              {pnl.profitMargin}% profit margin
            </span>
          </div>
        </div>

        {/* ── 12-MONTH TREND ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
            marginBottom:16 }}>Revenue & Profit — 12 Months</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:5, height:100 }}>
            {monthlyTrend.map((m,i) => {
              const revH   = Math.round((m.revenue/maxTrend)*85);
              const profH  = Math.round((m.profit/maxTrend)*85);
              const isLast = i === monthlyTrend.length-1;
              return (
                <div key={m.month} style={{ flex:1,
                  display:"flex", flexDirection:"column",
                  alignItems:"center", gap:5 }}>
                  <div style={{ width:"100%", position:"relative", height:85 }}>
                    <div style={{ position:"absolute", bottom:0, width:"100%",
                      height:revH, borderRadius:"3px 3px 0 0",
                      background:isLast
                        ? `linear-gradient(180deg,${T.navy},${T.navyMid})`
                        : `linear-gradient(180deg,${T.navy}55,${T.navy}22)` }}/>
                    <div style={{ position:"absolute", bottom:0, width:"60%", left:"20%",
                      height:profH, borderRadius:"3px 3px 0 0",
                      background:isLast
                        ? `linear-gradient(180deg,${T.gold},#A07008)`
                        : `linear-gradient(180deg,${T.gold}77,${T.gold}33)` }}/>
                  </div>
                  <span style={{ fontSize:8, fontWeight:isLast?900:600,
                    color:isLast?T.navy:T.textMute }}>{m.month}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:16, justifyContent:"center",
            marginTop:14, paddingTop:14, borderTop:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:8, height:8, borderRadius:2, background:T.navy }}/>
              <span style={{ fontSize:11, color:T.textMute, fontWeight:600 }}>Revenue</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:8, height:8, borderRadius:2, background:T.gold }}/>
              <span style={{ fontSize:11, color:T.textMute, fontWeight:600 }}>Profit</span>
            </div>
          </div>
        </div>

        {/* ── BALANCE SHEET ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
            marginBottom:16 }}>Balance Sheet Snapshot</div>

          <div style={{ fontSize:10, color:T.textMute, fontWeight:800,
            textTransform:"uppercase", letterSpacing:0.6, marginBottom:8 }}>
            Assets
          </div>
          {balanceSheet.assets.map(a => (
            <div key={a.label} style={{ display:"flex", justifyContent:"space-between",
              padding:"7px 0" }}>
              <span style={{ fontSize:12, color:T.textMid }}>{a.label}</span>
              <span style={{ fontSize:12, fontWeight:700, color:T.green,
                fontFamily:"monospace" }}>{fmt(a.amount)}</span>
            </div>
          ))}

          <div style={{ fontSize:10, color:T.textMute, fontWeight:800,
            textTransform:"uppercase", letterSpacing:0.6, margin:"12px 0 8px" }}>
            Liabilities
          </div>
          {balanceSheet.liabilities.map(l => (
            <div key={l.label} style={{ display:"flex", justifyContent:"space-between",
              padding:"7px 0" }}>
              <span style={{ fontSize:12, color:T.textMid }}>{l.label}</span>
              <span style={{ fontSize:12, fontWeight:700, color:T.red,
                fontFamily:"monospace" }}>{fmt(l.amount)}</span>
            </div>
          ))}

          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginTop:12, paddingTop:12,
            borderTop:`1.5px solid ${T.border}` }}>
            <span style={{ fontSize:13, fontWeight:900, color:T.textMain }}>
              Net Worth
            </span>
            <span style={{ fontSize:16, fontWeight:900, color:T.navy,
              fontFamily:"monospace" }}>{fmt(netWorth)}</span>
          </div>
        </div>

        {/* ── TOP PRODUCTS BY PROFIT ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <Icon name="award" size={16} color={T.gold}/>
            <span style={{ fontSize:14, fontWeight:900, color:T.textMain }}>
              Top Products by Profit
            </span>
          </div>
          {topProducts.map((p,i) => (
            <div key={p.name} style={{ display:"flex", gap:12, alignItems:"center",
              padding:"11px 0",
              borderBottom:i<topProducts.length-1?`1px solid ${T.border}`:"none" }}>
              <div style={{ width:26, height:26, borderRadius:8, flexShrink:0,
                background: i===0?T.goldLight:T.navyLight,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:900,
                color:i===0?T.gold:T.textMute }}>
                {i===0?"🥇":i+1}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                  marginBottom:2, overflow:"hidden", textOverflow:"ellipsis",
                  whiteSpace:"nowrap" }}>{p.name}</div>
                <div style={{ fontSize:10, color:T.textMute }}>
                  Revenue: {fmt(p.revenue)}
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:12, fontWeight:900, color:T.green,
                  fontFamily:"monospace" }}>{fmt(p.profit)}</div>
                <div style={{ fontSize:10, color:T.textMute }}>{p.margin}% margin</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── EXPORT ACTIONS ── */}
        <div style={{ display:"flex", gap:10, marginBottom:16 }}>
          <button onClick={exportReport} style={{
            flex:1, padding:"14px 0", borderRadius:16,
            background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
            border:"none", color:"#fff", fontSize:13, fontWeight:900,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            boxShadow:`0 6px 20px ${T.navy}44` }}>
            <Icon name="download" size={16} color="#fff"/>
            Export PDF
          </button>
          <button onClick={() => showToast("Report link copied!", T.blue)} style={{
            width:52, borderRadius:16,
            background:T.navyLight, border:`1px solid ${T.border}`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="share" size={17} color={T.navy}/>
          </button>
        </div>

      </div>

      <BottomNav active="reports"/>
    </div>
  );
}

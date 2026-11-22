import { useState } from "react";

// ============================================================
// 🧱 BH-7 — TAX ASSISTANT
// 🏗️  Part of: Panda Business Hub (Module 3)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 🤖  AI hooks marked with:            // 🤖 AI
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export TaxAssistant from this file
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
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    calculator:   <><rect x="4" y="2" width="16" height="20" rx="2" {...s}/><line x1="8" y1="6" x2="16" y2="6" {...s}/><line x1="8" y1="10" x2="8" y2="10.01" {...s}/><line x1="12" y1="10" x2="12" y2="10.01" {...s}/><line x1="16" y1="10" x2="16" y2="10.01" {...s}/><line x1="8" y1="14" x2="8" y2="14.01" {...s}/><line x1="12" y1="14" x2="12" y2="14.01" {...s}/><line x1="16" y1="14" x2="16" y2="14.01" {...s}/><line x1="8" y1="18" x2="16" y2="18" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    alertTriangle:<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" {...s}/><line x1="12" y1="9" x2="12" y2="13" {...s}/><line x1="12" y1="17" x2="12.01" y2="17" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    grid:         <><rect x="3" y="3" width="7" height="7" {...s}/><rect x="14" y="3" width="7" height="7" {...s}/><rect x="14" y="14" width="7" height="7" {...s}/><rect x="3" y="14" width="7" height="7" {...s}/></>,
    camera:       <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronUp:    <><polyline points="18 15 12 9 6 15" {...s}/></>,
    download:     <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...s}/><polyline points="7 10 12 15 17 10" {...s}/><line x1="12" y1="15" x2="12" y2="3" {...s}/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
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
// 🔌 BACKEND SWAP POINT #1 — TIN VERIFICATION STATUS
// Replace with: supabase.from('businesses')
//   .select('tin_number, tin_verified, tin_verified_at')
//   .eq('id', businessId).single()
// 🔐 SECURITY — TIN verification itself must run via Edge Function:
// supabase.functions.invoke('verify-tin', { body: { tin_number } })
// ============================================================
const MOCK_TAX_PROFILE = {
  tinNumber:     "109-847-322",
  tinVerified:   true,
  vatRegistered: true,
  taxYear:       "2026",
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — VAT CALCULATOR DATA
// Replace with live totals from ledger_entries for the selected period:
// supabase.from('ledger_entries').select('amount,type')
//   .eq('business_id', businessId).gte('date', periodStart).lte('date', periodEnd)
// ============================================================
const MOCK_VAT_SUMMARY = {
  period:          "Q2 2026 (Apr–Jun)",
  taxableSales:    6800000,
  vatCollected:    1224000,  // 18% VAT on sales
  vatOnPurchases:  486000,   // input VAT credit
  vatPayable:      738000,
  filingDeadline:  "Jul 20, 2026",
  daysLeft:        17,
};

// ============================================================
// 🔌 BACKEND SWAP POINT #3 — DEDUCTIBLE EXPENSES
// Replace with: supabase.from('ledger_entries')
//   .select('category, sum(amount)').eq('business_id', businessId)
//   .eq('type','expense').eq('tax_deductible', true).group('category')
// ============================================================
const MOCK_DEDUCTIONS = [
  { category:"Supplier Purchases", amount:2720000, deductible:true  },
  { category:"Rent",               amount:1200000, deductible:true  },
  { category:"Transport & Fuel",   amount:630000,  deductible:true  },
  { category:"Utilities",          amount:540000,  deductible:true  },
  { category:"Staff Wages",        amount:660000,  deductible:true  },
];

// ============================================================
// 🤖 AI SWAP POINT — TAX INSIGHTS & REMINDERS
// Replace with: supabase.functions.invoke('ai-tax-insights', {
//   body: { business_id: businessId }
// })
// ============================================================
const MOCK_AI_TAX_INSIGHTS = [
  {
    id:1, priority:"high", icon:"alertTriangle", color:T.red,
    title:"VAT filing due in 17 days",
    text:"Your Q2 VAT return of TSh 738,000 is due July 20. File early to avoid penalties.",
  },
  {
    id:2, priority:"medium", icon:"sparkle", color:T.purple,
    title:"TSh 5,754,000 in deductible expenses found",
    text:"Panda AI identified these from your bookkeeping automatically. Review before filing to maximize deductions.",
  },
];

const FILING_HISTORY = [
  { period:"Q1 2026 (Jan–Mar)", amount:612000, status:"filed", filedDate:"Apr 15, 2026" },
  { period:"Q4 2025 (Oct–Dec)", amount:589000, status:"filed", filedDate:"Jan 18, 2026" },
  { period:"Q3 2025 (Jul–Sep)", amount:701000, status:"filed", filedDate:"Oct 19, 2025" },
];

// ============================================================
// 🧱 MAIN COMPONENT — TaxAssistant
// ============================================================
export default function App({
  taxProfile   = MOCK_TAX_PROFILE,
  vatSummary   = MOCK_VAT_SUMMARY,
  deductions   = MOCK_DEDUCTIONS,
  aiInsights   = MOCK_AI_TAX_INSIGHTS,
  filingHistory= FILING_HISTORY,

  // 🧭 NAVIGATE
  onBack        = () => {},   // → BH-1 Dashboard
  onFileReturn  = () => {},   // → TRA filing flow (Edge Function submission)
  onNavigate    = () => {},   // → central navigate(screen), e.g. bookkeeping
}) {
  const [expandDeductions, setExpandDeductions] = useState(false);
  const [toast,            setToast]            = useState(null);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  const totalDeductible = deductions.reduce((s,d) => s+d.amount, 0);

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
              letterSpacing:-0.3 }}>Tax Assistant</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>TIN: {taxProfile.tinNumber}</div>
          </div>
          <div style={{ width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="calculator" size={18} color={T.goldMid}/>
          </div>
        </div>

        {/* TIN verified badge */}
        <div style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,0.15)", borderRadius:16,
          padding:"12px 16px", display:"flex", alignItems:"center", gap:10,
          position:"relative" }}>
          <div style={{ width:32, height:32, borderRadius:10,
            background:taxProfile.tinVerified ? "rgba(10,123,75,0.3)" : "rgba(192,57,43,0.3)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="shield" size={15} color={taxProfile.tinVerified ? "#4ADE80" : "#FCA5A5"}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:800, color:"#fff" }}>
              {taxProfile.tinVerified ? "TIN Verified with TRA" : "TIN Not Verified"}
            </div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)" }}>
              {taxProfile.vatRegistered ? "VAT Registered" : "Not VAT Registered"} · Tax Year {taxProfile.taxYear}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── AI TAX INSIGHTS ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <Icon name="sparkle" size={16} color={T.purple}/>
            <span style={{ fontSize:15, fontWeight:900, color:T.textMain,
              letterSpacing:-0.3 }}>AI Tax Insights</span>
          </div>
          {aiInsights.map((insight,i) => (
            <div key={insight.id} style={{ background:T.card, borderRadius:18,
              padding:"14px 16px", marginBottom:10,
              border:`1px solid ${insight.color}22`, boxShadow:T.shadow,
              animation:`fadeUp 0.25s ease ${i*0.06}s both` }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ width:36, height:36, borderRadius:11, flexShrink:0,
                  background:insight.color+"14",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={insight.icon} size={16} color={insight.color}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                    marginBottom:4 }}>{insight.title}</div>
                  <div style={{ fontSize:11, color:T.textMute, lineHeight:1.6 }}>
                    {insight.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── VAT SUMMARY CARD ── */}
        <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
          borderRadius:24, padding:"22px", marginBottom:16,
          position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, opacity:0.05,
            backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize:"16px 16px" }}/>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:16, position:"relative" }}>
            <span style={{ fontSize:13, fontWeight:800, color:"rgba(255,255,255,0.7)" }}>
              {vatSummary.period}
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:6,
              background:"rgba(192,57,43,0.25)", borderRadius:10,
              padding:"5px 11px" }}>
              <Icon name="clock" size={12} color="#FCA5A5"/>
              <span style={{ fontSize:11, fontWeight:800, color:"#FCA5A5" }}>
                {vatSummary.daysLeft} days left
              </span>
            </div>
          </div>

          <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
            fontWeight:700, marginBottom:5, position:"relative" }}>VAT PAYABLE</div>
          <div style={{ fontSize:30, fontWeight:900, color:"#fff",
            fontFamily:"monospace", letterSpacing:-1, marginBottom:18,
            position:"relative" }}>{fmt(vatSummary.vatPayable)}</div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
            gap:8, marginBottom:16, position:"relative" }}>
            {[
              { label:"Taxable Sales", value:vatSummary.taxableSales   },
              { label:"VAT Collected", value:vatSummary.vatCollected   },
              { label:"Input Credit",  value:vatSummary.vatOnPurchases },
            ].map(item => (
              <div key={item.label} style={{ background:"rgba(255,255,255,0.1)",
                borderRadius:12, padding:"10px 8px" }}>
                <div style={{ fontSize:8, color:"rgba(255,255,255,0.55)",
                  fontWeight:700, marginBottom:4, lineHeight:1.3 }}>
                  {item.label.toUpperCase()}
                </div>
                <div style={{ fontSize:11, fontWeight:900, color:"#fff",
                  fontFamily:"monospace" }}>
                  {fmt(item.value).replace("TSh ","")}
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => { onFileReturn(vatSummary); showToast("Filing submitted to TRA!", T.green); }}
            style={{ width:"100%", padding:"14px 0", borderRadius:16,
              background:`linear-gradient(135deg,${T.gold},#A07008)`,
              border:"none", color:"#fff", fontSize:13, fontWeight:900,
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow:`0 6px 20px ${T.gold}44`, position:"relative" }}>
            <Icon name="fileText" size={16} color="#fff"/>
            File VAT Return
          </button>
        </div>

        {/* ── DEDUCTIBLE EXPENSES ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
          <div onClick={() => setExpandDeductions(e => !e)}
            style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", cursor:"pointer",
              marginBottom:expandDeductions?16:0 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
                marginBottom:3 }}>Deductible Expenses</div>
              <div style={{ fontSize:20, fontWeight:900, color:T.green,
                fontFamily:"monospace" }}>{fmt(totalDeductible)}</div>
            </div>
            <Icon name={expandDeductions?"chevronUp":"chevronDown"}
              size={18} color={T.textMute}/>
          </div>
          {expandDeductions && (
            <div style={{ animation:"fadeUp 0.2s ease" }}>
              {deductions.map((d,i) => (
                <div key={d.category} style={{ display:"flex",
                  justifyContent:"space-between", alignItems:"center",
                  padding:"10px 0",
                  borderTop:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <Icon name="check" size={12} color={T.green}/>
                    <span style={{ fontSize:12, color:T.textMid,
                      fontWeight:600 }}>{d.category}</span>
                  </div>
                  <span style={{ fontSize:12, fontWeight:800, color:T.textMain,
                    fontFamily:"monospace" }}>{fmt(d.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── FILING HISTORY ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
            letterSpacing:-0.3, marginBottom:12 }}>Filing History</div>
          <div style={{ background:T.card, borderRadius:22,
            border:`1px solid ${T.border}`, boxShadow:T.shadow, overflow:"hidden" }}>
            {filingHistory.map((f,i) => (
              <div key={f.period} style={{ display:"flex", gap:12,
                alignItems:"center", padding:"14px 16px",
                borderBottom:i<filingHistory.length-1?`1px solid ${T.border}`:"none" }}>
                <div style={{ width:36, height:36, borderRadius:11, flexShrink:0,
                  background:T.greenBg,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="check" size={16} color={T.green}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                    {f.period}
                  </div>
                  <div style={{ fontSize:10, color:T.textMute }}>
                    Filed {f.filedDate}
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:12, fontWeight:900, color:T.navy,
                    fontFamily:"monospace" }}>{fmt(f.amount)}</div>
                  <button onClick={() => showToast("Downloading receipt...", T.navy)}
                    style={{ display:"flex", alignItems:"center", gap:3,
                      background:"none", border:"none", marginTop:2 }}>
                    <Icon name="download" size={10} color={T.blue}/>
                    <span style={{ fontSize:9, fontWeight:700,
                      color:T.blue }}>Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECURITY NOTICE ── */}
        <div style={{ background:T.blueBg, border:`1px solid ${T.blue}22`,
          borderRadius:18, padding:"14px 18px", marginBottom:16,
          display:"flex", gap:12, alignItems:"center" }}>
          <Icon name="lock" size={18} color={T.blue}/>
          <div style={{ fontSize:11, color:T.textMute, lineHeight:1.6 }}>
            {/* 🔐 SECURITY — reassurance copy */}
            TIN and filing data are submitted directly to TRA via secure Edge Functions. Never stored unencrypted on this device.
          </div>
        </div>

      </div>

      <BottomNav active="reports"/>
    </div>
  );
}

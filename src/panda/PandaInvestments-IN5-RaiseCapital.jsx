import { useState } from "react";

// ============================================================
// 🧱 IN-5 — RAISE CAPITAL (Business Side)
// 🏗️  Part of: Panda Investments (Module 5)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export RaiseCapital from this file
//     Props: { businessId, currentUser, onBack, onComplete }
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
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    upload:       <><polyline points="16 16 12 12 8 16" {...s}/><line x1="12" y1="12" x2="12" y2="21" {...s}/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" {...s}/></>,
    percent:      <><line x1="19" y1="5" x2="5" y2="19" {...s}/><circle cx="6.5" cy="6.5" r="2.5" {...s}/><circle cx="17.5" cy="17.5" r="2.5" {...s}/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    alertTriangle:<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" {...s}/><line x1="12" y1="9" x2="12" y2="13" {...s}/><line x1="12" y1="17" x2="12.01" y2="17" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

const STEPS = ["Business", "Funding", "Documents", "Review"];

const CATEGORIES = ["Retail", "Restaurant", "Agriculture", "Manufacturing", "Services", "Technology", "Other"];

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — BUSINESS ELIGIBILITY CHECK
// Replace with: supabase.from('businesses')
//   .select('*,trust_score,business_reports(*)').eq('owner_id', currentUser.id).single()
// Businesses need a minimum Marketplace Trust Score AND at least
// 3 months of Business Hub financial history to raise capital —
// this reuses trust infrastructure already built in Modules 2 & 3.
// ============================================================
const MOCK_BUSINESS_PROFILE = {
  name:"Tech Master Store", trustScore:98, monthsOfHistory:14,
  eligible:true, minTrustRequired:80, minHistoryRequired:3,
};

// ============================================================
// 🧱 MAIN COMPONENT — RaiseCapital
// ============================================================
export default function App({
  businessProfile = MOCK_BUSINESS_PROFILE,
  // 👤 AUTH
  currentUser     = { name:"BAK" },

  // 🧭 NAVIGATE
  onBack      = () => {},   // → IN-1 Dashboard
  onComplete  = () => {},   // → confirmation / pending review screen
}) {
  const [step,           setStep]           = useState(0);
  const [category,       setCategory]       = useState("");
  const [fundingGoal,     setFundingGoal]     = useState(1000000);
  const [returnRate,     setReturnRate]     = useState(15);
  const [purpose,        setPurpose]        = useState("");
  const [documents,      setDocuments]      = useState({
    businessVerified: true, financials: false, bankStatement: false,
  });
  const [submitting,     setSubmitting]     = useState(false);
  const [submitted,      setSubmitted]      = useState(false);
  const [toast,           setToast]          = useState(null);

  const showToast = (msg, color = T.red) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const canProceed = () => {
    if (step === 0) return category !== "";
    if (step === 1) return fundingGoal > 0 && returnRate > 0 && purpose.trim().length > 10;
    if (step === 2) return documents.businessVerified && documents.financials && documents.bankStatement;
    return true;
  };

  const nextStep = () => {
    if (!canProceed()) { showToast("Please complete this step before continuing"); return; }
    if (step < STEPS.length - 1) setStep(s => s+1);
  };

  const toggleDocument = (key) => setDocuments(d => ({ ...d, [key]: !d[key] }));

  // 🔌 BACKEND — submit for review
  // supabase.from('investment_opportunities').insert({
  //   business_id: businessProfile.id, category, funding_goal: fundingGoal,
  //   return_rate: returnRate, purpose, status: 'pending_review'
  // })
  // 🔐 SECURITY — listing goes to a Panda review queue before going live;
  // this is NOT auto-published, unlike Panda Direct loan auto-approval.
  const submitForReview = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  // ── NOT ELIGIBLE SCREEN ──────────────────────────────────────────
  if (!businessProfile.eligible) return (
    <div style={{
      background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto",
      display:"flex", alignItems:"center", justifyContent:"center", padding:24,
    }}>
      <style>{`* { box-sizing:border-box; } button { font-family:inherit; cursor:pointer; border:none; }`}</style>
      <div style={{ width:"100%", textAlign:"center" }}>
        <div style={{ width:80, height:80, borderRadius:"50%",
          background:T.amberBg, border:`3px solid ${T.amber}33`,
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 20px", fontSize:36 }}>🔒</div>
        <div style={{ fontSize:20, fontWeight:900, color:T.textMain,
          marginBottom:8 }}>Not Yet Eligible</div>
        <div style={{ fontSize:13, color:T.textMute, marginBottom:24, lineHeight:1.7 }}>
          Raising capital requires a Trust Score of {businessProfile.minTrustRequired}+
          and {businessProfile.minHistoryRequired}+ months of Business Hub history.
        </div>
        <div style={{ background:T.card, borderRadius:20, padding:"18px",
          border:`1px solid ${T.border}`, boxShadow:T.shadow, marginBottom:20,
          textAlign:"left" }}>
          {[
            { label:"Marketplace Trust Score", have:businessProfile.trustScore, need:businessProfile.minTrustRequired },
            { label:"Months of History",         have:businessProfile.monthsOfHistory, need:businessProfile.minHistoryRequired },
          ].map(row => (
            <div key={row.label} style={{ display:"flex", justifyContent:"space-between",
              padding:"8px 0" }}>
              <span style={{ fontSize:12, color:T.textMute }}>{row.label}</span>
              <span style={{ fontSize:12, fontWeight:800,
                color:row.have>=row.need?T.green:T.red }}>{row.have} / {row.need} needed</span>
            </div>
          ))}
        </div>
        <button onClick={onBack} style={{
          width:"100%", padding:"14px 0", borderRadius:16,
          background:T.navy, border:"none", color:"#fff",
          fontSize:13, fontWeight:800 }}>
          Back to Portfolio
        </button>
      </div>
    </div>
  );

  // ── SUCCESS SCREEN ──────────────────────────────────────────────
  if (submitted) return (
    <div style={{
      background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto",
      display:"flex", alignItems:"center", justifyContent:"center", padding:24,
    }}>
      <style>{`
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        * { box-sizing:border-box; } button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>
      <div style={{ width:"100%", textAlign:"center" }}>
        <div style={{ width:90, height:90, borderRadius:"50%",
          background:T.blueBg, border:`3px solid ${T.blue}44`,
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 20px", fontSize:40,
          animation:"bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>📋</div>
        <div style={{ fontSize:22, fontWeight:900, color:T.textMain,
          marginBottom:6 }}>Submitted for Review</div>
        <div style={{ fontSize:13, color:T.textMute, marginBottom:24, lineHeight:1.7 }}>
          Panda's team reviews every listing before it goes live to investors.
          You'll be notified within 3–5 business days.
        </div>
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          border:`1px solid ${T.border}`, boxShadow:T.shadowMd, marginBottom:20,
          textAlign:"left" }}>
          {[
            { label:"Funding Goal", value:fmt(fundingGoal) },
            { label:"Return Rate",   value:`${returnRate}% p.a.` },
            { label:"Category",     value:category },
          ].map((row,i,arr) => (
            <div key={row.label} style={{ display:"flex", justifyContent:"space-between",
              padding:"9px 0", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
              <span style={{ fontSize:12, color:T.textMute }}>{row.label}</span>
              <span style={{ fontSize:12, fontWeight:800, color:T.textMain,
                fontFamily:"monospace" }}>{row.value}</span>
            </div>
          ))}
        </div>
        <button onClick={onComplete} style={{
          width:"100%", padding:"15px 0", borderRadius:18,
          background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
          border:"none", color:"#fff", fontSize:14, fontWeight:900,
          boxShadow:`0 6px 20px ${T.navy}44` }}>
          Back to Portfolio
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:40,
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input,textarea { font-family:inherit; }
        input::placeholder,textarea::placeholder { color:${T.textMute}; }
      `}</style>

      {toast && (
        <div style={{
          position:"fixed", bottom:40, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:T.white,
          border:`1px solid ${toast.color}33`, borderLeft:`4px solid ${toast.color}`,
          borderRadius:14, padding:"12px 20px", boxShadow:T.shadowLg,
          whiteSpace:"nowrap", animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>{toast.msg}</span>
        </div>
      )}

      {submitting && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.9)",
          display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", maxWidth:430, margin:"0 auto" }}>
          <div style={{ width:56, height:56, borderRadius:"50%",
            border:`4px solid rgba(255,255,255,0.2)`, borderTopColor:T.gold,
            animation:"spin 1s linear infinite", marginBottom:20 }}/>
          <div style={{ fontSize:14, fontWeight:800, color:"#fff" }}>
            Submitting for review...
          </div>
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
          <button onClick={step===0 ? onBack : () => setStep(s=>s-1)} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="arrowLeft" size={18} color="#fff"/>
          </button>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:16, fontWeight:900, color:"#fff",
              letterSpacing:-0.3 }}>Raise Capital</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>{businessProfile.name}</div>
          </div>
          <div style={{ width:40 }}/>
        </div>

        {/* Step progress */}
        <div style={{ display:"flex", gap:6, position:"relative" }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex:1 }}>
              <div style={{ height:4, borderRadius:99,
                background: i<=step ? T.gold : "rgba(255,255,255,0.2)" }}/>
              <div style={{ fontSize:9, fontWeight:i===step?800:600,
                color:i<=step?"#fff":"rgba(255,255,255,0.5)",
                marginTop:6, textAlign:"center" }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"20px 20px 0" }}>

        {/* ══ STEP 1 — BUSINESS ══ */}
        {step === 0 && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
              borderRadius:16, padding:"14px 16px", marginBottom:18,
              display:"flex", gap:10, alignItems:"center" }}>
              <Icon name="shield" size={16} color={T.green}/>
              <span style={{ fontSize:11, color:T.green, fontWeight:700 }}>
                Trust Score {businessProfile.trustScore}/100 · {businessProfile.monthsOfHistory} months verified
              </span>
            </div>

            <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
              marginBottom:6 }}>What kind of business?</div>
            <div style={{ fontSize:12, color:T.textMute, marginBottom:18 }}>
              Helps investors find your opportunity
            </div>
            {CATEGORIES.map(c => (
              <div key={c} onClick={() => setCategory(c)} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"14px 16px", borderRadius:16, marginBottom:8,
                background:category===c ? T.navyLight : T.card,
                border:`1.5px solid ${category===c ? T.navy+"33" : T.border}`,
                cursor:"pointer", boxShadow:T.shadow }}>
                <span style={{ fontSize:13, fontWeight:category===c?800:600,
                  color:category===c ? T.navy : T.textMid }}>{c}</span>
                {category===c && <Icon name="check" size={16} color={T.navy}/>}
              </div>
            ))}
          </div>
        )}

        {/* ══ STEP 2 — FUNDING ══ */}
        {step === 1 && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ background:T.card, borderRadius:24, padding:"24px",
              boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}`,
              textAlign:"center" }}>
              <div style={{ fontSize:12, color:T.textMute, fontWeight:700,
                marginBottom:10 }}>HOW MUCH DO YOU WANT TO RAISE?</div>
              <div style={{ fontSize:32, fontWeight:900, color:T.navy,
                fontFamily:"monospace", marginBottom:16 }}>
                {fmt(fundingGoal)}
              </div>
              <input type="range" min={100000} max={10000000} step={50000}
                value={fundingGoal} onChange={e => setFundingGoal(parseInt(e.target.value))}
                style={{ width:"100%", accentColor:T.gold }}/>
              <div style={{ display:"flex", justifyContent:"space-between",
                marginTop:6 }}>
                <span style={{ fontSize:10, color:T.textMute }}>TSh 100,000</span>
                <span style={{ fontSize:10, color:T.textMute }}>TSh 10,000,000</span>
              </div>
            </div>

            <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
              marginBottom:10 }}>Return Rate You're Offering Investors</div>
            <div style={{ background:T.card, borderRadius:20, padding:"18px",
              boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}`,
              textAlign:"center" }}>
              <div style={{ fontSize:28, fontWeight:900, color:T.gold,
                fontFamily:"monospace", marginBottom:14 }}>{returnRate}% p.a.</div>
              <input type="range" min={5} max={30} step={0.5}
                value={returnRate} onChange={e => setReturnRate(parseFloat(e.target.value))}
                style={{ width:"100%", accentColor:T.gold }}/>
              <div style={{ fontSize:10, color:T.textMute, marginTop:10, lineHeight:1.6 }}>
                Higher rates attract investors faster but cost your business more.
                Similar businesses on Panda offer 15–22%.
              </div>
            </div>

            <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
              marginBottom:10 }}>What will this funding be used for?</div>
            <textarea value={purpose} onChange={e => setPurpose(e.target.value)}
              placeholder="e.g. Opening two new store locations in Dar es Salaam, purchasing additional inventory..."
              rows={4}
              style={{ width:"100%", background:T.navyLight,
                border:`1.5px solid ${T.border}`, borderRadius:14,
                padding:"12px 16px", color:T.textMain, fontSize:13,
                outline:"none", resize:"none", lineHeight:1.6,
                boxSizing:"border-box" }}/>
          </div>
        )}

        {/* ══ STEP 3 — DOCUMENTS ══ */}
        {step === 2 && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
              marginBottom:6 }}>Verify Your Business</div>
            <div style={{ fontSize:12, color:T.textMute, marginBottom:18 }}>
              Investors need transparency before committing funds
            </div>

            {[
              { key:"businessVerified", label:"Business Verification (BRELA/TIN)", desc:"Already verified from your Marketplace profile", icon:"shield", locked:true  },
              { key:"financials",       label:"Business Hub Financial Reports",     desc:"Share your P&L and cash flow history with investors", icon:"briefcase", locked:false },
              { key:"bankStatement",    label:"6-Month Bank/Wallet Statement",       desc:"Auto-generated from your Panda Wallet history",         icon:"fileText", locked:false },
            ].map(doc => (
              <div key={doc.key} style={{ background:T.card, borderRadius:18,
                padding:"14px 16px", marginBottom:10,
                border:`1.5px solid ${documents[doc.key] ? T.green+"33" : T.border}`,
                boxShadow:T.shadow,
                display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:38, height:38, borderRadius:11, flexShrink:0,
                  background:documents[doc.key] ? T.greenBg : T.navyLight,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={doc.icon} size={17}
                    color={documents[doc.key] ? T.green : T.textMute}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                    {doc.label}
                  </div>
                  <div style={{ fontSize:10, color:T.textMute, marginTop:2 }}>
                    {doc.desc}
                  </div>
                </div>
                {doc.locked ? (
                  <div style={{ background:T.greenBg, borderRadius:8, padding:"4px 8px" }}>
                    <Icon name="check" size={12} color={T.green}/>
                  </div>
                ) : (
                  <button onClick={() => toggleDocument(doc.key)} style={{
                    width:36, height:36, borderRadius:10, flexShrink:0,
                    background:documents[doc.key] ? T.greenBg : T.navyLight,
                    border:`1px solid ${documents[doc.key] ? T.green+"33" : T.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name={documents[doc.key] ? "check" : "upload"} size={15}
                      color={documents[doc.key] ? T.green : T.navy}/>
                  </button>
                )}
              </div>
            ))}

            <div style={{ background:T.amberBg, border:`1px solid ${T.amber}22`,
              borderRadius:14, padding:"12px 16px", marginTop:8,
              display:"flex", gap:10, alignItems:"flex-start" }}>
              <Icon name="alertTriangle" size={14} color={T.amber}/>
              <span style={{ fontSize:11, color:T.amber, fontWeight:600, lineHeight:1.6 }}>
                All listings are reviewed by Panda's team before going live —
                this is not instant, unlike Panda Capital loan approvals.
              </span>
            </div>
          </div>
        )}

        {/* ══ STEP 4 — REVIEW ══ */}
        {step === 3 && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
              marginBottom:16 }}>Review Your Listing</div>

            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", gap:12, alignItems:"center",
                marginBottom:16, paddingBottom:16,
                borderBottom:`1px solid ${T.border}` }}>
                <div style={{ width:44, height:44, borderRadius:14, flexShrink:0,
                  background:`linear-gradient(135deg,${T.purple}22,${T.purple}44)`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="briefcase" size={18} color={T.purple}/>
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:900, color:T.textMain }}>
                    {businessProfile.name}
                  </div>
                  <div style={{ fontSize:11, color:T.textMute }}>{category}</div>
                </div>
              </div>

              {[
                { label:"Funding Goal", value:fmt(fundingGoal) },
                { label:"Return Rate",   value:`${returnRate}% p.a.` },
                { label:"Purpose",       value:purpose },
              ].map((row,i,arr) => (
                <div key={row.label} style={{ display:"flex", justifyContent:"space-between",
                  padding:"9px 0", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none",
                  gap:12 }}>
                  <span style={{ fontSize:12, color:T.textMute, flexShrink:0 }}>{row.label}</span>
                  <span style={{ fontSize:12, fontWeight:800, color:T.textMain,
                    fontFamily:row.label==="Purpose"?"inherit":"monospace",
                    textAlign:"right" }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{ background:T.blueBg, border:`1px solid ${T.blue}22`,
              borderRadius:14, padding:"12px 16px", marginBottom:20,
              display:"flex", gap:10, alignItems:"center" }}>
              <Icon name="lock" size={14} color={T.blue}/>
              <span style={{ fontSize:11, color:T.blue, fontWeight:600, lineHeight:1.5 }}>
                Once approved, this listing becomes visible to all eligible investors on Panda.
              </span>
            </div>
          </div>
        )}

        {/* ── NAVIGATION ── */}
        <button onClick={step === STEPS.length-1 ? submitForReview : nextStep} style={{
          width:"100%", padding:"16px 0", borderRadius:18, marginBottom:16,
          background:`linear-gradient(135deg,${T.gold},#A07008)`,
          border:"none", color:"#fff", fontSize:14, fontWeight:900,
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          boxShadow:`0 6px 20px ${T.gold}44` }}>
          {step === STEPS.length-1 ? (
            <>
              <Icon name="check" size={17} color="#fff"/>
              Submit for Review
            </>
          ) : "Continue"}
        </button>

      </div>
    </div>
  );
}

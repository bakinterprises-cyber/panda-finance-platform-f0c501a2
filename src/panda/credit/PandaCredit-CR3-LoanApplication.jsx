import { useState } from "react";

// ============================================================
// 🧱 CR-3 — LOAN APPLICATION
// 🏗️  Part of: Panda Credit (Module 4)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export LoanApplication from this file
//     Props: { offer, currentUser, onBack, onComplete }
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
    dollarSign:   <><line x1="12" y1="1" x2="12" y2="23" {...s}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...s}/></>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    upload:       <><polyline points="16 16 12 12 8 16" {...s}/><line x1="12" y1="12" x2="12" y2="21" {...s}/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" {...s}/></>,
    camera:       <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    calculator:   <><rect x="4" y="2" width="16" height="20" rx="2" {...s}/><line x1="8" y1="6" x2="16" y2="6" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ============================================================
// 🔌 DEFAULT OFFER — normally passed in from CR-2 selection
// ============================================================
const MOCK_OFFER = {
  id:"LN-001", lender:"Panda Capital", lenderInitials:"PC", color:T.navy,
  minAmount:100000, maxAmount:1000000, interestRate:8.5,
  termMonths:[3,6,12], processingFee:1.5, minScore:670,
};

const PURPOSES = [
  "Inventory Restock", "Equipment Purchase", "Business Expansion",
  "Working Capital", "Marketing & Promotion", "Emergency Fund", "Other",
];

const STEPS = ["Amount", "Purpose", "Documents", "Review"];

// ============================================================
// 🧱 MAIN COMPONENT — LoanApplication
// ============================================================
export default function App({
  offer       = MOCK_OFFER,
  // 👤 AUTH
  currentUser = { name:"BAK", initials:"B", score:742 },

  // 🧭 NAVIGATE
  onBack      = () => {},   // → CR-2 Loan Marketplace
  onComplete  = () => {},   // → CR-4 Active Loans (after submission)
}) {
  const [step,          setStep]          = useState(0);
  const [amount,         setAmount]        = useState(offer.minAmount);
  const [term,           setTerm]          = useState(offer.termMonths[0]);
  const [purpose,        setPurpose]       = useState("");
  const [customPurpose,  setCustomPurpose] = useState("");
  const [documents,      setDocuments]     = useState({
    idVerified: true, businessProof: false, bankStatement: false,
  });
  const [submitting,    setSubmitting]    = useState(false);
  const [submitted,     setSubmitted]     = useState(false);
  const [toast,         setToast]         = useState(null);

  const showToast = (msg, color = T.red) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  // Loan calculations
  const monthlyRate     = offer.interestRate / 100 / 12;
  const totalInterest   = Math.round(amount * (offer.interestRate/100) * (term/12));
  const processingFee   = Math.round(amount * (offer.processingFee/100));
  const totalRepayment  = amount + totalInterest;
  const monthlyPayment  = Math.round(totalRepayment / term);
  const disbursedAmount = amount - processingFee;

  const canProceed = () => {
    if (step === 0) return amount >= offer.minAmount && amount <= offer.maxAmount;
    if (step === 1) return purpose !== "" && (purpose !== "Other" || customPurpose.trim());
    if (step === 2) return documents.idVerified && documents.businessProof && documents.bankStatement;
    return true;
  };

  const nextStep = () => {
    if (!canProceed()) {
      showToast("Please complete this step before continuing");
      return;
    }
    if (step < STEPS.length - 1) setStep(s => s+1);
  };

  // 🔌 BACKEND — submit loan application
  // supabase.from('loan_applications').insert({
  //   user_id: currentUser.id, offer_id: offer.id, amount, term_months: term,
  //   purpose: purpose === "Other" ? customPurpose : purpose,
  //   status: 'pending_review'
  // })
  // 🔐 SECURITY — documents uploaded to encrypted Supabase Storage bucket
  const submitApplication = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2200);
  };

  const toggleDocument = (key) => {
    setDocuments(d => ({ ...d, [key]: !d[key] }));
  };

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
        * { box-sizing:border-box; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>
      <div style={{ width:"100%", textAlign:"center" }}>
        <div style={{ width:90, height:90, borderRadius:"50%",
          background:T.greenBg, border:`3px solid ${T.green}44`,
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 20px", fontSize:40,
          animation:"bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>✅</div>
        <div style={{ fontSize:22, fontWeight:900, color:T.textMain,
          marginBottom:6 }}>Application Submitted!</div>
        <div style={{ fontSize:13, color:T.textMute, marginBottom:24,
          lineHeight:1.7 }}>
          {offer.lender} is reviewing your application.<br/>
          You'll be notified within {offer.approvalTime || "24 hours"}.
        </div>

        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          border:`1px solid ${T.border}`, boxShadow:T.shadowMd, marginBottom:20,
          textAlign:"left" }}>
          <div style={{ fontSize:11, color:T.textMute, fontWeight:700,
            textTransform:"uppercase", marginBottom:12 }}>Application Summary</div>
          {[
            { label:"Loan Amount",  value:fmt(amount) },
            { label:"Term",         value:`${term} months` },
            { label:"Purpose",      value:purpose === "Other" ? customPurpose : purpose },
            { label:"Est. Monthly Payment", value:fmt(monthlyPayment) },
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
          View My Loans
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
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
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

      {/* ── SUBMITTING OVERLAY ── */}
      {submitting && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.9)",
          display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", maxWidth:430, margin:"0 auto" }}>
          <div style={{ width:56, height:56, borderRadius:"50%",
            border:`4px solid rgba(255,255,255,0.2)`, borderTopColor:T.gold,
            animation:"spin 1s linear infinite", marginBottom:20 }}/>
          <div style={{ fontSize:14, fontWeight:800, color:"#fff" }}>
            Submitting your application...
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
              letterSpacing:-0.3 }}>Loan Application</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>{offer.lender}</div>
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

        {/* ══ STEP 1 — AMOUNT ══ */}
        {step === 0 && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ background:T.card, borderRadius:24, padding:"24px",
              boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}`,
              textAlign:"center" }}>
              <div style={{ fontSize:12, color:T.textMute, fontWeight:700,
                marginBottom:10 }}>HOW MUCH DO YOU NEED?</div>
              <div style={{ fontSize:36, fontWeight:900, color:T.navy,
                fontFamily:"monospace", marginBottom:16 }}>
                {fmt(amount)}
              </div>
              <input type="range" min={offer.minAmount} max={offer.maxAmount}
                step={10000} value={amount}
                onChange={e => setAmount(parseInt(e.target.value))}
                style={{ width:"100%", accentColor:T.gold }}/>
              <div style={{ display:"flex", justifyContent:"space-between",
                marginTop:6 }}>
                <span style={{ fontSize:10, color:T.textMute }}>{fmt(offer.minAmount)}</span>
                <span style={{ fontSize:10, color:T.textMute }}>{fmt(offer.maxAmount)}</span>
              </div>
            </div>

            <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
              marginBottom:10 }}>Repayment Term</div>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {offer.termMonths.map(m => (
                <button key={m} onClick={() => setTerm(m)} style={{
                  flex:1, padding:"12px 0", borderRadius:14,
                  background:term===m ? T.navy : T.card,
                  border:term===m ? "none" : `1px solid ${T.border}`,
                  color:term===m ? "#fff" : T.textMid,
                  fontSize:13, fontWeight:800,
                  boxShadow:term===m ? `0 4px 12px ${T.navy}33` : T.shadow,
                }}>{m} months</button>
              ))}
            </div>

            {/* Live calculation */}
            <div style={{ background:T.goldLight, border:`1px solid ${T.gold}33`,
              borderRadius:18, padding:"16px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <Icon name="calculator" size={15} color={T.gold}/>
                <span style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                  Estimated Repayment
                </span>
              </div>
              {[
                { label:"Monthly Payment", value:monthlyPayment, bold:true },
                { label:"Total Interest",  value:totalInterest,  bold:false },
                { label:"Processing Fee",  value:processingFee,  bold:false },
                { label:"You'll Receive",  value:disbursedAmount,bold:false },
              ].map(row => (
                <div key={row.label} style={{ display:"flex", justifyContent:"space-between",
                  padding:"5px 0" }}>
                  <span style={{ fontSize:11, color:T.textMid,
                    fontWeight:row.bold?700:500 }}>{row.label}</span>
                  <span style={{ fontSize:row.bold?13:11, fontWeight:row.bold?900:700,
                    color:T.textMain, fontFamily:"monospace" }}>{fmt(row.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ STEP 2 — PURPOSE ══ */}
        {step === 1 && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
              marginBottom:6 }}>What's this loan for?</div>
            <div style={{ fontSize:12, color:T.textMute, marginBottom:18 }}>
              This helps lenders understand your business needs
            </div>
            {PURPOSES.map(p => (
              <div key={p} onClick={() => setPurpose(p)} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"14px 16px", borderRadius:16, marginBottom:8,
                background:purpose===p ? T.navyLight : T.card,
                border:`1.5px solid ${purpose===p ? T.navy+"33" : T.border}`,
                cursor:"pointer", boxShadow:T.shadow }}>
                <span style={{ fontSize:13, fontWeight:purpose===p?800:600,
                  color:purpose===p ? T.navy : T.textMid }}>{p}</span>
                {purpose===p && <Icon name="check" size={16} color={T.navy}/>}
              </div>
            ))}
            {purpose === "Other" && (
              <textarea value={customPurpose} onChange={e => setCustomPurpose(e.target.value)}
                placeholder="Describe what this loan is for..." rows={3}
                style={{ width:"100%", background:T.navyLight,
                  border:`1.5px solid ${T.border}`, borderRadius:14,
                  padding:"12px 16px", color:T.textMain, fontSize:13,
                  outline:"none", resize:"none", lineHeight:1.6,
                  boxSizing:"border-box", marginTop:6 }}/>
            )}
          </div>
        )}

        {/* ══ STEP 3 — DOCUMENTS ══ */}
        {step === 2 && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
              marginBottom:6 }}>Verify Your Documents</div>
            <div style={{ fontSize:12, color:T.textMute, marginBottom:18 }}>
              Required for lender review
            </div>

            {[
              { key:"idVerified",    label:"National ID (NIDA)",     desc:"Already verified from your Panda profile", icon:"shield", locked:true  },
              { key:"businessProof", label:"Business Verification",  desc:"BRELA registration or trading license",     icon:"fileText", locked:false },
              { key:"bankStatement", label:"3-Month Bank/Wallet Statement", desc:"Auto-generated from your Panda Wallet history", icon:"wallet", locked:false },
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

            <div style={{ background:T.blueBg, border:`1px solid ${T.blue}22`,
              borderRadius:14, padding:"12px 16px", marginTop:8,
              display:"flex", gap:10, alignItems:"center" }}>
              <Icon name="lock" size={14} color={T.blue}/>
              <span style={{ fontSize:11, color:T.blue, fontWeight:600, lineHeight:1.5 }}>
                {/* 🔐 SECURITY */}
                All documents are encrypted and shared only with your selected lender.
              </span>
            </div>
          </div>
        )}

        {/* ══ STEP 4 — REVIEW ══ */}
        {step === 3 && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
              marginBottom:16 }}>Review Your Application</div>

            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", gap:12, alignItems:"center",
                marginBottom:16, paddingBottom:16,
                borderBottom:`1px solid ${T.border}` }}>
                <div style={{ width:44, height:44, borderRadius:14, flexShrink:0,
                  background:`linear-gradient(135deg,${offer.color}22,${offer.color}44)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:14, fontWeight:900, color:offer.color }}>
                  {offer.lenderInitials}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:900, color:T.textMain }}>
                    {offer.lender}
                  </div>
                  <div style={{ fontSize:11, color:T.textMute }}>
                    {offer.interestRate}% interest · {term} months
                  </div>
                </div>
              </div>

              {[
                { label:"Loan Amount",     value:fmt(amount) },
                { label:"Purpose",         value:purpose === "Other" ? customPurpose : purpose },
                { label:"Processing Fee",  value:fmt(processingFee) },
                { label:"You'll Receive",  value:fmt(disbursedAmount) },
                { label:"Monthly Payment", value:fmt(monthlyPayment) },
                { label:"Total Repayment", value:fmt(totalRepayment) },
              ].map((row,i,arr) => (
                <div key={row.label} style={{ display:"flex", justifyContent:"space-between",
                  padding:"9px 0", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
                  <span style={{ fontSize:12, color:T.textMute }}>{row.label}</span>
                  <span style={{ fontSize:12, fontWeight:800, color:T.textMain,
                    fontFamily:"monospace" }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
              borderRadius:14, padding:"12px 16px", marginBottom:20,
              display:"flex", gap:10, alignItems:"center" }}>
              <Icon name="award" size={16} color={T.green}/>
              <span style={{ fontSize:11, color:T.green, fontWeight:700 }}>
                Panda Score {currentUser.score} qualifies you for this offer
              </span>
            </div>
          </div>
        )}

        {/* ── NAVIGATION BUTTONS ── */}
        <button onClick={step === STEPS.length-1 ? submitApplication : nextStep} style={{
          width:"100%", padding:"16px 0", borderRadius:18, marginBottom:16,
          background:`linear-gradient(135deg,${T.gold},#A07008)`,
          border:"none", color:"#fff", fontSize:14, fontWeight:900,
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          boxShadow:`0 6px 20px ${T.gold}44` }}>
          {step === STEPS.length-1 ? (
            <>
              <Icon name="check" size={17} color="#fff"/>
              Submit Application
            </>
          ) : (
            <>
              Continue
              <Icon name="arrowLeft" size={16} color="#fff"
                style={{ transform:"rotate(180deg)" }}/>
            </>
          )}
        </button>

      </div>
    </div>
  );
}

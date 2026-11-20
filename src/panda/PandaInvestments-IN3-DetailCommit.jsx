import { useState } from "react";

// ============================================================
// 🧱 IN-3 — INVESTMENT DETAIL & COMMIT
// 🏗️  Part of: Panda Investments (Module 5)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export InvestmentDetail from this file
//     Props: { opportunity, currentUser, onBack, onComplete }
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
    percent:      <><line x1="19" y1="5" x2="5" y2="19" {...s}/><circle cx="6.5" cy="6.5" r="2.5" {...s}/><circle cx="17.5" cy="17.5" r="2.5" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    alertTriangle:<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" {...s}/><line x1="12" y1="9" x2="12" y2="13" {...s}/><line x1="12" y1="17" x2="12.01" y2="17" {...s}/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    calculator:   <><rect x="4" y="2" width="16" height="20" rx="2" {...s}/><line x1="8" y1="6" x2="16" y2="6" {...s}/></>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronUp:    <><polyline points="18 15 12 9 6 15" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ============================================================
// 🔌 DEFAULT OPPORTUNITY — normally passed from IN-2 selection
// ============================================================
const MOCK_OPPORTUNITY = {
  id:"OPP-003", type:"business_equity", featured:true,
  name:"Fatuma Hardware Ltd — Growth Round", issuer:"Fatuma Hardware Ltd",
  issuerInitials:"FH", color:T.purple,
  returnRate:18.0, termMonths:null, minInvestment:100000, maxInvestment:3000000,
  fundedPct:82, riskLevel:"high", minTier:"good",
  trustScore:91, businessAge:"3 years",
  description:"Revenue-share investment in an established hardware retailer expanding to two new locations in Dar es Salaam.",
};

const RISK_CONFIG = {
  low:    { label:"Low Risk",    color:T.green },
  medium: { label:"Medium Risk", color:T.amber },
  high:   { label:"Higher Risk", color:T.red   },
};

// ============================================================
// 🧱 MAIN COMPONENT — InvestmentDetail
// ============================================================
export default function App({
  opportunity = MOCK_OPPORTUNITY,
  // 👤 AUTH
  currentUser = { name:"BAK", walletBalance:842500 },

  // 🧭 NAVIGATE
  onBack      = () => {},   // → IN-2 Investment Marketplace
  onComplete  = () => {},   // → IN-4 Portfolio & Returns
}) {
  const [amount,      setAmount]      = useState(opportunity.minInvestment);
  const [showBusiness, setShowBusiness]= useState(false);
  const [agreed,      setAgreed]      = useState(false);
  const [confirming,  setConfirming]  = useState(false);
  const [committed,   setCommitted]   = useState(false);
  const [toast,       setToast]       = useState(null);

  const showToast = (msg, color = T.red) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const risk = RISK_CONFIG[opportunity.riskLevel];
  const isFixedReturn = opportunity.type === "fixed_return";

  // Projected returns calculation
  const projectedReturn = isFixedReturn && opportunity.termMonths
    ? Math.round(amount * (opportunity.returnRate/100) * (opportunity.termMonths/12))
    : Math.round(amount * (opportunity.returnRate/100)); // annualized estimate for equity/revenue-share
  const projectedTotal = amount + projectedReturn;

  const canInvest = amount >= opportunity.minInvestment &&
                     amount <= opportunity.maxInvestment &&
                     amount <= currentUser.walletBalance;

  // 🔌 BACKEND — commit investment
  // supabase.from('investments').insert({
  //   investor_id: currentUser.id, opportunity_id: opportunity.id,
  //   amount, status: 'active'
  // })
  // 💰 WALLET — PandaWallet.invest({ amount, opportunity_id })
  // 🔐 SECURITY — funds move via Edge Function, never client-side balance mutation
  const confirmInvestment = () => {
    if (amount > currentUser.walletBalance) {
      showToast("Insufficient wallet balance");
      return;
    }
    if (!agreed) {
      showToast("Please acknowledge the risk disclosure first");
      return;
    }
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setCommitted(true);
    }, 1800);
  };

  // ── SUCCESS SCREEN ──────────────────────────────────────────────
  if (committed) return (
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
          marginBottom:6 }}>Investment Confirmed!</div>
        <div style={{ fontSize:13, color:T.textMute, marginBottom:24,
          lineHeight:1.7 }}>
          You've invested {fmt(amount)} in<br/>{opportunity.name}
        </div>

        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          border:`1px solid ${T.border}`, boxShadow:T.shadowMd, marginBottom:20,
          textAlign:"left" }}>
          {[
            { label:"Amount Invested",     value:fmt(amount) },
            { label:"Expected Return",     value:`${opportunity.returnRate}% p.a.` },
            { label:"Projected Value",     value:fmt(projectedTotal) },
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
          View My Portfolio
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

      {confirming && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.9)",
          display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", maxWidth:430, margin:"0 auto" }}>
          <div style={{ width:56, height:56, borderRadius:"50%",
            border:`4px solid rgba(255,255,255,0.2)`, borderTopColor:T.gold,
            animation:"spin 1s linear infinite", marginBottom:20 }}/>
          <div style={{ fontSize:14, fontWeight:800, color:"#fff" }}>
            Processing your investment...
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
          <button onClick={onBack} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="arrowLeft" size={18} color="#fff"/>
          </button>
          <div style={{ fontSize:16, fontWeight:900, color:"#fff" }}>
            Investment Details
          </div>
          <div style={{ width:40 }}/>
        </div>

        <div style={{ display:"flex", gap:12, alignItems:"center", position:"relative" }}>
          <div style={{ width:48, height:48, borderRadius:15, flexShrink:0,
            background:`linear-gradient(135deg,${opportunity.color}33,${opportunity.color}66)`,
            border:"2px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:15, fontWeight:900, color:"#fff" }}>
            {opportunity.issuerInitials}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:900, color:"#fff" }}>
              {opportunity.name}
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)", marginTop:2 }}>
              {opportunity.issuer}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"20px 20px 0" }}>

        {/* ── KEY STATS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
          gap:8, marginBottom:16 }}>
          <div style={{ background:T.card, borderRadius:16, padding:"12px 10px",
            border:`1px solid ${T.border}`, boxShadow:T.shadow, textAlign:"center" }}>
            <Icon name="percent" size={14} color={T.green}/>
            <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
              marginTop:6, fontFamily:"monospace" }}>{opportunity.returnRate}%</div>
            <div style={{ fontSize:9, color:T.textMute }}>return</div>
          </div>
          <div style={{ background:T.card, borderRadius:16, padding:"12px 10px",
            border:`1px solid ${T.border}`, boxShadow:T.shadow, textAlign:"center" }}>
            <Icon name="clock" size={14} color={T.blue}/>
            <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
              marginTop:6 }}>{opportunity.termMonths ? `${opportunity.termMonths}mo` : "Ongoing"}</div>
            <div style={{ fontSize:9, color:T.textMute }}>term</div>
          </div>
          <div style={{ background:T.card, borderRadius:16, padding:"12px 10px",
            border:`1px solid ${T.border}`, boxShadow:T.shadow, textAlign:"center" }}>
            <Icon name="alertTriangle" size={14} color={risk.color}/>
            <div style={{ fontSize:11, fontWeight:900, color:risk.color,
              marginTop:6 }}>{risk.label}</div>
            <div style={{ fontSize:9, color:T.textMute }}>risk level</div>
          </div>
        </div>

        {/* ── DESCRIPTION ── */}
        <div style={{ background:T.card, borderRadius:20, padding:"18px",
          boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
            marginBottom:8 }}>About this opportunity</div>
          <div style={{ fontSize:12, color:T.textMid, lineHeight:1.7 }}>
            {opportunity.description}
          </div>
        </div>

        {/* ── BUSINESS TRUST INFO (equity only) ── */}
        {!isFixedReturn && opportunity.trustScore && (
          <div style={{ background:T.card, borderRadius:20, marginBottom:16,
            border:`1px solid ${T.border}`, boxShadow:T.shadow, overflow:"hidden" }}>
            <div onClick={() => setShowBusiness(s => !s)}
              style={{ padding:"16px 18px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:10 }}>
              <Icon name="briefcase" size={16} color={T.purple}/>
              <span style={{ fontSize:13, fontWeight:800, color:T.textMain, flex:1 }}>
                Business Verification
              </span>
              <Icon name={showBusiness?"chevronUp":"chevronDown"} size={14} color={T.textMute}/>
            </div>
            {showBusiness && (
              <div style={{ padding:"0 18px 16px", animation:"fadeUp 0.2s ease" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div style={{ background:T.greenBg, borderRadius:12, padding:"10px 12px" }}>
                    <Icon name="shield" size={12} color={T.green}/>
                    <div style={{ fontSize:13, fontWeight:900, color:T.green,
                      marginTop:4 }}>{opportunity.trustScore}/100</div>
                    <div style={{ fontSize:9, color:T.textMute }}>Marketplace Trust</div>
                  </div>
                  <div style={{ background:T.bg, borderRadius:12, padding:"10px 12px" }}>
                    <Icon name="clock" size={12} color={T.blue}/>
                    <div style={{ fontSize:13, fontWeight:900, color:T.textMain,
                      marginTop:4 }}>{opportunity.businessAge}</div>
                    <div style={{ fontSize:9, color:T.textMute }}>Business Age</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── FUNDING PROGRESS ── */}
        <div style={{ background:T.card, borderRadius:20, padding:"18px",
          boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            marginBottom:8 }}>
            <span style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
              Funding Progress
            </span>
            <span style={{ fontSize:12, fontWeight:900, color:opportunity.color }}>
              {opportunity.fundedPct}%
            </span>
          </div>
          <div style={{ height:8, background:T.border, borderRadius:99,
            overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${opportunity.fundedPct}%`,
              background:`linear-gradient(90deg,${opportunity.color},${opportunity.color}88)`,
              borderRadius:99 }}/>
          </div>
        </div>

        {/* ── INVESTMENT AMOUNT ── */}
        <div style={{ background:T.card, borderRadius:24, padding:"24px",
          boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}`,
          textAlign:"center" }}>
          <div style={{ fontSize:12, color:T.textMute, fontWeight:700,
            marginBottom:10 }}>HOW MUCH WOULD YOU LIKE TO INVEST?</div>
          <div style={{ fontSize:34, fontWeight:900, color:T.navy,
            fontFamily:"monospace", marginBottom:16 }}>
            {fmt(amount)}
          </div>
          <input type="range" min={opportunity.minInvestment}
            max={Math.min(opportunity.maxInvestment, currentUser.walletBalance)}
            step={10000} value={amount}
            onChange={e => setAmount(parseInt(e.target.value))}
            style={{ width:"100%", accentColor:T.gold }}/>
          <div style={{ display:"flex", justifyContent:"space-between",
            marginTop:6 }}>
            <span style={{ fontSize:10, color:T.textMute }}>{fmt(opportunity.minInvestment)}</span>
            <span style={{ fontSize:10, color:T.textMute }}>
              Max: {fmt(Math.min(opportunity.maxInvestment, currentUser.walletBalance))}
            </span>
          </div>
          <div style={{ marginTop:12, fontSize:11, color:T.textMute }}>
            Wallet balance: <b style={{ color:T.textMain }}>{fmt(currentUser.walletBalance)}</b>
          </div>
        </div>

        {/* ── PROJECTED RETURNS ── */}
        <div style={{ background:T.goldLight, border:`1px solid ${T.gold}33`,
          borderRadius:18, padding:"16px 18px", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <Icon name="calculator" size={15} color={T.gold}/>
            <span style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
              Projected Returns {!isFixedReturn && "(estimate)"}
            </span>
          </div>
          {[
            { label:"Your Investment",   value:amount, bold:false },
            { label:"Projected Return",  value:projectedReturn, bold:false },
            { label:"Projected Total",   value:projectedTotal, bold:true  },
          ].map(row => (
            <div key={row.label} style={{ display:"flex", justifyContent:"space-between",
              padding:"5px 0" }}>
              <span style={{ fontSize:11, color:T.textMid,
                fontWeight:row.bold?700:500 }}>{row.label}</span>
              <span style={{ fontSize:row.bold?14:11, fontWeight:row.bold?900:700,
                color:T.textMain, fontFamily:"monospace" }}>{fmt(row.value)}</span>
            </div>
          ))}
          {!isFixedReturn && (
            <div style={{ fontSize:10, color:T.amber, marginTop:8, lineHeight:1.5 }}>
              Revenue-share returns vary based on actual business performance and are not guaranteed.
            </div>
          )}
        </div>

        {/* ── RISK ACKNOWLEDGEMENT ── */}
        <div onClick={() => setAgreed(a => !a)} style={{
          display:"flex", gap:12, alignItems:"flex-start",
          background:T.card, border:`1.5px solid ${agreed?T.green+"44":T.border}`,
          borderRadius:16, padding:"14px 16px", marginBottom:16, cursor:"pointer" }}>
          <div style={{ width:22, height:22, borderRadius:7, flexShrink:0,
            border:`2px solid ${agreed ? T.green : T.border}`,
            background:agreed ? T.green : "transparent",
            display:"flex", alignItems:"center", justifyContent:"center", marginTop:1 }}>
            {agreed && <Icon name="check" size={13} color="#fff"/>}
          </div>
          <div style={{ fontSize:11, color:T.textMid, lineHeight:1.6 }}>
            {/* 🔐 SECURITY / compliance acknowledgement */}
            I understand this investment carries risk, including possible
            loss of principal, and that Panda Finance does not guarantee
            returns or provide investment advice.
          </div>
        </div>

        {/* ── COMMIT BUTTON ── */}
        <button
          disabled={!canInvest}
          onClick={confirmInvestment}
          style={{
            width:"100%", padding:"16px 0", borderRadius:18, marginBottom:20,
            background:canInvest
              ? `linear-gradient(135deg,${T.gold},#A07008)`
              : T.navyLight,
            border:canInvest ? "none" : `1px solid ${T.border}`,
            color:canInvest ? "#fff" : T.textMute,
            fontSize:14, fontWeight:900,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            cursor:canInvest ? "pointer" : "not-allowed",
            boxShadow:canInvest ? `0 6px 20px ${T.gold}44` : "none" }}>
          <Icon name="wallet" size={17} color={canInvest?"#fff":T.textMute}/>
          {amount > currentUser.walletBalance ? "Insufficient Wallet Balance" : `Invest ${fmt(amount)}`}
        </button>

      </div>
    </div>
  );
}

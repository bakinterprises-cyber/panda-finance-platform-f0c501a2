import { useState } from "react";

// ============================================================
// 🧱 CR-2 — LOAN MARKETPLACE
// 🏗️  Part of: Panda Credit (Module 4)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 📦  Assembly: export LoanMarketplace from this file
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
    search:       <><circle cx="11" cy="11" r="8" {...s}/><line x1="21" y1="21" x2="16.65" y2="16.65" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    percent:      <><line x1="19" y1="5" x2="5" y2="19" {...s}/><circle cx="6.5" cy="6.5" r="2.5" {...s}/><circle cx="17.5" cy="17.5" r="2.5" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    creditCard:   <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" {...s}/><line x1="1" y1="10" x2="23" y2="10" {...s}/></>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    briefcase:    <><rect x="2" y="7" width="20" height="14" rx="2" {...s}/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...s}/></>,
    tractor:      <><circle cx="7" cy="18" r="3" {...s}/><circle cx="18" cy="18" r="2" {...s}/><path d="M4 18H2V9h9l4 5h4a2 2 0 0 1 2 2v2h-2" {...s}/><path d="M11 9V4H8" {...s}/></>,
    home2:        <><path d="M3 12l9-9 9 9" {...s}/><path d="M5 10v10h14V10" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav (Panda Credit) ─────────────────────────────────
function BottomNav({ active = "loans" }) {
  const items = [
    { id:"home",   icon:"home",       label:"Home"    },
    { id:"loans",  icon:"package",    label:"Loans"   },
    { id:"score",  icon:"creditCard", label:"Score"   },
    { id:"apply",  icon:"fileText",   label:"Apply"   },
    { id:"profile",icon:"user",       label:"Profile" },
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
// 🔌 BACKEND SWAP POINT #1 — USER PANDA SCORE (for eligibility)
// Replace with: supabase.from('panda_scores').select('score,tier').eq('user_id', currentUser.id).single()
// ============================================================
const MOCK_USER_SCORE = { score: 742, tier: "good", maxEligible: 1000000 };

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — LOAN OFFERS FROM PARTNER LENDERS
// Replace with: supabase.from('loan_offers')
//   .select('*,lender(*)').eq('active', true)
//   .lte('min_score', currentUserScore).order('interest_rate')
// ============================================================
const MOCK_LOAN_OFFERS = [
  {
    id:"LN-001", lender:"Panda Capital", lenderInitials:"PC", color:T.navy, verified:true,
    category:"business", minAmount:100000, maxAmount:1000000,
    interestRate:8.5, termMonths:[3,6,12], minScore:670,
    processingFee:1.5, approvalTime:"Instant", featured:true,
    description:"Fast business capital for inventory, equipment, or expansion. Backed by Panda Finance directly.",
  },
  {
    id:"LN-002", lender:"NMB Bank via Panda", lenderInitials:"NM", color:T.blue, verified:true,
    category:"business", minAmount:500000, maxAmount:5000000,
    interestRate:11.0, termMonths:[6,12,24], minScore:740,
    processingFee:2.0, approvalTime:"24 hours", featured:false,
    description:"Larger business loans backed by NMB Bank, integrated through Panda Finance for instant application.",
  },
  {
    id:"LN-003", lender:"CRDB SME Fund", lenderInitials:"CR", color:T.green, verified:true,
    category:"sme", minAmount:1000000, maxAmount:10000000,
    interestRate:13.5, termMonths:[12,24,36], minScore:780,
    processingFee:2.5, approvalTime:"3-5 days", featured:false,
    description:"SME growth financing for established businesses with strong Panda Score history.",
  },
  {
    id:"LN-004", lender:"Panda Agri Fund", lenderInitials:"PA", color:T.teal, verified:true,
    category:"agriculture", minAmount:50000, maxAmount:600000,
    interestRate:6.0, termMonths:[3,6,9], minScore:580,
    processingFee:1.0, approvalTime:"48 hours", featured:false,
    description:"Low-interest financing for farmers — seeds, fertilizer, equipment. Repay after harvest.",
  },
  {
    id:"LN-005", lender:"Vikoba Community Fund", lenderInitials:"VK", color:T.purple, verified:true,
    category:"personal", minAmount:20000, maxAmount:200000,
    interestRate:5.0, termMonths:[1,3,6], minScore:450,
    processingFee:0.5, approvalTime:"Instant", featured:false,
    description:"Small personal loans backed by community savings groups. Lowest barrier to entry.",
  },
  {
    id:"LN-006", lender:"Equity Bank Tanzania", lenderInitials:"EQ", color:T.red, verified:true,
    category:"personal", minAmount:200000, maxAmount:2000000,
    interestRate:14.0, termMonths:[6,12,18], minScore:700,
    processingFee:2.0, approvalTime:"2-3 days", featured:false,
    description:"Personal loans for emergencies, education, or major purchases.",
  },
];

const CATEGORIES = [
  { id:"all",         label:"All",         icon:"package"   },
  { id:"business",    label:"Business",    icon:"briefcase" },
  { id:"sme",          label:"SME",          icon:"briefcase" },
  { id:"agriculture", label:"Agriculture", icon:"tractor"   },
  { id:"personal",    label:"Personal",    icon:"user"       },
];

// ============================================================
// 🧱 MAIN COMPONENT — LoanMarketplace
// ============================================================
export default function App({
  // 👤 AUTH
  userScore  = MOCK_USER_SCORE,
  offers     = MOCK_LOAN_OFFERS,

  // 🧭 NAVIGATE
  onBack        = () => {},   // → Panda Credit Home
  onViewScore   = () => {},   // → CR-1 Panda Score Dashboard
  onApply       = () => {},   // → CR-3 Loan Application (with selected offer)
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchText,     setSearchText]     = useState("");
  const [sortBy,         setSortBy]         = useState("rate"); // rate | amount | speed
  const [detailOffer,    setDetailOffer]    = useState(null);

  const eligible = (offer) => userScore.score >= offer.minScore;

  const filtered = offers
    .filter(o => activeCategory === "all" || o.category === activeCategory)
    .filter(o => !searchText || o.lender.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a,b) => {
      if (sortBy === "rate")   return a.interestRate - b.interestRate;
      if (sortBy === "amount") return b.maxAmount - a.maxAmount;
      return 0;
    });

  const eligibleCount = offers.filter(eligible).length;

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input { font-family:inherit; }
        input::placeholder { color:${T.textMute}; }
      `}</style>

      {/* ── OFFER DETAIL MODAL ── */}
      {detailOffer && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setDetailOffer(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.white, borderRadius:"28px 28px 0 0",
            padding:"28px 24px 40px", width:"100%", maxWidth:430,
            animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
            maxHeight:"85vh", overflowY:"auto",
          }}>
            <div style={{ width:40, height:4, borderRadius:99,
              background:T.border, margin:"0 auto 22px" }}/>

            <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
              <div style={{ width:48, height:48, borderRadius:15, flexShrink:0,
                background:`linear-gradient(135deg,${detailOffer.color}22,${detailOffer.color}44)`,
                border:`2px solid ${detailOffer.color}33`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:15, fontWeight:900, color:detailOffer.color }}>
                {detailOffer.lenderInitials}
              </div>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:15, fontWeight:900, color:T.textMain }}>
                    {detailOffer.lender}
                  </span>
                  {detailOffer.verified && <Icon name="shield" size={14} color={T.blue}/>}
                </div>
                <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
                  Approval: {detailOffer.approvalTime}
                </div>
              </div>
            </div>

            <div style={{ fontSize:13, color:T.textMid, lineHeight:1.7,
              marginBottom:18, background:T.navyLight, borderRadius:14,
              padding:"14px 16px" }}>
              {detailOffer.description}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
              gap:10, marginBottom:18 }}>
              {[
                { label:"Loan Range",     value:`${fmt(detailOffer.minAmount)} – ${fmt(detailOffer.maxAmount)}` },
                { label:"Interest Rate",  value:`${detailOffer.interestRate}% p.a.` },
                { label:"Processing Fee", value:`${detailOffer.processingFee}%` },
                { label:"Terms",          value:detailOffer.termMonths.map(m=>`${m}mo`).join(", ") },
              ].map(item => (
                <div key={item.label} style={{ background:T.bg, borderRadius:12,
                  padding:"12px 14px", border:`1px solid ${T.border}` }}>
                  <div style={{ fontSize:9, color:T.textMute, fontWeight:700,
                    textTransform:"uppercase", marginBottom:4 }}>{item.label}</div>
                  <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                    fontFamily:"monospace" }}>{item.value}</div>
                </div>
              ))}
            </div>

            {eligible(detailOffer) ? (
              <div style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
                borderRadius:14, padding:"12px 16px", marginBottom:18,
                display:"flex", gap:10, alignItems:"center" }}>
                <Icon name="check" size={16} color={T.green}/>
                <span style={{ fontSize:12, fontWeight:700, color:T.green }}>
                  You're eligible! Your score of {userScore.score} meets the {detailOffer.minScore} minimum.
                </span>
              </div>
            ) : (
              <div style={{ background:T.redBg, border:`1px solid ${T.red}22`,
                borderRadius:14, padding:"12px 16px", marginBottom:18,
                display:"flex", gap:10, alignItems:"center" }}>
                <Icon name="x" size={16} color={T.red}/>
                <span style={{ fontSize:12, fontWeight:700, color:T.red }}>
                  Requires score of {detailOffer.minScore}+ (you're at {userScore.score})
                </span>
              </div>
            )}

            <button
              disabled={!eligible(detailOffer)}
              onClick={() => { setDetailOffer(null); onApply(detailOffer); }}
              style={{ width:"100%", padding:"15px 0", borderRadius:18,
                background:eligible(detailOffer)
                  ? `linear-gradient(135deg,${T.gold},#A07008)`
                  : T.navyLight,
                border:eligible(detailOffer) ? "none" : `1px solid ${T.border}`,
                color:eligible(detailOffer) ? "#fff" : T.textMute,
                fontSize:14, fontWeight:900,
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                cursor:eligible(detailOffer) ? "pointer" : "not-allowed",
                boxShadow:eligible(detailOffer) ? `0 6px 20px ${T.gold}44` : "none" }}>
              <Icon name="fileText" size={16} color={eligible(detailOffer)?"#fff":T.textMute}/>
              {eligible(detailOffer) ? "Apply Now" : "Score Too Low"}
            </button>
            {!eligible(detailOffer) && (
              <button onClick={() => { setDetailOffer(null); onViewScore(); }} style={{
                width:"100%", padding:"12px 0", marginTop:8,
                background:"none", border:"none",
                fontSize:12, fontWeight:700, color:T.navy }}>
                See how to improve your score →
              </button>
            )}
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
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:900, color:"#fff",
              letterSpacing:-0.3 }}>Loan Marketplace</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>{eligibleCount} of {offers.length} offers match your score</div>
          </div>
          <div style={{ width:40 }}/>
        </div>

        {/* Score reminder */}
        <div onClick={onViewScore} style={{ background:"rgba(255,255,255,0.1)",
          backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.15)",
          borderRadius:16, padding:"12px 16px", cursor:"pointer",
          display:"flex", alignItems:"center", gap:10, position:"relative" }}>
          <Icon name="award" size={18} color={T.goldMid}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:800, color:"#fff" }}>
              Your Panda Score: {userScore.score}
            </div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)" }}>
              Eligible up to {fmt(userScore.maxEligible)}
            </div>
          </div>
          <Icon name="chevronRight" size={14} color="rgba(255,255,255,0.6)"/>
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── SEARCH ── */}
        <div style={{ display:"flex", gap:10, alignItems:"center",
          background:T.card, border:`1px solid ${T.border}`,
          borderRadius:16, padding:"11px 16px", marginBottom:14,
          boxShadow:T.shadow }}>
          <Icon name="search" size={16} color={T.textMute}/>
          <input value={searchText} onChange={e => setSearchText(e.target.value)}
            placeholder="Search lenders..."
            style={{ flex:1, background:"transparent", border:"none",
              outline:"none", fontSize:13, color:T.textMain }}/>
        </div>

        {/* ── CATEGORY FILTER ── */}
        <div style={{ display:"flex", gap:7, overflowX:"auto",
          marginBottom:14, paddingBottom:2 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"8px 14px", borderRadius:99, flexShrink:0,
              background:activeCategory===cat.id ? T.navy : T.card,
              border:activeCategory===cat.id ? "none" : `1px solid ${T.border}`,
              color:activeCategory===cat.id ? "#fff" : T.textMid,
              fontSize:11, fontWeight:700,
              boxShadow:activeCategory===cat.id ? `0 4px 12px ${T.navy}33` : T.shadow,
            }}>
              <Icon name={cat.icon} size={12}
                color={activeCategory===cat.id ? "#fff" : T.textMid}/>
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── SORT ── */}
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {[
            { id:"rate",   label:"Lowest Rate" },
            { id:"amount", label:"Highest Amount" },
          ].map(s => (
            <button key={s.id} onClick={() => setSortBy(s.id)} style={{
              padding:"6px 12px", borderRadius:10,
              background:sortBy===s.id ? T.navyLight : "transparent",
              border:`1px solid ${sortBy===s.id ? T.navy+"33" : T.border}`,
              fontSize:10, fontWeight:700,
              color:sortBy===s.id ? T.navy : T.textMute,
            }}>{s.label}</button>
          ))}
        </div>

        {/* ── LOAN OFFERS LIST ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:"48px", marginBottom:12 }}>💳</div>
            <div style={{ fontSize:16, fontWeight:800, color:T.textMain,
              marginBottom:8 }}>No offers found</div>
            <div style={{ fontSize:13, color:T.textMute }}>
              Try a different category or search term
            </div>
          </div>
        ) : filtered.map((offer, i) => {
          const isEligible = eligible(offer);
          return (
            <div key={offer.id} onClick={() => setDetailOffer(offer)} style={{
              background:T.card, borderRadius:22, marginBottom:14,
              border:`1.5px solid ${offer.featured ? T.gold+"44" : T.border}`,
              boxShadow:offer.featured ? `0 0 0 3px ${T.gold}12` : T.shadow,
              overflow:"hidden", cursor:"pointer",
              opacity:isEligible?1:0.7,
              animation:`fadeUp 0.25s ease ${i*0.05}s both` }}>

              {offer.featured && (
                <div style={{ background:`linear-gradient(135deg,${T.gold},#A07008)`,
                  padding:"6px 16px", display:"flex", alignItems:"center", gap:6 }}>
                  <Icon name="zap" size={11} color="#fff"/>
                  <span style={{ fontSize:10, fontWeight:900, color:"#fff",
                    textTransform:"uppercase", letterSpacing:0.5 }}>
                    Featured — Panda Direct
                  </span>
                </div>
              )}

              <div style={{ padding:"16px 18px" }}>
                <div style={{ display:"flex", gap:12, alignItems:"center",
                  marginBottom:14 }}>
                  <div style={{ width:44, height:44, borderRadius:14, flexShrink:0,
                    background:`linear-gradient(135deg,${offer.color}22,${offer.color}44)`,
                    border:`2px solid ${offer.color}33`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:14, fontWeight:900, color:offer.color }}>
                    {offer.lenderInitials}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                        {offer.lender}
                      </span>
                      {offer.verified && <Icon name="shield" size={12} color={T.blue}/>}
                    </div>
                    <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
                      {fmt(offer.minAmount)} – {fmt(offer.maxAmount)}
                    </div>
                  </div>
                  {!isEligible && (
                    <div style={{ background:T.redBg, borderRadius:8,
                      padding:"3px 8px" }}>
                      <span style={{ fontSize:9, fontWeight:800, color:T.red }}>
                        Locked
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
                  gap:8 }}>
                  <div style={{ background:T.bg, borderRadius:10, padding:"8px 10px" }}>
                    <Icon name="percent" size={11} color={T.green}/>
                    <div style={{ fontSize:12, fontWeight:900, color:T.textMain,
                      marginTop:4 }}>{offer.interestRate}%</div>
                    <div style={{ fontSize:8, color:T.textMute }}>interest</div>
                  </div>
                  <div style={{ background:T.bg, borderRadius:10, padding:"8px 10px" }}>
                    <Icon name="clock" size={11} color={T.blue}/>
                    <div style={{ fontSize:12, fontWeight:900, color:T.textMain,
                      marginTop:4 }}>{offer.approvalTime}</div>
                    <div style={{ fontSize:8, color:T.textMute }}>approval</div>
                  </div>
                  <div style={{ background:T.bg, borderRadius:10, padding:"8px 10px" }}>
                    <Icon name="award" size={11} color={T.amber}/>
                    <div style={{ fontSize:12, fontWeight:900, color:T.textMain,
                      marginTop:4 }}>{offer.minScore}+</div>
                    <div style={{ fontSize:8, color:T.textMute }}>min score</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      <BottomNav active="loans"/>
    </div>
  );
}

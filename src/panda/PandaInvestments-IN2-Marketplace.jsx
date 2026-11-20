import { useState } from "react";

// ============================================================
// 🧱 IN-2 — INVESTMENT MARKETPLACE
// 🏗️  Part of: Panda Investments (Module 5)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 📦  Assembly: export InvestmentMarketplace from this file
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
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    briefcase:    <><rect x="2" y="7" width="20" height="14" rx="2" {...s}/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...s}/></>,
    trendingUp:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    percent:      <><line x1="19" y1="5" x2="5" y2="19" {...s}/><circle cx="6.5" cy="6.5" r="2.5" {...s}/><circle cx="17.5" cy="17.5" r="2.5" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    alertTriangle:<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" {...s}/><line x1="12" y1="9" x2="12" y2="13" {...s}/><line x1="12" y1="17" x2="12.01" y2="17" {...s}/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav (Panda Investments) ─────────────────────────────
function BottomNav({ active = "browse" }) {
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
// 🔌 BACKEND SWAP POINT #1 — USER ELIGIBILITY
// Replace with: supabase.from('investment_portfolios').select('eligible_tier,max_investable').eq('user_id', currentUser.id).single()
// ============================================================
const MOCK_ELIGIBILITY = { tier:"very_good", maxInvestable:5000000 };

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — INVESTMENT OPPORTUNITIES
// Replace with: supabase.from('investment_opportunities')
//   .select('*,business(*))').eq('status','open')
//   .lte('min_tier_rank', userTierRank).order('featured', {ascending:false})
// ============================================================
const MOCK_OPPORTUNITIES = [
  {
    id:"OPP-001", type:"fixed_return", featured:true,
    name:"Panda Capital Fixed Return", issuer:"Panda Capital", issuerInitials:"PC", color:T.navy,
    returnRate:8.5, termMonths:12, minInvestment:50000, maxInvestment:5000000,
    fundedPct:68, riskLevel:"low", minTier:"fair",
    description:"Backed directly by Panda Capital's diversified loan book across business, agriculture, and personal loans.",
  },
  {
    id:"OPP-002", type:"fixed_return", featured:false,
    name:"Panda Agri Fund — 6 Month Note", issuer:"Panda Agri Fund", issuerInitials:"PA", color:T.teal,
    returnRate:9.8, termMonths:6, minInvestment:30000, maxInvestment:2000000,
    fundedPct:41, riskLevel:"low", minTier:"fair",
    description:"Fund seasonal agriculture loans to farmers across Morogoro and Dodoma regions. Repayment tied to harvest cycles.",
  },
  {
    id:"OPP-003", type:"business_equity", featured:true,
    name:"Fatuma Hardware Ltd — Growth Round", issuer:"Fatuma Hardware Ltd", issuerInitials:"FH", color:T.purple,
    returnRate:18.0, termMonths:null, minInvestment:100000, maxInvestment:3000000,
    fundedPct:82, riskLevel:"high", minTier:"good",
    trustScore:91, businessAge:"3 years",
    description:"Revenue-share investment in an established hardware retailer expanding to two new locations in Dar es Salaam.",
  },
  {
    id:"OPP-004", type:"business_equity", featured:false,
    name:"Mama Fatuma Kitchen — Expansion", issuer:"Mama Fatuma Kitchen", issuerInitials:"MF", color:T.amber,
    returnRate:22.0, termMonths:null, minInvestment:50000, maxInvestment:1000000,
    fundedPct:23, riskLevel:"high", minTier:"good",
    trustScore:96, businessAge:"2 years",
    description:"Revenue-share funding for a popular Tanzanian restaurant expanding delivery coverage across Dar es Salaam.",
  },
  {
    id:"OPP-005", type:"fixed_return", featured:false,
    name:"CRDB SME Note — 24 Month", issuer:"CRDB SME Fund", issuerInitials:"CR", color:T.green,
    returnRate:12.5, termMonths:24, minInvestment:200000, maxInvestment:10000000,
    fundedPct:55, riskLevel:"medium", minTier:"very_good",
    description:"Longer-term note backed by CRDB's SME lending portfolio. Higher return for longer commitment.",
  },
];

const CATEGORIES = [
  { id:"all",             label:"All"            },
  { id:"fixed_return",    label:"Fixed-Return"   },
  { id:"business_equity", label:"Business Equity"},
];

const TIER_RANK = { building:0, fair:1, good:2, very_good:3, excellent:4 };

const RISK_CONFIG = {
  low:    { label:"Low Risk",    color:T.green },
  medium: { label:"Medium Risk", color:T.amber },
  high:   { label:"Higher Risk", color:T.red   },
};

// ============================================================
// 🧱 MAIN COMPONENT — InvestmentMarketplace
// ============================================================
export default function App({
  // 👤 AUTH
  eligibility  = MOCK_ELIGIBILITY,
  opportunities= MOCK_OPPORTUNITIES,

  // 🧭 NAVIGATE
  onBack       = () => {},   // → IN-1 Dashboard
  onDetail     = () => {},   // → IN-3 Investment Detail & Commit
  onViewScore  = () => {},   // → CR-1 Panda Score Dashboard
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchText,     setSearchText]     = useState("");
  const [sortBy,          setSortBy]         = useState("return");

  const userTierRank = TIER_RANK[eligibility.tier];
  const eligible = (opp) => TIER_RANK[opp.minTier] <= userTierRank;

  const filtered = opportunities
    .filter(o => activeCategory === "all" || o.type === activeCategory)
    .filter(o => !searchText || o.name.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a,b) => sortBy === "return" ? b.returnRate - a.returnRate : b.fundedPct - a.fundedPct);

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
        input { font-family:inherit; }
        input::placeholder { color:${T.textMute}; }
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
              letterSpacing:-0.3 }}>Investment Marketplace</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>{opportunities.filter(eligible).length} of {opportunities.length} match your tier</div>
          </div>
          <div style={{ width:40 }}/>
        </div>

        {/* Eligibility reminder */}
        <div onClick={onViewScore} style={{ background:"rgba(255,255,255,0.1)",
          backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.15)",
          borderRadius:16, padding:"12px 16px", cursor:"pointer",
          display:"flex", alignItems:"center", gap:10, position:"relative" }}>
          <Icon name="award" size={18} color={T.goldMid}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:800, color:"#fff" }}>
              Eligible up to {fmt(eligibility.maxInvestable)}
            </div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)" }}>
              Tier: {eligibility.tier.replace("_"," ")}
            </div>
          </div>
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
            placeholder="Search opportunities..."
            style={{ flex:1, background:"transparent", border:"none",
              outline:"none", fontSize:13, color:T.textMain }}/>
        </div>

        {/* ── CATEGORY FILTER ── */}
        <div style={{ display:"flex", gap:7, marginBottom:12 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
              flex:1, padding:"9px 0", borderRadius:12,
              background:activeCategory===cat.id ? T.navy : T.card,
              border:activeCategory===cat.id ? "none" : `1px solid ${T.border}`,
              color:activeCategory===cat.id ? "#fff" : T.textMid,
              fontSize:11.5, fontWeight:800,
              boxShadow:activeCategory===cat.id ? `0 4px 12px ${T.navy}33` : T.shadow,
            }}>{cat.label}</button>
          ))}
        </div>

        {/* ── SORT ── */}
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {[
            { id:"return", label:"Highest Return" },
            { id:"funded", label:"Most Funded" },
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

        {/* ── OPPORTUNITIES LIST ── */}
        {filtered.map((opp, i) => {
          const isEligible = eligible(opp);
          const risk        = RISK_CONFIG[opp.riskLevel];
          return (
            <div key={opp.id} onClick={() => onDetail(opp)} style={{
              background:T.card, borderRadius:22, marginBottom:14,
              border:`1.5px solid ${opp.featured ? T.gold+"44" : T.border}`,
              boxShadow:opp.featured ? `0 0 0 3px ${T.gold}12` : T.shadow,
              overflow:"hidden", cursor:"pointer", opacity:isEligible?1:0.65,
              animation:`fadeUp 0.25s ease ${i*0.05}s both` }}>

              {opp.featured && (
                <div style={{ background:`linear-gradient(135deg,${T.gold},#A07008)`,
                  padding:"6px 16px" }}>
                  <span style={{ fontSize:10, fontWeight:900, color:"#fff",
                    textTransform:"uppercase", letterSpacing:0.5 }}>Featured</span>
                </div>
              )}

              <div style={{ padding:"16px 18px" }}>
                <div style={{ display:"flex", gap:12, alignItems:"center",
                  marginBottom:12 }}>
                  <div style={{ width:44, height:44, borderRadius:14, flexShrink:0,
                    background:`linear-gradient(135deg,${opp.color}22,${opp.color}44)`,
                    border:`2px solid ${opp.color}33`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:14, fontWeight:900, color:opp.color }}>
                    {opp.issuerInitials}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {opp.name}
                    </div>
                    <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
                      {opp.issuer}
                    </div>
                  </div>
                  {!isEligible && (
                    <div style={{ background:T.redBg, borderRadius:8, padding:"3px 8px" }}>
                      <span style={{ fontSize:9, fontWeight:800, color:T.red }}>Locked</span>
                    </div>
                  )}
                </div>

                <div style={{ fontSize:11, color:T.textMid, lineHeight:1.6,
                  marginBottom:12 }}>{opp.description}</div>

                {/* Funding progress */}
                <div style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    marginBottom:5 }}>
                    <span style={{ fontSize:10, color:T.textMute }}>Funded</span>
                    <span style={{ fontSize:10, fontWeight:800, color:opp.color }}>
                      {opp.fundedPct}%
                    </span>
                  </div>
                  <div style={{ height:6, background:T.border, borderRadius:99,
                    overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${opp.fundedPct}%`,
                      background:`linear-gradient(90deg,${opp.color},${opp.color}88)`,
                      borderRadius:99 }}/>
                  </div>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
                  gap:8 }}>
                  <div style={{ background:T.bg, borderRadius:10, padding:"8px 10px" }}>
                    <Icon name="percent" size={11} color={T.green}/>
                    <div style={{ fontSize:12, fontWeight:900, color:T.textMain,
                      marginTop:4 }}>{opp.returnRate}%</div>
                    <div style={{ fontSize:8, color:T.textMute }}>return</div>
                  </div>
                  <div style={{ background:T.bg, borderRadius:10, padding:"8px 10px" }}>
                    <Icon name="clock" size={11} color={T.blue}/>
                    <div style={{ fontSize:12, fontWeight:900, color:T.textMain,
                      marginTop:4 }}>{opp.termMonths ? `${opp.termMonths}mo` : "Ongoing"}</div>
                    <div style={{ fontSize:8, color:T.textMute }}>term</div>
                  </div>
                  <div style={{ background:T.bg, borderRadius:10, padding:"8px 10px" }}>
                    <Icon name="alertTriangle" size={11} color={risk.color}/>
                    <div style={{ fontSize:10, fontWeight:900, color:risk.color,
                      marginTop:4 }}>{risk.label}</div>
                    <div style={{ fontSize:8, color:T.textMute }}>risk</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── RISK DISCLOSURE ── */}
        <div style={{ background:T.amberBg, border:`1px solid ${T.amber}22`,
          borderRadius:16, padding:"14px 18px", marginBottom:16,
          display:"flex", gap:10, alignItems:"flex-start" }}>
          <Icon name="lock" size={14} color={T.amber}/>
          <span style={{ fontSize:10.5, color:T.amber, lineHeight:1.6, fontWeight:600 }}>
            All investments carry risk. Business equity opportunities carry
            higher risk than fixed-return products. Review each opportunity's
            details before committing funds.
          </span>
        </div>

      </div>

      <BottomNav active="browse"/>
    </div>
  );
}

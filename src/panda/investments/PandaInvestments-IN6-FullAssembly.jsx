import { useState, createContext, useContext } from "react";

// ============================================================
// 🧱 IN-6 — PANDA INVESTMENTS FULL ASSEMBLY (PRODUCTION VERSION)
// 🏗️  Panda Finance — Module 5: Panda Investments
// ============================================================
// 📁 FILE STRUCTURE ASSUMED:
// /investments/
//   ├── PandaInvestments-IN6-FullAssembly.jsx   ← THIS FILE
//   ├── PandaInvestments-IN1-Dashboard.jsx
//   ├── PandaInvestments-IN2-Marketplace.jsx
//   ├── PandaInvestments-IN3-DetailCommit.jsx
//   ├── PandaInvestments-IN4-PortfolioReturns.jsx
//   └── PandaInvestments-IN5-RaiseCapital.jsx
//
// ⚠️ Each brick file exports `export default function App(...)`.
// Default exports can be renamed freely on import (as done below).
// No changes are required inside the original 5 brick files.
//
// 🔗 CROSS-MODULE DEPENDENCIES:
// - Panda Score / tier comes from Module 4 (Panda Credit, CR-1)
// - Business Trust Score + financial history comes from Module 2
//   (Marketplace) and Module 3 (Business Hub) — read-only here.
// - All fund movement flows through Panda Wallet (💰 WALLET).
// ============================================================

// 🔌 REAL IMPORTS — adjust paths to match your actual folder
import InvestmentDashboard from "./PandaInvestments-IN1-Dashboard";
import InvestmentMarketplace from "./PandaInvestments-IN2-Marketplace";
import InvestmentDetail    from "./PandaInvestments-IN3-DetailCommit";
import PortfolioReturns    from "./PandaInvestments-IN4-PortfolioReturns";
import RaiseCapital        from "./PandaInvestments-IN5-RaiseCapital";

// ─── Design Tokens ────────────────────────────────────────────
const T = {
  navy: "#0B1F4B", navyMid: "#1A3A6E", navyLight: "#EEF2FF",
  gold: "#C9960A", goldMid: "#F5C842", white: "#FFFFFF",
  bg: "#F4F6FF", border: "#DDE3F5", textMain: "#0B1F4B",
  textMute: "#8A9BC0", green: "#0A7B4B", red: "#C0392B",
  purple: "#6D28D9", shadowLg: "0 20px 60px rgba(11,31,75,0.16)",
};

const fmt = n => "TSh " + Number(n).toLocaleString();

// ─── SVG Icons ─────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    home:      <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" {...s}/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...s}/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    award:     <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    user:      <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    sparkle:   <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    x:         <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>{icons[name] || null}</svg>;
};

// ─── Bottom Nav (Panda Investments) ─────────────────────────────
function BottomNav({ activeTab, setActiveTab }) {
  const items = [
    { id:"home",    icon:"home",       label:"Portfolio" },
    { id:"browse",  icon:"briefcase",  label:"Browse"    },
    { id:"raise",   icon:"plus",       label:"Raise"     },
    { id:"score",   icon:"award",      label:"Score"     },
    { id:"profile", icon:"user",       label:"Profile"   },
  ];
  return (
    <div style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:430, background:T.white,
      borderTop:`1px solid ${T.border}`,
      display:"flex", alignItems:"center", justifyContent:"space-around",
      padding:"8px 0 20px", zIndex:200,
      boxShadow:"0 -4px 24px rgba(11,31,75,0.08)",
    }}>
      {items.map(item => {
        const isActive = item.id === activeTab;
        return (
          <div key={item.id} onClick={() => setActiveTab(item.id)} style={{
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
// 🌐 PANDA INVESTMENTS CONTEXT
// ============================================================
const PandaInvestmentsContext = createContext(null);
export const usePandaInvestments = () => useContext(PandaInvestmentsContext);

// ============================================================
// 👤 AUTH SWAP POINT
// 🔌 supabase.from('investment_portfolios').select('*').eq('user_id', user.id).single()
// 🔌 supabase.from('panda_scores').select('tier').eq('user_id', user.id).single()
//    → feeds eligibleTier below (cross-module read from Panda Credit)
// ============================================================
const MOCK_USER = {
  id:"user-001", name:"BAK", initials:"B",
  walletBalance:842500, eligibleTier:"very_good", maxInvestable:5000000,
  // 🔌 business profile read cross-module from Marketplace + Business Hub
  businessProfile: { name:"Tech Master Store", trustScore:98, monthsOfHistory:14, eligible:true, minTrustRequired:80, minHistoryRequired:3 },
};

export default function PandaInvestments() {
  const [screen,        setScreen]        = useState("home");
  const [activeTab,     setActiveTab]     = useState("home");
  const [user]                             = useState(MOCK_USER);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [toast,         setToast]         = useState(null);

  // 🧭 NAVIGATE — central navigation function
  const navigate = (to, params = {}) => {
    if (params.opportunity) setSelectedOpportunity(params.opportunity);
    setScreen(to);
    const tabMap = {
      home:"home", "investment-marketplace":"browse",
      "investment-detail":"browse", "portfolio-returns":"home",
      "raise-capital":"raise",
    };
    if (tabMap[to]) setActiveTab(tabMap[to]);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const tabScreens = {
      home:"home", browse:"investment-marketplace",
      raise:"raise-capital", score:"panda-score", profile:"home",
    };
    if (tabScreens[tab]) setScreen(tabScreens[tab]);
  };

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  const ctxValue = { user, selectedOpportunity, navigate, showToast };

  return (
    <PandaInvestmentsContext.Provider value={ctxValue}>
      <div style={{ maxWidth:430, margin:"0 auto" }}>
        <style>{`
          @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
          @keyframes slideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
          * { box-sizing:border-box; }
          ::-webkit-scrollbar { display:none; }
          button { font-family:inherit; cursor:pointer; border:none; }
        `}</style>

        {toast && (
          <div style={{
            position:"fixed", top:60, left:"50%", transform:"translateX(-50%)",
            zIndex:9999, maxWidth:390, width:"calc(100% - 40px)",
            background:T.navy, borderRadius:16, padding:"12px 16px",
            display:"flex", alignItems:"center", gap:10,
            boxShadow:T.shadowLg, animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <Icon name="sparkle" size={16} color={T.goldMid}/>
            <span style={{ fontSize:12, fontWeight:700, color:"#fff", flex:1 }}>{toast.msg}</span>
            <button onClick={() => setToast(null)} style={{ background:"none", border:"none" }}>
              <Icon name="x" size={14} color="rgba(255,255,255,0.6)"/>
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            🧭 SCREEN ROUTER — REAL BRICK RENDERING
        ══════════════════════════════════════════════════════ */}

        {screen === "home" && (
          <InvestmentDashboard
            currentUser={user}
            portfolio={{
              totalInvested:2400000, currentValue:2688000, totalReturns:288000,
              returnsPct:12.0, eligibleTier:user.eligibleTier,
              eligibleToInvest:true, maxInvestable:user.maxInvestable,
            }}
            onBack={() => navigate("panda-finance-home")}
            onBrowse={() => navigate("investment-marketplace")}
            onPositionTap={(pos) => navigate("portfolio-returns", { position:pos })}
            onRaiseCapital={() => navigate("raise-capital")}
            onViewScore={() => navigate("panda-score")}
          />
        )}

        {screen === "investment-marketplace" && (
          <InvestmentMarketplace
            eligibility={{ tier:user.eligibleTier, maxInvestable:user.maxInvestable }}
            onBack={() => navigate("home")}
            onDetail={(opp) => navigate("investment-detail", { opportunity:opp })}
            onViewScore={() => navigate("panda-score")}
          />
        )}

        {screen === "investment-detail" && (
          <InvestmentDetail
            opportunity={selectedOpportunity}
            currentUser={user}
            onBack={() => navigate("investment-marketplace")}
            onComplete={() => {
              showToast("Investment confirmed! Updating your portfolio...");
              navigate("portfolio-returns");
            }}
          />
        )}

        {screen === "portfolio-returns" && (
          <PortfolioReturns
            onBack={() => navigate("home")}
            onWithdraw={(pos) => showToast(`${fmt(pos.currentValue)} withdrawn to Panda Wallet`)}
            onReinvest={() => navigate("investment-marketplace")}
          />
        )}

        {screen === "raise-capital" && (
          <RaiseCapital
            businessProfile={user.businessProfile}
            currentUser={user}
            onBack={() => navigate("home")}
            onComplete={() => {
              showToast("Listing submitted — Panda's team will review within 3-5 days");
              navigate("home");
            }}
          />
        )}

        {/* 🔌 panda-score and panda-finance-home route into other modules
            (CR-1 Panda Score Dashboard, and the top-level Panda Finance
            home screen respectively) — wired at the Grand Assembly level,
            not duplicated here. */}

        {/* ── BOTTOM NAV ── */}
        <BottomNav activeTab={activeTab} setActiveTab={handleTabChange}/>
      </div>
    </PandaInvestmentsContext.Provider>
  );
}

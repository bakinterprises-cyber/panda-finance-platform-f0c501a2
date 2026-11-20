import { useState, createContext, useContext } from "react";

// ============================================================
// 🧱 CR-6 — PANDA CREDIT FULL ASSEMBLY (PRODUCTION VERSION)
// 🏗️  Panda Finance — Module 4: Panda Credit
// ============================================================
// 📁 FILE STRUCTURE ASSUMED:
// /credit/
//   ├── PandaCredit-CR6-FullAssembly.jsx     ← THIS FILE
//   ├── PandaCredit-CR1-ScoreDashboard.jsx
//   ├── PandaCredit-CR2-LoanMarketplace.jsx
//   ├── PandaCredit-CR3-LoanApplication.jsx
//   ├── PandaCredit-CR4-ActiveLoans.jsx
//   └── PandaCredit-CR5-LenderDashboard.jsx
//
// ⚠️ Each brick file exports `export default function App(...)`.
// Default exports can be renamed freely on import (as done below).
// No changes are required inside the original 5 brick files.
// ============================================================

// 🔌 REAL IMPORTS — adjust paths to match your actual folder
import PandaScoreDashboard from "./PandaCredit-CR1-ScoreDashboard";
import LoanMarketplace     from "./PandaCredit-CR2-LoanMarketplace";
import LoanApplication     from "./PandaCredit-CR3-LoanApplication";
import ActiveLoans         from "./PandaCredit-CR4-ActiveLoans";
import LenderDashboard     from "./PandaCredit-CR5-LenderDashboard";

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
    home:       <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    package:    <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    creditCard: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" {...s}/><line x1="1" y1="10" x2="23" y2="10" {...s}/></>,
    fileText:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    user:       <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    award:      <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    sparkle:    <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    x:          <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>{icons[name] || null}</svg>;
};

// ─── Bottom Nav (Panda Credit — Borrower View) ─────────────────
function BottomNav({ activeTab, setActiveTab }) {
  const items = [
    { id:"home",    icon:"home",       label:"Home"    },
    { id:"loans",   icon:"package",    label:"Loans"   },
    { id:"score",   icon:"creditCard", label:"Score"   },
    { id:"apply",   icon:"fileText",   label:"Apply"   },
    { id:"profile", icon:"user",       label:"Profile" },
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
// 🌐 PANDA CREDIT CONTEXT
// ============================================================
const PandaCreditContext = createContext(null);
export const usePandaCredit = () => useContext(PandaCreditContext);

// ============================================================
// 👤 AUTH SWAP POINT
// 🔌 supabase.from('panda_scores').select('*').eq('user_id', user.id).single()
// isLender flags whether this account also operates a Lender Dashboard
// (e.g. staff account for Panda Capital, or a partner bank's portal login)
// ============================================================
const MOCK_USER = {
  id:"user-001", name:"BAK", initials:"B", score:742, tier:"good",
  isLender:false, // set true + lenderProfile to expose Lender Dashboard
  lenderProfile:null,
};

export default function PandaCredit() {
  const [screen,       setScreen]       = useState("home");
  const [activeTab,    setActiveTab]    = useState("score");
  const [user]                           = useState(MOCK_USER);
  const [selectedOffer,setSelectedOffer]= useState(null);
  const [toast,        setToast]        = useState(null);

  // 🧭 NAVIGATE — central navigation function
  const navigate = (to, params = {}) => {
    if (params.offer) setSelectedOffer(params.offer);
    setScreen(to);
    const tabMap = {
      home:"score", "loan-marketplace":"loans", "loan-application":"apply",
      "active-loans":"loans", "lender-dashboard":"profile",
    };
    if (tabMap[to]) setActiveTab(tabMap[to]);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const tabScreens = {
      home:"home", loans:"active-loans", score:"home",
      apply:"loan-marketplace", profile:"lender-dashboard",
    };
    if (tabScreens[tab]) setScreen(tabScreens[tab]);
  };

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  const ctxValue = { user, selectedOffer, navigate, showToast };

  return (
    <PandaCreditContext.Provider value={ctxValue}>
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
          <PandaScoreDashboard
            currentUser={user}
            onBack={() => navigate("home")}
            onViewLoans={() => navigate("loan-marketplace")}
            onApply={() => navigate("loan-marketplace")}
          />
        )}

        {screen === "loan-marketplace" && (
          <LoanMarketplace
            userScore={{ score:user.score, tier:user.tier, maxEligible:1000000 }}
            onBack={() => navigate("home")}
            onViewScore={() => navigate("home")}
            onApply={(offer) => navigate("loan-application", { offer })}
          />
        )}

        {screen === "loan-application" && (
          <LoanApplication
            offer={selectedOffer}
            currentUser={user}
            onBack={() => navigate("loan-marketplace")}
            onComplete={() => {
              showToast("Application submitted! Redirecting to your loans...");
              navigate("active-loans");
            }}
          />
        )}

        {screen === "active-loans" && (
          <ActiveLoans
            currentUser={user}
            onBack={() => navigate("home")}
            onPayNow={(loan) => showToast(`Payment of ${fmt(loan.nextDueAmount)} confirmed`)}
            onNavigate={navigate}
          />
        )}

        {/* 🔒 Lender Dashboard — only reachable for accounts flagged as lenders.
            🔌 BACKEND — gate this server-side too (RLS policy on lenders table),
            not just client-side, since this is a sensitive operational view. */}
        {screen === "lender-dashboard" && user.isLender && (
          <LenderDashboard
            lender={user.lenderProfile}
            onBack={() => navigate("home")}
            onMessageBorrower={(appId) => showToast(`Opening chat for ${appId}...`)}
          />
        )}

        {screen === "lender-dashboard" && !user.isLender && (
          <ActiveLoans
            currentUser={user}
            onBack={() => navigate("home")}
            onPayNow={(loan) => showToast(`Payment of ${fmt(loan.nextDueAmount)} confirmed`)}
            onNavigate={navigate}
          />
        )}

        {/* ── BOTTOM NAV ── */}
        <BottomNav activeTab={activeTab} setActiveTab={handleTabChange}/>
      </div>
    </PandaCreditContext.Provider>
  );
}

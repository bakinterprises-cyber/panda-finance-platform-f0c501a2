import { useState, createContext, useContext } from "react";

// ============================================================
// 🧱 CM-6 — PANDA COMMUNITY (VIKOBA) FULL ASSEMBLY (PRODUCTION)
// 🏗️  Panda Finance — Module 7: Panda Community
// ============================================================
// 📁 FILE STRUCTURE ASSUMED:
// /community/
//   ├── PandaCommunity-CM6-FullAssembly.jsx     ← THIS FILE
//   ├── PandaCommunity-CM1-MyGroupsDashboard.jsx
//   ├── PandaCommunity-CM2-CreateJoinGroup.jsx
//   ├── PandaCommunity-CM3-GroupDetail.jsx
//   ├── PandaCommunity-CM4-PayoutCycle.jsx
//   └── PandaCommunity-CM5-ChatGovernance.jsx
//
// ⚠️ Each brick file exports `export default function App(...)`.
// Default exports can be renamed freely on import (as done below).
// No changes are required inside the original 5 brick files.
//
// 🔗 CROSS-MODULE DEPENDENCIES:
// - Group repayment discipline feeds into Panda Score (Module 4)
// - Contributions/payouts move through Panda Wallet (💰 WALLET)
// - Vikoba groups also appear as a lender type in Panda Credit (CR-2)
// ============================================================

// 🔌 REAL IMPORTS — adjust paths to match your actual folder
import MyGroupsDashboard   from "./PandaCommunity-CM1-MyGroupsDashboard";
import CreateJoinGroup     from "./PandaCommunity-CM2-CreateJoinGroup";
import GroupDetail         from "./PandaCommunity-CM3-GroupDetail";
import PayoutCycle         from "./PandaCommunity-CM4-PayoutCycle";
import GroupChatGovernance from "./PandaCommunity-CM5-ChatGovernance";

// ─── Design Tokens ────────────────────────────────────────────
const T = {
  navy: "#0B1F4B", navyMid: "#1A3A6E", navyLight: "#EEF2FF",
  gold: "#C9960A", goldMid: "#F5C842", white: "#FFFFFF",
  bg: "#F4F6FF", border: "#DDE3F5", textMain: "#0B1F4B",
  textMute: "#8A9BC0", green: "#0A7B4B", red: "#C0392B",
  purple: "#6D28D9", shadowLg: "0 20px 60px rgba(11,31,75,0.16)",
};

// ─── SVG Icons ─────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    home:    <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    users:   <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    plus:    <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    award:   <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    user:    <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    sparkle: <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    x:       <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>{icons[name] || null}</svg>;
};

// ─── Bottom Nav (Panda Community) ───────────────────────────────
function BottomNav({ activeTab, setActiveTab }) {
  const items = [
    { id:"home",    icon:"home",   label:"Home"    },
    { id:"groups",  icon:"users",  label:"Groups"  },
    { id:"create",  icon:"plus",   label:""        },
    { id:"score",   icon:"award",  label:"Score"   },
    { id:"profile", icon:"user",   label:"Profile" },
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
        const isCenter = item.id === "create";
        const isActive = item.id === activeTab;
        if (isCenter) return (
          <div key={item.id} onClick={() => setActiveTab("create")} style={{
            width:52, height:52, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 6px 20px ${T.gold}55`, cursor:"pointer",
            marginTop:-20, border:`3px solid ${T.white}` }}>
            <Icon name="plus" size={22} color="#fff"/>
          </div>
        );
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
// 🌐 PANDA COMMUNITY CONTEXT
// ============================================================
const PandaCommunityContext = createContext(null);
export const usePandaCommunity = () => useContext(PandaCommunityContext);

// ============================================================
// 👤 AUTH SWAP POINT
// 🔌 supabase.from('vikoba_members').select('*,group(*))').eq('user_id', user.id)
// ============================================================
const MOCK_USER = { id:"user-001", name:"BAK", initials:"B" };

export default function PandaCommunity() {
  const [screen,        setScreen]        = useState("home");
  const [activeTab,     setActiveTab]     = useState("groups");
  const [user]                             = useState(MOCK_USER);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [toast,          setToast]         = useState(null);

  // 🧭 NAVIGATE — central navigation function
  const navigate = (to, params = {}) => {
    if (params.group) setSelectedGroup(params.group);
    setScreen(to);
    const tabMap = {
      home:"groups", "create-join-group":"create",
      "group-detail":"groups", "payout-cycle":"groups",
      "chat-governance":"groups",
    };
    if (tabMap[to]) setActiveTab(tabMap[to]);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const tabScreens = {
      home:"home", groups:"home", create:"create-join-group",
      score:"panda-score", profile:"home",
    };
    if (tabScreens[tab]) setScreen(tabScreens[tab]);
  };

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  const ctxValue = { user, selectedGroup, navigate, showToast };

  return (
    <PandaCommunityContext.Provider value={ctxValue}>
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
          <MyGroupsDashboard
            currentUser={user}
            onBack={() => navigate("panda-finance-home")}
            onGroupTap={(g) => navigate("group-detail", { group:g })}
            onCreateGroup={() => navigate("create-join-group")}
          />
        )}

        {screen === "create-join-group" && (
          <CreateJoinGroup
            currentUser={user}
            onBack={() => navigate("home")}
            onComplete={() => {
              showToast("Group ready! Taking you there now...");
              navigate("home");
            }}
          />
        )}

        {screen === "group-detail" && (
          <GroupDetail
            group={selectedGroup}
            currentUser={user}
            onBack={() => navigate("home")}
            onPayNow={() => showToast("Contribution confirmed!")}
            onChat={() => navigate("chat-governance", { group:selectedGroup })}
            onCycle={() => navigate("payout-cycle", { group:selectedGroup })}
            onSettings={() => navigate("chat-governance", { group:selectedGroup })}
          />
        )}

        {screen === "payout-cycle" && (
          <PayoutCycle
            group={selectedGroup}
            currentUser={user}
            onBack={() => navigate("group-detail", { group:selectedGroup })}
            onNewRequest={() => showToast("Loan request form coming soon")}
          />
        )}

        {screen === "chat-governance" && (
          <GroupChatGovernance
            group={selectedGroup}
            currentUser={user}
            onBack={() => navigate("group-detail", { group:selectedGroup })}
            onLeaveGroup={() => {
              showToast("You've left the group", T.red);
              navigate("home");
            }}
          />
        )}

        {/* 🔌 panda-score and panda-finance-home route into other modules
            (CR-1 Panda Score Dashboard, and the top-level Panda Finance
            home screen respectively) — wired at the Grand Assembly level. */}

        {/* ── BOTTOM NAV ── */}
        <BottomNav activeTab={activeTab} setActiveTab={handleTabChange}/>
      </div>
    </PandaCommunityContext.Provider>
  );
}

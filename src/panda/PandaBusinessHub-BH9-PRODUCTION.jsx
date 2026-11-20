import { useState, createContext, useContext } from "react";

// ============================================================
// 🧱 BH-9 — BUSINESS HUB FULL ASSEMBLY (PRODUCTION VERSION)
// 🏗️  Panda Finance — Module 3: Panda Business Hub
// ============================================================
// 📁 FILE STRUCTURE ASSUMED:
// /business-hub/
//   ├── BH9-FullAssembly.jsx        ← THIS FILE
//   ├── BH1-BusinessDashboard.jsx
//   ├── BH2-AIBookkeeping.jsx
//   ├── BH3-InventoryManager.jsx
//   ├── BH4-InvoicePayments.jsx
//   ├── BH5-CashFlowDashboard.jsx
//   ├── BH6-AIBusinessCoach.jsx
//   ├── BH7-TaxAssistant.jsx
//   ├── BH8-BusinessReports.jsx
//   └── BHV-PandaVisionAI.jsx
//
// ⚠️ ADJUST IMPORT PATHS to match your actual folder structure.
// Each brick below uses `export default function App(...)` in its
// original file — rename to match on import, or rename the function
// itself in each brick file to something more specific
// (e.g. `export default function BusinessDashboard(...)`).
// ============================================================

// 🔌 REAL IMPORTS — uncomment and point to your actual files
import BusinessDashboard  from "./BH1-BusinessDashboard";
import AIBookkeeping      from "./PandaBusinessHub-BH2-AIBookkeeping";
import InventoryManager   from "./PandaBusinessHub-BH3-InventoryManager";
import InvoicePayments    from "./PandaBusinessHub-BH4-InvoicePayments";
import CashFlowDashboard  from "./PandaBusinessHub-BH5-CashFlowDashboard";
import AIBusinessCoach    from "./PandaBusinessHub-BH6-AIBusinessCoach";
import TaxAssistant       from "./PandaBusinessHub-BH7-TaxAssistant";
import BusinessReports    from "./PandaBusinessHub-BH8-BusinessReports";
import PandaVisionAI      from "./PandaBusinessHub-BHV-PandaVisionAI";

// ─── Design Tokens ────────────────────────────────────────────
const T = {
  navy:      "#0B1F4B",
  navyMid:   "#1A3A6E",
  navyLight: "#EEF2FF",
  gold:      "#C9960A",
  goldMid:   "#F5C842",
  white:     "#FFFFFF",
  bg:        "#F4F6FF",
  border:    "#DDE3F5",
  textMain:  "#0B1F4B",
  textMute:  "#8A9BC0",
  green:     "#0A7B4B",
  red:       "#C0392B",
  purple:    "#6D28D9",
  shadowLg:  "0 20px 60px rgba(11,31,75,0.16)",
};

const fmt = n => "TSh " + Number(n).toLocaleString();

// ─── SVG Icons ─────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    home:     <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    grid:     <><rect x="3" y="3" width="7" height="7" {...s}/><rect x="14" y="3" width="7" height="7" {...s}/><rect x="14" y="14" width="7" height="7" {...s}/><rect x="3" y="14" width="7" height="7" {...s}/></>,
    camera:   <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    barChart: <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    user:     <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    sparkle:  <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    x:        <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>{icons[name] || null}</svg>;
};

// ─── Bottom Nav ─────────────────────────────────────────────────
function BottomNav({ activeTab, setActiveTab }) {
  const items = [
    { id:"home",      icon:"home",     label:"Dashboard" },
    { id:"inventory", icon:"grid",     label:"Inventory" },
    { id:"scan",      icon:"camera",   label:""          },
    { id:"reports",   icon:"barChart", label:"Reports"   },
    { id:"profile",   icon:"user",     label:"Profile"   },
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
        const isCenter = item.id === "scan";
        const isActive = item.id === activeTab;
        if (isCenter) return (
          <div key={item.id} onClick={() => setActiveTab("scan")} style={{
            width:54, height:54, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 6px 20px ${T.gold}66`, cursor:"pointer",
            marginTop:-22, border:`3px solid ${T.white}`,
          }}><Icon name="camera" size={22} color="#fff"/></div>
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
// 🌐 BUSINESS HUB CONTEXT
// ============================================================
const BusinessHubContext = createContext(null);
export const useBusinessHub = () => useContext(BusinessHubContext);

// ============================================================
// 👤 AUTH SWAP POINT
// 🔌 BACKEND — replace with:
// const { data: { user } } = await supabase.auth.getUser();
// const { data: business } = await supabase
//   .from('businesses').select('*').eq('owner_id', user.id).single();
// ============================================================
const MOCK_BUSINESS = {
  id: "biz-001", name: "Tech Master Store",
  initials: "TM", color: "#1D4ED8", owner: "BAK",
};

// ============================================================
// 🔌 NOTIFICATIONS SWAP POINT
// Replace with Supabase Realtime channel (see BH-1 for pattern)
// ============================================================
const MOCK_NOTIFICATIONS = [
  { id:1, title:"Low stock: Coca Cola",      read:false },
  { id:2, title:"Invoice #INV-0043 overdue", read:false },
];

// ============================================================
// 🧱 MAIN ASSEMBLY — PandaBusinessHub
// ============================================================
export default function PandaBusinessHub() {
  const [screen,        setScreen]        = useState("home");
  const [activeTab,     setActiveTab]     = useState("home");
  const [business]                         = useState(MOCK_BUSINESS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [visionResult,  setVisionResult]  = useState(null);

  // 🧭 NAVIGATE — central navigation function, passed to every brick
  const navigate = (to) => {
    setScreen(to);
    const tabMap = {
      home:"home", inventory:"inventory", "vision-hub":"scan",
      reports:"reports", tax:"reports", cashflow:"reports",
      bookkeeping:"home", invoices:"home", "ai-coach":"home",
    };
    if (tabMap[to]) setActiveTab(tabMap[to]);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const tabScreens = { home:"home", inventory:"inventory", scan:"vision-hub", reports:"reports", profile:"home" };
    if (tabScreens[tab]) setScreen(tabScreens[tab]);
  };

  // ============================================================
  // 🤖 PANDA VISION AI → CROSS-BRICK CALLBACKS
  // 🔌 BACKEND — swap the body of each function for the real
  // Supabase call listed in the comment above it.
  // ============================================================

  // 🔌 supabase.functions.invoke('vision-update-inventory', { business_id, detected_products })
  const onVisionInventorySaved = (detectedProducts) => {
    setVisionResult({ type:"inventory", data:detectedProducts });
    setNotifications(n => [{ id:Date.now(),
      title:`${detectedProducts.length} products updated via Vision AI`, read:false }, ...n]);
    navigate("inventory");
  };

  // 🔌 supabase.functions.invoke('vision-log-receipt', { business_id, receipt_data })
  const onVisionExpenseLogged = (receiptData) => {
    setVisionResult({ type:"expense", data:receiptData });
    setNotifications(n => [{ id:Date.now(),
      title:`Expense of ${fmt(receiptData.total)} logged via Vision AI`, read:false }, ...n]);
    navigate("bookkeeping");
  };

  // 🔌 supabase.from('products').insert({ ...listingDraft, seller_id, status:'published' })
  const onVisionListingCreated = (listingDraft) => {
    setVisionResult({ type:"listing", data:listingDraft });
    setNotifications(n => [{ id:Date.now(),
      title:`"${listingDraft.name}" published to Marketplace`, read:false }, ...n]);
    navigate("home");
  };

  // 🔌 supabase.from('orders').insert({...}) + PandaWallet.chargeOrCollect({...})
  const onVisionSaleComplete = ({ cart, total, method }) => {
    setVisionResult({ type:"sale", data:{ cart, total, method } });
    setNotifications(n => [{ id:Date.now(),
      title:`Sale of ${fmt(total)} completed via ${method}`, read:false }, ...n]);
    navigate("home");
  };

  const ctxValue = {
    business, notifications, setNotifications, visionResult, navigate,
    onVisionInventorySaved, onVisionExpenseLogged,
    onVisionListingCreated, onVisionSaleComplete,
  };

  return (
    <BusinessHubContext.Provider value={ctxValue}>
      <div style={{ maxWidth:430, margin:"0 auto" }}>
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
          * { box-sizing:border-box; }
          ::-webkit-scrollbar { display:none; }
          button { font-family:inherit; cursor:pointer; border:none; }
        `}</style>

        {/* ── VISION AI CROSS-BRICK CONFIRMATION TOAST ── */}
        {visionResult && (
          <div style={{ position:"fixed", top:60, left:"50%", transform:"translateX(-50%)",
            zIndex:9999, maxWidth:390, width:"calc(100% - 40px)",
            background:T.navy, borderRadius:16, padding:"12px 16px",
            display:"flex", alignItems:"center", gap:10,
            boxShadow:T.shadowLg, animation:"fadeUp 0.3s ease" }}>
            <Icon name="sparkle" size={16} color={T.goldMid}/>
            <span style={{ fontSize:12, fontWeight:700, color:"#fff", flex:1 }}>
              {visionResult.type === "inventory" && "Inventory updated by Panda Vision AI"}
              {visionResult.type === "expense"   && "Expense logged by Panda Vision AI"}
              {visionResult.type === "listing"   && "Listing published by Panda Vision AI"}
              {visionResult.type === "sale"      && "Sale completed via Panda Vision AI"}
            </span>
            <button onClick={() => setVisionResult(null)} style={{ background:"none", border:"none" }}>
              <Icon name="x" size={14} color="rgba(255,255,255,0.6)"/>
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            🧭 SCREEN ROUTER — REAL BRICK RENDERING
            Every brick receives `business.id`, `navigate`, and its
            own specific callback props exactly as defined when
            each brick was built. No brick needed to change.
        ══════════════════════════════════════════════════════ */}

        {screen === "home" && (
          <BusinessDashboard
            business={business}
            onNavigate={navigate}
            onNotifications={() => navigate("notifications")}
            onVoiceAssistant={() => navigate("ai-coach")}
          />
        )}

        {screen === "inventory" && (
          <InventoryManager
            businessId={business.id}
            onBack={() => navigate("home")}
            onScanToCount={() => navigate("vision-hub")}
            onAddItem={() => navigate("inventory-add")}
            onNavigate={navigate}
          />
        )}

        {screen === "bookkeeping" && (
          <AIBookkeeping
            businessId={business.id}
            onBack={() => navigate("home")}
            onScanReceipt={() => navigate("vision-hub")}
            onAddEntry={() => navigate("bookkeeping-add")}
            onNavigate={navigate}
          />
        )}

        {screen === "vision-hub" && (
          <PandaVisionAI
            businessId={business.id}
            onBack={() => navigate("home")}
            onInventorySaved={onVisionInventorySaved}
            onExpenseLogged={onVisionExpenseLogged}
            onListingCreated={onVisionListingCreated}
            onSaleComplete={onVisionSaleComplete}
          />
        )}

        {screen === "invoices" && (
          <InvoicePayments
            businessId={business.id}
            onBack={() => navigate("home")}
            onScanCreate={() => navigate("vision-hub")}
            onNavigate={navigate}
          />
        )}

        {screen === "cashflow" && (
          <CashFlowDashboard
            businessId={business.id}
            onBack={() => navigate("home")}
            onNavigate={navigate}
          />
        )}

        {screen === "ai-coach" && (
          <AIBusinessCoach
            businessId={business.id}
            onBack={() => navigate("home")}
            onNavigate={navigate}
          />
        )}

        {screen === "tax" && (
          <TaxAssistant
            businessId={business.id}
            onBack={() => navigate("home")}
            onFileReturn={(vatSummary) => { /* 🔌 supabase.functions.invoke('file-vat-return', {...}) */ }}
            onNavigate={navigate}
          />
        )}

        {screen === "reports" && (
          <BusinessReports
            businessId={business.id}
            onBack={() => navigate("home")}
            onExportPDF={(report) => { /* 🔌 supabase.functions.invoke('generate-report-pdf', {...}) */ }}
            onNavigate={navigate}
          />
        )}

        {/* ── BOTTOM NAV ── */}
        <BottomNav activeTab={activeTab} setActiveTab={handleTabChange}/>
      </div>
    </BusinessHubContext.Provider>
  );
}

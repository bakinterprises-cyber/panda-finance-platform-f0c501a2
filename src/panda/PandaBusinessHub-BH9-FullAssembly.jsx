import { useState, createContext, useContext } from "react";

// ============================================================
// 🧱 BH-9 — BUSINESS HUB FULL ASSEMBLY
// 🏗️  Panda Finance — Module 3: Panda Business Hub
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 🤖  AI hooks marked with:            // 🤖 AI
// ============================================================
// ASSEMBLY CHECKLIST:
// [ ] Import BH-1 through BH-8 + BH-V from their real files
// [ ] Replace all MOCK_* with real Supabase queries
// [ ] Wire all onNavigate props to navigate()
// [ ] Connect 🤖 AI points to Supabase Edge Functions
// [ ] Connect Panda Vision AI outputs to Inventory/Bookkeeping/Marketplace
// [ ] Test full flow: Dashboard→Scan→Save→Bookkeeping→Reports→Tax
// ============================================================

// ─── Design Tokens ────────────────────────────────────────────
const T = {
  navy:      "#0B1F4B",
  navyMid:   "#1A3A6E",
  navyLight: "#EEF2FF",
  gold:      "#C9960A",
  goldMid:   "#F5C842",
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
  purple:    "#6D28D9",
  purpleBg:  "#F5F3FF",
  blue:      "#1D4ED8",
  amber:     "#B45309",
  shadow:    "0 2px 16px rgba(11,31,75,0.07)",
  shadowMd:  "0 8px 32px rgba(11,31,75,0.11)",
  shadowLg:  "0 20px 60px rgba(11,31,75,0.16)",
};

const fmt = n => "TSh " + Number(n).toLocaleString();

// ─── SVG Icons ─────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    grid:         <><rect x="3" y="3" width="7" height="7" {...s}/><rect x="14" y="3" width="7" height="7" {...s}/><rect x="14" y="14" width="7" height="7" {...s}/><rect x="3" y="14" width="7" height="7" {...s}/></>,
    camera:       <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    arrowLeft:    <><line x1="19" y1="12" x2="5" y2="12" {...s}/><polyline points="12 19 5 12 12 5" {...s}/></>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    bookOpen:     <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" {...s}/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    calculator:   <><rect x="4" y="2" width="16" height="20" rx="2" {...s}/><line x1="8" y1="6" x2="16" y2="6" {...s}/></>,
    mic:          <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" {...s}/><path d="M19 10v2a7 7 0 0 1-14 0v-2" {...s}/><line x1="12" y1="19" x2="12" y2="23" {...s}/><line x1="8" y1="23" x2="16" y2="23" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ============================================================
// 🌐 BUSINESS HUB CONTEXT — Shared state across all BH bricks
// ============================================================
const BusinessHubContext = createContext(null);
const useBusinessHub = () => useContext(BusinessHubContext);

// ============================================================
// 👤 AUTH SWAP POINT
// Replace with: supabase.from('businesses').select('*').eq('owner_id', user.id).single()
// ============================================================
const MOCK_BUSINESS = {
  id:        "biz-001",
  name:      "Tech Master Store",
  initials:  "TM",
  color:     "#1D4ED8",
  owner:     "BAK",
};

// ============================================================
// 🔌 NOTIFICATION SWAP POINT
// Replace with: supabase.channel('notifications')... (see BH-1)
// ============================================================
const MOCK_NOTIFICATIONS = [
  { id:1, title:"Low stock: Coca Cola",   read:false },
  { id:2, title:"Invoice #INV-0043 overdue", read:false },
];

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
      width:"100%", maxWidth:430,
      background:T.white, borderTop:`1px solid ${T.border}`,
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
          }}>
            <Icon name="camera" size={22} color="#fff"/>
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
// 🗺️ SCREEN PLACEHOLDER — In production, swap each for the real brick
// ============================================================
function BrickPlaceholder({ screen, navigate }) {
  const info = {
    "home":       { label:"Business Dashboard",  brick:"BH-1", color:T.navy   },
    "inventory":  { label:"Inventory Manager",    brick:"BH-3", color:T.blue   },
    "bookkeeping":{ label:"AI Bookkeeping",       brick:"BH-2", color:T.green  },
    "vision-hub": { label:"Panda Vision AI",      brick:"BH-V", color:T.purple },
    "invoices":   { label:"Invoice & Payments",   brick:"BH-4", color:T.amber  },
    "cashflow":   { label:"Cash Flow Dashboard",  brick:"BH-5", color:T.green  },
    "ai-coach":   { label:"AI Business Coach",    brick:"BH-6", color:T.purple },
    "tax":        { label:"Tax Assistant",        brick:"BH-7", color:T.navy  },
    "reports":    { label:"Business Reports",     brick:"BH-8", color:T.blue   },
  }[screen] || { label:screen, brick:"Unknown", color:T.navy };

  return (
    <div style={{ background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110 }}>
      <div style={{ background:"rgba(255,255,255,0.96)", backdropFilter:"blur(16px)",
        padding:"14px 20px", borderBottom:`1px solid ${T.border}`,
        display:"flex", alignItems:"center", gap:14, position:"sticky",
        top:0, zIndex:100 }}>
        <button onClick={() => navigate("home")} style={{
          width:40, height:40, borderRadius:12, background:T.navyLight,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="arrowLeft" size={18} color={T.navy}/>
        </button>
        <div>
          <div style={{ fontSize:15, fontWeight:800, color:T.textMain }}>
            {info.label}
          </div>
          <div style={{ fontSize:11, color:T.textMute }}>{info.brick}</div>
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        minHeight:"70vh", padding:"40px 24px", textAlign:"center" }}>
        <div style={{ width:80, height:80, borderRadius:22,
          background:info.color+"14",
          display:"flex", alignItems:"center", justifyContent:"center",
          marginBottom:20, fontSize:36 }}>🐼</div>
        <div style={{ fontSize:20, fontWeight:900, color:T.textMain,
          marginBottom:8 }}>{info.label}</div>
        <div style={{ fontSize:14, color:T.textMute, lineHeight:1.7,
          marginBottom:24, maxWidth:300 }}>
          {info.brick} is fully built. In assembly, import and render it here.
        </div>
        <div style={{ background:T.navy, borderRadius:16, padding:"16px 18px",
          width:"100%", textAlign:"left" }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)",
            fontFamily:"monospace", marginBottom:6 }}>// 🔌 Assembly wiring</div>
          <div style={{ fontSize:11, color:T.goldMid, fontFamily:"monospace",
            lineHeight:1.7 }}>
            {`import ${info.label.replace(/ /g,"")} from`}<br/>
            {`  './${info.brick}-${info.label.replace(/ /g,"")}'`}<br/><br/>
            {`<${info.label.replace(/ /g,"")}`}<br/>
            {`  businessId={business.id}`}<br/>
            {`  onBack={() => navigate("home")}`}<br/>
            {`  onNavigate={navigate}`}<br/>
            {`/>`}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🧱 MAIN ASSEMBLY — PandaBusinessHub
// ============================================================
export default function App() {
  const [screen,        setScreen]        = useState("home");
  const [activeTab,     setActiveTab]     = useState("home");
  const [business]                         = useState(MOCK_BUSINESS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [visionResult,  setVisionResult]  = useState(null); // last Vision AI output

  // 🧭 NAVIGATE — central navigation function
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
    const tabScreens = {
      home:"home", inventory:"inventory", scan:"vision-hub", reports:"reports", profile:"home",
    };
    if (tabScreens[tab]) setScreen(tabScreens[tab]);
  };

  // ============================================================
  // 🤖 PANDA VISION AI → CROSS-BRICK CONNECTIONS
  // These are the callback wires that make the flagship feature
  // actually update the rest of the Business Hub. In assembly,
  // pass these directly as props into the real BH-V component.
  // ============================================================

  // Vision AI scanned products → save to BH-3 Inventory
  // 🔌 BACKEND — supabase.functions.invoke('vision-update-inventory', {...})
  const onVisionInventorySaved = (detectedProducts) => {
    setVisionResult({ type:"inventory", data:detectedProducts });
    setNotifications(n => [{ id:Date.now(),
      title:`${detectedProducts.length} products updated via Vision AI`, read:false }, ...n]);
    navigate("inventory");
  };

  // Vision AI read a receipt → log expense in BH-2 Bookkeeping
  // 🔌 BACKEND — supabase.functions.invoke('vision-log-receipt', {...})
  const onVisionExpenseLogged = (receiptData) => {
    setVisionResult({ type:"expense", data:receiptData });
    setNotifications(n => [{ id:Date.now(),
      title:`Expense of ${fmt(receiptData.total)} logged via Vision AI`, read:false }, ...n]);
    navigate("bookkeeping");
  };

  // Vision AI generated a listing → publish to Marketplace (Brick 3 equivalent)
  // 🔌 BACKEND — supabase.from('products').insert({...})
  const onVisionListingCreated = (listingDraft) => {
    setVisionResult({ type:"listing", data:listingDraft });
    setNotifications(n => [{ id:Date.now(),
      title:`"${listingDraft.name}" published to Marketplace`, read:false }, ...n]);
    // 🧭 In full app assembly this routes into the Marketplace module (Brick 3/17)
    navigate("home");
  };

  // Vision AI completed a POS sale → record order + update dashboard
  // 🔌 BACKEND — supabase.from('orders').insert({...})
  // 💰 WALLET — PandaWallet.chargeOrCollect({...})
  const onVisionSaleComplete = ({ cart, total, method }) => {
    setVisionResult({ type:"sale", data:{ cart, total, method } });
    setNotifications(n => [{ id:Date.now(),
      title:`Sale of ${fmt(total)} completed via ${method}`, read:false }, ...n]);
    navigate("home");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const ctxValue = {
    business, notifications, setNotifications,
    visionResult, navigate,
    onVisionInventorySaved, onVisionExpenseLogged,
    onVisionListingCreated, onVisionSaleComplete,
  };

  return (
    <BusinessHubContext.Provider value={ctxValue}>
      <div style={{ maxWidth:430, margin:"0 auto" }}>
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
          @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
          * { box-sizing:border-box; }
          ::-webkit-scrollbar { display:none; }
          button { font-family:inherit; cursor:pointer; border:none; }
        `}</style>

        {/* ── VISION AI RESULT TOAST (cross-brick confirmation) ── */}
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
            <button onClick={() => setVisionResult(null)} style={{
              background:"none", border:"none" }}>
              <Icon name="x" size={14} color="rgba(255,255,255,0.6)"/>
            </button>
          </div>
        )}

        {/* ── SCREEN ROUTER ── */}
        {/* 🧭 In production: replace BrickPlaceholder with the real BH-1..BH-8 + BH-V imports */}
        <BrickPlaceholder screen={screen} navigate={navigate}/>

        <BottomNav activeTab={activeTab} setActiveTab={handleTabChange}/>
      </div>
    </BusinessHubContext.Provider>
  );
}

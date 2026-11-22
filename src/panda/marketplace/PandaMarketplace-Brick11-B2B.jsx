import { useState } from "react";

// ============================================================
// 🧱 BRICK 11 — B2B PROCUREMENT
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export B2BProcurement from this file
//     Props: { currentUser, onBack, onSupplierPress,
//              onChatSupplier, onWalletPay }
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
  tealBg:    "#F0FDFA",
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
    filter:       <><line x1="4" y1="6" x2="20" y2="6" {...s}/><line x1="8" y1="12" x2="16" y2="12" {...s}/><line x1="11" y1="18" x2="13" y2="18" {...s}/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    phone:        <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" {...s}/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/><polyline points="3.27 6.96 12 12.01 20.73 6.96" {...s}/><line x1="12" y1="22.08" x2="12" y2="12" {...s}/></>,
    briefcase:    <><rect x="2" y="7" width="20" height="14" rx="2" {...s}/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...s}/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronUp:    <><polyline points="18 15 12 9 6 15" {...s}/></>,
    mapPin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    send:         <><line x1="22" y1="2" x2="11" y2="13" {...s}/><polygon points="22 2 15 22 11 13 2 9 22 2" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    trending:     <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    minus:        <><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2"/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    leaf:         <><path d="M17 8C8 10 5.9 16.17 3.82 22.5L2 22l1-10a9 9 0 0 1 9-9 8.41 8.41 0 0 1 5.82 2.29l.18-1.29" {...s}/></>,
    cpu:          <><rect x="9" y="9" width="6" height="6" {...s}/><rect x="2" y="2" width="20" height="20" rx="2" {...s}/><line x1="9" y1="2" x2="9" y2="9" {...s}/><line x1="15" y1="2" x2="15" y2="9" {...s}/><line x1="9" y1="15" x2="9" y2="22" {...s}/><line x1="15" y1="15" x2="15" y2="22" {...s}/><line x1="2" y1="9" x2="9" y2="9" {...s}/><line x1="2" y1="15" x2="9" y2="15" {...s}/><line x1="15" y1="9" x2="22" y2="9" {...s}/><line x1="15" y1="15" x2="22" y2="15" {...s}/></>,
    tool:         <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" {...s}/></>,
    droplet:      <><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" {...s}/></>,
    box:          <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    info:         <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    edit:         <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...s}/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav ───────────────────────────────────────────────
function BottomNav({ active = "discover" }) {
  const items = [
    { id:"home",     icon:"home",    label:"Home"     },
    { id:"discover", icon:"compass", label:"Discover" },
    { id:"create",   icon:"plus",    label:""         },
    { id:"messages", icon:"message", label:"Messages" },
    { id:"wallet",   icon:"wallet",  label:"Wallet"   },
    { id:"profile",  icon:"user",    label:"Profile"  },
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
        const isCenter = item.id === "create";
        const isActive = item.id === active;
        if (isCenter) return (
          <div key={item.id} style={{
            width:52, height:52, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 6px 20px ${T.navy}55`, cursor:"pointer",
            marginTop:-20, border:`3px solid ${T.white}`,
          }}>
            <Icon name="plus" size={22} color="#fff"/>
          </div>
        );
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
// 🔌 BACKEND SWAP POINT #1 — CATEGORIES
// Replace with: supabase.from('b2b_categories').select('*').order('sort_order')
// ============================================================
const CATEGORIES = [
  { id:"all",         label:"All",            icon:"box"       },
  { id:"agriculture", label:"Agriculture",    icon:"leaf"      },
  { id:"electronics", label:"Electronics",    icon:"cpu"       },
  { id:"construction",label:"Construction",   icon:"tool"      },
  { id:"chemicals",   label:"Chemicals",      icon:"droplet"   },
  { id:"textiles",    label:"Textiles",       icon:"briefcase" },
  { id:"food",        label:"Food & Beverage",icon:"package"   },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — SUPPLIERS
// Replace with: supabase.from('b2b_suppliers')
//   .select('*,products(count),reviews(avg(rating))')
//   .eq('category', activeCategory)
//   .order('trust_score', { ascending: false })
// ============================================================
const MOCK_SUPPLIERS = [
  {
    id:"SUP-001", name:"TanzAgro Supplies Ltd",
    category:"agriculture", location:"Morogoro, Tanzania",
    initials:"TA", color:"#0A7B4B",
    trustScore:97, rating:4.8, reviewCount:234,
    verified:true, verifiedType:"BRELA Registered",
    minOrder:500000, leadTime:"3–5 days",
    products:142, orders:1840,
    description:"Tanzania's largest agricultural input supplier. Seeds, fertilizers, pesticides and farm equipment at wholesale prices.",
    tags:["Bulk Available","Fast Delivery","Verified"],
    badge:"Top Supplier",
  },
  {
    id:"SUP-002", name:"East Africa Electronics Hub",
    category:"electronics", location:"Dar es Salaam, Tanzania",
    initials:"EA", color:"#1D4ED8",
    trustScore:95, rating:4.7, reviewCount:187,
    verified:true, verifiedType:"TIN Verified",
    minOrder:1000000, leadTime:"5–7 days",
    products:89, orders:920,
    description:"Wholesale electronics importer. Phones, laptops, accessories and spare parts at competitive prices for retailers.",
    tags:["Bulk Available","Warranty","Import Direct"],
    badge:"Verified Importer",
  },
  {
    id:"SUP-003", name:"Bora Construction Materials",
    category:"construction", location:"Arusha, Tanzania",
    initials:"BC", color:"#B45309",
    trustScore:93, rating:4.6, reviewCount:156,
    verified:true, verifiedType:"BRELA Registered",
    minOrder:2000000, leadTime:"2–3 days",
    products:67, orders:640,
    description:"Cement, steel, timber, tiles and all construction materials. Serving contractors and developers across East Africa.",
    tags:["Bulk Discount","Local Delivery","Credit Available"],
    badge:"Bulk Specialist",
  },
  {
    id:"SUP-004", name:"Kilimo Chemical Solutions",
    category:"chemicals", location:"Dodoma, Tanzania",
    initials:"KC", color:"#6D28D9",
    trustScore:91, rating:4.5, reviewCount:98,
    verified:true, verifiedType:"BRELA + TIN",
    minOrder:300000, leadTime:"7–10 days",
    products:45, orders:380,
    description:"Industrial and agricultural chemicals supplier. Certified and safe handling with proper documentation.",
    tags:["Certified","Safety Docs","Lab Tested"],
    badge:null,
  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #3 — RFQ (Request for Quote) DATA
// Replace with: supabase.from('rfq_requests')
//   .select('*').eq('buyer_id', currentUser.id)
//   .order('created_at', { ascending: false })
// ============================================================
const MOCK_RFQS = [
  {
    id:"RFQ-001", title:"500 Bags Urea Fertilizer 50kg",
    category:"agriculture", quantity:"500 bags",
    budget:15000000, deadline:"2026-08-01",
    status:"active", quotes:4, createdAt:"2 days ago",
    description:"Need 500 bags of Urea fertilizer 50kg each. Delivery to Morogoro farm. Quality certified.",
  },
  {
    id:"RFQ-002", title:"200 Android Phones Wholesale",
    category:"electronics", quantity:"200 units",
    budget:40000000, deadline:"2026-07-25",
    status:"closed", quotes:7, createdAt:"1 week ago",
    description:"Require 200 Android phones (mixed brands) for retail shop. Minimum 1 year warranty.",
  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #4 — TENDER LISTINGS
// Replace with: supabase.from('tenders')
//   .select('*,issuer(*)')
//   .gt('deadline', new Date().toISOString())
//   .order('deadline', { ascending: true })
// ============================================================
const MOCK_TENDERS = [
  {
    id:"TND-001", title:"Supply of Office Equipment — Government",
    issuer:"Tanzania Revenue Authority",
    initials:"TR", color:"#0B1F4B",
    value:85000000, deadline:"2026-08-15",
    category:"electronics", status:"open",
    description:"Supply and installation of 50 desktop computers, 20 printers and networking equipment for TRA regional offices.",
    requirements:["BRELA Registered","TIN Verified","3 years experience"],
  },
  {
    id:"TND-002", title:"Agricultural Inputs Supply — NGO",
    issuer:"World Food Programme Tanzania",
    initials:"WF", color:"#0A7B4B",
    value:320000000, deadline:"2026-08-30",
    category:"agriculture", status:"open",
    description:"Supply of seeds, fertilizers and farming tools to 5,000 smallholder farmers in Dodoma and Singida regions.",
    requirements:["Agro-dealer License","BRELA Registered","Insurance"],
  },
];

// ============================================================
// 🧱 MAIN COMPONENT — B2BProcurement
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user from supabase.auth.getUser()
  currentUser     = { id:"user-001", name:"BAK Enterprise", initials:"BE" },

  // 🧭 NAVIGATE
  onBack          = () => {},   // → previous screen
  onSupplierPress = () => {},   // → Brick 4 SellerProfile (B2B version)
  onChatSupplier  = () => {},   // → Brick 6 Marketplace Chat
  onCallSupplier  = () => {},   // → phone dialer
  // 💰 WALLET
  onWalletPay     = () => {},   // → PandaWallet.initiateEscrow()
}) {
  const [activeTab,      setActiveTab]      = useState("suppliers");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchText,     setSearchText]     = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [view,           setView]           = useState("list"); // list | detail | rfq_form | quote
  const [rfqs,           setRfqs]           = useState(MOCK_RFQS);
  const [toast,          setToast]          = useState(null);
  const [rfqForm,        setRfqForm]        = useState({
    title:"", category:"agriculture", quantity:"",
    budget:"", deadline:"", description:"",
  });
  const [quoteQty,       setQuoteQty]       = useState(1);
  const [expandedTender, setExpandedTender] = useState(null);
  const [appliedTenders, setAppliedTenders] = useState({});

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredSuppliers = MOCK_SUPPLIERS
    .filter(s => activeCategory === "all" || s.category === activeCategory)
    .filter(s => !searchText || s.name.toLowerCase().includes(searchText.toLowerCase()));

  const submitRFQ = () => {
    if (!rfqForm.title || !rfqForm.quantity || !rfqForm.budget) {
      showToast("Please fill all required fields", T.red);
      return;
    }
    // 🔌 BACKEND — supabase.from('rfq_requests').insert({
    //   buyer_id: currentUser.id,
    //   title: rfqForm.title, category: rfqForm.category,
    //   quantity: rfqForm.quantity, budget: parseInt(rfqForm.budget),
    //   deadline: rfqForm.deadline, description: rfqForm.description,
    //   status: 'active'
    // })
    setRfqs(r => [{
      id:`RFQ-${Math.floor(100+Math.random()*900)}`,
      ...rfqForm, budget: parseInt(rfqForm.budget),
      status:"active", quotes:0, createdAt:"Just now",
    }, ...r]);
    setView("list");
    setActiveTab("rfq");
    showToast("RFQ published! Suppliers will respond shortly.", T.green);
  };

  const TABS = [
    { id:"suppliers", label:"Suppliers",  icon:"briefcase" },
    { id:"rfq",       label:"My RFQs",    icon:"fileText"  },
    { id:"tenders",   label:"Tenders",    icon:"award"     },
  ];

  // ── SUPPLIER DETAIL VIEW ─────────────────────────────────────
  if (view === "detail" && selectedSupplier) return (
    <div style={{
      background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:120,
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input,textarea { font-family:inherit; }
        input::placeholder,textarea::placeholder { color:${T.textMute}; }
      `}</style>

      {toast && (
        <div style={{ position:"fixed", bottom:130, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:T.white, border:`1px solid ${toast.color}33`,
          borderLeft:`4px solid ${toast.color}`, borderRadius:14, padding:"12px 20px",
          boxShadow:T.shadowLg, whiteSpace:"nowrap",
          animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex", alignItems:"center", gap:10 }}>
          <Icon name="check" size={14} color={toast.color}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>{toast.msg}</span>
        </div>
      )}

      {/* Top bar */}
      <div style={{
        background:"rgba(255,255,255,0.96)", backdropFilter:"blur(16px)",
        padding:"14px 20px", position:"sticky", top:0, zIndex:100,
        borderBottom:`1px solid ${T.border}`,
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <button onClick={() => setView("list")} style={{
          width:40, height:40, borderRadius:12, background:T.navyLight,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Icon name="arrowLeft" size={18} color={T.navy}/>
        </button>
        <div style={{ fontSize:14, fontWeight:800, color:T.textMain }}>
          Supplier Profile
        </div>
        <button onClick={() => onChatSupplier(selectedSupplier.id)} style={{
          width:40, height:40, borderRadius:12, background:T.navyLight,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Icon name="message" size={18} color={T.navy}/>
        </button>
      </div>

      {/* Cover */}
      <div style={{ height:160, background:`linear-gradient(135deg,${selectedSupplier.color}18,${selectedSupplier.color}33)`,
        display:"flex", alignItems:"center", justifyContent:"center",
        position:"relative" }}>
        <div style={{ position:"absolute", inset:0, opacity:0.06,
          backgroundImage:"radial-gradient(circle,#000 1px,transparent 1px)",
          backgroundSize:"20px 20px" }}/>
        <div style={{ fontSize:"56px", opacity:0.3 }}>🏭</div>
        {selectedSupplier.badge && (
          <div style={{ position:"absolute", bottom:14, left:14,
            background:T.gold, borderRadius:9, padding:"4px 12px" }}>
            <span style={{ fontSize:11, fontWeight:900, color:"#fff" }}>
              {selectedSupplier.badge}
            </span>
          </div>
        )}
      </div>

      <div style={{ padding:"0 20px" }}>
        {/* Supplier info card */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          boxShadow:T.shadowMd, marginTop:-28, marginBottom:14,
          border:`1px solid ${T.border}`, position:"relative" }}>
          <div style={{ display:"flex", gap:14, alignItems:"flex-start",
            marginBottom:14 }}>
            <div style={{ position:"relative" }}>
              <div style={{ width:64, height:64, borderRadius:18,
                background:`linear-gradient(135deg,${selectedSupplier.color}22,${selectedSupplier.color}44)`,
                border:`2px solid ${T.white}`,
                boxShadow:`0 0 0 2px ${selectedSupplier.color}44`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:22, fontWeight:900, color:selectedSupplier.color }}>
                {selectedSupplier.initials}
              </div>
              {selectedSupplier.verified && (
                <div style={{ position:"absolute", bottom:-4, right:-4,
                  width:22, height:22, borderRadius:"50%", background:T.blue,
                  border:`2.5px solid ${T.white}`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="shield" size={11} color="#fff"/>
                </div>
              )}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:17, fontWeight:900, color:T.textMain,
                marginBottom:4 }}>{selectedSupplier.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:6 }}>
                <Icon name="mapPin" size={12} color={T.textMute}/>
                <span style={{ fontSize:12, color:T.textMute }}>
                  {selectedSupplier.location}
                </span>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {selectedSupplier.tags.map(tag => (
                  <div key={tag} style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
                    borderRadius:8, padding:"2px 8px",
                    fontSize:10, fontWeight:800, color:T.green }}>{tag}</div>
                ))}
              </div>
            </div>
            {/* Trust ring */}
            <div style={{ width:52, height:52, borderRadius:"50%", flexShrink:0,
              background:`conic-gradient(${T.green} ${selectedSupplier.trustScore*3.6}deg, ${T.border} 0deg)`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:44, height:44, borderRadius:"50%",
                background:T.white, display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:12, fontWeight:900, color:T.green, lineHeight:1 }}>
                  {selectedSupplier.trustScore}
                </span>
                <span style={{ fontSize:8, color:T.textMute }}>Trust</span>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)",
            gap:8, padding:"14px 0 0", borderTop:`1px solid ${T.border}` }}>
            {[
              { label:"Products",  value:selectedSupplier.products,    color:T.blue   },
              { label:"Orders",    value:selectedSupplier.orders.toLocaleString(), color:T.green  },
              { label:"Rating",    value:selectedSupplier.rating,      color:T.gold   },
              { label:"Min Order", value:fmt(selectedSupplier.minOrder).replace("TSh ",""),color:T.amber  },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:14, fontWeight:900, color:stat.color,
                  fontFamily:"monospace", marginBottom:3 }}>{stat.value}</div>
                <div style={{ fontSize:9, color:T.textMute, fontWeight:700,
                  textTransform:"uppercase", letterSpacing:0.4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:14, fontWeight:900, color:T.textMain, marginBottom:10 }}>
            About Supplier
          </div>
          <div style={{ fontSize:13, color:T.textMid, lineHeight:1.8 }}>
            {selectedSupplier.description}
          </div>
        </div>

        {/* Key info */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:14, fontWeight:900, color:T.textMain, marginBottom:14 }}>
            Procurement Details
          </div>
          {[
            { icon:"package",  label:"Minimum Order Value", value:fmt(selectedSupplier.minOrder), color:T.amber  },
            { icon:"clock",    label:"Lead Time",           value:selectedSupplier.leadTime,       color:T.blue   },
            { icon:"truck",    label:"Delivery",            value:"Nationwide Tanzania",           color:T.green  },
            { icon:"shield",   label:"Verification",        value:selectedSupplier.verifiedType,   color:T.blue   },
            { icon:"lock",     label:"Payment",             value:"Panda Escrow Protected",        color:T.gold   },
          ].map(item => (
            <div key={item.label} style={{ display:"flex", gap:12,
              padding:"11px 0", borderBottom:`1px solid ${T.border}`,
              alignItems:"center" }}>
              <div style={{ width:36, height:36, borderRadius:10,
                background:item.color+"14",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0 }}>
                <Icon name={item.icon} size={16} color={item.color}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
                  textTransform:"uppercase", letterSpacing:0.6, marginBottom:2 }}>
                  {item.label}
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:T.textMid }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Request Quote form */}
        {view === "detail" && (
          <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
            boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:14, fontWeight:900, color:T.textMain, marginBottom:14 }}>
              Request a Quote
            </div>
            {[
              { label:"Product / Service",  placeholder:"e.g. Urea Fertilizer 50kg bags",   key:"product"     },
              { label:"Quantity Required",  placeholder:"e.g. 500 bags",                     key:"quantity"    },
              { label:"Target Budget (TSh)",placeholder:"e.g. 15,000,000",                   key:"budget"      },
              { label:"Delivery Location",  placeholder:"e.g. Morogoro Farm",               key:"location"    },
            ].map(field => (
              <div key={field.key} style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.textMute,
                  textTransform:"uppercase", letterSpacing:0.6, marginBottom:6 }}>
                  {field.label}
                </div>
                <input placeholder={field.placeholder}
                  style={{ width:"100%", background:T.navyLight,
                    border:`1.5px solid ${T.border}`, borderRadius:12,
                    padding:"11px 14px", color:T.textMain,
                    fontSize:13, outline:"none", boxSizing:"border-box" }}/>
              </div>
            ))}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.textMute,
                textTransform:"uppercase", letterSpacing:0.6, marginBottom:6 }}>
                Additional Notes
              </div>
              <textarea placeholder="Specific requirements, quality standards, certifications needed..."
                rows={3} style={{ width:"100%", background:T.navyLight,
                  border:`1.5px solid ${T.border}`, borderRadius:12,
                  padding:"11px 14px", color:T.textMain,
                  fontSize:13, outline:"none", resize:"none",
                  boxSizing:"border-box" }}/>
            </div>
            <button onClick={() => {
              showToast("Quote request sent! Supplier will respond within 24 hours.", T.green);
            }} style={{
              width:"100%", padding:"14px 0", borderRadius:16,
              background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
              border:"none", color:"#fff", fontSize:14, fontWeight:900,
              cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"center", gap:8,
              boxShadow:`0 6px 20px ${T.navy}44`,
            }}>
              <Icon name="send" size={17} color="#fff"/>
              Send Quote Request
            </button>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:430,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)",
        borderTop:`1px solid ${T.border}`,
        padding:"14px 20px 28px",
        boxShadow:"0 -4px 24px rgba(11,31,75,0.1)", zIndex:150,
      }}>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => onChatSupplier(selectedSupplier.id)} style={{
            width:50, height:50, borderRadius:16, flexShrink:0,
            background:T.navyLight, border:`1px solid ${T.border}`,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            {/* 🧭 NAVIGATE → Brick 6 Chat */}
            <Icon name="message" size={20} color={T.navy}/>
          </button>
          <button onClick={() => onCallSupplier(selectedSupplier.id)} style={{
            width:50, height:50, borderRadius:16, flexShrink:0,
            background:T.greenBg, border:`1px solid ${T.green}22`,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <Icon name="phone" size={20} color={T.green}/>
          </button>
          <button onClick={() => {
            // 💰 WALLET — connect to PandaWallet.initiateEscrow()
            showToast("Opening secure payment...", T.gold);
            onWalletPay({ supplierId: selectedSupplier.id });
          }} style={{
            flex:1, height:50, borderRadius:16,
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            border:"none", color:"#fff", fontSize:14, fontWeight:900,
            cursor:"pointer", display:"flex", alignItems:"center",
            justifyContent:"center", gap:8,
            boxShadow:`0 6px 20px ${T.gold}44`,
          }}>
            <Icon name="lock" size={17} color="#fff"/>
            Place Order (Escrow)
          </button>
        </div>
      </div>
    </div>
  );

  // ── RFQ FORM VIEW ─────────────────────────────────────────────
  if (view === "rfq_form") return (
    <div style={{
      background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input,textarea,select { font-family:inherit; }
        input::placeholder,textarea::placeholder { color:${T.textMute}; }
      `}</style>

      {toast && (
        <div style={{ position:"fixed", bottom:110, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:T.white, border:`1px solid ${toast.color}33`,
          borderLeft:`4px solid ${toast.color}`, borderRadius:14, padding:"12px 20px",
          boxShadow:T.shadowLg, whiteSpace:"nowrap",
          animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex", alignItems:"center", gap:10 }}>
          <Icon name="check" size={14} color={toast.color}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>{toast.msg}</span>
        </div>
      )}

      <div style={{ background:"rgba(255,255,255,0.96)", backdropFilter:"blur(16px)",
        padding:"14px 20px", position:"sticky", top:0, zIndex:100,
        borderBottom:`1px solid ${T.border}`,
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <button onClick={() => setView("list")} style={{
          width:40, height:40, borderRadius:12, background:T.navyLight,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="arrowLeft" size={18} color={T.navy}/>
        </button>
        <div style={{ fontSize:15, fontWeight:800, color:T.textMain }}>
          Post RFQ
        </div>
        <div style={{ width:40 }}/>
      </div>

      <div style={{ padding:"16px 20px 0" }}>
        {/* Info banner */}
        <div style={{ background:T.blueBg, border:`1px solid ${T.blue}22`,
          borderRadius:16, padding:"14px 16px", marginBottom:20,
          display:"flex", gap:10, alignItems:"flex-start" }}>
          <Icon name="info" size={18} color={T.blue}/>
          <div style={{ fontSize:12, color:T.blue, lineHeight:1.6, fontWeight:600 }}>
            Post your procurement requirement and receive competitive quotes from verified Tanzanian suppliers within 24 hours.
          </div>
        </div>

        {/* Form */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          boxShadow:T.shadow, border:`1px solid ${T.border}` }}>
          {[
            { label:"What do you need? *",       key:"title",       placeholder:"e.g. 500 Bags Urea Fertilizer 50kg", type:"text"     },
            { label:"Quantity Required *",        key:"quantity",    placeholder:"e.g. 500 bags / 10 tonnes",          type:"text"     },
            { label:"Maximum Budget (TSh) *",     key:"budget",      placeholder:"e.g. 15000000",                       type:"number"   },
            { label:"Required By (Date)",         key:"deadline",    placeholder:"",                                    type:"date"     },
          ].map(field => (
            <div key={field.key} style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:800, color:T.textMain, marginBottom:8 }}>
                {field.label}
              </div>
              <input type={field.type}
                value={rfqForm[field.key]}
                onChange={e => setRfqForm(f => ({...f, [field.key]:e.target.value}))}
                placeholder={field.placeholder}
                style={{ width:"100%", background:T.navyLight,
                  border:`1.5px solid ${T.border}`, borderRadius:14,
                  padding:"12px 14px", color:T.textMain,
                  fontSize:13, outline:"none", boxSizing:"border-box" }}/>
            </div>
          ))}

          {/* Category */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:800, color:T.textMain, marginBottom:8 }}>
              Category
            </div>
            <select value={rfqForm.category}
              onChange={e => setRfqForm(f => ({...f, category:e.target.value}))}
              style={{ width:"100%", background:T.navyLight,
                border:`1.5px solid ${T.border}`, borderRadius:14,
                padding:"12px 14px", color:T.textMain,
                fontSize:13, outline:"none", appearance:"none",
                boxSizing:"border-box" }}>
              {CATEGORIES.filter(c => c.id !== "all").map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:12, fontWeight:800, color:T.textMain, marginBottom:8 }}>
              Detailed Requirements
            </div>
            <textarea value={rfqForm.description}
              onChange={e => setRfqForm(f => ({...f, description:e.target.value}))}
              placeholder="Specify quality standards, certifications, delivery location, payment terms, and any other requirements..."
              rows={4} style={{ width:"100%", background:T.navyLight,
                border:`1.5px solid ${T.border}`, borderRadius:14,
                padding:"12px 14px", color:T.textMain,
                fontSize:13, outline:"none", resize:"none",
                boxSizing:"border-box", lineHeight:1.6 }}/>
          </div>

          <button onClick={submitRFQ} style={{
            width:"100%", padding:"15px 0", borderRadius:18,
            background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
            border:"none", color:"#fff", fontSize:15, fontWeight:900,
            cursor:"pointer", display:"flex", alignItems:"center",
            justifyContent:"center", gap:8,
            boxShadow:`0 6px 20px ${T.navy}44`,
          }}>
            <Icon name="send" size={17} color="#fff"/>
            Publish RFQ to Suppliers
          </button>
        </div>
      </div>
      <BottomNav active="discover"/>
    </div>
  );

  // ── MAIN LIST VIEW ────────────────────────────────────────────
  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input  { font-family:inherit; }
        input::placeholder { color:${T.textMute}; }
      `}</style>

      {toast && (
        <div style={{ position:"fixed", bottom:110, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:T.white, border:`1px solid ${toast.color}33`,
          borderLeft:`4px solid ${toast.color}`, borderRadius:14, padding:"12px 20px",
          boxShadow:T.shadowLg, whiteSpace:"nowrap",
          animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex", alignItems:"center", gap:10 }}>
          <Icon name="check" size={14} color={toast.color}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>{toast.msg}</span>
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{
        background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:"52px 20px 24px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, opacity:0.05,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"20px 20px" }}/>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:16, position:"relative" }}>
          <button onClick={onBack} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="arrowLeft" size={18} color="#fff"/>
          </button>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:900, color:"#fff",
              letterSpacing:-0.3 }}>B2B Marketplace</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>Wholesale · Procurement · Tenders</div>
          </div>
          <div style={{ width:40 }}/>
        </div>

        {/* Search */}
        <div style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)",
          border:"1px solid rgba(255,255,255,0.2)",
          borderRadius:16, padding:"12px 16px", position:"relative",
          display:"flex", alignItems:"center", gap:10 }}>
          <Icon name="search" size={16} color="rgba(255,255,255,0.7)"/>
          <input value={searchText} onChange={e => setSearchText(e.target.value)}
            placeholder="Search suppliers, products, tenders..."
            style={{ flex:1, background:"transparent", border:"none",
              outline:"none", fontSize:14, color:"#fff", fontWeight:600 }}/>
        </div>

        {/* Quick stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)",
          gap:10, marginTop:16, position:"relative" }}>
          {[
            { label:"Verified Suppliers", value:"1,240+" },
            { label:"Active Tenders",     value:"89"     },
            { label:"Total Traded",       value:"TSh 4B" },
          ].map(stat => (
            <div key={stat.label} style={{ background:"rgba(255,255,255,0.1)",
              border:"1px solid rgba(255,255,255,0.15)",
              borderRadius:14, padding:"10px 10px", textAlign:"center" }}>
              <div style={{ fontSize:15, fontWeight:900, color:"#fff",
                fontFamily:"monospace", marginBottom:3 }}>{stat.value}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)",
                fontWeight:700, textTransform:"uppercase",
                letterSpacing:0.4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── TABS ── */}
        <div style={{ display:"flex", background:T.card, borderRadius:18,
          border:`1px solid ${T.border}`, padding:4, marginBottom:16,
          boxShadow:T.shadow }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              flex:1, padding:"10px 4px", borderRadius:14, border:"none",
              fontSize:11, fontWeight:activeTab===t.id ? 800 : 500,
              background:activeTab===t.id ? T.navy : "transparent",
              color:activeTab===t.id ? "#fff" : T.textMute,
              transition:"all 0.2s",
              display:"flex", flexDirection:"column",
              alignItems:"center", gap:4,
              boxShadow:activeTab===t.id ? `0 4px 12px ${T.navy}33` : "none",
            }}>
              <Icon name={t.icon} size={14} color={activeTab===t.id ? "#fff" : T.textMute}/>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ SUPPLIERS TAB ══ */}
        {activeTab === "suppliers" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {/* Category pills */}
            <div style={{ display:"flex", gap:8, overflowX:"auto",
              marginBottom:16, paddingBottom:2 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                  display:"flex", alignItems:"center", gap:5,
                  padding:"7px 14px", borderRadius:99, flexShrink:0,
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

            {/* Results count */}
            <div style={{ fontSize:12, color:T.textMute, marginBottom:14,
              fontWeight:600 }}>
              {filteredSuppliers.length} supplier{filteredSuppliers.length!==1?"s":""} found
            </div>

            {/* Supplier cards */}
            {filteredSuppliers.map((supplier, i) => (
              <div key={supplier.id} onClick={() => {
                  setSelectedSupplier(supplier);
                  setView("detail");
                }}
                style={{ background:T.card, borderRadius:22, padding:"18px 20px",
                  marginBottom:14, border:`1px solid ${T.border}`,
                  boxShadow:T.shadow, cursor:"pointer",
                  animation:`fadeUp 0.25s ease ${i*0.06}s both`,
                  transition:"all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=T.shadowMd; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=T.shadow; }}>

                <div style={{ display:"flex", gap:14, alignItems:"flex-start",
                  marginBottom:12 }}>
                  <div style={{ position:"relative" }}>
                    <div style={{ width:52, height:52, borderRadius:16,
                      background:`linear-gradient(135deg,${supplier.color}22,${supplier.color}44)`,
                      border:`2px solid ${supplier.color}33`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:18, fontWeight:900, color:supplier.color }}>
                      {supplier.initials}
                    </div>
                    {supplier.verified && (
                      <div style={{ position:"absolute", bottom:-4, right:-4,
                        width:18, height:18, borderRadius:"50%",
                        background:T.blue, border:`2px solid ${T.white}`,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name="shield" size={9} color="#fff"/>
                      </div>
                    )}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      alignItems:"flex-start", marginBottom:4 }}>
                      <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
                        flex:1, marginRight:8, lineHeight:1.3 }}>
                        {supplier.name}
                      </div>
                      {/* Trust ring */}
                      <div style={{ width:36, height:36, borderRadius:"50%", flexShrink:0,
                        background:`conic-gradient(${T.green} ${supplier.trustScore*3.6}deg, ${T.border} 0deg)`,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <div style={{ width:30, height:30, borderRadius:"50%",
                          background:T.white, display:"flex", flexDirection:"column",
                          alignItems:"center", justifyContent:"center" }}>
                          <span style={{ fontSize:9, fontWeight:900,
                            color:T.green, lineHeight:1 }}>{supplier.trustScore}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:5,
                      marginBottom:6 }}>
                      <Icon name="mapPin" size={11} color={T.textMute}/>
                      <span style={{ fontSize:11, color:T.textMute }}>
                        {supplier.location}
                      </span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <Icon name="star" size={11} color={T.gold}/>
                      <span style={{ fontSize:11, fontWeight:800,
                        color:T.textMid }}>{supplier.rating}</span>
                      <span style={{ fontSize:10, color:T.textMute }}>
                        ({supplier.reviewCount})
                      </span>
                      <span style={{ color:T.border }}>·</span>
                      <span style={{ fontSize:11, color:T.textMute }}>
                        {supplier.products} products
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                  {supplier.badge && (
                    <div style={{ background:T.goldLight, border:`1px solid ${T.gold}33`,
                      borderRadius:8, padding:"2px 9px",
                      fontSize:10, fontWeight:900, color:T.gold }}>
                      {supplier.badge}
                    </div>
                  )}
                  {supplier.tags.map(tag => (
                    <div key={tag} style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
                      borderRadius:8, padding:"2px 8px",
                      fontSize:10, fontWeight:700, color:T.green }}>{tag}</div>
                  ))}
                </div>

                {/* Key info */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
                  gap:8 }}>
                  {[
                    { label:"Min Order",  value:fmt(supplier.minOrder), color:T.amber },
                    { label:"Lead Time",  value:supplier.leadTime,      color:T.blue  },
                  ].map(item => (
                    <div key={item.label} style={{ background:T.bg, borderRadius:12,
                      padding:"8px 12px", border:`1px solid ${T.border}` }}>
                      <div style={{ fontSize:9, color:T.textMute, fontWeight:700,
                        textTransform:"uppercase", letterSpacing:0.5, marginBottom:3 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize:12, fontWeight:800, color:item.color,
                        fontFamily:item.label==="Min Order"?"monospace":"inherit" }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ RFQ TAB ══ */}
        {activeTab === "rfq" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {/* Post RFQ button */}
            <button onClick={() => setView("rfq_form")} style={{
              width:"100%", padding:"14px 0", borderRadius:18, marginBottom:16,
              background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
              border:"none", color:"#fff", fontSize:14, fontWeight:900,
              cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"center", gap:8,
              boxShadow:`0 6px 20px ${T.navy}44`,
            }}>
              <Icon name="plus" size={18} color="#fff"/>
              Post New RFQ
            </button>

            {/* Info box */}
            <div style={{ background:T.blueBg, border:`1px solid ${T.blue}22`,
              borderRadius:16, padding:"14px 16px", marginBottom:16,
              display:"flex", gap:10, alignItems:"flex-start" }}>
              <Icon name="info" size={16} color={T.blue}/>
              <div style={{ fontSize:12, color:T.blue, lineHeight:1.6, fontWeight:600 }}>
                RFQ = Request for Quotation. Post what you need and verified suppliers will send you their best prices.
              </div>
            </div>

            {/* RFQ list */}
            {rfqs.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 0" }}>
                <div style={{ fontSize:"48px", marginBottom:12 }}>📋</div>
                <div style={{ fontSize:16, fontWeight:800, color:T.textMain, marginBottom:8 }}>
                  No RFQs yet
                </div>
                <div style={{ fontSize:13, color:T.textMute }}>
                  Post your first procurement requirement
                </div>
              </div>
            ) : rfqs.map(rfq => (
              <div key={rfq.id} style={{ background:T.card, borderRadius:22,
                padding:"18px 20px", marginBottom:14,
                border:`1px solid ${rfq.status==="active" ? T.blue+"33" : T.border}`,
                boxShadow:T.shadow }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"flex-start", marginBottom:10 }}>
                  <div style={{ flex:1, marginRight:10 }}>
                    <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
                      marginBottom:4, lineHeight:1.3 }}>{rfq.title}</div>
                    <div style={{ fontSize:11, color:T.textMute }}>{rfq.createdAt}</div>
                  </div>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:4,
                    background: rfq.status==="active" ? T.blueBg : T.navyLight,
                    border:`1px solid ${rfq.status==="active" ? T.blue+"33" : T.border}`,
                    borderRadius:8, padding:"3px 9px", flexShrink:0 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%",
                      background:rfq.status==="active" ? T.blue : T.textMute }}/>
                    <span style={{ fontSize:10, fontWeight:800,
                      color:rfq.status==="active" ? T.blue : T.textMute,
                      textTransform:"capitalize" }}>{rfq.status}</span>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
                  gap:8, marginBottom:12 }}>
                  {[
                    { label:"Quantity", value:rfq.quantity  },
                    { label:"Budget",   value:rfq.budget ? fmt(rfq.budget) : "–" },
                    { label:"Quotes",   value:`${rfq.quotes} received` },
                  ].map(item => (
                    <div key={item.label} style={{ background:T.bg, borderRadius:10,
                      padding:"8px 10px", border:`1px solid ${T.border}` }}>
                      <div style={{ fontSize:9, color:T.textMute, fontWeight:700,
                        textTransform:"uppercase", letterSpacing:0.4,
                        marginBottom:3 }}>{item.label}</div>
                      <div style={{ fontSize:11, fontWeight:800, color:T.navy,
                        fontFamily:item.label==="Budget"?"monospace":"inherit" }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
                {rfq.quotes > 0 && (
                  <button onClick={() => showToast("Opening quotes...", T.navy)} style={{
                    width:"100%", padding:"10px 0", borderRadius:12,
                    background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
                    border:"none", fontSize:12, fontWeight:900, color:"#fff",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                  }}>
                    <Icon name="fileText" size={14} color="#fff"/>
                    View {rfq.quotes} Quote{rfq.quotes>1?"s":""}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ══ TENDERS TAB ══ */}
        {activeTab === "tenders" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ fontSize:13, color:T.textMute, marginBottom:16,
              fontWeight:600 }}>
              Active government & NGO tenders open for bidding
            </div>
            {MOCK_TENDERS.map((tender, i) => {
              const isExpanded = expandedTender === tender.id;
              const applied    = appliedTenders[tender.id];
              const daysLeft   = Math.ceil((new Date(tender.deadline) - new Date()) / (1000*60*60*24));
              return (
                <div key={tender.id} style={{ background:T.card, borderRadius:22,
                  marginBottom:14, border:`1px solid ${T.border}`,
                  boxShadow:T.shadow, overflow:"hidden",
                  animation:`fadeUp 0.25s ease ${i*0.08}s both` }}>

                  {/* Header */}
                  <div onClick={() => setExpandedTender(isExpanded ? null : tender.id)}
                    style={{ padding:"18px 20px", cursor:"pointer" }}>
                    <div style={{ display:"flex", gap:12, alignItems:"flex-start",
                      marginBottom:12 }}>
                      <div style={{ width:48, height:48, borderRadius:14, flexShrink:0,
                        background:`linear-gradient(135deg,${tender.color}22,${tender.color}44)`,
                        border:`1.5px solid ${tender.color}33`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:16, fontWeight:900, color:tender.color }}>
                        {tender.initials}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
                          lineHeight:1.3, marginBottom:4 }}>{tender.title}</div>
                        <div style={{ fontSize:12, color:T.textMute }}>
                          {tender.issuer}
                        </div>
                      </div>
                      <Icon name={isExpanded ? "chevronUp" : "chevronDown"}
                        size={16} color={T.textMute}/>
                    </div>

                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
                      gap:8 }}>
                      {[
                        { label:"Value",     value:fmt(tender.value), color:T.green  },
                        { label:"Deadline",  value:new Date(tender.deadline).toLocaleDateString("en-GB",{day:"numeric",month:"short"}), color:daysLeft < 14 ? T.red : T.navy },
                        { label:"Days Left", value:`${daysLeft}d`,    color:daysLeft < 14 ? T.red : T.blue  },
                      ].map(item => (
                        <div key={item.label} style={{ background:T.bg, borderRadius:10,
                          padding:"8px 10px", border:`1px solid ${T.border}` }}>
                          <div style={{ fontSize:9, color:T.textMute, fontWeight:700,
                            textTransform:"uppercase", letterSpacing:0.4, marginBottom:3 }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize:12, fontWeight:900, color:item.color,
                            fontFamily:item.label==="Value"?"monospace":"inherit" }}>
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div style={{ borderTop:`1px solid ${T.border}`,
                      padding:"16px 20px", animation:"fadeUp 0.2s ease" }}>
                      <div style={{ fontSize:13, color:T.textMid, lineHeight:1.75,
                        marginBottom:14 }}>{tender.description}</div>
                      <div style={{ marginBottom:14 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:T.textMute,
                          textTransform:"uppercase", letterSpacing:0.6, marginBottom:8 }}>
                          Requirements
                        </div>
                        {tender.requirements.map(req => (
                          <div key={req} style={{ display:"flex", gap:7,
                            alignItems:"center", marginBottom:6 }}>
                            <div style={{ width:18, height:18, borderRadius:"50%",
                              background:T.blue+"14",
                              display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <Icon name="check" size={10} color={T.blue}/>
                            </div>
                            <span style={{ fontSize:12, color:T.textMid,
                              fontWeight:600 }}>{req}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => {
                        if (applied) return;
                        setAppliedTenders(a => ({...a,[tender.id]:true}));
                        // 🔌 BACKEND — supabase.from('tender_applications').insert({
                        //   tender_id: tender.id, supplier_id: currentUser.id,
                        //   status: 'submitted', applied_at: new Date()
                        // })
                        showToast("Application submitted successfully!", T.green);
                      }} style={{
                        width:"100%", padding:"13px 0", borderRadius:14,
                        background: applied
                          ? T.greenBg
                          : `linear-gradient(135deg,${T.gold},#A07008)`,
                        border: applied ? `1px solid ${T.green}33` : "none",
                        color: applied ? T.green : "#fff",
                        fontSize:13, fontWeight:900,
                        cursor: applied ? "default" : "pointer",
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:7,
                        boxShadow: applied ? "none" : `0 6px 20px ${T.gold}44`,
                      }}>
                        <Icon name={applied ? "check" : "send"} size={15}
                          color={applied ? T.green : "#fff"}/>
                        {applied ? "Application Submitted" : "Apply for This Tender"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      <BottomNav active="discover"/>
    </div>
  );
}

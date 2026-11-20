import { useState } from "react";

// ============================================================
// 🧱 BRICK 11B — B2B SUPPLIER DASHBOARD
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export B2BSupplierDashboard from this file
//     Props: { supplierId, currentUser, onBack, onNavigate }
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
    bell:         <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...s}/><path d="M13.73 21a2 2 0 0 1-3.46 0" {...s}/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    phone:        <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" {...s}/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/><polyline points="3.27 6.96 12 12.01 20.73 6.96" {...s}/><line x1="12" y1="22.08" x2="12" y2="12" {...s}/></>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    send:         <><line x1="22" y1="2" x2="11" y2="13" {...s}/><polygon points="22 2 15 22 11 13 2 9 22 2" {...s}/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    trending:     <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    arrowUp:      <><line x1="12" y1="19" x2="12" y2="5" {...s}/><polyline points="5 12 12 5 19 12" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
    eyeOff:       <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" {...s}/><line x1="1" y1="1" x2="23" y2="23" {...s}/></>,
    settings:     <><circle cx="12" cy="12" r="3" {...s}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    briefcase:    <><rect x="2" y="7" width="20" height="14" rx="2" {...s}/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    mapPin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    edit:         <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...s}/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    percent:      <><line x1="19" y1="5" x2="5" y2="19" {...s}/><circle cx="6.5" cy="6.5" r="2.5" {...s}/><circle cx="17.5" cy="17.5" r="2.5" {...s}/></>,
    toggle:       <><rect x="1" y="5" width="22" height="14" rx="7" ry="7" {...s}/><circle cx="16" cy="12" r="3" fill={color} stroke="none"/></>,
    toggleOff:    <><rect x="1" y="5" width="22" height="14" rx="7" ry="7" {...s}/><circle cx="8" cy="12" r="3" fill={color} stroke="none"/></>,
    leaf:         <><path d="M17 8C8 10 5.9 16.17 3.82 22.5L2 22l1-10a9 9 0 0 1 9-9 8.41 8.41 0 0 1 5.82 2.29l.18-1.29" {...s}/></>,
    info:         <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav ───────────────────────────────────────────────
function BottomNav({ active = "profile" }) {
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
// 🔌 BACKEND SWAP POINT #1 — SUPPLIER PROFILE & WALLET
// Replace with: supabase.from('b2b_suppliers')
//   .select('*').eq('owner_id', currentUser.id).single()
// 💰 WALLET: supabase.from('wallets')
//   .select('*').eq('user_id', currentUser.id).single()
// ============================================================
const MOCK_SUPPLIER = {
  id:          "SUP-001",
  name:        "TanzAgro Supplies Ltd",
  initials:    "TA",
  color:       "#0A7B4B",
  category:    "Agriculture",
  trustScore:  97,
  rating:      4.8,
  reviewCount: 234,
  verified:    true,
  responseRate: 96,
  onTimeDelivery: 98,
  wallet: {
    balance:    28450000,
    pending:    4200000,
    today:      1850000,
    thisMonth:  42800000,
  },
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — INCOMING RFQs
// Replace with: supabase.from('rfq_requests')
//   .select('*,buyer(*)')
//   .contains('matched_suppliers', [supplierId])
//   .eq('status', 'active')
//   .order('created_at', { ascending: false })
// Real-time: supabase.channel('rfq_requests')
//   .on('postgres_changes', { event: 'INSERT',
//        schema: 'public', table: 'rfq_requests',
//        filter: `category=eq.${supplier.category}` },
//     payload => addNewRFQ(payload.new))
//   .subscribe()
// ============================================================
const MOCK_RFQS = [
  {
    id:"RFQ-001", isNew:true,
    title:"500 Bags Urea Fertilizer 50kg",
    buyerName:"BAK Enterprise", buyerInitials:"BE", buyerColor:"#1D4ED8",
    buyerLocation:"Morogoro", buyerRating:4.5,
    quantity:"500 bags", budget:15000000,
    deadline:"2026-08-01", receivedAt:"5 mins ago",
    description:"Need 500 bags of Urea fertilizer 50kg each. Delivery to Morogoro farm. Quality certified.",
    quoteSent:false,
  },
  {
    id:"RFQ-002", isNew:false,
    title:"1 Tonne Hybrid Maize Seeds",
    buyerName:"Kilimo Holdings", buyerInitials:"KH", buyerColor:"#6D28D9",
    buyerLocation:"Arusha", buyerRating:4.8,
    quantity:"1,000 kg", budget:8000000,
    deadline:"2026-07-28", receivedAt:"2 hours ago",
    description:"Require certified hybrid maize seeds for 500 acres planting season. Must have phytosanitary certificate.",
    quoteSent:true, quoteAmount:7200000,
  },
  {
    id:"RFQ-003", isNew:false,
    title:"Farm Equipment — 10 Hand Tractors",
    buyerName:"Mkulima Co-op", buyerInitials:"MC", buyerColor:"#0A7B4B",
    buyerLocation:"Dodoma", buyerRating:4.3,
    quantity:"10 units", budget:12000000,
    deadline:"2026-08-10", receivedAt:"1 day ago",
    description:"Need 10 hand tractors with accessories for smallholder farmers cooperative.",
    quoteSent:false,
  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #3 — ACTIVE ORDERS
// Replace with: supabase.from('b2b_orders')
//   .select('*,buyer(*)')
//   .eq('supplier_id', supplierId)
//   .in('status', ['confirmed','processing','shipped'])
//   .order('created_at', { ascending: false })
// ============================================================
const MOCK_ORDERS = [
  {
    id:"ORD-B001", buyerName:"BAK Enterprise",   buyerInitials:"BE", buyerColor:"#1D4ED8",
    product:"Urea Fertilizer 50kg × 200 bags",   amount:6000000,
    status:"processing", placedAt:"Yesterday",   deliveryDate:"2026-07-20",
  },
  {
    id:"ORD-B002", buyerName:"Green Farms Ltd",  buyerInitials:"GF", buyerColor:"#0A7B4B",
    product:"NPK Fertilizer 50kg × 100 bags",    amount:4500000,
    status:"shipped",    placedAt:"3 days ago",  deliveryDate:"2026-07-18",
  },
  {
    id:"ORD-B003", buyerName:"Kilimo Holdings",  buyerInitials:"KH", buyerColor:"#6D28D9",
    product:"Hybrid Maize Seeds × 500kg",         amount:3600000,
    status:"delivered",  placedAt:"1 week ago",  deliveryDate:"2026-07-14",
  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #4 — PRODUCTS CATALOG
// Replace with: supabase.from('b2b_products')
//   .select('*').eq('supplier_id', supplierId)
//   .order('created_at', { ascending: false })
// ============================================================
const MOCK_PRODUCTS = [
  { id:1, name:"Urea Fertilizer 50kg",     price:28000,   unit:"bag",  stock:2400, active:true,  orders:1240 },
  { id:2, name:"NPK 17-17-17 Fertilizer",  price:32000,   unit:"bag",  stock:1800, active:true,  orders:890  },
  { id:3, name:"Hybrid Maize Seeds 2kg",   price:8500,    unit:"pack", stock:5000, active:true,  orders:2100 },
  { id:4, name:"Pesticide Confidor 1L",    price:45000,   unit:"bottle",stock:320, active:false, orders:340  },
  { id:5, name:"Hand Tractor Basic",       price:1200000, unit:"unit", stock:15,   active:true,  orders:48   },
];

const ORDER_STATUS = {
  confirmed:  { label:"Confirmed",  color:T.blue,  bg:T.blueBg,  icon:"check"   },
  processing: { label:"Processing", color:T.amber, bg:T.amberBg, icon:"package" },
  shipped:    { label:"Shipped",    color:T.teal,  bg:T.tealBg,  icon:"truck"   },
  delivered:  { label:"Delivered",  color:T.green, bg:T.greenBg, icon:"check"   },
};

// ============================================================
// 🧱 MAIN COMPONENT — B2BSupplierDashboard
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user from supabase.auth.getUser()
  currentUser     = { id:"owner-001", name:"TanzAgro Manager" },
  supplier        = MOCK_SUPPLIER,
  initialRFQs     = MOCK_RFQS,
  initialOrders   = MOCK_ORDERS,
  initialProducts = MOCK_PRODUCTS,

  // 🧭 NAVIGATE
  onBack          = () => {},   // → previous screen
  onChatBuyer     = () => {},   // → Brick 6 Marketplace Chat
  onCallBuyer     = () => {},   // → phone dialer
  onViewAnalytics = () => {},   // → Brick 5 Seller Command Center
  onSettings      = () => {},   // → Settings screen
  // 💰 WALLET
  onWithdraw      = () => {},   // → PandaWallet.withdraw()
}) {
  const [activeTab,    setActiveTab]    = useState("rfqs");
  const [rfqs,         setRfqs]         = useState(initialRFQs);
  const [orders,       setOrders]       = useState(initialOrders);
  const [products,     setProducts]     = useState(initialProducts);
  const [showBalance,  setShowBalance]  = useState(true);
  const [newRFQAlert,  setNewRFQAlert]  = useState(true);
  const [expandedRFQ,  setExpandedRFQ]  = useState("RFQ-001");
  const [quoteModal,   setQuoteModal]   = useState(null);
  const [quoteAmount,  setQuoteAmount]  = useState("");
  const [quoteNote,    setQuoteNote]    = useState("");
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  // 🔌 BACKEND — send quote to buyer
  // supabase.from('rfq_quotes').insert({
  //   rfq_id: rfq.id, supplier_id: supplier.id,
  //   amount: quoteAmount, note: quoteNote,
  //   status: 'sent', sent_at: new Date()
  // })
  const sendQuote = (rfqId) => {
    if (!quoteAmount) { showToast("Please enter a quote amount", T.red); return; }
    setRfqs(rs => rs.map(r =>
      r.id === rfqId ? { ...r, quoteSent:true, quoteAmount:parseInt(quoteAmount) } : r
    ));
    setQuoteModal(null);
    setQuoteAmount("");
    setQuoteNote("");
    showToast("Quote sent successfully! Buyer will be notified.", T.green);
  };

  // 🔌 BACKEND — update order status
  // supabase.from('b2b_orders').update({ status: nextStatus }).eq('id', orderId)
  // 💰 WALLET — on delivered: PandaWallet.releaseEscrow(orderId)
  const updateOrder = (orderId, nextStatus) => {
    setOrders(os => os.map(o =>
      o.id === orderId ? { ...o, status:nextStatus } : o
    ));
    const msgs = {
      processing: "Order is now being processed!",
      shipped:    "Order marked as shipped!",
      delivered:  "Order delivered! Escrow payment released.",
    };
    showToast(msgs[nextStatus], T.green);
  };

  const toggleProduct = (productId) => {
    // 🔌 BACKEND — supabase.from('b2b_products')
    //   .update({ active: !current }).eq('id', productId)
    setProducts(ps => ps.map(p =>
      p.id === productId ? { ...p, active:!p.active } : p
    ));
  };

  const newRFQs       = rfqs.filter(r => r.isNew);
  const pendingRFQs   = rfqs.filter(r => !r.quoteSent);
  const activeOrders  = orders.filter(o => o.status !== "delivered");

  const TABS = [
    { id:"rfqs",     label:"RFQs",     icon:"fileText",  badge:pendingRFQs.length },
    { id:"orders",   label:"Orders",   icon:"package",   badge:activeOrders.length },
    { id:"products", label:"Products", icon:"briefcase", badge:null                },
    { id:"analytics",label:"Analytics",icon:"barChart",  badge:null                },
  ];

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes ring     { 0%{transform:rotate(0)} 15%{transform:rotate(15deg)} 30%{transform:rotate(-10deg)} 45%{transform:rotate(8deg)} 60%{transform:rotate(-5deg)} 75%{transform:rotate(3deg)} 100%{transform:rotate(0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input,textarea { font-family:inherit; }
        input::placeholder,textarea::placeholder { color:${T.textMute}; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:100, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:T.white,
          border:`1px solid ${toast.color}33`,
          borderLeft:`4px solid ${toast.color}`,
          borderRadius:14, padding:"12px 20px",
          boxShadow:T.shadowLg, whiteSpace:"nowrap",
          animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex", alignItems:"center", gap:10,
        }}>
          <Icon name="check" size={14} color={toast.color}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>{toast.msg}</span>
        </div>
      )}

      {/* ── QUOTE MODAL ── */}
      {quoteModal && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setQuoteModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.white, borderRadius:"28px 28px 0 0",
            padding:"28px 24px 40px", width:"100%", maxWidth:430,
            animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <div style={{ width:40, height:4, borderRadius:99,
              background:T.border, margin:"0 auto 24px" }}/>
            <div style={{ fontSize:18, fontWeight:900, color:T.textMain,
              marginBottom:4 }}>Send Quote</div>
            <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>
              {quoteModal.title}
            </div>

            {/* Buyer budget reference */}
            <div style={{ background:T.blueBg, border:`1px solid ${T.blue}22`,
              borderRadius:14, padding:"12px 16px", marginBottom:20,
              display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:T.blue,
                  textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>
                  Buyer's Budget
                </div>
                <div style={{ fontSize:16, fontWeight:900, color:T.navy,
                  fontFamily:"monospace" }}>{fmt(quoteModal.budget)}</div>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:T.textMute,
                  marginBottom:2 }}>Quantity</div>
                <div style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                  {quoteModal.quantity}
                </div>
              </div>
            </div>

            {/* Quote amount input */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                marginBottom:8 }}>Your Quote Amount (TSh) *</div>
              <input type="number" value={quoteAmount}
                onChange={e => setQuoteAmount(e.target.value)}
                placeholder="e.g. 13500000"
                style={{ width:"100%", background:T.navyLight,
                  border:`1.5px solid ${T.border}`, borderRadius:14,
                  padding:"13px 16px", color:T.textMain,
                  fontSize:15, fontWeight:900, outline:"none",
                  fontFamily:"monospace", boxSizing:"border-box" }}/>
              {quoteAmount && (
                <div style={{ fontSize:12, color:T.textMute, marginTop:6 }}>
                  = {fmt(parseInt(quoteAmount) || 0)}
                </div>
              )}
            </div>

            {/* Note */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                marginBottom:8 }}>Message to Buyer</div>
              <textarea value={quoteNote}
                onChange={e => setQuoteNote(e.target.value)}
                placeholder="e.g. Price includes delivery to Morogoro. 14-day payment terms available. Certificate of analysis included."
                rows={3} style={{ width:"100%", background:T.navyLight,
                  border:`1.5px solid ${T.border}`, borderRadius:14,
                  padding:"12px 16px", color:T.textMain,
                  fontSize:13, outline:"none", resize:"none",
                  boxSizing:"border-box", lineHeight:1.6 }}/>
            </div>

            {/* Escrow note */}
            <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
              borderRadius:16, padding:"12px 16px", marginBottom:20,
              display:"flex", gap:10, alignItems:"center" }}>
              <Icon name="shield" size={18} color={T.gold}/>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)", lineHeight:1.5 }}>
                Payment will be held in Panda Escrow until delivery confirmed by buyer.
              </div>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setQuoteModal(null)} style={{
                flex:1, padding:"14px 0", borderRadius:16,
                background:T.navyLight, border:`1px solid ${T.border}`,
                fontSize:13, fontWeight:800, color:T.textMid,
              }}>Cancel</button>
              <button onClick={() => sendQuote(quoteModal.id)} style={{
                flex:2, padding:"14px 0", borderRadius:16,
                background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
                border:"none", color:"#fff", fontSize:14, fontWeight:900,
                display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                boxShadow:`0 6px 20px ${T.green}44`,
              }}>
                <Icon name="send" size={16} color="#fff"/>
                Send Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW RFQ ALERT ── */}
      {newRFQAlert && newRFQs.length > 0 && (
        <div style={{
          position:"fixed", top:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:430, zIndex:500,
          background:T.green, padding:"14px 20px",
          display:"flex", gap:12, alignItems:"center",
          animation:"slideIn 0.3s ease",
        }}>
          <div style={{ animation:"ring 0.8s infinite" }}>
            <Icon name="bell" size={22} color="#fff"/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:900, color:"#fff" }}>
              New RFQ! {newRFQs[0].buyerName}
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.8)" }}>
              {newRFQs[0].title} · Budget {fmt(newRFQs[0].budget)}
            </div>
          </div>
          <button onClick={() => { setNewRFQAlert(false); setActiveTab("rfqs"); }} style={{
            padding:"7px 14px", borderRadius:10,
            background:"rgba(255,255,255,0.2)",
            border:"1px solid rgba(255,255,255,0.3)",
            fontSize:12, fontWeight:800, color:"#fff",
          }}>View</button>
          <button onClick={() => setNewRFQAlert(false)} style={{
            width:28, height:28, borderRadius:"50%",
            background:"rgba(255,255,255,0.15)", border:"none",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <Icon name="x" size={14} color="#fff"/>
          </button>
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{
        background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:`${newRFQAlert && newRFQs.length > 0 ? "68px" : "52px"} 20px 24px`,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, opacity:0.05,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"20px 20px" }}/>

        {/* Top row */}
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:20, position:"relative" }}>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ width:46, height:46, borderRadius:14,
              background:`linear-gradient(135deg,${supplier.color}44,${supplier.color}88)`,
              border:"2px solid rgba(255,255,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, fontWeight:900, color:"#fff" }}>
              {supplier.initials}
            </div>
            <div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
                fontWeight:600, marginBottom:2 }}>Supplier Dashboard</div>
              <div style={{ fontSize:16, fontWeight:900, color:"#fff",
                letterSpacing:-0.3 }}>{supplier.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
                {supplier.verified && (
                  <div style={{ display:"flex", alignItems:"center", gap:4,
                    background:"rgba(29,78,216,0.3)", border:"1px solid rgba(29,78,216,0.5)",
                    borderRadius:7, padding:"2px 7px" }}>
                    <Icon name="shield" size={9} color="#93C5FD"/>
                    <span style={{ fontSize:9, fontWeight:800, color:"#93C5FD" }}>
                      Verified
                    </span>
                  </div>
                )}
                <div style={{ display:"flex", alignItems:"center", gap:3,
                  background:"rgba(10,123,75,0.3)", border:"1px solid rgba(10,123,75,0.5)",
                  borderRadius:7, padding:"2px 7px" }}>
                  <div style={{ width:5, height:5, borderRadius:"50%",
                    background:"#4ADE80", animation:"pulse 2s infinite" }}/>
                  <span style={{ fontSize:9, fontWeight:800, color:"#4ADE80" }}>
                    {supplier.trustScore} Trust
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button style={{ width:38, height:38, borderRadius:11,
              background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center",
              position:"relative" }}>
              <Icon name="bell" size={17} color="#fff"/>
              {newRFQs.length > 0 && (
                <div style={{ position:"absolute", top:7, right:7, width:8, height:8,
                  background:T.red, borderRadius:"50%",
                  border:"1.5px solid rgba(11,31,75,0.8)",
                  animation:"pulse 1s infinite" }}/>
              )}
            </button>
            <button onClick={onSettings} style={{ width:38, height:38, borderRadius:11,
              background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="settings" size={17} color="#fff"/>
            </button>
          </div>
        </div>

        {/* 💰 WALLET CARD */}
        <div style={{
          background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,0.15)",
          borderRadius:20, padding:"16px 20px",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:4 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Icon name="wallet" size={13} color="rgba(255,255,255,0.7)"/>
              <span style={{ fontSize:11, fontWeight:700,
                color:"rgba(255,255,255,0.7)" }}>Panda Wallet Balance</span>
            </div>
            <button onClick={() => setShowBalance(s => !s)} style={{
              background:"none", border:"none",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name={showBalance ? "eye" : "eyeOff"} size={15}
                color="rgba(255,255,255,0.6)"/>
            </button>
          </div>
          <div style={{ fontSize:28, fontWeight:900, color:"#fff",
            fontFamily:"monospace", letterSpacing:-1, marginBottom:12 }}>
            {/* 💰 WALLET — swap with PandaWallet.getBalance() */}
            {showBalance ? fmt(supplier.wallet.balance) : "TSh ••••••••"}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)",
            gap:8, marginBottom:14 }}>
            {[
              { label:"TODAY",      value:fmt(supplier.wallet.today),     color:T.goldMid                },
              { label:"THIS MONTH", value:fmt(supplier.wallet.thisMonth), color:"rgba(255,255,255,0.9)" },
              { label:"PENDING",    value:fmt(supplier.wallet.pending),   color:"rgba(255,255,255,0.6)" },
            ].map(item => (
              <div key={item.label} style={{ background:"rgba(255,255,255,0.08)",
                borderRadius:10, padding:"8px 10px" }}>
                <div style={{ fontSize:8, color:"rgba(255,255,255,0.5)",
                  fontWeight:700, marginBottom:3 }}>{item.label}</div>
                <div style={{ fontSize:11, fontWeight:900, color:item.color,
                  fontFamily:"monospace" }}>{item.value}</div>
              </div>
            ))}
          </div>
          <button onClick={onWithdraw} style={{
            width:"100%", padding:"11px 0", borderRadius:14,
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            border:"none", color:"#fff", fontSize:13, fontWeight:900,
            cursor:"pointer", display:"flex", alignItems:"center",
            justifyContent:"center", gap:7,
            boxShadow:`0 4px 16px ${T.gold}44`,
          }}>
            <Icon name="wallet" size={15} color="#fff"/>
            {/* 💰 WALLET — connect to PandaWallet.withdraw() */}
            Withdraw Earnings
          </button>
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── QUICK STATS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          gap:10, marginBottom:16 }}>
          {[
            { label:"Open RFQs",  value:pendingRFQs.length,          icon:"fileText",  color:T.blue   },
            { label:"Orders",     value:activeOrders.length,          icon:"package",   color:T.amber  },
            { label:"Response",   value:supplier.responseRate+"%",    icon:"zap",       color:T.green  },
            { label:"On-Time",    value:supplier.onTimeDelivery+"%",  icon:"truck",     color:T.teal   },
          ].map(stat => (
            <div key={stat.label} style={{ background:T.card, borderRadius:18,
              padding:"14px 8px", textAlign:"center",
              border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
              <div style={{ width:30, height:30, borderRadius:9,
                background:stat.color+"14",
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 7px" }}>
                <Icon name={stat.icon} size={14} color={stat.color}/>
              </div>
              <div style={{ fontSize:13, fontWeight:900, color:T.navy,
                fontFamily:"monospace", marginBottom:2 }}>{stat.value}</div>
              <div style={{ fontSize:9, color:T.textMute, fontWeight:700,
                textTransform:"uppercase", letterSpacing:0.4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

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
              transition:"all 0.2s", position:"relative",
              display:"flex", flexDirection:"column",
              alignItems:"center", gap:4,
              boxShadow:activeTab===t.id ? `0 4px 12px ${T.navy}33` : "none",
            }}>
              <Icon name={t.icon} size={14} color={activeTab===t.id ? "#fff" : T.textMute}/>
              {t.label}
              {t.badge > 0 && (
                <div style={{ position:"absolute", top:4, right:4,
                  minWidth:16, height:16, borderRadius:99,
                  background:T.red, display:"flex", alignItems:"center",
                  justifyContent:"center", padding:"0 4px" }}>
                  <span style={{ fontSize:9, fontWeight:900, color:"#fff" }}>
                    {t.badge}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ══ RFQs TAB ══ */}
        {activeTab === "rfqs" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {rfqs.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 0" }}>
                <div style={{ fontSize:"48px", marginBottom:12 }}>📋</div>
                <div style={{ fontSize:16, fontWeight:800, color:T.textMain, marginBottom:8 }}>
                  No RFQs yet
                </div>
                <div style={{ fontSize:13, color:T.textMute }}>
                  Matching RFQs from buyers will appear here
                </div>
              </div>
            ) : rfqs.map(rfq => (
              <div key={rfq.id} style={{
                background:T.card, borderRadius:22, marginBottom:14,
                border:`1.5px solid ${rfq.isNew ? T.green+"44" : rfq.quoteSent ? T.border : T.blue+"33"}`,
                boxShadow:rfq.isNew ? `0 0 0 3px ${T.green}18` : T.shadow,
                overflow:"hidden",
                animation:rfq.isNew ? "bounceIn 0.4s ease" : "fadeUp 0.25s ease",
              }}>
                {/* RFQ Header */}
                <div onClick={() => setExpandedRFQ(expandedRFQ===rfq.id ? null : rfq.id)}
                  style={{ padding:"16px 18px", cursor:"pointer",
                    display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ position:"relative" }}>
                    <div style={{ width:46, height:46, borderRadius:14, flexShrink:0,
                      background:`linear-gradient(135deg,${rfq.buyerColor}22,${rfq.buyerColor}44)`,
                      border:`2px solid ${rfq.buyerColor}33`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:15, fontWeight:900, color:rfq.buyerColor }}>
                      {rfq.buyerInitials}
                    </div>
                    {rfq.isNew && (
                      <div style={{ position:"absolute", top:-4, right:-4,
                        width:14, height:14, borderRadius:"50%",
                        background:T.green, border:`2px solid ${T.white}`,
                        animation:"pulse 1.5s infinite" }}/>
                    )}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      alignItems:"center", marginBottom:4 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <span style={{ fontSize:13, fontWeight:800,
                          color:T.textMain,
                          overflow:"hidden", textOverflow:"ellipsis",
                          whiteSpace:"nowrap", maxWidth:160 }}>
                          {rfq.title}
                        </span>
                        {rfq.isNew && (
                          <div style={{ background:T.green, borderRadius:7,
                            padding:"1px 7px", fontSize:9,
                            fontWeight:900, color:"#fff",
                            flexShrink:0 }}>NEW</div>
                        )}
                      </div>
                      <span style={{ fontSize:11, color:T.textMute,
                        flexShrink:0, marginLeft:4 }}>{rfq.receivedAt}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      alignItems:"center" }}>
                      <div style={{ fontSize:12, color:T.textMute }}>
                        {rfq.buyerName} · {rfq.buyerLocation}
                      </div>
                      {rfq.quoteSent ? (
                        <div style={{ display:"inline-flex", alignItems:"center", gap:4,
                          background:T.greenBg, border:`1px solid ${T.green}33`,
                          borderRadius:8, padding:"2px 8px" }}>
                          <Icon name="check" size={10} color={T.green}/>
                          <span style={{ fontSize:10, fontWeight:800,
                            color:T.green }}>Quoted</span>
                        </div>
                      ) : (
                        <div style={{ display:"inline-flex", alignItems:"center", gap:4,
                          background:T.blueBg, border:`1px solid ${T.blue}33`,
                          borderRadius:8, padding:"2px 8px" }}>
                          <div style={{ width:5, height:5, borderRadius:"50%",
                            background:T.blue, animation:"pulse 1.5s infinite" }}/>
                          <span style={{ fontSize:10, fontWeight:800,
                            color:T.blue }}>Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded */}
                {expandedRFQ === rfq.id && (
                  <div style={{ borderTop:`1px solid ${T.border}`,
                    animation:"fadeUp 0.2s ease" }}>
                    {/* RFQ Details */}
                    <div style={{ padding:"14px 18px",
                      borderBottom:`1px solid ${T.border}` }}>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
                        gap:10, marginBottom:12 }}>
                        {[
                          { label:"Quantity",  value:rfq.quantity,         color:T.navy  },
                          { label:"Budget",    value:fmt(rfq.budget),      color:T.green },
                          { label:"Deadline",  value:new Date(rfq.deadline).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}), color:T.amber },
                          { label:"Location",  value:rfq.buyerLocation,    color:T.blue  },
                        ].map(item => (
                          <div key={item.label} style={{ background:T.bg,
                            borderRadius:12, padding:"10px 12px",
                            border:`1px solid ${T.border}` }}>
                            <div style={{ fontSize:9, color:T.textMute, fontWeight:700,
                              textTransform:"uppercase", letterSpacing:0.5, marginBottom:3 }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize:12, fontWeight:800, color:item.color,
                              fontFamily:item.label==="Budget"?"monospace":"inherit" }}>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize:13, color:T.textMid, lineHeight:1.7,
                        background:T.navyLight, borderRadius:12, padding:"10px 14px" }}>
                        {rfq.description}
                      </div>
                    </div>

                    {/* Buyer info */}
                    <div style={{ padding:"12px 18px",
                      borderBottom:`1px solid ${T.border}`,
                      display:"flex", gap:10, alignItems:"center" }}>
                      <div style={{ width:36, height:36, borderRadius:10,
                        background:`linear-gradient(135deg,${rfq.buyerColor}22,${rfq.buyerColor}44)`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:13, fontWeight:900, color:rfq.buyerColor }}>
                        {rfq.buyerInitials}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                          {rfq.buyerName}
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <Icon name="star" size={11} color={T.gold}/>
                          <span style={{ fontSize:11, fontWeight:700, color:T.textMid }}>
                            {rfq.buyerRating} Buyer Rating
                          </span>
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={() => onChatBuyer(rfq.id)} style={{
                          width:36, height:36, borderRadius:10, background:T.navyLight,
                          border:`1px solid ${T.border}`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                        }}>
                          {/* 🧭 NAVIGATE → Brick 6 Chat */}
                          <Icon name="message" size={15} color={T.navy}/>
                        </button>
                      </div>
                    </div>

                    {/* Quote action */}
                    <div style={{ padding:"14px 18px" }}>
                      {rfq.quoteSent ? (
                        <div style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
                          borderRadius:14, padding:"14px 16px",
                          display:"flex", justifyContent:"space-between",
                          alignItems:"center" }}>
                          <div>
                            <div style={{ fontSize:11, color:T.green, fontWeight:700,
                              marginBottom:3 }}>Quote Sent</div>
                            <div style={{ fontSize:16, fontWeight:900, color:T.green,
                              fontFamily:"monospace" }}>{fmt(rfq.quoteAmount)}</div>
                          </div>
                          <div style={{ width:44, height:44, borderRadius:14,
                            background:T.green, display:"flex",
                            alignItems:"center", justifyContent:"center" }}>
                            <Icon name="check" size={22} color="#fff"/>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setQuoteModal(rfq)} style={{
                          width:"100%", padding:"14px 0", borderRadius:16,
                          background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
                          border:"none", color:"#fff", fontSize:14, fontWeight:900,
                          cursor:"pointer", display:"flex", alignItems:"center",
                          justifyContent:"center", gap:8,
                          boxShadow:`0 6px 20px ${T.green}44`,
                        }}>
                          <Icon name="send" size={17} color="#fff"/>
                          Send Quote to Buyer
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ══ ORDERS TAB ══ */}
        {activeTab === "orders" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {orders.map(order => {
              const sc       = ORDER_STATUS[order.status];
              const nextMap  = { confirmed:"processing", processing:"shipped", shipped:"delivered" };
              const nextLbl  = { confirmed:"Start Processing", processing:"Mark as Shipped", shipped:"Confirm Delivered" };
              const next     = nextMap[order.status];
              return (
                <div key={order.id} style={{ background:T.card, borderRadius:22,
                  padding:"18px 20px", marginBottom:14,
                  border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
                  {/* Order header */}
                  <div style={{ display:"flex", gap:12, alignItems:"center",
                    marginBottom:14 }}>
                    <div style={{ width:46, height:46, borderRadius:14, flexShrink:0,
                      background:`linear-gradient(135deg,${order.buyerColor}22,${order.buyerColor}44)`,
                      border:`2px solid ${order.buyerColor}33`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:15, fontWeight:900, color:order.buyerColor }}>
                      {order.buyerInitials}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
                        marginBottom:3 }}>{order.buyerName}</div>
                      <div style={{ fontSize:12, color:T.textMute,
                        marginBottom:5, lineHeight:1.4 }}>{order.product}</div>
                      <div style={{ display:"flex", justifyContent:"space-between",
                        alignItems:"center" }}>
                        <div style={{ display:"inline-flex", alignItems:"center", gap:4,
                          background:sc.bg, borderRadius:8, padding:"3px 8px" }}>
                          <Icon name={sc.icon} size={10} color={sc.color}/>
                          <span style={{ fontSize:10, fontWeight:800,
                            color:sc.color }}>{sc.label}</span>
                        </div>
                        <span style={{ fontSize:14, fontWeight:900, color:T.navy,
                          fontFamily:"monospace" }}>{fmt(order.amount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery date */}
                  <div style={{ background:T.navyLight, borderRadius:12,
                    padding:"10px 14px", marginBottom:14,
                    display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <Icon name="clock" size={13} color={T.textMid}/>
                      <span style={{ fontSize:12, color:T.textMid, fontWeight:600 }}>
                        Expected: {new Date(order.deliveryDate).toDateString()}
                      </span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <Icon name="shield" size={12} color={T.gold}/>
                      <span style={{ fontSize:11, color:T.gold, fontWeight:700 }}>
                        Escrow Protected
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => onChatBuyer(order.id)} style={{
                      width:42, height:42, borderRadius:12,
                      background:T.navyLight, border:`1px solid ${T.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      {/* 🧭 NAVIGATE → Brick 6 Chat */}
                      <Icon name="message" size={17} color={T.navy}/>
                    </button>
                    {next && (
                      <button onClick={() => updateOrder(order.id, next)} style={{
                        flex:1, height:42, borderRadius:12,
                        background:`linear-gradient(135deg,${sc.color},${sc.color}CC)`,
                        border:"none", fontSize:12, fontWeight:900,
                        color:"#fff", display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6,
                        boxShadow:`0 4px 14px ${sc.color}44`,
                      }}>
                        <Icon name={sc.icon} size={14} color="#fff"/>
                        {nextLbl[order.status]}
                      </button>
                    )}
                    {order.status === "delivered" && (
                      <div style={{ flex:1, height:42, borderRadius:12,
                        background:T.greenBg, border:`1px solid ${T.green}22`,
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6 }}>
                        <Icon name="check" size={14} color={T.green}/>
                        <span style={{ fontSize:12, fontWeight:800,
                          color:T.green }}>Completed · Paid</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ PRODUCTS TAB ══ */}
        {activeTab === "products" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:13, color:T.textMute, fontWeight:600 }}>
                {products.filter(p => p.active).length} active products
              </div>
              <button onClick={() => showToast("Add Product coming soon!", T.navy)} style={{
                display:"flex", alignItems:"center", gap:6,
                padding:"9px 16px", borderRadius:12,
                background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
                border:"none", fontSize:12, fontWeight:800, color:"#fff",
                boxShadow:`0 4px 14px ${T.navy}33`,
              }}>
                <Icon name="plus" size={14} color="#fff"/>
                Add Product
              </button>
            </div>
            {products.map(product => (
              <div key={product.id} style={{ background:T.card, borderRadius:20,
                padding:"16px 18px", marginBottom:12,
                border:`1.5px solid ${product.active ? T.border : T.red+"33"}`,
                boxShadow:T.shadow, opacity:product.active ? 1 : 0.75,
                display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:48, height:48, borderRadius:14,
                  background:T.greenBg, border:`1px solid ${T.green}22`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="leaf" size={22} color={T.green}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
                    marginBottom:3, overflow:"hidden", textOverflow:"ellipsis",
                    whiteSpace:"nowrap" }}>{product.name}</div>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <span style={{ fontSize:13, fontWeight:900, color:T.navy,
                      fontFamily:"monospace" }}>{fmt(product.price)}</span>
                    <span style={{ fontSize:11, color:T.textMute }}>/{product.unit}</span>
                    <span style={{ fontSize:11, color:T.textMute }}>·</span>
                    <span style={{ fontSize:11, color:T.textMute }}>
                      {product.stock.toLocaleString()} in stock
                    </span>
                  </div>
                  <div style={{ fontSize:11, color:T.green, fontWeight:700, marginTop:3 }}>
                    {product.orders} orders total
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column",
                  alignItems:"flex-end", gap:10 }}>
                  <button onClick={() => toggleProduct(product.id)} style={{
                    background:"none", border:"none",
                  }}>
                    <Icon name={product.active ? "toggle" : "toggleOff"} size={30}
                      color={product.active ? T.green : T.textMute}/>
                  </button>
                  <button onClick={() => showToast("Edit product coming soon!", T.navy)} style={{
                    width:28, height:28, borderRadius:8, background:T.navyLight,
                    border:`1px solid ${T.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    <Icon name="edit" size={13} color={T.textMid}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ ANALYTICS TAB ══ */}
        {activeTab === "analytics" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {/* Revenue cards */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
              gap:12, marginBottom:16 }}>
              {[
                { label:"Today",       value:fmt(supplier.wallet.today),     growth:15.2, color:T.green  },
                { label:"This Month",  value:fmt(supplier.wallet.thisMonth), growth:22.4, color:T.blue   },
                { label:"Response Rate",value:supplier.responseRate+"%",     growth:2.1,  color:T.teal   },
                { label:"On-Time Del.", value:supplier.onTimeDelivery+"%",   growth:1.3,  color:T.gold   },
              ].map(item => (
                <div key={item.label} style={{ background:T.card, borderRadius:20,
                  padding:"16px", border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
                  <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
                    textTransform:"uppercase", letterSpacing:0.6, marginBottom:8 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize:18, fontWeight:900, color:T.navy,
                    fontFamily:"monospace", marginBottom:6 }}>{item.value}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ width:18, height:18, borderRadius:6,
                      background:T.greenBg,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon name="arrowUp" size={10} color={T.green}/>
                    </div>
                    <span style={{ fontSize:11, fontWeight:800, color:T.green }}>
                      +{item.growth}%
                    </span>
                    <span style={{ fontSize:10, color:T.textMute }}>vs last month</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly chart */}
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
                marginBottom:16 }}>Revenue This Week</div>
              {/* 🔌 BACKEND — replace with real data from analytics */}
              <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:100 }}>
                {[
                  { day:"Mon", val:5200000  },
                  { day:"Tue", val:8400000  },
                  { day:"Wed", val:6100000  },
                  { day:"Thu", val:12800000 },
                  { day:"Fri", val:9200000  },
                  { day:"Sat", val:7500000  },
                  { day:"Sun", val:4200000  },
                ].map((d, i) => {
                  const max     = 12800000;
                  const h       = Math.round((d.val/max) * 80);
                  const isToday = i === 6;
                  return (
                    <div key={d.day} style={{ flex:1,
                      display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                      <div style={{ width:"100%", height:h, borderRadius:"6px 6px 0 0",
                        background:isToday
                          ? `linear-gradient(180deg,${T.gold},#A07008)`
                          : `linear-gradient(180deg,${T.green}88,${T.green}44)`,
                        boxShadow:isToday ? `0 4px 12px ${T.gold}44` : "none" }}/>
                      <span style={{ fontSize:9, fontWeight:isToday?900:600,
                        color:isToday?T.gold:T.textMute }}>{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance metrics */}
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
                marginBottom:14 }}>Performance Score</div>
              {[
                { label:"Response Rate",    value:supplier.responseRate,    color:T.teal  },
                { label:"On-Time Delivery", value:supplier.onTimeDelivery,  color:T.green },
                { label:"Quote Win Rate",   value:68,                       color:T.blue  },
                { label:"Customer Rating",  value:supplier.rating * 20,     color:T.gold  },
              ].map(item => (
                <div key={item.label} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:5 }}>
                    <span style={{ fontSize:12, fontWeight:600,
                      color:T.textMid }}>{item.label}</span>
                    <span style={{ fontSize:12, fontWeight:900,
                      color:item.color }}>{item.value}%</span>
                  </div>
                  <div style={{ height:7, background:T.border, borderRadius:99,
                    overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${item.value}%`,
                      background:`linear-gradient(90deg,${item.color},${item.color}99)`,
                      borderRadius:99, transition:"width 0.8s ease" }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Full analytics CTA */}
            <button onClick={onViewAnalytics} style={{
              width:"100%", padding:"14px 0", borderRadius:18,
              background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
              border:"none", color:"#fff", fontSize:14, fontWeight:900,
              cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"center", gap:8,
              boxShadow:`0 6px 20px ${T.navy}44`,
            }}>
              <Icon name="barChart" size={17} color="#fff"/>
              {/* 🧭 NAVIGATE → Brick 5 Seller Command Center */}
              View Full Analytics
            </button>
          </div>
        )}

      </div>

      <BottomNav active="profile"/>
    </div>
  );
}

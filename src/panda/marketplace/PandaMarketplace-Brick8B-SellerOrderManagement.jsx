import { useState } from "react";

// ============================================================
// 🧱 BRICK 8B — SELLER ORDER MANAGEMENT
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export SellerOrderManagement from this file
//     Props: { sellerId, currentUser, onBack, onNavigate }
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
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/><polyline points="3.27 6.96 12 12.01 20.73 6.96" {...s}/><line x1="12" y1="22.08" x2="12" y2="12" {...s}/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    mapPin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    phone:        <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" {...s}/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    filter:       <><line x1="4" y1="6" x2="20" y2="6" {...s}/><line x1="8" y1="12" x2="16" y2="12" {...s}/><line x1="11" y1="18" x2="13" y2="18" {...s}/></>,
    search:       <><circle cx="11" cy="11" r="8" {...s}/><line x1="21" y1="21" x2="16.65" y2="16.65" {...s}/></>,
    printer:      <><polyline points="6 9 6 2 18 2 18 9" {...s}/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" {...s}/><rect x="6" y="14" width="12" height="8" {...s}/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    trending:     <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    arrowUp:      <><line x1="12" y1="19" x2="12" y2="5" {...s}/><polyline points="5 12 12 5 19 12" {...s}/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
    eyeOff:       <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" {...s}/><line x1="1" y1="1" x2="23" y2="23" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    rotate:       <><polyline points="23 4 23 10 17 10" {...s}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...s}/></>,
    alertCircle:  <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    bike:         <><circle cx="5.5" cy="17.5" r="3.5" {...s}/><circle cx="18.5" cy="17.5" r="3.5" {...s}/><path d="M15 6a1 1 0 0 0-1-1h-1" {...s}/><path d="M12 6L5.5 14" {...s}/><path d="M18.5 14 12 6" {...s}/><path d="M5.5 14H18.5" {...s}/></>,
    copy:         <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" {...s}/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" {...s}/></>,
    laptop:       <><rect x="2" y="3" width="20" height="14" rx="2" {...s}/><line x1="2" y1="17" x2="22" y2="17" {...s}/></>,
    undo:         <><polyline points="9 14 4 9 9 4" {...s}/><path d="M20 20v-7a4 4 0 0 0-4-4H4" {...s}/></>,
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
// 🔌 BACKEND SWAP POINT #1 — SELLER & WALLET DATA
// Replace with: supabase.from('sellers')
//   .select('*').eq('owner_id', currentUser.id).single()
// 💰 WALLET: supabase.from('wallets')
//   .select('*').eq('user_id', currentUser.id).single()
// ============================================================
const MOCK_SELLER = {
  id:        "SEL-001",
  name:      "Tech Master Store",
  initials:  "TM",
  color:     "#1D4ED8",
  trustScore: 98,
  wallet: {
    balance:    18450000,
    pending:    3200000,
    today:      2850000,
  },
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — ORDERS
// Replace with: supabase.from('orders')
//   .select('*,buyer(*),product(*),delivery(*)')
//   .eq('seller_id', sellerId)
//   .order('created_at', { ascending: false })
// Real-time: supabase.channel('seller_orders')
//   .on('postgres_changes', { event: 'INSERT',
//        schema: 'public', table: 'orders',
//        filter: `seller_id=eq.${sellerId}` },
//     payload => addNewOrder(payload.new))
//   .subscribe()
// ============================================================
const MOCK_ORDERS = [
  {
    id:"ORD-882134", isNew:true,
    buyerName:"Hassan Kimaro",   buyerInitials:"HK", buyerColor:"#1D4ED8",
    buyerPhone:"+255 712 345 678", buyerAddress:"Sinza, Dar es Salaam",
    buyerRating:4.8,
    product:{ name:"iPhone 15 Pro Max 256GB", qty:1, price:1650000, icon:"laptop" },
    total:1650000, status:"pending",
    placedAt:"5 mins ago", deliveryMethod:"panda_rider",
    note:"Please ensure box is sealed and original", trackingCode:null,
  },
  {
    id:"ORD-882129", isNew:false,
    buyerName:"Amina Tanzani",   buyerInitials:"AT", buyerColor:"#6D28D9",
    buyerPhone:"+255 756 789 012", buyerAddress:"Kariakoo, Dar es Salaam",
    buyerRating:4.5,
    product:{ name:"AirPods Pro 2nd Gen", qty:2, price:350000, icon:"laptop" },
    total:700000, status:"confirmed",
    placedAt:"1 hour ago", deliveryMethod:"panda_rider",
    note:"", trackingCode:null,
  },
  {
    id:"ORD-882120", isNew:false,
    buyerName:"Peter Mwangi",    buyerInitials:"PM", buyerColor:"#0A7B4B",
    buyerPhone:"+255 783 456 789", buyerAddress:"Mwenge, Dar es Salaam",
    buyerRating:4.9,
    product:{ name:"MacBook Air M2 256GB", qty:1, price:2800000, icon:"laptop" },
    total:2800000, status:"packed",
    placedAt:"3 hours ago", deliveryMethod:"panda_rider",
    note:"", trackingCode:"PND-TZ-882120",
  },
  {
    id:"ORD-882110", isNew:false,
    buyerName:"Zawadi Salum",    buyerInitials:"ZS", buyerColor:"#C9960A",
    buyerPhone:"+255 744 123 456", buyerAddress:"Msasani, Dar es Salaam",
    buyerRating:4.7,
    product:{ name:"Samsung 65\" 4K TV", qty:1, price:1200000, icon:"laptop" },
    total:1200000, status:"in_transit",
    placedAt:"Yesterday", deliveryMethod:"panda_rider",
    note:"", trackingCode:"PND-TZ-882110",
    rider:{ name:"Juma Hassan", phone:"+255 756 111 222", rating:4.9 },
  },
  {
    id:"ORD-882095", isNew:false,
    buyerName:"Baraka Juma",     buyerInitials:"BJ", buyerColor:"#C0392B",
    buyerPhone:"+255 712 999 888", buyerAddress:"Mbezi Beach, Dar es Salaam",
    buyerRating:4.2,
    product:{ name:"iPad Pro 12.9\" M2", qty:1, price:1900000, icon:"laptop" },
    total:1900000, status:"delivered",
    placedAt:"2 days ago", deliveryMethod:"panda_rider",
    note:"", trackingCode:"PND-TZ-882095",
  },
  {
    id:"ORD-882088", isNew:false,
    buyerName:"Grace Mkuzu",     buyerInitials:"GM", buyerColor:"#0D9488",
    buyerPhone:"+255 722 777 666", buyerAddress:"Kinondoni, Dar es Salaam",
    buyerRating:3.8,
    product:{ name:"Samsung Galaxy S24", qty:1, price:1100000, icon:"laptop" },
    total:1100000, status:"return_requested",
    placedAt:"3 days ago", deliveryMethod:"panda_rider",
    note:"", trackingCode:"PND-TZ-882088",
    returnReason:"Product not as described — different color received",
  },
];

const STATUS_CONFIG = {
  pending:          { label:"New Order",       color:T.red,    bg:T.redBg,    icon:"bell",     next:"confirmed",   nextLabel:"Accept Order"       },
  confirmed:        { label:"Confirmed",        color:T.blue,   bg:T.blueBg,   icon:"check",    next:"packed",      nextLabel:"Mark as Packed"      },
  packed:           { label:"Packed & Ready",   color:T.amber,  bg:T.amberBg,  icon:"package",  next:"in_transit",  nextLabel:"Request Rider"       },
  in_transit:       { label:"Out for Delivery", color:T.teal,   bg:T.tealBg,   icon:"truck",    next:"delivered",   nextLabel:"Mark Delivered"      },
  delivered:        { label:"Delivered",        color:T.green,  bg:T.greenBg,  icon:"check",    next:null,          nextLabel:null                  },
  cancelled:        { label:"Cancelled",        color:T.red,    bg:T.redBg,    icon:"x",        next:null,          nextLabel:null                  },
  return_requested: { label:"Return Requested", color:T.purple, bg:T.purpleBg, icon:"undo",     next:"refunded",    nextLabel:"Approve Return"      },
  refunded:         { label:"Refunded",         color:T.textMute,bg:T.navyLight,icon:"rotate",  next:null,          nextLabel:null                  },
};

const STATUS_TABS = [
  { id:"all",              label:"All",        count:null  },
  { id:"pending",          label:"New",        count:null  },
  { id:"confirmed",        label:"Confirmed",  count:null  },
  { id:"packed",           label:"Packed",     count:null  },
  { id:"in_transit",       label:"Shipping",   count:null  },
  { id:"delivered",        label:"Delivered",  count:null  },
  { id:"return_requested", label:"Returns",    count:null  },
];

// ============================================================
// 🧱 MAIN COMPONENT — SellerOrderManagement
// ============================================================
export default function App({
  // 👤 AUTH — replace with real seller from supabase.auth.getUser()
  seller          = MOCK_SELLER,
  initialOrders   = MOCK_ORDERS,

  // 🧭 NAVIGATE
  onBack          = () => {},   // → Brick 5 Seller Command Center
  onChatBuyer     = () => {},   // → Brick 6 Marketplace Chat
  onCallBuyer     = () => {},   // → phone dialer
  onTrackOrder    = () => {},   // → Brick 8 Logistics (seller view)
  onViewAnalytics = () => {},   // → Brick 5 / Brick 12
  // 💰 WALLET
  onWithdraw      = () => {},   // → PandaWallet.withdraw()
}) {
  const [orders,       setOrders]       = useState(initialOrders);
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchText,   setSearchText]   = useState("");
  const [expandOrder,  setExpandOrder]  = useState("ORD-882134");
  const [showBalance,  setShowBalance]  = useState(true);
  const [newOrderAlert,setNewOrderAlert]= useState(true);
  const [riderModal,   setRiderModal]   = useState(null);
  const [returnModal,  setReturnModal]  = useState(null);
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  // 🔌 BACKEND — update order status
  // supabase.from('orders').update({ status: nextStatus }).eq('id', orderId)
  // 💰 WALLET — on delivered: PandaWallet auto-releases escrow
  const updateStatus = (orderId, nextStatus) => {
    setOrders(os => os.map(o =>
      o.id === orderId ? { ...o, status:nextStatus, isNew:false } : o
    ));
    const msgs = {
      confirmed:   "Order accepted! Buyer has been notified.",
      packed:      "Order marked as packed and ready!",
      in_transit:  "Rider assigned! Order is on the way.",
      delivered:   "Order delivered! Escrow will be released to you.",
      refunded:    "Return approved. Buyer will be refunded.",
    };
    showToast(msgs[nextStatus] || "Order updated!", T.green);
  };

  const cancelOrder = (orderId) => {
    // 🔌 BACKEND — supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId)
    // 💰 WALLET — PandaWallet.refundEscrow(orderId) — full refund to buyer
    setOrders(os => os.map(o =>
      o.id === orderId ? { ...o, status:"cancelled", isNew:false } : o
    ));
    showToast("Order cancelled. Buyer will be refunded.", T.red);
  };

  const requestRider = (orderId) => {
    // 🔌 BACKEND — supabase.functions.invoke('assign-rider', { order_id: orderId })
    // This auto-assigns nearest available Panda rider
    setRiderModal(orderId);
  };

  const confirmRiderAssigned = (orderId) => {
    setOrders(os => os.map(o =>
      o.id === orderId ? {
        ...o, status:"in_transit",
        trackingCode:`PND-TZ-${orderId.replace("ORD-","no")}`,
        rider:{ name:"Juma Hassan", phone:"+255 756 111 222", rating:4.9 },
      } : o
    ));
    setRiderModal(null);
    showToast("Rider assigned! Order is now in transit.", T.teal);
  };

  const newOrders  = orders.filter(o => o.isNew);
  const filtered   = orders
    .filter(o => activeStatus === "all" || o.status === activeStatus)
    .filter(o => !searchText ||
      o.id.toLowerCase().includes(searchText.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(searchText.toLowerCase()) ||
      o.product.name.toLowerCase().includes(searchText.toLowerCase())
    );

  const counts = STATUS_TABS.map(tab => ({
    ...tab,
    count: tab.id === "all"
      ? orders.length
      : orders.filter(o => o.status === tab.id).length,
  }));

  const todayRevenue  = orders.filter(o => o.status==="delivered").reduce((s,o) => s+o.total, 0);
  const pendingCount  = orders.filter(o => o.status==="pending").length;
  const transitCount  = orders.filter(o => o.status==="in_transit").length;
  const returnCount   = orders.filter(o => o.status==="return_requested").length;

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
        input::placeholder { color:${T.textMute}; }
        textarea::placeholder { color:${T.textMute}; }
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

      {/* ── RIDER ASSIGNMENT MODAL ── */}
      {riderModal && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setRiderModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.white, borderRadius:"28px 28px 0 0",
            padding:"28px 24px 40px", width:"100%", maxWidth:430,
            animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <div style={{ width:40, height:4, borderRadius:99,
              background:T.border, margin:"0 auto 24px" }}/>
            <div style={{ fontSize:18, fontWeight:900, color:T.textMain,
              marginBottom:6 }}>Request Panda Rider</div>
            <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>
              A rider will be automatically assigned based on proximity to your store.
            </div>
            {/* Rider preview */}
            <div style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
              borderRadius:18, padding:"16px 18px", marginBottom:20,
              display:"flex", gap:14, alignItems:"center" }}>
              <div style={{ width:52, height:52, borderRadius:16,
                background:`linear-gradient(135deg,${T.green}22,${T.green}44)`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:22 }}>🏍️</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
                  marginBottom:3 }}>Nearest Rider Found</div>
                <div style={{ fontSize:12, color:T.textMute }}>
                  Juma Hassan · 1.2 km away · ETA 8 mins
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4,
                  marginTop:4 }}>
                  <Icon name="star" size={11} color={T.gold}/>
                  <span style={{ fontSize:11, fontWeight:800,
                    color:T.textMid }}>4.9 · 1,240 deliveries</span>
                </div>
              </div>
            </div>
            {/* Pickup info */}
            <div style={{ background:T.navyLight, borderRadius:14,
              padding:"12px 16px", marginBottom:20,
              display:"flex", gap:10, alignItems:"center" }}>
              <Icon name="mapPin" size={16} color={T.navy}/>
              <div>
                <div style={{ fontSize:11, color:T.textMute, fontWeight:700,
                  marginBottom:2 }}>Pickup from your store</div>
                <div style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                  {seller.name}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setRiderModal(null)} style={{
                flex:1, padding:"14px 0", borderRadius:16,
                background:T.navyLight, border:`1px solid ${T.border}`,
                fontSize:13, fontWeight:800, color:T.textMid,
              }}>Cancel</button>
              <button onClick={() => confirmRiderAssigned(riderModal)} style={{
                flex:2, padding:"14px 0", borderRadius:16,
                background:`linear-gradient(135deg,${T.teal},#0A6B60)`,
                border:"none", color:"#fff", fontSize:14, fontWeight:900,
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow:`0 6px 20px ${T.teal}44`,
              }}>
                <Icon name="bike" size={17} color="#fff"/>
                Assign Rider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RETURN MODAL ── */}
      {returnModal && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setReturnModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.white, borderRadius:"28px 28px 0 0",
            padding:"28px 24px 40px", width:"100%", maxWidth:430,
            animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <div style={{ width:40, height:4, borderRadius:99,
              background:T.border, margin:"0 auto 24px" }}/>
            <div style={{ fontSize:18, fontWeight:900, color:T.textMain,
              marginBottom:6 }}>Return Request</div>
            <div style={{ background:T.purpleBg, border:`1px solid ${T.purple}22`,
              borderRadius:14, padding:"14px 16px", marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:T.purple,
                textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>
                Buyer's Reason
              </div>
              <div style={{ fontSize:13, color:T.purple, lineHeight:1.6 }}>
                {returnModal.returnReason}
              </div>
            </div>
            <div style={{ background:T.amberBg, border:`1px solid ${T.amber}22`,
              borderRadius:14, padding:"12px 16px", marginBottom:20,
              display:"flex", gap:10, alignItems:"flex-start" }}>
              <Icon name="alertCircle" size={16} color={T.amber}/>
              <div style={{ fontSize:12, color:T.amber, lineHeight:1.6,
                fontWeight:600 }}>
                If you approve this return, the buyer will receive a full refund from Panda Escrow. The item must be returned to you first.
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => {
                setReturnModal(null);
                showToast("Return declined. Panda will review the dispute.", T.amber);
              }} style={{
                flex:1, padding:"14px 0", borderRadius:16,
                background:T.redBg, border:`1px solid ${T.red}22`,
                fontSize:13, fontWeight:800, color:T.red,
              }}>Decline Return</button>
              <button onClick={() => {
                updateStatus(returnModal.id, "refunded");
                setReturnModal(null);
              }} style={{
                flex:1, padding:"14px 0", borderRadius:16,
                background:`linear-gradient(135deg,${T.purple},#4C1D95)`,
                border:"none", color:"#fff", fontSize:13, fontWeight:900,
                display:"flex", alignItems:"center", justifyContent:"center", gap:7,
              }}>
                <Icon name="check" size={15} color="#fff"/>
                Approve Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW ORDER ALERT ── */}
      {newOrderAlert && newOrders.length > 0 && (
        <div style={{
          position:"fixed", top:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:430, zIndex:500,
          background:T.red, padding:"14px 20px",
          display:"flex", gap:12, alignItems:"center",
          animation:"slideIn 0.3s ease",
        }}>
          <div style={{ animation:"ring 0.8s infinite" }}>
            <Icon name="bell" size={22} color="#fff"/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:900, color:"#fff" }}>
              New Order! {newOrders[0].buyerName}
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.8)" }}>
              {newOrders[0].product.name} · {fmt(newOrders[0].total)}
            </div>
          </div>
          <button onClick={() => {
            setNewOrderAlert(false);
            setExpandOrder(newOrders[0].id);
            setActiveStatus("pending");
          }} style={{
            padding:"7px 14px", borderRadius:10,
            background:"rgba(255,255,255,0.2)",
            border:"1px solid rgba(255,255,255,0.3)",
            fontSize:12, fontWeight:800, color:"#fff",
          }}>View</button>
          <button onClick={() => setNewOrderAlert(false)} style={{
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
        padding:`${newOrderAlert && newOrders.length > 0 ? "68px" : "52px"} 20px 24px`,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, opacity:0.05,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"20px 20px" }}/>

        {/* Top row */}
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:20, position:"relative" }}>
          <button onClick={onBack} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <Icon name="arrowLeft" size={18} color="#fff"/>
          </button>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:900, color:"#fff",
              letterSpacing:-0.3 }}>Order Management</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>{seller.name}</div>
          </div>
          <button onClick={onViewAnalytics} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            {/* 🧭 NAVIGATE → Brick 12 AI Dashboard */}
            <Icon name="barChart" size={18} color="#fff"/>
          </button>
        </div>

        {/* 💰 Wallet card */}
        <div style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,0.15)", borderRadius:20,
          padding:"16px 20px", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:4 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Icon name="wallet" size={13} color="rgba(255,255,255,0.7)"/>
              <span style={{ fontSize:11, fontWeight:700,
                color:"rgba(255,255,255,0.7)" }}>Panda Wallet Balance</span>
            </div>
            <button onClick={() => setShowBalance(s => !s)} style={{
              background:"none", border:"none" }}>
              <Icon name={showBalance ? "eye" : "eyeOff"} size={15}
                color="rgba(255,255,255,0.6)"/>
            </button>
          </div>
          <div style={{ fontSize:26, fontWeight:900, color:"#fff",
            fontFamily:"monospace", letterSpacing:-1, marginBottom:10 }}>
            {/* 💰 WALLET — swap with PandaWallet.getBalance() */}
            {showBalance ? fmt(seller.wallet.balance) : "TSh ••••••••"}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
            gap:8, marginBottom:12 }}>
            {[
              { label:"TODAY'S EARNINGS", value:fmt(seller.wallet.today),   color:T.goldMid },
              { label:"ESCROW PENDING",   value:fmt(seller.wallet.pending), color:"rgba(255,255,255,0.8)" },
            ].map(item => (
              <div key={item.label} style={{ background:"rgba(255,255,255,0.08)",
                borderRadius:10, padding:"8px 12px" }}>
                <div style={{ fontSize:8, color:"rgba(255,255,255,0.5)",
                  fontWeight:700, marginBottom:3 }}>{item.label}</div>
                <div style={{ fontSize:13, fontWeight:900, color:item.color,
                  fontFamily:"monospace" }}>{item.value}</div>
              </div>
            ))}
          </div>
          <button onClick={onWithdraw} style={{
            width:"100%", padding:"10px 0", borderRadius:13,
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            border:"none", color:"#fff", fontSize:12, fontWeight:900,
            display:"flex", alignItems:"center", justifyContent:"center", gap:7,
            boxShadow:`0 4px 16px ${T.gold}44`,
          }}>
            <Icon name="wallet" size={14} color="#fff"/>
            {/* 💰 WALLET — PandaWallet.withdraw() */}
            Withdraw Earnings
          </button>
        </div>

        {/* Quick stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          gap:8, position:"relative" }}>
          {[
            { label:"Pending",   value:pendingCount,         color:T.red,    icon:"bell"    },
            { label:"Shipping",  value:transitCount,         color:T.teal,   icon:"truck"   },
            { label:"Returns",   value:returnCount,          color:T.purple, icon:"undo"    },
            { label:"Total",     value:orders.length,        color:T.goldMid,icon:"package" },
          ].map(stat => (
            <div key={stat.label} style={{ background:"rgba(255,255,255,0.1)",
              border:"1px solid rgba(255,255,255,0.15)",
              borderRadius:14, padding:"10px 8px", textAlign:"center" }}>
              <div style={{ width:26, height:26, borderRadius:8,
                background:"rgba(255,255,255,0.12)",
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 6px" }}>
                <Icon name={stat.icon} size={13} color={stat.color}/>
              </div>
              <div style={{ fontSize:16, fontWeight:900, color:"#fff",
                fontFamily:"monospace" }}>{stat.value}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)",
                fontWeight:700, textTransform:"uppercase",
                letterSpacing:0.3, marginTop:2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── SEARCH BAR ── */}
        <div style={{ display:"flex", gap:10, alignItems:"center",
          background:T.card, border:`1px solid ${T.border}`,
          borderRadius:16, padding:"11px 16px", marginBottom:14,
          boxShadow:T.shadow }}>
          <Icon name="search" size={16} color={T.textMute}/>
          <input value={searchText} onChange={e => setSearchText(e.target.value)}
            placeholder="Search by order ID, buyer, product..."
            style={{ flex:1, background:"transparent", border:"none",
              outline:"none", fontSize:13, color:T.textMain }}/>
          {searchText && (
            <button onClick={() => setSearchText("")} style={{
              background:"none", border:"none" }}>
              <Icon name="x" size={16} color={T.textMute}/>
            </button>
          )}
        </div>

        {/* ── STATUS FILTER TABS ── */}
        <div style={{ display:"flex", gap:7, overflowX:"auto",
          marginBottom:16, paddingBottom:2 }}>
          {counts.map(tab => (
            <button key={tab.id} onClick={() => setActiveStatus(tab.id)} style={{
              display:"flex", alignItems:"center", gap:5,
              padding:"7px 14px", borderRadius:99, flexShrink:0,
              background:activeStatus===tab.id ? T.navy : T.card,
              border:activeStatus===tab.id ? "none" : `1px solid ${T.border}`,
              color:activeStatus===tab.id ? "#fff" : T.textMid,
              fontSize:11, fontWeight:700,
              boxShadow:activeStatus===tab.id ? `0 4px 12px ${T.navy}33` : T.shadow,
              position:"relative",
            }}>
              {tab.label}
              {tab.count > 0 && (
                <div style={{ minWidth:18, height:18, borderRadius:99,
                  background:activeStatus===tab.id
                    ? "rgba(255,255,255,0.25)"
                    : tab.id === "pending" || tab.id === "return_requested"
                      ? T.red : T.navy,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  padding:"0 4px" }}>
                  <span style={{ fontSize:9, fontWeight:900,
                    color:"#fff" }}>{tab.count}</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ── ORDERS LIST ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:"48px", marginBottom:12 }}>📦</div>
            <div style={{ fontSize:16, fontWeight:800, color:T.textMain,
              marginBottom:8 }}>No orders found</div>
            <div style={{ fontSize:13, color:T.textMute }}>
              {searchText ? "Try a different search" : "Orders will appear here in real-time"}
            </div>
          </div>
        ) : filtered.map(order => {
          const sc         = STATUS_CONFIG[order.status];
          const isExpanded = expandOrder === order.id;
          return (
            <div key={order.id} style={{
              background:T.card, borderRadius:22, marginBottom:14,
              border:`1.5px solid ${
                order.isNew ? T.red+"44" :
                order.status==="return_requested" ? T.purple+"44" :
                T.border}`,
              boxShadow:order.isNew ? `0 0 0 3px ${T.red}18` : T.shadow,
              overflow:"hidden",
              animation:order.isNew ? "bounceIn 0.4s ease" : "fadeUp 0.25s ease",
            }}>
              {/* Order header */}
              <div onClick={() => setExpandOrder(isExpanded ? null : order.id)}
                style={{ padding:"16px 18px", cursor:"pointer",
                  display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ position:"relative" }}>
                  <div style={{ width:46, height:46, borderRadius:14, flexShrink:0,
                    background:`linear-gradient(135deg,${order.buyerColor}22,${order.buyerColor}44)`,
                    border:`2px solid ${order.buyerColor}33`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:15, fontWeight:900, color:order.buyerColor }}>
                    {order.buyerInitials}
                  </div>
                  {order.isNew && (
                    <div style={{ position:"absolute", top:-4, right:-4,
                      width:14, height:14, borderRadius:"50%",
                      background:T.red, border:`2px solid ${T.white}`,
                      animation:"pulse 1.5s infinite" }}/>
                  )}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:4 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                        {order.buyerName}
                      </span>
                      {order.isNew && (
                        <div style={{ background:T.red, borderRadius:7,
                          padding:"1px 7px", fontSize:9,
                          fontWeight:900, color:"#fff" }}>NEW</div>
                      )}
                      {order.status === "return_requested" && (
                        <div style={{ background:T.purpleBg,
                          border:`1px solid ${T.purple}22`,
                          borderRadius:7, padding:"1px 7px",
                          fontSize:9, fontWeight:900, color:T.purple }}>RETURN</div>
                      )}
                    </div>
                    <span style={{ fontSize:11, color:T.textMute }}>
                      {order.placedAt}
                    </span>
                  </div>
                  <div style={{ fontSize:12, color:T.textMute,
                    marginBottom:5, overflow:"hidden",
                    textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {order.product.name} × {order.product.qty}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center" }}>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:4,
                      background:sc.bg, borderRadius:8, padding:"3px 8px" }}>
                      <Icon name={sc.icon} size={10} color={sc.color}/>
                      <span style={{ fontSize:10, fontWeight:800,
                        color:sc.color }}>{sc.label}</span>
                    </div>
                    <span style={{ fontSize:14, fontWeight:900, color:T.navy,
                      fontFamily:"monospace" }}>{fmt(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div style={{ borderTop:`1px solid ${T.border}`,
                  animation:"fadeUp 0.2s ease" }}>

                  {/* Product info */}
                  <div style={{ padding:"14px 18px",
                    borderBottom:`1px solid ${T.border}` }}>
                    <div style={{ display:"flex", gap:12, alignItems:"center",
                      marginBottom:12 }}>
                      <div style={{ width:52, height:52, borderRadius:14,
                        background:T.navyLight, flexShrink:0,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name={order.product.icon} size={26}
                          color={T.navy+"44"}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:800,
                          color:T.textMain, marginBottom:3 }}>
                          {order.product.name}
                        </div>
                        <div style={{ display:"flex", gap:10 }}>
                          <span style={{ fontSize:12, color:T.textMute }}>
                            Qty: {order.product.qty}
                          </span>
                          <span style={{ fontSize:12, fontWeight:900,
                            color:T.navy, fontFamily:"monospace" }}>
                            {fmt(order.product.price)} each
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize:15, fontWeight:900, color:T.navy,
                        fontFamily:"monospace" }}>{fmt(order.total)}</div>
                    </div>

                    {/* Special note */}
                    {order.note && (
                      <div style={{ background:T.amberBg,
                        border:`1px solid ${T.amber}22`,
                        borderRadius:12, padding:"10px 14px",
                        display:"flex", gap:8, alignItems:"flex-start" }}>
                        <Icon name="alertCircle" size={14} color={T.amber}/>
                        <div style={{ fontSize:12, color:T.amber,
                          lineHeight:1.5, fontWeight:600 }}>
                          Note: {order.note}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Buyer & delivery info */}
                  <div style={{ padding:"12px 18px",
                    borderBottom:`1px solid ${T.border}` }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
                      gap:10 }}>
                      {[
                        { icon:"user",   label:"Buyer",    value:order.buyerName,    color:T.blue  },
                        { icon:"star",   label:"Rating",   value:order.buyerRating+" ★", color:T.gold  },
                        { icon:"mapPin", label:"Deliver to",value:order.buyerAddress, color:T.green },
                        { icon:"truck",  label:"Via",      value:"Panda Rider",      color:T.teal  },
                      ].map(item => (
                        <div key={item.label} style={{ background:T.bg,
                          borderRadius:12, padding:"10px 12px",
                          border:`1px solid ${T.border}` }}>
                          <div style={{ display:"flex", alignItems:"center",
                            gap:5, marginBottom:3 }}>
                            <Icon name={item.icon} size={11} color={item.color}/>
                            <span style={{ fontSize:9, color:T.textMute,
                              fontWeight:700, textTransform:"uppercase",
                              letterSpacing:0.5 }}>{item.label}</span>
                          </div>
                          <div style={{ fontSize:11, fontWeight:800,
                            color:T.textMain, lineHeight:1.4 }}>
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tracking code (if available) */}
                  {order.trackingCode && (
                    <div style={{ padding:"12px 18px",
                      borderBottom:`1px solid ${T.border}`,
                      display:"flex", justifyContent:"space-between",
                      alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
                          textTransform:"uppercase", letterSpacing:0.5, marginBottom:3 }}>
                          Tracking Code
                        </div>
                        <div style={{ fontSize:14, fontWeight:900, color:T.navy,
                          fontFamily:"monospace" }}>{order.trackingCode}</div>
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={() => showToast("Tracking code copied!", T.navy)} style={{
                          width:36, height:36, borderRadius:10,
                          background:T.navyLight, border:`1px solid ${T.border}`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                        }}>
                          <Icon name="copy" size={15} color={T.navy}/>
                        </button>
                        <button onClick={() => showToast("Printing label...", T.navy)} style={{
                          width:36, height:36, borderRadius:10,
                          background:T.navyLight, border:`1px solid ${T.border}`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                        }}>
                          <Icon name="printer" size={15} color={T.navy}/>
                        </button>
                        <button onClick={() => onTrackOrder(order.id)} style={{
                          padding:"8px 14px", borderRadius:10,
                          background:`linear-gradient(135deg,${T.teal},#0A6B60)`,
                          border:"none", fontSize:11, fontWeight:800, color:"#fff",
                          display:"flex", alignItems:"center", gap:5,
                        }}>
                          {/* 🧭 NAVIGATE → Brick 8 Logistics */}
                          <Icon name="truck" size={13} color="#fff"/>
                          Track
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Rider info (if assigned) */}
                  {order.rider && (
                    <div style={{ padding:"12px 18px",
                      borderBottom:`1px solid ${T.border}`,
                      display:"flex", gap:10, alignItems:"center" }}>
                      <div style={{ width:38, height:38, borderRadius:11,
                        background:T.greenBg,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:18 }}>🏍️</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, fontWeight:800,
                          color:T.textMain }}>{order.rider.name}</div>
                        <div style={{ fontSize:11, color:T.textMute }}>
                          Assigned Rider · ⭐ {order.rider.rating}
                        </div>
                      </div>
                      <button onClick={() => onCallBuyer(order.rider.phone)} style={{
                        width:36, height:36, borderRadius:10,
                        background:T.greenBg, border:`1px solid ${T.green}22`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}>
                        <Icon name="phone" size={15} color={T.green}/>
                      </button>
                    </div>
                  )}

                  {/* Escrow status */}
                  <div style={{ padding:"12px 18px",
                    borderBottom:`1px solid ${T.border}`,
                    display:"flex", gap:10, alignItems:"center" }}>
                    <Icon name="shield" size={16} color={T.gold}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                        Panda Escrow Protected
                      </div>
                      <div style={{ fontSize:11, color:T.textMute }}>
                        {fmt(order.total)} held · releases when buyer confirms delivery
                      </div>
                    </div>
                    <div style={{ background:T.goldLight,
                      border:`1px solid ${T.gold}33`,
                      borderRadius:8, padding:"3px 9px",
                      fontSize:10, fontWeight:900, color:T.gold }}>
                      {order.status === "delivered" ? "Released" : "Held"}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ padding:"14px 18px",
                    display:"flex", gap:8, flexWrap:"wrap" }}>
                    {/* Contact buyer */}
                    <button onClick={() => onChatBuyer(order.id)} style={{
                      width:42, height:42, borderRadius:12, flexShrink:0,
                      background:T.navyLight, border:`1px solid ${T.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      {/* 🧭 NAVIGATE → Brick 6 Chat */}
                      <Icon name="message" size={17} color={T.navy}/>
                    </button>
                    <button onClick={() => onCallBuyer(order.buyerPhone)} style={{
                      width:42, height:42, borderRadius:12, flexShrink:0,
                      background:T.greenBg, border:`1px solid ${T.green}22`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      <Icon name="phone" size={17} color={T.green}/>
                    </button>

                    {/* Status-based actions */}
                    {order.status === "pending" && (
                      <>
                        <button onClick={() => cancelOrder(order.id)} style={{
                          flex:1, height:42, borderRadius:12,
                          background:T.redBg, border:`1px solid ${T.red}22`,
                          fontSize:12, fontWeight:800, color:T.red,
                          display:"flex", alignItems:"center",
                          justifyContent:"center", gap:6,
                        }}>
                          <Icon name="x" size={14} color={T.red}/>
                          Reject
                        </button>
                        <button onClick={() => updateStatus(order.id, "confirmed")}
                          style={{ flex:2, height:42, borderRadius:12,
                            background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
                            border:"none", fontSize:12, fontWeight:900,
                            color:"#fff", display:"flex", alignItems:"center",
                            justifyContent:"center", gap:6,
                            boxShadow:`0 4px 14px ${T.green}44` }}>
                          <Icon name="check" size={14} color="#fff"/>
                          Accept Order
                        </button>
                      </>
                    )}

                    {order.status === "confirmed" && (
                      <button onClick={() => updateStatus(order.id, "packed")}
                        style={{ flex:1, height:42, borderRadius:12,
                          background:`linear-gradient(135deg,${T.amber},#8A5A00)`,
                          border:"none", fontSize:12, fontWeight:900, color:"#fff",
                          display:"flex", alignItems:"center",
                          justifyContent:"center", gap:6,
                          boxShadow:`0 4px 14px ${T.amber}44` }}>
                        <Icon name="package" size={14} color="#fff"/>
                        Mark as Packed
                      </button>
                    )}

                    {order.status === "packed" && (
                      <button onClick={() => requestRider(order.id)}
                        style={{ flex:1, height:42, borderRadius:12,
                          background:`linear-gradient(135deg,${T.teal},#0A6B60)`,
                          border:"none", fontSize:12, fontWeight:900, color:"#fff",
                          display:"flex", alignItems:"center",
                          justifyContent:"center", gap:6,
                          boxShadow:`0 4px 14px ${T.teal}44` }}>
                        <Icon name="bike" size={14} color="#fff"/>
                        Request Rider
                      </button>
                    )}

                    {order.status === "in_transit" && (
                      <button onClick={() => onTrackOrder(order.id)}
                        style={{ flex:1, height:42, borderRadius:12,
                          background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
                          border:"none", fontSize:12, fontWeight:900, color:"#fff",
                          display:"flex", alignItems:"center",
                          justifyContent:"center", gap:6,
                          boxShadow:`0 4px 14px ${T.navy}44` }}>
                        <Icon name="truck" size={14} color="#fff"/>
                        Track Delivery
                      </button>
                    )}

                    {order.status === "delivered" && (
                      <div style={{ flex:1, height:42, borderRadius:12,
                        background:T.greenBg, border:`1px solid ${T.green}22`,
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6 }}>
                        <Icon name="check" size={14} color={T.green}/>
                        <span style={{ fontSize:12, fontWeight:800,
                          color:T.green }}>Delivered · Escrow Released</span>
                      </div>
                    )}

                    {order.status === "return_requested" && (
                      <button onClick={() => setReturnModal(order)}
                        style={{ flex:1, height:42, borderRadius:12,
                          background:`linear-gradient(135deg,${T.purple},#4C1D95)`,
                          border:"none", fontSize:12, fontWeight:900, color:"#fff",
                          display:"flex", alignItems:"center",
                          justifyContent:"center", gap:6,
                          boxShadow:`0 4px 14px ${T.purple}44` }}>
                        <Icon name="undo" size={14} color="#fff"/>
                        Handle Return
                      </button>
                    )}

                    {order.status === "cancelled" && (
                      <div style={{ flex:1, height:42, borderRadius:12,
                        background:T.redBg, border:`1px solid ${T.red}22`,
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6 }}>
                        <Icon name="x" size={14} color={T.red}/>
                        <span style={{ fontSize:12, fontWeight:800,
                          color:T.red }}>Cancelled · Buyer Refunded</span>
                      </div>
                    )}

                    {order.status === "refunded" && (
                      <div style={{ flex:1, height:42, borderRadius:12,
                        background:T.navyLight, border:`1px solid ${T.border}`,
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6 }}>
                        <Icon name="rotate" size={14} color={T.textMute}/>
                        <span style={{ fontSize:12, fontWeight:800,
                          color:T.textMute }}>Return Approved · Refunded</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

      </div>

      <BottomNav active="profile"/>
    </div>
  );
}

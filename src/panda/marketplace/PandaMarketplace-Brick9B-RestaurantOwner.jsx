import { useState, useEffect } from "react";

// ============================================================
// 🧱 BRICK 9B — RESTAURANT OWNER DASHBOARD
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export RestaurantOwnerDashboard from this file
//     Props: { restaurantId, currentUser, onBack, onNavigate }
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
  orange:    "#EA580C",
  orangeBg:  "#FFF7ED",
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
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    utensils:     <><line x1="3" y1="2" x2="3" y2="22" {...s}/><path d="M7 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" {...s}/><path d="M21 2v22" {...s}/><path d="M21 7H7" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    settings:     <><circle cx="12" cy="12" r="3" {...s}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" {...s}/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    trending:     <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    arrowUp:      <><line x1="12" y1="19" x2="12" y2="5" {...s}/><polyline points="5 12 12 5 19 12" {...s}/></>,
    mapPin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    phone:        <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" {...s}/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
    eyeOff:       <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" {...s}/><line x1="1" y1="1" x2="23" y2="23" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    fire:         <><path d="M12 2c0 0-5 4-5 9a5 5 0 0 0 10 0c0-2-1-4-2-5 0 0 0 3-2 4 0 0-1-4-1-8z" fill={color} stroke={color} strokeWidth="0.5"/></>,
    bike:         <><circle cx="5.5" cy="17.5" r="3.5" {...s}/><circle cx="18.5" cy="17.5" r="3.5" {...s}/><path d="M15 6a1 1 0 0 0-1-1h-1" {...s}/><path d="M12 6L5.5 14" {...s}/><path d="M18.5 14 12 6" {...s}/><path d="M5.5 14H18.5" {...s}/></>,
    toggle:       <><rect x="1" y="5" width="22" height="14" rx="7" ry="7" {...s}/><circle cx="16" cy="12" r="3" fill={color} stroke="none"/></>,
    toggleOff:    <><rect x="1" y="5" width="22" height="14" rx="7" ry="7" {...s}/><circle cx="8" cy="12" r="3" fill={color} stroke="none"/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, display: "block" }}>
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
// 🔌 BACKEND SWAP POINT #1 — RESTAURANT & OWNER DATA
// Replace with: supabase.from('restaurants')
//   .select('*').eq('owner_id', currentUser.id).single()
// ============================================================
const MOCK_RESTAURANT = {
  id:        "REST-001",
  name:      "Mama Fatuma Kitchen",
  initials:  "MF",
  color:     T.orange,
  openNow:   true,
  trustScore: 96,
  wallet: {
    balance:  4850000,
    pending:  320000,
    today:    480000,
  },
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — LIVE ORDERS
// Replace with: supabase.from('orders')
//   .select('*,buyer(*),items(*,menu_item(*))')
//   .eq('restaurant_id', restaurantId)
//   .in('status', ['placed','preparing','ready'])
//   .order('created_at', { ascending: true })
// Real-time: supabase.channel('restaurant_orders')
//   .on('postgres_changes', { event: '*',
//        schema: 'public', table: 'orders',
//        filter: `restaurant_id=eq.${restaurantId}` },
//     payload => updateOrders(payload))
//   .subscribe()
// ============================================================
const MOCK_ORDERS = [
  {
    id:"ORD-882134", buyerName:"Hassan K", buyerInitials:"HK", buyerColor:"#1D4ED8",
    buyerPhone:"+255 712 345 678",
    items:[
      { name:"Ugali na Nyama Choma", qty:1, price:18000 },
      { name:"Pilau ya Kuku",        qty:2, price:16000 },
    ],
    total:50000, status:"placed",
    placedAt:"2 mins ago", address:"Sinza, Dar es Salaam",
    deliveryTime:"30–40 min", isNew:true,
    note:"Extra sauce please, no onions",
  },
  {
    id:"ORD-882129", buyerName:"Amina T", buyerInitials:"AT", buyerColor:"#6D28D9",
    buyerPhone:"+255 756 789 012",
    items:[
      { name:"Biryani Mchanganyiko", qty:1, price:22000 },
      { name:"Juice ya Embe",        qty:2, price:4000  },
    ],
    total:30000, status:"preparing",
    placedAt:"15 mins ago", address:"Kariakoo, Dar es Salaam",
    deliveryTime:"15–20 min", isNew:false,
    note:"",
  },
  {
    id:"ORD-882121", buyerName:"Peter M", buyerInitials:"PM", buyerColor:"#0A7B4B",
    buyerPhone:"+255 783 456 789",
    items:[
      { name:"Chips Kuku",            qty:2, price:14000 },
      { name:"Chai ya Tangawizi",     qty:2, price:3000  },
    ],
    total:34000, status:"ready",
    placedAt:"28 mins ago", address:"Mwenge, Dar es Salaam",
    deliveryTime:"5 min", isNew:false,
    note:"",
  },
  {
    id:"ORD-882115", buyerName:"Zawadi S", buyerInitials:"ZS", buyerColor:"#C9960A",
    buyerPhone:"+255 744 123 456",
    items:[
      { name:"Mchuzi wa Samaki",      qty:1, price:24000 },
      { name:"Sambusa za Nyama",      qty:4, price:6000  },
    ],
    total:30000, status:"on_the_way",
    placedAt:"45 mins ago", address:"Mikocheni, Dar es Salaam",
    deliveryTime:"10 min", isNew:false,
    note:"",
    rider:{ name:"Juma H", phone:"+255 756 111 222" },
  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #3 — TODAY'S STATS
// Replace with: supabase.from('order_analytics')
//   .select('*').eq('restaurant_id', restaurantId)
//   .eq('date', new Date().toISOString().split('T')[0]).single()
// ============================================================
const MOCK_STATS = {
  todayOrders:   24,
  todayRevenue:  480000,
  avgDelivery:   32,
  rating:        4.8,
  pendingOrders: 3,
  completedToday:18,
  cancelledToday:2,
  topItem:       "Biryani Mchanganyiko",
};

// ============================================================
// 🔌 BACKEND SWAP POINT #4 — MENU ITEMS (for toggle availability)
// Replace with: supabase.from('menu_items')
//   .select('*').eq('restaurant_id', restaurantId)
//   .order('category_id')
// ============================================================
const MOCK_MENU_ITEMS = [
  { id:1, name:"Ugali na Nyama Choma",  price:18000, available:true,  orders:28 },
  { id:2, name:"Pilau ya Kuku",         price:16000, available:true,  orders:19 },
  { id:3, name:"Biryani Mchanganyiko",  price:22000, available:true,  orders:31 },
  { id:4, name:"Chips Kuku",            price:14000, available:true,  orders:21 },
  { id:5, name:"Mchuzi wa Samaki",      price:24000, available:false, orders:13 },
  { id:6, name:"Chai ya Tangawizi",     price:3000,  available:true,  orders:22 },
];

const STATUS_CONFIG = {
  placed:      { label:"New Order",   color:T.red,    bg:T.redBg,    next:"preparing",   nextLabel:"Start Preparing",  icon:"utensils" },
  preparing:   { label:"Preparing",   color:T.amber,  bg:T.amberBg,  next:"ready",       nextLabel:"Mark as Ready",    icon:"fire"     },
  ready:       { label:"Ready",       color:T.blue,   bg:T.blueBg,   next:"on_the_way",  nextLabel:"Assign Rider",     icon:"package"  },
  on_the_way:  { label:"On The Way",  color:T.green,  bg:T.greenBg,  next:"delivered",   nextLabel:"Delivered",        icon:"bike"     },
  delivered:   { label:"Delivered",   color:T.green,  bg:T.greenBg,  next:null,          nextLabel:null,               icon:"check"    },
  cancelled:   { label:"Cancelled",   color:T.red,    bg:T.redBg,    next:null,          nextLabel:null,               icon:"x"        },
};

// ============================================================
// 🧱 MAIN COMPONENT — RestaurantOwnerDashboard
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user from supabase.auth.getUser()
  currentUser  = { id:"owner-001", name:"Mama Fatuma" },
  restaurant   = MOCK_RESTAURANT,
  initialOrders = MOCK_ORDERS,
  stats        = MOCK_STATS,
  menuItems    = MOCK_MENU_ITEMS,

  // 🧭 NAVIGATE
  onBack          = () => {},   // → previous screen
  onOrderDetails  = () => {},   // → full order detail screen
  onChatBuyer     = () => {},   // → Brick 6 Marketplace Chat
  onCallBuyer     = () => {},   // → phone dialer
  onCallRider     = () => {},   // → phone dialer
  onViewAnalytics = () => {},   // → Brick 5 Seller Command Center analytics
  // 💰 WALLET
  onWithdraw      = () => {},   // → PandaWallet.withdraw()
}) {
  const [activeTab,   setActiveTab]   = useState("orders");
  const [orders,      setOrders]      = useState(initialOrders);
  const [isOpen,      setIsOpen]      = useState(restaurant.openNow);
  const [showBalance, setShowBalance] = useState(true);
  const [menu,        setMenu]        = useState(menuItems);
  const [toast,       setToast]       = useState(null);
  const [expandOrder, setExpandOrder] = useState("ORD-882134");
  const [newOrderAlert, setNewOrderAlert] = useState(true);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  // 🔌 BACKEND — update order status
  // supabase.from('orders').update({ status: nextStatus })
  //   .eq('id', orderId)
  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders(os => os.map(o =>
      o.id === orderId ? { ...o, status: nextStatus, isNew: false } : o
    ));
    const labels = {
      preparing:  "Order accepted! Kitchen notified.",
      ready:      "Order marked as ready for pickup!",
      on_the_way: "Rider assigned! Order on the way.",
      delivered:  "Order marked as delivered!",
    };
    showToast(labels[nextStatus] || "Order updated!", T.green);
  };

  const rejectOrder = (orderId) => {
    // 🔌 BACKEND — supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId)
    // 💰 WALLET — trigger PandaWallet.refundEscrow(orderId)
    setOrders(os => os.map(o =>
      o.id === orderId ? { ...o, status: "cancelled" } : o
    ));
    showToast("Order rejected. Buyer will be refunded.", T.red);
  };

  const toggleMenuItem = (itemId) => {
    // 🔌 BACKEND — supabase.from('menu_items')
    //   .update({ available: !current }).eq('id', itemId)
    setMenu(m => m.map(i =>
      i.id === itemId ? { ...i, available: !i.available } : i
    ));
  };

  const activeOrders    = orders.filter(o => !["delivered","cancelled"].includes(o.status));
  const completedOrders = orders.filter(o => o.status === "delivered");
  const newOrders       = orders.filter(o => o.isNew);

  const TABS = [
    { id:"orders",    label:"Orders",    icon:"package",  badge: activeOrders.length  },
    { id:"kitchen",   label:"Kitchen",   icon:"utensils", badge: null                 },
    { id:"menu",      label:"Menu",      icon:"fire",     badge: null                 },
    { id:"analytics", label:"Analytics", icon:"barChart", badge: null                 },
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
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes ring     { 0%{transform:rotate(0)} 15%{transform:rotate(15deg)} 30%{transform:rotate(-10deg)} 45%{transform:rotate(8deg)} 60%{transform:rotate(-5deg)} 75%{transform:rotate(3deg)} 100%{transform:rotate(0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input,textarea { font-family:inherit; }
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
              {fmt(newOrders[0].total)} · {newOrders[0].items.length} items
            </div>
          </div>
          <button onClick={() => { setNewOrderAlert(false); setActiveTab("orders"); }} style={{
            padding:"7px 14px", borderRadius:10,
            background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.3)",
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
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ width:46, height:46, borderRadius:14,
              background:`linear-gradient(135deg,${restaurant.color}44,${restaurant.color}88)`,
              border:"2px solid rgba(255,255,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:18, fontWeight:900, color:"#fff" }}>
              {restaurant.initials}
            </div>
            <div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
                fontWeight:600, marginBottom:2 }}>Restaurant Dashboard</div>
              <div style={{ fontSize:16, fontWeight:900, color:"#fff",
                letterSpacing:-0.3 }}>{restaurant.name}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {/* Open/Close toggle */}
            <button onClick={() => {
              setIsOpen(o => !o);
              showToast(isOpen ? "Restaurant closed" : "Restaurant is now open!", isOpen ? T.red : T.green);
            }} style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"7px 12px", borderRadius:10,
              background: isOpen ? T.greenBg : T.redBg,
              border:`1px solid ${isOpen ? T.green : T.red}44`,
            }}>
              <div style={{ width:8, height:8, borderRadius:"50%",
                background:isOpen ? T.green : T.red,
                animation:isOpen ? "pulse 2s infinite" : "none" }}/>
              <span style={{ fontSize:11, fontWeight:800,
                color:isOpen ? T.green : T.red }}>
                {isOpen ? "Open" : "Closed"}
              </span>
            </button>
            <button style={{ width:38, height:38, borderRadius:11,
              background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center",
              position:"relative" }}>
              <Icon name="bell" size={17} color="#fff"/>
              {newOrders.length > 0 && (
                <div style={{ position:"absolute", top:7, right:7,
                  width:8, height:8, background:T.red, borderRadius:"50%",
                  border:"1.5px solid rgba(11,31,75,0.8)",
                  animation:"pulse 1s infinite" }}/>
              )}
            </button>
          </div>
        </div>

        {/* 💰 WALLET CARD */}
        <div style={{
          background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,0.15)",
          borderRadius:20, padding:"16px 20px", position:"relative",
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
            {showBalance ? fmt(restaurant.wallet.balance) : "TSh ••••••••"}
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:14 }}>
            <div style={{ flex:1, background:"rgba(255,255,255,0.08)",
              borderRadius:10, padding:"8px 12px" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)",
                fontWeight:700, marginBottom:3 }}>TODAY'S EARNINGS</div>
              <div style={{ fontSize:14, fontWeight:900, color:T.goldMid,
                fontFamily:"monospace" }}>{fmt(restaurant.wallet.today)}</div>
            </div>
            <div style={{ flex:1, background:"rgba(255,255,255,0.08)",
              borderRadius:10, padding:"8px 12px" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)",
                fontWeight:700, marginBottom:3 }}>PENDING</div>
              <div style={{ fontSize:14, fontWeight:900, color:"rgba(255,255,255,0.8)",
                fontFamily:"monospace" }}>{fmt(restaurant.wallet.pending)}</div>
            </div>
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
            Withdraw to M-Pesa
          </button>
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── QUICK STATS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          gap:10, marginBottom:16 }}>
          {[
            { label:"Orders",    value:stats.todayOrders,   icon:"package",  color:T.blue   },
            { label:"Revenue",   value:(stats.todayRevenue/1000).toFixed(0)+"K", icon:"trending", color:T.green  },
            { label:"Avg Time",  value:stats.avgDelivery+"m", icon:"clock",    color:T.amber  },
            { label:"Rating",    value:stats.rating,         icon:"star",     color:T.gold   },
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
              <div style={{ fontSize:15, fontWeight:900, color:T.navy,
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
                  <span style={{ fontSize:9, fontWeight:900,
                    color:"#fff" }}>{t.badge}</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ══ ORDERS TAB ══ */}
        {activeTab === "orders" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {orders.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 0" }}>
                <div style={{ fontSize:"48px", marginBottom:12 }}>🍽️</div>
                <div style={{ fontSize:16, fontWeight:800, color:T.textMain,
                  marginBottom:8 }}>No orders yet</div>
                <div style={{ fontSize:13, color:T.textMute }}>
                  Orders will appear here in real-time
                </div>
              </div>
            ) : orders.map(order => {
              const sc      = STATUS_CONFIG[order.status];
              const isExpanded = expandOrder === order.id;
              return (
                <div key={order.id} style={{ background:T.card,
                  borderRadius:22, marginBottom:14,
                  border:`1.5px solid ${order.isNew ? T.red+"44" : T.border}`,
                  boxShadow:order.isNew ? `0 0 0 3px ${T.red}18` : T.shadow,
                  overflow:"hidden",
                  animation: order.isNew ? "bounceIn 0.4s ease" : "fadeUp 0.25s ease",
                }}>
                  {/* Order header */}
                  <div onClick={() => setExpandOrder(isExpanded ? null : order.id)}
                    style={{ padding:"16px 18px", cursor:"pointer",
                      display:"flex", gap:12, alignItems:"center" }}>
                    {/* Buyer avatar */}
                    <div style={{ width:44, height:44, borderRadius:13, flexShrink:0,
                      background:`linear-gradient(135deg,${order.buyerColor}22,${order.buyerColor}44)`,
                      border:`2px solid ${order.buyerColor}33`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:15, fontWeight:900, color:order.buyerColor }}>
                      {order.buyerInitials}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", justifyContent:"space-between",
                        alignItems:"center", marginBottom:4 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                          <span style={{ fontSize:14, fontWeight:800,
                            color:T.textMain }}>{order.buyerName}</span>
                          {order.isNew && (
                            <div style={{ background:T.red, borderRadius:7,
                              padding:"1px 7px", fontSize:9,
                              fontWeight:900, color:"#fff",
                              animation:"pulse 1.5s infinite" }}>NEW</div>
                          )}
                        </div>
                        <span style={{ fontSize:11,
                          color:T.textMute }}>{order.placedAt}</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between",
                        alignItems:"center" }}>
                        <div style={{ display:"inline-flex", alignItems:"center", gap:4,
                          background:sc.bg, borderRadius:8, padding:"3px 8px" }}>
                          <Icon name={sc.icon} size={10} color={sc.color}/>
                          <span style={{ fontSize:10, fontWeight:800,
                            color:sc.color }}>{sc.label}</span>
                        </div>
                        <span style={{ fontSize:14, fontWeight:900,
                          color:T.navy, fontFamily:"monospace" }}>
                          {fmt(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div style={{ borderTop:`1px solid ${T.border}`,
                      animation:"fadeUp 0.2s ease" }}>
                      {/* Order items */}
                      <div style={{ padding:"14px 18px",
                        borderBottom:`1px solid ${T.border}` }}>
                        <div style={{ fontSize:11, fontWeight:700, color:T.textMute,
                          textTransform:"uppercase", letterSpacing:0.7,
                          marginBottom:10 }}>Order Items</div>
                        {order.items.map((item,i) => (
                          <div key={i} style={{ display:"flex",
                            justifyContent:"space-between", marginBottom:6 }}>
                            <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                              <div style={{ width:22, height:22, borderRadius:6,
                                background:T.orangeBg,
                                display:"flex", alignItems:"center",
                                justifyContent:"center", fontSize:11,
                                fontWeight:900, color:T.orange }}>
                                {item.qty}
                              </div>
                              <span style={{ fontSize:13, fontWeight:600,
                                color:T.textMid }}>{item.name}</span>
                            </div>
                            <span style={{ fontSize:13, fontWeight:800,
                              color:T.navy, fontFamily:"monospace" }}>
                              {fmt(item.price * item.qty)}
                            </span>
                          </div>
                        ))}
                        {order.note && (
                          <div style={{ background:T.amberBg,
                            border:`1px solid ${T.amber}22`,
                            borderRadius:10, padding:"8px 12px", marginTop:10,
                            display:"flex", gap:7, alignItems:"flex-start" }}>
                            <Icon name="utensils" size={13} color={T.amber}/>
                            <span style={{ fontSize:12, color:T.amber,
                              fontWeight:600, lineHeight:1.5 }}>{order.note}</span>
                          </div>
                        )}
                      </div>

                      {/* Delivery info */}
                      <div style={{ padding:"12px 18px",
                        borderBottom:`1px solid ${T.border}`,
                        display:"flex", gap:8, alignItems:"center" }}>
                        <Icon name="mapPin" size={14} color={T.textMute}/>
                        <span style={{ fontSize:12, color:T.textMid,
                          fontWeight:600 }}>{order.address}</span>
                        <span style={{ fontSize:11, color:T.textMute,
                          marginLeft:"auto" }}>~{order.deliveryTime}</span>
                      </div>

                      {/* Rider info (if on the way) */}
                      {order.rider && (
                        <div style={{ padding:"12px 18px",
                          borderBottom:`1px solid ${T.border}`,
                          display:"flex", gap:10, alignItems:"center" }}>
                          <div style={{ width:36, height:36, borderRadius:10,
                            background:T.greenBg,
                            display:"flex", alignItems:"center",
                            justifyContent:"center" }}>
                            <Icon name="bike" size={18} color={T.green}/>
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:12, fontWeight:800,
                              color:T.textMain }}>{order.rider.name}</div>
                            <div style={{ fontSize:11, color:T.textMute }}>
                              Assigned Rider
                            </div>
                          </div>
                          <button onClick={() => onCallRider(order.rider.phone)}
                            style={{ width:36, height:36, borderRadius:10,
                              background:T.greenBg, border:`1px solid ${T.green}22`,
                              display:"flex", alignItems:"center",
                              justifyContent:"center" }}>
                            <Icon name="phone" size={15} color={T.green}/>
                          </button>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{ padding:"14px 18px",
                        display:"flex", gap:8 }}>
                        {/* Contact buyer */}
                        <button onClick={() => onChatBuyer(order.id)} style={{
                          width:42, height:42, borderRadius:12,
                          background:T.navyLight, border:`1px solid ${T.border}`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                        }}>
                          {/* 🧭 NAVIGATE → Brick 6 Chat */}
                          <Icon name="message" size={17} color={T.navy}/>
                        </button>
                        <button onClick={() => onCallBuyer(order.buyerPhone)} style={{
                          width:42, height:42, borderRadius:12,
                          background:T.greenBg, border:`1px solid ${T.green}22`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                        }}>
                          <Icon name="phone" size={17} color={T.green}/>
                        </button>

                        {/* Status action */}
                        {order.status === "placed" && (
                          <>
                            <button onClick={() => rejectOrder(order.id)} style={{
                              flex:1, height:42, borderRadius:12,
                              background:T.redBg, border:`1px solid ${T.red}22`,
                              fontSize:12, fontWeight:800, color:T.red,
                              display:"flex", alignItems:"center",
                              justifyContent:"center", gap:6,
                            }}>
                              <Icon name="x" size={14} color={T.red}/>
                              Reject
                            </button>
                            <button onClick={() => updateOrderStatus(order.id, "preparing")}
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

                        {sc.next && order.status !== "placed" && (
                          <button onClick={() => updateOrderStatus(order.id, sc.next)}
                            style={{ flex:1, height:42, borderRadius:12,
                              background:`linear-gradient(135deg,${sc.color},${sc.color}CC)`,
                              border:"none", fontSize:12, fontWeight:900,
                              color:"#fff", display:"flex", alignItems:"center",
                              justifyContent:"center", gap:6,
                              boxShadow:`0 4px 14px ${sc.color}44` }}>
                            <Icon name={sc.icon} size={14} color="#fff"/>
                            {sc.nextLabel}
                          </button>
                        )}

                        {order.status === "delivered" && (
                          <div style={{ flex:1, height:42, borderRadius:12,
                            background:T.greenBg, border:`1px solid ${T.green}22`,
                            display:"flex", alignItems:"center",
                            justifyContent:"center", gap:6 }}>
                            <Icon name="check" size={14} color={T.green}/>
                            <span style={{ fontSize:12, fontWeight:800,
                              color:T.green }}>Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ══ KITCHEN VIEW TAB ══ */}
        {activeTab === "kitchen" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {/* Kitchen queue */}
            {["placed","preparing","ready"].map(status => {
              const sc      = STATUS_CONFIG[status];
              const filtered = orders.filter(o => o.status === status);
              if (filtered.length === 0) return null;
              return (
                <div key={status} style={{ marginBottom:20 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8,
                    marginBottom:12 }}>
                    <div style={{ width:32, height:32, borderRadius:9,
                      background:sc.bg, border:`1px solid ${sc.color}22`,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon name={sc.icon} size={15} color={sc.color}/>
                    </div>
                    <span style={{ fontSize:15, fontWeight:900, color:T.textMain }}>
                      {sc.label}
                    </span>
                    <div style={{ width:22, height:22, borderRadius:"50%",
                      background:sc.color, display:"flex", alignItems:"center",
                      justifyContent:"center", marginLeft:"auto" }}>
                      <span style={{ fontSize:11, fontWeight:900, color:"#fff" }}>
                        {filtered.length}
                      </span>
                    </div>
                  </div>
                  {filtered.map(order => (
                    <div key={order.id} style={{ background:T.card,
                      borderRadius:18, padding:"16px 18px", marginBottom:10,
                      border:`1px solid ${sc.color}22`,
                      boxShadow:T.shadow }}>
                      <div style={{ display:"flex", justifyContent:"space-between",
                        marginBottom:10 }}>
                        <div style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                          {order.buyerName}
                        </div>
                        <div style={{ fontSize:12, color:T.textMute }}>
                          {order.placedAt}
                        </div>
                      </div>
                      {order.items.map((item,i) => (
                        <div key={i} style={{ display:"flex", gap:8,
                          alignItems:"center", marginBottom:6 }}>
                          <div style={{ width:28, height:28, borderRadius:8,
                            background:T.orangeBg, flexShrink:0,
                            display:"flex", alignItems:"center",
                            justifyContent:"center", fontSize:13,
                            fontWeight:900, color:T.orange }}>
                            {item.qty}x
                          </div>
                          <span style={{ fontSize:13, fontWeight:700,
                            color:T.textMid }}>{item.name}</span>
                        </div>
                      ))}
                      {order.note && (
                        <div style={{ background:T.amberBg, borderRadius:10,
                          padding:"7px 12px", marginTop:8, marginBottom:10,
                          fontSize:11, color:T.amber, fontWeight:700 }}>
                          Note: {order.note}
                        </div>
                      )}
                      {sc.next && (
                        <button onClick={() => updateOrderStatus(order.id, sc.next)}
                          style={{ width:"100%", padding:"10px 0", borderRadius:12,
                            background:`linear-gradient(135deg,${sc.color},${sc.color}CC)`,
                            border:"none", fontSize:12, fontWeight:900,
                            color:"#fff", display:"flex", alignItems:"center",
                            justifyContent:"center", gap:6,
                            marginTop:8 }}>
                          <Icon name={sc.icon} size={14} color="#fff"/>
                          {sc.nextLabel}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
            {orders.filter(o => ["placed","preparing","ready"].includes(o.status)).length === 0 && (
              <div style={{ textAlign:"center", padding:"60px 0" }}>
                <div style={{ fontSize:"48px", marginBottom:12 }}>👨‍🍳</div>
                <div style={{ fontSize:16, fontWeight:800, color:T.textMain,
                  marginBottom:8 }}>Kitchen is clear!</div>
                <div style={{ fontSize:13, color:T.textMute }}>No active orders right now</div>
              </div>
            )}
          </div>
        )}

        {/* ══ MENU TAB ══ */}
        {activeTab === "menu" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ fontSize:13, color:T.textMute, marginBottom:16, fontWeight:600 }}>
              Toggle items on/off based on availability
            </div>
            {menu.map((item, i) => (
              <div key={item.id} style={{ background:T.card, borderRadius:18,
                padding:"16px 18px", marginBottom:10,
                border:`1px solid ${item.available ? T.border : T.red+"33"}`,
                boxShadow:T.shadow, opacity: item.available ? 1 : 0.75,
                display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:44, height:44, borderRadius:13,
                  background:T.orangeBg,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="fire" size={22} color={T.orange}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
                    marginBottom:3 }}>{item.name}</div>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <span style={{ fontSize:12, fontWeight:900, color:T.navy,
                      fontFamily:"monospace" }}>{fmt(item.price)}</span>
                    <span style={{ fontSize:11, color:T.textMute }}>
                      {item.orders} orders today
                    </span>
                  </div>
                </div>
                {/* Toggle */}
                <button onClick={() => toggleMenuItem(item.id)} style={{
                  background:"none", border:"none", flexShrink:0,
                }}>
                  <Icon name={item.available ? "toggle" : "toggleOff"} size={32}
                    color={item.available ? T.green : T.textMute}/>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ══ ANALYTICS TAB ══ */}
        {activeTab === "analytics" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {/* Today summary */}
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
                marginBottom:16 }}>Today's Summary</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
                gap:12, marginBottom:16 }}>
                {[
                  { label:"Total Revenue",   value:fmt(stats.todayRevenue), color:T.green,  icon:"trending" },
                  { label:"Total Orders",    value:stats.todayOrders,       color:T.blue,   icon:"package"  },
                  { label:"Completed",       value:stats.completedToday,    color:T.green,  icon:"check"    },
                  { label:"Cancelled",       value:stats.cancelledToday,    color:T.red,    icon:"x"        },
                ].map(item => (
                  <div key={item.label} style={{ background:T.bg, borderRadius:16,
                    padding:"14px 16px", border:`1px solid ${T.border}` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7,
                      marginBottom:8 }}>
                      <div style={{ width:28, height:28, borderRadius:8,
                        background:item.color+"14",
                        display:"flex", alignItems:"center",
                        justifyContent:"center" }}>
                        <Icon name={item.icon} size={13} color={item.color}/>
                      </div>
                      <span style={{ fontSize:10, color:T.textMute,
                        fontWeight:700, textTransform:"uppercase",
                        letterSpacing:0.5 }}>{item.label}</span>
                    </div>
                    <div style={{ fontSize:20, fontWeight:900, color:T.navy,
                      fontFamily:"monospace" }}>{item.value}</div>
                  </div>
                ))}
              </div>
              {/* Top item */}
              <div style={{ background:T.goldLight, border:`1px solid ${T.gold}22`,
                borderRadius:14, padding:"12px 16px",
                display:"flex", gap:10, alignItems:"center" }}>
                <Icon name="fire" size={20} color={T.gold}/>
                <div>
                  <div style={{ fontSize:10, color:T.amber, fontWeight:800,
                    textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>
                    TOP DISH TODAY
                  </div>
                  <div style={{ fontSize:14, fontWeight:900, color:T.navy }}>
                    {stats.topItem}
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue bar chart */}
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
                marginBottom:16 }}>Revenue This Week</div>
              {/* 🔌 BACKEND — replace with real chart data from analytics */}
              <div style={{ display:"flex", alignItems:"flex-end",
                gap:8, height:100 }}>
                {[
                  { day:"Mon", val:320000 },
                  { day:"Tue", val:480000 },
                  { day:"Wed", val:390000 },
                  { day:"Thu", val:560000 },
                  { day:"Fri", val:480000 },
                  { day:"Sat", val:720000 },
                  { day:"Sun", val:480000 },
                ].map((d, i) => {
                  const max  = 720000;
                  const h    = Math.round((d.val/max) * 80);
                  const isToday = i === 6;
                  return (
                    <div key={d.day} style={{ flex:1,
                      display:"flex", flexDirection:"column",
                      alignItems:"center", gap:6 }}>
                      <div style={{ width:"100%", height:h, borderRadius:"6px 6px 0 0",
                        background:isToday
                          ? `linear-gradient(180deg,${T.gold},#A07008)`
                          : `linear-gradient(180deg,${T.navy}88,${T.navy}44)`,
                        boxShadow:isToday ? `0 4px 12px ${T.gold}44` : "none" }}/>
                      <span style={{ fontSize:9, fontWeight:isToday?900:600,
                        color:isToday?T.gold:T.textMute }}>{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* View full analytics */}
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

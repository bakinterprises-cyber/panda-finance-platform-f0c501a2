import { useState } from "react";

// ============================================================
// 🧱 BRICK 5 — SELLER COMMAND CENTER
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 📦  Assembly: export SellerCommandCenter from this file
//     Props: { sellerId, onNavigate, onWalletPress }
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
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    bell:         <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...s}/><path d="M13.73 21a2 2 0 0 1-3.46 0" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    trending:     <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    trendingDown: <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" {...s}/><polyline points="17 18 23 18 23 12" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
    eyeOff:       <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" {...s}/><line x1="1" y1="1" x2="23" y2="23" {...s}/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    video:        <><polygon points="23 7 16 12 23 17 23 7" {...s}/><rect x="1" y="5" width="15" height="14" rx="2" {...s}/></>,
    tag:          <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" {...s}/><line x1="7" y1="7" x2="7.01" y2="7" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    pieChart:     <><path d="M21.21 15.89A10 10 0 1 1 8 2.83" {...s}/><path d="M22 12A10 10 0 0 0 12 2v10z" {...s}/></>,
    robot:        <><rect x="3" y="11" width="18" height="10" rx="2" {...s}/><path d="M12 11V7" {...s}/><circle cx="12" cy="5" r="2" {...s}/><line x1="8" y1="15" x2="8" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/><line x1="16" y1="15" x2="16" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    dollarSign:   <><line x1="12" y1="1" x2="12" y2="23" {...s}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...s}/></>,
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    settings:     <><circle cx="12" cy="12" r="3" {...s}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" {...s}/></>,
    send:         <><line x1="22" y1="2" x2="11" y2="13" {...s}/><polygon points="22 2 15 22 11 13 2 9 22 2" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    refresh:      <><polyline points="23 4 23 10 17 10" {...s}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...s}/></>,
    arrowUp:      <><line x1="12" y1="19" x2="12" y2="5" {...s}/><polyline points="5 12 12 5 19 12" {...s}/></>,
    arrowDown:    <><line x1="12" y1="5" x2="12" y2="19" {...s}/><polyline points="19 12 12 19 5 12" {...s}/></>,
    withdraw:     <><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" {...s}/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" {...s}/><path d="M18 12a2 2 0 0 0 0 4h4v-4z" {...s}/></>,
    laptop:       <><rect x="2" y="3" width="20" height="14" rx="2" {...s}/><line x1="2" y1="17" x2="22" y2="17" {...s}/></>,
    shopping:     <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" {...s}/><line x1="3" y1="6" x2="21" y2="6" {...s}/><path d="M16 10a4 4 0 0 1-8 0" {...s}/></>,
    capital:      <><line x1="12" y1="1" x2="12" y2="23" {...s}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...s}/></>,
    savings:      <><path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    loans:        <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" {...s}/><line x1="8" y1="21" x2="16" y2="21" {...s}/><line x1="12" y1="17" x2="12" y2="21" {...s}/></>,
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
// 🔌 BACKEND SWAP POINT #1 — SELLER PROFILE & WALLET
// Replace with: const seller = await supabase
//   .from('sellers').select('*').eq('id', sellerId).single()
// 💰 WALLET: const wallet = await supabase
//   .from('wallets').select('*').eq('user_id', sellerId).single()
// ============================================================
const MOCK_DATA = {
  seller: {
    id:          "SEL-001",
    name:        "Tech Master Store",
    initials:    "TM",
    color:       "#1D4ED8",
    badge:       "Elite Seller",
    badgeColor:  T.gold,
    trustScore:  98,
    verified:    true,
  },
  // 💰 WALLET — swap with PandaWallet real balance
  wallet: {
    balance:     12450000,
    pending:     1200000,
    thisMonth:   3400000,
    showBalance: true,
  },
  // 🔌 BACKEND SWAP POINT #2 — BUSINESS OVERVIEW
  // Replace with: supabase.from('seller_analytics')
  //   .select('*').eq('seller_id', sellerId)
  //   .eq('period', selectedPeriod).single()
  overview: {
    revenue:   { value:25400000, growth:18.5,  trend:"up"   },
    orders:    { value:624,      growth:12.7,  trend:"up"   },
    visitors:  { value:18700,   growth:22.1,  trend:"up"   },
    conversion:{ value:3.3,     growth:-0.4,  trend:"down" },
  },
  // 🔌 BACKEND SWAP POINT #3 — ORDERS SUMMARY
  // Replace with: supabase.from('orders')
  //   .select('status, count').eq('seller_id', sellerId)
  //   .group('status')
  orders: {
    all:       624,
    pending:   32,
    shipped:   210,
    delivered: 382,
    returns:   12,
  },
  // 🔌 BACKEND SWAP POINT #4 — RECENT ORDERS
  // Replace with: supabase.from('orders').select('*,buyer(*),product(*)')
  //   .eq('seller_id', sellerId).order('created_at', { ascending: false }).limit(5)
  recentOrders: [
    { id:"ORD-8821", buyer:"Hassan K",  product:"iPhone 15 Pro Max",     amount:1650000, status:"delivered", time:"2h ago",   color:"#1D4ED8" },
    { id:"ORD-8820", buyer:"Amina Tz",  product:"AirPods Pro 2nd Gen",   amount:350000,  status:"shipped",   time:"4h ago",   color:"#6D28D9" },
    { id:"ORD-8819", buyer:"Peter M",   product:"MacBook Air M2",         amount:2800000, status:"pending",   time:"6h ago",   color:"#0A7B4B" },
    { id:"ORD-8818", buyer:"Zawadi S",  product:"Samsung 65\" 4K TV",    amount:1200000, status:"delivered", time:"1d ago",   color:"#C9960A" },
    { id:"ORD-8817", buyer:"John D",    product:"Sony WH-1000XM5",       amount:480000,  status:"returned",  time:"2d ago",   color:"#C0392B" },
  ],
  // 🔌 BACKEND SWAP POINT #5 — REVENUE CHART DATA
  // Replace with: supabase.from('daily_revenue')
  //   .select('date, amount').eq('seller_id', sellerId)
  //   .gte('date', startDate).order('date')
  chartData: [
    { day:"Mon", value:3200000  },
    { day:"Tue", value:4800000  },
    { day:"Wed", value:3600000  },
    { day:"Thu", value:6200000  },
    { day:"Fri", value:5100000  },
    { day:"Sat", value:7800000  },
    { day:"Sun", value:4300000  },
  ],
  // 🔌 BACKEND SWAP POINT #6 — TOP PRODUCTS
  // Replace with: supabase.from('products')
  //   .select('*').eq('seller_id', sellerId)
  //   .order('sold_count', { ascending: false }).limit(3)
  topProducts: [
    { id:1, name:"iPhone 15 Pro Max 256GB", sold:420, revenue:693000000, icon:"laptop",     growth:12  },
    { id:2, name:"AirPods Pro 2nd Gen",     sold:890, revenue:311500000, icon:"laptop",     growth:28  },
    { id:3, name:"MacBook Air M2 256GB",    sold:180, revenue:504000000, icon:"laptop",     growth:8   },
  ],
};

const STATUS_COLORS = {
  delivered: T.green,
  shipped:   T.blue,
  pending:   T.amber,
  returned:  T.red,
};

const STATUS_BG = {
  delivered: T.greenBg,
  shipped:   T.blueBg,
  pending:   T.amberBg,
  returned:  T.redBg,
};

// ============================================================
// 🧱 MAIN COMPONENT — SellerCommandCenter
// ============================================================
export default function App({
  // 👤 AUTH — replace with real seller from supabase.auth.getUser()
  sellerData     = MOCK_DATA.seller,
  walletData     = MOCK_DATA.wallet,
  overviewData   = MOCK_DATA.overview,
  ordersData     = MOCK_DATA.orders,
  recentOrders   = MOCK_DATA.recentOrders,
  chartData      = MOCK_DATA.chartData,
  topProducts    = MOCK_DATA.topProducts,

  // 🧭 NAVIGATE
  onAddProduct   = () => {},   // → Add Product screen
  onLiveStream   = () => {},   // → Brick 2 Live stream start
  onPromotions   = () => {},   // → Promotions manager
  onCoupons      = () => {},   // → Coupons manager
  onAnalytics    = () => {},   // → Full analytics screen
  onAllOrders    = () => {},   // → Orders management
  onOrderPress   = () => {},   // → Single order detail
  onCapital      = () => {},   // → Panda Capital screen
  onSavings      = () => {},   // → Panda Savings screen
  onLoans        = () => {},   // → Panda Loans screen
  onAIAssistant  = () => {},   // → AI Business Assistant
  onSettings     = () => {},   // → Store settings
  // 💰 WALLET
  onWithdraw     = () => {},   // → PandaWallet withdraw
  onSendMoney    = () => {},   // → PandaWallet send
  onAddMoney     = () => {},   // → PandaWallet add
}) {
  const [showBalance, setShowBalance] = useState(walletData.showBalance);
  const [period,      setPeriod]      = useState("This Month");
  const [activeTab,   setActiveTab]   = useState("overview");
  const [toast,       setToast]       = useState(null);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const maxChart = Math.max(...chartData.map(d => d.value));

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes growBar  { from{height:0} to{height:var(--h)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

      {/* ── TOAST ── */}
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

      {/* ── TOP HEADER ── */}
      <div style={{
        background:`linear-gradient(135deg,${T.navy} 0%,${T.navyMid} 100%)`,
        padding:"52px 20px 24px",
        position:"relative", overflow:"hidden",
      }}>
        {/* BG pattern */}
        <div style={{ position:"absolute", inset:0, opacity:0.05,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"20px 20px" }}/>
        <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180,
          borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>

        {/* Seller info */}
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:20, position:"relative" }}>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ position:"relative" }}>
              <div style={{
                width:48, height:48, borderRadius:15,
                background:`linear-gradient(135deg,${sellerData.color}44,${sellerData.color}88)`,
                border:"2px solid rgba(255,255,255,0.25)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18, fontWeight:900, color:"#fff",
              }}>{sellerData.initials}</div>
              {sellerData.verified && (
                <div style={{ position:"absolute", bottom:-3, right:-3,
                  width:18, height:18, borderRadius:"50%",
                  background:T.blue, border:"2px solid rgba(255,255,255,0.8)",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="shield" size={9} color="#fff"/>
                </div>
              )}
            </div>
            <div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
                fontWeight:600, marginBottom:2 }}>Welcome back,</div>
              <div style={{ fontSize:16, fontWeight:900, color:"#fff",
                letterSpacing:-0.3 }}>{sellerData.name}</div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:4,
                background:`${sellerData.badgeColor}33`,
                border:`1px solid ${sellerData.badgeColor}44`,
                borderRadius:8, padding:"2px 8px", marginTop:4 }}>
                <Icon name="award" size={10} color={sellerData.badgeColor}/>
                <span style={{ fontSize:10, fontWeight:800,
                  color:sellerData.badgeColor }}>{sellerData.badge}</span>
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
              <div style={{ position:"absolute", top:7, right:7, width:8, height:8,
                background:T.red, borderRadius:"50%",
                border:"1.5px solid rgba(11,31,75,0.8)" }}/>
            </button>
            <button onClick={onSettings} style={{ width:38, height:38, borderRadius:11,
              background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="settings" size={17} color="#fff"/>
            </button>
          </div>
        </div>

        {/* 💰 WALLET BALANCE CARD */}
        <div style={{
          background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,0.15)",
          borderRadius:22, padding:"18px 20px",
          position:"relative",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:4 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Icon name="wallet" size={14} color="rgba(255,255,255,0.7)"/>
              <span style={{ fontSize:11, fontWeight:700,
                color:"rgba(255,255,255,0.7)" }}>Total Balance (Panda Wallet)</span>
            </div>
            <button onClick={() => setShowBalance(s => !s)} style={{
              background:"none", border:"none", padding:4,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <Icon name={showBalance ? "eye" : "eyeOff"} size={16}
                color="rgba(255,255,255,0.6)"/>
            </button>
          </div>
          <div style={{ fontSize:30, fontWeight:900, color:"#fff",
            fontFamily:"monospace", letterSpacing:-1, marginBottom:16 }}>
            {/* 💰 WALLET — swap with real balance from PandaWallet */}
            {showBalance ? fmt(walletData.balance) : "TSh ••••••••"}
          </div>
          {/* Wallet actions */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {[
              { label:"Withdraw", icon:"withdraw",  action:onWithdraw  },
              { label:"Send",     icon:"send",       action:onSendMoney },
              { label:"Add",      icon:"plus",       action:onAddMoney  },
            ].map(btn => (
              <button key={btn.label} onClick={btn.action} style={{
                padding:"10px 0", borderRadius:14,
                background:"rgba(255,255,255,0.12)",
                border:"1px solid rgba(255,255,255,0.18)",
                color:"#fff", fontSize:12, fontWeight:800,
                display:"flex", flexDirection:"column",
                alignItems:"center", gap:5, cursor:"pointer",
                transition:"all 0.18s",
              }}>
                <Icon name={btn.icon} size={16} color="#fff"/>
                {btn.label}
              </button>
            ))}
          </div>
          {/* Pending badge */}
          {walletData.pending > 0 && (
            <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:6,
              background:"rgba(201,150,10,0.2)", border:"1px solid rgba(201,150,10,0.3)",
              borderRadius:10, padding:"6px 12px" }}>
              <Icon name="zap" size={12} color={T.goldMid}/>
              <span style={{ fontSize:11, fontWeight:700, color:T.goldMid }}>
                {fmt(walletData.pending)} pending from escrow
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── BUSINESS OVERVIEW ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Icon name="barChart" size={16} color={T.navy}/>
              <span style={{ fontSize:15, fontWeight:900, color:T.textMain }}>
                Business Overview
              </span>
            </div>
            {/* Period selector */}
            <div style={{ display:"flex", gap:4 }}>
              {["This Week","This Month","This Year"].map(p => (
                <button key={p} onClick={() => setPeriod(p)} style={{
                  padding:"5px 10px", borderRadius:8, fontSize:10, fontWeight:700,
                  background: period===p ? T.navy : T.navyLight,
                  color: period===p ? "#fff" : T.textMute,
                  border: period===p ? "none" : `1px solid ${T.border}`,
                  transition:"all 0.18s", whiteSpace:"nowrap",
                }}>
                  {p.replace("This ","")}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:20 }}>
            {[
              { label:"Revenue",    value:fmt(overviewData.revenue.value),   growth:overviewData.revenue.growth,    trend:overviewData.revenue.trend,    color:T.green  },
              { label:"Orders",     value:overviewData.orders.value,          growth:overviewData.orders.growth,     trend:overviewData.orders.trend,     color:T.blue   },
              { label:"Visitors",   value:(overviewData.visitors.value/1000).toFixed(1)+"K", growth:overviewData.visitors.growth,   trend:overviewData.visitors.trend,   color:T.purple },
              { label:"Conversion", value:overviewData.conversion.value+"%", growth:overviewData.conversion.growth, trend:overviewData.conversion.trend, color:T.amber  },
            ].map(m => (
              <div key={m.label} style={{ background:T.bg, borderRadius:18,
                padding:"14px 16px", border:`1px solid ${T.border}` }}>
                <div style={{ fontSize:11, color:T.textMute, fontWeight:700,
                  textTransform:"uppercase", letterSpacing:0.6, marginBottom:6 }}>
                  {m.label}
                </div>
                <div style={{ fontSize:18, fontWeight:900, color:T.navy,
                  fontFamily:"monospace", letterSpacing:-0.5, marginBottom:6 }}>
                  {m.value}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:18, height:18, borderRadius:6,
                    background: m.trend==="up" ? T.greenBg : T.redBg,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name={m.trend==="up" ? "arrowUp" : "arrowDown"} size={10}
                      color={m.trend==="up" ? T.green : T.red}/>
                  </div>
                  <span style={{ fontSize:11, fontWeight:800,
                    color:m.trend==="up" ? T.green : T.red }}>
                    {m.trend==="up" ? "+" : ""}{m.growth}%
                  </span>
                  <span style={{ fontSize:10, color:T.textMute }}>vs last period</span>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue bar chart */}
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:T.textMid, marginBottom:12 }}>
              Daily Revenue — {period}
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:80 }}>
              {chartData.map((d, i) => {
                const h = (d.value / maxChart) * 70;
                const isToday = i === 5; // Saturday = today
                return (
                  <div key={d.day} style={{ flex:1, display:"flex",
                    flexDirection:"column", alignItems:"center", gap:6 }}>
                    <div style={{ width:"100%", position:"relative" }}>
                      <div style={{
                        height:h, borderRadius:"6px 6px 0 0",
                        background: isToday
                          ? `linear-gradient(180deg,${T.gold},#A07008)`
                          : `linear-gradient(180deg,${T.navy}88,${T.navy}44)`,
                        transition:"height 0.6s ease",
                        boxShadow: isToday ? `0 4px 12px ${T.gold}44` : "none",
                      }}/>
                    </div>
                    <span style={{ fontSize:9, color: isToday ? T.gold : T.textMute,
                      fontWeight: isToday ? 900 : 600 }}>{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── ORDERS SUMMARY ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Icon name="package" size={16} color={T.navy}/>
              <span style={{ fontSize:15, fontWeight:900, color:T.textMain }}>Orders</span>
            </div>
            <button onClick={onAllOrders} style={{
              display:"flex", alignItems:"center", gap:4,
              background:"none", border:"none",
              fontSize:12, fontWeight:700, color:T.navy,
            }}>
              Manage All <Icon name="chevronRight" size={14} color={T.navy}/>
            </button>
          </div>

          {/* Order status pills */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:20 }}>
            {[
              { label:"All",       value:ordersData.all,       color:T.navy   },
              { label:"Pending",   value:ordersData.pending,   color:T.amber  },
              { label:"Shipped",   value:ordersData.shipped,   color:T.blue   },
              { label:"Delivered", value:ordersData.delivered, color:T.green  },
              { label:"Returns",   value:ordersData.returns,   color:T.red    },
            ].map(o => (
              <div key={o.label} style={{ background:o.color+"14",
                border:`1px solid ${o.color}22`,
                borderRadius:14, padding:"10px 6px", textAlign:"center",
                cursor:"pointer" }}>
                <div style={{ fontSize:16, fontWeight:900, color:o.color,
                  fontFamily:"monospace", marginBottom:3 }}>{o.value}</div>
                <div style={{ fontSize:8, color:o.color, fontWeight:700,
                  textTransform:"uppercase", letterSpacing:0.3 }}>{o.label}</div>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div style={{ fontSize:12, fontWeight:800, color:T.textMid, marginBottom:12 }}>
            Recent Orders
          </div>
          {recentOrders.map((order, i) => (
            <div key={order.id} onClick={() => onOrderPress(order.id)}
              style={{ display:"flex", gap:12, alignItems:"center",
                padding:"12px 0",
                borderBottom: i < recentOrders.length-1 ? `1px solid ${T.border}` : "none",
                cursor:"pointer" }}>
              {/* Buyer avatar */}
              <div style={{ width:38, height:38, borderRadius:11, flexShrink:0,
                background:`linear-gradient(135deg,${order.color}22,${order.color}44)`,
                border:`1.5px solid ${order.color}33`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:12, fontWeight:900, color:order.color }}>
                {order.buyer[0]}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                  marginBottom:2 }}>{order.buyer}</div>
                <div style={{ fontSize:11, color:T.textMute,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {order.product}
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:12, fontWeight:900, color:T.navy,
                  fontFamily:"monospace", marginBottom:4 }}>{fmt(order.amount)}</div>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:3,
                  background:STATUS_BG[order.status],
                  borderRadius:7, padding:"2px 8px",
                }}>
                  <div style={{ width:5, height:5, borderRadius:"50%",
                    background:STATUS_COLORS[order.status] }}/>
                  <span style={{ fontSize:9, fontWeight:800,
                    color:STATUS_COLORS[order.status],
                    textTransform:"capitalize" }}>{order.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TOOLS & FEATURES ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <Icon name="zap" size={16} color={T.navy}/>
            <span style={{ fontSize:15, fontWeight:900, color:T.textMain }}>
              Tools & Features
            </span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
            {[
              { label:"Add\nProduct",  icon:"shopping",  color:T.blue,   action:onAddProduct  },
              { label:"Live\nStream",  icon:"video",     color:T.red,    action:onLiveStream  },
              { label:"Promotions",    icon:"tag",       color:T.purple, action:onPromotions  },
              { label:"Coupons",       icon:"award",     color:T.gold,   action:onCoupons     },
              { label:"Analytics",     icon:"barChart",  color:T.green,  action:onAnalytics   },
            ].map(tool => (
              <button key={tool.label} onClick={tool.action} style={{
                display:"flex", flexDirection:"column", alignItems:"center",
                gap:6, padding:"12px 4px", borderRadius:16, border:"none",
                background:tool.color+"0F", cursor:"pointer",
                transition:"all 0.18s",
              }}>
                <div style={{ width:40, height:40, borderRadius:13,
                  background:tool.color+"18",
                  border:`1.5px solid ${tool.color}22`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={tool.icon} size={18} color={tool.color}/>
                </div>
                <span style={{ fontSize:9, fontWeight:800, color:tool.color,
                  textAlign:"center", lineHeight:1.3,
                  whiteSpace:"pre-line" }}>{tool.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── TOP PRODUCTS ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Icon name="trending" size={16} color={T.navy}/>
              <span style={{ fontSize:15, fontWeight:900, color:T.textMain }}>
                Top Products
              </span>
            </div>
            <button onClick={onAnalytics} style={{
              display:"flex", alignItems:"center", gap:4, background:"none",
              border:"none", fontSize:12, fontWeight:700, color:T.navy,
            }}>
              View All <Icon name="chevronRight" size={14} color={T.navy}/>
            </button>
          </div>
          {topProducts.map((p, i) => (
            <div key={p.id} style={{ display:"flex", gap:12, alignItems:"center",
              padding:"12px 0",
              borderBottom: i < topProducts.length-1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ width:36, height:36, borderRadius:11,
                background:T.navyLight,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:14, fontWeight:900, color:T.textMute, flexShrink:0 }}>
                {i+1}
              </div>
              <div style={{ width:40, height:40, borderRadius:12, background:T.navyLight,
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0 }}>
                <Icon name={p.icon} size={20} color={T.navy+"44"}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                  marginBottom:2, overflow:"hidden", textOverflow:"ellipsis",
                  whiteSpace:"nowrap" }}>{p.name}</div>
                <div style={{ fontSize:11, color:T.textMute }}>{p.sold} sold</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:12, fontWeight:900, color:T.navy,
                  fontFamily:"monospace", marginBottom:3 }}>
                  {fmt(p.revenue)}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:3,
                  justifyContent:"flex-end" }}>
                  <Icon name="arrowUp" size={10} color={T.green}/>
                  <span style={{ fontSize:10, fontWeight:800,
                    color:T.green }}>+{p.growth}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── PANDA FINANCE SECTION ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Icon name="dollarSign" size={16} color={T.navy}/>
              <span style={{ fontSize:15, fontWeight:900, color:T.textMain }}>
                Panda Finance
              </span>
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:T.navy }}>View All</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {[
              { label:"Panda Capital",  sub:"Get funding for your business",      icon:"capital",  color:T.blue,   action:onCapital  },
              { label:"Panda Savings",  sub:"Save and earn high returns",          icon:"savings",  color:T.green,  action:onSavings  },
              { label:"Panda Loans",    sub:"Grow your business with loans",       icon:"loans",    color:T.purple, action:onLoans    },
            ].map(item => (
              <button key={item.label} onClick={item.action} style={{
                background:`linear-gradient(135deg,${item.color}14,${item.color}08)`,
                border:`1px solid ${item.color}22`,
                borderRadius:18, padding:"16px 12px", cursor:"pointer",
                textAlign:"center", transition:"all 0.18s",
              }}>
                <div style={{ width:40, height:40, borderRadius:13,
                  background:item.color+"18",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 10px",
                  border:`1.5px solid ${item.color}22` }}>
                  <Icon name={item.icon} size={18} color={item.color}/>
                </div>
                <div style={{ fontSize:11, fontWeight:900, color:T.textMain,
                  marginBottom:5, lineHeight:1.3 }}>{item.label}</div>
                <div style={{ fontSize:9, color:T.textMute, lineHeight:1.4 }}>{item.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── PANDA AI ASSISTANT FOR SELLERS ── */}
        <div style={{
          background:`linear-gradient(135deg,#3B1FA3 0%,#6D28D9 50%,#4C1D95 100%)`,
          borderRadius:22, padding:"20px", marginBottom:14,
          position:"relative", overflow:"hidden", cursor:"pointer",
        }} onClick={onAIAssistant}>
          <div style={{ position:"absolute", inset:0, opacity:0.06,
            backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize:"16px 16px" }}/>
          <div style={{ position:"absolute", top:-20, right:-20,
            width:100, height:100, borderRadius:"50%",
            background:"rgba(255,255,255,0.05)" }}/>
          <div style={{ display:"flex", gap:16, alignItems:"center", position:"relative" }}>
            <div style={{ width:56, height:56, borderRadius:18,
              background:"rgba(255,255,255,0.15)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:28, flexShrink:0 }}>🐼</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
                <Icon name="robot" size={14} color="rgba(255,255,255,0.8)"/>
                <span style={{ fontSize:11, fontWeight:800,
                  color:"rgba(255,255,255,0.7)", letterSpacing:0.8 }}>
                  PANDA AI ASSISTANT FOR SELLERS
                </span>
              </div>
              <div style={{ fontSize:14, fontWeight:900, color:"#fff", marginBottom:4 }}>
                Get AI help to grow your business
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>
                Pricing advice · Inventory tips · Marketing strategy · Sales forecasts
              </div>
            </div>
            <Icon name="chevronRight" size={18} color="rgba(255,255,255,0.6)"/>
          </div>
        </div>

      </div>

      <BottomNav active="profile"/>
    </div>
  );
}

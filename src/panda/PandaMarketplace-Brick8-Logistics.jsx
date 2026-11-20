import { useState } from "react";

// ============================================================
// 🧱 BRICK 8 — LOGISTICS & DELIVERY TRACKING
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 📦  Assembly: export LogisticsTracking from this file
//     Props: { orderId, currentUser, onBack, onChatSeller,
//              onPayNow, onNavigate }
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
    arrowLeft:    <><line x1="19" y1="12" x2="5" y2="12" {...s}/><polyline points="12 19 5 12 12 5" {...s}/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/><polyline points="3.27 6.96 12 12.01 20.73 6.96" {...s}/><line x1="12" y1="22.08" x2="12" y2="12" {...s}/></>,
    mapPin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    checkCircle:  <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" {...s}/><polyline points="22 4 12 14.01 9 11.01" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    phone:        <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" {...s}/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    starEmpty:    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke={color} strokeWidth="1.4"/>,
    share:        <><circle cx="18" cy="5" r="3" {...s}/><circle cx="6" cy="12" r="3" {...s}/><circle cx="18" cy="19" r="3" {...s}/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" {...s}/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" {...s}/></>,
    copy:         <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" {...s}/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" {...s}/></>,
    refresh:      <><polyline points="23 4 23 10 17 10" {...s}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...s}/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    alertCircle:  <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    laptop:       <><rect x="2" y="3" width="20" height="14" rx="2" {...s}/><line x1="2" y1="17" x2="22" y2="17" {...s}/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    thumbsUp:     <><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" {...s}/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" {...s}/></>,
    navigation:   <><polygon points="3 11 22 2 13 21 11 13 3 11" {...s}/></>,
    bike:         <><circle cx="5.5" cy="17.5" r="3.5" {...s}/><circle cx="18.5" cy="17.5" r="3.5" {...s}/><path d="M15 6a1 1 0 0 0-1-1h-1" {...s}/><path d="M12 6L5.5 14" {...s}/><path d="M18.5 14 12 6" {...s}/><path d="M5.5 14H18.5" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, display: "block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav ───────────────────────────────────────────────
function BottomNav({ active = "home" }) {
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
// 🔌 BACKEND SWAP POINT #1 — ORDER DATA
// Replace with: supabase.from('orders')
//   .select('*,product(*),seller(*),delivery(*),escrow(*)')
//   .eq('id', orderId).single()
// Real-time updates: supabase.channel(`order:${orderId}`)
//   .on('postgres_changes', { event: 'UPDATE',
//        schema: 'public', table: 'orders',
//        filter: `id=eq.${orderId}` },
//     payload => setOrder(payload.new))
//   .subscribe()
// ============================================================
const MOCK_ORDER = {
  id:           "ORD-882134",
  placedAt:     "Today, 10:15 AM",
  estimatedDelivery: "Today, 2:00 – 4:00 PM",
  currentStatus:"in_transit", // placed|confirmed|packed|collected|in_transit|nearby|delivered
  product: {
    name:    "iPhone 15 Pro Max 256GB Natural Titanium",
    price:   1650000,
    qty:     1,
    icon:    "laptop",
  },
  seller: {
    name:     "Tech Master Store",
    initials: "TM",
    color:    "#1D4ED8",
    phone:    "+255 712 345 678",
    trustScore: 98,
  },
  rider: {
    name:     "Juma Hassan",
    initials: "JH",
    color:    T.green,
    phone:    "+255 756 789 012",
    rating:   4.9,
    deliveries: 1240,
    vehicle:  "Boda Boda",
    plate:    "DSM 4521",
    eta:      "18 mins",
    distance: "3.2 km away",
  },
  from: {
    label:   "Tech Master Store",
    address: "Kariakoo Market, Dar es Salaam",
  },
  to: {
    label:   "Your Location",
    address: "Sinza, Dar es Salaam",
  },
  escrow: {
    status:  "held",   // held | released | refunded
    amount:  1650000,
  },
  timeline: [
    { id:1, label:"Order Placed",          time:"10:15 AM", done:true,  icon:"package",  detail:"Your order was confirmed and payment held in escrow" },
    { id:2, label:"Seller Confirmed",      time:"10:22 AM", done:true,  icon:"check",    detail:"Tech Master Store confirmed your order" },
    { id:3, label:"Order Packed",          time:"10:45 AM", done:true,  icon:"package",  detail:"Your iPhone has been carefully packed and sealed" },
    { id:4, label:"Rider Collected",       time:"11:30 AM", done:true,  icon:"bike",     detail:"Juma Hassan picked up your order from the store" },
    { id:5, label:"On The Way",            time:"11:35 AM", done:true,  icon:"truck",    detail:"Your order is heading to your location" },
    { id:6, label:"Nearby",               time:"ETA 2:00 PM",done:false,icon:"mapPin",  detail:"Rider is near your location" },
    { id:7, label:"Delivered",            time:"ETA 2:30 PM",done:false,icon:"checkCircle",detail:"Order delivered successfully" },
  ],
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — ALL ORDERS LIST
// Replace with: supabase.from('orders')
//   .select('*,product(*),seller(*)')
//   .eq('buyer_id', currentUser.id)
//   .order('created_at', { ascending: false })
// ============================================================
const MOCK_ORDERS_LIST = [
  { id:"ORD-882134", product:"iPhone 15 Pro Max 256GB", seller:"Tech Master Store",  price:1650000, status:"in_transit", time:"Today",      icon:"laptop"   },
  { id:"ORD-881209", product:"AirPods Pro 2nd Gen",     seller:"Tech Master Store",  price:350000,  status:"delivered",  time:"Yesterday",  icon:"laptop"   },
  { id:"ORD-880445", product:"Samsung 65\" 4K TV",      seller:"Home Essentials",    price:1200000, status:"delivered",  time:"3 days ago", icon:"laptop"   },
  { id:"ORD-879012", product:"Designer Handbag",        seller:"Fashion Hub",        price:180000,  status:"cancelled",  time:"5 days ago", icon:"package"  },
];

const STATUS_MAP = {
  placed:     { label:"Order Placed",   color:T.blue,   bg:T.blueBg   },
  confirmed:  { label:"Confirmed",      color:T.purple, bg:T.purpleBg },
  packed:     { label:"Packed",         color:T.amber,  bg:T.amberBg  },
  collected:  { label:"Collected",      color:T.gold,   bg:T.goldLight},
  in_transit: { label:"On The Way",     color:T.navy,   bg:T.navyLight},
  nearby:     { label:"Nearby",         color:T.green,  bg:T.greenBg  },
  delivered:  { label:"Delivered",      color:T.green,  bg:T.greenBg  },
  cancelled:  { label:"Cancelled",      color:T.red,    bg:T.redBg    },
};

// ============================================================
// 🧱 MAIN COMPONENT — LogisticsTracking
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user from supabase.auth.getUser()
  currentUser   = { id:"user-001", name:"BAK" },

  // 🔌 BACKEND — replace with real order data
  order         = MOCK_ORDER,
  ordersList    = MOCK_ORDERS_LIST,

  // 🧭 NAVIGATE
  onBack        = () => {},   // → previous screen
  onChatSeller  = () => {},   // → Brick 6 Marketplace Chat
  onChatRider   = () => {},   // → Brick 6 Chat (rider)
  onCallRider   = () => {},   // → phone dialer
  onCallSeller  = () => {},   // → phone dialer
  onOrderPress  = () => {},   // → individual order tracking
  onShopMore    = () => {},   // → Brick 1 Homepage
  // 💰 WALLET
  onConfirmDelivery = () => {}, // → PandaWallet.releaseEscrow()
  onRequestRefund   = () => {}, // → PandaWallet.refundEscrow()
}) {
  const [view,          setView]          = useState("tracking"); // "tracking" | "orders"
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [delivered,     setDelivered]     = useState(false);
  const [rating,        setRating]        = useState(0);
  const [rated,         setRated]         = useState(false);
  const [toast,         setToast]         = useState(null);
  const [copied,        setCopied]        = useState(false);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyOrderId = () => {
    setCopied(true);
    showToast("Order ID copied!", T.navy);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmDelivery = () => {
    // 💰 WALLET — release escrow to seller
    // supabase.functions.invoke('release-escrow', {
    //   escrow_id: order.escrow.id,
    //   order_id:  order.id,
    //   buyer_id:  currentUser.id,
    // })
    setDelivered(true);
    setShowConfirm(false);
    showToast("Delivery confirmed! Escrow released to seller.", T.green);
    onConfirmDelivery(order.id);
  };

  const currentStatusInfo = STATUS_MAP[order.currentStatus] || STATUS_MAP.placed;
  const completedSteps    = order.timeline.filter(t => t.done).length;
  const progress          = Math.round((completedSteps / order.timeline.length) * 100);

  // ── CONFIRM DELIVERY MODAL ───────────────────────────────────
  const ConfirmModal = () => (
    <div style={{
      position:"fixed", inset:0, zIndex:999,
      background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"flex-end", justifyContent:"center",
    }} onClick={() => setShowConfirm(false)}>
      <div onClick={e => e.stopPropagation()} style={{
        background:T.white, borderRadius:"28px 28px 0 0",
        padding:"28px 24px 40px", width:"100%", maxWidth:430,
        animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ width:40, height:4, borderRadius:99,
          background:T.border, margin:"0 auto 24px" }}/>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ width:72, height:72, borderRadius:"50%",
            background:T.greenBg, border:`3px solid ${T.green}33`,
            display:"flex", alignItems:"center", justifyContent:"center",
            margin:"0 auto 16px" }}>
            <Icon name="package" size={36} color={T.green}/>
          </div>
          <div style={{ fontSize:20, fontWeight:900, color:T.textMain,
            marginBottom:8 }}>Confirm Delivery?</div>
          <div style={{ fontSize:13, color:T.textMute, lineHeight:1.7 }}>
            By confirming, you agree that you have received your order in good condition. This will release the escrow payment to the seller.
          </div>
        </div>
        {/* Escrow notice */}
        <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
          borderRadius:18, padding:"16px 20px", marginBottom:20,
          display:"flex", gap:12, alignItems:"center" }}>
          <Icon name="shield" size={22} color={T.gold}/>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:"#fff", marginBottom:2 }}>
              Escrow Release
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>
              {fmt(order.escrow.amount)} will be released to {order.seller.name}
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => setShowConfirm(false)} style={{
            flex:1, padding:"14px 0", borderRadius:16,
            background:T.navyLight, border:`1px solid ${T.border}`,
            fontSize:14, fontWeight:800, color:T.textMid, cursor:"pointer",
          }}>Cancel</button>
          <button onClick={handleConfirmDelivery} style={{
            flex:1, padding:"14px 0", borderRadius:16,
            background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
            border:"none", color:"#fff", fontSize:14, fontWeight:900,
            cursor:"pointer", boxShadow:`0 6px 20px ${T.green}44`,
          }}>
            Yes, Received!
          </button>
        </div>
      </div>
    </div>
  );

  // ── RATING SCREEN ────────────────────────────────────────────
  if (delivered && !rated) return (
    <div style={{
      background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:24,
    }}>
      <style>{`
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>
      <div style={{ width:"100%", textAlign:"center" }}>
        {/* Success */}
        <div style={{ width:90, height:90, borderRadius:"50%",
          background:T.greenBg, border:`3px solid ${T.green}44`,
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 20px",
          animation:"bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <Icon name="checkCircle" size={46} color={T.green}/>
        </div>
        <div style={{ fontSize:24, fontWeight:900, color:T.textMain,
          marginBottom:6 }}>Order Delivered!</div>
        <div style={{ fontSize:13, color:T.textMute, marginBottom:28, lineHeight:1.7 }}>
          Payment has been released to {order.seller.name}. Thank you for shopping with Panda!
        </div>

        {/* Rate the order */}
        <div style={{ background:T.card, borderRadius:24, padding:"24px",
          border:`1px solid ${T.border}`, boxShadow:T.shadowMd, marginBottom:20 }}>
          <div style={{ fontSize:16, fontWeight:900, color:T.textMain, marginBottom:6 }}>
            Rate Your Experience
          </div>
          <div style={{ fontSize:12, color:T.textMute, marginBottom:20 }}>
            Help other buyers by rating this order
          </div>
          {/* Stars */}
          <div style={{ display:"flex", justifyContent:"center", gap:12, marginBottom:20 }}>
            {[1,2,3,4,5].map(i => (
              <button key={i} onClick={() => setRating(i)}
                style={{ background:"none", border:"none", cursor:"pointer",
                  transform: i <= rating ? "scale(1.2)" : "scale(1)",
                  transition:"transform 0.18s" }}>
                <Icon name={i <= rating ? "star" : "starEmpty"}
                  size={36} color={i <= rating ? T.gold : T.border}/>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <div style={{ fontSize:13, fontWeight:700, color:T.gold, marginBottom:16 }}>
              {rating === 5 ? "Excellent! 🔥" :
               rating === 4 ? "Great!" :
               rating === 3 ? "Good" :
               rating === 2 ? "Could be better" : "Poor experience"}
            </div>
          )}
          <button onClick={() => {
            if (rating === 0) { showToast("Please select a rating", T.amber); return; }
            // 🔌 BACKEND — supabase.from('reviews').insert({
            //   order_id: order.id, seller_id: order.seller.id,
            //   buyer_id: currentUser.id, rating, type: 'order'
            // })
            setRated(true);
            showToast("Thank you for your review!", T.gold);
          }} style={{
            width:"100%", padding:"14px 0", borderRadius:16,
            background: rating > 0
              ? `linear-gradient(135deg,${T.gold},#A07008)`
              : T.navyLight,
            border: rating > 0 ? "none" : `1px solid ${T.border}`,
            color: rating > 0 ? "#fff" : T.textMute,
            fontSize:14, fontWeight:900, cursor:"pointer",
            transition:"all 0.2s",
          }}>Submit Review</button>
        </div>
        <button onClick={onShopMore} style={{
          width:"100%", padding:"14px 0", borderRadius:16,
          background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
          border:"none", color:"#fff", fontSize:14, fontWeight:900,
          cursor:"pointer", boxShadow:`0 6px 20px ${T.navy}44`,
        }}>
          Continue Shopping
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes truck    { 0%,100%{transform:translateX(0)} 50%{transform:translateX(6px)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

      {showConfirm && <ConfirmModal/>}

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:110, left:"50%", transform:"translateX(-50%)",
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

      {/* ── TOP BAR ── */}
      <div style={{
        background:"rgba(255,255,255,0.96)", backdropFilter:"blur(16px)",
        padding:"14px 20px", position:"sticky", top:0, zIndex:100,
        borderBottom:`1px solid ${T.border}`,
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <button onClick={onBack} style={{
          width:40, height:40, borderRadius:12, background:T.navyLight,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Icon name="arrowLeft" size={18} color={T.navy}/>
        </button>
        <div style={{ fontSize:15, fontWeight:800, color:T.textMain }}>
          {view === "tracking" ? "Track Order" : "My Orders"}
        </div>
        <button onClick={() => setView(v => v === "tracking" ? "orders" : "tracking")} style={{
          padding:"8px 14px", borderRadius:10, background:T.navyLight,
          border:`1px solid ${T.border}`, fontSize:12, fontWeight:700,
          color:T.navy,
        }}>
          {view === "tracking" ? "All Orders" : "Track Order"}
        </button>
      </div>

      {/* ══ ORDERS LIST VIEW ══ */}
      {view === "orders" && (
        <div style={{ padding:"16px 20px 0", animation:"fadeUp 0.25s ease" }}>
          <div style={{ fontSize:16, fontWeight:900, color:T.textMain,
            marginBottom:14, letterSpacing:-0.3 }}>My Orders</div>
          {MOCK_ORDERS_LIST.map((o, i) => {
            const st = STATUS_MAP[o.status] || STATUS_MAP.placed;
            return (
              <div key={o.id} onClick={() => { setView("tracking"); onOrderPress(o.id); }}
                style={{ background:T.card, borderRadius:20,
                  border:`1px solid ${T.border}`, padding:"16px",
                  marginBottom:12, boxShadow:T.shadow, cursor:"pointer",
                  animation:`fadeUp 0.25s ease ${i*0.05}s both`,
                  display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:52, height:52, borderRadius:16,
                  background:T.navyLight, flexShrink:0,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={o.icon} size={26} color={T.navy+"44"}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
                    marginBottom:3, overflow:"hidden", textOverflow:"ellipsis",
                    whiteSpace:"nowrap" }}>{o.product}</div>
                  <div style={{ fontSize:11, color:T.textMute,
                    marginBottom:6 }}>{o.seller} · {o.time}</div>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center" }}>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:4,
                      background:st.bg, borderRadius:8, padding:"3px 8px" }}>
                      <div style={{ width:5, height:5, borderRadius:"50%",
                        background:st.color }}/>
                      <span style={{ fontSize:10, fontWeight:800,
                        color:st.color }}>{st.label}</span>
                    </div>
                    <span style={{ fontSize:13, fontWeight:900, color:T.navy,
                      fontFamily:"monospace" }}>{fmt(o.price)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══ TRACKING VIEW ══ */}
      {view === "tracking" && (
        <div style={{ padding:"16px 20px 0" }}>

          {/* ── ORDER ID CARD ── */}
          <div style={{ background:T.card, borderRadius:22, padding:"16px 20px",
            boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:10 }}>
              <div style={{ fontSize:11, color:T.textMute, fontWeight:700,
                textTransform:"uppercase", letterSpacing:0.8 }}>Order ID</div>
              <button onClick={handleCopyOrderId} style={{
                display:"flex", alignItems:"center", gap:5,
                background:T.navyLight, border:`1px solid ${T.border}`,
                borderRadius:8, padding:"4px 10px",
                fontSize:11, fontWeight:700, color:T.navy,
              }}>
                <Icon name={copied ? "check" : "copy"} size={12}
                  color={copied ? T.green : T.navy}/>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div style={{ fontSize:18, fontWeight:900, color:T.navy,
              fontFamily:"monospace", letterSpacing:1, marginBottom:8 }}>
              {order.id}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center" }}>
              <div style={{ fontSize:12, color:T.textMute }}>
                Placed: {order.placedAt}
              </div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:5,
                background:currentStatusInfo.bg,
                border:`1px solid ${currentStatusInfo.color}33`,
                borderRadius:10, padding:"4px 12px" }}>
                <div style={{ width:6, height:6, borderRadius:"50%",
                  background:currentStatusInfo.color,
                  animation: order.currentStatus === "in_transit" ? "pulse 1.5s infinite" : "none" }}/>
                <span style={{ fontSize:11, fontWeight:800,
                  color:currentStatusInfo.color }}>{currentStatusInfo.label}</span>
              </div>
            </div>
          </div>

          {/* ── LIVE MAP PLACEHOLDER ── */}
          {/* 🔌 BACKEND — Replace with Google Maps / Mapbox component
              Rider real-time location from: supabase.channel('rider_location')
              .on('postgres_changes', { event: 'UPDATE', table: 'rider_locations',
                filter: `order_id=eq.${order.id}` }, payload => updateMap(payload.new))
              .subscribe() */}
          <div style={{
            height:200, borderRadius:22, marginBottom:14, overflow:"hidden",
            background:`linear-gradient(135deg,${T.navyLight},#C8D8F8)`,
            position:"relative", border:`1px solid ${T.border}`,
            boxShadow:T.shadow,
          }}>
            {/* Map grid pattern */}
            <div style={{ position:"absolute", inset:0,
              backgroundImage:`
                linear-gradient(rgba(11,31,75,0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(11,31,75,0.06) 1px, transparent 1px)
              `, backgroundSize:"32px 32px" }}/>
            {/* Roads */}
            <div style={{ position:"absolute", top:"40%", left:0, right:0,
              height:3, background:T.white, opacity:0.6 }}/>
            <div style={{ position:"absolute", top:0, bottom:0, left:"35%",
              width:3, background:T.white, opacity:0.6 }}/>
            <div style={{ position:"absolute", top:"65%", left:0, right:0,
              height:2, background:T.white, opacity:0.4 }}/>
            {/* Seller pin */}
            <div style={{ position:"absolute", top:"30%", left:"30%",
              transform:"translate(-50%,-50%)" }}>
              <div style={{ background:T.blue, borderRadius:"50% 50% 50% 0",
                transform:"rotate(-45deg)", width:28, height:28,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:`0 4px 12px ${T.blue}55` }}>
                <div style={{ transform:"rotate(45deg)" }}>
                  <Icon name="package" size={14} color="#fff"/>
                </div>
              </div>
            </div>
            {/* Destination pin */}
            <div style={{ position:"absolute", top:"65%", left:"70%",
              transform:"translate(-50%,-50%)" }}>
              <div style={{ background:T.green, borderRadius:"50% 50% 50% 0",
                transform:"rotate(-45deg)", width:32, height:32,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:`0 4px 12px ${T.green}55` }}>
                <div style={{ transform:"rotate(45deg)" }}>
                  <Icon name="home" size={16} color="#fff"/>
                </div>
              </div>
            </div>
            {/* Rider icon (animated) */}
            <div style={{ position:"absolute", top:"47%", left:"50%",
              transform:"translate(-50%,-50%)",
              animation:"truck 2s ease-in-out infinite" }}>
              <div style={{ background:T.gold, borderRadius:12, width:36, height:36,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:T.shadowGold, border:`2px solid ${T.white}` }}>
                <Icon name="bike" size={18} color="#fff"/>
              </div>
            </div>
            {/* ETA badge */}
            <div style={{ position:"absolute", top:14, right:14,
              background:"rgba(255,255,255,0.95)", backdropFilter:"blur(8px)",
              borderRadius:14, padding:"8px 14px",
              boxShadow:T.shadow, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
                marginBottom:2 }}>Estimated Arrival</div>
              <div style={{ fontSize:14, fontWeight:900, color:T.navy }}>
                {order.rider.eta}
              </div>
            </div>
            {/* Live badge */}
            <div style={{ position:"absolute", top:14, left:14,
              display:"flex", alignItems:"center", gap:5,
              background:"rgba(11,31,75,0.8)", backdropFilter:"blur(8px)",
              borderRadius:10, padding:"5px 10px" }}>
              <div style={{ width:6, height:6, borderRadius:"50%",
                background:T.green, animation:"pulse 1.5s infinite" }}/>
              <span style={{ fontSize:10, fontWeight:800, color:"#fff" }}>Live Tracking</span>
            </div>
          </div>

          {/* ── RIDER CARD ── */}
          <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
            boxShadow:T.shadowMd, marginBottom:14,
            border:`1.5px solid ${T.green}22` }}>
            <div style={{ fontSize:11, color:T.textMute, fontWeight:700,
              textTransform:"uppercase", letterSpacing:0.8, marginBottom:14 }}>
              Your Delivery Rider
            </div>
            <div style={{ display:"flex", gap:14, alignItems:"center",
              marginBottom:16 }}>
              <div style={{ position:"relative" }}>
                <div style={{ width:56, height:56, borderRadius:18,
                  background:`linear-gradient(135deg,${order.rider.color}22,${order.rider.color}44)`,
                  border:`2px solid ${order.rider.color}33`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:18, fontWeight:900, color:order.rider.color }}>
                  {order.rider.initials}
                </div>
                <div style={{ position:"absolute", bottom:-3, right:-3,
                  width:18, height:18, borderRadius:"50%",
                  background:T.green, border:`2px solid ${T.white}`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="check" size={9} color="#fff"/>
                </div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:16, fontWeight:900, color:T.textMain,
                  marginBottom:4 }}>{order.rider.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:8,
                  flexWrap:"wrap" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                    <Icon name="star" size={12} color={T.gold}/>
                    <span style={{ fontSize:12, fontWeight:800,
                      color:T.textMid }}>{order.rider.rating}</span>
                  </div>
                  <div style={{ width:3, height:3, borderRadius:"50%",
                    background:T.border }}/>
                  <span style={{ fontSize:12, color:T.textMute }}>
                    {order.rider.deliveries.toLocaleString()} deliveries
                  </span>
                  <div style={{ width:3, height:3, borderRadius:"50%",
                    background:T.border }}/>
                  <span style={{ fontSize:12, color:T.textMute }}>
                    {order.rider.vehicle} · {order.rider.plate}
                  </span>
                </div>
              </div>
            </div>
            {/* ETA + Distance */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
              gap:10, marginBottom:16 }}>
              {[
                { label:"ETA",      value:order.rider.eta,       icon:"clock",  color:T.blue   },
                { label:"Distance", value:order.rider.distance,  icon:"mapPin", color:T.green  },
              ].map(item => (
                <div key={item.label} style={{ background:T.bg, borderRadius:14,
                  padding:"12px 14px", border:`1px solid ${T.border}`,
                  display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:34, height:34, borderRadius:10,
                    background:item.color+"14",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name={item.icon} size={16} color={item.color}/>
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:900, color:T.navy }}>{item.value}</div>
                    <div style={{ fontSize:10, color:T.textMute, fontWeight:600 }}>{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Rider actions */}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={onCallRider} style={{
                flex:1, height:44, borderRadius:14,
                background:T.greenBg, border:`1px solid ${T.green}22`,
                display:"flex", alignItems:"center", justifyContent:"center",
                gap:7, fontSize:13, fontWeight:800, color:T.green,
              }}>
                <Icon name="phone" size={16} color={T.green}/>
                Call Rider
              </button>
              {/* 🧭 NAVIGATE → Brick 6 Chat with rider */}
              <button onClick={onChatRider} style={{
                flex:1, height:44, borderRadius:14,
                background:T.navyLight, border:`1px solid ${T.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                gap:7, fontSize:13, fontWeight:800, color:T.navy,
              }}>
                <Icon name="message" size={16} color={T.navy}/>
                Message
              </button>
            </div>
          </div>

          {/* ── ROUTE INFO ── */}
          <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
            boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:13, fontWeight:900, color:T.textMain,
              marginBottom:14 }}>Delivery Route</div>
            <div style={{ display:"flex", gap:14 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
                paddingTop:4 }}>
                <div style={{ width:12, height:12, borderRadius:"50%",
                  background:T.blue, border:`2px solid ${T.white}`,
                  boxShadow:`0 0 0 2px ${T.blue}44` }}/>
                <div style={{ width:2, height:36, background:T.border, margin:"4px 0" }}/>
                <div style={{ width:12, height:12, borderRadius:"50%",
                  background:T.green, border:`2px solid ${T.white}`,
                  boxShadow:`0 0 0 2px ${T.green}44` }}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:11, color:T.textMute, fontWeight:700,
                    textTransform:"uppercase", letterSpacing:0.6, marginBottom:3 }}>From</div>
                  <div style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                    {order.from.label}</div>
                  <div style={{ fontSize:12, color:T.textMute }}>{order.from.address}</div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:T.textMute, fontWeight:700,
                    textTransform:"uppercase", letterSpacing:0.6, marginBottom:3 }}>To</div>
                  <div style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                    {order.to.label}</div>
                  <div style={{ fontSize:12, color:T.textMute }}>{order.to.address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── DELIVERY TIMELINE ── */}
          <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
            boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:900, color:T.textMain }}>
                Delivery Timeline
              </div>
              <div style={{ fontSize:12, fontWeight:800, color:T.green }}>
                {completedSteps}/{order.timeline.length} steps
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height:6, background:T.border, borderRadius:99,
              overflow:"hidden", marginBottom:20 }}>
              <div style={{ height:"100%", width:`${progress}%`,
                background:`linear-gradient(90deg,${T.green},${T.goldMid})`,
                borderRadius:99, transition:"width 0.8s ease" }}/>
            </div>
            {/* Steps */}
            {order.timeline.map((step, i) => (
              <div key={step.id} style={{ display:"flex", gap:14,
                marginBottom:i < order.timeline.length-1 ? 16 : 0 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{
                    width:36, height:36, borderRadius:"50%", flexShrink:0,
                    background: step.done ? T.green : T.navyLight,
                    border:`2px solid ${step.done ? T.green : T.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"all 0.3s",
                    boxShadow: step.done ? `0 4px 12px ${T.green}33` : "none",
                  }}>
                    <Icon name={step.done ? "check" : step.icon} size={16}
                      color={step.done ? "#fff" : T.textMute}/>
                  </div>
                  {i < order.timeline.length-1 && (
                    <div style={{ width:2, height:24, marginTop:4,
                      background: step.done ? T.green+"44" : T.border,
                      transition:"background 0.3s" }}/>
                  )}
                </div>
                <div style={{ paddingTop:6, flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:3 }}>
                    <div style={{ fontSize:13, fontWeight: step.done ? 800 : 600,
                      color: step.done ? T.textMain : T.textMute }}>{step.label}</div>
                    <div style={{ fontSize:11, fontWeight:700,
                      color: step.done ? T.green : T.textMute }}>{step.time}</div>
                  </div>
                  {step.done && (
                    <div style={{ fontSize:11, color:T.textMute, lineHeight:1.5 }}>
                      {step.detail}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── PRODUCT SUMMARY ── */}
          <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
            boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:13, fontWeight:900, color:T.textMain,
              marginBottom:14 }}>Order Summary</div>
            <div style={{ display:"flex", gap:14, alignItems:"center",
              marginBottom:14 }}>
              <div style={{ width:60, height:60, borderRadius:16,
                background:T.navyLight, flexShrink:0,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name={order.product.icon} size={28} color={T.navy+"44"}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
                  marginBottom:4, lineHeight:1.3 }}>{order.product.name}</div>
                <div style={{ fontSize:12, color:T.textMute }}>
                  Qty: {order.product.qty}
                </div>
              </div>
              <div style={{ fontSize:15, fontWeight:900, color:T.navy,
                fontFamily:"monospace" }}>{fmt(order.product.price)}</div>
            </div>
            {/* Escrow status */}
            <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
              borderRadius:16, padding:"12px 16px",
              display:"flex", gap:10, alignItems:"center" }}>
              <Icon name="shield" size={18} color={T.gold}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:800, color:"#fff" }}>
                  Panda Escrow Protected
                </div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", marginTop:2 }}>
                  {fmt(order.escrow.amount)} held until you confirm delivery
                </div>
              </div>
              <div style={{ background:T.amber+"33", borderRadius:8, padding:"3px 8px" }}>
                <span style={{ fontSize:10, fontWeight:900, color:T.goldMid,
                  textTransform:"uppercase" }}>Held</span>
              </div>
            </div>
          </div>

          {/* ── SELLER INFO ── */}
          <div style={{ background:T.card, borderRadius:22, padding:"16px 20px",
            boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}`,
            display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ width:44, height:44, borderRadius:13, flexShrink:0,
              background:`linear-gradient(135deg,${order.seller.color}22,${order.seller.color}44)`,
              border:`2px solid ${order.seller.color}33`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:15, fontWeight:900, color:order.seller.color }}>
              {order.seller.initials}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
                marginBottom:2 }}>{order.seller.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:5, height:5, borderRadius:"50%",
                  background:T.green }}/>
                <span style={{ fontSize:11, fontWeight:700,
                  color:T.green }}>Trust Score {order.seller.trustScore}</span>
              </div>
            </div>
            {/* 🧭 NAVIGATE → Brick 6 Chat with seller */}
            <button onClick={onChatSeller} style={{
              width:40, height:40, borderRadius:12, background:T.navyLight,
              border:`1px solid ${T.border}`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <Icon name="message" size={17} color={T.navy}/>
            </button>
            <button onClick={onCallSeller} style={{
              width:40, height:40, borderRadius:12, background:T.greenBg,
              border:`1px solid ${T.green}22`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <Icon name="phone" size={17} color={T.green}/>
            </button>
          </div>

        </div>
      )}

      {/* ── STICKY BOTTOM CTA ── */}
      {view === "tracking" && (
        <div style={{
          position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:430,
          background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)",
          borderTop:`1px solid ${T.border}`,
          padding:"14px 20px 28px",
          boxShadow:"0 -4px 24px rgba(11,31,75,0.1)",
          zIndex:150,
        }}>
          {order.currentStatus === "delivered" || delivered ? (
            <button onClick={() => setShowConfirm(true)} style={{
              width:"100%", padding:"15px 0", borderRadius:18,
              background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
              border:"none", color:"#fff", fontSize:15, fontWeight:900,
              cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"center", gap:8,
              boxShadow:`0 6px 20px ${T.green}44`,
            }}>
              <Icon name="checkCircle" size={18} color="#fff"/>
              {/* 💰 WALLET — triggers PandaWallet.releaseEscrow() */}
              Confirm Delivery & Release Payment
            </button>
          ) : (
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={onRequestRefund} style={{
                width:50, height:50, borderRadius:16, flexShrink:0,
                background:T.redBg, border:`1px solid ${T.red}22`,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <Icon name="x" size={20} color={T.red}/>
              </button>
              <button style={{
                flex:1, height:50, borderRadius:16,
                background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
                border:"none", color:"#fff", fontSize:13, fontWeight:900,
                cursor:"pointer", display:"flex", alignItems:"center",
                justifyContent:"center", gap:8,
                boxShadow:`0 6px 20px ${T.navy}44`,
              }}>
                <div style={{ width:8, height:8, borderRadius:"50%",
                  background:T.green, animation:"pulse 1.5s infinite" }}/>
                Live Tracking Active · {order.rider.eta}
              </button>
            </div>
          )}
        </div>
      )}

      <BottomNav active="home"/>
    </div>
  );
}

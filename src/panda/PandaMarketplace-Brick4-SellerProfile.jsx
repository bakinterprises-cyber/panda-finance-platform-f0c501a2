import { useState } from "react";

// ============================================================
// 🧱 BRICK 4 — SELLER PROFILE (TRUST CENTER)
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 📦  Assembly: export SellerProfile from this file
//     Props: { sellerId, onBack, onProductPress,
//              onChatSeller, onCallSeller, onBuyNow }
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

// ─── SVG Icons ────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    arrowLeft:    <><line x1="19" y1="12" x2="5" y2="12" {...s}/><polyline points="12 19 5 12 12 5" {...s}/></>,
    share:        <><circle cx="18" cy="5" r="3" {...s}/><circle cx="6" cy="12" r="3" {...s}/><circle cx="18" cy="19" r="3" {...s}/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" {...s}/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    starEmpty:    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke={color} strokeWidth="1.4"/>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    phone:        <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" {...s}/></>,
    video:        <><polygon points="23 7 16 12 23 17 23 7" {...s}/><rect x="1" y="5" width="15" height="14" rx="2" {...s}/></>,
    userPlus:     <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><line x1="19" y1="8" x2="19" y2="14" {...s}/><line x1="22" y1="11" x2="16" y2="11" {...s}/></>,
    heart:        <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...s}/></>,
    heartFill:    <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={color} stroke={color} strokeWidth="1.4"/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    mapPin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    calendar:     <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" {...s}/><line x1="16" y1="2" x2="16" y2="6" {...s}/><line x1="8" y1="2" x2="8" y2="6" {...s}/><line x1="3" y1="10" x2="21" y2="10" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    trending:     <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    refresh:      <><polyline points="23 4 23 10 17 10" {...s}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...s}/></>,
    laptop:       <><rect x="2" y="3" width="20" height="14" rx="2" {...s}/><line x1="2" y1="17" x2="22" y2="17" {...s}/></>,
    shopping:     <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" {...s}/><line x1="3" y1="6" x2="21" y2="6" {...s}/><path d="M16 10a4 4 0 0 1-8 0" {...s}/></>,
    headphones:   <><path d="M3 18v-6a9 9 0 0 1 18 0v6" {...s}/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" {...s}/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" {...s}/></>,
    flag:         <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" {...s}/><line x1="4" y1="22" x2="4" y2="15" {...s}/></>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    info:         <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    live:         <><circle cx="12" cy="12" r="10" {...s}/><circle cx="12" cy="12" r="3" fill={color} stroke="none"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, display: "block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Trust Score Ring ──────────────────────────────────────────
function TrustBadge({ score, size = "lg" }) {
  const sz = size === "xl" ? 72 : size === "lg" ? 56 : size === "md" ? 44 : 32;
  const fs = size === "xl" ? 18 : size === "lg" ? 15 : size === "md" ? 12 : 9;
  const level = score >= 95 ? "Elite" : score >= 85 ? "Top" : score >= 70 ? "Good" : "New";
  const levelColor = score >= 95 ? T.gold : score >= 85 ? T.green : T.blue;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{
        width: sz, height: sz, borderRadius: "50%",
        background: `conic-gradient(${T.green} ${score * 3.6}deg, ${T.border} 0deg)`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        boxShadow: `0 0 0 3px ${T.white}, 0 0 0 5px ${T.green}33`,
      }}>
        <div style={{
          width: sz - 8, height: sz - 8, borderRadius: "50%",
          background: T.white,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: fs, fontWeight: 900, color: T.green, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: fs - 3, color: T.textMute, lineHeight: 1.2 }}>Trust</span>
        </div>
      </div>
      {size !== "sm" && (
        <div style={{
          background: levelColor + "18", border: `1px solid ${levelColor}33`,
          borderRadius: 99, padding: "2px 10px",
          fontSize: 10, fontWeight: 800, color: levelColor,
        }}>{level} Seller</div>
      )}
    </div>
  );
}

// ─── Stars ────────────────────────────────────────────────────
function Stars({ rating, size = 13 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Icon key={i} name={i <= Math.round(rating) ? "star" : "starEmpty"} size={size} color={T.gold}/>
      ))}
    </div>
  );
}

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
// 🔌 BACKEND SWAP POINT #1 — SELLER DATA
// Replace with: const seller = await supabase
//   .from('sellers').select('*,products(*),reviews(*)')
//   .eq('id', sellerId).single()
// ============================================================
const MOCK_SELLER = {
  id:            "SEL-001",
  name:          "Tech Master Store",
  initials:      "TM",
  tagline:       "Original gadgets · Fast delivery · 12 months warranty",
  color:         "#1D4ED8",
  verified:      true,
  verifiedType:  "BRELA Registered Business",
  trustScore:    98,
  rating:        4.9,
  reviewCount:   2300,
  followers:     20000,
  following:     false,
  products:      2300,
  orders:        15000,
  responseTime:  "15 mins",
  memberSince:   "Jan 2021",
  location:      "Dar es Salaam, Tanzania",
  deliverySuccess: 98,
  refundRate:    2,
  about:         "We sell original gadgets with warranty. Fast delivery across Tanzania. All products come with a 12-month manufacturer warranty and 7-day return policy. We are BRELA registered and TIN verified.",
  badges: [
    { label:"Top Seller",     color: T.gold,   icon:"award"   },
    { label:"Fast Delivery",  color: T.blue,   icon:"truck"   },
    { label:"Verified",       color: T.green,  icon:"shield"  },
  ],
  trustBreakdown: [
    { label:"Delivery Success", value:98,  color:T.green  },
    { label:"Review Score",     value:98,  color:T.blue   },
    { label:"Response Rate",    value:100, color:T.purple },
    { label:"Refund Rate",      value:96,  color:T.gold   },
  ],
};

// 🔌 BACKEND SWAP POINT #2 — SELLER PRODUCTS
// Replace with: supabase.from('products').select('*')
//   .eq('seller_id', sellerId).order('sold_count', { ascending: false })
const MOCK_PRODUCTS = [
  { id:1, name:"iPhone 15 Pro Max 256GB",    price:1650000, original:1800000, rating:4.9, reviews:320, sold:420, icon:"laptop",     tag:"Best Seller" },
  { id:2, name:"MacBook Air M2 256GB",       price:2800000, original:3200000, rating:4.8, reviews:210, sold:180, icon:"laptop",     tag:"Top Rated"   },
  { id:3, name:"AirPods Pro 2nd Gen",        price:350000,  original:420000,  rating:4.9, reviews:560, sold:890, icon:"headphones", tag:"Hot Deal"    },
  { id:4, name:"Samsung 65\" 4K Smart TV",  price:1200000, original:null,    rating:4.7, reviews:145, sold:95,  icon:"shopping",   tag:null          },
  { id:5, name:"Sony WH-1000XM5 Headphones",price:480000,  original:600000,  rating:4.8, reviews:230, sold:310, icon:"headphones", tag:"Sale"        },
  { id:6, name:"iPad Pro 12.9\" M2",        price:1900000, original:2100000, rating:4.9, reviews:178, sold:145, icon:"laptop",     tag:null          },
];

// 🔌 BACKEND SWAP POINT #3 — SELLER REVIEWS
// Replace with: supabase.from('reviews').select('*,buyer(*)')
//   .eq('seller_id', sellerId).order('created_at', { ascending: false })
const MOCK_REVIEWS = [
  { id:1, name:"Hassan K",  initials:"HK", color:"#1D4ED8", rating:5, time:"2 days ago",   verified:true,  text:"Best electronics shop in Dar! Original products and super fast delivery. Will definitely buy again." },
  { id:2, name:"Amina Tz",  initials:"AT", color:"#6D28D9", rating:5, time:"1 week ago",   verified:true,  text:"iPhone arrived in perfect condition. Exactly as described. Trust score of 98 is well deserved!" },
  { id:3, name:"Peter M",   initials:"PM", color:"#0A7B4B", rating:4, time:"2 weeks ago",  verified:true,  text:"Great service, delivery was one day late but product is perfect. Customer support was very helpful." },
  { id:4, name:"Zawadi S",  initials:"ZS", color:"#C9960A", rating:5, time:"3 weeks ago",  verified:true,  text:"Bought MacBook for my business. Arrived with full warranty docs. This is a trustworthy seller!" },
];

// 🔌 BACKEND SWAP POINT #4 — LIVE STREAMS
// Replace with: supabase.from('live_streams').select('*')
//   .eq('seller_id', sellerId).eq('status','live')
const MOCK_LIVES = [
  { id:1, title:"iPhone 15 Flash Sale!", viewers:"1.2K", icon:"laptop"     },
  { id:2, title:"New Arrivals Unboxing", viewers:"890",  icon:"shopping"   },
];

// ============================================================
// 🧱 MAIN COMPONENT — SellerProfile
// ============================================================
export default function App({
  // 🔌 BACKEND — replace with real seller data
  seller         = MOCK_SELLER,
  products       = MOCK_PRODUCTS,
  reviews        = MOCK_REVIEWS,
  lives          = MOCK_LIVES,

  // 🧭 NAVIGATE
  onBack         = () => {},   // → previous screen
  onProductPress = () => {},   // → Brick 3 ProductDetails
  onChatSeller   = () => {},   // → Brick 10 Marketplace Chat
  onCallSeller   = () => {},   // → phone dialer
  onVideoCall    = () => {},   // → video call
  onWatchLive    = () => {},   // → Brick 2 Live stream
  onSeeAllProducts = () => {}, // → filtered product list
  onSeeAllReviews  = () => {}, // → full reviews screen
}) {
  const [following,  setFollowing]  = useState(seller.following);
  const [activeTab,  setActiveTab]  = useState("products");
  const [wishlist,   setWishlist]   = useState({});
  const [toast,      setToast]      = useState(null);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  // 🔌 BACKEND — persist follow
  // const handleFollow = async () => {
  //   setFollowing(f => !f)
  //   await supabase.from('follows')
  //     .upsert({ seller_id: seller.id, user_id: currentUser.id })
  // }
  const handleFollow = () => {
    setFollowing(f => !f);
    showToast(following ? `Unfollowed ${seller.name}` : `Following ${seller.name}!`, T.gold);
  };

  const TABS = [
    { id:"products", label:`Products (${products.length})`, icon:"shopping" },
    { id:"reviews",  label:`Reviews (${seller.reviewCount.toLocaleString()})`, icon:"star" },
    { id:"live",     label:`Live (${lives.length})`,       icon:"live"     },
  ];

  return (
    <div style={{
      background: T.bg, minHeight: "100vh", color: T.textMain,
      fontFamily: "'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth: 430, margin: "0 auto", paddingBottom: 110,
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        button { font-family: inherit; cursor: pointer; border: none; }
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

      {/* ── TOP BAR ── */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, zIndex:100,
        padding:"14px 20px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <button onClick={onBack} style={{
          width:40, height:40, borderRadius:12,
          background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)",
          border:`1px solid rgba(255,255,255,0.5)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:T.shadow,
        }}>
          <Icon name="arrowLeft" size={18} color={T.navy}/>
        </button>
        <button style={{
          width:40, height:40, borderRadius:12,
          background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)",
          border:`1px solid rgba(255,255,255,0.5)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:T.shadow,
        }}>
          <Icon name="share" size={17} color={T.navy}/>
        </button>
      </div>

      {/* ── COVER BANNER ── */}
      <div style={{
        height:220, position:"relative", overflow:"hidden",
        background:`linear-gradient(135deg,#0A0F2A 0%,#1A1060 50%,#0A1A3A 100%)`,
      }}>
        {/* Grid pattern */}
        <div style={{ position:"absolute", inset:0, opacity:0.07,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"22px 22px" }}/>
        {/* Glow */}
        <div style={{ position:"absolute", top:"30%", left:"30%",
          width:200, height:200, borderRadius:"50%",
          background:`radial-gradient(circle,${seller.color}44,transparent 70%)` }}/>
        {/* Bottom fade */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:100,
          background:`linear-gradient(to bottom,transparent,${T.bg})` }}/>
        {/* Live badge if streaming */}
        {lives.length > 0 && (
          <div style={{
            position:"absolute", bottom:20, right:20,
            display:"flex", alignItems:"center", gap:6,
            background:T.red, borderRadius:10, padding:"5px 12px",
            animation:"pulse 2s infinite",
          }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#fff" }}/>
            <span style={{ fontSize:11, fontWeight:900, color:"#fff" }}>LIVE NOW</span>
            <Icon name="eye" size={11} color="rgba(255,255,255,0.85)"/>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.85)" }}>
              {lives[0].viewers}
            </span>
          </div>
        )}
      </div>

      {/* ── PROFILE CARD ── */}
      <div style={{ padding:"0 20px", marginTop:-60 }}>
        <div style={{
          background:T.white, borderRadius:24, padding:"20px",
          boxShadow:T.shadowMd, border:`1px solid ${T.border}`,
          position:"relative",
        }}>
          {/* Avatar + Trust Score */}
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"flex-start", marginBottom:16 }}>
            <div style={{ position:"relative" }}>
              <div style={{
                width:80, height:80, borderRadius:22,
                background:`linear-gradient(135deg,${seller.color}22,${seller.color}55)`,
                border:`3px solid ${T.white}`,
                boxShadow:`0 0 0 2px ${seller.color}44, ${T.shadowMd}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:28, fontWeight:900, color:seller.color,
              }}>{seller.initials}</div>
              {seller.verified && (
                <div style={{
                  position:"absolute", bottom:-4, right:-4,
                  width:24, height:24, borderRadius:"50%",
                  background:T.blue, border:`2.5px solid ${T.white}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:T.shadow,
                }}>
                  <Icon name="shield" size={12} color="#fff"/>
                </div>
              )}
            </div>
            <TrustBadge score={seller.trustScore} size="lg"/>
          </div>

          {/* Name + badges */}
          <div style={{ marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
              <span style={{ fontSize:20, fontWeight:900, color:T.textMain, letterSpacing:-0.5 }}>
                {seller.name}
              </span>
              {seller.verified && (
                <div style={{ display:"flex", alignItems:"center", gap:4,
                  background:T.blueBg, border:`1px solid ${T.blue}22`,
                  borderRadius:8, padding:"2px 8px" }}>
                  <Icon name="shield" size={10} color={T.blue}/>
                  <span style={{ fontSize:10, fontWeight:800, color:T.blue }}>Verified</span>
                </div>
              )}
            </div>
            <div style={{ fontSize:12, color:T.textMute, lineHeight:1.5, marginBottom:10 }}>
              {seller.tagline}
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {seller.badges.map(b => (
                <div key={b.label} style={{
                  display:"flex", alignItems:"center", gap:4,
                  background:b.color+"14", border:`1px solid ${b.color}28`,
                  borderRadius:8, padding:"3px 9px",
                }}>
                  <Icon name={b.icon} size={10} color={b.color}/>
                  <span style={{ fontSize:10, fontWeight:800, color:b.color }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:"flex", gap:8, marginBottom:16 }}>
            <button onClick={handleFollow} style={{
              flex:1, height:44, borderRadius:14,
              background: following
                ? T.navyLight
                : `linear-gradient(135deg,${T.navy},${T.navyMid})`,
              border: following ? `1.5px solid ${T.border}` : "none",
              color: following ? T.textMid : "#fff",
              fontSize:13, fontWeight:800,
              display:"flex", alignItems:"center", justifyContent:"center", gap:7,
              transition:"all 0.2s",
              boxShadow: following ? "none" : `0 6px 20px ${T.navy}44`,
            }}>
              <Icon name={following ? "check" : "userPlus"} size={15}
                color={following ? T.textMid : "#fff"}/>
              {following ? "Following" : "Follow"}
            </button>
            {/* 🧭 NAVIGATE → Brick 10 Marketplace Chat */}
            <button onClick={onChatSeller} style={{
              width:44, height:44, borderRadius:14,
              background:T.navyLight, border:`1px solid ${T.border}`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <Icon name="message" size={18} color={T.navy}/>
            </button>
            {/* 🧭 NAVIGATE → phone dialer */}
            <button onClick={onCallSeller} style={{
              width:44, height:44, borderRadius:14,
              background:T.greenBg, border:`1px solid ${T.green}22`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <Icon name="phone" size={18} color={T.green}/>
            </button>
            {/* 🧭 NAVIGATE → video call */}
            <button onClick={onVideoCall} style={{
              width:44, height:44, borderRadius:14,
              background:T.purpleBg, border:`1px solid ${T.purple}22`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <Icon name="video" size={18} color={T.purple}/>
            </button>
          </div>

          {/* Stats grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)",
            gap:8, padding:"14px 0 0", borderTop:`1px solid ${T.border}` }}>
            {[
              { label:"Followers",  value: seller.followers >= 1000 ? (seller.followers/1000).toFixed(0)+"K" : seller.followers, icon:"users",   color:T.blue   },
              { label:"Products",   value: seller.products >= 1000 ? (seller.products/1000).toFixed(1)+"K" : seller.products,  icon:"shopping", color:T.purple },
              { label:"Orders",     value: seller.orders >= 1000 ? (seller.orders/1000).toFixed(0)+"K" : seller.orders,      icon:"package",  color:T.navy   },
              { label:"Delivery",   value: seller.deliverySuccess+"%", icon:"truck",    color:T.green  },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign:"center" }}>
                <div style={{ width:32, height:32, borderRadius:9,
                  background:stat.color+"14",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 6px" }}>
                  <Icon name={stat.icon} size={15} color={stat.color}/>
                </div>
                <div style={{ fontSize:15, fontWeight:900, color:T.navy,
                  fontFamily:"monospace", marginBottom:2 }}>{stat.value}</div>
                <div style={{ fontSize:9, color:T.textMute, fontWeight:700,
                  textTransform:"uppercase", letterSpacing:0.5 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── TRUST & PERFORMANCE ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Icon name="shield" size={16} color={T.gold}/>
              <span style={{ fontSize:15, fontWeight:900, color:T.textMain }}>
                Trust & Performance
              </span>
            </div>
            <div style={{ fontSize:11, color:T.textMute, fontWeight:600 }}>See all</div>
          </div>

          {/* 4 key metrics */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
            {[
              { label:"Rating",          value:seller.rating,           sub:`(${(seller.reviewCount/1000).toFixed(1)}K)`, color:T.gold   },
              { label:"Delivery",        value:seller.deliverySuccess+"%", sub:"Success",                                  color:T.green  },
              { label:"Response",        value:seller.responseTime,     sub:"Avg time",                                   color:T.blue   },
              { label:"Trust Score",     value:seller.trustScore,       sub:"/ 100",                                      color:T.green  },
            ].map(m => (
              <div key={m.label} style={{ background:T.bg, borderRadius:16,
                padding:"12px 8px", textAlign:"center", border:`1px solid ${T.border}` }}>
                <div style={{ fontSize:15, fontWeight:900, color:m.color,
                  fontFamily:"monospace", lineHeight:1.1, marginBottom:3 }}>{m.value}</div>
                <div style={{ fontSize:9, color:T.textMute, fontWeight:700,
                  lineHeight:1.3 }}>{m.label}</div>
                <div style={{ fontSize:9, color:T.textMute }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Trust breakdown bars */}
          {seller.trustBreakdown.map(item => (
            <div key={item.label} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", marginBottom:5 }}>
                <span style={{ fontSize:12, fontWeight:600, color:T.textMid }}>{item.label}</span>
                <span style={{ fontSize:12, fontWeight:900, color:item.color }}>{item.value}%</span>
              </div>
              <div style={{ height:7, background:T.border, borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${item.value}%`,
                  background:`linear-gradient(90deg,${item.color},${item.color}99)`,
                  borderRadius:99, transition:"width 0.8s ease" }}/>
              </div>
            </div>
          ))}

          {/* Seller info pills */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:14,
            paddingTop:14, borderTop:`1px solid ${T.border}` }}>
            {[
              { icon:"mapPin",   text:seller.location    },
              { icon:"calendar", text:`Since ${seller.memberSince}` },
              { icon:"clock",    text:`Replies in ${seller.responseTime}` },
            ].map(item => (
              <div key={item.text} style={{
                display:"flex", alignItems:"center", gap:5,
                background:T.navyLight, border:`1px solid ${T.border}`,
                borderRadius:10, padding:"5px 10px",
              }}>
                <Icon name={item.icon} size={12} color={T.textMid}/>
                <span style={{ fontSize:11, fontWeight:600, color:T.textMid }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── VERIFICATION CARD ── */}
        <div style={{
          background:`linear-gradient(135deg,${T.blueBg},${T.navyLight})`,
          border:`1px solid ${T.blue}22`, borderRadius:22,
          padding:"16px 20px", marginBottom:14,
          display:"flex", gap:14, alignItems:"center",
        }}>
          <div style={{ width:52, height:52, borderRadius:16,
            background:T.blue+"18", flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center",
            border:`1px solid ${T.blue}22` }}>
            <Icon name="shield" size={26} color={T.blue}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:900, color:T.navy, marginBottom:6 }}>
              {seller.verifiedType}
            </div>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              {["BRELA Verified","TIN Verified","Escrow Protected"].map(v => (
                <div key={v} style={{
                  display:"flex", alignItems:"center", gap:4,
                  background:"rgba(29,78,216,0.08)", border:`1px solid ${T.blue}22`,
                  borderRadius:7, padding:"2px 8px",
                }}>
                  <Icon name="check" size={9} color={T.blue}/>
                  <span style={{ fontSize:10, fontWeight:700, color:T.blue }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ display:"flex", background:T.card, borderRadius:18,
          border:`1px solid ${T.border}`, padding:4, marginBottom:16,
          boxShadow:T.shadow }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              flex:1, padding:"10px 4px", borderRadius:14, border:"none",
              fontSize:11, fontWeight: activeTab===t.id ? 800 : 500,
              background: activeTab===t.id ? T.navy : "transparent",
              color: activeTab===t.id ? "#fff" : T.textMute,
              transition:"all 0.2s",
              boxShadow: activeTab===t.id ? `0 4px 12px ${T.navy}33` : "none",
              display:"flex", alignItems:"center", justifyContent:"center", gap:5,
            }}>
              <Icon name={t.icon} size={12} color={activeTab===t.id ? "#fff" : T.textMute}/>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ PRODUCTS TAB ══ */}
        {activeTab === "products" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {products.map(p => {
                const discount = p.original
                  ? Math.round(((p.original - p.price) / p.original) * 100) : null;
                return (
                  <div key={p.id} onClick={() => onProductPress(p.id)}
                    style={{
                      background:T.card, border:`1px solid ${T.border}`,
                      borderRadius:20, overflow:"hidden", boxShadow:T.shadow,
                      cursor:"pointer", transition:"all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=T.shadowMd; }}
                    onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=T.shadow; }}>
                    {/* Image */}
                    <div style={{ height:110, background:T.navyLight,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      position:"relative" }}>
                      <Icon name={p.icon} size={44} color={T.navy+"33"}/>
                      {discount && (
                        <div style={{ position:"absolute", top:7, left:7,
                          background:T.red, color:"#fff", borderRadius:7,
                          padding:"2px 7px", fontSize:10, fontWeight:900 }}>
                          -{discount}%
                        </div>
                      )}
                      {p.tag && (
                        <div style={{ position:"absolute", top:7, right:7 }}>
                          <div style={{ background:T.gold, color:"#fff",
                            borderRadius:7, padding:"2px 7px",
                            fontSize:9, fontWeight:800 }}>{p.tag}</div>
                        </div>
                      )}
                      <button onClick={e => { e.stopPropagation(); setWishlist(w => ({...w,[p.id]:!w[p.id]})); }}
                        style={{ position:"absolute", bottom:7, right:7,
                          width:28, height:28, borderRadius:"50%",
                          background:"rgba(255,255,255,0.9)", border:"none",
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name={wishlist[p.id] ? "heartFill" : "heart"}
                          size={13} color={wishlist[p.id] ? T.red : T.textMute}/>
                      </button>
                    </div>
                    {/* Info */}
                    <div style={{ padding:"10px 12px 12px" }}>
                      <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                        marginBottom:5, lineHeight:1.3,
                        overflow:"hidden", display:"-webkit-box",
                        WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                        {p.name}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:3, marginBottom:6 }}>
                        <Icon name="star" size={11} color={T.gold}/>
                        <span style={{ fontSize:11, fontWeight:700, color:T.textMid }}>{p.rating}</span>
                        <span style={{ fontSize:10, color:T.textMute }}>({p.reviews})</span>
                      </div>
                      <div style={{ fontSize:14, fontWeight:900, color:T.navy,
                        fontFamily:"monospace", letterSpacing:-0.3 }}>
                        {fmt(p.price)}
                      </div>
                      {p.original && (
                        <div style={{ fontSize:10, color:T.textMute,
                          textDecoration:"line-through", fontFamily:"monospace" }}>
                          {fmt(p.original)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign:"center", marginTop:16 }}>
              <button onClick={onSeeAllProducts} style={{
                padding:"12px 28px", borderRadius:14,
                background:T.navyLight, border:`1px solid ${T.border}`,
                fontSize:13, fontWeight:800, color:T.navy, cursor:"pointer",
                display:"inline-flex", alignItems:"center", gap:7,
              }}>
                See All Products
                <Icon name="chevronRight" size={14} color={T.navy}/>
              </button>
            </div>
          </div>
        )}

        {/* ══ REVIEWS TAB ══ */}
        {activeTab === "reviews" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {/* Summary */}
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", gap:20, alignItems:"center" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:52, fontWeight:900, color:T.navy,
                    lineHeight:1, fontFamily:"monospace" }}>{seller.rating}</div>
                  <Stars rating={seller.rating} size={16}/>
                  <div style={{ fontSize:11, color:T.textMute, marginTop:6 }}>
                    {seller.reviewCount.toLocaleString()} reviews
                  </div>
                </div>
                <div style={{ flex:1 }}>
                  {[{s:5,pct:82},{s:4,pct:11},{s:3,pct:4},{s:2,pct:2},{s:1,pct:1}].map(r => (
                    <div key={r.s} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
                      <span style={{ fontSize:11, color:T.textMute, width:8, fontWeight:700 }}>{r.s}</span>
                      <Icon name="star" size={11} color={T.gold}/>
                      <div style={{ flex:1, background:T.border, borderRadius:99, height:6, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${r.pct}%`,
                          background:`linear-gradient(90deg,${T.gold},${T.goldMid})`,
                          borderRadius:99 }}/>
                      </div>
                      <span style={{ fontSize:10, color:T.textMute, width:26, fontWeight:700 }}>{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Review cards */}
            {reviews.map(r => (
              <div key={r.id} style={{ background:T.card, borderRadius:22, padding:"18px 20px",
                boxShadow:T.shadow, marginBottom:12, border:`1px solid ${T.border}` }}>
                <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
                  <div style={{ width:44, height:44, borderRadius:13,
                    background:`linear-gradient(135deg,${r.color}22,${r.color}44)`,
                    border:`2px solid ${r.color}33`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:14, fontWeight:900, color:r.color }}>
                    {r.initials}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:13, fontWeight:800, color:T.textMain }}>{r.name}</span>
                        {r.verified && (
                          <div style={{ display:"flex", alignItems:"center", gap:3,
                            background:T.blueBg, borderRadius:6, padding:"1px 6px" }}>
                            <Icon name="shield" size={9} color={T.blue}/>
                            <span style={{ fontSize:9, fontWeight:800, color:T.blue }}>Verified</span>
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize:11, color:T.textMute }}>{r.time}</span>
                    </div>
                    <Stars rating={r.rating} size={11}/>
                  </div>
                </div>
                <div style={{ fontSize:13, color:T.textMid, lineHeight:1.75,
                  background:T.bg, borderRadius:14, padding:"11px 14px",
                  borderLeft:`3px solid ${r.color}33` }}>
                  {r.text}
                </div>
              </div>
            ))}
            <div style={{ textAlign:"center", marginTop:4 }}>
              <button onClick={onSeeAllReviews} style={{
                padding:"12px 28px", borderRadius:14,
                background:T.navyLight, border:`1px solid ${T.border}`,
                fontSize:13, fontWeight:800, color:T.navy, cursor:"pointer",
                display:"inline-flex", alignItems:"center", gap:7,
              }}>
                See All Reviews
                <Icon name="chevronRight" size={14} color={T.navy}/>
              </button>
            </div>
          </div>
        )}

        {/* ══ LIVE TAB ══ */}
        {activeTab === "live" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {lives.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 0" }}>
                <div style={{ width:72, height:72, borderRadius:"50%", background:T.navyLight,
                  border:`1px solid ${T.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 16px" }}>
                  <Icon name="video" size={32} color={T.border}/>
                </div>
                <div style={{ fontSize:15, fontWeight:800, color:T.textMain, marginBottom:8 }}>
                  No Live Streams
                </div>
                <div style={{ fontSize:13, color:T.textMute }}>
                  Follow this seller to get notified when they go live
                </div>
                {!following && (
                  <button onClick={handleFollow} style={{
                    marginTop:20, padding:"12px 28px", borderRadius:14,
                    background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
                    border:"none", color:"#fff", fontSize:13, fontWeight:800,
                    cursor:"pointer", display:"inline-flex", alignItems:"center", gap:7,
                    boxShadow:`0 6px 20px ${T.navy}44`,
                  }}>
                    <Icon name="userPlus" size={15} color="#fff"/>
                    Follow {seller.name}
                  </button>
                )}
              </div>
            ) : lives.map(live => (
              <div key={live.id} onClick={() => onWatchLive(live.id)}
                style={{ background:T.card, borderRadius:22, overflow:"hidden",
                  boxShadow:T.shadowMd, marginBottom:14, border:`1px solid ${T.border}`,
                  cursor:"pointer" }}>
                <div style={{ height:180, background:`linear-gradient(135deg,#0A0F2A,#1A1060)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  position:"relative" }}>
                  <Icon name={live.icon} size={60} color="rgba(255,255,255,0.1)"/>
                  <div style={{ position:"absolute", top:12, left:12,
                    display:"flex", alignItems:"center", gap:6,
                    background:T.red, borderRadius:8, padding:"4px 10px",
                    animation:"pulse 2s infinite" }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:"#fff" }}/>
                    <span style={{ fontSize:11, fontWeight:900, color:"#fff" }}>LIVE</span>
                    <Icon name="eye" size={11} color="rgba(255,255,255,0.85)"/>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.85)" }}>{live.viewers}</span>
                  </div>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0,
                    padding:"12px 16px",
                    background:"linear-gradient(to top,rgba(0,0,0,0.8),transparent)" }}>
                    <div style={{ fontSize:14, fontWeight:800, color:"#fff" }}>{live.title}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:3 }}>
                      {seller.name} · {live.viewers} watching
                    </div>
                  </div>
                </div>
                <div style={{ padding:"14px 16px",
                  display:"flex", gap:10, alignItems:"center" }}>
                  <button style={{ flex:1, padding:"11px 0", borderRadius:13,
                    background:`linear-gradient(135deg,${T.red},#A02020)`,
                    border:"none", color:"#fff", fontSize:13, fontWeight:800,
                    cursor:"pointer", display:"flex", alignItems:"center",
                    justifyContent:"center", gap:7 }}>
                    <Icon name="eye" size={15} color="#fff"/>
                    Watch Live
                  </button>
                  <button style={{ flex:1, padding:"11px 0", borderRadius:13,
                    background:`linear-gradient(135deg,${T.gold},#A07008)`,
                    border:"none", color:"#fff", fontSize:13, fontWeight:800,
                    cursor:"pointer", display:"flex", alignItems:"center",
                    justifyContent:"center", gap:7 }}>
                    <Icon name="zap" size={15} color="#fff"/>
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ABOUT ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:14, fontWeight:900, color:T.textMain, marginBottom:10 }}>
            About Store
          </div>
          <div style={{ fontSize:13, color:T.textMid, lineHeight:1.8 }}>
            {seller.about}
          </div>
        </div>

      </div>

      {/* ── STICKY BOTTOM CTA ── */}
      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:430,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)",
        borderTop:`1px solid ${T.border}`,
        padding:"14px 20px 28px",
        boxShadow:"0 -4px 24px rgba(11,31,75,0.1)",
        zIndex:150,
      }}>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onChatSeller} style={{
            width:50, height:50, borderRadius:16,
            background:T.navyLight, border:`1px solid ${T.border}`,
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          }}>
            <Icon name="message" size={20} color={T.navy}/>
          </button>
          <button onClick={handleFollow} style={{
            width:50, height:50, borderRadius:16, flexShrink:0,
            background: following ? T.navyLight : T.navyLight,
            border:`1px solid ${following ? T.gold : T.border}`,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <Icon name={following ? "check" : "userPlus"} size={18}
              color={following ? T.gold : T.textMid}/>
          </button>
          {/* 🧭 NAVIGATE → Brick 9 MarketplaceHome filtered by this seller */}
          <button onClick={onSeeAllProducts} style={{
            flex:1, height:50, borderRadius:16,
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            border:"none", color:"#fff", fontSize:14, fontWeight:900,
            cursor:"pointer", display:"flex", alignItems:"center",
            justifyContent:"center", gap:8,
            boxShadow:`0 6px 20px ${T.gold}44`,
          }}>
            <Icon name="shopping" size={17} color="#fff"/>
            {/* 💰 WALLET → products connect to PandaWallet on checkout */}
            Shop Now
          </button>
        </div>
      </div>

      <BottomNav active="discover"/>
    </div>
  );
}

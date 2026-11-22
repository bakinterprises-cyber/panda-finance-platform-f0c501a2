import { useState } from "react";

// ============================================================
// 🧱 BRICK 17 — MARKETPLACE HOME (Browse All)
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🤖  AI hooks marked with:            // 🤖 AI
// 📦  Assembly: export MarketplaceHome from this file
//     Props: { currentUser, onProductPress, onSellerPress,
//              onCategoryPress, onSearch }
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
  orange:    "#EA580C",
  shadow:    "0 2px 16px rgba(11,31,75,0.07)",
  shadowMd:  "0 8px 32px rgba(11,31,75,0.11)",
  shadowLg:  "0 20px 60px rgba(11,31,75,0.16)",
};

const fmt = n => "TSh " + Number(n).toLocaleString();

// ─── SVG Icons ─────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    search:       <><circle cx="11" cy="11" r="8" {...s}/><line x1="21" y1="21" x2="16.65" y2="16.65" {...s}/></>,
    bell:         <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...s}/><path d="M13.73 21a2 2 0 0 1-3.46 0" {...s}/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    heart:        <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...s}/></>,
    heartFill:    <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={color} stroke="none"/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    fire:         <><path d="M12 2c0 0-5 4-5 9a5 5 0 0 0 10 0c0-2-1-4-2-5 0 0 0 3-2 4 0 0-1-4-1-8z" fill={color} stroke={color} strokeWidth="0.5"/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    mapPin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    tag:          <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" {...s}/><line x1="7" y1="7" x2="7.01" y2="7" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    tool:         <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" {...s}/></>,
    leaf:         <><path d="M17 8C8 10 5.9 16.17 3.82 22.5L2 22l1-10a9 9 0 0 1 9-9 8.41 8.41 0 0 1 5.82 2.29l.18-1.29" {...s}/></>,
    briefcase:    <><rect x="2" y="7" width="20" height="14" rx="2" {...s}/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...s}/></>,
    cpu:          <><rect x="9" y="9" width="6" height="6" {...s}/><rect x="2" y="2" width="20" height="20" rx="2" {...s}/><line x1="9" y1="2" x2="9" y2="9" {...s}/><line x1="15" y1="2" x2="15" y2="9" {...s}/><line x1="9" y1="15" x2="9" y2="22" {...s}/><line x1="15" y1="15" x2="15" y2="22" {...s}/><line x1="2" y1="9" x2="9" y2="9" {...s}/><line x1="2" y1="15" x2="9" y2="15" {...s}/><line x1="15" y1="9" x2="22" y2="9" {...s}/><line x1="15" y1="15" x2="22" y2="15" {...s}/></>,
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
// 🔌 BACKEND SWAP POINT #1 — HERO BANNERS
// Replace with: supabase.from('banners')
//   .select('*').eq('active', true).order('sort_order').limit(3)
// ============================================================
const MOCK_BANNERS = [
  { id:1, title:"Flash Sale Friday!", subtitle:"Up to 50% off electronics — today only", color:T.red,    accent:"#FF6B6B", icon:"zap"    },
  { id:2, title:"New Arrivals Daily", subtitle:"Fresh products from 1,200+ verified sellers", color:T.navy,  accent:T.gold,    icon:"sparkle"},
  { id:3, title:"Free Delivery",      subtitle:"On all orders above TSh 50,000 in Dar", color:T.green, accent:"#4ADE80", icon:"truck"  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — ALL CATEGORIES
// Replace with: supabase.from('categories').select('*').order('sort_order')
// ============================================================
const ALL_CATEGORIES = [
  { id:"electronics",  label:"Electronics",     icon:"cpu",       color:T.blue,   bg:T.blueBg   },
  { id:"fashion",      label:"Fashion",          icon:"tag",       color:T.purple, bg:T.purpleBg },
  { id:"food",         label:"Food & Drink",     icon:"fire",      color:T.orange, bg:"#FFF7ED"  },
  { id:"hotels",       label:"Hotels",           icon:"home",      color:T.teal,   bg:"#F0FDFA"  },
  { id:"vehicles",     label:"Vehicles",         icon:"truck",     color:T.amber,  bg:T.amberBg  },
  { id:"agriculture",  label:"Agriculture",      icon:"leaf",      color:T.green,  bg:T.greenBg  },
  { id:"construction", label:"Construction",     icon:"tool",      color:T.navy,   bg:T.navyLight},
  { id:"b2b",          label:"B2B Wholesale",    icon:"briefcase", color:T.gold,   bg:T.goldLight},
];

// ============================================================
// 🔌 BACKEND SWAP POINT #3 — FLASH DEALS
// Replace with: supabase.from('flash_deals')
//   .select('*,product(*),seller(*))')
//   .gt('ends_at', new Date().toISOString())
//   .order('ends_at').limit(6)
// ============================================================
const MOCK_FLASH_DEALS = [
  { id:1, name:"iPhone 15 Pro Max", seller:"Tech Master",  price:1450000, original:1850000, discount:22, endsIn:"02:14:35", icon:"cpu"  },
  { id:2, name:"AirPods Pro 2Gen",  seller:"Tech Master",  price:280000,  original:350000,  discount:20, endsIn:"02:14:35", icon:"cpu"  },
  { id:3, name:"Sofa Set 5-Seater", seller:"Home Essentials",price:680000, original:850000, discount:20, endsIn:"05:22:10", icon:"home" },
  { id:4, name:"Maize Seeds 2kg",   seller:"TanzAgro",     price:6500,    original:8500,    discount:24, endsIn:"08:00:00", icon:"leaf" },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #4 — NEW ARRIVALS
// Replace with: supabase.from('products')
//   .select('*,seller(*)')
//   .order('created_at', { ascending: false }).limit(8)
// ============================================================
const MOCK_NEW_ARRIVALS = [
  { id:1, name:"Samsung Galaxy S24 Ultra", seller:"Tech Master", price:1100000, rating:4.8, icon:"cpu",       color:T.blue   },
  { id:2, name:"Maxi Dress Collection",    seller:"Fashion Hub", price:45000,   rating:4.6, icon:"tag",       color:T.purple },
  { id:3, name:"Organic Honey 500ml",      seller:"TanzAgro",    price:18000,   rating:4.9, icon:"leaf",      color:T.green  },
  { id:4, name:"Office Chair Ergonomic",   seller:"Home Ess.",   price:185000,  rating:4.5, icon:"briefcase", color:T.amber  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #5 — FEATURED STORES
// Replace with: supabase.from('sellers')
//   .select('*').eq('featured', true)
//   .order('trust_score', { ascending: false }).limit(6)
// ============================================================
const MOCK_FEATURED_STORES = [
  { id:1, name:"Tech Master Store",  initials:"TM", color:"#1D4ED8", trustScore:98, products:142, location:"Dar es Salaam" },
  { id:2, name:"Fashion Hub",        initials:"FH", color:"#6D28D9", trustScore:96, products:289, location:"Dar es Salaam" },
  { id:3, name:"TanzAgro Supplies",  initials:"TA", color:"#0A7B4B", trustScore:97, products:67,  location:"Morogoro"      },
  { id:4, name:"Car Empire",         initials:"CE", color:"#C0392B", trustScore:95, products:38,  location:"Arusha"        },
];

// ============================================================
// 🤖 AI SWAP POINT — AI RECOMMENDATIONS
// Replace with: supabase.functions.invoke('ai-recommendations', {
//   body: { user_id: currentUser.id, limit: 4 }
// })
// ============================================================
const MOCK_AI_PICKS = [
  { id:1, name:"MacBook Air M2",         seller:"Tech Master", price:2800000, match:"98% match", icon:"cpu",   color:T.blue   },
  { id:2, name:"iPad Pro 12.9\" M2",     seller:"Tech Master", price:1900000, match:"95% match", icon:"cpu",   color:T.purple },
  { id:3, name:"Designer Handbag Set",   seller:"Fashion Hub", price:180000,  match:"91% match", icon:"tag",   color:T.gold   },
  { id:4, name:"Premium Sofa 5-Seater",  seller:"Home Ess.",   price:850000,  match:"88% match", icon:"home",  color:T.amber  },
];

// ============================================================
// 🧱 MAIN COMPONENT — MarketplaceHome
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user from supabase.auth.getUser()
  currentUser     = { id:"user-001", name:"BAK", initials:"B" },
  banners         = MOCK_BANNERS,
  categories      = ALL_CATEGORIES,
  flashDeals      = MOCK_FLASH_DEALS,
  newArrivals     = MOCK_NEW_ARRIVALS,
  featuredStores  = MOCK_FEATURED_STORES,
  aiPicks         = MOCK_AI_PICKS,

  // 🧭 NAVIGATE
  onProductPress  = () => {},   // → Brick 3 Product Details
  onSellerPress   = () => {},   // → Brick 4 Seller Profile
  onCategoryPress = () => {},   // → Filtered product list
  onSearch        = () => {},   // → Search screen
  onNotifications = () => {},   // → Notifications screen
}) {
  const [activeBanner,  setActiveBanner]  = useState(0);
  const [wishlist,      setWishlist]      = useState({});
  const [timeLeft,      setTimeLeft]      = useState("02:14:35");

  const toggleWishlist = (id) => {
    setWishlist(w => ({ ...w, [id]: !w[id] }));
  };

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn   { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes bannerIn  { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input  { font-family:inherit; }
        input::placeholder { color:rgba(255,255,255,0.5); }
      `}</style>

      {/* ── STICKY HEADER ── */}
      <div style={{
        background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:"52px 20px 20px", position:"sticky", top:0, zIndex:100,
      }}>
        {/* Top row */}
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:14 }}>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              fontWeight:600, marginBottom:2 }}>Good morning 👋</div>
            <div style={{ fontSize:18, fontWeight:900, color:"#fff",
              letterSpacing:-0.3 }}>Panda Marketplace</div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {/* 💰 WALLET — mini balance widget */}
            <div style={{ background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.2)",
              borderRadius:12, padding:"7px 12px",
              display:"flex", alignItems:"center", gap:6 }}>
              <Icon name="wallet" size={13} color={T.goldMid}/>
              <span style={{ fontSize:11, fontWeight:900,
                color:T.goldMid, fontFamily:"monospace" }}>TSh 842K</span>
            </div>
            <button onClick={onNotifications} style={{
              width:40, height:40, borderRadius:12,
              background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center",
              position:"relative" }}>
              <Icon name="bell" size={18} color="#fff"/>
              <div style={{ position:"absolute", top:8, right:8,
                width:7, height:7, borderRadius:"50%", background:T.red,
                border:"1.5px solid rgba(11,31,75,0.8)",
                animation:"pulse 1.5s infinite" }}/>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div onClick={onSearch} style={{
          display:"flex", alignItems:"center", gap:10,
          background:"rgba(255,255,255,0.12)",
          border:"1px solid rgba(255,255,255,0.2)",
          borderRadius:16, padding:"12px 16px", cursor:"pointer",
        }}>
          <Icon name="search" size={16} color="rgba(255,255,255,0.7)"/>
          <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)",
            fontWeight:500, flex:1 }}>Search products, sellers, categories...</span>
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:8,
            padding:"4px 10px" }}>
            <span style={{ fontSize:10, fontWeight:800,
              color:"rgba(255,255,255,0.8)" }}>AI Search</span>
          </div>
        </div>
      </div>

      <div style={{ padding:"16px 16px 0" }}>

        {/* ── HERO BANNERS ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ borderRadius:22, overflow:"hidden",
            height:140, position:"relative",
            background:`linear-gradient(135deg,${banners[activeBanner].color},${banners[activeBanner].color}CC)`,
            cursor:"pointer", animation:"bannerIn 0.3s ease" }}>
            <div style={{ position:"absolute", inset:0, opacity:0.07,
              backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
              backgroundSize:"16px 16px" }}/>
            <div style={{ position:"absolute", bottom:-20, right:-20,
              width:120, height:120, borderRadius:"50%",
              background:"rgba(255,255,255,0.08)" }}/>
            <div style={{ padding:"22px 20px", position:"relative" }}>
              <div style={{ width:40, height:40, borderRadius:12,
                background:"rgba(255,255,255,0.15)",
                display:"flex", alignItems:"center", justifyContent:"center",
                marginBottom:10 }}>
                <Icon name={banners[activeBanner].icon} size={20}
                  color={banners[activeBanner].accent}/>
              </div>
              <div style={{ fontSize:18, fontWeight:900, color:"#fff",
                marginBottom:4, letterSpacing:-0.3 }}>
                {banners[activeBanner].title}
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)" }}>
                {banners[activeBanner].subtitle}
              </div>
            </div>
          </div>
          {/* Banner dots */}
          <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:10 }}>
            {banners.map((_, i) => (
              <div key={i} onClick={() => setActiveBanner(i)} style={{
                width:i===activeBanner ? 18 : 6, height:6,
                borderRadius:99, cursor:"pointer", transition:"all 0.3s",
                background:i===activeBanner ? T.navy : T.border,
              }}/>
            ))}
          </div>
        </div>

        {/* ── ALL CATEGORIES GRID ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:16, fontWeight:900, color:T.textMain,
              letterSpacing:-0.3 }}>Categories</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
            {categories.map(cat => (
              <div key={cat.id} onClick={() => onCategoryPress(cat.id)}
                style={{ background:T.card, borderRadius:18,
                  padding:"14px 8px", textAlign:"center",
                  border:`1px solid ${T.border}`, boxShadow:T.shadow,
                  cursor:"pointer", transition:"all 0.18s" }}>
                <div style={{ width:38, height:38, borderRadius:12,
                  background:cat.bg,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 8px" }}>
                  <Icon name={cat.icon} size={18} color={cat.color}/>
                </div>
                <div style={{ fontSize:9, fontWeight:800, color:T.textMid,
                  textTransform:"uppercase", letterSpacing:0.3,
                  lineHeight:1.3 }}>{cat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FLASH DEALS ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Icon name="zap" size={18} color={T.red}/>
              <span style={{ fontSize:16, fontWeight:900, color:T.textMain,
                letterSpacing:-0.3 }}>Flash Deals</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6,
              background:T.redBg, border:`1px solid ${T.red}22`,
              borderRadius:10, padding:"5px 12px" }}>
              <Icon name="clock" size={12} color={T.red}/>
              <span style={{ fontSize:12, fontWeight:900, color:T.red,
                fontFamily:"monospace" }}>{timeLeft}</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:4 }}>
            {flashDeals.map(deal => (
              <div key={deal.id} onClick={() => onProductPress(deal)}
                style={{ background:T.card, borderRadius:20,
                  padding:"14px", flexShrink:0, width:150,
                  border:`1px solid ${T.border}`, boxShadow:T.shadow,
                  cursor:"pointer", position:"relative" }}>
                {/* Discount badge */}
                <div style={{ position:"absolute", top:10, left:10,
                  background:T.red, borderRadius:8, padding:"2px 8px" }}>
                  <span style={{ fontSize:10, fontWeight:900,
                    color:"#fff" }}>-{deal.discount}%</span>
                </div>
                {/* Wishlist */}
                <button onClick={e => { e.stopPropagation(); toggleWishlist(deal.id); }}
                  style={{ position:"absolute", top:8, right:8,
                    width:28, height:28, borderRadius:"50%",
                    background:T.navyLight, border:"none",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={wishlist[deal.id]?"heartFill":"heart"} size={13}
                    color={wishlist[deal.id]?T.red:T.textMute}/>
                </button>
                <div style={{ height:80, background:T.navyLight, borderRadius:14,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  marginBottom:10, marginTop:4 }}>
                  <Icon name={deal.icon} size={32} color={T.navy+"44"}/>
                </div>
                <div style={{ fontSize:11, fontWeight:800, color:T.textMain,
                  marginBottom:3, overflow:"hidden",
                  textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {deal.name}
                </div>
                <div style={{ fontSize:13, fontWeight:900, color:T.red,
                  fontFamily:"monospace", marginBottom:2 }}>
                  {fmt(deal.price)}
                </div>
                <div style={{ fontSize:10, color:T.textMute,
                  textDecoration:"line-through", fontFamily:"monospace" }}>
                  {fmt(deal.original)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── AI PICKS FOR YOU ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Icon name="sparkle" size={16} color={T.purple}/>
              <span style={{ fontSize:16, fontWeight:900, color:T.textMain,
                letterSpacing:-0.3 }}>Picked for You</span>
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:T.purple }}>
              AI Curated
            </span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {aiPicks.map(item => (
              <div key={item.id} onClick={() => onProductPress(item)}
                style={{ background:T.card, borderRadius:20, padding:"14px",
                  border:`1px solid ${T.border}`, boxShadow:T.shadow,
                  cursor:"pointer", position:"relative" }}>
                {/* AI Match badge */}
                <div style={{ position:"absolute", top:10, right:10,
                  background:T.purpleBg, borderRadius:8, padding:"2px 7px",
                  border:`1px solid ${T.purple}22` }}>
                  <span style={{ fontSize:9, fontWeight:800,
                    color:T.purple }}>{item.match}</span>
                </div>
                <div style={{ height:80, background:item.color+"14",
                  borderRadius:14, marginBottom:10,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={item.icon} size={32} color={item.color+"66"}/>
                </div>
                <div style={{ fontSize:11, fontWeight:800, color:T.textMain,
                  marginBottom:3, lineHeight:1.3 }}>{item.name}</div>
                <div style={{ fontSize:10, color:T.textMute, marginBottom:5 }}>
                  {item.seller}
                </div>
                <div style={{ fontSize:13, fontWeight:900, color:T.navy,
                  fontFamily:"monospace" }}>{fmt(item.price)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── NEW ARRIVALS ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Icon name="fire" size={16} color={T.orange}/>
              <span style={{ fontSize:16, fontWeight:900, color:T.textMain,
                letterSpacing:-0.3 }}>New Arrivals</span>
            </div>
            <span style={{ fontSize:12, fontWeight:700, color:T.navy,
              cursor:"pointer" }}>See All</span>
          </div>
          <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:4 }}>
            {newArrivals.map(item => (
              <div key={item.id} onClick={() => onProductPress(item)}
                style={{ background:T.card, borderRadius:20, padding:"14px",
                  flexShrink:0, width:155,
                  border:`1px solid ${T.border}`, boxShadow:T.shadow,
                  cursor:"pointer" }}>
                <div style={{ height:90, background:item.color+"14",
                  borderRadius:14, marginBottom:10,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  position:"relative" }}>
                  <Icon name={item.icon} size={34} color={item.color+"66"}/>
                  <div style={{ position:"absolute", top:8, left:8,
                    background:T.green, borderRadius:7, padding:"2px 7px" }}>
                    <span style={{ fontSize:9, fontWeight:900, color:"#fff" }}>
                      NEW
                    </span>
                  </div>
                </div>
                <div style={{ fontSize:11, fontWeight:800, color:T.textMain,
                  marginBottom:3, overflow:"hidden",
                  textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {item.name}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4,
                  marginBottom:4 }}>
                  <Icon name="star" size={10} color={T.gold}/>
                  <span style={{ fontSize:10, fontWeight:700,
                    color:T.textMid }}>{item.rating}</span>
                  <span style={{ fontSize:10, color:T.textMute }}>·</span>
                  <span style={{ fontSize:10, color:T.textMute }}>
                    {item.seller}
                  </span>
                </div>
                <div style={{ fontSize:13, fontWeight:900, color:T.navy,
                  fontFamily:"monospace" }}>{fmt(item.price)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURED STORES ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Icon name="shield" size={16} color={T.blue}/>
              <span style={{ fontSize:16, fontWeight:900, color:T.textMain,
                letterSpacing:-0.3 }}>Top Verified Stores</span>
            </div>
          </div>
          <div style={{ background:T.card, borderRadius:22,
            border:`1px solid ${T.border}`, boxShadow:T.shadow,
            overflow:"hidden" }}>
            {featuredStores.map((store, i) => (
              <div key={store.id} onClick={() => onSellerPress(store.id)}
                style={{ display:"flex", gap:14, alignItems:"center",
                  padding:"14px 18px",
                  borderBottom:i<featuredStores.length-1?`1px solid ${T.border}`:"none",
                  cursor:"pointer" }}>
                <div style={{ width:46, height:46, borderRadius:14, flexShrink:0,
                  background:`linear-gradient(135deg,${store.color}22,${store.color}44)`,
                  border:`2px solid ${store.color}33`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:15, fontWeight:900, color:store.color }}>
                  {store.initials}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:800,
                    color:T.textMain, marginBottom:3 }}>{store.name}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:3,
                      background:T.greenBg, borderRadius:6, padding:"1px 6px" }}>
                      <div style={{ width:4, height:4, borderRadius:"50%",
                        background:T.green }}/>
                      <span style={{ fontSize:9, fontWeight:800,
                        color:T.green }}>{store.trustScore}</span>
                    </div>
                    <span style={{ fontSize:11, color:T.textMute }}>
                      {store.products} products
                    </span>
                    <span style={{ fontSize:11, color:T.textMute }}>·</span>
                    <span style={{ fontSize:11, color:T.textMute }}>
                      {store.location}
                    </span>
                  </div>
                </div>
                <Icon name="chevronRight" size={14} color={T.textMute}/>
              </div>
            ))}
          </div>
        </div>

        {/* ── PANDA ESCROW TRUST BANNER ── */}
        <div style={{
          background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
          borderRadius:22, padding:"20px",
          position:"relative", overflow:"hidden", marginBottom:16,
        }}>
          <div style={{ position:"absolute", inset:0, opacity:0.05,
            backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize:"16px 16px" }}/>
          <div style={{ display:"flex", gap:14, alignItems:"center",
            position:"relative" }}>
            <div style={{ width:52, height:52, borderRadius:16,
              background:"rgba(255,255,255,0.12)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="shield" size={26} color={T.gold}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:900, color:"#fff",
                marginBottom:4 }}>Every Purchase Protected</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)",
                lineHeight:1.6 }}>
                Panda Escrow holds your payment safely until you confirm delivery. Shop with confidence.
              </div>
            </div>
          </div>
        </div>

      </div>

      <BottomNav active="discover"/>
    </div>
  );
}

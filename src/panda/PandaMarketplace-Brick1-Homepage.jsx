import { useState } from "react";

// ============================================================
// 🧱 BRICK 1 — HOMEPAGE (DISCOVER & AI)
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 📦  Assembly: export HomepageBrick from this file
//     and pass props: { user, onProductPress, onSellerPress,
//                       onCategoryPress, onLivePress, onSearch }
// ============================================================

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  navy:      "#0B1F4B",
  navyMid:   "#1A3A6E",
  navyLight: "#EEF2FF",
  gold:      "#C9960A",
  goldLight: "#FFF8E1",
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
  redBg:     "#FDECEA",
  purple:    "#6D28D9",
  purpleBg:  "#F5F3FF",
  blue:      "#1D4ED8",
  shadow:    "0 2px 16px rgba(11,31,75,0.07)",
  shadowMd:  "0 8px 32px rgba(11,31,75,0.11)",
  shadowLg:  "0 20px 60px rgba(11,31,75,0.16)",
};

const fmt = n => "TSh " + Number(n).toLocaleString();

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    search:      <><circle cx="11" cy="11" r="8" {...s}/><line x1="21" y1="21" x2="16.65" y2="16.65" {...s}/></>,
    mic:         <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" {...s}/><path d="M19 10v2a7 7 0 0 1-14 0v-2" {...s}/><line x1="12" y1="19" x2="12" y2="23" {...s}/><line x1="8" y1="23" x2="16" y2="23" {...s}/></>,
    camera:      <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    bell:        <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...s}/><path d="M13.73 21a2 2 0 0 1-3.46 0" {...s}/></>,
    menu:        <><line x1="3" y1="6" x2="21" y2="6" {...s}/><line x1="3" y1="12" x2="21" y2="12" {...s}/><line x1="3" y1="18" x2="21" y2="18" {...s}/></>,
    home:        <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:     <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:        <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    message:     <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    wallet:      <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    user:        <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    star:        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    chevronRight:<><polyline points="9 18 15 12 9 6" {...s}/></>,
    eye:         <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
    shield:      <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    zap:         <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    truck:       <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    car:         <><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" {...s}/><circle cx="7.5" cy="17.5" r="2.5" {...s}/><circle cx="14.5" cy="17.5" r="2.5" {...s}/></>,
    home2:       <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    briefcase:   <><rect x="2" y="7" width="20" height="14" rx="2" {...s}/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...s}/></>,
    users:       <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    shopping:    <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" {...s}/><line x1="3" y1="6" x2="21" y2="6" {...s}/><path d="M16 10a4 4 0 0 1-8 0" {...s}/></>,
    mapPin:      <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    heart:       <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...s}/></>,
    robot:       <><rect x="3" y="11" width="18" height="10" rx="2" {...s}/><path d="M12 11V7" {...s}/><circle cx="12" cy="5" r="2" {...s}/><line x1="8" y1="15" x2="8" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/><line x1="16" y1="15" x2="16" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    sparkle:     <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    arrowRight:  <><line x1="5" y1="12" x2="19" y2="12" {...s}/><polyline points="12 5 19 12 12 19" {...s}/></>,
    check:       <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    laptop:      <><rect x="2" y="3" width="20" height="14" rx="2" {...s}/><path d="M2 17h20v2H2z" stroke="none" fill={color} opacity="0.15"/><line x1="2" y1="17" x2="22" y2="17" {...s}/></>,
    headphones:  <><path d="M3 18v-6a9 9 0 0 1 18 0v6" {...s}/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" {...s}/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Trust Score Badge ────────────────────────────────────────────────────────
function TrustBadge({ score, size = "sm" }) {
  const sz = size === "lg" ? 44 : size === "md" ? 36 : 28;
  const fs = size === "lg" ? 13 : size === "md" ? 11 : 9;
  return (
    <div style={{
      width: sz, height: sz, borderRadius: "50%",
      background: `conic-gradient(${T.green} ${score * 3.6}deg, ${T.border} 0deg)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", flexShrink: 0,
    }}>
      <div style={{
        width: sz - 6, height: sz - 6, borderRadius: "50%",
        background: T.white, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: fs, fontWeight: 900, color: T.green, lineHeight: 1 }}>{score}</div>
        {size !== "sm" && <div style={{ fontSize: fs - 2, color: T.textMute, lineHeight: 1 }}>Trust</div>}
      </div>
    </div>
  );
}

// ─── Live Badge ───────────────────────────────────────────────────────────────
function LiveBadge({ viewers }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 4,
      background: T.red, borderRadius: 6, padding: "2px 7px",
    }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", animation: "pulse 1.2s infinite" }}/>
      <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>LIVE</span>
      <Icon name="eye" size={10} color="rgba(255,255,255,0.85)"/>
      <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{viewers}</span>
    </div>
  );
}

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — CATEGORIES
// Replace with: supabase.from('categories').select('*').order('sort_order')
// ============================================================
const CATEGORIES = [
  { id: 1, label: "Products",   icon: "shopping",  color: T.blue   },
  { id: 2, label: "Services",   icon: "zap",       color: T.purple },
  { id: 3, label: "Vehicles",   icon: "car",       color: T.red    },
  { id: 4, label: "Real Estate",icon: "home2",     color: T.green  },
  { id: 5, label: "Jobs",       icon: "briefcase", color: T.gold   },
  { id: 6, label: "Business",   icon: "users",     color: T.navy   },
];

// 🔌 BACKEND SWAP POINT #2 — LIVE ITEMS
// Replace with: supabase.from('live_streams').select('*,seller(*)')
//               .eq('status','live').order('viewers', { ascending: false })
const LIVE_ITEMS = [
  { id:1, title:"iPhone 15 Pro Max 256GB",  seller:"Master Tech",   price:1650000, viewers:"1.2K", rating:4.8, trust:98, img:"laptop"    },
  { id:2, title:"Luxury Watch Collection",  seller:"Classic Store", price:450000,  viewers:"234",  rating:4.9, trust:96, img:"headphones" },
  { id:3, title:"Toyota Harrier 2020",      seller:"Car Empire",    price:38000000,viewers:"654",  rating:4.7, trust:95, img:"car"        },
];

const TRENDING = [
  { id:1, label:"All"       },
  { id:2, label:"Products"  },
  { id:3, label:"Services"  },
  { id:4, label:"Vehicles"  },
  { id:5, label:"Real Estate"},
];

// 🔌 BACKEND SWAP POINT #3 — TRENDING PRODUCTS
// Replace with: supabase.from('products').select('*,seller(*)')
//               .order('sold_count', { ascending: false }).limit(10)
//               .eq('category', selectedCategory) // when filter active
const TRENDING_PRODUCTS = [
  { id:1, name:"AirPods Pro 2",    price:350000,  rating:4.8, reviews:100, seller:"Master Tech",   trust:98, icon:"headphones" },
  { id:2, name:"Dell XPS 13",      price:1450000, rating:4.7, reviews:96,  seller:"Tech Hub",      trust:96, icon:"laptop"     },
  { id:3, name:"Samsung S24 Ultra",price:1200000, rating:4.9, reviews:150, seller:"Phone World",   trust:94, icon:"shopping"   },
];

// 🔌 BACKEND SWAP POINT #4 — TOP SELLERS
// Replace with: supabase.from('sellers').select('*')
//               .order('trust_score', { ascending: false }).limit(4)
const TOP_SELLERS = [
  { id:1, initials:"TM", name:"Tech Master",  trust:98, color:"#1D4ED8" },
  { id:2, initials:"FH", name:"Fashion Hub",  trust:96, color:"#6D28D9" },
  { id:3, initials:"CE", name:"Car Empire",   trust:95, color:"#C0392B" },
  { id:4, initials:"HS", name:"Home Store",   trust:93, color:"#0A7B4B" },
];

// 🔌 BACKEND SWAP POINT #5 — AI SEARCH SUGGESTIONS
// Replace with: fetch('/api/ai/search-suggestions?user_id=BAK')
//               or: anthropic.messages.create({ system: 'suggest searches', ... })
const AI_SUGGESTIONS = [
  "I need a Toyota under 15M TZS",
  "I need a laptop for programming",
  "Best phones under TSh 800K",
  "Fresh vegetables near me",
];

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
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
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      background: T.white, borderTop: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-around",
      padding: "8px 0 20px", zIndex: 200,
      boxShadow: "0 -4px 24px rgba(11,31,75,0.08)",
    }}>
      {items.map(item => {
        const isCenter = item.id === "create";
        const isActive = item.id === active;
        if (isCenter) return (
          <div key={item.id} style={{
            width: 52, height: 52, borderRadius: "50%",
            background: `linear-gradient(135deg,${T.navy},${T.navyMid})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 6px 20px ${T.navy}55`, cursor: "pointer",
            marginTop: -20, border: `3px solid ${T.white}`,
          }}>
            <Icon name="plus" size={22} color="#fff"/>
          </div>
        );
        return (
          <div key={item.id} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 3, cursor: "pointer", minWidth: 44, padding: "4px 0",
          }}>
            <Icon name={item.icon} size={20} color={isActive ? T.navy : T.textMute}/>
            <span style={{ fontSize: 10, fontWeight: isActive ? 800 : 500,
              color: isActive ? T.navy : T.textMute }}>{item.label}</span>
            {isActive && <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.gold }}/>}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// 🧱 MAIN COMPONENT — Homepage
// 📦 ASSEMBLY PROPS — wire these up in Brick 19 (Assembly)
// 👤 AUTH — user object comes from Supabase auth session
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user from: supabase.auth.getUser()
  user              = { name: "BAK", avatar: "B", notifications: 3 },

  // 🧭 NAVIGATE — wire to real screens in assembly
  onProductPress    = () => {},   // → Brick 3  ProductDetails
  onSellerPress     = () => {},   // → Brick 4  SellerProfile
  onLivePress       = () => {},   // → Brick 2  LiveSocialFeed
  onCategoryPress   = () => {},   // → Brick 9  MarketplaceHome (filtered)
  onSearchSubmit    = () => {},   // → Brick 9  MarketplaceHome (search results)
  onAIChat          = () => {},   // → Panda AI Assistant screen
  onSeeAllLive      = () => {},   // → Brick 2  LiveSocialFeed
  onSeeAllTrending  = () => {},   // → Brick 9  MarketplaceHome
  onSeeAllSellers   = () => {},   // → Brick 9  MarketplaceHome (sellers view)
  onNotifications   = () => {},   // → Notifications screen
}) {
  const [search, setSearch]         = useState("");
  const [searchFocused, setFocused] = useState(false);
  const [trendTab, setTrendTab]     = useState("All");
  const [aiVisible, setAiVisible]   = useState(true);
  const [wishlist, setWishlist]     = useState({});

  return (
    <div style={{
      background: T.bg, minHeight: "100vh", color: T.textMain,
      fontFamily: "'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth: 430, margin: "0 auto", position: "relative",
      paddingBottom: 100,
    }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes liveGlow { 0%,100%{box-shadow:0 0 0 0 rgba(192,57,43,0.4)} 50%{box-shadow:0 0 0 6px rgba(192,57,43,0)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        button { font-family: inherit; cursor: pointer; border: none; }
        input { font-family: inherit; }
        input::placeholder { color: ${T.textMute}; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)",
        padding: "14px 20px 10px", position: "sticky", top: 0, zIndex: 100,
        borderBottom: `1px solid ${T.border}`,
        boxShadow: "0 2px 16px rgba(11,31,75,0.05)",
      }}>
        {/* Greeting */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 13, color: T.textMute, fontWeight: 500 }}>Good evening</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: T.navy, letterSpacing: -0.5 }}>
              Hello BAK 👋
            </div>
            <div style={{ fontSize: 12, color: T.textMute, marginTop: 2 }}>
              What are you looking for today?
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{
              width: 42, height: 42, borderRadius: 12,
              background: T.navyLight, border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <Icon name="bell" size={18} color={T.navy}/>
              <div style={{
                position: "absolute", top: 9, right: 9, width: 8, height: 8,
                background: T.red, borderRadius: "50%", border: `2px solid ${T.white}`,
              }}/>
            </button>
            <button style={{
              width: 42, height: 42, borderRadius: 12,
              background: T.navyLight, border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="menu" size={18} color={T.navy}/>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          display: "flex", gap: 8, alignItems: "center",
          background: searchFocused ? T.white : T.navyLight,
          border: `1.5px solid ${searchFocused ? T.navy : T.border}`,
          borderRadius: 16, padding: "11px 14px",
          transition: "all 0.2s",
          boxShadow: searchFocused ? `0 0 0 3px ${T.navy}14` : "none",
        }}>
          <Icon name="search" size={16} color={searchFocused ? T.navy : T.textMute}/>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="Ask Panda AI anything..."
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontSize: 14, color: T.textMain, fontWeight: 500,
            }}
          />
          <button style={{
            width: 30, height: 30, borderRadius: 8, background: T.navyLight,
            border: `1px solid ${T.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="mic" size={14} color={T.textMid}/>
          </button>
          <button style={{
            width: 30, height: 30, borderRadius: 8, background: T.navyLight,
            border: `1px solid ${T.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="camera" size={14} color={T.textMid}/>
          </button>
        </div>

        {/* AI Suggestions */}
        {searchFocused && (
          <div style={{
            position: "absolute", top: "100%", left: 16, right: 16,
            background: T.white, border: `1px solid ${T.border}`,
            borderRadius: 18, padding: 14, zIndex: 999,
            boxShadow: T.shadowLg, animation: "fadeUp 0.2s ease",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute,
              textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
              Try asking Panda AI
            </div>
            {AI_SUGGESTIONS.map((s, i) => (
              <div key={i} onClick={() => setSearch(s)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 0", borderBottom: i < AI_SUGGESTIONS.length - 1 ? `1px solid ${T.border}` : "none",
                  cursor: "pointer",
                }}>
                <div style={{ width: 30, height: 30, borderRadius: 8,
                  background: T.purpleBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="sparkle" size={14} color={T.purple}/>
                </div>
                <span style={{ fontSize: 13, color: T.textMid, fontWeight: 500 }}>{s}</span>
                <Icon name="arrowRight" size={14} color={T.textMute} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "0 0 16px" }}>

        {/* ── CATEGORIES ── */}
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8,
          }}>
            {CATEGORIES.map(cat => (
              <div key={cat.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 16,
                  background: cat.color + "14",
                  border: `1.5px solid ${cat.color}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.18s",
                }}>
                  <Icon name={cat.icon} size={20} color={cat.color}/>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: T.textMid,
                  textAlign: "center", lineHeight: 1.2 }}>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── PANDA AI ASSISTANT CARD ── */}
        {aiVisible && (
          <div style={{ padding: "20px 20px 0" }}>
            <div style={{
              background: `linear-gradient(135deg,#3B1FA3 0%,#6D28D9 50%,#4C1D95 100%)`,
              borderRadius: 22, padding: "20px 20px",
              position: "relative", overflow: "hidden",
              animation: "fadeUp 0.3s ease",
            }}>
              {/* BG pattern */}
              <div style={{
                position: "absolute", inset: 0, opacity: 0.06,
                backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
                backgroundSize: "20px 20px",
              }}/>
              <div style={{
                position: "absolute", top: -20, right: -20, width: 120, height: 120,
                borderRadius: "50%", background: "rgba(255,255,255,0.05)",
              }}/>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10,
                      background: "rgba(255,255,255,0.15)", display: "flex",
                      alignItems: "center", justifyContent: "center" }}>
                      <Icon name="robot" size={18} color="#fff"/>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>PANDA AI ASSISTANT</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 1.6, marginBottom: 16 }}>
                    I can help you find the best products, compare prices, negotiate and much more.
                  </div>
                  <button style={{
                    background: T.white, border: "none", borderRadius: 12,
                    padding: "10px 20px", fontSize: 13, fontWeight: 800,
                    color: T.purple, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  }}>
                    <Icon name="sparkle" size={14} color={T.purple}/>
                    Chat with Panda AI
                  </button>
                </div>
                {/* Panda mascot */}
                <div style={{
                  width: 80, height: 80, borderRadius: 20,
                  background: "rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 44, marginLeft: 12, flexShrink: 0,
                  border: "2px solid rgba(255,255,255,0.15)",
                }}>
                  🐼
                </div>
              </div>
              <button onClick={() => setAiVisible(false)} style={{
                position: "absolute", top: 12, right: 12, width: 24, height: 24,
                borderRadius: "50%", background: "rgba(255,255,255,0.15)",
                border: "none", color: "#fff", fontSize: 14, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>×</button>
            </div>
          </div>
        )}

        {/* ── LIVE NOW ── */}
        <div style={{ padding: "24px 0 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "0 20px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%",
                background: T.red, animation: "pulse 1.2s infinite liveGlow" }}/>
              <span style={{ fontSize: 16, fontWeight: 900, color: T.textMain,
                letterSpacing: -0.3 }}>Live Now</span>
            </div>
            <button style={{
              display: "flex", alignItems: "center", gap: 4, background: "none",
              border: "none", fontSize: 12, fontWeight: 700, color: T.navy, cursor: "pointer",
            }}>
              See all <Icon name="chevronRight" size={14} color={T.navy}/>
            </button>
          </div>

          <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "0 20px", paddingBottom: 4 }}>
            {LIVE_ITEMS.map(item => (
              <div key={item.id} style={{
                minWidth: 160, background: T.card, borderRadius: 20,
                border: `1px solid ${T.border}`, overflow: "hidden",
                boxShadow: T.shadow, flexShrink: 0, cursor: "pointer",
                transition: "all 0.2s",
              }}>
                {/* Image area */}
                <div style={{
                  height: 120, background: `linear-gradient(135deg,${T.navyLight},${T.border})`,
                  position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={item.img} size={48} color={T.navy + "44"}/>
                  {/* Live badge */}
                  <div style={{ position: "absolute", top: 8, left: 8 }}>
                    <LiveBadge viewers={item.viewers}/>
                  </div>
                  {/* Trust score */}
                  <div style={{ position: "absolute", top: 8, right: 8 }}>
                    <TrustBadge score={item.trust} size="sm"/>
                  </div>
                  {/* Wishlist */}
                  <button onClick={() => setWishlist(w => ({ ...w, [item.id]: !w[item.id] }))}
                    style={{
                      position: "absolute", bottom: 8, right: 8,
                      width: 28, height: 28, borderRadius: "50%",
                      background: "rgba(255,255,255,0.92)", border: "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                    }}>
                    <Icon name="heart" size={13} color={wishlist[item.id] ? T.red : T.textMute}/>
                  </button>
                </div>
                {/* Info */}
                <div style={{ padding: "10px 12px 12px" }}>
                  <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, marginBottom: 3 }}>
                    {item.seller}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: T.textMain,
                    lineHeight: 1.3, marginBottom: 6,
                    overflow: "hidden", display: "-webkit-box",
                    WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {item.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 6 }}>
                    <Icon name="star" size={10} color={T.gold}/>
                    <span style={{ fontSize: 11, fontWeight: 700, color: T.textMid }}>{item.rating}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: T.navy,
                    fontFamily: "monospace", letterSpacing: -0.3 }}>
                    {fmt(item.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TRENDING NEAR YOU ── */}
        <div style={{ padding: "24px 0 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "0 20px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="mapPin" size={16} color={T.navy}/>
              <span style={{ fontSize: 16, fontWeight: 900, color: T.textMain, letterSpacing: -0.3 }}>
                Trending Near You
              </span>
            </div>
            <button style={{
              display: "flex", alignItems: "center", gap: 4, background: "none",
              border: "none", fontSize: 12, fontWeight: 700, color: T.navy, cursor: "pointer",
            }}>
              See all <Icon name="chevronRight" size={14} color={T.navy}/>
            </button>
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 20px", marginBottom: 14, paddingBottom: 4 }}>
            {TRENDING.map(t => (
              <button key={t.id} onClick={() => setTrendTab(t.label)}
                style={{
                  padding: "7px 16px", borderRadius: 99, fontSize: 12, fontWeight: 700,
                  whiteSpace: "nowrap", transition: "all 0.18s",
                  background: trendTab === t.label ? T.navy : T.white,
                  color: trendTab === t.label ? "#fff" : T.textMid,
                  border: trendTab === t.label ? "none" : `1px solid ${T.border}`,
                  boxShadow: trendTab === t.label ? `0 4px 12px ${T.navy}33` : "none",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Product cards */}
          <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "0 20px", paddingBottom: 4 }}>
            {TRENDING_PRODUCTS.map(p => (
              <div key={p.id} style={{
                minWidth: 155, background: T.card, borderRadius: 20,
                border: `1px solid ${T.border}`, overflow: "hidden",
                boxShadow: T.shadow, flexShrink: 0, cursor: "pointer",
              }}>
                <div style={{
                  height: 110, background: T.navyLight,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  <Icon name={p.icon} size={44} color={T.navy + "33"}/>
                  <button onClick={() => setWishlist(w => ({ ...w, [`t${p.id}`]: !w[`t${p.id}`] }))}
                    style={{
                      position: "absolute", top: 8, right: 8,
                      width: 26, height: 26, borderRadius: "50%",
                      background: "rgba(255,255,255,0.9)", border: "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                    }}>
                    <Icon name="heart" size={12} color={wishlist[`t${p.id}`] ? T.red : T.textMute}/>
                  </button>
                </div>
                <div style={{ padding: "10px 12px 12px" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: T.textMain,
                    marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 6 }}>
                    <Icon name="star" size={10} color={T.gold}/>
                    <span style={{ fontSize: 10, fontWeight: 700, color: T.textMid }}>{p.rating}</span>
                    <span style={{ fontSize: 10, color: T.textMute }}>({p.reviews})</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: T.navy,
                    fontFamily: "monospace", letterSpacing: -0.3 }}>
                    {fmt(p.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── VERIFIED TOP SELLERS ── */}
        <div style={{ padding: "24px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="shield" size={16} color={T.gold}/>
              <span style={{ fontSize: 16, fontWeight: 900, color: T.textMain, letterSpacing: -0.3 }}>
                Verified Top Sellers
              </span>
            </div>
            <button style={{
              display: "flex", alignItems: "center", gap: 4, background: "none",
              border: "none", fontSize: 12, fontWeight: 700, color: T.navy, cursor: "pointer",
            }}>
              See all <Icon name="chevronRight" size={14} color={T.navy}/>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {TOP_SELLERS.map(seller => (
              <div key={seller.id} style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius: 18, padding: "14px 8px", textAlign: "center",
                boxShadow: T.shadow, cursor: "pointer",
              }}>
                {/* Avatar */}
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: `linear-gradient(135deg,${seller.color}22,${seller.color}44)`,
                  border: `2px solid ${seller.color}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, fontWeight: 900, color: seller.color,
                  margin: "0 auto 8px",
                }}>
                  {seller.initials}
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: T.textMain,
                  marginBottom: 6, lineHeight: 1.2 }}>{seller.name}</div>
                {/* Trust score */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }}/>
                  <span style={{ fontSize: 12, fontWeight: 900, color: T.green }}>{seller.trust}</span>
                </div>
                <div style={{ fontSize: 9, color: T.textMute, marginTop: 1 }}>Trust Score</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PANDA ESCROW BANNER ── */}
        <div style={{ padding: "24px 20px 0" }}>
          <div style={{
            background: `linear-gradient(135deg,${T.navy} 0%,${T.navyMid} 100%)`,
            borderRadius: 22, padding: "20px 22px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, opacity: 0.05,
              backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
              backgroundSize: "18px 18px",
            }}/>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <Icon name="shield" size={16} color={T.gold}/>
                  <span style={{ fontSize: 11, fontWeight: 800, color: T.gold, letterSpacing: 0.8 }}>
                    PANDA ESCROW
                  </span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
                  Buy with Confidence
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                  Your money is held safely until you receive and confirm your order.
                </div>
              </div>
              <div style={{ width: 52, height: 52, borderRadius: 16,
                background: "rgba(255,255,255,0.1)", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginLeft: 16 }}>
                <Icon name="shield" size={28} color={T.gold}/>
              </div>
            </div>
            {/* Steps */}
            <div style={{
              display: "flex", alignItems: "center", gap: 0,
              marginTop: 18, position: "relative",
            }}>
              {["You Pay","Panda Holds","You Confirm","Seller Paid"].map((step, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    {i > 0 && <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.2)" }}/>}
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: i === 3 ? T.green : "rgba(255,255,255,0.15)",
                      border: `1.5px solid ${i === 3 ? T.green : "rgba(255,255,255,0.3)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 900, color: "#fff", flexShrink: 0,
                    }}>
                      {i === 3 ? <Icon name="check" size={12} color="#fff"/> : i + 1}
                    </div>
                    {i < 3 && <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.2)" }}/>}
                  </div>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontWeight: 600,
                    textAlign: "center", lineHeight: 1.2 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── QUICK STATS ROW ── */}
        <div style={{ padding: "24px 20px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[
              { label:"Active Sellers", value:"2,840+", icon:"users",    color:T.blue   },
              { label:"Products",       value:"45K+",   icon:"shopping", color:T.purple },
              { label:"Safe Orders",    value:"98.2%",  icon:"shield",   color:T.green  },
            ].map(stat => (
              <div key={stat.label} style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius: 18, padding: "16px 12px", textAlign: "center",
                boxShadow: T.shadow,
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 10,
                  background: stat.color + "14",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 8px" }}>
                  <Icon name={stat.icon} size={15} color={stat.color}/>
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: T.navy,
                  fontFamily: "monospace", marginBottom: 3 }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: 0.5 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── BOTTOM NAV ── */}
      <BottomNav active="home"/>
    </div>
  );
}

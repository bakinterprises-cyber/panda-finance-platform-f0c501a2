import { useState, useEffect, useRef } from "react";

// ============================================================
// 🧱 BRICK 2 — LIVE SHOPPING & SOCIAL FEED
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 📦  Assembly: export LiveSocialFeed from this file
//     and pass props: { user, onProductPress, onSellerPress,
//                       onBuyNow, onChatSeller }
// ============================================================

// ─── Design Tokens ─────────────────────────────────────────────────────────────
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
  blueBg:    "#EFF6FF",
  shadow:    "0 2px 16px rgba(11,31,75,0.07)",
  shadowMd:  "0 8px 32px rgba(11,31,75,0.11)",
  shadowLg:  "0 20px 60px rgba(11,31,75,0.16)",
};

const fmt = n => "TSh " + Number(n).toLocaleString();

// ─── SVG Icons ─────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    search:       <><circle cx="11" cy="11" r="8" {...s}/><line x1="21" y1="21" x2="16.65" y2="16.65" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    heart:        <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...s}/></>,
    heartFill:    <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={color} stroke={color} strokeWidth="1.4"/></>,
    share:        <><circle cx="18" cy="5" r="3" {...s}/><circle cx="6" cy="12" r="3" {...s}/><circle cx="18" cy="19" r="3" {...s}/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" {...s}/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" {...s}/></>,
    cart:         <><circle cx="9" cy="21" r="1" {...s}/><circle cx="20" cy="21" r="1" {...s}/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    userPlus:     <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><line x1="19" y1="8" x2="19" y2="14" {...s}/><line x1="22" y1="11" x2="16" y2="11" {...s}/></>,
    bell:         <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...s}/><path d="M13.73 21a2 2 0 0 1-3.46 0" {...s}/></>,
    video:        <><polygon points="23 7 16 12 23 17 23 7" {...s}/><rect x="1" y="5" width="15" height="14" rx="2" {...s}/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    send:         <><line x1="22" y1="2" x2="11" y2="13" {...s}/><polygon points="22 2 15 22 11 13 2 9 22 2" {...s}/></>,
    laptop:       <><rect x="2" y="3" width="20" height="14" rx="2" {...s}/><line x1="2" y1="17" x2="22" y2="17" {...s}/></>,
    headphones:   <><path d="M3 18v-6a9 9 0 0 1 18 0v6" {...s}/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" {...s}/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" {...s}/></>,
    car:          <><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" {...s}/><circle cx="7.5" cy="17.5" r="2.5" {...s}/><circle cx="14.5" cy="17.5" r="2.5" {...s}/></>,
    shopping:     <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" {...s}/><line x1="3" y1="6" x2="21" y2="6" {...s}/><path d="M16 10a4 4 0 0 1-8 0" {...s}/></>,
    gift:         <><polyline points="20 12 20 22 4 22 4 12" {...s}/><rect x="2" y="7" width="20" height="5" {...s}/><line x1="12" y1="22" x2="12" y2="7" {...s}/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" {...s}/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, display: "block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Trust Score Ring ──────────────────────────────────────────────────────────
function TrustBadge({ score, size = "sm" }) {
  const sz = size === "lg" ? 52 : size === "md" ? 40 : 30;
  const fs = size === "lg" ? 14 : size === "md" ? 11 : 9;
  return (
    <div style={{
      width: sz, height: sz, borderRadius: "50%",
      background: `conic-gradient(${T.green} ${score * 3.6}deg, rgba(255,255,255,0.2) 0deg)`,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <div style={{
        width: sz - 6, height: sz - 6, borderRadius: "50%",
        background: "rgba(11,31,75,0.85)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: fs, fontWeight: 900, color: T.green, lineHeight: 1 }}>{score}</span>
        {size !== "sm" && <span style={{ fontSize: fs - 2, color: "rgba(255,255,255,0.6)", lineHeight: 1 }}>Trust</span>}
      </div>
    </div>
  );
}

// ─── Bottom Nav ────────────────────────────────────────────────────────────────
function BottomNav({ active = "discover" }) {
  const items = [
    { id: "home",     icon: "home",    label: "Home"     },
    { id: "discover", icon: "compass", label: "Discover" },
    { id: "create",   icon: "plus",    label: ""         },
    { id: "messages", icon: "message", label: "Messages" },
    { id: "wallet",   icon: "wallet",  label: "Wallet"   },
    { id: "profile",  icon: "user",    label: "Profile"  },
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
            <span style={{ fontSize: 10, fontWeight: isActive ? 800 : 500, color: isActive ? T.navy : T.textMute }}>{item.label}</span>
            {isActive && <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.gold }}/>}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — LIVE COMMENTS
// Replace with: supabase
//   .channel('live_comments')
//   .on('postgres_changes', { event: 'INSERT',
//        schema: 'public', table: 'live_comments',
//        filter: `stream_id=eq.${streamId}` }, payload => {
//     setComments(prev => [...prev.slice(-4), payload.new])
//   }).subscribe()
// ============================================================
const LIVE_COMMENTS = [
  { id:1, user:"John Doe",   color:"#1D4ED8", text:"Is this original?",               time:0   },
  { id:2, user:"Amina Tz",   color:"#6D28D9", text:"How much is the battery life?",   time:3000 },
  { id:3, user:"Peter 254",  color:"#0A7B4B", text:"Can you deliver to Mwanza?",      time:6000 },
  { id:4, user:"Sara K",     color:"#C9960A", text:"Best price in Dar!",              time:9000 },
  { id:5, user:"Hashim B",   color:"#C0392B", text:"Does it come with warranty?",     time:12000},
  { id:6, user:"Lulu Tz",    color:"#0B1F4B", text:"Show the back of the phone!",     time:15000},
];

// 🔌 BACKEND SWAP POINT #2 — MORE LIVE STREAMS
// Replace with: supabase.from('live_streams').select('*,seller(*)')
//               .eq('status','live').neq('id', featuredStreamId)
//               .order('viewers', { ascending: false }).limit(6)
const MORE_LIVES = [
  { id:1, seller:"Fashion Store",    viewers:"567", icon:"shopping", color:"#6D28D9", trust:92 },
  { id:2, seller:"Car Empire",       viewers:"892", icon:"car",      color:"#C0392B", trust:95 },
  { id:3, seller:"Home Essentials",  viewers:"892", icon:"laptop",   color:"#0A7B4B", trust:90 },
  { id:4, seller:"Tech World",       viewers:"341", icon:"laptop",   color:"#1D4ED8", trust:97 },
];

// 🔌 BACKEND SWAP POINT #3 — SOCIAL FEED POSTS
// Replace with: supabase.from('feed_posts')
//               .select('*,seller(*),product(*)')
//               .in('seller_id', user.following_ids)  // "Following" tab
//               .order('created_at', { ascending: false })
//               .limit(20)
// For "For You" tab: use AI recommendation engine
// fetch('/api/feed/recommended?user_id=' + user.id)
const FEED_POSTS = [
  {
    id:1, seller:"Master Tech", initials:"MT", color:"#1D4ED8",
    trust:98, followers:"20K", verified:true,
    product:"iPhone 15 Pro Max 256GB", price:1650000, original:1800000,
    icon:"laptop", rating:4.9, reviews:320,
    likes:2400, shares:150, comments:89,
    tag:"Best Deal",
  },
  {
    id:2, seller:"Fashion Hub", initials:"FH", color:"#6D28D9",
    trust:96, followers:"12K", verified:true,
    product:"Designer Handbag Collection", price:180000, original:250000,
    icon:"shopping", rating:4.7, reviews:210,
    likes:1820, shares:98, comments:54,
    tag:"New Arrival",
  },
];

// ============================================================
// 🧱 MAIN COMPONENT — LiveSocialFeed
// 📦 ASSEMBLY PROPS — wire these up in Brick 19 (Assembly)
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user from supabase.auth.getUser()
  user            = { name: "BAK", id: "user-001", following_ids: [] },

  // 🔌 BACKEND — replace with real stream from supabase live_streams
  featuredStream  = null,

  // 🧭 NAVIGATE — wire to real screens in assembly
  onProductPress  = () => {},   // → Brick 3  ProductDetails
  onSellerPress   = () => {},   // → Brick 4  SellerProfile
  onBuyNow        = () => {},   // → Brick 3  ProductDetails → checkout
  onChatSeller    = () => {},   // → Brick 10 Marketplace Chat
  onWatchLive     = () => {},   // → Full screen live view
  onBack          = () => {},   // → Brick 1  Homepage
}) {
  const [tab, setTab]           = useState("following");
  const [likes, setLikes]       = useState({});
  const [following, setFollowing] = useState({});
  const [comments, setComments] = useState([LIVE_COMMENTS[0]]);
  const [purchase, setPurchase] = useState(true);
  const [cartAdded, setCartAdded] = useState({});

  // 🔌 BACKEND — persist like to DB
  // const handleLike = async (postId) => {
  //   setLikes(l => ({ ...l, [postId]: !l[postId] }))
  //   await supabase.from('post_likes')
  //     .upsert({ post_id: postId, user_id: user.id })
  // }

  // 🔌 BACKEND — persist follow to DB
  // const handleFollow = async (sellerId) => {
  //   setFollowing(f => ({ ...f, [sellerId]: !f[sellerId] }))
  //   await supabase.from('follows')
  //     .upsert({ seller_id: sellerId, user_id: user.id })
  // }

  // 🔌 BACKEND — add to cart via API
  // const handleAddToCart = async (productId, qty = 1) => {
  //   await supabase.from('cart_items')
  //     .upsert({ product_id: productId, user_id: user.id, qty })
  // }
  const commentRef = useRef(null);

  // Simulate live comments coming in
  useEffect(() => {
    const timers = LIVE_COMMENTS.slice(1).map(c =>
      setTimeout(() => {
        setComments(prev => [...prev.slice(-4), c]);
      }, c.time)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Auto scroll comments
  useEffect(() => {
    if (commentRef.current) {
      commentRef.current.scrollTop = commentRef.current.scrollHeight;
    }
  }, [comments]);

  // Hide purchase notification after 4s
  useEffect(() => {
    const t = setTimeout(() => setPurchase(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const handleCart = (id) => {
    setCartAdded(c => ({ ...c, [id]: true }));
    setTimeout(() => setCartAdded(c => ({ ...c, [id]: false })), 1500);
  };

  return (
    <div style={{
      background: T.bg, minHeight: "100vh", color: T.textMain,
      fontFamily: "'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth: 430, margin: "0 auto", paddingBottom: 90,
    }}>
      <style>{`
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes popIn    { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes tickerSlide { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        button { font-family: inherit; cursor: pointer; border: none; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)",
        padding: "14px 20px 0",
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: `1px solid ${T.border}`,
        boxShadow: "0 2px 12px rgba(11,31,75,0.05)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: T.navy, letterSpacing: -0.5 }}>
            Live & Social
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ width: 38, height: 38, borderRadius: 11, background: T.navyLight,
              border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="search" size={16} color={T.navy}/>
            </button>
            <button style={{ width: 38, height: 38, borderRadius: 11, background: T.navyLight,
              border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative" }}>
              <Icon name="bell" size={16} color={T.navy}/>
              <div style={{ position: "absolute", top: 8, right: 8, width: 7, height: 7,
                background: T.red, borderRadius: "50%", border: `1.5px solid ${T.white}` }}/>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0 }}>
          {["following","for_you"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "12px 0", background: "none", border: "none",
              fontSize: 14, fontWeight: tab === t ? 900 : 600,
              color: tab === t ? T.navy : T.textMute,
              borderBottom: `2.5px solid ${tab === t ? T.gold : "transparent"}`,
              transition: "all 0.2s", letterSpacing: -0.2,
            }}>
              {t === "following" ? "Following" : "For You"}
            </button>
          ))}
        </div>
      </div>

      {/* ── PURCHASE NOTIFICATION ── */}
      {purchase && (
        <div style={{
          margin: "12px 16px 0",
          background: T.greenBg, border: `1px solid ${T.green}33`,
          borderRadius: 14, padding: "11px 16px",
          display: "flex", alignItems: "center", gap: 10,
          animation: "slideIn 0.3s ease",
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 8,
            background: T.green + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="check" size={16} color={T.green}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: T.green }}>Happy Buyer just purchased</div>
            <div style={{ fontSize: 11, color: T.textMid, fontWeight: 600 }}>iPhone 15 Pro Max · Just now</div>
          </div>
          <button onClick={() => setPurchase(false)} style={{
            background: "none", border: "none", fontSize: 16, color: T.textMute, padding: 4,
          }}>×</button>
        </div>
      )}

      {/* ── FEATURED LIVE CARD ── */}
      <div style={{ margin: "14px 16px 0" }}>
        <div style={{
          borderRadius: 24, overflow: "hidden",
          boxShadow: T.shadowMd, position: "relative",
          background: `linear-gradient(160deg,#0A0F2A 0%,#1A0A4B 50%,#0A1A3A 100%)`,
          minHeight: 380,
        }}>
          {/* Background product visual */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: 0.12,
          }}>
            <Icon name="laptop" size={180} color="#fff"/>
          </div>

          {/* Gradient overlay bottom */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "65%",
            background: "linear-gradient(to top,rgba(0,0,0,0.92),transparent)",
          }}/>

          {/* Top bar inside card */}
          <div style={{
            position: "absolute", top: 14, left: 14, right: 14,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            {/* Seller info */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 13,
                  background: "linear-gradient(135deg,#1D4ED8,#2563EB)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, fontWeight: 900, color: "#fff",
                  border: "2px solid rgba(255,255,255,0.3)",
                }}>MT</div>
                <div style={{
                  position: "absolute", bottom: -3, right: -3,
                  background: T.blue, borderRadius: "50%",
                  width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1.5px solid rgba(255,255,255,0.8)",
                }}>
                  <Icon name="shield" size={8} color="#fff"/>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Tech Master Store</span>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>98 Trust Score</div>
              </div>
            </div>
            {/* Live badge + viewers */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TrustBadge score={98} size="md"/>
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                background: T.red, borderRadius: 8, padding: "5px 10px",
                animation: "pulse 2s infinite",
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }}/>
                <span style={{ fontSize: 11, fontWeight: 900, color: "#fff" }}>LIVE</span>
                <Icon name="eye" size={11} color="rgba(255,255,255,0.85)"/>
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>1.2K</span>
              </div>
            </div>
          </div>

          {/* Comments feed */}
          <div ref={commentRef} style={{
            position: "absolute", bottom: 130, left: 14, right: 80,
            maxHeight: 160, overflowY: "auto",
            display: "flex", flexDirection: "column", gap: 7,
          }}>
            {comments.map((c, i) => (
              <div key={c.id} style={{
                display: "flex", gap: 7, alignItems: "flex-start",
                animation: i === comments.length - 1 ? "slideIn 0.3s ease" : "none",
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                  background: c.color + "33", border: `1.5px solid ${c.color}66`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 900, color: c.color,
                }}>
                  {c.user[0]}
                </div>
                <div style={{
                  background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
                  borderRadius: 10, padding: "6px 10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", opacity: 0.9 }}>{c.user} </span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)" }}>{c.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right action buttons */}
          <div style={{
            position: "absolute", right: 14, bottom: 130,
            display: "flex", flexDirection: "column", gap: 16, alignItems: "center",
          }}>
            {[
              { icon: "heartFill", label: "2.4K", color: T.red, action: "like" },
              { icon: "share",     label: "150",  color: "#fff", action: "share" },
              { icon: "cart",      label: "320",  color: "#fff", action: "cart" },
            ].map(btn => (
              <div key={btn.action} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <button style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                  border: "1.5px solid rgba(255,255,255,0.2)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.18s",
                }}>
                  <Icon name={btn.icon} size={18} color={btn.color}/>
                </button>
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{btn.label}</span>
              </div>
            ))}
          </div>

          {/* Bottom product info */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 14px 14px" }}>
            {/* Product row */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <div style={{
                width: 60, height: 60, borderRadius: 14,
                background: "rgba(255,255,255,0.1)", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1.5px solid rgba(255,255,255,0.2)",
              }}>
                <Icon name="laptop" size={30} color="rgba(255,255,255,0.8)"/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", marginBottom: 3, lineHeight: 1.3 }}>
                  iPhone 15 Pro Max 256GB
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: T.goldMid, fontFamily: "monospace" }}>
                    {fmt(1650000)}
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "line-through", fontFamily: "monospace" }}>
                    {fmt(1800000)}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button onClick={() => handleCart("main")} style={{
              width: "100%", padding: "14px 0", borderRadius: 16,
              background: cartAdded["main"]
                ? `linear-gradient(135deg,${T.green},#0A5C3A)`
                : `linear-gradient(135deg,${T.gold},#A07008)`,
              border: "none", color: "#fff", fontSize: 14, fontWeight: 900,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8,
              transition: "all 0.25s",
              boxShadow: cartAdded["main"] ? `0 6px 20px ${T.green}55` : `0 6px 20px ${T.gold}55`,
            }}>
              <Icon name={cartAdded["main"] ? "check" : "zap"} size={18} color="#fff"/>
              {cartAdded["main"] ? "Added to Cart!" : "Buy Now"}
            </button>
          </div>
        </div>
      </div>

      {/* ── SOCIAL FEED POSTS ── */}
      <div style={{ margin: "20px 16px 0" }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: T.textMain,
          letterSpacing: -0.3, marginBottom: 14 }}>
          {tab === "following" ? "From Sellers You Follow" : "Trending For You"}
        </div>

        {FEED_POSTS.map(post => (
          <div key={post.id} style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 22, marginBottom: 16, overflow: "hidden",
            boxShadow: T.shadow, animation: "fadeUp 0.3s ease",
          }}>
            {/* Seller header */}
            <div style={{ padding: "16px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                <div style={{ position: "relative" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 13,
                    background: `linear-gradient(135deg,${post.color}22,${post.color}44)`,
                    border: `2px solid ${post.color}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 900, color: post.color,
                  }}>{post.initials}</div>
                  {post.verified && (
                    <div style={{
                      position: "absolute", bottom: -3, right: -3,
                      width: 16, height: 16, borderRadius: "50%",
                      background: T.blue, border: `1.5px solid ${T.white}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon name="shield" size={8} color="#fff"/>
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: T.textMain }}>{post.seller}</span>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 3,
                      background: T.greenBg, borderRadius: 6, padding: "1px 6px",
                    }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.green }}/>
                      <span style={{ fontSize: 10, fontWeight: 800, color: T.green }}>{post.trust}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: T.textMute }}>{post.followers} followers</div>
                </div>
              </div>
              <button onClick={() => setFollowing(f => ({ ...f, [post.id]: !f[post.id] }))} style={{
                padding: "7px 16px", borderRadius: 10,
                background: following[post.id] ? T.navyLight : `linear-gradient(135deg,${T.navy},${T.navyMid})`,
                border: following[post.id] ? `1px solid ${T.border}` : "none",
                color: following[post.id] ? T.textMid : "#fff",
                fontSize: 12, fontWeight: 800, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s",
              }}>
                <Icon name={following[post.id] ? "check" : "userPlus"} size={13}
                  color={following[post.id] ? T.textMid : "#fff"}/>
                {following[post.id] ? "Following" : "Follow"}
              </button>
            </div>

            {/* Product image area */}
            <div style={{
              margin: "0 16px", borderRadius: 18, overflow: "hidden",
              background: `linear-gradient(135deg,${post.color}0A,${post.color}18)`,
              border: `1px solid ${post.color}18`,
              height: 180, display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <Icon name={post.icon} size={80} color={post.color + "44"}/>
              {/* Tag badge */}
              <div style={{
                position: "absolute", top: 12, left: 12,
                background: post.tag === "New Arrival" ? T.purple : T.gold,
                color: "#fff", borderRadius: 8, padding: "3px 10px",
                fontSize: 11, fontWeight: 800,
              }}>{post.tag}</div>
              {/* Wishlist */}
              <button onClick={() => setLikes(l => ({ ...l, [`w${post.id}`]: !l[`w${post.id}`] }))} style={{
                position: "absolute", top: 12, right: 12,
                width: 34, height: 34, borderRadius: "50%",
                background: "rgba(255,255,255,0.9)", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}>
                <Icon name={likes[`w${post.id}`] ? "heartFill" : "heart"} size={15}
                  color={likes[`w${post.id}`] ? T.red : T.textMute}/>
              </button>
            </div>

            {/* Product info */}
            <div style={{ padding: "14px 16px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: T.textMain, marginBottom: 4 }}>
                    {post.product}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Icon name="star" size={12} color={T.gold}/>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.textMid }}>{post.rating}</span>
                    <span style={{ fontSize: 11, color: T.textMute }}>({post.reviews} reviews)</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: T.navy,
                    fontFamily: "monospace", letterSpacing: -0.3 }}>{fmt(post.price)}</div>
                  {post.original && (
                    <div style={{ fontSize: 11, color: T.textMute,
                      textDecoration: "line-through", fontFamily: "monospace" }}>{fmt(post.original)}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div style={{
              padding: "12px 16px 16px",
              display: "flex", gap: 8, alignItems: "center",
            }}>
              <button onClick={() => setLikes(l => ({ ...l, [post.id]: !l[post.id] }))} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: likes[post.id] ? T.redBg : T.navyLight,
                border: `1px solid ${likes[post.id] ? T.red + "33" : T.border}`,
                borderRadius: 10, padding: "9px 14px", cursor: "pointer",
                transition: "all 0.18s",
              }}>
                <Icon name={likes[post.id] ? "heartFill" : "heart"} size={15}
                  color={likes[post.id] ? T.red : T.textMid}/>
                <span style={{ fontSize: 12, fontWeight: 700,
                  color: likes[post.id] ? T.red : T.textMid }}>
                  {post.likes + (likes[post.id] ? 1 : 0)}
                </span>
              </button>
              <button style={{
                display: "flex", alignItems: "center", gap: 6,
                background: T.navyLight, border: `1px solid ${T.border}`,
                borderRadius: 10, padding: "9px 14px", cursor: "pointer",
              }}>
                <Icon name="share" size={15} color={T.textMid}/>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.textMid }}>{post.shares}</span>
              </button>
              <button onClick={() => handleCart(post.id)} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                background: cartAdded[post.id]
                  ? `linear-gradient(135deg,${T.green},#0A5C3A)`
                  : `linear-gradient(135deg,${T.gold},#A07008)`,
                border: "none", borderRadius: 10, padding: "9px 0",
                color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer",
                transition: "all 0.25s",
              }}>
                <Icon name={cartAdded[post.id] ? "check" : "cart"} size={15} color="#fff"/>
                {cartAdded[post.id] ? "Added!" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── MORE LIVE STREAMS ── */}
      <div style={{ margin: "8px 0 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "0 16px", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%",
              background: T.red, animation: "pulse 1.2s infinite" }}/>
            <span style={{ fontSize: 16, fontWeight: 900, color: T.textMain, letterSpacing: -0.3 }}>
              More Live Streams
            </span>
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "none", border: "none",
            fontSize: 12, fontWeight: 700, color: T.navy, cursor: "pointer",
          }}>
            See all <Icon name="chevronRight" size={14} color={T.navy}/>
          </button>
        </div>

        <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 16px", paddingBottom: 4 }}>
          {MORE_LIVES.map(live => (
            <div key={live.id} style={{
              minWidth: 130, borderRadius: 18, overflow: "hidden",
              background: T.card, border: `1px solid ${T.border}`,
              boxShadow: T.shadow, flexShrink: 0, cursor: "pointer",
            }}>
              <div style={{
                height: 100,
                background: `linear-gradient(135deg,${live.color}18,${live.color}28)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <Icon name={live.icon} size={40} color={live.color + "66"}/>
                {/* Live badge */}
                <div style={{
                  position: "absolute", top: 7, left: 7,
                  display: "flex", alignItems: "center", gap: 3,
                  background: T.red, borderRadius: 6, padding: "2px 6px",
                }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff",
                    animation: "pulse 1s infinite" }}/>
                  <span style={{ fontSize: 9, fontWeight: 900, color: "#fff" }}>LIVE</span>
                </div>
                {/* Trust */}
                <div style={{ position: "absolute", top: 7, right: 7 }}>
                  <TrustBadge score={live.trust} size="sm"/>
                </div>
                {/* Viewers */}
                <div style={{
                  position: "absolute", bottom: 6, right: 6,
                  display: "flex", alignItems: "center", gap: 3,
                  background: "rgba(0,0,0,0.5)", borderRadius: 6, padding: "2px 6px",
                }}>
                  <Icon name="eye" size={9} color="rgba(255,255,255,0.8)"/>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{live.viewers}</span>
                </div>
              </div>
              <div style={{ padding: "8px 10px 10px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: T.textMain, lineHeight: 1.3 }}>
                  {live.seller}
                </div>
                <button style={{
                  marginTop: 7, width: "100%", padding: "6px 0", borderRadius: 8,
                  background: T.navyLight, border: `1px solid ${T.border}`,
                  fontSize: 10, fontWeight: 800, color: T.navy, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                }}>
                  <Icon name="video" size={11} color={T.navy}/> Watch
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── GIFT / COUPON BANNER ── */}
      <div style={{ margin: "20px 16px 0" }}>
        <div style={{
          background: `linear-gradient(135deg,${T.gold} 0%,#A07008 100%)`,
          borderRadius: 20, padding: "18px 20px",
          display: "flex", alignItems: "center", gap: 14,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -16, right: -16, width: 80, height: 80,
            borderRadius: "50%", background: "rgba(255,255,255,0.08)" }}/>
          <div style={{ width: 48, height: 48, borderRadius: 14,
            background: "rgba(255,255,255,0.2)", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="gift" size={26} color="#fff"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", marginBottom: 3 }}>
              Live Shopping Coupons
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
              Watch live streams to unlock exclusive discounts up to 40% off
            </div>
          </div>
          <Icon name="chevronRight" size={18} color="rgba(255,255,255,0.7)"/>
        </div>
      </div>

      <BottomNav active="discover"/>
    </div>
  );
}

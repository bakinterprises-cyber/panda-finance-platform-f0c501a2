import { useState, useEffect, createContext, useContext } from "react";

// ============================================================
// 🧱 BRICK 18 — FULL MARKETPLACE ASSEMBLY
// 🏗️  Panda Finance — Tanzania's AI Financial Operating System
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🤖  AI hooks marked with:            // 🤖 AI
// 🔐  Security notes marked with:      // 🔐 SECURITY
// ============================================================
// ASSEMBLY CHECKLIST:
// [ ] Import all 23 bricks from their respective files
// [ ] Replace all MOCK_* with real Supabase queries
// [ ] Wire all onNavigate props to navigate()
// [ ] Connect 💰 WALLET points to PandaWallet module
// [ ] Connect 🤖 AI points to Supabase Edge Functions
// [ ] Set up Supabase Realtime channels
// [ ] Add loading skeletons & error boundaries
// [ ] Test full buyer flow: Browse→Product→Chat→Buy→Track→Confirm
// [ ] Test full seller flow: Verify→List→Order→Ship→Paid
// ============================================================

// ─── Design Tokens ────────────────────────────────────────────
const T = {
  navy:      "#0B1F4B",
  navyMid:   "#1A3A6E",
  navyLight: "#EEF2FF",
  gold:      "#C9960A",
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
  purple:    "#6D28D9",
  purpleBg:  "#F5F3FF",
  blue:      "#1D4ED8",
  amber:     "#B45309",
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
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    arrowLeft:    <><line x1="19" y1="12" x2="5" y2="12" {...s}/><polyline points="12 19 5 12 12 5" {...s}/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    bell:         <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...s}/><path d="M13.73 21a2 2 0 0 1-3.46 0" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    settings:     <><circle cx="12" cy="12" r="3" {...s}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" {...s}/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    search:       <><circle cx="11" cy="11" r="8" {...s}/><line x1="21" y1="21" x2="16.65" y2="16.65" {...s}/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ============================================================
// 🌐 MARKETPLACE CONTEXT — Shared state across all bricks
// ============================================================
const MarketplaceContext = createContext(null);
const useMarketplace = () => useContext(MarketplaceContext);

// ============================================================
// 👤 AUTH SWAP POINT
// Replace MOCK_USER with: const { data:{ user } } = await supabase.auth.getUser()
// Then fetch profile: supabase.from('panda_profiles').select('*').eq('user_id', user.id)
// ============================================================
const MOCK_USER = {
  id:           "user-001",
  name:         "BAK",
  initials:     "B",
  phone:        "+255 712 345 678",
  isSeller:     true,
  sellerId:     "SEL-001",
  sellerName:   "Tech Master Store",
  trustScore:   98,
  tier:         "gold",
};

// ============================================================
// 💰 WALLET SWAP POINT
// Replace MOCK_WALLET with: PandaWallet.getBalance(user.id)
// supabase.from('wallets').select('*').eq('user_id', user.id).single()
// ============================================================
const MOCK_WALLET = {
  balance:     842500,
  pandaPoints: 3420,
  escrowHeld:  1650000,
};

// ============================================================
// 🔔 NOTIFICATION SWAP POINT
// Replace with: supabase.channel('notifications')
//   .on('postgres_changes', { event:'INSERT', table:'notifications',
//        filter:`user_id=eq.${user.id}` }, addNotification)
//   .subscribe()
// ============================================================
const MOCK_NOTIFICATIONS = [
  { id:1, type:"order",   title:"New Order!",          body:"Hassan ordered iPhone 15 Pro Max",    time:"5m",  read:false },
  { id:2, type:"message", title:"New Message",          body:"Amina: Is this still available?",    time:"12m", read:false },
  { id:3, type:"escrow",  title:"Payment Released",     body:"TSh 350,000 released for AirPods",   time:"1h",  read:true  },
  { id:4, type:"review",  title:"New Review ⭐⭐⭐⭐⭐", body:"Peter rated you 5 stars!",          time:"2h",  read:true  },
];

// ─── Bottom Nav ───────────────────────────────────────────────
function BottomNav({ activeTab, setActiveTab, cartCount, msgCount }) {
  const items = [
    { id:"home",     icon:"home",    label:"Home"     },
    { id:"discover", icon:"compass", label:"Discover" },
    { id:"create",   icon:"plus",    label:""         },
    { id:"messages", icon:"message", label:"Messages", badge:msgCount  },
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
        const isActive = item.id === activeTab;
        if (isCenter) return (
          <div key={item.id} onClick={() => setActiveTab("create")} style={{
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
          <div key={item.id} onClick={() => setActiveTab(item.id)} style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            gap:3, cursor:"pointer", minWidth:44, padding:"4px 0",
            position:"relative",
          }}>
            <Icon name={item.icon} size={20} color={isActive ? T.navy : T.textMute}/>
            <span style={{ fontSize:10, fontWeight:isActive?800:500,
              color:isActive?T.navy:T.textMute }}>{item.label}</span>
            {isActive && <div style={{ width:4, height:4, borderRadius:"50%", background:T.gold }}/>}
            {item.badge > 0 && (
              <div style={{ position:"absolute", top:0, right:4,
                minWidth:16, height:16, borderRadius:99,
                background:T.red, border:`2px solid ${T.white}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                padding:"0 4px" }}>
                <span style={{ fontSize:8, fontWeight:900, color:"#fff" }}>
                  {item.badge}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// 🏠 SCREEN: HOME
// 🧭 → Brick 17 (MarketplaceHome) in production
// ============================================================
function HomeScreen({ navigate }) {
  const { user, wallet, notifications } = useMarketplace();
  const unread = notifications.filter(n => !n.read).length;
  const QUICK_ACTIONS = [
    { label:"Browse",    icon:"compass",  screen:"discover",    color:T.blue   },
    { label:"My Orders", icon:"package",  screen:"orders",      color:T.green  },
    { label:"Messages",  icon:"message",  screen:"messages",    color:T.purple },
    { label:"Escrow",    icon:"shield",   screen:"escrow",      color:T.gold   },
    { label:"Sell",      icon:"barChart", screen:"command",     color:T.navy   },
    { label:"Go Live",   icon:"zap",      screen:"live",        color:T.red    },
    { label:"Social",    icon:"sparkle",  screen:"social",      color:T.purple },
    { label:"Trust",     icon:"star",     screen:"trust",       color:T.amber  },
  ];
  return (
    <div style={{ background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110 }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:"52px 20px 24px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, opacity:0.05,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"20px 20px" }}/>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", position:"relative" }}>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              fontWeight:600 }}>Welcome back 🐼</div>
            <div style={{ fontSize:20, fontWeight:900, color:"#fff",
              letterSpacing:-0.3 }}>{user.name}</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <div onClick={() => navigate("wallet")} style={{
              background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.2)",
              borderRadius:12, padding:"8px 14px", cursor:"pointer",
              display:"flex", alignItems:"center", gap:7 }}>
              <Icon name="wallet" size={14} color={T.goldMid}/>
              {/* 💰 WALLET — swap with PandaWallet.getBalance() */}
              <span style={{ fontSize:12, fontWeight:900, color:T.goldMid,
                fontFamily:"monospace" }}>{fmt(wallet.balance)}</span>
            </div>
            <div onClick={() => navigate("notifications")} style={{
              width:40, height:40, borderRadius:12,
              background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", position:"relative" }}>
              <Icon name="bell" size={18} color="#fff"/>
              {unread > 0 && (
                <div style={{ position:"absolute", top:6, right:6,
                  width:8, height:8, borderRadius:"50%", background:T.red,
                  border:"1.5px solid rgba(11,31,75,0.8)" }}/>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* Trust Score pill */}
        <div onClick={() => navigate("trust")} style={{ display:"flex",
          alignItems:"center", gap:10, background:T.card,
          border:`1px solid ${T.gold}33`, borderRadius:18,
          padding:"12px 16px", marginBottom:16, cursor:"pointer",
          boxShadow:T.shadow }}>
          <div style={{ width:38, height:38, borderRadius:11,
            background:T.goldLight,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="shield" size={18} color={T.gold}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
              Panda Trust Score — Gold Seller
            </div>
            <div style={{ fontSize:11, color:T.textMute }}>
              {/* 🔌 BACKEND — trust_scores table */}
              Score: {user.trustScore}/100 · +5 points this month
            </div>
          </div>
          <Icon name="chevronRight" size={14} color={T.textMute}/>
        </div>

        {/* Quick actions grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          gap:10, marginBottom:16 }}>
          {QUICK_ACTIONS.map(action => (
            <div key={action.screen} onClick={() => navigate(action.screen)}
              style={{ background:T.card, borderRadius:18, padding:"14px 8px",
                textAlign:"center", border:`1px solid ${T.border}`,
                boxShadow:T.shadow, cursor:"pointer" }}>
              <div style={{ width:38, height:38, borderRadius:12,
                background:action.color+"14",
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 8px" }}>
                <Icon name={action.icon} size={18} color={action.color}/>
              </div>
              <div style={{ fontSize:9, fontWeight:800, color:T.textMid,
                textTransform:"uppercase", letterSpacing:0.3 }}>
                {action.label}
              </div>
            </div>
          ))}
        </div>

        {/* Escrow held card */}
        {wallet.escrowHeld > 0 && (
          <div onClick={() => navigate("escrow")}
            style={{ background:T.goldLight, border:`1px solid ${T.gold}33`,
              borderRadius:18, padding:"14px 18px", marginBottom:16,
              display:"flex", gap:12, alignItems:"center", cursor:"pointer" }}>
            <Icon name="lock" size={20} color={T.gold}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                Funds in Escrow
              </div>
              <div style={{ fontSize:13, fontWeight:900, color:T.gold,
                fontFamily:"monospace" }}>{fmt(wallet.escrowHeld)}</div>
            </div>
            <Icon name="chevronRight" size={14} color={T.gold}/>
          </div>
        )}

        {/* Notifications preview */}
        <div style={{ background:T.card, borderRadius:22,
          border:`1px solid ${T.border}`, boxShadow:T.shadow,
          overflow:"hidden", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", padding:"14px 16px",
            borderBottom:`1px solid ${T.border}` }}>
            <span style={{ fontSize:14, fontWeight:900, color:T.textMain }}>
              Recent Activity
            </span>
            {unread > 0 && (
              <div style={{ background:T.red, borderRadius:99,
                padding:"2px 8px" }}>
                <span style={{ fontSize:10, fontWeight:900,
                  color:"#fff" }}>{unread} new</span>
              </div>
            )}
          </div>
          {notifications.slice(0,3).map((n,i) => {
            const colors = { order:T.green, message:T.blue, escrow:T.gold, review:T.purple };
            const icons  = { order:"package", message:"message", escrow:"shield", review:"star" };
            return (
              <div key={n.id} style={{ display:"flex", gap:12,
                alignItems:"center", padding:"12px 16px",
                borderBottom:i<2?`1px solid ${T.border}`:"none",
                background:!n.read?"rgba(11,31,75,0.02)":"transparent" }}>
                <div style={{ width:36, height:36, borderRadius:10, flexShrink:0,
                  background:colors[n.type]+"14",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={icons[n.type]} size={16} color={colors[n.type]}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:n.read?600:800,
                    color:T.textMain }}>{n.title}</div>
                  <div style={{ fontSize:11, color:T.textMute,
                    overflow:"hidden", textOverflow:"ellipsis",
                    whiteSpace:"nowrap" }}>{n.body}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column",
                  alignItems:"flex-end", gap:4, flexShrink:0 }}>
                  <span style={{ fontSize:10, color:T.textMute }}>{n.time}</span>
                  {!n.read && <div style={{ width:6, height:6, borderRadius:"50%",
                    background:T.blue }}/>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Panda Finance modules */}
        <div style={{ background:T.card, borderRadius:22,
          border:`1px solid ${T.border}`, boxShadow:T.shadow,
          padding:"18px 20px" }}>
          <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
            marginBottom:14 }}>Panda Finance Suite</div>
          {[
            { label:"Panda Wallet",      icon:"wallet",   status:"Active",   color:T.green  },
            { label:"Panda Marketplace", icon:"compass",  status:"Active",   color:T.green  },
            { label:"Panda Credit",      icon:"award",    status:"Coming",   color:T.amber  },
            { label:"Panda Investments", icon:"barChart", status:"Coming",   color:T.amber  },
            { label:"Farmer Hub",        icon:"star",     status:"Coming",   color:T.amber  },
          ].map((m,i,arr) => (
            <div key={m.label} style={{ display:"flex", gap:12,
              alignItems:"center", paddingBottom:i<arr.length-1?12:0,
              marginBottom:i<arr.length-1?12:0,
              borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
              <div style={{ width:34, height:34, borderRadius:10, flexShrink:0,
                background:m.color+"14",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name={m.icon} size={16} color={m.color}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                  {m.label}
                </div>
              </div>
              <div style={{ background:m.color+"18",
                border:`1px solid ${m.color}33`,
                borderRadius:8, padding:"2px 9px" }}>
                <span style={{ fontSize:10, fontWeight:800,
                  color:m.color }}>{m.status}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ============================================================
// 🗺️ SCREEN DIRECTORY — All 23 bricks
// In production, replace each placeholder with the real brick import
// ============================================================
function ScreenDirectory({ navigate }) {
  const BUYER_SCREENS = [
    { screen:"market-home",  label:"Marketplace Home",       brick:"Brick 17", icon:"compass",  color:T.blue   },
    { screen:"product",      label:"Product Details",        brick:"Brick 3",  icon:"package",  color:T.navy   },
    { screen:"seller",       label:"Seller Profile",         brick:"Brick 4",  icon:"user",     color:T.purple },
    { screen:"live",         label:"Live Shopping Feed",     brick:"Brick 2",  icon:"zap",      color:T.red    },
    { screen:"chat",         label:"Marketplace Chat",       brick:"Brick 6",  icon:"message",  color:T.blue   },
    { screen:"track",        label:"Order Tracking",         brick:"Brick 8",  icon:"truck",    color:T.teal   },
    { screen:"restaurant",   label:"Restaurant Ordering",    brick:"Brick 9",  icon:"star",     color:T.orange },
    { screen:"hotel",        label:"Hotel Reservations",     brick:"Brick 10", icon:"home",     color:T.teal   },
    { screen:"b2b",          label:"B2B Procurement",        brick:"Brick 11", icon:"settings", color:T.amber  },
    { screen:"social",       label:"Social Commerce",        brick:"Brick 15", icon:"sparkle",  color:T.purple },
    { screen:"escrow",       label:"Escrow System",          brick:"Brick 14", icon:"shield",   color:T.gold   },
    { screen:"trust",        label:"Trust Score",            brick:"Brick 13", icon:"award",    color:T.gold   },
    { screen:"wallet",       label:"Wallet Integration",     brick:"Brick 16", icon:"wallet",   color:T.green  },
  ];
  const SELLER_SCREENS = [
    { screen:"command",      label:"Seller Command Center",  brick:"Brick 5",  icon:"barChart", color:T.navy   },
    { screen:"ai-dashboard", label:"AI Seller Dashboard",   brick:"Brick 12", icon:"sparkle",  color:T.purple },
    { screen:"orders",       label:"Order Management",       brick:"Brick 8B", icon:"package",  color:T.green  },
    { screen:"verify",       label:"Business Verification",  brick:"Brick 7",  icon:"shield",   color:T.blue   },
    { screen:"profile-edit", label:"Profile Editor",         brick:"Brick 4B", icon:"settings", color:T.navy   },
    { screen:"live-stream",  label:"Live Broadcaster",       brick:"Brick 2B", icon:"zap",      color:T.red    },
    { screen:"rest-owner",   label:"Restaurant Dashboard",   brick:"Brick 9B", icon:"star",     color:T.orange },
    { screen:"hotel-owner",  label:"Hotel Dashboard",        brick:"Brick 10B",icon:"home",     color:T.teal   },
    { screen:"b2b-supplier", label:"B2B Supplier Hub",       brick:"Brick 11B",icon:"settings", color:T.amber  },
  ];
  return (
    <div style={{ background:T.bg, minHeight:"100vh", paddingBottom:110,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto" }}>
      <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:"52px 20px 20px" }}>
        <div style={{ fontSize:18, fontWeight:900, color:"#fff",
          letterSpacing:-0.3 }}>All Screens</div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)",
          marginTop:3 }}>23 bricks assembled</div>
      </div>
      <div style={{ padding:"16px 20px 0" }}>
        <div style={{ fontSize:13, fontWeight:900, color:T.textMute,
          textTransform:"uppercase", letterSpacing:0.8,
          marginBottom:10 }}>Buyer Screens</div>
        <div style={{ background:T.card, borderRadius:22,
          border:`1px solid ${T.border}`, overflow:"hidden",
          marginBottom:16, boxShadow:T.shadow }}>
          {BUYER_SCREENS.map((s,i) => (
            <div key={s.screen} onClick={() => navigate(s.screen)}
              style={{ display:"flex", gap:12, alignItems:"center",
                padding:"12px 16px",
                borderBottom:i<BUYER_SCREENS.length-1?`1px solid ${T.border}`:"none",
                cursor:"pointer" }}>
              <div style={{ width:34, height:34, borderRadius:10, flexShrink:0,
                background:s.color+"14",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name={s.icon} size={15} color={s.color}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                  {s.label}
                </div>
                <div style={{ fontSize:10, color:T.textMute }}>{s.brick}</div>
              </div>
              <Icon name="chevronRight" size={14} color={T.textMute}/>
            </div>
          ))}
        </div>
        <div style={{ fontSize:13, fontWeight:900, color:T.textMute,
          textTransform:"uppercase", letterSpacing:0.8,
          marginBottom:10 }}>Seller Screens</div>
        <div style={{ background:T.card, borderRadius:22,
          border:`1px solid ${T.border}`, overflow:"hidden",
          marginBottom:16, boxShadow:T.shadow }}>
          {SELLER_SCREENS.map((s,i) => (
            <div key={s.screen} onClick={() => navigate(s.screen)}
              style={{ display:"flex", gap:12, alignItems:"center",
                padding:"12px 16px",
                borderBottom:i<SELLER_SCREENS.length-1?`1px solid ${T.border}`:"none",
                cursor:"pointer" }}>
              <div style={{ width:34, height:34, borderRadius:10, flexShrink:0,
                background:s.color+"14",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name={s.icon} size={15} color={s.color}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                  {s.label}
                </div>
                <div style={{ fontSize:10, color:T.textMute }}>{s.brick}</div>
              </div>
              <Icon name="chevronRight" size={14} color={T.textMute}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 📱 SCREEN PLACEHOLDER
// In production replace with real brick import
// e.g. import ProductDetails from './Brick3-ProductDetails'
// ============================================================
function ScreenPlaceholder({ screen, navigate }) {
  const screenMap = {
    "market-home":  { label:"Marketplace Home",       brick:"Brick 17", color:T.blue   },
    "product":      { label:"Product Details",         brick:"Brick 3",  color:T.navy   },
    "seller":       { label:"Seller Profile",          brick:"Brick 4",  color:T.purple },
    "live":         { label:"Live Shopping Feed",      brick:"Brick 2",  color:T.red    },
    "chat":         { label:"Marketplace Chat",        brick:"Brick 6",  color:T.blue   },
    "track":        { label:"Order Tracking",          brick:"Brick 8",  color:T.teal   },
    "restaurant":   { label:"Restaurant Ordering",     brick:"Brick 9",  color:T.orange },
    "hotel":        { label:"Hotel Reservations",      brick:"Brick 10", color:T.teal   },
    "b2b":          { label:"B2B Procurement",         brick:"Brick 11", color:T.amber  },
    "social":       { label:"Social Commerce",         brick:"Brick 15", color:T.purple },
    "escrow":       { label:"Escrow System",           brick:"Brick 14", color:T.gold   },
    "trust":        { label:"Trust Score System",      brick:"Brick 13", color:T.gold   },
    "wallet":       { label:"Wallet Integration",      brick:"Brick 16", color:T.green  },
    "command":      { label:"Seller Command Center",   brick:"Brick 5",  color:T.navy   },
    "ai-dashboard": { label:"AI Seller Dashboard",    brick:"Brick 12", color:T.purple },
    "orders":       { label:"Order Management",        brick:"Brick 8B", color:T.green  },
    "verify":       { label:"Business Verification",   brick:"Brick 7",  color:T.blue   },
    "profile-edit": { label:"Profile Editor",          brick:"Brick 4B", color:T.navy   },
    "live-stream":  { label:"Live Broadcaster",        brick:"Brick 2B", color:T.red    },
    "rest-owner":   { label:"Restaurant Dashboard",    brick:"Brick 9B", color:T.orange },
    "hotel-owner":  { label:"Hotel Dashboard",         brick:"Brick 10B",color:T.teal   },
    "b2b-supplier": { label:"B2B Supplier Hub",        brick:"Brick 11B",color:T.amber  },
    "notifications":{ label:"Notifications",           brick:"System",   color:T.navy   },
  };
  const info = screenMap[screen] || { label:screen, brick:"Unknown", color:T.navy };
  return (
    <div style={{ background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110 }}>
      {/* Top bar */}
      <div style={{ background:"rgba(255,255,255,0.96)", backdropFilter:"blur(16px)",
        padding:"14px 20px", borderBottom:`1px solid ${T.border}`,
        display:"flex", alignItems:"center", gap:14, position:"sticky",
        top:0, zIndex:100 }}>
        <button onClick={() => navigate("home")} style={{
          width:40, height:40, borderRadius:12, background:T.navyLight,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="arrowLeft" size={18} color={T.navy}/>
        </button>
        <div>
          <div style={{ fontSize:15, fontWeight:800, color:T.textMain }}>
            {info.label}
          </div>
          <div style={{ fontSize:11, color:T.textMute }}>{info.brick}</div>
        </div>
      </div>
      {/* Content */}
      <div style={{ display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        minHeight:"70vh", padding:"40px 24px", textAlign:"center" }}>
        <div style={{ width:80, height:80, borderRadius:22, flexShrink:0,
          background:info.color+"14",
          display:"flex", alignItems:"center", justifyContent:"center",
          marginBottom:20, fontSize:36 }}>🐼</div>
        <div style={{ fontSize:20, fontWeight:900, color:T.textMain,
          marginBottom:8 }}>{info.label}</div>
        <div style={{ fontSize:14, color:T.textMute, lineHeight:1.7,
          marginBottom:24, maxWidth:300 }}>
          {info.brick} is ready. In assembly, import and render the real component here.
        </div>
        {/* Assembly code snippet */}
        <div style={{ background:T.navy, borderRadius:16, padding:"16px 18px",
          width:"100%", textAlign:"left", marginBottom:20 }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)",
            fontFamily:"monospace", marginBottom:6 }}>
            // 🔌 Assembly wiring
          </div>
          <div style={{ fontSize:11, color:T.goldMid, fontFamily:"monospace",
            lineHeight:1.7 }}>
            {`import ${info.label.replace(/ /g,"")} from`}<br/>
            {`  './${info.brick}-${info.label.replace(/ /g,"")}'`}<br/><br/>
            {`<${info.label.replace(/ /g,"")}`}<br/>
            {`  currentUser={user}`}<br/>
            {`  onBack={() => navigate("home")}`}<br/>
            {`  onNavigate={navigate}`}<br/>
            {`/>`}
          </div>
        </div>
        <button onClick={() => navigate("home")} style={{
          padding:"13px 32px", borderRadius:16,
          background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
          border:"none", color:"#fff", fontSize:13, fontWeight:800,
          cursor:"pointer", boxShadow:`0 6px 20px ${T.navy}44` }}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 🧱 MAIN ASSEMBLY — PandaMarketplace
// This is the root component that wires all bricks together
// ============================================================
export default function App() {
  const [screen,        setScreen]        = useState("home");
  const [screenHistory, setScreenHistory] = useState(["home"]);
  const [user]                            = useState(MOCK_USER);
  const [wallet,        setWallet]        = useState(MOCK_WALLET);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [cart,          setCart]          = useState([]);
  const [activeTab,     setActiveTab]     = useState("home");

  // 🔌 BACKEND — set up Supabase Realtime on mount
  // useEffect(() => {
  //   const channel = supabase.channel('notifications')
  //     .on('postgres_changes', {
  //       event: 'INSERT', schema: 'public', table: 'notifications',
  //       filter: `user_id=eq.${user.id}`
  //     }, payload => {
  //       setNotifications(prev => [payload.new, ...prev]);
  //     })
  //     .subscribe()
  //   return () => supabase.removeChannel(channel)
  // }, [user.id])

  // 🧭 NAVIGATE — central navigation function
  const navigate = (to, params = {}) => {
    setScreenHistory(h => [...h, to]);
    setScreen(to);
    // Sync bottom nav tab
    const tabMap = {
      home:"home", discover:"discover", "market-home":"discover",
      messages:"messages", chat:"messages",
      wallet:"wallet", escrow:"wallet",
      profile:"profile", "profile-edit":"profile",
      command:"profile", "ai-dashboard":"profile",
    };
    if (tabMap[to]) setActiveTab(tabMap[to]);
  };

  const goBack = () => {
    const prev = screenHistory[screenHistory.length - 2] || "home";
    setScreenHistory(h => h.slice(0,-1));
    setScreen(prev);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const tabScreens = {
      home:"home", discover:"market-home",
      messages:"chat", wallet:"wallet",
      profile:"profile", create:"live-stream",
    };
    if (tabScreens[tab]) navigate(tabScreens[tab]);
  };

  const msgCount = notifications.filter(n => n.type === "message" && !n.read).length;

  // ── CONTEXT VALUE ──
  const ctxValue = {
    user, wallet, setWallet,
    notifications, setNotifications,
    cart, setCart,
    navigate, goBack,
  };

  // ── PROFILE SCREEN ──
  const ProfileScreen = () => (
    <div style={{ background:T.bg, minHeight:"100vh", paddingBottom:110,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto" }}>
      <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:"52px 20px 28px" }}>
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          <div style={{ width:64, height:64, borderRadius:18,
            background:`linear-gradient(135deg,${T.gold}44,${T.gold}88)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:24, fontWeight:900, color:"#fff" }}>{user.initials}</div>
          <div>
            <div style={{ fontSize:18, fontWeight:900, color:"#fff" }}>{user.name}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)",
              marginTop:3 }}>{user.phone}</div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:5,
              background:"rgba(201,150,10,0.25)", borderRadius:8,
              padding:"2px 9px", marginTop:6 }}>
              <Icon name="award" size={11} color={T.goldMid}/>
              <span style={{ fontSize:10, fontWeight:800,
                color:T.goldMid }}>Gold Seller · {user.trustScore}/100</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding:"16px 20px 0" }}>
        {[
          { label:"Seller Command Center", screen:"command",      icon:"barChart", color:T.navy   },
          { label:"AI Seller Dashboard",   screen:"ai-dashboard", icon:"sparkle",  color:T.purple },
          { label:"Order Management",      screen:"orders",       icon:"package",  color:T.green  },
          { label:"Business Verification", screen:"verify",       icon:"shield",   color:T.blue   },
          { label:"Edit Store Profile",    screen:"profile-edit", icon:"settings", color:T.amber  },
          { label:"Go Live",               screen:"live-stream",  icon:"zap",      color:T.red    },
          { label:"Trust Score",           screen:"trust",        icon:"award",    color:T.gold   },
          { label:"All Screens",           screen:"directory",    icon:"eye",      color:T.navy   },
        ].map((item, i, arr) => (
          <div key={item.screen} onClick={() => navigate(item.screen)}
            style={{ display:"flex", gap:12, alignItems:"center",
              padding:"14px 18px", background:T.card,
              borderRadius:i===0?"18px 18px 0 0":i===arr.length-1?"0 0 18px 18px":"0",
              borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none",
              cursor:"pointer",
              border:`1px solid ${T.border}`,
              marginTop:i===0?0:-1 }}>
            <div style={{ width:38, height:38, borderRadius:11, flexShrink:0,
              background:item.color+"14",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name={item.icon} size={17} color={item.color}/>
            </div>
            <span style={{ flex:1, fontSize:13, fontWeight:700,
              color:T.textMain }}>{item.label}</span>
            <Icon name="chevronRight" size={14} color={T.textMute}/>
          </div>
        ))}
      </div>
    </div>
  );

  // ── RENDER ──
  return (
    <MarketplaceContext.Provider value={ctxValue}>
      <div style={{ maxWidth:430, margin:"0 auto" }}>
        <style>{`
          @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
          @keyframes slideIn  { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
          @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
          * { box-sizing:border-box; }
          ::-webkit-scrollbar { display:none; }
          button { font-family:inherit; cursor:pointer; border:none; }
        `}</style>

        {/* ── SCREEN ROUTER ── */}
        {/* 🧭 In production: replace each ScreenPlaceholder with real brick */}
        {screen === "home"         && <HomeScreen navigate={navigate}/>}
        {screen === "profile"      && <ProfileScreen/>}
        {screen === "directory"    && <ScreenDirectory navigate={navigate}/>}

        {/* All other screens — replace with real brick imports in production */}
        {![
          "home","profile","directory",
        ].includes(screen) && (
          <ScreenPlaceholder screen={screen} navigate={navigate}/>
        )}

        {/* ── BOTTOM NAV ── */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          cartCount={cart.length}
          msgCount={msgCount}
        />
      </div>
    </MarketplaceContext.Provider>
  );
}

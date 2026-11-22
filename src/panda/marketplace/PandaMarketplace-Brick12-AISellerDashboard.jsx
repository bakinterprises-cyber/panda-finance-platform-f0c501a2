import { useState } from "react";

// ============================================================
// 🧱 BRICK 12 — AI SELLER DASHBOARD
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🤖  AI hooks marked with:            // 🤖 AI
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export AISellerDashboard from this file
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
    robot:        <><rect x="3" y="11" width="18" height="10" rx="2" {...s}/><path d="M12 11V7" {...s}/><circle cx="12" cy="5" r="2" {...s}/><line x1="8" y1="15" x2="8" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/><line x1="16" y1="15" x2="16" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    trending:     <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    trendingDown: <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" {...s}/><polyline points="17 18 23 18 23 12" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    pieChart:     <><path d="M21.21 15.89A10 10 0 1 1 8 2.83" {...s}/><path d="M22 12A10 10 0 0 0 12 2v10z" {...s}/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    send:         <><line x1="22" y1="2" x2="11" y2="13" {...s}/><polygon points="22 2 15 22 11 13 2 9 22 2" {...s}/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    tag:          <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" {...s}/><line x1="7" y1="7" x2="7.01" y2="7" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    arrowUp:      <><line x1="12" y1="19" x2="12" y2="5" {...s}/><polyline points="5 12 12 5 19 12" {...s}/></>,
    arrowDown:    <><line x1="12" y1="5" x2="12" y2="19" {...s}/><polyline points="19 12 12 19 5 12" {...s}/></>,
    lightbulb:    <><path d="M9 18h6" {...s}/><path d="M10 22h4" {...s}/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" {...s}/></>,
    target:       <><circle cx="12" cy="12" r="10" {...s}/><circle cx="12" cy="12" r="6" {...s}/><circle cx="12" cy="12" r="2" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    alertCircle:  <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    refresh:      <><polyline points="23 4 23 10 17 10" {...s}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...s}/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    percent:      <><line x1="19" y1="5" x2="5" y2="19" {...s}/><circle cx="6.5" cy="6.5" r="2.5" {...s}/><circle cx="17.5" cy="17.5" r="2.5" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    dollarSign:   <><line x1="12" y1="1" x2="12" y2="23" {...s}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...s}/></>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
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
// 🔌 BACKEND SWAP POINT #1 — SELLER DATA & ANALYTICS
// Replace with: supabase.from('sellers')
//   .select('*,analytics(*),products(*),orders(*))')
//   .eq('id', sellerId).single()
// ============================================================
const MOCK_SELLER = {
  id:        "SEL-001",
  name:      "Tech Master Store",
  initials:  "TM",
  color:     "#1D4ED8",
  trustScore: 98,
  metrics: {
    revenue:     { value:25400000, growth:18.5,  trend:"up"   },
    orders:      { value:624,      growth:12.7,  trend:"up"   },
    conversion:  { value:3.3,      growth:-0.4,  trend:"down" },
    avgOrder:    { value:40705,    growth:5.2,   trend:"up"   },
    followers:   { value:20000,    growth:8.1,   trend:"up"   },
    returnRate:  { value:2.1,      growth:-0.8,  trend:"up"   },
  },
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — TOP PRODUCTS
// Replace with: supabase.from('products')
//   .select('*').eq('seller_id', sellerId)
//   .order('sold_count', { ascending: false }).limit(5)
// ============================================================
const MOCK_TOP_PRODUCTS = [
  { id:1, name:"iPhone 15 Pro Max 256GB", revenue:693000000, sold:420, growth:12,  stock:8   },
  { id:2, name:"AirPods Pro 2nd Gen",     revenue:311500000, sold:890, growth:28,  stock:45  },
  { id:3, name:"MacBook Air M2 256GB",    revenue:504000000, sold:180, growth:8,   stock:12  },
  { id:4, name:"Samsung S24 Ultra",       revenue:290000000, sold:200, growth:-3,  stock:20  },
  { id:5, name:"iPad Pro 12.9\" M2",      revenue:275500000, sold:145, growth:15,  stock:6   },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #3 — CUSTOMER SEGMENTS
// Replace with: supabase.from('order_analytics')
//   .select('buyer_location, count, revenue')
//   .eq('seller_id', sellerId)
//   .group('buyer_location')
// ============================================================
const MOCK_SEGMENTS = [
  { city:"Dar es Salaam", pct:42, revenue:10668000, color:T.blue   },
  { city:"Zanzibar",      pct:18, revenue:4572000,  color:T.purple },
  { city:"Arusha",        pct:14, revenue:3556000,  color:T.teal   },
  { city:"Mwanza",        pct:11, revenue:2794000,  color:T.green  },
  { city:"Others",        pct:15, revenue:3810000,  color:T.amber  },
];

// ============================================================
// 🤖 AI SWAP POINT #1 — AI INSIGHTS
// Replace with: supabase.functions.invoke('ai-seller-insights', {
//   body: { seller_id: sellerId, metrics: sellerMetrics }
// })
// 🔐 SECURITY — Anthropic API key in Edge Function only
// ============================================================
const MOCK_AI_INSIGHTS = [
  {
    id:1, type:"opportunity", priority:"high",
    icon:"trending", color:T.green,
    title:"Revenue opportunity detected",
    insight:"AirPods Pro sales increased 28% this month. Increasing stock by 50 units could generate an additional TSh 4.4M in revenue.",
    action:"Restock AirPods Pro", actionIcon:"package",
  },
  {
    id:2, type:"warning", priority:"high",
    icon:"alertCircle", color:T.red,
    title:"Low stock alert — 3 products",
    insight:"iPhone 15 Pro Max (8 units), iPad Pro (6 units), and MacBook Air (12 units) are running low. At current sales velocity, they'll sell out in 4 days.",
    action:"Reorder Now", actionIcon:"refresh",
  },
  {
    id:3, type:"pricing", priority:"medium",
    icon:"tag", color:T.gold,
    title:"Pricing optimization available",
    insight:"Samsung S24 Ultra is priced 8% above market average and showing -3% growth. A 5% price reduction could increase sales by ~25%.",
    action:"Adjust Price", actionIcon:"percent",
  },
  {
    id:4, type:"marketing", priority:"medium",
    icon:"users", color:T.purple,
    title:"Follower growth opportunity",
    insight:"Stores with weekly posts grow followers 3x faster. You haven't posted in 5 days. Post a product update to re-engage your 20K followers.",
    action:"Create Post", actionIcon:"sparkle",
  },
  {
    id:5, type:"timing", priority:"low",
    icon:"clock", color:T.blue,
    title:"Best time to go live",
    insight:"Your audience is most active between 7–9 PM on weekdays. Schedule a live stream this Thursday evening to maximize viewers.",
    action:"Schedule Live", actionIcon:"zap",
  },
];

// ============================================================
// 🤖 AI CHAT — SELLER ASSISTANT
// 🔐 SECURITY — API calls go through Supabase Edge Function
// Replace direct fetch with:
// supabase.functions.invoke('ai-seller-assistant', {
//   body: { message: userMessage, seller_id: sellerId,
//           context: sellerMetrics }
// })
// ============================================================
const QUICK_PROMPTS = [
  "How can I increase sales this week?",
  "Which products should I restock?",
  "When is the best time to run promotions?",
  "How do I improve my Trust Score?",
  "Analyze my best customers",
  "Suggest a pricing strategy",
];

// ============================================================
// 🧱 MAIN COMPONENT — AISellerDashboard
// ============================================================
export default function App({
  // 👤 AUTH — replace with real seller from supabase.auth.getUser()
  seller        = MOCK_SELLER,
  topProducts   = MOCK_TOP_PRODUCTS,
  segments      = MOCK_SEGMENTS,
  aiInsights    = MOCK_AI_INSIGHTS,

  // 🧭 NAVIGATE
  onBack        = () => {},   // → previous screen
  onProductPress= () => {},   // → product edit screen
  onGoLive      = () => {},   // → Brick 2 Live stream
  onCreatePost  = () => {},   // → Post creator
  onViewOrders  = () => {},   // → Brick 5 Command Center orders
}) {
  const [activeTab,    setActiveTab]    = useState("insights");
  const [period,       setPeriod]       = useState("month");
  const [aiMessages,   setAiMessages]   = useState([
    { role:"ai", text:`Habari ${seller.name}! 🐼 I'm your Panda AI Business Coach. I've analyzed your store data and I'm ready to help you grow. What would you like to know?` }
  ]);
  const [aiInput,      setAiInput]      = useState("");
  const [aiLoading,    setAiLoading]    = useState(false);
  const [dismissedInsights, setDismissed] = useState([]);
  const [toast,        setToast]        = useState(null);
  const messagesEndRef = { current:null };

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const visibleInsights = aiInsights.filter(i => !dismissedInsights.includes(i.id));

  // 🤖 AI — Send message to AI Business Coach
  const sendAiMessage = async () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiInput("");
    setAiMessages(m => [...m, { role:"user", text:userMsg }]);
    setAiLoading(true);

    // 🔐 SECURITY — In production replace with Edge Function call:
    // const res = await supabase.functions.invoke('ai-seller-assistant', {
    //   body: { message: userMsg, seller_id: seller.id,
    //           metrics: seller.metrics, top_products: topProducts }
    // })
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:300,
          system:`You are Panda AI, an expert business coach for ${seller.name}, 
          a Tanzanian e-commerce seller on Panda Marketplace.
          Store metrics: Revenue TSh ${fmt(seller.metrics.revenue.value)}, 
          ${seller.metrics.orders.value} orders, ${seller.metrics.conversion.value}% conversion.
          Trust Score: ${seller.trustScore}/100.
          Top products: ${topProducts.map(p=>p.name).join(', ')}.
          Give specific, actionable advice in 2-3 sentences. 
          Be friendly, use some Swahili words naturally. Focus on Tanzania market.`,
          messages:[{ role:"user", content:userMsg }],
        }),
      });
      const data  = await res.json();
      const reply = data.content?.[0]?.text || "Samahani, let me think about that. Could you rephrase your question?";
      setAiMessages(m => [...m, { role:"ai", text:reply }]);
    } catch {
      setAiMessages(m => [...m, {
        role:"ai",
        text:"Samahani! Connection issue. But here's a quick tip: focus on restocking your top-selling products to maximize revenue this week! 🎯"
      }]);
    }
    setAiLoading(false);
  };

  const TABS = [
    { id:"insights",  label:"AI Insights",  icon:"sparkle"  },
    { id:"analytics", label:"Analytics",    icon:"barChart" },
    { id:"products",  label:"Products",     icon:"package"  },
    { id:"coach",     label:"AI Coach",     icon:"robot"    },
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
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes glow     { 0%,100%{box-shadow:0 0 20px rgba(109,40,217,0.3)} 50%{box-shadow:0 0 40px rgba(109,40,217,0.6)} }
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

      {/* ── HEADER ── */}
      <div style={{
        background:`linear-gradient(135deg,#3B1FA3 0%,#6D28D9 60%,#4C1D95 100%)`,
        padding:"52px 20px 24px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, opacity:0.06,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"20px 20px" }}/>
        <div style={{ position:"absolute", top:-40, right:-40,
          width:200, height:200, borderRadius:"50%",
          background:"rgba(255,255,255,0.04)" }}/>

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
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              fontWeight:700, letterSpacing:0.8 }}>POWERED BY PANDA AI</div>
            <div style={{ fontSize:17, fontWeight:900, color:"#fff",
              letterSpacing:-0.3 }}>AI Seller Dashboard</div>
          </div>
          <div style={{ width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:20 }}>🐼</div>
        </div>

        {/* Seller info */}
        <div style={{ display:"flex", gap:14, alignItems:"center",
          marginBottom:20, position:"relative" }}>
          <div style={{ width:52, height:52, borderRadius:16,
            background:`linear-gradient(135deg,${seller.color}44,${seller.color}88)`,
            border:"2px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:20, fontWeight:900, color:"#fff" }}>
            {seller.initials}
          </div>
          <div>
            <div style={{ fontSize:16, fontWeight:900, color:"#fff",
              marginBottom:3 }}>{seller.name}</div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:4,
                background:"rgba(10,123,75,0.3)",
                border:"1px solid rgba(10,123,75,0.5)",
                borderRadius:8, padding:"2px 8px" }}>
                <div style={{ width:5, height:5, borderRadius:"50%",
                  background:"#4ADE80" }}/>
                <span style={{ fontSize:10, fontWeight:800, color:"#4ADE80" }}>
                  {seller.trustScore} Trust Score
                </span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:4,
                background:"rgba(201,150,10,0.3)",
                border:"1px solid rgba(201,150,10,0.5)",
                borderRadius:8, padding:"2px 8px" }}>
                <Icon name="sparkle" size={10} color={T.goldMid}/>
                <span style={{ fontSize:10, fontWeight:800, color:T.goldMid }}>
                  AI Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Period selector */}
        <div style={{ display:"flex", gap:6, position:"relative" }}>
          {["week","month","year"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding:"7px 16px", borderRadius:99, fontSize:11, fontWeight:700,
              background: period===p ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
              border: period===p ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.15)",
              color:"#fff", textTransform:"capitalize", cursor:"pointer",
            }}>{p === "week" ? "This Week" : p === "month" ? "This Month" : "This Year"}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── KEY METRICS GRID ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
          gap:12, marginBottom:16 }}>
          {[
            { label:"Revenue",     value:fmt(seller.metrics.revenue.value),    ...seller.metrics.revenue,    icon:"dollarSign", color:T.green  },
            { label:"Orders",      value:seller.metrics.orders.value,           ...seller.metrics.orders,     icon:"package",    color:T.blue   },
            { label:"Conversion",  value:seller.metrics.conversion.value+"%",   ...seller.metrics.conversion, icon:"percent",    color:T.amber  },
            { label:"Avg Order",   value:fmt(seller.metrics.avgOrder.value),    ...seller.metrics.avgOrder,   icon:"trending",   color:T.purple },
          ].map(m => (
            <div key={m.label} style={{ background:T.card, borderRadius:20,
              padding:"16px", border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"flex-start", marginBottom:10 }}>
                <div style={{ width:34, height:34, borderRadius:10,
                  background:m.color+"14",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={m.icon} size={16} color={m.color}/>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:3,
                  background:m.trend==="up" ? T.greenBg : T.redBg,
                  borderRadius:8, padding:"3px 7px" }}>
                  <Icon name={m.trend==="up" ? "arrowUp" : "arrowDown"} size={10}
                    color={m.trend==="up" ? T.green : T.red}/>
                  <span style={{ fontSize:10, fontWeight:800,
                    color:m.trend==="up" ? T.green : T.red }}>
                    {m.trend==="up"?"+":""}{m.growth}%
                  </span>
                </div>
              </div>
              <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
                textTransform:"uppercase", letterSpacing:0.6, marginBottom:4 }}>
                {m.label}
              </div>
              <div style={{ fontSize:18, fontWeight:900, color:T.navy,
                fontFamily:"monospace", letterSpacing:-0.5 }}>{m.value}</div>
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
              fontSize:10, fontWeight:activeTab===t.id ? 800 : 500,
              background:activeTab===t.id
                ? t.id==="coach" || t.id==="insights"
                  ? "linear-gradient(135deg,#6D28D9,#4C1D95)"
                  : T.navy
                : "transparent",
              color:activeTab===t.id ? "#fff" : T.textMute,
              transition:"all 0.2s",
              display:"flex", flexDirection:"column",
              alignItems:"center", gap:4,
              boxShadow:activeTab===t.id ? `0 4px 12px ${T.navy}33` : "none",
            }}>
              <Icon name={t.icon} size={14} color={activeTab===t.id ? "#fff" : T.textMute}/>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ AI INSIGHTS TAB ══ */}
        {activeTab === "insights" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {/* AI Summary banner */}
            <div style={{
              background:`linear-gradient(135deg,#3B1FA3,#6D28D9)`,
              borderRadius:22, padding:"18px 20px", marginBottom:16,
              position:"relative", overflow:"hidden",
              animation:"glow 3s infinite",
            }}>
              <div style={{ position:"absolute", inset:0, opacity:0.05,
                backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
                backgroundSize:"14px 14px" }}/>
              <div style={{ display:"flex", gap:12, alignItems:"center",
                position:"relative" }}>
                <div style={{ width:48, height:48, borderRadius:14,
                  background:"rgba(255,255,255,0.15)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:24 }}>🐼</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:800,
                    color:"rgba(255,255,255,0.7)", marginBottom:4 }}>
                    PANDA AI DAILY BRIEFING
                  </div>
                  <div style={{ fontSize:14, fontWeight:900, color:"#fff",
                    lineHeight:1.4 }}>
                    {visibleInsights.length} insights found for your store today
                  </div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)",
                    marginTop:4 }}>
                    Revenue is up 18.5% · 2 urgent actions needed
                  </div>
                </div>
              </div>
            </div>

            {/* Priority filter */}
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {[
                { label:"All",    count:visibleInsights.length,                                   color:T.navy   },
                { label:"Urgent", count:visibleInsights.filter(i=>i.priority==="high").length,    color:T.red    },
                { label:"Tips",   count:visibleInsights.filter(i=>i.priority==="medium").length,  color:T.amber  },
              ].map(f => (
                <div key={f.label} style={{ display:"flex", alignItems:"center", gap:5,
                  padding:"6px 14px", borderRadius:99, background:T.card,
                  border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
                  <span style={{ fontSize:11, fontWeight:800, color:f.color }}>
                    {f.label}
                  </span>
                  <div style={{ width:18, height:18, borderRadius:"50%",
                    background:f.color+"18",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontSize:9, fontWeight:900, color:f.color }}>
                      {f.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Insight cards */}
            {visibleInsights.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 0" }}>
                <div style={{ fontSize:"48px", marginBottom:12 }}>🎉</div>
                <div style={{ fontSize:16, fontWeight:800, color:T.textMain, marginBottom:8 }}>
                  All caught up!
                </div>
                <div style={{ fontSize:13, color:T.textMute }}>
                  No new insights. Check back tomorrow!
                </div>
              </div>
            ) : visibleInsights.map((insight, i) => (
              <div key={insight.id} style={{
                background:T.card, borderRadius:22, padding:"18px 20px",
                marginBottom:14, border:`1.5px solid ${insight.color}22`,
                boxShadow:T.shadow,
                animation:`fadeUp 0.25s ease ${i*0.07}s both`,
              }}>
                {/* Header */}
                <div style={{ display:"flex", gap:12, alignItems:"flex-start",
                  marginBottom:12 }}>
                  <div style={{ width:44, height:44, borderRadius:14, flexShrink:0,
                    background:insight.color+"14",
                    border:`1.5px solid ${insight.color}22`,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name={insight.icon} size={20} color={insight.color}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      alignItems:"flex-start", marginBottom:4 }}>
                      <div style={{ fontSize:13, fontWeight:900, color:T.textMain,
                        lineHeight:1.3, flex:1, marginRight:8 }}>
                        {insight.title}
                      </div>
                      <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                        <div style={{ background:
                          insight.priority==="high" ? T.redBg :
                          insight.priority==="medium" ? T.amberBg : T.blueBg,
                          border:`1px solid ${
                            insight.priority==="high" ? T.red :
                            insight.priority==="medium" ? T.amber : T.blue}22`,
                          borderRadius:7, padding:"2px 8px",
                          fontSize:9, fontWeight:800,
                          color:insight.priority==="high" ? T.red :
                            insight.priority==="medium" ? T.amber : T.blue,
                          textTransform:"uppercase" }}>
                          {insight.priority==="high" ? "Urgent" :
                           insight.priority==="medium" ? "Important" : "Tip"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insight text */}
                <div style={{ fontSize:13, color:T.textMid, lineHeight:1.75,
                  background:insight.color+"08", borderRadius:14,
                  padding:"12px 14px", marginBottom:14,
                  borderLeft:`3px solid ${insight.color}33` }}>
                  {insight.insight}
                </div>

                {/* Actions */}
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => {
                    showToast(`${insight.action} — opening...`, insight.color);
                  }} style={{
                    flex:1, padding:"11px 0", borderRadius:13,
                    background:`linear-gradient(135deg,${insight.color},${insight.color}CC)`,
                    border:"none", color:"#fff", fontSize:12, fontWeight:900,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                    boxShadow:`0 4px 14px ${insight.color}33`,
                  }}>
                    <Icon name={insight.actionIcon} size={14} color="#fff"/>
                    {insight.action}
                  </button>
                  <button onClick={() => setDismissed(d => [...d, insight.id])} style={{
                    width:42, height:42, borderRadius:13, background:T.navyLight,
                    border:`1px solid ${T.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    <Icon name="x" size={16} color={T.textMute}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ ANALYTICS TAB ══ */}
        {activeTab === "analytics" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>

            {/* Revenue chart */}
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", marginBottom:16 }}>
                <div style={{ fontSize:15, fontWeight:900, color:T.textMain }}>
                  Revenue Trend
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5,
                  background:T.greenBg, border:`1px solid ${T.green}22`,
                  borderRadius:8, padding:"3px 9px" }}>
                  <Icon name="arrowUp" size={11} color={T.green}/>
                  <span style={{ fontSize:11, fontWeight:800,
                    color:T.green }}>+18.5%</span>
                </div>
              </div>
              {/* 🔌 BACKEND — replace with real chart data */}
              <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:120 }}>
                {[
                  { label:"W1", val:16000000 },
                  { label:"W2", val:21000000 },
                  { label:"W3", val:18500000 },
                  { label:"W4", val:25400000 },
                ].map((d, i) => {
                  const max   = 25400000;
                  const h     = Math.round((d.val/max) * 100);
                  const isCurrent = i === 3;
                  return (
                    <div key={d.label} style={{ flex:1,
                      display:"flex", flexDirection:"column",
                      alignItems:"center", gap:8 }}>
                      <div style={{ fontSize:10, fontWeight:800,
                        color:isCurrent ? T.green : T.textMute }}>
                        {fmt(d.val).replace("TSh ","").replace(",000,000","M").replace(",000","K")}
                      </div>
                      <div style={{ width:"100%", height:h, borderRadius:"8px 8px 0 0",
                        background:isCurrent
                          ? `linear-gradient(180deg,${T.green},#0A5C3A)`
                          : `linear-gradient(180deg,${T.purple}66,${T.purple}33)`,
                        boxShadow:isCurrent ? `0 4px 16px ${T.green}44` : "none",
                        transition:"height 0.6s ease" }}/>
                      <span style={{ fontSize:10, fontWeight:isCurrent?900:600,
                        color:isCurrent?T.green:T.textMute }}>{d.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer segments */}
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
                marginBottom:16 }}>Customer Locations</div>
              {segments.map(seg => (
                <div key={seg.city} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:5 }}>
                    <span style={{ fontSize:12, fontWeight:700,
                      color:T.textMid }}>{seg.city}</span>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <span style={{ fontSize:11, color:T.textMute,
                        fontFamily:"monospace" }}>{fmt(seg.revenue)}</span>
                      <span style={{ fontSize:12, fontWeight:900,
                        color:seg.color }}>{seg.pct}%</span>
                    </div>
                  </div>
                  <div style={{ height:7, background:T.border, borderRadius:99,
                    overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${seg.pct}%`,
                      background:`linear-gradient(90deg,${seg.color},${seg.color}88)`,
                      borderRadius:99, transition:"width 0.8s ease" }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Conversion funnel */}
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
                marginBottom:16 }}>Conversion Funnel</div>
              {[
                { label:"Store Visitors",  value:18700, pct:100, color:T.blue   },
                { label:"Viewed Products", value:9350,  pct:50,  color:T.purple },
                { label:"Added to Cart",   value:1870,  pct:10,  color:T.amber  },
                { label:"Completed Order", value:617,   pct:3.3, color:T.green  },
              ].map((step, i) => (
                <div key={step.label} style={{ display:"flex", gap:12,
                  alignItems:"center", marginBottom:i<3?14:0 }}>
                  <div style={{ width:36, height:36, borderRadius:10, flexShrink:0,
                    background:step.color+"14",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:12, fontWeight:900, color:step.color }}>
                    {i+1}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      marginBottom:5 }}>
                      <span style={{ fontSize:12, fontWeight:700,
                        color:T.textMid }}>{step.label}</span>
                      <div style={{ display:"flex", gap:8 }}>
                        <span style={{ fontSize:12, fontWeight:800,
                          color:T.textMain }}>{step.value.toLocaleString()}</span>
                        <span style={{ fontSize:11, color:step.color,
                          fontWeight:700 }}>{step.pct}%</span>
                      </div>
                    </div>
                    <div style={{ height:6, background:T.border, borderRadius:99,
                      overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${step.pct}%`,
                        background:`linear-gradient(90deg,${step.color},${step.color}88)`,
                        borderRadius:99 }}/>
                    </div>
                  </div>
                </div>
              ))}
              {/* AI tip */}
              <div style={{ marginTop:14, background:T.purpleBg,
                border:`1px solid ${T.purple}22`, borderRadius:14,
                padding:"10px 14px", display:"flex", gap:8, alignItems:"flex-start" }}>
                <Icon name="sparkle" size={14} color={T.purple}/>
                <div style={{ fontSize:12, color:T.purple, lineHeight:1.6,
                  fontWeight:600 }}>
                  AI Tip: Improve cart-to-order conversion by offering free delivery on orders above TSh 50,000.
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ══ PRODUCTS TAB ══ */}
        {activeTab === "products" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
              boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
                marginBottom:4 }}>Top Performing Products</div>
              <div style={{ fontSize:12, color:T.textMute, marginBottom:16 }}>
                Ranked by revenue · AI recommendations included
              </div>
              {topProducts.map((product, i) => (
                <div key={product.id} onClick={() => onProductPress(product.id)}
                  style={{ display:"flex", gap:12, alignItems:"center",
                    padding:"14px 0",
                    borderBottom:i<topProducts.length-1?`1px solid ${T.border}`:"none",
                    cursor:"pointer" }}>
                  {/* Rank */}
                  <div style={{ width:32, height:32, borderRadius:9, flexShrink:0,
                    background: i===0 ? T.goldLight : i===1 ? T.navyLight : T.bg,
                    border:`1px solid ${i===0 ? T.gold+"33" : T.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:13, fontWeight:900,
                    color:i===0 ? T.gold : T.textMute }}>
                    {i===0 ? "🥇" : i===1 ? "🥈" : i===2 ? "🥉" : i+1}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
                      marginBottom:3, overflow:"hidden", textOverflow:"ellipsis",
                      whiteSpace:"nowrap" }}>{product.name}</div>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <span style={{ fontSize:11, color:T.textMute }}>
                        {product.sold} sold
                      </span>
                      <span style={{ fontSize:11, color:T.textMute }}>·</span>
                      <span style={{ fontSize:11,
                        color:product.stock < 10 ? T.red : T.textMute,
                        fontWeight: product.stock < 10 ? 800 : 400 }}>
                        {product.stock} in stock
                        {product.stock < 10 && " ⚠️"}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:12, fontWeight:900, color:T.navy,
                      fontFamily:"monospace", marginBottom:3 }}>
                      {fmt(product.revenue).replace("TSh ","TSh ")}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:3,
                      justifyContent:"flex-end" }}>
                      <Icon name={product.growth >= 0 ? "arrowUp" : "arrowDown"}
                        size={10} color={product.growth >= 0 ? T.green : T.red}/>
                      <span style={{ fontSize:10, fontWeight:800,
                        color:product.growth >= 0 ? T.green : T.red }}>
                        {product.growth >= 0 ? "+" : ""}{product.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Product Recommendations */}
            <div style={{ background:`linear-gradient(135deg,#3B1FA3,#6D28D9)`,
              borderRadius:22, padding:"18px 20px",
              position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", inset:0, opacity:0.05,
                backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
                backgroundSize:"14px 14px" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:8,
                marginBottom:14, position:"relative" }}>
                <Icon name="lightbulb" size={18} color={T.goldMid}/>
                <span style={{ fontSize:14, fontWeight:900, color:"#fff" }}>
                  AI Product Recommendations
                </span>
              </div>
              {[
                "Add Samsung Galaxy A55 to your catalog — 2,400 buyers searched for it this week",
                "Bundle AirPods Pro + iPhone case for TSh 380,000 — bundles increase AOV by 35%",
                "Run a flash deal on MacBook Air this Friday 7–9 PM for maximum visibility",
              ].map((rec, i) => (
                <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start",
                  marginBottom:i<2?12:0, position:"relative" }}>
                  <div style={{ width:22, height:22, borderRadius:7, flexShrink:0,
                    background:"rgba(255,255,255,0.15)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:11, fontWeight:900, color:"rgba(255,255,255,0.9)" }}>
                    {i+1}
                  </div>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.85)",
                    lineHeight:1.6 }}>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ AI COACH TAB ══ */}
        {activeTab === "coach" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {/* Chat messages */}
            <div style={{ background:T.card, borderRadius:22,
              border:`1px solid ${T.border}`, boxShadow:T.shadow,
              marginBottom:14, overflow:"hidden" }}>
              {/* Chat header */}
              <div style={{ background:`linear-gradient(135deg,#3B1FA3,#6D28D9)`,
                padding:"14px 18px",
                display:"flex", gap:10, alignItems:"center" }}>
                <div style={{ width:36, height:36, borderRadius:10,
                  background:"rgba(255,255,255,0.15)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:18 }}>🐼</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:900, color:"#fff" }}>
                    Panda AI Business Coach
                  </div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)" }}>
                    Powered by Claude · Trained on Tanzania market data
                  </div>
                </div>
                <div style={{ marginLeft:"auto", display:"flex", alignItems:"center",
                  gap:5, background:"rgba(74,222,128,0.2)",
                  border:"1px solid rgba(74,222,128,0.3)",
                  borderRadius:8, padding:"3px 8px" }}>
                  <div style={{ width:5, height:5, borderRadius:"50%",
                    background:"#4ADE80", animation:"pulse 2s infinite" }}/>
                  <span style={{ fontSize:9, fontWeight:800, color:"#4ADE80" }}>
                    Online
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div style={{ padding:"16px", maxHeight:320, overflowY:"auto" }}>
                {aiMessages.map((msg, i) => (
                  <div key={i} style={{ display:"flex",
                    justifyContent:msg.role==="user" ? "flex-end" : "flex-start",
                    marginBottom:12,
                    animation:"fadeUp 0.2s ease" }}>
                    {msg.role === "ai" && (
                      <div style={{ width:28, height:28, borderRadius:8, flexShrink:0,
                        background:T.purpleBg, marginRight:8, alignSelf:"flex-end",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:14 }}>🐼</div>
                    )}
                    <div style={{
                      maxWidth:"78%", padding:"11px 14px",
                      borderRadius:msg.role==="user"
                        ? "18px 6px 18px 18px"
                        : "6px 18px 18px 18px",
                      background:msg.role==="user"
                        ? `linear-gradient(135deg,${T.navy},${T.navyMid})`
                        : T.purpleBg,
                      color:msg.role==="user" ? "#fff" : T.purple,
                      fontSize:13, lineHeight:1.6,
                      border:msg.role==="ai"
                        ? `1px solid ${T.purple}22` : "none",
                      boxShadow:T.shadow,
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div style={{ display:"flex", gap:8, alignItems:"center",
                    marginBottom:12 }}>
                    <div style={{ fontSize:14 }}>🐼</div>
                    <div style={{ background:T.purpleBg,
                      border:`1px solid ${T.purple}22`,
                      borderRadius:"6px 18px 18px 18px",
                      padding:"12px 16px",
                      display:"flex", gap:4 }}>
                      {[0,1,2].map(i => (
                        <div key={i} style={{ width:7, height:7, borderRadius:"50%",
                          background:T.purple, opacity:0.5,
                          animation:`pulse 1.2s ${i*0.2}s infinite` }}/>
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef}/>
              </div>

              {/* Quick prompts */}
              <div style={{ padding:"0 16px 10px",
                display:"flex", gap:7, flexWrap:"wrap" }}>
                {QUICK_PROMPTS.slice(0,3).map(p => (
                  <button key={p} onClick={() => setAiInput(p)} style={{
                    padding:"6px 12px", borderRadius:99,
                    background:T.purpleBg, border:`1px solid ${T.purple}22`,
                    fontSize:11, fontWeight:700, color:T.purple,
                    cursor:"pointer",
                  }}>{p}</button>
                ))}
              </div>

              {/* Input */}
              <div style={{ padding:"10px 16px 16px",
                borderTop:`1px solid ${T.border}`,
                display:"flex", gap:10, alignItems:"center" }}>
                <input value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && sendAiMessage()}
                  placeholder="Ask your AI coach anything..."
                  style={{ flex:1, background:T.navyLight,
                    border:`1px solid ${T.border}`, borderRadius:14,
                    padding:"11px 14px", color:T.textMain,
                    fontSize:13, outline:"none" }}/>
                <button onClick={sendAiMessage} style={{
                  width:44, height:44, borderRadius:14, flexShrink:0,
                  background:aiInput.trim()
                    ? "linear-gradient(135deg,#6D28D9,#4C1D95)"
                    : T.navyLight,
                  border:aiInput.trim() ? "none" : `1px solid ${T.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:aiInput.trim() ? `0 4px 14px ${T.purple}44` : "none",
                }}>
                  <Icon name="send" size={18}
                    color={aiInput.trim() ? "#fff" : T.textMute}/>
                </button>
              </div>
            </div>

            {/* More quick prompts */}
            <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
              boxShadow:T.shadow, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:13, fontWeight:900, color:T.textMain,
                marginBottom:12 }}>More Topics to Explore</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {QUICK_PROMPTS.slice(3).map(p => (
                  <button key={p} onClick={() => {
                    setAiInput(p);
                    setActiveTab("coach");
                  }} style={{
                    display:"flex", justifyContent:"space-between",
                    alignItems:"center", padding:"12px 14px", borderRadius:14,
                    background:T.bg, border:`1px solid ${T.border}`,
                    fontSize:12, fontWeight:700, color:T.textMid,
                    cursor:"pointer", textAlign:"left",
                  }}>
                    <span>{p}</span>
                    <Icon name="chevronRight" size={14} color={T.textMute}/>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <BottomNav active="profile"/>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";

// ============================================================
// 🧱 BRICK 2B — SELLER LIVE BROADCASTER
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export SellerLiveBroadcaster from this file
//     Props: { sellerId, currentUser, onBack, onEndStream }
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
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    camera:       <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    cameraOff:    <><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l1.5-2h7L15 6h2" {...s}/><circle cx="12" cy="13" r="3.5" {...s}/><line x1="1" y1="1" x2="23" y2="23" {...s}/></>,
    mic:          <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" {...s}/><path d="M19 10v2a7 7 0 0 1-14 0v-2" {...s}/><line x1="12" y1="19" x2="12" y2="23" {...s}/><line x1="8" y1="23" x2="16" y2="23" {...s}/></>,
    micOff:       <><line x1="1" y1="1" x2="23" y2="23" {...s}/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" {...s}/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" {...s}/><line x1="12" y1="19" x2="12" y2="23" {...s}/><line x1="8" y1="23" x2="16" y2="23" {...s}/></>,
    flip:         <><polyline points="17 1 21 5 17 9" {...s}/><path d="M3 11V9a4 4 0 0 1 4-4h14" {...s}/><polyline points="7 23 3 19 7 15" {...s}/><path d="M21 13v2a4 4 0 0 1-4 4H3" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
    heart:        <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={color} stroke="none"/></>,
    send:         <><line x1="22" y1="2" x2="11" y2="13" {...s}/><polygon points="22 2 15 22 11 13 2 9 22 2" {...s}/></>,
    shoppingBag:  <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" {...s}/><line x1="3" y1="6" x2="21" y2="6" {...s}/><path d="M16 10a4 4 0 0 1-8 0" {...s}/></>,
    dollarSign:   <><line x1="12" y1="1" x2="12" y2="23" {...s}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...s}/></>,
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    tag:          <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" {...s}/><line x1="7" y1="7" x2="7.01" y2="7" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    chevronUp:    <><polyline points="18 15 12 9 6 15" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    pin:          <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    settings:     <><circle cx="12" cy="12" r="3" {...s}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — SELLER & PRODUCT CATALOG
// Replace with: supabase.from('sellers').select('*').eq('id', sellerId).single()
// supabase.from('products').select('*').eq('seller_id', sellerId).eq('in_stock', true)
// ============================================================
const MOCK_SELLER = {
  id:"SEL-001", name:"Tech Master Store", initials:"TM", color:"#1D4ED8", trustScore:98,
};

const MOCK_CATALOG = [
  { id:1, name:"iPhone 15 Pro Max 256GB", price:1650000, original:1850000, stock:8,  icon:"laptop" },
  { id:2, name:"AirPods Pro 2nd Gen",     price:350000,  original:null,    stock:45, icon:"laptop" },
  { id:3, name:"MacBook Air M2 256GB",    price:2800000, original:3100000, stock:12, icon:"laptop" },
  { id:4, name:"Samsung Galaxy S24",      price:1100000, original:null,    stock:20, icon:"laptop" },
  { id:5, name:"iPad Pro 12.9\" M2",      price:1900000, original:null,    stock:6,  icon:"laptop" },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — LIVE COMMENTS (Realtime, Read)
// Replace with: supabase.channel(`live_comments:${streamId}`)
//   .on('postgres_changes', { event: 'INSERT', table: 'live_comments',
//        filter: `stream_id=eq.${streamId}` },
//     payload => setComments(prev => [...prev, payload.new]))
//   .subscribe()
// ============================================================
const SIMULATED_COMMENTS = [
  { user:"Hassan_K",  color:"#1D4ED8", text:"Habari! Is the iPhone still available? 🔥" },
  { user:"Amina_T",   color:"#6D28D9", text:"Price for AirPods please" },
  { user:"PeterM",    color:"#0A7B4B", text:"Just bought one, thank you! ❤️" },
  { user:"Zawadi_S",  color:"#C9960A", text:"Can you show the back of the phone?" },
  { user:"JumaH",     color:"#0D9488", text:"Delivery to Morogoro?" },
  { user:"GraceN",    color:"#C0392B", text:"This is amazing 😍" },
];

// ============================================================
// 🧱 MAIN COMPONENT — SellerLiveBroadcaster
// ============================================================
export default function App({
  // 👤 AUTH — replace with real seller from supabase.auth.getUser()
  seller     = MOCK_SELLER,
  catalog    = MOCK_CATALOG,

  // 🧭 NAVIGATE
  onBack       = () => {},   // → Brick 5 Command Center (cancel before going live)
  onEndStream  = () => {},   // → Brick 5 / Brick 12 analytics (after stream ends)
}) {
  const [phase,         setPhase]         = useState("setup");  // setup | live | ended
  const [title,         setTitle]         = useState("");
  const [camOn,         setCamOn]         = useState(true);
  const [micOn,         setMicOn]         = useState(true);
  const [facingFront,   setFacingFront]   = useState(true);
  const [taggedProducts,setTaggedProducts]= useState([]);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [showPinnedProduct, setShowPinnedProduct] = useState(null);
  const [comments,      setComments]      = useState([]);
  const [viewers,       setViewers]       = useState(0);
  const [likes,         setLikes]         = useState(0);
  const [sales,         setSales]         = useState(0);
  const [revenue,       setRevenue]       = useState(0);
  const [duration,      setDuration]      = useState(0);
  const [showEndModal,  setShowEndModal]  = useState(false);
  const [toast,         setToast]         = useState(null);
  const commentIndex = useRef(0);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  // Live simulation — viewers, comments, duration ticking
  useEffect(() => {
    if (phase !== "live") return;
    const timer = setInterval(() => setDuration(d => d + 1), 1000);
    const viewerTimer = setInterval(() => {
      setViewers(v => Math.max(12, v + Math.floor(Math.random()*7) - 2));
    }, 2500);
    const commentTimer = setInterval(() => {
      const c = SIMULATED_COMMENTS[commentIndex.current % SIMULATED_COMMENTS.length];
      commentIndex.current++;
      setComments(prev => [...prev.slice(-30), c]);
      if (Math.random() > 0.6) setLikes(l => l + Math.floor(Math.random()*5)+1);
    }, 3500);
    return () => { clearInterval(timer); clearInterval(viewerTimer); clearInterval(commentTimer); };
  }, [phase]);

  const fmtDuration = (s) => {
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    return h > 0
      ? `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
      : `${m}:${String(sec).padStart(2,"0")}`;
  };

  const goLive = () => {
    if (!title.trim()) { showToast("Please add a stream title", T.red); return; }
    if (taggedProducts.length === 0) { showToast("Tag at least one product to sell", T.red); return; }
    // 🔌 BACKEND — supabase.from('live_streams').insert({
    //   seller_id: seller.id, title, status: 'live',
    //   tagged_products: taggedProducts.map(p=>p.id), started_at: new Date()
    // })
    setPhase("live");
    setViewers(14);
    showToast("You're live! 🔴", T.red);
  };

  const toggleProduct = (product) => {
    setTaggedProducts(prev =>
      prev.find(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  const pinProduct = (product) => {
    setShowPinnedProduct(product);
    setShowProductPicker(false);
    // 🔌 BACKEND — supabase.from('live_streams')
    //   .update({ pinned_product_id: product.id }).eq('id', streamId)
    showToast(`${product.name} pinned to stream!`, T.gold);
    // Simulate a sale shortly after pinning (demo only)
    setTimeout(() => {
      setSales(s => s + 1);
      setRevenue(r => r + product.price);
      showToast(`💰 Sale! ${product.name} — ${fmt(product.price)}`, T.green);
    }, 4000);
  };

  const endStream = () => {
    // 🔌 BACKEND — supabase.from('live_streams')
    //   .update({ status: 'ended', ended_at: new Date(),
    //             peak_viewers: maxViewers, total_sales: sales, revenue })
    //   .eq('id', streamId)
    setShowEndModal(false);
    setPhase("ended");
  };

  // ── SETUP SCREEN ──────────────────────────────────────────────
  if (phase === "setup") return (
    <div style={{
      background:T.navy, minHeight:"100vh", color:"#fff",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", position:"relative", overflow:"hidden",
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input  { font-family:inherit; }
        input::placeholder { color:rgba(255,255,255,0.4); }
      `}</style>

      {toast && (
        <div style={{ position:"fixed", bottom:30, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:"rgba(255,255,255,0.95)",
          borderLeft:`4px solid ${toast.color}`, borderRadius:14, padding:"12px 20px",
          boxShadow:T.shadowLg, whiteSpace:"nowrap",
          animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <span style={{ fontSize:13, fontWeight:700, color:T.navy }}>{toast.msg}</span>
        </div>
      )}

      {/* Camera preview placeholder */}
      <div style={{ height:"60vh", position:"relative",
        background:`linear-gradient(160deg,${T.navyMid},${T.navy})`,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ position:"absolute", inset:0, opacity:0.08,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"22px 22px" }}/>
        {camOn ? (
          <div style={{ textAlign:"center" }}>
            <div style={{ width:90, height:90, borderRadius:"50%",
              background:`linear-gradient(135deg,${seller.color}33,${seller.color}55)`,
              border:`3px solid ${seller.color}66`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:32, fontWeight:900, color:"#fff", margin:"0 auto 12px" }}>
              {seller.initials}
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>
              Camera preview
            </div>
          </div>
        ) : (
          <div style={{ textAlign:"center" }}>
            <Icon name="cameraOff" size={48} color="rgba(255,255,255,0.3)"/>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:10 }}>
              Camera is off
            </div>
          </div>
        )}

        {/* Top controls */}
        <div style={{ position:"absolute", top:16, left:16, right:16,
          display:"flex", justifyContent:"space-between" }}>
          <button onClick={onBack} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="x" size={18} color="#fff"/>
          </button>
          <button onClick={() => setFacingFront(f => !f)} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="flip" size={18} color="#fff"/>
          </button>
        </div>

        {/* Bottom camera/mic controls */}
        <div style={{ position:"absolute", bottom:20, left:0, right:0,
          display:"flex", justifyContent:"center", gap:14 }}>
          <button onClick={() => setCamOn(c => !c)} style={{
            width:50, height:50, borderRadius:"50%",
            background: camOn ? "rgba(255,255,255,0.15)" : T.red,
            border:`1.5px solid ${camOn ? "rgba(255,255,255,0.25)" : T.red}`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name={camOn ? "camera" : "cameraOff"} size={20} color="#fff"/>
          </button>
          <button onClick={() => setMicOn(m => !m)} style={{
            width:50, height:50, borderRadius:"50%",
            background: micOn ? "rgba(255,255,255,0.15)" : T.red,
            border:`1.5px solid ${micOn ? "rgba(255,255,255,0.25)" : T.red}`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name={micOn ? "mic" : "micOff"} size={20} color="#fff"/>
          </button>
        </div>
      </div>

      {/* Setup form */}
      <div style={{ background:T.bg, borderRadius:"28px 28px 0 0",
        marginTop:-24, padding:"24px 20px 32px", position:"relative",
        color:T.textMain, minHeight:"40vh" }}>
        <div style={{ width:40, height:4, borderRadius:99,
          background:T.border, margin:"0 auto 20px" }}/>

        <div style={{ fontSize:18, fontWeight:900, color:T.textMain,
          marginBottom:16 }}>Go Live Setup</div>

        {/* Title input */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
            marginBottom:8 }}>Stream Title *</div>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. iPhone Flash Sale — Live Now! 🔥"
            style={{ width:"100%", background:T.card,
              border:`1.5px solid ${T.border}`, borderRadius:14,
              padding:"13px 16px", color:T.textMain,
              fontSize:14, outline:"none", boxSizing:"border-box" }}/>
        </div>

        {/* Product tagging */}
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
              Tag Products to Sell *
            </div>
            <span style={{ fontSize:11, color:T.textMute }}>
              {taggedProducts.length} selected
            </span>
          </div>
          <div style={{ background:T.card, borderRadius:18,
            border:`1px solid ${T.border}`, boxShadow:T.shadow,
            maxHeight:240, overflowY:"auto" }}>
            {catalog.map((p,i) => {
              const checked = !!taggedProducts.find(t => t.id === p.id);
              return (
                <div key={p.id} onClick={() => toggleProduct(p)}
                  style={{ display:"flex", gap:12, alignItems:"center",
                    padding:"12px 16px",
                    borderBottom:i<catalog.length-1?`1px solid ${T.border}`:"none",
                    cursor:"pointer",
                    background:checked ? T.navyLight : T.card }}>
                  <div style={{ width:20, height:20, borderRadius:7,
                    border:`2px solid ${checked ? T.navy : T.border}`,
                    background:checked ? T.navy : "transparent",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    flexShrink:0 }}>
                    {checked && <Icon name="check" size={12} color="#fff"/>}
                  </div>
                  <div style={{ width:38, height:38, borderRadius:11,
                    background:T.navyLight, flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name="package" size={18} color={T.navy+"44"}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                      overflow:"hidden", textOverflow:"ellipsis",
                      whiteSpace:"nowrap" }}>{p.name}</div>
                    <div style={{ fontSize:11, fontWeight:900, color:T.navy,
                      fontFamily:"monospace" }}>{fmt(p.price)}</div>
                  </div>
                  <div style={{ fontSize:10, color:p.stock<10?T.red:T.textMute,
                    fontWeight:700, flexShrink:0 }}>
                    {p.stock} left
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust reminder */}
        <div style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
          borderRadius:14, padding:"12px 16px", marginBottom:20,
          display:"flex", gap:10, alignItems:"center" }}>
          <Icon name="shield" size={16} color={T.green}/>
          <div style={{ fontSize:11, color:T.green, fontWeight:600, lineHeight:1.5 }}>
            All live sales are protected by Panda Escrow. Buyers pay safely while watching.
          </div>
        </div>

        <button onClick={goLive} style={{
          width:"100%", padding:"16px 0", borderRadius:18,
          background:`linear-gradient(135deg,${T.red},#8E2A1E)`,
          border:"none", color:"#fff", fontSize:15, fontWeight:900,
          cursor:"pointer", display:"flex", alignItems:"center",
          justifyContent:"center", gap:8,
          boxShadow:`0 8px 24px ${T.red}44`,
        }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#fff" }}/>
          Go Live Now
        </button>
      </div>
    </div>
  );

  // ── ENDED / SUMMARY SCREEN ────────────────────────────────────
  if (phase === "ended") return (
    <div style={{
      background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto",
      display:"flex", alignItems:"center", justifyContent:"center", padding:24,
    }}>
      <style>{`
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        * { box-sizing:border-box; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>
      <div style={{ width:"100%", textAlign:"center" }}>
        <div style={{ width:90, height:90, borderRadius:"50%",
          background:T.greenBg, border:`3px solid ${T.green}44`,
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 20px", fontSize:40,
          animation:"bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>🎉</div>
        <div style={{ fontSize:22, fontWeight:900, color:T.textMain,
          marginBottom:6 }}>Stream Ended!</div>
        <div style={{ fontSize:13, color:T.textMute, marginBottom:24 }}>
          Great session! Here's how you did:
        </div>

        <div style={{ background:T.card, borderRadius:24, padding:"22px",
          border:`1px solid ${T.border}`, boxShadow:T.shadowMd, marginBottom:20 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
            gap:14, marginBottom:16 }}>
            {[
              { label:"Duration",     value:fmtDuration(duration),   icon:"clock",       color:T.blue   },
              { label:"Peak Viewers", value:viewers,                  icon:"eye",         color:T.purple },
              { label:"Total Sales",  value:sales,                    icon:"shoppingBag", color:T.green  },
              { label:"Revenue",      value:fmt(revenue),             icon:"dollarSign",  color:T.gold   },
            ].map(stat => (
              <div key={stat.label} style={{ background:T.bg, borderRadius:16,
                padding:"14px", border:`1px solid ${T.border}`, textAlign:"left" }}>
                <div style={{ width:30, height:30, borderRadius:9,
                  background:stat.color+"14",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  marginBottom:8 }}>
                  <Icon name={stat.icon} size={14} color={stat.color}/>
                </div>
                <div style={{ fontSize:16, fontWeight:900, color:T.navy,
                  fontFamily:"monospace", marginBottom:3 }}>{stat.value}</div>
                <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
                  textTransform:"uppercase" }}>{stat.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8,
            justifyContent:"center", padding:"10px 0",
            borderTop:`1px solid ${T.border}` }}>
            <Icon name="heart" size={14} color={T.red}/>
            <span style={{ fontSize:13, fontWeight:700, color:T.textMid }}>
              {likes} likes received
            </span>
          </div>
        </div>

        <button onClick={onEndStream} style={{
          width:"100%", padding:"15px 0", borderRadius:18,
          background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
          border:"none", color:"#fff", fontSize:14, fontWeight:900,
          cursor:"pointer", boxShadow:`0 6px 20px ${T.navy}44`,
        }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  // ── LIVE BROADCASTING SCREEN ──────────────────────────────────
  return (
    <div style={{
      background:T.navy, height:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", position:"relative", overflow:"hidden",
      color:"#fff",
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes floatUp  { 0%{opacity:0;transform:translateY(0) scale(0.5)} 15%{opacity:1;transform:translateY(-20px) scale(1)} 100%{opacity:0;transform:translateY(-160px) scale(1.1)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input  { font-family:inherit; }
        input::placeholder { color:rgba(255,255,255,0.4); }
      `}</style>

      {toast && (
        <div style={{ position:"fixed", top:90, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:"rgba(255,255,255,0.95)",
          borderLeft:`4px solid ${toast.color}`, borderRadius:14, padding:"12px 20px",
          boxShadow:T.shadowLg, whiteSpace:"nowrap",
          animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <span style={{ fontSize:13, fontWeight:700, color:T.navy }}>{toast.msg}</span>
        </div>
      )}

      {/* ── END STREAM CONFIRM MODAL ── */}
      {showEndModal && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setShowEndModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.white, borderRadius:"28px 28px 0 0",
            padding:"28px 24px 40px", width:"100%", maxWidth:430,
            animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)", color:T.textMain,
          }}>
            <div style={{ width:40, height:4, borderRadius:99,
              background:T.border, margin:"0 auto 24px" }}/>
            <div style={{ fontSize:18, fontWeight:900, marginBottom:6 }}>
              End Live Stream?
            </div>
            <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>
              You've been live for {fmtDuration(duration)} with {viewers} viewers and {sales} sales. Are you sure you want to end?
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setShowEndModal(false)} style={{
                flex:1, padding:"14px 0", borderRadius:16,
                background:T.navyLight, border:`1px solid ${T.border}`,
                fontSize:13, fontWeight:800, color:T.textMid,
              }}>Keep Going</button>
              <button onClick={endStream} style={{
                flex:1, padding:"14px 0", borderRadius:16,
                background:`linear-gradient(135deg,${T.red},#8E2A1E)`,
                border:"none", color:"#fff", fontSize:13, fontWeight:900,
              }}>End Stream</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCT PICKER ── */}
      {showProductPicker && (
        <div style={{ position:"fixed", inset:0, zIndex:998,
          background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setShowProductPicker(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.white, borderRadius:"28px 28px 0 0",
            padding:"24px 20px 36px", width:"100%", maxWidth:430,
            animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)", color:T.textMain,
            maxHeight:"70vh", overflowY:"auto",
          }}>
            <div style={{ width:40, height:4, borderRadius:99,
              background:T.border, margin:"0 auto 20px" }}/>
            <div style={{ fontSize:16, fontWeight:900, marginBottom:14 }}>
              Pin a Product to Showcase
            </div>
            {taggedProducts.map(p => (
              <div key={p.id} onClick={() => pinProduct(p)}
                style={{ display:"flex", gap:12, alignItems:"center",
                  padding:"12px 14px", borderRadius:16, marginBottom:8,
                  border:`1.5px solid ${T.border}`, cursor:"pointer",
                  background:T.bg }}>
                <div style={{ width:42, height:42, borderRadius:12,
                  background:T.navyLight,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="package" size={20} color={T.navy+"44"}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize:12, fontWeight:900, color:T.navy,
                    fontFamily:"monospace" }}>{fmt(p.price)}</div>
                </div>
                <Icon name="pin" size={16} color={T.gold}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Camera area (background) */}
      <div style={{ position:"absolute", inset:0,
        background:`linear-gradient(160deg,${T.navyMid},${T.navy})`,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ position:"absolute", inset:0, opacity:0.07,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"22px 22px" }}/>
        {camOn ? (
          <div style={{ width:120, height:120, borderRadius:"50%",
            background:`linear-gradient(135deg,${seller.color}33,${seller.color}55)`,
            border:`3px solid ${seller.color}66`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:44, fontWeight:900, color:"#fff" }}>
            {seller.initials}
          </div>
        ) : (
          <Icon name="cameraOff" size={56} color="rgba(255,255,255,0.25)"/>
        )}
      </div>

      {/* Floating hearts animation zone */}
      <div style={{ position:"absolute", bottom:140, right:16,
        width:60, height:200, pointerEvents:"none" }}>
        {likes > 0 && (
          <div style={{ position:"absolute", bottom:0, right:10,
            animation:"floatUp 2s ease-out" }} key={likes}>
            <Icon name="heart" size={20} color={T.red}/>
          </div>
        )}
      </div>

      {/* ── TOP BAR ── */}
      <div style={{ position:"absolute", top:16, left:16, right:16, zIndex:50,
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {/* LIVE badge */}
          <div style={{ display:"flex", alignItems:"center", gap:5,
            background:T.red, borderRadius:10, padding:"6px 12px" }}>
            <div style={{ width:6, height:6, borderRadius:"50%",
              background:"#fff", animation:"pulse 1.2s infinite" }}/>
            <span style={{ fontSize:11, fontWeight:900, color:"#fff" }}>LIVE</span>
          </div>
          {/* Duration */}
          <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:10,
            padding:"6px 12px" }}>
            <span style={{ fontSize:11, fontWeight:800, color:"#fff",
              fontFamily:"monospace" }}>{fmtDuration(duration)}</span>
          </div>
          {/* Viewers */}
          <div style={{ display:"flex", alignItems:"center", gap:4,
            background:"rgba(0,0,0,0.4)", borderRadius:10, padding:"6px 10px" }}>
            <Icon name="eye" size={12} color="#fff"/>
            <span style={{ fontSize:11, fontWeight:800, color:"#fff" }}>{viewers}</span>
          </div>
        </div>
        <button onClick={() => setShowEndModal(true)} style={{
          width:36, height:36, borderRadius:11,
          background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.15)",
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="x" size={16} color="#fff"/>
        </button>
      </div>

      {/* ── LIVE STATS ROW ── */}
      <div style={{ position:"absolute", top:64, left:16, right:16, zIndex:50,
        display:"flex", gap:8 }}>
        {[
          { icon:"heart",        value:likes,        color:T.red    },
          { icon:"shoppingBag",  value:sales,         color:T.green  },
          { icon:"dollarSign",   value:fmt(revenue).replace("TSh ",""), color:T.goldMid },
        ].map(stat => (
          <div key={stat.icon} style={{ display:"flex", alignItems:"center", gap:5,
            background:"rgba(0,0,0,0.4)", borderRadius:10, padding:"5px 10px" }}>
            <Icon name={stat.icon} size={11} color={stat.color}/>
            <span style={{ fontSize:11, fontWeight:800, color:"#fff",
              fontFamily:"monospace" }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* ── PINNED PRODUCT CARD ── */}
      {showPinnedProduct && (
        <div style={{ position:"absolute", top:112, left:16, right:16, zIndex:50,
          background:"rgba(255,255,255,0.96)", backdropFilter:"blur(10px)",
          borderRadius:18, padding:"12px 14px",
          display:"flex", gap:12, alignItems:"center",
          boxShadow:T.shadowMd, animation:"fadeUp 0.3s ease" }}>
          <div style={{ width:44, height:44, borderRadius:13,
            background:T.navyLight, flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="package" size={20} color={T.navy+"44"}/>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
              overflow:"hidden", textOverflow:"ellipsis",
              whiteSpace:"nowrap" }}>{showPinnedProduct.name}</div>
            <div style={{ fontSize:13, fontWeight:900, color:T.navy,
              fontFamily:"monospace" }}>{fmt(showPinnedProduct.price)}</div>
          </div>
          <div style={{ background:T.gold, borderRadius:8, padding:"4px 10px" }}>
            <span style={{ fontSize:10, fontWeight:900, color:"#fff" }}>PINNED</span>
          </div>
          <button onClick={() => setShowPinnedProduct(null)} style={{
            width:26, height:26, borderRadius:"50%", background:T.navyLight,
            border:"none", flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="x" size={12} color={T.textMute}/>
          </button>
        </div>
      )}

      {/* ── LIVE COMMENTS FEED ── */}
      <div style={{ position:"absolute", bottom:140, left:16, width:"68%",
        maxHeight:200, overflow:"hidden", zIndex:40,
        display:"flex", flexDirection:"column-reverse", gap:8 }}>
        {[...comments].reverse().slice(0,6).map((c, i) => (
          <div key={comments.length-i} style={{ display:"flex", gap:7,
            alignItems:"flex-start", animation:"fadeUp 0.25s ease" }}>
            <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0,
              background:c.color, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:9, fontWeight:900, color:"#fff",
              marginTop:1 }}>
              {c.user[0]}
            </div>
            <div style={{ background:"rgba(0,0,0,0.45)", borderRadius:"4px 12px 12px 12px",
              padding:"6px 10px", maxWidth:"100%" }}>
              <span style={{ fontSize:11, fontWeight:800, color:T.goldMid }}>
                {c.user}{" "}
              </span>
              <span style={{ fontSize:11, color:"#fff" }}>{c.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── BOTTOM CONTROLS ── */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:50,
        padding:"14px 16px 28px",
        background:"linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {/* Comment input (display only — read live comments via 🔌) */}
          <div style={{ flex:1, background:"rgba(255,255,255,0.15)",
            border:"1px solid rgba(255,255,255,0.2)",
            borderRadius:18, padding:"10px 16px",
            display:"flex", alignItems:"center" }}>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.6)" }}>
              Comments appear live from viewers...
            </span>
          </div>
          {/* Camera toggle */}
          <button onClick={() => setCamOn(c => !c)} style={{
            width:44, height:44, borderRadius:"50%",
            background: camOn ? "rgba(255,255,255,0.15)" : T.red,
            border:`1.5px solid ${camOn ? "rgba(255,255,255,0.25)" : T.red}`,
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          }}>
            <Icon name={camOn ? "camera" : "cameraOff"} size={18} color="#fff"/>
          </button>
          {/* Mic toggle */}
          <button onClick={() => setMicOn(m => !m)} style={{
            width:44, height:44, borderRadius:"50%",
            background: micOn ? "rgba(255,255,255,0.15)" : T.red,
            border:`1.5px solid ${micOn ? "rgba(255,255,255,0.25)" : T.red}`,
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          }}>
            <Icon name={micOn ? "mic" : "micOff"} size={18} color="#fff"/>
          </button>
          {/* Pin product */}
          <button onClick={() => setShowProductPicker(true)} style={{
            width:44, height:44, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            border:"none", flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 4px 16px ${T.gold}55`,
          }}>
            <Icon name="tag" size={18} color="#fff"/>
          </button>
        </div>
      </div>
    </div>
  );
}

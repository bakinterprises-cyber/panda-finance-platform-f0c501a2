import { useState, useRef } from "react";

// ============================================================
// 🧱 BH-V — PANDA VISION AI
// 🏗️  Part of: Panda Business Hub (Module 3) — THE FLAGSHIP FEATURE
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🤖  AI hooks marked with:            // 🤖 AI
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export PandaVisionAI from this file
//     Props: { businessId, currentUser, initialMode, onBack, onNavigate }
//
// 🔌 CAMERA DEPENDENCY NOTE:
// Camera preview here is a styled placeholder, same pattern as Brick 2B.
// Real capture needs: navigator.mediaDevices.getUserMedia() at assembly time.
// Photo capture (receipt/single product) → base64 → Claude Vision API works
// as designed below. Continuous shelf-walking scan needs a streaming
// video pipeline — flag this as a backend dependency same as Brick 2B.
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
  purpleMid: "#4C1D95",
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
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    grid:         <><rect x="3" y="3" width="7" height="7" {...s}/><rect x="14" y="3" width="7" height="7" {...s}/><rect x="14" y="14" width="7" height="7" {...s}/><rect x="3" y="14" width="7" height="7" {...s}/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    tag:          <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" {...s}/><line x1="7" y1="7" x2="7.01" y2="7" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    minus:        <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>,
    dollarSign:   <><line x1="12" y1="1" x2="12" y2="23" {...s}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...s}/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    mic:          <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" {...s}/><path d="M19 10v2a7 7 0 0 1-14 0v-2" {...s}/><line x1="12" y1="19" x2="12" y2="23" {...s}/><line x1="8" y1="23" x2="16" y2="23" {...s}/></>,
    flip:         <><polyline points="17 1 21 5 17 9" {...s}/><path d="M3 11V9a4 4 0 0 1 4-4h14" {...s}/><polyline points="7 23 3 19 7 15" {...s}/><path d="M21 13v2a4 4 0 0 1-4 4H3" {...s}/></>,
    refresh:      <><polyline points="23 4 23 10 17 10" {...s}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    shoppingCart: <><circle cx="9" cy="21" r="1" {...s}/><circle cx="20" cy="21" r="1" {...s}/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" {...s}/></>,
    qrCode:       <><rect x="3" y="3" width="7" height="7" {...s}/><rect x="14" y="3" width="7" height="7" {...s}/><rect x="3" y="14" width="7" height="7" {...s}/><line x1="14" y1="14" x2="14" y2="21" {...s}/><line x1="21" y1="14" x2="21" y2="14.01" {...s}/><line x1="14" y1="17.5" x2="17.5" y2="17.5" {...s}/><line x1="21" y1="21" x2="17.5" y2="21" {...s}/><line x1="17.5" y1="17.5" x2="17.5" y2="21" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav (Business Hub) ─────────────────────────────────
function BottomNav({ active = "scan" }) {
  const items = [
    { id:"home",      icon:"home",      label:"Dashboard" },
    { id:"inventory", icon:"grid",      label:"Inventory" },
    { id:"scan",      icon:"camera",    label:""          },
    { id:"reports",   icon:"barChart",  label:"Reports"   },
    { id:"profile",   icon:"user",      label:"Profile"   },
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
        const isCenter = item.id === "scan";
        const isActive = item.id === active;
        if (isCenter) return (
          <div key={item.id} style={{
            width:54, height:54, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 6px 20px ${T.gold}66`, cursor:"pointer",
            marginTop:-22, border:`3px solid ${T.white}`,
          }}>
            <Icon name="camera" size={22} color="#fff"/>
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
// 🤖 AI SWAP POINT — PRODUCT RECOGNITION
// Replace the simulated detection with a real Claude Vision call:
//
// const response = await fetch("https://api.anthropic.com/v1/messages", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     model: "claude-sonnet-4-6",
//     max_tokens: 1000,
//     messages: [{
//       role: "user",
//       content: [
//         { type: "image", source: { type:"base64", media_type:"image/jpeg", data: capturedFrameBase64 } },
//         { type: "text", text: `You are Panda Vision AI. Detect all products in
//           this image for a Tanzanian retail shop. Return ONLY JSON:
//           { products: [{ name, brand, category, quantity, packaging }] }` }
//       ]
//     }]
//   })
// });
// 🔐 SECURITY — route through Supabase Edge Function in production,
// never call Anthropic API directly with a key from the frontend.
// ============================================================
const MOCK_DETECTED_PRODUCTS = [
  { id:1, name:"Coca Cola 500ml",     brand:"Coca-Cola", category:"Beverages", quantity:12, packaging:"Bottle", matched:true,  existingStock:8  },
  { id:2, name:"Azam Mango Juice 1L", brand:"Azam",      category:"Beverages", quantity:6,  packaging:"Carton", matched:true,  existingStock:30 },
  { id:3, name:"Colgate Toothpaste",  brand:"Colgate",   category:"Personal Care", quantity:4, packaging:"Box", matched:false, existingStock:0  },
];

// ============================================================
// 🤖 AI SWAP POINT — RECEIPT READER
// Same pattern as product recognition but the prompt instructs Claude
// to extract: supplier, product names, prices, tax, purchase date
// ============================================================
const MOCK_RECEIPT_DATA = {
  supplier:  "Azam Distributors Ltd",
  date:      "July 3, 2026",
  items: [
    { name:"Azam Mango Juice 1L (carton)", qty:6,  price:2500, total:15000 },
    { name:"Azam Water 500ml (carton)",    qty:10, price:1800, total:18000 },
  ],
  subtotal:  33000,
  tax:       5940,
  total:     38940,
};

// ============================================================
// 🤖 AI SWAP POINT — MARKETPLACE AUTO-LISTING GENERATOR
// ============================================================
const MOCK_LISTING_DRAFT = {
  name:        "Colgate Toothpaste 150g — Fresh Mint",
  description: "Genuine Colgate toothpaste, 150g tube, fresh mint flavor. Fluoride protection for cavity defense. Sourced from authorized distributor.",
  category:    "Personal Care",
  keywords:    ["toothpaste", "colgate", "oral care", "dental", "fresh mint"],
  marketPrice: 2500,
  suggestedPrice: 2400,
};

const MODES = [
  { id:"recognize", label:"Recognize Products",  icon:"package",      color:T.blue,   desc:"Point camera at products to detect them" },
  { id:"count",     label:"Count Inventory",     icon:"grid",         color:T.teal,   desc:"Walk the shop to auto-count stock"        },
  { id:"pos",       label:"Point of Sale",       icon:"shoppingCart", color:T.red,    desc:"Scan items to build a cart and checkout"  },
  { id:"receipt",   label:"Scan Receipt",        icon:"fileText",     color:T.blue,   desc:"Photo a receipt to log expenses"          },
  { id:"listing",   label:"Auto-List Product",   icon:"tag",          color:T.gold,   desc:"Scan a product to create a listing"       },
];

// ============================================================
// 🧱 MAIN COMPONENT — PandaVisionAI
// ============================================================
export default function App({
  initialMode = null,

  // 🧭 NAVIGATE
  onBack           = () => {},   // → BH-1 Dashboard
  onInventorySaved = () => {},   // → BH-3 Inventory Manager (after save)
  onExpenseLogged  = () => {},   // → BH-2 AI Bookkeeping (after save)
  onListingCreated = () => {},   // → Marketplace Brick 3 (after publish)
  onSaleComplete   = () => {},   // → BH-1 Dashboard (after checkout)
}) {
  const [mode,          setMode]          = useState(initialMode);
  const [scanState,     setScanState]     = useState("ready"); // ready | scanning | results
  const [detected,      setDetected]      = useState([]);
  const [receiptData,   setReceiptData]   = useState(null);
  const [listingDraft,  setListingDraft]  = useState(null);
  const [cart,          setCart]          = useState([]);
  const [toast,         setToast]         = useState(null);
  const [facingFront,   setFacingFront]   = useState(false);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  // 🤖 AI — Simulated scan trigger. In production this captures a real
  // camera frame (canvas.toDataURL) and sends it to Claude Vision via
  // an Edge Function, then parses the JSON response into `detected`.
  const triggerScan = () => {
    setScanState("scanning");
    setTimeout(() => {
      if (mode === "recognize" || mode === "count" || mode === "pos") {
        setDetected(MOCK_DETECTED_PRODUCTS);
      } else if (mode === "receipt") {
        setReceiptData(MOCK_RECEIPT_DATA);
      } else if (mode === "listing") {
        setListingDraft(MOCK_LISTING_DRAFT);
      }
      setScanState("results");
    }, 1800);
  };

  const resetScan = () => {
    setScanState("ready");
    setDetected([]);
    setReceiptData(null);
    setListingDraft(null);
    setCart([]);
  };

  const addToCart = (product) => {
    setCart(c => [...c, { ...product, cartId: Date.now() }]);
    showToast(`${product.name} added to cart`, T.green);
  };

  const cartTotal = cart.reduce((s,item) => s + (item.sellPrice || 1200) * (item.quantity||1), 0);

  // 🔌 BACKEND — save detected products to inventory
  // supabase.functions.invoke('vision-update-inventory', {
  //   body: { business_id: businessId, detected_products: detected }
  // })
  const saveToInventory = () => {
    showToast(`${detected.length} products saved to inventory!`, T.teal);
    setTimeout(() => onInventorySaved(detected), 600);
  };

  // 🔌 BACKEND — log receipt as expense
  // supabase.functions.invoke('vision-log-receipt', {
  //   body: { business_id: businessId, receipt_data: receiptData }
  // })
  const saveReceipt = () => {
    showToast(`Expense of ${fmt(receiptData.total)} logged!`, T.blue);
    setTimeout(() => onExpenseLogged(receiptData), 600);
  };

  // 🔌 BACKEND — publish marketplace listing
  // supabase.from('products').insert({ ...listingDraft, seller_id, status:'published' })
  const publishListing = () => {
    showToast("Listed on Panda Marketplace!", T.gold);
    setTimeout(() => onListingCreated(listingDraft), 600);
  };

  // 🔌 BACKEND — process sale + 💰 WALLET payment
  // supabase.from('orders').insert({ items: cart, total: cartTotal, ... })
  // PandaWallet.chargeOrCollect({ amount: cartTotal, method })
  const completeSale = (method) => {
    showToast(`Sale complete via ${method}! ${fmt(cartTotal)}`, T.green);
    setTimeout(() => onSaleComplete({ cart, total:cartTotal, method }), 600);
  };

  // ── MODE SELECTOR SCREEN ──────────────────────────────────────
  if (!mode) return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow   { 0%,100%{box-shadow:0 6px 20px rgba(109,40,217,0.35)} 50%{box-shadow:0 6px 36px rgba(109,40,217,0.65)} }
        * { box-sizing:border-box; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,#3B1FA3,#6D28D9)`,
        padding:"52px 20px 32px", position:"relative", overflow:"hidden",
        borderRadius:"0 0 28px 28px" }}>
        <div style={{ position:"absolute", inset:0, opacity:0.06,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"16px 16px" }}/>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:24, position:"relative" }}>
          <button onClick={onBack} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.15)",
            border:"1px solid rgba(255,255,255,0.25)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="arrowLeft" size={18} color="#fff"/>
          </button>
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:8,
            padding:"4px 10px" }}>
            <span style={{ fontSize:10, fontWeight:900, color:T.goldMid }}>
              BETA
            </span>
          </div>
        </div>
        <div style={{ textAlign:"center", position:"relative" }}>
          <div style={{ width:76, height:76, borderRadius:22,
            background:"rgba(255,255,255,0.15)", margin:"0 auto 16px",
            display:"flex", alignItems:"center", justifyContent:"center",
            animation:"glow 3s infinite" }}>
            <Icon name="camera" size={34} color="#fff"/>
          </div>
          <div style={{ fontSize:22, fontWeight:900, color:"#fff",
            letterSpacing:-0.5, marginBottom:6 }}>Panda Vision AI</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)",
            fontWeight:600 }}>Point. Scan. Sell. Manage.</div>
        </div>
      </div>

      <div style={{ padding:"20px" }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.textMute,
          marginBottom:14, textAlign:"center", lineHeight:1.6 }}>
          Choose what you'd like Panda AI to do
        </div>
        {MODES.map((m, i) => (
          <div key={m.id} onClick={() => setMode(m.id)} style={{
            background:T.card, borderRadius:20, padding:"16px 18px",
            marginBottom:12, border:`1px solid ${T.border}`, boxShadow:T.shadow,
            display:"flex", gap:14, alignItems:"center", cursor:"pointer",
            animation:`fadeUp 0.25s ease ${i*0.06}s both` }}>
            <div style={{ width:48, height:48, borderRadius:15, flexShrink:0,
              background:m.color+"14",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name={m.icon} size={22} color={m.color}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:800, color:T.textMain,
                marginBottom:3 }}>{m.label}</div>
              <div style={{ fontSize:11, color:T.textMute, lineHeight:1.5 }}>
                {m.desc}
              </div>
            </div>
            <Icon name="chevronRight" size={16} color={T.textMute}/>
          </div>
        ))}

        {/* Voice assistant shortcut */}
        <div style={{ background:T.navyLight, border:`1px solid ${T.border}`,
          borderRadius:18, padding:"14px 18px", marginTop:8,
          display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ width:38, height:38, borderRadius:"50%",
            background:T.navy,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="mic" size={17} color="#fff"/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
              Prefer voice?
            </div>
            <div style={{ fontSize:11, color:T.textMute }}>
              Ask "How much inventory do I have?" in the AI Coach
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="scan"/>
    </div>
  );

  const activeModeInfo = MODES.find(m => m.id === mode);

  // ── CAMERA / SCAN SCREEN ────────────────────────────────────────
  return (
    <div style={{
      background:T.navy, minHeight:"100vh", color:"#fff",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", position:"relative",
    }}>
      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp   { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes slideIn   { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes scanLine  { 0%{top:10%} 100%{top:90%} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes corners   { 0%,100%{opacity:0.5} 50%{opacity:1} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

      {toast && (
        <div style={{ position:"fixed", bottom:30, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:"rgba(255,255,255,0.96)",
          borderLeft:`4px solid ${toast.color}`, borderRadius:14, padding:"12px 20px",
          boxShadow:T.shadowLg, whiteSpace:"nowrap",
          animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <span style={{ fontSize:13, fontWeight:700, color:T.navy }}>{toast.msg}</span>
        </div>
      )}

      {/* Top bar */}
      <div style={{ position:"absolute", top:16, left:16, right:16, zIndex:50,
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <button onClick={() => { setMode(null); resetScan(); }} style={{
          width:40, height:40, borderRadius:12,
          background:"rgba(255,255,255,0.12)",
          border:"1px solid rgba(255,255,255,0.2)",
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="x" size={18} color="#fff"/>
        </button>
        <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:10,
          padding:"7px 14px", display:"flex", alignItems:"center", gap:7 }}>
          <Icon name={activeModeInfo.icon} size={13} color={T.goldMid}/>
          <span style={{ fontSize:11, fontWeight:800, color:"#fff" }}>
            {activeModeInfo.label}
          </span>
        </div>
        <button onClick={() => setFacingFront(f => !f)} style={{
          width:40, height:40, borderRadius:12,
          background:"rgba(255,255,255,0.12)",
          border:"1px solid rgba(255,255,255,0.2)",
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="flip" size={17} color="#fff"/>
        </button>
      </div>

      {/* ── CAMERA VIEWFINDER ── */}
      <div style={{ height:scanState==="results" ? "38vh" : "62vh",
        position:"relative", overflow:"hidden",
        background:`linear-gradient(160deg,${T.navyMid},${T.navy})`,
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"height 0.4s ease" }}>
        <div style={{ position:"absolute", inset:0, opacity:0.06,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"20px 20px" }}/>

        {/* Placeholder camera icon */}
        <Icon name="camera" size={44} color="rgba(255,255,255,0.15)"/>

        {/* Scan frame corners */}
        {scanState !== "results" && (
          <div style={{ position:"absolute", top:"18%", left:"12%",
            right:"12%", bottom:"18%", animation:"corners 2s infinite" }}>
            {["top-left","top-right","bottom-left","bottom-right"].map(pos => (
              <div key={pos} style={{
                position:"absolute", width:28, height:28,
                borderColor:T.goldMid, borderStyle:"solid",
                ...(pos==="top-left"     && { top:0, left:0, borderWidth:"3px 0 0 3px", borderRadius:"8px 0 0 0" }),
                ...(pos==="top-right"    && { top:0, right:0, borderWidth:"3px 3px 0 0", borderRadius:"0 8px 0 0" }),
                ...(pos==="bottom-left"  && { bottom:0, left:0, borderWidth:"0 0 3px 3px", borderRadius:"0 0 0 8px" }),
                ...(pos==="bottom-right" && { bottom:0, right:0, borderWidth:"0 3px 3px 0", borderRadius:"0 0 8px 0" }),
              }}/>
            ))}
          </div>
        )}

        {/* Scanning line animation */}
        {scanState === "scanning" && (
          <div style={{ position:"absolute", left:"12%", right:"12%",
            height:2, background:`linear-gradient(90deg,transparent,${T.goldMid},transparent)`,
            animation:"scanLine 1.5s ease-in-out infinite alternate",
            boxShadow:`0 0 12px ${T.goldMid}` }}/>
        )}

        {/* Status text */}
        <div style={{ position:"absolute", bottom:20, left:0, right:0,
          textAlign:"center" }}>
          {scanState === "ready" && (
            <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:10,
              padding:"8px 16px", display:"inline-block" }}>
              <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>
                {activeModeInfo.desc}
              </span>
            </div>
          )}
          {scanState === "scanning" && (
            <div style={{ display:"flex", alignItems:"center", gap:8,
              justifyContent:"center" }}>
              <div style={{ width:6, height:6, borderRadius:"50%",
                background:T.goldMid, animation:"pulse 1s infinite" }}/>
              <span style={{ fontSize:12, fontWeight:800, color:T.goldMid }}>
                Panda AI is analyzing...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Capture button (ready state) */}
      {scanState === "ready" && (
        <div style={{ padding:"20px", display:"flex", justifyContent:"center" }}>
          <button onClick={triggerScan} style={{
            width:72, height:72, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            border:"4px solid rgba(255,255,255,0.25)",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 8px 28px ${T.gold}55` }}>
            <Icon name="camera" size={28} color="#fff"/>
          </button>
        </div>
      )}

      {/* ── RESULTS PANEL ── */}
      {scanState === "results" && (
        <div style={{ background:T.bg, borderRadius:"28px 28px 0 0",
          padding:"20px 20px 24px", color:T.textMain, minHeight:"40vh",
          animation:"fadeUp 0.3s ease" }}>
          <div style={{ width:40, height:4, borderRadius:99,
            background:T.border, margin:"0 auto 18px" }}/>

          {/* Product recognition / inventory count / POS results */}
          {(mode === "recognize" || mode === "count" || mode === "pos") && (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <Icon name="sparkle" size={16} color={T.purple}/>
                <span style={{ fontSize:16, fontWeight:900, color:T.textMain }}>
                  I detected {detected.length} products
                </span>
              </div>
              <div style={{ fontSize:12, color:T.textMute, marginBottom:16 }}>
                {mode === "pos" ? "Tap to add each item to the cart" : "Review before saving"}
              </div>

              {detected.map(p => (
                <div key={p.id} style={{ background:T.card, borderRadius:18,
                  padding:"14px 16px", marginBottom:10,
                  border:`1px solid ${T.border}`, boxShadow:T.shadow,
                  display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ width:44, height:44, borderRadius:13, flexShrink:0,
                    background:T.navyLight,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name="package" size={20} color={T.navy+"44"}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                      marginBottom:3 }}>{p.name}</div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ fontSize:10, color:T.textMute }}>
                        {p.brand} · {p.packaging}
                      </span>
                      {p.matched ? (
                        <div style={{ background:T.greenBg, borderRadius:6,
                          padding:"1px 6px" }}>
                          <span style={{ fontSize:9, fontWeight:800,
                            color:T.green }}>In Stock</span>
                        </div>
                      ) : (
                        <div style={{ background:T.amberBg, borderRadius:6,
                          padding:"1px 6px" }}>
                          <span style={{ fontSize:9, fontWeight:800,
                            color:T.amber }}>New Item</span>
                        </div>
                      )}
                    </div>
                    {mode === "count" && (
                      <div style={{ fontSize:11, color:T.textMid, marginTop:4,
                        fontWeight:700 }}>
                        Counted: {p.quantity} · Was: {p.existingStock}
                      </div>
                    )}
                  </div>
                  {mode === "pos" ? (
                    <button onClick={() => addToCart(p)} style={{
                      width:36, height:36, borderRadius:10, flexShrink:0,
                      background:T.gold, border:"none",
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon name="plus" size={17} color="#fff"/>
                    </button>
                  ) : (
                    <div style={{ fontSize:16, fontWeight:900, color:T.navy,
                      fontFamily:"monospace", flexShrink:0 }}>
                      {p.quantity}
                    </div>
                  )}
                </div>
              ))}

              {/* POS Cart */}
              {mode === "pos" && cart.length > 0 && (
                <div style={{ background:T.navy, borderRadius:18,
                  padding:"16px 18px", marginTop:6, marginBottom:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:10 }}>
                    <span style={{ fontSize:12, fontWeight:800, color:"#fff" }}>
                      Cart — {cart.length} items
                    </span>
                    <span style={{ fontSize:16, fontWeight:900, color:T.goldMid,
                      fontFamily:"monospace" }}>{fmt(cartTotal)}</span>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    {["Panda Wallet","Mobile Money","QR Code"].map(method => (
                      <button key={method} onClick={() => completeSale(method)}
                        style={{ flex:1, padding:"9px 4px", borderRadius:11,
                          background:"rgba(255,255,255,0.12)",
                          border:"1px solid rgba(255,255,255,0.2)",
                          fontSize:10, fontWeight:800, color:"#fff" }}>
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mode !== "pos" && (
                <button onClick={saveToInventory} style={{
                  width:"100%", padding:"15px 0", borderRadius:18, marginTop:6,
                  background:`linear-gradient(135deg,${T.teal||T.green},#0A5C3A)`,
                  border:"none", color:"#fff", fontSize:14, fontWeight:900,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  boxShadow:`0 6px 20px ${T.green}44` }}>
                  <Icon name="check" size={17} color="#fff"/>
                  Save to Inventory
                </button>
              )}
            </>
          )}

          {/* Receipt reader results */}
          {mode === "receipt" && receiptData && (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <Icon name="sparkle" size={16} color={T.purple}/>
                <span style={{ fontSize:16, fontWeight:900, color:T.textMain }}>
                  Receipt Extracted
                </span>
              </div>
              <div style={{ background:T.card, borderRadius:18, padding:"16px 18px",
                border:`1px solid ${T.border}`, boxShadow:T.shadow, marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  marginBottom:12, paddingBottom:12,
                  borderBottom:`1px solid ${T.border}` }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:900, color:T.textMain }}>
                      {receiptData.supplier}
                    </div>
                    <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
                      {receiptData.date}
                    </div>
                  </div>
                </div>
                {receiptData.items.map((item,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between",
                    marginBottom:8 }}>
                    <span style={{ fontSize:12, color:T.textMid }}>
                      {item.name} × {item.qty}
                    </span>
                    <span style={{ fontSize:12, fontWeight:700, color:T.textMain,
                      fontFamily:"monospace" }}>{fmt(item.total)}</span>
                  </div>
                ))}
                <div style={{ marginTop:10, paddingTop:10,
                  borderTop:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:11, color:T.textMute }}>Subtotal</span>
                    <span style={{ fontSize:11, color:T.textMute,
                      fontFamily:"monospace" }}>{fmt(receiptData.subtotal)}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontSize:11, color:T.textMute }}>VAT</span>
                    <span style={{ fontSize:11, color:T.textMute,
                      fontFamily:"monospace" }}>{fmt(receiptData.tax)}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:13, fontWeight:900, color:T.textMain }}>Total</span>
                    <span style={{ fontSize:15, fontWeight:900, color:T.red,
                      fontFamily:"monospace" }}>{fmt(receiptData.total)}</span>
                  </div>
                </div>
              </div>
              <button onClick={saveReceipt} style={{
                width:"100%", padding:"15px 0", borderRadius:18,
                background:`linear-gradient(135deg,${T.blue},#153A9E)`,
                border:"none", color:"#fff", fontSize:14, fontWeight:900,
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow:`0 6px 20px ${T.blue}44` }}>
                <Icon name="fileText" size={17} color="#fff"/>
                Log as Expense
              </button>
            </>
          )}

          {/* Marketplace auto-listing results */}
          {mode === "listing" && listingDraft && (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <Icon name="sparkle" size={16} color={T.purple}/>
                <span style={{ fontSize:16, fontWeight:900, color:T.textMain }}>
                  Listing Ready
                </span>
              </div>
              <div style={{ background:T.card, borderRadius:18, padding:"16px 18px",
                border:`1px solid ${T.border}`, boxShadow:T.shadow, marginBottom:14 }}>
                <div style={{ height:100, background:T.navyLight, borderRadius:14,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  marginBottom:12 }}>
                  <Icon name="package" size={38} color={T.navy+"44"}/>
                </div>
                <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
                  marginBottom:8 }}>{listingDraft.name}</div>
                <div style={{ fontSize:12, color:T.textMid, lineHeight:1.6,
                  marginBottom:12 }}>{listingDraft.description}</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
                  {listingDraft.keywords.map(k => (
                    <div key={k} style={{ background:T.purpleBg, borderRadius:8,
                      padding:"3px 9px" }}>
                      <span style={{ fontSize:10, fontWeight:700,
                        color:T.purple }}>#{k}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
                  gap:10 }}>
                  <div style={{ background:T.bg, borderRadius:12, padding:"10px 12px" }}>
                    <div style={{ fontSize:9, color:T.textMute, fontWeight:700 }}>
                      MARKET AVG
                    </div>
                    <div style={{ fontSize:13, fontWeight:900, color:T.textMain,
                      fontFamily:"monospace" }}>{fmt(listingDraft.marketPrice)}</div>
                  </div>
                  <div style={{ background:T.goldLight, borderRadius:12, padding:"10px 12px" }}>
                    <div style={{ fontSize:9, color:T.amber, fontWeight:700 }}>
                      SUGGESTED
                    </div>
                    <div style={{ fontSize:13, fontWeight:900, color:T.gold,
                      fontFamily:"monospace" }}>{fmt(listingDraft.suggestedPrice)}</div>
                  </div>
                </div>
              </div>
              <button onClick={publishListing} style={{
                width:"100%", padding:"15px 0", borderRadius:18,
                background:`linear-gradient(135deg,${T.gold},#A07008)`,
                border:"none", color:"#fff", fontSize:14, fontWeight:900,
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow:`0 6px 20px ${T.gold}44` }}>
                <Icon name="tag" size={17} color="#fff"/>
                Publish to Marketplace
              </button>
            </>
          )}

          {/* Rescan option */}
          <button onClick={resetScan} style={{
            width:"100%", padding:"12px 0", borderRadius:16, marginTop:10,
            background:"transparent", border:`1px solid ${T.border}`,
            fontSize:12, fontWeight:700, color:T.textMute,
            display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
            <Icon name="refresh" size={13} color={T.textMute}/>
            Scan Again
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";

// ============================================================
// 🧱 BRICK 3 — PRODUCT DETAILS (AI & TRUST)
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 📦  Assembly export at bottom
// ============================================================

// ─── Design Tokens ─────────────────────────────────────────
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
  shadow:    "0 2px 16px rgba(11,31,75,0.07)",
  shadowMd:  "0 8px 32px rgba(11,31,75,0.11)",
  shadowLg:  "0 20px 60px rgba(11,31,75,0.16)",
};

const fmt = n => "TSh " + Number(n).toLocaleString();

// ─── SVG Icons ──────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    arrowLeft:    <><line x1="19" y1="12" x2="5" y2="12" {...s}/><polyline points="12 19 5 12 12 5" {...s}/></>,
    share:        <><circle cx="18" cy="5" r="3" {...s}/><circle cx="6" cy="12" r="3" {...s}/><circle cx="18" cy="19" r="3" {...s}/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" {...s}/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" {...s}/></>,
    heart:        <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...s}/></>,
    heartFill:    <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={color} stroke={color} strokeWidth="1.4"/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    starEmpty:    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke={color} strokeWidth="1.4"/>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronUp:    <><polyline points="18 15 12 9 6 15" {...s}/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    refresh:      <><polyline points="23 4 23 10 17 10" {...s}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...s}/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    cart:         <><circle cx="9" cy="21" r="1" {...s}/><circle cx="20" cy="21" r="1" {...s}/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" {...s}/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    robot:        <><rect x="3" y="11" width="18" height="10" rx="2" {...s}/><path d="M12 11V7" {...s}/><circle cx="12" cy="5" r="2" {...s}/><line x1="8" y1="15" x2="8" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/><line x1="16" y1="15" x2="16" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    laptop:       <><rect x="2" y="3" width="20" height="14" rx="2" {...s}/><line x1="2" y1="17" x2="22" y2="17" {...s}/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    mapPin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    info:         <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    play:         <><polygon points="5 3 19 12 5 21 5 3" fill={color} stroke="none"/></>,
    view360:      <><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" {...s}/><path d="M2 12h20" {...s}/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    minus:        <><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2"/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, display: "block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — PRODUCT DATA
// Replace with: const product = await supabase
//   .from('products').select('*').eq('id', productId).single()
// ============================================================
const MOCK_PRODUCT = {
  id:           "PRD-001",
  name:         "iPhone 15 Pro Max 256GB Natural Titanium",
  category:     "Electronics",
  price:        1650000,
  original:     1800000,
  stock:        12,
  unit:         "piece",
  trustScore:   98,
  rating:       4.9,
  reviewCount:  2300,
  soldCount:    847,
  images:       ["laptop","view360","play","laptop"],  // 🔌 swap with real image URLs
  specs: [
    { label:"Display",   value:"6.7\" Super Retina XDR ProMotion"  },
    { label:"Chip",      value:"Apple A17 Pro"                      },
    { label:"Camera",    value:"48MP Main + 12MP Ultra Wide + 12MP Telephoto" },
    { label:"Battery",   value:"4422 mAh · Up to 29hr video"        },
    { label:"Storage",   value:"256GB"                              },
    { label:"Color",     value:"Natural Titanium"                   },
    { label:"OS",        value:"iOS 17"                             },
  ],
  delivery: {
    fee:          0,
    freeAbove:    true,
    estimatedDays:"2–3",
    location:     "Dar es Salaam",
  },
  returnPolicy: "7-day return · No questions asked",
  warranty:     "12 months manufacturer warranty",
  seller: {
    id:           "SEL-001",
    name:         "Tech Master Store",
    initials:     "TM",
    color:        "#1D4ED8",
    verified:     true,
    trustScore:   98,
    rating:       4.9,
    followers:    20000,
    orders:       15000,
    responseTime: "15 mins",
    memberSince:  "Jan 2021",
    location:     "Dar es Salaam",
    about:        "We sell original gadgets with warranty. Fast delivery across Tanzania.",
  },
  aiSummary: {
    pros:    ["Excellent camera system", "Long battery life", "Premium build quality"],
    cons:    ["Price is high", "No charger in box"],
    bestFor: ["Business professionals", "Content Creators", "Students"],
  },
  marketPrice:  1800000,
  reviews: [
    { id:1, name:"Hassan K",  initials:"HK", color:"#1D4ED8", rating:5, text:"Best phone I ever bought. Fast delivery and original product!", time:"2 days ago",  verified:true  },
    { id:2, name:"Amina Tz",  initials:"AT", color:"#6D28D9", rating:5, text:"Camera is incredible. Worth every shilling!",                time:"1 week ago",  verified:true  },
    { id:3, name:"Peter M",   initials:"PM", color:"#0A7B4B", rating:4, text:"Great phone, delivery was slightly late but product is perfect.", time:"2 weeks ago", verified:true  },
  ],
  similar: [
    { id:2, name:"iPhone 15 Pro 128GB",   price:1350000, rating:4.8, icon:"laptop"    },
    { id:3, name:"Samsung S24 Ultra",     price:1450000, rating:4.7, icon:"laptop"    },
    { id:4, name:"Google Pixel 8 Pro",    price:1200000, rating:4.6, icon:"laptop"    },
  ],
};

// ─── Trust Score Ring ───────────────────────────────────────
function TrustBadge({ score, size = "md" }) {
  const sz = size === "lg" ? 56 : size === "md" ? 44 : 32;
  const fs = size === "lg" ? 15 : size === "md" ? 12 : 9;
  return (
    <div style={{
      width: sz, height: sz, borderRadius: "50%",
      background: `conic-gradient(${T.green} ${score * 3.6}deg, ${T.border} 0deg)`,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <div style={{
        width: sz - 6, height: sz - 6, borderRadius: "50%",
        background: T.white,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: fs, fontWeight: 900, color: T.green, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: fs - 3, color: T.textMute, lineHeight: 1 }}>Trust</span>
      </div>
    </div>
  );
}

// ─── Star Row ───────────────────────────────────────────────
function Stars({ rating, size = 13 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Icon key={i} name={i <= Math.round(rating) ? "star" : "starEmpty"} size={size} color={T.gold}/>
      ))}
    </div>
  );
}

// ─── Bottom Nav ─────────────────────────────────────────────
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
            <span style={{ fontSize:10, fontWeight:isActive?800:500, color:isActive?T.navy:T.textMute }}>{item.label}</span>
            {isActive && <div style={{ width:4, height:4, borderRadius:"50%", background:T.gold }}/>}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// 🧱 MAIN COMPONENT — ProductDetails
// 🔌 Props for assembly: { productId, onBack, onSellerPress, onBuyNow }
// ============================================================
export default function App({
  // 🧭 NAVIGATE — swap these with real navigation in assembly
  onBack        = () => {},
  onSellerPress = () => {},   // → Brick 4 SellerProfile
  onBuyNow      = () => {},   // → Brick 6 Checkout / PandaWallet
  onChatSeller  = () => {},   // → Brick 10 Marketplace Chat
}) {
  // 🔌 BACKEND — replace MOCK_PRODUCT with fetched data
  const product = MOCK_PRODUCT;

  const [activeImage,   setActiveImage]   = useState(0);
  const [qty,           setQty]           = useState(1);
  const [wishlisted,    setWishlisted]    = useState(false);
  const [specsOpen,     setSpecsOpen]     = useState(false);
  const [reviewsOpen,   setReviewsOpen]   = useState(false);
  const [buyModal,      setBuyModal]      = useState(false);
  const [buyStep,       setBuyStep]       = useState(1); // 1=confirm 2=escrow 3=success
  const [activeTab,     setActiveTab]     = useState("details");

  const discount = Math.round(((product.original - product.price) / product.original) * 100);
  const savings  = product.original - product.price;

  // ── Escrow Buy Modal ────────────────────────────────────────
  const BuyModal = () => (
    <div style={{
      position:"fixed", inset:0, zIndex:999,
      background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"flex-end", justifyContent:"center",
    }} onClick={() => setBuyModal(false)}>
      <div onClick={e => e.stopPropagation()} style={{
        background:T.white, borderRadius:"28px 28px 0 0",
        padding:"28px 24px 40px", width:"100%", maxWidth:430,
        animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* Handle */}
        <div style={{ width:40, height:4, borderRadius:99, background:T.border, margin:"0 auto 24px" }}/>

        {buyStep === 1 && (
          <>
            <div style={{ fontSize:18, fontWeight:900, color:T.textMain, marginBottom:4 }}>Confirm Order</div>
            <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>Review your order before payment</div>
            {/* Product row */}
            <div style={{ display:"flex", gap:14, alignItems:"center",
              background:T.bg, borderRadius:18, padding:14, marginBottom:16 }}>
              <div style={{ width:56, height:56, borderRadius:14, background:T.navyLight,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name="laptop" size={28} color={T.navy+"44"}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:800, color:T.textMain, marginBottom:4, lineHeight:1.3 }}>
                  {product.name}
                </div>
                <div style={{ fontSize:15, fontWeight:900, color:T.navy, fontFamily:"monospace" }}>
                  {fmt(product.price * qty)}
                </div>
              </div>
            </div>
            {/* Qty */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              marginBottom:16, padding:"12px 16px", background:T.bg, borderRadius:14 }}>
              <span style={{ fontSize:13, fontWeight:700, color:T.textMid }}>Quantity</span>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <button onClick={() => setQty(q => Math.max(1,q-1))} style={{
                  width:32, height:32, borderRadius:9, background:T.white,
                  border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="minus" size={14} color={T.textMid}/>
                </button>
                <span style={{ fontSize:16, fontWeight:900, color:T.textMain, minWidth:20, textAlign:"center" }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))} style={{
                  width:32, height:32, borderRadius:9, background:T.white,
                  border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="plus" size={14} color={T.textMid}/>
                </button>
              </div>
            </div>
            {/* Summary */}
            {[
              ["Subtotal",  fmt(product.price * qty)],
              ["Delivery",  product.delivery.freeAbove ? "FREE" : fmt(product.delivery.fee)],
              ["Escrow Fee","FREE"],
            ].map(([l,v]) => (
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0",
                borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontSize:13, color:T.textMute }}>{l}</span>
                <span style={{ fontSize:13, fontWeight:800,
                  color: v==="FREE" ? T.green : T.textMain, fontFamily:"monospace" }}>{v}</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0 20px" }}>
              <span style={{ fontSize:15, fontWeight:900, color:T.textMain }}>Total</span>
              <span style={{ fontSize:17, fontWeight:900, color:T.navy, fontFamily:"monospace" }}>
                {fmt(product.price * qty)}
              </span>
            </div>
            <button onClick={() => setBuyStep(2)} style={{
              width:"100%", padding:"16px 0", borderRadius:18,
              background:`linear-gradient(135deg,${T.gold},#A07008)`,
              border:"none", color:"#fff", fontSize:15, fontWeight:900,
              cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"center", gap:8,
              boxShadow:`0 8px 24px ${T.gold}44`,
            }}>
              <Icon name="lock" size={16} color="#fff"/>
              {/* 💰 WALLET — connect to PandaWallet.pay() */}
              Pay with Panda Wallet (Escrow)
            </button>
          </>
        )}

        {buyStep === 2 && (
          <>
            <div style={{ fontSize:18, fontWeight:900, color:T.textMain, marginBottom:4 }}>Panda Escrow</div>
            <div style={{ fontSize:13, color:T.textMute, marginBottom:24 }}>Your money is protected until delivery</div>
            {/* Escrow steps */}
            {[
              { n:1, title:"You Pay",            desc:"Payment deducted from Panda Wallet",  done:true  },
              { n:2, title:"Panda Holds Money",  desc:"Funds held securely by Panda",        done:false },
              { n:3, title:"You Receive & Confirm", desc:"Confirm delivery in the app",      done:false },
              { n:4, title:"Seller Gets Paid",   desc:"Funds released to seller",            done:false },
            ].map((step, i) => (
              <div key={step.n} style={{ display:"flex", gap:14, marginBottom:i<3?16:24 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{
                    width:36, height:36, borderRadius:"50%", flexShrink:0,
                    background: step.done ? T.green : T.navyLight,
                    border:`2px solid ${step.done ? T.green : T.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    {step.done
                      ? <Icon name="check" size={16} color="#fff"/>
                      : <span style={{ fontSize:13, fontWeight:900, color:T.textMid }}>{step.n}</span>
                    }
                  </div>
                  {i < 3 && <div style={{ width:2, height:20, background:T.border, marginTop:4 }}/>}
                </div>
                <div style={{ paddingTop:6 }}>
                  <div style={{ fontSize:14, fontWeight:800, color:T.textMain }}>{step.title}</div>
                  <div style={{ fontSize:12, color:T.textMute, marginTop:2 }}>{step.desc}</div>
                </div>
              </div>
            ))}
            <button onClick={() => { setBuyStep(3); }} style={{
              width:"100%", padding:"16px 0", borderRadius:18,
              background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
              border:"none", color:"#fff", fontSize:15, fontWeight:900,
              cursor:"pointer", boxShadow:`0 8px 24px ${T.navy}44`,
            }}>
              Confirm & Pay Now
            </button>
          </>
        )}

        {buyStep === 3 && (
          <div style={{ textAlign:"center", padding:"16px 0 8px" }}>
            <div style={{
              width:80, height:80, borderRadius:"50%", background:T.greenBg,
              border:`3px solid ${T.green}44`,
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 20px", animation:"bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
              <Icon name="check" size={40} color={T.green}/>
            </div>
            <div style={{ fontSize:22, fontWeight:900, color:T.textMain, marginBottom:8 }}>Order Placed!</div>
            <div style={{ fontSize:13, color:T.textMute, lineHeight:1.7, marginBottom:8 }}>
              Your payment is held safely in Panda Escrow.
              The seller has been notified to ship your order.
            </div>
            <div style={{ display:"inline-block", background:T.navyLight, borderRadius:10,
              padding:"7px 18px", fontSize:13, fontWeight:900, color:T.navy,
              fontFamily:"monospace", letterSpacing:1, marginBottom:28 }}>
              ORD-{Math.floor(100000 + Math.random()*900000)}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => { setBuyModal(false); setBuyStep(1); }} style={{
                flex:1, padding:"13px 0", borderRadius:14,
                background:T.navyLight, border:`1px solid ${T.border}`,
                fontSize:13, fontWeight:800, color:T.textMid, cursor:"pointer",
              }}>Continue Shopping</button>
              <button style={{
                flex:1, padding:"13px 0", borderRadius:14,
                background:`linear-gradient(135deg,${T.gold},#A07008)`,
                border:"none", color:"#fff", fontSize:13, fontWeight:800,
                cursor:"pointer",
              }}>
                {/* 🧭 NAVIGATE → Brick 6 Logistics/Tracking */}
                Track Order
              </button>
            </div>
          </div>
        )}
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
        @keyframes fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp   { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes bounceIn  { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes shimmer   { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

      {buyModal && <BuyModal/>}

      {/* ── TOP BAR ── */}
      <div style={{
        background:"rgba(255,255,255,0.96)", backdropFilter:"blur(16px)",
        padding:"14px 20px", position:"sticky", top:0, zIndex:100,
        borderBottom:`1px solid ${T.border}`,
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        {/* 🧭 NAVIGATE → onBack() goes to previous screen */}
        <button onClick={onBack} style={{
          width:40, height:40, borderRadius:12, background:T.navyLight,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Icon name="arrowLeft" size={18} color={T.navy}/>
        </button>
        <div style={{ fontSize:14, fontWeight:800, color:T.textMain }}>Product Details</div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => setWishlisted(w => !w)} style={{
            width:40, height:40, borderRadius:12,
            background: wishlisted ? T.redBg : T.navyLight,
            border:`1px solid ${wishlisted ? T.red+"33" : T.border}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.18s",
          }}>
            <Icon name={wishlisted ? "heartFill" : "heart"} size={17}
              color={wishlisted ? T.red : T.textMid}/>
          </button>
          <button style={{
            width:40, height:40, borderRadius:12, background:T.navyLight,
            border:`1px solid ${T.border}`,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <Icon name="share" size={17} color={T.navy}/>
          </button>
        </div>
      </div>

      {/* ── PRODUCT IMAGE GALLERY ── */}
      <div style={{ background:T.white, padding:"0 20px 20px" }}>
        {/* Main image */}
        <div style={{
          height:260, borderRadius:22, marginBottom:14,
          background:`linear-gradient(135deg,${T.navyLight},${T.bg})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          position:"relative", overflow:"hidden",
          border:`1px solid ${T.border}`,
        }}>
          <Icon name="laptop" size={140} color={T.navy+"22"}/>
          {/* Discount badge */}
          <div style={{
            position:"absolute", top:14, left:14,
            background:T.red, color:"#fff", borderRadius:10,
            padding:"4px 12px", fontSize:13, fontWeight:900,
          }}>-{discount}%</div>
          {/* Trust badge */}
          <div style={{ position:"absolute", top:14, right:14 }}>
            <TrustBadge score={product.trustScore} size="md"/>
          </div>
          {/* Stock warning */}
          {product.stock < 15 && (
            <div style={{
              position:"absolute", bottom:12, left:14,
              background:T.gold+"EE", color:"#fff", borderRadius:8,
              padding:"3px 10px", fontSize:11, fontWeight:800,
            }}>
              Only {product.stock} left!
            </div>
          )}
        </div>
        {/* Thumbnail row */}
        <div style={{ display:"flex", gap:10 }}>
          {product.images.map((img, i) => (
            <div key={i} onClick={() => setActiveImage(i)} style={{
              width:64, height:64, borderRadius:14, cursor:"pointer",
              background: activeImage===i
                ? `linear-gradient(135deg,${T.navy}18,${T.navy}28)`
                : T.navyLight,
              border:`2px solid ${activeImage===i ? T.navy : T.border}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all 0.18s", flexShrink:0,
            }}>
              {img === "play"
                ? <div style={{ width:22, height:22, borderRadius:"50%",
                    background:T.navy, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name="play" size={10} color="#fff"/>
                  </div>
                : img === "view360"
                  ? <Icon name="view360" size={24} color={T.navy+"66"}/>
                  : <Icon name="laptop" size={28} color={T.navy+"44"}/>
              }
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── PRODUCT TITLE & RATING ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:11, color:T.textMute, fontWeight:700,
            textTransform:"uppercase", letterSpacing:0.9, marginBottom:8 }}>
            {product.category}
          </div>
          <div style={{ fontSize:17, fontWeight:900, color:T.textMain,
            lineHeight:1.35, marginBottom:12 }}>
            {product.name}
          </div>
          {/* Rating row */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14,
            flexWrap:"wrap" }}>
            <Stars rating={product.rating}/>
            <span style={{ fontSize:13, fontWeight:800, color:T.textMid }}>
              {product.rating} ({product.reviewCount.toLocaleString()} reviews)
            </span>
            <div style={{ width:1, height:14, background:T.border }}/>
            <span style={{ fontSize:12, color:T.textMute, fontWeight:600 }}>
              {product.soldCount.toLocaleString()} sold
            </span>
          </div>
          {/* Price */}
          <div style={{ display:"flex", alignItems:"flex-end", gap:10, flexWrap:"wrap" }}>
            <div style={{ fontSize:26, fontWeight:900, color:T.navy,
              fontFamily:"monospace", letterSpacing:-1 }}>{fmt(product.price)}</div>
            <div style={{ fontSize:15, color:T.textMute, textDecoration:"line-through",
              fontFamily:"monospace", marginBottom:2 }}>{fmt(product.original)}</div>
            <div style={{ background:T.greenBg, border:`1px solid ${T.green}33`,
              borderRadius:8, padding:"3px 10px", fontSize:12, fontWeight:800, color:T.green }}>
              Save {fmt(savings)}
            </div>
          </div>
        </div>

        {/* ── SELLER INFO ── */}
        {/* 🧭 NAVIGATE → onSellerPress() goes to Brick 4 SellerProfile */}
        <div onClick={onSellerPress} style={{
          background:T.card, borderRadius:22, padding:"16px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}`,
          cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ position:"relative" }}>
              <div style={{
                width:48, height:48, borderRadius:14,
                background:`linear-gradient(135deg,${product.seller.color}22,${product.seller.color}44)`,
                border:`2px solid ${product.seller.color}33`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:15, fontWeight:900, color:product.seller.color,
              }}>{product.seller.initials}</div>
              {product.seller.verified && (
                <div style={{
                  position:"absolute", bottom:-3, right:-3,
                  width:18, height:18, borderRadius:"50%",
                  background:T.blue, border:`2px solid ${T.white}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <Icon name="shield" size={9} color="#fff"/>
                </div>
              )}
            </div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                <span style={{ fontSize:13, fontWeight:800, color:T.textMain }}>{product.seller.name}</span>
                <div style={{ display:"flex", alignItems:"center", gap:3,
                  background:T.greenBg, borderRadius:6, padding:"1px 6px" }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:T.green }}/>
                  <span style={{ fontSize:10, fontWeight:900, color:T.green }}>{product.seller.trustScore}</span>
                </div>
              </div>
              <div style={{ fontSize:11, color:T.textMute }}>
                {product.seller.followers.toLocaleString()} followers · ⚡ Replies in {product.seller.responseTime}
              </div>
            </div>
          </div>
          <Icon name="chevronRight" size={16} color={T.textMute}/>
        </div>

        {/* ── TABS ── */}
        <div style={{ display:"flex", background:T.card, borderRadius:18,
          border:`1px solid ${T.border}`, padding:4, marginBottom:16,
          boxShadow:T.shadow }}>
          {["details","reviews","similar"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              flex:1, padding:"10px 0", borderRadius:14, border:"none",
              fontSize:12, fontWeight: activeTab===t ? 800 : 500,
              background: activeTab===t ? T.navy : "transparent",
              color: activeTab===t ? "#fff" : T.textMute,
              transition:"all 0.2s",
              boxShadow: activeTab===t ? `0 4px 12px ${T.navy}33` : "none",
            }}>
              {t === "details" ? "Details" : t === "reviews" ? `Reviews (${product.reviewCount.toLocaleString()})` : "Similar"}
            </button>
          ))}
        </div>

        {/* ══ DETAILS TAB ══ */}
        {activeTab === "details" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>

            {/* Panda AI Summary */}
            <div style={{
              background:`linear-gradient(135deg,#3B1FA3,#6D28D9)`,
              borderRadius:22, padding:"18px 20px", marginBottom:14,
              position:"relative", overflow:"hidden",
            }}>
              <div style={{ position:"absolute", inset:0, opacity:0.06,
                backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
                backgroundSize:"16px 16px" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, position:"relative" }}>
                <div style={{ width:32, height:32, borderRadius:9,
                  background:"rgba(255,255,255,0.15)",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="robot" size={17} color="#fff"/>
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.7)",
                    letterSpacing:0.8 }}>PANDA AI SUMMARY</div>
                </div>
                <div style={{ marginLeft:"auto", background:"rgba(255,255,255,0.15)",
                  borderRadius:8, padding:"3px 8px", fontSize:10,
                  fontWeight:700, color:"rgba(255,255,255,0.8)" }}>Powered by Panda AI</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12,
                position:"relative", marginBottom:14 }}>
                <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:14, padding:"12px 14px" }}>
                  <div style={{ fontSize:11, fontWeight:800, color:T.greenBg,
                    marginBottom:8, letterSpacing:0.5 }}>✓ PROS</div>
                  {product.aiSummary.pros.map((p,i) => (
                    <div key={i} style={{ display:"flex", gap:6, alignItems:"flex-start", marginBottom:5 }}>
                      <Icon name="check" size={11} color="#4ADE80"/>
                      <span style={{ fontSize:11, color:"rgba(255,255,255,0.85)", lineHeight:1.4 }}>{p}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:14, padding:"12px 14px" }}>
                  <div style={{ fontSize:11, fontWeight:800, color:"#FCA5A5",
                    marginBottom:8, letterSpacing:0.5 }}>✕ CONS</div>
                  {product.aiSummary.cons.map((c,i) => (
                    <div key={i} style={{ display:"flex", gap:6, alignItems:"flex-start", marginBottom:5 }}>
                      <span style={{ fontSize:11, color:"#FCA5A5", lineHeight:1 }}>×</span>
                      <span style={{ fontSize:11, color:"rgba(255,255,255,0.85)", lineHeight:1.4 }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:14,
                padding:"12px 14px", position:"relative" }}>
                <div style={{ fontSize:11, fontWeight:800, color:T.goldMid, marginBottom:8 }}>BEST FOR</div>
                <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                  {product.aiSummary.bestFor.map((b,i) => (
                    <div key={i} style={{ background:"rgba(255,255,255,0.15)", borderRadius:8,
                      padding:"4px 10px", fontSize:11, fontWeight:700, color:"#fff" }}>{b}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Smart Price Analysis */}
            <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
              boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <Icon name="sparkle" size={16} color={T.gold}/>
                <span style={{ fontSize:14, fontWeight:900, color:T.textMain }}>Smart Price Analysis</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:14 }}>
                {[
                  { label:"Market Price",  value:fmt(product.marketPrice),  color:T.textMute },
                  { label:"Seller Price",  value:fmt(product.price),        color:T.navy     },
                  { label:"You Save",      value:fmt(savings),              color:T.green    },
                ].map(item => (
                  <div key={item.label} style={{ background:T.bg, borderRadius:14,
                    padding:"12px 10px", textAlign:"center",
                    border:`1px solid ${T.border}` }}>
                    <div style={{ fontSize:12, fontWeight:900, color:item.color,
                      fontFamily:"monospace", marginBottom:4, lineHeight:1.2 }}>{item.value}</div>
                    <div style={{ fontSize:9, color:T.textMute, fontWeight:700,
                      textTransform:"uppercase", letterSpacing:0.4 }}>{item.label}</div>
                  </div>
                ))}
              </div>
              {/* Price bar */}
              <div style={{ marginBottom:6 }}>
                <div style={{ height:8, background:T.border, borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:99,
                    width:`${(product.price / product.marketPrice) * 100}%`,
                    background:`linear-gradient(90deg,${T.green},${T.gold})` }}/>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:T.green }}/>
                <span style={{ fontSize:12, fontWeight:700, color:T.green }}>Good Deal</span>
                <span style={{ fontSize:11, color:T.textMute }}>· {discount}% below market price</span>
              </div>
            </div>

            {/* Panda Escrow */}
            <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
              borderRadius:22, padding:"18px 20px", marginBottom:14,
              position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", inset:0, opacity:0.05,
                backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
                backgroundSize:"16px 16px" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:8,
                marginBottom:16, position:"relative" }}>
                <Icon name="shield" size={16} color={T.gold}/>
                <span style={{ fontSize:14, fontWeight:900, color:"#fff" }}>Panda Escrow</span>
                <span style={{ marginLeft:"auto", fontSize:11, fontWeight:700,
                  color:"rgba(255,255,255,0.6)" }}>Buy with Confidence</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", position:"relative" }}>
                {["You Pay","Panda Holds Your Money","You Receive & Confirm","Seller Gets Paid"].map((step,i) => (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div style={{ display:"flex", alignItems:"center", width:"100%" }}>
                      {i > 0 && <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.2)" }}/>}
                      <div style={{
                        width:28, height:28, borderRadius:"50%", flexShrink:0,
                        background: i===3 ? T.green : "rgba(255,255,255,0.12)",
                        border:`1.5px solid ${i===3 ? T.green : "rgba(255,255,255,0.25)"}`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:11, fontWeight:900, color:"#fff",
                      }}>
                        {i===3 ? <Icon name="check" size={13} color="#fff"/> : i+1}
                      </div>
                      {i < 3 && <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.2)" }}/>}
                    </div>
                    <span style={{ fontSize:8.5, color:"rgba(255,255,255,0.65)", fontWeight:600,
                      textAlign:"center", lineHeight:1.3, marginTop:6, padding:"0 2px" }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Return */}
            <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
              boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
              {[
                { icon:"truck",   label:"Delivery",      value:`${product.delivery.estimatedDays} days · ${product.delivery.freeAbove ? "FREE" : fmt(product.delivery.fee)}`, color:T.blue  },
                { icon:"mapPin",  label:"Ships from",    value:product.delivery.location,  color:T.navy  },
                { icon:"refresh", label:"Returns",       value:product.returnPolicy,       color:T.green },
                { icon:"award",   label:"Warranty",      value:product.warranty,           color:T.gold  },
              ].map((item,i) => (
                <div key={item.label} style={{ display:"flex", gap:14, padding:"11px 0",
                  borderBottom: i<3 ? `1px solid ${T.border}` : "none", alignItems:"center" }}>
                  <div style={{ width:36, height:36, borderRadius:11, background:item.color+"14",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name={item.icon} size={16} color={item.color}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
                      textTransform:"uppercase", letterSpacing:0.7, marginBottom:2 }}>{item.label}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:T.textMid }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Specs */}
            <div style={{ background:T.card, borderRadius:22, border:`1px solid ${T.border}`,
              boxShadow:T.shadow, marginBottom:14, overflow:"hidden" }}>
              <button onClick={() => setSpecsOpen(s => !s)} style={{
                width:"100%", padding:"16px 20px", background:"none", border:"none",
                display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <Icon name="info" size={16} color={T.navy}/>
                  <span style={{ fontSize:14, fontWeight:800, color:T.textMain }}>Specifications</span>
                </div>
                <Icon name={specsOpen ? "chevronUp" : "chevronDown"} size={16} color={T.textMute}/>
              </button>
              {specsOpen && (
                <div style={{ padding:"0 20px 16px", animation:"fadeUp 0.2s ease" }}>
                  {product.specs.map((spec,i) => (
                    <div key={spec.label} style={{ display:"flex", justifyContent:"space-between",
                      padding:"10px 0", borderTop:`1px solid ${T.border}` }}>
                      <span style={{ fontSize:12, color:T.textMute, fontWeight:600 }}>{spec.label}</span>
                      <span style={{ fontSize:12, fontWeight:700, color:T.textMid,
                        maxWidth:"60%", textAlign:"right" }}>{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ REVIEWS TAB ══ */}
        {activeTab === "reviews" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {/* Rating summary */}
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", gap:20, alignItems:"center" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:52, fontWeight:900, color:T.navy,
                    lineHeight:1, fontFamily:"monospace" }}>{product.rating}</div>
                  <Stars rating={product.rating} size={16}/>
                  <div style={{ fontSize:11, color:T.textMute, marginTop:6 }}>
                    {product.reviewCount.toLocaleString()} reviews
                  </div>
                </div>
                <div style={{ flex:1 }}>
                  {[{s:5,pct:78},{s:4,pct:14},{s:3,pct:5},{s:2,pct:2},{s:1,pct:1}].map(r => (
                    <div key={r.s} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:T.textMute, width:8 }}>{r.s}</span>
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
            {/* 🔌 BACKEND — replace with: supabase.from('reviews').select().eq('product_id', productId) */}
            {product.reviews.map(r => (
              <div key={r.id} style={{ background:T.card, borderRadius:22, padding:"18px 20px",
                boxShadow:T.shadow, marginBottom:12, border:`1px solid ${T.border}` }}>
                <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
                  <div style={{ width:42, height:42, borderRadius:12,
                    background:`linear-gradient(135deg,${r.color}22,${r.color}44)`,
                    border:`2px solid ${r.color}33`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:13, fontWeight:900, color:r.color }}>
                    {r.initials}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
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
          </div>
        )}

        {/* ══ SIMILAR TAB ══ */}
        {activeTab === "similar" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {/* 🔌 BACKEND — replace with: supabase.from('products').select().eq('category', product.category).neq('id', product.id) */}
            {product.similar.map(p => (
              <div key={p.id} style={{ background:T.card, borderRadius:22, padding:"16px 20px",
                boxShadow:T.shadow, marginBottom:12, border:`1px solid ${T.border}`,
                display:"flex", gap:14, alignItems:"center", cursor:"pointer" }}>
                <div style={{ width:60, height:60, borderRadius:16, background:T.navyLight,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name={p.icon} size={28} color={T.navy+"44"}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:T.textMain, marginBottom:5 }}>{p.name}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <Icon name="star" size={11} color={T.gold}/>
                    <span style={{ fontSize:11, fontWeight:700, color:T.textMid }}>{p.rating}</span>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:14, fontWeight:900, color:T.navy, fontFamily:"monospace" }}>
                    {fmt(p.price)}
                  </div>
                  <Icon name="chevronRight" size={14} color={T.textMute}/>
                </div>
              </div>
            ))}
          </div>
        )}

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
          {/* 🧭 NAVIGATE → onChatSeller() → Brick 10 Marketplace Chat */}
          <button onClick={onChatSeller} style={{
            width:50, height:50, borderRadius:16,
            background:T.navyLight, border:`1px solid ${T.border}`,
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          }}>
            <Icon name="message" size={20} color={T.navy}/>
          </button>
          <button onClick={() => { setBuyModal(true); setBuyStep(1); }} style={{
            flex:1, padding:"14px 0", borderRadius:16,
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            border:"none", color:"#fff", fontSize:15, fontWeight:900,
            cursor:"pointer", display:"flex", alignItems:"center",
            justifyContent:"center", gap:8,
            boxShadow:`0 6px 20px ${T.gold}44`,
          }}>
            <Icon name="lock" size={17} color="#fff"/>
            {/* 💰 WALLET → PandaWallet.initiateEscrow(product.id, product.price * qty) */}
            Buy Now (Escrow)
          </button>
        </div>
      </div>
    </div>
  );
}

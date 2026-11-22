import { useState, useEffect, useRef } from "react";

// ─── Design Tokens ─────────────────────────────────────────────────────────
const T = {
  bg:         "#F4F6FF",
  surface:    "#FFFFFF",
  card:       "#FFFFFF",
  cardAlt:    "#EEF2FF",
  navy:       "#0B1F4B",
  navyMid:    "#1A3A6E",
  navyLight:  "#EEF2FF",
  gold:       "#C9960A",
  goldLight:  "#FFF8E1",
  goldMid:    "#F5C842",
  text:       "#0B1F4B",
  textMid:    "#3D5A8A",
  textMute:   "#8A9BC0",
  green:      "#0A7B4B",
  greenBg:    "#E8F7F0",
  red:        "#C0392B",
  redBg:      "#FDECEA",
  amber:      "#B45309",
  amberBg:    "#FEF3C7",
  blue:       "#1D4ED8",
  blueBg:     "#EFF6FF",
  purple:     "#6D28D9",
  purpleBg:   "#F5F3FF",
  border:     "#DDE3F5",
  shadow:     "0 2px 16px rgba(11,31,75,0.07)",
  shadowMd:   "0 8px 32px rgba(11,31,75,0.11)",
  shadowLg:   "0 20px 60px rgba(11,31,75,0.16)",
  shadowGold: "0 8px 24px rgba(201,150,10,0.28)",
};

const fmt = n => "TSh " + Number(n).toLocaleString();

// ─── SVG Icons ──────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.6", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    mapPin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    phone:        <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" {...s}/></>,
    globe:        <><circle cx="12" cy="12" r="10" {...s}/><line x1="2" y1="12" x2="22" y2="12" {...s}/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" {...s}/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke={color} strokeWidth="1.4" fill={color} opacity="0.95"/>,
    starEmpty:    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke={color} strokeWidth="1.4" fill="none"/>,
    starHalf:     <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke={color} strokeWidth="1.4" fill="none"/><clipPath id="half"><rect x="0" y="0" width="12" height="24"/></clipPath><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} clipPath="url(#half)"/></>,
    heart:        <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...s}/></>,
    heartFill:    <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={color} strokeWidth="1.4" fill={color}/></>,
    share:        <><circle cx="18" cy="5" r="3" {...s}/><circle cx="6" cy="12" r="3" {...s}/><circle cx="18" cy="19" r="3" {...s}/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" {...s}/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" {...s}/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.8" fill="none"/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    chevronLeft:  <><polyline points="15 18 9 12 15 6" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    search:       <><circle cx="11" cy="11" r="8" {...s}/><line x1="21" y1="21" x2="16.65" y2="16.65" {...s}/></>,
    filter:       <><line x1="4" y1="6" x2="20" y2="6" {...s}/><line x1="8" y1="12" x2="16" y2="12" {...s}/><line x1="11" y1="18" x2="13" y2="18" {...s}/></>,
    cart:         <><circle cx="9" cy="21" r="1" {...s}/><circle cx="20" cy="21" r="1" {...s}/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2"/></>,
    minus:        <><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    tag:          <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" {...s}/><line x1="7" y1="7" x2="7.01" y2="7" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    grid:         <><rect x="3" y="3" width="7" height="7" {...s}/><rect x="14" y="3" width="7" height="7" {...s}/><rect x="14" y="14" width="7" height="7" {...s}/><rect x="3" y="14" width="7" height="7" {...s}/></>,
    list:         <><line x1="8" y1="6" x2="21" y2="6" {...s}/><line x1="8" y1="12" x2="21" y2="12" {...s}/><line x1="8" y1="18" x2="21" y2="18" {...s}/><circle cx="3" cy="6" r="1" fill={color} stroke="none"/><circle cx="3" cy="12" r="1" fill={color} stroke="none"/><circle cx="3" cy="18" r="1" fill={color} stroke="none"/></>,
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    store:        <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    trending:     <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/><polyline points="3.27 6.96 12 12.01 20.73 6.96" {...s}/><line x1="12" y1="22.08" x2="12" y2="12" {...s}/></>,
    scissors:     <><circle cx="6" cy="6" r="3" {...s}/><circle cx="6" cy="18" r="3" {...s}/><line x1="20" y1="4" x2="8.12" y2="15.88" {...s}/><line x1="14.47" y1="14.48" x2="20" y2="20" {...s}/><line x1="8.12" y1="8.12" x2="12" y2="12" {...s}/></>,
    coffee:       <><path d="M18 8h1a4 4 0 0 1 0 8h-1" {...s}/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" {...s}/><line x1="6" y1="1" x2="6" y2="4" {...s}/><line x1="10" y1="1" x2="10" y2="4" {...s}/><line x1="14" y1="1" x2="14" y2="4" {...s}/></>,
    utensils:     <><line x1="3" y1="2" x2="3" y2="22" {...s}/><path d="M7 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" {...s}/><path d="M21 2v22" {...s}/><path d="M21 7H7" {...s}/></>,
    send:         <><line x1="22" y1="2" x2="11" y2="13" {...s}/><polygon points="22 2 15 22 11 13 2 9 22 2" {...s}/></>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
    zap:          <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke={color} strokeWidth="1.6" fill={color} opacity="0.9"/></>,
    arrowLeft:    <><line x1="19" y1="12" x2="5" y2="12" {...s}/><polyline points="12 19 5 12 12 5" {...s}/></>,
    bell:         <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...s}/><path d="M13.73 21a2 2 0 0 1-3.46 0" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" stroke={color} strokeWidth="1.5" fill={color} opacity="0.85"/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    refresh:      <><polyline points="23 4 23 10 17 10" {...s}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...s}/></>,
    percent:      <><line x1="19" y1="5" x2="5" y2="19" {...s}/><circle cx="6.5" cy="6.5" r="2.5" {...s}/><circle cx="17.5" cy="17.5" r="2.5" {...s}/></>,
    info:         <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    shoppingBag:  <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" {...s}/><line x1="3" y1="6" x2="21" y2="6" {...s}/><path d="M16 10a4 4 0 0 1-8 0" {...s}/></>,
    box:          <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    camera:       <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    flag:         <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" {...s}/><line x1="4" y1="22" x2="4" y2="15" {...s}/></>,
    leaf:         <><path d="M17 8C8 10 5.9 16.17 3.82 22.5L2 22l1-10a9 9 0 0 1 9-9 8.41 8.41 0 0 1 5.82 2.29l.18-1.29" {...s}/><path d="M2 22l15-7" {...s}/></>,
    lightning:    <><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Primitives ─────────────────────────────────────────────────────────────
function Badge({ children, color, bg, size = "sm" }) {
  const fs = size === "xs" ? 10 : 11;
  return (
    <span style={{
      background: bg || color + "14", color,
      border: `1px solid ${color}28`,
      borderRadius: 99, padding: size === "xs" ? "2px 8px" : "3px 10px",
      fontSize: fs, fontWeight: 700,
      display: "inline-flex", alignItems: "center", gap: 4, lineHeight: 1.4,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", full, icon, loading, disabled, style: extraStyle = {} }) {
  const pad = size === "xs" ? "6px 12px" : size === "sm" ? "9px 18px" : size === "lg" ? "16px 36px" : "13px 24px";
  const fs  = size === "xs" ? 11 : size === "sm" ? 12 : size === "lg" ? 15 : 13;
  const V = {
    primary: { background: `linear-gradient(135deg,${T.navy} 0%,${T.navyMid} 100%)`, color:"#fff", border:"none", boxShadow:`0 4px 16px ${T.navy}33` },
    gold:    { background: `linear-gradient(135deg,${T.gold} 0%,#A07008 100%)`,       color:"#fff", border:"none", boxShadow:T.shadowGold },
    outline: { background:"transparent", color:T.navy, border:`1.5px solid ${T.navy}33` },
    ghost:   { background:T.cardAlt, color:T.textMid, border:`1px solid ${T.border}` },
    danger:  { background:T.redBg, color:T.red, border:`1px solid ${T.red}33` },
    success: { background:T.greenBg, color:T.green, border:`1px solid ${T.green}33` },
    white:   { background:"#fff", color:T.navy, border:"none", boxShadow:T.shadowMd },
    subtle:  { background:"rgba(255,255,255,0.15)", color:"#fff", border:"1px solid rgba(255,255,255,0.25)", backdropFilter:"blur(8px)" },
  };
  return (
    <button onClick={onClick} disabled={!!disabled || !!loading}
      style={{
        borderRadius: 14, cursor: disabled || loading ? "not-allowed" : "pointer",
        fontFamily:"inherit", fontWeight:700, transition:"all 0.18s",
        display:"inline-flex", alignItems:"center", justifyContent:"center",
        gap:8, padding:pad, fontSize:fs, width:full?"100%":"auto",
        opacity:disabled||loading ? 0.6 : 1, letterSpacing:0.1,
        ...V[variant], ...extraStyle
      }}>
      {icon && <Icon name={icon} size={fs+2} color="currentColor"/>}
      {loading ? "Loading..." : children}
    </button>
  );
}

function Card({ children, style={}, onClick, hover, glass }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: glass ? "rgba(255,255,255,0.85)" : T.card,
        backdropFilter: glass ? "blur(12px)" : undefined,
        border:`1px solid ${T.border}`,
        borderRadius:22, padding:20,
        boxShadow: hov ? T.shadowMd : T.shadow,
        transition:"all 0.22s cubic-bezier(0.4,0,0.2,1)",
        cursor:onClick?"pointer":"default",
        transform: hov ? "translateY(-2px)" : "none",
        ...style
      }}>
      {children}
    </div>
  );
}

function StarRating({ rating, count, size=14, showCount=true }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
      <div style={{ display:"flex", gap:1.5 }}>
        {[1,2,3,4,5].map(i => (
          <Icon key={i} name={i <= Math.round(rating) ? "star" : "starEmpty"} size={size} color={T.gold}/>
        ))}
      </div>
      <span style={{ fontSize:size, fontWeight:800, color:T.text, lineHeight:1 }}>{rating.toFixed(1)}</span>
      {showCount && count && <span style={{ fontSize:size-2, color:T.textMute }}>({count.toLocaleString()})</span>}
    </div>
  );
}

function Modal({ title, subtitle, onClose, children, wide }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:999, display:"flex",
      alignItems:"center", justifyContent:"center", padding:16,
      background:"rgba(11,31,75,0.55)", backdropFilter:"blur(8px)" }}>
      <div style={{
        background:T.surface, borderRadius:28, padding:"30px 28px",
        width:"100%", maxWidth: wide ? 540 : 460, maxHeight:"90vh", overflowY:"auto",
        boxShadow:T.shadowLg, border:`1px solid ${T.border}`,
        position:"relative", animation:"modalIn 0.28s cubic-bezier(0.34,1.56,0.64,1)"
      }}>
        <div style={{ position:"absolute", top:0, left:"25%", right:"25%", height:3,
          background:`linear-gradient(90deg,transparent,${T.gold},transparent)`, borderRadius:99 }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <div>
            <div style={{ fontSize:17, fontWeight:900, color:T.text, letterSpacing:-0.3 }}>{title}</div>
            {subtitle && <div style={{ fontSize:12, color:T.textMute, marginTop:4 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} aria-label="Close"
            style={{ width:36, height:36, borderRadius:10, background:T.cardAlt,
              border:`1px solid ${T.border}`, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Icon name="x" size={15} color={T.textMute}/>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
function Skeleton({ w="100%", h=16, radius=8, style={} }) {
  return (
    <div style={{ width:w, height:h, borderRadius:radius, background:`linear-gradient(90deg,${T.border} 25%,${T.cardAlt} 50%,${T.border} 75%)`, backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite", ...style }}/>
  );
}

// ─── Product Image Tile ───────────────────────────────────────────────────────
const PRODUCT_COLORS = {
  "Vegetables": ["#E8F7F0","#0A7B4B"],
  "Cooking":    ["#FEF3C7","#B45309"],
  "Grains":     ["#FFF8E1","#C9960A"],
  "Meat":       ["#FDECEA","#C0392B"],
  "Fruits":     ["#F5F3FF","#6D28D9"],
};

const PRODUCT_ICONS = {
  1: "leaf", 2: "coffee", 3: "box", 4: "flag",
  5: "leaf", 6: "box", 7: "leaf", 8: "shoppingBag",
};

function ProductImage({ product, size = 120, radius = 14 }) {
  const [bg, accent] = PRODUCT_COLORS[product.category] || [T.cardAlt, T.navyMid];
  const iconName = PRODUCT_ICONS[product.id] || "box";
  return (
    <div style={{ width:size, height:size, borderRadius:radius, background:bg,
      display:"flex", alignItems:"center", justifyContent:"center",
      position:"relative", overflow:"hidden", flexShrink:0 }}>
      <div style={{ position:"absolute", bottom:-8, right:-8, width:size*0.6, height:size*0.6,
        borderRadius:"50%", background:accent+"14" }}/>
      <Icon name={iconName} size={size*0.38} color={accent}/>
    </div>
  );
}

// ─── Data ───────────────────────────────────────────────────────────────────
const BUSINESS = {
  id:           "BIZ-00291",
  name:         "Mama Amina Store",
  tagline:      "Fresh groceries & household essentials — delivered to your door",
  category:     "Grocery & Essentials",
  avatar:       "MA",
  avatarColor:  T.green,
  rating:       4.8,
  reviewCount:  3214,
  followers:    8420,
  following:    false,
  verified:     true,
  verifiedType: "Verified Business",
  location:     "Mwanakwerekwe Market, Zanzibar",
  phone:        "+255 777 123 456",
  website:      "mamaamina.co.tz",
  hours:        "Mon–Sat: 7:00 AM – 8:00 PM · Sun: 8:00 AM – 5:00 PM",
  openNow:      true,
  delivery:     true,
  deliveryTime: "30–45 min",
  deliveryFee:  3000,
  minOrder:     15000,
  joinDate:     "January 2018",
  description:  "Established in 2018, Mama Amina Store is Zanzibar's most trusted grocery destination. We source fresh produce directly from local farmers every morning, ensuring the best quality at the fairest prices. From daily essentials to specialty items, we deliver happiness to over 500 households every day.",
  stats: [
    { label:"Orders",   value:"12.4K", icon:"shoppingBag", color:T.blue   },
    { label:"Products", value:"340+",  icon:"box",         color:T.purple },
    { label:"On Time",  value:"98%",   icon:"truck",       color:T.green  },
    { label:"Return",   value:"94%",   icon:"refresh",     color:T.gold   },
  ],
  badges: ["Top Seller","Fast Delivery","Fresh Daily"],
  trustScore: 98,
};

const PRODUCTS = [
  { id:1, name:"Fresh Farm Tomatoes",    category:"Vegetables", price:4500,  original:6000,  rating:4.9, reviews:842,  sold:1240, stock:50,  unit:"kg",     tag:"Best Seller" },
  { id:2, name:"Organic Coconut Oil 1L", category:"Cooking",    price:18000, original:22000, rating:4.7, reviews:521,  sold:890,  stock:28,  unit:"bottle",  tag:"Organic"    },
  { id:3, name:"Basmati Rice 5kg",       category:"Grains",     price:32000, original:38000, rating:4.8, reviews:1203, sold:2100, stock:100, unit:"bag",     tag:"Bulk Deal"  },
  { id:4, name:"Fresh Whole Chicken",    category:"Meat",       price:28000, original:null,  rating:4.6, reviews:389,  sold:560,  stock:15,  unit:"piece",   tag:"Fresh"      },
  { id:5, name:"Avocado — Pack of 6",    category:"Fruits",     price:12000, original:15000, rating:4.9, reviews:677,  sold:980,  stock:40,  unit:"pack",    tag:"Local Farm" },
  { id:6, name:"Ugali Flour 2kg",        category:"Grains",     price:8500,  original:null,  rating:4.5, reviews:298,  sold:1500, stock:200, unit:"pack",    tag:null         },
  { id:7, name:"Fresh Spinach Bundle",   category:"Vegetables", price:3000,  original:null,  rating:4.7, reviews:456,  sold:800,  stock:60,  unit:"bundle",  tag:"Daily Fresh"},
  { id:8, name:"Cooking Oil 5L",         category:"Cooking",    price:42000, original:48000, rating:4.6, reviews:734,  sold:620,  stock:45,  unit:"jerry",   tag:"Bulk Deal"  },
];

const SERVICES = [
  { id:1, name:"Same-Day Delivery",   desc:"Order by 2 PM, receive by 6 PM today",  price:3000,  icon:"truck",    color:T.blue   },
  { id:2, name:"Bulk Order Discount", desc:"10% off on orders above TSh 100K",       price:null,  icon:"percent",  color:T.green  },
  { id:3, name:"Catering Supply",     desc:"Full supply for events & restaurants",   price:null,  icon:"utensils", color:T.gold   },
  { id:4, name:"Custom Orders",       desc:"Request any item not in the catalog",    price:null,  icon:"package",  color:T.purple },
];

const REVIEWS = [
  { id:1, name:"Hassan Kimaro", initials:"HK", color:T.blue,   rating:5, time:"2 days ago",  verified:true, text:"Exceptional quality and super fast delivery. The tomatoes were so fresh they lasted over a week. Mama Amina has the best grocery store in all of Zanzibar!" },
  { id:2, name:"Fatuma Ali",    initials:"FA", color:T.red,    rating:5, time:"1 week ago",   verified:true, text:"I have been ordering from Mama Amina for 2 years. Always fresh, always on time. The customer service is outstanding and the prices are very fair." },
  { id:3, name:"Juma Mwangi",  initials:"JM", color:T.green,  rating:4, time:"2 weeks ago",  verified:true, text:"Great selection of organic products. The coconut oil is pure and smells amazing. Delivery was slightly late but they called ahead to notify me." },
  { id:4, name:"Zawadi Mushi", initials:"ZM", color:T.gold,   rating:5, time:"3 weeks ago",  verified:true, text:"Ordered for my restaurant catering event — 50 guests. Everything arrived perfectly on time and the quality was restaurant-grade. Highly recommended!" },
];

const POSTS = [
  { id:1, type:"promo",  time:"Today",      likes:142, text:"WEEKEND SPECIAL: 20% off all vegetables this Saturday and Sunday. Use code FRESH20 at checkout. Limited stock!", icon:"percent", color:T.red    },
  { id:2, type:"new",    time:"Yesterday",  likes:89,  text:"New arrival! Organic Zanzibar Honey — sourced directly from local beekeepers. Only 30 jars available. Order yours now!", icon:"sparkle", color:T.green  },
  { id:3, type:"update", time:"3 days ago", likes:234, text:"We have extended our delivery hours! You can now order until 8 PM and receive same-day delivery. Thank you for your support!", icon:"truck",   color:T.blue   },
];

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, layout = "grid" }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const discount = product.original
    ? Math.round(((product.original - product.price) / product.original) * 100) : null;

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdding(true);
    onAddToCart(product);
    setTimeout(() => setAdding(false), 600);
  };

  if (layout === "list") {
    return (
      <div style={{ display:"flex", gap:14, padding:"16px 0", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ position:"relative", flexShrink:0 }}>
          <ProductImage product={product} size={80} radius={14}/>
          {discount && (
            <div style={{ position:"absolute", top:-4, left:-4, background:T.red, color:"#fff",
              borderRadius:8, padding:"2px 7px", fontSize:10, fontWeight:900 }}>-{discount}%</div>
          )}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
            <div style={{ fontSize:13, fontWeight:800, color:T.text, lineHeight:1.3,
              overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
              {product.name}
            </div>
            {product.tag && <Badge color={T.gold} size="xs">{product.tag}</Badge>}
          </div>
          <StarRating rating={product.rating} count={product.reviews} size={11}/>
          <div style={{ fontSize:11, color:T.textMute, marginTop:3 }}>{product.sold.toLocaleString()} sold</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:900, color:T.navy, fontFamily:"monospace" }}>{fmt(product.price)}</div>
              {product.original && <div style={{ fontSize:11, color:T.textMute, textDecoration:"line-through" }}>{fmt(product.original)}</div>}
            </div>
            <button onClick={handleAdd} aria-label="Add to cart"
              style={{ minWidth:36, height:36, borderRadius:10, cursor:"pointer",
                background: adding ? T.green : `linear-gradient(135deg,${T.gold},#A07008)`,
                border:"none", display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:`0 4px 12px ${T.gold}44`, transition:"all 0.2s", padding:"0 12px" }}>
              <Icon name={adding ? "check" : "plus"} size={16} color="#fff"/>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background:T.card, border:`1px solid ${T.border}`, borderRadius:22,
      overflow:"hidden", boxShadow:T.shadow, transition:"all 0.22s cubic-bezier(0.4,0,0.2,1)",
      position:"relative", display:"flex", flexDirection:"column"
    }}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow=T.shadowMd; }}
      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=T.shadow; }}>

      {/* Image area */}
      <div style={{ position:"relative", padding:"16px 16px 0" }}>
        <ProductImage product={product} size="100%" radius={16}/>
        <div style={{ position:"absolute", top:8, left:8, display:"flex", flexDirection:"column", gap:5 }}>
          {discount && (
            <div style={{ background:T.red, color:"#fff", borderRadius:8,
              padding:"3px 8px", fontSize:11, fontWeight:900 }}>-{discount}%</div>
          )}
          {product.tag && !discount && (
            <Badge color={T.gold} size="xs">{product.tag}</Badge>
          )}
        </div>
        <button onClick={() => setWishlisted(v => !v)} aria-label="Save to wishlist"
          style={{ position:"absolute", top:8, right:8, width:34, height:34,
            borderRadius:"50%", background:"rgba(255,255,255,0.92)",
            border:"none", cursor:"pointer", display:"flex",
            alignItems:"center", justifyContent:"center",
            boxShadow:T.shadow, transition:"transform 0.18s",
            transform: wishlisted ? "scale(1.18)" : "scale(1)" }}>
          <Icon name={wishlisted ? "heartFill" : "heart"} size={15}
            color={wishlisted ? T.red : T.textMute}/>
        </button>
        {product.stock < 20 && (
          <div style={{ position:"absolute", bottom:8, left:8,
            background:T.amber+"EE", color:"#fff", borderRadius:8,
            padding:"2px 8px", fontSize:10, fontWeight:800 }}>
            Only {product.stock} left
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:"14px 16px 16px", flex:1, display:"flex", flexDirection:"column" }}>
        <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
          textTransform:"uppercase", letterSpacing:0.6, marginBottom:5 }}>
          {product.category}
        </div>
        <div style={{ fontSize:13, fontWeight:800, color:T.text, marginBottom:7,
          lineHeight:1.35, overflow:"hidden", display:"-webkit-box",
          WebkitLineClamp:2, WebkitBoxOrient:"vertical", flex:1 }}>
          {product.name}
        </div>
        <StarRating rating={product.rating} count={product.reviews} size={11}/>
        <div style={{ fontSize:11, color:T.textMute, marginTop:3, marginBottom:10 }}>
          {product.sold.toLocaleString()} sold
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:900, color:T.navy,
              fontFamily:"monospace", letterSpacing:-0.5 }}>{fmt(product.price)}</div>
            <div style={{ fontSize:10, color:T.textMute }}>per {product.unit}</div>
          </div>
          <button onClick={handleAdd} aria-label="Add to cart"
            style={{ width:40, height:40, borderRadius:12, cursor:"pointer",
              background: adding ? T.green : `linear-gradient(135deg,${T.gold},#A07008)`,
              border:"none", display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 4px 14px ${T.gold}44`, transition:"all 0.2s",
              transform: adding ? "scale(0.92)" : "scale(1)" }}>
            <Icon name={adding ? "check" : "plus"} size={18} color="#fff"/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Review Card ─────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div style={{ padding:"20px 0", borderBottom:`1px solid ${T.border}` }}>
      <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:12 }}>
        <div style={{ width:44, height:44, borderRadius:"50%", flexShrink:0,
          background:`linear-gradient(135deg,${review.color}22,${review.color}44)`,
          border:`2px solid ${review.color}33`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:13, fontWeight:900, color:review.color }}>
          {review.initials}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ fontSize:13, fontWeight:800, color:T.text }}>{review.name}</div>
              {review.verified && (
                <Badge color={T.blue} size="xs">
                  <Icon name="shield" size={9} color={T.blue}/> Verified
                </Badge>
              )}
            </div>
            <div style={{ fontSize:11, color:T.textMute }}>{review.time}</div>
          </div>
          <StarRating rating={review.rating} size={12} showCount={false}/>
        </div>
      </div>
      <div style={{ fontSize:13, color:T.textMid, lineHeight:1.75,
        background:T.cardAlt, borderRadius:14, padding:"12px 16px",
        borderLeft:`3px solid ${review.color}44` }}>
        {review.text}
      </div>
    </div>
  );
}

// ─── Cart Drawer ─────────────────────────────────────────────────────────────
function CartDrawer({ cart, onUpdateQty, onRemove, onClose, onCheckout }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const qualifiesForFree = total >= BUSINESS.minOrder;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:998, display:"flex",
      justifyContent:"flex-end", background:"rgba(11,31,75,0.45)",
      backdropFilter:"blur(6px)" }} onClick={onClose}>
      <div style={{ width:"100%", maxWidth:440, background:T.surface,
        height:"100%", overflowY:"auto", boxShadow:T.shadowLg,
        animation:"slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)",
        display:"flex", flexDirection:"column" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:"22px 24px 18px", borderBottom:`1px solid ${T.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          position:"sticky", top:0, background:T.surface, zIndex:1 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:900, color:T.text, letterSpacing:-0.3 }}>Your Cart</div>
            <div style={{ fontSize:12, color:T.textMute, marginTop:2 }}>
              {count} item{count!==1?"s":""} · {BUSINESS.name}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close cart"
            style={{ width:38, height:38, borderRadius:11, background:T.cardAlt,
              border:`1px solid ${T.border}`, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="x" size={16} color={T.textMute}/>
          </button>
        </div>

        {/* Progress to free delivery */}
        {cart.length > 0 && (
          <div style={{ padding:"14px 24px", background:T.navyLight, borderBottom:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:12, fontWeight:700, color:T.navy }}>
                {qualifiesForFree ? "Free delivery unlocked!" : `Add ${fmt(BUSINESS.minOrder - total)} for free delivery`}
              </span>
              <Icon name={qualifiesForFree ? "check" : "truck"} size={14} color={qualifiesForFree ? T.green : T.navy}/>
            </div>
            <div style={{ height:5, background:T.border, borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:99, transition:"width 0.4s ease",
                width:`${Math.min(100, (total/BUSINESS.minOrder)*100)}%`,
                background:`linear-gradient(90deg,${T.navy},${T.gold})` }}/>
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ flex:1, padding:"8px 24px 16px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 0 40px" }}>
              <div style={{ width:80, height:80, borderRadius:"50%", background:T.cardAlt,
                border:`1px solid ${T.border}`, display:"flex", alignItems:"center",
                justifyContent:"center", margin:"0 auto 20px" }}>
                <Icon name="shoppingBag" size={36} color={T.border}/>
              </div>
              <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:8 }}>Cart is empty</div>
              <div style={{ fontSize:13, color:T.textMute }}>Add items from the store to get started</div>
            </div>
          ) : cart.map((item, i) => (
            <div key={item.id} style={{ display:"flex", gap:14, padding:"16px 0",
              borderBottom: i < cart.length-1 ? `1px solid ${T.border}` : "none" }}>
              <ProductImage product={item} size={64} radius={12}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:4,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                <div style={{ fontSize:14, fontWeight:900, color:T.navy,
                  fontFamily:"monospace", marginBottom:10 }}>{fmt(item.price)}</div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <button onClick={() => onUpdateQty(item.id,-1)} aria-label="Remove one"
                    style={{ width:32, height:32, borderRadius:9, border:`1px solid ${T.border}`,
                      background:T.cardAlt, cursor:"pointer", display:"flex",
                      alignItems:"center", justifyContent:"center" }}>
                    <Icon name="minus" size={14} color={T.textMid}/>
                  </button>
                  <span style={{ fontSize:15, fontWeight:900, color:T.text,
                    minWidth:28, textAlign:"center" }}>{item.qty}</span>
                  <button onClick={() => onUpdateQty(item.id,1)} aria-label="Add one"
                    style={{ width:32, height:32, borderRadius:9, border:`1px solid ${T.border}`,
                      background:T.cardAlt, cursor:"pointer", display:"flex",
                      alignItems:"center", justifyContent:"center" }}>
                    <Icon name="plus" size={14} color={T.textMid}/>
                  </button>
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0, display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
                <div style={{ fontSize:14, fontWeight:900, color:T.green,
                  fontFamily:"monospace", marginBottom:"auto", paddingTop:4 }}>
                  {fmt(item.price * item.qty)}
                </div>
                <button onClick={() => onRemove(item.id)} aria-label="Remove item"
                  style={{ background:T.redBg, border:`1px solid ${T.red}22`,
                    borderRadius:8, padding:"5px 10px", cursor:"pointer",
                    display:"flex", alignItems:"center", gap:4,
                    fontSize:11, fontWeight:700, color:T.red, marginTop:12 }}>
                  <Icon name="x" size={11} color={T.red}/> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding:"20px 24px 28px", borderTop:`1px solid ${T.border}`, background:T.surface }}>
            <div style={{ marginBottom:16 }}>
              {[["Subtotal",fmt(total)],["Delivery",qualifiesForFree?"Free":fmt(BUSINESS.deliveryFee)]].map(([l,v]) => (
                <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", fontSize:13 }}>
                  <span style={{ color:T.textMute }}>{l}</span>
                  <span style={{ color: l==="Delivery" && qualifiesForFree ? T.green : T.text,
                    fontWeight:700, fontFamily:"monospace" }}>{v}</span>
                </div>
              ))}
              <div style={{ height:1, background:T.border, margin:"10px 0" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0" }}>
                <span style={{ fontSize:16, fontWeight:900, color:T.text }}>Total</span>
                <span style={{ fontSize:17, fontWeight:900, color:T.navy,
                  fontFamily:"monospace" }}>{fmt(total + (qualifiesForFree ? 0 : BUSINESS.deliveryFee))}</span>
              </div>
            </div>
            <Btn full variant="gold" icon="zap" onClick={onCheckout} size="lg">
              Pay with Panda Wallet
            </Btn>
            <div style={{ marginTop:12, display:"flex", alignItems:"center", justifyContent:"center", gap:6,
              fontSize:11, color:T.textMute }}>
              <Icon name="lock" size={12} color={T.textMute}/>
              Secured by Panda Finance · Escrow protected
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Storefront ─────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]           = useState("products");
  const [layout, setLayout]     = useState("grid");
  const [search, setSearch]     = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [category, setCategory] = useState("All");
  const [cart, setCart]         = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [toast, setToast]       = useState(null);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [postLikes, setPostLikes] = useState({ 1:false, 2:false, 3:false });
  const [sortBy, setSortBy]     = useState("popular");
  const [msgModal, setMsgModal] = useState(false);
  const [msgText, setMsgText]   = useState("");
  const [orderRef]              = useState(() => `ORD-${Math.floor(100000 + Math.random()*900000)}`);

  const showToast = (msg, color=T.green, icon="check") => {
    setToast({ msg, color, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product) => {
    setCart(c => {
      const existing = c.find(i => i.id === product.id);
      if (existing) return c.map(i => i.id===product.id ? {...i, qty:i.qty+1} : i);
      return [...c, {...product, qty:1}];
    });
    showToast(`${product.name} added`, T.green);
  };

  const updateQty = (id, delta) => {
    setCart(c => c.map(i => i.id===id ? {...i, qty:Math.max(0,i.qty+delta)} : i).filter(i => i.qty>0));
  };

  const cartCount = cart.reduce((s,i) => s+i.qty, 0);
  const categories = ["All", ...new Set(PRODUCTS.map(p => p.category))];

  const filtered = PRODUCTS
    .filter(p => category==="All" || p.category===category)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sortBy==="popular" ? b.reviews-a.reviews
      : sortBy==="price_asc" ? a.price-b.price
      : sortBy==="price_desc" ? b.price-a.price
      : b.rating-a.rating);

  const TABS = [
    { id:"products", label:"Products", icon:"grid"    },
    { id:"services", label:"Services", icon:"zap"     },
    { id:"reviews",  label:"Reviews",  icon:"star"    },
    { id:"posts",    label:"Posts",    icon:"eye"     },
    { id:"about",    label:"About",    icon:"store"   },
  ];

  return (
    <div style={{ background:T.bg, minHeight:"100vh", color:T.text,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif" }}>

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes toastIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.94) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.08)} 100%{transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; }
        input::placeholder { color:#8A9BC0; }
        select { appearance:none; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:#DDE3F5; border-radius:99px; }
        button { font-family:inherit; }
        button:active { transform:scale(0.96) !important; }
      `}</style>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position:"fixed", bottom:32, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:T.surface,
          border:`1px solid ${toast.color}33`,
          borderLeft:`4px solid ${toast.color}`,
          borderRadius:14, padding:"13px 20px",
          boxShadow:T.shadowLg, whiteSpace:"nowrap",
          animation:"toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:24, height:24, borderRadius:"50%", background:toast.color+"18",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name={toast.icon} size={13} color={toast.color}/>
          </div>
          <span style={{ fontSize:13, fontWeight:700, color:T.text }}>{toast.msg}</span>
        </div>
      )}

      {/* ── CART DRAWER ── */}
      {cartOpen && (
        <CartDrawer cart={cart} onUpdateQty={updateQty}
          onRemove={id => setCart(c => c.filter(i => i.id!==id))}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCheckoutDone(true);
            setCart([]);
            setCartOpen(false);
            showToast("Order placed! Mama Amina will confirm shortly.", T.gold, "check");
          }}/>
      )}

      {/* ── MESSAGE MODAL ── */}
      {msgModal && (
        <Modal title={`Message ${BUSINESS.name}`} subtitle="Direct buyer · seller chat"
          onClose={() => setMsgModal(false)}>
          <div style={{ background:T.navyLight, borderRadius:14, padding:"12px 16px",
            marginBottom:16, display:"flex", gap:10, alignItems:"flex-start" }}>
            <Icon name="info" size={16} color={T.navy}/>
            <div style={{ fontSize:12, color:T.textMid, lineHeight:1.6 }}>
              Ask about custom orders, wholesale pricing, delivery schedules, or any special requests.
            </div>
          </div>
          <textarea value={msgText} onChange={e => setMsgText(e.target.value)}
            placeholder="e.g. Do you have wholesale pricing for 50kg rice bags?"
            rows={4} style={{ width:"100%", background:T.cardAlt,
              border:`1.5px solid ${T.border}`, borderRadius:14, padding:"13px 16px",
              color:T.text, fontSize:13, fontFamily:"inherit", outline:"none",
              resize:"vertical", boxSizing:"border-box", marginBottom:16, lineHeight:1.6 }}
            onFocus={e => e.target.style.borderColor=T.navy}
            onBlur={e => e.target.style.borderColor=T.border}/>
          <div style={{ display:"flex", gap:10 }}>
            <Btn variant="ghost" onClick={() => setMsgModal(false)}>Cancel</Btn>
            <Btn full variant="gold" icon="send" onClick={() => {
              setMsgModal(false); setMsgText("");
              showToast("Message sent! Store will reply within an hour.", T.gold, "check");
            }}>Send Message</Btn>
          </div>
        </Modal>
      )}

      {/* ── CHECKOUT SUCCESS MODAL ── */}
      {checkoutDone && (
        <div style={{ position:"fixed", inset:0, zIndex:9998,
          background:"rgba(11,31,75,0.6)", display:"flex",
          alignItems:"center", justifyContent:"center", padding:20,
          backdropFilter:"blur(10px)" }}>
          <div style={{ background:T.surface, borderRadius:28, padding:"40px 32px",
            width:"100%", maxWidth:400, textAlign:"center",
            boxShadow:T.shadowLg, animation:"bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <div style={{ width:88, height:88, borderRadius:"50%",
              background:T.greenBg, border:`3px solid ${T.green}44`,
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 24px", animation:"bounceIn 0.5s 0.1s both cubic-bezier(0.34,1.56,0.64,1)" }}>
              <Icon name="check" size={40} color={T.green}/>
            </div>
            <div style={{ fontSize:24, fontWeight:900, color:T.text,
              marginBottom:8, letterSpacing:-0.5 }}>Order Placed!</div>
            <div style={{ fontSize:13, color:T.textMute, marginBottom:8, lineHeight:1.7 }}>
              Your order from <strong style={{ color:T.text }}>{BUSINESS.name}</strong> has been paid via Panda Wallet. The store will confirm within 5 minutes.
            </div>
            <div style={{ display:"inline-block", background:T.navyLight, borderRadius:10,
              padding:"8px 18px", fontSize:13, fontWeight:900, color:T.navy,
              fontFamily:"monospace", letterSpacing:1, marginBottom:28 }}>
              {orderRef}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <Btn full variant="ghost" onClick={() => setCheckoutDone(false)}>
                Continue Shopping
              </Btn>
              <Btn full variant="gold" icon="truck"
                onClick={() => showToast("Order tracking coming soon!", T.blue, "info")}>
                Track Order
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* ── TOP NAV ── */}
      <div style={{ background:"rgba(255,255,255,0.92)", backdropFilter:"blur(16px)",
        borderBottom:`1px solid ${T.border}`,
        padding:"14px 20px", position:"sticky", top:0, zIndex:100,
        boxShadow:"0 2px 16px rgba(11,31,75,0.06)" }}>
        <div style={{ maxWidth:720, margin:"0 auto", display:"flex",
          justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button aria-label="Go back"
              style={{ width:40, height:40, borderRadius:12, background:T.cardAlt,
                border:`1px solid ${T.border}`, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="arrowLeft" size={18} color={T.navy}/>
            </button>
            <div>
              <div style={{ fontSize:10, color:T.textMute, textTransform:"uppercase",
                letterSpacing:1.2, fontWeight:700 }}>Panda Marketplace</div>
              <div style={{ fontSize:16, fontWeight:900, color:T.navy, letterSpacing:-0.4 }}>
                {BUSINESS.name}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button aria-label="Notifications"
              style={{ position:"relative", width:42, height:42, borderRadius:12,
                background:T.cardAlt, border:`1px solid ${T.border}`,
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="bell" size={18} color={T.navy}/>
              <span style={{ position:"absolute", top:8, right:8, width:8, height:8,
                background:T.red, borderRadius:"50%", border:`2px solid ${T.surface}` }}/>
            </button>
            <button onClick={() => setCartOpen(true)} aria-label="Open cart"
              style={{ position:"relative", width:42, height:42, borderRadius:12,
                background: cartCount > 0 ? T.navy : T.cardAlt,
                border:`1px solid ${cartCount > 0 ? T.navy : T.border}`,
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.2s" }}>
              <Icon name="cart" size={18} color={cartCount > 0 ? "#fff" : T.navy}/>
              {cartCount > 0 && (
                <span style={{ position:"absolute", top:-6, right:-6, minWidth:20, height:20,
                  background:T.gold, borderRadius:99, fontSize:10, fontWeight:900,
                  color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
                  border:`2px solid ${T.surface}`, padding:"0 4px",
                  animation:"bounceIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:720, margin:"0 auto" }}>

        {/* ── COVER + PROFILE ── */}
        <div style={{ position:"relative", marginBottom:88 }}>
          {/* Cover */}
          <div style={{ height:220, position:"relative", overflow:"hidden",
            background:`linear-gradient(135deg,${T.navy} 0%,${T.navyMid} 55%,#0A5C3A 100%)` }}>
            {/* Geometric pattern */}
            <div style={{ position:"absolute", inset:0, opacity:0.07,
              backgroundImage:"radial-gradient(circle,#fff 1.5px,transparent 1.5px)",
              backgroundSize:"28px 28px" }}/>
            <div style={{ position:"absolute", inset:0, opacity:0.04,
              backgroundImage:`repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)`,
              backgroundSize:"20px 20px" }}/>
            {/* Bottom gradient fade */}
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80,
              background:`linear-gradient(to bottom,transparent,${T.bg})` }}/>
            {/* Open badge */}
            <div style={{ position:"absolute", top:16, right:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6,
                background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)",
                border:"1px solid rgba(255,255,255,0.2)",
                borderRadius:99, padding:"5px 12px" }}>
                <div style={{ width:7, height:7, borderRadius:"50%",
                  background:BUSINESS.openNow ? "#4ADE80" : T.red,
                  animation: BUSINESS.openNow ? "pulse 2s infinite" : "none" }}/>
                <span style={{ fontSize:11, fontWeight:700, color:"#fff" }}>
                  {BUSINESS.openNow ? "Open Now" : "Closed"}
                </span>
              </div>
            </div>
            {/* Delivery */}
            {BUSINESS.delivery && (
              <div style={{ position:"absolute", bottom:20, right:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6,
                  background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)",
                  border:"1px solid rgba(255,255,255,0.2)",
                  borderRadius:99, padding:"5px 12px" }}>
                  <Icon name="truck" size={12} color="#fff"/>
                  <span style={{ fontSize:11, fontWeight:700, color:"#fff" }}>{BUSINESS.deliveryTime}</span>
                </div>
              </div>
            )}
          </div>

          {/* Floating profile card */}
          <div style={{ position:"absolute", bottom:-72, left:16, right:16 }}>
            <div style={{ background:T.surface, borderRadius:24, padding:"20px 22px",
              boxShadow:T.shadowMd, border:`1px solid ${T.border}`,
              display:"flex", gap:16, alignItems:"flex-start", flexWrap:"wrap" }}>

              {/* Avatar */}
              <div style={{ position:"relative", flexShrink:0 }}>
                <div style={{ width:76, height:76, borderRadius:20,
                  background:`linear-gradient(135deg,${BUSINESS.avatarColor}22,${BUSINESS.avatarColor}44)`,
                  border:`3px solid ${T.surface}`,
                  boxShadow:`0 0 0 2px ${BUSINESS.avatarColor}55, ${T.shadowMd}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:26, fontWeight:900, color:BUSINESS.avatarColor, letterSpacing:-1 }}>
                  {BUSINESS.avatar}
                </div>
                {BUSINESS.verified && (
                  <div style={{ position:"absolute", bottom:-4, right:-4, width:24, height:24,
                    background:T.blue, borderRadius:"50%", border:`2.5px solid ${T.surface}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow:T.shadow }}>
                    <Icon name="shield" size={12} color="#fff"/>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7,
                  flexWrap:"wrap", marginBottom:5 }}>
                  <div style={{ fontSize:18, fontWeight:900, color:T.text,
                    letterSpacing:-0.4 }}>{BUSINESS.name}</div>
                  {BUSINESS.verified && (
                    <Badge color={T.blue} size="xs">
                      <Icon name="shield" size={9} color={T.blue}/> Verified
                    </Badge>
                  )}
                </div>
                <div style={{ fontSize:12, color:T.textMute, marginBottom:9, lineHeight:1.5 }}>
                  {BUSINESS.tagline}
                </div>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {BUSINESS.badges.map(b => (
                    <Badge key={b} color={T.gold} size="xs">{b}</Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display:"flex", gap:8, flexShrink:0, flexWrap:"wrap" }}>
                <button onClick={() => {
                  setFollowing(f => !f);
                  showToast(following ? `Unfollowed ${BUSINESS.name}` : `Following ${BUSINESS.name}!`, T.gold, following ? "x" : "check");
                }}
                  style={{ height:38, borderRadius:12, border:"none", cursor:"pointer",
                    padding:"0 18px", fontWeight:800, fontSize:13, fontFamily:"inherit",
                    transition:"all 0.2s",
                    background: following ? T.cardAlt : `linear-gradient(135deg,${T.gold},#A07008)`,
                    color: following ? T.textMid : "#fff",
                    boxShadow: following ? "none" : T.shadowGold }}>
                  {following ? "Following" : "Follow"}
                </button>
                <button onClick={() => setMsgModal(true)} aria-label="Message store"
                  style={{ width:38, height:38, borderRadius:12, background:T.navyLight,
                    border:`1px solid ${T.navy}22`, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="message" size={16} color={T.navy}/>
                </button>
                <button onClick={() => showToast("Store link copied!", T.navy, "check")}
                  aria-label="Share store"
                  style={{ width:38, height:38, borderRadius:12, background:T.cardAlt,
                    border:`1px solid ${T.border}`, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="share" size={16} color={T.textMid}/>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding:"0 16px 100px" }}>

          {/* ── STATS ROW ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
            {BUSINESS.stats.map(stat => (
              <div key={stat.label} style={{ background:T.card, border:`1px solid ${T.border}`,
                borderRadius:18, padding:"16px 10px", textAlign:"center",
                boxShadow:T.shadow }}>
                <div style={{ width:32, height:32, borderRadius:10, background:stat.color+"14",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 8px" }}>
                  <Icon name={stat.icon} size={15} color={stat.color}/>
                </div>
                <div style={{ fontSize:18, fontWeight:900, color:T.navy,
                  fontFamily:"monospace", marginBottom:3 }}>{stat.value}</div>
                <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
                  textTransform:"uppercase", letterSpacing:0.7 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* ── RATING + FOLLOWERS BAR ── */}
          <Card style={{ marginBottom:14, padding:"18px 22px" }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", flexWrap:"wrap", gap:12 }}>
              <div>
                <StarRating rating={BUSINESS.rating} count={BUSINESS.reviewCount} size={15}/>
                <div style={{ fontSize:11, color:T.textMute, marginTop:4 }}>Overall rating</div>
              </div>
              <div style={{ width:1, height:36, background:T.border }}/>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:18, fontWeight:900, color:T.navy, fontFamily:"monospace" }}>
                  {BUSINESS.followers.toLocaleString()}
                </div>
                <div style={{ fontSize:11, color:T.textMute }}>Followers</div>
              </div>
              <div style={{ width:1, height:36, background:T.border }}/>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:18, fontWeight:900, color:T.navy, fontFamily:"monospace" }}>
                  {BUSINESS.reviewCount.toLocaleString()}
                </div>
                <div style={{ fontSize:11, color:T.textMute }}>Reviews</div>
              </div>
              <div style={{ width:1, height:36, background:T.border }}/>
              {/* Trust score */}
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:18, fontWeight:900, color:T.green, fontFamily:"monospace" }}>
                  {BUSINESS.trustScore}%
                </div>
                <div style={{ fontSize:11, color:T.textMute }}>Trust Score</div>
              </div>
            </div>
          </Card>

          {/* ── DELIVERY INFO BANNER ── */}
          <div style={{ background:`linear-gradient(135deg,${T.greenBg},${T.green}0A)`,
            border:`1px solid ${T.green}28`, borderRadius:16,
            padding:"13px 18px", marginBottom:16,
            display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ width:36, height:36, borderRadius:10, background:T.green+"18",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name="truck" size={18} color={T.green}/>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:T.green }}>
                  Free delivery on orders above {fmt(BUSINESS.minOrder)}
                </div>
                <div style={{ fontSize:11, color:T.green+"99" }}>{BUSINESS.deliveryTime} · Zanzibar</div>
              </div>
            </div>
            <Badge color={T.green}>
              <Icon name="clock" size={10} color={T.green}/> {BUSINESS.deliveryTime}
            </Badge>
          </div>

          {/* ── TAB BAR ── */}
          <div style={{ display:"flex", gap:4, marginBottom:22,
            background:T.surface, borderRadius:18, padding:5,
            border:`1px solid ${T.border}`, boxShadow:T.shadow,
            overflowX:"auto" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} aria-label={t.label}
                style={{ flex:1, minWidth:72, padding:"10px 6px", borderRadius:14,
                  border:"none", cursor:"pointer", fontFamily:"inherit",
                  transition:"all 0.2s",
                  background: tab===t.id ? T.navy : "transparent",
                  color: tab===t.id ? "#fff" : T.textMute,
                  fontWeight: tab===t.id ? 800 : 500, fontSize:12,
                  display:"flex", flexDirection:"column", alignItems:"center", gap:5,
                  whiteSpace:"nowrap",
                  boxShadow: tab===t.id ? `0 4px 16px ${T.navy}44` : "none" }}>
                <Icon name={t.icon} size={15} color={tab===t.id ? "#fff" : T.textMute}/>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* ══ PRODUCTS TAB ══ */}
          {tab === "products" && (
            <div style={{ animation:"fadeUp 0.25s ease" }}>
              {/* Search */}
              <div style={{ display:"flex", gap:10, marginBottom:14 }}>
                <div style={{ flex:1, position:"relative" }}>
                  <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }}>
                    <Icon name="search" size={16} color={searchFocused ? T.navy : T.textMute}/>
                  </div>
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search products..."
                    style={{ width:"100%", background:T.card,
                      border:`1.5px solid ${searchFocused ? T.navy : T.border}`,
                      borderRadius:14, padding:"12px 14px 12px 44px",
                      color:T.text, fontSize:13, fontFamily:"inherit", outline:"none",
                      transition:"all 0.2s", boxShadow: searchFocused ? `0 0 0 3px ${T.navy}14` : "none" }}/>
                  {search && (
                    <button onClick={() => setSearch("")} aria-label="Clear search"
                      style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                        width:24, height:24, borderRadius:"50%", background:T.cardAlt,
                        border:"none", cursor:"pointer", display:"flex",
                        alignItems:"center", justifyContent:"center" }}>
                      <Icon name="x" size={12} color={T.textMute}/>
                    </button>
                  )}
                </div>
                <button onClick={() => setLayout(l => l==="grid" ? "list" : "grid")}
                  aria-label="Toggle layout"
                  style={{ width:46, height:46, borderRadius:14, background:T.card,
                    border:`1.5px solid ${T.border}`, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name={layout==="grid" ? "list" : "grid"} size={18} color={T.navy}/>
                </button>
              </div>

              {/* Categories + Sort */}
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", marginBottom:14, gap:8 }}>
                <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2, flex:1 }}>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      style={{ padding:"7px 16px", borderRadius:99, fontSize:12, fontWeight:700,
                        cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap",
                        transition:"all 0.18s",
                        background: category===cat ? T.navy : T.card,
                        border: category===cat ? "none" : `1px solid ${T.border}`,
                        color: category===cat ? "#fff" : T.textMid,
                        boxShadow: category===cat ? `0 4px 12px ${T.navy}33` : "none" }}>
                      {cat}
                    </button>
                  ))}
                </div>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  style={{ background:T.card, border:`1px solid ${T.border}`,
                    borderRadius:12, padding:"9px 14px", fontSize:12, color:T.textMid,
                    fontFamily:"inherit", outline:"none", cursor:"pointer",
                    flexShrink:0, fontWeight:700 }}>
                  <option value="popular">Popular</option>
                  <option value="rating">Top Rated</option>
                  <option value="price_asc">Price: Low</option>
                  <option value="price_desc">Price: High</option>
                </select>
              </div>

              {/* Count */}
              <div style={{ fontSize:12, color:T.textMute, marginBottom:14, fontWeight:600 }}>
                {filtered.length} product{filtered.length!==1?"s":""} found
                {category!=="All" && ` in ${category}`}
                {search && ` for "${search}"`}
              </div>

              {/* Empty state */}
              {filtered.length === 0 && (
                <div style={{ textAlign:"center", padding:"60px 0 40px" }}>
                  <div style={{ width:80, height:80, borderRadius:"50%", background:T.cardAlt,
                    border:`1px solid ${T.border}`, display:"flex", alignItems:"center",
                    justifyContent:"center", margin:"0 auto 20px" }}>
                    <Icon name="search" size={36} color={T.border}/>
                  </div>
                  <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:8 }}>No products found</div>
                  <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>
                    Try a different search or category
                  </div>
                  <Btn variant="outline" onClick={() => { setSearch(""); setCategory("All"); }}>
                    Clear filters
                  </Btn>
                </div>
              )}

              {/* Products */}
              {layout === "grid" ? (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  {filtered.map(p => (
                    <ProductCard key={p.id} product={p} onAddToCart={addToCart} layout="grid"/>
                  ))}
                </div>
              ) : (
                <Card style={{ padding:"0 16px" }}>
                  {filtered.map(p => (
                    <ProductCard key={p.id} product={p} onAddToCart={addToCart} layout="list"/>
                  ))}
                </Card>
              )}
            </div>
          )}

          {/* ══ SERVICES TAB ══ */}
          {tab === "services" && (
            <div style={{ animation:"fadeUp 0.25s ease" }}>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:18, fontWeight:900, color:T.text,
                  letterSpacing:-0.3, marginBottom:4 }}>What We Offer</div>
                <div style={{ fontSize:13, color:T.textMute }}>
                  Beyond products — {BUSINESS.name} provides these services
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {SERVICES.map(svc => (
                  <Card key={svc.id} hover style={{ padding:"20px 22px" }}
                    onClick={() => showToast(`Enquiring about: ${svc.name}`, svc.color, "message")}>
                    <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                      <div style={{ width:56, height:56, borderRadius:18,
                        background:svc.color+"14", border:`1px solid ${svc.color}22`,
                        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Icon name={svc.icon} size={26} color={svc.color}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:15, fontWeight:800, color:T.text, marginBottom:4 }}>
                          {svc.name}
                        </div>
                        <div style={{ fontSize:12, color:T.textMute, lineHeight:1.5 }}>{svc.desc}</div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, flexShrink:0 }}>
                        {svc.price
                          ? <div style={{ fontSize:15, fontWeight:900, color:T.navy, fontFamily:"monospace" }}>{fmt(svc.price)}</div>
                          : <Badge color={T.green}>Free</Badge>
                        }
                        <Icon name="chevronRight" size={16} color={T.textMute}/>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* CTA */}
              <div style={{ marginTop:22, background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
                borderRadius:22, padding:"28px 24px", textAlign:"center",
                position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", inset:0, opacity:0.05,
                  backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
                  backgroundSize:"20px 20px" }}/>
                <div style={{ width:52, height:52, borderRadius:16, background:"rgba(255,255,255,0.12)",
                  display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                  <Icon name="message" size={26} color="#fff"/>
                </div>
                <div style={{ fontSize:16, fontWeight:900, color:"#fff",
                  marginBottom:8, position:"relative" }}>Need something specific?</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", marginBottom:22,
                  lineHeight:1.6, position:"relative" }}>
                  Chat directly with the store for custom orders, bulk pricing, or special requests.
                </div>
                <Btn variant="white" icon="message"
                  onClick={() => setMsgModal(true)}
                  style={{ position:"relative" }}>
                  Send a Message
                </Btn>
              </div>
            </div>
          )}

          {/* ══ REVIEWS TAB ══ */}
          {tab === "reviews" && (
            <div style={{ animation:"fadeUp 0.25s ease" }}>
              {/* Rating summary */}
              <Card style={{ marginBottom:16, padding:"24px" }}>
                <div style={{ display:"flex", gap:28, alignItems:"center", flexWrap:"wrap" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:64, fontWeight:900, color:T.navy,
                      lineHeight:1, fontFamily:"monospace", letterSpacing:-2 }}>
                      {BUSINESS.rating}
                    </div>
                    <StarRating rating={BUSINESS.rating} size={20} showCount={false}/>
                    <div style={{ fontSize:12, color:T.textMute, marginTop:6, fontWeight:600 }}>
                      {BUSINESS.reviewCount.toLocaleString()} reviews
                    </div>
                  </div>
                  <div style={{ flex:1, minWidth:160 }}>
                    {[{stars:5,pct:82},{stars:4,pct:11},{stars:3,pct:4},{stars:2,pct:2},{stars:1,pct:1}].map(r => (
                      <div key={r.stars} style={{ display:"flex", alignItems:"center",
                        gap:8, marginBottom:7 }}>
                        <div style={{ fontSize:11, color:T.textMute, width:10,
                          textAlign:"right", fontWeight:700 }}>{r.stars}</div>
                        <Icon name="star" size={11} color={T.gold}/>
                        <div style={{ flex:1, background:T.border, borderRadius:99, height:7, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${r.pct}%`,
                            background:`linear-gradient(90deg,${T.gold},${T.goldMid})`,
                            borderRadius:99, transition:"width 0.6s ease" }}/>
                        </div>
                        <div style={{ fontSize:11, color:T.textMute, width:28, fontWeight:700 }}>
                          {r.pct}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Trust indicators */}
                <div style={{ display:"flex", gap:8, marginTop:20, flexWrap:"wrap" }}>
                  <Badge color={T.green}><Icon name="check" size={10} color={T.green}/> 98% Positive</Badge>
                  <Badge color={T.blue}><Icon name="shield" size={10} color={T.blue}/> All Verified Buyers</Badge>
                  <Badge color={T.gold}><Icon name="award" size={10} color={T.gold}/> Top Rated Store</Badge>
                </div>
              </Card>

              <Card style={{ padding:"4px 20px" }}>
                {REVIEWS.map(r => <ReviewCard key={r.id} review={r}/>)}
                <div style={{ paddingTop:20, paddingBottom:4, textAlign:"center" }}>
                  <Btn variant="outline" icon="chevronDown"
                    onClick={() => showToast("Loading more reviews...", T.navy, "refresh")}>
                    Load More Reviews
                  </Btn>
                </div>
              </Card>
            </div>
          )}

          {/* ══ POSTS TAB ══ */}
          {tab === "posts" && (
            <div style={{ animation:"fadeUp 0.25s ease" }}>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:18, fontWeight:900, color:T.text,
                  letterSpacing:-0.3, marginBottom:4 }}>Store Updates</div>
                <div style={{ fontSize:13, color:T.textMute }}>
                  Promotions, new arrivals, and announcements
                </div>
              </div>
              {POSTS.map(post => (
                <Card key={post.id} style={{ marginBottom:14, padding:"22px" }}>
                  {/* Header */}
                  <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
                    <div style={{ width:44, height:44, borderRadius:14,
                      background:`linear-gradient(135deg,${BUSINESS.avatarColor}22,${BUSINESS.avatarColor}44)`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:15, fontWeight:900, color:BUSINESS.avatarColor }}>
                      {BUSINESS.avatar}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:800, color:T.text }}>{BUSINESS.name}</div>
                      <div style={{ fontSize:11, color:T.textMute }}>{post.time}</div>
                    </div>
                    <Badge color={post.type==="promo" ? T.red : post.type==="new" ? T.green : T.blue}>
                      {post.type==="promo" ? "Promotion" : post.type==="new" ? "New Arrival" : "Update"}
                    </Badge>
                  </div>

                  {/* Visual header */}
                  <div style={{ height:120, borderRadius:16, marginBottom:16,
                    background:`linear-gradient(135deg,${post.color}14,${post.color}24)`,
                    border:`1px solid ${post.color}22`,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:60, height:60, borderRadius:"50%",
                      background:post.color+"18", display:"flex",
                      alignItems:"center", justifyContent:"center" }}>
                      <Icon name={post.icon} size={30} color={post.color}/>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ fontSize:14, color:T.text, lineHeight:1.75, marginBottom:16 }}>
                    {post.text}
                  </div>

                  {/* Actions */}
                  <div style={{ display:"flex", gap:8, paddingTop:14,
                    borderTop:`1px solid ${T.border}` }}>
                    <button onClick={() => setPostLikes(l => ({...l, [post.id]:!l[post.id]}))}
                      style={{ display:"flex", alignItems:"center", gap:6,
                        background: postLikes[post.id] ? T.redBg : T.cardAlt,
                        border:`1px solid ${postLikes[post.id] ? T.red+"44" : T.border}`,
                        borderRadius:10, padding:"8px 16px", cursor:"pointer",
                        color: postLikes[post.id] ? T.red : T.textMid,
                        fontSize:12, fontWeight:700, fontFamily:"inherit",
                        transition:"all 0.18s" }}>
                      <Icon name={postLikes[post.id] ? "heartFill" : "heart"} size={14}
                        color={postLikes[post.id] ? T.red : T.textMid}/>
                      {post.likes + (postLikes[post.id] ? 1 : 0)}
                    </button>
                    <button onClick={() => setMsgModal(true)}
                      style={{ display:"flex", alignItems:"center", gap:6,
                        background:T.cardAlt, border:`1px solid ${T.border}`,
                        borderRadius:10, padding:"8px 16px", cursor:"pointer",
                        color:T.textMid, fontSize:12, fontWeight:700, fontFamily:"inherit" }}>
                      <Icon name="message" size={14} color={T.textMid}/> Comment
                    </button>
                    <button onClick={() => showToast("Post shared!", T.navy, "check")}
                      style={{ display:"flex", alignItems:"center", gap:6,
                        background:T.cardAlt, border:`1px solid ${T.border}`,
                        borderRadius:10, padding:"8px 16px", cursor:"pointer",
                        color:T.textMid, fontSize:12, fontWeight:700, fontFamily:"inherit" }}>
                      <Icon name="share" size={14} color={T.textMid}/> Share
                    </button>
                  </div>
                </Card>
              ))}

              {/* Empty posts footer */}
              <div style={{ textAlign:"center", padding:"20px 0 8px" }}>
                <div style={{ fontSize:12, color:T.textMute }}>
                  Follow this store to get updates first
                </div>
                {!following && (
                  <div style={{ marginTop:12 }}>
                    <Btn variant="gold" icon="bell"
                      onClick={() => { setFollowing(true); showToast(`Following ${BUSINESS.name}!`, T.gold, "check"); }}>
                      Follow Store
                    </Btn>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ ABOUT TAB ══ */}
          {tab === "about" && (
            <div style={{ animation:"fadeUp 0.25s ease" }}>
              {/* Story */}
              <Card style={{ marginBottom:14 }}>
                <div style={{ fontSize:16, fontWeight:900, color:T.text,
                  marginBottom:14, letterSpacing:-0.3 }}>Our Story</div>
                <div style={{ fontSize:13, color:T.textMid, lineHeight:1.85 }}>
                  {BUSINESS.description}
                </div>
              </Card>

              {/* Contact */}
              <Card style={{ marginBottom:14 }}>
                <div style={{ fontSize:16, fontWeight:900, color:T.text,
                  marginBottom:18, letterSpacing:-0.3 }}>Contact & Location</div>
                {[
                  { icon:"mapPin",  label:"Address", value:BUSINESS.location },
                  { icon:"phone",   label:"Phone",   value:BUSINESS.phone    },
                  { icon:"globe",   label:"Website", value:BUSINESS.website  },
                  { icon:"clock",   label:"Hours",   value:BUSINESS.hours    },
                ].map(item => (
                  <div key={item.label} style={{ display:"flex", gap:14, padding:"13px 0",
                    borderBottom:`1px solid ${T.border}`, alignItems:"flex-start" }}>
                    <div style={{ width:40, height:40, borderRadius:12,
                      background:T.navyLight, border:`1px solid ${T.navy}18`,
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon name={item.icon} size={17} color={T.navy}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
                        textTransform:"uppercase", letterSpacing:0.9, marginBottom:3 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize:13, fontWeight:600, color:T.text, lineHeight:1.5 }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Verification */}
              <Card style={{ marginBottom:14,
                background:`linear-gradient(135deg,${T.blueBg},${T.navyLight})`,
                border:`1px solid ${T.blue}22` }}>
                <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                  <div style={{ width:56, height:56, borderRadius:16,
                    background:T.blue+"18", display:"flex", alignItems:"center",
                    justifyContent:"center", flexShrink:0 }}>
                    <Icon name="shield" size={28} color={T.blue}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:900, color:T.navy,
                      marginBottom:5 }}>Verified Business</div>
                    <div style={{ fontSize:12, color:T.textMid, lineHeight:1.6, marginBottom:10 }}>
                      Verified by Panda Finance using BRELA registration and TIN number. All transactions are escrow protected.
                    </div>
                    <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                      <Badge color={T.blue}><Icon name="shield" size={9} color={T.blue}/> BRELA Verified</Badge>
                      <Badge color={T.green}><Icon name="check" size={9} color={T.green}/> TIN Verified</Badge>
                      <Badge color={T.gold}><Icon name="lock" size={9} color={T.gold}/> Escrow Protected</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Business ID */}
              <Card>
                <div style={{ fontSize:11, color:T.textMute, marginBottom:8,
                  fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>
                  Business ID
                </div>
                <div style={{ fontSize:20, fontWeight:900, color:T.navy,
                  fontFamily:"monospace", letterSpacing:3, marginBottom:6 }}>{BUSINESS.id}</div>
                <div style={{ fontSize:12, color:T.textMute, lineHeight:1.5 }}>
                  Use this ID to search or pay this business directly via Panda Finance
                </div>
                <div style={{ marginTop:14 }}>
                  <Btn variant="ghost" size="sm" icon="share"
                    onClick={() => showToast("Business ID copied!", T.navy, "check")}>
                    Copy ID
                  </Btn>
                </div>
              </Card>
            </div>
          )}

        </div>
      </div>

      {/* ── FLOATING CART BAR ── */}
      {cartCount > 0 && !cartOpen && (
        <div style={{ position:"fixed", bottom:24, left:"50%",
          transform:"translateX(-50%)", zIndex:500,
          animation:"toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <button onClick={() => setCartOpen(true)} aria-label="View cart"
            style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
              border:"none", borderRadius:99, padding:"15px 28px", cursor:"pointer",
              display:"flex", alignItems:"center", gap:16, fontFamily:"inherit",
              boxShadow:`0 10px 40px ${T.navy}55`, color:"#fff", transition:"all 0.2s" }}>
            <div style={{ width:26, height:26, borderRadius:"50%",
              background:`linear-gradient(135deg,${T.gold},#A07008)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight:900, color:"#fff",
              boxShadow:T.shadowGold }}>{cartCount}</div>
            <span style={{ fontSize:14, fontWeight:800 }}>View Cart</span>
            <div style={{ width:1, height:18, background:"rgba(255,255,255,0.2)" }}/>
            <span style={{ fontSize:14, fontWeight:900, fontFamily:"monospace", color:T.goldMid }}>
              {fmt(cart.reduce((s,i) => s+i.price*i.qty, 0))}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

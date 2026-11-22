import { useState } from "react";

// ─── Design Tokens ─────────────────────────────────────────────────────────
const T = {
  bg:         "#F5F7FF",
  surface:    "#FFFFFF",
  card:       "#FFFFFF",
  cardAlt:    "#F0F4FF",
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
  shadow:     "0 2px 16px rgba(11,31,75,0.08)",
  shadowMd:   "0 8px 32px rgba(11,31,75,0.12)",
  shadowLg:   "0 20px 60px rgba(11,31,75,0.18)",
};

const fmt = n => "TSh " + Number(n).toLocaleString();

// ─── SVG Icons ──────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.6", fill: "none" };
  const icons = {
    mapPin:      <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    phone:       <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" {...s}/></>,
    globe:       <><circle cx="12" cy="12" r="10" {...s}/><line x1="2" y1="12" x2="22" y2="12" {...s}/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" {...s}/></>,
    star:        <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke={color} strokeWidth="1.4" fill={color} opacity="0.9"/></>,
    starEmpty:   <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" {...s}/></>,
    heart:       <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...s}/></>,
    heartFill:   <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={color} strokeWidth="1.4" fill={color}/></>,
    share:       <><circle cx="18" cy="5" r="3" {...s}/><circle cx="6" cy="12" r="3" {...s}/><circle cx="18" cy="19" r="3" {...s}/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" {...s}/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" {...s}/></>,
    message:     <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    shield:      <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.8" fill="none"/></>,
    check:       <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2" fill="none"/></>,
    chevronRight:<><polyline points="9 18 15 12 9 6" {...s}/></>,
    chevronLeft: <><polyline points="15 18 9 12 15 6" {...s}/></>,
    search:      <><circle cx="11" cy="11" r="8" {...s}/><line x1="21" y1="21" x2="16.65" y2="16.65" {...s}/></>,
    filter:      <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" {...s}/></>,
    cart:        <><circle cx="9" cy="21" r="1" {...s}/><circle cx="20" cy="21" r="1" {...s}/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" {...s}/></>,
    plus:        <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="1.8"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.8"/></>,
    minus:       <><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.8"/></>,
    x:           <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="1.8"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="1.8"/></>,
    clock:       <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    truck:       <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    tag:         <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" {...s}/><line x1="7" y1="7" x2="7.01" y2="7" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    grid:        <><rect x="3" y="3" width="7" height="7" {...s}/><rect x="14" y="3" width="7" height="7" {...s}/><rect x="14" y="14" width="7" height="7" {...s}/><rect x="3" y="14" width="7" height="7" {...s}/></>,
    list:        <><line x1="8" y1="6" x2="21" y2="6" {...s}/><line x1="8" y1="12" x2="21" y2="12" {...s}/><line x1="8" y1="18" x2="21" y2="18" {...s}/><line x1="3" y1="6" x2="3.01" y2="6" stroke={color} strokeWidth="2.5" strokeLinecap="round"/><line x1="3" y1="12" x2="3.01" y2="12" stroke={color} strokeWidth="2.5" strokeLinecap="round"/><line x1="3" y1="18" x2="3.01" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    users:       <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    store:       <><rect x="2" y="7" width="20" height="14" rx="2" {...s}/><path d="M16 21V12a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v9" {...s}/><path d="M2 7l2-4h16l2 4" {...s}/></>,
    award:       <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    trending:    <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    package:     <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/><polyline points="3.27 6.96 12 12.01 20.73 6.96" {...s}/><line x1="12" y1="22.08" x2="12" y2="12" {...s}/></>,
    scissors:    <><circle cx="6" cy="6" r="3" {...s}/><circle cx="6" cy="18" r="3" {...s}/><line x1="20" y1="4" x2="8.12" y2="15.88" {...s}/><line x1="14.47" y1="14.48" x2="20" y2="20" {...s}/><line x1="8.12" y1="8.12" x2="12" y2="12" {...s}/></>,
    coffee:      <><path d="M18 8h1a4 4 0 0 1 0 8h-1" {...s}/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" {...s}/><line x1="6" y1="1" x2="6" y2="4" {...s}/><line x1="10" y1="1" x2="10" y2="4" {...s}/><line x1="14" y1="1" x2="14" y2="4" {...s}/></>,
    utensils:    <><line x1="3" y1="2" x2="3" y2="22" {...s}/><path d="M7 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" {...s}/><path d="M21 2v22" {...s}/><path d="M21 7H7" {...s}/></>,
    send:        <><line x1="22" y1="2" x2="11" y2="13" {...s}/><polygon points="22 2 15 22 11 13 2 9 22 2" {...s}/></>,
    eye:         <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
    zap:         <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" {...s}/></>,
    arrowLeft:   <><line x1="19" y1="12" x2="5" y2="12" {...s}/><polyline points="12 19 5 12 12 5" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Primitives ─────────────────────────────────────────────────────────────
function Badge({ children, color, bg }) {
  return (
    <span style={{ background: bg || color + "15", color, border: `1px solid ${color}30`,
      borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 700,
      display: "inline-flex", alignItems: "center", gap: 4, lineHeight: 1.4 }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", full, icon, loading, disabled }) {
  const pad = size === "sm" ? "8px 16px" : size === "lg" ? "15px 32px" : "12px 22px";
  const fs  = size === "sm" ? 12 : size === "lg" ? 15 : 13;
  const V = {
    primary: { background: `linear-gradient(135deg,${T.navy},${T.navyMid})`, color: "#fff", border: "none", boxShadow: `0 4px 14px ${T.navy}33` },
    gold:    { background: `linear-gradient(135deg,${T.gold},#A07008)`,       color: "#fff", border: "none", boxShadow: `0 4px 14px ${T.gold}44` },
    outline: { background: "transparent", color: T.navy, border: `1.5px solid ${T.navy}33` },
    ghost:   { background: T.cardAlt,     color: T.textMid, border: `1px solid ${T.border}` },
    danger:  { background: T.redBg,       color: T.red,     border: `1px solid ${T.red}33`  },
    success: { background: T.greenBg,     color: T.green,   border: `1px solid ${T.green}33`},
  };
  return (
    <button onClick={onClick} disabled={!!disabled || !!loading}
      style={{ borderRadius: 12, cursor: disabled || loading ? "not-allowed" : "pointer",
        fontFamily: "inherit", fontWeight: 700, transition: "all 0.18s",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: 8, padding: pad, fontSize: fs, width: full ? "100%" : "auto",
        opacity: disabled || loading ? 0.6 : 1, ...V[variant] }}>
      {icon && <Icon name={icon} size={fs + 2} color="currentColor" />}
      {loading ? "Loading..." : children}
    </button>
  );
}

function Card({ children, style = {}, onClick, hover }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20,
        padding: 20, boxShadow: hov ? T.shadowMd : T.shadow,
        transition: "all 0.2s", cursor: onClick ? "pointer" : "default", ...style }}>
      {children}
    </div>
  );
}

function StarRating({ rating, count, size = 14 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <Icon key={i} name={i <= Math.round(rating) ? "star" : "starEmpty"}
            size={size} color={T.gold} />
        ))}
      </div>
      <span style={{ fontSize: size - 1, fontWeight: 700, color: T.text }}>{rating.toFixed(1)}</span>
      {count && <span style={{ fontSize: size - 2, color: T.textMute }}>({count.toLocaleString()})</span>}
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex",
      alignItems: "center", justifyContent: "center", padding: 16,
      background: "rgba(11,31,75,0.5)", backdropFilter: "blur(6px)" }}>
      <div style={{ background: T.surface, borderRadius: 24, padding: "28px 26px",
        width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto",
        boxShadow: T.shadowLg, border: `1px solid ${T.border}`,
        position: "relative", animation: "modalIn 0.25s ease" }}>
        <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2,
          background: `linear-gradient(90deg,transparent,${T.gold},transparent)`, borderRadius: 99 }} />
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.text }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: T.textMute, marginTop: 3 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8,
            background: T.cardAlt, border: `1px solid ${T.border}`, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="x" size={14} color={T.textMute} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Data ───────────────────────────────────────────────────────────────────
const BUSINESS = {
  id:           "BIZ-00291",
  name:         "Mama Amina Store",
  tagline:      "Fresh groceries, household essentials & more — delivered to your door",
  category:     "Grocery & Essentials",
  cover:        T.navyMid,
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
  description:  "Established in 2018, Mama Amina Store is Zanzibar's most trusted grocery destination. We source fresh produce directly from local farmers every morning, ensuring the best quality at the fairest prices. From daily essentials to specialty items, we deliver happiness to over 500 households every day.",
  stats: [
    { label: "Orders",    value: "12.4K" },
    { label: "Products",  value: "340+"  },
    { label: "On Time",   value: "98%"   },
    { label: "Return",    value: "94%"   },
  ],
  badges: ["Top Seller", "Fast Delivery", "Fresh Daily"],
};

const PRODUCTS = [
  { id:1, name:"Fresh Farm Tomatoes",      category:"Vegetables", price:4500,  original:6000,  rating:4.9, reviews:842,  stock:50,  unit:"kg",   tag:"Best Seller", img:"🍅" },
  { id:2, name:"Organic Coconut Oil 1L",   category:"Cooking",    price:18000, original:22000, rating:4.7, reviews:521,  stock:28,  unit:"bottle",tag:"Organic",    img:"🥥" },
  { id:3, name:"Basmati Rice 5kg",         category:"Grains",     price:32000, original:38000, rating:4.8, reviews:1203, stock:100, unit:"bag",   tag:"Bulk Deal",  img:"🌾" },
  { id:4, name:"Fresh Whole Chicken",      category:"Meat",       price:28000, original:null,  rating:4.6, reviews:389,  stock:15,  unit:"piece", tag:"Fresh",      img:"🍗" },
  { id:5, name:"Avocado — Pack of 6",      category:"Fruits",     price:12000, original:15000, rating:4.9, reviews:677,  stock:40,  unit:"pack",  tag:"Local Farm", img:"🥑" },
  { id:6, name:"Ugali Flour 2kg",          category:"Grains",     price:8500,  original:null,  rating:4.5, reviews:298,  stock:200, unit:"pack",  tag:null,         img:"🌽" },
  { id:7, name:"Fresh Spinach Bundle",     category:"Vegetables", price:3000,  original:null,  rating:4.7, reviews:456,  stock:60,  unit:"bundle",tag:"Daily Fresh", img:"🥬" },
  { id:8, name:"Cooking Oil 5L",           category:"Cooking",    price:42000, original:48000, rating:4.6, reviews:734,  stock:45,  unit:"jerry", tag:"Bulk Deal",  img:"🫙" },
];

const SERVICES = [
  { id:1, name:"Same-Day Delivery",   desc:"Order by 2PM, get by 6PM",        price:3000,  icon:"truck",    color:T.blue   },
  { id:2, name:"Bulk Order Discount", desc:"10% off on orders above TSh 100K", price:null,  icon:"tag",      color:T.green  },
  { id:3, name:"Catering Supply",     desc:"Supply for events & restaurants",  price:null,  icon:"utensils", color:T.gold   },
  { id:4, name:"Custom Orders",       desc:"Request items not listed",         price:null,  icon:"package",  color:T.purple },
];

const REVIEWS = [
  { id:1, name:"Hassan Kimaro",  initials:"HK", color:"#1D4ED8", rating:5, time:"2 days ago",   text:"Exceptional quality and super fast delivery. The tomatoes were so fresh they lasted over a week. Mama Amina has the best grocery store in all of Zanzibar!" },
  { id:2, name:"Fatuma Ali",     initials:"FA", color:"#C0392B", rating:5, time:"1 week ago",    text:"I have been ordering from Mama Amina for 2 years now. Always fresh, always on time. The customer service is outstanding and the prices are very fair." },
  { id:3, name:"Juma Mwangi",   initials:"JM", color:"#0A7B4B", rating:4, time:"2 weeks ago",   text:"Great selection of organic products. The coconut oil is pure and smells amazing. Delivery was slightly late but they called ahead to notify me." },
  { id:4, name:"Zawadi Mushi",  initials:"ZM", color:"#C9960A", rating:5, time:"3 weeks ago",   text:"I ordered for my restaurant catering event — 50 guests. Everything was delivered perfectly on time and the quality was restaurant grade. Highly recommended!" },
];

const POSTS = [
  { id:1, type:"promo",  time:"Today",      text:"🌟 WEEKEND SPECIAL: 20% off all vegetables this Saturday and Sunday. Use code FRESH20 at checkout. Limited stock!",              likes:142, img:"🥗" },
  { id:2, type:"new",    time:"Yesterday",  text:"New arrival! Organic Zanzibar Honey — sourced directly from local beekeepers. Only 30 jars available. Order yours now!", likes:89,  img:"🍯" },
  { id:3, type:"update", time:"3 days ago", text:"We have extended our delivery hours! You can now order until 8PM and receive same-day delivery. Thank you for your support!", likes:234, img:"🚚" },
];

// ─── Product Card ────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, layout = "grid" }) {
  const [wishlisted, setWishlisted] = useState(false);
  const discount = product.original
    ? Math.round(((product.original - product.price) / product.original) * 100)
    : null;

  if (layout === "list") {
    return (
      <div style={{ display: "flex", gap: 14, padding: "16px 0",
        borderBottom: `1px solid ${T.border}` }}>
        {/* Image */}
        <div style={{ width: 80, height: 80, borderRadius: 14, background: T.cardAlt,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, flexShrink: 0, border: `1px solid ${T.border}` }}>
          {product.img}
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.text,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              maxWidth: "70%" }}>{product.name}</div>
            {product.tag && <Badge color={T.gold}>{product.tag}</Badge>}
          </div>
          <StarRating rating={product.rating} count={product.reviews} size={12} />
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", marginTop: 8 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: T.navy,
                fontFamily: "monospace" }}>{fmt(product.price)}</div>
              {product.original && <div style={{ fontSize: 11, color: T.textMute,
                textDecoration: "line-through" }}>{fmt(product.original)}</div>}
            </div>
            <Btn size="sm" variant="gold" icon="cart" onClick={() => onAddToCart(product)}>
              Add
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18,
      overflow: "hidden", boxShadow: T.shadow, transition: "all 0.2s", position: "relative" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = T.shadowMd; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = T.shadow; }}>

      {/* Product image */}
      <div style={{ height: 130, background: T.cardAlt, display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: 52,
        position: "relative", borderBottom: `1px solid ${T.border}` }}>
        {product.img}
        {/* Wishlist */}
        <button onClick={() => setWishlisted(v => !v)}
          style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32,
            borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: T.shadow }}>
          <Icon name={wishlisted ? "heartFill" : "heart"} size={16}
            color={wishlisted ? T.red : T.textMute} />
        </button>
        {/* Discount badge */}
        {discount && (
          <div style={{ position: "absolute", top: 10, left: 10, background: T.red,
            color: "#fff", borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 800 }}>
            -{discount}%
          </div>
        )}
        {/* Tag */}
        {product.tag && !discount && (
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <Badge color={T.gold}>{product.tag}</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "14px 14px 16px" }}>
        <div style={{ fontSize: 11, color: T.textMute, marginBottom: 4,
          fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {product.category}
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: T.text, marginBottom: 6,
          lineHeight: 1.3, overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {product.name}
        </div>
        <StarRating rating={product.rating} count={product.reviews} size={12} />
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", marginTop: 10 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: T.navy,
              fontFamily: "monospace", letterSpacing: -0.5 }}>{fmt(product.price)}</div>
            <div style={{ fontSize: 10, color: T.textMute }}>per {product.unit}</div>
          </div>
          <button onClick={() => onAddToCart(product)}
            style={{ width: 36, height: 36, borderRadius: 10, cursor: "pointer",
              background: `linear-gradient(135deg,${T.gold},#A07008)`, border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 12px ${T.gold}44`, transition: "all 0.18s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
            <Icon name="plus" size={18} color="#fff" />
          </button>
        </div>
        {/* Stock warning */}
        {product.stock < 20 && (
          <div style={{ marginTop: 8, fontSize: 11, color: T.amber, fontWeight: 600 }}>
            Only {product.stock} left in stock
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Review Card ─────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div style={{ padding: "18px 0", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%",
          background: review.color + "22", border: `2px solid ${review.color}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: review.color, flexShrink: 0 }}>
          {review.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>{review.name}</div>
            <div style={{ fontSize: 11, color: T.textMute }}>{review.time}</div>
          </div>
          <StarRating rating={review.rating} size={13} />
        </div>
      </div>
      <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.7 }}>{review.text}</div>
    </div>
  );
}

// ─── Cart Drawer ─────────────────────────────────────────────────────────────
function CartDrawer({ cart, onUpdateQty, onRemove, onClose, onCheckout }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 998, display: "flex",
      justifyContent: "flex-end", background: "rgba(11,31,75,0.4)",
      backdropFilter: "blur(4px)" }}>
      <div style={{ width: "100%", maxWidth: 420, background: T.surface,
        height: "100%", overflowY: "auto", boxShadow: T.shadowLg,
        animation: "slideInRight 0.3s ease", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, background: T.surface, zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.text }}>Your Cart</div>
            <div style={{ fontSize: 12, color: T.textMute, marginTop: 2 }}>
              {count} item{count !== 1 ? "s" : ""} from Mama Amina Store
            </div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10,
            background: T.cardAlt, border: `1px solid ${T.border}`, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="x" size={16} color={T.textMute} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, padding: "16px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>
                <Icon name="cart" size={48} color={T.border} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 8 }}>
                Your cart is empty
              </div>
              <div style={{ fontSize: 13, color: T.textMute }}>
                Add items from the store to get started
              </div>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={item.id} style={{ display: "flex", gap: 14, padding: "14px 0",
                borderBottom: i < cart.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ width: 60, height: 60, borderRadius: 12, background: T.cardAlt,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, flexShrink: 0 }}>{item.img}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text,
                    marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis",
                    whiteSpace: "nowrap" }}>{item.name}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: T.navy,
                    fontFamily: "monospace", marginBottom: 8 }}>{fmt(item.price)}</div>
                  {/* Qty controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => onUpdateQty(item.id, -1)}
                      style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${T.border}`,
                        background: T.cardAlt, cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center" }}>
                      <Icon name="minus" size={14} color={T.textMid} />
                    </button>
                    <span style={{ fontSize: 14, fontWeight: 800, color: T.text,
                      minWidth: 24, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.id, 1)}
                      style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${T.border}`,
                        background: T.cardAlt, cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center" }}>
                      <Icon name="plus" size={14} color={T.textMid} />
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: T.green,
                    fontFamily: "monospace", marginBottom: 8 }}>
                    {fmt(item.price * item.qty)}
                  </div>
                  <button onClick={() => onRemove(item.id)}
                    style={{ background: T.redBg, border: `1px solid ${T.red}22`,
                      borderRadius: 8, padding: "4px 8px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 4,
                      fontSize: 11, fontWeight: 700, color: T.red }}>
                    <Icon name="x" size={12} color={T.red} /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: `1px solid ${T.border}`,
            background: T.surface }}>
            {/* Delivery info */}
            <div style={{ background: T.navyLight, borderRadius: 12, padding: "12px 16px",
              marginBottom: 14, display: "flex", justifyContent: "space-between",
              alignItems: "center" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Icon name="truck" size={16} color={T.navy} />
                <div style={{ fontSize: 12, color: T.textMid, fontWeight: 600 }}>Delivery fee</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.navy,
                fontFamily: "monospace" }}>{fmt(BUSINESS.deliveryFee)}</div>
            </div>
            {/* Order summary */}
            <div style={{ marginBottom: 16 }}>
              {[
                ["Subtotal", fmt(total)],
                ["Delivery", fmt(BUSINESS.deliveryFee)],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between",
                  padding: "6px 0", fontSize: 13 }}>
                  <span style={{ color: T.textMute }}>{l}</span>
                  <span style={{ color: T.text, fontWeight: 700, fontFamily: "monospace" }}>{v}</span>
                </div>
              ))}
              <div style={{ height: 1, background: T.border, margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: T.text }}>Total</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: T.navy,
                  fontFamily: "monospace" }}>{fmt(total + BUSINESS.deliveryFee)}</span>
              </div>
            </div>
            <Btn full variant="gold" icon="zap" onClick={onCheckout}>
              Pay with Panda Wallet
            </Btn>
            <div style={{ marginTop: 10, fontSize: 11, color: T.textMute, textAlign: "center" }}>
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
  const [category, setCategory] = useState("All");
  const [cart, setCart]         = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [toast, setToast]       = useState(null);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [postLikes, setPostLikes] = useState({ 1: false, 2: false, 3: false });
  const [sortBy, setSortBy]     = useState("popular");
  const [msgModal, setMsgModal] = useState(false);
  const [msgText, setMsgText]   = useState("");

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  const addToCart = (product) => {
    setCart(c => {
      const existing = c.find(i => i.id === product.id);
      if (existing) return c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added to cart`, T.green);
  };

  const updateQty = (id, delta) => {
    setCart(c => c.map(i => i.id === id
      ? { ...i, qty: Math.max(0, i.qty + delta) }
      : i).filter(i => i.qty > 0));
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const categories = ["All", ...new Set(PRODUCTS.map(p => p.category))];

  const filtered = PRODUCTS
    .filter(p => category === "All" || p.category === category)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "popular" ? b.reviews - a.reviews
      : sortBy === "price_asc" ? a.price - b.price
      : sortBy === "price_desc" ? b.price - a.price
      : b.rating - a.rating);

  const TABS = [
    { id: "products",  label: "Products",  icon: "grid"    },
    { id: "services",  label: "Services",  icon: "zap"     },
    { id: "reviews",   label: "Reviews",   icon: "star"    },
    { id: "posts",     label: "Posts",     icon: "eye"     },
    { id: "about",     label: "About",     icon: "store"   },
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text,
      fontFamily: "'Inter','Plus Jakarta Sans','Segoe UI',sans-serif" }}>

      <style>{`
        @keyframes toastIn { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.96) } to { opacity:1; transform:scale(1) } }
        @keyframes slideInRight { from { transform:translateX(100%) } to { transform:translateX(0) } }
        * { box-sizing:border-box; }
        input::placeholder { color:#8A9BC0; }
        select { appearance:none; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#DDE3F5; border-radius:99px; }
        button:hover { opacity:0.88; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, background: T.surface, border: `1px solid ${toast.color}33`,
          borderLeft: `4px solid ${toast.color}`, borderRadius: 12,
          padding: "12px 20px", boxShadow: T.shadowMd, whiteSpace: "nowrap",
          animation: "toastIn 0.3s ease", fontSize: 13, fontWeight: 700, color: T.text }}>
          {toast.msg}
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <CartDrawer cart={cart} onUpdateQty={updateQty}
          onRemove={id => setCart(c => c.filter(i => i.id !== id))}
          onClose={() => setCartOpen(false)}
          onCheckout={() => { setCheckoutDone(true); setCart([]); setCartOpen(false); showToast("Order placed! Mama Amina will confirm shortly.", T.gold); }} />
      )}

      {/* Message Modal */}
      {msgModal && (
        <Modal title="Message Mama Amina Store" subtitle="Buyer · Seller direct chat"
          onClose={() => setMsgModal(false)}>
          <div style={{ background: T.navyLight, borderRadius: 12, padding: "12px 16px",
            marginBottom: 16, fontSize: 13, color: T.textMid }}>
            Ask about prices, custom orders, delivery times, or anything else.
          </div>
          <textarea value={msgText} onChange={e => setMsgText(e.target.value)}
            placeholder="e.g. Do you have wholesale pricing for 50kg rice bags?"
            rows={4} style={{ width: "100%", background: T.cardAlt,
              border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "12px 14px",
              color: T.text, fontSize: 13, fontFamily: "inherit", outline: "none",
              resize: "vertical", boxSizing: "border-box", marginBottom: 16 }} />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" onClick={() => setMsgModal(false)}>Cancel</Btn>
            <Btn full variant="gold" icon="send" onClick={() => {
              setMsgModal(false); setMsgText("");
              showToast("Message sent! Mama Amina will reply shortly.", T.gold);
            }}>Send Message</Btn>
          </div>
        </Modal>
      )}

      {/* ── TOP NAV ── */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`,
        padding: "14px 20px", position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 12px rgba(11,31,75,0.06)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex",
          justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ width: 36, height: 36, borderRadius: 10, background: T.cardAlt,
              border: `1px solid ${T.border}`, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="arrowLeft" size={18} color={T.navy} />
            </button>
            <div>
              <div style={{ fontSize: 11, color: T.textMute, textTransform: "uppercase",
                letterSpacing: 1, fontWeight: 600 }}>Panda Marketplace</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: T.navy, letterSpacing: -0.3 }}>
                {BUSINESS.name}
              </div>
            </div>
          </div>
          {/* Cart button */}
          <button onClick={() => setCartOpen(true)}
            style={{ position: "relative", width: 42, height: 42, borderRadius: 12,
              background: T.navyLight, border: `1px solid ${T.navy}22`,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="cart" size={20} color={T.navy} />
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: -5, right: -5, width: 20, height: 20,
                background: T.red, borderRadius: "50%", fontSize: 10, fontWeight: 900,
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                border: `2px solid ${T.bg}` }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* ── COVER + PROFILE ── */}
        <div style={{ position: "relative", marginBottom: 80 }}>
          {/* Cover */}
          <div style={{ height: 200, background: `linear-gradient(135deg,${T.navyMid},${T.navy} 50%,${T.gold}44)`,
            position: "relative", overflow: "hidden" }}>
            {/* Pattern */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.06,
              backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
              backgroundSize: "24px 24px" }} />
            {/* Open badge */}
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              <Badge color={BUSINESS.openNow ? T.green : T.red}
                bg={BUSINESS.openNow ? T.greenBg : T.redBg}>
                <div style={{ width: 6, height: 6, borderRadius: "50%",
                  background: BUSINESS.openNow ? T.green : T.red }} />
                {BUSINESS.openNow ? "Open Now" : "Closed"}
              </Badge>
            </div>
            {/* Delivery badge */}
            {BUSINESS.delivery && (
              <div style={{ position: "absolute", bottom: 16, right: 16 }}>
                <Badge color={T.blue}>
                  <Icon name="truck" size={11} color={T.blue} />
                  {BUSINESS.deliveryTime}
                </Badge>
              </div>
            )}
          </div>

          {/* Profile card — floating */}
          <div style={{ position: "absolute", bottom: -70, left: 20, right: 20 }}>
            <div style={{ background: T.surface, borderRadius: 20, padding: "18px 20px",
              boxShadow: T.shadowMd, border: `1px solid ${T.border}`, display: "flex",
              gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>

              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 72, height: 72, borderRadius: 18,
                  background: BUSINESS.avatarColor + "22",
                  border: `3px solid ${T.surface}`,
                  boxShadow: `0 0 0 2px ${BUSINESS.avatarColor}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, fontWeight: 900, color: BUSINESS.avatarColor }}>
                  {BUSINESS.avatar}
                </div>
                {BUSINESS.verified && (
                  <div style={{ position: "absolute", bottom: -4, right: -4, width: 22, height: 22,
                    background: T.blue, borderRadius: "50%", border: `2px solid ${T.surface}`,
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="shield" size={12} color="#fff" />
                  </div>
                )}
              </div>

              {/* Name + info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8,
                  flexWrap: "wrap", marginBottom: 4 }}>
                  <div style={{ fontSize: 17, fontWeight: 900, color: T.text,
                    letterSpacing: -0.3 }}>{BUSINESS.name}</div>
                  {BUSINESS.verified && (
                    <Badge color={T.blue}>
                      <Icon name="shield" size={10} color={T.blue} />
                      {BUSINESS.verifiedType}
                    </Badge>
                  )}
                </div>
                <div style={{ fontSize: 12, color: T.textMute, marginBottom: 8,
                  lineHeight: 1.4 }}>{BUSINESS.tagline}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {BUSINESS.badges.map(b => (
                    <Badge key={b} color={T.gold}>{b}</Badge>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                <Btn size="sm" variant={following ? "ghost" : "gold"}
                  onClick={() => { setFollowing(f => !f); showToast(following ? "Unfollowed" : `Following ${BUSINESS.name}`, T.gold); }}>
                  {following ? "Following" : "Follow"}
                </Btn>
                <button onClick={() => setMsgModal(true)}
                  style={{ width: 36, height: 36, borderRadius: 10, background: T.navyLight,
                    border: `1px solid ${T.navy}22`, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="message" size={16} color={T.navy} />
                </button>
                <button onClick={() => showToast("Link copied! Share Mama Amina Store", T.navy)}
                  style={{ width: 36, height: 36, borderRadius: 10, background: T.cardAlt,
                    border: `1px solid ${T.border}`, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="share" size={16} color={T.textMid} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 16px 80px" }}>

          {/* ── STATS ROW ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)",
            gap: 10, marginBottom: 16 }}>
            {BUSINESS.stats.map(stat => (
              <div key={stat.label} style={{ background: T.card, border: `1px solid ${T.border}`,
                borderRadius: 14, padding: "14px 10px", textAlign: "center",
                boxShadow: T.shadow }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: T.navy,
                  fontFamily: "monospace", marginBottom: 4 }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: T.textMute, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: 0.6 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* ── RATING + FOLLOWERS ── */}
          <Card style={{ marginBottom: 16, padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", align: "center", gap: 20 }}>
                <div>
                  <StarRating rating={BUSINESS.rating} count={BUSINESS.reviewCount} size={16} />
                  <div style={{ fontSize: 11, color: T.textMute, marginTop: 4 }}>Overall rating</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: T.navy,
                    fontFamily: "monospace" }}>{BUSINESS.followers.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: T.textMute }}>Followers</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: T.navy,
                    fontFamily: "monospace" }}>{BUSINESS.reviewCount.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: T.textMute }}>Reviews</div>
                </div>
              </div>
            </div>
          </Card>

          {/* ── DELIVERY INFO ── */}
          <div style={{ background: T.greenBg, border: `1px solid ${T.green}22`,
            borderRadius: 14, padding: "12px 16px", marginBottom: 16,
            display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Icon name="truck" size={16} color={T.green} />
              <span style={{ fontSize: 12, color: T.green, fontWeight: 700 }}>Free delivery on orders above {fmt(BUSINESS.minOrder)}</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Icon name="clock" size={14} color={T.textMid} />
              <span style={{ fontSize: 12, color: T.textMid, fontWeight: 600 }}>{BUSINESS.deliveryTime}</span>
            </div>
          </div>

          {/* ── TAB BAR ── */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.surface,
            borderRadius: 16, padding: 5, border: `1px solid ${T.border}`,
            boxShadow: T.shadow, overflowX: "auto" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ flex: 1, minWidth: 80, padding: "10px 8px", borderRadius: 12,
                  border: "none", background: tab === t.id ? T.navy : "transparent",
                  color: tab === t.id ? "#fff" : T.textMute,
                  fontWeight: tab === t.id ? 800 : 500, fontSize: 12,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 4, whiteSpace: "nowrap",
                  boxShadow: tab === t.id ? `0 4px 14px ${T.navy}33` : "none" }}>
                <Icon name={t.icon} size={15} color={tab === t.id ? "#fff" : T.textMute} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* ══ PRODUCTS TAB ══ */}
          {tab === "products" && (
            <div>
              {/* Search + filters */}
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <div style={{ position: "absolute", left: 14, top: "50%",
                    transform: "translateY(-50%)" }}>
                    <Icon name="search" size={16} color={T.textMute} />
                  </div>
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..."
                    style={{ width: "100%", background: T.card, border: `1.5px solid ${T.border}`,
                      borderRadius: 12, padding: "11px 14px 11px 42px", color: T.text,
                      fontSize: 13, fontFamily: "inherit", outline: "none",
                      transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = T.navy}
                    onBlur={e => e.target.style.borderColor = T.border} />
                </div>
                {/* Layout toggle */}
                <button onClick={() => setLayout(l => l === "grid" ? "list" : "grid")}
                  style={{ width: 44, height: 44, borderRadius: 12, background: T.card,
                    border: `1.5px solid ${T.border}`, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0 }}>
                  <Icon name={layout === "grid" ? "list" : "grid"} size={18} color={T.navy} />
                </button>
              </div>

              {/* Sort */}
              <div style={{ display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      style={{ padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                        background: category === cat ? T.navy : T.card,
                        border: category === cat ? "none" : `1px solid ${T.border}`,
                        color: category === cat ? "#fff" : T.textMid,
                        transition: "all 0.18s" }}>
                      {cat}
                    </button>
                  ))}
                </div>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  style={{ marginLeft: 8, background: T.card, border: `1px solid ${T.border}`,
                    borderRadius: 10, padding: "7px 12px", fontSize: 12, color: T.textMid,
                    fontFamily: "inherit", outline: "none", cursor: "pointer",
                    flexShrink: 0, fontWeight: 600 }}>
                  <option value="popular">Popular</option>
                  <option value="rating">Top Rated</option>
                  <option value="price_asc">Price: Low</option>
                  <option value="price_desc">Price: High</option>
                </select>
              </div>

              {/* Results count */}
              <div style={{ fontSize: 12, color: T.textMute, marginBottom: 14 }}>
                {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
              </div>

              {/* Products */}
              {layout === "grid" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {filtered.map(p => (
                    <ProductCard key={p.id} product={p}
                      onAddToCart={addToCart} layout="grid" />
                  ))}
                </div>
              ) : (
                <Card>
                  {filtered.map(p => (
                    <ProductCard key={p.id} product={p}
                      onAddToCart={addToCart} layout="list" />
                  ))}
                </Card>
              )}
            </div>
          )}

          {/* ══ SERVICES TAB ══ */}
          {tab === "services" && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.text, marginBottom: 4 }}>
                What We Offer
              </div>
              <div style={{ fontSize: 12, color: T.textMute, marginBottom: 18 }}>
                Beyond products — Mama Amina Store provides these services
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {SERVICES.map(svc => (
                  <Card key={svc.id} hover style={{ padding: "20px" }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ width: 52, height: 52, borderRadius: 16,
                        background: svc.color + "15", border: `1px solid ${svc.color}22`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0 }}>
                        <Icon name={svc.icon} size={24} color={svc.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: T.text,
                          marginBottom: 4 }}>{svc.name}</div>
                        <div style={{ fontSize: 12, color: T.textMute }}>{svc.desc}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        {svc.price
                          ? <div style={{ fontSize: 15, fontWeight: 900, color: T.navy,
                              fontFamily: "monospace" }}>{fmt(svc.price)}</div>
                          : <Badge color={T.green}>Free</Badge>
                        }
                        <Icon name="chevronRight" size={16} color={T.textMute} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Request custom */}
              <div style={{ marginTop: 20, background: T.navyLight,
                border: `1px solid ${T.navy}22`, borderRadius: 16, padding: "20px",
                textAlign: "center" }}>
                <Icon name="message" size={28} color={T.navy} />
                <div style={{ fontSize: 14, fontWeight: 800, color: T.navy,
                  marginTop: 10, marginBottom: 6 }}>Need something specific?</div>
                <div style={{ fontSize: 12, color: T.textMid, marginBottom: 16 }}>
                  Chat directly with the store owner to discuss custom orders, bulk pricing, or special requests.
                </div>
                <Btn variant="primary" icon="message" onClick={() => setMsgModal(true)}>
                  Send a Message
                </Btn>
              </div>
            </div>
          )}

          {/* ══ REVIEWS TAB ══ */}
          {tab === "reviews" && (
            <div>
              {/* Rating summary */}
              <Card style={{ marginBottom: 16, padding: "22px" }}>
                <div style={{ display: "flex", gap: 24, alignItems: "center",
                  flexWrap: "wrap" }}>
                  {/* Big number */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 56, fontWeight: 900, color: T.navy,
                      lineHeight: 1, fontFamily: "monospace" }}>{BUSINESS.rating}</div>
                    <StarRating rating={BUSINESS.rating} size={18} />
                    <div style={{ fontSize: 12, color: T.textMute, marginTop: 6 }}>
                      {BUSINESS.reviewCount.toLocaleString()} reviews
                    </div>
                  </div>
                  {/* Bars */}
                  <div style={{ flex: 1, minWidth: 160 }}>
                    {[
                      { stars: 5, pct: 82 },
                      { stars: 4, pct: 11 },
                      { stars: 3, pct: 4  },
                      { stars: 2, pct: 2  },
                      { stars: 1, pct: 1  },
                    ].map(r => (
                      <div key={r.stars} style={{ display: "flex", alignItems: "center",
                        gap: 8, marginBottom: 6 }}>
                        <div style={{ fontSize: 11, color: T.textMute, width: 14,
                          textAlign: "right", fontWeight: 600 }}>{r.stars}</div>
                        <Icon name="star" size={11} color={T.gold} />
                        <div style={{ flex: 1, background: T.border, borderRadius: 99,
                          height: 6, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${r.pct}%`,
                            background: `linear-gradient(90deg,${T.gold},${T.goldMid})`,
                            borderRadius: 99 }} />
                        </div>
                        <div style={{ fontSize: 11, color: T.textMute, width: 28,
                          fontWeight: 600 }}>{r.pct}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Review list */}
              <Card>
                {REVIEWS.map(r => <ReviewCard key={r.id} review={r} />)}
                <div style={{ marginTop: 16, textAlign: "center" }}>
                  <Btn variant="outline" onClick={() => showToast("Loading more reviews...", T.navy)}>
                    Load More Reviews
                  </Btn>
                </div>
              </Card>
            </div>
          )}

          {/* ══ POSTS TAB ══ */}
          {tab === "posts" && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.text, marginBottom: 4 }}>
                Latest from {BUSINESS.name}
              </div>
              <div style={{ fontSize: 12, color: T.textMute, marginBottom: 18 }}>
                Promotions, new arrivals, and store updates
              </div>
              {POSTS.map(post => (
                <Card key={post.id} style={{ marginBottom: 14, padding: "20px" }}>
                  {/* Post header */}
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12,
                      background: BUSINESS.avatarColor + "22",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15, fontWeight: 900, color: BUSINESS.avatarColor }}>
                      {BUSINESS.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>
                        {BUSINESS.name}
                      </div>
                      <div style={{ fontSize: 11, color: T.textMute }}>{post.time}</div>
                    </div>
                    <Badge color={post.type === "promo" ? T.red : post.type === "new" ? T.green : T.blue}>
                      {post.type === "promo" ? "Promotion" : post.type === "new" ? "New" : "Update"}
                    </Badge>
                  </div>

                  {/* Post content */}
                  <div style={{ fontSize: 14, color: T.text, lineHeight: 1.7,
                    marginBottom: 14 }}>{post.text}</div>

                  {/* Post image placeholder */}
                  <div style={{ height: 140, background: T.cardAlt, borderRadius: 14,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 56, marginBottom: 14, border: `1px solid ${T.border}` }}>
                    {post.img}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 10, paddingTop: 10,
                    borderTop: `1px solid ${T.border}` }}>
                    <button onClick={() => { setPostLikes(l => ({ ...l, [post.id]: !l[post.id] })); }}
                      style={{ display: "flex", alignItems: "center", gap: 6,
                        background: postLikes[post.id] ? T.redBg : T.cardAlt,
                        border: `1px solid ${postLikes[post.id] ? T.red + "44" : T.border}`,
                        borderRadius: 10, padding: "7px 14px", cursor: "pointer",
                        color: postLikes[post.id] ? T.red : T.textMid,
                        fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>
                      <Icon name={postLikes[post.id] ? "heartFill" : "heart"} size={14}
                        color={postLikes[post.id] ? T.red : T.textMid} />
                      {post.likes + (postLikes[post.id] ? 1 : 0)}
                    </button>
                    <button onClick={() => setMsgModal(true)}
                      style={{ display: "flex", alignItems: "center", gap: 6,
                        background: T.cardAlt, border: `1px solid ${T.border}`,
                        borderRadius: 10, padding: "7px 14px", cursor: "pointer",
                        color: T.textMid, fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>
                      <Icon name="message" size={14} color={T.textMid} /> Comment
                    </button>
                    <button onClick={() => showToast("Post shared!", T.navy)}
                      style={{ display: "flex", alignItems: "center", gap: 6,
                        background: T.cardAlt, border: `1px solid ${T.border}`,
                        borderRadius: 10, padding: "7px 14px", cursor: "pointer",
                        color: T.textMid, fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>
                      <Icon name="share" size={14} color={T.textMid} /> Share
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* ══ ABOUT TAB ══ */}
          {tab === "about" && (
            <div>
              {/* Story */}
              <Card style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 12 }}>
                  Our Story
                </div>
                <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.8 }}>
                  {BUSINESS.description}
                </div>
              </Card>

              {/* Contact info */}
              <Card style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 16 }}>
                  Contact & Location
                </div>
                {[
                  { icon: "mapPin",  label: "Address",   value: BUSINESS.location },
                  { icon: "phone",   label: "Phone",     value: BUSINESS.phone    },
                  { icon: "globe",   label: "Website",   value: BUSINESS.website  },
                  { icon: "clock",   label: "Hours",     value: BUSINESS.hours    },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", gap: 14, padding: "12px 0",
                    borderBottom: `1px solid ${T.border}`, alignItems: "flex-start" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11,
                      background: T.navyLight, border: `1px solid ${T.navy}22`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0 }}>
                      <Icon name={item.icon} size={17} color={T.navy} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: T.textMute, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text,
                        lineHeight: 1.5 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Verification */}
              <Card style={{ marginBottom: 14, background: T.navyLight,
                border: `1px solid ${T.navy}22` }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14,
                    background: T.blue + "18", display: "flex", alignItems: "center",
                    justifyContent: "center" }}>
                    <Icon name="shield" size={24} color={T.blue} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: T.navy,
                      marginBottom: 4 }}>Verified Business</div>
                    <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.5 }}>
                      This business has been verified by Panda Finance using BRELA registration and TIN number. All transactions are escrow protected.
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                      <Badge color={T.blue}>BRELA Verified</Badge>
                      <Badge color={T.green}>TIN Verified</Badge>
                      <Badge color={T.gold}>Escrow Protected</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Business ID */}
              <Card>
                <div style={{ fontSize: 12, color: T.textMute, marginBottom: 6,
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
                  Business ID
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: T.navy,
                  fontFamily: "monospace", letterSpacing: 2 }}>{BUSINESS.id}</div>
                <div style={{ fontSize: 12, color: T.textMute, marginTop: 4 }}>
                  Use this ID to search or pay this business directly via Panda Finance
                </div>
              </Card>
            </div>
          )}

          {/* ── CHECKOUT SUCCESS ── */}
          {checkoutDone && (
            <div style={{ position: "fixed", inset: 0, zIndex: 9998,
              background: "rgba(11,31,75,0.5)", display: "flex",
              alignItems: "center", justifyContent: "center", padding: 16,
              backdropFilter: "blur(6px)" }}>
              <div style={{ background: T.surface, borderRadius: 24, padding: "36px 28px",
                width: "100%", maxWidth: 400, textAlign: "center",
                boxShadow: T.shadowLg, animation: "modalIn 0.3s ease" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%",
                  background: T.greenBg, border: `2px solid ${T.green}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px" }}>
                  <Icon name="check" size={36} color={T.green} />
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: T.text,
                  marginBottom: 8 }}>Order Placed!</div>
                <div style={{ fontSize: 13, color: T.textMute, marginBottom: 6, lineHeight: 1.6 }}>
                  Your order from <strong>{BUSINESS.name}</strong> has been placed and paid via Panda Wallet. The store will confirm within 5 minutes.
                </div>
                <div style={{ fontSize: 11, color: T.textMute, marginBottom: 24,
                  fontFamily: "monospace" }}>
                  Order #{Math.floor(100000 + Math.random() * 900000)}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn full variant="ghost" onClick={() => setCheckoutDone(false)}>
                    Continue Shopping
                  </Btn>
                  <Btn full variant="gold" icon="truck">Track Order</Btn>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── FLOATING CART BAR ── */}
      {cartCount > 0 && !cartOpen && (
        <div style={{ position: "fixed", bottom: 24, left: "50%",
          transform: "translateX(-50%)", zIndex: 500, animation: "toastIn 0.3s ease" }}>
          <button onClick={() => setCartOpen(true)}
            style={{ background: `linear-gradient(135deg,${T.navy},${T.navyMid})`,
              border: "none", borderRadius: 99, padding: "14px 28px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 14, fontFamily: "inherit",
              boxShadow: `0 8px 32px ${T.navy}55`, color: "#fff" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.gold,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 900, color: "#fff" }}>{cartCount}</div>
            <span style={{ fontSize: 14, fontWeight: 800 }}>View Cart</span>
            <span style={{ fontSize: 14, fontWeight: 900, fontFamily: "monospace",
              color: T.goldMid }}>
              {fmt(cart.reduce((s, i) => s + i.price * i.qty, 0))}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

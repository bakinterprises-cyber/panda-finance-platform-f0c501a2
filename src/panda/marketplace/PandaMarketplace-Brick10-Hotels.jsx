import { useState } from "react";

// ============================================================
// 🧱 BRICK 10 — HOTEL RESERVATIONS
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export HotelReservations from this file
//     Props: { currentUser, onBack, onTrackBooking,
//              onChatHotel, onWalletPay }
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
    search:       <><circle cx="11" cy="11" r="8" {...s}/><line x1="21" y1="21" x2="16.65" y2="16.65" {...s}/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    starEmpty:    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke={color} strokeWidth="1.4"/>,
    mapPin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    calendar:     <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" {...s}/><line x1="16" y1="2" x2="16" y2="6" {...s}/><line x1="8" y1="2" x2="8" y2="6" {...s}/><line x1="3" y1="10" x2="21" y2="10" {...s}/></>,
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronUp:    <><polyline points="18 15 12 9 6 15" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    heart:        <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...s}/></>,
    heartFill:    <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={color} stroke={color} strokeWidth="1.4"/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    share:        <><circle cx="18" cy="5" r="3" {...s}/><circle cx="6" cy="12" r="3" {...s}/><circle cx="18" cy="19" r="3" {...s}/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" {...s}/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" {...s}/></>,
    wifi:         <><path d="M5 12.55a11 11 0 0 1 14.08 0" {...s}/><path d="M1.42 9a16 16 0 0 1 21.16 0" {...s}/><path d="M8.53 16.11a6 6 0 0 1 6.95 0" {...s}/><line x1="12" y1="20" x2="12.01" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    coffee:       <><path d="M18 8h1a4 4 0 0 1 0 8h-1" {...s}/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" {...s}/><line x1="6" y1="1" x2="6" y2="4" {...s}/><line x1="10" y1="1" x2="10" y2="4" {...s}/><line x1="14" y1="1" x2="14" y2="4" {...s}/></>,
    wind:         <><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" {...s}/></>,
    tv:           <><rect x="2" y="7" width="20" height="15" rx="2" ry="2" {...s}/><polyline points="17 2 12 7 7 2" {...s}/></>,
    droplet:      <><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" {...s}/></>,
    sun:          <><circle cx="12" cy="12" r="5" {...s}/><line x1="12" y1="1" x2="12" y2="3" {...s}/><line x1="12" y1="21" x2="12" y2="23" {...s}/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" {...s}/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" {...s}/><line x1="1" y1="12" x2="3" y2="12" {...s}/><line x1="21" y1="12" x2="23" y2="12" {...s}/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" {...s}/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" {...s}/></>,
    car:          <><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" {...s}/><circle cx="7.5" cy="17.5" r="2.5" {...s}/><circle cx="14.5" cy="17.5" r="2.5" {...s}/></>,
    utensils:     <><line x1="3" y1="2" x2="3" y2="22" {...s}/><path d="M7 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" {...s}/><path d="M21 2v22" {...s}/><path d="M21 7H7" {...s}/></>,
    minus:        <><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    info:         <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    bed:          <><path d="M2 4v16" {...s}/><path d="M2 8h18a2 2 0 0 1 2 2v10" {...s}/><path d="M2 17h20" {...s}/><path d="M6 8v9" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    filter:       <><line x1="4" y1="6" x2="20" y2="6" {...s}/><line x1="8" y1="12" x2="16" y2="12" {...s}/><line x1="11" y1="18" x2="13" y2="18" {...s}/></>,
    percent:      <><line x1="19" y1="5" x2="5" y2="19" {...s}/><circle cx="6.5" cy="6.5" r="2.5" {...s}/><circle cx="17.5" cy="17.5" r="2.5" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, display: "block" }}>
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

// ─── Star Rating ─────────────────────────────────────────────
function Stars({ rating, size = 13 }) {
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Icon key={i} name={i <= Math.round(rating) ? "star" : "starEmpty"}
          size={size} color={T.gold}/>
      ))}
    </div>
  );
}

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — HOTELS LIST
// Replace with: supabase.from('hotels')
//   .select('*,rooms(*),reviews(count)')
//   .eq('city', searchCity)
//   .gte('available_rooms', guestCount)
//   .order('trust_score', { ascending: false })
// ============================================================
const MOCK_HOTELS = [
  {
    id:"HTL-001",
    name:"Zanzibar Pearl Hotel",
    location:"Stone Town, Zanzibar",
    stars:5, rating:4.9, reviewCount:842,
    pricePerNight:185000, originalPrice:220000,
    trustScore:98, verified:true,
    color:"#0D9488",
    amenities:["wifi","pool","breakfast","parking","ac","spa"],
    description:"A luxurious beachfront hotel in the heart of Stone Town. Experience the magic of Zanzibar with world-class service and stunning ocean views from every room.",
    checkIn:"14:00", checkOut:"11:00",
    freeCancellation:true,
    distance:"0.3 km from beach",
    badge:"Most Popular",
    rooms:[
      { id:"R1", type:"Deluxe Ocean View",  price:185000, guests:2, beds:"1 King Bed",     available:3,  size:"45 m²" },
      { id:"R2", type:"Premium Suite",      price:320000, guests:3, beds:"1 King + Sofa",  available:1,  size:"75 m²" },
      { id:"R3", type:"Standard Room",      price:120000, guests:2, beds:"2 Twin Beds",    available:5,  size:"32 m²" },
      { id:"R4", type:"Presidential Suite", price:580000, guests:4, beds:"2 King Beds",    available:1,  size:"120 m²" },
    ],
  },
  {
    id:"HTL-002",
    name:"Serengeti Lodge & Spa",
    location:"Arusha, Tanzania",
    stars:4, rating:4.7, reviewCount:521,
    pricePerNight:95000, originalPrice:null,
    trustScore:94, verified:true,
    color:"#0A7B4B",
    amenities:["wifi","breakfast","parking","ac","pool","safari"],
    description:"Your perfect base for Serengeti safari adventures. Nestled in lush gardens with breathtaking views of Mount Kilimanjaro.",
    checkIn:"12:00", checkOut:"10:00",
    freeCancellation:true,
    distance:"2.1 km from city center",
    badge:"Best Value",
    rooms:[
      { id:"R1", type:"Safari Room",        price:95000,  guests:2, beds:"1 Queen Bed",    available:4,  size:"38 m²" },
      { id:"R2", type:"Garden Suite",       price:165000, guests:3, beds:"1 King + Sofa",  available:2,  size:"58 m²" },
      { id:"R3", type:"Family Chalet",      price:220000, guests:5, beds:"3 Single Beds",  available:1,  size:"82 m²" },
    ],
  },
  {
    id:"HTL-003",
    name:"Dar Business Tower",
    location:"CBD, Dar es Salaam",
    stars:4, rating:4.6, reviewCount:1205,
    pricePerNight:75000, originalPrice:90000,
    trustScore:96, verified:true,
    color:"#1D4ED8",
    amenities:["wifi","breakfast","parking","ac","gym","conference"],
    description:"Modern business hotel in the heart of Dar es Salaam. Perfect for corporate travelers with state-of-the-art conference facilities.",
    checkIn:"15:00", checkOut:"12:00",
    freeCancellation:false,
    distance:"0.5 km from harbor",
    badge:"Business Pick",
    rooms:[
      { id:"R1", type:"Business Room",      price:75000,  guests:1, beds:"1 Queen Bed",    available:8,  size:"30 m²" },
      { id:"R2", type:"Executive Suite",    price:145000, guests:2, beds:"1 King Bed",     available:3,  size:"55 m²" },
      { id:"R3", type:"Penthouse",          price:350000, guests:4, beds:"2 King Beds",    available:1,  size:"95 m²" },
    ],
  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — REVIEWS
// Replace with: supabase.from('hotel_reviews')
//   .select('*,user(*)').eq('hotel_id', hotelId)
//   .order('created_at', { ascending: false }).limit(5)
// ============================================================
const MOCK_REVIEWS = [
  { id:1, name:"Hassan K",  initials:"HK", color:"#1D4ED8", rating:5, time:"3 days ago",  text:"Absolutely stunning hotel! The ocean view from our room was breathtaking. Staff were incredibly helpful and friendly." },
  { id:2, name:"Amina T",   initials:"AT", color:"#6D28D9", rating:5, time:"1 week ago",   text:"Perfect for our honeymoon! Everything was beyond expectations. The breakfast was amazing — highly recommend!" },
  { id:3, name:"John M",    initials:"JM", color:"#0A7B4B", rating:4, time:"2 weeks ago",  text:"Great location and beautiful rooms. Only minor issue was slow WiFi, but everything else was excellent." },
];

const AMENITY_MAP = {
  wifi:       { icon:"wifi",     label:"Free WiFi",       color:T.blue   },
  pool:       { icon:"droplet",  label:"Swimming Pool",   color:T.teal   },
  breakfast:  { icon:"coffee",   label:"Breakfast",       color:T.amber  },
  parking:    { icon:"car",      label:"Free Parking",    color:T.navy   },
  ac:         { icon:"wind",     label:"Air Conditioning",color:T.purple },
  spa:        { icon:"sparkle",  label:"Spa & Wellness",  color:T.gold   },
  safari:     { icon:"sun",      label:"Safari Tours",    color:T.green  },
  gym:        { icon:"zap",      label:"Fitness Center",  color:T.red    },
  conference: { icon:"users",    label:"Conference Room", color:T.navy   },
  restaurant: { icon:"utensils", label:"Restaurant",      color:T.orange },
};

// ============================================================
// 🧱 MAIN COMPONENT — HotelReservations
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user from supabase.auth.getUser()
  currentUser   = { id:"user-001", name:"BAK", initials:"B" },

  // 🧭 NAVIGATE
  onBack        = () => {},   // → previous screen
  onChatHotel   = () => {},   // → Brick 6 Marketplace Chat
  onConfirmation= () => {},   // → Booking confirmation screen
  // 💰 WALLET
  onWalletPay   = () => {},   // → PandaWallet.initiateEscrow()
}) {
  const [view,          setView]        = useState("list");    // list | detail | booking | success
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom,  setSelectedRoom]  = useState(null);
  const [wishlist,      setWishlist]    = useState({});
  const [checkIn,       setCheckIn]     = useState("2026-07-15");
  const [checkOut,      setCheckOut]    = useState("2026-07-18");
  const [guests,        setGuests]      = useState(2);
  const [searchCity,    setSearchCity]  = useState("Zanzibar");
  const [filterOpen,    setFilterOpen]  = useState(false);
  const [activeFilter,  setActiveFilter]= useState("All");
  const [toast,         setToast]       = useState(null);
  const [expandReviews, setExpandReviews] = useState(false);
  const [bookingRef]                    = useState(() => `BKG-${Math.floor(100000 + Math.random()*900000)}`);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const nights = Math.max(1, Math.ceil(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
  ));

  const totalCost = selectedRoom
    ? selectedRoom.price * nights : 0;

  const FILTERS = ["All","Beach","Safari","Business","Budget","Luxury"];

  // ── SUCCESS SCREEN ────────────────────────────────────────────
  if (view === "success") return (
    <div style={{
      background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto",
      display:"flex", alignItems:"center",
      justifyContent:"center", padding:24,
    }}>
      <style>{`
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>
      <div style={{ width:"100%", textAlign:"center" }}>
        <div style={{ width:100, height:100, borderRadius:"50%",
          background:`linear-gradient(135deg,${T.gold}22,${T.gold}44)`,
          border:`3px solid ${T.gold}55`,
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 24px", fontSize:"48px",
          animation:"bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
          🏨
        </div>
        <div style={{ fontSize:24, fontWeight:900, color:T.textMain,
          marginBottom:8, letterSpacing:-0.5 }}>Booking Confirmed!</div>
        <div style={{ fontSize:13, color:T.textMute, lineHeight:1.7,
          marginBottom:8 }}>
          Your stay at <strong style={{ color:T.textMain }}>{selectedHotel?.name}</strong> has been reserved and payment held in Panda Escrow.
        </div>
        <div style={{ display:"inline-block", background:T.navyLight,
          borderRadius:10, padding:"7px 18px",
          fontSize:14, fontWeight:900, color:T.navy,
          fontFamily:"monospace", letterSpacing:1, marginBottom:28 }}>
          {bookingRef}
        </div>

        {/* Booking summary card */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          border:`1px solid ${T.border}`, boxShadow:T.shadow, marginBottom:20,
          textAlign:"left" }}>
          {[
            { label:"Hotel",     value:selectedHotel?.name                  },
            { label:"Room",      value:selectedRoom?.type                   },
            { label:"Check-in",  value:new Date(checkIn).toDateString()     },
            { label:"Check-out", value:new Date(checkOut).toDateString()    },
            { label:"Guests",    value:`${guests} guest${guests>1?"s":""}`  },
            { label:"Nights",    value:`${nights} night${nights>1?"s":""}`  },
            { label:"Total",     value:fmt(totalCost)                       },
          ].map(item => (
            <div key={item.label} style={{ display:"flex",
              justifyContent:"space-between", padding:"8px 0",
              borderBottom:`1px solid ${T.border}` }}>
              <span style={{ fontSize:12, color:T.textMute }}>{item.label}</span>
              <span style={{ fontSize:12, fontWeight:800, color:T.textMain,
                fontFamily:item.label==="Total"?"monospace":"inherit" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => setView("list")} style={{
            flex:1, padding:"14px 0", borderRadius:16,
            background:T.navyLight, border:`1px solid ${T.border}`,
            fontSize:13, fontWeight:800, color:T.textMid,
          }}>Browse More</button>
          <button onClick={onConfirmation} style={{
            flex:1, padding:"14px 0", borderRadius:16,
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            border:"none", color:"#fff", fontSize:13, fontWeight:900,
            boxShadow:`0 6px 20px ${T.gold}44`,
          }}>View Booking</button>
        </div>
      </div>
    </div>
  );

  // ── BOOKING SCREEN ────────────────────────────────────────────
  if (view === "booking") return (
    <div style={{
      background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input  { font-family:inherit; }
      `}</style>

      {/* Top bar */}
      <div style={{
        background:"rgba(255,255,255,0.96)", backdropFilter:"blur(16px)",
        padding:"14px 20px", position:"sticky", top:0, zIndex:100,
        borderBottom:`1px solid ${T.border}`,
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <button onClick={() => setView("detail")} style={{
          width:40, height:40, borderRadius:12, background:T.navyLight,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Icon name="arrowLeft" size={18} color={T.navy}/>
        </button>
        <div style={{ fontSize:15, fontWeight:800, color:T.textMain }}>
          Confirm Booking
        </div>
        <div style={{ width:40 }}/>
      </div>

      <div style={{ padding:"16px 20px 0" }}>
        {/* Hotel + Room Summary */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", gap:14, alignItems:"center",
            marginBottom:14 }}>
            <div style={{ width:64, height:64, borderRadius:18,
              background:`linear-gradient(135deg,${selectedHotel.color}18,${selectedHotel.color}33)`,
              border:`1px solid ${selectedHotel.color}22`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"28px", flexShrink:0 }}>🏨</div>
            <div>
              <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
                marginBottom:3 }}>{selectedHotel.name}</div>
              <div style={{ fontSize:12, color:T.textMute, marginBottom:4 }}>
                {selectedRoom?.type}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <Stars rating={selectedHotel.rating} size={11}/>
                <span style={{ fontSize:11, color:T.textMute }}>
                  ({selectedHotel.reviewCount})
                </span>
              </div>
            </div>
          </div>

          {/* Booking details */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
            gap:10, marginBottom:14 }}>
            {[
              { label:"Check-in",  value:new Date(checkIn).toDateString(),  icon:"calendar", color:T.blue  },
              { label:"Check-out", value:new Date(checkOut).toDateString(), icon:"calendar", color:T.red   },
              { label:"Guests",    value:`${guests} guest${guests>1?"s":""}`, icon:"users",  color:T.green },
              { label:"Nights",    value:`${nights} night${nights>1?"s":""}`, icon:"bed",   color:T.gold  },
            ].map(item => (
              <div key={item.label} style={{ background:T.bg, borderRadius:14,
                padding:"12px 14px", border:`1px solid ${T.border}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:6,
                  marginBottom:4 }}>
                  <Icon name={item.icon} size={13} color={item.color}/>
                  <span style={{ fontSize:10, color:T.textMute, fontWeight:700,
                    textTransform:"uppercase", letterSpacing:0.5 }}>
                    {item.label}
                  </span>
                </div>
                <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Room amenities */}
          <div style={{ background:T.navyLight, borderRadius:14, padding:"12px 14px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.textMute,
              textTransform:"uppercase", letterSpacing:0.6, marginBottom:8 }}>
              Room Details
            </div>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              {[
                { label:selectedRoom?.beds,  icon:"bed"   },
                { label:selectedRoom?.size,  icon:"home"  },
                { label:`Max ${selectedRoom?.guests} guests`, icon:"users" },
              ].map(item => (
                <div key={item.label} style={{ display:"flex", gap:5,
                  alignItems:"center" }}>
                  <Icon name={item.icon} size={13} color={T.textMid}/>
                  <span style={{ fontSize:12, fontWeight:700,
                    color:T.textMid }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price breakdown */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
            marginBottom:14 }}>Price Breakdown</div>
          {[
            [`${fmt(selectedRoom?.price)} × ${nights} night${nights>1?"s":""}`, fmt(totalCost)],
            ["Taxes & Fees (included)", "Included"],
            ["Panda Escrow Fee",        "FREE"],
          ].map(([l,v]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between",
              padding:"8px 0", borderBottom:`1px solid ${T.border}` }}>
              <span style={{ fontSize:13, color:T.textMute }}>{l}</span>
              <span style={{ fontSize:13, fontWeight:800,
                color:v==="FREE"||v==="Included" ? T.green : T.textMain,
                fontFamily:"monospace" }}>{v}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between",
            padding:"12px 0" }}>
            <span style={{ fontSize:16, fontWeight:900, color:T.textMain }}>Total</span>
            <span style={{ fontSize:18, fontWeight:900, color:T.navy,
              fontFamily:"monospace" }}>{fmt(totalCost)}</span>
          </div>
          {selectedHotel.freeCancellation && (
            <div style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
              borderRadius:12, padding:"10px 14px",
              display:"flex", gap:8, alignItems:"center" }}>
              <Icon name="check" size={14} color={T.green}/>
              <span style={{ fontSize:12, fontWeight:700, color:T.green }}>
                Free cancellation before check-in
              </span>
            </div>
          )}
        </div>

        {/* Escrow protection */}
        <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
          borderRadius:20, padding:"18px 20px", marginBottom:20,
          display:"flex", gap:14, alignItems:"center" }}>
          <Icon name="shield" size={28} color={T.gold}/>
          <div>
            <div style={{ fontSize:14, fontWeight:900, color:"#fff", marginBottom:3 }}>
              Panda Escrow Protected
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)",
              lineHeight:1.5 }}>
              Payment held securely until check-in confirmed. Full refund if hotel cancels.
            </div>
          </div>
        </div>
      </div>

      {/* Pay button */}
      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:430,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)",
        borderTop:`1px solid ${T.border}`,
        padding:"14px 20px 28px",
        boxShadow:"0 -4px 24px rgba(11,31,75,0.1)",
        zIndex:150,
      }}>
        <button onClick={() => {
          // 💰 WALLET — connect to PandaWallet.initiateEscrow()
          // 🔐 SECURITY — payment processing in Supabase Edge Function
          // 🔌 BACKEND — supabase.from('hotel_bookings').insert({
          //   hotel_id: selectedHotel.id, room_id: selectedRoom.id,
          //   buyer_id: currentUser.id, check_in: checkIn,
          //   check_out: checkOut, guests, total: totalCost,
          //   status: 'confirmed', booking_ref: bookingRef
          // })
          setView("success");
          onWalletPay({ total:totalCost, hotelId:selectedHotel.id });
        }} style={{
          width:"100%", padding:"16px 0", borderRadius:18,
          background:`linear-gradient(135deg,${T.gold},#A07008)`,
          border:"none", color:"#fff", fontSize:15, fontWeight:900,
          cursor:"pointer", display:"flex", alignItems:"center",
          justifyContent:"center", gap:8,
          boxShadow:`0 6px 20px ${T.gold}44`,
        }}>
          <Icon name="lock" size={17} color="#fff"/>
          Pay {fmt(totalCost)} via Panda Wallet
        </button>
      </div>
    </div>
  );

  // ── HOTEL DETAIL SCREEN ───────────────────────────────────────
  if (view === "detail" && selectedHotel) return (
    <div style={{
      background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

      {toast && (
        <div style={{ position:"fixed", bottom:110, left:"50%",
          transform:"translateX(-50%)", zIndex:9999, background:T.white,
          border:`1px solid ${toast.color}33`, borderLeft:`4px solid ${toast.color}`,
          borderRadius:14, padding:"12px 20px", boxShadow:T.shadowLg,
          whiteSpace:"nowrap", animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex", alignItems:"center", gap:10 }}>
          <Icon name="check" size={14} color={toast.color}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>{toast.msg}</span>
        </div>
      )}

      {/* Top bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0,
        zIndex:100, padding:"14px 20px",
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <button onClick={() => setView("list")} style={{
          width:40, height:40, borderRadius:12,
          background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)",
          border:`1px solid rgba(255,255,255,0.5)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:T.shadow,
        }}>
          <Icon name="arrowLeft" size={18} color={T.navy}/>
        </button>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => setWishlist(w => ({...w,[selectedHotel.id]:!w[selectedHotel.id]}))}
            style={{ width:40, height:40, borderRadius:12,
              background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)",
              border:`1px solid rgba(255,255,255,0.5)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:T.shadow }}>
            <Icon name={wishlist[selectedHotel.id] ? "heartFill" : "heart"}
              size={18} color={wishlist[selectedHotel.id] ? T.red : T.navy}/>
          </button>
          <button style={{ width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)",
            border:`1px solid rgba(255,255,255,0.5)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:T.shadow }}>
            <Icon name="share" size={18} color={T.navy}/>
          </button>
        </div>
      </div>

      {/* Cover image */}
      <div style={{ height:260, position:"relative", overflow:"hidden",
        background:`linear-gradient(135deg,${selectedHotel.color}22,${selectedHotel.color}44)`,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ position:"absolute", inset:0, opacity:0.06,
          backgroundImage:"radial-gradient(circle,#000 1px,transparent 1px)",
          backgroundSize:"20px 20px" }}/>
        <div style={{ fontSize:"80px", opacity:0.4 }}>🏨</div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:100,
          background:`linear-gradient(to bottom,transparent,${T.bg})` }}/>
        {/* Star category */}
        <div style={{ position:"absolute", top:60, left:20,
          display:"flex", gap:2 }}>
          {Array(selectedHotel.stars).fill(0).map((_,i) => (
            <Icon key={i} name="star" size={14} color={T.gold}/>
          ))}
        </div>
        {selectedHotel.badge && (
          <div style={{ position:"absolute", bottom:20, left:20,
            background:T.gold, borderRadius:10, padding:"5px 12px" }}>
            <span style={{ fontSize:11, fontWeight:900, color:"#fff" }}>
              {selectedHotel.badge}
            </span>
          </div>
        )}
      </div>

      <div style={{ padding:"0 20px" }}>

        {/* Hotel info */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}`,
          marginTop:-24, position:"relative" }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"flex-start", marginBottom:10 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:20, fontWeight:900, color:T.textMain,
                letterSpacing:-0.4, marginBottom:4 }}>{selectedHotel.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:6,
                marginBottom:8 }}>
                <Icon name="mapPin" size={13} color={T.textMute}/>
                <span style={{ fontSize:12, color:T.textMute }}>
                  {selectedHotel.location}
                </span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Stars rating={selectedHotel.rating}/>
                <span style={{ fontSize:13, fontWeight:800, color:T.textMid }}>
                  {selectedHotel.rating}
                </span>
                <span style={{ fontSize:12, color:T.textMute }}>
                  ({selectedHotel.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
            </div>
            {/* Trust score */}
            <div style={{ width:52, height:52, borderRadius:"50%", flexShrink:0,
              background:`conic-gradient(${T.green} ${selectedHotel.trustScore*3.6}deg, ${T.border} 0deg)`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:44, height:44, borderRadius:"50%",
                background:T.white, display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:12, fontWeight:900,
                  color:T.green, lineHeight:1 }}>{selectedHotel.trustScore}</span>
                <span style={{ fontSize:8, color:T.textMute }}>Trust</span>
              </div>
            </div>
          </div>

          {/* Key info */}
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {[
              { icon:"calendar", text:`Check-in ${selectedHotel.checkIn}`,   color:T.blue  },
              { icon:"calendar", text:`Check-out ${selectedHotel.checkOut}`,  color:T.red   },
              { icon:"mapPin",   text:selectedHotel.distance,                 color:T.green },
            ].map(item => (
              <div key={item.text} style={{ display:"flex", alignItems:"center", gap:5,
                background:T.navyLight, borderRadius:10, padding:"5px 10px" }}>
                <Icon name={item.icon} size={12} color={item.color}/>
                <span style={{ fontSize:11, fontWeight:700,
                  color:T.textMid }}>{item.text}</span>
              </div>
            ))}
            {selectedHotel.freeCancellation && (
              <div style={{ display:"flex", alignItems:"center", gap:5,
                background:T.greenBg, borderRadius:10, padding:"5px 10px",
                border:`1px solid ${T.green}22` }}>
                <Icon name="check" size={12} color={T.green}/>
                <span style={{ fontSize:11, fontWeight:800,
                  color:T.green }}>Free Cancellation</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
            marginBottom:10 }}>About This Hotel</div>
          <div style={{ fontSize:13, color:T.textMid, lineHeight:1.8 }}>
            {selectedHotel.description}
          </div>
        </div>

        {/* Amenities */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
            marginBottom:14 }}>Amenities</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {selectedHotel.amenities.map(key => {
              const a = AMENITY_MAP[key];
              if (!a) return null;
              return (
                <div key={key} style={{ display:"flex", gap:10, alignItems:"center",
                  padding:"10px 12px", background:T.bg, borderRadius:14,
                  border:`1px solid ${T.border}` }}>
                  <div style={{ width:32, height:32, borderRadius:9,
                    background:a.color+"14",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name={a.icon} size={15} color={a.color}/>
                  </div>
                  <span style={{ fontSize:12, fontWeight:700,
                    color:T.textMid }}>{a.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Rooms */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
            marginBottom:14 }}>Available Rooms</div>
          {selectedHotel.rooms.map((room, i) => (
            <div key={room.id} onClick={() => setSelectedRoom(room)}
              style={{
                borderRadius:18, padding:"16px",
                marginBottom:i < selectedHotel.rooms.length-1 ? 10 : 0,
                border:`2px solid ${selectedRoom?.id===room.id ? T.navy : T.border}`,
                background:selectedRoom?.id===room.id ? T.navyLight : T.bg,
                cursor:"pointer", transition:"all 0.18s",
              }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"flex-start", marginBottom:8 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:900, color:T.textMain,
                    marginBottom:4 }}>{room.type}</div>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    {[
                      { icon:"bed",   text:room.beds   },
                      { icon:"users", text:`${room.guests} guests` },
                      { icon:"home",  text:room.size   },
                    ].map(item => (
                      <div key={item.text} style={{ display:"flex", gap:4,
                        alignItems:"center" }}>
                        <Icon name={item.icon} size={11} color={T.textMute}/>
                        <span style={{ fontSize:11, color:T.textMute }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:16, fontWeight:900, color:T.navy,
                    fontFamily:"monospace" }}>{fmt(room.price)}</div>
                  <div style={{ fontSize:10, color:T.textMute }}>per night</div>
                  <div style={{ fontSize:10, color:T.green, fontWeight:700,
                    marginTop:3 }}>{room.available} left</div>
                </div>
              </div>
              {selectedRoom?.id === room.id && (
                <div style={{ display:"flex", alignItems:"center", gap:6,
                  background:T.navy, borderRadius:8, padding:"5px 12px",
                  width:"fit-content" }}>
                  <Icon name="check" size={12} color="#fff"/>
                  <span style={{ fontSize:11, fontWeight:800,
                    color:"#fff" }}>Selected</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:14, fontWeight:900, color:T.textMain }}>
              Guest Reviews
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Icon name="star" size={14} color={T.gold}/>
              <span style={{ fontSize:14, fontWeight:900, color:T.navy }}>
                {selectedHotel.rating}
              </span>
              <span style={{ fontSize:12, color:T.textMute }}>
                ({selectedHotel.reviewCount.toLocaleString()})
              </span>
            </div>
          </div>
          {/* 🔌 BACKEND — replace with real reviews */}
          {MOCK_REVIEWS.slice(0, expandReviews ? MOCK_REVIEWS.length : 2).map(r => (
            <div key={r.id} style={{ marginBottom:14,
              paddingBottom:14, borderBottom:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", gap:10, alignItems:"center",
                marginBottom:8 }}>
                <div style={{ width:38, height:38, borderRadius:11,
                  background:`linear-gradient(135deg,${r.color}22,${r.color}44)`,
                  border:`1.5px solid ${r.color}33`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:13, fontWeight:900, color:r.color }}>
                  {r.initials}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:13, fontWeight:800,
                      color:T.textMain }}>{r.name}</span>
                    <span style={{ fontSize:11, color:T.textMute }}>{r.time}</span>
                  </div>
                  <Stars rating={r.rating} size={11}/>
                </div>
              </div>
              <div style={{ fontSize:13, color:T.textMid, lineHeight:1.7,
                background:T.bg, borderRadius:12, padding:"10px 14px",
                borderLeft:`3px solid ${r.color}33` }}>
                {r.text}
              </div>
            </div>
          ))}
          <button onClick={() => setExpandReviews(e => !e)} style={{
            width:"100%", padding:"10px 0", borderRadius:12,
            background:T.navyLight, border:`1px solid ${T.border}`,
            fontSize:12, fontWeight:800, color:T.navy,
            display:"flex", alignItems:"center",
            justifyContent:"center", gap:6,
          }}>
            <Icon name={expandReviews ? "chevronUp" : "chevronDown"} size={14} color={T.navy}/>
            {expandReviews ? "Show Less" : `See All ${selectedHotel.reviewCount} Reviews`}
          </button>
        </div>

      </div>

      {/* Sticky Book button */}
      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:430,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)",
        borderTop:`1px solid ${T.border}`,
        padding:"14px 20px 28px",
        boxShadow:"0 -4px 24px rgba(11,31,75,0.1)",
        zIndex:150,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:900, color:T.navy,
              fontFamily:"monospace" }}>
              {fmt(selectedRoom ? selectedRoom.price : selectedHotel.pricePerNight)}
            </div>
            <div style={{ fontSize:11, color:T.textMute }}>per night · {nights} nights</div>
          </div>
          {selectedRoom && (
            <div style={{ fontSize:14, fontWeight:900, color:T.green,
              fontFamily:"monospace" }}>
              Total: {fmt(totalCost)}
            </div>
          )}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => onChatHotel(selectedHotel.id)} style={{
            width:50, height:50, borderRadius:16, flexShrink:0,
            background:T.navyLight, border:`1px solid ${T.border}`,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            {/* 🧭 NAVIGATE → Brick 6 Marketplace Chat */}
            <Icon name="message" size={20} color={T.navy}/>
          </button>
          <button onClick={() => {
            if (!selectedRoom) {
              showToast("Please select a room first!", T.amber);
              return;
            }
            setView("booking");
          }} style={{
            flex:1, height:50, borderRadius:16,
            background: selectedRoom
              ? `linear-gradient(135deg,${T.gold},#A07008)`
              : T.navyLight,
            border: selectedRoom ? "none" : `1px solid ${T.border}`,
            color: selectedRoom ? "#fff" : T.textMute,
            fontSize:14, fontWeight:900, cursor:"pointer",
            display:"flex", alignItems:"center",
            justifyContent:"center", gap:8, transition:"all 0.2s",
            boxShadow: selectedRoom ? `0 6px 20px ${T.gold}44` : "none",
          }}>
            <Icon name="zap" size={17} color={selectedRoom ? "#fff" : T.textMute}/>
            {selectedRoom ? "Book Now" : "Select a Room"}
          </button>
        </div>
      </div>

      <BottomNav active="discover"/>
    </div>
  );

  // ── HOTEL LIST SCREEN ─────────────────────────────────────────
  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input  { font-family:inherit; }
        input::placeholder { color:${T.textMute}; }
      `}</style>

      {toast && (
        <div style={{ position:"fixed", bottom:110, left:"50%",
          transform:"translateX(-50%)", zIndex:9999, background:T.white,
          border:`1px solid ${toast.color}33`, borderLeft:`4px solid ${toast.color}`,
          borderRadius:14, padding:"12px 20px", boxShadow:T.shadowLg,
          whiteSpace:"nowrap", animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex", alignItems:"center", gap:10 }}>
          <Icon name="check" size={14} color={toast.color}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>{toast.msg}</span>
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{
        background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:"52px 20px 24px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, opacity:0.05,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"20px 20px" }}/>
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
          <div style={{ fontSize:18, fontWeight:900, color:"#fff",
            letterSpacing:-0.3 }}>Hotel Reservations</div>
          <div style={{ width:40 }}/>
        </div>

        {/* Search bar */}
        <div style={{ background:"rgba(255,255,255,0.12)",
          backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)",
          borderRadius:16, padding:"12px 16px", marginBottom:14,
          display:"flex", alignItems:"center", gap:10, position:"relative" }}>
          <Icon name="search" size={16} color="rgba(255,255,255,0.7)"/>
          <input value={searchCity} onChange={e => setSearchCity(e.target.value)}
            placeholder="Where are you going?"
            style={{ flex:1, background:"transparent", border:"none",
              outline:"none", fontSize:14, color:"#fff",
              fontWeight:600 }}/>
        </div>

        {/* Date + Guests row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8,
          position:"relative" }}>
          <div style={{ background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            borderRadius:14, padding:"10px 12px" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)",
              fontWeight:700, textTransform:"uppercase",
              letterSpacing:0.6, marginBottom:3 }}>CHECK-IN</div>
            <input type="date" value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              style={{ background:"transparent", border:"none",
                outline:"none", fontSize:11, color:"#fff",
                fontWeight:800, width:"100%" }}/>
          </div>
          <div style={{ background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            borderRadius:14, padding:"10px 12px" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)",
              fontWeight:700, textTransform:"uppercase",
              letterSpacing:0.6, marginBottom:3 }}>CHECK-OUT</div>
            <input type="date" value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
              style={{ background:"transparent", border:"none",
                outline:"none", fontSize:11, color:"#fff",
                fontWeight:800, width:"100%" }}/>
          </div>
          <div style={{ background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            borderRadius:14, padding:"10px 12px" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)",
              fontWeight:700, textTransform:"uppercase",
              letterSpacing:0.6, marginBottom:3 }}>GUESTS</div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <button onClick={() => setGuests(g => Math.max(1,g-1))} style={{
                width:20, height:20, borderRadius:"50%",
                background:"rgba(255,255,255,0.2)", border:"none",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <Icon name="minus" size={10} color="#fff"/>
              </button>
              <span style={{ fontSize:14, fontWeight:900, color:"#fff",
                minWidth:14, textAlign:"center" }}>{guests}</span>
              <button onClick={() => setGuests(g => Math.min(10,g+1))} style={{
                width:20, height:20, borderRadius:"50%",
                background:"rgba(255,255,255,0.2)", border:"none",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <Icon name="plus" size={10} color="#fff"/>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* Results + Filter row */}
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:14 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:900, color:T.textMain,
              letterSpacing:-0.3 }}>
              {MOCK_HOTELS.length} Hotels Found
            </div>
            <div style={{ fontSize:12, color:T.textMute, marginTop:2 }}>
              {searchCity} · {nights} night{nights>1?"s":""} · {guests} guest{guests>1?"s":""}
            </div>
          </div>
          <button onClick={() => setFilterOpen(f => !f)} style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"9px 14px", borderRadius:12,
            background:T.card, border:`1px solid ${T.border}`,
            fontSize:12, fontWeight:700, color:T.navy,
            boxShadow:T.shadow,
          }}>
            <Icon name="filter" size={14} color={T.navy}/>
            Filter
          </button>
        </div>

        {/* Filter pills */}
        <div style={{ display:"flex", gap:8, overflowX:"auto",
          marginBottom:16, paddingBottom:2 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding:"7px 16px", borderRadius:99, flexShrink:0,
              background: activeFilter===f ? T.navy : T.card,
              border: activeFilter===f ? "none" : `1px solid ${T.border}`,
              color: activeFilter===f ? "#fff" : T.textMid,
              fontSize:12, fontWeight:700,
              boxShadow: activeFilter===f ? `0 4px 12px ${T.navy}33` : T.shadow,
            }}>{f}</button>
          ))}
        </div>

        {/* Hotel cards */}
        {MOCK_HOTELS.map((hotel, i) => {
          const discount = hotel.originalPrice
            ? Math.round(((hotel.originalPrice - hotel.pricePerNight) / hotel.originalPrice) * 100) : null;
          return (
            <div key={hotel.id}
              style={{ background:T.card, borderRadius:24, marginBottom:16,
                border:`1px solid ${T.border}`, overflow:"hidden",
                boxShadow:T.shadow, cursor:"pointer",
                animation:`fadeUp 0.25s ease ${i*0.08}s both`,
                transition:"all 0.22s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=T.shadowMd; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=T.shadow; }}
              onClick={() => { setSelectedHotel(hotel); setSelectedRoom(null); setView("detail"); }}>

              {/* Image area */}
              <div style={{ height:160, position:"relative",
                background:`linear-gradient(135deg,${hotel.color}18,${hotel.color}33)`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:"60px", opacity:0.35 }}>🏨</div>
                {/* Star rating */}
                <div style={{ position:"absolute", top:12, left:12,
                  display:"flex", gap:2 }}>
                  {Array(hotel.stars).fill(0).map((_,i) => (
                    <Icon key={i} name="star" size={13} color={T.gold}/>
                  ))}
                </div>
                {/* Discount */}
                {discount && (
                  <div style={{ position:"absolute", top:12, right:44,
                    background:T.red, borderRadius:8, padding:"3px 8px",
                    fontSize:11, fontWeight:900, color:"#fff" }}>
                    -{discount}%
                  </div>
                )}
                {/* Wishlist */}
                <button onClick={e => {
                  e.stopPropagation();
                  setWishlist(w => ({...w,[hotel.id]:!w[hotel.id]}));
                  showToast(wishlist[hotel.id] ? "Removed from saved" : "Saved to wishlist!", T.gold);
                }} style={{ position:"absolute", top:8, right:8,
                  width:34, height:34, borderRadius:"50%",
                  background:"rgba(255,255,255,0.9)", border:"none",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={wishlist[hotel.id] ? "heartFill" : "heart"}
                    size={15} color={wishlist[hotel.id] ? T.red : T.textMute}/>
                </button>
                {/* Badge */}
                {hotel.badge && (
                  <div style={{ position:"absolute", bottom:12, left:12,
                    background:T.gold, borderRadius:8, padding:"3px 10px" }}>
                    <span style={{ fontSize:10, fontWeight:900, color:"#fff" }}>
                      {hotel.badge}
                    </span>
                  </div>
                )}
                {/* Free cancellation */}
                {hotel.freeCancellation && (
                  <div style={{ position:"absolute", bottom:12, right:12,
                    background:T.green, borderRadius:8, padding:"3px 10px",
                    display:"flex", alignItems:"center", gap:4 }}>
                    <Icon name="check" size={10} color="#fff"/>
                    <span style={{ fontSize:10, fontWeight:800, color:"#fff" }}>
                      Free Cancel
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding:"14px 16px 16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"flex-start", marginBottom:6 }}>
                  <div style={{ flex:1, marginRight:10 }}>
                    <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
                      marginBottom:4 }}>{hotel.name}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <Icon name="mapPin" size={12} color={T.textMute}/>
                      <span style={{ fontSize:11, color:T.textMute }}>
                        {hotel.location}
                      </span>
                    </div>
                  </div>
                  {/* Trust score */}
                  <div style={{ display:"flex", alignItems:"center", gap:3,
                    background:T.greenBg, border:`1px solid ${T.green}22`,
                    borderRadius:8, padding:"3px 8px", flexShrink:0 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%",
                      background:T.green }}/>
                    <span style={{ fontSize:10, fontWeight:900,
                      color:T.green }}>{hotel.trustScore}</span>
                  </div>
                </div>

                {/* Rating + amenities */}
                <div style={{ display:"flex", alignItems:"center",
                  gap:8, marginBottom:12 }}>
                  <Stars rating={hotel.rating} size={12}/>
                  <span style={{ fontSize:12, fontWeight:800,
                    color:T.textMid }}>{hotel.rating}</span>
                  <span style={{ fontSize:11, color:T.textMute }}>
                    ({hotel.reviewCount.toLocaleString()})
                  </span>
                  <span style={{ fontSize:11, color:T.textMute }}>·</span>
                  <span style={{ fontSize:11, color:T.textMute }}>
                    {hotel.distance}
                  </span>
                </div>

                {/* Amenity icons */}
                <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                  {hotel.amenities.slice(0,5).map(key => {
                    const a = AMENITY_MAP[key];
                    if (!a) return null;
                    return (
                      <div key={key} style={{ width:28, height:28, borderRadius:8,
                        background:a.color+"14",
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name={a.icon} size={13} color={a.color}/>
                      </div>
                    );
                  })}
                  {hotel.amenities.length > 5 && (
                    <div style={{ width:28, height:28, borderRadius:8,
                      background:T.navyLight,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:10, fontWeight:900, color:T.textMid }}>
                      +{hotel.amenities.length - 5}
                    </div>
                  )}
                </div>

                {/* Price + Book */}
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                      <span style={{ fontSize:20, fontWeight:900, color:T.navy,
                        fontFamily:"monospace", letterSpacing:-0.5 }}>
                        {fmt(hotel.pricePerNight)}
                      </span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      {hotel.originalPrice && (
                        <span style={{ fontSize:12, color:T.textMute,
                          textDecoration:"line-through", fontFamily:"monospace" }}>
                          {fmt(hotel.originalPrice)}
                        </span>
                      )}
                      <span style={{ fontSize:11, color:T.textMute }}>/ night</span>
                    </div>
                  </div>
                  <div style={{ padding:"10px 20px", borderRadius:14,
                    background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
                    fontSize:13, fontWeight:900, color:"#fff",
                    boxShadow:`0 4px 14px ${T.navy}33` }}>
                    View Rooms
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      <BottomNav active="discover"/>
    </div>
  );
}

import { useState } from "react";

// ============================================================
// 🧱 BRICK 10B — HOTEL OWNER DASHBOARD
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export HotelOwnerDashboard from this file
//     Props: { hotelId, currentUser, onBack, onNavigate }
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
    bell:         <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...s}/><path d="M13.73 21a2 2 0 0 1-3.46 0" {...s}/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    calendar:     <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" {...s}/><line x1="16" y1="2" x2="16" y2="6" {...s}/><line x1="8" y1="2" x2="8" y2="6" {...s}/><line x1="3" y1="10" x2="21" y2="10" {...s}/></>,
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    bed:          <><path d="M2 4v16" {...s}/><path d="M2 8h18a2 2 0 0 1 2 2v10" {...s}/><path d="M2 17h20" {...s}/><path d="M6 8v9" {...s}/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    starEmpty:    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke={color} strokeWidth="1.4"/>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    trending:     <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    arrowUp:      <><line x1="12" y1="19" x2="12" y2="5" {...s}/><polyline points="5 12 12 5 19 12" {...s}/></>,
    arrowDown:    <><line x1="12" y1="5" x2="12" y2="19" {...s}/><polyline points="19 12 12 19 5 12" {...s}/></>,
    mapPin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    phone:        <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" {...s}/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    settings:     <><circle cx="12" cy="12" r="3" {...s}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
    eyeOff:       <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" {...s}/><line x1="1" y1="1" x2="23" y2="23" {...s}/></>,
    toggle:       <><rect x="1" y="5" width="22" height="14" rx="7" ry="7" {...s}/><circle cx="16" cy="12" r="3" fill={color} stroke="none"/></>,
    toggleOff:    <><rect x="1" y="5" width="22" height="14" rx="7" ry="7" {...s}/><circle cx="8" cy="12" r="3" fill={color} stroke="none"/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    edit:         <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...s}/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    minus:        <><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2"/></>,
    percent:      <><line x1="19" y1="5" x2="5" y2="19" {...s}/><circle cx="6.5" cy="6.5" r="2.5" {...s}/><circle cx="17.5" cy="17.5" r="2.5" {...s}/></>,
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

// ─── Stars ────────────────────────────────────────────────────
function Stars({ rating, size = 12 }) {
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
// 🔌 BACKEND SWAP POINT #1 — HOTEL & OWNER DATA
// Replace with: supabase.from('hotels')
//   .select('*').eq('owner_id', currentUser.id).single()
// 💰 WALLET: const wallet = await supabase
//   .from('wallets').select('*').eq('user_id', currentUser.id).single()
// ============================================================
const MOCK_HOTEL = {
  id:         "HTL-001",
  name:       "Zanzibar Pearl Hotel",
  location:   "Stone Town, Zanzibar",
  initials:   "ZP",
  color:      "#0D9488",
  stars:      5,
  rating:     4.9,
  trustScore: 98,
  verified:   true,
  isOpen:     true,
  wallet: {
    balance:    12450000,
    pending:    1850000,
    today:      925000,
    thisMonth:  18400000,
  },
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — BOOKINGS
// Replace with: supabase.from('hotel_bookings')
//   .select('*,guest(*)')
//   .eq('hotel_id', hotelId)
//   .in('status', ['pending','confirmed','checked_in','checked_out'])
//   .order('check_in', { ascending: true })
// Real-time: supabase.channel('hotel_bookings')
//   .on('postgres_changes', { event: 'INSERT',
//        schema: 'public', table: 'hotel_bookings',
//        filter: `hotel_id=eq.${hotelId}` },
//     payload => { showNewBookingAlert(payload.new) })
//   .subscribe()
// ============================================================
const MOCK_BOOKINGS = [
  {
    id:"BKG-882134", ref:"BKG-882134",
    guestName:"Hassan Kimaro", guestInitials:"HK", guestColor:"#1D4ED8",
    guestPhone:"+255 712 345 678", guests:2,
    room:"Deluxe Ocean View", roomId:"R1",
    checkIn:"2026-07-15", checkOut:"2026-07-18",
    nights:3, total:555000,
    status:"pending", isNew:true,
    bookedAt:"5 mins ago",
    specialRequest:"Late check-in around 10 PM please",
  },
  {
    id:"BKG-881209", ref:"BKG-881209",
    guestName:"Amina Tanzani", guestInitials:"AT", guestColor:"#6D28D9",
    guestPhone:"+255 756 789 012", guests:2,
    room:"Premium Suite", roomId:"R2",
    checkIn:"2026-07-16", checkOut:"2026-07-19",
    nights:3, total:960000,
    status:"confirmed", isNew:false,
    bookedAt:"2 hours ago",
    specialRequest:"Honeymoon couple — need flower decoration please",
  },
  {
    id:"BKG-880445", ref:"BKG-880445",
    guestName:"Peter Mwangi", guestInitials:"PM", guestColor:"#0A7B4B",
    guestPhone:"+255 783 456 789", guests:1,
    room:"Standard Room", roomId:"R3",
    checkIn:"2026-07-14", checkOut:"2026-07-16",
    nights:2, total:240000,
    status:"checked_in", isNew:false,
    bookedAt:"Yesterday",
    specialRequest:"",
  },
  {
    id:"BKG-879012", ref:"BKG-879012",
    guestName:"Zawadi Salum", guestInitials:"ZS", guestColor:"#C9960A",
    guestPhone:"+255 744 123 456", guests:4,
    room:"Presidential Suite", roomId:"R4",
    checkIn:"2026-07-10", checkOut:"2026-07-13",
    nights:3, total:1740000,
    status:"checked_out", isNew:false,
    bookedAt:"5 days ago",
    specialRequest:"",
  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #3 — ROOMS
// Replace with: supabase.from('hotel_rooms')
//   .select('*').eq('hotel_id', hotelId).order('price')
// ============================================================
const MOCK_ROOMS = [
  { id:"R1", type:"Deluxe Ocean View",   price:185000, available:true,  total:4, booked:1, size:"45 m²" },
  { id:"R2", type:"Premium Suite",       price:320000, available:true,  total:2, booked:1, size:"75 m²" },
  { id:"R3", type:"Standard Room",       price:120000, available:false, total:6, booked:3, size:"32 m²" },
  { id:"R4", type:"Presidential Suite",  price:580000, available:true,  total:1, booked:0, size:"120 m²"},
];

// ============================================================
// 🔌 BACKEND SWAP POINT #4 — GUEST REVIEWS
// Replace with: supabase.from('hotel_reviews')
//   .select('*,guest(*)').eq('hotel_id', hotelId)
//   .order('created_at', { ascending: false }).limit(10)
// ============================================================
const MOCK_REVIEWS = [
  { id:1, name:"Hassan K",  initials:"HK", color:"#1D4ED8", rating:5, time:"3 days ago",  room:"Deluxe Ocean View", text:"Absolutely stunning! The ocean view was breathtaking. Staff were incredibly helpful.", replied:false },
  { id:2, name:"Amina T",   initials:"AT", color:"#6D28D9", rating:5, time:"1 week ago",   room:"Premium Suite",    text:"Perfect for our honeymoon! Everything was beyond expectations. The breakfast was amazing.", replied:true, reply:"Thank you so much Amina! It was our pleasure to host you. Congratulations on your honeymoon!" },
  { id:3, name:"John M",    initials:"JM", color:"#0A7B4B", rating:4, time:"2 weeks ago",  room:"Standard Room",    text:"Great location and beautiful rooms. Only minor issue was slow WiFi but everything else was excellent.", replied:false },
];

const STATUS_CONFIG = {
  pending:     { label:"New Booking",  color:T.red,    bg:T.redBg,    icon:"bell",     next:"confirmed",   nextLabel:"Confirm Booking" },
  confirmed:   { label:"Confirmed",    color:T.blue,   bg:T.blueBg,   icon:"check",    next:"checked_in",  nextLabel:"Check In Guest"  },
  checked_in:  { label:"Checked In",   color:T.green,  bg:T.greenBg,  icon:"home",     next:"checked_out", nextLabel:"Check Out Guest" },
  checked_out: { label:"Checked Out",  color:T.textMute, bg:T.navyLight, icon:"award", next:null,          nextLabel:null              },
  cancelled:   { label:"Cancelled",    color:T.red,    bg:T.redBg,    icon:"x",        next:null,          nextLabel:null              },
};

// ============================================================
// 🧱 MAIN COMPONENT — HotelOwnerDashboard
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user from supabase.auth.getUser()
  currentUser     = { id:"owner-001", name:"Mama Fatuma" },
  hotel           = MOCK_HOTEL,
  initialBookings = MOCK_BOOKINGS,
  rooms           = MOCK_ROOMS,
  reviews         = MOCK_REVIEWS,

  // 🧭 NAVIGATE
  onBack          = () => {},   // → previous screen
  onChatGuest     = () => {},   // → Brick 6 Marketplace Chat
  onCallGuest     = () => {},   // → phone dialer
  onViewAnalytics = () => {},   // → Brick 5 Seller Command Center
  onSettings      = () => {},   // → Hotel settings screen
  // 💰 WALLET
  onWithdraw      = () => {},   // → PandaWallet.withdraw()
}) {
  const [activeTab,       setActiveTab]       = useState("bookings");
  const [bookings,        setBookings]        = useState(initialBookings);
  const [roomsList,       setRoomsList]       = useState(rooms);
  const [isOpen,          setIsOpen]          = useState(hotel.isOpen);
  const [showBalance,     setShowBalance]     = useState(true);
  const [expandBooking,   setExpandBooking]   = useState("BKG-882134");
  const [newBookingAlert, setNewBookingAlert] = useState(true);
  const [replyText,       setReplyText]       = useState({});
  const [replyOpen,       setReplyOpen]       = useState(null);
  const [toast,           setToast]           = useState(null);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  // 🔌 BACKEND — update booking status
  // supabase.from('hotel_bookings').update({ status: nextStatus })
  //   .eq('id', bookingId)
  // 💰 WALLET — on confirm: hold escrow. on check_out: release escrow
  const updateBookingStatus = (bookingId, nextStatus) => {
    setBookings(bs => bs.map(b =>
      b.id === bookingId ? { ...b, status:nextStatus, isNew:false } : b
    ));
    const msgs = {
      confirmed:   "Booking confirmed! Guest has been notified.",
      checked_in:  "Guest checked in successfully!",
      checked_out: "Guest checked out. Escrow payment released!",
    };
    showToast(msgs[nextStatus] || "Booking updated!", T.green);
  };

  const rejectBooking = (bookingId) => {
    // 🔌 BACKEND — supabase.from('hotel_bookings').update({ status: 'cancelled' }).eq('id', bookingId)
    // 💰 WALLET — PandaWallet.refundEscrow(bookingId) — full refund to guest
    setBookings(bs => bs.map(b =>
      b.id === bookingId ? { ...b, status:"cancelled", isNew:false } : b
    ));
    showToast("Booking declined. Guest will be fully refunded.", T.red);
  };

  const toggleRoom = (roomId) => {
    // 🔌 BACKEND — supabase.from('hotel_rooms')
    //   .update({ available: !current }).eq('id', roomId)
    setRoomsList(rs => rs.map(r =>
      r.id === roomId ? { ...r, available:!r.available } : r
    ));
  };

  const submitReply = (reviewId) => {
    // 🔌 BACKEND — supabase.from('hotel_review_replies').insert({
    //   review_id: reviewId, hotel_id: hotel.id,
    //   reply: replyText[reviewId], created_at: new Date()
    // })
    setReplyOpen(null);
    showToast("Reply posted successfully!", T.green);
  };

  const newBookings     = bookings.filter(b => b.isNew);
  const activeBookings  = bookings.filter(b => ["pending","confirmed","checked_in"].includes(b.status));
  const pastBookings    = bookings.filter(b => ["checked_out","cancelled"].includes(b.status));
  const occupancyRate   = Math.round((roomsList.reduce((s,r) => s + r.booked, 0) / roomsList.reduce((s,r) => s + r.total, 0)) * 100);

  const TABS = [
    { id:"bookings",  label:"Bookings",  icon:"calendar", badge:activeBookings.length },
    { id:"rooms",     label:"Rooms",     icon:"bed",      badge:null                  },
    { id:"reviews",   label:"Reviews",   icon:"star",     badge:null                  },
    { id:"analytics", label:"Analytics", icon:"barChart", badge:null                  },
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
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes ring     { 0%{transform:rotate(0)} 15%{transform:rotate(15deg)} 30%{transform:rotate(-10deg)} 45%{transform:rotate(8deg)} 60%{transform:rotate(-5deg)} 75%{transform:rotate(3deg)} 100%{transform:rotate(0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input,textarea { font-family:inherit; }
        textarea::placeholder { color:${T.textMute}; }
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

      {/* ── NEW BOOKING ALERT ── */}
      {newBookingAlert && newBookings.length > 0 && (
        <div style={{
          position:"fixed", top:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:430, zIndex:500,
          background:T.teal, padding:"14px 20px",
          display:"flex", gap:12, alignItems:"center",
          animation:"slideIn 0.3s ease",
        }}>
          <div style={{ animation:"ring 0.8s infinite" }}>
            <Icon name="bell" size={22} color="#fff"/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:900, color:"#fff" }}>
              New Booking! {newBookings[0].guestName}
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.8)" }}>
              {newBookings[0].room} · {newBookings[0].nights} nights · {fmt(newBookings[0].total)}
            </div>
          </div>
          <button onClick={() => { setNewBookingAlert(false); setActiveTab("bookings"); }} style={{
            padding:"7px 14px", borderRadius:10,
            background:"rgba(255,255,255,0.2)",
            border:"1px solid rgba(255,255,255,0.3)",
            fontSize:12, fontWeight:800, color:"#fff",
          }}>View</button>
          <button onClick={() => setNewBookingAlert(false)} style={{
            width:28, height:28, borderRadius:"50%",
            background:"rgba(255,255,255,0.15)", border:"none",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <Icon name="x" size={14} color="#fff"/>
          </button>
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{
        background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:`${newBookingAlert && newBookings.length > 0 ? "68px" : "52px"} 20px 24px`,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, opacity:0.05,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"20px 20px" }}/>

        {/* Top row */}
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:20, position:"relative" }}>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ width:46, height:46, borderRadius:14,
              background:`linear-gradient(135deg,${hotel.color}44,${hotel.color}88)`,
              border:"2px solid rgba(255,255,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, fontWeight:900, color:"#fff" }}>
              {hotel.initials}
            </div>
            <div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
                fontWeight:600, marginBottom:2 }}>Hotel Dashboard</div>
              <div style={{ fontSize:16, fontWeight:900, color:"#fff",
                letterSpacing:-0.3 }}>{hotel.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                {Array(hotel.stars).fill(0).map((_,i) => (
                  <Icon key={i} name="star" size={10} color={T.goldMid}/>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {/* Open/Close toggle */}
            <button onClick={() => {
              setIsOpen(o => !o);
              // 🔌 BACKEND — supabase.from('hotels').update({ is_open: !isOpen }).eq('id', hotel.id)
              showToast(isOpen ? "Hotel marked as closed" : "Hotel is now accepting bookings!", isOpen ? T.red : T.green);
            }} style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"7px 12px", borderRadius:10,
              background: isOpen ? "rgba(10,123,75,0.3)" : "rgba(192,57,43,0.3)",
              border:`1px solid ${isOpen ? "rgba(10,123,75,0.5)" : "rgba(192,57,43,0.5)"}`,
            }}>
              <div style={{ width:7, height:7, borderRadius:"50%",
                background:isOpen ? "#4ADE80" : T.red,
                animation:isOpen ? "pulse 2s infinite" : "none" }}/>
              <span style={{ fontSize:11, fontWeight:800,
                color:isOpen ? "#4ADE80" : "#FCA5A5" }}>
                {isOpen ? "Open" : "Closed"}
              </span>
            </button>
            <button onClick={onSettings} style={{ width:38, height:38, borderRadius:11,
              background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="settings" size={17} color="#fff"/>
            </button>
          </div>
        </div>

        {/* 💰 WALLET CARD */}
        <div style={{
          background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,0.15)",
          borderRadius:20, padding:"16px 20px",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:4 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Icon name="wallet" size={13} color="rgba(255,255,255,0.7)"/>
              <span style={{ fontSize:11, fontWeight:700,
                color:"rgba(255,255,255,0.7)" }}>Panda Wallet Balance</span>
            </div>
            <button onClick={() => setShowBalance(s => !s)} style={{
              background:"none", border:"none",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name={showBalance ? "eye" : "eyeOff"} size={15}
                color="rgba(255,255,255,0.6)"/>
            </button>
          </div>
          <div style={{ fontSize:28, fontWeight:900, color:"#fff",
            fontFamily:"monospace", letterSpacing:-1, marginBottom:12 }}>
            {/* 💰 WALLET — swap with PandaWallet.getBalance() */}
            {showBalance ? fmt(hotel.wallet.balance) : "TSh ••••••••"}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
            gap:8, marginBottom:14 }}>
            {[
              { label:"TODAY",      value:fmt(hotel.wallet.today),     color:T.goldMid                 },
              { label:"THIS MONTH", value:fmt(hotel.wallet.thisMonth), color:"rgba(255,255,255,0.9)"  },
              { label:"PENDING",    value:fmt(hotel.wallet.pending),   color:"rgba(255,255,255,0.65)" },
            ].map(item => (
              <div key={item.label} style={{ background:"rgba(255,255,255,0.08)",
                borderRadius:10, padding:"8px 10px" }}>
                <div style={{ fontSize:8, color:"rgba(255,255,255,0.5)",
                  fontWeight:700, marginBottom:3 }}>{item.label}</div>
                <div style={{ fontSize:11, fontWeight:900,
                  color:item.color, fontFamily:"monospace" }}>{item.value}</div>
              </div>
            ))}
          </div>
          <button onClick={onWithdraw} style={{
            width:"100%", padding:"11px 0", borderRadius:14,
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            border:"none", color:"#fff", fontSize:13, fontWeight:900,
            cursor:"pointer", display:"flex", alignItems:"center",
            justifyContent:"center", gap:7,
            boxShadow:`0 4px 16px ${T.gold}44`,
          }}>
            <Icon name="wallet" size={15} color="#fff"/>
            {/* 💰 WALLET — connect to PandaWallet.withdraw() */}
            Withdraw Earnings
          </button>
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── QUICK STATS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          gap:10, marginBottom:16 }}>
          {[
            { label:"Bookings",   value:activeBookings.length, icon:"calendar",  color:T.blue  },
            { label:"Occupancy",  value:occupancyRate+"%",     icon:"percent",   color:T.teal  },
            { label:"Rating",     value:hotel.rating,          icon:"star",      color:T.gold  },
            { label:"Trust",      value:hotel.trustScore,      icon:"shield",    color:T.green },
          ].map(stat => (
            <div key={stat.label} style={{ background:T.card, borderRadius:18,
              padding:"14px 8px", textAlign:"center",
              border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
              <div style={{ width:30, height:30, borderRadius:9,
                background:stat.color+"14",
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 7px" }}>
                <Icon name={stat.icon} size={14} color={stat.color}/>
              </div>
              <div style={{ fontSize:14, fontWeight:900, color:T.navy,
                fontFamily:"monospace", marginBottom:2 }}>{stat.value}</div>
              <div style={{ fontSize:9, color:T.textMute, fontWeight:700,
                textTransform:"uppercase", letterSpacing:0.4 }}>{stat.label}</div>
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
              fontSize:11, fontWeight:activeTab===t.id ? 800 : 500,
              background:activeTab===t.id ? T.navy : "transparent",
              color:activeTab===t.id ? "#fff" : T.textMute,
              transition:"all 0.2s", position:"relative",
              display:"flex", flexDirection:"column",
              alignItems:"center", gap:4,
              boxShadow:activeTab===t.id ? `0 4px 12px ${T.navy}33` : "none",
            }}>
              <Icon name={t.icon} size={14} color={activeTab===t.id ? "#fff" : T.textMute}/>
              {t.label}
              {t.badge > 0 && (
                <div style={{ position:"absolute", top:4, right:4,
                  minWidth:16, height:16, borderRadius:99,
                  background:T.red, display:"flex", alignItems:"center",
                  justifyContent:"center", padding:"0 4px" }}>
                  <span style={{ fontSize:9, fontWeight:900, color:"#fff" }}>{t.badge}</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ══ BOOKINGS TAB ══ */}
        {activeTab === "bookings" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {bookings.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 0" }}>
                <div style={{ fontSize:"48px", marginBottom:12 }}>🏨</div>
                <div style={{ fontSize:16, fontWeight:800, color:T.textMain,
                  marginBottom:8 }}>No bookings yet</div>
                <div style={{ fontSize:13, color:T.textMute }}>
                  New bookings will appear here in real-time
                </div>
              </div>
            ) : bookings.map(booking => {
              const sc         = STATUS_CONFIG[booking.status];
              const isExpanded = expandBooking === booking.id;
              return (
                <div key={booking.id} style={{
                  background:T.card, borderRadius:22, marginBottom:14,
                  border:`1.5px solid ${booking.isNew ? T.teal+"66" : T.border}`,
                  boxShadow:booking.isNew ? `0 0 0 3px ${T.teal}18` : T.shadow,
                  overflow:"hidden",
                  animation:booking.isNew ? "bounceIn 0.4s ease" : "fadeUp 0.25s ease",
                }}>
                  {/* Booking header */}
                  <div onClick={() => setExpandBooking(isExpanded ? null : booking.id)}
                    style={{ padding:"16px 18px", cursor:"pointer",
                      display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ position:"relative" }}>
                      <div style={{ width:46, height:46, borderRadius:14, flexShrink:0,
                        background:`linear-gradient(135deg,${booking.guestColor}22,${booking.guestColor}44)`,
                        border:`2px solid ${booking.guestColor}33`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:15, fontWeight:900, color:booking.guestColor }}>
                        {booking.guestInitials}
                      </div>
                      {booking.isNew && (
                        <div style={{ position:"absolute", top:-4, right:-4,
                          width:14, height:14, borderRadius:"50%",
                          background:T.teal, border:`2px solid ${T.white}`,
                          animation:"pulse 1.5s infinite" }}/>
                      )}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", justifyContent:"space-between",
                        alignItems:"center", marginBottom:4 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                          <span style={{ fontSize:14, fontWeight:800,
                            color:T.textMain }}>{booking.guestName}</span>
                          {booking.isNew && (
                            <div style={{ background:T.teal, borderRadius:7,
                              padding:"1px 7px", fontSize:9,
                              fontWeight:900, color:"#fff" }}>NEW</div>
                          )}
                        </div>
                        <span style={{ fontSize:11, color:T.textMute }}>
                          {booking.bookedAt}
                        </span>
                      </div>
                      <div style={{ fontSize:12, color:T.textMute,
                        marginBottom:5 }}>{booking.room}</div>
                      <div style={{ display:"flex", justifyContent:"space-between",
                        alignItems:"center" }}>
                        <div style={{ display:"inline-flex", alignItems:"center",
                          gap:4, background:sc.bg,
                          borderRadius:8, padding:"3px 8px" }}>
                          <Icon name={sc.icon} size={10} color={sc.color}/>
                          <span style={{ fontSize:10, fontWeight:800,
                            color:sc.color }}>{sc.label}</span>
                        </div>
                        <span style={{ fontSize:14, fontWeight:900, color:T.navy,
                          fontFamily:"monospace" }}>{fmt(booking.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div style={{ borderTop:`1px solid ${T.border}`,
                      animation:"fadeUp 0.2s ease" }}>

                      {/* Stay details */}
                      <div style={{ padding:"14px 18px",
                        borderBottom:`1px solid ${T.border}` }}>
                        <div style={{ display:"grid",
                          gridTemplateColumns:"1fr 1fr", gap:10 }}>
                          {[
                            { icon:"calendar", label:"Check-in",  value:new Date(booking.checkIn).toDateString(),  color:T.blue  },
                            { icon:"calendar", label:"Check-out", value:new Date(booking.checkOut).toDateString(), color:T.red   },
                            { icon:"bed",      label:"Room",      value:booking.room,                               color:T.teal  },
                            { icon:"users",    label:"Guests",    value:`${booking.guests} guest${booking.guests>1?"s":""}`, color:T.green },
                          ].map(item => (
                            <div key={item.label} style={{ background:T.bg,
                              borderRadius:12, padding:"10px 12px",
                              border:`1px solid ${T.border}` }}>
                              <div style={{ display:"flex", alignItems:"center",
                                gap:5, marginBottom:3 }}>
                                <Icon name={item.icon} size={12} color={item.color}/>
                                <span style={{ fontSize:9, color:T.textMute,
                                  fontWeight:700, textTransform:"uppercase",
                                  letterSpacing:0.5 }}>{item.label}</span>
                              </div>
                              <div style={{ fontSize:12, fontWeight:800,
                                color:T.textMain }}>{item.value}</div>
                            </div>
                          ))}
                        </div>

                        {/* Nights + total */}
                        <div style={{ display:"flex", justifyContent:"space-between",
                          alignItems:"center", marginTop:10,
                          padding:"10px 14px", background:T.navyLight,
                          borderRadius:12 }}>
                          <span style={{ fontSize:13, color:T.textMid,
                            fontWeight:700 }}>{booking.nights} nights</span>
                          <span style={{ fontSize:15, fontWeight:900, color:T.navy,
                            fontFamily:"monospace" }}>{fmt(booking.total)}</span>
                        </div>

                        {/* Special request */}
                        {booking.specialRequest && (
                          <div style={{ background:T.amberBg,
                            border:`1px solid ${T.amber}22`,
                            borderRadius:12, padding:"10px 14px", marginTop:10,
                            display:"flex", gap:8, alignItems:"flex-start" }}>
                            <Icon name="bell" size={14} color={T.amber}/>
                            <div>
                              <div style={{ fontSize:10, fontWeight:800,
                                color:T.amber, marginBottom:3,
                                textTransform:"uppercase", letterSpacing:0.5 }}>
                                Special Request
                              </div>
                              <div style={{ fontSize:12, color:T.amber,
                                lineHeight:1.5 }}>{booking.specialRequest}</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Escrow notice */}
                      <div style={{ padding:"12px 18px",
                        borderBottom:`1px solid ${T.border}`,
                        display:"flex", gap:10, alignItems:"center" }}>
                        <Icon name="shield" size={16} color={T.gold}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12, fontWeight:800,
                            color:T.textMain }}>Panda Escrow Protected</div>
                          <div style={{ fontSize:11, color:T.textMute }}>
                            {fmt(booking.total)} held safely until check-out confirmed
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ padding:"14px 18px",
                        display:"flex", gap:8, flexWrap:"wrap" }}>
                        {/* Contact guest */}
                        <button onClick={() => onChatGuest(booking.id)} style={{
                          width:42, height:42, borderRadius:12,
                          background:T.navyLight, border:`1px solid ${T.border}`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                        }}>
                          {/* 🧭 NAVIGATE → Brick 6 Chat */}
                          <Icon name="message" size={17} color={T.navy}/>
                        </button>
                        <button onClick={() => onCallGuest(booking.guestPhone)} style={{
                          width:42, height:42, borderRadius:12,
                          background:T.greenBg, border:`1px solid ${T.green}22`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                        }}>
                          <Icon name="phone" size={17} color={T.green}/>
                        </button>

                        {/* Status actions */}
                        {booking.status === "pending" && (
                          <>
                            <button onClick={() => rejectBooking(booking.id)} style={{
                              flex:1, height:42, borderRadius:12,
                              background:T.redBg, border:`1px solid ${T.red}22`,
                              fontSize:12, fontWeight:800, color:T.red,
                              display:"flex", alignItems:"center",
                              justifyContent:"center", gap:6,
                            }}>
                              <Icon name="x" size={14} color={T.red}/>
                              Decline
                            </button>
                            <button onClick={() => updateBookingStatus(booking.id, "confirmed")}
                              style={{ flex:2, height:42, borderRadius:12,
                                background:`linear-gradient(135deg,${T.teal},#0A6B60)`,
                                border:"none", fontSize:12, fontWeight:900,
                                color:"#fff", display:"flex", alignItems:"center",
                                justifyContent:"center", gap:6,
                                boxShadow:`0 4px 14px ${T.teal}44` }}>
                              <Icon name="check" size={14} color="#fff"/>
                              Confirm Booking
                            </button>
                          </>
                        )}
                        {sc.next && booking.status !== "pending" && (
                          <button onClick={() => updateBookingStatus(booking.id, sc.next)}
                            style={{ flex:1, height:42, borderRadius:12,
                              background:`linear-gradient(135deg,${sc.color},${sc.color}CC)`,
                              border:"none", fontSize:12, fontWeight:900,
                              color:"#fff", display:"flex", alignItems:"center",
                              justifyContent:"center", gap:6,
                              boxShadow:`0 4px 14px ${sc.color}44` }}>
                            <Icon name={sc.icon} size={14} color="#fff"/>
                            {sc.nextLabel}
                          </button>
                        )}
                        {booking.status === "checked_out" && (
                          <div style={{ flex:1, height:42, borderRadius:12,
                            background:T.greenBg, border:`1px solid ${T.green}22`,
                            display:"flex", alignItems:"center",
                            justifyContent:"center", gap:6 }}>
                            <Icon name="check" size={14} color={T.green}/>
                            <span style={{ fontSize:12, fontWeight:800,
                              color:T.green }}>Completed · Paid</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ══ ROOMS TAB ══ */}
        {activeTab === "rooms" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ fontSize:13, color:T.textMute, marginBottom:16,
              fontWeight:600 }}>
              Toggle rooms on/off · Update prices · Manage availability
            </div>
            {roomsList.map((room, i) => {
              const occupancy = Math.round((room.booked / room.total) * 100);
              return (
                <div key={room.id} style={{ background:T.card, borderRadius:20,
                  padding:"16px 18px", marginBottom:12,
                  border:`1.5px solid ${room.available ? T.border : T.red+"33"}`,
                  boxShadow:T.shadow, opacity:room.available ? 1 : 0.8 }}>
                  <div style={{ display:"flex", gap:14, alignItems:"center",
                    marginBottom:12 }}>
                    <div style={{ width:48, height:48, borderRadius:14,
                      background:T.tealBg, border:`1px solid ${T.teal}22`,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon name="bed" size={22} color={T.teal}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
                        marginBottom:3 }}>{room.type}</div>
                      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                        <span style={{ fontSize:11, color:T.textMute }}>{room.size}</span>
                        <span style={{ fontSize:11, color:T.textMute }}>·</span>
                        <span style={{ fontSize:12, fontWeight:900, color:T.navy,
                          fontFamily:"monospace" }}>{fmt(room.price)}/night</span>
                      </div>
                    </div>
                    {/* Toggle */}
                    <button onClick={() => toggleRoom(room.id)} style={{
                      background:"none", border:"none", flexShrink:0,
                    }}>
                      <Icon name={room.available ? "toggle" : "toggleOff"} size={32}
                        color={room.available ? T.green : T.textMute}/>
                    </button>
                  </div>

                  {/* Occupancy bar */}
                  <div style={{ marginBottom:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      marginBottom:5 }}>
                      <span style={{ fontSize:11, fontWeight:700,
                        color:T.textMute }}>Occupancy</span>
                      <span style={{ fontSize:11, fontWeight:800,
                        color:occupancy > 75 ? T.green : occupancy > 40 ? T.amber : T.textMute }}>
                        {room.booked}/{room.total} rooms · {occupancy}%
                      </span>
                    </div>
                    <div style={{ height:6, background:T.border, borderRadius:99,
                      overflow:"hidden" }}>
                      <div style={{ height:"100%",
                        width:`${occupancy}%`,
                        background:occupancy > 75
                          ? `linear-gradient(90deg,${T.green},${T.teal})`
                          : `linear-gradient(90deg,${T.amber},${T.gold})`,
                        borderRadius:99, transition:"width 0.6s ease" }}/>
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%",
                      background:room.available ? T.green : T.red }}/>
                    <span style={{ fontSize:12, fontWeight:700,
                      color:room.available ? T.green : T.red }}>
                      {room.available ? "Available for booking" : "Not accepting bookings"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ REVIEWS TAB ══ */}
        {activeTab === "reviews" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {/* Rating summary */}
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", gap:20, alignItems:"center" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:52, fontWeight:900, color:T.navy,
                    lineHeight:1, fontFamily:"monospace" }}>{hotel.rating}</div>
                  <Stars rating={hotel.rating} size={16}/>
                  <div style={{ fontSize:11, color:T.textMute, marginTop:6 }}>
                    Overall Rating
                  </div>
                </div>
                <div style={{ flex:1 }}>
                  {[{s:5,pct:88},{s:4,pct:8},{s:3,pct:3},{s:2,pct:1},{s:1,pct:0}].map(r => (
                    <div key={r.s} style={{ display:"flex", alignItems:"center",
                      gap:7, marginBottom:6 }}>
                      <span style={{ fontSize:11, fontWeight:700,
                        color:T.textMute, width:8 }}>{r.s}</span>
                      <Icon name="star" size={11} color={T.gold}/>
                      <div style={{ flex:1, background:T.border, borderRadius:99,
                        height:6, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${r.pct}%`,
                          background:`linear-gradient(90deg,${T.gold},${T.goldMid})`,
                          borderRadius:99 }}/>
                      </div>
                      <span style={{ fontSize:10, color:T.textMute,
                        width:26, fontWeight:700 }}>{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Review cards */}
            {reviews.map(review => (
              <div key={review.id} style={{ background:T.card, borderRadius:22,
                padding:"18px 20px", marginBottom:14,
                border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
                {/* Guest info */}
                <div style={{ display:"flex", gap:12, alignItems:"center",
                  marginBottom:12 }}>
                  <div style={{ width:42, height:42, borderRadius:12,
                    background:`linear-gradient(135deg,${review.color}22,${review.color}44)`,
                    border:`2px solid ${review.color}33`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:14, fontWeight:900, color:review.color }}>
                    {review.initials}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontSize:13, fontWeight:800,
                        color:T.textMain }}>{review.name}</span>
                      <span style={{ fontSize:11, color:T.textMute }}>{review.time}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <Stars rating={review.rating} size={11}/>
                      <span style={{ fontSize:10, color:T.textMute }}>
                        · {review.room}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review text */}
                <div style={{ fontSize:13, color:T.textMid, lineHeight:1.75,
                  background:T.bg, borderRadius:14, padding:"11px 14px",
                  borderLeft:`3px solid ${review.color}33`, marginBottom:12 }}>
                  {review.text}
                </div>

                {/* Owner reply */}
                {review.replied && review.reply && (
                  <div style={{ background:T.navyLight, border:`1px solid ${T.navy}14`,
                    borderRadius:14, padding:"12px 14px", marginBottom:12 }}>
                    <div style={{ fontSize:10, fontWeight:800, color:T.navy,
                      textTransform:"uppercase", letterSpacing:0.5, marginBottom:5 }}>
                      Your Reply
                    </div>
                    <div style={{ fontSize:12, color:T.textMid,
                      lineHeight:1.6 }}>{review.reply}</div>
                  </div>
                )}

                {/* Reply input */}
                {!review.replied && (
                  replyOpen === review.id ? (
                    <div>
                      <textarea
                        value={replyText[review.id] || ""}
                        onChange={e => setReplyText(t => ({...t,[review.id]:e.target.value}))}
                        placeholder="Write a reply to this review..."
                        rows={3} style={{ width:"100%", background:T.navyLight,
                          border:`1.5px solid ${T.border}`, borderRadius:14,
                          padding:"12px 14px", color:T.textMain,
                          fontSize:12, outline:"none", resize:"none",
                          boxSizing:"border-box", marginBottom:10 }}/>
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={() => setReplyOpen(null)} style={{
                          flex:1, padding:"10px 0", borderRadius:12,
                          background:T.navyLight, border:`1px solid ${T.border}`,
                          fontSize:12, fontWeight:800, color:T.textMid,
                        }}>Cancel</button>
                        <button onClick={() => submitReply(review.id)} style={{
                          flex:2, padding:"10px 0", borderRadius:12,
                          background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
                          border:"none", fontSize:12, fontWeight:900,
                          color:"#fff",
                        }}>Post Reply</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setReplyOpen(review.id)} style={{
                      display:"flex", alignItems:"center", gap:6,
                      background:T.navyLight, border:`1px solid ${T.border}`,
                      borderRadius:10, padding:"8px 14px",
                      fontSize:12, fontWeight:700, color:T.navy,
                    }}>
                      <Icon name="message" size={13} color={T.navy}/>
                      Reply to Review
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        )}

        {/* ══ ANALYTICS TAB ══ */}
        {activeTab === "analytics" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {/* Revenue cards */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
              gap:12, marginBottom:16 }}>
              {[
                { label:"Today",      value:fmt(hotel.wallet.today),     growth:12.5, color:T.green  },
                { label:"This Month", value:fmt(hotel.wallet.thisMonth), growth:18.2, color:T.blue   },
                { label:"Occupancy",  value:occupancyRate+"%",           growth:5.3,  color:T.teal   },
                { label:"Avg Rating", value:hotel.rating+"/5",           growth:0.1,  color:T.gold   },
              ].map(item => (
                <div key={item.label} style={{ background:T.card, borderRadius:20,
                  padding:"16px", border:`1px solid ${T.border}`,
                  boxShadow:T.shadow }}>
                  <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
                    textTransform:"uppercase", letterSpacing:0.6, marginBottom:8 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize:18, fontWeight:900, color:T.navy,
                    fontFamily:"monospace", marginBottom:6 }}>{item.value}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ width:18, height:18, borderRadius:6,
                      background:T.greenBg,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon name="arrowUp" size={10} color={T.green}/>
                    </div>
                    <span style={{ fontSize:11, fontWeight:800,
                      color:T.green }}>+{item.growth}%</span>
                    <span style={{ fontSize:10, color:T.textMute }}>vs last month</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue chart */}
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
                marginBottom:16 }}>Revenue This Week</div>
              {/* 🔌 BACKEND — replace with real data from analytics table */}
              <div style={{ display:"flex", alignItems:"flex-end",
                gap:8, height:100 }}>
                {[
                  { day:"Mon", val:680000  },
                  { day:"Tue", val:925000  },
                  { day:"Wed", val:740000  },
                  { day:"Thu", val:1100000 },
                  { day:"Fri", val:925000  },
                  { day:"Sat", val:1480000 },
                  { day:"Sun", val:925000  },
                ].map((d,i) => {
                  const max    = 1480000;
                  const h      = Math.round((d.val/max) * 80);
                  const isToday = i === 6;
                  return (
                    <div key={d.day} style={{ flex:1,
                      display:"flex", flexDirection:"column",
                      alignItems:"center", gap:6 }}>
                      <div style={{ width:"100%", height:h,
                        borderRadius:"6px 6px 0 0",
                        background:isToday
                          ? `linear-gradient(180deg,${T.gold},#A07008)`
                          : `linear-gradient(180deg,${T.teal}88,${T.teal}44)`,
                        boxShadow:isToday ? `0 4px 12px ${T.gold}44` : "none" }}/>
                      <span style={{ fontSize:9, fontWeight:isToday?900:600,
                        color:isToday?T.gold:T.textMute }}>{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Booking breakdown */}
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
                marginBottom:14 }}>Booking Summary</div>
              {[
                { label:"Pending",    value:bookings.filter(b=>b.status==="pending").length,    color:T.red    },
                { label:"Confirmed",  value:bookings.filter(b=>b.status==="confirmed").length,  color:T.blue   },
                { label:"Checked In", value:bookings.filter(b=>b.status==="checked_in").length, color:T.green  },
                { label:"Completed",  value:bookings.filter(b=>b.status==="checked_out").length,color:T.teal   },
              ].map(item => (
                <div key={item.label} style={{ display:"flex",
                  justifyContent:"space-between", alignItems:"center",
                  padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:10, height:10, borderRadius:"50%",
                      background:item.color }}/>
                    <span style={{ fontSize:13, color:T.textMid,
                      fontWeight:600 }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize:14, fontWeight:900,
                    color:item.color }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Full analytics CTA */}
            <button onClick={onViewAnalytics} style={{
              width:"100%", padding:"14px 0", borderRadius:18,
              background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
              border:"none", color:"#fff", fontSize:14, fontWeight:900,
              cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"center", gap:8,
              boxShadow:`0 6px 20px ${T.navy}44`,
            }}>
              <Icon name="barChart" size={17} color="#fff"/>
              {/* 🧭 NAVIGATE → Brick 5 Seller Command Center */}
              View Full Analytics
            </button>
          </div>
        )}

      </div>

      <BottomNav active="profile"/>
    </div>
  );
}

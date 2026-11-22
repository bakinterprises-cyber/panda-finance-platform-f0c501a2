import { useState } from "react";

// ============================================================
// 🧱 BRICK 4B — SELLER PROFILE EDITOR
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export SellerProfileEditor from this file
//     Props: { sellerId, currentUser, onBack, onPreview }
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

// ─── SVG Icons ─────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    arrowLeft:    <><line x1="19" y1="12" x2="5" y2="12" {...s}/><polyline points="12 19 5 12 12 5" {...s}/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    camera:       <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    edit:         <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...s}/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...s}/></>,
    mapPin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    phone:        <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    rotate:       <><polyline points="23 4 23 10 17 10" {...s}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...s}/></>,
    bell:         <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...s}/><path d="M13.73 21a2 2 0 0 1-3.46 0" {...s}/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    trash:        <><polyline points="3 6 5 6 21 6" {...s}/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" {...s}/></>,
    instagram:    <><rect x="2" y="2" width="20" height="20" rx="5" {...s}/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" {...s}/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    facebook:     <><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" {...s}/></>,
    twitter:      <><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" {...s}/></>,
    globe:        <><circle cx="12" cy="12" r="10" {...s}/><line x1="2" y1="12" x2="22" y2="12" {...s}/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" {...s}/></>,
    toggle:       <><rect x="1" y="5" width="22" height="14" rx="7" ry="7" {...s}/><circle cx="16" cy="12" r="3" fill={color} stroke="none"/></>,
    toggleOff:    <><rect x="1" y="5" width="22" height="14" rx="7" ry="7" {...s}/><circle cx="8" cy="12" r="3" fill={color} stroke="none"/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronUp:    <><polyline points="18 15 12 9 6 15" {...s}/></>,
    info:         <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — SELLER PROFILE DATA
// Replace with: supabase.from('sellers')
//   .select('*,seller_policies(*),seller_socials(*),business_hours(*)')
//   .eq('owner_id', currentUser.id).single()
// ============================================================
const MOCK_SELLER = {
  id:           "SEL-001",
  name:         "Tech Master Store",
  initials:     "TM",
  color:        "#1D4ED8",
  bio:          "Authentic electronics at the best prices in Tanzania. 100% genuine products with full warranty. Fast delivery across Dar es Salaam.",
  category:     "Electronics",
  location:     "Kariakoo, Dar es Salaam",
  phone:        "+255 712 345 678",
  whatsapp:     "+255 712 345 678",
  trustScore:   98,
  verified:     true,
  socials: {
    instagram:  "@techmastertz",
    facebook:   "TechMasterStoreTZ",
    twitter:    "",
    website:    "www.techmaster.co.tz",
  },
  hours: {
    monFri:     { open:"08:00", close:"19:00", closed:false },
    sat:        { open:"09:00", close:"17:00", closed:false },
    sun:        { open:"",      close:"",      closed:true  },
  },
  policies: {
    returns:    "7-day return policy on unopened items. Electronics must include original packaging and accessories.",
    shipping:   "Free delivery within Dar es Salaam for orders above TSh 100,000. Nationwide delivery available via Panda Logistics.",
    warranty:   "All products come with manufacturer warranty. Extended warranty available for purchase.",
  },
  notifications: {
    newOrders:      true,
    messages:        true,
    reviews:         true,
    promotions:      false,
    weeklyDigest:    true,
  },
};

const CATEGORIES = [
  "Electronics","Fashion","Home & Living","Beauty","Food & Beverage",
  "Automotive","Sports & Outdoors","Books & Media","Agriculture","Other",
];

// ============================================================
// 🧱 MAIN COMPONENT — SellerProfileEditor
// ============================================================
export default function App({
  // 👤 AUTH — replace with real seller from supabase.auth.getUser()
  seller       = MOCK_SELLER,

  // 🧭 NAVIGATE
  onBack       = () => {},   // → Brick 5 Command Center
  onPreview    = () => {},   // → Brick 4 SellerProfile (preview as buyer sees it)
}) {
  const [activeSection, setActiveSection] = useState("basic");
  const [form,          setForm]          = useState({
    name:     seller.name,
    bio:      seller.bio,
    category: seller.category,
    location: seller.location,
    phone:    seller.phone,
    whatsapp: seller.whatsapp,
  });
  const [socials,       setSocials]       = useState(seller.socials);
  const [hours,         setHours]         = useState(seller.hours);
  const [policies,      setPolicies]      = useState(seller.policies);
  const [notifications, setNotifications] = useState(seller.notifications);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [hasChanges,    setHasChanges]    = useState(false);
  const [toast,         setToast]         = useState(null);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  const updateForm = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    setHasChanges(true);
  };

  const updateSocial = (key, value) => {
    setSocials(s => ({ ...s, [key]: value }));
    setHasChanges(true);
  };

  const updateHours = (day, key, value) => {
    setHours(h => ({ ...h, [day]: { ...h[day], [key]: value } }));
    setHasChanges(true);
  };

  const updatePolicy = (key, value) => {
    setPolicies(p => ({ ...p, [key]: value }));
    setHasChanges(true);
  };

  const toggleNotification = (key) => {
    setNotifications(n => ({ ...n, [key]: !n[key] }));
    setHasChanges(true);
  };

  const saveChanges = () => {
    // 🔌 BACKEND — supabase.from('sellers').update({
    //   name: form.name, bio: form.bio, category: form.category,
    //   location: form.location, phone: form.phone, whatsapp: form.whatsapp,
    // }).eq('id', seller.id)
    //
    // supabase.from('seller_socials').upsert({ seller_id: seller.id, ...socials })
    // supabase.from('business_hours').upsert({ seller_id: seller.id, ...hours })
    // supabase.from('seller_policies').upsert({ seller_id: seller.id, ...policies })
    // supabase.from('notification_settings').upsert({ seller_id: seller.id, ...notifications })
    setHasChanges(false);
    showToast("Profile updated successfully!", T.green);
  };

  const SECTIONS = [
    { id:"basic",   label:"Basic Info",   icon:"edit"  },
    { id:"hours",   label:"Hours",        icon:"clock" },
    { id:"socials", label:"Socials",      icon:"globe" },
    { id:"policies",label:"Policies",     icon:"shield"},
    { id:"alerts",  label:"Notifications",icon:"bell"  },
  ];

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input,textarea,select { font-family:inherit; }
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

      {/* ── CATEGORY PICKER MODAL ── */}
      {showCategoryPicker && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setShowCategoryPicker(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.white, borderRadius:"28px 28px 0 0",
            padding:"24px 20px 36px", width:"100%", maxWidth:430,
            animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <div style={{ width:40, height:4, borderRadius:99,
              background:T.border, margin:"0 auto 20px" }}/>
            <div style={{ fontSize:16, fontWeight:900, marginBottom:14 }}>
              Select Category
            </div>
            {CATEGORIES.map(cat => (
              <div key={cat} onClick={() => {
                updateForm("category", cat);
                setShowCategoryPicker(false);
              }} style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", padding:"13px 16px", borderRadius:14,
                marginBottom:6, cursor:"pointer",
                background:form.category===cat ? T.navyLight : "transparent" }}>
                <span style={{ fontSize:13, fontWeight:form.category===cat?800:600,
                  color:form.category===cat ? T.navy : T.textMid }}>{cat}</span>
                {form.category===cat && <Icon name="check" size={16} color={T.navy}/>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TOP BAR ── */}
      <div style={{
        background:"rgba(255,255,255,0.96)", backdropFilter:"blur(16px)",
        padding:"14px 20px", position:"sticky", top:0, zIndex:100,
        borderBottom:`1px solid ${T.border}`,
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <button onClick={onBack} style={{
          width:40, height:40, borderRadius:12, background:T.navyLight,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="arrowLeft" size={18} color={T.navy}/>
        </button>
        <div style={{ fontSize:15, fontWeight:800, color:T.textMain }}>
          Edit Store Profile
        </div>
        <button onClick={onPreview} style={{
          display:"flex", alignItems:"center", gap:5,
          padding:"8px 14px", borderRadius:10, background:T.navyLight,
          border:`1px solid ${T.border}`, fontSize:12, fontWeight:700, color:T.navy,
        }}>
          <Icon name="eye" size={14} color={T.navy}/>
          Preview
        </button>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── COVER & AVATAR ── */}
        <div style={{ position:"relative", marginBottom:50 }}>
          <div style={{ height:120, borderRadius:22,
            background:`linear-gradient(135deg,${seller.color}22,${seller.color}44)`,
            position:"relative", overflow:"hidden",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ position:"absolute", inset:0, opacity:0.06,
              backgroundImage:"radial-gradient(circle,#000 1px,transparent 1px)",
              backgroundSize:"18px 18px" }}/>
            <button onClick={() => showToast("Cover photo upload coming soon!", T.navy)} style={{
              position:"absolute", bottom:10, right:10,
              display:"flex", alignItems:"center", gap:6,
              background:"rgba(255,255,255,0.9)", borderRadius:10,
              padding:"7px 12px", border:"none",
            }}>
              <Icon name="camera" size={13} color={T.navy}/>
              <span style={{ fontSize:11, fontWeight:700, color:T.navy }}>
                Change Cover
              </span>
            </button>
          </div>
          {/* Avatar */}
          <div style={{ position:"absolute", bottom:-36, left:20 }}>
            <div style={{ position:"relative" }}>
              <div style={{ width:80, height:80, borderRadius:22,
                background:`linear-gradient(135deg,${seller.color}33,${seller.color}55)`,
                border:`4px solid ${T.bg}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:28, fontWeight:900, color:seller.color }}>
                {seller.initials}
              </div>
              <button onClick={() => showToast("Logo upload coming soon!", T.navy)} style={{
                position:"absolute", bottom:-2, right:-2,
                width:30, height:30, borderRadius:"50%",
                background:T.navy, border:`3px solid ${T.bg}`,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <Icon name="camera" size={13} color="#fff"/>
              </button>
            </div>
          </div>
        </div>

        {/* ── SECTION TABS ── */}
        <div style={{ display:"flex", gap:7, overflowX:"auto",
          marginBottom:18, paddingBottom:2 }}>
          {SECTIONS.map(sec => (
            <button key={sec.id} onClick={() => setActiveSection(sec.id)} style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"9px 15px", borderRadius:99, flexShrink:0,
              background:activeSection===sec.id ? T.navy : T.card,
              border:activeSection===sec.id ? "none" : `1px solid ${T.border}`,
              color:activeSection===sec.id ? "#fff" : T.textMid,
              fontSize:12, fontWeight:700,
              boxShadow:activeSection===sec.id ? `0 4px 12px ${T.navy}33` : T.shadow,
            }}>
              <Icon name={sec.icon} size={13}
                color={activeSection===sec.id ? "#fff" : T.textMid}/>
              {sec.label}
            </button>
          ))}
        </div>

        {/* ══ BASIC INFO ══ */}
        {activeSection === "basic" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>

              {/* Store name */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                  marginBottom:8 }}>Store Name *</div>
                <input value={form.name}
                  onChange={e => updateForm("name", e.target.value)}
                  style={{ width:"100%", background:T.navyLight,
                    border:`1.5px solid ${T.border}`, borderRadius:14,
                    padding:"12px 16px", color:T.textMain,
                    fontSize:14, fontWeight:700, outline:"none",
                    boxSizing:"border-box" }}/>
              </div>

              {/* Bio */}
              <div style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  marginBottom:8 }}>
                  <span style={{ fontSize:12, fontWeight:800,
                    color:T.textMain }}>Store Bio</span>
                  <span style={{ fontSize:11, color:T.textMute }}>
                    {form.bio.length}/200
                  </span>
                </div>
                <textarea value={form.bio} maxLength={200}
                  onChange={e => updateForm("bio", e.target.value)}
                  rows={4}
                  style={{ width:"100%", background:T.navyLight,
                    border:`1.5px solid ${T.border}`, borderRadius:14,
                    padding:"12px 16px", color:T.textMain,
                    fontSize:13, outline:"none", resize:"none",
                    lineHeight:1.6, boxSizing:"border-box" }}/>
              </div>

              {/* Category */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                  marginBottom:8 }}>Category</div>
                <button onClick={() => setShowCategoryPicker(true)} style={{
                  width:"100%", background:T.navyLight,
                  border:`1.5px solid ${T.border}`, borderRadius:14,
                  padding:"12px 16px", display:"flex",
                  justifyContent:"space-between", alignItems:"center",
                }}>
                  <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>
                    {form.category}
                  </span>
                  <Icon name="chevronDown" size={16} color={T.textMute}/>
                </button>
              </div>

              {/* Location */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                  marginBottom:8 }}>Store Location</div>
                <div style={{ display:"flex", alignItems:"center", gap:10,
                  background:T.navyLight, border:`1.5px solid ${T.border}`,
                  borderRadius:14, padding:"12px 16px" }}>
                  <Icon name="mapPin" size={16} color={T.textMute}/>
                  <input value={form.location}
                    onChange={e => updateForm("location", e.target.value)}
                    style={{ flex:1, background:"transparent", border:"none",
                      outline:"none", fontSize:13, fontWeight:700,
                      color:T.textMain }}/>
                </div>
              </div>

              {/* Phone */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                  marginBottom:8 }}>Business Phone</div>
                <div style={{ display:"flex", alignItems:"center", gap:10,
                  background:T.navyLight, border:`1.5px solid ${T.border}`,
                  borderRadius:14, padding:"12px 16px" }}>
                  <Icon name="phone" size={16} color={T.textMute}/>
                  <input value={form.phone}
                    onChange={e => updateForm("phone", e.target.value)}
                    style={{ flex:1, background:"transparent", border:"none",
                      outline:"none", fontSize:13, fontWeight:700,
                      color:T.textMain }}/>
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                  marginBottom:8 }}>WhatsApp Number</div>
                <div style={{ display:"flex", alignItems:"center", gap:10,
                  background:T.navyLight, border:`1.5px solid ${T.border}`,
                  borderRadius:14, padding:"12px 16px" }}>
                  <Icon name="phone" size={16} color={T.green}/>
                  <input value={form.whatsapp}
                    onChange={e => updateForm("whatsapp", e.target.value)}
                    style={{ flex:1, background:"transparent", border:"none",
                      outline:"none", fontSize:13, fontWeight:700,
                      color:T.textMain }}/>
                </div>
              </div>
            </div>

            {/* Verified status (read-only) */}
            <div style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
              borderRadius:18, padding:"14px 18px",
              display:"flex", gap:12, alignItems:"center" }}>
              <Icon name="shield" size={20} color={T.green}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:800, color:T.green }}>
                  Trust Score: {seller.trustScore}/100
                </div>
                <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
                  Verification details are managed in Business Verification
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ BUSINESS HOURS ══ */}
        {activeSection === "hours" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:13, color:T.textMute, marginBottom:18,
                fontWeight:600 }}>
                Set your store hours so buyers know when you're available
              </div>
              {[
                { key:"monFri", label:"Monday – Friday" },
                { key:"sat",    label:"Saturday"        },
                { key:"sun",    label:"Sunday"           },
              ].map(day => (
                <div key={day.key} style={{ marginBottom:18,
                  paddingBottom:18,
                  borderBottom:day.key!=="sun"?`1px solid ${T.border}`:"none" }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:12 }}>
                    <span style={{ fontSize:13, fontWeight:800,
                      color:T.textMain }}>{day.label}</span>
                    <button onClick={() => updateHours(day.key,"closed",!hours[day.key].closed)}
                      style={{ display:"flex", alignItems:"center", gap:6,
                        background:"none", border:"none" }}>
                      <span style={{ fontSize:11, fontWeight:700,
                        color:hours[day.key].closed ? T.red : T.green }}>
                        {hours[day.key].closed ? "Closed" : "Open"}
                      </span>
                      <Icon name={hours[day.key].closed ? "toggleOff" : "toggle"}
                        size={28} color={hours[day.key].closed ? T.textMute : T.green}/>
                    </button>
                  </div>
                  {!hours[day.key].closed && (
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <input type="time" value={hours[day.key].open}
                        onChange={e => updateHours(day.key,"open",e.target.value)}
                        style={{ flex:1, background:T.navyLight,
                          border:`1.5px solid ${T.border}`, borderRadius:12,
                          padding:"10px 12px", color:T.textMain,
                          fontSize:13, outline:"none" }}/>
                      <span style={{ fontSize:12, color:T.textMute }}>to</span>
                      <input type="time" value={hours[day.key].close}
                        onChange={e => updateHours(day.key,"close",e.target.value)}
                        style={{ flex:1, background:T.navyLight,
                          border:`1.5px solid ${T.border}`, borderRadius:12,
                          padding:"10px 12px", color:T.textMain,
                          fontSize:13, outline:"none" }}/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ SOCIALS ══ */}
        {activeSection === "socials" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:13, color:T.textMute, marginBottom:18,
                fontWeight:600 }}>
                Link your social media to build buyer trust
              </div>
              {[
                { key:"instagram", icon:"instagram", label:"Instagram", placeholder:"@yourstore",      color:"#E1306C" },
                { key:"facebook",  icon:"facebook",  label:"Facebook",  placeholder:"Page name",        color:"#1877F2" },
                { key:"twitter",   icon:"twitter",   label:"X (Twitter)",placeholder:"@yourstore",      color:"#1DA1F2" },
                { key:"website",   icon:"globe",     label:"Website",   placeholder:"www.yourstore.com",color:T.navy   },
              ].map(item => (
                <div key={item.key} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                    marginBottom:8 }}>{item.label}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:10,
                    background:T.navyLight, border:`1.5px solid ${T.border}`,
                    borderRadius:14, padding:"12px 16px" }}>
                    <Icon name={item.icon} size={16} color={item.color}/>
                    <input value={socials[item.key]}
                      placeholder={item.placeholder}
                      onChange={e => updateSocial(item.key, e.target.value)}
                      style={{ flex:1, background:"transparent", border:"none",
                        outline:"none", fontSize:13, fontWeight:600,
                        color:T.textMain }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ POLICIES ══ */}
        {activeSection === "policies" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:13, color:T.textMute, marginBottom:18,
                fontWeight:600 }}>
                Clear policies build buyer confidence and reduce disputes
              </div>
              {[
                { key:"returns",  icon:"rotate", label:"Return Policy",   color:T.amber },
                { key:"shipping", icon:"truck",  label:"Shipping Policy", color:T.blue  },
                { key:"warranty", icon:"shield", label:"Warranty Policy", color:T.green },
              ].map(item => (
                <div key={item.key} style={{ marginBottom:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8,
                    marginBottom:8 }}>
                    <Icon name={item.icon} size={14} color={item.color}/>
                    <span style={{ fontSize:12, fontWeight:800,
                      color:T.textMain }}>{item.label}</span>
                  </div>
                  <textarea value={policies[item.key]} rows={3}
                    onChange={e => updatePolicy(item.key, e.target.value)}
                    style={{ width:"100%", background:T.navyLight,
                      border:`1.5px solid ${T.border}`, borderRadius:14,
                      padding:"12px 16px", color:T.textMain,
                      fontSize:12, outline:"none", resize:"none",
                      lineHeight:1.6, boxSizing:"border-box" }}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ NOTIFICATIONS ══ */}
        {activeSection === "alerts" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ background:T.card, borderRadius:22, padding:"20px",
              boxShadow:T.shadow, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:13, color:T.textMute, marginBottom:18,
                fontWeight:600 }}>
                Choose what you want to be notified about
              </div>
              {[
                { key:"newOrders",   label:"New Orders",        desc:"Get notified instantly when you receive an order",   icon:"bell" },
                { key:"messages",    label:"Buyer Messages",    desc:"Alerts for new chat messages from buyers",            icon:"bell" },
                { key:"reviews",     label:"New Reviews",       desc:"Know when buyers leave a review on your store",       icon:"bell" },
                { key:"promotions",  label:"Panda Promotions",  desc:"Updates about Panda marketplace campaigns",           icon:"bell" },
                { key:"weeklyDigest",label:"Weekly Summary",    desc:"A weekly report of your store performance",           icon:"bell" },
              ].map((item,i) => (
                <div key={item.key} style={{ display:"flex", gap:14,
                  alignItems:"center", padding:"14px 0",
                  borderBottom:i<4?`1px solid ${T.border}`:"none" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:800,
                      color:T.textMain, marginBottom:3 }}>{item.label}</div>
                    <div style={{ fontSize:11, color:T.textMute,
                      lineHeight:1.5 }}>{item.desc}</div>
                  </div>
                  <button onClick={() => toggleNotification(item.key)} style={{
                    background:"none", border:"none", flexShrink:0,
                  }}>
                    <Icon name={notifications[item.key] ? "toggle" : "toggleOff"}
                      size={32}
                      color={notifications[item.key] ? T.green : T.textMute}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── STICKY SAVE BAR ── */}
      {hasChanges && (
        <div style={{
          position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:430,
          background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)",
          borderTop:`1px solid ${T.border}`,
          padding:"14px 20px 28px",
          boxShadow:"0 -4px 24px rgba(11,31,75,0.1)", zIndex:150,
          animation:"fadeUp 0.25s ease",
        }}>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => { setHasChanges(false); showToast("Changes discarded", T.amber); }}
              style={{ flex:1, padding:"14px 0", borderRadius:16,
                background:T.navyLight, border:`1px solid ${T.border}`,
                fontSize:13, fontWeight:800, color:T.textMid }}>
              Discard
            </button>
            <button onClick={saveChanges} style={{
              flex:2, padding:"14px 0", borderRadius:16,
              background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
              border:"none", color:"#fff", fontSize:14, fontWeight:900,
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow:`0 6px 20px ${T.navy}44`,
            }}>
              <Icon name="check" size={17} color="#fff"/>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
